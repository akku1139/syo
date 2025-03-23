import type { UserConfig, JsPlugin } from "@farmfe/core"
import mdxPlugin from "@farmfe/plugin-mdx"
import { routingPlugin } from "../farm-plugins/routing.ts"
import type { FarmJSPlugin, InternalConfig } from "../types.ts"
import solidPlugin from "@farmfe/js-plugin-solid"

const solidOptions: Exclude<Parameters<typeof solidPlugin>[0], undefined>["solid"] = {
  hydratable: true,
  generate: "ssr", // FIXME: not good
  // https://github.com/solidjs/solid/blob/41fa6c14b4bf71eed593303cd63b32d53e3515e9/packages/solid-ssr/examples/ssg/rollup.config.js
}

export const commonFarmPlugins = (config: InternalConfig, routes: Parameters<FarmJSPlugin>[0]["routes"]): Exclude<UserConfig["plugins"], undefined> => [
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
        if (!(param.resolvedPath.endsWith(".md") || param.resolvedPath.endsWith(".mdx"))) {
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
    priority: 99,
  },
]
