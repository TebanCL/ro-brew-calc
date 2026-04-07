import { describe, it, expect } from "vitest";
import { getBrewRate, getSPCreation, getSPMaxPot, getSPQty, type Stats } from "./formulas";

const defaultStats: Stats = {
  bINT: 120, bDEX: 120, bLUK: 120, BaseLv: 200, JobLv: 70,
  eINT: 0, eDEX: 0, eLUK: 0,
  PreparePotion_Lv: 10, PotionResearch_Lv: 10, InstructionChange_Lv: 5,
  FCP_Lv: 5, SpecialPharmacy_Lv: 10, MixCooking_Lv: 2, Pharmacy_Lv: 10, Discount_Lv: 10,
};

// ---- getBrewRate ----
describe("getBrewRate", () => {
  it("returns correct rate with default stats and positive potionRate", () => {
    // (10*3) + 10 + 5 + (70*0.2) + (120*0.1) + (120*0.1) + (120*0.05) + 20 = 109 → clamped to 100
    expect(getBrewRate(defaultStats, 20)).toBe(100);
  });

  it("returns correct rate with negative potionRate (Embryo -15)", () => {
    // base = 30+10+5+14+12+12+6 = 89; 89 + (-15) = 74
    expect(getBrewRate(defaultStats, -15)).toBe(74);
  });

  it("clamps result to 0 when stats are very low", () => {
    const lowStats: Stats = { ...defaultStats, bINT: 1, bDEX: 1, bLUK: 1, BaseLv: 1, JobLv: 1,
      PreparePotion_Lv: 0, PotionResearch_Lv: 0, InstructionChange_Lv: 0 };
    expect(getBrewRate(lowStats, -200)).toBe(0);
  });

  it("clamps result to 100 when stats are very high", () => {
    const highStats: Stats = { ...defaultStats, bINT: 999, bDEX: 999, bLUK: 999 };
    expect(getBrewRate(highStats, 100)).toBe(100);
  });

  it("accounts for equipment bonus stats", () => {
    const withBonus: Stats = { ...defaultStats, eINT: 30, eDEX: 30, eLUK: 30 };
    // base with 120+30=150 each: (10*3)+10+5+(70*0.2)+(150*0.1)+(150*0.1)+(150*0.05)+(-15)
    // = 30+10+5+14+15+15+7.5-15 = 81.5 → 81.5 vs default 74 (higher due to bonus)
    expect(getBrewRate(withBonus, -15)).toBeGreaterThan(getBrewRate(defaultStats, -15));
  });
});

// ---- getSPCreation ----
describe("getSPCreation", () => {
  it("calculates average scenario correctly", () => {
    // 120 + 60 + 120 + 70 + 90 + 100 + 50 + 35 = 645
    expect(getSPCreation(defaultStats, 90, 7)).toBe(645);
  });

  it("calculates pessimistic scenario correctly", () => {
    // 120 + 60 + 120 + 70 + 30 + 100 + 50 + 20 = 570
    expect(getSPCreation(defaultStats, 30, 4)).toBe(570);
  });

  it("calculates optimistic scenario correctly", () => {
    // 120 + 60 + 120 + 70 + 150 + 100 + 50 + 50 = 720
    expect(getSPCreation(defaultStats, 150, 10)).toBe(720);
  });

  it("optimistic > average > pessimistic", () => {
    const pess = getSPCreation(defaultStats, 30, 4);
    const avg = getSPCreation(defaultStats, 90, 7);
    const opt = getSPCreation(defaultStats, 150, 10);
    expect(opt).toBeGreaterThan(avg);
    expect(avg).toBeGreaterThan(pess);
  });

  it("higher BaseLv increases creation value", () => {
    const highLv: Stats = { ...defaultStats, BaseLv: 250 };
    expect(getSPCreation(highLv, 90, 7)).toBeGreaterThan(getSPCreation(defaultStats, 90, 7));
  });
});

// ---- getSPMaxPot ----
describe("getSPMaxPot", () => {
  it.each([
    [0, 7], [1, 7],
    [2, 8], [3, 8],
    [4, 9], [5, 9],
    [6, 10], [7, 10],
    [8, 11],
    [9, 12], [10, 12],
  ])("level %i → %i max potions", (level, expected) => {
    expect(getSPMaxPot(level)).toBe(expected);
  });
});

// ---- getSPQty ----
describe("getSPQty", () => {
  const specificVal = 420; // 620 - 20*10
  const maxPot = 12;

  it("returns maxPot when delta >= 400", () => {
    // creation = specificVal + itemRate + 400 = 420 + 10 + 400 = 830
    expect(getSPQty(830, specificVal, 10, maxPot)).toBe(12);
  });

  it("returns maxPot - 3 when 300 <= delta < 400", () => {
    expect(getSPQty(730, specificVal, 10, maxPot)).toBe(9);
  });

  it("returns maxPot - 4 when 100 <= delta < 300", () => {
    // delta=215 (Enriched White PotionZ with avg creation 645, itemRate 10)
    expect(getSPQty(645, specificVal, 10, maxPot)).toBe(8);
  });

  it("returns maxPot - 5 when 1 <= delta < 100", () => {
    // delta = 645 - (420+150) = 75 (Concentrated Golden Syrup, itemRate 150)
    expect(getSPQty(645, specificVal, 150, maxPot)).toBe(7);
  });

  it("returns maxPot - 6 when delta < 1", () => {
    expect(getSPQty(400, specificVal, 10, maxPot)).toBe(6);
  });

  it("never returns less than 1", () => {
    // delta = 1 - (420 + 1000) = -1419 → maxPot - 6 = 6, so max(1, 6) = 6
    expect(getSPQty(1, specificVal, 1000, maxPot)).toBe(6);
    // With a very low maxPot the guard kicks in: max(1, 1-6) = 1
    expect(getSPQty(1, specificVal, 1000, 1)).toBe(1);
  });

  it("handles maxPot = 7 without going below 1", () => {
    expect(getSPQty(400, specificVal, 10, 7)).toBe(1);
  });
});
