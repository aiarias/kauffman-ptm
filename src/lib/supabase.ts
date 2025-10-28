// src/lib/supabase.ts
import { createServerClient, createBrowserClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { CookieMethodsServerDeprecated } from "@supabase/ssr";

export async function createClient() {
  // En Next 15, cookies() puede ser Promise: ¡espera!
  const cookieStore = await cookies();

  const cookieAdapter: CookieMethodsServerDeprecated = {
    get(name: string) {
      return cookieStore.get(name)?.value;
    },
    // Importante: no devolver nada (void), no ResponseCookies
    set(_name: string, _value: string, _options?: any) {},
    remove(_name: string, _options?: any) {},
  };

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookieAdapter }
  );
}

export function createBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
