<p align="center"><img src="docs/assets/logo/eduwe-logo.png" alt="EduWe" width="220"></p>

# eduwe-docs

Docs-as-code for EduWe. One Markdown source produces:

1. **help.eduwe.io**, a searchable static help site (MkDocs Material, dark by default).
2. **In-app guided tours** (Driver.js) and the data behind the contextual Help drawer, as two JSON files.

No tour text lives in application code. Rules for writing pages and tours are in [STYLE-GUIDE.md](STYLE-GUIDE.md).

## Layout

```
docs/            help pages (frontmatter: title, role, app_route, summary)
tours/           one Markdown file per guided tour; steps live in frontmatter
scripts/
  build-tours.js         tours/*.md -> dist/tours.json, docs/**/*.md -> dist/help-index.json
  check-tour-targets.js  fails if a tour step targets a data-tour value missing from the app source
.github/workflows/
  deploy-docs.yml        build and publish on merge to main
  validate-tours.yml     schema check + target check on every pull request
mkdocs.yml  package.json  requirements.txt
```

`requirements.txt`, `.gitignore` and `docs/stylesheets/extra.css` (the EduWe theme colour) are the only files added to the layout in the spec.

## Setup

Needs Node 20+ and Python 3.10+.

```bash
npm install
pip install -r requirements.txt

npm run build:tours     # validate tours + pages, write dist/tours.json and dist/help-index.json
npm run serve           # build:tours, then mkdocs serve at http://127.0.0.1:8000
npm run build           # strict site build into site/, then copy the two JSON files into it
```

If `mkdocs` is not on your PATH (common on Windows), the scripts call `python -m mkdocs` instead.

`build:tours` exits non-zero on any schema problem (missing frontmatter, unknown role, a step target that is not a
literal `[data-tour="..."]` selector, a `help:` link to a page that does not exist, and so on). `mkdocs build --strict`
fails on broken links and nav problems.

## Check tours against the app

```bash
npm run check:targets -- --app ../eduwe-app        # or set EDUWE_APP_PATH
```

This scans the app source for `data-tour` attributes and fails if a tour points at one that is not there, or if the
app uses a computed value the check cannot resolve. It is meant to run on pull requests in **both** repositories:
`validate-tours.yml` here, and the mirror in `../eduwe-app-handoff/ci/` for eduwe-app.

## What gets published

`site/` contains the help site plus, at its root:

| File | Consumer | Shape |
|---|---|---|
| `tours.json` | `startTour`, `maybeAutoStart` | array of tours; each step has `target`, `title`, `body`, sanitized `bodyHtml`, optional `action` |
| `help-index.json` | `<HelpDrawer />` | `{ routes: { "/": [ {title, url, roles, summary, tour} ] }, pages: [...], home }` |

## Deploying

1. In the GitHub repo, Settings > Pages > Source: **GitHub Actions**.
2. Merge to `main`; `deploy-docs.yml` builds and publishes.
3. To move to `help.eduwe.io`: add `docs/CNAME` containing `help.eduwe.io`, set the custom domain in Pages settings,
   point DNS at GitHub Pages, and update `site_url` in `mkdocs.yml`.
4. To enable the target check in CI, set the repository variable `EDUWE_APP_REPO` and the secret
   `EDUWE_APP_READ_TOKEN` (see `validate-tours.yml`). Until then that step is skipped with a warning.

The app should proxy `/help/*` to the help site rather than fetch cross-origin, which avoids CORS.

## Current state

Run this to see how much unverified content remains:

```bash
grep -rn "TODO" docs/ tours/ | wc -l
```

Every `TODO` is either something the live site does not show (needs a logged-in walk-through or a product decision) or
a route in eduwe-app that has not been confirmed. The list of open questions from the spec (GST, discount scope, course
codes, Popular, Hindi, and so on) is spread across those markers; search for the keyword to find the affected page.

## Not done yet

- `data-tour` attributes, `src/help/`, the progress API and the eduwe-app CI mirror live in the app repo; see
  [../eduwe-app-handoff/README.md](../eduwe-app-handoff/README.md).
- Instructor and administrator guides: drafted but hidden. They are outlines only (needs those accounts to fill in),
  so they are kept in [../drafts/instructor](../drafts/instructor) and [../drafts/admin](../drafts/admin), outside
  `docs/`, and build no pages. To bring a section back, move its folder under `docs/` and restore its `nav:` block in
  `mkdocs.yml` (see that file's git history).
- Screenshots for the remaining learner pages, and the nightly Playwright run (needs seeded staging accounts).
- Hindi: if needed, add a `lang` field to tour frontmatter and one tour file per language.
