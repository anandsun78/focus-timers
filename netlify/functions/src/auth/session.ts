import { createHmac, timingSafeEqual } from "crypto";
import { readNumericEnv, requireEnv } from "../lib/env";
import { COOKIE, ENV_KEYS, HASH, SESSION_DEFAULT_DAYS } from "../constants";

const SECONDS_PER_DAY = 24 * 60 * 60;
const MILLIS_PER_DAY = SECONDS_PER_DAY * 1000;

const getSessionSecret = (): string => requireEnv(ENV_KEYS.appSessionSecret);

const getSessionDurationDays = (): number =>
  Math.max(1, readNumericEnv(ENV_KEYS.appSessionDays, SESSION_DEFAULT_DAYS));

const sign = (expiresAt: number): string =>
  createHmac(HASH.algorithm, getSessionSecret())
    .update(String(expiresAt))
    .digest(HASH.hexEncoding);

export const createSessionToken = (): string => {
  const expiresAt = Date.now() + getSessionDurationDays() * MILLIS_PER_DAY;
  const signature = sign(expiresAt);
  return `${expiresAt}.${signature}`;
};

export const verifySessionToken = (token?: string): boolean => {
  if (!token) {
    return false;
  }
  const [expiresAt, signature] = token.split(HASH.tokenSeparator);
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
      Buffer.from(signature, HASH.hexEncoding),
      Buffer.from(expected, HASH.hexEncoding)
    );
  } catch {
    return false;
  }
};

export const buildSessionCookie = (token: string): string => {
  const maxAge = getSessionDurationDays() * SECONDS_PER_DAY;
  return `${COOKIE.name}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}`;
};

export const getSessionCookieName = (): string => COOKIE.name;
