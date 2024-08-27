import { describe, it, expect } from 'bun:test'
import { example, other } from '../src'

describe('should', () => {
  it('export', () => {
    expect(example()).toBe('hello')
    expect(other()).toBe('wrong')
  })
})
