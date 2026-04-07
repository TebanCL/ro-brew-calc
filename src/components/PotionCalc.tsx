import { useState, useCallback, useEffect } from "react";
import { type Stats, getSPCreation, getSPMaxPot, getMCCreation } from "../lib/formulas";
import { lsGet, lsSet } from "../lib/storage";
import { type Lang, LANG_LOCALES, ITEM_NAMES, UI } from "../lib/i18n";
import { DISCOUNT_RATES, NPC_PRICES_BASE, defaultStats } from "../lib/data";
import type { PCRecipe, SPRecipe, MCRecipe } from "../lib/data";
import { Button } from "@/components/ui/button";
import { RoTitleBar } from "./RoTitleBar";
import { StatsPanel } from "./StatsPanel";
import { PricesTab } from "./PricesTab";
import { DetailModal } from "./DetailModal";
import { PotionCreationTab } from "./PotionCreationTab";
import { SpecialPharmacyTab } from "./SpecialPharmacyTab";
import { MixCookingTab } from "./MixCookingTab";

export default function PotionCalc() {
  const [stats, setStats] = useState<Stats>(() => lsGet("ro_stats", defaultStats));
  const [prices, setPrices] = useState<Record<string, number>>(() => lsGet("ro_prices", {}));
  const [sellPrices, setSellPrices] = useState<Record<string, number>>(() => lsGet("ro_sell", {}));
  const [lang, setLang] = useState<Lang>(() => lsGet("ro_lang", "en" as Lang));
  const [tab, setTab] = useState(1);
  const [detail, setDetail] = useState<PCRecipe | SPRecipe | MCRecipe | null>(null);

  useEffect(() => { lsSet("ro_stats", stats); }, [stats]);
  useEffect(() => { lsSet("ro_prices", prices); }, [prices]);
  useEffect(() => { lsSet("ro_sell", sellPrices); }, [sellPrices]);
  useEffect(() => { lsSet("ro_lang", lang); }, [lang]);

  const setStat = useCallback((k: keyof Stats, v: number) => setStats(p => ({ ...p, [k]: v })), []);
  const discRate = DISCOUNT_RATES[stats.Discount_Lv] || 0;
  const u = UI[lang];

  const tItem = useCallback((name: string): string => {
    if (lang === "en") return name;
    return ITEM_NAMES[name]?.[lang] ?? name;
  }, [lang]);

  const getPrice = useCallback((n: string): number => {
    if (prices[n] !== undefined && prices[n] !== 0) return prices[n];
    const base = NPC_PRICES_BASE[n];
    if (base) return Math.floor(base * (100 - discRate) / 100);
    return 0;
  }, [prices, discRate]);

  const INT = stats.bINT + stats.eINT;
  const DEX = stats.bDEX + stats.eDEX;
  const LUK = stats.bLUK + stats.eLUK;
  const sklv = stats.SpecialPharmacy_Lv;
  const specificVal = 620 - 20 * sklv;
  const maxPot = getSPMaxPot(sklv);
  const spCreationAvg  = getSPCreation(stats, 90,  7);
  const spCreationPess = getSPCreation(stats, 30,  4);
  const spCreationOpt  = getSPCreation(stats, 150, 10);
  const mcCreation = getMCCreation(stats);
  const pcBaseRate = (stats.PreparePotion_Lv * 3) + stats.PotionResearch_Lv + stats.InstructionChange_Lv +
    (stats.JobLv * 0.2) + (DEX * 0.1) + (LUK * 0.1) + (INT * 0.05);

  const locale = LANG_LOCALES[lang];
  const fmt  = (n: number) => n.toLocaleString(locale);
  const fmtZ = (n: number) => (n >= 0 ? "+" : "") + fmt(Math.round(n)) + "z";

  const rowLabels: [string, string, string] = [u.pessimistic, u.expected, u.optimistic];

  return (
    <div className="p-2.5 max-w-[980px] mx-auto">
      {/* ── Main RO Window ── */}
      <div className="ro-raised bg-card">

        {/* Title Bar */}
        <div className="bg-primary px-2.5 py-1.5 flex justify-between items-center border-b-2 border-b-[var(--ro-shadow)] flex-wrap gap-1">
          <h1 className="text-primary-foreground m-0 text-[13px] font-bold tracking-wide flex items-center gap-1.5">
            <img src={`${import.meta.env.BASE_URL}assets/logo.png`} alt="" width={28} height={28} style={{ imageRendering: "pixelated" }} />
            RO Potion Cost-Benefit Calculator
          </h1>
          <div className="flex gap-1.5 items-center">
            <span className="header-subtitle text-[11px] text-[#a0c0e0]">{u.subtitle}</span>
            <select
              value={lang}
              onChange={e => setLang(e.target.value as Lang)}
              className="ro-sunken bg-input text-foreground text-[11px] py-0.5 px-1 cursor-pointer outline-none"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="pt">Português</option>
            </select>
          </div>
        </div>

        {/* Window body */}
        <div className="px-2.5 py-2">

          {/* STATS PANEL */}
          <StatsPanel
            stats={stats} setStat={setStat} u={u}
            pcBaseRate={pcBaseRate} spCreationAvg={spCreationAvg}
            specificVal={specificVal} maxPot={maxPot}
            mcCreationAvg={mcCreation} discRate={discRate}
          />

          {/* TABS */}
          <div className="flex gap-0.5 mb-1.5 flex-wrap justify-center">
            {u.tabs.map((t, i) => (
              <Button
                key={i}
                variant={tab === i ? "ro-tab-active" : "ro-tab-inactive"}
                onClick={() => { setTab(i); setDetail(null); }}
              >
                {t}
              </Button>
            ))}
          </div>

          <DetailModal
            detail={detail}
            setDetail={setDetail as (r: PCRecipe | SPRecipe | MCRecipe | null) => void}
            tItem={tItem} u={u} fmt={fmt} getPrice={getPrice} stats={stats}
            spCreationPess={spCreationPess} spCreationAvg={spCreationAvg} spCreationOpt={spCreationOpt}
            specificVal={specificVal} maxPot={maxPot} pcBaseRate={pcBaseRate}
            rowLabels={rowLabels} sellPrices={sellPrices} setSellPrices={setSellPrices}
          />

          {tab === 0 && <PricesTab prices={prices} setPrices={setPrices} u={u} tItem={tItem} discRate={discRate} />}
          {tab === 1 && (
            <PotionCreationTab
              stats={stats} getPrice={getPrice} sellPrices={sellPrices} setSellPrices={setSellPrices}
              setDetail={setDetail} u={u} tItem={tItem} fmt={fmt} fmtZ={fmtZ}
              pcBaseRate={pcBaseRate} INT={INT} DEX={DEX} LUK={LUK}
            />
          )}
          {tab === 2 && (
            <SpecialPharmacyTab
              stats={stats} getPrice={getPrice} sellPrices={sellPrices} setSellPrices={setSellPrices}
              setDetail={setDetail} u={u} tItem={tItem} fmt={fmt} fmtZ={fmtZ}
              spCreationPess={spCreationPess} spCreationAvg={spCreationAvg} spCreationOpt={spCreationOpt}
              specificVal={specificVal} maxPot={maxPot} sklv={sklv} INT={INT} DEX={DEX} LUK={LUK}
            />
          )}
          {tab === 3 && (
            <MixCookingTab
              stats={stats} getPrice={getPrice} sellPrices={sellPrices} setSellPrices={setSellPrices}
              setDetail={setDetail as (r: PCRecipe | SPRecipe | MCRecipe | null) => void}
              u={u} tItem={tItem} fmt={fmt} fmtZ={fmtZ} DEX={DEX} LUK={LUK}
            />
          )}

        </div>
      </div>

      <footer className="ro-raised bg-secondary text-muted-foreground text-center mt-1.5 py-1 px-2.5 text-[11px]">
        {u.footer}
      </footer>
    </div>
  );
}
