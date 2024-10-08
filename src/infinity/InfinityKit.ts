import { values } from '../tools/object'
import type { PointerState } from '../dom/pointer'
import { type State, state, system } from '../state'
import { box, type Box } from '../math/box'
import type { Vector2 } from '../math/vector2'
import { timerLoop, timer } from '../dom/timer'

import { type Canvas } from './Canvas'
import type { QueryAPI, QueryResult } from './query/QueryAPI'
import { getCanvasStyle, getSVGBackgroundPattern, type SVGBackgroundPattern } from './utils/style'
import type { InfinityKitToolset } from './tools/Tool'

const boxSize = (box: Box): number => box.width * box.height

export type InfinityKitActionType = {
  type: string
  state: any
}

export type InfinityKitActions =
  | {
      type: 'idle'
      state: null
    }
  | {
      type: 'select'
      state: Box
    }
  | {
      type: 'pan'
      state: Vector2
    }
  | {
      type: 'draw'
      state: [Box, Vector2[]]
    }
  | {
      type: 'move'
      state: Vector2
    }
  | {
      type: 'resize'
      state: Box
    }

const TAP_THRESHOLD = 300

export type InfinityKitStyles = {
  container: string
  backgroundPattern: SVGBackgroundPattern
}

export type InfinityKitState<ID extends string = string> = {
  selecting: boolean
  focus: boolean
  hover?: ID
  selection: ID[]
  selectionBounds: Box
  brush: Box
}

export class InfinityKit<
  API extends QueryAPI = QueryAPI,
  Tools extends InfinityKitToolset = InfinityKitToolset
> {
  public system = system()
  public state: State<InfinityKitState>
  public visible: State<QueryResult>
  public styles: State<InfinityKitStyles>
  public tools: State<Tools>
  public tool: State<keyof Tools>

  private timer = this.system.use(timerLoop(timer()))

  constructor(
    public canvas: Canvas,
    public api: API,
    {
      tools,
      initialTool
    }: {
      tools: Tools
      initialTool: keyof Tools
    }
  ) {
    this.state = this.system.use(
      state(<InfinityKitState>{
        selecting: false,
        brush: box(),
        selectionBounds: box(),
        focus: false,
        selection: []
      })
    )

    this.tools = this.system.use(state(tools))
    this.tool = this.system.use(state(initialTool))
    this.system.use(() => {
      values(this.tools.get()).forEach((tool) => {
        tool.dispose()
      })
    })

    this.visible = this.system.use<State<QueryResult>>(
      api.stateQuery(
        Symbol(),
        state((get) => ({
          box: get(this.canvas.canvasViewport)
        }))
      )
    )

    this.styles = this.system.use(
      state((get) => {
        const transform = get(this.canvas.transform)
        return {
          backgroundPattern: getSVGBackgroundPattern(transform, get(this.canvas.options).grid),
          container: getCanvasStyle(transform)
        }
      })
    )
  }

  public setTool = (tool: keyof Tools) => {
    if (tool !== this.tool.get()) {
      this.onDeselect()
      this.tool.set(tool)
      this.onSelect()
    }
  }

  public select = (id: string[]) => {
    this.state.set({
      selection: id
    })
  }

  public selectAll = () => this.select(this.api.ids.get())

  public getActiveTool = () => this.tools.get()[this.tool.get()]

  public onFocus = () => {
    this.state.set({
      focus: true
    })
  }

  public onBlur = () => {
    this.state.set({
      focus: false
    })
    this.timer.stop()
  }

  public onPointerDown = (p: PointerState) => {
    this.state.set({
      focus: true
    })
    this.timer.start()
    this.getActiveTool().onPointerDown?.(this, p)
  }

  public onPointerMove = (p: PointerState) => {
    this.getActiveTool().onPointerMove?.(this, p)
  }

  public onPointerUp = (p: PointerState) => {
    const previous = this.timer.get()
    const timed = this.timer.stop()
    if (!timed) {
      return
    }
    console.log(previous)
    console.log(timed)

    const tool = this.getActiveTool()
    tool.onPointerUp?.(this, p)

    const singleClick = boxSize(this.state.get().brush) < 2
    const doubleClick = timed.duration < TAP_THRESHOLD
    console.log(this.state.get())

    console.log('singleclick', singleClick, boxSize(this.state.get().brush))
    if (singleClick && !doubleClick) {
      tool.onClick?.(this, p)
    }

    if (doubleClick) {
      tool.onDoubleClick?.(this, p)
    }
  }

  public onWheel = (point: Vector2, delta: Vector2) => {
    this.getActiveTool().onWheel?.(this, point, delta)
  }

  public onSelect = () => {
    this.getActiveTool().onSelect?.(this)
  }

  public onDeselect = () => {
    this.getActiveTool().onDeselect?.(this)
    this.timer.stop()
  }

  public dispose = () => this.system.dispose()
}
