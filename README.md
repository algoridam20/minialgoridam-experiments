# minialgoridam-experiments

A6 printables for daily, monthly, and yearly use. Each printable is an A4 page with four identical cards and dotted cutting guides.

**Edit `printables/`** — run **`npm run build`** — output lands in **`public/`** (generated, do not edit).

## Quick start

```bash
npm run build      # generate public/index.html + public/printables/*.html
npm run preview    # build + serve locally
```

Open a printable, then **Ctrl/Cmd+P** to print. Use A4 paper, no scaling (100%).

## Live site

**https://algoridam20.github.io/minialgoridam-experiments/public/**

Printables:

- [Habit tracker](https://algoridam20.github.io/minialgoridam-experiments/public/printables/habit-tracker.html)
- [Multi-step tracker](https://algoridam20.github.io/minialgoridam-experiments/public/printables/multi-step-tracker.html)

Pages currently deploys from the `main` branch (legacy). Built HTML in `public/` is committed on each deploy so printables are available at the URLs above. If an org admin switches Pages to **GitHub Actions**, drop the `/public` prefix (e.g. `/printables/habit-tracker.html`).

## Repository layout

```text
printables/
  lib/                  # shared tokens, layout shell, blocks
  templates/            # one file per printable
  manifest.json         # registry (id, title, category)
  hub.template.html     # GitHub Pages index styling

scripts/
  build.mjs             # manifest → public/

public/                 # GENERATED — run npm run build; committed for GitHub Pages
  .nojekyll
  index.html
  printables/
    habit-tracker.html
    multi-step-tracker.html
```

## Design tokens

All dimensions and colors live in `printables/lib/tokens.js`:

| Token | Value | Purpose |
|---|---|---|
| Paper | A4 (210 × 297 mm) | Print sheet |
| Card | 90 × 145 mm | Fits Leuchtturm1917 A6 Pocket (90 × 150 mm) |
| Sheet margin | 7.5 mm | Card placement margin within each A4 quadrant |
| Card cut outline | 2 mm | Dotted trim guide outside each card border |
| Dot grid | 3.8 mm spacing | On each card, aligned to inner padding |

## Adding a printable

1. Create `printables/templates/my-tracker.js`:

```js
import { a4sheet, cardInner } from "../lib/layout.js";
import { blockStyles, dateRow, grid } from "../lib/blocks.js";
import { printablePage } from "../lib/document.js";

export default {
  id: "my-tracker",
  title: "My Tracker",
  category: "daily",
  build() {
    const card = dateRow(31) + grid(10, 31);
    return printablePage({
      title: this.title,
      extraStyles: blockStyles(),
      body: a4sheet(card),
    });
  },
};
```

2. Register it in `printables/manifest.json`
3. Run `npm run build`

## Available blocks

| Block | Description |
|---|---|
| `a4sheet(content)` | 4× card on A4 with per-card cut outlines |
| `cardInner(content, { flex })` | Padded inner area |
| `dateRow(days)` | Numbered day crossoff row |
| `grid(cols, rows)` | Square habit matrix |
| `slantedLines(cols)` | Diagonal label lines below grid |
| `headerRow()` | Title + date fields |
| `progressBar(n)` | Row of checkbox squares |
| `writeArea()` | Blank writing space |
| `multiStepSection(last?)` | Full project-tracker section |

## GitHub Pages setup

The deploy workflow runs `npm run build` on pushes to `main` and commits the output to `public/`. With legacy branch deploy (current), the site is served from `main` at `/public/…`.

Optional: an org admin can switch **Settings → Pages → Source** to **GitHub Actions** so the workflow artifact is served from the site root instead.
