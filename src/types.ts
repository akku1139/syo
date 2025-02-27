export type SourceHandler = (sourceText: string) => string | Promise<string>
export type OutputHandler = (html: string) => string
