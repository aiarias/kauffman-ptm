import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { requireRole } from "@/lib/auth";
import { deleteRequest } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminSolicitudesPage() {
  const { user, role, fullName } = await requireRole(["admin", "superadmin"]);

  const supabase = await createClient();

  const { data: requests, error } = await supabase
    .from("requests")
    .select("*")
    .order("shift_date", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) {
    console.error("admin list error:", error);
  }

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Panel Admin</h1>
        <p className="text-sm text-muted-foreground">
          Bienvenido {fullName ?? user.email} · Rol: {role}
        </p>
      </header>

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Solicitudes</h2>
        <Link
          href="/admin/solicitudes/nueva"
          className="rounded-lg bg-blue-600 text-white px-3 py-1 text-sm hover:bg-blue-700"
        >
          Nueva solicitud
        </Link>
      </div>

      {(!requests || requests.length === 0) && (
        <p className="text-sm text-muted-foreground">
          No hay solicitudes creadas aún.
        </p>
      )}

      {requests && requests.length > 0 && (
        <div className="space-y-3">
          {requests.map((r: any) => (
            <article
              key={r.id}
              className="flex items-start justify-between gap-4 rounded-lg border p-4"
            >
              <div className="space-y-1">
                <h3 className="font-semibold">{r.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {r.shift_date} · {r.start_time?.slice(0, 5)}–
                  {r.end_time?.slice(0, 5)}
                </p>
                {r.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {r.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Cupos: {r.slots_total} · Estado: {r.status}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <Link
                  href={`/admin/solicitudes/${r.id}`}
                  className="text-sm underline"
                >
                  Editar
                </Link>

                <form action={deleteRequest.bind(null, r.id)}>
                  <button
                    type="submit"
                    className="text-xs text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
