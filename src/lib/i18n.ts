import { cookies } from "next/headers";
import { th } from "@/locales/th";
import { en } from "@/locales/en";

export type Locale = "th" | "en";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Dictionary = Record<string, any>;

const dictionaries: Record<Locale, Dictionary> = { th, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value;
  if (lang === "en" || lang === "th") return lang;
  return "th";
}
