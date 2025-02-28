export type PageData = {
  title: string,
  content: string
}

export type SourceProcessor = (sourceText: string) => PageData | Promise<PageData>
