import { Recipe } from '../src/types';

/**
 * High-quality culinary fallback recipe generator.
 * Produces chef-approved home-cooking recipes tailored to user ingredients and dietary preferences.
 */
export function generateFallbackRecipe(
  ingredients: Array<{ name: string; normalized?: string }>,
  preferences: string[] = []
): Recipe {
  const names = ingredients.map((i) => i.name.trim());
  const normalizedNames = ingredients.map((i) => (i.normalized || i.name).toLowerCase().trim());

  const has = (keyword: string) =>
    normalizedNames.some((n) => n.includes(keyword)) ||
    names.some((n) => n.toLowerCase().includes(keyword));

  const isQuick = preferences.includes('quick');
  const isVegan = preferences.includes('vegan');
  const isVegetarian = preferences.includes('vegetarian') || isVegan;
  const isGlutenFree = preferences.includes('gluten-free');

  const fatSource = isVegan ? '2 tbsp olive oil' : '1 tbsp butter and 1 tbsp olive oil';

  // Recipe Pattern 1: Chickpeas + Allium + Yogurt (The signature showcase recipe!)
  if (has('chickpea') && (has('onion') || has('shallot')) && has('yogurt')) {
    const cookTime = isQuick ? 12 : 18;
    return {
      id: `rcp-fallback-${Date.now()}`,
      title: 'Spiced Crispy Chickpeas with Garlicky Greek Yogurt & Sizzled Onions',
      description:
        'A comforting Mediterranean-inspired skillet dish featuring warm cumin-toasted chickpeas served over a cool, luscious yogurt bed with sweet caramelized onions.',
      prepTimeMinutes: 5,
      cookTimeMinutes: cookTime,
      totalTimeMinutes: 5 + cookTime,
      servings: 2,
      difficulty: 'easy',
      dietaryTags: ['Vegetarian', 'High-protein', ...(isGlutenFree ? ['Gluten-free'] : [])],
      ingredients: [
        { name: 'Chickpeas (rinsed and dried thoroughly)', amount: '1 can (15 oz)', isPantryStaple: false, isProvidedIngredient: true },
        { name: 'Onion (thinly sliced into half-moons)', amount: '1 medium', isPantryStaple: false, isProvidedIngredient: true },
        { name: 'Greek yogurt (full-fat or 2%)', amount: '1 cup', isPantryStaple: false, isProvidedIngredient: true },
        { name: 'Olive oil', amount: '2 tbsp', isPantryStaple: true, isProvidedIngredient: false },
        { name: 'Ground cumin or smoked paprika', amount: '1 tsp', isPantryStaple: true, isProvidedIngredient: false },
        { name: 'Garlic powder or 1 minced clove', amount: '1/2 tsp', isPantryStaple: true, isProvidedIngredient: false },
        { name: 'Salt and black pepper', amount: 'To taste', isPantryStaple: true, isProvidedIngredient: false },
      ],
      instructions: [
        'Season the Greek yogurt in a bowl with a pinch of salt, garlic powder, and 1 teaspoon of olive oil. Spread evenly across the base of two wide serving bowls.',
        'Heat remaining olive oil in a wide skillet over medium-high heat. Add sliced onions and cook for 5–7 minutes until lightly golden and caramelized around the edges.',
        'Stir in the drained chickpeas, ground cumin, a generous pinch of salt, and cracked pepper. Fry undisturbed for 3–4 minutes until the chickpeas pop and become lightly blistered.',
        'Spoon the sizzling spiced chickpeas and onion ribbons directly over the cold yogurt base. Drizzle pan juices on top and serve immediately with toasted bread or a spoon.',
      ],
      chefTip:
        'Drying your canned chickpeas thoroughly on a kitchen towel before frying is the secret to getting crispy, blistered skins instead of soggy beans.',
      wasteSavedNote: 'Transformed your remaining open yogurt tub and half onion into a restaurant-worthy warm-and-cold skillet!',
      substitutions: [
        { original: 'Greek yogurt', substitute: 'Sour cream, labneh, or coconut yogurt for dairy-free' },
        { original: 'Ground cumin', substitute: 'Curry powder, za’atar, or chili flakes' },
      ],
      providedIngredientsMatched: names,
    };
  }

  // Recipe Pattern 2: Tomato + Onion + Eggs / Chickpeas / Pasta
  if (has('tomato') && has('onion')) {
    const isEgg = has('egg');
    const title = isEgg
      ? 'Rustic Skillet Shakshuka with Jammy Eggs & Sautéed Onions'
      : 'Sun-Dried & Simmered Tomato Allium Sauce over Staples';

    return {
      id: `rcp-fallback-${Date.now()}`,
      title,
      description:
        'A fragrant, bubbling one-pan wonder coaxing natural sweetness from caramelized onions and juicy stewed tomatoes.',
      prepTimeMinutes: 7,
      cookTimeMinutes: isQuick ? 15 : 20,
      totalTimeMinutes: isQuick ? 22 : 27,
      servings: 2,
      difficulty: 'easy',
      dietaryTags: ['Vegetarian', ...(isGlutenFree ? ['Gluten-free'] : []), 'One-pan'],
      ingredients: [
        { name: 'Tomatoes (diced or crushed)', amount: '2 large or 1 can', isPantryStaple: false, isProvidedIngredient: true },
        { name: 'Onion (finely chopped)', amount: '1 medium', isPantryStaple: false, isProvidedIngredient: true },
        ...(isEgg ? [{ name: 'Eggs', amount: '2–3 large', isPantryStaple: false, isProvidedIngredient: true }] : []),
        ...ingredients
          .filter((i) => !['tomato', 'onion', 'egg'].some((k) => (i.normalized || i.name).toLowerCase().includes(k)))
          .map((i) => ({ name: i.name, amount: '1 cup', isPantryStaple: false, isProvidedIngredient: true })),
        { name: 'Olive oil or cooking fat', amount: '2 tbsp', isPantryStaple: true, isProvidedIngredient: false },
        { name: 'Salt, black pepper, & dried oregano', amount: 'To taste', isPantryStaple: true, isProvidedIngredient: false },
      ],
      instructions: [
        'Warm oil in a medium saucepan or cast-iron skillet over medium heat. Add diced onions and cook gently for 5 minutes until soft and translucent.',
        'Add the diced tomatoes along with salt, black pepper, and dried herbs. Simmer uncovered on medium-low for 10 minutes until the sauce thickens and aromas meld.',
        isEgg
          ? 'Make 2 to 3 small wells in the bubbling sauce with a spoon. Crack an egg into each well. Cover with a lid and simmer for 4–5 minutes until egg whites are set and yolks remain runny.'
          : 'Fold in your remaining ingredients and simmer for an additional 4 minutes until thoroughly warmed through and well coated.',
        'Remove from heat. Season with a crack of black pepper and serve warm straight from the pan.',
      ],
      chefTip:
        'A pinch of brown sugar or balsamic vinegar balances out the sharp acidity of winter tomatoes.',
      wasteSavedNote: 'Rescued soft ripe tomatoes and lonely onions from the bottom crisper drawer!',
      substitutions: [
        { original: 'Fresh tomatoes', substitute: 'Canned diced or crushed plum tomatoes' },
        { original: 'Dried oregano', substitute: 'Thyme, basil, or Italian seasoning' },
      ],
      providedIngredientsMatched: names,
    };
  }

  // Recipe Pattern 3: Pasta or Grain + Any 2 Ingredients
  if (has('pasta') || has('rice') || has('noodle')) {
    const carb = has('rice') ? 'Rice' : 'Pasta';
    return {
      id: `rcp-fallback-${Date.now()}`,
      title: `Pantry-Style Golden ${carb} Toss with ${names[0]} & ${names[1]}`,
      description: `An effortless, vibrant ${carb.toLowerCase()} toss leveraging high heat and simple pantry aromatics to spotlight your fridge ingredients.`,
      prepTimeMinutes: 5,
      cookTimeMinutes: isQuick ? 12 : 16,
      totalTimeMinutes: isQuick ? 17 : 21,
      servings: 2,
      difficulty: 'easy',
      dietaryTags: [
        ...(isVegetarian ? ['Vegetarian'] : []),
        ...(isQuick ? ['Quick (<30m)'] : []),
      ],
      ingredients: [
        ...ingredients.map((ing) => ({
          name: ing.name,
          amount: 'Portion to taste (1 to 2 cups)',
          isPantryStaple: false,
          isProvidedIngredient: true,
        })),
        { name: 'Olive oil or butter', amount: fatSource, isPantryStaple: true, isProvidedIngredient: false },
        { name: 'Salt & freshly cracked pepper', amount: 'To taste', isPantryStaple: true, isProvidedIngredient: false },
        { name: 'Red pepper flakes or dried herbs', amount: '1/2 tsp', isPantryStaple: true, isProvidedIngredient: false },
      ],
      instructions: [
        `Cook your ${carb.toLowerCase()} in well-salted boiling water according to package directions. Reserve 1/3 cup of starchy cooking liquid before draining.`,
        `While boiling, heat olive oil in a wide skillet. Sauté your prepared ${names.slice(0, 2).join(' and ')} over medium heat until tender and fragrant (about 5–7 minutes).`,
        `Toss the drained ${carb.toLowerCase()} directly into the skillet with your sautéed ingredients. Splash in a couple of tablespoons of the reserved cooking liquid to emulsify a glossy pan sauce.`,
        'Taste, adjust seasoning with salt and pepper, and finish with a drizzle of olive oil or fresh herbs.',
      ],
      chefTip:
        'Starchy cooking water is the secret weapon of Italian trattorias — it creates a silky sauce that clings to every bite without heavy cream.',
      wasteSavedNote: `Used up the last of your ${names.join(', ')} before they lost their crunch!`,
      substitutions: [
        { original: 'Olive oil', substitute: 'Butter or neutral oil' },
      ],
      providedIngredientsMatched: names,
    };
  }

  // Universal Fallback: Hearty Skillet Sauté with Crispy Aromatics
  return {
    id: `rcp-fallback-${Date.now()}`,
    title: `Homestyle Skillet Hash with ${names.join(' & ')}`,
    description: `A fast, satisfying stovetop hash combining ${names.join(' and ')} into a savory, well-seasoned warm meal.`,
    prepTimeMinutes: 6,
    cookTimeMinutes: isQuick ? 14 : 18,
    totalTimeMinutes: isQuick ? 20 : 24,
    servings: 2,
    difficulty: 'easy',
    dietaryTags: [
      ...(isVegetarian ? ['Vegetarian'] : []),
      ...(isGlutenFree ? ['Gluten-free'] : []),
      'Quick (<30m)',
    ],
    ingredients: [
      ...ingredients.map((ing) => ({
        name: ing.name,
        amount: '1 to 1.5 cups prepared',
        isPantryStaple: false,
        isProvidedIngredient: true,
      })),
      { name: 'Olive oil or cooking oil', amount: '2 tbsp', isPantryStaple: true, isProvidedIngredient: false },
      { name: 'Salt and cracked black pepper', amount: 'To taste', isPantryStaple: true, isProvidedIngredient: false },
      { name: 'Garlic powder or paprika', amount: '1/2 tsp', isPantryStaple: true, isProvidedIngredient: false },
      { name: 'Lemon juice or splash of vinegar', amount: '1 tsp (optional finish)', isPantryStaple: true, isProvidedIngredient: false },
    ],
    instructions: [
      `Chop and prep all your ingredients (${names.join(', ')}) into uniform bite-sized pieces for even cooking.`,
      'Heat the oil in a heavy skillet over medium-high heat until shimmering. Add the firmer ingredients first, cooking undisturbed for 3–4 minutes to build a golden crust.',
      `Add the remaining ingredients along with salt, pepper, and spices. Toss together and sauté for an additional 6–8 minutes until tender and deeply caramelized.`,
      'Finish with a tiny splash of lemon juice or vinegar to brighten the flavors, and serve piping hot straight from the skillet.',
    ],
    chefTip:
      'Resist the urge to stir constantly! Letting ingredients sit in direct contact with hot metal develops caramelization that boosts savoriness.',
    wasteSavedNote: `Cleans out your fridge and turns ${names.join(' + ')} into a hearty dinner.`,
    substitutions: [
      { original: 'Olive oil', substitute: 'Ghee, butter, or vegetable oil' },
      { original: 'Paprika', substitute: 'Cumin, chili powder, or poultry seasoning' },
    ],
    providedIngredientsMatched: names,
  };
}
