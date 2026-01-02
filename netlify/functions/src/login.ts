import type { Handler } from "@netlify/functions";
import { badRequest, json } from "./lib/http";
import { createSessionToken, buildSessionCookie } from "./auth/session";
import { requireEnv } from "./lib/env";
import {
  CONTENT_TYPE_JSON,
  ENV_KEYS,
  ERROR_TEXT,
  HTTP_METHODS,
} from "./constants";

const PASSWORD = () => requireEnv(ENV_KEYS.appPassword);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== HTTP_METHODS.post) {
    return json(405, { ok: false, error: ERROR_TEXT.methodNotAllowed });
  }

  let body: Record<string, unknown> = {};
  try {
    body = event.body ? JSON.parse(event.body) : {};
  } catch {
    return badRequest(ERROR_TEXT.invalidJson);
  }

  const password = typeof body.password === "string" ? body.password : "";
  if (password !== PASSWORD()) {
    return json(401, { ok: false, error: ERROR_TEXT.invalidPassword });
  }

  try {
    const token = createSessionToken();
    return {
      statusCode: 200,
      headers: {
        "Content-Type": CONTENT_TYPE_JSON,
        "Set-Cookie": buildSessionCookie(token),
      },
      body: JSON.stringify({ ok: true }),
    };
  } catch (error) {
    console.error("Failed to create session", error);
    return json(500, {
      ok: false,
      error: ERROR_TEXT.sessionMisconfigured,
    });
  }
};
