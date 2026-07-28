import { renderMarkdown } from "@/features/article/render-markdown";

type ArticleContentProps = {
  markdown: string;
};

export async function ArticleContent({ markdown }: ArticleContentProps) {
  const html = await renderMarkdown(markdown);

  return (
    <div
      className="article-content prose prose-neutral max-w-none dark:prose-invert prose-headings:font-heading prose-p:font-content prose-a:text-[var(--link)] hover:prose-a:text-[var(--link-hover)]"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
