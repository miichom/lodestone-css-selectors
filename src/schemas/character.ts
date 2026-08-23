import { z } from "zod";
import { Class, Datacenter, Job, Race, Region, Tribe } from "../models.ts";
import { resolveSchema } from "../utils.ts";

// /lodestone/character/{id}
export const profile = resolveSchema(
  z.object({
    name: z.string().meta({ xpath: "//p[@class='frame__chara__name']" }),
    avatar: z.url().meta({
      xpath: "//div[@class='frame__chara__face']/img",
      attribute: "src",
    }),
    worldname: z
      .string()
      .regex(/(\w+) \[\w+\]/)
      .transform((val) => val.match(/(\w+) \[\w+\]/)?.[1].trim() as string)
      .meta({
        xpath: "//p[@class='entry__freecompany__gc'][2]",
      }),
    dcname: z
      .string()
      .regex(/\w+ \[(\w+)\]/)
      .transform((val) => val.match(/\w+ \[(\w+)\]/)?.[1].trim() as string)
      .meta({
        xpath: "//p[@class='entry__freecompany__gc'][2]",
      }),
    portrait: z
      .url()
      .meta({
        xpath: "//div[@class='character__detail__image']//img",
        attribute: "src",
      })
      .optional(),
    title: z.string().meta({ xpath: "//p[@class='frame__chara__title']" }),
    bio: z
      .string()
      .meta({ xpath: "//div[@class='character__selfintroduction']" }),
    race: z
      .string()
      .regex(new RegExp(`^(${Object.keys(Race).join("|")})`))
      .transform(
        (val) =>
          val.match(new RegExp(`^(${Object.keys(Race).join("|")})`))?.[1] ??
          val.trim()
      )
      .meta({
        xpath:
          "//div[@class='character__profile__data__detail']/div//p[@class='character-block__name']",
      }),
    clan: z
      .string()
      .regex(
        new RegExp(
          `^(${Object.keys(Race).join("|")})\\s*(${Object.keys(Tribe).join("|")})`
        )
      )
      .transform(
        (val) =>
          val.match(
            new RegExp(
              `^(${Object.keys(Race).join("|")})\\s*(${Object.keys(Tribe).join("|")})`
            )
          )?.[2] as string
      )
      .meta({
        xpath:
          "//div[@class='character__profile__data__detail']/div//p[@class='character-block__name']",
      }),
    gender: z
      .string()
      .transform((val) => (val.includes("♀") ? "Female" : "Male"))
      .meta({
        xpath:
          "//div[@class='character__profile__data__detail']/div[1]//p[@class='character-block__name']",
      }),
    nameday: z.string().meta({ xpath: "//p[@class='character-block__birth']" }),
    guardian: z.string().meta({
      xpath:
        "//div[@class='character__profile__data__detail']/div[2]//p[@class='character-block__name']",
    }),
    citystate: z.string().meta({
      xpath:
        "//div[@class='character__profile__data__detail']/div[3]//p[@class='character-block__name']",
    }),
    grandcompany: z
      .object({
        name: z
          .string()
          .regex(/(\w+) \/ \w+/)
          .transform(
            (val) => val.match(/(\w+) \/ \w+/)?.[1].trim() ?? val.trim()
          )
          .meta({
            xpath:
              "//div[@class='character__profile__data__detail']/div[4]//p[@class='character-block__name']",
          }),
        rank: z.object({
          name: z
            .string()
            .regex(/\w+ \/ (\w+)/)
            .transform(
              (val) => val.match(/\w+ \/ (\w+)/)?.[1].trim() ?? val.trim()
            )
            .meta({
              xpath:
                "//div[@class='character__profile__data__detail']/div[4]//p[@class='character-block__name']",
            }),
          icon: z.url().meta({
            xpath:
              "//div[@class='character__profile__data__detail']/div[4]/img",
            attribute: "src",
          }),
        }),
      })
      .optional(),
    freecompany: z
      .object({
        id: z
          .string()
          .regex(/lodestone\/freecompany\/(\S+)\//)
          .transform(
            (val) =>
              val.match(/lodestone\/freecompany\/(\S+)\//)?.[1].trim() ??
              val.trim()
          )
          .meta({
            xpath: "//div[@class='character__freecompany__name']//a",
            attribute: "href",
          }),
        name: z.string().meta({
          xpath: "//div[@class='character__freecompany__name']//a",
        }),
        crest: z.url().array().meta({
          xpath: "//div[@class='character__freecompany__crest']//img",
          attribute: "src",
        }),
      })
      .optional(),
    pvpteam: z
      .object({
        id: z
          .string()
          .regex(/lodestone\/pvpteam\/(\S+)\//)
          .transform(
            (val) =>
              val.match(/lodestone\/pvpteam\/(\S+)\//)?.[1].trim() ?? val.trim()
          )
          .meta({
            xpath: "//div[@class='character__pvpteam__name']//a",
            attribute: "href",
          }),
        name: z.string().meta({
          xpath: "//div[@class='character__pvpteam__name']//a",
        }),
        crest: z.url().array().meta({
          xpath: "//div[@class='character__pvpteam__crest']//img",
          attribute: "src",
        }),
      })
      .optional(),
  })
);

export const query = z.object({
  q: z.string(),
  worldname: z
    .union([
      z.enum(Region),
      z.enum(Datacenter),
      z.string().regex(/^[A-Za-z]+$/),
    ])
    .optional(),
  classjob: z.union([z.enum(Class), z.enum(Job)]).optional(),
  race_tribe: z.union([z.enum(Race), z.enum(Tribe)]).optional(),
  gcid: z
    .enum({
      Maelstrom: 1,
      "Order of the Twin Adder": 2,
      "Immortal Flames": 3,
      "No Affiliation": 0,
    })
    .optional(),
  blog_lang: z.enum(["ja", "en", "de", "fr"]).optional(),
  order: z
    .enum({
      "Character creation date (newest to oldest)": 1,
      "Character creation date (oldest to newest)": 2,
      "Character name (A to Z)": 3,
      "Character name (Z to A)": 4,
      "World (A to Z)": 5,
      "World (Z to A)": 6,
      "Level (descending)": 7,
      "Level (ascending)": 8,
    })
    .optional(),
  page: z.number().min(1).max(20).optional(),
});

// /lodestone/character?q=...
export const entries = resolveSchema(
  z
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
            xpath: "/a[@class='entry__link']",
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
          .meta({
            xpath: "//p[@class='entry__world'][2]",
          }),
        dcname: z
          .string()
          .regex(/\w+ \[(\w+)\]/)
          .meta({
            xpath: "//p[@class='entry__world'][2]",
          }),
        lang: z
          .array(z.string())
          .meta({ xpath: "//div[@class='entry__chara__lang']" }),
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
                xpath: "/a[@class='entry__freecompany__link']",
                attribute: "href",
              }),
            name: z.string().meta({
              xpath: "/a[@class='entry__freecompany__link']/span",
            }),
            crest: z.array(z.url()).meta({
              xpath: "/a[@class='entry__freecompany__link']/img",
              attribute: "src",
            }),
          })
          .optional(),
      })
    )
    .meta({
      xpath: "//div[@class='ldst__window']//div[@class='entry']",
    })
);
