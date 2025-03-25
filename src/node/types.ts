import type { JsPlugin } from "@farmfe/core"
import type { ParsedConfig } from "./utils/config.ts"
import type { JSX } from "solid-js"

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
  config: ParsedConfig
  /** [URL path, file name] */
  routes: Array<[
    string,
    string
  ]>
}) => JsPlugin

export type Command = (userConfig: ParsedConfig, args: Array<string>) => Promise<void>

export type App = (props?: Partial<{
  url: string
  base: string
  entry: string
}>) => JSX.Element
