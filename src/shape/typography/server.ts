import { resolve } from 'node:path'
import { getFile } from '../wasm/server'
import type { WasmGenerator } from '../wasm/wasm.types'

const defaultWasmPath = 'node_modules/@figureland/kit/shape/wasm/harfbuzz.wasm'

export const defaultServerWasm: WasmGenerator = async () => {
  const file = await getFile(resolve(defaultWasmPath))
  const { instance } = await WebAssembly.instantiate(file)
  return instance
}
