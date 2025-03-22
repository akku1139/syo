import * as path from "node:path"
import * as process from "node:process"

export const rootPath = process.cwd()

export const p = (target: string) => path.resolve(rootPath, target)

export const cacheDir =  path.join(rootPath, "node_modules", ".syo")
