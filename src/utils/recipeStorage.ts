import { Recipe } from '../types';

const STORAGE_KEY = 'pantry_roulette_saved_recipes';

export interface SavedRecipeEntry {
  recipe: Recipe;
  savedAt: string;
}

export function getSavedRecipes(): SavedRecipeEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load saved recipes:', e);
    return [];
  }
}

export function isRecipeSaved(recipeId: string): boolean {
  const saved = getSavedRecipes();
  return saved.some((item) => item.recipe.id === recipeId);
}

export function saveRecipe(recipe: Recipe): void {
  try {
    const saved = getSavedRecipes();
    if (!saved.some((item) => item.recipe.id === recipe.id)) {
      const updated = [{ recipe, savedAt: new Date().toISOString() }, ...saved];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  } catch (e) {
    console.error('Failed to save recipe:', e);
  }
}

export function removeSavedRecipe(recipeId: string): void {
  try {
    const saved = getSavedRecipes();
    const updated = saved.filter((item) => item.recipe.id !== recipeId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to remove saved recipe:', e);
  }
}

export interface ZeroWasteImpact {
  totalRecipesSaved: number;
  totalIngredientsRescued: number;
  estimatedFoodKgSaved: number;
  co2SavedKg: number;
}

export function calculateZeroWasteImpact(): ZeroWasteImpact {
  const saved = getSavedRecipes();
  const totalRecipesSaved = saved.length;
  let totalIngredientsRescued = 0;

  for (const item of saved) {
    const matchedCount = item.recipe.providedIngredientsMatched?.length || 2;
    totalIngredientsRescued += matchedCount;
  }

  const estimatedFoodKgSaved = Math.round(totalIngredientsRescued * 0.25 * 10) / 10;
  const co2SavedKg = Math.round(estimatedFoodKgSaved * 2.5 * 10) / 10;

  return {
    totalRecipesSaved,
    totalIngredientsRescued,
    estimatedFoodKgSaved,
    co2SavedKg,
  };
}
