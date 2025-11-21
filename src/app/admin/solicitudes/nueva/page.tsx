import { createRequest } from "../actions";
import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NuevaSolicitudPage() {
  await requireRole(["admin", "superadmin"]);

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Nueva solicitud</h1>
      <p className="text-sm text-muted-foreground">
        Crea un nuevo turno / solicitud para que los usuarios puedan postular.
      </p>

      <form action={createRequest} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Título</label>
          <input
            name="title"
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            name="description"
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
              className="w-full border rounded-lg p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Estado</label>
            <select
              name="status"
              className="w-full border rounded-lg p-2"
              defaultValue="open"
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
          Guardar
        </button>
      </form>
    </main>
  );
}
