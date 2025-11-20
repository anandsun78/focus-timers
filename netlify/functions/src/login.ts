import type { Handler } from "@netlify/functions";
import { badRequest, json } from "./lib/http";
import { createSessionToken, buildSessionCookie } from "./auth/session";
import { requireEnv } from "./lib/env";

const PASSWORD = () => requireEnv("APP_PASSWORD");

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { ok: false, error: "Method Not Allowed" });
  }

  let body: Record<string, unknown> = {};
  try {
    body = event.body ? JSON.parse(event.body) : {};
  } catch {
    return badRequest("Invalid JSON");
  }

  const password = typeof body.password === "string" ? body.password : "";
  if (password !== PASSWORD()) {
    return json(401, { ok: false, error: "Invalid password" });
  }

  try {
    const token = createSessionToken();
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": buildSessionCookie(token),
      },
      body: JSON.stringify({ ok: true }),
    };
  } catch (error) {
    console.error("Failed to create session", error);
    return json(500, {
      ok: false,
      error: "Server misconfigured (missing APP_SESSION_SECRET)",
    });
  }
};
