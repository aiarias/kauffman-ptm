import { supabase } from "@/lib/supabase";

export default async function AdminSolicitudesPage() {
  const { data: rows, error } = await supabase
    .from("requests")
    .select("*")
    .order("starts_at", { ascending: true });

  if (error) return <pre className="p-6 text-red-600">{error.message}</pre>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Solicitudes (Admin)</h1>
      <p className="text-muted-foreground">Crear y gestionar solicitudes.</p>
      <ul className="list-disc pl-6">
        {rows?.map((r) => (
          <li key={r.id}>
            {r.title} — {new Date(r.starts_at).toLocaleString()} ({r.slots}{" "}
            cupos)
          </li>
        ))}
      </ul>
    </div>
  );
}
