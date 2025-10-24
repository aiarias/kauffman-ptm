import { cookies } from "next/headers";
import { createServerClient, createBrowserClient } from "@supabase/ssr";

export async function createClient() {
  const cookieStore = await cookies(); // 👈 aquí el await

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // En Server Components solo puedes leer cookies (Readonly).
        // Para Server Actions/Route Handlers podrías usar set/remove.
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}

export function createBrowserSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
