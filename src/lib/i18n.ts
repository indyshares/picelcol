import { cookies } from "next/headers";

export type Locale = "th" | "en";

import enCommon from "@/locales/en/common.json";
import enHome from "@/locales/en/home.json";
import enAbout from "@/locales/en/about.json";
import enBlog from "@/locales/en/blog.json";
import enContact from "@/locales/en/contact.json";
import enFooter from "@/locales/en/footer.json";
import enMetadata from "@/locales/en/metadata.json";

import thCommon from "@/locales/th/common.json";
import thHome from "@/locales/th/home.json";
import thAbout from "@/locales/th/about.json";
import thBlog from "@/locales/th/blog.json";
import thContact from "@/locales/th/contact.json";
import thFooter from "@/locales/th/footer.json";
import thMetadata from "@/locales/th/metadata.json";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DictValue = any;

const dictionaries: Record<Locale, DictValue> = {
  en: {
    common: enCommon,
    home: enHome,
    about: enAbout,
    blog: enBlog,
    contact: enContact,
    footer: enFooter,
    metadata: enMetadata,
  },
  th: {
    common: thCommon,
    home: thHome,
    about: thAbout,
    blog: thBlog,
    contact: thContact,
    footer: thFooter,
    metadata: thMetadata,
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Dictionary = Record<string, any>;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value;
  if (lang === "en" || lang === "th") return lang;
  return "th";
}
