import { parse as parseYAML } from "yaml"
import * as v from "valibot"

const fmRegExp = /^---\n(.*?\n)?---\n+/s

export const frontmatter = <T extends Parameters<typeof v.parse>[0]>(doc: string, schema?: T): {
  props: v.InferOutput<T>
  body: string
} => {
  let props: v.InferOutput<T> = {}

  const fm = doc.match(fmRegExp)
  if(fm && fm[1]) {
    props = parseYAML(fm[1])
  }

  if(schema) {
    props = v.parse(schema, props)
  }

  return {
    props,
    body: doc.replace(fmRegExp, ""),
  }
}
