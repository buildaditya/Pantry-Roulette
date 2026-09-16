import { Recipe, RecipeValidationResult } from '../src/types';
import { validateRecipe } from './recipeValidator';
import { generateFallbackRecipe } from './fallbackGenerator';

export interface SelectedRecipeResult {
  recipe: Recipe;
  validation: RecipeValidationResult;
  source: 'gemini' | 'algorithmic-fallback';
}

/**
 * Selects and validates the best recipe candidate among generated options.
 */
export function selectBestRecipe(
  candidates: Recipe[],
  providedIngredients: Array<{ name: string; normalized?: string }>,
  preferences: string[] = [],
  defaultSource: 'gemini' | 'algorithmic-fallback' = 'gemini'
): SelectedRecipeResult {
  const ingredientNames = providedIngredients.map((i) => i.name);

  if (!candidates || candidates.length === 0) {
    const fallback = generateFallbackRecipe(providedIngredients, preferences);
    const validation = validateRecipe(fallback, ingredientNames, preferences);
    return {
      recipe: fallback,
      validation,
      source: 'algorithmic-fallback',
    };
  }

  // Validate and score every candidate
  const evaluated = candidates.map((candidate) => {
    const validation = validateRecipe(candidate, ingredientNames, preferences);
    return {
      recipe: candidate,
      validation,
      score: validation.score,
    };
  });

  // Filter for valid candidates
  const validCandidates = evaluated.filter((item) => item.validation.isValid);

  if (validCandidates.length > 0) {
    // Sort descending by score
    validCandidates.sort((a, b) => b.score - a.score);
    const best = validCandidates[0];
    return {
      recipe: best.recipe,
      validation: best.validation,
      source: defaultSource,
    };
  }

  // If no candidate was strictly valid, pick the highest-scored candidate if score >= 55
  evaluated.sort((a, b) => b.score - a.score);
  const highestScored = evaluated[0];

  if (highestScored && highestScored.score >= 55) {
    return {
      recipe: highestScored.recipe,
      validation: highestScored.validation,
      source: defaultSource,
    };
  }

  // Otherwise, use fallback generator to guarantee flawless user experience
  const fallback = generateFallbackRecipe(providedIngredients, preferences);
  const fallbackValidation = validateRecipe(fallback, ingredientNames, preferences);
  return {
    recipe: fallback,
    validation: fallbackValidation,
    source: 'algorithmic-fallback',
  };
}
