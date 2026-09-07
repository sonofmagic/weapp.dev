import { describe, expect, it } from 'vitest'
import { siteCopy } from './ui'

describe('sponsorship allocation copy', () => {
  it('keeps Chinese and English buckets at 60/25/15', () => {
    for (const locale of ['zh-CN', 'en'] as const) {
      const buckets = siteCopy[locale].pricing.sponsorAllocationBuckets
      const shares = buckets.map(bucket => Number.parseInt(bucket.share, 10))
      expect(shares).toEqual([60, 25, 15])
      expect(shares.reduce((sum, share) => sum + share, 0)).toBe(100)
      expect(siteCopy[locale].contributors.buckets.map(bucket => bucket.share)).toEqual(['60%', '25%', '15%'])
    }
  })
})
