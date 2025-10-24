// src/app/solicitudes/page.tsx
import Link from "next/link";
import { getOpenRequests, type RequestRow } from "@/lib/data";

export const revalidate = 30; // ISR

export default async function SolicitudesPage() {
  const rows = await getOpenRequests();

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Solicitudes abiertas</h1>
      <p className="text-sm text-muted-foreground">
        Postula a los turnos disponibles.
      </p>

      <div className="space-y-4">
        {rows.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No hay solicitudes por ahora.
          </p>
        )}

        {rows.map((r: RequestRow) => (
          <article
            key={r.id}
            className="rounded-lg border p-4 hover:bg-accent/30 transition"
          >
            <div className="flex items-start justify-between">
              <h2 className="font-semibold">{r.title}</h2>
              {r.location && (
                <span className="text-xs text-muted-foreground">
                  {r.location}
                </span>
              )}
            </div>

            <div className="text-sm text-muted-foreground mt-1">
              {formatDate(r.shift_date)} · {hhmm(r.start_time)}–
              {hhmm(r.end_time)}
            </div>

            {r.description && <p className="mt-2 text-sm">{r.description}</p>}

            <div className="text-xs text-muted-foreground mt-2">
              Cupos: {r.slots_taken}/{r.slots_total}
            </div>

            <Link
              href={`/solicitudes/${r.id}`}
              className="mt-3 inline-block text-sm underline"
            >
              Ver detalle / Postular
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}
function hhmm(time: string) {
  return time.slice(0, 5);
}
