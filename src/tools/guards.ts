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
  n === null || (!isObject(n) && !isFunction(n))

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
