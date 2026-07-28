import type { Metadata } from "next";
import { getLocale, getDictionary } from "@/lib/i18n";
import { siteConfig } from "@/constants/site";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  return {
    title: dict.about.metaTitle,
    description: dict.about.metaDescription,
  };
}

function renderBody(body: string) {
  return body.split("\n\n").map((p, i) => <p key={i}>{p}</p>);
}

export default async function AboutPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
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
      <article className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-[var(--font-heading)] prose-p:font-[var(--font-content)] prose-a:text-[var(--link)] hover:prose-a:text-[var(--link-hover)]">
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
        <p>{locale === "th" ? about.thankYou : about.thankYou}</p>
      </article>
    </main>
  );
}
