import * as v from "valibot"

export const ConfigSchema =v.object({
  title: v.string(),
  description: v.optional(v.string()),
  lang: v.optional(v.string()),
  srcDir: v.optional(v.string()),
  distDir: v.optional(v.string()),
  basePath: v.optional(v.union([
    v.pipe(v.string(), v.startsWith("/")),
    v.pipe(v.string(), v.url()),
  ]))
})
/* Bug?
type Config = {
    title: string;
    description?: string | undefined;
    lang?: string | undefined;
    srcDir: string;  // v.optional(v.string(), "docs"),
    distDir: string; // v.optional(v.string(), "docs-dist"),
}
*/

export type Config = v.InferOutput<typeof ConfigSchema>

export const defineConfig: {
  (config: Config): Config
} = config => config
