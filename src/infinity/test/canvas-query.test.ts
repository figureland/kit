import { describe, it, expect } from 'bun:test'
import { initializeCanvasQuery } from '..'

describe('CanvasQuery', () => {
  it('initializes CanvasQuery with seed data', async () => {
    const query = await initializeCanvasQuery({
      a: { x: 0, y: 0, width: 10, height: 10 },
      b: { x: 10, y: 10, width: 10, height: 10 }
    })

    const box = query.boundingBox(['a', 'b'])
    expect(box.x).toBe(0)
    expect(box.y).toBe(0)
    expect(box.width).toBe(20)
    expect(box.height).toBe(20)
  })
})
