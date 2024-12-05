import { Glob } from 'bun'
import { join } from 'node:path'
import { run } from 'mitata'
import { parseArgs } from 'util'

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    store: {
      type: 'boolean',
      default: false
    }
  },
  strict: true,
  allowPositionals: true
})

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

if (values.store) {
  const trial = await run({
    format: 'json'
  })
  const timestamp = new Date().toISOString()
  const results = {
    timestamp,
    results: trial
  }

  await Bun.write(`benchmark.json`, JSON.stringify(results, null, 2))

  console.log(`Benchmark results stored in benchmark.json`)
} else {
  run()
}
