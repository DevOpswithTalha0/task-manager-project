import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark" | "system";
type ThemeContextValue = {
  theme: Theme;
  setTheme: (v: Theme) => void;
  isDark: boolean;
  accentColor: string;
  setAccentColor: (v: string) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemPrefersDark(): boolean {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

function applyClass(isDark: boolean) {
  const root = document.documentElement;
  if (isDark) root.classList.add("dark");
  else root.classList.remove("dark");
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme-pref") as Theme | null;
    return saved ?? "system";
  });

  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem("accent-color") || "violet";
  });

  // Apply accent color as CSS variables
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--accent-color",
      `var(--accent-${accentColor}-500)`
    );
    document.documentElement.style.setProperty(
      "--accent-bg-color",
      `var(--accent-${accentColor}-100)`
    );
    document.documentElement.style.setProperty(
      "--accent-hover-color",
      `var(--accent-${accentColor}-hover)`
    );
    document.documentElement.style.setProperty(
      "--accent-highlight-color",
      `var(--accent-${accentColor}-600)`
    );
    document.documentElement.style.setProperty(
      "--accent-btn-hover-color",
      `var(--accent-btn-${accentColor}-700)`
    );
    localStorage.setItem("accent-color", accentColor);
  }, [accentColor]);

  // Keep class in sync with theme
  useEffect(() => {
    const isDark =
      theme === "dark" || (theme === "system" && getSystemPrefersDark());
    applyClass(isDark);
    localStorage.setItem("theme-pref", theme);
  }, [theme]);

  // React to OS changes when on "system"
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyClass(mq.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, [theme]);

  const value = useMemo<ThemeContextValue>(() => {
    const isDark =
      theme === "dark" || (theme === "system" && getSystemPrefersDark());
    return { theme, setTheme, isDark, accentColor, setAccentColor };
  }, [theme, accentColor]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
