import { z } from 'astro/zod'

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

export const projectVisualSchema = z.object({
  src: z.string().startsWith('/'),
  avif: z.string().startsWith('/'),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  variants: z.array(z.object({
    src: z.string().startsWith('/'),
    avif: z.string().startsWith('/'),
    width: z.number().int().positive(),
  })).min(1).optional(),
  locales: z.object({
    'zh-CN': z.object({ alt: z.string().min(1), caption: z.string().min(1) }),
    'en': z.object({ alt: z.string().min(1), caption: z.string().min(1) }),
  }),
})

export const projectDefinitionSchema = z.object({
  order: z.number().int().positive(),
  status: z.enum(['stable', 'beta', 'planned']),
  packageName: z.string().min(1),
  github: z.string().regex(/^[\w.-]+\/[\w.-]+$/),
  docsUrl: z.url(),
  npmUrl: z.url(),
  license: z.url().optional(),
  maintainer: z.string().min(1),
  keywords: z.array(z.string().min(1)).min(1),
  installCommand: z.string().min(1),
  futureDocsPath: z.string().startsWith('/docs/').endsWith('/'),
  logo: z.string().startsWith('/'),
  accent: z.string().regex(/^#[0-9a-f]{6}$/i),
  platforms: z.array(z.string().min(1)).min(1),
  visuals: z.object({
    primary: projectVisualSchema,
    secondary: projectVisualSchema,
  }).strict().optional(),
  role: z.string().min(1).optional(),
  maturity: z.enum(['stable', 'beta', 'planned']).optional(),
  runtime: z.array(z.string().min(1)).optional(),
  relatedProjects: z.array(z.string().min(1)).optional(),
  dataCompleteness: z.enum(['complete', 'partial', 'planned']).optional(),
  locales: z.object({
    'zh-CN': localizedContent,
    'en': localizedContent,
  }),
})

export const showcaseSchema = z.object({ images: z.array(projectVisualSchema).min(1) }).strict()
