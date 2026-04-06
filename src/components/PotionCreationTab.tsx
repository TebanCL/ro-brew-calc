import type { Dispatch, SetStateAction } from "react";
import type { Stats } from "../lib/formulas";
import { getBrewRate } from "../lib/formulas";
import type { UiStrings } from "../lib/i18n";
import type { PCRecipe, SPRecipe } from "../lib/data";
import { PC_RECIPES, itemIconUrl } from "../lib/data";
import { RO, sunken, raised, thS, tdS } from "../lib/theme";
import { Ni } from "./Ni";
import { Tex } from "./Tex";

interface PotionCreationTabProps {
  stats: Stats;
  getPrice: (n: string) => number;
  sellPrices: Record<string, number>;
  setSellPrices: Dispatch<SetStateAction<Record<string, number>>>;
  setDetail: (r: PCRecipe | SPRecipe | null) => void;
  u: UiStrings;
  tItem: (name: string) => string;
  fmt: (n: number) => string;
  fmtZ: (n: number) => string;
  pcBaseRate: number;
  INT: number;
  DEX: number;
  LUK: number;
}

export const PotionCreationTab = ({
  stats,
  getPrice,
  sellPrices,
  setSellPrices,
  setDetail,
  u,
  tItem,
  fmt,
  fmtZ,
  pcBaseRate,
  INT,
  DEX,
  LUK,
}: PotionCreationTabProps) => (
  <div style={{ overflowX: "auto" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
      <img src={`${import.meta.env.BASE_URL}assets/icons/skills/pharmacy.png`} alt="" width={24} height={24} style={{ imageRendering: "pixelated" }} />
      <span style={{ fontWeight: 700, fontSize: 13, color: RO.text }}>{u.pcTitle}</span>
    </div>
    <p style={{ fontSize: 11, color: RO.textMuted, margin: "0 0 6px" }}>{u.pcSubtitle}</p>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
      <thead><tr>
        <th style={thS}>{u.colPotion}</th><th style={thS}>{u.colCost}</th><th style={thS}>{u.colRate}</th><th style={thS}>{u.colSell}</th><th style={thS}>{u.colProfit}</th><th style={thS}></th>
      </tr></thead>
      <tbody>
        {PC_RECIPES.map((r, ri) => {
          const rate = getBrewRate(stats, r.potionRate);
          const cost = r.ingredients.reduce((s, i) => s + i.q * getPrice(i.n), 0);
          const sell = sellPrices[r.name] || 0;
          const cps = rate > 0 ? Math.round(cost / (rate / 100)) : Infinity;
          const prof = sell - cps;
          return (
            <tr key={ri} style={{ background: ri % 2 ? RO.row2 : RO.row1, borderBottom: `1px solid ${RO.rowBorder}` }}>
              <td style={{ ...tdS, fontWeight: 700, color: RO.text, whiteSpace: "nowrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {itemIconUrl(r.name, import.meta.env.BASE_URL) && (
                    <img src={itemIconUrl(r.name, import.meta.env.BASE_URL)!} alt="" width={24} height={24} style={{ imageRendering: "pixelated", flexShrink: 0 }} />
                  )}
                  {tItem(r.name)}
                </div>
              </td>
              <td style={{ ...tdS, textAlign: "right", color: RO.cost }}>{fmt(cost)}z</td>
              <td style={{ ...tdS, textAlign: "center", color: rate >= 80 ? RO.rateGood : rate >= 50 ? RO.rateMed : RO.rateBad }}>{rate.toFixed(1)}%</td>
              <td style={tdS}><Ni val={sell} onChange={v => setSellPrices(p => ({ ...p, [r.name]: v }))} w="70px" /></td>
              <td style={{ ...tdS, textAlign: "right", fontWeight: 700, color: prof >= 0 && sell > 0 ? RO.profit : RO.loss }}>{rate > 0 && sell > 0 ? fmtZ(prof) : "-"}</td>
              <td style={tdS}><button onClick={() => setDetail(r)} style={{ ...raised, background: RO.panelAlt, color: RO.textMid, cursor: "pointer", padding: "2px 8px", fontSize: 11 }}>{u.detail}</button></td>
            </tr>
          );
        })}
      </tbody>
    </table>

    {/* PC FORMULA */}
    <div style={{ ...sunken, background: "#e4eef8", marginTop: 10 }}>
      <div style={{ background: RO.titleBg, color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 8px", display: "flex", justifyContent: "space-between" }}>
        <span>{u.formulaTitle} — Pharmacy</span>
        <span style={{ fontWeight: 400, opacity: 0.8 }}>{u.formulaSource}</span>
      </div>
      <div style={{ padding: "8px 12px", color: RO.text, overflowX: "auto" }}>
        <div style={{ textAlign: "center" }}>
          <Tex display tex={`\\begin{aligned} \\text{Rate} ={} &(\\text{PrepPot}\\times 3) + \\text{PotRes} + \\text{InstChange} + (\\text{JobLv}\\times 0.2) \\\\ &+ (\\text{DEX}\\times 0.1) + (\\text{LUK}\\times 0.1) + (\\text{INT}\\times 0.05) + \\text{PotionRate} \\end{aligned}`} />
        </div>
        <div style={{ color: RO.titleBg, margin: "6px 0 2px", fontSize: 12, fontWeight: 700, borderTop: `1px solid ${RO.rowBorder}`, paddingTop: 6 }}>{u.formulaWithStats}</div>
        <div style={{ textAlign: "center" }}>
          <Tex display tex={`${stats.PreparePotion_Lv * 3} + ${stats.PotionResearch_Lv} + ${stats.InstructionChange_Lv} + ${(stats.JobLv * 0.2).toFixed(1)} + ${(DEX * 0.1).toFixed(1)} + ${(LUK * 0.1).toFixed(1)} + ${(INT * 0.05).toFixed(2)} = \\mathbf{${pcBaseRate.toFixed(2)}}`} />
        </div>
        <div style={{ textAlign: "center" }}>
          <Tex display tex={`\\text{Rate} = \\mathbf{${pcBaseRate.toFixed(2)}} + \\text{PotionRate}`} />
        </div>
        <div style={{ color: RO.textMuted, fontSize: 10, textAlign: "center", marginTop: 2 }}>({u.formulaClamp})</div>
      </div>
    </div>
  </div>
);
