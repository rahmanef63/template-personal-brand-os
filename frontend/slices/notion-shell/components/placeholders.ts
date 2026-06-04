import type { BlockType } from "../types";

/** Default contentEditable placeholders per block type. Override via
 *  the `placeholders` prop on <NotionBlock />. */
export const TOP_LEVEL_PLACEHOLDERS: Partial<Record<BlockType, string>> = {
  paragraph: "Type '/' for commands",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  h4: "Heading 4",
  h5: "Heading 5",
  h6: "Heading 6",
  todo: "To-do",
  bullet: "List",
  numbered: "List",
  quote: "Empty quote",
  code: "// Empty code block",
  callout: "Type something…",
};
