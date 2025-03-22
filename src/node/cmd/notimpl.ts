import { logger } from "@farmfe/core"
import type { Command } from "../types.ts"

export const notImpl: Command = async () => {
  logger.error("This command is not implemented yet.")
}
