import * as fs from "node:fs/promises"
import * as path from "node:path"
import { type Config } from "./config.ts"

import { markdownProcessor } from "./source/markdown.ts"

export const build = async (config: Config): Promise<void> => {
  fs.rm(config.distDir, { recursive: true, force: true })

  for await (const entry of fs.glob(`${config.srcDir}/**/*.md`)) {
    const distFilename = entry.replace(new RegExp(`^${config.srcDir}/`), `${config.distDir}/`).replace(/\.md$/, ".html")
    console.log("file:", entry)
    const file = (await fs.readFile(entry)).toString()
    const html = await markdownProcessor(file)
    await fs.mkdir(path.dirname(distFilename), { recursive: true })
    await fs.writeFile(distFilename, html)
  }
}
