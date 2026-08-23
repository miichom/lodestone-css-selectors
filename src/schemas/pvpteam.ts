import { z } from "zod";
import { Datacenter, Region } from "../models.ts";
import { resolveSchema } from "../utils.ts";

// /lodestone/pvpteam/{id}
export const profile = z.object({
  name: z.string().meta({ xpath: "//h2[@class='entry__pvpteam__name--team']" }),
  dcname: z.string().meta({ xpath: "//p[@class='entry__pvpteam__name--dc']" }),
  crest: z.array(z.url()).meta({
    xpath: "//div[@class='entry__pvpteam__crest__image']/img",
    attribute: "src",
  }),
  members: z
    .array(
      z.object({
        id: z.string().meta({
          xpath: "/a[@class='entry__bg']",
          attribute: "href",
        }),
        name: z.string().meta({ xpath: "//p[@class='entry__name']" }),
        avatar: z.url().meta({
          xpath: "//div[@class='entry__chara__face']/img",
          attribute: "src",
        }),
        worldname: z
          .string()
          .regex(/(\w+) \[\w+\]/)
          .transform(
            (val) => val.match(/(\w+) \[\w+\]/)?.[1].trim() ?? val.trim()
          )
          .meta({
            xpath: "//p[@class='entry__world']",
          }),
        dcname: z
          .string()
          .regex(/\w+ \[(\w+)\]/)
          .transform(
            (val) => val.match(/\w+ \[(\w+)\]/)?.[1].trim() ?? val.trim()
          )
          .meta({
            xpath: "//p[@class='entry__world']",
          }),
        rank: z
          .object({
            name: z.string().meta({
              xpath:
                "//ul[contains(@class, 'info')]/li/img[not(@class)]/following-sibling::span",
            }),
            icon: z.url().meta({
              xpath: "//ul[contains(@class, 'info')]/li[span]/img[not(@class)]",
              attribute: "src",
            }),
          })
          .optional(),
        grandcompany: z
          .object({
            name: z
              .string()
              .regex(/(\w+) \/ \w+/)
              .transform(
                (val) => val.match(/(\w+) \/ \w+/)?.[1].trim() ?? val.trim()
              )
              .meta({
                xpath: "//li[@class='js__tooltip']",
                attribute: "data-tooltip",
              }),
            rank: z.object({
              name: z
                .string()
                .regex(/\w+ \/ (\w+)/)
                .transform(
                  (val) => val.match(/\w+ \/ (\w+)/)?.[1].trim() ?? val.trim()
                )
                .meta({
                  xpath: "//li[@class='js__tooltip']",
                  attribute: "data-tooltip",
                }),
              icon: z.url().meta({
                xpath: "//li[@class='js__tooltip']/img",
                attribute: "src",
              }),
            }),
          })
          .optional(),
        matches: z.coerce.number().optional().meta({
          xpath:
            "//ul[contains(@class, '__info')]/li/img[contains(@class, 'entry__pvpteam__battle__icon')]/following-sibling::span",
        }),
      })
    )
    .meta({
      xpath: "//div[@class='pvpteam__member']/div[@class='entry']",
    }),
  formed: z.string().pipe(z.coerce.date()).meta({
    xpath: "//span[@class='entry__pvpteam__data--formed']/span",
  }),
});

export const query = z.object({
  q: z.string(),
  cf_public: z.boolean().optional(),
  worldname: z
    .union([z.enum(Region), z.enum(Datacenter), z.string()])
    .optional(),
  order: z.number().min(1).max(4).optional(),
  page: z.number().min(1).max(20).optional(),
});

// /lodestone/pvpteam?q=...
export const entries = resolveSchema(
  z
    .array(
      z.object({
        id: z
          .string()
          .regex(/lodestone\/pvpteam\/(\S+)\//)
          .transform(
            (val) =>
              val.match(/lodestone\/pvpteam\/(\S+)\//)?.[1].trim() ?? val.trim()
          )
          .meta({
            xpath: "/a",
            attribute: "href",
          }),
        name: z.string().meta({ xpath: "//p[@class='entry__name']" }),
        dcname: z.string().meta({ xpath: "//p[@class='entry__world']" }),
        crest: z.array(z.url()).meta({
          xpath: "//div[@class='entry__pvpteam__search__crest__image']/img",
          attribute: "src",
        }),
      })
    )
    .meta({
      xpath: "//div[@class='ldst__window']//div[@class='entry']",
    })
);
