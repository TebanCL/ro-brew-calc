import { useState, Fragment } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Stats } from "../lib/formulas";
import { getSPQty } from "../lib/formulas";
import type { UiStrings } from "../lib/i18n";
import type { PCRecipe, SPRecipe } from "../lib/data";
import { SP_RECIPES, itemIconUrl } from "../lib/data";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RoTitleBar } from "./RoTitleBar";
import { cn } from "@/lib/utils";
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
  stats, getPrice, sellPrices, setSellPrices, setDetail,
  u, tItem, fmt, fmtZ,
  spCreationPess, spCreationAvg, spCreationOpt,
  specificVal, maxPot, sklv, INT, DEX, LUK,
}: SpecialPharmacyTabProps) => {
  const spBase = INT + Math.floor(DEX / 2) + LUK + stats.JobLv + (stats.BaseLv - 100) + (stats.PotionResearch_Lv * 5);
  const [openRows, setOpenRows] = useState<Set<string>>(new Set());
  const toggle = (name: string) => setOpenRows(prev => {
    const s = new Set(prev);
    if (s.has(name)) s.delete(name); else s.add(name);
    return s;
  });

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <img src={`${import.meta.env.BASE_URL}assets/icons/skills/special-pharmacy.png`} alt="" width={24} height={24} style={{ imageRendering: "pixelated" }} />
        <span className="font-bold text-[13px] text-foreground">{u.spTitle}</span>
      </div>
      <p className="text-[11px] text-muted-foreground mb-1.5">{u.spSubtitle}</p>

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
          {SP_RECIPES.map((r, ri) => {
            const qty = getSPQty(spCreationAvg, specificVal, r.itemRate, maxPot);
            const cost = r.ingredients.reduce((s, i) => s + i.q * getPrice(i.n), 0);
            const cpu = qty > 0 ? Math.round(cost / qty) : 0;
            const sell = sellPrices[r.name] || 0;
            const profLot = sell * qty - cost;
            const isOpen = openRows.has(r.name);
            const rowBg = ri % 2 === 0 ? "bg-muted" : "bg-accent";
            return (
              <Fragment key={ri}>
                <TableRow className={cn("border-0", rowBg)}>
                  <TableCell
                    className="px-1.5 py-1 font-bold text-foreground whitespace-nowrap cursor-pointer select-none"
                    onClick={() => toggle(r.name)}
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-muted-foreground w-2.5 inline-block">{isOpen ? "▾" : "▸"}</span>
                      {itemIconUrl(r.name, import.meta.env.BASE_URL) && (
                        <img src={itemIconUrl(r.name, import.meta.env.BASE_URL)!} alt="" width={24} height={24} style={{ imageRendering: "pixelated", flexShrink: 0 }} />
                      )}
                      {tItem(r.name)}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-normal pl-3.5">Rate:{r.itemRate}</div>
                  </TableCell>
                  <TableCell className="px-1.5 py-1 text-right text-ro-cost">{fmt(cost)}z</TableCell>
                  <TableCell className={cn("px-1.5 py-1 text-center font-bold", qty >= maxPot ? "text-ro-rate-good" : qty >= maxPot - 3 ? "text-ro-rate-med" : "text-ro-rate-bad")}>
                    {qty}
                  </TableCell>
                  <TableCell className="px-1.5 py-1 text-right text-secondary-foreground">{fmt(cpu)}z</TableCell>
                  <TableCell className="px-1.5 py-1">
                    <Ni val={sell} onChange={v => setSellPrices(p => ({ ...p, [r.name]: v }))} w="70px" />
                  </TableCell>
                  <TableCell className={cn("px-1.5 py-1 text-right font-bold", profLot >= 0 && sell > 0 ? "text-ro-profit" : "text-ro-loss")}>
                    {sell > 0 ? fmtZ(profLot) : "-"}
                    <div className="text-[10px] font-normal text-muted-foreground">/u: {sell > 0 ? fmtZ(sell - cpu) : "-"}</div>
                  </TableCell>
                  <TableCell className="px-1.5 py-1">
                    <Button variant="ro" size="ro" onClick={() => setDetail(r)}>{u.detail}</Button>
                  </TableCell>
                </TableRow>
                {isOpen && (
                  <TableRow className={cn("border-0", rowBg)}>
                    <TableCell colSpan={7} className="px-2 pb-2 pt-0">
                      <div className="ro-sunken bg-input px-2 py-1.5 flex flex-wrap gap-x-4 gap-y-0.5">
                        {r.ingredients.map((ing, ii) => (
                          <div key={ii} className="flex items-center gap-1 text-[11px] text-secondary-foreground">
                            {itemIconUrl(ing.n, import.meta.env.BASE_URL) && (
                              <img src={itemIconUrl(ing.n, import.meta.env.BASE_URL)!} alt="" width={16} height={16} style={{ imageRendering: "pixelated", flexShrink: 0 }} />
                            )}
                            <span>{ing.q}× {tItem(ing.n)}</span>
                            <span className="text-ro-cost">{fmt(ing.q * getPrice(ing.n))}z</span>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>

      {/* SP FORMULA */}
      <div className="ro-sunken bg-[#e4eef8] mt-2.5">
        <RoTitleBar right={u.formulaSource}>{u.formulaTitle} — Special Pharmacy</RoTitleBar>
        <div className="px-3 py-2 text-foreground flex gap-6 flex-wrap">

          {/* Creation */}
          <div className="flex-[1_1_340px] overflow-x-auto">
            <div className="text-center">
              <Tex display tex={`\\begin{aligned} \\text{Creation} ={} &\\text{INT} + \\left\\lfloor\\dfrac{\\text{DEX}}{2}\\right\\rfloor + \\text{LUK} + \\text{JobLv} + \\text{Rand}[30,150] \\\\ &+ (\\text{BaseLv}-100) + (\\text{PotRes}\\times 5) + (\\text{FCP}\\times\\text{Rand}[4,10]) \\end{aligned}`} />
            </div>
            <div className="text-primary text-[12px] font-bold border-t border-border pt-1.5 mt-1.5">{u.formulaWithStats}</div>
            <div className="text-center">
              <Tex display tex={`${INT} + \\left\\lfloor${DEX}/2\\right\\rfloor + ${LUK} + ${stats.JobLv} + (${stats.BaseLv}-100) + (${stats.PotionResearch_Lv}\\times 5) = ${spBase}`} />
            </div>
            <div className="text-center">
              <Tex display tex={`\\text{Creation} = ${spBase} + [${stats.FCP_Lv * 4 + 30}\\text{--}${stats.FCP_Lv * 10 + 150}]`} />
            </div>
            <div className="flex gap-4 justify-center flex-wrap my-2">
              <span className="text-ro-rate-bad font-bold text-[11px]">Pess: {Math.round(spCreationPess)}</span>
              <span className="text-ro-rate-med font-bold text-[11px]">Avg: {Math.round(spCreationAvg)}</span>
              <span className="text-ro-rate-good font-bold text-[11px]">Opt: {Math.round(spCreationOpt)}</span>
            </div>
            <div className="text-center">
              <Tex display tex={`\\text{SpecificValue} = 620 - 20\\times\\text{SpecPharm Lv} = 620 - 20\\times ${sklv} = \\mathbf{${specificVal}}`} />
            </div>
            <div className="text-center">
              <Tex display tex={`\\text{Difficulty} = \\mathbf{${specificVal}} + \\text{ItemRate}`} />
            </div>
          </div>

          {/* Delta table */}
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
                {([["≥ 400", maxPot], ["≥ 300", maxPot - 3], ["≥ 100", maxPot - 4], ["≥ 1", maxPot - 5], ["< 0", Math.max(1, maxPot - 6)]] as [string, number][]).map(([delta, qty], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-muted" : "bg-accent"}>
                    <td className="px-2 py-0.5">{delta}</td>
                    <td className="px-2 py-0.5 text-center font-bold">{qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-muted-foreground mt-1">Max (SpecPharm Lv {sklv}) = {maxPot}</div>
          </div>

        </div>
      </div>
    </div>
  );
};
