// src/app/page.tsx (Server Component)
import { redirect } from "next/navigation";

export default function Home() {
  // Elige a dónde quieres que vaya la home por defecto
  // Para colaboradores:
  redirect("/solicitudes");
  // Si prefieres que abra el panel de Eli:
  // redirect("/admin/solicitudes");
}
