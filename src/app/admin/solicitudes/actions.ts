"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

function getPayloadFromForm(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const shift_date = String(formData.get("shift_date") || ""); // YYYY-MM-DD
  const start_time = String(formData.get("start_time") || ""); // HH:MM
  const end_time = String(formData.get("end_time") || ""); // HH:MM
  const slots_total = Number(formData.get("slots_total") || 0);
  const status = (formData.get("status") || "open") as string;

  if (!title) throw new Error("El título es obligatorio");
  if (!shift_date) throw new Error("La fecha es obligatoria");
  if (!start_time || !end_time)
    throw new Error("Horario de inicio y término son obligatorios");
  if (!slots_total || slots_total <= 0)
    throw new Error("Cupos debe ser un número mayor a 0");

  return {
    title,
    description: description || null,
    shift_date,
    start_time: `${start_time}:00`, // HH:MM:SS
    end_time: `${end_time}:00`,
    slots_total,
    status,
  };
}

export async function createRequest(formData: FormData) {
  const supabase = await createClient();

  // usuario actual para guardar created_by
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("No hay usuario autenticado");
  }

  const payload = getPayloadFromForm(formData);

  const { error } = await supabase.from("requests").insert({
    ...payload,
    created_by: user.id,
    // created_at usa el default de la tabla (now())
  });

  if (error) {
    console.error("createRequest error:", error);
    throw new Error("No se pudo crear la solicitud");
  }

  revalidatePath("/solicitudes");
  revalidatePath("/admin/solicitudes");

  redirect("/admin/solicitudes");
}

export async function updateRequest(id: string, formData: FormData) {
  const supabase = await createClient();
  const payload = getPayloadFromForm(formData);

  const { error } = await supabase
    .from("requests")
    .update(payload)
    .eq("id", id);

  if (error) {
    console.error("updateRequest error:", error);
    throw new Error("No se pudo actualizar la solicitud");
  }

  revalidatePath("/solicitudes");
  revalidatePath("/admin/solicitudes");

  redirect("/admin/solicitudes");
}

export async function deleteRequest(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("requests").delete().eq("id", id);

  if (error) {
    console.error("deleteRequest error:", error);
    throw new Error("No se pudo eliminar la solicitud");
  }

  revalidatePath("/solicitudes");
  revalidatePath("/admin/solicitudes");
}
