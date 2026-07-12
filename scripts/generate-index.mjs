import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, "../public");
const indexPath = path.join(publicDir, "index.html");

const INDEX_MARKER_START = "<!-- GENERATED_PAGES_START -->";
const INDEX_MARKER_END = "<!-- GENERATED_PAGES_END -->";

async function findHtmlFiles(dir, base = "") {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relative = base ? `${base}/${entry.name}` : entry.name;
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await findHtmlFiles(fullPath, relative)));
      continue;
    }

    if (!entry.name.endsWith(".html")) continue;
    if (relative === "index.html") continue;

    files.push(relative);
  }

  return files.sort((a, b) => a.localeCompare(b));
}

function toTitleCase(value) {
  return value.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function titleFromPath(filePath) {
  const base = path.basename(filePath, ".html");
  if (base === "index") {
    const dir = path.basename(path.dirname(filePath));
    return dir ? toTitleCase(dir) : "Home";
  }
  return toTitleCase(base);
}

function renderPageList(files) {
  if (files.length === 0) {
    return "    <p class=\"empty\">No pages yet. Add <code>.html</code> files under <code>public/</code>.</p>";
  }

  const grouped = new Map();
  for (const file of files) {
    const parts = file.split("/");
    const group = parts.length > 1 ? parts[0] : "root";
    if (!grouped.has(group)) grouped.set(group, []);
    grouped.get(group).push(file);
  }

  const sections = [...grouped.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([group, groupFiles]) => {
      const heading = group === "root" ? "Pages" : titleFromPath(`${group}/index.html`);
      const items = groupFiles
        .map(
          (file) =>
            `        <li><a href="./${file}">${titleFromPath(file)}</a><span class="path">${file}</span></li>`
        )
        .join("\n");

      return `    <section>
      <h2>${heading}</h2>
      <ul>
${items}
      </ul>
    </section>`;
    });

  return sections.join("\n");
}

async function main() {
  const htmlFiles = await findHtmlFiles(publicDir);
  const generated = renderPageList(htmlFiles);

  let indexHtml;
  try {
    indexHtml = await readFile(indexPath, "utf8");
  } catch {
    console.error("Missing public/index.html template.");
    process.exit(1);
  }

  if (!indexHtml.includes(INDEX_MARKER_START) || !indexHtml.includes(INDEX_MARKER_END)) {
    console.error("index.html is missing GENERATED_PAGES markers.");
    process.exit(1);
  }

  const updated = indexHtml.replace(
    new RegExp(`${INDEX_MARKER_START}[\\s\\S]*?${INDEX_MARKER_END}`),
    `${INDEX_MARKER_START}\n${generated}\n    ${INDEX_MARKER_END}`
  );

  await writeFile(indexPath, updated);
  console.log(`Indexed ${htmlFiles.length} page(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
