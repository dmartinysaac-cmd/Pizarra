import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

/* ============================================================
   PIZARRA Analytics — Sistema de acceso (demo local)
   Niveles: free | premium · Persistencia en localStorage
   ============================================================ */

export type Plan = "free" | "premium";

export interface User {
  name: string;
  email: string;
  plan: Plan;
  since: string;
}

interface StoredUser extends User {
  password: string;
}

interface UserData {
  saved: string[];
  history: { id: string; at: number }[];
  visits: number;
}

interface Toast {
  id: number;
  kind: "ok" | "warn" | "info";
  msg: string;
}

interface AuthCtx {
  user: User | null;
  isPremium: boolean;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  register: (name: string, email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  upgrade: () => void;
  cancelPremium: () => void;
  saved: string[];
  toggleSave: (id: string) => void;
  isSaved: (id: string) => boolean;
  history: { id: string; at: number }[];
  pushHistory: (id: string) => void;
  visits: number;
  toasts: Toast[];
  toast: (msg: string, kind?: Toast["kind"]) => void;
}

const Ctx = createContext<AuthCtx | null>(null);

const K_USERS = "pizarra:users";
const K_SESSION = "pizarra:session";
const dataKey = (email: string) => `pizarra:data:${email.toLowerCase()}`;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* almacenamiento no disponible */
  }
}

const DEMO_USERS: StoredUser[] = [
  { name: "Analista Demo", email: "demo@pizarra.app", password: "demo1234", plan: "free", since: "2025-11-02" },
  { name: "Socio Premium", email: "pro@pizarra.app", password: "pro1234", plan: "premium", since: "2025-08-14" },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<StoredUser[]>(() => {
    const stored = read<StoredUser[]>(K_USERS, []);
    if (stored.length === 0) {
      write(K_USERS, DEMO_USERS);
      return DEMO_USERS;
    }
    return stored;
  });
  const [sessionEmail, setSessionEmail] = useState<string | null>(() => read<string | null>(K_SESSION, null));
  const [userData, setUserData] = useState<UserData>({ saved: [], history: [], visits: 0 });
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  /* carga de datos del usuario en sesión */
  useEffect(() => {
    if (sessionEmail) {
      setUserData(read<UserData>(dataKey(sessionEmail), { saved: [], history: [], visits: 1 }));
    } else {
      setUserData({ saved: [], history: [], visits: 0 });
    }
  }, [sessionEmail]);

  const persistData = useCallback(
    (next: UserData) => {
      setUserData(next);
      if (sessionEmail) write(dataKey(sessionEmail), next);
    },
    [sessionEmail]
  );

  const toast = useCallback((msg: string, kind: Toast["kind"] = "ok") => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, kind, msg }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);

  const user = useMemo(() => {
    if (!sessionEmail) return null;
    const u = users.find((x) => x.email.toLowerCase() === sessionEmail.toLowerCase());
    return u ? { name: u.name, email: u.email, plan: u.plan, since: u.since } : null;
  }, [sessionEmail, users]);

  const login = useCallback(
    (email: string, password: string) => {
      const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (!found) return { ok: false, error: "No existe ninguna cuenta con ese email." };
      if (found.password !== password) return { ok: false, error: "Contraseña incorrecta. Prueba de nuevo." };
      write(K_SESSION, found.email);
      setSessionEmail(found.email);
      toast(`Bienvenido de nuevo, ${found.name.split(" ")[0]}.`);
      return { ok: true };
    },
    [users, toast]
  );

  const register = useCallback(
    (name: string, email: string, password: string) => {
      const exists = users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (exists) return { ok: false, error: "Ya existe una cuenta con ese email. Inicia sesión." };
      const newUser: StoredUser = {
        name: name.trim(),
        email: email.trim(),
        password,
        plan: "free",
        since: new Date().toISOString().slice(0, 10),
      };
      const next = [...users, newUser];
      setUsers(next);
      write(K_USERS, next);
      write(dataKey(newUser.email), { saved: [], history: [], visits: 1 });
      write(K_SESSION, newUser.email);
      setSessionEmail(newUser.email);
      toast("Cuenta creada. Bienvenido al plan Gratuito.");
      return { ok: true };
    },
    [users, toast]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(K_SESSION);
    setSessionEmail(null);
    toast("Sesión cerrada. Hasta pronto.", "info");
  }, [toast]);

  const upgrade = useCallback(() => {
    if (!sessionEmail) return;
    const next = users.map((u) => (u.email.toLowerCase() === sessionEmail.toLowerCase() ? { ...u, plan: "premium" as Plan } : u));
    setUsers(next);
    write(K_USERS, next);
    toast("Premium activado. Análisis profundos desbloqueados.");
  }, [users, sessionEmail, toast]);

  const cancelPremium = useCallback(() => {
    if (!sessionEmail) return;
    const next = users.map((u) => (u.email.toLowerCase() === sessionEmail.toLowerCase() ? { ...u, plan: "free" as Plan } : u));
    setUsers(next);
    write(K_USERS, next);
    toast("Has vuelto al plan Gratuito.", "info");
  }, [users, sessionEmail, toast]);

  const toggleSave = useCallback(
    (id: string) => {
      if (!user) {
        toast("Inicia sesión para guardar análisis.", "warn");
        return;
      }
      const has = userData.saved.includes(id);
      persistData({ ...userData, saved: has ? userData.saved.filter((x) => x !== id) : [...userData.saved, id] });
      toast(has ? "Análisis eliminado de guardados." : "Análisis guardado en tu panel.", has ? "info" : "ok");
    },
    [user, userData, persistData, toast]
  );

  const isSaved = useCallback((id: string) => userData.saved.includes(id), [userData.saved]);

  const pushHistory = useCallback(
    (id: string) => {
      if (!sessionEmail) return;
      const rest = userData.history.filter((h) => h.id !== id);
      persistData({ ...userData, history: [{ id, at: Date.now() }, ...rest].slice(0, 12), visits: userData.visits + 1 });
    },
    [sessionEmail, userData, persistData]
  );

  const value: AuthCtx = {
    user,
    isPremium: user?.plan === "premium",
    login,
    register,
    logout,
    upgrade,
    cancelPremium,
    saved: userData.saved,
    toggleSave,
    isSaved,
    history: userData.history,
    pushHistory,
    visits: userData.visits,
    toasts,
    toast,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
