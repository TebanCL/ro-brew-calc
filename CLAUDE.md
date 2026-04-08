# CLAUDE.md

## Project Overview

RO Potion Cost-Benefit Calculator — a single-page Astro + React app that helps Ragnarok Online players (specifically on the Latin America server) calculate profitability of potion crafting via **Potion Creation** (Pharmacy, 2nd class Alchemist/Creator) and **Special Pharmacy** (3rd class Geneticist).

## Tech Stack

- **Astro 6** with `@astrojs/react` integration
- **React 19** (client-side components with `client:only="react"` — SSR skipped to avoid localStorage hydration mismatches)
- **TypeScript** (strict mode)
- **Tailwind CSS v4** via `@tailwindcss/vite` (no config file — configured in `src/styles/globals.css` via `@theme`)
- **shadcn/ui** components in `src/components/ui/` — primitives styled to match the RO Basic Skin theme
- RO Basic Skin theme: cool blue-gray palette mapped to CSS variables; 3-D bevel borders via `.ro-raised` / `.ro-sunken` Tailwind utilities
- **KaTeX** for math formula rendering in the browser (CSS loaded from CDN in `Layout.astro` with SRI hash)
- **localStorage** for persistence (stats, prices, sell prices, language preference)
- **i18n**: English (default), Spanish, Portuguese — via `ITEM_NAMES` map + `UI` strings object in `src/lib/i18n.ts`
- **pnpm** as package manager (enforced via `only-allow` + `packageManager` field)
- **Node.js 22 LTS** (`.nvmrc` + `engines` in `package.json`)
- **Vitest** for unit testing formula functions
- **ESLint** (flat config) with TypeScript + React Hooks rules
- Deployed via **GitHub Pages** using GitHub Actions

## Project Structure

```
ro-brew-calc/
├── .github/
│   ├── workflows/deploy.yml        # CI: check (typecheck+lint+test) → build → deploy
│   └── dependabot.yml              # Weekly npm dependency updates
├── public/
│   ├── favicon.svg
│   └── assets/icons/
│       ├── items/                  # 83 item icons from Divine Pride (named by item ID)
│       └── skills/                 # 6 skill icons from browiki.org
├── src/
│   ├── components/
│   │   ├── ui/                     # shadcn/ui primitives (button, input, …)
│   │   ├── RoTitleBar.tsx          # Shared blue title bar (bg-primary, bevel bottom)
│   │   ├── PotionCalc.tsx          # Root coordinator: state, derived values, layout shell
│   │   ├── StatsPanel.tsx          # Stats/skills/levels inputs + derived values bar
│   │   ├── PricesTab.tsx           # Material prices tab
│   │   ├── PotionCreationTab.tsx   # PC table + KaTeX formula section
│   │   ├── SpecialPharmacyTab.tsx  # SP table + KaTeX formula section
│   │   ├── MixCookingTab.tsx       # MC table + KaTeX formula section
│   │   ├── DetailModal.tsx         # Per-recipe detail modal: scenario table + bulk materials calculator
│   │   ├── ScenarioTable.tsx       # Compact pess/avg/opt grid (metrics as rows, scenarios as columns)
│   │   ├── Ni.tsx                  # Reusable number input (supports min/max clamping)
│   │   ├── MiniBar.tsx             # ⚠️ Unused — superseded by ScenarioTable; safe to delete
│   │   └── Tex.tsx                 # KaTeX wrapper component
│   ├── lib/
│   │   ├── formulas.ts             # Pure formula functions + Stats interface (exported)
│   │   ├── formulas.test.ts        # Vitest unit tests for all formulas
│   │   ├── i18n.ts                 # Lang type, ITEM_NAMES, UiStrings, UI record
│   │   ├── data.ts                 # Recipes, NPC prices, ITEM_ICONS, itemIconUrl()
│   │   ├── storage.ts              # lsGet / lsSet helpers
│   │   ├── theme.ts                # RO color reference (no longer imported by components — values live in globals.css CSS variables)
│   │   └── utils.ts                # cn() helper (clsx + tailwind-merge)
│   ├── styles/
│   │   └── globals.css             # Tailwind v4 entry, RO CSS variables, ro-raised/ro-sunken utilities
│   ├── layouts/
│   │   └── Layout.astro            # HTML shell, imports globals.css, KaTeX CDN link (SRI), security meta tags
│   └── pages/
│       └── index.astro             # Imports Layout + PotionCalc with client:only="react"
├── components.json                 # shadcn/ui configuration
├── astro.config.mjs                # site/base config, @tailwindcss/vite plugin
├── eslint.config.js                # ESLint flat config
├── package.json                    # packageManager: pnpm, engines: node>=22
├── tsconfig.json
└── .nvmrc                          # Node 22
```

## Key Commands

```bash
pnpm install         # Install dependencies
pnpm dev             # Local dev server (http://localhost:4321)
pnpm build           # Production build → ./dist/
pnpm preview         # Preview production build locally
pnpm test            # Run Vitest unit tests
pnpm lint            # ESLint
pnpm typecheck       # tsc --noEmit
```

## Architecture & Data Model

### Core Data (in `src/lib/data.ts`; formulas in `src/lib/formulas.ts`)

- `NPC_PRICES_BASE` — Base reference prices for all ingredients (NPC prices or typical player-market values). Used as the default when no custom price is set. Can be overridden at runtime via the market price fetch feature.
- `NO_DISCOUNT_ITEMS` — `Set<string>` of items whose price is never reduced by the Discount skill (currently: `"Gold"`). Checked in `getPrice` before applying the discount multiplier.
- `ALL_CRAFTABLES` — Array of every recipe output name across PC, SP, and MC tabs (43 items). Used by the market fetch to populate `sellPrices`.
- `PC_RECIPES` (Potion Creation) — 18 recipes. Each has `kind: "pc"`, `name`, `ingredients[]`, and `potionRate` (modifier to brew success %).
- `SP_RECIPES` (Special Pharmacy) — 19 recipes. Each has `kind: "sp"`, `name`, `ingredients[]`, and `itemRate` (difficulty modifier).
- `MC_RECIPES` (Mix Cooking) — 6 recipes. Each has `kind: "mc"`, `name`, `ingredients[]`, and `itemRate` (all 15). The `kind` discriminant is used for type-safe branching in the detail modal.
- `DISCOUNT_RATES` — Array mapping Discount skill level (0-10) to % discount.

### Formulas (from iRO Wiki)

**Potion Creation success rate:**
```
rate = (PreparePotion_Lv × 3) + PotionResearch_Lv + InstructionChange_Lv
     + (JobLv × 0.2) + (DEX × 0.1) + (LUK × 0.1) + (INT × 0.05)
     + potionRate
```

**Mix Cooking — Creation vs Difficulty comparison:**
```
Creation = floor(JobLv/4) + floor(DEX/3) + floor(LUK/2)   ← deterministic, no random

Difficulty = Random(30, 150) + ItemRate
```

Output quantity by delta (Creation − Difficulty):
- ≥ 30  → 10–12 (pessimistic=10, expected=11, optimistic=12)
- ≥ 10  → 10
- > −30 → 8
- > −50 → 5
- ≤ −50 → Failure (0)

The three scenarios use Rand = 150 (pessimistic), 90 (expected), 30 (optimistic).

**Special Pharmacy — Creation vs Difficulty comparison:**
```
Creation = INT + (DEX/2) + LUK + JobLv + Random[30,150]
         + (BaseLv - 100) + (PotionResearch_Lv × 5)
         + (FCP_Lv × Random[4,10])

Difficulty = SpecificValue + ItemRate
SpecificValue = 620 - (20 × SpecialPharmacy_Lv)
```

Output quantity depends on `Creation - Difficulty` delta:
- ≥400 → max potions
- ≥300 → max - 3
- ≥100 → max - 4
- ≥1   → max - 5
- <0   → max - 6

The app calculates three scenarios using the random ranges: pessimistic (30, 4), average (90, 7), optimistic (150, 10).

### State (persisted to localStorage)

- `ro_stats` — Player stats: base INT/DEX/LUK, bonus INT/DEX/LUK, levels, skill levels
- `ro_prices` — Custom item prices (overrides NPC+discount defaults); also written by the market fetch feature
- `ro_sell` — Sell prices per potion name
- `ro_lang` — Selected language (`"en"` | `"es"` | `"pt"`), defaults to `"en"`
- `ro_market_cache` — Cached market prices `{ prices, ts }` with 30-minute TTL; `ts` also drives the 5-minute fetch cooldown

### UI Structure

A **language selector** `<select>` (EN / ES / PT) sits next to the title in the header. The stats panel is **always visible** at the top regardless of active tab. Below the stats panel there is a **tab bar row** (3-column grid: empty spacer | centred tabs | "Fetch Market Prices" button). The fetch button is always visible regardless of active tab; during a fetch it shows live progress and acts as a cancel button; while on cooldown it shows a regressive countdown. Four tabs (centred):
1. **Prices / Precios / Preços** — Edit material prices. Shows NPC base → discounted price. Item icons displayed per row. Manual override available. Includes all MC ingredients.
2. **Potion Creation** — Table of 18 recipes with item icons, cost, success rate, profit. KaTeX formula section below with live stat substitution.
3. **Special Pharmacy** — Table of 19 recipes with item icons, cost, quantity produced, per-unit cost, profit. KaTeX formula section with Creation/Difficulty breakdown and delta table.
4. **Mix Cooking** — Table of 6 recipes with item icons, cost, pessimistic/expected/optimistic qty, per-unit cost, profit. KaTeX formula section with Creation value and delta table.

Each recipe row has a "Detail" button that opens a modal with ingredient icons, a `ScenarioTable` (pess/avg/opt metrics grid), and a **bulk materials calculator** (enter a target quantity → shows crafts needed and per-ingredient totals, accounting for failure rate on PC and showing separate scenarios on SP/MC). Each row also has a **▸/▾ chevron** on the name cell — clicking it toggles an inline ingredient list (icon, qty, name, cost per ingredient) rendered as a collapsible `<TableRow>` spanning all columns.

## Conventions

- All monetary values displayed with `toLocaleString(LANG_LOCALES[lang])` and `z` suffix (Ragnarok zeny). Locales: `en-US`, `es-CL`, `pt-BR`.
- Theme colors are in the `RO` object in `src/lib/theme.ts`. Profit = `RO.profit`, loss = `RO.loss`, title bars = `RO.titleBg`.
- Stats are split into "Base" and "Bonus/Bono/Bônus" depending on language.
- Number inputs have browser spinners hidden via CSS (global reset in `Layout.astro`).
- The `Ni` component is the reusable number input. Accepts optional `min` and `max` props — values are clamped both in HTML and in `onChange`.
- `ScenarioTable` component renders a compact comparison grid for the 3 scenarios. Accepts `colLabels: [string, string, string]` and `rows: ScenarioRow[]` where each row has a label, three values, a per-row `fmt` function, and an optional `sign` flag to color positive/negative values green/red. Supersedes `MiniBar`.
- `MiniBar` is no longer used (superseded by `ScenarioTable`) and can be deleted.
- `Tex` component wraps KaTeX. Accepts `tex: string` and optional `display?: boolean` for display-mode math.
- Item icons: use `itemIconUrl(name, import.meta.env.BASE_URL)` from `src/lib/data.ts`. Returns `null` if no icon is mapped for that item — always guard before rendering.
- Skill icons live in `public/assets/icons/skills/` and are referenced directly via `import.meta.env.BASE_URL`.

### i18n Architecture

- `type Lang = "en" | "es" | "pt"` — supported languages.
- `ITEM_NAMES: Record<string, { es: string; pt: string }>` — maps English item keys to translated names. English is always the internal key used for data lookups (prices, recipes).
- `UI: Record<Lang, UiStrings>` — all UI text strings per language (tabs, labels, column headers, modal text, footer).
- `tItem(name: string): string` — translates an item name using the current `lang`. Falls back to English if no translation exists.
- Item names sourced from the official ROLATAM server client (via RagnaPlace database).

## Important Notes

- **Item Rates for Special Pharmacy** are sourced from browiki.org (cross-referenced against bRO server), which supersedes the iRO Wiki values previously used.
- **Skill level caps**: Prepare Potion / Potion Research / Sp. Pharmacy / Discount max 10; Instruction Change / FCP max 5; Mix Cooking max 2. These are enforced in the `Ni` inputs via `min`/`max` props.
- **Discount skill at level 10 = 24%** discount (not 25%, this is intentional per official RO data).
- **`NO_DISCOUNT_ITEMS`** — items in this set (currently `"Gold"`) always return their flat base price; the Discount skill multiplier is not applied. Add items here when their price is fixed regardless of player skills.
- **Market price fetch** (`src/lib/marketPrices.ts`) — "Fetch Market Prices" button in the global tab bar triggers a sequential fetch of all ingredients + craftable outputs via the Cloudflare Worker. Ingredient prices → `ro_prices`; craftable output prices → `ro_sell`. Prices from the market already reflect what players actually pay, so they must **not** have the Discount multiplier applied. This is automatically handled because fetched prices are stored as custom overrides, and `getPrice` in `PotionCalc.tsx` returns those overrides as-is (before the NPC+discount path). The fetch state and routing logic live entirely in `PotionCalc`; `PricesTab` is a pure display component.
- **`worker/`** — Cloudflare Worker source. `index.js` is the proxy; `wrangler.toml` sets the worker name. Deploy with `npx wrangler deploy` from inside `worker/`. The Worker uses the Cloudflare Cache API (5-min TTL) to avoid hammering the upstream endpoint.
- The app targets **Ragnarok Latinoamérica** server — prices and availability may differ from iRO or other servers.
- When a user sets a custom price to 0 in the Prices tab, it falls back to the NPC discounted price. To truly set a price to 0, the user should set it to 1.
- All recipes require a specific **manual/book** in inventory to craft. The books are not consumed and are not factored into the cost calculation.
- **Icons**: item icons are named by divine-pride numeric ID (e.g. `501.png`). The mapping from item name → ID lives in `ITEM_ICONS` in `src/lib/data.ts`. When adding new recipes, add the corresponding ID there and download the icon to `public/assets/icons/items/`.

## Security

Security headers are applied via HTML `<meta>` tags in `Layout.astro` (GitHub Pages does not support custom HTTP response headers):

- **Content-Security-Policy** — Restricts resource loading to `self`, KaTeX on `cdn.jsdelivr.net`, and the Cloudflare Worker for `connect-src`. Uses `'unsafe-inline'` for scripts and styles (required by Astro's inline hydration scripts and Tailwind). Sets `base-uri 'self'` and `form-action 'self'`.
- **Referrer-Policy** (`strict-origin-when-cross-origin`) — Sends only the origin on cross-origin requests; suppresses path and query string from leaking.
- **SRI on KaTeX CDN link** — `integrity="sha384-..."` on the `<link>` tag ensures the browser rejects the stylesheet if the CDN serves a tampered file.

Headers that cannot be set without a CDN/proxy layer (e.g. Cloudflare transform rules) and are therefore absent:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY` (note: `frame-ancestors` in a `<meta>` CSP is ignored by browsers)
- `Permissions-Policy`
- `Strict-Transport-Security`

## Deployment

GitHub Actions workflow (`.github/workflows/deploy.yml`) runs on every push to `main` with three jobs in sequence:
1. **check** — `pnpm typecheck` + `pnpm lint` + `pnpm test` (blocks build on failure)
2. **build** — `pnpm build`, uploads `./dist` as artifact
3. **deploy** — deploys artifact to GitHub Pages

The `astro.config.mjs` must have the correct `site` and `base` values matching the GitHub username and repo name.

## Testing

Formula unit tests live in `src/lib/formulas.test.ts`. Run with `pnpm test`. Tests cover:
- `getBrewRate` — success rate clamping, stat contributions, equipment bonus
- `getSPCreation` — pessimistic / average / optimistic scenarios
- `getSPMaxPot` — all skill level breakpoints (0–10)
- `getSPQty` — all delta thresholds including minimum-of-1 guard
- `getMCCreation` and `getMCQty` can be added following the same pattern