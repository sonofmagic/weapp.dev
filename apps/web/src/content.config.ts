import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { defineCollection } from 'astro:content'

const localizedContent = z.object({
  name: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  capabilities: z.array(z.string().min(1)).min(1),
})

const projects = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/projects' }),
  schema: z.object({
    order: z.number().int().positive(),
    status: z.enum(['stable', 'beta', 'planned']),
    packageName: z.string().min(1),
    github: z.string().regex(/^[\w.-]+\/[\w.-]+$/),
    docsUrl: z.url(),
    futureDocsPath: z.string().startsWith('/docs/').endsWith('/'),
    logo: z.string().startsWith('/'),
    accent: z.string().regex(/^#[0-9a-f]{6}$/i),
    platforms: z.array(z.string().min(1)).min(1),
    locales: z.object({
      'zh-CN': localizedContent,
      'en': localizedContent,
    }),
  }),
})

export const collections = { projects }
