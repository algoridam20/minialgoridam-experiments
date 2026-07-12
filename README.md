# minialgoridam-experiments

A repo for hosting many standalone HTML experiments (algorithm visualizers, demos, prototypes) and publishing them automatically to GitHub Pages.

No build step, bundler, or framework is required — just plain `.html` files (plus optional CSS/JS/images alongside them).

## Live site

After the one-time GitHub Pages setup below, the site is published at:

**https://algoridam20.github.io/minialgoridam-experiments/**

Each HTML file gets its own URL based on its path under `public/`. For example:

| File in repo | Published URL |
|---|---|
| `public/index.html` | `…/minialgoridam-experiments/` |
| `public/examples/binary-search.html` | `…/minialgoridam-experiments/examples/binary-search.html` |
| `public/sorting/bubble-sort.html` | `…/minialgoridam-experiments/sorting/bubble-sort.html` |

---

## How it works

```mermaid
flowchart LR
    A[You add HTML under public/] --> B[Push to main]
    B --> C[GitHub Actions workflow runs]
    C --> D[generate-index.mjs scans public/]
    D --> E[Updates public/index.html listing]
    E --> F[Uploads public/ as Pages artifact]
    F --> G[Deploys to GitHub Pages]
    G --> H[Site is live]
```

### 1. You write static files

All publishable content lives in `public/`. Each `.html` file is a standalone page. You can organize them into folders however you like:

```text
public/
  index.html                      # landing page (hub)
  examples/
    hello-world.html
    binary-search.html
  sorting/
    bubble-sort.html
  shared/
    styles.css                    # optional shared assets
    utils.js
```

### 2. Push triggers the deploy workflow

The workflow (`.github/workflows/deploy-pages.yml`) runs when you push to `main` and change files under:

- `public/**`
- `scripts/**`
- `.github/workflows/deploy-pages.yml`

You can also trigger it manually from the **Actions** tab → **Deploy static pages** → **Run workflow**.

### 3. The index is auto-generated

Before deploy, `scripts/generate-index.mjs` runs. It:

1. Recursively scans `public/` for every `.html` file
2. Skips `public/index.html` itself (that's the hub, not a listing entry)
3. Groups pages by top-level folder (e.g. everything under `examples/` appears under an "Examples" heading)
4. Writes a link list into `public/index.html` between two HTML comment markers:

```html
<!-- GENERATED_PAGES_START -->
  … links are inserted here on every deploy …
<!-- GENERATED_PAGES_END -->
```

You can customize the styling and header of `index.html`, but don't manually edit the content between those markers — it gets overwritten on each deploy.

### 4. GitHub Pages serves the files

The workflow uploads the entire `public/` folder and deploys it to GitHub Pages. GitHub hosts the files as-is — no server, no database, just static file hosting over HTTPS.

---

## Repository layout

```text
.
├── .github/
│   └── workflows/
│       └── deploy-pages.yml    # CI/CD: build index + deploy to Pages
├── public/                     # Everything here is published
│   ├── index.html              # Hub page (partially auto-generated)
│   └── examples/               # Example experiments
│       ├── hello-world.html
│       └── binary-search.html
├── scripts/
│   └── generate-index.mjs      # Scans public/ and updates index.html
└── README.md
```

| File | Role |
|---|---|
| `public/` | **Source of truth** for all published content |
| `public/index.html` | Landing page with auto-generated directory of all experiments |
| `scripts/generate-index.mjs` | Builds the page listing before each deploy |
| `.github/workflows/deploy-pages.yml` | Orchestrates index generation and GitHub Pages deployment |

---

## Adding a new page

1. Create a new `.html` file anywhere under `public/`:

   ```text
   public/my-topic/my-demo.html
   ```

2. Use **relative paths** for links and assets so pages work both locally and on GitHub Pages (which serves from a subpath `/minialgoridam-experiments/`):

   ```html
   <!DOCTYPE html>
   <html lang="en">
     <head>
       <meta charset="UTF-8" />
       <title>My Demo</title>
       <link rel="stylesheet" href="../shared/styles.css" />
     </head>
     <body>
       <h1>My Demo</h1>
       <script src="./app.js"></script>
       <a href="../index.html">Back to index</a>
     </body>
   </html>
   ```

3. Commit and push to `main`.

4. Wait ~1–2 minutes for the workflow to finish. Your page will be live at:

   `https://algoridam20.github.io/minialgoridam-experiments/my-topic/my-demo.html`

5. The hub page (`index.html`) will automatically include a link to your new page, grouped under the `my-topic` folder heading.

### Tips for many HTML pages

- **One folder per topic** — keeps the index organized (`sorting/`, `graphs/`, `dp/`, etc.)
- **Self-contained pages** — each HTML file should work on its own; inline CSS/JS is fine for small demos
- **Shared assets** — put reusable CSS/JS/images in something like `public/shared/` and reference them with relative paths
- **No absolute paths** — avoid `/styles.css` or `https://…` for internal assets; use `../shared/styles.css` instead

---

## Local preview

Preview exactly what will be deployed:

```bash
# Regenerate the index (same step the workflow runs)
node scripts/generate-index.mjs

# Serve the public/ folder locally
npx --yes serve public
```

Open **http://localhost:3000** — this mirrors the GitHub Pages structure (pages served from the root of `public/`).

---

## GitHub Pages setup (one-time)

Do this once after pushing the repo to GitHub:

1. Go to your repo on GitHub → **Settings** → **Pages**
2. Under **Build and deployment**, set **Source** to **GitHub Actions**
   - Do **not** choose "Deploy from a branch" — this repo uses the Actions-based deploy workflow
3. Push to `main` (or manually run the workflow from the **Actions** tab)
4. After the workflow succeeds, your site URL appears on the Pages settings page and in the workflow's deploy job output

### Verifying a deploy

1. Go to **Actions** → click the latest **Deploy static pages** run
2. Check that both jobs succeed: **build** and **deploy**
3. The **deploy** job shows the live URL in its summary
4. Visit the URL — you should see the index with links to all your pages

---

## Workflow details

The deploy workflow has two jobs:

### `build` job

| Step | What it does |
|---|---|
| Checkout | Clones the repo |
| Setup Node | Installs Node.js 22 (only needed for the index script) |
| Generate index | Runs `node scripts/generate-index.mjs` |
| Setup Pages | Configures GitHub Pages |
| Upload artifact | Packages the `public/` folder for deployment |

### `deploy` job

| Step | What it does |
|---|---|
| Deploy to GitHub Pages | Publishes the artifact to your Pages URL |

Only one deploy runs at a time (`concurrency: group: pages`) so overlapping pushes don't conflict.

---

## FAQ

**Do I need npm install or a build step?**
No. Pages are plain HTML. The only script (`generate-index.mjs`) uses built-in Node APIs and runs in CI with zero dependencies.

**What if I only change the README?**
The workflow won't run (it only triggers on `public/`, `scripts/`, or workflow file changes). That's intentional — README changes don't affect the site.

**Can I have nested folders?**
Yes. `public/graphs/shortest-path/dijkstra.html` works fine and appears grouped under "Graphs" on the index.

**What about non-HTML assets (images, CSS, JS)?**
Put them anywhere under `public/` and reference with relative paths. They'll be deployed alongside your HTML. Only `.html` files appear in the auto-generated index.

**Can I customize the index page look?**
Yes. Edit the `<style>`, header, and layout in `public/index.html`. Just leave the `<!-- GENERATED_PAGES_START -->` and `<!-- GENERATED_PAGES_END -->` markers in place.

**How long until changes are live?**
Usually 1–2 minutes after the workflow completes. GitHub Pages can take a short moment to propagate.
