import { describe, it, expect } from 'bun:test'
import {
  isHexColorString,
  isRGBColorString,
  isHSLColorString,
  isLabColorString,
  isLchColorString
} from '../guards'

describe('Color String Checkers', () => {
  it('isHexColorString validates hex color strings', () => {
    expect(isHexColorString('#ff0000')).toBe(true)
    expect(isHexColorString('#00ff00')).toBe(true)
    expect(isHexColorString('#0000ff')).toBe(true)
    expect(isHexColorString('#000')).toBe(true)
    expect(isHexColorString('ff0000')).toBe(false)
  })

  it('isRGBColorString validates RGB and RGBA color strings', () => {
    expect(isRGBColorString('rgb(255, 0, 0)')).toBe(true)
    expect(isRGBColorString('rgba(0, 255, 0, 0.5)')).toBe(true)
    expect(isRGBColorString('rgba(0, 0, 255)')).toBe(false)
    expect(isRGBColorString('rgb(0, 0, 255')).toBe(false)
    expect(isRGBColorString('rgb(0, 0, 255, 0.5)')).toBe(false)
  })

  it('isHSLColorString validates HSL and HSLA color strings', () => {
    expect(isHSLColorString('hsl(0, 100%, 50%)')).toBe(true)
    expect(isHSLColorString('hsla(120, 100%, 50%, 0.5)')).toBe(true)
    expect(isHSLColorString('hsla(0, 0%, 0%)')).toBe(false)
    expect(isHSLColorString('hsl(0, 100%, 50%')).toBe(false)
    expect(isHSLColorString('hsl(0, 100%, 50%, 0.5)')).toBe(false)
  })

  it('isLabColorString validates LAB color strings', () => {
    expect(isLabColorString('lab(0, 0, 0)')).toBe(true)
    expect(isLabColorString('lab(100, 50, 75)')).toBe(true)
    expect(isLabColorString('lch(100, 50, 75)')).toBe(false)
    expect(isLabColorString('lab(100, 50, 75, 0.5)')).toBe(false)
    expect(isLabColorString('lab(100, 50)')).toBe(false)
  })

  it('isLCHColorString validates LCH color strings', () => {
    expect(isLchColorString('lch(0, 0, 0)')).toBe(true)
    expect(isLchColorString('lch(100, 50, 75)')).toBe(true)
    expect(isLchColorString('lab(100, 50, 75)')).toBe(false)
    expect(isLchColorString('lch(100, 50, 75, 0.5)')).toBe(false)
    expect(isLchColorString('lch(100, 50)')).toBe(false)
  })
})
