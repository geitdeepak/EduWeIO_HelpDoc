#!/usr/bin/env node
// Fails when a tour step points at a data-tour value that is absent from the app source,
// or when the app source uses a data-tour value the validator cannot resolve statically.
//
// Usage:
//   node scripts/check-tour-targets.js --app ../eduwe-app
//   EDUWE_APP_PATH=../eduwe-app node scripts/check-tour-targets.js
//
// Run it on pull requests in BOTH repositories (see .github/workflows/validate-tours.yml and
// the mirror in eduwe-app-handoff/ci/).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TOURS_DIR = path.join(ROOT, "tours");

const SOURCE_EXT = new Set([".js", ".jsx", ".mjs", ".ts", ".tsx", ".vue", ".svelte", ".astro", ".html", ".htm", ".mdx"]);
// Dot-directories are skipped too (.git, .next, and the .eduwe-docs checkout used by the mirror workflow).
const SKIP_DIRS = new Set(["node_modules", "dist", "build", "coverage", "out"]);
const TARGET_RE = /^\[data-tour="([^"]+)"\]$/;

const argIdx = process.argv.indexOf("--app");
const appArg = argIdx !== -1 ? process.argv[argIdx + 1] : process.env.EDUWE_APP_PATH;
if (!appArg) {
  console.error("Usage: check-tour-targets.js --app <path to eduwe-app>   (or set EDUWE_APP_PATH)");
  process.exit(2);
}
const APP_DIR = path.resolve(process.cwd(), appArg);
if (!fs.existsSync(APP_DIR)) {
  console.error(`App directory not found: ${APP_DIR}`);
  process.exit(2);
}

function* sourceFiles(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name) && !e.name.startsWith(".")) yield* sourceFiles(path.join(dir, e.name));
    } else if (SOURCE_EXT.has(path.extname(e.name))) {
      yield path.join(dir, e.name);
    }
  }
}

// Returns the index just past the matching "}" for the "{" at `open`, respecting quotes.
function matchBrace(src, open) {
  let depth = 0;
  let quote = null;
  for (let i = open; i < src.length; i++) {
    const c = src[i];
    if (quote) {
      if (c === "\\") i++;
      else if (c === quote) quote = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") quote = c;
    else if (c === "{") depth++;
    else if (c === "}" && --depth === 0) return i + 1;
  }
  return -1;
}

const lineOf = (src, idx) => src.slice(0, idx).split("\n").length;

// Collect every data-tour usage in the app: { value, file, line } or { problem, file, line }.
const found = [];
const problems = [];

for (const file of sourceFiles(APP_DIR)) {
  const src = fs.readFileSync(file, "utf8");
  const rel = path.relative(APP_DIR, file);
  const attr = /data-tour\b(["']?)\s*([=:])\s*/g; // data-tour=...  or  "data-tour": ...
  let m;
  while ((m = attr.exec(src))) {
    const at = m.index;
    const line = lineOf(src, at);
    let i = attr.lastIndex;
    const c = src[i];
    let expr;

    if (c === '"' || c === "'") {
      const end = src.indexOf(c, i + 1);
      expr = { literal: src.slice(i + 1, end) };
    } else if (c === "{") {
      const end = matchBrace(src, i);
      expr = { code: end === -1 ? "" : src.slice(i + 1, end - 1) };
    } else {
      problems.push(`${rel}:${line}  data-tour value is not a literal string`);
      continue;
    }

    if ("literal" in expr) {
      found.push({ value: expr.literal, file: rel, line });
      continue;
    }

    // {expression}: allow only literal strings, optionally chosen by a condition
    // (data-tour={isTourAnchor ? "course-card" : undefined}).
    const code = expr.code;
    const literals = [...code.matchAll(/"([^"]*)"|'([^']*)'|`([^`]*)`/g)];
    const values = literals.map((l) => l[1] ?? l[2] ?? l[3]);
    const rest = code.replace(/"[^"]*"|'[^']*'|`[^`]*`/g, "");
    if (!values.length) problems.push(`${rel}:${line}  data-tour={${code.trim()}} has no literal string value`);
    else if (values.some((v) => v.includes("${")) || /\+/.test(rest))
      problems.push(`${rel}:${line}  data-tour value is computed: {${code.trim()}} - use literal strings only`);
    else for (const value of values) found.push({ value, file: rel, line });
  }
}

const inApp = new Map();
for (const f of found) inApp.set(f.value, [...(inApp.get(f.value) ?? []), `${f.file}:${f.line}`]);

// Collect tour targets.
const missing = [];
let stepCount = 0;
const tourFiles = fs.existsSync(TOURS_DIR) ? fs.readdirSync(TOURS_DIR).filter((f) => f.endsWith(".md")) : [];
for (const f of tourFiles) {
  const fm = matter(fs.readFileSync(path.join(TOURS_DIR, f), "utf8")).data;
  (fm.steps ?? []).forEach((s, i) => {
    stepCount++;
    const m = TARGET_RE.exec(s?.target ?? "");
    if (!m) {
      problems.push(`tours/${f}  steps[${i}].target must be a [data-tour="..."] selector (got ${JSON.stringify(s?.target)})`);
    } else if (!inApp.has(m[1])) {
      missing.push(`tours/${f}  steps[${i}]  ${s.target}  not found in app source`);
    }
  });
}

console.log(`Scanned ${APP_DIR}`);
console.log(`  ${inApp.size} distinct data-tour value(s) in app, ${stepCount} tour step(s) across ${tourFiles.length} tour(s)`);

const all = [...problems, ...missing];
if (all.length) {
  console.error(`\n${all.length} problem(s):\n`);
  for (const p of all) console.error(`  x ${p}`);
  process.exit(1);
}
console.log("OK - every tour target exists in the app source.");
