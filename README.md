# minialgoridam-experiments

A6 printables for daily, monthly, and yearly use. Each printable is an A4 page with four A6 cards and dotted cut guides.

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
| Daily | Staged Action Tracker | `printables/templates/staged-action-tracker.js` |
| Monthly | Monthly Habit Tracker | `printables/templates/habit-tracker.js` |
| Monthly | Spend Tracker | `printables/templates/spend-tracker.js` |
| Monthly | Monthly Calendar | `printables/templates/monthly-calendar.js` |
| Yearly | Goal Tracker | `printables/templates/goal-tracker.js` |

## Live site

Hub: **https://algoridam20.github.io/minialgoridam-experiments/public/**

- [Multi-Step Project Tracker](https://algoridam20.github.io/minialgoridam-experiments/public/printables/multi-step-tracker.html)
- [Staged Action Tracker](https://algoridam20.github.io/minialgoridam-experiments/public/printables/staged-action-tracker.html)
- [Monthly Habit Tracker](https://algoridam20.github.io/minialgoridam-experiments/public/printables/habit-tracker.html)
- [Spend Tracker](https://algoridam20.github.io/minialgoridam-experiments/public/printables/spend-tracker.html)
- [Monthly Calendar](https://algoridam20.github.io/minialgoridam-experiments/public/printables/monthly-calendar.html)
- [Goal Tracker](https://algoridam20.github.io/minialgoridam-experiments/public/printables/goal-tracker.html)

Pages deploys from the `main` branch (legacy). Built HTML in `public/` is committed on each deploy. If an org admin switches Pages to **GitHub Actions**, drop the `/public` prefix (e.g. `/printables/goal-tracker.html`).

## Repository layout

```text
printables/
  lib/                  # shared tokens, layout shell, blocks
  templates/            # one file per printable
    habit-tracker.js
    multi-step-tracker.js
    staged-action-tracker.js
    goal-tracker.js
    spend-tracker.js
    monthly-calendar.js
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
    staged-action-tracker.html
    goal-tracker.html
    spend-tracker.html
    monthly-calendar.html
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
| Tracker gap | 2 mm | Uniform inner margins for list-based trackers |
| Staged action (relaxed) | 8 items, 3 mm symbols | Left column (TL + BL); symbols top-right |
| Staged action (dense) | 16 items, 2.5 mm symbols | Right column (TR + BR); symbols vertically centered |
| Spend tracker | 30 segments, 70% width | Centered bucket; open top; dotted segment lines; 10 mm vertical margin |
| Calendar | 6 weeks, hairline date borders | Vertical “JULY 2026” sidebar; S–S weekday row |
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
| `a4sheet(content)` | 4× identical card on A4 with per-card cut outlines |
| `a4sheetVariants({ tl, tr, bl, br })` | 4× card with different content per quadrant |
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

### Staged action tracker

Each item is an inner card with a write line and three stage symbols (square → triangle → circle) on the right. One A4 sheet uses two densities via `a4sheetVariants`:

| Quadrant | Layout |
|---|---|
| Top left, bottom left | Relaxed — 8 items per card |
| Top right, bottom right | Dense — 16 items per card |

| Block | Description |
|---|---|
| `stageSymbols()` | Square, triangle, circle (matching SVG stroke) |
| `stagedActionItem()` | Inner card with write line and stage symbols |
| `stagedActionTracker(count)` | Stack of staged action items |
| `stagedActionTrackerStyles()` | Styles for staged action layout (relaxed + dense) |

### Spend tracker

Centered vertical bucket (70% card width) with 30 equal-height segments. Dotted dividers between segments; open top (no top border — sides and bottom only). Shade bottom → top as the bucket fills. No labels or scale markers; 10 mm space above and below the bucket. Remaining card area (dot grid) is for handwritten notes.

| Block | Description |
|---|---|
| `spendTracker()` | Centered vertical segmented bucket |
| `spendTrackerStyles()` | Styles for spend tracker layout |

### Monthly calendar

Accurate Sunday-first grid for a configured month/year. **JULY 2026** label runs bottom-to-top along the left border (letters facing right); **S M T W T F S** row above the grid. In-month cells have hairline borders with dot grid showing through.

Set `YEAR` and `MONTH` at the top of `printables/templates/monthly-calendar.js` before building.

| Block | Description |
|---|---|
| `monthlyCalendar(year, month)` | Sidebar + weekday row + date grid |
| `monthlyCalendarStyles()` | Styles for calendar layout |
| `buildCalendarCells(year, month)` | 42-cell grid data (`printables/lib/calendar.js`) |
| `nextMonth(year, month)` | Following month (December → January next year) |

## GitHub Pages setup

The deploy workflow runs `npm run build` on pushes to `main` and commits the output to `public/`. With legacy branch deploy (current), the site is served from `main` at `/public/…`.

Optional: an org admin can switch **Settings → Pages → Source** to **GitHub Actions** so the workflow artifact is served from the site root instead.
