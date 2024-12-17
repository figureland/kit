import { isFunction } from './guards'

export const hasStructuredClone = isFunction(structuredClone)

const { stringify, parse } = JSON

export const clone = <T>(o: T): T => {
  if (hasStructuredClone) {
    return structuredClone(o)
  }

  try {
    return parse(stringify(o))
  } catch (error) {
    throw new Error(`Could not clone ${stringify(o)}`)
  }
}
