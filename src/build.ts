import * as fs from "node:fs/promises"
import { type Config } from "./config.ts"
import { build as farmBuild } from "@farmfe/core"
import { markdownPlugin } from "./farm-plugins/markdown.ts"
import solid from "vite-plugin-solid"
import * as process from "node:process"

export const build = async (config: Config): Promise<void> => {
  process.env.NODE_ENV = "production"

  const srcDir = config.srcDir ?? "pages"
  const srcs = await Array.fromAsync(fs.glob(`${srcDir}/**/*.md`))

  await farmBuild({
    compilation: {
      input: Object.fromEntries(srcs.map(src => {
        return [
          src.replace(new RegExp(`^${srcDir}/`), "").replace(/\.md$/, ""),
          src,
        ]
      })),
      output: {
        path: config.distDir ?? "dist",
        publicPath: config.basePath,
      },
    },
    plugins: [
      ...[markdownPlugin].map(p => p(config)),
    ],
    vitePlugins: [
      () => ({
        vitePlugin: solid({
          solid: {
            hydratable: true,
          }
        }),
        filters: ["\\.tsx$", "\\.jsx$"],
      }),
    ],
  })
}
