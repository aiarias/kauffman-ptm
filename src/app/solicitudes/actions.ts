// src/app/solicitudes/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase-server";

export type PostularState = {
  ok: boolean;
  message: string;
};

export async function postularARequest(
  prevState: PostularState,
  formData: FormData
): Promise<PostularState> {
  const supabase = await createClient();

  // 1) Id de la solicitud desde el formulario
  const requestId = String(formData.get("request_id") ?? "");
  if (!requestId) {
    return { ok: false, message: "Solicitud inválida." };
  }

  // 2) Usuario actual
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { ok: false, message: "Debes iniciar sesión para postular." };
  }

  // 3) ¿Ya existe una postulación de este usuario a esta solicitud?
  const { data: existing, error: existingError } = await supabase
    .from("applications")
    .select("id, status")
    .eq("request_id", requestId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!existingError && existing) {
    // Si quieres permitir re-postular cuando status = 'cancelled',
    // aquí podrías hacer una excepción. Por ahora, bloqueamos siempre.
    return {
      ok: false,
      message: "Ya has postulado a este turno.",
    };
  }

  // 4) Insertar la nueva postulación
  const { error } = await supabase.from("applications").insert({
    request_id: requestId,
    user_id: user.id,
    status: "pending", // quítalo si no tienes esta columna
  });

  if (error) {
    console.error("Error al postular:", error);

    // Defensa extra por si la BD lanza 'unique violation'
    if ((error as any).code === "23505") {
      return {
        ok: false,
        message: "Ya habías postulado a este turno.",
      };
    }

    return { ok: false, message: "No se pudo postular." };
  }

  return { ok: true, message: "Postulación enviada correctamente." };
}

// 🔴 NUEVA: cancelar postulación del usuario en ese turno
export async function cancelApplication(
  prevState: PostularState,
  formData: FormData
): Promise<PostularState> {
  const supabase = await createClient();

  const requestId = String(formData.get("request_id") ?? "");
  if (!requestId) {
    return { ok: false, message: "Solicitud inválida." };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { ok: false, message: "Debes iniciar sesión." };
  }

  const { error } = await supabase
    .from("applications")
    .delete()
    .eq("request_id", requestId)
    .eq("user_id", user.id);

  if (error) {
    console.error("cancelApplication error:", error);
    return { ok: false, message: "No se pudo cancelar tu postulación." };
  }

  // refrescar lista y detalle
  revalidatePath("/solicitudes");
  revalidatePath(`/solicitudes/${requestId}`);

  return { ok: true, message: "Postulación cancelada correctamente." };
}
