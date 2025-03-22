import type { Command } from "../types.ts"
import { clean as farmClean } from "@farmfe/core"
import { cacheDir, rootPath } from "../utils/path.ts"
import { parseArgs } from "node:util"
import * as fs from "node:fs/promises"

export const crean: Command = async (_config, args) => {
  const cliArgs = parseArgs({
    args,
    options: {
      recursive: {
        type: "boolean",
      },
    },
  })

  await farmClean(rootPath, cliArgs.values.recursive)
  await fs.rm(cacheDir, { recursive: true, force: true })
}
