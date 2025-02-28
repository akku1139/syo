import { codeToHtml } from "shiki"
import { transformerTwoslash } from "@shikijs/twoslash"
import type { SourceProcessor } from "../types.ts"
import { Marked } from "marked"

export const markdownProcessor: SourceProcessor = async (source: string) => {
  let title: string = ""
  const marked = new Marked({
    async: true,
    gfm: true,
    async walkTokens(token) {
      if(token.type === "heading" && token.depth === 1) {
        title = token.text
      }
      if(token.type === "code") {
        token.text = codeToHtml(token.text, {
          lang: token.lang,
          theme: "vitesse-dark",
          transformers: [
            transformerTwoslash(),
          ]
        })
      }
    },
  })
  const content = await marked.parse(source)

  return {
    content, title
  }
}
