import type { Dispatch, SetStateAction } from "react";
import type { Stats } from "../lib/formulas";
import { getSPQty } from "../lib/formulas";
import type { UiStrings } from "../lib/i18n";
import type { PCRecipe, SPRecipe } from "../lib/data";
import { SP_RECIPES, itemIconUrl } from "../lib/data";
import { RO, sunken, raised, thS, tdS } from "../lib/theme";
import { Ni } from "./Ni";
import { Tex } from "./Tex";

interface SpecialPharmacyTabProps {
  stats: Stats;
  getPrice: (n: string) => number;
  sellPrices: Record<string, number>;
  setSellPrices: Dispatch<SetStateAction<Record<string, number>>>;
  setDetail: (r: PCRecipe | SPRecipe | null) => void;
  u: UiStrings;
  tItem: (name: string) => string;
  fmt: (n: number) => string;
  fmtZ: (n: number) => string;
  spCreationPess: number;
  spCreationAvg: number;
  spCreationOpt: number;
  specificVal: number;
  maxPot: number;
  sklv: number;
  INT: number;
  DEX: number;
  LUK: number;
}

export const SpecialPharmacyTab = ({
  stats,
  getPrice,
  sellPrices,
  setSellPrices,
  setDetail,
  u,
  tItem,
  fmt,
  fmtZ,
  spCreationPess,
  spCreationAvg,
  spCreationOpt,
  specificVal,
  maxPot,
  sklv,
  INT,
  DEX,
  LUK,
}: SpecialPharmacyTabProps) => {
  const spBase = INT + Math.floor(DEX / 2) + LUK + stats.JobLv + (stats.BaseLv - 100) + (stats.PotionResearch_Lv * 5);

  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <img src={`${import.meta.env.BASE_URL}assets/icons/skills/special-pharmacy.png`} alt="" width={24} height={24} style={{ imageRendering: "pixelated" }} />
        <span style={{ fontWeight: 700, fontSize: 13, color: RO.text }}>{u.spTitle}</span>
      </div>
      <p style={{ fontSize: 11, color: RO.textMuted, margin: "0 0 6px" }}>{u.spSubtitle}</p>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead><tr>
          <th style={thS}>{u.colPotion}</th><th style={thS}>{u.colCost}</th><th style={thS}>{u.colQty}</th><th style={thS}>{u.colCpu}</th><th style={thS}>{u.colSellU}</th><th style={thS}>{u.colProfit}</th><th style={thS}></th>
        </tr></thead>
        <tbody>
          {SP_RECIPES.map((r, ri) => {
            const qty = getSPQty(spCreationAvg, specificVal, r.itemRate, maxPot);
            const cost = r.ingredients.reduce((s, i) => s + i.q * getPrice(i.n), 0);
            const cpu = qty > 0 ? Math.round(cost / qty) : 0;
            const sell = sellPrices[r.name] || 0;
            const profLot = sell * qty - cost;
            return (
              <tr key={ri} style={{ background: ri % 2 ? RO.row2 : RO.row1, borderBottom: `1px solid ${RO.rowBorder}` }}>
                <td style={{ ...tdS, fontWeight: 700, color: RO.text, whiteSpace: "nowrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    {itemIconUrl(r.name, import.meta.env.BASE_URL) && (
                      <img src={itemIconUrl(r.name, import.meta.env.BASE_URL)!} alt="" width={24} height={24} style={{ imageRendering: "pixelated", flexShrink: 0 }} />
                    )}
                    {tItem(r.name)}
                  </div>
                  <div style={{ fontSize: 10, color: RO.textMuted, fontWeight: 400 }}>Rate:{r.itemRate}</div>
                </td>
                <td style={{ ...tdS, textAlign: "right", color: RO.cost }}>{fmt(cost)}z</td>
                <td style={{ ...tdS, textAlign: "center", fontWeight: 700, color: qty >= maxPot ? RO.rateGood : qty >= maxPot - 3 ? RO.rateMed : RO.rateBad }}>{qty}</td>
                <td style={{ ...tdS, textAlign: "right", color: RO.textMid }}>{fmt(cpu)}z</td>
                <td style={tdS}><Ni val={sell} onChange={v => setSellPrices(p => ({ ...p, [r.name]: v }))} w="70px" /></td>
                <td style={{ ...tdS, textAlign: "right", fontWeight: 700, color: profLot >= 0 && sell > 0 ? RO.profit : RO.loss }}>{sell > 0 ? fmtZ(profLot) : "-"}<div style={{ fontSize: 10, fontWeight: 400, color: RO.textMuted }}>/u: {sell > 0 ? fmtZ(sell - cpu) : "-"}</div></td>
                <td style={tdS}><button onClick={() => setDetail(r)} style={{ ...raised, background: RO.panelAlt, color: RO.textMid, cursor: "pointer", padding: "2px 8px", fontSize: 11 }}>{u.detail}</button></td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* SP FORMULA */}
      <div style={{ ...sunken, background: "#e4eef8", marginTop: 10 }}>
        <div style={{ background: RO.titleBg, color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 8px", display: "flex", justifyContent: "space-between" }}>
          <span>{u.formulaTitle} — Special Pharmacy</span>
          <span style={{ fontWeight: 400, opacity: 0.8 }}>{u.formulaSource}</span>
        </div>
        <div style={{ padding: "8px 12px", color: RO.text, display: "flex", gap: 24, flexWrap: "wrap" }}>

          {/* Creation */}
          <div style={{ flex: "1 1 340px", overflowX: "auto" }}>
            <div style={{ textAlign: "center" }}>
              <Tex display tex={`\\begin{aligned} \\text{Creation} ={} &\\text{INT} + \\left\\lfloor\\dfrac{\\text{DEX}}{2}\\right\\rfloor + \\text{LUK} + \\text{JobLv} + \\text{Rand}[30,150] \\\\ &+ (\\text{BaseLv}-100) + (\\text{PotRes}\\times 5) + (\\text{FCP}\\times\\text{Rand}[4,10]) \\end{aligned}`} />
            </div>
            <div style={{ color: RO.titleBg, margin: "6px 0 2px", fontSize: 12, fontWeight: 700, borderTop: `1px solid ${RO.rowBorder}`, paddingTop: 6 }}>{u.formulaWithStats}</div>
            <div style={{ textAlign: "center" }}>
              <Tex display tex={`${INT} + \\left\\lfloor${DEX}/2\\right\\rfloor + ${LUK} + ${stats.JobLv} + (${stats.BaseLv}-100) + (${stats.PotionResearch_Lv}\\times 5) = ${spBase}`} />
            </div>
            <div style={{ textAlign: "center" }}>
              <Tex display tex={`\\text{Creation} = ${spBase} + [${stats.FCP_Lv * 4 + 30}\\text{--}${stats.FCP_Lv * 10 + 150}]`} />
            </div>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", margin: "2px 0 8px" }}>
              <span style={{ color: RO.rateBad, fontWeight: 700, fontSize: 11 }}>Pess: {Math.round(spCreationPess)}</span>
              <span style={{ color: RO.rateMed, fontWeight: 700, fontSize: 11 }}>Avg: {Math.round(spCreationAvg)}</span>
              <span style={{ color: RO.rateGood, fontWeight: 700, fontSize: 11 }}>Opt: {Math.round(spCreationOpt)}</span>
            </div>
            <div style={{ textAlign: "center" }}>
              <Tex display tex={`\\text{SpecificValue} = 620 - 20\\times\\text{SpecPharm Lv} = 620 - 20\\times ${sklv} = \\mathbf{${specificVal}}`} />
            </div>
            <div style={{ textAlign: "center" }}>
              <Tex display tex={`\\text{Difficulty} = \\mathbf{${specificVal}} + \\text{ItemRate}`} />
            </div>
          </div>

          {/* Delta table */}
          <div style={{ flex: "0 0 auto" }}>
            <div style={{ color: RO.textMuted, marginBottom: 4 }}>{u.formulaQtyTable}</div>
            <table style={{ borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr style={{ background: RO.panelAlt }}>
                  <th style={{ padding: "2px 8px", borderBottom: `1px solid ${RO.rowBorder}`, textAlign: "left" }}>Δ (Creation − Difficulty)</th>
                  <th style={{ padding: "2px 8px", borderBottom: `1px solid ${RO.rowBorder}`, textAlign: "center" }}>Qty</th>
                </tr>
              </thead>
              <tbody>
                {([["≥ 400", maxPot], ["≥ 300", maxPot - 3], ["≥ 100", maxPot - 4], ["≥ 1", maxPot - 5], ["< 0", Math.max(1, maxPot - 6)]] as [string, number][]).map(([delta, qty], i) => (
                  <tr key={i} style={{ background: i % 2 ? RO.row2 : RO.row1 }}>
                    <td style={{ padding: "2px 8px" }}>{delta}</td>
                    <td style={{ padding: "2px 8px", textAlign: "center", fontWeight: 700 }}>{qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ color: RO.textMuted, marginTop: 4 }}>Max (SpecPharm Lv {sklv}) = {maxPot}</div>
          </div>

        </div>
      </div>
    </div>
  );
};
