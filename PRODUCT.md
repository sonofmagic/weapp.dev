# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are frontend teams evaluating or adopting a mini-program / H5 toolchain. They arrive while selecting or migrating tooling, and need a clear map of project boundaries, credibility signals, and the right docs or repositories to continue.

Secondary audiences exist (active users checking releases, maintainers, contributors, sponsors), but they are not the first audience for this portal.

## Product Purpose

weapp.dev is the bilingual ecosystem portal for an open mini-program engineering toolchain. It helps visitors understand how style (weapp-tailwindcss), build (weapp-vite), and components (Varo), plus adjacent projects such as VPT, fit together, then reach the corresponding documentation or source without requiring a rewrite of their existing writing style.

Success for this site means a visitor can quickly grasp the three-layer boundaries and leave into the correct docs or repositories.

## Positioning

The portal markets a progressive, composable toolchain: keep familiar native mini-program, Vue SFC, or cross-platform writing; upgrade delivery through specialized tools with clear ownership. Neighboring “all-in-one framework” sites cannot truthfully claim this same preserve-your-writing, layered-adoption story for the weapp.dev project set.

## Operating Context

- Developers compare tools before changing a production mini-program or H5 codebase.
- Discovery happens on weapp.dev; deep docs remain on project sites such as `tw.weapp.dev` and `vite.weapp.dev`, with GitHub and npm as proof surfaces.
- Homepage interactive demos illustrate style, build, and registry flows without pretending to run the full production toolchain in-browser.
- Commercial and contributor paths (migration/training, sponsorship, contributors fund) are published beside the open-source core.

## Capabilities and Constraints

- This repository is the Astro monorepo for the weapp.dev website (`apps/web`), not the individual tool runtimes.
- Published project catalog currently centers on weapp-tailwindcss, weapp-vite, Varo, and VPT (vite-plugin-taro), with homepage featured placements for the first three.
- Site must stay bilingual: Chinese at `/`, English under `/en/`, with parity for key pages.
- Site must remain static-first: core content and default demos readable without client JavaScript; theme and navigation may enhance progressively.
- Metrics, sponsorship claims, customer stories, and case evidence must come from real sources already in the repo or confirmed program rules; future work must not fabricate them.
- Existing published engineering stance in site copy: multi-platform work is an explicit single-target build choice, and adoption is progressive rather than a forced rewrite.

## Brand Commitments

- Name: **weapp.dev**
- Maintainer attribution: initiated and maintained by [sonofmagic](https://github.com/sonofmagic)
- License: MIT
- Existing marks and logos live under `apps/web/public/logo.svg` and `apps/web/public/brands/`
- Voice in current site copy is technical, direct, and product-led; bilingual Chinese/English is part of the product surface, not optional decoration

## Evidence on Hand

- Live/public site and repo copy: README, homepage i18n, project JSON under `apps/web/src/content/`
- Brand and project marks: `apps/web/public/logo.svg`, `apps/web/public/brands/`
- Interactive homepage demos for style / build / registry under `apps/web/src/components/home/demos/`
- Media and showcase assets under `apps/web/public/media/`
- Committed metrics fallback: `apps/web/src/data/project-metrics.fallback.json`
- Contributors fund and sponsorship rules published on-site (`/contributors/`, `/pricing/`)
- Architecture and acceptance notes under `docs/`
- Absence to preserve: no fabricated testimonials, unnamed enterprise customers, or unverifiable download/sponsor claims

## Product Principles

1. **Boundary clarity first** — visitors should leave knowing which layer solves which job.
2. **Preserve the writing, upgrade the delivery** — migration cost stays low; tools take over style, build, or components without demanding a rewrite.
3. **Prove with real artifacts** — demos, metrics, releases, and source links beat category slogans.
4. **Bilingual and static-readable** — Chinese/English parity and no-JS readability are product requirements, not polish.
5. **Open core, honest commercial edges** — sponsorship and services may exist, but must stay distinguishable from unverifiable marketing claims.

## Accessibility & Inclusion

No separate legal accessibility standard was newly committed in init. Existing product quality expectations already require keyboard access, localized metadata, light/dark themes, and reduced-motion-friendly behavior on public pages; preserve those unless explicitly changed.
