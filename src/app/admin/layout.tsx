// src/app/admin/layout.tsx
import { ReactNode } from "react";
import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Solo admin y superadmin pueden ver cualquier ruta bajo /admin
  await requireRole(["admin", "superadmin"]);
  return <>{children}</>;
}
