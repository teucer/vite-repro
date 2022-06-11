import { styleTags, tags as t } from "@lezer/highlight";

export const jsonHighlighting = styleTags({
  String: t.string,
  Plain: t.string,
  Number: t.number,
  Boolean: t.bool,
  Key: t.propertyName,
  Null: t.null,
  FoldOp: t.separator,
  "[ ]": t.squareBracket,
  "{ }": t.brace
});
