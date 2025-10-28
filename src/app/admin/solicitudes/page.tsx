import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic"; // opcional para evitar cache

export default async function AdminPage() {
  // Permite admin y superadmin
  const { user, role, fullName } = await requireRole(["admin", "superadmin"]);

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Panel Admin</h1>
      <p className="text-sm text-muted-foreground">
        Bienvenido {fullName ?? user.email} · Rol: {role}
      </p>

      <div className="rounded-lg border p-4">
        <ul className="list-disc pl-5 space-y-1">
          <li>Crear/editar solicitudes (turnos/eventos)</li>
          <li>Revisar postulaciones</li>
          <li>Elegir/confirmar part-time para un turno</li>
        </ul>
      </div>
    </main>
  );
}
