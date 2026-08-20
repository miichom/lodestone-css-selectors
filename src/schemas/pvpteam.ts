import { z } from "zod";
import { selector } from "../utils.ts";
import { Datacenter, Region } from "./metadata.ts";

// /lodestone/pvpteam/{id}
export const profile = z.object({
  name: z
    .string()
    .meta(selector({ xpath: "//h2[@class='entry__pvpteam__name--team']" })),
  dcname: z
    .string()
    .meta(selector({ xpath: "//p[@class='entry__pvpteam__name--dc']" })),
  crest: z.array(z.url()).meta(
    selector({
      xpath: "//div[@class='entry__pvpteam__crest__image']/img",
      attribute: "src",
    })
  ),
  members: z
    .array(
      z.object({
        id: z
          .string()
          .meta(
            selector({ xpath: "/a[@class='entry__bg']", attribute: "href" })
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
            regex: /lodestone\/character\/(\S+)\//,
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
                xpath:
                  "//ul[contains(@class, 'info')]/li/img[not(@class)]/following-sibling::span",
              })
            ),
            icon: z.url().meta(
              selector({
                xpath:
                  "//ul[contains(@class, 'info')]/li[span]/img[not(@class)]",
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
        matches: z.coerce
          .number()
          .optional()
          .meta(
            selector({
              xpath:
                "//ul[contains(@class, '__info')]/li/img[contains(@class, 'entry__pvpteam__battle__icon')]/following-sibling::span",
            })
          ),
      })
    )
    .meta(
      selector({
        xpath: "//div[@class='pvpteam__member']/div[@class='entry']",
      })
    ),
  formed: z.coerce
    .date()
    .meta(
      selector({ xpath: "//span[@class='entry__pvpteam__data--formed']/span" })
    ),
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
export const entries = z
  .array(
    z.object({
      id: z.string().meta(
        selector({
          xpath: "/a",
          attribute: "href",
          regex: /lodestone\/pvpteam\/(\S+)\//,
        })
      ),
      name: z.string().meta(selector({ xpath: "//p[@class='entry__name']" })),
      dcname: z
        .string()
        .meta(selector({ xpath: "//p[@class='entry__world']" })),
      crest: z.array(z.url()).meta(
        selector({
          xpath: "//div[@class='entry__pvpteam__search__crest__image']/img",
          attribute: "src",
        })
      ),
    })
  )
  .meta(
    selector({ xpath: "//div[@class='ldst__window']//div[@class='entry']" })
  );
