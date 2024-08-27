import { describe, it, expect } from 'bun:test'
import {
  isBoolean,
  isNotNullish,
  isString,
  isNumber,
  isObject,
  isSymbol,
  isFunction,
  isArray,
  isMap,
  isWeakMap,
  isFloat32Array,
  isInt32Array,
  isUint32Array,
  isUint8Array,
  isUint8ClampedArray,
  isBigInt64Array,
  isBigUint64Array,
  isAsyncFunction,
  isSet,
  isValidURL,
  isNumberLike,
  isHexColorString,
  isRGBColorString,
  isHSLColorString,
  isLabColorString,
  isLchColorString,
  isAsyncGenerator,
  isAsyncGeneratorFunction
} from '../guards'

describe('Primitive Type Checkers', () => {
  it('isBoolean identifies booleans and only booleans', () => {
    expect(isBoolean(true)).toBe(true)
    expect(isBoolean(false)).toBe(true)
    expect(isBoolean(0)).toBe(false)
    expect(isBoolean('false')).toBe(false)
  })

  it('isNotNullish ensures value is not null or undefined', () => {
    expect(isNotNullish(0)).toBe(true)
    expect(isNotNullish(null)).toBe(false)
    expect(isNotNullish(undefined)).toBe(false)
    expect(isNotNullish('')).toBe(true)
  })

  it('isString checks for strings correctly', () => {
    expect(isString('test')).toBe(true)
    expect(isString(123)).toBe(false)
    expect(isString({})).toBe(false)
  })

  it('isNumber verifies numbers, excluding NaN', () => {
    expect(isNumber(42)).toBe(true)
    expect(isNumber(NaN)).toBe(false)
    expect(isNumber('42')).toBe(false)
  })

  it('isObject identifies objects, excluding null', () => {
    expect(isObject({})).toBe(true)
    expect(isObject(null)).toBe(false)
    expect(isObject([1, 2, 3])).toBe(false)
  })

  it('isSymbol detects symbols', () => {
    expect(isSymbol(Symbol('test'))).toBe(true)
    expect(isSymbol('test')).toBe(false)
  })

  it('isFunction detects functions', () => {
    expect(isFunction(() => {})).toBe(true)
    expect(isFunction(class A {})).toBe(true)
    expect(isFunction(123)).toBe(false)
  })
})

describe('Complex Data Structures', () => {
  it('isArray detects arrays', () => {
    expect(isArray([1, 2, 3])).toBe(true)
    expect(isArray({})).toBe(false)
  })

  it('isMap checks for Map instances', () => {
    expect(isMap(new Map())).toBe(true)
    expect(isMap(new WeakMap())).toBe(false)
  })

  it('isWeakMap checks for WeakMap instances', () => {
    expect(isWeakMap(new WeakMap())).toBe(true)
    expect(isWeakMap(new Map())).toBe(false)
  })

  it('Typed arrays are correctly identified', () => {
    expect(isFloat32Array(new Float32Array())).toBe(true)
    expect(isInt32Array(new Int32Array())).toBe(true)
    expect(isUint32Array(new Uint32Array())).toBe(true)
    expect(isUint8Array(new Uint8Array())).toBe(true)
    expect(isUint8ClampedArray(new Uint8ClampedArray())).toBe(true)
    expect(isBigInt64Array(new BigInt64Array())).toBe(true)
    expect(isBigUint64Array(new BigUint64Array())).toBe(true)
    expect(isFloat32Array(new Int32Array())).toBe(false)
  })
})

describe('Specialized Type and Functionality Checkers', () => {
  it('isAsyncFunction detects only async functions', () => {
    async function testAsync() {}
    function testSync() {}
    expect(isAsyncFunction(testAsync)).toBe(true)
    expect(isAsyncFunction(testSync)).toBe(false)
    expect(isAsyncFunction(() => {})).toBe(false)
  })

  it('isAsyncGenerator detects async generators', () => {
    async function testAsync() {}
    function testSync() {}

    async function* testAsyncGenerator() {
      yield 1
      yield 2
      yield 3
    }
    function* testSyncGenerator() {
      yield 1
      yield 2
      yield 3
    }
    expect(isAsyncGenerator(testSync)).toBe(false)
    expect(isAsyncGenerator(testAsync)).toBe(false)
    expect(isAsyncGenerator(testAsyncGenerator())).toBe(true)
    expect(isAsyncGenerator(testSyncGenerator())).toBe(false)
    expect(isAsyncGenerator([1, 2, 3])).toBe(false)
  })

  it('isAsyncGeneratorFunction detects async generator functions', () => {
    async function testAsync() {}
    function testSync() {}
    async function* testAsyncGenerator() {
      yield 1
      yield 2
      yield 3
    }

    function* testSyncGenerator() {
      yield 1
      yield 2
      yield 3
    }

    expect(isAsyncGenerator(testSync)).toBe(false)
    expect(isAsyncGenerator(testAsync)).toBe(false)
    expect(isAsyncGeneratorFunction(testAsyncGenerator)).toBe(true)
    expect(isAsyncGeneratorFunction(testSyncGenerator)).toBe(false)
    expect(isAsyncGeneratorFunction([1, 2, 3])).toBe(false)
  })

  it('isSet checks for Set instances', () => {
    expect(isSet(new Set())).toBe(true)
    expect(isSet(new Map())).toBe(false)
  })

  it('isValidURL validates strings as URLs', () => {
    expect(isValidURL('https://www.example.com')).toBe(true)
    expect(isValidURL('www.example.com')).toBe(false)
    expect(isValidURL('justastring')).toBe(false)
    expect(isValidURL(123)).toBe(false)
  })

  it('isNumberLike checks if value can represent a number', () => {
    expect(isNumberLike(123)).toBe(true)
    expect(isNumberLike('123')).toBe(true)
    expect(isNumberLike('123.45')).toBe(true)
    expect(isNumberLike('abc')).toBe(false)
    expect(isNumberLike(NaN)).toBe(false)
  })
})

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
