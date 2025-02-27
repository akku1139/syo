import { unified } from "unified"
import markdown from "remark-parse"
import remark2rehype from "remark-rehype"
import html from "rehype-stringify"

export const markdownProcessor = unified()
  .use(markdown)
  .use(remark2rehype)
  .use(html)
