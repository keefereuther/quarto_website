# Handoff: rescaffold BILD 5 Coding Assignment 4 against the web activities and lecture slides

Written 2026-11-09 by Claude Code in the `quarto_website` repo, for a Claude Code session working in the BILD5 folder. Keefe Reuther (kdreuther@ucsd.edu) is the instructor and decides everything marked **Decision for Keefe**.

## Goal

Edit the graded DataHub assignment so that it is a direct transfer of what students practiced in the three browser activities (Coding 8, 9, 10) and so that its statistical choices match the lecture decks. Ground truth, in order: (1) the lecture slides, (2) the web activities, (3) the current assignment draft. Where the draft disagrees with the slides, the slides win.

After the assignment is final, the three web activities each have a "Transfer to Coding Assignment 4" section that must be re-edited to match. That is a separate follow-up in the `quarto_website` repo (see the last section of this file).

## Files

Assignment (edit these):

- `/Users/keefereuther/NAS_projects/NAS vault/01_UCSD_Projects/BILD5/coding_assignments/assignments/assignment-04/coding_assignment_04.qmd` — the student-facing draft
- `.../assignment-04/assignment_04_solution.qmd` — the key; keep it in sync
- `.../assignment-04/README.md`, `flags.md`, `hints.diff.md` — read first; they likely describe the autograder contract and known student pitfalls
- `.../assignment-04/data/BrittlebushNitrogen.csv` (80 plants: `plant_id`, `nitrogen` with levels control/low/medium/high, 20 each, `leaf_area_cm2`, `biomass_g`) and `BrittlebushDrought.csv` (24 plants: `plant_id`, `photo_before`, `photo_after`). Both complete, no NAs, no impossible values. Simulated data.
- Autograder: `/Users/keefereuther/NAS_projects/NAS vault/01_UCSD_Projects/BILD5/coding_assignments/grading/` with `assignments/assignment-04/config.yml`, `tests/`, `R/`, `README.md`. **Read `config.yml` and the tests before renaming any object.** The web activities deliberately reuse the draft's object names (`box_nitrogen`, `two_group`, `shapiro_control`, `shapiro_high`, `t_two_sample`, `drought_delta`, `hist_delta`, `shapiro_delta`, `t_paired`, `anova_model`, `fligner_anova`, `tukey_result`, `scatter_lm`, `lm_model`, `lm_r_squared`), so if the grader keys on them, keep them.

Lecture decks (ground truth) and the R behind every slide figure:

- `/Users/keefereuther/NAS_projects/NAS vault/01_UCSD_Projects/BILD5/PowerPoints/A009_t-tests.pdf` (t-tests; chickwts and sleep data)
- `.../PowerPoints/A010_ANOVA_ChiSq.pdf` and `A010_ANOVA_ChiSq_v3_Rcode.R` (ANOVA, Tukey, chi-square)
- `.../PowerPoints/A012_Correlation_and_Regression_v4.pdf` and `A012_Correlation_and_Regression_v4_Rcode.R` (correlation, regression, Cook's distance)

Web activities (already rebuilt to match the slides; read them to see the exact workflow and object names students practiced):

- `/Users/keefereuther/NAS_projects/NAS vault/01_UCSD_Projects/quarto_website/docs/teaching/classes/bild_5-labs/coding-08-run-t-tests.qmd`
- `.../bild_5-labs/coding-09-run-anova.qmd`
- `.../bild_5-labs/coding-10-correlation-and-regression.qmd`
- Live: `https://keefereuther.com/docs/teaching/classes/bild_5-labs/coding-08-run-t-tests.html` (and `-09-run-anova`, `-10-correlation-and-regression`; Coding 10's latest version is committed but not yet pushed as of this writing)

Earlier assignment in the same style, useful as a format reference: Coding Assignment 3 (`assignments/assignment-03/`), which uses `RodentParasiteLoad.csv`, a one-sample t-test with a sqrt transform, and the same `q01-code` chunk and `::: {#qNN-answer}` prose-answer conventions.

## What the web activities teach, step by step

Coding 8 (t-tests, chickwts and sleep):

1. Boxplot of all six feeds before testing one. 2. `filter()` to one group; histogram; `shapiro.test()`; one-sample one-tailed `t.test(x, mu = 200, alternative = "greater")`; decision with "fail to reject is not accept". 3. Two-group filter with `%in%`; `facet_wrap(~ feed)` histograms; Shapiro per group; Welch in formula form `t.test(weight ~ feed, data = two_feeds)`; decision using p and whether the CI contains zero. 4. Paired: spaghetti plot (`geom_line(aes(group = ID))`), `pivot_wider()` to one row per patient, `mutate(delta = drug2 - drug1)`, histogram and Shapiro on the delta (fails, p = 0.033, because of one patient), the "one odd patient" decision (keep it, report the caveat, run a sensitivity check without it), `t.test(drug2, drug1, paired = TRUE)`, equivalence with `t.test(delta, mu = 0)`.

Coding 9 (ANOVA on Adelie/Chinstrap/Gentoo bill depth, then chi-square):

1. Boxplot and faceted histograms. 2. `aov()`, `summary()`. 3. Residuals added as a column with `mutate(resid = residuals(anova_model))`, histogram of residuals, `shapiro.test(residuals(anova_model))` (p = 0.047 at n = 342, treated as a large-n caveat, proceed), `fligner.test()`. 4. False-positive rate of pairwise t-tests: `1 - 0.95^choose(k, 2)`. 5. `TukeyHSD()`, read `p adj` and sign of `diff`. 6. Chi-square goodness of fit and independence. The Transfer section already shows `plot(anova_model, which = 1)` because the draft asks for it.

Coding 10 (regression on Adelie flipper length vs body mass):

1. Scatter all species colored by species first, to see clusters; filter to one species. 2. `scatter_lm` with `geom_point() + geom_smooth(method = "lm")`. 3. `cov()` in two unit systems; r by hand as cov / (sd * sd); `cor()`; `cor.test()`. 4. `lm_model`, slope and intercept interpretation (intercept at X = 0 is outside the data). 5. R² by hand as 1 − SS_line / SS_mean, then `summary(lm_model)$r.squared`, and R² = r². 6. `plot(lm_model, which = 1)`, `shapiro.test(residuals(lm_model))`. 7. Influence: a hardcoded 31-point dataset with one far-out point; fit with and without it (`slope_with`, `slope_without`, 0.40 vs 0.92), `plot(fit, which = 4)`, `cooks.distance()`, cutoff `4 / nrow()`, decision: never delete a point just because it moves the line; report both fits.

## Pedagogical rules Keefe applies everywhere (from the slides and from building the activities)

- Write H₀ and Hₐ as math, set α before looking, look at the data, check assumptions, test, conclude. Every part of the assignment should name H₀ explicitly.
- "Fail to reject", never "accept".
- Report the effect and its CI, not just p (difference of means, mean difference, slope, r with CI).
- A failed check is reported with the decision taken, not hidden. Small-n Shapiro is weak; large-n Shapiro flags trivia. Both are said out loud.
- Keep every row unless a value is impossible or a known entry error. Distributional outliers and influential points are flagged, then the analysis is reported with and without them. The draft's "do not winsorize, trim, or remove" paragraph is consistent with this and should stay.
- ANOVA and regression check normality on the **residuals**, not on the raw response or each group. The draft's ANOVA part (Q15) uses only `plot(anova_model, which = 1)` and Fligner; the slides add `shapiro.test(residuals(fit))`.
- Tukey says which pairs differ; the ANOVA p-value never tests one group against the others.
- Correlation shows association, not cause. Slope, p, and R² are three different facts.
- One-tailed tests only when the direction was fixed before the data. The draft is all two-tailed, which is fine.
- Prose style: minimal, direct, no filler. Hints give the function and a tiny example on a different dataset, not the answer.

## Ground-truth numbers for the brittlebush data

Computed 2026-11-09 from the two CSVs with R 4.x. Use these to write the key and to check that any edited question still has a clean answer.

Part A, Welch (control vs high, n = 20 each):
- Shapiro control p = 0.98, high p = 0.99.
- `t.test(biomass_g ~ nitrogen, data = two_group)`: t = −14.8, df = 36.5, p = 4.9 × 10⁻¹⁷. Means 4.62 g (control) and 7.80 g (high); difference control − high = −3.17 g, 95% CI −3.61 to −2.74. Note the sign is negative in formula form because control is alphabetically first.

Part B, paired (24 plants):
- `drought_delta = photo_after − photo_before`: mean −2.92; Shapiro on the delta p = 0.94.
- `t.test(photo_after, photo_before, paired = TRUE)`: t = −29.3, df = 23, p = 1.1 × 10⁻¹⁹, 95% CI −3.13 to −2.72. (A wrongly unpaired two-sample test also gives p < 10⁻¹⁴ here, so this dataset does not show why pairing matters the way the sleep data does. Coding 8 covers that; the assignment need not.)

Part C, one-way ANOVA (four levels, 20 each):
- F = 103.2 on 3 and 76 df, p < 2 × 10⁻¹⁶. Shapiro on residuals p = 0.95. Fligner p = 0.41.
- Group means: control 4.62, low 5.56, medium 5.78, high 7.80 g.
- Tukey: every pair significant (p adj < 0.0001) except medium − low (diff 0.22 g, p adj = 0.64). That gives the draft's Q18 exactly one non-significant contrast to name.

Part D, regression of `biomass_g` on `leaf_area_cm2`, all 80 plants:
- Slope 0.171 g per cm², intercept 1.67 g, p = 2 × 10⁻³¹; r = 0.909; R² = 0.826. Shapiro on residuals p = 0.58. Cook's distance: max 0.19 (row 76), six plants above 4/80 = 0.05, none dramatic.
- **This is the "two clouds, one line" case from slide 39 of A012.** Leaf area by group: control mean 17.4 (range 14.4 to 21.5), low 22.6, medium 24.2 (both roughly 20.7 to 26.6), high 35.8 (range 34.1 to 38.8). No plant has leaf area between 26.6 and 34.1. Within-group fits: control slope 0.10 (p = 0.28, R² = 0.06), low 0.12 (p = 0.12, R² = 0.13), medium 0.21 (p = 0.004, R² = 0.37), high 0.13 (p = 0.18, R² = 0.10). The pooled R² of 0.83 is mostly the nitrogen effect, not leaf area predicting biomass within a treatment.

## Gaps between the draft and the slides, with options

Each item is a **Decision for Keefe** unless marked otherwise. Do not resolve them silently; present them and apply what he picks.

1. **Part D pooling.** The draft's research question is "Can leaf area predict biomass across all plants?" and Q23 asks what the relationship implies biologically. Options: (a) keep the pooled fit and add a question that makes students notice the clusters and say the pooled R² reflects the treatment effect (Coding 10's "Keep playing" section already shows pooling on penguins); (b) restrict Part D to one treatment, which gives a weak, honest within-group relationship (medium is the only one with p < 0.05); (c) add a `color = nitrogen` scatterplot question before the fit, as Coding 10 step 2 does, and let the write-up question carry the lesson. Option (a) or (c) preserves the existing object names and autograder hooks.
2. **Normality on residuals.** Add `shapiro.test(residuals(anova_model))` to Part C and `shapiro.test(residuals(lm_model))` to Part D, as the slides do. Low cost, matches Coding 9 and 10, and gives the write-up questions a concrete number to cite. Would need new object names (suggest `shapiro_anova_resid`, `shapiro_lm_resid`) and matching grader tests.
3. **Cook's distance in Part D.** The slides and Coding 10 cover `plot(lm_model, which = 4)` and `cooks.distance()`. On the brittlebush data the result is unremarkable (max 0.19, six points above 0.05), which is itself a reasonable thing for students to report. Optional.
4. **Effect sizes in write-ups.** Q8, Q13, Q18, Q23 ask about significance and direction. Consider asking for the estimate and CI explicitly ("by how much, with what interval"), as all three activities' write-up callouts do.
5. **H₀ as math.** Each part could open with H₀ and Hₐ written out, or ask the student to write them. The slides do this on every example.
6. **Pairing demonstration.** Not needed here; see the Part B note above.
7. **Q14 formatting.** The draft has escaped backticks (`\`aov()\``) that render literally. Fix.
8. **Reference to the web activities.** The draft says "use the Coding Activities at keefereuther.com". It could name the specific activity per part (Coding 8 for Parts A and B, Coding 9 for Part C, Coding 10 for Part D) with the live URLs above.

Not a decision: keep the student-info chunk, the `q01-code` chunk naming, the `::: {#qNN-answer}` prose blocks, the "simulated data" note, and the generative AI certification, unless the grader README says otherwise.

## Follow-up in the quarto_website repo once the assignment is final

Re-edit these sections so they describe the finished assignment, not the draft:

- Coding 8, section 25 "Transfer to Coding Assignment 4": currently maps Part A to `box_nitrogen`, `two_group`, `shapiro_control`/`shapiro_high`, `t.test(biomass_g ~ nitrogen, data = two_group)`, and Part B to `drought_delta`, `hist_delta`, `shapiro_delta`, `t.test(photo_after, photo_before, paired = TRUE)`.
- Coding 9, section 18 "Transfer to Coding Assignment 4": says Part C uses `aov(biomass_g ~ nitrogen)`, `plot(anova_model, which = 1)` instead of a residual histogram, then Fligner and Tukey. Update if Shapiro on residuals is added.
- Coding 10 no longer has a Transfer section (removed 2026-11-09: it introduced the brittlebush data before students had seen it). The only remaining assignment mentions are a one-line note under step 4's scatterplot, a checker message in step 11, and the recap line "you have covered Coding Assignment 4, Part D". If Part D is renamed or restructured, update those three.

After editing any of those three `.qmd` files: `quarto render <file>` locally (they need R; Netlify has none), commit the `.qmd` and its `_freeze/` output together, then push. The dev notes at `docs/teaching/classes/bild_5-labs/_dev-notes.md` explain the freeze workflow and the checker conventions.
