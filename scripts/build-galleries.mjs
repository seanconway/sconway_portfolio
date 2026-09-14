#!/usr/bin/env node
// Regenerates manifest.json for every gallery folder referenced in index.html
// via data-gallery="assets/.../". Run this after adding, removing, or
// renaming photos so the site picks up the change:
//
//   node scripts/build-galleries.mjs
//
// Slides are ordered alphabetically (natural/numeric-aware) by filename, so
// reordering a gallery is just a matter of renaming its files.

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";

const IMAGE_EXTENSIONS = new Set([
  ".jpg", ".jpeg", ".png", ".gif", ".webp", ".heic", ".heif", ".bmp",
]);

function naturalCompare(a, b) {
  const chunks = (s) => s.match(/\d+|\D+/g) || [];
  const ac = chunks(a);
  const bc = chunks(b);
  const len = Math.max(ac.length, bc.length);
  for (let i = 0; i < len; i++) {
    const x = ac[i] ?? "";
    const y = bc[i] ?? "";
    const bothNumeric = /^\d+$/.test(x) && /^\d+$/.test(y);
    const cmp = bothNumeric
      ? Number(x) - Number(y)
      : x.localeCompare(y, undefined, { sensitivity: "base" });
    if (cmp !== 0) return cmp;
  }
  return 0;
}

const repoRoot = process.cwd();
const htmlPath = path.join(repoRoot, "index.html");
const html = readFileSync(htmlPath, "utf8");
const galleries = [...new Set([...html.matchAll(/data-gallery="([^"]+)"/g)].map((m) => m[1]))];

if (galleries.length === 0) {
  console.log("No data-gallery folders found in index.html.");
  process.exit(0);
}

for (const gallery of galleries) {
  const dir = path.join(repoRoot, gallery);
  if (!existsSync(dir)) {
    console.warn(`Skipping ${gallery} — folder does not exist.`);
    continue;
  }

  const files = readdirSync(dir)
    .filter((f) => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()))
    .sort(naturalCompare);

  writeFileSync(path.join(dir, "manifest.json"), JSON.stringify(files, null, 2) + "\n");
  console.log(`${gallery}manifest.json — ${files.length} photo(s)`);
}
