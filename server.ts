import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { normalizeIngredient, NormalizedIngredient } from './server/normalizer';
import { generateRecipeWithGemini } from './server/geminiProvider';

dotenv.config();

const app = express();
const PORT = 3000;

// Body parsing with size limit
app.use(express.json({ limit: '1mb' }));

// Request timeout middleware (25 seconds default timeout guard)
const requestTimeout = (seconds: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    res.setTimeout(seconds * 1000, () => {
      if (!res.headersSent) {
        res.status(504).json({
          error: 'Request timed out',
          code: 'TIMEOUT',
          message: `The server took longer than ${seconds}s to respond.`,
        });
      }
    });
    next();
  };
};

app.use(requestTimeout(25));

// --- API ROUTES FIRST ---

/**
 * Health & Configuration Check
 * Confirms server status and server-side secret availability without exposing keys.
 */
app.get('/api/health', (req: Request, res: Response) => {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);

  res.json({
    status: 'ok',
    app: 'Pantry Roulette API',
    version: '1.0.0',
    secrets: {
      geminiKeyConfigured: hasGeminiKey,
    },
    timestamp: new Date().toISOString(),
  });
});

/**
 * Recipe Generation Endpoint (Prompt 5 Implementation)
 * - Server-side validation of 2-3 ingredients
 * - Normalizes synonyms and strips prep units
 * - Calls Gemini 3.8 Flash with structured schema
 * - Recipe validation (ingredient coverage, required fields, dietary tags)
 * - Candidate selector with high-grade culinary fallback
 */
app.post('/api/recipes/generate', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const { ingredients, preferences } = req.body;

  // 1. Validate ingredients container
  if (!ingredients || !Array.isArray(ingredients)) {
    return res.status(400).json({
      error: 'Invalid payload: "ingredients" must be an array of ingredient names.',
      code: 'INVALID_PAYLOAD',
    });
  }

  // 2. Validate ingredient count (Strict 2 to 3 constraint)
  if (ingredients.length < 2 || ingredients.length > 3) {
    return res.status(400).json({
      error: `Pantry Roulette requires exactly 2 or 3 ingredients. Received: ${ingredients.length}.`,
      code: 'INVALID_INGREDIENT_COUNT',
      expected: '2-3 ingredients',
      received: ingredients.length,
    });
  }

  // 3. Normalize ingredients and validate each item
  const normalizedList: NormalizedIngredient[] = [];
  const seenNormalizedNames = new Set<string>();

  for (let i = 0; i < ingredients.length; i++) {
    const raw = ingredients[i];
    const nameStr = typeof raw === 'string' ? raw : (raw && raw.name ? String(raw.name) : '');

    if (!nameStr || nameStr.trim().length < 2) {
      return res.status(400).json({
        error: `Ingredient at index ${i} is too short or empty.`,
        code: 'INVALID_INGREDIENT_STRING',
      });
    }

    if (nameStr.length > 60) {
      return res.status(400).json({
        error: `Ingredient at index ${i} exceeds maximum length of 60 characters.`,
        code: 'INGREDIENT_TOO_LONG',
      });
    }

    const normalized = normalizeIngredient(nameStr);

    if (seenNormalizedNames.has(normalized.normalized.toLowerCase())) {
      return res.status(400).json({
        error: `Duplicate ingredient detected: "${nameStr}" maps to "${normalized.normalized}" which is already included.`,
        code: 'DUPLICATE_INGREDIENT',
        duplicate: normalized.normalized,
      });
    }

    seenNormalizedNames.add(normalized.normalized.toLowerCase());
    normalizedList.push(normalized);
  }

  // 4. Validate optional preferences
  const allowedPreferences = ['quick', 'vegetarian', 'vegan', 'gluten-free', 'any'];
  const sanitizedPreferences: string[] = [];

  if (preferences && Array.isArray(preferences)) {
    for (const pref of preferences) {
      if (typeof pref === 'string' && allowedPreferences.includes(pref.toLowerCase())) {
        sanitizedPreferences.push(pref.toLowerCase());
      }
    }
  }

  try {
    // 5. Generate & validate recipe
    const ingredientInput = normalizedList.map((item) => ({
      name: item.original,
      normalized: item.normalized,
    }));

    const result = await generateRecipeWithGemini(ingredientInput, sanitizedPreferences);
    const processingTimeMs = Date.now() - startTime;

    return res.json({
      success: true,
      recipe: result.recipe,
      source: result.source,
      validation: result.validation,
      processingTimeMs,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error('[Pantry Roulette] Unexpected error generating recipe:', error);
    return res.status(500).json({
      error: 'Failed to generate recipe. Please try again.',
      code: 'GENERATION_FAILED',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// --- VITE MIDDLEWARE SETUP ---

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Pantry Roulette] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
