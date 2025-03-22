/**
 * Hack!
 */

import type { FarmJSPlugin } from "../types.ts"
import * as path from "node:path"
import * as process from "node:process"
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
              url=${JSON.stringify(param.resolvedPath.replace(new RegExp(`^${path.join(process.cwd(), config.internal.srcDir)}/`), config.basePath).replace(/\.md$/, ""))}
            />
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
      const code = 'async () => { const { "_$createComponent": createComponent } = await import("solid-js/web"); return '+param.content.replace(/.*\n/, "")+"}"
      return {
        moduleType: "html",
        content: "<!DOCTYPE html>"
        + renderToString((new Function("return " + code) as () => JSX.Element))
      }
    },
  }
})
