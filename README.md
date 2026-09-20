# Star Studio

A small offline-capable study game (Progressive Web App) built with Phaser 3. Three worlds: **Number Power** (place value, comparing, rounding, estimation, adding and subtracting), **Solar System**,
and **Virginia Studies** (Virginia's Indigenous People).

- No build step: static files, ES modules, Phaser vendored in `vendor/`.
- All art is generated SVG (`src/core/art.js`), all sound is synthesized (`src/core/sfx.js`). No asset downloads.
- Progress is stored in the browser's `localStorage` only. No accounts, no analytics, no network calls after install.
- Math problems are generated (`src/math/gen.js`), so every answer is computed and numbers are fresh each time.
- Missed items come back later in the same level; math items come back with new numbers.

## Install on an iPad
Open the site in Safari, Share, **Add to Home Screen**, then always launch from the icon (iOS gives the icon its own storage).

## Develop
`python3 -m http.server 8766` and open http://localhost:8766. The service worker is skipped on localhost.
When deploying, bump `VERSION` in `sw.js` and add any new file to its `SHELL` list.

## Add a world
Add a levels file that exports `[{id, name, emoji, skill, sticker, make()}]`, where `make()` returns items for the mechanics in
`src/mech/index.js` (`choice`, `sort`, `order`, `digit`, `keypad`, `hill`, `hotspot`), then register it in `src/worlds.js`.
