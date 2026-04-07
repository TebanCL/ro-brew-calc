import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Stats } from "../lib/formulas";
import { getBrewRate, getSPQty, getMCCreation, getMCQty } from "../lib/formulas";
import type { UiStrings } from "../lib/i18n";
import type { PCRecipe, SPRecipe, MCRecipe } from "../lib/data";
import { itemIconUrl } from "../lib/data";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RoTitleBar } from "./RoTitleBar";
import { Ni } from "./Ni";
import { ScenarioTable } from "./ScenarioTable";

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
  detail, setDetail, tItem, u, fmt, getPrice, stats,
  spCreationPess, spCreationAvg, spCreationOpt,
  specificVal, maxPot, pcBaseRate,
  rowLabels, sellPrices, setSellPrices,
}: DetailModalProps) => {
  const [bulkQty, setBulkQty] = useState(100);
  const r = detail;
  const cost = r ? r.ingredients.reduce((s, i) => s + i.q * getPrice(i.n), 0) : 0;
  const sell = r ? (sellPrices[r.name] || 0) : 0;

  const ingredientList = r ? (
    <div className="text-[12px] mb-2">
      {r.ingredients.map((i, ii) => (
        <div key={ii} className="flex items-center gap-1 text-secondary-foreground">
          {itemIconUrl(i.n, import.meta.env.BASE_URL) && (
            <img src={itemIconUrl(i.n, import.meta.env.BASE_URL)!} alt="" width={20} height={20} style={{ imageRendering: "pixelated", flexShrink: 0 }} />
          )}
          {i.q}× {tItem(i.n)} — <span className="text-ro-ing">{fmt(i.q * getPrice(i.n))}z</span>
        </div>
      ))}
      <div className="text-ro-cost font-bold mt-1">{u.totalCost}: {fmt(cost)}z</div>
    </div>
  ) : null;

  const sellInput = r ? (
    <div className="flex gap-1.5 mb-2.5 items-center">
      <span className="text-[12px] text-secondary-foreground">{u.sellPerUnit}</span>
      <Ni val={sell} onChange={v => setSellPrices(p => ({ ...p, [r.name]: v }))} w="80px" />
    </div>
  ) : null;

  const renderBulkSection = (scenarios: { label: string; crafts: number }[]) => {
    if (!r) return null;
    const multi = scenarios.length > 1;
    return (
      <div className="mt-3 border-t border-border pt-2">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[12px] font-semibold text-foreground">{u.bulkTitle}:</span>
          <Ni val={bulkQty} onChange={setBulkQty} min={1} max={9999} w="64px" />
        </div>
        {scenarios.map(({ label, crafts }, si) => (
          crafts > 0 ? (
            <div key={si} className="mb-2">
              <div className="text-[11px] text-muted-foreground mb-0.5">
                {multi ? `${label} — ` : ""}{u.bulkCrafts}: {crafts}
              </div>
              <div className="text-[12px]">
                {r.ingredients.map((ing, ii) => (
                  <div key={ii} className="flex items-center gap-1 text-secondary-foreground">
                    {itemIconUrl(ing.n, import.meta.env.BASE_URL) && (
                      <img src={itemIconUrl(ing.n, import.meta.env.BASE_URL)!} alt="" width={20} height={20} style={{ imageRendering: "pixelated", flexShrink: 0 }} />
                    )}
                    {crafts * ing.q}× {tItem(ing.n)} — <span className="text-ro-ing">{fmt(crafts * ing.q * getPrice(ing.n))}z</span>
                  </div>
                ))}
                <div className="text-ro-cost font-bold mt-0.5">
                  {u.bulkTotalCost}: {fmt(r.ingredients.reduce((s, ing) => s + crafts * ing.q * getPrice(ing.n), 0))}z
                </div>
              </div>
            </div>
          ) : null
        ))}
      </div>
    );
  };

  const renderBody = () => {
    if (!r) return null;

    if (r.kind === "sp") {
      const qP = getSPQty(spCreationPess, specificVal, r.itemRate, maxPot);
      const qA = getSPQty(spCreationAvg,  specificVal, r.itemRate, maxPot);
      const qO = getSPQty(spCreationOpt,  specificVal, r.itemRate, maxPot);
      return (
        <>
          <p className="text-[11px] text-muted-foreground mb-1.5">{u.itemRate}: {r.itemRate} | {u.difficulty}: {specificVal}+{r.itemRate} = {specificVal + r.itemRate}</p>
          {ingredientList}{sellInput}
          <ScenarioTable
            colLabels={rowLabels}
            rows={[
              { label: u.creationValue, vals: [Math.round(spCreationPess), Math.round(spCreationAvg), Math.round(spCreationOpt)], fmt: v => String(v) },
              { label: u.qtyProduced,   vals: [qP, qA, qO],                                                                       fmt: v => `${v} u` },
              { label: u.batchProfit,   vals: [sell * qP - cost, sell * qA - cost, sell * qO - cost],                             fmt: v => `${fmt(v)}z`, sign: true },
            ]}
          />
          {renderBulkSection([
            { label: rowLabels[0], crafts: qP > 0 ? Math.ceil(bulkQty / qP) : 0 },
            { label: rowLabels[1], crafts: qA > 0 ? Math.ceil(bulkQty / qA) : 0 },
            { label: rowLabels[2], crafts: qO > 0 ? Math.ceil(bulkQty / qO) : 0 },
          ])}
        </>
      );
    }

    if (r.kind === "mc") {
      const creation = getMCCreation(stats);
      const qP = getMCQty(creation, 150, r.itemRate, 0);
      const qA = getMCQty(creation, 90,  r.itemRate, 1);
      const qO = getMCQty(creation, 30,  r.itemRate, 2);
      const deltaLabel = `Δ (${u.mcCreationLabel} − ${u.difficulty})`;
      return (
        <>
          <p className="text-[11px] text-muted-foreground mb-1.5">{u.itemRate}: {r.itemRate} | {u.mcCreationLabel}: {creation}</p>
          {ingredientList}{sellInput}
          <ScenarioTable
            colLabels={rowLabels}
            rows={[
              { label: deltaLabel,    vals: [creation - (150 + r.itemRate), creation - (90 + r.itemRate), creation - (30 + r.itemRate)], fmt: v => String(v), sign: true },
              { label: u.qtyProduced, vals: [qP, qA, qO],                                                                                fmt: v => `${v} u` },
              { label: u.batchProfit, vals: [sell * qP - cost, sell * qA - cost, sell * qO - cost],                                      fmt: v => `${fmt(v)}z`, sign: true },
            ]}
          />
          {renderBulkSection([
            { label: rowLabels[0], crafts: qP > 0 ? Math.ceil(bulkQty / qP) : 0 },
            { label: rowLabels[1], crafts: qA > 0 ? Math.ceil(bulkQty / qA) : 0 },
            { label: rowLabels[2], crafts: qO > 0 ? Math.ceil(bulkQty / qO) : 0 },
          ])}
        </>
      );
    }

    // PC
    const rate    = getBrewRate(stats, r.potionRate);
    const ratePess = Math.max(0, pcBaseRate + r.potionRate);
    const rateOpt  = Math.min(100, rate);
    const cpsPess  = ratePess > 0 ? Math.round(cost / (ratePess / 100)) : 0;
    const cps      = rate     > 0 ? Math.round(cost / (rate     / 100)) : 0;
    const cpsOpt   = rateOpt  > 0 ? Math.round(cost / (rateOpt  / 100)) : 0;
    const bulkCrafts = rate > 0 ? Math.ceil(bulkQty / (rate / 100)) : 0;
    return (
      <>
        <p className="text-[11px] text-muted-foreground mb-1.5">{u.potionRate}: {r.potionRate > 0 ? "+" : ""}{r.potionRate}%</p>
        {ingredientList}{sellInput}
        <ScenarioTable
          colLabels={rowLabels}
          rows={[
            { label: u.successRate,   vals: [ratePess, rate, rateOpt],                fmt: v => `${v.toFixed(1)}%` },
            { label: u.costPerSuccess, vals: [cpsPess, cps, cpsOpt],                  fmt: v => `${fmt(v)}z` },
            { label: u.netProfit,      vals: [sell - cpsPess, sell - cps, sell - cpsOpt], fmt: v => `${fmt(v)}z`, sign: true },
          ]}
        />
        {renderBulkSection([{ label: "", crafts: bulkCrafts }])}
      </>
    );
  };

  return (
    <Dialog open={!!detail} onOpenChange={open => { if (!open) setDetail(null); }}>
      <DialogContent className="ro-raised bg-card p-0 max-w-[440px] max-h-[85vh] overflow-y-auto rounded-none border-0 gap-0 [&>button]:hidden">
        <DialogHeader className="p-0 space-y-0">
          <RoTitleBar right={
            <Button
              variant="ghost"
              size="icon"
              className="ro-raised bg-secondary text-foreground h-auto w-auto px-2 py-0 text-[12px] font-bold rounded-none hover:bg-secondary"
              onClick={() => setDetail(null)}
            >✕</Button>
          }>
            <DialogTitle className="text-primary-foreground text-[13px] font-semibold m-0">
              {r ? tItem(r.name) : ""}
            </DialogTitle>
          </RoTitleBar>
        </DialogHeader>
        <div className="px-3 py-2.5">
          {renderBody()}
        </div>
      </DialogContent>
    </Dialog>
  );
};
