import { fileURLToPath } from "node:url"
import * as v from "valibot"
import { ConfigSchema } from "./config.ts"
import { build } from "./cmd/build.ts"
import { p } from "./utils/path.ts"
import { dynamicImport } from "../../src/raw/import.js"
import * as process from "node:process"
import { devServer } from "./cmd/dev.ts"
import type { InternalConfig, Command } from "./types.ts"
import { crean } from "./cmd/crean.ts"
import { notImpl } from "./cmd/notimpl.ts"
import { getInternalConfig } from "./utils/config.ts"

const configFilePath = p("syo.config.js")
const userConfig = v.parse( ConfigSchema,
  (await dynamicImport(fileURLToPath(new URL(configFilePath, import.meta.url)))).default as unknown
)

const config: InternalConfig = getInternalConfig(userConfig)

// https://github.com/farm-fe/farm/blob/7a69a887d9826214f78bcc49165dbe6b56a9f309/packages/cli/src/index.ts
const commandMap: Record<string, Command> = {
  build,
  dev: devServer,
  crean,
  preview: notImpl
}

const command = commandMap[process.argv[2] ?? ""]

if(command) {
  await command(config, process.argv.splice(3))
} else {
  await devServer(config, process.argv.slice(2))
}
