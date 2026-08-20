import { z } from "zod";
import { selector } from "../utils.ts";
import { Datacenter, Region } from "./metadata.ts";

// /lodestone/freecompany/{id}
export const profile = z.object({
  name: z
    .string()
    .meta(selector({ xpath: "//p[@class='entry__freecompany__name']" })),
  worldname: z.string().meta(
    selector({
      xpath: "//p[@class='entry__freecompany__gc'][2]",
      regex: /(\w+) \[\w+\]/,
    })
  ),
  dcname: z.string().meta(
    selector({
      xpath: "//p[@class='entry__freecompany__gc'][2]",
      regex: /\w+ \[(\w+)\]/,
    })
  ),
  grandcompany: z.object({
    name: z.string().meta(
      selector({
        xpath: "//p[@class='entry__freecompany__gc']",
        regex: /(\w+) <\w+>/,
      })
    ),
    rank: z.string().meta(
      selector({
        xpath: "//p[@class='entry__freecompany__gc']",
        regex: /\w+ <(\w+)>/,
      })
    ),
  }),
  tag: z.string().meta(
    selector({
      xpath: "//p[@class='freecompany__text freecompany__text__tag']",
    })
  ),
  slogan: z.string().meta(
    selector({
      xpath: "//p[@class='freecompany__text freecompany__text__message']",
    })
  ),
  formed: z.iso.date().meta(
    selector({
      xpath: "//p[@class='freecompany__text']/script",
      regex: /ldst_strftime\((\d+)/,
    })
  ),
  members: z.coerce
    .number()
    .meta(selector({ xpath: "//div[@class='ldst__window'][1]/p[6]" })),
  rank: z.coerce
    .number()
    .meta(selector({ xpath: "//div[@class='ldst__window'][1]/p[7]" })),
  reputation: z
    .array(
      z.object({
        name: z.string().meta(
          selector({
            xpath: "//p[@class='freecompany__reputation__gcname']",
          })
        ),
        icon: z.url().meta(
          selector({
            xpath: "/div[@class='freecompany__reputation__icon']/img",
            attribute: "src",
          })
        ),
        rank: z
          .string()
          .meta(
            selector({ xpath: "//p[@class='freecompany__reputation__rank']" })
          ),
      })
    )
    .meta(selector({ xpath: "//div[@class='freecompany__reputation']" })),
  rankings: z.object({
    weekly: z.number().meta(
      selector({
        xpath: "//table[@class='character__ranking__data']//tr[1]/th",
        regex: /(\d+)/,
      })
    ),
    monthly: z.number().meta(
      selector({
        xpath: "//table[@class='character__ranking__data']//tr[2]/th",
        regex: /(\d+)/,
      })
    ),
  }),
  estate: z
    .object({
      name: z
        .string()
        .meta(selector({ xpath: "//p[@class='freecompany__estate__name']" })),
      address: z
        .string()
        .meta(selector({ xpath: "//p[@class='freecompany__estate__text']" })),
      greeting: z
        .string()
        .meta(
          selector({ xpath: "//p[@class='freecompany__estate__greeting']" })
        ),
    })
    .optional(),
  active: z.string().meta(
    selector({
      xpath: "//div[@class='ldst__window'][2]//p[@class='freecompany__text']",
    })
  ),
  recruiting: z
    .boolean()
    .meta(selector({ xpath: "//p[@class='freecompany__recruitment']" })),
  focus: z
    .array(
      z.object({
        name: z.string().meta(selector({ xpath: "//p" })),
        icon: z.url().meta(selector({ xpath: "//img", attribute: "src" })),
      })
    )
    .meta(
      selector({
        xpath: "//ul[@class='freecompany__focus_icon'][1]/li[not(@class)]",
      })
    ),
  seeking: z
    .array(
      z.object({
        name: z.string().meta(selector({ xpath: "//p" })),
        icon: z.url().meta(selector({ xpath: "//img", attribute: "src" })),
      })
    )
    .meta(
      selector({
        xpath: "//ul[@class='freecompany__focus_icon'][2]/li[not(@class)]",
      })
    ),
});

// /lodestone/freecompany/{id}/member
const member = z
  .array(
    z.object({
      id: z.string().meta(
        selector({
          xpath: "/a",
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
              xpath: "//ul[@class='entry__freecompany__info']/li[1]/span",
            })
          ),
          icon: z.url().meta(
            selector({
              xpath: "//ul[@class='entry__freecompany__info']/li[1]/img",
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
    })
  )
  .meta(
    selector({
      xpath: "//div[@class='ldst__window']//li[@class='entry']",
    })
  );

export const columns = { member };

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
export const entries = z
  .array(
    z.object({
      id: z.string().meta(
        selector({
          xpath: "/a",
          attribute: "href",
          regex: /lodestone\/freecompany\/(\S+)\//,
        })
      ),
      name: z.string().meta(selector({ xpath: "//p[@class='entry__name']" })),
      worldname: z.string().meta(
        selector({
          xpath: "//p[@class='entry__world'][2]",
          regex: /(\w+) \[\w+\]/,
        })
      ),
      dcname: z.string().meta(
        selector({
          xpath: "//p[@class='entry__world'][2]",
          regex: /\w+ \[(\w+)\]/,
        })
      ),
      crest: z.array(z.url()).meta(
        selector({
          xpath: "//div[@class='entry__freecompany__crest__image']/img",
          attribute: "src",
        })
      ),
      grandcompany: z
        .string()
        .meta(selector({ xpath: "//p[@class='entry__world'][1]" })),
      members: z.coerce
        .number()
        .meta(
          selector({ xpath: "//li[@class='entry__freecompany__fc-member']" })
        ),
      estate: z
        .string()
        .meta(
          selector({ xpath: "//li[@class='entry__freecompany__fc-housing']" })
        ),
      formed: z.string().meta(
        selector({
          xpath: "//li[@class='entry__freecompany__fc-day']/script",
          regex: /ldst_strftime\((\d+)/,
        })
      ),
      active: z.boolean().meta(
        selector({
          xpath: "//ul[contains(@class, 'entry__freecompany__fc-data')]/li[4]",
        })
      ),
      recuiting: z.boolean().meta(
        selector({
          xpath: "//ul[contains(@class, 'entry__freecompany__fc-data')]/li[5]",
        })
      ),
    })
  )
  .meta(
    selector({ xpath: "//div[@class='ldst__window']//div[@class='entry']" })
  );
