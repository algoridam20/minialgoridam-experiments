# minialgoridam-experiments

A6 printables for daily, monthly, and yearly use. Each printable is an A4 page with four identical cards and dotted cut guides.

**Edit `printables/`** → run **`npm run build`** → output lands in **`public/`** (generated; committed for GitHub Pages).

## Quick start

```bash
npm run build      # generate public/index.html + public/printables/*.html
npm run preview    # build + serve locally
```

Open a printable, then **Ctrl/Cmd+P** to print. Use A4 paper, no scaling (100%).

## Printables

| Category | Title | File |
|---|---|---|
| Daily | Multi-Step Project Tracker | `printables/templates/multi-step-tracker.js` |
| Monthly | Monthly Habit Tracker | `printables/templates/habit-tracker.js` |
| Yearly | Goal Tracker | `printables/templates/goal-tracker.js` |

## Live site

Hub: **https://algoridam20.github.io/minialgoridam-experiments/public/**

- [Multi-Step Project Tracker](https://algoridam20.github.io/minialgoridam-experiments/public/printables/multi-step-tracker.html)
- [Monthly Habit Tracker](https://algoridam20.github.io/minialgoridam-experiments/public/printables/habit-tracker.html)
- [Goal Tracker](https://algoridam20.github.io/minialgoridam-experiments/public/printables/goal-tracker.html)

Pages deploys from the `main` branch (legacy). Built HTML in `public/` is committed on each deploy. If an org admin switches Pages to **GitHub Actions**, drop the `/public` prefix (e.g. `/printables/goal-tracker.html`).

## Repository layout

```text
printables/
  lib/                  # shared tokens, layout shell, blocks
  templates/            # one file per printable
    habit-tracker.js
    multi-step-tracker.js
    goal-tracker.js
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
    goal-tracker.html
```

## Design tokens

All dimensions and colors live in `printables/lib/tokens.js`:

| Token | Value | Purpose |
|---|---|---|
| Paper | A4 (210 × 297 mm) | Print sheet |
| Card | 90 × 145 mm | Fits Leuchtturm1917 A6 Pocket (90 × 150 mm) |
| Sheet margin | 7.5 mm | Card placement within each A4 quadrant |
| Card cut outline | 2 mm | Dotted trim guide outside each card border |
| Line weight | 1 px | Borders, frames, dividers |
| Corner radius | 0.5 mm | Cards, frames, progress bars |
| Dot grid | 3.8 mm spacing | Background on each A6 card |
| Tracker gap | 2 mm | Inner margins for multi-step and goal trackers |
| Progress bar | 4 mm tall, 8 segments | 12.5% per segment |

## Adding a printable

1. Create `printables/templates/my-tracker.js`:

```js
import { a4sheet, cardInner } from "../lib/layout.js";
import { blockStyles, goalTrackerStyles, goalTracker } from "../lib/blocks.js";
import { printablePage } from "../lib/document.js";

export default {
  id: "my-tracker",
  title: "My Tracker",
  category: "daily",
  build() {
    const card = cardInner(goalTracker(), {
      flex: true,
      className: "card-inner--goal",
    });
    return printablePage({
      title: this.title,
      extraStyles: blockStyles() + goalTrackerStyles(),
      body: a4sheet(card),
    });
  },
};
```

2. Register it in `printables/manifest.json`
3. Run `npm run build`

## Available blocks

### Layout

| Block | Description |
|---|---|
| `a4sheet(content)` | 4× card on A4 with per-card cut outlines |
| `cardInner(content, { flex, className })` | Padded inner area |

### Habit tracker

| Block | Description |
|---|---|
| `dateRowWithLabels(days)` | MIN / day numbers / MAX header row |
| `habitTracker(cols, rows)` | Grid, week guides, and slant footer |
| `habitTrackerStyles(cols, rows)` | Styles for the habit tracker layout |

### Project & goal trackers

| Block | Description |
|---|---|
| `trackerHeaderRow({ titleLabel, dateLabel })` | Labeled title and date fields |
| `trackerWhyRow()` | Motivation line |
| `trackerMilestones(n)` | Checkbox milestone rows |
| `trackerList()` | Blank list area (dot grid shows through) |
| `progressBarContinuous(n)` | Continuous bar split into n segments |
| `trackerCard()` | Single tracker card (header, list, progress) |
| `multiStepTracker(count)` | Stack of tracker cards |
| `multiStepTrackerStyles()` | Styles for multi-step layout |
| `goalTracker()` | Single goal card with why, milestones, and progress |
| `goalTrackerStyles()` | Styles for goal layout |

## GitHub Pages setup

The deploy workflow runs `npm run build` on pushes to `main` and commits the output to `public/`. With legacy branch deploy (current), the site is served from `main` at `/public/…`.

Optional: an org admin can switch **Settings → Pages → Source** to **GitHub Actions** so the workflow artifact is served from the site root instead.
