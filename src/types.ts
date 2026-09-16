/**
 * Design system tokens & component types for Pantry Roulette
 */

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'dashed' | 'ghost' | 'icon';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ChipVariant = 'preference' | 'match' | 'neutral' | 'accent';

export interface IngredientItem {
  id: string;
  name: string;
  emoji?: string;
  isCustom?: boolean;
}

export interface DietaryPreference {
  id: string;
  label: string;
  icon?: string;
}

export interface RecipeIngredient {
  id?: string;
  name: string;
  amount: string;
  emoji?: string;
  isPantryStaple: boolean;
  isProvidedIngredient: boolean;
}

export interface RecipeSubstitution {
  original: string;
  substitute: string;
}

export interface Recipe {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  totalTimeMinutes: number;
  servings: number;
  difficulty: 'easy' | 'medium';
  dietaryTags: string[];
  ingredients: RecipeIngredient[];
  instructions: (string | { title?: string; instruction: string })[];
  chefTip?: string;
  wasteSavedNote?: string;
  substitutions?: RecipeSubstitution[];
  providedIngredientsMatched: string[];
}

export interface RecipeValidationResult {
  isValid: boolean;
  score: number;
  issues: string[];
  coveredIngredients: string[];
  missingIngredients: string[];
}

export interface GenerateRecipeResponse {
  recipe: Recipe;
  source: 'gemini' | 'algorithmic-fallback';
  validation: RecipeValidationResult;
  processingTimeMs: number;
}
