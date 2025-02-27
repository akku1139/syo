import { unified } from "unified"
import markdown from "remark-parse"
import remark2rehype from "remark-rehype"
import rehypeTwoslash from 'rehype-twoslash'
import rehypePrettyCode from "rehype-pretty-code"
import rehypeStringify from "rehype-stringify"
import type { SourceProcessor } from "../types.ts"

const processor = unified()
  .use(markdown)
  .use(remark2rehype)
  .use(rehypeTwoslash)
  .use(rehypePrettyCode)
  .use(rehypeStringify)

export const markdownProcessor: SourceProcessor = async source => (await processor.process(source)).toString()
