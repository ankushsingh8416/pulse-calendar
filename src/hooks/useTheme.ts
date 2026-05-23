import { useEffect } from "react";
import { useCalendarStore } from "@/store/useCalendarStore";

export function useTheme() {
  const theme = useCalendarStore((s) => s.theme);
  const setTheme = useCalendarStore((s) => s.setTheme);

  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      const isDark =
        theme === "dark" ||
        (theme === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      root.classList.toggle("dark", isDark);
    };
    apply();
    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }
  }, [theme]);

  return { theme, setTheme };
}
