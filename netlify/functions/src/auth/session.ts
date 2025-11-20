import { createHmac, timingSafeEqual } from "crypto";
import { readNumericEnv, requireEnv } from "../lib/env";

const COOKIE_NAME = "activity_session";
const SECONDS_PER_DAY = 24 * 60 * 60;
const MILLIS_PER_DAY = SECONDS_PER_DAY * 1000;

const getSessionSecret = (): string => requireEnv("APP_SESSION_SECRET");

const getSessionDurationDays = (): number =>
  Math.max(1, readNumericEnv("APP_SESSION_DAYS", 30));

const sign = (expiresAt: number): string =>
  createHmac("sha256", getSessionSecret())
    .update(String(expiresAt))
    .digest("hex");

export const createSessionToken = (): string => {
  const expiresAt = Date.now() + getSessionDurationDays() * MILLIS_PER_DAY;
  const signature = sign(expiresAt);
  return `${expiresAt}.${signature}`;
};

export const verifySessionToken = (token?: string): boolean => {
  if (!token) {
    return false;
  }
  const [expiresAt, signature] = token.split(".");
  if (!expiresAt || !signature) {
    return false;
  }
  const expiration = Number(expiresAt);
  if (!Number.isFinite(expiration) || expiration < Date.now()) {
    return false;
  }
  const expected = sign(expiration);
  try {
    return timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expected, "hex")
    );
  } catch {
    return false;
  }
};

export const buildSessionCookie = (token: string): string => {
  const maxAge = getSessionDurationDays() * SECONDS_PER_DAY;
  return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}`;
};

export const getSessionCookieName = (): string => COOKIE_NAME;
