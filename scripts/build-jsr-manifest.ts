import fs from 'node:fs/promises'
import path from 'node:path'

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

async function generateJsrManifest() {
  try {
    // Read package.json
    const packageJsonPath = path.join(process.cwd(), 'package.json')
    const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8')
    const packageJson: PackageJson = JSON.parse(packageJsonContent)

    // Create JSR manifest
    const jsrManifest: JsrManifest = {
      name: packageJson.name,
      version: packageJson.version,
      exports: {}
    }

    // Convert exports
    for (const [key, value] of Object.entries(packageJson.exports)) {
      jsrManifest.exports[key] = value.import
    }

    // Write JSR manifest
    const jsrManifestPath = path.join(process.cwd(), 'jsr.json')
    await fs.writeFile(jsrManifestPath, JSON.stringify(jsrManifest, null, 2))

    console.log('JSR manifest generated successfully!')
  } catch (error) {
    console.error('Error generating JSR manifest:', error)
  }
}

generateJsrManifest()
