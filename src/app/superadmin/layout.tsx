// src/app/superadmin/layout.tsx
import { ReactNode } from "react";
import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SuperadminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireRole(["superadmin"]);
  return <>{children}</>;
}
