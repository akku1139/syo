import type { Command } from "../types.ts"
import { preview as farmPreview } from "@farmfe/core"
import { parseArgs } from "node:util"

export const crean: Command = async (config, args) => {
  const cliArgs = parseArgs({
    args,
    options: {
      port: {
        type: "string",
      }
    },
  })

  const port = cliArgs.values.port

  await farmPreview({
    port,
  })

}
