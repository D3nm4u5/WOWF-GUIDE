# Forever — The Adventurer’s Field Guide

Independent World of Warcraft: Forever **1.60.1** web app. Built with Vite and vanilla JavaScript; no backend, API keys, or environment variables required.

## Run locally

```sh
npm install
npm run dev
```

## Check

```sh
npm test
npm run build
```

Browser checks (desktop and mobile):

```sh
npx playwright install chromium
npm run test:e2e
```

## Deploy to Vercel

1. In Vercel, choose **Add New → Project** and import this private GitHub repository. Give the Vercel GitHub integration access to the repository if it is not listed.
2. Use the **Vite** preset. Root directory: repository root. Build: `npm run build`. Output: `dist`.
3. Click **Deploy**. No environment variables are required. Future pushes to the production branch automatically redeploy.

## Included

- Responsive nine-class browser, role filters, and search.
- General class overviews and Mage specialization introductions.
- Mage draft talent calculator with level budgets, earlier-row gating, prerequisite validation, and refunds.
- Local browser saving and versioned shareable URL snapshots.

## Data limitations

The target game version is 1.60.1. **The calculator data is an incomplete, manually curated prototype, not a verified client export.** Talent ranks, rows, prerequisites, and descriptions need validation against that exact game client and its hotfix build. Do not use it as an authoritative gameplay calculator. All other class calculators and tested specialization guides remain future work. Legacy talent perks are not modeled. Shared URLs are app-specific, not in-game import strings.

References are linked in the app. Blizzard’s class deep dives may predate later beta changes. External icons are served by Wowhead’s CDN, the decorative forest photo by Unsplash, and fonts by Google Fonts; the interface has local font fallbacks. No artwork or game data ownership is claimed. Not affiliated with Blizzard Entertainment.

## Structure

- `src/data.js`: class content and clearly marked draft Mage talents.
- `src/planner.js`: allocation rules, serialization, and import validation.
- `src/main.js`: interface and interactions.
- `src/style.css`: responsive visual design.
