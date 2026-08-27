# weapp.dev Brand and Layout Reference Lock

## Brief

- Product: Chinese-first, bilingual open-source portal for mini-program and cross-runtime developer tooling.
- Audience: Teams evaluating styling, build, runtime, component, and Agent UI tooling for H5 and mini-program products.
- Primary job: Understand how each project differs, inspect current proof, then open its documentation or source.
- Primary action: Browse a project and continue to its documentation.
- Five-second target: A visitor understands that weapp.dev curates an open cross-end tool stack, sees the available projects, and knows where to continue.
- Scope: Shared Hub mark, Header/Footer lockup, social image source, Varo project mark, Varo product metadata and screenshots, desktop/mobile presentation, light/dark themes.
- Runtime constraints: Astro 6 static output, Tailwind CSS 4, existing Geist fonts and Lucide icons, no new client framework or animation dependency.
- Accessibility target: WCAG 2.2 AA.
- Performance target: Static-first; no remote logo or screenshot dependency, no new client JavaScript, intrinsic asset dimensions, provisional LCP <= 2.5 s and CLS <= 0.1.
- Non-goals: Copying TanStack, Xiaomi, WeChat, Vue, or Vite artwork; encoding every supported platform in the Hub mark; changing Varo's source-of-truth brand system; inventing a license not declared by the Varo repository.

## Evidence questions

| Class              | Question                                                                                         | Evidence                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| Real products      | How do mature open-source and cross-platform brands present themselves?                          | TanStack, Flutter, Expo, Ionic, Taro                             |
| Corporate identity | How can the mark stay stable across favicon, Header, and larger lockups?                         | Xiaomi's current corporate mark and official site usage          |
| Existing systems   | Which layout and token decisions should survive the rebase?                                      | Latest `upstream/main` implementation                            |
| Source of truth    | What are Varo's current identity and product claims?                                             | Local `open-source/varo` `main`, synchronized with `origin/main` |
| Quality            | Does the result work in both themes, at 32 px, in generated static output, and without overflow? | Browser, Astro, Playwright, Axe, and build validation            |

## Reference decisions

| Problem                                   | Reference / observation                                                                                                                                                                             | Decision                                                                          | Risk control                                                                            |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| TanStack-inspired quality without copying | TanStack pairs a distinct emblem and wordmark, then applies a disciplined system rather than explaining every feature in the mark.                                                                  | Adopt the emblem-plus-wordmark discipline only.                                   | Reject its palm, capsule, typography, beach imagery, and composition.                   |
| Cross-end breadth                         | Flutter, Expo, Ionic, and Taro use platform-neutral brand marks; supported runtimes are communicated in product copy.                                                                               | Do not draw App, Web, WeChat, Baidu, or other platform logos inside the Hub mark. | Keep platform coverage in project metadata and content.                                 |
| Enterprise-level stability                | Xiaomi uses one dominant single-color superellipse and a controlled inner symbol.                                                                                                                   | Use a single WeUI-green superellipse with one white proprietary totem.            | Do not copy `MI`, Xiaomi orange, or Xiaomi's exact superellipse geometry.               |
| Varo identity                             | `open-source/varo/apps/docs/public/brand-assets/varo-symbol.svg` is the current source-of-truth mark.                                                                                               | Reuse that exact mark in weapp.dev.                                               | No reinterpretation, recoloring, Vue-chevron imitation, or competing Varo logo.         |
| Varo product claims                       | Current Varo code documents 56 H5 and mini-program runtime families, 45 exposed mini-program registry families, 36 dual-target Agent UI components, editable source, and H5 / `weapp-vite` targets. | Update portal metadata and screenshots to those verified facts.                   | Keep status `planned` and CLI version `0.0.1`; do not imply a published stable release. |
| Varo license                              | The current Varo repository and packages do not declare a license.                                                                                                                                  | Make project license metadata optional for planned projects.                      | Omit license from structured data rather than fabricating MIT or another license.       |
| Card alignment                            | The user reported baseline drift in the pre-rebase three-column card design.                                                                                                                        | Preserve latest upstream's one-project-per-row layout after rebase.               | Complete descriptions remain visible and no cross-card baseline dependency remains.     |

## Locked direction

### Hub mark

- Architecture: independent SVG emblem plus HTML `weapp.dev` wordmark.
- Container: one rounded superellipse, fixed WeUI green `#07C160`.
- Inner totem: three asymmetric white curved facets around a green negative center.
- Color variants: none. The same green/white badge is used on light and dark surfaces.
- Small-size rule: all three facets and the central negative space remain visible at 32 px; no detail is added or removed.
- Social image: use the same mark in the upstream OG composition.

### Varo mark

- Exact source: `open-source/varo/apps/docs/public/brand-assets/varo-symbol.svg`.
- Geometry: four blue/green diagonal modules with a central diamond cutout.
- Portal copy: production foundation for cross-runtime component systems; registry-first editable source for H5 and `weapp-vite`.
- Product visuals: current Varo docs home and Agent UI catalog captured from the synchronized local repository.

### Layout and interaction

- Preserve the latest `upstream/main` visual hierarchy, SEO work, analytics controls, navigation, project rows, project-detail visuals, and responsive behavior.
- Replace only the obsolete `w/` badge with `/logo.svg` in Header and Footer.
- Remove the unused pre-rebase `EcosystemVisual.astro` component.
- Keep native navigation semantics, skip link, theme state, reduced-motion behavior, and intrinsic image dimensions.

## Anti-references

- No platform-logo collage, route map, arrows, bridge, prism, wildcard, cross/D-pad, letter-only icon, or feature diagram.
- No purple Varo V, Vue nested chevron, Vite triangle/lightning, WeChat speech bubbles, gradients, glows, or mascot illustration.
- No reintroduction of the discarded pre-rebase three-column project layout.
- No merge commit when incorporating upstream changes; history remains rebased and linear.

## Implementation assessment

| Surface          | Decision                             | Dependencies                    | Accessibility / performance                                        | Maintenance                                               |
| ---------------- | ------------------------------------ | ------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------- |
| Hub SVG          | Original three-sheet Build Lens mark | None                            | Decorative empty alt inside named links; 64×64 intrinsic size      | One source used by Header, Footer, favicon, and OG source |
| Varo SVG         | Exact source asset                   | None                            | Callers provide adjacent project name; 128×128 intrinsic size      | Synced from Varo repository                               |
| Varo screenshots | Local WebP + AVIF                    | Pillow build-time encoding only | Descriptive bilingual alt/captions; intrinsic 1440×990 and 780×975 | Regenerate from current docs when UI changes materially   |
| Varo metadata    | Current README/docs facts            | Existing Astro content schema   | Static HTML and JSON-LD; no runtime request                        | Update counts from source-of-truth registry/docs          |
| Planned license  | Optional                             | Existing schema/SEO             | Undefined value is omitted from JSON-LD                            | Add a real license URL only after Varo declares one       |

## Final lock review

- [x] One Hub direction is selected.
- [x] References answer explicit questions rather than supply copied artwork.
- [x] Varo uses its own repository as source of truth.
- [x] Latest upstream layout and SEO behavior are preserved.
- [x] Accessibility, reduced motion, responsive behavior, and performance are acceptance requirements.
- [x] Rejected identities and obsolete layout paths are explicit.

## Homepage revision: Living Build Lens

### Research questions and evidence

| Reference               | Observation                                                                                                                               | Adopt                                                                                 | Reject                                                                                                            |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| https://tanstack.com/   | One memorable hero idea, assertive typography, restrained controls, and a brand system that feels intentionally human.                    | Give the first viewport one dominant composition and preserve generous reading space. | Palm, beach photography, custom TanStack lettering, and its black/white identity.                                 |
| https://vite.dev/       | Category and primary action are immediate; dense tooling claims are separated into calm, large sections.                                  | Keep literal copy, direct docs paths, and a disciplined grid.                         | Purple blocks, Vite's triangular identity, and identical feature rhythm.                                          |
| https://omp.sh/         | A full-viewport hero combines atmosphere, a real command surface, a compact feature rail, and strong motion without adding many sections. | Use one technical atmosphere and treat product UI as the primary visual object.       | Magenta/blue particle wave, install-command tabs, noise treatment, and feature-rail geometry.                     |
| https://voidzero.dev/   | Large light/dark bands, oversized statements, alternating media/text, real metrics, and product-specific visuals create authority.        | Strengthen section contrast and let each project visual lead one row.                 | Purple brand assets, carousel behavior, newsletter/product-company structure, and copied alternating proportions. |
| Current `upstream/main` | The Build Lens image, real project screenshots, SEO work, project rows, and dark pine system already provide a coherent foundation.       | Refine the existing system rather than replace it.                                    | The accepted Tri-Arc badge because it conflicts with the Build Lens shape language.                               |

### Locked direction

- Name: **Living Build Lens / 动态构建透镜**.
- Rationale: weapp.dev serves technical readers choosing real tools. Layered materials visualize source → style → build → component delivery while real screenshots establish trust.
- Structural observations:
  1. The hero remains two-column but gains a stronger layered visual, staged copy entry, and clearer relationship between project marks and the code surface.
  2. Project rows remain one project at a time; each receives a stage index and a controlled media treatment instead of reverting to equal cards.
  3. About, principles, releases, and maintainer sections keep the latest upstream information architecture but gain stronger contrast and reveal rhythm.
- Hub mark: three compact isometric Build Lens sheets in silver-green, mint, and deep green; no container or separate corporate badge.
- Hero details: subtle independent layer drift; staged copy/buttons. No particle field or decorative video.
- Project details: stage number and accent edge; media scales by at most 1.5% on hover/focus-within.
- Motion: existing intersection reveals remain; children may stagger. Continuous motion is limited to the hero Build Lens and uses transform/opacity only.
- Controlled experiment: the hero's three layers drift on independent 7–11 second alternate cycles. Reading order and controls remain static; `prefers-reduced-motion` disables all drift; deleting the animation rules does not change layout or product logic.
- Responsive: no animation may create horizontal overflow or delay content; narrow screens use smaller drift distances and retain source order.
- Performance: no new package, remote asset, canvas, WebGL, video, or per-frame JavaScript. CSS transform/opacity only.

### Additional anti-references

- No generic glassmorphism card field, purple gradient, AI sparkle, particle clone, or full-screen animation behind body copy.
- No hidden content that depends indefinitely on scrolling; reveal observers must fail open and reduced motion must show every section immediately.
- No reintroduction of equal-height project cards or detached decorative bento blocks.
