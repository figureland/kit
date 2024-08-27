export { isChrome, isSafari, isMobile, isApple, isTouchscreen } from './device'
export {
  isBoolean,
  isNotNullish,
  isString,
  isNumber,
  isObject,
  isArray,
  isMap,
  isFunction,
  isSet,
  isValidURL,
  isNumberLike,
  isSymbol,
  isAsyncFunction,
  isWeakMap,
  isUint8Array,
  isUint8ClampedArray,
  isUint32Array,
  isInt32Array,
  isFloat32Array,
  isBigInt64Array,
  isBigUint64Array,
  isRegExp,
  isDate,
  isBigInt,
  isNullOrUndefined,
  isPrimitive,
  isNull,
  isUndefined,
  isHexColorString,
  isRGBColorString,
  isHSLColorString
} from './guards'
export {
  type DistributiveOmit,
  type Modify,
  type WithRequired,
  entries,
  keys,
  values,
  assignSame,
  is,
  has
} from './object'
export { sortMapToArray, NiceMap } from './map'
export { getTimeSince } from './time'
export { type Merge, simpleMerge } from './merge'
export { isFulfilled, isRejected, settle, parseSettled } from './async'
export { shallowEquals, simpleEquals, type Equals, arraysEquals } from './equals'
