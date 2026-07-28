"use client";

import { useState, useEffect } from "react";

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

import type { Locale } from "@/lib/i18n";

const dictionaries = {
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

function getLangCookie(): Locale {
  if (typeof document === "undefined") return "th";
  const match = document.cookie.match(/(?:^| )lang=([^;]+)/);
  const val = match ? decodeURIComponent(match[1]) : null;
  if (val === "en" || val === "th") return val;
  return "th";
}

export function useLocale() {
  const [locale, setLocale] = useState<Locale>("th");

  useEffect(() => {
    setLocale(getLangCookie());
  }, []);

  return {
    locale,
    dict: dictionaries[locale],
  };
}
