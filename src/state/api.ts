import type { Subscription, Unsubscribe } from './utils/subscriptions'

export type SubscribableHistoryEntry<V extends any> = [number, V]

export type Usable = {
  use: <S extends Disposable | (() => void)>(s: S) => S
}

export type Disposable = {
  dispose: () => void
}

export type Subscribable<V extends any = any> = Usable &
  Disposable & {
    events: Events<SubscribableEvents<V>>
    on: (sub: Subscription<V>) => Unsubscribe
  }

export type Gettable<V extends any = any> = Usable &
  Disposable &
  Subscribable<V> & {
    id: string
    get: () => V
  }

export type SubscribableEvents<V> = {
  state: V
  dispose: true
  previous: SubscribableHistoryEntry<V>
}

export type ReadonlySignal<V> = Subscribable<V> & Gettable<V>

export type Settable<V extends any = any> = {
  set: (partial: V | Partial<V> | ((state: V) => V | Partial<V>), sync?: boolean) => void
}

export type GettableType<S> = S extends Gettable<infer T> ? T : never

export type SettableType<S> = S extends Settable<infer T> ? T : never

export type SubscribableType<S> = S extends Subscribable<infer T> ? T : never

export type UseSignalDependency = <S extends Subscribable & Gettable>(u: S) => SubscribableType<S>

export type UseEffectDependency = <S extends Subscribable>(u: S) => void

export type Signal<V> = Settable<V> &
  Gettable<V> & {
    mutate: (u: (val: V) => void, sync?: boolean) => void
  }

export type SignalRecord<R extends Record<string, any>, K extends keyof R = keyof R> = Settable<R> &
  Gettable<R> & {
    key: <K extends keyof R>(key: K) => Signal<R[K]>
    keys: K[]
  }

export type SignalMachineTransitions<
  States extends string,
  Events extends string,
  D extends object
> = {
  [State in States]: {
    on?: {
      [Event in Events]?: States
    }
    enter?: (data: Signal<D>, event: Events, from: States) => void
    exit?: (data: Signal<D>, event: Events, to: States) => void
  }
}

export interface SignalState<R extends Record<string, any>, K extends keyof R = keyof R>
  extends SignalRecord<R, K> {
  reset: () => void
}

export type AnimatedSignal<V extends any> = Signal<V> & {
  tick: (delta: number) => void
}

export type System = Disposable &
  Usable & {
    unique: <S extends Disposable>(key: string | number | symbol, s: () => S) => S
  }

export type SubscribableHistory<V> = Signal<V> & {
  restore: (n?: number) => void
}

export type Effect = Disposable & Usable

export type EventsKey = string | number | symbol

export type EventsMap = Record<EventsKey, any>

export type Events<S extends EventsMap, K extends keyof S = EventsKey & keyof S> = {
  on: <Key extends K>(
    key: Key | Partial<{ [Key in K]: (eventArg: S[Key]) => void }>,
    sub?: Subscription<S[Extract<Key, K>]>
  ) => Unsubscribe
  all: (sub: Subscription<[K, S[K]]>) => Unsubscribe
  emit: <Key extends K>(key: Key, value: S[Key]) => void
  dispose: () => void
  size: () => number
}
