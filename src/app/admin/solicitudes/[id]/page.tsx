// src/app/admin/solicitudes/[id]/page.tsx
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { requireRole } from "@/lib/auth";
import { updateRequest } from "../actions";

export const dynamic = "force-dynamic";

interface Props {
  // 👇 ahora params es una Promise
  params: Promise<{ id: string }>;
}

export default async function EditSolicitudPage({ params }: Props) {
  // 👇 hacemos await a params y sacamos el id
  const { id } = await params;

  await requireRole(["admin", "superadmin"]);

  const supabase = await createClient();

  const { data: request, error } = await supabase
    .from("requests")
    .select("*")
    .eq("id", id) // usamos id, no params.id
    .maybeSingle();

  if (error) {
    console.error("edit request error:", error);
  }

  if (!request) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
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
          <label className="block text-sm font-medium mb-1">Descripción</label>
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
    </main>
  );
}
