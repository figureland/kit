import type { HBBufferInstanceJSON } from './api.types'
import type { HBFont } from './Harfbuzz'
import SVGPathCommander from 'svg-path-commander'

export type SVGBoundingBox = {
  width: number
  height: number
  x: number
  y: number
  x2: number
  y2: number
  cx: number
  cy: number
  cz: number
}

export type HBSVGComposition = {
  bounds: SVGBoundingBox
  combined: string
  paths: string[]
}

export const createSVG = (glyphs: HBBufferInstanceJSON[], font: HBFont): HBSVGComposition => {
  const paths = []
  let x = 0
  let y = 0

  let combined: string = ''

  for (const { g, ax, ay } of glyphs) {
    const d = font.glyphToPath(g)
    const path = new SVGPathCommander(d)
      .transform({
        translate: [x, y],
        scale: [1, -1]
      })
      .toString()
    paths.push(path)

    combined += path
    x += ax
    y += ay
  }

  const bounds: SVGBoundingBox = SVGPathCommander.getPathBBox(combined)

  return {
    bounds,
    combined,
    paths
  }
}
