import { isFunction } from '../type/guards'

const { stringify, parse } = JSON

export const clone = <T>(o: T): T => {
  if (isFunction(structuredClone)) {
    return structuredClone(o)
  }

  try {
    return parse(stringify(o))
  } catch (error) {
    throw new Error(`Could not clone ${stringify(o)}`)
  }
}
