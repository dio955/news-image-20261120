// news-image-20261120 — "Sum up 20 November's world news in one image"
//
// The entry image is a newspaper front page for Friday 20 November 2026,
// committed to this repository as frontpage.jpg (1024x1024 JPEG). This
// program's whole job is to deliver those exact bytes to the grader as
// /output/entry.png, deterministically, with no network and no inputs.
//
// The asset is located relative to this script (or via MAKEFUN_BOT_DIR),
// never relative to the process working directory, so the program runs
// identically from any cwd.

import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ASSET_NAME = "frontpage.jpg";
const OUTPUT_NAME = "entry.png";

function assetPath(): string {
  // Prefer the directory the grader mounted the repository at; fall back
  // to the directory holding this script (they are the same in practice).
  const botDir = process.env.MAKEFUN_BOT_DIR;
  if (botDir) {
    const candidate = join(botDir, ASSET_NAME);
    if (existsSync(candidate)) return candidate;
  }
  return join(dirname(fileURLToPath(import.meta.url)), ASSET_NAME);
}

function main(): void {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "out";
  // The output directory is provided by the grader; create it only if it
  // is missing, and never remove it or anything the grader placed there.
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, OUTPUT_NAME);
  copyFileSync(assetPath(), target);
  // A one-line receipt on stdout: harmless to the grader, handy in logs.
  console.log(`${OUTPUT_NAME}: ${statSync(target).size} bytes`);
}

main();
