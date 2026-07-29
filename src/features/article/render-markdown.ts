import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import rehypeShiki from "@shikijs/rehype";

let processor: ReturnType<typeof buildProcessor> | undefined;

function buildProcessor() {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeShiki, {
      themes: { light: "github-light", dark: "github-dark" },
    })
    .use(rehypeStringify, { allowDangerousHtml: true });
}

export async function renderMarkdown(markdown: string): Promise<string> {
  processor ??= buildProcessor();
  const file = await processor.process(markdown);
  return String(file);
}
