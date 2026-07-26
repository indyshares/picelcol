"use client";

import {
  MDXEditor,
  type MDXEditorMethods,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  tablePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  CodeToggle,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { forwardRef } from "react";

type ArticleEditorProps = {
  markdown: string;
  onChange?: (markdown: string) => void;
  placeholder?: string;
};

/**
 * Client-side Markdown editor used in the admin article form.
 * Renders as a plain <textarea name="content"> for the surrounding
 * <form> (server action) to pick up, while MDXEditor handles the
 * rich editing UI on top of it.
 */
export const ArticleEditor = forwardRef<MDXEditorMethods, ArticleEditorProps>(
  function ArticleEditor({ markdown, onChange, placeholder }, ref) {
    return (
      <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)]">
        <MDXEditor
          ref={ref}
          markdown={markdown}
          onChange={onChange}
          placeholder={placeholder ?? "เริ่มเขียนบทความ..."}
          contentEditableClassName="prose max-w-none px-4 py-3 min-h-[320px] focus:outline-none"
          plugins={[
            headingsPlugin(),
            listsPlugin(),
            quotePlugin(),
            thematicBreakPlugin(),
            linkPlugin(),
            linkDialogPlugin(),
            imagePlugin(),
            tablePlugin(),
            codeBlockPlugin({ defaultCodeBlockLanguage: "ts" }),
            codeMirrorPlugin({
              codeBlockLanguages: {
                ts: "TypeScript",
                tsx: "TSX",
                js: "JavaScript",
                bash: "Bash",
                json: "JSON",
                css: "CSS",
              },
            }),
            markdownShortcutPlugin(),
            toolbarPlugin({
              toolbarContents: () => (
                <>
                  <UndoRedo />
                  <BoldItalicUnderlineToggles />
                  <BlockTypeSelect />
                  <ListsToggle />
                  <CreateLink />
                  <InsertImage />
                  <InsertTable />
                  <InsertThematicBreak />
                  <CodeToggle />
                </>
              ),
            }),
          ]}
        />
      </div>
    );
  },
);
