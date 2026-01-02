import {
  API_ENDPOINTS,
  CONTENT_TYPE,
  ERROR_TEXT,
  HTTP_METHODS,
} from "./constants";

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
      const response = await fetch(API_ENDPOINTS.authCheck);
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
      const response = await fetch(API_ENDPOINTS.login, {
        method: HTTP_METHODS.post,
        headers: { "Content-Type": CONTENT_TYPE.json },
        body: JSON.stringify({ password }),
      });

      const payload = await readJson(response);
      if (!response.ok || !payload.ok) {
        return {
          ok: false,
          error: payload.error || ERROR_TEXT.invalidPassword,
        };
      }
      return { ok: true };
    } catch {
      return { ok: false, error: ERROR_TEXT.networkError };
    }
  }
}
