export const APP_TITLE = "Timers";

export const ROUTES = {
  days: "/days",
};

const NETLIFY_FUNCTIONS_BASE = "/.netlify/functions";

export const API_ENDPOINTS = {
  authCheck: `${NETLIFY_FUNCTIONS_BASE}/auth-check`,
  login: `${NETLIFY_FUNCTIONS_BASE}/login`,
  days: `${NETLIFY_FUNCTIONS_BASE}/days`,
};

export const HTTP_METHODS = {
  post: "POST",
};

export const CONTENT_TYPE = {
  json: "application/json",
};

export const STORAGE_KEYS = {
  theme: "timers_theme",
  selectedTracker: "days_selected_key",
};

export const THEME = {
  light: "light",
  dark: "dark",
} as const;

export const MEDIA_QUERIES = {
  prefersLight: "(prefers-color-scheme: light)",
};

export const DATA_ATTRIBUTES = {
  theme: "data-theme",
};

export const AUTH_TEXT = {
  checkingAccess: "Checking access…",
  enterPassword: "Enter Password",
  privatePage: "This page is private.",
  passwordPlaceholder: "Password",
  checking: "Checking…",
  unlock: "Unlock",
};

export const NAV_TEXT = {
  toggleTheme: "Toggle light/dark",
};

export const ERROR_TEXT = {
  invalidPassword: "Invalid password",
  networkError: "Network error",
  loadTrackers: "Unable to load trackers",
  saveTrackers: "Unable to save trackers",
};

export const TRACKER_TEXT = {
  titleSuffix: "★ title tracker",
  deletePrefix: "Delete",
  notStarted: "Not started",
  currentPrefix: "Current:",
  relapsesLabel: "Relapses:",
  avgBeforeRelapseLabel: "Avg before relapse:",
  starFilled: "★",
  starOutline: "☆",
  setTitle: "Set as title ★",
  titleTracker: "★ Title tracker",
  progressToDays: "days",
  progressLeftSuffix: "left",
  relapsed: "I Relapsed",
  reset: "Reset",
  start: "Start",
  titleHint:
    "No title tracker selected — using best progress by default. Click",
  titleHintAction: "Set as title ★",
  saving: "Saving…",
  addPlaceholder: "Add tracker (e.g. Social Media, Sugar, Gaming)",
  addButton: "Add",
  emptyState: "No trackers yet. Add one above.",
  loadErrorPrefix: "Unable to load trackers —",
};

export const SYNC_STATUS = {
  idle: "idle",
  saving: "saving",
  error: "error",
} as const;

export const formatDeleteConfirmation = (label: string): string =>
  `Delete "${label}"? This cannot be undone.`;
