import type { HandlerEvent } from "@netlify/functions";
import { getSessionCookieName, verifySessionToken } from "./session";

type HeaderBag = Record<string, string | undefined>;

const parseCookies = (header?: string): Record<string, string> => {
  if (!header) {
    return {};
  }
  return header.split(";").reduce<Record<string, string>>((acc, part) => {
    const [key, value] = part.trim().split("=");
    if (key) {
      acc[key] = value ?? "";
    }
    return acc;
  }, {});
};

export const requireAuth = (
  event: Pick<HandlerEvent, "headers">
): boolean => {
  const headers: HeaderBag = event.headers || {};
  const cookieHeader = headers.cookie ?? headers.Cookie;
  const cookies = parseCookies(cookieHeader);
  const token = cookies[getSessionCookieName()];
  return verifySessionToken(token);
};
