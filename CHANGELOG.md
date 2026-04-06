# Changelog

All notable changes to this project will be documented here.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

---

## [1.2.0] - 2026-04-06

### Added
- GitHub Issue Templates (bug report, feature request)
- Pull Request template with pre-flight checklist
- `CODE_OF_CONDUCT.md` (Contributor Covenant)
- `SECURITY.md` with private vulnerability reporting instructions
- CI checks now run on pull requests (typecheck, lint, test); build and deploy remain push-to-main only
- `description`, `keywords`, `homepage`, `repository`, and `license` fields in `package.json`
- CI status badge in README
- RO Basic Skin UI theme: cool blue-gray palette matching the in-game Basic Skin
  - Window panels with 3-D raised/sunken bevel borders (`#dff0ff` / `#304870`)
  - Blue title bars (`#4070b8`) with white text on all windows and section headers
  - Light blue-gray panel backgrounds (`#b8c8dc`) with alternating table rows
  - Sunken inputs with near-white background (`#eaf2fc`) and dark text
  - Raised bevel buttons consistent with the in-game style
  - Dark navy page background (`#0c1828`) with subtle grid
  - RO-styled scrollbars with blue-gray bevel
  - Font changed to Tahoma/Verdana (same as the RO client)
- Language selector changed from three buttons to a `<select>` dropdown
- Tab bar (Prices / Potion Creation / Special Pharmacy) centred
- **KaTeX** formula sections below the Potion Creation and Special Pharmacy tables
  - Formulas rendered with proper math notation (`\lfloor DEX/2 \rfloor`, aligned blocks, bold results)
  - "With your stats" section substitutes live stat values and highlights the computed base rate / creation range
  - Verified against browiki.org (Preparar Poção & Farmacologia Avançada)
- **Item and skill icons** sourced from Divine Pride and browiki.org (`public/assets/icons/`)
  - 83 item icons for all crafted potions and ingredients
  - 6 skill icons (Prepare Potion, Potion Research, Instruction Change, FCP, Special Pharmacy, Discount)
  - Icons displayed in: Skills panel, Prices tab, Potion Creation table, Special Pharmacy table, and Detail modal ingredients list
- **Input validation** on all numeric fields
  - Skill levels clamped to their in-game maximums (Prepare Potion/Potion Research/Sp. Pharmacy/Discount: 0–10; Instruction Change/FCP: 0–5)
  - Base stats (INT/DEX/LUK) minimum 1; bonus stats minimum 0
  - Prices minimum 0
- **Component refactor** — monolithic `PotionCalc.tsx` split into focused modules:
  - `src/lib/storage.ts`, `src/lib/i18n.ts`, `src/lib/data.ts`, `src/lib/theme.ts`
  - `src/components/Ni.tsx`, `MiniBar.tsx`, `Tex.tsx`
  - `src/components/StatsPanel.tsx`, `PricesTab.tsx`, `DetailModal.tsx`
  - `src/components/PotionCreationTab.tsx`, `SpecialPharmacyTab.tsx`
  - `PotionCalc.tsx` reduced to ~190 lines (state coordinator only)

### Changed
- Special Pharmacy Item Rates updated to browiki.org values (cross-referenced against bRO server):
  - Concentrated Red Syrup: 100 → 80
  - Concentrated Blue Syrup: 130 → 160
  - Concentrated Golden Syrup: 150 → 160
  - Red Herb Activator: 100 → 120
  - Blue Herb Activator: 100 → 120
  - Golden X Potion: 145 → 160
- Footer and formula source attribution updated to credit both iRO Wiki (formulas) and browiki.org (Item Rates)
- README data sources section expanded with browiki.org and Divine Pride links

---

## [1.1.0] - 2026-04-06

### Added
- Multilingual support (EN / ES / PT) with language selector in the header
- Official item names for Spanish and Portuguese sourced from the ROLATAM client (via RagnaPlace)
- Language preference persisted to `localStorage` (`ro_lang` key)
- `src/lib/formulas.ts` — pure formula functions extracted for testability
- Vitest unit tests covering `getBrewRate`, `getSPCreation`, `getSPMaxPot`, `getSPQty`
- ESLint configuration (`eslint.config.js`) with TypeScript and React Hooks rules
- CI quality gate: type check, lint, and tests run before every deploy
- Dependabot weekly dependency updates
- `CONTRIBUTING.md`, `CHANGELOG.md`, `LICENSE` (MIT), `.gitignore`, `.nvmrc`
- Deployed to GitHub Pages via GitHub Actions

### Changed
- Default language is now **English**
- Number formatting locale is dynamic (`en-US` / `es-CL` / `pt-BR`) based on selected language
- `MiniBar` component accepts `rowLabels` prop for translated scenario labels
- CI workflow restructured: `check` job (typecheck + lint + test) must pass before `build`
- `npm` cache enabled in CI for faster installs

---

## [1.0.0] - 2026-04-05

### Added
- Initial release
- Potion Creation tab: 18 recipes with success rate, cost-per-success, and profit calculation
- Special Pharmacy tab: 19 recipes with quantity produced, per-unit cost, and profit calculation
- Material Prices tab: NPC base prices with Discount skill support and manual override
- Stats panel: INT/DEX/LUK (base + equipment bonus), levels, and skill levels
- Detail modal with pessimistic / expected / optimistic bar charts for each recipe
- All data persisted to `localStorage` (`ro_stats`, `ro_prices`, `ro_sell`)
