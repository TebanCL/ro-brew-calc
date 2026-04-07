import type { Stats } from "../lib/formulas";
import type { UiStrings } from "../lib/i18n";
import { RoTitleBar } from "./RoTitleBar";
import { Ni } from "./Ni";

interface StatsPanelProps {
  stats: Stats;
  setStat: (k: keyof Stats, v: number) => void;
  u: UiStrings;
  pcBaseRate: number;
  spCreationAvg: number;
  specificVal: number;
  maxPot: number;
  mcCreationAvg: number;
  discRate: number;
}

export const StatsPanel = ({ stats, setStat, u, pcBaseRate, spCreationAvg, specificVal, maxPot, mcCreationAvg, discRate }: StatsPanelProps) => (
  <div className="ro-sunken bg-secondary px-2.5 py-2 mb-2">
    <div className="flex flex-wrap justify-center gap-3.5">

      {/* Levels */}
      <div>
        <RoTitleBar className="mb-1 text-center">{u.levels}</RoTitleBar>
        <div className="flex gap-1.5 flex-wrap justify-center">
          {([["Base Lv", "BaseLv"], ["Job Lv", "JobLv"]] as const).map(([l, k]) => (
            <div key={k} className="ro-raised bg-card flex items-center gap-1 px-1.5 py-0.5">
              <span className="text-[11px] text-secondary-foreground">{l}</span>
              <Ni val={stats[k]} onChange={v => setStat(k, v)} w="46px" />
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div>
        <RoTitleBar className="mb-1 text-center">{u.skills}</RoTitleBar>
        <div className="flex gap-1.5 flex-wrap justify-center">
          {([
            ["Prepare Potion",     "PreparePotion_Lv",     "pharmacy.png",           10],
            ["Potion Research",    "PotionResearch_Lv",    "potion-research.png",    10],
            ["Instruction Change", "InstructionChange_Lv", "instruction-change.png",  5],
            ["FCP",                "FCP_Lv",               "fcp.png",                 5],
            ["Sp. Pharmacy",       "SpecialPharmacy_Lv",   "special-pharmacy.png",   10],
            ["Mix Cooking",        "MixCooking_Lv",        "mix-cooking.png",          2],
            ["Discount",           "Discount_Lv",          "discount.png",            10],
          ] as const).map(([l, k, icon, max]) => (
            <div key={k} className="ro-raised bg-card flex items-center gap-1 px-1.5 py-0.5">
              <img src={`${import.meta.env.BASE_URL}assets/icons/skills/${icon}`} alt="" width={18} height={18} style={{ imageRendering: "pixelated", flexShrink: 0 }} />
              <span className="text-[11px] text-secondary-foreground">{l}</span>
              <Ni val={stats[k]} onChange={v => setStat(k, v)} w="36px" min={0} max={max} />
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div>
        <RoTitleBar className="mb-1 text-center">{u.stats}</RoTitleBar>
        <div className="flex gap-1.5 justify-center flex-wrap">
          {([["INT", "bINT", "eINT"], ["DEX", "bDEX", "eDEX"], ["LUK", "bLUK", "eLUK"]] as const).map(([l, bk, ek]) => (
            <div key={l} className="ro-raised bg-card text-center px-1.5 py-0.5">
              <div className="text-[11px] text-secondary-foreground font-bold">{l}</div>
              <div className="flex gap-0.5 items-center justify-center">
                <Ni val={stats[bk]} onChange={v => setStat(bk, v)} w="40px" min={1} />
                <span className="text-muted-foreground text-[11px]">+</span>
                <Ni val={stats[ek]} onChange={v => setStat(ek, v)} w="40px" min={0} />
                <span className="text-foreground text-[12px] font-bold min-w-[26px]">={stats[bk] + stats[ek]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>

    {/* Derived values bar */}
    <div className="flex gap-3.5 justify-center mt-1.5 text-[11px] text-muted-foreground flex-wrap">
      <span>{u.pcBaseRate}: <b className="text-secondary-foreground">{pcBaseRate.toFixed(1)}%</b></span>
      <span>{u.spCreationAvg}: <b className="text-secondary-foreground">{Math.round(spCreationAvg)}</b></span>
      <span>{u.spSpecificVal}: <b className="text-secondary-foreground">{specificVal}</b></span>
      <span>{u.spMax}: <b className="text-secondary-foreground">{maxPot}</b></span>
      <span>{u.mcCreationAvg}: <b className="text-secondary-foreground">{Math.round(mcCreationAvg)}</b></span>
      <span>{u.discount}: <b className="text-secondary-foreground">{discRate}%</b></span>
    </div>
  </div>
);
