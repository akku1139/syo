// import * as fs from "node:fs/promises"
import * as fsSync from "node:fs"
import { type Config } from "./config.ts"
import { build as farmBuild } from "@farmfe/core"
import { markdownPlugin } from "./farm-plugins/markdown.ts"
import * as process from "node:process"

export const build = async (config: Config): Promise<void> => {
  process.env.NODE_ENV = "production"

  const srcDir = config.srcDir ?? "docs"
  // const srcs = fs.glob(`${srcDir}/**/*.md`)
  const srcs = fsSync.globSync(`${srcDir}/**/*.md`)

  await farmBuild({
    compilation: {
      input: Object.fromEntries(srcs.map(src => {
        return [
          src.replace(new RegExp(`^${srcDir}/`), "").replace(/\.md$/, ""),
          src,
        ]
      })),
    },
    outDir: config.distDir ?? "docs-dist",
    plugins: [
      ...[markdownPlugin].map(p => p(config))
    ],
  })
}
