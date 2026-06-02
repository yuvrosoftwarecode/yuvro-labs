import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type AuthUser = { email: string; name: string; role: "user" | "admin" };

type AuthCtx = {
  user: AuthUser | null;
  signIn: (email: string, password: string) => { ok: true } | { ok: false; error: string };
  signUp: (name: string, email: string, password: string) => { ok: true } | { ok: false; error: string };
  adminSignIn: (email: string, password: string) => { ok: true } | { ok: false; error: string };
  signOut: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);
const KEY = "yuvro-auth-user";
const USERS_KEY = "yuvro-users";

const ADMIN_EMAIL = "admin@yuvro.com";
const ADMIN_PASSWORD = "admin123";

function readUsers(): Record<string, { name: string; password: string }> {
  try {
    if (typeof localStorage === "undefined") return {};
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeUsers(u: Record<string, { name: string; password: string }>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(u));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const persist = (u: AuthUser | null) => {
    setUser(u);
    if (u) localStorage.setItem(KEY, JSON.stringify(u));
    else localStorage.removeItem(KEY);
  };

  const signIn: AuthCtx["signIn"] = (email, password) => {
    const users = readUsers();
    const rec = users[email.toLowerCase()];
    if (!rec) return { ok: false, error: "No account found. Please sign up." };
    if (rec.password !== password) return { ok: false, error: "Incorrect password." };
    persist({ email: email.toLowerCase(), name: rec.name, role: "user" });
    return { ok: true };
  };

  const signUp: AuthCtx["signUp"] = (name, email, password) => {
    if (!name.trim() || !email.trim() || password.length < 6)
      return { ok: false, error: "Fill all fields. Password ≥ 6 chars." };
    const users = readUsers();
    const key = email.toLowerCase();
    if (users[key]) return { ok: false, error: "Email already registered." };
    users[key] = { name, password };
    writeUsers(users);
    persist({ email: key, name, role: "user" });
    return { ok: true };
  };

  const adminSignIn: AuthCtx["adminSignIn"] = (email, password) => {
    if (email.toLowerCase() !== ADMIN_EMAIL || password !== ADMIN_PASSWORD)
      return { ok: false, error: "Invalid admin credentials." };
    persist({ email: ADMIN_EMAIL, name: "Administrator", role: "admin" });
    return { ok: true };
  };

  const signOut = () => persist(null);

  return <Ctx.Provider value={{ user, signIn, signUp, adminSignIn, signOut }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
