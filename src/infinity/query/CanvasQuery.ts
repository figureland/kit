import { calculateBoundingBox, intersects, isBox, type Box } from '../../math/box'
import { type State, state, events, manager } from '../../state'
import { isAsyncGeneratorFunction, isNotNullish } from '../../tools/guards'
import { entries } from '../../tools/object'
import { arraysEquals } from '../../tools/equals'
import {
  type QueryParams,
  type Query,
  type QueryAPI,
  type QueryIdentifier,
  type QueryResult,
  type ID,
  createQueryResult
} from './QueryAPI'

export class CanvasQuery<Item extends any = any> implements QueryAPI<Item> {
  private readonly manager = manager()
  private readonly entities = new Map<ID, Item>()
  private readonly queryQueue = new Map<QueryIdentifier, Query<Item>>()
  public readonly queue = this.manager.use(events<Record<QueryIdentifier, QueryResult>>())
  private readonly data = this.manager.use(events<Record<ID, Item | undefined>>())
  public readonly processing = this.manager.use(state(false))
  public readonly ids = this.manager.use(
    state<ID[]>([], {
      equality: arraysEquals
    })
  )

  constructor() {
    this.manager.use(() => {
      this.processing.set(false)
      this.entities.clear()
      this.queryQueue.clear()
    })
    this.data.all(() => {
      this.ids.set(Array.from(this.entities.keys()))
    })
  }

  public add = (id: ID, item: Item): void => {
    this.entities.set(id, item)
    this.data.emit(id, item)
  }

  public update = (id: ID, item: Item): void => {
    this.entities.set(id, item)
    this.data.emit(id, item)
  }

  public delete = (id: ID): void => {
    const previous = this.get(id)
    if (previous) {
      this.entities.delete(id)
      this.data.emit(id, undefined)
    }
  }

  public get = (id: ID): Item | undefined => this.entities.get(id)

  public subscribe = (id: ID) =>
    this.manager.unique(id, () => {
      const s = state(() => this.get(id))
      this.data.on(id, s.set)
      return s
    })

  public on = this.queue.on

  public intersect = (
    queryID: QueryIdentifier,
    params: QueryParams<Item> = {}
  ): Promise<QueryResult> =>
    new Promise((resolve) => {
      const existingQuery = this.queryQueue.get(queryID)

      if (existingQuery) {
        existingQuery.resolve = resolve
        existingQuery.params = params
        existingQuery.result = createQueryResult()
      } else {
        this.queryQueue.set(queryID, {
          queryID,
          params,
          result: createQueryResult(),
          resolve
        })
      }

      if (!this.processing.get()) {
        this.processQueries()
      }
    })

  private processQueries = async (): Promise<void> => {
    this.processing.set(true)

    while (this.queryQueue.size > 0) {
      const queries = Array.from(this.queryQueue.values())
      this.queryQueue.clear()

      for (const [id, entity] of this.entities.entries()) {
        for (const query of queries) {
          if (!isBox(entity)) {
            continue
          }
          const matchesID = query.params.ids ? query.params.ids.includes(id) : true
          const matchesFilter = query.params.filter ? query.params.filter([id, entity]) : true

          if (!(matchesID && matchesFilter)) {
            continue
          }
          const withinBox = query.params.box ? intersects(entity, query.params.box) : false
          const withinPoint = query.params.point ? intersects(entity, query.params.point) : false

          if (withinBox) {
            query.result.box.push(id)
          }
          if (withinPoint) {
            query.result.point.push(id)
          }
        }
      }

      for (const query of queries) {
        if (query.resolve) {
          query.resolve(query.result)
          query.resolve = null
        }
        this.queue.emit(query.queryID, query.result)
      }
    }

    this.processing.set(false)
  }

  public stateQuery = <Q extends QueryParams<Item>>(
    id: QueryIdentifier,
    box: State<Q>,
    throttle: number = 90
  ): State<QueryResult> =>
    this.manager.unique(id, () => {
      const visible = this.manager.use(
        state<QueryResult>(createQueryResult, {
          equality: (a, b) => arraysEquals(a.box, b.box) && arraysEquals(a.point, b.point)
        })
      )

      const onChange = async (params: Q) => {
        const visibleItems = await this.intersect(id, params)
        visible.set(visibleItems)
      }

      state(
        (get) => {
          get(box)
          get(this.ids)
          onChange(get(box))
        },
        {
          throttle
        }
      )

      return visible
    })

  public boundingBox = (locations: ID[]): Box => {
    const boxLikeEntities = locations.map(this.get).filter(isNotNullish).filter(isBox)
    return calculateBoundingBox(boxLikeEntities as Box[])
  }

  public dispose = (): void => this.manager.dispose()
}

export const initializeCanvasQuery = async <Item = any, ID extends string = string>(
  items?: Record<ID, Item> | (() => AsyncGenerator<[ID, Item]>)
): Promise<CanvasQuery<Item>> => {
  const query = new CanvasQuery<Item>()

  if (items) {
    if (isAsyncGeneratorFunction(items)) {
      for await (const [id, item] of items()) {
        query.add(id, item)
      }
    } else {
      for (const [id, item] of entries(items)) {
        query.add(id, item)
      }
    }
  }

  return query
}
