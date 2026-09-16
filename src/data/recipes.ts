import { Recipe } from '../types';

export const SAMPLE_RECIPE: Recipe = {
  id: 'chickpea-onion-bowl-01',
  title: 'Creamy Chickpea & Onion Bowls',
  subtitle: 'Simple ingredients. Big flavors.',
  description:
    'A quick, hearty, and flavorful bowl made with caramelized onions, crispy chickpeas, and a tangy yogurt sauce. Perfect for lunch or a light dinner.',
  prepTimeMinutes: 10,
  cookTimeMinutes: 15,
  totalTimeMinutes: 25,
  servings: 2,
  difficulty: 'easy',
  dietaryTags: ['Vegetarian', 'Quick (< 30 min)', 'High Protein'],
  ingredients: [
    {
      id: 'ing-1',
      name: 'Onion',
      amount: '1 medium',
      emoji: '🧅',
      isProvidedIngredient: true,
      isPantryStaple: false,
    },
    {
      id: 'ing-2',
      name: 'Greek yogurt',
      amount: '1 cup',
      emoji: '🥣',
      isProvidedIngredient: true,
      isPantryStaple: false,
    },
    {
      id: 'ing-3',
      name: 'Chickpeas',
      amount: '1 can (15 oz)',
      emoji: '🧆',
      isProvidedIngredient: true,
      isPantryStaple: false,
    },
    {
      id: 'ing-4',
      name: 'Olive oil',
      amount: '2 tbsp',
      emoji: '🫒',
      isProvidedIngredient: false,
      isPantryStaple: true,
    },
    {
      id: 'ing-5',
      name: 'Salt & black pepper',
      amount: 'to taste',
      emoji: '🧂',
      isProvidedIngredient: false,
      isPantryStaple: true,
    },
    {
      id: 'ing-6',
      name: 'Dried cumin or smoked paprika',
      amount: '1/2 tsp',
      emoji: '🌿',
      isProvidedIngredient: false,
      isPantryStaple: true,
    },
  ],
  instructions: [
    {
      title: 'Caramelize the onions',
      instruction:
        'Slice the onion and cook in olive oil on medium heat for 8-10 minutes until golden and soft.',
    },
    {
      title: 'Crisp the chickpeas',
      instruction:
        'Add chickpeas to the pan and cook for 5-7 minutes with salt, pepper and your favorite spices.',
    },
    {
      title: 'Make the yogurt sauce',
      instruction:
        'In a small bowl, mix Greek yogurt with a pinch of salt, lemon juice (if you have it), and herbs.',
    },
    {
      title: 'Combine & serve',
      instruction:
        'Add chickpeas and onions to a bowl, top with yogurt sauce, and enjoy!',
    },
  ],
  chefTip:
    'Let the chickpeas sit in the warm pan for 2 minutes after turning off the heat — the residual heat locks in an irresistible crunch without burning the spices!',
  wasteSavedNote:
    'Kept 1 can of chickpeas and a fresh onion from sitting forgotten in the back of the pantry!',
  substitutions: [
    {
      original: 'Greek yogurt',
      substitute: 'Sour cream, labneh, coconut yogurt, or tahini drizzle',
    },
    {
      original: 'Chickpeas',
      substitute: 'White cannellini beans, black beans, or lentils',
    },
  ],
  providedIngredientsMatched: ['Onion', 'Greek yogurt', 'Chickpeas'],
};

export function getSampleRecipe(ingredients?: string[]): Recipe {
  if (!ingredients || ingredients.length === 0) {
    return SAMPLE_RECIPE;
  }

  // Clone sample recipe and customize matching titles if custom ingredients supplied
  const matched = ingredients.map(
    (ing) => ing.charAt(0).toUpperCase() + ing.slice(1).toLowerCase()
  );

  return {
    ...SAMPLE_RECIPE,
    providedIngredientsMatched: matched,
  };
}
