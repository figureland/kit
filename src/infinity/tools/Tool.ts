import type { Vector2 } from '../../math'
import type { Disposable } from '../../state'
import type { PointerState } from '../../browser/pointer'
import type { InfinityKit } from '../InfinityKit'
import type { QueryAPI } from '../query/QueryAPI'

export type InfinityKitTool<IK extends InfinityKit = InfinityKit<QueryAPI, any>> = Disposable & {
  meta: {
    title: string
    command?: string
    icon?: string
    hidden?: boolean
  }
  onClick?(c: IK, p: PointerState): Promise<void>
  onDoubleClick?(c: IK, p: PointerState): Promise<void>
  onSelect?(c: IK): Promise<void>
  onDeselect?(c: IK): Promise<void>
  onPointerDown?(c: IK, p: PointerState): Promise<void>
  onPointerMove?(c: IK, p: PointerState): Promise<void>
  onPointerUp?(c: IK, p: PointerState): Promise<void>
  onWheel?(c: IK, point: Vector2, delta: Vector2): Promise<void>
  onScroll?(c: IK, point: Vector2, delta: Vector2): Promise<void>
}

export type InfinityKitToolset = {
  [key: string]: InfinityKitTool
}
