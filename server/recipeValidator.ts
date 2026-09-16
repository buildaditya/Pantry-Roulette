import { Recipe, RecipeValidationResult } from '../src/types';

const MEAT_KEYWORDS = [
  'chicken', 'beef', 'pork', 'bacon', 'ham', 'turkey', 'lamb', 'steak',
  'sausage', 'prosciutto', 'veal', 'duck', 'tuna', 'salmon', 'shrimp',
  'prawn', 'fish', 'anchovy', 'anchovies', 'crab', 'lobster', 'clam',
  'scallop', 'squid', 'calamari', 'oyster', 'meat', 'poultry', 'seafood',
];

const DAIRY_EGG_KEYWORDS = [
  'milk', 'cream', 'butter', 'cheese', 'yogurt', 'yoghurt', 'egg', 'eggs',
  'parmesan', 'cheddar', 'mozzarella', 'feta', 'ricotta', 'mayo', 'mayonnaise',
  'ghee', 'sour cream', 'curd',
];

const GLUTEN_KEYWORDS = [
  'wheat', 'flour', 'bread', 'pasta', 'spaghetti', 'penne', 'couscous',
  'barley', 'rye', 'breadcrumbs', 'soy sauce',
];

/**
 * Validates a generated Recipe against user provided ingredients and constraints.
 */
export function validateRecipe(
  recipe: Partial<Recipe>,
  providedIngredients: string[],
  preferences: string[] = []
): RecipeValidationResult {
  const issues: string[] = [];
  const coveredIngredients: string[] = [];
  const missingIngredients: string[] = [];
  let score = 100;

  // 1. Basic required structure checks
  if (!recipe.title || recipe.title.trim().length < 3) {
    issues.push('Missing or too short recipe title.');
    score -= 20;
  }

  if (!recipe.description || recipe.description.trim().length < 10) {
    issues.push('Missing or too short recipe description.');
    score -= 10;
  }

  const prepTime = Number(recipe.prepTimeMinutes) || 0;
  const cookTime = Number(recipe.cookTimeMinutes) || 0;
  const totalTime = Number(recipe.totalTimeMinutes) || (prepTime + cookTime);

  if (totalTime <= 0) {
    issues.push('Total time must be greater than 0 minutes.');
    score -= 10;
  }

  if (!Array.isArray(recipe.instructions) || recipe.instructions.length < 2) {
    issues.push('Recipe must have at least 2 clear instruction steps.');
    score -= 25;
  }

  if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
    issues.push('Recipe has no ingredients listed.');
    score -= 40;
    return {
      isValid: false,
      score: 0,
      issues,
      coveredIngredients,
      missingIngredients: [...providedIngredients],
    };
  }

  // 2. Ingredient Coverage Check (Crucial constraint: All user ingredients must be used)
  const recipeIngredientNames = recipe.ingredients.map((ing) => ing.name.toLowerCase());
  const recipeFullText = [
    ...recipeIngredientNames,
    recipe.title || '',
    recipe.description || '',
    ...(recipe.instructions || []),
  ].join(' ').toLowerCase();

  for (const provided of providedIngredients) {
    const term = provided.toLowerCase().trim();
    // Split into words to allow token matches like "garbanzo" in "garbanzo beans"
    const words = term.split(/\s+/).filter((w) => w.length > 2);

    const isDirectMatch = recipeIngredientNames.some(
      (ing) => ing.includes(term) || term.includes(ing)
    );

    const isTokenMatch = words.some((w) => recipeFullText.includes(w));

    if (isDirectMatch || isTokenMatch) {
      coveredIngredients.push(provided);
    } else {
      missingIngredients.push(provided);
      issues.push(`Provided ingredient "${provided}" was not used in the recipe.`);
      score -= 30;
    }
  }

  // 3. Dietary Preferences Verification
  const isVegetarianReq = preferences.includes('vegetarian');
  const isVeganReq = preferences.includes('vegan');
  const isGlutenFreeReq = preferences.includes('gluten-free');
  const isQuickReq = preferences.includes('quick');

  const lowerRecipeIngredients = recipeIngredientNames.join(' ');

  if (isVegetarianReq || isVeganReq) {
    for (const meat of MEAT_KEYWORDS) {
      // Check if meat keyword is in ingredients but wasn't explicitly requested by user
      const requestedMeat = providedIngredients.some((p) => p.toLowerCase().includes(meat));
      if (!requestedMeat && new RegExp(`\\b${meat}\\b`, 'i').test(lowerRecipeIngredients)) {
        issues.push(`Vegetarian violation: contains "${meat}".`);
        score -= 40;
      }
    }
  }

  if (isVeganReq) {
    for (const dairy of DAIRY_EGG_KEYWORDS) {
      const requestedDairy = providedIngredients.some((p) => p.toLowerCase().includes(dairy));
      if (!requestedDairy && new RegExp(`\\b${dairy}\\b`, 'i').test(lowerRecipeIngredients)) {
        issues.push(`Vegan violation: contains "${dairy}".`);
        score -= 40;
      }
    }
  }

  if (isGlutenFreeReq) {
    for (const gluten of GLUTEN_KEYWORDS) {
      const requestedGluten = providedIngredients.some((p) => p.toLowerCase().includes(gluten));
      if (!requestedGluten && new RegExp(`\\b${gluten}\\b`, 'i').test(lowerRecipeIngredients)) {
        issues.push(`Gluten-free violation: contains "${gluten}".`);
        score -= 30;
      }
    }
  }

  if (isQuickReq && totalTime > 35) {
    issues.push(`Quick preference violation: total time is ${totalTime}m (expected <= 30m).`);
    score -= 15;
  }

  // 4. Staple sanity ratio
  const pantryStapleCount = recipe.ingredients.filter((i) => i.isPantryStaple).length;
  const providedCount = recipe.ingredients.filter((i) => i.isProvidedIngredient).length;

  if (pantryStapleCount > 9) {
    issues.push('Recipe asks for too many pantry staples (> 9).');
    score -= 10;
  }

  if (providedCount === 0) {
    issues.push('None of the ingredients were flagged as provided ingredients.');
    score -= 10;
  }

  score = Math.max(0, Math.min(100, score));
  const isValid = missingIngredients.length === 0 && issues.length <= 1 && score >= 60;

  return {
    isValid,
    score,
    issues,
    coveredIngredients,
    missingIngredients,
  };
}
