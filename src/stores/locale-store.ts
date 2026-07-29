import { create } from "zustand";
import type { Locale } from "@/lib/i18n";

type LocaleState = {
  locale: Locale;
  mounted: boolean;
  setLocale: (locale: Locale) => void;
  setMounted: (mounted: boolean) => void;
};

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: "th",
  mounted: false,
  setLocale: (locale) => set({ locale }),
  setMounted: (mounted) => set({ mounted }),
}));
