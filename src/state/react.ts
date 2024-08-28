import { useSyncExternalStore } from 'react'
import type { Gettable, GettableType } from '../state'

export const useSubscribable = <S extends Gettable<any>>(s: S) =>
  useSyncExternalStore<GettableType<S>>(s.on, s.get)
