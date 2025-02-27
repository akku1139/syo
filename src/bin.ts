import { glob } from "node:fs/promises"
import * as path from "node:path"
import * as process from "node:process"
import { fileURLToPath } from "node:url"

const configFilePath = path.resolve(process.cwd(), "syo.config.js")
const config = (await import(fileURLToPath(new URL(configFilePath, import.meta.url))).catch(() => ({}))).default as unknown

for await (const entry of glob("docs/**/*.md")) {
  console.log("file:", entry)
}

console.log("build!")
