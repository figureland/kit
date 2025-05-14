import { wrap } from './wrap'

export const map = <K, V>(initial: Iterable<readonly [K, V]> = []) =>
  wrap((entries: Iterable<readonly [K, V]>) => new Map(entries))(initial)
