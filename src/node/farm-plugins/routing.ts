import type { FarmJSPlugin } from "../types.ts"
import { p } from "../utils/path.ts"

export const routingPlugin = ({ config, routes }: Parameters<FarmJSPlugin>[0]): [string, object] => [
  "@farmfe/plugin-virtual",
  {
    "syo:routes": `
      import { lazy } from "solid-js"
      export default [ ${routes.map(route => `{
        path: ${JSON.stringify((config.basePath ?? "/")+route[0].replace(/\/?index$/, "/"))},
        component: lazy(() => import("${p(route[1])}")),
        }`)
      } ]`
  }
]
