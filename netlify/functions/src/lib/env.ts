type EnvKey =
  | "APP_PASSWORD"
  | "APP_SESSION_SECRET"
  | "APP_SESSION_DAYS"
  | "MONGODB_URI";

const readEnv = (key: EnvKey): string | undefined => {
  return process.env[key];
};

export const requireEnv = (key: Exclude<EnvKey, "APP_SESSION_DAYS">): string => {
  const value = readEnv(key);
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const readNumericEnv = (
  key: EnvKey,
  fallback: number
): number => {
  const value = readEnv(key);
  if (!value) {
    return fallback;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};
