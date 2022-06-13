import { styleTags, tags as t } from "@lezer/highlight";

export const yamlHighlighting = styleTags({
  DocStart: t.meta,
  DocEnd: t.meta,
  Key: t.operator,
  Boolean: t.bool,
  Null: t.null,
  Plain: t.string,
  Number: t.number,
  FoldOp: t.operatorKeyword,
  "[ ]": t.squareBracket,
  "{ }": t.brace,
  Comment: t.comment
});
