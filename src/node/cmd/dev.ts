import { parseArgs } from "node:util"
import type { Command } from "../types.ts"
import { start as farmStart } from "@farmfe/core"
import { commonFarmPlugins } from "../utils/farm.ts"
import { getRoutes } from "../utils/routes.ts"
import * as path from "node:path"
import { portNumber } from "../utils/validation.ts"

// TODO: watch syo.config.js

export const devServer: Command = async (config, args) => {
  const cliArgs = parseArgs({
    args,
    options: { // https://github.com/farm-fe/farm/blob/7a69a887d9826214f78bcc49165dbe6b56a9f309/packages/core/src/config/types.ts#L165-L170
      port: {
        type: "string",
      },
      open: {
        type: "boolean",
      },
      host: { // string | boolean;
        type: "string",
      },
      hmr: {
        type: "boolean",
      },
      cors: {
        type: "boolean",
      },
      strictPort: {
        type: "boolean",
      },
      clearScreen: {
        type: "boolean",
      },
    },
  })

  const routes = await getRoutes(config)

  await farmStart({
    clearScreen: cliArgs.values.clearScreen,
    compilation: {
      input: {
        index: path.resolve(import.meta.dirname, "../../../src/client/entry/dev.html"),
      },
      mode: "development",
      presetEnv: false, // to enable, install core-js
      minify: false,
      treeShaking: false,
      lazyCompilation: true,
      sourcemap: false,
    },
    server: {
      port: portNumber(cliArgs.values.port),
      open: cliArgs.values.open,
      host: cliArgs.values.host,
      hmr: cliArgs.values.hmr,
      cors: cliArgs.values.cors,
      strictPort: cliArgs.values.strictPort,
    },
    plugins: [
      ...commonFarmPlugins(config, routes),
      {
        name: "syo devserver entry",
        transform: {
          filters: { moduleTypes: ["html"] },
          async executor(param) {
              return {
                moduleType: "html",
                content: param.content.replaceAll("%entryjspath%", path.relative(path.relative(process.cwd(), path.dirname(param.resolvedPath)), path.resolve(import.meta.dirname, "../../../src/client/entry/dev.tsx")))
              }
          },
        },
      }
    ],
  })
}
