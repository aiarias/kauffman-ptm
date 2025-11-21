// src/app/auth/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

const DEFAULT_AFTER_LOGIN = "/solicitudes";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code") ?? undefined;

  // Respuesta temporal SOLO para que Supabase pueda escribir cookies
  const cookieRes = new NextResponse();

  const supabase = await createClient(cookieRes);

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      // si hay error, redirigimos al login con el mensaje
      const errorUrl = new URL(
        `/auth/signin?error=${encodeURIComponent(error.message)}`,
        url.origin
      );
      const errorRedirect = NextResponse.redirect(errorUrl, {
        headers: cookieRes.headers,
      });
      return errorRedirect;
    }
  }

  // Obtener usuario autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let redirectPath = DEFAULT_AFTER_LOGIN;

  if (user) {
    // asegurar fila en public.users
    await supabase.from("users").upsert(
      {
        id: user.id,
        email: user.email?.toLowerCase() ?? null,
      },
      { onConflict: "id" }
    );

    // leer rol
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role === "superadmin") {
      redirectPath = "/superadmin";
    } else if (profile?.role === "admin") {
      redirectPath = "/admin/solicitudes";
    } else {
      redirectPath = "/solicitudes"; // user normal
    }
  }

  const finalRedirect = NextResponse.redirect(
    new URL(redirectPath, url.origin),
    {
      headers: cookieRes.headers, // copiamos cookies de Supabase
    }
  );

  return finalRedirect;
}
