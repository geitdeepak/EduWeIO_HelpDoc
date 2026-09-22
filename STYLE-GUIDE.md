# Style guide

## Golden rule: do not invent product behaviour

If you cannot observe it on eduwe.io or confirm it with the product owner, leave a marker and move on:

```markdown
<!-- TODO: confirm whether prices include GST. -->
```

CI prints the number of `TODO` markers in `docs/` on every build. The goal is for that number to fall to zero.
When you fill one in, remove the marker. If you took the fact from the live site, leave a `<!-- Source: ... -->` comment
so the next person knows where to re-check it.

## Pages

Every page starts with frontmatter:

```yaml
---
title: Fully Paid vs On Demand
role: [anonymous, learner]   # anonymous | learner | instructor | admin | all  (one value or a list)
app_route: /                 # the app screen this page explains, or null if it is not tied to one
summary: One sentence shown in the in-app Help drawer.
tour: visitor-browse-courses # optional; otherwise the tour on the same route for the same role is linked
---
```

- `summary` is what the Help drawer shows, **and** what the help site itself shows in the page head banner (see below), so write it for someone looking at that screen right now. If you omit it, the first paragraph is used for the Help drawer, but no banner is shown.
- `app_route` must match the route in eduwe-app exactly. Use `null` until it is confirmed (and add a `TODO`).
- New pages must also be added to `nav:` in `mkdocs.yml`, or the strict build warns.

## Page Head

Every content page automatically gets a small banner above its `# Heading`, showing the page's `role` as pills and its
`summary` as a subtitle. It comes from `role` and `summary` in the frontmatter — nothing to write by hand, and no way
to opt out short of leaving `summary` empty. It is produced by `overrides/partials/content.html`, a small override of
Material's own content template (`custom_dir: overrides` in `mkdocs.yml`); the home page skips it because
`page.is_homepage` is true there, and it has its own hero instead (see below). If Material for MkDocs is upgraded and
the banner stops appearing or duplicates, compare `overrides/partials/content.html` against the new version's
`partials/content.html` in the installed package and update the override to match.

## Writing

- **Headings use Capitalize Each Word**, for example "Your Dashboard" and "Log In With Google". This applies to page titles, headings and subheadings, menu labels and tour titles. Capitalize every word, including short ones such as "And" and "Of". Keep acronyms (MCQ, TYS, IDE, AI) and brand names exactly as written (EduWeAi, insight360, bytes30, shorts10, scroll500, eduwe.io). Sentences, captions and list items stay in normal sentence case.
- Write to the reader: "Select **+Cart**", not "The user should click the +Cart button".
- Use the exact label on screen, in bold: **Fully Paid**, **On Demand**, **Demo**, **+Cart**, **Log In**, **Sign Up**.
- Lead with what the reader can do, then why. One idea per paragraph.
- Numbered lists for steps in order; bullets for everything else.
- Anonymous visitors can browse, compare prices and open demos. Say when something needs an account.
- Money, refunds and access periods must be stated exactly as confirmed, never softened or rounded.
- Link to other pages with relative paths (`../learner/pricing-models.md`) so the strict build catches broken links.
- Screenshots: see [Screenshots](#screenshots). Never leave an image reference that points at a missing file; use a commented `TODO` slot.

## Tours (`tours/*.md`)

One Markdown file per tour. Steps live in the frontmatter; nothing below the frontmatter is shipped to the app.

```yaml
---
id: visitor-browse-courses     # kebab-case, must equal the file name
title: Find the right course
roles: [anonymous, learner]    # anonymous | learner | instructor | admin
route: /
trigger: first-visit           # first-visit | manual | release
version: 1                     # bump to re-show a release tour
steps:
  - target: '[data-tour="pricing-mode"]'
    title: Choose how you pay
    body: "Two options. [How they differ](help:learner/pricing-models)"
    action: click              # optional
---
```

- **Targets are `[data-tour="..."]` only**, never CSS classes or generated ids. The set of valid names is spec section 5, and they must exist in eduwe-app before the tour is merged.
- Keep a step to a title of a few words and a body of one or two sentences. If it needs more, link to the help page.
- Body is Markdown; only bold, italics, code, lists and links survive (the build sanitizes the rest).
- Link to a help page with `[text](help:section/page)`; the build turns it into the full help URL and fails if the page does not exist.
- A tour can only be shown to the roles in `roles`. Steps whose element is not on screen are skipped, so order steps so the tour still makes sense with gaps.
- Renaming or deleting a marked element in the app means updating the matching tour step in the same pull request.

## The `data-tour` contract (for app developers)

1. Tours target only `data-tour` attributes.
2. Values are literal strings. `data-tour={isTourAnchor ? "course-card" : undefined}` is fine; `` data-tour={`btn-${id}`} `` is not, because the CI check reads source text and cannot resolve it.
3. Card-level targets go on the first card only.
4. Renaming or deleting a marked element requires updating the tour step in the same PR.

## Screenshots

Images live in `docs/assets/images/<area>/`. MkDocs copies them into the site automatically.

**Folders follow the app's screens, not the docs sections.** A screen that several pages use gets one folder, so an
image is never copied. Current and planned folders:

| Folder | Screens |
|---|---|
| `home/` | The catalog home page: header, banners, category strip, tabs, course cards, footer |
| `cart/` | Shopping cart, checkout and payment |
| `auth/` | Log In and Sign Up (used by Log in, Create an account and Cart and checkout) |
| `dashboard/` | The learner dashboard |
| `ide/` | The Online IDE (EduWe Code Sathi) |
| `ai/` | The EduWeAi page |
| `connect/` | The Connect window (complaints, suggestions, messages) |
| `demo/` | The course demo page and demo video |
| `course/`, `instructor/`, `admin/`, `support/` | Added when we reach them |

**File names:** `<folder>-<NN>-<what-it-shows>.png`

- Lowercase kebab-case, no spaces, no dates, no version numbers (`-v2`, `-final`).
- `<folder>` is the folder name, so a file is recognisable when it is opened on its own.
- `<NN>` is a two-digit number that is **unique in that folder**. It is an ID, not the reading order. Take the next free
  number for a new image, and never renumber or rename an existing one, because pages already point to it.
- `<what-it-shows>` describes the picture, not the page it is used on: `auth-01-login-signup.png`, not `log-in-page.png`.
- Add a state at the end when the same thing appears in more than one state: `home-14-price-fully-paid.png`,
  `home-15-price-on-demand.png`, `home-09-course-card-hover.png`.
- Use `.png` (`.webp` is fine). Keep the extension lowercase.

**Capture:**

- Real eduwe.io, logged out unless the page is about a logged-in screen. No personal data: names, emails, phone numbers, payment or order IDs, payment QR codes, profile photos, and the browser's profile picture (crop the browser bar off). Hide them with a flat box or heavy pixelation, not a light blur, and keep the original outside the repo.
- Same browser, same window width (1440 px suggested), 100% zoom, and the same theme for every image in an area.
- PNG (WebP is fine too). Full-page shots about 1600 px wide; close-ups cropped tight. Aim for under 300 KB each.
- If a shot explains parts of the screen, number them with a simple marker and refer to the numbers in the text.

**Placing an image:** every slot is already in the page as a commented block that starts with `<!-- TODO: screenshot`.
Save the file with the exact name, then delete the first line and the last line (`-->`) of the block so only the
`<figure>` remains. `npm run build` fails on a reference to a file that is missing, so a typo cannot ship.

```markdown
<figure markdown>
  ![What the picture shows, for screen readers](../assets/images/home/home-06-course-card.png){ loading=lazy }
  <figcaption>A course card.</figcaption>
</figure>
```

The path is relative to the page: pages in `docs/learner/` use `../assets/...`; `docs/index.md` uses `assets/...`.
Always write real alt text, and keep the caption to one short line.

## Theme Colour

The EduWe brand colour is RGB 0 / 176 / 240, which is `#00B0F0`. It is set once, in `docs/stylesheets/extra.css`, and `mkdocs.yml` uses it through `primary: custom` and `accent: custom`. Change the colour there only.

White text on `#00B0F0` is hard to read (about 2.5 to 1), so the header uses dark text on the brand blue, and links in the light theme use a deeper shade of the same blue.

## Logo

The EduWe logo is in `docs/assets/logo/`: `eduwe-logo.png` (transparent, brand blue) and `favicon.png` (the E on the EduWe dark background). Never recolour, stretch or add effects to the logo. The header seats it on a dark tab so the blue stays visible on the blue header. Prefer replacing these files with the official SVG or a high-resolution transparent PNG when you have one, keeping the same file names.

## Home Page Components

The help home page (`docs/index.md`) is built from a few reusable pieces. Their styles are in `docs/stylesheets/extra.css`.

- **Hero:** `<div class="eduwe-hero" markdown>` holds the eyebrow tag, the heading, one sentence, the search bar (a label that opens the site search) and two buttons.
- **How It Works:** an ordered list inside `<div class="eduwe-steps" markdown>`. It shows four steps in a row on desktop, two on a tablet and one on a phone.
- **Cards:** `<div class="grid cards eduwe-cols-4" markdown>`. Use `eduwe-cols-4`, `eduwe-cols-3` or `eduwe-cols-2` so the last row is never left with a single card. Put `{ .eduwe-stretch }` on the main link so the whole card is clickable. Add `eduwe-static` for cards that are not links.
- **Quick links:** `<div class="eduwe-chips" markdown>` with links marked `{ .md-button }`.
- **Coming soon:** `<span class="eduwe-soon">Coming Soon</span>` beside a card title.
- **Help band:** `<div class="eduwe-band" markdown>` at the bottom.

Only link to pages that have real content. Cards for Instructors and Administrators stay unlinked until those guides are written.
