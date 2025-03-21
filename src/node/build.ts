import * as fs from "node:fs/promises"
import { type Config } from "./config.ts"
import { build as farmBuild, type JsPlugin } from "@farmfe/core"
// import { markdownJSPlugin } from "./farm-plugins/markdown.ts"
// import solidPlugin from "vite-plugin-solid"
import solidPlugin from "@farmfe/js-plugin-solid"
import * as process from "node:process"
import type { FarmJSPlugin, InternalConfig } from "./types.ts"
import { routingPlugin } from "./farm-plugins/routing.ts"
import mdxPlugin from "@farmfe/plugin-mdx"
import { prerenderPluginLoad, prerenderPluginTransform } from "./farm-plugins/prerender.ts"

export const build = async (userConfig: Config): Promise<void> => {
  process.env.NODE_ENV = "production"

  const config: InternalConfig = {
    ...userConfig,
    internal: {
      srcDir: userConfig.srcDir ?? "pages"
    }
  }

  const srcs = await Array.fromAsync(fs.glob(`${config.internal.srcDir}/**/*.md`))
  const routes: Parameters<FarmJSPlugin>[0]["routes"] = srcs.map(src => {
    return [
      src.replace(new RegExp(`^${config.internal.srcDir}/`), "").replace(/\.md$/, ""),
      src,
    ]
  })

  const solidOptions: Exclude<Parameters<typeof solidPlugin>[0], undefined>["solid"] = {
    hydratable: true
  }

  await farmBuild({
    compilation: {
      input: {
        ...Object.fromEntries(routes.map(r=>[r[0], r[1]+"?html"])),
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
      ...[
        routingPlugin,
        prerenderPluginLoad, prerenderPluginTransform,
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
}
