import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Theme store state and actions.
 * Persists theme preference and updates DOM when toggled.
 */
interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (dark: boolean) => void;
}

/**
 * Zustand store for theme management.
 * - Uses `persist` to save theme preference in localStorage.
 * - Automatically applies/removes the "dark" class on <html>.
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDarkMode: false,

      // Toggle between light and dark mode
      toggleTheme: () => {
        const newTheme = !get().isDarkMode;
        set({ isDarkMode: newTheme });
        applyTheme(newTheme);
      },

      // Explicitly set theme (used for initialization)
      setTheme: (dark) => {
        set({ isDarkMode: dark });
        applyTheme(dark);
      },
    }),
    {
      name: "theme-storage", 
    },
  ),
);

/**
 * Applies the theme to the document <html> element.
 * Ensures DOM-safe usage 
 */
function applyTheme(isDark: boolean) {
  if (typeof document === "undefined") return; // Skip during SSR
  document.documentElement.classList.toggle("dark", isDark);
}

