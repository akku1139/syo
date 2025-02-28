import type { SourceProcessor } from "../types.ts"
import { Marked } from "marked"

export const markdownProcessor: SourceProcessor = async (source: string) => {
  let title: string = ""
  const marked = new Marked({
    gfm: true,
    walkTokens(token) {
      if(token.type === "heading" && token.depth === 1) {
        title = token.text
      }
    }
  })
  const content = await marked.parse(source)

  return {
    content, title
  }
}
