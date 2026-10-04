# Witcher Gear Checklist

A single-page Vite + React + TypeScript checklist for The Witcher 3: Wild Hunt, based on the [VULKK gear catalog](https://vulkk.com/2023/11/04/the-witcher-3-gear-sets-catalog/) and its linked guides.

## Develop

Requires Node.js 20.19+ or 22.12+ and pnpm.

```sh
pnpm install
pnpm dev
pnpm typecheck
pnpm test
pnpm build
pnpm preview
```

Tracks individual pieces and tiers for seven Witcher gear families and nine other catalog sets. Search, collection filters, and complete-tier actions are provided. Progress is device-local in localStorage, with storage failures surfaced in the UI. Clearing browser data removes progress. No account or backend is required.

The dataset represents a standard playthrough, not separate legendary New Game Plus variants. Upgraded gear does not automatically mark earlier tiers collected. Crossbows for Feline and Ursine are tracked separately. Other gear follows the current catalog, including Scarlet Crest, and includes Ofieri weapons and horse equipment and Undvik horse equipment. This is a set checklist, not an exhaustive database of every random weapon, armor drop, or cosmetic variant.

Data is in `src/data.ts`; source attribution appears in the application. Facts were checked against the catalog and linked guides on October 4, 2026. No article text or game artwork is bundled.

## Source structure

- `src/main.tsx`: React entry point.
- `src/App.tsx`: page composition, filters, and selection state.
- `src/components/`: reusable gear checkbox, tier, set card, progress bar, search field, and collection sidebar.
- `src/hooks/useChecklistProgress.ts`: browser persistence and cross-tab synchronization.
- `src/types.ts`: shared catalog and progress types.

The production build runs strict TypeScript checking first. Tests run with Node.js 22.18+ (or Node.js 24+) using native TypeScript support.
