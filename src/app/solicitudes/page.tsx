// src/app/solicitudes/page.tsx
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function SolicitudesPage() {
  // 1) Autenticación
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  // 2) Solicitudes abiertas
  const { data: requests, error } = await supabase
    .from("requests")
    .select("*")
    .eq("status", "open")
    .order("shift_date", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) {
    console.error("solicitudes list error:", error);
  }

  const reqs = requests ?? [];

  // 3) Postulaciones aceptadas (para contar cupos ocupados)
  const { data: acceptedApps, error: appsError } = await supabase
    .from("applications")
    .select("request_id, status")
    .eq("status", "accepted");

  if (appsError) {
    console.error("acceptedApps error:", appsError);
  }

  // 4) Mapa request_id -> cantidad aceptados
  const acceptedMap: Record<string, number> = {};
  (acceptedApps ?? []).forEach((app) => {
    const key = (app as any).request_id as string;
    if (!acceptedMap[key]) acceptedMap[key] = 0;
    acceptedMap[key]++;
  });

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Solicitudes abiertas</h1>
        <p className="text-sm text-muted-foreground">
          Postula a los turnos disponibles.
        </p>
      </header>

      {reqs.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No hay solicitudes por ahora.
        </p>
      )}

      {reqs.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {reqs.map((r: any) => {
            const acceptedCount = acceptedMap[r.id] ?? 0;

            return (
              <article
                key={r.id}
                className="rounded-lg border p-4 hover:bg-accent/30 transition"
              >
                <div className="flex items-start justify-between">
                  <h2 className="font-semibold">{r.title}</h2>
                </div>

                <div className="text-sm text-muted-foreground mt-1">
                  {formatDate(r.shift_date)} · {hhmm(r.start_time)}–
                  {hhmm(r.end_time)}
                </div>

                {r.description && (
                  <p className="mt-2 text-sm">{r.description}</p>
                )}

                <div className="text-xs text-muted-foreground mt-2">
                  Cupos: {acceptedCount} / {r.slots_total}
                </div>

                <Link
                  href={`/solicitudes/${r.id}`}
                  className="mt-3 inline-block text-sm underline"
                >
                  Ver detalle / Postular
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

function formatDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

function hhmm(time: string) {
  return time?.slice(0, 5);
}
