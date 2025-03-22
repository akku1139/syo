import type { Command } from "../types.ts"
import { preview as farmPreview } from "@farmfe/core"
import { parseArgs } from "node:util"
import * as v from "valibot"

export const crean: Command = async (config, args) => {
  const cliArgs = parseArgs({
    args,
    options: { // https://github.com/farm-fe/farm/blob/7a69a887d9826214f78bcc49165dbe6b56a9f309/packages/core/src/config/types.ts#L165-L170
      port: {
        type: "string",
      },
      open: {
        type: "boolean",
      },
      // https: {}
      host: { // string | boolean;
        type: "string",
      },
    },
  })

  const port = v.parse(v.optional(
    v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(65535))
  ), cliArgs.values.port)

  await farmPreview({
    port,
    open: cliArgs.values.open,
    host: cliArgs.values.host,
    compilation: {
      output: {
        path: config.internal.distDir,
      },
    },
  })
}
