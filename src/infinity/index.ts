export {
  staticCanvasStyle,
  getCanvasStyle,
  boxStyle,
  getSVGBackgroundPattern,
  type SVGBackgroundPattern
} from './utils/style'
export * from './utils/layout'

export * from './utils/geometry'
export {
  backgroundPatterns,
  type BackgroundPatternType,
  isBackgroundPatternType
} from './schema/background.schema'

// Core
export {
  InfinityKit,
  type InfinityKitActionType,
  type InfinityKitActions,
  type InfinityKitState,
  type InfinityKitStyles
} from './InfinityKit'

// Query API
export { CanvasQuery, initializeCanvasQuery } from './query/CanvasQuery'
export type {
  QueryIdentifier,
  Query,
  QueryParams,
  QueryAPI,
  InferQueryItem,
  QueryResult
} from './query/QueryAPI'

// Canvas
export type { CanvasState, CanvasOptions } from './Canvas'
export { Canvas } from './Canvas'
export {
  type InteractionAdapter,
  createInteractionAdapter,
  attachInteractionAdapter
} from './InteractionAdapter'

// Tools
export { createDefaultToolset } from './default-tools'
export { type InfinityKitTool, type InfinityKitToolset } from './tools/Tool'
