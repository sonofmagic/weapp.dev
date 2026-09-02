import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { defineCollection } from 'astro:content'

const localizedContent = z.object({
  name: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  audience: z.string().min(1),
  useCases: z.array(z.string().min(1)).min(1),
  capabilities: z.array(z.string().min(1)).min(1),
  faqs: z.array(z.object({
    question: z.string().min(1),
    answer: z.string().min(1),
  })).min(1),
})

const projectVisual = z.object({
  src: z.string().startsWith('/'),
  avif: z.string().startsWith('/'),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  locales: z.object({
    'zh-CN': z.object({ alt: z.string().min(1), caption: z.string().min(1) }),
    'en': z.object({ alt: z.string().min(1), caption: z.string().min(1) }),
  }),
})

const projects = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/projects' }),
  schema: z.object({
    order: z.number().int().positive(),
    status: z.enum(['stable', 'beta', 'planned']),
    packageName: z.string().min(1),
    github: z.string().regex(/^[\w.-]+\/[\w.-]+$/),
    docsUrl: z.url(),
    npmUrl: z.url().optional(),
    license: z.url().optional(),
    maintainer: z.string().min(1),
    keywords: z.array(z.string().min(1)).min(1),
    installCommand: z.string().min(1),
    futureDocsPath: z.string().startsWith('/docs/').endsWith('/'),
    logo: z.string().startsWith('/'),
    accent: z.string().regex(/^#[0-9a-f]{6}$/i),
    platforms: z.array(z.string().min(1)).min(1),
    visuals: z.object({
      primary: projectVisual,
      secondary: projectVisual,
    }),
    locales: z.object({
      'zh-CN': localizedContent,
      'en': localizedContent,
    }),
  }),
})

export const collections = { projects }
