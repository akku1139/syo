import * as v from "valibot"

export const ConfigSchema =
  v.object({
    title: v.string()
  })

export type Config = v.InferOutput<typeof ConfigSchema>

export const defineConfig: {
  (config: Config): Config
} = config => config
