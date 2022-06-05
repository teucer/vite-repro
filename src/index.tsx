import { useEffect, useRef, useState } from "preact/hooks"

import { EditorState, EditorView, basicSetup } from "@codemirror/basic-setup"
import { markdown } from "@codemirror/lang-markdown"
import { ViewUpdate } from "@codemirror/view"

import { basicLight } from "./theme"
import { Yaml } from "./extension"

type EditorProps = {
  value: string;
}


export function Editor(props: EditorProps) {
  const editor = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState("")

  useEffect(() => console.log(value, editor.current), [value])

  useEffect(() => {
    new EditorView({
      state: EditorState.create({
        doc: props.value,
        extensions: [
          basicSetup,
          basicLight,
          markdown({ extensions: Yaml }),
          EditorView.updateListener.of((v: ViewUpdate) => {
            if (v.docChanged) {
              setValue(v.view.state.doc.toString())
            }
          })
        ]
      }),
      parent: editor.current ?? document.body
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={editor} id="editor" />
}
