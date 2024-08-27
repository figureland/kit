export const isBoolean = (n: unknown): n is boolean => typeof n === 'boolean'

export const isNotNullish = <T = any>(val?: T | null | undefined): val is T =>
  val !== null && val !== undefined

export const isNull = (n: unknown): n is null => n === null

export const isUndefined = (n: unknown): n is undefined => n === undefined

export const isString = (n: unknown): n is string => typeof n === 'string'

export const isNumber = (n: unknown): n is number => !isNaN(n as number) && typeof n === 'number'

export const isObject = (n: unknown): n is object =>
  !!n && typeof n === 'object' && !isArray(n) && !isDate(n) && !isRegExp(n)

export const isDate = (n: unknown): n is Date => n instanceof Date

export const isRegExp = (n: unknown): n is RegExp => n instanceof RegExp

export const isNullOrUndefined = (n: unknown): n is null | undefined => isNull(n) || isUndefined(n)

export const isPrimitive = (n: unknown): n is string | number | boolean | symbol | bigint =>
  n === null || (typeof n !== 'object' && typeof n !== 'function')

export const isBigInt = (n: unknown): n is bigint => typeof n === 'bigint'

export const isArray = (n: unknown): n is unknown[] => Array.isArray(n)

export const isMap = <K, V>(n: unknown): n is Map<K, V> => n instanceof Map

export const isWeakMap = <K extends object, V>(n: unknown): n is WeakMap<K, V> =>
  n instanceof WeakMap

export const isFloat32Array = (n: unknown): n is Float32Array => n instanceof Float32Array

export const isInt32Array = (n: unknown): n is Int32Array => n instanceof Int32Array

export const isUint32Array = (n: unknown): n is Uint32Array => n instanceof Uint32Array

export const isUint8Array = (n: unknown): n is Uint8Array => n instanceof Uint8Array

export const isUint8ClampedArray = (n: unknown): n is Uint8ClampedArray =>
  n instanceof Uint8ClampedArray

export const isBigInt64Array = (n: unknown): n is BigInt64Array => n instanceof BigInt64Array

export const isBigUint64Array = (n: unknown): n is BigUint64Array => n instanceof BigUint64Array

export const isSymbol = (n: unknown): n is symbol => typeof n === 'symbol'

export const isFunction = (n: unknown): n is Function => typeof n === 'function'

export const isAsyncFunction = (n: unknown): n is Function =>
  isFunction(n) && n.constructor.name === 'AsyncFunction'

export const isAsyncGenerator = <T>(value: any): value is AsyncGenerator<T> =>
  value && typeof value[Symbol.asyncIterator] === 'function'

export const isAsyncGeneratorFunction = (n: unknown): n is Function =>
  isFunction(n) && n.constructor.name === 'AsyncGeneratorFunction'

export const isSet = <T>(n: unknown): n is Set<T> => n instanceof Set

export const isValidURL = (n: unknown): n is string => {
  if (!isString(n)) return false
  try {
    new URL(n)
    return true
  } catch {
    return false
  }
}

export const isNumberLike = (n: unknown): n is number => {
  if (isNumber(n)) return true
  if (isString(n)) return !isNaN(parseFloat(n))
  return false
}

export const isHexColorString = (n: unknown): n is string => {
  if (!isString(n)) return false
  return /^#([0-9A-F]{3}){1,2}$/i.test(n)
}

export const isRGBColorString = (n: unknown): n is string => {
  if (!isString(n)) return false
  const rgbRegex = /^rgb\((\s*\d{1,3}\s*,){2}\s*\d{1,3}\s*\)$/
  const rgbaRegex = /^rgba\((\s*\d{1,3}\s*,){3}\s*(0|1|0?\.\d+)\s*\)$/
  return rgbRegex.test(n) || rgbaRegex.test(n)
}

export const isHSLColorString = (n: unknown): n is string => {
  if (!isString(n)) return false
  const hslRegex = /^hsl\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*\)$/
  const hslaRegex = /^hsla\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*,\s*(0|1|0?\.\d+)\s*\)$/
  return hslRegex.test(n) || hslaRegex.test(n)
}

export const isLabColorString = (n: unknown): n is string => {
  if (!isString(n)) return false
  const labRegex =
    /^lab\(\s*(100%?|[0-9]{1,2}%?)\s*,\s*([-+]?\d*\.?\d+)\s*,\s*([-+]?\d*\.?\d+)\s*\)$/
  return labRegex.test(n)
}

export const isLchColorString = (n: unknown): n is string => {
  if (!isString(n)) return false
  const lchRegex =
    /^lch\(\s*(100%?|[0-9]{1,2}%?)\s*,\s*(\d*\.?\d+)\s*,\s*(360|360\.0+|[0-9]{1,3}(\.\d+)?)\s*\)$/
  return lchRegex.test(n)
}
