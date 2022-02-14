import { useEffect, useState } from "react";

enum Theme {
  Light = "light",
  Dark = "dark",
  System = "system",
}

function useTheme() {
  const [theme, setTheme] = useState<Theme>(Theme.System);

  useEffect(() => {
    setTheme((localStorage.getItem("theme") as Theme) ?? Theme.System);
  }, []);

  useEffect(() => {
    if (theme === Theme.System) localStorage.removeItem("theme");
    else localStorage.setItem("theme", theme);
  }, [theme]);

  return {
    theme,
    setDark: () => setTheme(Theme.Dark),
    setLight: () => setTheme(Theme.Light),
    setSystem: () => setTheme(Theme.System),
  };
}

export default function ThemeSelector() {
  const { theme, setDark, setLight, setSystem } = useTheme();

  return (
    <div role="group" aria-label="Theme" className="themeSelector">
      <button
        type="button"
        aria-pressed={theme === Theme.Dark}
        onClick={setDark}
      >
        Dark
      </button>
      <button
        type="button"
        aria-pressed={theme === Theme.Light}
        onClick={setLight}
      >
        Light
      </button>
      <button
        type="button"
        aria-pressed={theme === Theme.System}
        onClick={setSystem}
      >
        System
      </button>
    </div>
  );
}
