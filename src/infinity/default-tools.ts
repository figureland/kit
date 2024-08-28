import { entityTool } from './tools/entity-tool'
import { regionTool } from './tools/region-tool'
import { moveTool } from './tools/move-tool'
import { selectTool } from './tools/select-tool'
import type { InfinityKitToolset } from './tools/Tool'

export const createDefaultToolset = () =>
  ({
    select: selectTool(),
    move: moveTool(),
    entity: entityTool(),
    region: regionTool()
  }) satisfies InfinityKitToolset
