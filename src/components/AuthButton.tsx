// src/components/AuthButton.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@/components/ui/button";

export default function AuthButton() {
  // 1) HOOKS SIEMPRE ARRIBA y SIN CONDICIONALES
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  // Cliente solo navegador
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 2) Efectos sin condiciones
  useEffect(() => {
    let alive = true;

    supabase.auth.getUser().then(({ data }) => {
      if (alive) setEmail(data.user?.email ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => {
      alive = false;
      sub?.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 3) Oculta el bloque en páginas /auth/* (después de hooks)
  const hideOnAuthPages = pathname?.startsWith("/auth");
  if (hideOnAuthPages) return null;

  // 4) Acciones
  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/auth/signin");
    router.refresh();
  }

  // 5) Render
  return email ? (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground hidden sm:inline">
        Hola, {email}
      </span>
      <Button variant="ghost" size="sm" onClick={handleSignOut}>
        Cerrar sesión
      </Button>
    </div>
  ) : (
    <div className="flex items-center gap-2 text-sm">
      <Link className="underline" href="/auth/signin">
        Iniciar sesión
      </Link>
      <span>/</span>
      <Link className="underline" href="/auth/signup">
        Registrarse
      </Link>
    </div>
  );
}
