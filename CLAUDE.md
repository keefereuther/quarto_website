# Claude notes for this project

Quarto academic website (keefereuther.com) deployed to Netlify. Bootstrap `minty`/`quartz` theme. Work from the content files in `docs/` and `index.qmd`; `_site/` is build output, do not hand-edit.

## Quarto documentation — fetch directly

`quarto.org` is publicly reachable via WebFetch. For any question about front matter, shortcodes, listings, crossrefs, or publishing options, fetch the relevant reference page rather than guessing. Useful anchors:

- [Reference index](https://quarto.org/docs/reference/) — top-level navigation for everything below
- **HTML format options:** https://quarto.org/docs/reference/formats/html.html
- **Website project options:** https://quarto.org/docs/reference/projects/websites.html
- **Listings (blog, grid, table):** https://quarto.org/docs/websites/website-listings.html and https://quarto.org/docs/websites/website-listings-custom.html
- **About pages (`jolla`, `trestles`, `solana`, `marquee`):** https://quarto.org/docs/websites/website-about.html
- **Column layouts / page grid:** https://quarto.org/docs/authoring/article-layout.html (this is where `.column-body`, `.column-page`, `.column-screen` come from)
- **Callouts:** https://quarto.org/docs/authoring/callouts.html
- **Shortcodes (video, fa, include):** https://quarto.org/docs/authoring/shortcodes.html
- **Cross-references:** https://quarto.org/docs/authoring/cross-references.html
- **Publishing (Netlify):** https://quarto.org/docs/publishing/netlify.html
- **CLI commands:** https://quarto.org/docs/reference/ → Command Line section (`render`, `preview`, `publish`, `check`)

When the answer isn't in these pages, search `https://quarto.org/docs/` first before falling back to general web search.

## Project-specific gotchas discovered this session

- The homepage uses `about: template: solana`. Everything inside `::: {#intro} ::: ` gets rendered in the about template's column layout. Content *after* that block is rendered inside a `<section class="page-columns page-full">` — which is a CSS grid, and unclassed `<aside>` elements get placed in the narrow margin-note column. Fix: use `<div class="column-body">` (or a `::: {.column-body}` fenced div) for any full-width block after the about card.
- Quarto listings collapse to `_site/listing.json` at build time; if a listing appears empty after adding a new `.qmd`, re-render the full site, not just the page.
- Font Awesome shortcodes (`{{< fa icon-name >}}`) require `_extensions/quarto-ext/fontawesome` — already installed.
- Raw HTML blocks (` ```{=html} ... ``` `) work, but Quarto-specific classes like `.column-body` should be added directly to the root element inside the block.

## Accessibility baseline

WCAG 2.1 AA has already been applied to this site:
- `lang: en` in `_quarto.yml`
- Skip-nav link in `_includes/skip-nav.html`
- Focus-visible outlines in `styles.css`
- All PDFs embedded with `<object>` + text fallback (never bare `<embed>`)
- Iframes require `title="..."`
- `about` block images require `image-alt: "..."`

Preserve these when editing.

## Common tasks

- **Render everything:** `quarto render` from project root
- **Render a single page:** `quarto render path/to/file.qmd` (much faster during iteration)
- **Local preview:** `quarto preview` — serves on port 4242 by default
- **Publish:** site is built to `_site/` and deployed by Netlify on push; do not run `quarto publish` without confirming with the user
