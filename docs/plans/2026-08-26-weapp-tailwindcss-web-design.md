# weapp-tailwindcss Web styling migration

## Goal

Use `weapp-tailwindcss` as the only Tailwind CSS generation pipeline for the Astro site while preserving the current visual hierarchy, bilingual routes, theme behavior, responsive layout, accessibility, and static output.

## Architecture

Astro registers `WeappTailwindcss` through `vite.plugins` with `generator.target: 'web'` and an explicit CSS entry. The entry imports Tailwind CSS, declares Astro sources, exposes the neutral brand tokens, and contains only the minimal base/theme rules that cannot be represented safely in markup. The site must not register `@tailwindcss/vite` or another competing Tailwind generator.

Components use static Tailwind utility classes directly. Shared command controls may use small exported class constants in Astro frontmatter when this prevents repeated, error-prone class lists. Project accent colors remain data-driven through `--project-accent` and are consumed with arbitrary-value utilities. Dark theme styles use the existing `data-theme` contract and a Tailwind custom variant so the inline theme bootstrap continues to prevent a flash of the wrong theme.

## Migration constraints

- Remove the legacy semantic stylesheet rather than layering utilities over it.
- Preserve native semantic HTML, keyboard behavior, visible focus states, and reduced-motion behavior.
- Keep layouts stable at desktop, tablet, and mobile breakpoints.
- Ensure every utility is statically discoverable by the generator; do not construct class names dynamically.
- Verify the generated CSS contains browser-native selectors and no mini-program escaped class output.

## Validation

Run repository checks, static build/link validation, unit tests, Wrangler dry-run, and Playwright on desktop Chrome and Pixel 7. Compare full-page screenshots in light and dark themes, check overflow and clipped controls, and retain the existing Lighthouse targets.
