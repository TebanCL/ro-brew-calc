import type { Stats } from "../lib/formulas";
import type { UiStrings } from "../lib/i18n";
import { RO, sunken, raised } from "../lib/theme";
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
  <div style={{ ...sunken, background: RO.panelAlt, padding: "8px 10px", marginBottom: 8 }}>
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14 }}>
      <div>
        <div style={{ background: RO.titleBg, color: "#ffffff", fontWeight: 700, fontSize: 11, textAlign: "center", padding: "2px 8px", marginBottom: 4 }}>{u.levels}</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
          {([["Base Lv", "BaseLv"], ["Job Lv", "JobLv"]] as const).map(([l, k]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 4, ...raised, background: RO.panelBg, padding: "2px 6px" }}>
              <span style={{ fontSize: 11, color: RO.textMid }}>{l}</span>
              <Ni val={stats[k]} onChange={v => setStat(k, v)} w="46px" />
            </div>
          ))}
        </div>
      </div>
      <div>
        <div style={{ background: RO.titleBg, color: "#ffffff", fontWeight: 700, fontSize: 11, textAlign: "center", padding: "2px 8px", marginBottom: 4 }}>{u.skills}</div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", justifyContent: "center" }}>
          {([
            ["Prepare Potion",     "PreparePotion_Lv",     "pharmacy.png",          10],
            ["Potion Research",    "PotionResearch_Lv",    "potion-research.png",   10],
            ["Instruction Change", "InstructionChange_Lv", "instruction-change.png", 5],
            ["FCP",                "FCP_Lv",               "fcp.png",                5],
            ["Sp. Pharmacy",       "SpecialPharmacy_Lv",   "special-pharmacy.png",  10],
            ["Mix Cooking",        "MixCooking_Lv",        "mix-cooking.png",         2],
            ["Discount",           "Discount_Lv",          "discount.png",           10],
          ] as const).map(([l, k, icon, max]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 4, ...raised, background: RO.panelBg, padding: "2px 5px" }}>
              <img src={`${import.meta.env.BASE_URL}assets/icons/skills/${icon}`} alt="" width={18} height={18} style={{ imageRendering: "pixelated", flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: RO.textMid }}>{l}</span>
              <Ni val={stats[k]} onChange={v => setStat(k, v)} w="36px" min={0} max={max} />
            </div>
          ))}
        </div>
      </div>
      <div>
        <div style={{ background: RO.titleBg, color: "#ffffff", fontWeight: 700, fontSize: 11, textAlign: "center", padding: "2px 8px", marginBottom: 4 }}>{u.stats}</div>
        <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
          {([["INT", "bINT", "eINT"], ["DEX", "bDEX", "eDEX"], ["LUK", "bLUK", "eLUK"]] as const).map(([l, bk, ek]) => (
            <div key={l} style={{ textAlign: "center", ...raised, background: RO.panelBg, padding: "2px 6px" }}>
              <div style={{ fontSize: 11, color: RO.textMid, fontWeight: 700 }}>{l}</div>
              <div style={{ display: "flex", gap: 2, alignItems: "center", justifyContent: "center" }}>
                <Ni val={stats[bk]} onChange={v => setStat(bk, v)} w="40px" min={1} />
                <span style={{ color: RO.textMuted, fontSize: 11 }}>+</span>
                <Ni val={stats[ek]} onChange={v => setStat(ek, v)} w="40px" min={0} />
                <span style={{ color: RO.text, fontSize: 12, fontWeight: 700, minWidth: 26 }}>={stats[bk] + stats[ek]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 6, fontSize: 11, color: RO.textMuted, flexWrap: "wrap" }}>
      <span>{u.pcBaseRate}: <b style={{ color: RO.textMid }}>{pcBaseRate.toFixed(1)}%</b></span>
      <span>{u.spCreationAvg}: <b style={{ color: RO.textMid }}>{Math.round(spCreationAvg)}</b></span>
      <span>{u.spSpecificVal}: <b style={{ color: RO.textMid }}>{specificVal}</b></span>
      <span>{u.spMax}: <b style={{ color: RO.textMid }}>{maxPot}</b></span>
      <span>{u.mcCreationAvg}: <b style={{ color: RO.textMid }}>{Math.round(mcCreationAvg)}</b></span>
      <span>{u.discount}: <b style={{ color: RO.textMid }}>{discRate}%</b></span>
    </div>
  </div>
);
