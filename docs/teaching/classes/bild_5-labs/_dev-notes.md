# BILD 5 webR exercises — local edit & deploy runbook

Everything you need to edit, preview, and safely ship BILD 5 in-class activities from
Cursor. Read the **Deploy gotcha** section before your first push — it prevents a broken build.

---

## What lives in the repo

- `_extensions/r-wasm/live/` — the Quarto Live extension, vendored (same as `quarto add r-wasm/quarto-live`, v0.2.0). Must stay committed.
- `docs/teaching/classes/BILD_5.qmd` — course hub (syllabus, overview). Uses the `bild-5-activities` sidebar.
- `docs/teaching/classes/bild_5-labs/{coding|paper}-NN-slug.qmd` — activity pages (flat files, not `index.qmd`).
- `docs/teaching/classes/bild_5-labs/_metadata.yml` — applies the activity sidebar to every page in this folder.
- `docs/teaching/classes/bild_5-labs/_dev-notes.md` — this file (the leading `_` means Quarto never publishes it).
- `annotate/` — vendored [Hypothesis PDF.js viewer](https://github.com/hypothesis/pdf.js-hypothes.is). Static passthrough, copied to `_site/` via `project: resources:`.
- `papers/` — PDFs students annotate. Static passthrough. **Open-access papers only** (see below).

## Two kinds of activity

Activities are numbered **within each track** (Coding 1, 2, 3 … and Paper 1, 2, 3 …).
The two types have **different front matter requirements**:

| Type | Front matter | Needs R locally? | Commit `_freeze/`? |
|------|--------------|------------------|--------------------|
| Coding (webR) | `format: live-html`, `engine: knitr`, `execute: freeze: auto` | Yes | Yes |
| Paper (bibliography or annotation) | `title` and `subtitle` only | No | No |

**Do not copy a coding activity's front matter onto an annotation activity.** The
`live-html`/`knitr`/`freeze` block exists only because Quarto Live's `_knitr.qmd`
include must execute R at build time. A prose page that copies it inherits an R
dependency it does not need, and a forgotten re-render will then break the Netlify
build. Annotation pages inherit their theme from `_quarto.yml` and their sidebar from
`_metadata.yml`, so they need nothing else.

### Activity file naming

Use track prefix, zero-padded number, and kebab-case slug:

```
docs/teaching/classes/bild_5-labs/
  coding-01-run-your-first-line-of-code.qmd
  coding-02-wrangle-and-visualize-penguins.qmd
  paper-01-find-a-question-build-a-bibliography.qmd
  paper-02-annotate-bramante-2026.qmd
```

**Do not** use `index.qmd` for activities. **Do not** mix tracks in one numbering sequence.

### Adding a new coding activity

| Step | Action |
|------|--------|
| 1 | Create `docs/teaching/classes/bild_5-labs/coding-NN-short-slug.qmd` (copy front matter from coding-01) |
| 2 | Add `Coding N — Page Title` under **Coding activities** in `_quarto.yml` and link from `BILD_5.qmd` |
| 3 | `quarto render docs/teaching/classes/bild_5-labs/coding-NN-short-slug.qmd` locally |
| 4 | Commit the `.qmd`, matching `_freeze/` path, and `_quarto.yml` sidebar entry |
| 5 | Push to `main` (Netlify has no R) |

### Adding a new paper activity

| Step | Action |
|------|--------|
| 1 | Put the PDF in `papers/` as `kebab-case-slug.pdf` (if annotation activity) |
| 2 | Copy `paper-02-annotate-bramante-2026.qmd` (or `paper-01-…` for bibliography-style) to the next paper number; change title, slug, citation, and reading questions |
| 3 | Add `Paper N — Page Title` under **Paper activities** in `_quarto.yml` and link from `BILD_5.qmd` |
| 4 | `quarto render` (full site) and check the page |
| 5 | Commit and push. `/read/<slug>` works immediately — no per-paper Netlify config |

Two rules for `papers/`:

- **Never overwrite a published PDF.** Hypothesis anchors PDF annotations to the
  file's internal fingerprint, not its URL. Re-saving, re-compressing, or OCRing a
  file after students have annotated it orphans every annotation. Add a new filename
  instead.
- **Open-access papers only.** The folder is world-readable. Articles you reach
  through the UCSD library licence are not redistributable from a public site.
  Killingley et al. 2022 is CC BY, which is why it is safe to host.

---

## One-time prerequisites

You almost certainly have these (the repo is an `.Rproj`), but confirm:

1. **Quarto ≥ 1.4** — `quarto --version`. Update from quarto.org if older.
2. **R** — `R --version`. Needed *locally* to render activity pages (they use `engine: knitr`).
3. **The `knitr` R package** — in R: `install.packages("knitr")` if missing.
4. Verify the toolchain sees R: `quarto check`. Look for a green "R" line.

You do **not** need to install webR — that downloads into the student's browser at runtime.

### webR packages (coding activities)

If an activity needs data or code from an CRAN package (e.g. `palmerpenguins`), declare it under `format: live-html: webr: packages:` in that page's YAML. webR pre-installs listed packages from `repo.r-wasm.org` when the page loads in the browser — no build-time R dependency beyond the usual knitr render. Only packages with prebuilt WASM binaries on that repo will work; check `https://repo.r-wasm.org/bin/emscripten/contrib/4.4/PACKAGES` before adding one.

---

## Preview locally in Cursor

Open the repo folder in Cursor, then in the integrated terminal (``Ctrl+` ``):

```bash
# Serves the whole site; open the printed localhost URL, then browse to
# Teaching → BILD 5 course page, or go straight to an activity URL
quarto preview

# Faster while iterating on one activity:
quarto preview docs/teaching/classes/bild_5-labs/coding-01-run-your-first-line-of-code.qmd
```

Preview live-reloads as you save. First load of the page in the browser pulls webR
(a few seconds, one time). Leave preview running while you edit.

### Synology Drive / rename error

If preview fails with a message like `rename '.../docs/.../*.html' -> '.../_site/.../*.html'`
or `stat '.../*_files'`, Synology Drive likely interrupted Quarto's intermediate files.
Recovery:

```bash
# Stop any running preview (Ctrl+C), then:
mkdir -p _site/docs/teaching/classes/bild_5-labs
rm -rf docs/teaching/classes/bild_5-labs/*_files docs/teaching/classes/bild_5-labs/*.html
quarto render docs/teaching/classes/bild_5-labs/paper-01-find-a-question-build-a-bibliography.qmd
quarto preview docs/teaching/classes/bild_5-labs/paper-01-find-a-question-build-a-bibliography.qmd
```

Prose paper activities do not need `_freeze/`. Only re-render and commit `_freeze/` after
editing coding activities (webR pages).

---

## Deploy gotcha (read this) — R on Netlify

Activity pages need R to render, but your `netlify.toml` only installs Quarto. So you render
**locally**, and Netlify publishes the cached result. That is what `execute: freeze: auto`
in each activity's front matter does.

**Every time you edit an activity**, before pushing:

```bash
quarto render docs/teaching/classes/bild_5-labs/coding-01-run-your-first-line-of-code.qmd

git add docs/teaching/classes/bild_5-labs/ _extensions/r-wasm/ _freeze/ _quarto.yml
git commit -m "BILD 5: update coding activity"
git push
```

Netlify then runs `quarto render .`, sees the source matches the frozen cache, and skips
R entirely. If you push an edit **without** re-rendering first, the frozen cache is stale
and the Netlify build will try to run R and fail.

---

## Quick reference

```bash
quarto check
quarto preview docs/teaching/classes/bild_5-labs/coding-01-run-your-first-line-of-code.qmd
quarto render  docs/teaching/classes/bild_5-labs/coding-01-run-your-first-line-of-code.qmd
```

Never run `quarto publish` — Netlify deploys on git push.

## Live URLs

- Course hub: `/docs/teaching/classes/BILD_5.html`
- Coding 1: `/docs/teaching/classes/bild_5-labs/coding-01-run-your-first-line-of-code.html`
- Coding 2: `/docs/teaching/classes/bild_5-labs/coding-02-wrangle-and-visualize-penguins.html`
- Coding 3: `/docs/teaching/classes/bild_5-labs/coding-03-read-fix-and-test-r-errors.html`
- Paper 1: `/docs/teaching/classes/bild_5-labs/paper-01-find-a-question-build-a-bibliography.html`
- Paper 2: `/docs/teaching/classes/bild_5-labs/paper-02-annotate-bramante-2026.html`
- Paper 3: `/docs/teaching/classes/bild_5-labs/paper-03-ethics-design-killingley-2022.html`
- Bare `/docs/teaching/classes/bild_5-labs/` 301s to Coding 1 (there is no `index.qmd` here by design)
- Old numbered URLs (`01-…` through `06-…`) 301 to the matching `coding-NN-` / `paper-NN-` paths (`netlify.toml`)
- Old activity URLs under `/bild_5/` redirect to `bild_5-labs/` (301 in `netlify.toml`)

## Annotation viewer

- Full viewer URL: `/annotate/viewer/web/viewer.html?file=%2Fpapers%2F<slug>.pdf`.
  Activity pages link to this form so they work under `quarto preview` too.
- Short reading URL for pasting into Canvas: `/read/<slug>` → 302 to the viewer.
  **Netlify only** — it does not resolve under local preview, since it is a
  `netlify.toml` redirect rather than a real file.
- The `/read/*` rule must stay a **302**, not a 200 rewrite: a rewrite leaves the
  browser URL without the query string, so PDF.js never sees `?file=`.
- `annotate/hypothesis-config.js` is the only place the annotation server origin
  and the class group ID appear. Point `window.HYP_SERVICE` at a self-hosted `h`
  instance to migrate off the public service; nothing in the vendored PDF.js tree
  changes.

### Class group and what is actually enforced

Group: `AeovwxGQ` (<https://hypothes.is/groups/AeovwxGQ/bild-5>), set as
`groupsAllowlist` in `annotate/hypothesis-config.js`.

Three separate things get confused here. Only the first is genuinely enforced:

| Concern | Enforced by | Status |
|---------|-------------|--------|
| Only members can **read** class annotations | Hypothesis server | Yes, real |
| Only members can **post** to the group | Hypothesis server | Yes, real |
| Students don't accidentally post to **Public** | `groupsAllowlist`, client-side | UI nudge only |
| Only members can **open the viewer or PDF** | nothing | Not enforced |

`groupsAllowlist` is a client-side UI restriction on the group selector in *this*
viewer. It cannot stop anyone from annotating the same PDF publicly through the
Hypothesis browser extension or `via.hypothes.is`, because the annotation server —
not this page — decides permissions. Treat it as accident prevention, not access
control.

**Never put the group join link on a public page.** The group is exactly as private
as its invite link; anyone holding it can join and read student annotations. The link
belongs in Canvas, behind SSO. The activity page deliberately says "the invite link
posted in Canvas" rather than embedding it.
- Update PDF.js with `annotate/tools/update-pdfjs.py`. It overwrites `viewer/`, so
  re-apply the two local edits in `viewer/web/viewer.html` (`lang="en"`, the
  `hypothesis-config.js` script tag, the `<title>`) and in `viewer/web/pdfjs-init.js`
  (the `HYP_SERVICE` lookup) afterwards. Also re-delete `viewer/build/*.map` and
  `viewer/web/compressed.tracemonkey-pldi-09.pdf`, which we prune to save ~9 MB.
