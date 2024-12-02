import { Glob } from 'bun'
import { join } from 'node:path'
import { run } from 'mitata'

const glob = new Glob('**/*.bench.ts')

const files: string[] = []

for await (const file of glob.scan('.')) {
  const absolutePath = join(import.meta.dir, '..', file)
  files.push(file)
  await import(absolutePath)
}

console.log('Benchmarking:')
for (const file of files) {
  console.log(`  ${file}`)
}

const trial = await run()
