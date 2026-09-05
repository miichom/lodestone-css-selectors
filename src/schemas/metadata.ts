import { z } from "zod";
import { resolveSchema } from "../lib/utils.ts";

export const pagination = resolveSchema(
  z
    .object({
      start: z.string().meta({ xpath: "//a[@class='btn__pager__prev--all']" }),
      previous: z.string().meta({ xpath: "//a[@class='btn__pager__prev']" }),
      current: z
        .string()
        .regex(/(\d+)/g)
        .transform((val) => Number(val.match(/(\d+)/g)?.[1].trim() ?? 0))
        .pipe(z.number())
        .meta({
          xpath: "//a[@class='btn__pager__current']",
        }),
      pages: z
        .string()
        .regex(/(\d+)/g)
        .transform((val) => Number(val.match(/(\d+)/g)?.[1].trim() ?? 0))
        .pipe(z.number())
        .meta({
          xpath: "//a[@class='btn__pager__current']",
        }),
      next: z.string().meta({ xpath: "//a[@class='btn__pager__next']" }),
      end: z.string().meta({ xpath: "//a[@class='btn__pager__next--all']" }),
    })
    .meta({ xpath: "//ul[@class='btn__pager']" })
);
