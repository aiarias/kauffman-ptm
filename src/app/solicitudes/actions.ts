// src/app/solicitudes/actions.ts
"use server";

import { createClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function postularARequest(formData: FormData) {
  // 👇 IMPORTANTE: esperar el cliente
  const supabase = await createClient();

  // si ya tenías estos nombres, los mantengo:
  const requestId = formData.get("request_id") as string;
  if (!requestId) {
    throw new Error("Falta request_id");
  }

  // obtener usuario autenticado
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    throw new Error("Debes iniciar sesión para postular.");
  }

  const userId = user.id;

  // tu insert (igual que antes), ahora sobre un cliente real, no una promesa
  const { error } = await supabase.from("applications").insert({
    request_id: requestId,
    user_id: userId,
  });

  if (error) {
    console.error("✗ Error al postular:", error.message);
    throw new Error("No se pudo postular.");
  }

  console.log("✓ Postulación registrada con éxito");
  // opcional, refrescar la página del detalle
  revalidatePath(`/solicitudes/${requestId}`, "page");

  return { ok: true };
}
