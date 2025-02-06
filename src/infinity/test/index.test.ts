import { describe, it, expect } from 'bun:test'
import { Canvas, CanvasQuery, InfinityKit, createDefaultToolset } from '..'

describe('should', () => {
  it('export InfinityKit', () => {
    expect(InfinityKit).toBeDefined()
  })
  it('creates InfinityKit instance', async () => {
    const query = new CanvasQuery()

    query.add('a', { x: 0, y: 0, width: 10, height: 10 })
    query.add('b', { x: 10, y: 10, width: 10, height: 10 })

    const canvas = new Canvas()
    const kit = new InfinityKit(canvas, query, {
      tools: createDefaultToolset(),
      initialTool: 'select'
    })
    expect(kit).toBeInstanceOf(InfinityKit)
  })
})
