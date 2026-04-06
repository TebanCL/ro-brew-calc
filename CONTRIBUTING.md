# Contributing

Thanks for your interest in contributing to the RO Potion Cost-Benefit Calculator!

## Prerequisites

- Node.js >= 22 LTS (use `.nvmrc`: `nvm use`)
- pnpm >= 9 (`npm install -g pnpm` or via [corepack](https://nodejs.org/api/corepack.html): `corepack enable`)

## Setup

```bash
git clone https://github.com/tebancl/ro-brew-calc.git
cd ro-brew-calc
pnpm install
pnpm dev
```

## Before submitting a PR

Make sure all checks pass locally:

```bash
pnpm typecheck   # TypeScript type checking
pnpm lint        # ESLint
pnpm test        # Vitest unit tests
pnpm build       # Production build
```

## What to contribute

**Good candidates:**

- Bug fixes in the brewing formulas (cite the iRO Wiki page)
- Missing or incorrect item names / translations
- New recipes added in official server updates
- UI improvements for mobile or accessibility

**Please avoid:**

- Adding new dependencies without discussion
- Changing formula logic without a source (iRO Wiki, official patch notes, etc.)
- Large refactors unrelated to a bug or feature

## Item data & formulas

All game data must be sourced from:
- [iRO Wiki — Potion Creation](https://irowiki.org/wiki/Potion_Creation)
- [iRO Wiki — Special Pharmacy](https://irowiki.org/wiki/Special_Pharmacy)
- [RagnaPlace ROLATAM item database](https://ragnaplace.com) (for official ES/PT item names)

If a value differs from the wiki, leave a comment in the code explaining why.

## Translations

Item names use the official ROLATAM client strings (EN/ES/PT). If you find an incorrect translation, open an issue with a screenshot or link to the source.

## Reporting bugs

Open a GitHub issue. Include:
- Your character stats (if formula-related)
- Expected vs actual result
- Server (ROLATAM, iRO, etc.)
