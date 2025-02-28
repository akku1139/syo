import * as fs from "node:fs/promises"
import * as path from "node:path"
import { type Config } from "./config.ts"
import { escapeHTML } from "./utils/escape.ts"

import { markdownProcessor } from "./source/markdown.ts"

const writeFile = async (filename: string, content: string) => {
  await fs.mkdir(path.dirname(filename), { recursive: true })
  await fs.writeFile(filename, content)
}

export const build = async (config: Config): Promise<void> => {
  const srcDir = config.srcDir ?? "docs"
  const distDir = config.distDir ?? "docs-dist"

  fs.rm(distDir, { recursive: true, force: true })

  for await (const entry of fs.glob(`${srcDir}/**/*.md`)) {
    console.log("file:", entry)
    const file = (await fs.readFile(entry)).toString()
    const html = await markdownProcessor(file)
    await writeFile(entry.replace(new RegExp(`^${srcDir}/`), `${distDir}/`).replace(/\.md$/, ".html"),
`<!DOCTYPE html>
<html${config.lang ? `lang="${escapeHTML(config.lang)}"` : ""}>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHTML(html.title)} - ${escapeHTML(config.title)}</title>
<link rel="stylesheet" type="text/css" href="https://esm.sh/@wooorm/starry-night@3/style/both.css">
<link rel="stylesheet" type="text/css" href="https://esm.sh/github-markdown-css@5/github-markdown.css">
</head>
<body><main class="markdown-body">${html.content}</main></body>
</html>
`
    )
    await writeFile(
      entry.replace(new RegExp(`^${srcDir}/`), `${distDir}/_assets/page/`).replace(/\.md$/, ".json"),
      JSON.stringify(html)
    )
  }
}
