import { render } from "preact";
import { Editor } from "../../src";
import "./index.css";

import { parser } from "./parser/yaml";

const value = `---
basic: >-
  Emphasis, aka italics, with *asterisks* or _underscores_.
  Strong emphasis, aka bold, with **asterisks** or __underscores__.
  Combined emphasis with **asterisks and _underscores_**.
  Strikethrough uses two tildes. ~~Scratch this.~~

list: |-
  1. First ordered list item
  2. Another item
     * Unordered sub-list.
  1. Actual numbers don't matter, just that it's a number
     1. Ordered sub-list
  4. And another item.

    You can have properly indented paragraphs within list items. Notice the blank line above, and the leading spaces (at least one, but we'll use three here to also align the raw Markdown).

    To have a line break without a paragraph, you will need to use two trailing spaces.  
    Note that this line is separate, but within the same paragraph.  
    (This is contrary to the typical GFM line break behaviour, where trailing spaces are not required.)
order: 1
names: { factor: some **factor** }
...`;

const val = "---\nkey: value\n...";
console.log(val);
const pr = parser.parse(val);
console.log(pr);

render(<Editor value={value} />, document.getElementById("app") ?? document.body);
