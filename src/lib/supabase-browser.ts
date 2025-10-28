// src/lib/supabase-browser.ts
import { createBrowserClient } from "@supabase/ssr";

// Cliente de navegador (para Client Components)
export function createBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
