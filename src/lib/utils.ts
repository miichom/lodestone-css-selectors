import { fromXPathExpression } from "@miichom/xpath2css";
import * as z from "zod";

export const resolveMeta = <T extends z.GlobalMeta>(ctx: T): z.GlobalMeta => {
  if (!ctx.xpath) return ctx;
  const css = fromXPathExpression(ctx.xpath);
  if (typeof css === "string") return Object.assign(ctx, { selector: css });
  return Object.assign(ctx, css);
};

export const resolveSchema = <T extends z.ZodType>(schema: T): T => {
  const meta = resolveMeta(schema.meta() ?? {});

  if (schema instanceof z.ZodObject) {
    const shape = Object.fromEntries(
      Object.entries(schema.shape).map(([key, shape]) => [
        key,
        resolveSchema(shape),
      ])
    );
    return z.object(shape).meta(meta) as unknown as T;
  }

  if (schema instanceof z.ZodArray) {
    const element =
      typeof schema.unwrap === "function" ? schema.unwrap() : schema.element;
    return z
      .array(resolveSchema(element as z.ZodType))
      .meta(meta) as unknown as T;
  }

  if (schema instanceof z.ZodOptional) {
    return resolveSchema(schema.unwrap() as z.ZodType)
      .optional()
      .meta(meta) as unknown as T;
  }

  if (schema instanceof z.ZodNullable) {
    return resolveSchema(schema.unwrap() as z.ZodType)
      .nullable()
      .meta(meta) as unknown as T;
  }

  return schema.meta(meta);
};
