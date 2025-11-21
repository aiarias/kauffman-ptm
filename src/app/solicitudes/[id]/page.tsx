// src/app/solicitudes/[id]/page.tsx
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import PostularButton from "./PostularButton";
import CancelPostulationButton from "./CancelPostulationButton";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SolicitudDetallePage({ params }: Props) {
  const { id } = await params; // 👈 importante
  const supabase = await createClient();

  // 1) Usuario actual
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  // 2) Datos de la solicitud
  const { data: request, error } = await supabase
    .from("requests")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("request error:", error);
  }

  if (!request) {
    notFound();
  }

  // 3) Postulaciones de este turno
  const { data: apps, error: appsError } = await supabase
    .from("applications")
    .select("id, status, user_id, applied_at")
    .eq("request_id", id);

  if (appsError) {
    console.error("apps error:", appsError);
  }

  const allApps = apps ?? [];

  const acceptedCount = allApps.filter((a) => a.status === "accepted").length;
  const myApp = allApps.find((a) => a.user_id === user.id);

  // 4) Mensaje segun estado de mi postulación
  let statusLabel: string | null = null;
  let canPostular = true;
  let canCancel = false;

  if (myApp?.status === "pending") {
    statusLabel = "Ya estás postulando a este turno. Estado: pendiente.";
    canPostular = false;
    canCancel = true;
  } else if (myApp?.status === "accepted") {
    statusLabel = "Fuiste aceptado para este turno 🎉.";
    canPostular = false;
    canCancel = true; // si NO quieres que pueda salirse, pon esto en false
  } else if (myApp?.status === "rejected") {
    statusLabel =
      "Tu postulación a este turno fue rechazada. Si tienes dudas, consulta con el administrador.";
    canPostular = false;
    canCancel = false;
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <Link href="/solicitudes" className="text-sm underline">
        ← Volver
      </Link>

      <h1 className="text-2xl font-bold">{request.title}</h1>

      <p className="text-sm text-muted-foreground">
        {formatDate(request.shift_date)} · {hhmm(request.start_time)}–
        {hhmm(request.end_time)}
      </p>

      {request.description && (
        <p className="mt-2 text-sm">{request.description}</p>
      )}

      <p className="text-sm font-medium mt-2">
        Cupos: {acceptedCount} / {request.slots_total}
      </p>

      {statusLabel && (
        <p className="mt-2 text-sm text-emerald-700">{statusLabel}</p>
      )}

      {/* Botón de postular (se deshabilita si ya tiene postulación) */}
      <PostularButton requestId={id} disabled={!canPostular} />

      {/* Botón para salirse del turno */}
      {canCancel && <CancelPostulationButton requestId={id} />}
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
