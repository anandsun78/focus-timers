export interface AuthClient {
  checkSession(): Promise<boolean>;
  login(password: string): Promise<{ ok: boolean; error?: string }>;
}

const readJson = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

export class NetlifyAuthClient implements AuthClient {
  async checkSession(): Promise<boolean> {
    try {
      const response = await fetch("/.netlify/functions/auth-check");
      if (!response.ok) {
        return false;
      }
      const payload = await readJson(response);
      return Boolean(payload.ok);
    } catch {
      return false;
    }
  }

  async login(password: string): Promise<{ ok: boolean; error?: string }> {
    try {
      const response = await fetch("/.netlify/functions/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const payload = await readJson(response);
      if (!response.ok || !payload.ok) {
        return { ok: false, error: payload.error || "Invalid password" };
      }
      return { ok: true };
    } catch {
      return { ok: false, error: "Network error" };
    }
  }
}
