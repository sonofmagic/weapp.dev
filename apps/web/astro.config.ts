import { fileURLToPath } from 'node:url'
import sitemap from '@astrojs/sitemap'
import { defineConfig } from 'astro/config'
import { WeappTailwindcss } from 'weapp-tailwindcss/vite'

const cssEntry = fileURLToPath(new URL('./src/styles/global.css', import.meta.url))

export default defineConfig({
  site: 'https://weapp.dev',
  output: 'static',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'zh-CN',
    locales: ['zh-CN', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      filter: page => !page.includes('/404'),
      i18n: {
        defaultLocale: 'zh-CN',
        locales: {
          'zh-CN': 'zh-CN',
          'en': 'en-US',
        },
      },
    }),
  ],
  vite: {
    plugins: [
      ...(WeappTailwindcss({
        generator: {
          target: 'web',
        },
        cssEntries: [cssEntry],
      }) ?? []),
    ],
  },
})
