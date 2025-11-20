import type { Handler } from "@netlify/functions";
import { json } from "./lib/http";
import { requireAuth } from "./auth/requireAuth";

export const handler: Handler = async (event) => {
  if (!requireAuth(event)) {
    return json(401, { ok: false });
  }

  return json(200, { ok: true });
};
