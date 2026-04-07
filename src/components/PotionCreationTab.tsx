import { useState, Fragment } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Stats } from "../lib/formulas";
import { getBrewRate } from "../lib/formulas";
import type { UiStrings } from "../lib/i18n";
import type { PCRecipe, SPRecipe } from "../lib/data";
import { PC_RECIPES, itemIconUrl } from "../lib/data";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RoTitleBar } from "./RoTitleBar";
import { cn } from "@/lib/utils";
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
}: PotionCreationTabProps) => {
  const [openRows, setOpenRows] = useState<Set<string>>(new Set());
  const toggle = (name: string) => setOpenRows(prev => {
    const s = new Set(prev);
    if (s.has(name)) s.delete(name); else s.add(name);
    return s;
  });

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <img src={`${import.meta.env.BASE_URL}assets/icons/skills/pharmacy.png`} alt="" width={24} height={24} style={{ imageRendering: "pixelated" }} />
        <span className="font-bold text-[13px] text-foreground">{u.pcTitle}</span>
      </div>
      <p className="text-[11px] text-muted-foreground mb-1.5">{u.pcSubtitle}</p>

      <Table className="ro-table text-[12px]">
        <TableHeader>
          <TableRow className="border-0 hover:bg-transparent">
            {[u.colPotion, u.colCost, u.colRate, u.colSell, u.colProfit, ""].map((h, i) => (
              <TableHead key={i} className="bg-primary text-primary-foreground text-[11px] font-bold px-1.5 py-1 whitespace-nowrap border-r border-r-[var(--ro-shadow)] last:border-r-0 h-auto">
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {PC_RECIPES.map((r, ri) => {
            const rate = getBrewRate(stats, r.potionRate);
            const cost = r.ingredients.reduce((s, i) => s + i.q * getPrice(i.n), 0);
            const sell = sellPrices[r.name] || 0;
            const cps  = rate > 0 ? Math.round(cost / (rate / 100)) : Infinity;
            const prof = sell - cps;
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
                  </TableCell>
                  <TableCell className="px-1.5 py-1 text-right text-ro-cost">{fmt(cost)}z</TableCell>
                  <TableCell className={cn("px-1.5 py-1 text-center font-bold", rate >= 80 ? "text-ro-rate-good" : rate >= 50 ? "text-ro-rate-med" : "text-ro-rate-bad")}>
                    {rate.toFixed(1)}%
                  </TableCell>
                  <TableCell className="px-1.5 py-1">
                    <Ni val={sell} onChange={v => setSellPrices(p => ({ ...p, [r.name]: v }))} w="70px" />
                  </TableCell>
                  <TableCell className={cn("px-1.5 py-1 text-right font-bold", prof >= 0 && sell > 0 ? "text-ro-profit" : "text-ro-loss")}>
                    {rate > 0 && sell > 0 ? fmtZ(prof) : "-"}
                  </TableCell>
                  <TableCell className="px-1.5 py-1">
                    <Button variant="ro" size="ro" onClick={() => setDetail(r)}>{u.detail}</Button>
                  </TableCell>
                </TableRow>
                {isOpen && (
                  <TableRow className={cn("border-0", rowBg)}>
                    <TableCell colSpan={6} className="px-2 pb-2 pt-0">
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

      {/* PC FORMULA */}
      <div className="ro-sunken bg-[#e4eef8] mt-2.5">
        <RoTitleBar right={u.formulaSource}>{u.formulaTitle} — Pharmacy</RoTitleBar>
        <div className="px-3 py-2 text-foreground overflow-x-auto">
          <div className="text-center">
            <Tex display tex={`\\begin{aligned} \\text{Rate} ={} &(\\text{PrepPot}\\times 3) + \\text{PotRes} + \\text{InstChange} + (\\text{JobLv}\\times 0.2) \\\\ &+ (\\text{DEX}\\times 0.1) + (\\text{LUK}\\times 0.1) + (\\text{INT}\\times 0.05) + \\text{PotionRate} \\end{aligned}`} />
          </div>
          <div className="text-primary text-[12px] font-bold border-t border-border pt-1.5 mt-1.5">{u.formulaWithStats}</div>
          <div className="text-center">
            <Tex display tex={`${stats.PreparePotion_Lv * 3} + ${stats.PotionResearch_Lv} + ${stats.InstructionChange_Lv} + ${(stats.JobLv * 0.2).toFixed(1)} + ${(DEX * 0.1).toFixed(1)} + ${(LUK * 0.1).toFixed(1)} + ${(INT * 0.05).toFixed(2)} = \\mathbf{${pcBaseRate.toFixed(2)}}`} />
          </div>
          <div className="text-center">
            <Tex display tex={`\\text{Rate} = \\mathbf{${pcBaseRate.toFixed(2)}} + \\text{PotionRate}`} />
          </div>
          <div className="text-muted-foreground text-[10px] text-center mt-0.5">({u.formulaClamp})</div>
        </div>
      </div>
    </div>
  );
};
