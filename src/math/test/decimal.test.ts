import { describe, it, expect } from 'bun:test'
import { decimal } from '../decimal'

describe('decimal', () => {
  it('creates decimal state', () => {
    const d = decimal('1.23')
    expect(d.get()).toBe('1.23')
  })

  it('performs basic arithmetic operations', () => {
    const d = decimal('10')

    expect(d.plus('5')).toBe('15')
    expect(d.minus('3')).toBe('7')
    expect(d.times('2')).toBe('20')
    expect(d.div('4')).toBe('2.5')
  })

  it('handles advanced operations', () => {
    const d = decimal('16')

    expect(d.abs()).toBe('16')
    expect(d.pow(2)).toBe('256')
    expect(d.round(2)).toBe('16')
    expect(d.sqrt()).toBe('4')
  })

  it('performs comparisons', () => {
    const d = decimal('10')

    expect(d.eq('10')).toBe(true)
    expect(d.gt('5')).toBe(true)
    expect(d.lt('15')).toBe(true)
    expect(d.gte('10')).toBe(true)
    expect(d.lte('10')).toBe(true)
  })

  it('converts to number and string', () => {
    const d = decimal('3.14159')
    expect(d.toNumber()).toBe(3.14159)
    expect(d.toString()).toBe('3.14159')
  })

  it('handles precision and rounding', () => {
    const d = decimal('1.23456789')
    expect(d.round(4)).toBe('1.2346')
    expect(d.round(2, 1)).toBe('1.23')
    expect(d.round(2, 2)).toBe('1.23')
    expect(d.round(2, 3)).toBe('1.24')
  })

  it('performs exponential operations', () => {
    const d = decimal('1e+3')
    expect(d.get()).toBe('1000')
    expect(d.times('1e-2')).toBe('10')
  })

  it('handles negative numbers', () => {
    const d = decimal('-5')
    expect(d.abs()).toBe('5')
    expect(d.neg()).toBe('5')
    expect(d.plus('10')).toBe('5')
  })

  it('performs modulo operation', () => {
    const d = decimal('10')
    expect(d.mod('3')).toBe('1')
  })

  it('handles very large and small numbers', () => {
    const large = decimal('1.23e+20')
    const small = decimal('1.23e-20')
    expect(large.times(small.get())).toBe('1.5129')
  })

  it('maintains precision in calculations', () => {
    const d = decimal('0.1')
    expect(d.plus('0.2')).toBe('0.3')
    expect(d.times('0.2')).toBe('0.02')
  })
})
