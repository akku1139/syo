export type PageData = {
  title: string
  toc: Array<{
    title: string
    id: string
    depth: number
  }>
  content: string
  layout: "doc"
}

export type SourceProcessor = (sourceText: string) => PageData | Promise<PageData>
