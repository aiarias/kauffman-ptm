// Server-only helpers
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

export async function getCurrentUserAndRole() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, role: null, fullName: null };

  // Busca su rol en tu tabla pública
  const { data, error } = await supabase
    .from("users")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  // Si aún no tiene fila, role será null
  return { user, role: data?.role ?? null, fullName: data?.full_name ?? null };
}

/** Garantiza sesión; si no hay sesión → /auth/signin */
export async function requireAuth() {
  const { user, role, fullName } = await getCurrentUserAndRole();
  if (!user) redirect("/auth/signin");
  return { user, role, fullName };
}

/** Asegura que el rol esté dentro de los permitidos, si no → 404 */
export async function requireRole(
  allowed: Array<"superadmin" | "admin" | "member">
) {
  const { user, role, fullName } = await requireAuth();
  if (!role || !allowed.includes(role as any)) {
    notFound(); // evita filtrar que existe la ruta
  }
  return { user, role: role as "superadmin" | "admin" | "member", fullName };
}
