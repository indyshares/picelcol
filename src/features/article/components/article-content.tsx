import sanitizeHtml from "sanitize-html";
import { renderMarkdown } from "@/features/article/render-markdown";

type ArticleContentProps = {
  markdown: string;
};

export async function ArticleContent({ markdown }: ArticleContentProps) {
  const html = await renderMarkdown(markdown);

  const sanitized = sanitizeHtml(html, {
    allowedTags: [
      "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "br", "hr",
      "ul", "ol", "li",
      "blockquote", "pre", "code",
      "table", "thead", "tbody", "tr", "th", "td",
      "strong", "em", "u", "s", "del", "ins", "sub", "sup",
      "a", "img",
      "iframe",
      "span", "div",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height"],
      iframe: ["src", "allowfullscreen", "allow", "frameborder", "scrolling"],
      "*": ["class"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
    },
  });

  return (
    <div
      className="article-content prose prose-neutral max-w-none dark:prose-invert prose-headings:font-heading prose-p:font-content prose-blockquote:font-heading prose-a:text-[var(--link)] hover:prose-a:text-[var(--link-hover)]"
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
