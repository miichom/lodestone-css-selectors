import { z } from "zod";
import { Datacenter, Region } from "../lib/models.ts";
import { resolveSchema } from "../lib/utils.ts";

// /lodestone/freecompany/{id}
export const profile = resolveSchema(
  z.object({
    name: z
      .string()
      .meta({ xpath: "//p[@class='entry__freecompany__name']/text()" }),
    worldname: z
      .string()
      .regex(/(\w+) \[\w+\]/)
      .transform((val) => val.match(/(\w+) \[\w+\]/)?.[1].trim() ?? val.trim())
      .meta({
        xpath: "//p[@class='entry__freecompany__gc'][2]/text()",
      }),
    dcname: z
      .string()
      .regex(/\w+ \[(\w+)\]/)
      .transform((val) => val.match(/\w+ \[(\w+)\]/)?.[1].trim() ?? val.trim())
      .meta({
        xpath: "//p[@class='entry__freecompany__gc'][2]/text()",
      }),
    grandcompany: z.object({
      name: z
        .string()
        .regex(/(\w+) <\w+>/)
        .transform((val) => val.match(/(\w+) <\w+>/)?.[1].trim() ?? val.trim())
        .meta({
          xpath: "//p[@class='entry__freecompany__gc']/text()",
        }),
      rank: z
        .string()
        .regex(/\w+ <(\w+)>/)
        .transform((val) => val.match(/\w+ <(\w+)>/)?.[1].trim() ?? val.trim())
        .meta({
          xpath: "//p[@class='entry__freecompany__gc']/text()",
        }),
    }),
    tag: z.string().meta({
      xpath: "//p[@class='freecompany__text freecompany__text__tag']/text()",
    }),
    slogan: z.string().meta({
      xpath:
        "//p[@class='freecompany__text freecompany__text__message']/text()",
    }),
    formed: z
      .string()
      .regex(/ldst_strftime\((\d+)/)
      .transform((val) => {
        const match = val.match(/ldst_strftime\((\d+)/);
        return match ? new Date(parseInt(match[1], 10) * 1000) : new Date(val);
      })
      .pipe(z.date())
      .meta({
        xpath: "//p[@class='freecompany__text']/script/text()",
      }),
    members: z.coerce
      .number()
      .meta({ xpath: "//div[@class='ldst__window'][1]/p[6]/text()" }),
    rank: z.coerce
      .number()
      .meta({ xpath: "//div[@class='ldst__window'][1]/p[7]/text()" }),
    reputation: z
      .array(
        z.object({
          name: z.string().meta({
            xpath: "//p[@class='freecompany__reputation__gcname']/text()",
          }),
          icon: z.url().meta({
            xpath: "/div[@class='freecompany__reputation__icon']/img/@src",
          }),
          rank: z.string().meta({
            xpath: "//p[@class='freecompany__reputation__rank']/text()",
          }),
        })
      )
      .meta({ xpath: "//div[@class='freecompany__reputation']" }),
    rankings: z.object({
      weekly: z
        .string()
        .regex(/(\d+)/)
        .transform((val) => Number(val.match(/(\d+)/)?.[1].trim() ?? 0))
        .pipe(z.number())
        .meta({
          xpath: "//table[@class='character__ranking__data']//tr[1]/th/text()",
        }),
      monthly: z
        .string()
        .regex(/(\d+)/)
        .transform((val) => Number(val.match(/(\d+)/)?.[1].trim() ?? 0))
        .pipe(z.number())
        .meta({
          xpath: "//table[@class='character__ranking__data']//tr[2]/th/text()",
        }),
    }),
    estate: z
      .object({
        name: z.string().meta({
          xpath: "//p[@class='freecompany__estate__name']/text()",
        }),
        address: z.string().meta({
          xpath: "//p[@class='freecompany__estate__text']/text()",
        }),
        greeting: z.string().meta({
          xpath: "//p[@class='freecompany__estate__greeting']/text()",
        }),
      })
      .optional(),
    active: z.string().meta({
      xpath:
        "//div[@class='ldst__window'][2]//p[@class='freecompany__text']/text()",
    }),
    recruiting: z
      .string()
      .transform((val) => val.toLowerCase().includes("open"))
      .pipe(z.boolean())
      .meta({ xpath: "//p[@class='freecompany__recruitment']/text()" }),
    focus: z
      .array(
        z.object({
          name: z.string().meta({ xpath: "//p" }),
          icon: z.url().meta({ xpath: "//img", attribute: "src" }),
        })
      )
      .meta({
        xpath:
          "//ul[@class='freecompany__focus_icon'][1]/li[not(@class)]/text()",
      }),
    seeking: z
      .array(
        z.object({
          name: z.string().meta({ xpath: "//p" }),
          icon: z.url().meta({ xpath: "//img", attribute: "src" }),
        })
      )
      .meta({
        xpath:
          "//ul[@class='freecompany__focus_icon'][2]/li[not(@class)]/text()",
      }),
  })
);

// /lodestone/freecompany/{id}/member
const member = resolveSchema(
  z
    .array(
      z.object({
        id: z
          .string()
          .regex(/lodestone\/character\/(\d+)\//)
          .transform((value) =>
            value.match(/lodestone\/character\/(\d+)\//)?.[1].trim()
          )
          .meta({ xpath: "/a/@href" }),
        name: z.string().meta({ xpath: "//p[@class='entry__name']/text()" }),
        avatar: z.url().meta({
          xpath: "//div[@class='entry__chara__face']/img",
          attribute: "src",
        }),
        worldname: z
          .string()
          .regex(/(\w+) \[\w+\]/)
          .transform(
            (value) => value.match(/(\w+) \[\w+\]/)?.[1].trim() as string
          )
          .meta({ xpath: "//p[@class='entry__world']/text()" }),
        dcname: z
          .string()
          .regex(/\w+ \[(\w+)\]/)
          .transform(
            (value) => value.match(/\w+ \[(\w+)\]/)?.[1].trim() as string
          )
          .meta({ xpath: "//p[@class='entry__world']/text()" }),
        rank: z
          .object({
            name: z.string().meta({
              xpath:
                "//ul[@class='entry__freecompany__info']/li[1]/span/text()",
            }),
            icon: z.url().meta({
              xpath: "//ul[@class='entry__freecompany__info']/li[1]/img/@src",
            }),
          })
          .optional(),
        grandcompany: z
          .object({
            name: z
              .string()
              .regex(/(\w+) \/ \w+/)
              .transform(
                (value) => value.match(/(\w+) \/ \w+/)?.[1].trim() as string
              )
              .meta({
                xpath: "//li[@class='js__tooltip']/@data-tooltip",
              }),
            rank: z.object({
              name: z
                .string()
                .regex(/\w+ \/ (\w+)/)
                .transform(
                  (value) => value.match(/\w+ \/ (\w+)/)?.[1].trim() as string
                )
                .meta({
                  xpath: "//li[@class='js__tooltip']/@data-tooltip",
                }),
              icon: z.url().meta({
                xpath: "//li[@class='js__tooltip']/img/@src",
              }),
            }),
          })
          .optional(),
      })
    )
    .meta({
      xpath: "//div[@class='ldst__window']//li[@class='entry']",
    })
);

export const columns = z.object({ member });

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
  activities: z
    .enum({
      "Role-playing": 0,
      Leveling: 1,
      Casual: 2,
      Hardcore: 3,
      Dungeons: 4,
      Guildhests: 5,
      Trials: 6,
      Raids: 7,
      PvP: 8,
      "Not specified": -1,
    })
    .optional(),
  roles: z
    .enum({
      Tank: 16,
      Healer: 17,
      DPS: 18,
      Crafter: 19,
      Gatherer: 20,
      "Not specified": -1,
    })
    .optional(),
  activetime: z
    .enum({ "Weekends Only": 1, "Weekdays Only": 2, Always: 3 })
    .optional(),
  join: z.boolean().optional(),
  house: z
    .enum({ "No Estate or Plot": 0, "Plot Only": 1, "Esate Built": 2 })
    .optional(),
  gcid: z
    .enum({
      Maelstrom: 1,
      "Order of the Twin Adder": 2,
      "Immortal Flames": 3,
      "No Affiliation": 0,
    })
    .optional(),
  order: z
    .enum({
      "Company formation date (newest to oldest)": 1,
      "Company formation date (oldest to newest)": 2,
      "Company name (A to Z)": 3,
      "Company name (Z to A)": 4,
      "Membership (high to low)": 5,
      "Membership (low to high)": 6,
    })
    .optional(),
  page: z.number().min(1).max(20).optional(),
});

// /lodestone/freecompany?q=...
export const entries = resolveSchema(
  z
    .array(
      z.object({
        id: z
          .string()
          .regex(/lodestone\/freecompany\/(\d+)\//)
          .transform(
            (value) =>
              value.match(/lodestone\/freecompany\/(\d+)\//)?.[1].trim() ??
              value.trim()
          )
          .meta({ xpath: "/a[@class='entry__block']/@href" }),
        name: z.string().meta({ xpath: "//p[@class='entry__name']/text()" }),
        worldname: z
          .string()
          .regex(/(\w+) \[\w+\]/)
          .transform(
            (value) => value.match(/(\w+) \[\w+\]/)?.[1].trim() as string
          )
          .meta({ xpath: "//p[@class='entry__world'][2]/text()" }),
        dcname: z
          .string()
          .regex(/\w+ \[(\w+)\]/)
          .transform(
            (value) => value.match(/\w+ \[(\w+)\]/)?.[1].trim() as string
          )
          .meta({ xpath: "//p[@class='entry__world'][2]/text()" }),
        crest: z.array(z.url()).meta({
          xpath: "//div[@class='entry__freecompany__crest__image']/img/@src",
        }),
        grandcompany: z
          .string()
          .meta({ xpath: "//p[@class='entry__world'][1]/text()" }),
        members: z.coerce
          .number()
          .meta({
            xpath: "//li[@class='entry__freecompany__fc-member']/text()",
          }),
        estate: z
          .string()
          .meta({
            xpath: "//li[@class='entry__freecompany__fc-housing']/text()",
          }),
        formed: z
          .string()
          .regex(/ldst_strftime\((\d+)/)
          .transform((value) => {
            const match = value.match(/ldst_strftime\((\d+)/);
            return match
              ? new Date(parseInt(match[1], 10) * 1000)
              : new Date(value);
          })
          .pipe(z.date())
          .meta({
            xpath: "//li[@class='entry__freecompany__fc-day']/script/text()",
          }),
        active: z
          .string()
          .transform((value) => value.toLowerCase().includes("always"))
          .pipe(z.boolean())
          .meta({
            xpath:
              "//ul[contains(@class, 'entry__freecompany__fc-data')]/li[4]/text()",
          }),
        recuiting: z
          .string()
          .transform((value) => value.toLowerCase().includes("open"))
          .pipe(z.boolean())
          .meta({
            xpath:
              "//ul[contains(@class, 'entry__freecompany__fc-data')]/li[5]/text()",
          }),
      })
    )
    .meta({ xpath: "//div[@class='ldst__window']//div[@class='entry']" })
);
