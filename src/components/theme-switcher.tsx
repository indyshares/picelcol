"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function toggle() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="clay-button clay-bounce flex h-9 w-9 items-center justify-center bg-[var(--clay-bg-soft)] text-[var(--text-light)] motion-reduce:transition-none hover:text-[var(--link)]"
      title={!mounted ? "" : theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {!mounted ? (
        <div className="h-4 w-4" />
      ) : theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}
