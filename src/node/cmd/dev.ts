import type { Command } from "../types.ts"
import { notImpl } from "./notimpl.ts"

export const devServer: Command = async (config, args) => {
  return notImpl(config, args)
}
