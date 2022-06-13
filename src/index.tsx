import { useEffect, useRef, useState } from "preact/hooks";

import { basicSetup } from "codemirror";
import { EditorView, keymap, highlightSpecialChars, ViewUpdate } from "@codemirror/view";
import { Prec } from "@codemirror/state";
import { indentWithTab } from "@codemirror/commands";
// import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { yaml } from "./yamlmode";
import { parser } from "./yaml";

import { basicLight } from "./theme";

type EditorProps = {
  value: string;
};

export function Editor(props: EditorProps) {
  const editor = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [value, setValue] = useState("");

  // useEffect(() => console.log(value, editor.current), [value]);

  useEffect(() => {
    const view = new EditorView({
      doc: props.value,
      extensions: [
        basicSetup,
        basicLight,
        keymap.of([indentWithTab]),
        Prec.high(
          highlightSpecialChars({
            render: code => {
              const node = document.createElement("span");
              node.innerText = "∙";
              node.setAttribute("class", "cm-special");
              return node;
            },
            addSpecialChars: /\s/
          })
        ),
        yaml(),
        EditorView.updateListener.of((v: ViewUpdate) => {
          if (v.docChanged) {
            setValue(v.view.state.doc.toString());
          }
        })
      ],
      parent: editor.current ?? document.body
    });
    const tree = parser.parse(props.value);
    const cursor = tree.cursor();
    do {
      if (cursor.name !== "Document") {
        const val = view.state.sliceDoc(cursor.from, cursor.to);
        console.log(`Node ${cursor.name} from ${cursor.from} to ${cursor.to}: ${val}`);
      }
    } while (cursor.next());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={editor} id="editor" />;
}
