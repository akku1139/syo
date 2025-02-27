import * as v from "valibot"

export const ConfigSchema =v.object({
  title: v.string(),
  srcDir: v.nullish(v.string(), "docs"),
  distDir: v.nullish(v.string(), "docs-dist"),
})

export type Config = v.InferOutput<typeof ConfigSchema>

export const defineConfig: {
  (config: Config): Config
} = config => config
