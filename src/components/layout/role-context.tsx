"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Role } from "@/lib/routes";

type Ctx = { role: Role; setRole: (r: Role) => void };
const RoleCtx = createContext<Ctx | undefined>(undefined);

export function useRole() {
  const ctx = useContext(RoleCtx);
  if (!ctx) throw new Error("useRole must be used within <RoleProvider>");
  return ctx;
}

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("member");

  // persistimos en localStorage para que recuerde la elección
  useEffect(() => {
    const saved = (localStorage.getItem("ptm-role") as Role) || "member";
    setRole(saved);
  }, []);
  useEffect(() => {
    localStorage.setItem("ptm-role", role);
  }, [role]);

  const value = useMemo(() => ({ role, setRole }), [role]);
  return <RoleCtx.Provider value={value}>{children}</RoleCtx.Provider>;
}
// lo que hace esto es proveer un contexto para manejar el rol del usuario (miembro o admin) en la aplicación.
