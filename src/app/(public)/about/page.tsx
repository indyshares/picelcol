"use client";

import { useLocale } from "@/lib/use-locale";
import { siteConfig } from "@/constants/site";

function renderBody(body: string) {
  return body.split("\n\n").map((p, i) => <p key={i}>{p}</p>);
}

export default function AboutPage() {
  const { dict, mounted } = useLocale();

  if (!mounted) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="h-8 w-48 rounded bg-[var(--border)]" />
        <div className="mt-6 space-y-4">
          <div className="h-4 w-full rounded bg-[var(--border)]" />
          <div className="h-4 w-5/6 rounded bg-[var(--border)]" />
          <div className="h-4 w-4/6 rounded bg-[var(--border)]" />
        </div>
      </main>
    );
  }

  const { about } = dict;
  const url = `${siteConfig.url}/about`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: about.metaTitle,
    description: about.metaDescription,
    url,
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="article-content prose prose-neutral max-w-none dark:prose-invert prose-headings:font-heading prose-p:font-content prose-a:text-[var(--link)] hover:prose-a:text-[var(--link-hover)]">
        <h1>{about.title}</h1>

        <h2>{about.sections.intro.heading}</h2>
        {renderBody(about.sections.intro.body)}

        <h2>{about.sections.whoWeAre.heading}</h2>
        {renderBody(about.sections.whoWeAre.body)}

        <h2>{about.sections.whoWeCreateFor.heading}</h2>
        {renderBody(about.sections.whoWeCreateFor.body)}

        <h2>{about.sections.moreThanProducts.heading}</h2>
        {renderBody(about.sections.moreThanProducts.body)}

        <h2>{about.sections.ourStory.heading}</h2>
        {renderBody(about.sections.ourStory.body)}

        <h2>{about.sections.getInTouch.heading}</h2>
        <p>{about.sections.getInTouch.channels}</p>
        <ul>
          <li>{about.sections.getInTouch.facebook}</li>
          <li>{about.sections.getInTouch.instagram}</li>
          <li>{about.sections.getInTouch.line}</li>
        </ul>
        <p>{about.seeYou}</p>
      </article>
    </main>
  );
}
