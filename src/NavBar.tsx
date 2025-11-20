import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { safeStorage } from "./lib/safeStorage";

type ThemePreference = "light" | "dark";

const THEME_KEY = "timers_theme";

const getInitialTheme = (): ThemePreference => {
  const stored = safeStorage.get(THEME_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }
  return "dark";
};

export const NavBar = () => {
  const [theme, setTheme] = useState<ThemePreference>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
    } else {
      root.removeAttribute("data-theme");
    }
    safeStorage.set(THEME_KEY, theme);
  }, [theme]);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand">
          <span className="brand-badge" aria-hidden="true">
            ⏱
          </span>
          <Link to="/days" style={{ color: "inherit", textDecoration: "none" }}>
            Timers
          </Link>
        </div>
        <div className="nav-actions">
          <label title="Toggle light/dark">
            <input
              type="checkbox"
              className="toggle"
              checked={theme !== "light"}
              onChange={(event) =>
                setTheme(event.target.checked ? "dark" : "light")
              }
            />
          </label>
        </div>
      </div>
    </header>
  );
};
