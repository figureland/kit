import { isString } from '../tools'

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
