import { tags as t } from "@lezer/highlight";
import { MarkdownConfig, LeafBlockParser, BlockContext, LeafBlock, Line } from "@lezer/markdown";

const regex =
  /^\s*(?:[,[\]{}&*!|>'"%@`][^\s'":]|[^,[\]{}#&*!|>'"%@`])[^#]*?(?=\s*:($|\s((?:>-?|\|-?))?))/;

export enum Type {
  Yaml = "Yaml",
  YamlKey = "YamlKey",
  YamlItem = "YamlItem"
}

function isSpace(ch: number) {
  return ch === 32 || ch === 9 || ch === 10 || ch === 13;
}

function inYaml(cx: BlockContext, type: Type) {
  for (let i = cx.depth - 1; i >= 0; i--) {
    if (cx.parentType(i).name === type) {
      return true;
    }
  }
  return false;
}

function isYaml(cx: BlockContext, line: Line, isRoot: boolean) {
  const pos = line.pos;
  // const next = line.next;
  // skip the the number/key -> pos is at after the number

  if (
    // pos === line.pos || // we did not skip anything
    // pos > line.pos + 9 || // too many spaces before the number
    // (next !== 46 && next !== 41) /* '.)' */ || // it is not the separator/operator
    // // there is no space between number and the rest
    (pos < line.text.length - 1 && !isSpace(line.text.charCodeAt(pos + 1))) ||
    // ok now we have [Number. XXX] somewhere in the line. It is not yaml IF
    // // it is not root AND
    // // it is not in a yaml block AND
    (!isRoot &&
      !inYaml(cx, Type.Yaml) &&
      (line.skipSpace(pos + 1) === line.text.length || // the rest is only spaces
        pos > line.pos + 1 || // we are after the second character
        line.next !== 49)) /* '1' */ // the start is not 1
  ) {
    return -1;
  }
  return pos + 1 - line.pos; // size of the number
}

function getYamlIndent(line: Line, pos: number) {
  const indentAfter = line.countIndent(pos, line.pos, line.indent);
  const indented = line.countIndent(line.skipSpace(pos), pos, indentAfter);
  return indented >= indentAfter + 5 ? indentAfter + 1 : indented;
}

function YamlParser(cx: BlockContext, line: Line) {
  const size = isYaml(cx, line, true); // do we have a valid [1. XXX] in the line?

  if (size < 0) {
    return false;
  }

  if (cx.block.type !== Type.Yaml) {
    cx.startComposite(Type.Yaml, line.basePos, line.text.charCodeAt(line.pos + size - 1));
  }

  const newBase = getYamlIndent(line, line.pos + size);
  cx.startComposite(Type.YamlItem, line.basePos, newBase - line.baseIndent);
  cx.addElement(cx.elt(Type.YamlKey, cx.lineStart + line.pos, cx.lineStart + line.pos + size));
  line.moveBaseColumn(newBase);
  return null;
}

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
      endLeaf: (cx: BlockContext, line: Line) => {
        if (isSpace(line.pos)) {
          return false;
        }
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
