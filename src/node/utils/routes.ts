import * as fs from "node:fs/promises"
import type { FarmJSPlugin } from "../types.ts"
import type { ParsedConfig } from "./config.ts"

export const getRoutes = async (config: ParsedConfig): Promise<Parameters<FarmJSPlugin>[0]["routes"]> => {
  const srcs = await Array.fromAsync(fs.glob(`${config.srcDir}/**/*.md`))
  return srcs.map(src => {
    return [
      src.replace(new RegExp(`^${config.srcDir}/`), "").replace(/\.md$/, ""),
      src,
    ]
  })
}
