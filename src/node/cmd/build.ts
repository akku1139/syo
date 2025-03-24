import { build as farmBuild, logger } from "@farmfe/core"
// import { markdownJSPlugin } from "./farm-plugins/markdown.ts"
import * as process from "node:process"
import type { Command, App } from "../types.ts"
import { parseArgs } from "node:util"
import * as path from "node:path"
import { cacheDir } from "../utils/path.ts"
import { dynamicImport } from "../../../src/raw/import.js"
import { renderToString } from "solid-js/web"
import { commonFarmPlugins } from "../utils/farm.ts"
import { getRoutes } from "../utils/routes.ts"

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

  const routes = await getRoutes(config)

  const appBuildPath = path.resolve(cacheDir, "app")

  // main logic

  // await fs.rm(config.internal.distDir, { recursive: true, force: true })
  // await fs.mkdir(config.internal.distDir, { recursive: true })

  logger.info("building")

  await farmBuild({
    compilation: {
      input: {
        app: path.resolve(import.meta.dirname, "../../../src/client/App.tsx"),
        entry: path.resolve(import.meta.dirname, "../../../src/client/entry/prod.tsx"),
      },
      output: {
        path: appBuildPath,
        targetEnv: "library",
      },
      define: {
        window: "globalThis",
      },
      external: ["^[^\/\\.(syo:)].*", "solid-js", "seroval"], // FIXME: not perfect
      mode: "production",
      presetEnv: false, // to enable, install core-js
      minify: false,
      treeShaking: false,
      lazyCompilation: false,
      sourcemap: false,
      partialBundling: {
        enforceResources: [ // FIXME: all bundle
          {
            name: "app",
            test: [".+"],
          },
          {
            name: "entry",
            test: [".+"],
          }
        ],
      },
    },
    plugins: commonFarmPlugins(config, routes),
  })

  logger.info("prerendering")

  const App = (await dynamicImport(path.resolve(appBuildPath, "app.js"))).default as App

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
      define: {
        global: "globalThis",
      },
    },
    plugins: [
      {
        name: "syo prerendering plugin",
        load: {
          filters: { resolvedPaths: ["\\.mdx?$"] },
          async executor() {
            return {
              content: "",
              moduleType: "phonymd"
            }
          }
        },
        transform: {
          filters: { moduleTypes: ["phonymd"] },
          async executor(param) {
            const url = param.resolvedPath
              .replace(new RegExp(`^${path.resolve(process.cwd(), config.internal.srcDir)}/`), config.internal.basePath)
              .replace(/\.mdx?$/, "").replace(/\/index$/, "/")

            logger.info("prerendering: " + url)

            const html = "<!DOCTYPE html>"+renderToString(() => App({
              entry: path.relative(path.relative(process.cwd(), path.dirname(param.resolvedPath)), path.resolve(appBuildPath, "entry.js")),
              base: config.internal.basePath,
              url,
            }))

            logger.info(html) // FIXME: Router prerendering is not working

            return {
              moduleType: "html",
              content: html,
            }
          },
        }
      }
    ]
  })
}
