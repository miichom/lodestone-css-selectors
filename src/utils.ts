import { xPathToCss } from "@miichom/xpath2css";

export interface SelectorContext {
  [key: string]: unknown;
  xpath: string;
  attribute?: string;
  regex?: RegExp;
}

export const selector = (ctx: SelectorContext) => ({
  ...ctx,
  css: xPathToCss(ctx.xpath),
  regex: ctx.regex?.source,
});
