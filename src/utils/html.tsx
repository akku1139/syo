import { escapeHTML } from "./escape.ts"
import type { PageData } from "../types.ts"
import type { Config } from "../config.ts"

export const buildPageHTML = (data: PageData, config: Config) =>
`<!DOCTYPE html>
<html${config.lang ? `lang="${escapeHTML(config.lang)}"` : ""}>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHTML(data.title)} - ${escapeHTML(config.title)}</title>
<link rel="stylesheet" type="text/css" href="https://esm.sh/@shikijs/twoslash@3.1.0/style-rich.css">
<link rel="stylesheet" type="text/css" href="https://esm.sh/github-markdown-css@5/github-markdown-light.css">
<style>
.markdown-body pre {
overflow: unset !important; /* fix twoslash */
}
</style>
</head>
<body>
<!-- <a href="#_main" >Skip to content</a> -->
<div>${data.toc.map(e => `<a href="#${e.id}">${escapeHTML(e.title)}</a>`).join("")}</div>
<main id="_main" class="markdown-body">${data.content}</main>
</body>
</html>
`
