import type { Disposable, Signal } from '../../state'
import type { Box } from '../../math/box'
import type { Vector2 } from '../../math/vector2'

export type QueryIdentifier = string | number | symbol

export type ID = string

export type QueryResult = {
  box: ID[]
  point: ID[]
}

export const createQueryResult = () => ({
  box: [],
  point: []
})

export type Query<Item = any> = {
  queryID: QueryIdentifier
  params: QueryParams<Item>
  result: QueryResult
  resolve: ((result: QueryResult) => void) | null
}

export type QueryParams<Item> = {
  point?: Vector2
  box?: Box
  filter?: ([id, item]: [ID, Item]) => boolean
  ids?: ID[]
}

export type QueryAPI<Item extends any = any> = Disposable & {
  readonly processing: Signal<boolean>
  ids: Signal<ID[]>
  add: (id: ID, item: Item) => void
  update: (id: ID, item: Item) => void
  delete: (id: ID) => void
  get: (id: ID) => Item | undefined
  search: (queryID: QueryIdentifier, params: QueryParams<Item>) => Promise<QueryResult>
  subscribe: (id: ID) => Signal<Item | undefined>
  signalQuery: <Q extends QueryParams<Item>>(
    id: QueryIdentifier,
    params: Signal<Q>
  ) => Signal<QueryResult>
  boundingBox: (ids: ID[]) => Box
}

export type InferQueryItem<T> = T extends QueryAPI<infer Item> ? Item : never
