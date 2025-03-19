import type { FarmJsPlugin } from "../types.ts"

export const routerPlugin: FarmJsPlugin = ({ routes }) => ({
  name: "syo router plugin",
  load: {
    filters: {
      resolvedPaths: ["^virtual:router$"],
    },
    executor: async (_param, _context, _hookContext) => {
      return {
        content: `
          import { lazy } from "solid-js"
          export default [ ${
            routes.map(route => `{
              path: ${JSON.stringify(route[0])},
              component: lazy(async () => <div>{await import("${route[1]}")}</div>),
            },`)
          } ]
        `,
        moduleType: "jsx"
      }
    }
  }

})
