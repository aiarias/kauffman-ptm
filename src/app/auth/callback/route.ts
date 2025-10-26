import { NextResponse, NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Redirige a donde quieras volver después de iniciar sesión
const AFTER_LOGIN = "/solicitudes";

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");

  // Preparamos una respuesta para poder escribir cookies
  const res = NextResponse.redirect(new URL(AFTER_LOGIN, requestUrl.origin));

  // Cliente de Supabase en contexto de Route Handler (con set/remove que escriben cookies en la Response)
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: "", ...options, maxAge: 0 });
        },
      },
    }
  );

  if (code) {
    // Intercambiamos el code del email por una sesión y (muy importante) se setean las cookies en la response
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      // Si algo falla, puedes redirigir a una página de error o al login
      res.headers.set("x-auth-error", error.message);
    }
  }

  return res;
}
