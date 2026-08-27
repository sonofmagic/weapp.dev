# weapp.dev UI Acceptance

## Verification context

- Route / build: production static build from `pnpm --filter @weapp.dev/web build`.
- Reference lock: `docs/plans/2026-08-27-weapp-dev-brand-layout.md`.
- Desktop: Chromium, 1440 × 1000, `/` and `/projects/varo/`.
- Narrow: Chromium, 390 × 844, `/` and the Varo project row.
- Themes: light and dark.
- Inputs: pointer automation, keyboard navigation, native mobile disclosure, theme toggle, platform accessibility-tree inspection.
- Accessibility target: WCAG 2.2 AA.
- Performance target: local lab LCP <= 2.5 s and CLS <= 0.1; no field percentile claim.
- Before evidence: `/tmp/weapp-rebased-final-desktop.png`, `/tmp/weapp-current-mobile-top.png`.
- After evidence: `/tmp/weapp-ui-final-desktop-full.png`, `/tmp/weapp-ui-final-mobile.png`, `/tmp/weapp-ui-final-light.png`, `/tmp/weapp-ui-final-varo.png`.

## Product clarity and hierarchy

- [x] The first viewport states the product category, describes styling / build / editable component coverage, and exposes one primary project action.
- [x] The stage strip names all three projects without mobile truncation.
- [x] The Build Lens is the dominant visual idea; the Hub mark, hero, OG image, and maintainer lockup use the same layered geometry.
- [x] Project rows remain one-project-at-a-time and use current product screenshots rather than decorative cards.
- [x] Varo is described from its current repository: registry-first H5 / `weapp-vite` source, 56 runtime families, 45 exposed mini-program registry families, and 36 dual-target Agent UI components.
- [x] Varo remains visibly planned with CLI version `0.0.1`; no stable release is implied.

## Primary journey and states

- [x] Home → project detail → docs/source/npm destinations are present in both languages.
- [x] Three documentation links are asserted in the home-page contract.
- [x] Chinese, English, privacy, 404, project-detail, RSS, sitemap, llms, and llms-full routes build and validate.
- [x] Theme choice persists and exposes `aria-pressed`.
- [x] Mobile navigation opens, exposes project and section destinations, then closes.
- [x] Static content works without client JavaScript; loading, authentication, permission, destructive action, retry, and offline runtime states are not applicable.
- [x] Metrics retain the existing committed fallback when npm or GitHub is unavailable.
- [x] Planned Varo license metadata is omitted because the published Varo repository does not yet contain a committed license; no license is fabricated.

## Responsive and content resilience

- [x] Desktop and narrow layouts preserve hero → build path → projects → principles → releases → maintainer order.
- [x] Narrow viewport reports zero horizontal overflow.
- [x] Long Varo copy, stage labels, platform data, metrics, screenshots, and actions remain readable.
- [x] Hero stage strip becomes three full-width rows below 520 px.
- [x] Project media stays at 16:11 and all local visuals load after lazy-load activation.
- [x] Header controls retain 40–44 px interaction geometry and do not obscure content.

## Motion

- [x] Normal mode runs the limited Living Build Lens set: lens drift, light scan, floating product panel/code surface, and three project-mark floats.
- [x] Scroll reveals use IntersectionObserver once per element and fail open after 2.5 seconds.
- [x] Hero copy is visible at first paint and uses transform-only entrance motion; it does not wait for the reveal observer.
- [x] Project media receives a maximum 1.5% hover/focus zoom and 4 px lift.
- [x] `prefers-reduced-motion: reduce` reports zero animations, zero hidden reveal elements, all three projects, and zero overflow.
- [x] No canvas, WebGL, video, particle engine, motion dependency, or per-frame JavaScript was added.

## Accessibility

- [x] Native landmarks, headings, links, buttons, lists, details/summary, figures, and description lists remain intact.
- [x] Skip-link and theme activation work by keyboard.
- [x] Focus outlines remain visible and sticky-header scroll padding is preserved.
- [x] Decorative marks use empty alt text inside named links; Varo screenshots have bilingual alt text and captions.
- [x] Axe reports zero violations in light and dark themes on desktop and mobile projects.
- [x] Reduced motion preserves every message, action, and project.
- [x] No state or meaning depends on color alone.

## Performance and stability

- [x] No hydrated framework components or new runtime dependency.
- [x] All logos and screenshots are local, intrinsically sized SVG/WebP/AVIF assets.
- [x] Desktop local production lab: TTFB 0.9 ms, FCP 68 ms, LCP 68 ms (`h1`), CLS 0.0002.
- [x] Mobile local production lab: TTFB 1.4 ms, FCP 116 ms, LCP 116 ms (hero copy), CLS 0.0004.
- [x] Load-only probes do not emit INP; Playwright directly exercises navigation, theme, menus, preferences, and project routes.
- [x] Measurements are local lab observations, not field percentiles.

## Reference integrity

- [x] The result follows Living Build Lens / 动态构建透镜.
- [x] TanStack informed restraint and brand discipline; Vite informed direct category/action hierarchy; OMP informed a single atmospheric technical surface; VoidZero informed strong section contrast and real product visuals.
- [x] No palm, beach image, purple block system, magenta particle field, install-tab clone, carousel, or copied product geometry was introduced.
- [x] Latest `upstream/main` SEO, analytics, project-detail, privacy, and static-routing behavior was preserved through rebase.
- [x] Varo uses the exact symbol from `open-source/varo/apps/docs/public/brand-assets/varo-symbol.svg`.

## Verification evidence

- `astro check && tsc --noEmit`: 0 errors, 0 warnings, one existing `document.execCommand` deprecation hint.
- Static build: 12 pages generated.
- Build validator: 17 required outputs and all internal links validated.
- Playwright: 38 passed across desktop and mobile.
- Media generator: completed with reproducible Varo source captures stored in the Varo repository.

## Acceptance

- [x] All primary-task blockers are resolved.
- [x] No unresolved visual, accessibility, responsive, build, or history blocker remains.
- [x] Final screenshots, generated outputs, tests, and measurements correspond to the rebased implementation.
