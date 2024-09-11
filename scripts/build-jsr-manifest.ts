import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

interface PackageJson {
  name: string
  version: string
  exports: Record<string, { types: string; import: string }>
}

interface JsrManifest {
  name: string
  version: string
  exports: Record<string, string>
}

const generateJsrManifest = async () => {
  try {
    const packageJsonPath = join(process.cwd(), 'package.json')
    const packageJsonContent = await readFile(packageJsonPath, 'utf-8')
    const packageJson: PackageJson = JSON.parse(packageJsonContent)

    const jsrManifest: JsrManifest = {
      name: packageJson.name,
      version: packageJson.version,
      exports: {}
    }

    for (const [key, value] of Object.entries(packageJson.exports)) {
      jsrManifest.exports[key] = value.import
    }

    const jsrManifestPath = join(process.cwd(), 'jsr.json')
    await writeFile(jsrManifestPath, JSON.stringify(jsrManifest, null, 2))

    console.log('JSR manifest generated successfully!')
  } catch (error) {
    console.error('Error generating JSR manifest:', error)
  }
}

generateJsrManifest()
