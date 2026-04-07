# RO Potion Cost-Benefit Calculator

[![CI](https://github.com/tebancl/ro-brew-calc/actions/workflows/deploy.yml/badge.svg)](https://github.com/tebancl/ro-brew-calc/actions/workflows/deploy.yml)

A single-page calculator for Ragnarok Online players to evaluate the profitability of potion crafting via **Potion Creation** (Alchemist / Creator), **Special Pharmacy**, and **Mix Cooking** (Geneticist).

Targets the **Ragnarok Latinoamérica** server. Available in English, Spanish, and Portuguese.

🔗 **[Live app](https://tebancl.github.io/ro-brew-calc/)**

## Features

- **Potion Creation** — 18 recipes with success rate, cost-per-success, and profit per unit
- **Special Pharmacy** — 19 recipes with quantity produced, per-unit cost, and batch profit
- **Mix Cooking** — 6 recipes with pessimistic / expected / optimistic quantity scenarios
- **Collapsible ingredient list** per recipe row — click any potion name to expand
- **Detail modal** with compact pess/avg/opt scenario table and **bulk materials calculator** (enter a target quantity → see crafts needed and per-ingredient totals)
- **Material Prices** — NPC base prices with Discount skill support and manual override
- **KaTeX formula sections** with live stat substitution in all three craft tabs
- All settings persisted in `localStorage` — no account needed
- Language selector: EN / ES / PT (official ROLATAM item names)
- Item and skill icons sourced from Divine Pride and browiki.org

## Development

**Requirements:** Node.js >= 22 (LTS), pnpm >= 9

```bash
pnpm install
pnpm dev          # http://localhost:4321
pnpm build        # production build → ./dist/
pnpm preview      # preview production build locally
```

**Quality checks:**

```bash
pnpm typecheck
pnpm lint
pnpm test
```

## Project structure

```
src/
├── components/
│   ├── PotionCalc.tsx          # root coordinator (state, layout)
│   ├── StatsPanel.tsx          # stats / skills / levels inputs
│   ├── PricesTab.tsx           # material prices tab
│   ├── PotionCreationTab.tsx   # PC table + KaTeX formula
│   ├── SpecialPharmacyTab.tsx  # SP table + KaTeX formula
│   ├── MixCookingTab.tsx       # MC table + KaTeX formula
│   ├── DetailModal.tsx         # per-recipe detail modal (scenario table + bulk calculator)
│   ├── ScenarioTable.tsx       # compact pess/avg/opt comparison grid
│   ├── Ni.tsx                  # reusable number input
│   ├── Tex.tsx                 # KaTeX wrapper
│   ├── RoTitleBar.tsx          # shared blue title bar
│   └── ui/                     # shadcn/ui primitives
├── lib/
│   ├── formulas.ts             # pure formula functions (exported)
│   ├── formulas.test.ts        # Vitest unit tests
│   ├── data.ts                 # recipes, NPC prices, item icons
│   ├── i18n.ts                 # EN / ES / PT strings
│   ├── storage.ts              # localStorage helpers
│   └── utils.ts                # cn() helper
├── styles/
│   └── globals.css             # Tailwind v4 entry + RO theme CSS variables
├── layouts/
│   └── Layout.astro            # HTML shell, SEO meta tags
└── pages/
    └── index.astro
```

## Tech stack

- **Astro 6** + **React 19** (`client:load`)
- **Tailwind CSS v4** via `@tailwindcss/vite` (configured in CSS, no config file)
- **shadcn/ui** components styled to match the RO Basic Skin theme
- **KaTeX** for math formula rendering
- **Vitest** for unit tests
- Deployed via **GitHub Pages** + GitHub Actions

## Data sources

- Formulas: [iRO Wiki — Potion Creation](https://irowiki.org/wiki/Potion_Creation), [Special Pharmacy](https://irowiki.org/wiki/Special_Pharmacy)
- Item Rates (Special Pharmacy): [browiki.org — Farmacologia Avançada](https://browiki.org/wiki/Farmacologia_Avan%C3%A7ada)
- Item names: [RagnaPlace ROLATAM database](https://ragnaplace.com)
- Item icons: [Divine Pride](https://www.divine-pride.net)

## Support

If this tool saves you zeny, consider [supporting on Ko-fi](https://ko-fi.com/tebancl) ☕

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
