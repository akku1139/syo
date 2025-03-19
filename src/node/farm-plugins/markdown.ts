import * as fs from "node:fs/promises"
import * as fsSync from "node:fs"

import { codeToHtml } from "shiki"
import { transformerTwoslash } from "@shikijs/twoslash"
import type { FarmJSPlugin, PageData, SourceProcessor } from "../types.ts"
import { Marked } from "marked"
import { escapeHTML } from "../utils/escape.ts"
import { buildPageHTML } from "../utils/html.ts"
import { frontmatter } from "../utils/frontmatter.ts"

// TODO: use solid-router
const compileMarkdown: SourceProcessor = async (source) => {
  // TODO: title from frontmatter
  let title: string = ""
  const toc: PageData["toc"] = []

  const marked = new Marked({
    async: true,
    gfm: true,
    hooks: {
      preprocess(md) {
        return frontmatter(md).body
      }
    },
    renderer: {
      heading(token) {
        const text = this.parser.parseInline(token.tokens)
        const id = escapeHTML(text.replaceAll(" ", "-"))
        if(title === "") {
          title = token.text
        }
        toc.push({id, title: text, depth: token.depth})
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

  return { content, title, toc, layout: "doc" }
}

export const markdownJSPlugin: FarmJSPlugin = ({ config }) => ({
  name: "syo markdown to js plugin",
  load: {
    filters: { resolvedPaths: ["\\.md?js$"] },
    async executor(param) {
      if (param.query.length === 0 && fsSync.existsSync(param.resolvedPath)) {
        const content = (await fs.readFile(param.resolvedPath)).toString()
        return {
          content,
          moduleType: "markdown",
        }
      }

      return null
    }
  },
  transform: {
    filters: {
      moduleTypes: ["markdown"]
    },
    async executor(param, _ctx) {
      const content = `
      export default ${JSON.stringify(buildPageHTML(await compileMarkdown(param.content), config))}
      `
      return {
        content,
        moduleType: "js",
      }
    }
  }
})

export const markdownHTMLPlugin: FarmJSPlugin = ({ config }) => ({
  name: "syo markdown to html plugin",
  load: {
    filters: { resolvedPaths: ["\\.md$"] },
    async executor(param) {
      if (param.query.length === 0 && fsSync.existsSync(param.resolvedPath)) {
        const content = (await fs.readFile(param.resolvedPath)).toString()
        return {
          content,
          moduleType: "markdown",
        }
      }

      return null
    }
  },
  transform: {
    filters: {
      moduleTypes: ["markdown"]
    },
    async executor(param, _ctx) {
      const content = buildPageHTML(await compileMarkdown(param.content), config)
      return {
        content,
        moduleType: "html",
      }
    }
  }
})
