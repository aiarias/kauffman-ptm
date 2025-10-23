"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNav, memberNav } from "@/lib/routes";
import { useRole } from "./role-context";
import { cn } from "@/lib/utils"; // si no tienes util, usa una función mínima abajo

export function Sidebar() {
  const { role } = useRole();
  const items = role === "admin" ? adminNav : memberNav;
  const pathname = usePathname();

  return (
    <aside className="hidden md:block w-60 shrink-0 border-r bg-background">
      <div className="p-2">
        {items.map((it) => {
          const active = pathname === it.href;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "block rounded-md px-3 py-2 text-sm hover:bg-muted",
                active && "bg-muted font-medium"
              )}
            >
              {it.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

// util mínimo si no tienes cn
// export function cn(...c: (string | false | undefined)[]) {
//   return c.filter(Boolean).join(" ");
// }
// Este componente Sidebar muestra una barra lateral con enlaces de navegación que varían según el rol del usuario (miembro o admin).
