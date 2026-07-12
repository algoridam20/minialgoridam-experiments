import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const manifestPath = path.join(root, "printables/manifest.json");
const hubTemplatePath = path.join(root, "printables/hub.template.html");
const outDir = path.join(root, "public/printables");
const indexPath = path.join(root, "public/index.html");

const CATEGORY_LABELS = {
  daily: "Daily",
  monthly: "Monthly",
  yearly: "Yearly",
};

function toTitleCase(value) {
  return value.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

async function buildPrintable(entry) {
  const templatePath = path.join(root, "printables/templates", entry.template);
  const module = await import(pathToFileURL(templatePath).href);
  const template = module.default;
  const html = template.build();
  const outPath = path.join(outDir, `${entry.id}.html`);
  await writeFile(outPath, html);
  return outPath;
}

function renderHub(manifest, built) {
  const byCategory = new Map();
  for (const entry of manifest.printables) {
    if (!byCategory.has(entry.category)) byCategory.set(entry.category, []);
    byCategory.get(entry.category).push(entry);
  }

  const sections = [...byCategory.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([category, items]) => {
      const links = items
        .map((item) => `<li><a href="./printables/${item.id}.html">${item.title}</a></li>`)
        .join("\n");
      const label = CATEGORY_LABELS[category] ?? toTitleCase(category);
      return `<section><h2>${label}</h2><ul>${links}</ul></section>`;
    })
    .join("\n");

  return hubTemplate
    .replaceAll("{{SITE_TITLE}}", manifest.siteTitle)
    .replace("{{SECTIONS}}", sections);
}

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const hubTemplate = await readFile(hubTemplatePath, "utf8");

await mkdir(outDir, { recursive: true });

const built = [];
for (const entry of manifest.printables) {
  const outPath = await buildPrintable(entry);
  built.push(outPath);
  console.log(`Built ${entry.id}`);
}

await writeFile(indexPath, renderHub(manifest, built));
console.log(`Built index (${built.length} printable(s))`);
