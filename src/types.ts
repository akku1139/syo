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
export type FarmSourcePlugin = (config: Config) => JsPlugin
