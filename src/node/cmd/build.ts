import * as fs from "node:fs/promises"
import { build as farmBuild, logger, type JsPlugin } from "@farmfe/core"
// import { markdownJSPlugin } from "./farm-plugins/markdown.ts"
import solidPlugin from "@farmfe/js-plugin-solid"
import * as process from "node:process"
import type { FarmJSPlugin, Command, App } from "../types.ts"
import { routingPlugin } from "../farm-plugins/routing.ts"
import mdxPlugin from "@farmfe/plugin-mdx"
import { parseArgs } from "node:util"
import * as path from "node:path"
import { cacheDir } from "../utils/path.ts"
import { dynamicImport } from "../../../src/raw/import.js"
import { renderToString } from "solid-js/web"

export const build: Command = async (config, args) => {
  process.env.NODE_ENV = "production"

  const cliArgs = parseArgs({
    args,
    options: {
      basePath: {
        type: "string",
      }
    },
  })

  config.internal.basePath = cliArgs.values.basePath ?? config.internal.basePath
  config.basePath = cliArgs.values.basePath ?? config.basePath

  const srcs = await Array.fromAsync(fs.glob(`${config.internal.srcDir}/**/*.md`))
  const routes: Parameters<FarmJSPlugin>[0]["routes"] = srcs.map(src => {
    return [
      src.replace(new RegExp(`^${config.internal.srcDir}/`), "").replace(/\.md$/, ""),
      src,
    ]
  })

  const solidOptions: Exclude<Parameters<typeof solidPlugin>[0], undefined>["solid"] = {
    hydratable: true,
    generate: "universal", // FIXME: not good
    // https://github.com/solidjs/solid/blob/41fa6c14b4bf71eed593303cd63b32d53e3515e9/packages/solid-ssr/examples/ssg/rollup.config.js
  }

  const appBuildPath = path.join(cacheDir, "app")

  // main logic

  // await fs.rm(config.internal.distDir, { recursive: true, force: true })
  // await fs.mkdir(config.internal.distDir, { recursive: true })

  logger.info("building")

  await farmBuild({
    compilation: {
      input: {
        index: path.resolve(import.meta.dirname, "../../../src/client/App.tsx")
      },
      output: {
        path: appBuildPath,
        targetEnv: "node-next",
      },
      external: ["^[^\/\\.(syo:)].*", "solid-js", "seroval"], // FIXME: not perfect
      mode: "production",
      presetEnv: false, // to enable, install core-js
      minify: false,
      treeShaking: false,
      lazyCompilation: false,
      // sourcemap: false,
    },
    plugins: [
      ...[
        routingPlugin,
      ].map(p => p({ config, routes })),
      mdxPlugin({
        jsx: true, jsxImportSource: "solid-js",
        parse: { // https://github.com/farm-fe/plugins/blob/59d8f2c9f87f396f7689aac8b3afb365f2be1290/rust-plugins/mdx/src/lib.rs#L38
          constructs: {
            frontmatter: true, // https://docs.rs/mdxjs/0.2.5/mdxjs/struct.MdxConstructs.html#structfield.frontmatter
            // not working?
          }
        },
      } as Parameters<typeof mdxPlugin>[0]),
      {
        name: "jsx to solid", // hack
        priority: 99.5,
        transform: {
          filters: { moduleTypes: ["jsx", "tsx"], resolvedPaths: ["\\.mdx?$"] },
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
        solid: solidOptions
      }),
      {
        ...solidPlugin({
          solid: solidOptions,
          extensions: [".md", ".mdx"],
        }),
        name: "solid mdx",
        priority:99,
      },
    ],
  })

  logger.info("prerendering")

  const App = (await dynamicImport(path.join(appBuildPath, "index.js"))).default as App

  await farmBuild({
    compilation: {
      input: {
        ...Object.fromEntries(routes),
      },
      output: {
        path: config.internal.distDir,
        publicPath: config.basePath,
        targetEnv: "browser-esnext",
      },
      mode: "production",
      presetEnv: false, // to enable, install core-js
      minify: false, // debug
      sourcemap: false, // debug
    },
    plugins: [
      {
        name: "syo prerendering plugin",
        transform: {
          filters: { resolvedPaths: ["\\.mdx?$"] },
          async executor(param) {
            return {
              moduleType: "html",
              content: "<!DOCTYPE html>"+renderToString(() => App({
                base: config.internal.basePath,
                url: param.resolvedPath
                  .replace(new RegExp(`^${path.join(process.cwd(), config.internal.srcDir)}/`), config.internal.basePath)
                  .replace(/\.md$/, "").replace(/\/index$/, "/")
              })),
            }
          },
        }
      }
    ]
  })
}
