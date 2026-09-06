import { z } from "zod";
import { resolveSchema } from "../lib/utils.ts";

export const pagination = resolveSchema(
  z
    .object({
      start: z.string().meta({ xpath: "//a[@class='btn__pager__prev--all']/text()" }),
      previous: z.string().meta({ xpath: "//a[@class='btn__pager__prev']/text()" }),
      current: z
        .string()
        .regex(/(\d+)/g)
        .transform((val) => Number(val.match(/(\d+)/g)?.[1].trim() ?? 0))
        .pipe(z.number())
        .meta({
          xpath: "//a[@class='btn__pager__current']/text()",
        }),
      pages: z
        .string()
        .regex(/(\d+)/g)
        .transform((val) => Number(val.match(/(\d+)/g)?.[1].trim() ?? 0))
        .pipe(z.number())
        .meta({
          xpath: "//a[@class='btn__pager__current']/text()",
        }),
      next: z.string().meta({ xpath: "//a[@class='btn__pager__next']/text()" }),
      end: z.string().meta({ xpath: "//a[@class='btn__pager__next--all']/text()" }),
    })
    .meta({ xpath: "//ul[@class='btn__pager']" })
);
