import type { HandlerResponse } from "@netlify/functions";

export const json = (
  statusCode: number,
  payload: unknown
): HandlerResponse => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload ?? null),
});

export const ok = (payload: Record<string, unknown> = { ok: true }) =>
  json(200, { ok: true, ...payload });

export const badRequest = (message: string) =>
  json(400, { ok: false, error: message });

export const methodNotAllowed = () =>
  json(405, { ok: false, error: "Method Not Allowed" });
