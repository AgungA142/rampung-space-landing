"use client";

import { useCallback } from "react";

export function useAuth() {
  const signIn = useCallback(async (email: string, password: string) => {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({ error: "Login failed" }));
      return { error: body.error ?? "Login failed" };
    }

    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    const response = await fetch("/api/admin/logout", { method: "POST" });
    return { error: response.ok ? null : "Logout failed" };
  }, []);

  return { signIn, signOut };
}
