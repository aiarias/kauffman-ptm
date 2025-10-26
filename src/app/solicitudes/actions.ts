// src/app/solicitudes/actions.ts
"use server";

import { createClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export type PostularState = { ok: boolean; message?: string };

export async function postularARequest(
  prevState: PostularState,
  formData: FormData
): Promise<PostularState> {
  const requestId = formData.get("request_id");
  if (typeof requestId !== "string" || !requestId) {
    return { ok: false, message: "Falta request_id" };
  }

  // 👇 IMPORTANTE: esperar el cliente
  const supabase = await createClient();

  // si ya tenías estos nombres, los mantengo:
  // const requestId = formData.get("request_id") as string;
  // if (!requestId) {
  //   throw new Error("Falta request_id");
  // }

  // obtener usuario autenticado
  // const {
  //   data: { user },
  //   error: userErr,
  // } = await supabase.auth.getUser();

  // if (userErr || !user) {
  //   throw new Error("Debes iniciar sesión para postular.");
  // }

  const userId = "cb4c2a97-17f3-4f08-8bcf-5ec2c9e508f0"; //PARA PROBAR CON UN USUARIO

  const { error } = await supabase
    .from("applications")
    .insert({ request_id: requestId, user_id: userId });

  if (error) {
    // Unique violation (ya postuló a ese turno)
    if ((error as any).code === "23505") {
      return { ok: false, message: "Ya habías postulado a este turno." };
    }
    console.error("Error al postular:", error);
    return { ok: false, message: "No se pudo postular." };
  }

  return { ok: true, message: "Postulación enviada con éxito" };

  // if (error) {
  //   console.error("Error al postular:", error);
  //   throw new Error("No se pudo postular");
  // }

  // // Opcional: refrescamos la página del detalle o la lista
  // revalidatePath(`/solicitudes/${requestId}`);
  // revalidatePath(`/solicitudes`);
  // No retornes nada (void)

  // tu insert (igual que antes), ahora sobre un cliente real, no una promesa
  // const { error } = await supabase.from("applications").insert({
  //   request_id: requestId,
  //   user_id: userId,
  // });

  // if (error) {
  //   console.error("✗ Error al insertar en applications:", error.message);
  //   throw new Error("No se pudo postular.");
  // }

  // console.log("✓ Postulación registrada con éxito");
  // // opcional, refrescar la página del detalle
  // revalidatePath(`/solicitudes/${requestId}`, "page");

  // return { ok: true };
}
