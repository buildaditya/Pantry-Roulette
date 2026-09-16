/**
 * Ingredient Normalizer for Pantry Roulette
 * Normalizes user-submitted ingredient strings to canonical culinary names,
 * stripping prep instructions, measurements, and mapping regional synonyms.
 */

const SYNONYM_MAP: Record<string, string> = {
  // Legumes & Beans
  'garbanzo': 'chickpeas',
  'garbanzo bean': 'chickpeas',
  'garbanzo beans': 'chickpeas',
  'ceci': 'chickpeas',
  'ceci beans': 'chickpeas',
  'cannellini': 'white beans',
  'cannellini beans': 'white beans',
  'navy beans': 'white beans',
  'kidney bean': 'kidney beans',

  // Alliums
  'scallion': 'green onions',
  'scallions': 'green onions',
  'green onion': 'green onions',
  'spring onion': 'green onions',
  'spring onions': 'green onions',
  'shallot': 'shallots',
  'yellow onion': 'onion',
  'red onion': 'onion',
  'white onion': 'onion',
  'sweet onion': 'onion',

  // Dairy & Alternatives
  'yoghurt': 'greek yogurt',
  'yogurt': 'greek yogurt',
  'plain yogurt': 'greek yogurt',
  'curd': 'greek yogurt',
  'parmesan cheese': 'parmesan',
  'cheddar cheese': 'cheddar',
  'mozzarella cheese': 'mozzarella',
  'heavy cream': 'cream',
  'whipping cream': 'cream',

  // Nightshades & Produce
  'roma tomato': 'tomatoes',
  'cherry tomato': 'tomatoes',
  'cherry tomatoes': 'tomatoes',
  'plum tomato': 'tomatoes',
  'tomato': 'tomatoes',
  'aubergine': 'eggplant',
  'courgette': 'zucchini',
  'capsicum': 'bell pepper',
  'sweet pepper': 'bell pepper',
  'red bell pepper': 'bell pepper',
  'green bell pepper': 'bell pepper',
  'yellow bell pepper': 'bell pepper',

  // Herbs
  'coriander': 'cilantro',
  'fresh cilantro': 'cilantro',
  'fresh parsley': 'parsley',
  'flat leaf parsley': 'parsley',
  'italian parsley': 'parsley',

  // Proteins
  'chicken breasts': 'chicken breast',
  'chicken thighs': 'chicken thigh',
  'ground beef': 'minced beef',
  'ground turkey': 'minced turkey',

  // Grains & Carbs
  'spaghetti': 'pasta',
  'penne': 'pasta',
  'fusilli': 'pasta',
  'macaroni': 'pasta',
  'noodles': 'pasta',
  'brown rice': 'rice',
  'white rice': 'rice',
  'jasmine rice': 'rice',
  'basmati rice': 'rice',
};

// Prep words and quantifiers to strip out
const PREP_WORDS = [
  'can of',
  'cans of',
  'canned',
  'tin of',
  'tinned',
  'fresh',
  'frozen',
  'dried',
  'diced',
  'chopped',
  'sliced',
  'minced',
  'crushed',
  'grated',
  'shredded',
  'cooked',
  'raw',
  'ripe',
  'organic',
  'leftover',
  'leftovers',
  'cup of',
  'cups of',
  'tbsp',
  'tablespoon',
  'tsp',
  'teaspoon',
  'gram',
  'grams',
  'oz',
  'pound',
  'pounds',
  'kg',
  'handful of',
  'bunch of',
  'clove of',
  'cloves of',
  'head of',
  'stalk of',
  'stalks of',
  'piece of',
  'pieces of',
];

export interface NormalizedIngredient {
  original: string;
  normalized: string;
  matchedSynonym: boolean;
}

/**
 * Normalizes an ingredient string into its canonical form.
 */
export function normalizeIngredient(rawInput: string): NormalizedIngredient {
  if (!rawInput || typeof rawInput !== 'string') {
    return { original: '', normalized: '', matchedSynonym: false };
  }

  const original = rawInput.trim();
  let clean = original.toLowerCase();

  // Remove numerical quantities at start, e.g. "2 onions" -> "onions", "1/2 cup"
  clean = clean.replace(/^[0-9\/\.\s-]+/, '');

  // Strip prep words and units
  for (const prep of PREP_WORDS) {
    const regex = new RegExp(`\\b${prep}\\b`, 'gi');
    clean = clean.replace(regex, ' ');
  }

  // Remove punctuation and extra whitespace
  clean = clean.replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();

  // Check synonym map
  if (SYNONYM_MAP[clean]) {
    return {
      original,
      normalized: SYNONYM_MAP[clean],
      matchedSynonym: true,
    };
  }

  // Check partial matches in synonym map
  for (const [key, canonical] of Object.entries(SYNONYM_MAP)) {
    if (clean === key || clean.endsWith(` ${key}`)) {
      return {
        original,
        normalized: canonical,
        matchedSynonym: true,
      };
    }
  }

  return {
    original,
    normalized: clean || original.toLowerCase(),
    matchedSynonym: false,
  };
}
