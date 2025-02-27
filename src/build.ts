import * as fs from "node:fs/promises"
import * as path from "node:path"
import { type Config } from "./config.ts"

import { markdownProcessor } from "./source/markdown.ts"

export const build = async (config: Config): Promise<void> => {
  const srcDir = config.srcDir ?? "docs"
  const distDir = config.distDir ?? "docs-dist"

  fs.rm(distDir, { recursive: true, force: true })

  for await (const entry of fs.glob(`${srcDir}/**/*.md`)) {
    const distFilename = entry.replace(new RegExp(`^${srcDir}/`), `${distDir}/`).replace(/\.md$/, ".html")
    console.log("file:", entry)
    const file = (await fs.readFile(entry)).toString()
    const html = await markdownProcessor(file)
    await fs.mkdir(path.dirname(distFilename), { recursive: true })
    await fs.writeFile(distFilename, html)
  }
}
