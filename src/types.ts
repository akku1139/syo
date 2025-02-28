export type PageData = {
  title: string,
  toc: Array<[string, string]>, // id, innerText
  content: string,
}

export type SourceProcessor = (sourceText: string) => PageData | Promise<PageData>
