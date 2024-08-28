import type { Disposable, State } from '../../state'
import type { Vector2, Box } from '../../math'

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
  readonly processing: State<boolean>
  ids: State<ID[]>
  add: (id: ID, item: Item) => void
  update: (id: ID, item: Item) => void
  delete: (id: ID) => void
  get: (id: ID) => Item | undefined
  search: (queryID: QueryIdentifier, params: QueryParams<Item>) => Promise<QueryResult>
  subscribe: (id: ID) => State<Item | undefined>
  stateQuery: <Q extends QueryParams<Item>>(
    id: QueryIdentifier,
    params: State<Q>
  ) => State<QueryResult>
  boundingBox: (ids: ID[]) => Box
}

export type InferQueryItem<T> = T extends QueryAPI<infer Item> ? Item : never
