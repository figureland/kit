import type { Equals, Merge } from '../tools'
import type { Subscription, Unsubscribe } from './subscriptions'

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
    get: () => V
  }

export type SubscribableEvents<V> = {
  state: V
  dispose: void
  previous: SubscribableHistoryEntry<V>
}

export type ReadonlyState<V> = Subscribable<V> & Gettable<V>

export type Settable<V extends any = any> = {
  set: (partial: V | Partial<V> | ((state: V) => V | Partial<V>), sync?: boolean) => void
}

export type GettableType<S> = S extends Gettable<infer T> ? T : never

export type SettableType<S> = S extends Settable<infer T> ? T : never

export type SubscribableType<S> = S extends Subscribable<infer T> ? T : never

export type UseStateDependency = <S extends Subscribable & Gettable>(u: S) => SubscribableType<S>

export type UseEffectDependency = <S extends Subscribable>(u: S) => void

export type State<V> = Settable<V> &
  Gettable<V> & {
    mutate: (u: (val: V) => void, sync?: boolean) => void
  }

export type StateOptions<R> = {
  equality?: Equals<R>
  merge?: Merge
  throttle?: number
}

export type Struct<R extends Record<string, any>, K extends keyof R = keyof R> = Settable<R> &
  Gettable<R> & {
    key: <K extends keyof R>(key: K) => State<R[K]>
    keys: K[]
  }

export type AnimatedState<V extends any> = State<V> & {
  tick: (delta: number) => void
}

export type Manager = Disposable &
  Usable & {
    unique: <S extends Disposable>(key: string | number | symbol, s: () => S) => S
  }

export type SubscribableHistoryEntry<V extends any> = [number, V]

export type SubscribableHistory<V> = State<V> & {
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

export type Wrap<Input, Instance, Output> = {
  (v: Input): State<Output> & {
    set: (v: Input) => void
    derive: <DerivedResult>(fn: (v: Instance) => DerivedResult) => State<DerivedResult>
    instance: () => Instance
  }
}

export type Wrapped<Input, Instance, Output> = ReturnType<Wrap<Input, Instance, Output>>
