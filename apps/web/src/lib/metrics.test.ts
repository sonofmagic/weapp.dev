import { describe, expect, it } from 'vitest'
import { formatCompactNumber, isProjectMetrics, parseMetricsMap } from './metrics'

const validMetrics = {
  version: '1.2.3',
  releasedAt: '2026-08-25T00:00:00.000Z',
  stars: 321,
  weeklyDownloads: 4567,
  fetchedAt: '2026-08-26T00:00:00.000Z',
}

describe('project metrics', () => {
  it('accepts a complete metric record', () => {
    expect(isProjectMetrics(validMetrics)).toBe(true)
    expect(parseMetricsMap({ project: validMetrics })).toEqual({ project: validMetrics })
  })

  it('rejects missing, negative, or invalid values', () => {
    expect(isProjectMetrics({ ...validMetrics, stars: -1 })).toBe(false)
    expect(isProjectMetrics({ ...validMetrics, releasedAt: 'not-a-date' })).toBe(false)
    expect(parseMetricsMap({})).toBeNull()
  })

  it('formats public metrics compactly', () => {
    expect(formatCompactNumber(11561, 'en')).toBe('11.6K')
  })
})
