// src/app/auth/callback/route.ts
import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/lib/supabase-server";

const AFTER_LOGIN = "/solicitudes";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code") ?? undefined;

  // Redirigimos al final del handler
  const res = NextResponse.redirect(new URL(AFTER_LOGIN, url.origin));

  // Cliente SSR que LE/ESCRIBE cookies en la Response
  const supabase = await createClient(res);

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      // Puedes leer este header en UI para mostrar mensaje
      res.headers.set("x-auth-error", error.message);
      return res;
    }

    // Opcional: asegurar fila en public.users
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase
        .from("users")
        .upsert(
          { id: user.id, email: user.email?.toLowerCase() ?? null },
          { onConflict: "id" }
        );
    }
  }

  return res;
}
