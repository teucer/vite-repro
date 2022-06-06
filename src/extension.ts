import { tags as t } from "@lezer/highlight";
import { MarkdownConfig, LeafBlockParser, BlockContext, LeafBlock } from "@lezer/markdown";

const regex =
  /^\s*(?:[,[\]{}&*!|>'"%@`][^\s'":]|[^,[\]{}#&*!|>'"%@`])[^#]*?(?=\s*:($|\s((?:>-?|\|-?))?))/;

class YamlKeyParser implements LeafBlockParser {
  match: RegExpExecArray;

  constructor(match: RegExpExecArray) {
    this.match = match;
  }

  nextLine() {
    return false;
  }

  finish(cx: BlockContext, leaf: LeafBlock) {
    const content = leaf.content;
    let offset = this.match[0].length;
    let start = leaf.start;
    let end = start + offset;
    const markers = [cx.elt("YamlKey", start, end)];
    if (this.match.length > 2) {
      offset += this.match[1].length + 1;
      start = end;
      end += this.match[1].length + 1;
      markers.push(cx.elt("YamlOperator", start, end));
    }
    console.log(leaf);
    cx.addLeafElement(
      leaf,
      cx.elt("Yaml", start, start + content.length, [
        ...markers,
        ...cx.parser.parseInline(content.slice(offset), end)
      ])
    );
    return true;
  }
}

export const YamlKey: MarkdownConfig = {
  defineNodes: [
    { name: "Yaml", block: true },
    { name: "YamlKey", style: t.name },
    { name: "YamlOperator", style: t.operator }
  ],
  parseBlock: [
    {
      name: "YamlParser",
      endLeaf: () => {
        return true;
      },
      leaf(_, leaf) {
        const match = regex.exec(leaf.content);
        if (match && match.length > 0) {
          console.log(leaf);
          return new YamlKeyParser(match);
        }
        return null;
      }
    }
  ]
};
