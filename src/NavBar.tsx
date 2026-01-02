import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { safeStorage } from "./lib/safeStorage";
import {
  APP_TITLE,
  DATA_ATTRIBUTES,
  MEDIA_QUERIES,
  NAV_TEXT,
  ROUTES,
  STORAGE_KEYS,
  THEME,
} from "./constants";

type ThemePreference = (typeof THEME)[keyof typeof THEME];

const getInitialTheme = (): ThemePreference => {
  const stored = safeStorage.get(STORAGE_KEYS.theme);
  if (stored === THEME.light || stored === THEME.dark) {
    return stored;
  }
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia(MEDIA_QUERIES.prefersLight).matches
      ? THEME.light
      : THEME.dark;
  }
  return THEME.dark;
};

export const NavBar = () => {
  const [theme, setTheme] = useState<ThemePreference>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === THEME.light) {
      root.setAttribute(DATA_ATTRIBUTES.theme, THEME.light);
    } else {
      root.removeAttribute(DATA_ATTRIBUTES.theme);
    }
    safeStorage.set(STORAGE_KEYS.theme, theme);
  }, [theme]);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand">
          <span className="brand-badge" aria-hidden="true">
            ⏱
          </span>
          <Link
            to={ROUTES.days}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            {APP_TITLE}
          </Link>
        </div>
        <div className="nav-actions">
          <label title={NAV_TEXT.toggleTheme}>
            <input
              type="checkbox"
              className="toggle"
              checked={theme !== THEME.light}
              onChange={(event) =>
                setTheme(event.target.checked ? THEME.dark : THEME.light)
              }
            />
          </label>
        </div>
      </div>
    </header>
  );
};
