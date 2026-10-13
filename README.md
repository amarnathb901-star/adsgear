# AdsGear

Free multi-tool site for performance marketers — UTM Builder, UTM Decoder, Ad Spec Checker, and ROAS Calculator. Pure frontend SPA, no backend, all logic runs in the browser.

## Stack
- React 18 + Vite
- Tailwind CSS
- react-router-dom (client routing)
- react-helmet-async (per-page SEO tags + JSON-LD)
- lucide-react (icons)
- localStorage (UTM Builder history — no server, no database)

## Local development
```bash
npm install
npm run dev
```

## Build
```bash
npm run build   # outputs to dist/
npm run preview # serve the production build locally
```

## Deploy to Netlify
1. Push this repo to GitHub.
2. In Netlify: **Add new site → Import an existing project → GitHub** → select the repo.
3. Build settings (also pre-set in `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy. The included `netlify.toml` redirect rule handles client-side routing (all paths → `index.html`), so direct links like `/blog/how-to-calculate-roas` work correctly.
5. Point the `adsgear.net` domain at the Netlify site under **Domain settings**.

## Before going live — placeholders to replace
| File | What to update |
|---|---|
| `src/pages/Contact.jsx` | `FORMSPREE_ENDPOINT` — replace `YOUR_FORM_ID` with your real Formspree form ID |
| `src/utils/analytics.js` | `GA_MEASUREMENT_ID` — replace with your GA4 measurement ID (starts with `G-`) |
| `public/og-image.png` | Add a real 1200×630px Open Graph image (referenced in `src/components/SEO.jsx`) |
| `src/data/specs.json` | Double-check current platform specs before the Ad Spec Checker goes live — platforms update these periodically |

## Project structure
```
src/
  components/   Header, Footer, Layout, SEO, CopyButton, NumberField
  pages/        Home, UtmBuilder, UtmDecoder, SpecChecker, RoasCalculator,
                 About, Contact, Privacy, FAQ, BlogIndex, BlogPost, NotFound
  data/          specs.json (ad platform specs), blogPosts.js (8 SEO articles)
  utils/         utm.js (builder/decoder logic + history), metrics.js (ROAS math),
                 analytics.js (GA4 wrapper)
public/
  robots.txt, sitemap.xml, favicon.svg
netlify.toml     build command + SPA redirect rule
```

## Notes
- All 4 tools compute entirely client-side — no API calls, no data leaves the browser.
- UTM Builder history is capped at 20 entries in localStorage, matching the V1 spec.
- Ad Spec Checker specs live in `src/data/specs.json` and ship inside the JS bundle — update this file directly when platforms change requirements (no CMS in V1, per the architecture decision).
- V2 (LLM features via Anthropic API) intentionally has no scaffolding here yet — add a Node/Express backend on Render only when that phase starts, per the locked architecture decision.
