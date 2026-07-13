# BILD 5 webR exercises — local edit & deploy runbook

Everything you need to edit, preview, and safely ship BILD 5 in-class activities from
Cursor. Read the **Deploy gotcha** section before your first push — it prevents a broken build.

---

## What lives in the repo

- `_extensions/r-wasm/live/` — the Quarto Live extension, vendored (same as `quarto add r-wasm/quarto-live`, v0.2.0). Must stay committed.
- `docs/teaching/classes/BILD_5.qmd` — course hub (syllabus, overview). Uses the `bild-5-activities` sidebar.
- `docs/teaching/classes/bild_5-labs/NN-slug.qmd` — numbered activity pages (flat files, not `index.qmd`).
- `docs/teaching/classes/bild_5-labs/_metadata.yml` — applies the activity sidebar to every page in this folder.
- `docs/teaching/classes/bild_5-labs/_dev-notes.md` — this file (the leading `_` means Quarto never publishes it).

### Activity file naming

Use zero-padded numbers and kebab-case slugs:

```
docs/teaching/classes/bild_5-labs/
  01-run-your-first-line-of-code.qmd
  02-<slug>.qmd
  03-<slug>.qmd
```

**Do not** use `index.qmd` for activities.

### Adding a new activity

| Step | Action |
|------|--------|
| 1 | Create `docs/teaching/classes/bild_5-labs/NN-short-slug.qmd` (copy front matter from activity 1) |
| 2 | Add `N — Page Title` to the `bild-5-activities` sidebar in `_quarto.yml` |
| 3 | `quarto render docs/teaching/classes/bild_5-labs/NN-short-slug.qmd` locally |
| 4 | Commit the `.qmd`, matching `_freeze/` path, and `_quarto.yml` sidebar entry |
| 5 | Push to `main` (Netlify has no R) |

---

## One-time prerequisites

You almost certainly have these (the repo is an `.Rproj`), but confirm:

1. **Quarto ≥ 1.4** — `quarto --version`. Update from quarto.org if older.
2. **R** — `R --version`. Needed *locally* to render activity pages (they use `engine: knitr`).
3. **The `knitr` R package** — in R: `install.packages("knitr")` if missing.
4. Verify the toolchain sees R: `quarto check`. Look for a green "R" line.

You do **not** need to install webR — that downloads into the student's browser at runtime.

---

## Preview locally in Cursor

Open the repo folder in Cursor, then in the integrated terminal (``Ctrl+` ``):

```bash
# Serves the whole site; open the printed localhost URL, then browse to
# Teaching → BILD 5 course page, or go straight to an activity URL
quarto preview

# Faster while iterating on one activity:
quarto preview docs/teaching/classes/bild_5-labs/01-run-your-first-line-of-code.qmd
```

Preview live-reloads as you save. First load of the page in the browser pulls webR
(a few seconds, one time). Leave preview running while you edit.

---

## Deploy gotcha (read this) — R on Netlify

Activity pages need R to render, but your `netlify.toml` only installs Quarto. So you render
**locally**, and Netlify publishes the cached result. That is what `execute: freeze: auto`
in each activity's front matter does.

**Every time you edit an activity**, before pushing:

```bash
quarto render docs/teaching/classes/bild_5-labs/01-run-your-first-line-of-code.qmd

git add docs/teaching/classes/bild_5-labs/ _extensions/r-wasm/ _freeze/ _quarto.yml
git commit -m "BILD 5: update activity 1"
git push
```

Netlify then runs `quarto render .`, sees the source matches the frozen cache, and skips
R entirely. If you push an edit **without** re-rendering first, the frozen cache is stale
and the Netlify build will try to run R and fail.

---

## Quick reference

```bash
quarto check
quarto preview docs/teaching/classes/bild_5-labs/01-run-your-first-line-of-code.qmd
quarto render  docs/teaching/classes/bild_5-labs/01-run-your-first-line-of-code.qmd
```

Never run `quarto publish` — Netlify deploys on git push.

## Live URLs

- Course hub: `/docs/teaching/classes/BILD_5.html`
- Activity 1: `/docs/teaching/classes/bild_5-labs/01-run-your-first-line-of-code.html`
- Old activity URLs under `/bild_5/` redirect to `bild_5-labs/` (301 in `netlify.toml`)
