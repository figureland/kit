import { useSyncExternalStore } from 'react'
import type { Gettable, GettableType } from '..'

export const react = <S extends Gettable<any>>(s: S) =>
  useSyncExternalStore<GettableType<S>>(s.on, s.get)
