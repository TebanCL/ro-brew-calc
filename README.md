# RO Potion Cost-Benefit Calculator

[![CI](https://github.com/tebancl/ro-brew-calc/actions/workflows/deploy.yml/badge.svg)](https://github.com/tebancl/ro-brew-calc/actions/workflows/deploy.yml)

A single-page calculator for Ragnarok Online players to evaluate the profitability of potion crafting via **Potion Creation** (Alchemist / Creator) and **Special Pharmacy** (Geneticist).

Targets the **Ragnarok Latinoamérica** server. Available in English, Spanish, and Portuguese.

## Features

- **Potion Creation** — 18 recipes with success rate, cost-per-success, and profit per unit
- **Special Pharmacy** — 19 recipes with quantity produced, per-unit cost, and batch profit
- **Material Prices** — NPC base prices with Discount skill support and manual override
- **Pessimistic / Expected / Optimistic** scenarios for Special Pharmacy outputs
- All settings persisted in `localStorage` — no account needed
- Language selector: EN / ES / PT (official ROLATAM item names)

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
│   └── PotionCalc.tsx    # main UI component
├── lib/
│   ├── formulas.ts       # pure formula functions (exported)
│   └── formulas.test.ts  # Vitest unit tests
├── layouts/
│   └── Layout.astro
└── pages/
    └── index.astro
```

## Data sources

- Formulas: [iRO Wiki — Potion Creation](https://irowiki.org/wiki/Potion_Creation), [Special Pharmacy](https://irowiki.org/wiki/Special_Pharmacy)
- Item Rates (Special Pharmacy): [browiki.org — Farmacologia Avançada](https://browiki.org/wiki/Farmacologia_Avan%C3%A7ada)
- Item names: [RagnaPlace ROLATAM database](https://ragnaplace.com)
- Item icons: [Divine Pride](https://www.divine-pride.net)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
