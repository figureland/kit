import { describe, it, expect } from 'bun:test'
import { isFulfilled, parseSettled, settle } from '..'

describe('async utilities', () => {
  describe('isFulfilled', () => {
    it('returns true for a fulfilled promise result', () => {
      const result: PromiseSettledResult<number> = { status: 'fulfilled', value: 42 }
      expect(isFulfilled(result)).toBe(true)
    })

    it('returns false for a rejected promise result', () => {
      const result: PromiseSettledResult<number> = { status: 'rejected', reason: 'Error' }
      expect(isFulfilled(result)).toBe(false)
    })
  })

  describe('pickFulfilled', () => {
    it('correctly separates fulfilled and rejected promises', () => {
      const results: PromiseSettledResult<number>[] = [
        { status: 'fulfilled', value: 42 },
        { status: 'rejected', reason: 'Error' },
        { status: 'fulfilled', value: 100 }
      ]
      const picked = parseSettled(results)
      expect(picked.fulfilled).toEqual([42, 100])
      expect(picked.rejected.length).toBe(1)
      expect(picked.rejected[0].status).toBe('rejected')
    })
  })

  describe('settle', () => {
    it('returns only fulfilled promises from a list of promises', async () => {
      const promises = [Promise.resolve(10), Promise.reject(new Error('Fail')), Promise.resolve(20)]
      const result = await settle(promises)
      expect(result.fulfilled).toEqual([10, 20])
      expect(result.rejected.length).toBe(1)
    })
  })
})
