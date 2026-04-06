import type { Stats } from "./formulas";

export interface Ingredient { n: string; q: number; }
export interface PCRecipe { name: string; ingredients: Ingredient[]; potionRate: number; }
export interface SPRecipe { name: string; ingredients: Ingredient[]; itemRate: number; }

export const DISCOUNT_RATES = [0, 7, 9, 11, 13, 15, 17, 19, 21, 23, 24];

export const NPC_PRICES_BASE: Record<string, number> = {
  "Red Herb": 18, "Yellow Herb": 40, "White Herb": 80, "Blue Herb": 60, "Green Herb": 10,
  "Empty Potion Bottle": 20, "Empty Test Tube": 100, "Empty Bottle": 6, "Medicine Bowl": 8,
  "Scell": 58, "Glass Tube": 200, "Morning Dew of Yggdrasil": 2000, "Seed of Life": 3000,
  "Red Potion": 50, "Yellow Potion": 180, "White Potion": 1200,
  "Concentration Potion": 800, "Awakening Potion": 1500,
  "Spicy Sauce": 10, "Sweet Sauce": 10, "Holy Water": 20, "Monster Feed": 60,
  "Panacea": 500, "Yellow Syrup": 1200, "White Syrup": 1500,
};

export const defaultStats: Stats = {
  bINT: 120, bDEX: 120, bLUK: 120, BaseLv: 200, JobLv: 70,
  eINT: 0, eDEX: 0, eLUK: 0,
  PreparePotion_Lv: 10, PotionResearch_Lv: 10, InstructionChange_Lv: 0,
  FCP_Lv: 5, SpecialPharmacy_Lv: 10, Pharmacy_Lv: 10, Discount_Lv: 10,
};

export const PC_RECIPES: PCRecipe[] = [
  { name: "Red Potion", ingredients: [{ n: "Red Herb", q: 1 }, { n: "Empty Potion Bottle", q: 1 }, { n: "Medicine Bowl", q: 1 }], potionRate: 20 },
  { name: "Yellow Potion", ingredients: [{ n: "Yellow Herb", q: 1 }, { n: "Empty Potion Bottle", q: 1 }, { n: "Medicine Bowl", q: 1 }], potionRate: 20 },
  { name: "White Potion", ingredients: [{ n: "White Herb", q: 1 }, { n: "Empty Potion Bottle", q: 1 }, { n: "Medicine Bowl", q: 1 }], potionRate: 20 },
  { name: "Blue Potion", ingredients: [{ n: "Blue Herb", q: 1 }, { n: "Scell", q: 1 }, { n: "Empty Potion Bottle", q: 1 }, { n: "Medicine Bowl", q: 1 }], potionRate: -10 },
  { name: "Alcohol", ingredients: [{ n: "Stem", q: 5 }, { n: "Poison Spore", q: 5 }, { n: "Empty Bottle", q: 1 }, { n: "Empty Test Tube", q: 1 }, { n: "Medicine Bowl", q: 1 }], potionRate: 10 },
  { name: "Bottle Grenade", ingredients: [{ n: "Alcohol", q: 1 }, { n: "Fabric", q: 1 }, { n: "Empty Bottle", q: 1 }, { n: "Medicine Bowl", q: 1 }], potionRate: -5 },
  { name: "Acid Bottle", ingredients: [{ n: "Immortal Heart", q: 1 }, { n: "Empty Bottle", q: 1 }, { n: "Medicine Bowl", q: 1 }], potionRate: -5 },
  { name: "Plant Bottle", ingredients: [{ n: "Maneater Blossom", q: 1 }, { n: "Empty Bottle", q: 1 }, { n: "Medicine Bowl", q: 1 }], potionRate: -5 },
  { name: "Marine Sphere Bottle", ingredients: [{ n: "Tendon", q: 1 }, { n: "Detonator", q: 1 }, { n: "Empty Bottle", q: 1 }, { n: "Medicine Bowl", q: 1 }], potionRate: -5 },
  { name: "Condensed Yellow Potion", ingredients: [{ n: "Yellow Potion", q: 1 }, { n: "Cactus Needle", q: 1 }, { n: "Empty Test Tube", q: 1 }, { n: "Medicine Bowl", q: 1 }], potionRate: -5 },
  { name: "Condensed White Potion", ingredients: [{ n: "White Potion", q: 1 }, { n: "Witch Starsand", q: 1 }, { n: "Empty Test Tube", q: 1 }, { n: "Medicine Bowl", q: 1 }], potionRate: -10 },
  { name: "Anodyne", ingredients: [{ n: "Alcohol", q: 1 }, { n: "Ment", q: 1 }, { n: "Empty Bottle", q: 1 }, { n: "Medicine Bowl", q: 1 }], potionRate: -10 },
  { name: "Aloevera", ingredients: [{ n: "Alcohol", q: 1 }, { n: "Honey", q: 1 }, { n: "Empty Bottle", q: 1 }, { n: "Medicine Bowl", q: 1 }], potionRate: -10 },
  { name: "Glistening Coat", ingredients: [{ n: "Zenorc Fang", q: 1 }, { n: "Alcohol", q: 1 }, { n: "Empty Bottle", q: 1 }, { n: "Medicine Bowl", q: 1 }], potionRate: -10 },
  { name: "Red Slim Potion", ingredients: [{ n: "Red Potion", q: 1 }, { n: "Cactus Needle", q: 1 }, { n: "Empty Test Tube", q: 1 }, { n: "Medicine Bowl", q: 1 }], potionRate: -10 },
  { name: "Yellow Slim Potion", ingredients: [{ n: "Yellow Potion", q: 1 }, { n: "Mole Whiskers", q: 1 }, { n: "Empty Test Tube", q: 1 }, { n: "Medicine Bowl", q: 1 }], potionRate: -12.5 },
  { name: "White Slim Potion", ingredients: [{ n: "White Potion", q: 1 }, { n: "Witch Starsand", q: 1 }, { n: "Empty Test Tube", q: 1 }, { n: "Medicine Bowl", q: 1 }], potionRate: -15 },
  { name: "Embryo", ingredients: [{ n: "Morning Dew of Yggdrasil", q: 1 }, { n: "Seed of Life", q: 1 }, { n: "Glass Tube", q: 1 }, { n: "Medicine Bowl", q: 1 }], potionRate: -15 },
];

export const SP_RECIPES: SPRecipe[] = [
  { name: "Thorn Plant Seed", ingredients: [{ n: "Prickly Fruit", q: 10 }], itemRate: 30 },
  { name: "Blood Sucker Seed", ingredients: [{ n: "Maneater Root", q: 10 }], itemRate: 30 },
  { name: "Bomb Mushroom Spore", ingredients: [{ n: "Mushroom Spore", q: 10 }, { n: "Poison Spore", q: 5 }, { n: "Gun Powder", q: 2 }], itemRate: 15 },
  { name: "Enriched White PotionZ", ingredients: [{ n: "Empty Test Tube", q: 10 }, { n: "White Potion", q: 20 }, { n: "White Herb", q: 10 }, { n: "Alcohol", q: 1 }], itemRate: 10 },
  { name: "Vitata500", ingredients: [{ n: "Empty Test Tube", q: 10 }, { n: "Grape", q: 10 }, { n: "Honey", q: 10 }, { n: "Blue Herb", q: 10 }], itemRate: 20 },
  { name: "Enrich Celermine Juice", ingredients: [{ n: "Empty Test Tube", q: 10 }, { n: "Concentration Potion", q: 5 }, { n: "Awakening Potion", q: 5 }, { n: "Spicy Sauce", q: 5 }], itemRate: 30 },
  { name: "Cure Free", ingredients: [{ n: "Empty Test Tube", q: 10 }, { n: "Panacea", q: 5 }, { n: "Green Herb", q: 20 }, { n: "Mastela Fruit", q: 1 }, { n: "Yggdrasil Leaf", q: 1 }], itemRate: 40 },
  { name: "HP Increase Potion (S)", ingredients: [{ n: "Empty Bottle", q: 10 }, { n: "Monster Feed", q: 5 }, { n: "White Herb", q: 10 }, { n: "Spicy Sauce", q: 1 }], itemRate: 10 },
  { name: "HP Increase Potion (M)", ingredients: [{ n: "Empty Bottle", q: 10 }, { n: "White Herb", q: 10 }, { n: "Yellow Herb", q: 10 }, { n: "Spicy Sauce", q: 1 }], itemRate: 20 },
  { name: "HP Increase Potion (L)", ingredients: [{ n: "Empty Bottle", q: 10 }, { n: "White Herb", q: 15 }, { n: "Mastela Fruit", q: 3 }, { n: "Holy Water", q: 1 }, { n: "Spicy Sauce", q: 1 }], itemRate: 40 },
  { name: "SP Increase Potion (S)", ingredients: [{ n: "Empty Bottle", q: 10 }, { n: "Lemon", q: 10 }, { n: "Grape", q: 10 }, { n: "Sweet Sauce", q: 1 }], itemRate: 10 },
  { name: "SP Increase Potion (M)", ingredients: [{ n: "Empty Bottle", q: 10 }, { n: "Honey", q: 10 }, { n: "Blue Herb", q: 10 }, { n: "Sweet Sauce", q: 1 }], itemRate: 15 },
  { name: "SP Increase Potion (L)", ingredients: [{ n: "Empty Bottle", q: 10 }, { n: "Royal Jelly", q: 10 }, { n: "Blue Herb", q: 15 }, { n: "Sweet Sauce", q: 1 }], itemRate: 20 },
  { name: "Concentrated Red Syrup", ingredients: [{ n: "Empty Potion Bottle", q: 5 }, { n: "Empty Bottle", q: 10 }, { n: "Red Syrup", q: 15 }], itemRate: 80 },
  { name: "Concentrated Blue Syrup", ingredients: [{ n: "Empty Potion Bottle", q: 5 }, { n: "Empty Bottle", q: 10 }, { n: "Blue Syrup", q: 15 }], itemRate: 160 },
  { name: "Concentrated Golden Syrup", ingredients: [{ n: "Empty Potion Bottle", q: 5 }, { n: "Empty Bottle", q: 10 }, { n: "White Syrup", q: 10 }, { n: "Yellow Syrup", q: 10 }], itemRate: 160 },
  { name: "Red Herb Activator", ingredients: [{ n: "Empty Test Tube", q: 10 }, { n: "Red Herb", q: 45 }, { n: "Yggdrasil Seed", q: 5 }], itemRate: 120 },
  { name: "Blue Herb Activator", ingredients: [{ n: "Empty Test Tube", q: 10 }, { n: "Blue Herb", q: 15 }, { n: "Yggdrasil Seed", q: 5 }], itemRate: 120 },
  { name: "Golden X Potion", ingredients: [{ n: "Empty Test Tube", q: 10 }, { n: "Yggdrasil Berry", q: 10 }, { n: "Gold", q: 5 }], itemRate: 160 },
];

function getAllUniqueItems(): string[] {
  const s = new Set<string>();
  [...PC_RECIPES, ...SP_RECIPES].forEach(r => r.ingredients.forEach(i => s.add(i.n)));
  return [...s].sort();
}

export const ALL_ITEMS = getAllUniqueItems();

/** Maps item name (English) to divine-pride item ID for icon display */
export const ITEM_ICONS: Record<string, number> = {
  // PC recipe outputs
  "Red Potion": 501,
  "Yellow Potion": 503,
  "White Potion": 504,
  "Blue Potion": 505,
  "Alcohol": 970,
  "Bottle Grenade": 7135,
  "Acid Bottle": 7136,
  "Plant Bottle": 7137,
  "Marine Sphere Bottle": 7138,
  "Condensed Yellow Potion": 546,
  "Condensed White Potion": 547,
  "Anodyne": 605,
  "Aloevera": 606,
  "Glistening Coat": 7139,
  "Red Slim Potion": 545,
  "Yellow Slim Potion": 546,
  "White Slim Potion": 547,
  "Embryo": 7142,
  // SP recipe outputs
  "Thorn Plant Seed": 6210,
  "Blood Sucker Seed": 6211,
  "Bomb Mushroom Spore": 6212,
  "Enriched White PotionZ": 12428,
  "Vitata500": 12436,
  "Enrich Celermine Juice": 12437,
  "Cure Free": 12475,
  "HP Increase Potion (S)": 12422,
  "HP Increase Potion (M)": 12423,
  "HP Increase Potion (L)": 12424,
  "SP Increase Potion (S)": 12425,
  "SP Increase Potion (M)": 12426,
  "SP Increase Potion (L)": 12427,
  "Concentrated Red Syrup": 1100003,
  "Concentrated Blue Syrup": 1100004,
  "Concentrated Golden Syrup": 1100005,
  "Red Herb Activator": 100232,
  "Blue Herb Activator": 100233,
  "Golden X Potion": 100231,
  // Ingredients
  "Red Herb": 507,
  "Yellow Herb": 508,
  "White Herb": 509,
  "Blue Herb": 510,
  "Green Herb": 511,
  "Empty Potion Bottle": 1093,
  "Empty Test Tube": 1092,
  "Empty Bottle": 713,
  "Medicine Bowl": 7134,
  "Scell": 911,
  "Glass Tube": 7143,
  "Morning Dew of Yggdrasil": 7141,
  "Seed of Life": 7140,
  "Concentration Potion": 645,
  "Awakening Potion": 656,
  "Spicy Sauce": 7455,
  "Sweet Sauce": 7453,
  "Holy Water": 523,
  "Panacea": 525,
  "Yellow Syrup": 11622,
  "White Syrup": 11623,
  "Stem": 905,
  "Poison Spore": 7033,
  "Fabric": 1059,
  "Immortal Heart": 929,
  "Maneater Blossom": 1032,
  "Tendon": 1050,
  "Detonator": 1051,
  "Cactus Needle": 952,
  "Witch Starsand": 1061,
  "Ment": 708,
  "Honey": 518,
  "Zenorc Fang": 1044,
  "Mole Whiskers": 1017,
  "Prickly Fruit": 576,
  "Maneater Root": 1033,
  "Mushroom Spore": 921,
  "Gun Powder": 6244,
  "Grape": 514,
  "Mastela Fruit": 522,
  "Yggdrasil Leaf": 610,
  "Lemon": 568,
  "Royal Jelly": 526,
  "Red Syrup": 11621,
  "Blue Syrup": 11624,
  "Yggdrasil Seed": 608,
  "Yggdrasil Berry": 607,
  "Gold": 969,
};

export function itemIconUrl(name: string, base: string): string | null {
  const id = ITEM_ICONS[name];
  return id !== undefined ? `${base}assets/icons/items/${id}.png` : null;
}
