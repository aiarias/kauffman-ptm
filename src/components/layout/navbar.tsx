"use client";

import Link from "next/link";
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

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant={role === "member" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setRole("member")}
          >
            Colaborador
          </Button>
          <Button
            variant={role === "admin" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setRole("admin")}
          >
            Admin
          </Button>
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
      <span>Kauffman PTM</span>
    </Link>
  );
}
// Esta barra de navegación permite cambiar entre roles de usuario (miembro y admin) y muestra diferentes enlaces según el rol seleccionado.
