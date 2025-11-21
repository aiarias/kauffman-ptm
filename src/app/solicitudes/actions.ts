// src/app/solicitudes/actions.ts
"use server";

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

  // 1) Id de la solicitud que viene del input hidden
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

  // 3) Insertar en applications
  // ⚠️ MUY IMPORTANTE:
  //    Cambia "user_id" y "request_id" si en tu tabla se llaman distinto.
  const { error } = await supabase.from("applications").insert({
    request_id: requestId, // nombre de la FK en public.applications
    user_id: user.id, // columna donde guardas el usuario
    status: "pending", // quítalo si no tienes columna status
  });

  if (error) {
    console.error("Error al postular:", error);
    return { ok: false, message: "No se pudo postular." };
  }

  return { ok: true, message: "Postulación enviada correctamente." };
}
