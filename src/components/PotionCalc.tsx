import { useState, useCallback, useEffect } from "react";
import { type Stats, getSPCreation, getSPMaxPot, getMCCreation } from "../lib/formulas";
import { lsGet, lsSet } from "../lib/storage";
import { type Lang, LANG_LOCALES, ITEM_NAMES, UI } from "../lib/i18n";
import { DISCOUNT_RATES, NPC_PRICES_BASE, defaultStats } from "../lib/data";
import type { PCRecipe, SPRecipe, MCRecipe } from "../lib/data";
import { Button } from "@/components/ui/button";
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
            <a
              href="https://github.com/TebanCL/ro-brew-calc"
              target="_blank"
              rel="noopener noreferrer"
              title="Star on GitHub"
              className="text-[#a0c0e0] hover:text-primary-foreground transition-colors flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              <span className="text-[11px] header-subtitle">GitHub</span>
            </a>
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
