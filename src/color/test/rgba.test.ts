import { describe, it, expect } from 'bun:test'
import { rgba } from '../rgba'
import { isRGBColorString } from '../guards'
import { vector4 } from '../../math/vector4'

describe('rgb', () => {
  it('creates rgba state', () => {
    const c = rgba(0, 0.5, 1)
    const output = c.serialize()

    expect(output).toBe('rgb(0, 128, 255)')
    expect(isRGBColorString(output)).toBe(true)
  })

  it('creates rgb state from 0-255 values', () => {
    const c = rgba(255, 255, 255)
    const output = c.serialize()

    expect(c.value).toEqual(vector4(1, 1, 1, 1))
    expect(output).toBe('rgb(255, 255, 255)')
    expect(isRGBColorString(output)).toBe(true)
  })

  it('creates rgb state with alpha', () => {
    const c = rgba(0, 0.5, 1, 0.5)
    const output = c.serialize()

    expect(output).toBe('rgba(0, 128, 255, 0.5)')
    expect(isRGBColorString(output)).toBe(true)
  })

  it('creates rgba state from 0-255 values', () => {
    const c = rgba(255, 255, 255, 1)

    expect(c.value).toEqual(vector4(1, 1, 1, 1))
    expect(c.serialize()).toBe('rgb(255, 255, 255)')
    expect(isRGBColorString(c.serialize())).toBe(true)

    c.set(1, 1, 1, 0.5)
    expect(c.value).toEqual(vector4(1, 1, 1, 0.5))
    expect(c.serialize()).toBe('rgba(255, 255, 255, 0.5)')
    expect(isRGBColorString(c.serialize())).toBe(true)
  })
})
