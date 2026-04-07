import type { Dispatch, SetStateAction } from "react";
import type { Stats } from "../lib/formulas";
import { getMCCreation, getMCQty } from "../lib/formulas";
import type { UiStrings } from "../lib/i18n";
import type { PCRecipe, SPRecipe, MCRecipe } from "../lib/data";
import { MC_RECIPES, itemIconUrl } from "../lib/data";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RoTitleBar } from "./RoTitleBar";
import { cn } from "@/lib/utils";
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
  stats, getPrice, sellPrices, setSellPrices, setDetail,
  u, tItem, fmt, fmtZ, DEX, LUK,
}: MixCookingTabProps) => {
  const creation = getMCCreation(stats);

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <img src={`${import.meta.env.BASE_URL}assets/icons/skills/mix-cooking.png`} alt="" width={24} height={24} style={{ imageRendering: "pixelated" }} />
        <span className="font-bold text-[13px] text-foreground">{u.mcTitle}</span>
      </div>
      <p className="text-[11px] text-muted-foreground mb-1.5">{u.mcSubtitle}</p>

      <Table className="ro-table text-[12px]">
        <TableHeader>
          <TableRow className="border-0 hover:bg-transparent">
            {[u.colPotion, u.colCost, u.colQty, u.colCpu, u.colSellU, u.colProfit, ""].map((h, i) => (
              <TableHead key={i} className="bg-primary text-primary-foreground text-[11px] font-bold px-1.5 py-1 whitespace-nowrap border-r border-r-[var(--ro-shadow)] last:border-r-0 h-auto">
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {MC_RECIPES.map((r, ri) => {
            const qP = getMCQty(creation, 150, r.itemRate, 0);
            const qA = getMCQty(creation, 90,  r.itemRate, 1);
            const qO = getMCQty(creation, 30,  r.itemRate, 2);
            const cost = r.ingredients.reduce((s, i) => s + i.q * getPrice(i.n), 0);
            const cpu = qA > 0 ? Math.round(cost / qA) : 0;
            const sell = sellPrices[r.name] || 0;
            const profLot = sell * qA - cost;
            return (
              <TableRow key={ri} className={cn("border-0", ri % 2 === 0 ? "bg-muted" : "bg-accent")}>
                <TableCell className="px-1.5 py-1 font-bold text-foreground whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    {itemIconUrl(r.name, import.meta.env.BASE_URL) && (
                      <img src={itemIconUrl(r.name, import.meta.env.BASE_URL)!} alt="" width={24} height={24} style={{ imageRendering: "pixelated", flexShrink: 0 }} />
                    )}
                    {tItem(r.name)}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-normal">
                    {u.pessimistic}: {qP} | {u.expected}: {qA} | {u.optimistic}: {qO}
                  </div>
                </TableCell>
                <TableCell className="px-1.5 py-1 text-right text-ro-cost">{fmt(cost)}z</TableCell>
                <TableCell className={cn("px-1.5 py-1 text-center font-bold",
                  qA >= 10 ? "text-ro-rate-good" : qA >= 8 ? "text-ro-rate-med" : qA > 0 ? "text-ro-rate-bad" : "text-ro-loss"
                )}>
                  {qA > 0 ? qA : u.mcFailure}
                </TableCell>
                <TableCell className="px-1.5 py-1 text-right text-secondary-foreground">
                  {qA > 0 ? fmt(cpu) + "z" : "-"}
                </TableCell>
                <TableCell className="px-1.5 py-1">
                  <Ni val={sell} onChange={v => setSellPrices(p => ({ ...p, [r.name]: v }))} w="70px" />
                </TableCell>
                <TableCell className={cn("px-1.5 py-1 text-right font-bold", profLot >= 0 && sell > 0 ? "text-ro-profit" : "text-ro-loss")}>
                  {sell > 0 ? fmtZ(profLot) : "-"}
                  <div className="text-[10px] font-normal text-muted-foreground">/u: {sell > 0 && qA > 0 ? fmtZ(sell - cpu) : "-"}</div>
                </TableCell>
                <TableCell className="px-1.5 py-1">
                  <Button variant="ro" size="ro" onClick={() => setDetail(r)}>{u.detail}</Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* MC FORMULA */}
      <div className="ro-sunken bg-[#e4eef8] mt-2.5">
        <RoTitleBar right={u.formulaSource}>{u.formulaTitle} — Mix Cooking</RoTitleBar>
        <div className="px-3 py-2 text-foreground flex gap-6 flex-wrap">

          <div className="flex-[1_1_300px] overflow-x-auto">
            <div className="text-center">
              <Tex display tex={`\\text{Creation} = \\left\\lfloor\\dfrac{\\text{JobLv}}{4}\\right\\rfloor + \\left\\lfloor\\dfrac{\\text{DEX}}{3}\\right\\rfloor + \\left\\lfloor\\dfrac{\\text{LUK}}{2}\\right\\rfloor`} />
            </div>
            <div className="text-center mt-1">
              <Tex display tex={`\\text{Difficulty} = \\text{Rand}[30,150] + \\text{ItemRate}`} />
            </div>
            <div className="text-primary text-[12px] font-bold border-t border-border pt-1.5 mt-1.5">{u.formulaWithStats}</div>
            <div className="text-center">
              <Tex display tex={`\\left\\lfloor${stats.JobLv}/4\\right\\rfloor + \\left\\lfloor${DEX}/3\\right\\rfloor + \\left\\lfloor${LUK}/2\\right\\rfloor = \\mathbf{${creation}}`} />
            </div>
            <div className="flex gap-4 justify-center flex-wrap my-1">
              <span className="text-ro-rate-bad font-bold text-[11px]">Pess: Δ={creation - 165}</span>
              <span className="text-ro-rate-med font-bold text-[11px]">Avg: Δ={creation - 105}</span>
              <span className="text-ro-rate-good font-bold text-[11px]">Opt: Δ={creation - 45}</span>
            </div>
          </div>

          <div className="flex-none">
            <div className="text-muted-foreground mb-1">{u.formulaQtyTable}</div>
            <table className="border-collapse text-[11px]">
              <thead>
                <tr className="bg-secondary">
                  <th className="px-2 py-0.5 border-b border-border text-left">Δ (Creation − Difficulty)</th>
                  <th className="px-2 py-0.5 border-b border-border text-center">Qty</th>
                </tr>
              </thead>
              <tbody>
                {([["≥ 30", "10–12"], ["≥ 10", "10"], ["> −30", "8"], ["> −50", "5"], ["≤ −50", u.mcFailure]] as [string, string][]).map(([delta, qty], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-muted" : "bg-accent"}>
                    <td className="px-2 py-0.5">{delta}</td>
                    <td className="px-2 py-0.5 text-center font-bold">{qty}</td>
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
