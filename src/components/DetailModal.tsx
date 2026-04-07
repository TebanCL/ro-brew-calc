import type { Dispatch, SetStateAction } from "react";
import type { Stats } from "../lib/formulas";
import { getBrewRate, getSPQty, getMCCreation, getMCQty } from "../lib/formulas";
import type { UiStrings } from "../lib/i18n";
import type { PCRecipe, SPRecipe, MCRecipe } from "../lib/data";
import { itemIconUrl } from "../lib/data";
import { RO, raised } from "../lib/theme";
import { Ni } from "./Ni";
import { MiniBar } from "./MiniBar";

interface DetailModalProps {
  detail: PCRecipe | SPRecipe | MCRecipe | null;
  setDetail: (r: PCRecipe | SPRecipe | MCRecipe | null) => void;
  tItem: (name: string) => string;
  u: UiStrings;
  fmt: (n: number) => string;
  getPrice: (n: string) => number;
  stats: Stats;
  spCreationPess: number;
  spCreationAvg: number;
  spCreationOpt: number;
  specificVal: number;
  maxPot: number;
  pcBaseRate: number;
  rowLabels: [string, string, string];
  sellPrices: Record<string, number>;
  setSellPrices: Dispatch<SetStateAction<Record<string, number>>>;
}

export const DetailModal = ({
  detail,
  setDetail,
  tItem,
  u,
  fmt,
  getPrice,
  stats,
  spCreationPess,
  spCreationAvg,
  spCreationOpt,
  specificVal,
  maxPot,
  pcBaseRate,
  rowLabels,
  sellPrices,
  setSellPrices,
}: DetailModalProps) => {
  if (!detail) return null;
  const r = detail;
  const cost = r.ingredients.reduce((s, i) => s + i.q * getPrice(i.n), 0);
  const sell = sellPrices[r.name] || 0;

  const modalWindow = (title: React.ReactNode, subtitle: string, body: React.ReactNode) => (
    <div style={{ position: "fixed", inset: 0, background: "rgba(5,2,0,0.88)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 12 }} onClick={() => setDetail(null)}>
      <div style={{ ...raised, background: RO.panelBg, maxWidth: 440, width: "100%", maxHeight: "85vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ background: RO.titleBg, padding: "4px 10px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `2px solid ${RO.shadow}` }}>
          {title}
          <button onClick={() => setDetail(null)} style={{ ...raised, background: RO.panelAlt, color: RO.text, fontSize: 12, cursor: "pointer", padding: "1px 7px", fontWeight: 700, lineHeight: 1.2 }}>✕</button>
        </div>
        <div style={{ padding: "10px 12px" }}>
          <div style={{ fontSize: 11, color: RO.textMuted, marginBottom: 6 }}>{subtitle}</div>
          {body}
        </div>
      </div>
    </div>
  );

  const ingredientList = (
    <div style={{ fontSize: 12, marginBottom: 8 }}>
      {r.ingredients.map((i, ii) => (
        <div key={ii} style={{ display: "flex", alignItems: "center", gap: 4, color: RO.textMid }}>
          {itemIconUrl(i.n, import.meta.env.BASE_URL) && (
            <img src={itemIconUrl(i.n, import.meta.env.BASE_URL)!} alt="" width={20} height={20} style={{ imageRendering: "pixelated", flexShrink: 0 }} />
          )}
          {i.q}× {tItem(i.n)} — <span style={{ color: RO.ingColor }}>{fmt(i.q * getPrice(i.n))}z</span>
        </div>
      ))}
      <div style={{ color: RO.cost, fontWeight: 700, marginTop: 4 }}>{u.totalCost}: {fmt(cost)}z</div>
    </div>
  );

  const sellInput = (
    <div style={{ display: "flex", gap: 6, marginBottom: 10, alignItems: "center" }}>
      <span style={{ fontSize: 12, color: RO.textMid }}>{u.sellPerUnit}</span>
      <Ni val={sell} onChange={v => setSellPrices(p => ({ ...p, [r.name]: v }))} w="80px" />
    </div>
  );

  if (r.kind === "sp") {
    const qP = getSPQty(spCreationPess, specificVal, r.itemRate, maxPot);
    const qA = getSPQty(spCreationAvg, specificVal, r.itemRate, maxPot);
    const qO = getSPQty(spCreationOpt, specificVal, r.itemRate, maxPot);
    return modalWindow(
      <h3 style={{ color: RO.titleText, margin: 0, fontSize: 13 }}>{tItem(r.name)}</h3>,
      `${u.itemRate}: ${r.itemRate} | ${u.difficulty}: ${specificVal}+${r.itemRate} = ${specificVal + r.itemRate}`,
      <>{ingredientList}{sellInput}
        <MiniBar pess={Math.round(spCreationPess)} avg={Math.round(spCreationAvg)} opt={Math.round(spCreationOpt)} label={u.creationValue} rowLabels={rowLabels} />
        <MiniBar pess={qP} avg={qA} opt={qO} label={u.qtyProduced} unit=" u" rowLabels={rowLabels} />
        <MiniBar pess={sell * qP - cost} avg={sell * qA - cost} opt={sell * qO - cost} label={u.batchProfit} unit="z" rowLabels={rowLabels} />
      </>
    );
  }

  if (r.kind === "mc") {
    const creation = getMCCreation(stats);
    const qP = getMCQty(creation, 150, r.itemRate, 0);
    const qA = getMCQty(creation, 90,  r.itemRate, 1);
    const qO = getMCQty(creation, 30,  r.itemRate, 2);
    return modalWindow(
      <h3 style={{ color: RO.titleText, margin: 0, fontSize: 13 }}>{tItem(r.name)}</h3>,
      `${u.itemRate}: ${r.itemRate} | ${u.mcCreationLabel}: ${creation}`,
      <>{ingredientList}{sellInput}
        <MiniBar pess={creation - (150 + r.itemRate)} avg={creation - (90 + r.itemRate)} opt={creation - (30 + r.itemRate)} label={`Δ (${u.mcCreationLabel} − ${u.difficulty})`} rowLabels={rowLabels} />
        <MiniBar pess={qP} avg={qA} opt={qO} label={u.qtyProduced} unit=" u" rowLabels={rowLabels} />
        <MiniBar pess={sell * qP - cost} avg={sell * qA - cost} opt={sell * qO - cost} label={u.batchProfit} unit="z" rowLabels={rowLabels} />
      </>
    );
  }

  const rate = getBrewRate(stats, r.potionRate);
  const cps = rate > 0 ? Math.round(cost / (rate / 100)) : 0;
  const prof = sell - cps;
  return modalWindow(
    <h3 style={{ color: RO.titleText, margin: 0, fontSize: 13 }}>{tItem(r.name)}</h3>,
    `${u.potionRate}: ${r.potionRate > 0 ? "+" : ""}${r.potionRate}%`,
    <>{ingredientList}{sellInput}
      <MiniBar pess={Math.max(0, pcBaseRate + r.potionRate)} avg={rate} opt={Math.min(100, rate)} label={u.successRate} unit="%" rowLabels={rowLabels} />
      <MiniBar pess={rate > 0 ? Math.round(cost / (rate / 100)) : 0} avg={cps} opt={rate > 0 ? Math.round(cost / (Math.min(100, rate) / 100)) : 0} label={u.costPerSuccess} unit="z" rowLabels={rowLabels} />
      <MiniBar pess={sell - (rate > 0 ? Math.round(cost / (rate / 100)) : 0)} avg={Math.round(prof)} opt={sell - (rate > 0 ? Math.round(cost / (Math.min(100, rate) / 100)) : 0)} label={u.netProfit} unit="z" rowLabels={rowLabels} />
    </>
  );
};
