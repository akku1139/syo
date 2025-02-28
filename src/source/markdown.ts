import type { SourceProcessor } from "../types.ts"
import { Marked } from "marked"

const marked = new Marked()

export const markdownProcessor: SourceProcessor = marked.parse
