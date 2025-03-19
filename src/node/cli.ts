import { fileURLToPath } from "node:url"
import * as v from "valibot"
import { ConfigSchema } from "./config.ts"
import { build } from "./build.ts"
import { p } from "./utils/path.ts"

const configFilePath = p("syo.config.js")
const config = v.parse( ConfigSchema,
  (await import(fileURLToPath(new URL(configFilePath, import.meta.url)))).default as unknown
)

await build(config)
