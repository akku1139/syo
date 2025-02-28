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
      if(token.type === "code" && typeof token.lang === "string" ) {
        const l = token.lang.split(" ")
        const lang = l[0] ?? ""

        // https://github.com/bent10/marked-extensions/blob/dc2b53f4067418ec71ea0e75f07d2ac7af05219b/packages/shiki/src/index.ts#L52-L57
        // transforms token to html
        Object.assign(token, {
          type: "html",
          block: true,
          text: await codeToHtml(token.text, {
            lang,
            theme: "vitesse-dark",
            transformers: [
              ...(l[1] === "twoslash" ? [transformerTwoslash()] : [])
            ]
          })
        })
      }
    },
  })
  const content = await marked.parse(source)

  return {
    content, title
  }
}
