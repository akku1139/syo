import * as fs from "node:fs/promises"
import type { FarmJSPlugin, InternalConfig } from "../types.ts"

export const getRoutes = async (config: InternalConfig, ): Promise<Parameters<FarmJSPlugin>[0]["routes"]> => {
  const srcs = await Array.fromAsync(fs.glob(`${config.internal.srcDir}/**/*.md`))
  return srcs.map(src => {
    return [
      src.replace(new RegExp(`^${config.internal.srcDir}/`), "").replace(/\.md$/, ""),
      src,
    ]
  })
}
