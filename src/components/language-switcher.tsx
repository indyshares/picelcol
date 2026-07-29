"use client";

import { Languages } from "lucide-react";
import { useLocale } from "@/lib/use-locale";

export function LanguageSwitcher() {
  const { locale, setLocale, mounted } = useLocale();

  function toggle() {
    const next = locale === "th" ? "en" : "th";
    setLocale(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex items-center gap-1 text-sm font-medium text-[var(--text-light)] hover:text-[var(--link)]"
      title={!mounted ? "" : locale === "th" ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"}
    >
      <Languages className="h-4 w-4" />
      <span>{!mounted ? "" : locale === "th" ? "EN" : "TH"}</span>
    </button>
  );
}
