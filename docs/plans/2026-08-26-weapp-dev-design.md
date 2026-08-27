# weapp.dev Ecosystem Portal Design

## Goal

Build a bilingual, static-first home for the weapp.dev open-source ecosystem. The first release helps developers discover weapp-tailwindcss and weapp-vite, understand how the projects relate, and reach the existing documentation without introducing a runtime micro-frontend layer.

## Architecture

- Astro renders Chinese pages at the root and English pages under `/en/`.
- Project definitions are authored as validated content entries. Metrics are generated before each build from GitHub and npm with a committed fallback snapshot.
- The site remains static. A small Cloudflare Worker only redirects `www.weapp.dev` and delegates all other requests to Static Assets.
- Existing documentation stays at `tw.weapp.dev` and `vite.weapp.dev` for the first release. Future aggregated documentation will use `/docs/<project>/`, with weapp.dev as canonical.

## Experience

The visual system is neutral, technical, and product-led. It uses real project marks, one ecosystem accent, and restrained motion. The homepage prioritizes product discovery, project credibility, engineering principles, releases, and maintainer context. It excludes blog, account, sponsor, AI, search, and unreleased-project placeholders.

## Quality Bar

All routes must work without client JavaScript except theme and mobile navigation enhancements. Pages must provide localized metadata, canonical and alternate links, keyboard access, responsive layouts, reduced-motion behavior, and stable rendering in light and dark themes.
