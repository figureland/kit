import { describe, it, expect } from 'bun:test'
import { Canvas } from '..'

describe('should', () => {
  it('pan canvas', async () => {
    const canvas = new Canvas()
    expect(canvas.transform.get()).toEqual([1, 0, 0, 1, 0, 0])
    canvas.pan({ x: 100, y: 100 })
    expect(canvas.transform.get()).toEqual([1, 0, 0, 1, -100, -100])
    canvas.pan({ x: 100, y: 100 })
    expect(canvas.transform.get()).toEqual([1, 0, 0, 1, -200, -200])
  })
})
