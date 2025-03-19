import * as fs from "node:fs/promises"
import { type Config } from "./config.ts"
import { build as farmBuild } from "@farmfe/core"
// import { markdownJSPlugin } from "./farm-plugins/markdown.ts"
import solid from "@farmfe/js-plugin-solid"
import * as process from "node:process"
import type { FarmJSPlugin } from "./types.ts"
import { routingPlugin } from "./farm-plugins/routing.ts"
import mdx from "@mdx-js/rollup"

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
        ...Object.fromEntries(routes.map(r => [r[0], r[1]])),
      },
      output: {
        path: config.distDir ?? "dist",
        publicPath: config.basePath,
      },
    },
    plugins: [
      routingPlugin({ config, routes }),
      // ...([
      //   // markdownJSPlugin,
      // ] satisfies Array<FarmJSPlugin>).map(p => p({
      //   config,
      //   routes,
      // })),
      solid({
        solid: {
          hydratable: true,
        },
      }),
    ],
    vitePlugins: [
      () => ({
        vitePlugin: mdx({
          jsxImportSource: "solid-js"
        }),
        filters: ['\\.md$', '\\.mdx$']
      })
    ]
  })
}
