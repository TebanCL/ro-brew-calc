import type { Dispatch, SetStateAction } from "react";
import type { UiStrings } from "../lib/i18n";
import { ALL_ITEMS, NPC_PRICES_BASE, itemIconUrl } from "../lib/data";
import { RO, raised } from "../lib/theme";
import { Ni } from "./Ni";

interface PricesTabProps {
  prices: Record<string, number>;
  setPrices: Dispatch<SetStateAction<Record<string, number>>>;
  u: UiStrings;
  tItem: (name: string) => string;
  discRate: number;
}

export const PricesTab = ({ prices, setPrices, u, tItem, discRate }: PricesTabProps) => (
  <div style={{ maxWidth: 620, margin: "0 auto" }}>
    <h3 style={{ color: RO.text, fontSize: 13, marginBottom: 2, fontWeight: 700 }}>{u.materialPrices}</h3>
    <p style={{ fontSize: 11, color: RO.textMuted, margin: "0 0 6px" }}>{u.priceSubtitle(discRate)}</p>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
      {ALL_ITEMS.map((name, idx) => {
        const npc = NPC_PRICES_BASE[name];
        const disc = npc ? Math.floor(npc * (100 - discRate) / 100) : null;
        const cur = prices[name];
        const display = cur !== undefined && cur !== 0 ? cur : (disc || 0);
        return (
          <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: idx % 2 === 0 ? RO.row1 : RO.row2, padding: "3px 6px", borderBottom: `1px solid ${RO.rowBorder}`, gap: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, flex: 1, minWidth: 0, overflow: "hidden" }} title={tItem(name)}>
              {itemIconUrl(name, import.meta.env.BASE_URL) && (
                <img src={itemIconUrl(name, import.meta.env.BASE_URL)!} alt="" width={18} height={18} style={{ imageRendering: "pixelated", flexShrink: 0 }} />
              )}
              <span style={{ fontSize: 11, color: RO.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {tItem(name)}
                {npc ? <span style={{ color: RO.textMuted, fontSize: 10 }}> ({npc}→{disc})</span> : null}
              </span>
            </div>
            <Ni val={display} onChange={v => setPrices(p => ({ ...p, [name]: v }))} w="70px" min={0} />
          </div>
        );
      })}
    </div>
    <button onClick={() => setPrices({})} style={{ marginTop: 8, padding: "4px 14px", ...raised, background: RO.panelAlt, color: RO.textMid, cursor: "pointer", fontSize: 11 }}>
      {u.resetPrices}
    </button>
  </div>
);
