import { z } from "zod";
import { selector } from "../utils.ts";
import { Datacenter, Region } from "./metadata.ts";

// /lodestone/linkshell/{id}
export const profile = z.object({
  name: z
    .string()
    .meta(selector({ xpath: "//h3[@class='heading__linkshell__name']" })),
  icon: z.url().meta(
    selector({
      xpath: "//div[@class='heading__linkshell__icon']/img",
      attribute: "src",
    })
  ),
  members: z
    .array(
      z.object({
        id: z.string().meta(
          selector({
            xpath: "/a[@class='entry__link']",
            attribute: "href",
            regex: /lodestone\/character\/(\S+)\//,
          })
        ),
        name: z.string().meta(selector({ xpath: "//p[@class='entry__name']" })),
        avatar: z.url().meta(
          selector({
            xpath: "//div[@class='entry__chara__face']/img",
            attribute: "src",
          })
        ),
        worldname: z.string().meta(
          selector({
            xpath: "//p[@class='entry__world']",
            regex: /(\w+) \[\w+\]/,
          })
        ),
        dcname: z.string().meta(
          selector({
            xpath: "//p[@class='entry__world']",
            regex: /\w+ \[(\w+)\]/,
          })
        ),
        rank: z
          .object({
            name: z.string().meta(
              selector({
                xpath: "//div[@class='entry__chara_info__linkshell']/span",
              })
            ),
            icon: z.url().meta(
              selector({
                xpath: "//div[@class='entry__chara_info__linkshell']/img",
                attribute: "src",
              })
            ),
          })
          .optional(),
        grandcompany: z
          .object({
            name: z.string().meta(
              selector({
                xpath: "//li[@class='js__tooltip']",
                attribute: "data-tooltip",
                regex: /(\D+) \/ \D+/,
              })
            ),
            rank: z.object({
              name: z.string().meta(
                selector({
                  xpath: "//li[@class='js__tooltip']",
                  attribute: "data-tooltip",
                  regex: /\D+ \/ (\D+)/,
                })
              ),
              icon: z.url().meta(
                selector({
                  xpath: "//li[@class='js__tooltip']/img",
                  attribute: "src",
                })
              ),
            }),
          })
          .optional(),
        freecompany: z
          .object({
            id: z.string().meta(
              selector({
                xpath: "/a[@class='entry__freecompany__link']",
                attribute: "href",
                regex: /lodestone\/freecompany\/(\S+)\//,
              })
            ),
            name: z.string().meta(
              selector({
                xpath: "/a[@class='entry__freecompany__link']/span",
              })
            ),
            crest: z.array(z.url()).meta(
              selector({
                xpath: "/a[@class='entry__freecompany__link']//img",
                attribute: "src",
              })
            ),
          })
          .optional(),
      })
    )
    .meta(
      selector({ xpath: "//div[@class='ls__member']/div[@class='entry']" })
    ),
});

export const query = z.object({
  q: z.string(),
  cf_public: z.boolean().optional(),
  worldname: z
    .union([
      z.enum(Region),
      z.enum(Datacenter),
      z.string().regex(/^[A-Za-z]+$/),
    ])
    .optional(),
  character_count: z.enum(["1-10", "11-30", "31-50", "51-"]).optional(),
  order: z.number().min(1).max(6).optional(),
  page: z.number().min(1).max(20).optional(),
});

// /lodestone/linkshell?q=...
export const entries = z
  .array(
    z.object({
      id: z.string().meta(
        selector({
          xpath: "/a",
          attribute: "href",
          regex: /lodestone\/linkshell\/(\S+)\//,
        })
      ),
      name: z.string().meta(selector({ xpath: "//p[@class='entry__name']" })),
      worldname: z.string().meta(
        selector({
          xpath: "//p[@class='entry__world']",
          regex: /(\w+) \[\w+\]/,
        })
      ),
      dcname: z.string().meta(
        selector({
          xpath: "//p[@class='entry__world']",
          regex: /\w+ \[(\w+)\]/,
        })
      ),
      members: z.coerce
        .number()
        .meta(
          selector({ xpath: "//div[@class='entry__linkshell__member']//span" })
        ),
    })
  )
  .meta(
    selector({ xpath: "//div[@class='ldst__window']//div[@class='entry']" })
  );
