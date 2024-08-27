import type { BuildConfig } from 'bun'
import { mkdir, readdir } from 'fs/promises'
import { existsSync } from 'fs'

const ensureDir = async (path: string) => {
  if (!existsSync(path)) {
    await mkdir(path, { recursive: true })
  } else {
    const files = await readdir(path)
    if (files.length > 0) {
      console.log(`Overwriting directory: ${path}`)
    }
  }
}

export const build = async (config: BuildConfig & { outdir: string }) => {
  await ensureDir(config.outdir)
  await Bun.build({ ...config, naming: '[name].[ext]' })

  console.log(`Built: ${config.outdir} (${config.entrypoints.length} files)`)
}
