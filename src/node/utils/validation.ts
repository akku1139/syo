import * as v from "valibot"

export const portNumber = (i: unknown) => v.parse(v.optional(
  v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(65535))
), i)
