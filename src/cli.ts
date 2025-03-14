import * as path from "node:path"
import * as process from "node:process"
import { fileURLToPath } from "node:url"
import * as v from "valibot"
import { ConfigSchema } from "./config.ts"
import { build } from "./build.ts"

const p = (target: string) => path.resolve(process.cwd(), target)

const configFilePath = p("syo.config.js")
const config = v.parse( ConfigSchema,
  (await import(fileURLToPath(new URL(configFilePath, import.meta.url)))).default as unknown
)

console.log("config:", config)

await build(config)

console.log("build!")
