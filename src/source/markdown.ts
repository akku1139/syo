import { unified } from "unified"
import markdown from "remark-parse"
import remark2rehype from "remark-rehype"
import html from "rehype-stringify"
import type { SourceHandler } from "../types.ts"

const processor = unified()
  .use(markdown)
  .use(remark2rehype)
  .use(html)

export const markdownProcessor: SourceHandler = async source => (await processor.process(source)).toString()
