import type { ProjectMetrics, ProjectMetricsMap } from '../types/project'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import fallbackMetrics from '../data/project-metrics.fallback.json'

const generatedMetricsPath = fileURLToPath(new URL('../../.cache/project-metrics.json', import.meta.url))

function isFiniteNonNegative(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
}

export function isProjectMetrics(value: unknown): value is ProjectMetrics {
  if (!value || typeof value !== 'object') {
    return false
  }
  const metrics = value as Record<string, unknown>
  return typeof metrics.version === 'string'
    && metrics.version.length > 0
    && typeof metrics.releasedAt === 'string'
    && !Number.isNaN(Date.parse(metrics.releasedAt))
    && isFiniteNonNegative(metrics.stars)
    && isFiniteNonNegative(metrics.weeklyDownloads)
    && typeof metrics.fetchedAt === 'string'
    && !Number.isNaN(Date.parse(metrics.fetchedAt))
}

export function parseMetricsMap(value: unknown): ProjectMetricsMap | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null
  }
  const entries = Object.entries(value)
  if (entries.length === 0 || entries.some(([, metrics]) => !isProjectMetrics(metrics))) {
    return null
  }
  return Object.fromEntries(entries) as ProjectMetricsMap
}

export async function loadProjectMetrics(): Promise<ProjectMetricsMap> {
  try {
    const generated = parseMetricsMap(JSON.parse(await readFile(generatedMetricsPath, 'utf8')))
    if (generated) {
      return generated
    }
  }
  catch {
    // A missing or invalid build cache must never block a static build.
  }

  return fallbackMetrics satisfies ProjectMetricsMap
}

export function formatCompactNumber(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: value >= 1000 ? 1 : 0,
  }).format(value)
}

export function formatReleaseDate(value: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value))
}
