import { notFound } from "next/navigation";
import { getRequestById } from "@/lib/data";
import Link from "next/link";

// Es un Server Component que llama a getRequestById.
// Si no hay fila o está closed, usamos notFound() → Next muestra 404.
// Renderiza todos los datos; el botón queda “placeholder” por ahora (sin "use client" aún).

type Props = { params: { id: string } };

export default async function SolicitudDetailPage({ params }: Props) {
  const row = await getRequestById(params.id);

  if (!row || row.status !== "open") {
    // Si no existe o está cerrada, 404
    notFound();
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-4">
      <Link href="/solicitudes" className="text-sm underline">
        ← Volver
      </Link>

      <h1 className="text-2xl font-bold">{row.title}</h1>

      <div className="text-sm text-muted-foreground">
        {formatDate(row.shift_date)} · {hhmm(row.start_time)}–
        {hhmm(row.end_time)}
      </div>

      {row.location && (
        <div className="text-sm text-muted-foreground">
          Lugar: {row.location}
        </div>
      )}

      {row.description && <p className="mt-2">{row.description}</p>}

      <div className="text-sm text-muted-foreground">
        Cupos: {row.slots_taken}/{row.slots_total}
      </div>

      {/* El botón real de postulación lo agregamos en el próximo paso */}
      <button
        className="mt-4 inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50"
        disabled={row.slots_taken >= row.slots_total}
        title={
          row.slots_taken >= row.slots_total ? "Sin cupos" : "Próximamente"
        }
      >
        Postular (próximo paso)
      </button>
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
