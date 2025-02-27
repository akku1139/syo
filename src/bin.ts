import * as fs from "node:fs/promises"
import * as path from "node:path"
import * as process from "node:process"
import { fileURLToPath } from "node:url"
import * as v from "valibot"
import { ConfigSchema } from "./config.ts"

import { markdownProcessor } from "./source/markdown.ts"

const configFilePath = path.resolve(process.cwd(), "syo.config.js")
const config = v.parse( ConfigSchema,
  (await import(fileURLToPath(new URL(configFilePath, import.meta.url))).catch(() => ({}))).default ?? {} as unknown
)

fs.rm(path.resolve(process.cwd(), "docs-dist"), { recursive: true, force: true })

for await (const entry of fs.glob("docs/**/*.md")) {
  console.log("file:", entry)
  const file = await fs.readFile(entry)
  const html = await markdownProcessor.process(file)
  await fs.mkdir(path.dirname(entry), { recursive: true })
  await fs.writeFile()
}

console.log("build!")
