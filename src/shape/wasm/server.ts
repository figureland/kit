import { readFile } from 'node:fs/promises'

export const getFile = async (filePath: string) => {
  const file = await readFile(filePath)
  return new Uint8Array(file)
}
