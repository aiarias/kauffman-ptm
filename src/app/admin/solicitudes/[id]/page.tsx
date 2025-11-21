// src/app/admin/solicitudes/[id]/page.tsx
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { requireRole } from "@/lib/auth";
import {
  updateRequest,
  updateApplicationStatus,
  deleteApplication,
} from "../actions";

export const dynamic = "force-dynamic";

interface Props {
  // Next 15: params es una Promise
  params: Promise<{ id: string }>;
}

export default async function EditSolicitudPage({ params }: Props) {
  const { id } = await params;

  await requireRole(["admin", "superadmin"]);

  const supabase = await createClient();

  // 1) Traer la solicitud
  const { data: request, error } = await supabase
    .from("requests")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("edit request error:", error);
  }

  if (!request) {
    notFound();
  }

  // 2) Traer postulaciones de esta solicitud + datos básicos del usuario
  const { data: applications, error: appsError } = await supabase
    .from("applications")
    .select("id, status, applied_at, user:users ( full_name, email )")
    .eq("request_id", id)
    .order("applied_at", { ascending: true });

  if (appsError) {
    console.error("applications error:", appsError);
  }

  const apps = applications ?? [];
  const acceptedCount = apps.filter((a: any) => a.status === "accepted").length;

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-8">
      {/* --------- Formulario para editar la solicitud --------- */}
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Editar solicitud</h1>

        <form action={updateRequest.bind(null, id)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Título</label>
            <input
              name="title"
              defaultValue={request.title}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Descripción
            </label>
            <textarea
              name="description"
              defaultValue={request.description ?? ""}
              className="w-full border rounded-lg p-2"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fecha</label>
              <input
                type="date"
                name="shift_date"
                defaultValue={request.shift_date}
                className="w-full border rounded-lg p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Hora inicio
              </label>
              <input
                type="time"
                name="start_time"
                defaultValue={request.start_time?.slice(0, 5)}
                className="w-full border rounded-lg p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Hora término
              </label>
              <input
                type="time"
                name="end_time"
                defaultValue={request.end_time?.slice(0, 5)}
                className="w-full border rounded-lg p-2"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Cupos</label>
              <input
                type="number"
                name="slots_total"
                min={1}
                defaultValue={request.slots_total}
                className="w-full border rounded-lg p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Estado</label>
              <select
                name="status"
                defaultValue={request.status}
                className="w-full border rounded-lg p-2"
              >
                <option value="open">Abierta</option>
                <option value="closed">Cerrada</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="rounded-lg bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
          >
            Guardar cambios
          </button>
        </form>
      </section>

      {/* --------- Panel de postulaciones --------- */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">Postulaciones</h2>
          <p className="text-sm text-muted-foreground">
            Aceptados: {acceptedCount} / {request.slots_total}
          </p>
        </div>

        {apps.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay postulaciones aún.
          </p>
        ) : (
          <ul className="space-y-2">
            {apps.map((app: any) => {
              const user = app.user as {
                full_name?: string;
                email?: string;
              } | null;
              const nameOrEmail =
                user?.full_name || user?.email || "Sin nombre";

              const appliedLabel = app.applied_at
                ? new Date(app.applied_at).toLocaleString()
                : null;

              return (
                <li
                  key={app.id}
                  className="flex items-center justify-between rounded border px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium">{nameOrEmail}</p>
                    <p className="text-xs text-muted-foreground">
                      Estado: {app.status}
                      {appliedLabel && ` · Postuló el ${appliedLabel}`}
                    </p>
                  </div>

                  <div className="flex gap-2 items-center">
                    {app.status === "pending" && (
                      <>
                        <form action={updateApplicationStatus}>
                          <input type="hidden" name="request_id" value={id} />
                          <input
                            type="hidden"
                            name="application_id"
                            value={app.id}
                          />
                          <input type="hidden" name="status" value="accepted" />
                          <button
                            type="submit"
                            className="rounded bg-emerald-600 text-white px-2 py-1 text-xs hover:bg-emerald-700"
                          >
                            Aceptar
                          </button>
                        </form>

                        <form action={updateApplicationStatus}>
                          <input type="hidden" name="request_id" value={id} />
                          <input
                            type="hidden"
                            name="application_id"
                            value={app.id}
                          />
                          <input type="hidden" name="status" value="rejected" />
                          <button
                            type="submit"
                            className="rounded bg-red-600 text-white px-2 py-1 text-xs hover:bg-red-700"
                          >
                            Rechazar
                          </button>
                        </form>
                      </>
                    )}

                    {app.status === "accepted" && (
                      <span className="text-xs font-semibold text-emerald-700">
                        Aceptado
                      </span>
                    )}

                    {app.status === "rejected" && (
                      <span className="text-xs font-semibold text-red-600">
                        Rechazado
                      </span>
                    )}
                    <form action={deleteApplication}>
                      <input type="hidden" name="request_id" value={id} />
                      <input
                        type="hidden"
                        name="application_id"
                        value={app.id}
                      />
                      <button
                        type="submit"
                        className="rounded border border-red-300 text-red-600 px-2 py-1 text-xs hover:bg-red-50"
                      >
                        Quitar del turno
                      </button>
                    </form>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
