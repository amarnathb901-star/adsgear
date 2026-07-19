# adsgear.net — Project Context

## Stack
- React 18 + Vite + Tailwind CSS
- react-router-dom for routing, react-helmet-async for SEO tags
- Pure frontend SPA — no backend in V1. Everything runs in the browser.
- Hosted on Netlify, auto-deploys on push to main (see netlify.toml)

## Structure
- `src/pages/` — one file per route (Home, UtmBuilder, UtmDecoder, SpecChecker, RoasCalculator, etc.)
- `src/components/` — shared UI (Header, Footer, SEO, CopyButton, NumberField)
- `src/utils/` — pure calculation logic (utm.js, metrics.js) — keep business logic here, not in components
- `src/data/` — specs.json (ad platform specs) and blogPosts.js (article content)

## Conventions (locked, don't change without asking)
- Brand color: indigo #4f46e5. Green/amber/red for pass/borderline/fail states.
- No dark mode, no submit buttons on calculators — results update live as the user types.
- Spinner step sizes: budget fields step 100, percentages step 1, impressions/clicks step 10, CPM/CPC step 0.5.
- Card-per-section layout (input card, then results card).

## Before every push
Always run `npm run build` first and confirm it completes with no errors before committing/pushing.
Netlify will auto-deploy whatever lands on `main`, so a broken build going live is the main thing to avoid.

## Roadmap
Feature priorities live in the adsgear-net-roadmap.xlsx spreadsheet (not in this repo) —
ask before assuming what to build next if it's not explicitly requested.
