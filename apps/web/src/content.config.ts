import { glob } from 'astro/loaders'
import { defineCollection } from 'astro:content'
import { projectDefinitionSchema, showcaseSchema } from './content/schemas'

const projects = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/projects' }),
  schema: projectDefinitionSchema,
})

const showcases = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/showcases' }),
  schema: showcaseSchema,
})

export const collections = { projects, showcases }
