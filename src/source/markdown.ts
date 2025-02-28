import { codeToHtml } from "shiki"
import { transformerTwoslash } from "@shikijs/twoslash"
import type { PageData, SourceProcessor } from "../types.ts"
import { Marked } from "marked"
import { escapeHTML } from "../utils/escape.ts"

export const markdownProcessor: SourceProcessor = async (source: string) => {
  let title: string = ""
  const toc: PageData["toc"] = []

  const marked = new Marked({
    async: true,
    gfm: true,
    renderer: {
      heading(token) {
        const text = this.parser.parseInline(token.tokens)
        const id = escapeHTML(text.replaceAll(" ", "-"))
        if(title === "") {
          title = token.text
        }
        toc.push([id, text])
        return `<h${token.depth} id="${id}">${text}</h${token.depth}>\n`;
      }
    },
    async walkTokens(token) {
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
            theme: "github-light",
            transformers: [
              ...(l[1] === "twoslash" ? [transformerTwoslash()] : [])
            ]
          })
        })
      }
    },
  })

  const content = await marked.parse(source)

  return { content, title, toc }
}
