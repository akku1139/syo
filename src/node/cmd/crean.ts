import type { Command } from "../types.ts"
import { clean as farmClean } from "@farmfe/core"

export const crean: Command = async (config, args) => {

  await farmClean()

}
