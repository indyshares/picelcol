"use client";

import { useState, useEffect } from "react";
import { Languages } from "lucide-react";
import type { Locale } from "@/lib/i18n";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=31536000`;
}

export function LanguageSwitcher() {
  const [locale, setLocale] = useState<Locale>("th");

  useEffect(() => {
    const saved = getCookie("lang");
    if (saved === "en" || saved === "th") setLocale(saved);
  }, []);

  function toggle() {
    const next: Locale = locale === "th" ? "en" : "th";
    setCookie("lang", next);
    setLocale(next);
    window.location.reload();
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex items-center gap-1 text-sm font-medium text-[var(--text-light)] hover:text-[var(--link)]"
      title={locale === "th" ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"}
    >
      <Languages className="h-4 w-4" />
      <span>{locale === "th" ? "EN" : "TH"}</span>
    </button>
  );
}
