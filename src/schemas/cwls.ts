import { z } from "zod";
import { Datacenter, Region } from "../lib/models.ts";
import { resolveSchema } from "../lib/utils.ts";

// /lodestone/crossworld_linkshell/{id}
export const profile = resolveSchema(
  z.object({
    name: z
      .string()
      .meta({ xpath: "//h3[@class='heading__linkshell__name']/text()" }),
    dcname: z
      .string()
      .meta({ xpath: "//span[@class='heading__cwls__dcname']/text()" }),
    icon: z.url().meta({
      xpath: "//div[@class='heading__linkshell__icon']/img/@src",
    }),
    members: z
      .array(
        z.object({
          id: z
            .string()
            .regex(/lodestone\/character\/(\d+)\//)
            .transform(
              (val) =>
                val.match(/lodestone\/character\/(\d+)\//)?.[1].trim() ??
                val.trim()
            )
            .meta({
              xpath: "/a[@class='entry__link']/@href",
            }),
          name: z.string().meta({ xpath: "//p[@class='entry__name']/text()" }),
          avatar: z.url().meta({
            xpath: "//div[@class='entry__chara__face']/img/@src",
          }),
          worldname: z
            .string()
            .regex(/(\w+) \[\w+\]/)
            .transform(
              (val) => val.match(/(\w+) \[\w+\]/)?.[1].trim() ?? val.trim()
            )
            .meta({
              xpath: "//p[@class='entry__world']/text()",
            }),
          dcname: z
            .string()
            .regex(/\w+ \[(\w+)\]/)
            .transform(
              (val) => val.match(/\w+ \[(\w+)\]/)?.[1].trim() ?? val.trim()
            )
            .meta({
              xpath: "//p[@class='entry__world']/text()",
            }),
          rank: z
            .object({
              name: z.string().meta({
                xpath:
                  "//div[@class='entry__chara_info__linkshell']/span/text()",
              }),
              icon: z.url().meta({
                xpath: "//div[@class='entry__chara_info__linkshell']/img/@src",
              }),
            })
            .optional(),
          grandcompany: z
            .object({
              name: z
                .string()
                .regex(/(\w+) \/ \w+/)
                .meta({
                  xpath: "//li[@class='js__tooltip']/@data-tooltip",
                }),
              rank: z.object({
                name: z
                  .string()
                  .regex(/\w+ \/ (\w+)/)
                  .meta({
                    xpath: "//li[@class='js__tooltip']/@data-tooltip",
                  }),
                icon: z.url().meta({
                  xpath: "//li[@class='js__tooltip']/img/@src",
                }),
              }),
            })
            .optional(),
          freecompany: z
            .object({
              id: z
                .string()
                .regex(/lodestone\/freecompany\/(\d+)\//)
                .transform(
                  (val) =>
                    val.match(/lodestone\/freecompany\/(\d+)\//)?.[1].trim() ??
                    val.trim()
                )
                .meta({
                  xpath: "/a[@class='entry__freecompany__link']/@href",
                }),
              name: z.string().meta({
                xpath: "/a[@class='entry__freecompany__link']/span/text()",
              }),
              crest: z.array(z.url()).meta({
                xpath: "/a[@class='entry__freecompany__link']//img/@src",
              }),
            })
            .optional(),
        })
      )
      .meta({
        xpath: "//div[@class='ls__member']/div[@class='entry']",
      }),
    formed: z.coerce
      .date()
      .meta({ xpath: "//span[@class='heading__cwls__formed']/span" }),
  })
);

export const query = z.object({
  q: z.string(),
  cf_public: z.boolean().optional(),
  worldname: z
    .union([z.enum(Region), z.enum(Datacenter), z.string()])
    .optional(),
  character_count: z.enum(["1-10", "11-30", "31-50", "51-"]).optional(),
  order: z.number().min(1).max(6).optional(),
  page: z.number().min(1).max(20).optional(),
});

// /lodestone/crossworld_linkshell?q=...
export const entries = resolveSchema(
  z
    .array(
      z.object({
        id: z
          .string()
          .regex(/lodestone\/crossworld_linkshell\/(\S+)\//)
          .transform(
            (val) =>
              val
                .match(/lodestone\/crossworld_linkshell\/(\S+)\//)?.[1]
                .trim() ?? val.trim()
          )
          .meta({
            xpath: "/a[@class='entry__link--line']/@href",
          }),
        name: z.string().meta({ xpath: "//p[@class='entry__name']/text()" }),
        dcname: z.string().meta({ xpath: "//p[@class='entry__world']/text()" }),
        members: z.coerce.number().meta({
          xpath: "//div[@class='entry__linkshell__member']//span/text()",
        }),
      })
    )
    .meta({
      xpath: "//div[@class='ldst__window']//div[@class='entry']",
    })
);
