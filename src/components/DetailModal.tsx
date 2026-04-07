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
  detail, setDetail, tItem, u, fmt, getPrice, stats,
  spCreationPess, spCreationAvg, spCreationOpt,
  specificVal, maxPot, pcBaseRate,
  rowLabels, sellPrices, setSellPrices,
}: DetailModalProps) => {
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
      return (
        <>
          <p className="text-[11px] text-muted-foreground mb-1.5">{u.itemRate}: {r.itemRate} | {u.mcCreationLabel}: {creation}</p>
          {ingredientList}{sellInput}
          <MiniBar pess={creation - (150 + r.itemRate)} avg={creation - (90 + r.itemRate)} opt={creation - (30 + r.itemRate)} label={`Δ (${u.mcCreationLabel} − ${u.difficulty})`} rowLabels={rowLabels} />
          <MiniBar pess={qP} avg={qA} opt={qO} label={u.qtyProduced} unit=" u" rowLabels={rowLabels} />
          <MiniBar pess={sell * qP - cost} avg={sell * qA - cost} opt={sell * qO - cost} label={u.batchProfit} unit="z" rowLabels={rowLabels} />
        </>
      );
    }

    // PC
    const rate = getBrewRate(stats, r.potionRate);
    const cps  = rate > 0 ? Math.round(cost / (rate / 100)) : 0;
    const prof = sell - cps;
    return (
      <>
        <p className="text-[11px] text-muted-foreground mb-1.5">{u.potionRate}: {r.potionRate > 0 ? "+" : ""}{r.potionRate}%</p>
        {ingredientList}{sellInput}
        <MiniBar pess={Math.max(0, pcBaseRate + r.potionRate)} avg={rate} opt={Math.min(100, rate)} label={u.successRate} unit="%" rowLabels={rowLabels} />
        <MiniBar pess={rate > 0 ? Math.round(cost / (rate / 100)) : 0} avg={cps} opt={rate > 0 ? Math.round(cost / (Math.min(100, rate) / 100)) : 0} label={u.costPerSuccess} unit="z" rowLabels={rowLabels} />
        <MiniBar pess={sell - (rate > 0 ? Math.round(cost / (rate / 100)) : 0)} avg={Math.round(prof)} opt={sell - (rate > 0 ? Math.round(cost / (Math.min(100, rate) / 100)) : 0)} label={u.netProfit} unit="z" rowLabels={rowLabels} />
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
