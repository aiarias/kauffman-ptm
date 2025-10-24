import "server-only";
import { createClient } from "@/lib/supabase";

export type RequestRow = {
  id: string;
  title: string;
  location: string | null;
  shift_date: string; // YYYY-MM-DD
  start_time: string; // HH:MM:SS
  end_time: string; // HH:MM:SS
  description: string | null;
  slots_total: number;
  slots_taken: number;
};

/**
 * Trae solicitudes abiertas ordenadas por fecha y hora.
 * Corre en el servidor y respeta la política RLS.
 */
export async function getOpenRequests(): Promise<RequestRow[]> {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .eq("status", "open")
    .gte("shift_date", today)
    .order("shift_date", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) {
    console.error("getOpenRequests error:", error);
    return [];
  }
  return data ?? [];
}

/**
 * Trae 1 solicitud por id. RLS permite ver solo abiertas.
 * - Si no existe o está cerrada, retorna null (o podemos notFound()).
 */
export async function getRequestById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("getRequestById error:", error);
    return null;
  }
  return data;
}
