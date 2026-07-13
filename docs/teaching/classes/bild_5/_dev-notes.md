# BILD 5 webR exercise — local edit & deploy runbook

Everything you need to edit, preview, and safely ship `docs/teaching/classes/bild_5/index.qmd`
from Cursor. Read the **Deploy gotcha** section before your first push — it prevents a broken build.

---

## What was added to the repo

- `_extensions/r-wasm/live/` — the Quarto Live extension, vendored (same as `quarto add r-wasm/quarto-live`, v0.2.0). Must stay committed.
- `docs/teaching/classes/bild_5/index.qmd` — the exercise page (unlisted; reachable by URL only).
- `docs/teaching/classes/bild_5/_dev-notes.md` — this file (the leading `_` means Quarto never publishes it).

---

## One-time prerequisites

You almost certainly have these (the repo is an `.Rproj`), but confirm:

1. **Quarto ≥ 1.4** — `quarto --version`. Update from quarto.org if older.
2. **R** — `R --version`. Needed *locally* to render this page (it uses `engine: knitr`).
3. **The `knitr` R package** — in R: `install.packages("knitr")` if missing.
4. Verify the toolchain sees R: `quarto check`. Look for a green "R" line.

You do **not** need to install webR — that downloads into the student's browser at runtime.

---

## Preview locally in Cursor

Open the repo folder in Cursor, then in the integrated terminal (``Ctrl+` ``):

```bash
# Serves the whole site; open the printed localhost URL, then browse to
# Teaching → (or go straight to) /docs/teaching/classes/bild_5/
quarto preview

# Faster while iterating on just this page:
quarto preview docs/teaching/classes/bild_5/index.qmd
```

Preview live-reloads as you save. First load of the page in the browser pulls webR
(a few seconds, one time). Leave preview running while you edit.

---

## What to verify in the browser

Appearance:

- [ ] Page shows your **site navbar, footer, and minty theme** (confirms the `live-html`
      theme/CSS restatement resolved — the thing most likely to need a tweak).
- [ ] The **skip-nav link** appears when you press `Tab` first thing (your WCAG baseline).
- [ ] The interactive editors render in **dark "night mode"** with a readable, light
      **"R code block"** label in the header (not black-on-dark).
- [ ] Editors are **at least 4 lines tall** even when the code is shorter.

Behavior:

- [ ] Section 1: `head(iris)` → first 6 rows print.
- [ ] Section 2: `iris$Petal.Length` → 150 numbers print.
- [ ] Section 3 exercise shows **one** "Show Hint" and **one** separate "Show Solution"
      button. Fill `Petal.Length` → green "correct". Try `Sepal.Length` → the "real column,
      not the one we're after" nudge. Leave the blank → the "no object" message.
- [ ] Section 4: runs `mean(petal_length)`; add a line like `sd(petal_length)` and re-run.
- [ ] Section 5: `hist(petal_length)` → a histogram appears and grades correct. Try `hist()`
      with the blank empty → the "put `petal_length` inside" nudge.

If the theme looks like plain Bootstrap instead of minty, the relative paths in the page's
front matter (`../../../../theme-light.scss` etc.) didn't resolve — tell me and it's a
one-line fix. Same if the editors are *not* dark: that means the `<style>` block near the
top of `index.qmd` didn't apply.

---

## Where the editable pieces live (all in `index.qmd`)

- **Prose / framing** — plain Markdown between the code blocks.
- **What students see to fill in** — the `` ```{webr} `` blocks tagged `#| exercise: <label>`.
  The `______` (six+ underscores) become the blanks.
- **Hints & solutions** — the `::: {.hint ...}` and `::: {.solution ...}` fenced divs,
  matched to an exercise by its `exercise="<label>"`.
- **Grading logic** — the `` ```{webr} `` blocks tagged `#| check: true`. Plain R that
  returns `list(correct=, message=, type=)`. Use `.result` (the last value the student's
  code produced) and `.envir_result` (their environment, e.g.
  `get("petal_length", envir = .envir_result)`) to inspect their work. The plot check reads
  `.user_code` instead, since a plot has no return value to test.
- **Editor "night mode" + labels** — the `<style>` block right after the front matter
  overrides the extension's CSS variables to make editors dark. The **"R code block"** label
  and the **4-line minimum** come from `webr: cell-options:` in the front matter
  (`caption` and `min-lines`), so they apply to every code block at once.

To change a target value, edit it in the matched places: the prompt prose, the hint, the
solution block, and the `check: true` logic.

---

## Deploy gotcha (read this) — R on Netlify

This page needs R to render, but your `netlify.toml` only installs Quarto. So you render
**locally**, and Netlify publishes the cached result. That is what `execute: freeze: auto`
in the page's front matter does.

**One-time repo change: already done.** The `/_freeze/` line has been removed from
`.gitignore`, so the freeze cache can be committed. Nothing to do here.

**Every time you edit the page**, before pushing:

```bash
# Re-render this page so its frozen cache in _freeze/ is up to date
quarto render docs/teaching/classes/bild_5/index.qmd

git add docs/teaching/classes/bild_5/ _extensions/r-wasm/ _freeze/ .gitignore
git commit -m "BILD 5: intro webR exercise (iris: columns, objects, plots)"
git push
```

Netlify then runs `quarto render .`, sees the source matches the frozen cache, and skips
R entirely. If you push an edit **without** re-rendering first, the frozen cache is stale
and the Netlify build will try to run R and fail — so always `quarto render` the page before you commit.

(Alternative, if you'd rather not manage freeze: install R inside the Netlify build command.
Heavier and slower; freeze keeps your site R-free the way you designed it. Ask me if you
want the R-on-Netlify version instead.)

---

## Quick reference

```bash
quarto check                                             # toolchain (incl. R) OK?
quarto preview docs/teaching/classes/bild_5/index.qmd    # live edit
quarto render  docs/teaching/classes/bild_5/index.qmd    # refresh _freeze before pushing
```

Never run `quarto publish` — Netlify deploys on git push.
