import * as fs from "node:fs/promises"
import { type Config } from "./config.ts"
import { build as farmBuild, type JsPlugin } from "@farmfe/core"
// import { markdownJSPlugin } from "./farm-plugins/markdown.ts"
// import solidPlugin from "vite-plugin-solid"
import solidPlugin from "@farmfe/js-plugin-solid"
import * as process from "node:process"
import type { FarmJSPlugin } from "./types.ts"
import { routingPlugin } from "./farm-plugins/routing.ts"
import mdxPlugin from "@farmfe/plugin-mdx"
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
      minify: false, // debug
      sourcemap: false, // debug
    },
    plugins: [
      routingPlugin({ config, routes }),
      mdxPlugin({ jsx: true, jsxImportSource: "solid-js" }),
      {
        name: "jsx to solid",
        transform: {
          filters: { moduleTypes: ["jsx", "tsx"] },
          async executor(param, _ctx) {
            return {
              content: param.content,
              moduleType: "solid",
            }
          }
        }
      } satisfies JsPlugin,
      solidPlugin({
        solid: {
          // hydratable: true
        }
      })
    ],
    vitePlugins: [
      // @farmfe/js-plugin-solid is deprecated
      // https://github.com/farm-fe/farm/issues/2124#issuecomment-2736695432
      // () => ({
      //   vitePlugin: {
      //     ...solidPlugin({
      //       solid: {
      //         // hydratable: true,
      //       },
      //     }),
      //     extensions: [".md", ".mdx"],
      //     priority: 1000,
      //   },
      //   filters: ["\\.tsx$", "\\.jsx$", "\\.md$", "\\.mdx$"],
      // }),
    ]
  })
}
