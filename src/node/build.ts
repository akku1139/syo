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
      mode: "production",
      presetEnv: false, // to enable, install core-js
      minify: false, // debug
      sourcemap: false, // debug
      // debug: disable chunk splitting
      // https://www.farmfe.org/docs/advanced/partial-bundling/#bundle-all-modules-together
      partialBundling: {
        enforceResources: [
          {
            name: 'index',
            test: ['.+'],
          }
        ],
      },
    },
    plugins: [
      routingPlugin({ config, routes }),
      mdxPlugin({ jsx: true, jsxImportSource: "solid-js" }),
      {
        name: "jsx to solid", // hack
        priority: 99.5,
        transform: {
          filters: { moduleTypes: ["jsx", "tsx"], resolvedPaths: ["\\.md$", "\\.mdx$"] },
          async executor(param, _ctx) {
            if(!(param.resolvedPath.endsWith(".md") || param.resolvedPath.endsWith(".mdx"))) {
              return param
            }
            return {
              content: param.content.replaceAll("<_components.", "<").replaceAll("</_components.", "</"), // hack: Make solid.js work well
              moduleType: "solid",
            }
          }
        }
      } satisfies JsPlugin,
      // @farmfe/js-plugin-solid is deprecated
      // https://github.com/farm-fe/farm/issues/2124#issuecomment-2736695432
      solidPlugin({
        solid: {
          // hydratable: true
        }
      }),
      {
        ...solidPlugin({
          solid: {
            // hydratable: true
          },
          extensions: [".md", ".mdx"],
        }),
        name: "solid mdx",
        priority:99,
      },
    ],
  })
}
