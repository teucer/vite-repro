import { useEffect, useRef, useState } from "preact/hooks";

import { EditorState, EditorView, basicSetup } from "@codemirror/basic-setup";
import { ViewUpdate, keymap, highlightSpecialChars } from "@codemirror/view";
import { Prec } from "@codemirror/state";
import { indentWithTab } from "@codemirror/commands";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";

import { basicLight } from "./theme";
import { YamlKey } from "./extension";

type EditorProps = {
  value: string;
};

export function Editor(props: EditorProps) {
  const editor = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [value, setValue] = useState("");

  // useEffect(() => console.log(value, editor.current), [value]);

  useEffect(() => {
    new EditorView({
      state: EditorState.create({
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
          markdown({ extensions: YamlKey, base: markdownLanguage }),
          EditorView.updateListener.of((v: ViewUpdate) => {
            if (v.docChanged) {
              setValue(v.view.state.doc.toString());
            }
          })
        ]
      }),
      parent: editor.current ?? document.body
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={editor} id="editor" />;
}
