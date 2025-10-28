import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SuperadminPage() {
  // Solo superadmin
  const { user, role, fullName } = await requireRole(["superadmin"]);

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Panel Superadmin</h1>
      <p className="text-sm text-muted-foreground">
        Bienvenido {fullName ?? user.email} · Rol: {role}
      </p>

      <div className="rounded-lg border p-4">
        <ul className="list-disc pl-5 space-y-1">
          <li>Gestión de administradores</li>
          <li>Configuración global</li>
          <li>Reportes de alto nivel</li>
        </ul>
      </div>
    </main>
  );
}
