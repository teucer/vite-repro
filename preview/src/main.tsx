import { render } from "preact"
import { Editor } from "../../src/index"
import "./index.css"


render(
    <Editor value="key: value" />,
    document.getElementById("app") ?? document.body
)
