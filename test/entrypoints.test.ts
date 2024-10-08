import { describe, it, expect } from 'bun:test'
import { resolve, dirname } from 'path'
import { exists } from 'node:fs/promises'
import { fileURLToPath } from 'url'
import packageJson from '../package.json'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const endsWithAny = (str: string, suffixes: string[]): boolean =>
  suffixes.some((suffix) => str.endsWith(suffix))

const checkEntrypoints = async () => {
  const entrypoints = Object.values(packageJson.exports).flatMap((entry) =>
    typeof entry === 'object' && entry.import ? [entry.import] : []
  )

  for (const entrypoint of entrypoints) {
    if (!endsWithAny(entrypoint, ['.ts', '.js', '.mjs', '.cjs'])) {
      const fullPath = resolve(__dirname, '..', entrypoint)
      const e = await exists(fullPath)
      if (!e) {
        throw new Error(`File does not exist: ${fullPath}`)
      }
    } else {
      const fullPath = resolve(__dirname, '..', entrypoint)
      await import(fullPath)
    }
  }
}

describe('check entrypoints', () => {
  it('should successfully import all entrypoints', async () => {
    let error: Error | null = null
    try {
      await checkEntrypoints()
    } catch (e) {
      error = e as Error
    }
    expect(error).toBeNull()
  })

  it('should throw an error for non-existent entrypoint', async () => {
    const invalidEntrypoint = './non-existent-file.ts'
    let error: Error | null = null
    try {
      await import(resolve(__dirname, '..', invalidEntrypoint))
    } catch (e) {
      error = e as Error
    }
    expect(error).not.toBeNull()
    expect(error?.message).toContain('Cannot find module')
  })
})
