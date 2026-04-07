import type { Dispatch, SetStateAction } from "react";
import type { Stats } from "../lib/formulas";
import { getMCCreation, getMCQty } from "../lib/formulas";
import type { UiStrings } from "../lib/i18n";
import type { PCRecipe, SPRecipe, MCRecipe } from "../lib/data";
import { MC_RECIPES, itemIconUrl } from "../lib/data";
import { RO, sunken, raised, thS, tdS } from "../lib/theme";
import { Ni } from "./Ni";
import { Tex } from "./Tex";

interface MixCookingTabProps {
  stats: Stats;
  getPrice: (n: string) => number;
  sellPrices: Record<string, number>;
  setSellPrices: Dispatch<SetStateAction<Record<string, number>>>;
  setDetail: (r: PCRecipe | SPRecipe | MCRecipe | null) => void;
  u: UiStrings;
  tItem: (name: string) => string;
  fmt: (n: number) => string;
  fmtZ: (n: number) => string;
  DEX: number;
  LUK: number;
}

export const MixCookingTab = ({
  stats,
  getPrice,
  sellPrices,
  setSellPrices,
  setDetail,
  u,
  tItem,
  fmt,
  fmtZ,
  DEX,
  LUK,
}: MixCookingTabProps) => {
  const creation = getMCCreation(stats);

  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <img src={`${import.meta.env.BASE_URL}assets/icons/skills/mix-cooking.png`} alt="" width={24} height={24} style={{ imageRendering: "pixelated" }} />
        <span style={{ fontWeight: 700, fontSize: 13, color: RO.text }}>{u.mcTitle}</span>
      </div>
      <p style={{ fontSize: 11, color: RO.textMuted, margin: "0 0 6px" }}>{u.mcSubtitle}</p>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead><tr>
          <th style={thS}>{u.colPotion}</th>
          <th style={thS}>{u.colCost}</th>
          <th style={thS}>{u.colQty}</th>
          <th style={thS}>{u.colCpu}</th>
          <th style={thS}>{u.colSellU}</th>
          <th style={thS}>{u.colProfit}</th>
          <th style={thS}></th>
        </tr></thead>
        <tbody>
          {MC_RECIPES.map((r, ri) => {
            const qP = getMCQty(creation, 150, r.itemRate, 0);
            const qA = getMCQty(creation, 90,  r.itemRate, 1);
            const qO = getMCQty(creation, 30,  r.itemRate, 2);
            const cost = r.ingredients.reduce((s, i) => s + i.q * getPrice(i.n), 0);
            const cpu = qA > 0 ? Math.round(cost / qA) : 0;
            const sell = sellPrices[r.name] || 0;
            const profLot = sell * qA - cost;
            return (
              <tr key={ri} style={{ background: ri % 2 ? RO.row2 : RO.row1, borderBottom: `1px solid ${RO.rowBorder}` }}>
                <td style={{ ...tdS, fontWeight: 700, color: RO.text, whiteSpace: "nowrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    {itemIconUrl(r.name, import.meta.env.BASE_URL) && (
                      <img src={itemIconUrl(r.name, import.meta.env.BASE_URL)!} alt="" width={24} height={24} style={{ imageRendering: "pixelated", flexShrink: 0 }} />
                    )}
                    {tItem(r.name)}
                  </div>
                  <div style={{ fontSize: 10, color: RO.textMuted, fontWeight: 400 }}>
                    {u.pessimistic}: {qP} | {u.expected}: {qA} | {u.optimistic}: {qO}
                  </div>
                </td>
                <td style={{ ...tdS, textAlign: "right", color: RO.cost }}>{fmt(cost)}z</td>
                <td style={{ ...tdS, textAlign: "center", fontWeight: 700, color: qA >= 10 ? RO.rateGood : qA >= 8 ? RO.rateMed : qA > 0 ? RO.rateBad : RO.loss }}>
                  {qA > 0 ? qA : u.mcFailure}
                </td>
                <td style={{ ...tdS, textAlign: "right", color: RO.textMid }}>{qA > 0 ? fmt(cpu) + "z" : "-"}</td>
                <td style={tdS}><Ni val={sell} onChange={v => setSellPrices(p => ({ ...p, [r.name]: v }))} w="70px" /></td>
                <td style={{ ...tdS, textAlign: "right", fontWeight: 700, color: profLot >= 0 && sell > 0 ? RO.profit : RO.loss }}>
                  {sell > 0 ? fmtZ(profLot) : "-"}
                  <div style={{ fontSize: 10, fontWeight: 400, color: RO.textMuted }}>/u: {sell > 0 && qA > 0 ? fmtZ(sell - cpu) : "-"}</div>
                </td>
                <td style={tdS}>
                  <button onClick={() => setDetail(r)} style={{ ...raised, background: RO.panelAlt, color: RO.textMid, cursor: "pointer", padding: "2px 8px", fontSize: 11 }}>{u.detail}</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* MC FORMULA */}
      <div style={{ ...sunken, background: "#e4eef8", marginTop: 10 }}>
        <div style={{ background: RO.titleBg, color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 8px", display: "flex", justifyContent: "space-between" }}>
          <span>{u.formulaTitle} — Mix Cooking</span>
          <span style={{ fontWeight: 400, opacity: 0.8 }}>{u.formulaSource}</span>
        </div>
        <div style={{ padding: "8px 12px", color: RO.text, display: "flex", gap: 24, flexWrap: "wrap" }}>

          <div style={{ flex: "1 1 300px", overflowX: "auto" }}>
            <div style={{ textAlign: "center" }}>
              <Tex display tex={`\\text{Creation} = \\left\\lfloor\\dfrac{\\text{JobLv}}{4}\\right\\rfloor + \\left\\lfloor\\dfrac{\\text{DEX}}{3}\\right\\rfloor + \\left\\lfloor\\dfrac{\\text{LUK}}{2}\\right\\rfloor`} />
            </div>
            <div style={{ textAlign: "center", marginTop: 4 }}>
              <Tex display tex={`\\text{Difficulty} = \\text{Rand}[30,150] + \\text{ItemRate}`} />
            </div>
            <div style={{ color: RO.titleBg, margin: "6px 0 2px", fontSize: 12, fontWeight: 700, borderTop: `1px solid ${RO.rowBorder}`, paddingTop: 6 }}>{u.formulaWithStats}</div>
            <div style={{ textAlign: "center" }}>
              <Tex display tex={`\\left\\lfloor${stats.JobLv}/4\\right\\rfloor + \\left\\lfloor${DEX}/3\\right\\rfloor + \\left\\lfloor${LUK}/2\\right\\rfloor = \\mathbf{${creation}}`} />
            </div>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", margin: "4px 0" }}>
              <span style={{ color: RO.rateBad,  fontWeight: 700, fontSize: 11 }}>Pess: Δ={creation - 165}</span>
              <span style={{ color: RO.rateMed,  fontWeight: 700, fontSize: 11 }}>Avg: Δ={creation - 105}</span>
              <span style={{ color: RO.rateGood, fontWeight: 700, fontSize: 11 }}>Opt: Δ={creation - 45}</span>
            </div>
          </div>

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
                {([["≥ 30", "10–12"], ["≥ 10", "10"], ["> −30", "8"], ["> −50", "5"], ["≤ −50", u.mcFailure]] as [string, string][]).map(([delta, qty], i) => (
                  <tr key={i} style={{ background: i % 2 ? RO.row2 : RO.row1 }}>
                    <td style={{ padding: "2px 8px" }}>{delta}</td>
                    <td style={{ padding: "2px 8px", textAlign: "center", fontWeight: 700 }}>{qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};
