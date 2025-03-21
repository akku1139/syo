/**
 * Hack!
 */

import type { FarmJSPlugin } from "../types.ts"
import * as path from "node:path"
import type { JSX } from "solid-js/jsx-runtime"
import { renderToString } from "solid-js/web"

export const prerenderPluginLoad: FarmJSPlugin = ({ config }) => ({
  name: "syo prerender plugin (loader)",
  load: {
    filters: {
      resolvedPaths: ["\\.mdx?\\?html$"]
    },
    async executor(param) {
      return {
        content: `
          async () => {
            const App = (await import(${JSON.stringify(path.resolve(import.meta.dirname, "../../../src/client/App.tsx"))})).default
            return <App
              base=${JSON.stringify(config.basePath)}
              url=${JSON.stringify(param.resolvedPath.replace(new RegExp(`^${config.internal.srcDir}/`), "").replace(/\.md$/, ""))}
            />)
          }
        `,
        moduleType: "tsx",
      }
    },
  }
})

export const prerenderPluginTransform: FarmJSPlugin = () => ({
  name: "syo prerender plugin (transformer)",
  priority: 97,
  transform: {
    filters: { resolvedPaths: ["\\.mdx?\\?html$"] },
    async executor(param) {
      return {
        moduleType: "html",
        content: "<!DOCTYPE html>"
        + renderToString((new Function("return " + param.content) as () => JSX.Element))
      }
    },
  }
})
