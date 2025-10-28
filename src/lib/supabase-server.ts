import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

export async function createClient(res?: NextResponse) {
  const cookieStore = await cookies();

  // 👇 IMPORTANTÍSIMO: que set/remove NO devuelvan nada (void)
  const cookieAdapter = res
    ? {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // No devolver el resultado (evitar return implícito)
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: "", ...options, maxAge: 0 });
        },
      }
    : {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(_name: string, _value: string, _options: any) {
          // en rutas sin Response no escribimos cookies
        },
        remove(_name: string, _options: any) {
          // noop
        },
      };

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookieAdapter } // ✅ ahora coincide con la firma esperada
  );
}
