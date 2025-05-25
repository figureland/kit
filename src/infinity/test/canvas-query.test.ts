import { describe, it, expect } from 'bun:test'
import { CanvasQuery } from '..'

describe('CanvasQuery', () => {
  it('initializes CanvasQuery with seed data', async () => {
    const query = new CanvasQuery()

    query.add('a', { x: 0, y: 0, width: 10, height: 10 })
    query.add('b', { x: 10, y: 10, width: 10, height: 10 })

    const box = query.boundingBox(['a', 'b'])

    expect(box.x).toBe(0)
    expect(box.y).toBe(0)
    expect(box.width).toBe(20)
    expect(box.height).toBe(20)
  })
})
