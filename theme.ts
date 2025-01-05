import { tags as t } from "@lezer/highlight";
import { createTheme } from "@uiw/codemirror-themes";

export const core = createTheme({
  theme: "dark",
  settings: {
    background: "#09090b",
    backgroundImage: "",
    foreground: "#ffffff",
    caret: "#ffffff",
    selection: "#036dd626",
    selectionMatch: "#036dd626",
    lineHighlight: "#8a91991a",
  },
  styles: [
    { tag: t.comment, color: "#a19595" },
    { tag: [t.variableName, t.propertyName], color: "#ffffff" },
    { tag: [t.string, t.special(t.brace)], color: "#a7a7a7" },
    { tag: t.number, color: "#a7a7a7" },
    { tag: t.bool, color: "#a7a7a7" },
    { tag: t.null, color: "#a7a7a7" },
    { tag: t.keyword, color: "#a7a7a7" },
    { tag: t.operator, color: "#8996a3" },
    { tag: t.className, color: "#ffffff" },
    { tag: t.definition(t.typeName), color: "#a7a7a7" },
    { tag: t.typeName, color: "#a7a7a7" },
    { tag: t.angleBracket, color: "#8996a3" },
    { tag: t.tagName, color: "#a7a7a7" },
    { tag: t.attributeName, color: "#a7a7a7" },
  ],
});
