import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import { Recipe } from '../src/types';
import { selectBestRecipe, SelectedRecipeResult } from './recipeSelector';
import { generateFallbackRecipe } from './fallbackGenerator';

const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING, description: 'Unique identifier string' },
    title: { type: Type.STRING, description: 'Appetizing, realistic culinary recipe title' },
    description: { type: Type.STRING, description: '1-2 sentence warm, encouraging description' },
    prepTimeMinutes: { type: Type.INTEGER, description: 'Prep time in minutes (typically 5-15)' },
    cookTimeMinutes: { type: Type.INTEGER, description: 'Cook time in minutes (typically 10-25)' },
    totalTimeMinutes: { type: Type.INTEGER, description: 'Total time in minutes' },
    servings: { type: Type.INTEGER, description: 'Number of servings, typically 2' },
    difficulty: { type: Type.STRING, description: 'easy or medium' },
    dietaryTags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Dietary tags e.g. Vegetarian, Quick, Dairy-Free, Gluten-Free, High-Protein',
    },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: 'Ingredient name and optional prep note' },
          amount: { type: Type.STRING, description: 'Measurement amount, e.g. 1 can, 2 tbsp, 1 medium' },
          isPantryStaple: {
            type: Type.BOOLEAN,
            description: 'True if basic cooking oil, butter, salt, black pepper, water, or common dried herb',
          },
          isProvidedIngredient: {
            type: Type.BOOLEAN,
            description: 'True if this is directly derived from one of the 2-3 user input ingredients',
          },
        },
        required: ['name', 'amount', 'isPantryStaple', 'isProvidedIngredient'],
      },
    },
    instructions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Step-by-step cooking steps. Clear, numbered, easy to follow at home',
    },
    chefTip: {
      type: Type.STRING,
      description: 'A genuine professional home-cook tip to enhance texture or flavor',
    },
    wasteSavedNote: {
      type: Type.STRING,
      description: 'A brief encouraging sentence celebrating food waste saved',
    },
    substitutions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          original: { type: Type.STRING },
          substitute: { type: Type.STRING },
        },
        required: ['original', 'substitute'],
      },
    },
    providedIngredientsMatched: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'List of user provided ingredients utilized in this dish',
    },
  },
  required: [
    'title',
    'description',
    'prepTimeMinutes',
    'cookTimeMinutes',
    'totalTimeMinutes',
    'servings',
    'difficulty',
    'dietaryTags',
    'ingredients',
    'instructions',
    'chefTip',
    'wasteSavedNote',
    'providedIngredientsMatched',
  ],
};

const candidateSchema = {
  type: Type.ARRAY,
  items: recipeSchema,
};

/**
 * Generates and validates a recipe for the provided ingredients.
 * Uses Gemini 3.8 Flash with structured JSON output and falls back to algorithmic synthesis.
 */
export async function generateRecipeWithGemini(
  ingredients: Array<{ name: string; normalized?: string }>,
  preferences: string[] = []
): Promise<SelectedRecipeResult> {
  const ingredientNames = ingredients.map((i) => i.name.trim());
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('[Pantry Roulette] No GEMINI_API_KEY present; running high-grade culinary fallback.');
    const fallback = generateFallbackRecipe(ingredients, preferences);
    return selectBestRecipe([fallback], ingredients, preferences, 'algorithmic-fallback');
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are a creative, zero-food-waste chef and the culinary intelligence engine of "Pantry Roulette".
Your mission: Transform 2 or 3 random ingredients found in an everyday home cook's fridge into a practical, delicious, and achievable meal.

MANDATORY RULES:
1. INGREDIENT STRICTNESS: You MUST actively utilize ALL of the user's provided ingredients in the recipe.
2. REASONABLE STAPLES ONLY: You may only introduce common household pantry staples (cooking oil, butter, salt, black pepper, water, garlic, basic vinegar, standard dried spices like cumin/paprika/oregano). NEVER require rare or expensive specialty items that the user did not supply.
3. REALISTIC COOKING: Instructions must be clear, standard home-cooking techniques (sautéing, simmering, roasting, boiling).
4. RESPECT PREFERENCES:
   - "quick": Total time MUST be 30 minutes or less.
   - "vegetarian": Strictly no meat, poultry, fish, seafood, or animal rennet.
   - "vegan": No animal products whatsoever (no dairy, eggs, honey, gelatin).
   - "gluten-free": Strictly no wheat pasta, standard flour, or barley (use rice, gluten-free grains, or potatoes).
5. TONE: Warm, encouraging, focused on culinary confidence and celebrating food waste reduction.`;

    const userPrompt = `User provided ingredients: ${ingredientNames.map((n) => `"${n}"`).join(', ')}.
Dietary Preferences: ${preferences.length > 0 ? preferences.join(', ') : 'None specified'}.

Create one delicious recipe utilizing all user ingredients.`;

    // Helper to call a model with an isolated per-call timeout
    const callModelWithTimeout = async (
      modelName: string,
      timeoutMs: number,
      thinking = false
    ): Promise<string> => {
      let timer: NodeJS.Timeout | undefined;
      const timeoutPromise = new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error(`${modelName} call timed out after ${timeoutMs}ms`)),
          timeoutMs
        );
      });

      try {
        const config: Record<string, unknown> = {
          systemInstruction: systemPrompt,
          temperature: 0.7,
          responseMimeType: 'application/json',
          responseSchema: recipeSchema,
        };

        if (thinking) {
          config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
        }

        const callPromise = ai.models.generateContent({
          model: modelName,
          contents: userPrompt,
          config,
        });

        const response = await Promise.race([callPromise, timeoutPromise]);
        if (!response.text) {
          throw new Error(`Empty response text from ${modelName}`);
        }
        return response.text;
      } finally {
        if (timer) clearTimeout(timer);
      }
    };

    let responseText: string | undefined;

    // 1. Primary fast attempt with gemini-3.1-flash-lite (fast, robust against 503 spikes)
    try {
      responseText = await callModelWithTimeout('gemini-3.1-flash-lite', 7000, false);
    } catch (primaryErr: unknown) {
      console.warn('[Pantry Roulette] gemini-3.1-flash-lite failed, attempting gemini-3.8-flash:', primaryErr);
      // 2. Secondary attempt with gemini-3.8-flash
      try {
        responseText = await callModelWithTimeout('gemini-3.8-flash', 8000, true);
      } catch (secondaryErr: unknown) {
        console.warn('[Pantry Roulette] gemini-3.8-flash failed, attempting gemini-flash-latest:', secondaryErr);
        // 3. Third attempt with gemini-flash-latest
        responseText = await callModelWithTimeout('gemini-flash-latest', 7000, false);
      }
    }

    if (!responseText) {
      throw new Error('Empty text returned from Gemini model');
    }

    const recipe = JSON.parse(responseText) as Recipe;
    if (!recipe.id) {
      recipe.id = `rcp-ai-${Date.now()}`;
    }

    // Run through recipe selector & validator
    const selection = selectBestRecipe([recipe], ingredients, preferences, 'gemini');
    return selection;
  } catch (err: unknown) {
    console.error('[Pantry Roulette] Gemini generation failed or timed out; activating fallback:', err);
    // Graceful fallback guarantees no UI break
    const fallback = generateFallbackRecipe(ingredients, preferences);
    return selectBestRecipe([fallback], ingredients, preferences, 'algorithmic-fallback');
  }
}
