import { wrap } from './wrap'

export const set = <T>(initial: Iterable<T> = []) =>
  wrap((values: Iterable<T>) => new Set(values))(initial)
