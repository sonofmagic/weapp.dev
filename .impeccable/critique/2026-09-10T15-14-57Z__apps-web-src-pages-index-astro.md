---
target: homepage
total_score: 23
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
target_identity: "file:/Users/yangqiming/Documents/ChatGPT/weapp.dev/apps/web/src/pages/index.astro"
target_fingerprint: "sha256:f4b0b87928b6f99fe6f3d4691043efbba1d4a7f9550f4ba1cf45e9590acd811f"
target_path: /Users/yangqiming/Documents/ChatGPT/weapp.dev/apps/web/src/pages/index.astro
timestamp: 2026-09-10T15-14-57Z
slug: apps-web-src-pages-index-astro
closed: true
---

Method: dual-agent (A: 01a08bdb-98f6-72d2-84ba-2d8bbff64c8e · B: 01a08bdb-98f6-72d2-84ba-2d9676d7dd4d)

## Design Health Score

| #         | Heuristic                       | Score     | Key Issue                                                                                   |
| --------- | ------------------------------- | --------- | ------------------------------------------------------------------------------------------- |
| 1         | Visibility of System Status     | 3         | Theme/language clear; demos communicate toolchain state; no reading progress on a long page |
| 2         | Match System / Real World       | 3         | Mini-program language fits; About 编写→构建→组装 aligns with featured STYLE/BUILD/COMPOSE   |
| 3         | User Control and Freedom        | 3         | Skip link, EN/中, theme, sticky chrome work; long page still costly to retreat              |
| 4         | Consistency and Standards       | 3         | Build Lens tokens mostly hold; demo mock chrome and a few arbitrary type sizes drift        |
| 5         | Error Prevention                | 3         | Low-risk Persuade surface; outbound exits are explicit                                      |
| 6         | Recognition Rather Than Recall  | 3         | Logos/metrics/demos help; visitors still juggle many parallel exits                         |
| 7         | Flexibility and Efficiency      | n/a       | Persuade surface                                                                            |
| 8         | Aesthetic and Minimalist Design | 2         | Calm system, but stacked proof + mid-flow commercial + vision + releases creates scroll tax |
| 9         | Error Recovery                  | 3         | Few error states; analytics dialog recoverable                                              |
| 10        | Help and Documentation          | n/a       | Persuade surface (docs CTAs are conversion exits)                                           |
| **Total** |                                 | **23/32** | **Good**                                                                                    |

## Design Specificity Verdict

**LLM assessment:** The homepage is authored for weapp.dev more than for a generic toolchain portal. Mint-sage canvas, WeUI Forest Green, mono metadata, real project marks, metrics, and Style/Build/Registry demos match PRODUCT + DESIGN ("The Build Lens"). Assessment A initially flagged a WebGL convergence hero; browser evidence contradicts that — the served hero is `HeroDemos` with STYLE / BUILD / REGISTRY tabs, matching current source. Specificity holds; the remaining weakness is structural length and competing exits, not a missing identity.

**Deterministic scan (CLI):** 19 advisory findings on source markup/CSS — `design-system-font-size` ×15, `design-system-color` ×4. Hotspots: `HomeCollaboration.astro`, `HomeProjectRow.astro`, `HomeProjects.astro`, and especially `demos/demo.css` (intentional mock-UI sizes/colors likely false positives for site tokens).

**Visual overlays:** Injection succeeded on `http://127.0.0.1:4321/` via live-server `:8400`. Reliable overlays were visible (~60 nodes). Console counts: undersized-ui-text 16, ai-color-palette 6, nested-cards 6, text-overflow 4, gpt-thin-border-wide-shadow 3, plus single hits for low-contrast, hero-eyebrow-chip, dark-glow, kicker-above-heading, codex-grid-background. Many cluster in the interactive demo stage (expected mock chrome), not the global shell.

## Overall Impression

Competent, evidence-first Persuade page with a real product voice. Biggest opportunity: shorten the proof arc and stop interrupting belief-building with commercial options before vision/releases finish the story.

## What's Working

1. **Interactive proof in the hero** — Style/Build/Registry demos make the three-layer claim tangible without fake screenshots.
2. **Build Lens craft** — one accent family, hairline structure, mono eyebrows, bilingual chrome, restrained radii.
3. **Honest commercial edges** — open core vs migration/training / planned / sponsor stays distinguishable.

## Priority Issues

### [P1] Mid-page commercial breaks the proof arc

- **What:** `HomeCommercial` lands after project rows and before Vision/Releases.
- **Why it matters:** Toolchain Evaluators are still mapping layers when money paths appear; belief unfinished.
- **Fix:** Move commercial after Releases/Collaboration, or collapse to a single quiet link until proof is complete.
- **Suggested command:** `/impeccable distill` or `/impeccable layout`

### [P1] Scroll tax from stacked full demo rows + late sections

- **What:** Hero demo + About + three heavy project labs + commercial + vision + releases + collaboration (~long single scroll).
- **Why it matters:** Persuade conversion wants a short path to “pick a layer → open docs.”
- **Fix:** Keep three featured rows but tighten vertical rhythm; demote secondary narrative or fold Releases into a denser strip.
- **Suggested command:** `/impeccable distill` / `/impeccable layout`

### [P2] Type-ramp drift outside documented sizes

- **What:** CLI flags arbitrary sizes in `HomeProjects` / `HomeProjectRow` / `HomeCollaboration` (e.g. 48/38/35/30/10px).
- **Why it matters:** Undermines DESIGN.md as authority for future agents.
- **Fix:** Map display steps into DESIGN tokens or replace with existing headline/title/label roles.
- **Suggested command:** `/impeccable typeset` then refresh `/impeccable document` if the scale changes

### [P2] Demo-stage detector noise (nested cards, undersized text, undocumented colors)

- **What:** Browser overlays light up the lab chrome heavily.
- **Why it matters:** Some are intentional mock UI; some may be real readability issues inside the demos visitors use to trust the toolchain.
- **Fix:** Audit demo chrome for contrast/overflow; ignore true mock-palette false positives in `.impeccable/critique/ignore.md` or detector ignores.
- **Suggested command:** `/impeccable audit` (scoped to demos) / `/impeccable quieter`

### [P2] Desktop hero CTA geometry

- **What:** Primary/secondary actions can sit beside the lead rather than under the title path.
- **Why it matters:** Softens the Persuade path on first view.
- **Fix:** Stack description → primary/secondary under the title on desktop; keep project rail as secondary chooser.
- **Suggested command:** `/impeccable layout`

## Persona Red Flags

**Jordan (First-Timer / skeptical frontend):** Sees many exits (hero CTAs, rail, per-row docs/详情, commercial trio, header menu) before a recommended first install is obvious.

**Casey (Distracted Mobile User):** EN/中 works, but the long stacked demos + commercial make one-handed scanning costly; thumb path to a single next step is unclear.

**Toolchain Evaluator (project-specific):** Can understand the three layers from demos, but cannot brief stakeholders quickly while commercial and late vision/releases compete with the adoption decision.

## Minor Observations

- Detector `ai-color-palette` / demo hexes (`#91431a`, `#176181`, …) look like Style demo swatches — likely false positives for global brand.
- Primary button glow/shadow tensions Flat-By-Default if present in current CSS utilities.
- Header jumps to `/pricing/` but does not deep-link `#projects` / `#commercial`.
- Live preview was from local `dist/`; always rebuild before treating preview as source-of-truth.

## Questions to Consider

- If the three-layer story is the product, why does commercial speak before vision finishes the belief arc?
- Can a Toolchain Evaluator answer “which layer this sprint?” in 60 seconds without scrolling past sponsorship?
- Which demo-detector hits are mock truth, and which are real readability debt?
