import { z } from "zod";
import { selector } from "../utils.ts";
import { Class, Datacenter, Job, Race, Region, Tribe } from "./metadata.ts";

// /lodestone/character/{id}
export const profile = z.object({
  name: z.string().meta({ xpath: "//p[@class='frame__chara__name']" }),
  avatar: z.url().meta(
    selector({
      xpath: "//div[@class='frame__chara__face']/img",
      attribute: "src",
    })
  ),
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
  portrait: z
    .url()
    .meta(
      selector({
        xpath: "//div[@class='character__detail__image']//img",
        attribute: "src",
      })
    )
    .optional(),
  title: z
    .string()
    .meta(selector({ xpath: "//p[@class='frame__chara__title']" })),
  bio: z
    .string()
    .meta(selector({ xpath: "//div[@class='character__selfintroduction']" })),
  details: z.object({
    race: z.string().meta(
      selector({
        xpath:
          "//div[@class='character__profile__data__detail']/div//p[@class='character-block__name']",
        regex: new RegExp(`^(${Object.keys(Race).join("|")})`),
      })
    ),
    clan: z.string().meta(
      selector({
        xpath:
          "//div[@class='character__profile__data__detail']/div//p[@class='character-block__name']",
        regex: new RegExp(
          `^(${Object.keys(Race).join("|")})\\s*(${Object.keys(Tribe).join("|")})`
        ),
      })
    ),
    gender: z.string().meta(
      selector({
        xpath:
          "//div[@class='character__profile__data__detail']/div[1]//p[@class='character-block__name']",
      })
    ),
    nameday: z
      .string()
      .meta(selector({ xpath: "//p[@class='character-block__birth']" })),
    guardian: z.string().meta(
      selector({
        xpath:
          "//div[@class='character__profile__data__detail']/div[2]//p[@class='character-block__name']",
      })
    ),
    citystate: z.string().meta(
      selector({
        xpath:
          "//div[@class='character__profile__data__detail']/div[3]//p[@class='character-block__name']",
      })
    ),
  }),
  grandcompany: z
    .object({
      name: z.string().meta(
        selector({
          xpath:
            "//div[@class='character__profile__data__detail']/div[4]//p[@class='character-block__name']",
          regex: /(\D+) \/ \D+/,
        })
      ),
      rank: z.object({
        name: z.string().meta(
          selector({
            xpath:
              "//div[@class='character__profile__data__detail']/div[4]//p[@class='character-block__name']",
            regex: /\D+ \/ (\D+)/,
          })
        ),
        icon: z.url().meta(
          selector({
            xpath:
              "//div[@class='character__profile__data__detail']/div[4]/img",
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
          xpath: "//div[@class='character__freecompany__name']//a",
          attribute: "href",
          regex: /lodestone\/freecompany\/(\S+)\//,
        })
      ),
      name: z.string().meta(
        selector({
          xpath: "//div[@class='character__freecompany__name']//a",
        })
      ),
      crest: z
        .url()
        .array()
        .meta(
          selector({
            xpath: "//div[@class='character__freecompany__crest']//img",
            attribute: "src",
          })
        ),
    })
    .optional(),
  pvpteam: z
    .object({
      id: z.string().meta(
        selector({
          xpath: "//div[@class='character__pvpteam__name']//a",
          attribute: "href",
          regex: /lodestone\/pvpteam\/(\S+)\//,
        })
      ),
      name: z.string().meta(
        selector({
          xpath: "//div[@class='character__pvpteam__name']//a",
        })
      ),
      crest: z
        .url()
        .array()
        .meta(
          selector({
            xpath: "//div[@class='character__pvpteam__crest']//img",
            attribute: "src",
          })
        ),
    })
    .optional(),
});

// /lodestone/character/{id}/class_job
const class_job = z.object({
  classjobs: z
    .array(
      z.object({
        name: z
          .string()
          .meta(selector({ xpath: ".//div[@class='character__job__name']" })),
        level: z.coerce
          .number()
          .default(0)
          .meta(selector({ xpath: ".//div[@class='character__job__level']" })),
      })
    )
    .meta(
      selector({
        xpath:
          "//div[@class='character__content']//ul[@class='character__job']/li",
      })
    ),
  jobs: z
    .array(
      z.object({
        name: z
          .string()
          .meta(selector({ xpath: "//div[@class='character__job__name']" })),
        level: z.coerce
          .number()
          .default(0)
          .meta(selector({ xpath: "//div[@class='character__job__level']" })),
      })
    )
    .meta(
      selector({
        xpath:
          "//div[@class='character__content']//ul[@class='character__job']/li",
      })
    ),
  field_operations: z
    .array(
      z.object({
        name: z
          .string()
          .meta(selector({ xpath: "/div[@class='character__job__name']" })),
        level: z
          .number()
          .meta(selector({ xpath: "/div[@class='character__job__level']" })),
      })
    )
    .meta(
      selector({
        xpath: "//div[@class='character__job__list']",
      })
    ),
  phantom_jobs: z
    .array(
      z.object({
        name: z
          .string()
          .meta(
            selector({ xpath: "//p[@class='character__support_job__name']" })
          ),
        icon: z.url().meta(
          selector({
            xpath: "//i[@class='character__support_job__icon']/img",
            attribute: "src",
          })
        ),
        level: z
          .number()
          .meta(
            selector({ xpath: "//p[@class='character__support_job__level']" })
          ),
      })
    )
    .meta(
      selector({
        xpath:
          "//div[@class='character__support_job']//li[@class='js__sp_job']",
      })
    ),
});

// /lodestone/character/{id}/minion
const minion = z.number().meta(
  selector({
    xpath: "//p[@class='minion__sort__total']",
  })
);

// /lodestone/character/{id}/mount
const mount = z.number().meta(
  selector({
    xpath: "//p[@class='minion__sort__total']",
  })
);

// /lodestone/character/{id}/faceaccessory
const faceaccessory = z.number().meta(
  selector({
    xpath: "//p[@class='faceaccessory__sort__total']",
  })
);

export const columns = { class_job, minion, mount, faceaccessory };

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
export const entries = z
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
      lang: z
        .array(z.string())
        .meta(selector({ xpath: "//div[@class='entry__chara__lang']" })),
      grandcompany: z
        .object({
          name: z.string().meta({
            xpath: "//li[@class='js__tooltip']",
            attribute: "data-tooltip",
            regex: /(\D+) \/ \D+/,
          }),
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
          name: z
            .string()
            .meta(
              selector({ xpath: "/a[@class='entry__freecompany__link']/span" })
            ),
          crest: z.array(z.url()).meta(
            selector({
              xpath: "/a[@class='entry__freecompany__link']/img",
              attribute: "src",
            })
          ),
        })
        .optional(),
    })
  )
  .meta(
    selector({ xpath: "//div[@class='ldst__window']//div[@class='entry']" })
  );
