// src/app/solicitudes/[id]/page.tsx
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import PostularButton from "./PostularButton";

export const dynamic = "force-dynamic";

interface PageProps {
  // 👈 AHORA params es una Promise
  params: Promise<{ id: string }>;
}

export default async function SolicitudDetallePage({ params }: PageProps) {
  const { id } = await params; // 👈 AQUÍ hacemos el await

  const supabase = await createClient();

  // 1) Asegurar usuario logueado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  // 2) Traer la solicitud
  const { data: request, error } = await supabase
    .from("requests")
    .select("*")
    .eq("id", id) // 👈 usamos id, no params.id
    .maybeSingle();

  if (error) {
    console.error("request detail error:", error);
  }
  if (!request) {
    notFound();
  }

  // 3) Ver si este usuario ya tiene una postulación a esta solicitud
  const { data: application } = await supabase
    .from("applications")
    .select("id, status")
    .eq("request_id", id) // 👈 idem aquí
    .eq("user_id", user.id)
    .maybeSingle();

  // 4) Texto amigable según estado
  let statusLabel: string | null = null;
  if (application) {
    switch (application.status) {
      case "pending":
        statusLabel = "Ya estás postulando a este turno. Estado: pendiente.";
        break;
      case "accepted":
        statusLabel = "Fuiste aceptado para este turno 🎉.";
        break;
      case "rejected":
        statusLabel = "Tu postulación fue rechazada.";
        break;
      default:
        statusLabel = `Ya estás postulando a este turno. Estado: ${application.status}.`;
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-4">
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

      <p className="mt-2 text-sm text-muted-foreground">
        Cupos: {request.slots_total}
      </p>

      {application ? (
        <p className="mt-4 text-sm text-emerald-700">{statusLabel}</p>
      ) : (
        // 👇 también aquí usamos id
        <PostularButton requestId={id} />
      )}
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
  return time?.slice(0, 5);
}
