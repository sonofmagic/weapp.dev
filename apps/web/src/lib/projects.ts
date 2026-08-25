import type { CollectionEntry } from 'astro:content'
import { getCollection } from 'astro:content'

export type ProjectEntry = CollectionEntry<'projects'>

export async function getProjects(): Promise<ProjectEntry[]> {
  return (await getCollection('projects')).sort((left, right) => left.data.order - right.data.order)
}

export async function getProject(slug: string): Promise<ProjectEntry | undefined> {
  return (await getProjects()).find(project => project.id === slug)
}
