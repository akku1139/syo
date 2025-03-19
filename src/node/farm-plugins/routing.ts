import type { FarmJSPlugin } from "../types.ts"
import { p } from "../utils/path.ts"

export const routingPlugin = ({ routes }: Parameters<FarmJSPlugin>[0]): [string, object] => [
  "@farmfe/plugin-virtual",
  {
    "syo:routes": `
      import { lazy } from "solid-js"
      export default [ ${routes.map(route => `{
        path: ${JSON.stringify(route[0])},
        component: lazy(() => import("${p(route[1])}?js")),
        }`)
      } ]`
  }
]
