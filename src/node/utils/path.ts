import * as path from "node:path"
import * as process from "node:process"

export const p = (target: string) => path.resolve(process.cwd(), target)
