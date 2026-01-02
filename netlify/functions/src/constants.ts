export const SINGLETON_ID = "singleton";

export const TRACKER_LABEL_FALLBACK = "Untitled Tracker";
export const TRACKER_KEY_PREFIX = "tracker";

export const MODEL_NAMES = {
  daysDoc: "DaysDoc",
};

export const CONTENT_TYPE_JSON = "application/json";

export const HTTP_METHODS = {
  get: "GET",
  post: "POST",
};

export const ERROR_TEXT = {
  invalidJsonPayload: "Invalid JSON payload",
  databaseConnection: "Database connection error",
  invalidPayload: "Invalid payload",
  invalidJson: "Invalid JSON",
  methodNotAllowed: "Method Not Allowed",
  invalidPassword: "Invalid password",
  sessionMisconfigured: "Server misconfigured (missing APP_SESSION_SECRET)",
};

export const COOKIE = {
  name: "activity_session",
};

export const HASH = {
  algorithm: "sha256",
  hexEncoding: "hex",
  tokenSeparator: ".",
};

export const SESSION_DEFAULT_DAYS = 30;

export const ENV_KEYS = {
  appPassword: "APP_PASSWORD",
  appSessionSecret: "APP_SESSION_SECRET",
  appSessionDays: "APP_SESSION_DAYS",
  mongoUri: "MONGODB_URI",
} as const;
