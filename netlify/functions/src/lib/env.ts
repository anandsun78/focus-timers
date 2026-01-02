import { ENV_KEYS } from "../constants";

type EnvKey = (typeof ENV_KEYS)[keyof typeof ENV_KEYS];

const readEnv = (key: EnvKey): string | undefined => {
  return process.env[key];
};

export const requireEnv = (
  key: Exclude<EnvKey, (typeof ENV_KEYS)["appSessionDays"]>
): string => {
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
