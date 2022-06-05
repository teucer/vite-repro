
import { tags as t } from "@lezer/highlight"
import { MarkdownConfig, LeafBlockParser, BlockContext, LeafBlock } from "@lezer/markdown"


// eslint-disable-next-line no-useless-escape
const regex = /^\s*(?:[,\[\]{}&*!|>'"%@`][^\s'":]|[^,\[\]{}#&*!|>'"%@`])[^#]*?(?=\s*:($|\s))/

class YamlParser implements LeafBlockParser {
    nextLine() { return false }

    finish(cx: BlockContext, leaf: LeafBlock) {
        const match = regex.exec(leaf.content) ?? []
        let offset = 0
        if (match.length > 0) {
            offset = match[0].length
        }
        cx.addLeafElement(leaf,
            cx.elt(
                "Yaml",
                leaf.start,
                leaf.start + leaf.content.length,
                [
                    cx.elt("KeyMarker",
                        leaf.start,
                        leaf.start + offset
                    ),
                    ...cx.parser.parseInline(
                        leaf.content.slice(offset),
                        leaf.start + offset
                    )
                ]
            )
        )
        return true
    }
}


export const Yaml: MarkdownConfig = {
    defineNodes: [
        { name: "Yaml", block: true, style: t.list },
        { name: "KeyMarker", style: t.atom }
    ],
    parseBlock: [{
        name: "YamlKeyValue",
        leaf(cx, leaf) {
            return regex.test(leaf.content) ? new YamlParser : null
        }
    }]
}