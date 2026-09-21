#!/usr/bin/env node
// Compiles tours/*.md  -> dist/tours.json
//          docs/**/*.md -> dist/help-index.json  (route -> help page + tour)
//
// Usage:
//   node scripts/build-tours.js                  validate + write dist/
//   node scripts/build-tours.js --copy-to site   ...and copy both files into ./site (deploy step)
//
// Exits non-zero on any schema error so a bad tour or page fails CI.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DOCS_DIR = path.join(ROOT, "docs");
const TOURS_DIR = path.join(ROOT, "tours");
const DIST_DIR = path.join(ROOT, "dist");

const TOUR_ROLES = ["anonymous", "learner", "instructor", "admin"];
const PAGE_ROLES = [...TOUR_ROLES, "all"];
const TRIGGERS = ["first-visit", "manual", "release"];
const ACTIONS = ["click"];
const TARGET_RE = /^\[data-tour="([a-z0-9]+(?:-[a-z0-9]+)*)"\]$/;
const ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DOCS_SITE_URL = (process.env.DOCS_SITE_URL || "https://help.eduwe.io").replace(/\/$/, "");

const errors = [];
const fail = (file, msg) => errors.push(`${path.relative(ROOT, file)}: ${msg}`);

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : e.name.endsWith(".md") ? [p] : [];
  });
}

const isStr = (v) => typeof v === "string" && v.trim() !== "";
const stripComments = (s) => s.replace(/<!--[\s\S]*?-->/g, "");

// Tour copy is injected as HTML into the app origin, so allow only basic inline formatting.
function toSafeHtml(md) {
  const html = marked.parse(md, { async: false });
  return sanitizeHtml(html, {
    allowedTags: ["p", "strong", "em", "code", "br", "ul", "ol", "li", "a"],
    allowedAttributes: { a: ["href", "target", "rel"] },
    allowedSchemes: ["https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { target: "_blank", rel: "noopener noreferrer" }),
    },
  }).trim();
}

// [text](help:learner/pricing-models) -> https://help.eduwe.io/learner/pricing-models/
function resolveHelpLinks(body, file) {
  return body.replace(/\]\(help:([^)\s]+)\)/g, (_, p) => {
    const clean = p.replace(/^\/|\/$/g, "");
    if (!fs.existsSync(path.join(DOCS_DIR, `${clean}.md`)) && !fs.existsSync(path.join(DOCS_DIR, clean, "index.md"))) {
      fail(file, `help: link "${p}" does not match a docs page`);
    }
    return `](${DOCS_SITE_URL}/${clean}/)`;
  });
}

// ---------------------------------------------------------------- tours
function buildTours() {
  const tours = [];
  const seen = new Set();

  for (const file of walk(TOURS_DIR).sort()) {
    let fm;
    try {
      fm = matter(fs.readFileSync(file, "utf8")).data;
    } catch (e) {
      fail(file, `frontmatter is not valid YAML (${e.message.split("\n")[0]})`);
      continue;
    }
    const base = path.basename(file, ".md");

    if (!isStr(fm.id) || !ID_RE.test(fm.id)) fail(file, "id must be a kebab-case string");
    else if (fm.id !== base) fail(file, `id "${fm.id}" must match the file name "${base}"`);
    else if (seen.has(fm.id)) fail(file, `duplicate id "${fm.id}"`);
    seen.add(fm.id);

    if (!isStr(fm.title)) fail(file, "title is required");
    if (!Array.isArray(fm.roles) || !fm.roles.length || fm.roles.some((r) => !TOUR_ROLES.includes(r)))
      fail(file, `roles must be a non-empty list drawn from: ${TOUR_ROLES.join(", ")}`);
    if (!isStr(fm.route) || !fm.route.startsWith("/")) fail(file, 'route is required and must start with "/"');
    if (!TRIGGERS.includes(fm.trigger)) fail(file, `trigger must be one of: ${TRIGGERS.join(" | ")}`);
    if (!Number.isInteger(fm.version) || fm.version < 1) fail(file, "version must be an integer >= 1");
    if (!Array.isArray(fm.steps) || !fm.steps.length) {
      fail(file, "steps must be a non-empty list");
      continue;
    }

    const steps = fm.steps.map((s, i) => {
      const at = `steps[${i}]`;
      if (!isStr(s?.target) || !TARGET_RE.test(s.target))
        fail(file, `${at}.target must be a literal [data-tour="..."] selector (got ${JSON.stringify(s?.target)})`);
      if (!isStr(s?.title)) fail(file, `${at}.title is required`);
      if (!isStr(s?.body)) fail(file, `${at}.body is required`);
      if (s?.action !== undefined && !ACTIONS.includes(s.action))
        fail(file, `${at}.action must be one of: ${ACTIONS.join(", ")}`);
      const body = isStr(s?.body) ? stripComments(resolveHelpLinks(s.body, file)).trim() : "";
      const out = { target: s?.target, title: s?.title, body, bodyHtml: body ? toSafeHtml(body) : "" };
      if (s?.action) out.action = s.action;
      return out;
    });

    tours.push({
      id: fm.id,
      title: fm.title,
      roles: fm.roles,
      route: fm.route,
      trigger: fm.trigger,
      version: fm.version,
      steps,
    });
  }
  return tours;
}

// ---------------------------------------------------------------- help index
function firstParagraph(md) {
  const paras = stripComments(md)
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p && !/^(#|!!!|\?\?\?|\||```|-|\d+\.)/.test(p));
  const text = (paras[0] || "")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ");
  return text.length > 200 ? `${text.slice(0, 197).trimEnd()}...` : text;
}

const pageUrl = (rel) => {
  const p = rel.replace(/\\/g, "/").replace(/\.md$/, "");
  if (p === "index") return "/";
  return `/${p.replace(/\/index$/, "")}/`;
};

function buildHelpIndex(tours) {
  const pages = [];

  for (const file of walk(DOCS_DIR).sort()) {
    const rel = path.relative(DOCS_DIR, file);
    let parsed;
    try {
      parsed = matter(fs.readFileSync(file, "utf8"));
    } catch (e) {
      fail(file, `frontmatter is not valid YAML (${e.message.split("\n")[0]})`);
      continue;
    }
    const fm = parsed.data;

    if (!isStr(fm.title)) fail(file, "title is required");

    const roles = Array.isArray(fm.role) ? fm.role : [fm.role];
    if (!fm.role || roles.some((r) => !PAGE_ROLES.includes(r)))
      fail(file, `role is required; use one or a list of: ${PAGE_ROLES.join(", ")}`);

    if (!("app_route" in fm)) fail(file, "app_route is required (use null if the page is not tied to a screen)");
    else if (fm.app_route !== null && (!isStr(fm.app_route) || !fm.app_route.startsWith("/")))
      fail(file, 'app_route must be null or a string starting with "/"');

    if (fm.tour !== undefined && !tours.some((t) => t.id === fm.tour)) fail(file, `tour "${fm.tour}" does not exist`);

    const route = fm.app_route ?? null;
    let tour = fm.tour ?? null;
    if (!tour && route) {
      // Auto-link: a tour on the same route that serves one of this page's roles.
      const hit = tours.find(
        (t) => t.route === route && (roles.includes("all") || t.roles.some((r) => roles.includes(r)))
      );
      tour = hit?.id ?? null;
    }

    pages.push({
      path: rel.replace(/\\/g, "/").replace(/\.md$/, ""),
      url: pageUrl(rel),
      title: fm.title,
      roles,
      route,
      summary: isStr(fm.summary) ? fm.summary.trim() : firstParagraph(parsed.content),
      tour,
    });
  }

  const routes = {};
  for (const p of pages) {
    if (!p.route) continue;
    (routes[p.route] ??= []).push({ title: p.title, url: p.url, roles: p.roles, summary: p.summary, tour: p.tour });
  }
  return { version: 1, home: "/", routes, pages };
}

// ---------------------------------------------------------------- main
const tours = buildTours();
const helpIndex = buildHelpIndex(tours);

if (errors.length) {
  console.error(`\n${errors.length} problem(s) found:\n`);
  for (const e of errors) console.error(`  x ${e}`);
  process.exit(1);
}

fs.mkdirSync(DIST_DIR, { recursive: true });
fs.writeFileSync(path.join(DIST_DIR, "tours.json"), `${JSON.stringify(tours, null, 2)}\n`);
fs.writeFileSync(path.join(DIST_DIR, "help-index.json"), `${JSON.stringify(helpIndex, null, 2)}\n`);
console.log(`dist/tours.json       ${tours.length} tour(s)`);
console.log(`dist/help-index.json  ${helpIndex.pages.length} page(s), ${Object.keys(helpIndex.routes).length} route(s)`);

const copyIdx = process.argv.indexOf("--copy-to");
if (copyIdx !== -1) {
  const target = path.resolve(ROOT, process.argv[copyIdx + 1] ?? "");
  if (!process.argv[copyIdx + 1] || !fs.existsSync(target)) {
    console.error(`--copy-to: directory "${process.argv[copyIdx + 1] ?? ""}" does not exist (run mkdocs build first)`);
    process.exit(1);
  }
  for (const f of ["tours.json", "help-index.json"]) fs.copyFileSync(path.join(DIST_DIR, f), path.join(target, f));
  console.log(`copied to ${path.relative(ROOT, target)}/`);
}
