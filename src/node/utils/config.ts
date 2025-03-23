import type { Config } from "../config.ts"
import type { InternalConfig } from "../types.ts"

export const getInternalConfig = (userConfig: Config): InternalConfig => {
  return {
    ...userConfig,
    internal: {
      srcDir: userConfig.srcDir ?? "pages",
      basePath: userConfig.basePath ?? "/",
      distDir: userConfig.distDir ?? "dist"
    }
  }
}
