# Forever — The Adventurer’s Field Guide

An independent WoW Forever field guide, featuring **Troll Restoration Shaman** and an interactive **level 10–60 healing-first talent path**. Vite and vanilla JavaScript; no backend, accounts, API keys, or environment variables.

## Features

- Nine class browsers, 27 specialization starter guides, role filters, and search.
- Nine class talent planners: 27 trees and 469 talents from community beta snapshot **1.60.1.69913**.
- Exact snapshot rank text, grid positions, earlier-row / explicit-point requirements, prerequisites, dependency-safe refunds, tree resets, and undo.
- Separate autosaved drafts for every class, up to 50 named saves, share links, JSON file import/export, and pasted-link imports.
- Troll Restoration healing priorities, racials, totems, equipment principles, and mouseover macros.
- Level-by-level talent itinerary, explanations for each selection, milestones, level selector, and one-click allocation loading.
- Mobile layouts, keyboard-operated specialization tabs, focusable talent details, skip link, and reduced-motion support.

## Run and check

Requires Node.js 22.12+ (tested on Node.js 26).

```sh
npm install
npm run dev
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

The tests validate every leveling allocation from level 10 through 60, source shapes, prerequisites, invalid imports, and all nine planners. Browser checks run on desktop Chrome and an emulated Pixel 7.

## Restoration leveling route

This is an **editorial dungeon-healing route, not a fastest solo-leveling claim**. Before level 10 there are no base talent points. The route reaches Water Shield at 20, Mana Tide at 25, Nature’s Swiftness at 30, and Riptide at 40. At 60 it spends **0 Elemental / 10 Enhancement / 41 Restoration**. Every point is checked against the stored snapshot’s rules. Healing-first talents trade away solo damage; the guide explains the option of a separate questing setup with Dual Specialization at 40.

## Important data limitations

**Do not describe this as an independently verified live-client calculator.** The planner contains a public community client-data snapshot, not a current Blizzard export. Later hotfixes can differ. The October developer deep dive differs from some snapshot labels and dependencies, so versions are not silently blended. A known source cycle between Druid Nature’s Majesty and Nature’s Splendor is disclosed in the UI; those nodes cannot be learned under the imported source rules. Imported allocations must be learnable in sequence, so mutual prerequisites cannot validate themselves.

No Legacy bonus points, in-game import strings, tested endgame rotations, raid BiS rankings, or simulation-backed recommendations are claimed. Troll racial guidance cites the October 27 Icy Veins update; verify current values in game.

The old incomplete Mage prototype schema is intentionally incompatible. Existing `forever-mage` browser storage is preserved and a warning is shown rather than mapping old points to potentially different talents. New links carry a class identifier and a snapshot schema version.

### Sources and refreshing

Blizzard talent text/icons are sourced through [MMO Herald’s public client-data snapshot](https://www.mmoherald.com/wow-forever/tools/talents), credited there to wago.tools. Only game-data fields are imported, not the source site’s UI or editorial comparisons. Original class and healing guidance lives in `src/guides.js`.

- [Blizzard Mage & Shaman developer deep dive](https://worldofwarcraft.blizzard.com/en-us/news/24302097/world-of-warcraft-forever-class-deep-dives-mage-and-shaman)
- [Troll racial reference](https://www.icy-veins.com/wow-forever/troll-race-guide)
- [Blizzard beta development notes](https://us.forums.blizzard.com/en/wow/t/wow-forever-beta-development-notes-%E2%80%93-updated-november-2/2360696)

`npm run data:refresh` fetches the public snapshot and regenerates `src/talents.json`. It decodes data strings without executing downloaded JavaScript and fails if it cannot find nine classes from the pinned build. Inspect the diff and rerun all checks before publishing. If the client build changes, update the schema version and revalidate the route rather than importing changes into old shares silently.

## Deploy

Import **D3nm4u5/WOWF-GUIDE** into Vercel. Framework: **Vite**. Build: `npm run build`. Output: `dist`. No environment variables. Pushes to `main` trigger a new deployment when the GitHub integration is enabled.

## Privacy and credits

Builds stay in local browser storage; clearing browser data removes them. Export or keep share links for backup. External icons use Wowhead’s CDN, the decorative photo uses Unsplash, and fonts use Google Fonts with local fallbacks. No analytics or game-account login. Blizzard owns Warcraft game text and icons. Not affiliated with Blizzard Entertainment.
