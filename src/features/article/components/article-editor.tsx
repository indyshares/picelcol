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
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  CodeToggle,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { forwardRef, useRef } from "react";
import { uploadFile } from "@/lib/supabase/storage";

function InsertImageButton({ editorRef }: { editorRef: React.RefObject<MDXEditorMethods | null> }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadFile(file, "articles/content");
      editorRef.current?.insertMarkdown(`![image](${url})`);
    } catch {
      alert("อัปโหลดรูปภาพไม่สำเร็จ");
    }

    e.target.value = "";
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
      <button
        type="button"
        onClick={handleClick}
        className="rounded px-1.5 py-1 text-sm hover:bg-[var(--hover-bg)]"
        title="Insert image"
      >
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.5 1C1.67157 1 1 1.67157 1 2.5V12.5C1 13.3284 1.67157 14 2.5 14H12.5C13.3284 14 14 13.3284 14 12.5V2.5C14 1.67157 13.3284 1 12.5 1H2.5ZM2.5 2C2.22386 2 2 2.22386 2 2.5V12.5C2 12.7761 2.22386 13 2.5 13H12.5C12.7761 13 13 12.7761 13 12.5V2.5C13 2.22386 12.7761 2 12.5 2H2.5ZM4.5 5C4.22386 5 4 4.77614 4 4.5C4 4.22386 4.22386 4 4.5 4C4.77614 4 5 4.22386 5 4.5C5 4.77614 4.77614 5 4.5 5ZM3 10.5L5.5 8L6.5 9L9.5 6L12 10.5H3Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
        </svg>
      </button>
    </>
  );
}

type ArticleEditorProps = {
  markdown: string;
  onChange?: (markdown: string) => void;
  placeholder?: string;
};

export const ArticleEditor = forwardRef<MDXEditorMethods, ArticleEditorProps>(
  function ArticleEditor({ markdown, onChange, placeholder }, ref) {
    const editorRef = useRef<MDXEditorMethods | null>(null);

    return (
      <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)]">
        <MDXEditor
          ref={(node) => {
            editorRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
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
                  <InsertImageButton editorRef={editorRef} />
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
