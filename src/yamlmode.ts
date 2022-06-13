import { parser } from "./yaml";

import {
  continuedIndent,
  indentNodeProp,
  foldNodeProp,
  foldInside,
  LRLanguage,
  LanguageSupport
} from "@codemirror/language";

/// A language provider that provides YAML parsing.
export const yamlLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        Mapping: continuedIndent({ except: /^\s*\}/ }),
        Sequence: continuedIndent({ except: /^\s*\]/ }),
        MultiLine: continuedIndent()
      }),
      foldNodeProp.add({
        "Mapping Sequence": foldInside
      })
    ]
  }),
  languageData: {
    closeBrackets: { brackets: ["[", "{", '"'] },
    indentOnInput: /^\s*[}\]]$/
  }
});

/// JSON language support.
export function yaml() {
  return new LanguageSupport(yamlLanguage);
}
