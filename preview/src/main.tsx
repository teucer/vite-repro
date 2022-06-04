import { render } from "preact"
import {Editor} from "../../src/index"
import "./index.css"


render(
<Editor value="**hello**" />, 
document.getElementById("app") ?? document.body)
