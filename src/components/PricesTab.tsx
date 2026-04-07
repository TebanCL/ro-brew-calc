import type { Dispatch, SetStateAction } from "react";
import type { UiStrings } from "../lib/i18n";
import { ALL_ITEMS, NPC_PRICES_BASE, NO_DISCOUNT_ITEMS, itemIconUrl } from "../lib/data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Ni } from "./Ni";

interface PricesTabProps {
  prices: Record<string, number>;
  setPrices: Dispatch<SetStateAction<Record<string, number>>>;
  u: UiStrings;
  tItem: (name: string) => string;
  discRate: number;
}

export const PricesTab = ({ prices, setPrices, u, tItem, discRate }: PricesTabProps) => (
  <div className="max-w-[620px] mx-auto">
    <h3 className="text-foreground text-[13px] mb-0.5 font-bold">{u.materialPrices}</h3>
    <p className="text-[11px] text-muted-foreground mb-1.5">{u.priceSubtitle(discRate)}</p>

    <div className="prices-grid grid grid-cols-2 gap-px">
      {ALL_ITEMS.map((name, idx) => {
        const npc  = NPC_PRICES_BASE[name];
        const disc = npc && !NO_DISCOUNT_ITEMS.has(name)
          ? Math.floor(npc * (100 - discRate) / 100)
          : (npc ?? null);
        const cur     = prices[name];
        const display = cur !== undefined && cur !== 0 ? cur : (disc || 0);
        return (
          <div
            key={name}
            className={cn(
              "flex justify-between items-center px-1.5 py-0.5 border-b border-border gap-1",
              idx % 2 === 0 ? "bg-muted" : "bg-accent"
            )}
          >
            <div className="flex items-center gap-1 flex-1 min-w-0 overflow-hidden" title={tItem(name)}>
              {itemIconUrl(name, import.meta.env.BASE_URL) && (
                <img
                  src={itemIconUrl(name, import.meta.env.BASE_URL)!}
                  alt="" width={18} height={18}
                  style={{ imageRendering: "pixelated", flexShrink: 0 }}
                />
              )}
              <span className="text-[11px] text-foreground overflow-hidden text-ellipsis whitespace-nowrap">
                {tItem(name)}
                {npc ? (
                  <span className="text-muted-foreground text-[10px]">
                    {NO_DISCOUNT_ITEMS.has(name) ? ` (${npc})` : ` (${npc}→${disc})`}
                  </span>
                ) : null}
              </span>
            </div>
            <Ni val={display} onChange={v => setPrices(p => ({ ...p, [name]: v }))} w="70px" min={0} />
          </div>
        );
      })}
    </div>

    <Button variant="ro" size="ro" className="mt-2" onClick={() => setPrices({})}>
      {u.resetPrices}
    </Button>
  </div>
);
