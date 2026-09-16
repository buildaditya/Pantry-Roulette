export interface SuggestedIngredient {
  name: string;
  emoji: string;
  category: 'produce' | 'dairy' | 'protein' | 'grain' | 'canned';
}

export const COMMON_INGREDIENTS: SuggestedIngredient[] = [
  // Produce
  { name: 'Onion', emoji: '🧅', category: 'produce' },
  { name: 'Tomatoes', emoji: '🍅', category: 'produce' },
  { name: 'Garlic', emoji: '🧄', category: 'produce' },
  { name: 'Spinach', emoji: '🥬', category: 'produce' },
  { name: 'Potatoes', emoji: '🥔', category: 'produce' },
  { name: 'Carrots', emoji: '🥕', category: 'produce' },
  { name: 'Bell pepper', emoji: '🫑', category: 'produce' },
  { name: 'Mushrooms', emoji: '🍄', category: 'produce' },
  { name: 'Broccoli', emoji: '🥦', category: 'produce' },
  { name: 'Zucchini', emoji: '🥒', category: 'produce' },

  // Dairy & Eggs
  { name: 'Eggs', emoji: '🥚', category: 'dairy' },
  { name: 'Greek yogurt', emoji: '🥣', category: 'dairy' },
  { name: 'Cheese', emoji: '🧀', category: 'dairy' },
  { name: 'Butter', emoji: '🧈', category: 'dairy' },
  { name: 'Heavy cream', emoji: '🥛', category: 'dairy' },

  // Protein
  { name: 'Chicken breast', emoji: '🍗', category: 'protein' },
  { name: 'Tofu', emoji: '🧊', category: 'protein' },
  { name: 'Canned tuna', emoji: '🐟', category: 'protein' },
  { name: 'Ground beef', emoji: '🥩', category: 'protein' },

  // Grains & Carbs
  { name: 'Pasta', emoji: '🍝', category: 'grain' },
  { name: 'Rice', emoji: '🍚', category: 'grain' },
  { name: 'Bread', emoji: '🍞', category: 'grain' },
  { name: 'Oats', emoji: '🥣', category: 'grain' },
  { name: 'Noodles', emoji: '🍜', category: 'grain' },

  // Canned & Legumes
  { name: 'Chickpeas', emoji: '🧆', category: 'canned' },
  { name: 'Black beans', emoji: '🥫', category: 'canned' },
  { name: 'Lentils', emoji: '🍲', category: 'canned' },
  { name: 'Crushed tomatoes', emoji: '🥫', category: 'canned' },
  { name: 'Coconut milk', emoji: '🥥', category: 'canned' },
];

/** Curated, reliable pairings that always produce exceptional zero-waste meals */
export const CURATED_ROULETTE_COMBOS: string[][] = [
  ['Onion', 'Chickpeas', 'Greek yogurt'],
  ['Tomatoes', 'Garlic', 'Eggs'],
  ['Potatoes', 'Onion', 'Cheese'],
  ['Pasta', 'Garlic', 'Tomatoes'],
  ['Rice', 'Black beans', 'Bell pepper'],
  ['Spinach', 'Eggs', 'Cheese'],
  ['Mushrooms', 'Garlic', 'Pasta'],
  ['Chicken breast', 'Bell pepper', 'Onion'],
  ['Tofu', 'Broccoli', 'Rice'],
  ['Lentils', 'Carrots', 'Onion'],
  ['Chickpeas', 'Tomatoes', 'Spinach'],
  ['Eggs', 'Potatoes', 'Onion'],
];

export function getRandomPantryCombination(): SuggestedIngredient[] {
  const randomComboNames =
    CURATED_ROULETTE_COMBOS[Math.floor(Math.random() * CURATED_ROULETTE_COMBOS.length)];

  return randomComboNames.map((name) => {
    const existing = COMMON_INGREDIENTS.find(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    );
    return (
      existing || {
        name,
        emoji: getEmojiForIngredient(name),
        category: 'produce' as const,
      }
    );
  });
}

export function getEmojiForIngredient(name: string): string {
  const normalized = name.toLowerCase().trim();
  const match = COMMON_INGREDIENTS.find(
    (item) => item.name.toLowerCase() === normalized || normalized.includes(item.name.toLowerCase())
  );
  if (match) return match.emoji;

  if (normalized.includes('onion') || normalized.includes('shallot')) return '🧅';
  if (normalized.includes('tomato')) return '🍅';
  if (normalized.includes('yogurt') || normalized.includes('cream')) return '🥣';
  if (normalized.includes('chickpea') || normalized.includes('garbanzo')) return '🧆';
  if (normalized.includes('bean')) return '🥫';
  if (normalized.includes('garlic')) return '🧄';
  if (normalized.includes('egg')) return '🥚';
  if (normalized.includes('cheese') || normalized.includes('cheddar') || normalized.includes('mozzarella')) return '🧀';
  if (normalized.includes('bread') || normalized.includes('toast')) return '🍞';
  if (normalized.includes('rice')) return '🍚';
  if (normalized.includes('pasta') || normalized.includes('noodle')) return '🍝';
  if (normalized.includes('chicken') || normalized.includes('poultry')) return '🍗';
  if (normalized.includes('beef') || normalized.includes('steak') || normalized.includes('meat')) return '🥩';
  if (normalized.includes('fish') || normalized.includes('salmon') || normalized.includes('tuna')) return '🐟';
  if (normalized.includes('apple') || normalized.includes('fruit')) return '🍎';
  if (normalized.includes('lemon') || normalized.includes('lime')) return '🍋';
  if (normalized.includes('pepper') || normalized.includes('chili')) return '🌶️';
  if (normalized.includes('potato')) return '🥔';
  if (normalized.includes('herb') || normalized.includes('parsley') || normalized.includes('cilantro')) return '🌿';
  if (normalized.includes('spinach') || normalized.includes('kale') || normalized.includes('salad')) return '🥬';

  return '🥗';
}
