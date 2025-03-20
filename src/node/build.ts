import * as fs from "node:fs/promises"
import { type Config } from "./config.ts"
import { build as farmBuild } from "@farmfe/core"
// import { markdownJSPlugin } from "./farm-plugins/markdown.ts"
import solid from "vite-plugin-solid"
import * as process from "node:process"
import type { FarmJSPlugin } from "./types.ts"
import { routingPlugin } from "./farm-plugins/routing.ts"
import mdx from "@mdx-js/rollup"
import * as path from "node:path"

export const build = async (config: Config): Promise<void> => {
  process.env.NODE_ENV = "production"

  const srcDir = config.srcDir ?? "pages"
  const srcs = await Array.fromAsync(fs.glob(`${srcDir}/**/*.md`))
  const routes: Parameters<FarmJSPlugin>[0]["routes"] = srcs.map(src => {
    return [
      src.replace(new RegExp(`^${srcDir}/`), "").replace(/\.md$/, ""),
      src,
    ]
  })

  await farmBuild({
    compilation: {
      input: {
        // ...Object.fromEntries(routes),
        index: path.resolve(import.meta.dirname, "../../src/client/index.html")
      },
      output: {
        path: config.distDir ?? "dist",
        publicPath: config.basePath,
      },
      presetEnv: false, // to enable, install core-js
    },
    plugins: [
      routingPlugin({ config, routes }),
    ],
    vitePlugins: [
      () => ({
        vitePlugin: mdx({
          jsxImportSource: "solid-js"
        }),
        filters: ["\\.md$", "\\.mdx$"]
      }),
      // @farmfe/js-plugin-solid is deprecated
      // https://github.com/farm-fe/farm/issues/2124#issuecomment-2736695432
      () => ({
        vitePlugin: solid({
          solid: {
            // hydratable: true,
          },
          extensions: [".md", ".mdx"],
        }),
        filters: ["\\.tsx$", "\\.jsx$", "\\.md$", "\\.mdx$"],
      }),
    ]
  })
}
