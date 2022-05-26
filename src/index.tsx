import render from "preact-render-to-string";

import "./index.css"

const vdom = <div class="foo">content</div>;

export const html = render(vdom);
