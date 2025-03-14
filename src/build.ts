// import * as fs from "node:fs/promises"
import * as fsSync from "node:fs"
import { type Config } from "./config.ts"
import { build as farmBuild } from "@farmfe/core"
import { markdownPlugin } from "./farm-plugins/markdown.ts"

export const build = async (config: Config): Promise<void> => {
  const srcDir = config.srcDir ?? "docs"
  // const srcs = fs.glob(`${srcDir}/**/*.md`)
  const srcs = fsSync.globSync(`${srcDir}/**/*.md`)

  await farmBuild({
    compilation: {
      input: Object.fromEntries(srcs.map(src => {
        return [
          src.replace(new RegExp(`^${srcDir}/`), "").replace(/\.md$/, ""),
          src,
        ]
      })),
    },
    outDir: config.distDir ?? "docs-dist",
    plugins: [
      markdownPlugin,
    ]
  })
}

// export const build = async (config: Config): Promise<void> => {
//   const srcDir = config.srcDir ?? "docs"
//   const distDir = config.distDir ?? "docs-dist"

//   fs.rm(distDir, { recursive: true, force: true })

//   for await (const entry of fs.glob(`${srcDir}/**/*.md`)) {
//     console.log("file:", entry)
//     const file = (await fs.readFile(entry)).toString()
//     const html = await markdownProcessor(file)
//     await writeFile(entry.replace(new RegExp(`^${srcDir}/`), `${distDir}/`).replace(/\.md$/, ".html"),
// `<!DOCTYPE html>
// <html${config.lang ? `lang="${escapeHTML(config.lang)}"` : ""}>
// <head>
// <meta charset="UTF-8">
// <meta name="viewport" content="width=device-width, initial-scale=1.0">
// <title>${escapeHTML(html.title)} - ${escapeHTML(config.title)}</title>
// <link rel="stylesheet" type="text/css" href="https://esm.sh/@shikijs/twoslash@3.1.0/style-rich.css">
// <link rel="stylesheet" type="text/css" href="https://esm.sh/github-markdown-css@5/github-markdown-light.css">
// <style>
// .markdown-body pre {
// overflow: unset !important; /* fix twoslash */
// }
// </style>
// </head>
// <body>
// <!-- <a href="#_main" >Skip to content</a> -->
// <div>${html.toc.map(e => `<a href="#${e.id}">${escapeHTML(e.title)}</a>`).join("")}</div>
// <main id="_main" class="markdown-body">${html.content}</main>
// </body>
// </html>
// `
//     )
//     await writeFile(
//       entry.replace(new RegExp(`^${srcDir}/`), `${distDir}/_syo/page/`).replace(/\.md$/, ".json"),
//       JSON.stringify(html)
//     )
//   }
// }
