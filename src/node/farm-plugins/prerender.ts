import type { FarmJSPlugin } from "../types.ts"
import * as path from "node:path"
import type { JSX } from "solid-js/jsx-runtime"
import { renderToString } from "solid-js/web"

export const prerenderPlugin: FarmJSPlugin = ({ config }) => ({
  name: "syo prerender plugin",
  load: {
    filters: {
      resolvedPaths: ["\\.mdx?\\?html$"]
    },
    async executor(param) {
      return {
        content: `
          return async () => {
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
  },
  transform: {
    filters: { resolvedPaths: ["\\.mdx?\\?html$"] },
    async executor(param) {
      return {
        moduleType: "html",
        content: "<!DOCTYPE html>"
        + renderToString((new Function(param.content) as () => JSX.Element))
      }
    },
  }
})
