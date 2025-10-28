"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { usePathname, useRouter } from "next/navigation"; // 👈 NUEVO

import { useRole } from "./role-context";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { adminNav, memberNav } from "@/lib/routes";
import { Menu } from "lucide-react";

export function Navbar({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const { role, setRole } = useRole();
  const items = role === "admin" ? adminNav : memberNav;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
        {/* mobile: menú lateral */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="p-4">
              <Brand />
            </div>
            <Separator />
            <nav className="p-2 space-y-1">
              {items.map((it) => (
                <Link
                  key={it.href}
                  href={it.href}
                  className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                >
                  {it.label}
                </Link>
              ))}

              {/* Enlaces fijos para paneles de roles */}
              <Link
                href="/admin"
                className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
              >
                Admin
              </Link>

              <Link
                href="/superadmin"
                className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
              >
                Superadmin
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <Brand />

        {/* desktop nav */}
        <nav className="hidden md:flex items-center gap-2">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className="rounded-md px-3 py-2 text-sm hover:bg-muted"
            >
              {it.label}
            </Link>
          ))}
        </nav>
        {/* Enlaces fijos para pruebas de roles */}
        <nav className="hidden md:flex items-center gap-2">
          <Link
            href="/admin"
            className="rounded-md px-3 py-2 text-sm hover:bg-muted"
          >
            Admin
          </Link>
          <Link
            href="/superadmin"
            className="rounded-md px-3 py-2 text-sm hover:bg-muted"
          >
            Superadmin
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          {/* Botones de rol (útiles en dev; puedes quitarlos si quieres) */}
          <div className="hidden sm:flex items-center gap-2">
            <Button
              variant={role === "member" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setRole("member")}
              title="Cambiar a Colaborador (solo dev)"
            >
              Colaborador
            </Button>
            <Button
              variant={role === "admin" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setRole("admin")}
              title="Cambiar a Admin (solo dev)"
            >
              Admin
            </Button>
          </div>

          {/* 👇 Segmento de autenticación */}
          <AuthSegment />
        </div>
      </div>
    </header>
  );
}

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2 font-semibold">
      <span className="inline-grid h-6 w-6 place-items-center rounded bg-emerald-600 text-white">
        K
      </span>
      <span>Kaufmann PTM</span>
    </Link>
  );
}

/** Muestra:
 * - sin sesión: enlaces a /auth/signin y /auth/signup (ocultos en páginas /auth/*)
 * - con sesión: "Hola, email" + botón Cerrar sesión
 */
function AuthSegment() {
  const [profile, setProfile] = useState<{
    email: string;
    full_name?: string;
  } | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setProfile(null);
        return;
      }

      // buscar datos del perfil en public.users
      const { data: userRow } = await supabase
        .from("users")
        .select("full_name, email")
        .eq("id", user.id)
        .single();

      if (mounted) {
        setProfile({
          email: userRow?.email ?? user.email ?? "",
          full_name: userRow?.full_name ?? undefined,
        });
      }
    }

    loadProfile();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) loadProfile();
      else setProfile(null);
    });

    return () => {
      mounted = false;
      sub?.subscription.unsubscribe();
    };
  }, []);

  // Oculta los enlaces dentro de /auth/*
  if (pathname?.startsWith("/auth")) return null;

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/auth/signin");
    router.refresh();
  }

  if (profile) {
    const nameOrEmail = profile.full_name || profile.email;
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground hidden sm:inline">
          Hola, {nameOrEmail}
        </span>
        <Button variant="ghost" size="sm" onClick={handleSignOut}>
          Cerrar sesión
        </Button>
      </div>
    );
  }

  return (
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
