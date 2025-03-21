import type { JsPlugin } from "@farmfe/core"
import type { Config } from "./config.ts"

export type PageData = {
  title: string
  toc: Array<{
    title: string
    id: string
    depth: number
  }>
  content: string
  layout: "doc"
}

export type SourceProcessor = (sourceText: string) => PageData | Promise<PageData>
export type FarmJSPlugin = (args: {
  config: InternalConfig
  /** [URL path, file name] */
  routes: Array<[
    string,
    string
  ]>
}) => JsPlugin

export type InternalConfig = Config & {
  internal: {
    srcDir: string
  }
}
