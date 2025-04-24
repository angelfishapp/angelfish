import fs from 'fs/promises'
import path from 'path'
import yaml from 'yaml'

/**
 * Helper function to get the locked version of a package from yarn.lock in repo root.
 *
 * @param pkgName   The package name to look for in yarn.lock
 * @returns         The locked version of the package or null if not found
 */
async function getLockedVersion(pkgName: string): Promise<string | null> {
  const lockPath = path.resolve(__dirname, '../../../yarn.lock')
  const raw = await fs.readFile(lockPath, 'utf8')
  const parsed = yaml.parse(raw)

  for (const key in parsed) {
    if (key.startsWith(`${pkgName}@`)) {
      return parsed[key].version
    }
  }

  return null
}

/**
 * Reads the build app's package.json, strips devDependencies,
 * and includes only the given external modules with versions from yarn.lock.
 */
export async function filterPackageJsonForExternals(buildPath: string, externals: string[]) {
  const pkgPath = path.join(buildPath, 'package.json')

  // Build clean dependency object with resolved versions
  const newDeps: Record<string, string> = {}

  for (const external of externals) {
    const lockedVersion = await getLockedVersion(external)
    if (lockedVersion) {
      newDeps[external] = lockedVersion
    } else {
      // eslint-disable-next-line no-console
      console.warn(`⚠️ Couldn't find "${external}" in yarn.lock`)
    }
  }

  // Read and mutate app package.json
  const rawPkg = await fs.readFile(pkgPath, 'utf-8')
  const pkg = JSON.parse(rawPkg)

  const newPkg = {
    ...pkg,
    dependencies: newDeps,
  }

  delete newPkg.devDependencies

  await fs.writeFile(pkgPath, JSON.stringify(newPkg, null, 2), 'utf-8')
  // eslint-disable-next-line no-console
  console.log(
    `✅ Updated package.json in ${buildPath} with externals: ${externals.join(', ')}`,
    newPkg,
  )
}
