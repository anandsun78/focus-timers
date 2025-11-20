import { FormEvent, ReactNode, useEffect, useState } from "react";
import { AuthClient, NetlifyAuthClient } from "./authClient";

interface AuthGateProps {
  children: ReactNode;
  client?: AuthClient;
}

const defaultClient = new NetlifyAuthClient();

export const AuthGate = ({ children, client }: AuthGateProps) => {
  const authClient = client ?? defaultClient;
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    let cancelled = false;

    authClient
      .checkSession()
      .then((ok) => {
        if (!cancelled) {
          setAuthed(ok);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setChecking(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [authClient]);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoggingIn(true);
    setError("");
    const result = await authClient.login(password);
    setLoggingIn(false);

    if (!result.ok) {
      setError(result.error || "Invalid password");
      return;
    }

    setAuthed(true);
    setPassword("");
  };

  if (checking) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f3f4f6",
          padding: 16,
        }}
      >
        <div>Checking access…</div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f3f4f6",
          padding: 16,
        }}
      >
        <div
          style={{
            background: "#ffffff",
            borderRadius: 12,
            padding: 24,
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
            width: "100%",
            maxWidth: 360,
          }}
        >
          <h2
            style={{
              marginBottom: 12,
              fontSize: 20,
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            Enter Password
          </h2>
          <p
            style={{
              marginBottom: 16,
              fontSize: 13,
              color: "#6b7280",
              textAlign: "center",
            }}
          >
            This page is private.
          </p>

          <form
            onSubmit={handleLogin}
            style={{ display: "grid", gap: 12 }}
          >
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #d1d5db",
                fontSize: 14,
              }}
            />
            {error && (
              <div style={{ color: "#b91c1c", fontSize: 12 }}>{error}</div>
            )}
            <button
              type="submit"
              disabled={loggingIn || !password}
              style={{
                padding: "8px 12px",
                background: loggingIn ? "#93c5fd" : "#2563eb",
                color: "white",
                borderRadius: 8,
                border: "none",
                cursor: loggingIn ? "default" : "pointer",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              {loggingIn ? "Checking…" : "Unlock"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
