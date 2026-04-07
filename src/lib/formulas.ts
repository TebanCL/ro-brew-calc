export interface Stats {
  bINT: number; bDEX: number; bLUK: number;
  eINT: number; eDEX: number; eLUK: number;
  BaseLv: number; JobLv: number;
  PreparePotion_Lv: number; PotionResearch_Lv: number; InstructionChange_Lv: number;
  FCP_Lv: number; SpecialPharmacy_Lv: number; MixCooking_Lv: number; Pharmacy_Lv: number; Discount_Lv: number;
}

export function getBrewRate(s: Stats, potionRate: number): number {
  const INT = s.bINT + s.eINT, DEX = s.bDEX + s.eDEX, LUK = s.bLUK + s.eLUK;
  return Math.min(100, Math.max(0,
    (s.PreparePotion_Lv * 3) + s.PotionResearch_Lv + s.InstructionChange_Lv +
    (s.JobLv * 0.2) + (DEX * 0.1) + (LUK * 0.1) + (INT * 0.05) + potionRate
  ));
}

export function getSPCreation(s: Stats, rndMain: number, rndFCP: number): number {
  const INT = s.bINT + s.eINT, DEX = s.bDEX + s.eDEX, LUK = s.bLUK + s.eLUK;
  return INT + (DEX / 2) + LUK + s.JobLv + rndMain + (s.BaseLv - 100) + (s.PotionResearch_Lv * 5) + (s.FCP_Lv * rndFCP);
}

export function getSPMaxPot(sklv: number): number {
  if (sklv <= 1) return 7; if (sklv <= 3) return 8; if (sklv <= 5) return 9;
  if (sklv <= 7) return 10; if (sklv <= 8) return 11; return 12;
}

export function getSPQty(creation: number, specificVal: number, itemRate: number, maxPot: number): number {
  const d = creation - (specificVal + itemRate);
  if (d >= 400) return maxPot;
  if (d >= 300) return Math.max(1, maxPot - 3);
  if (d >= 100) return Math.max(1, maxPot - 4);
  if (d >= 1) return Math.max(1, maxPot - 5);
  return Math.max(1, maxPot - 6);
}

/** Creation value for Mix Cooking: floor(JobLv/4) + floor(DEX/3) + floor(LUK/2) */
export function getMCCreation(s: Stats): number {
  const DEX = s.bDEX + s.eDEX, LUK = s.bLUK + s.eLUK;
  return Math.floor(s.JobLv / 4) + Math.floor(DEX / 3) + Math.floor(LUK / 2);
}

/**
 * Output quantity for Mix Cooking given creation, the random component (30–150),
 * itemRate, and bonusQty (0=pessimistic, 1=expected, 2=optimistic) for the 10–12 range.
 * Difficulty = rnd + itemRate. Returns 0 on failure.
 */
export function getMCQty(creation: number, rnd: number, itemRate: number, bonusQty: number): number {
  const delta = creation - (rnd + itemRate);
  if (delta <= -50) return 0;
  if (delta <= -30) return 5;
  if (delta < 10) return 8;
  if (delta < 30) return 10;
  return 10 + bonusQty;
}
