"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function SolicitudesPage() {
  useEffect(() => {
    console.log("🔗 URL Supabase:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log("🔑 Key Supabase:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 8) + "...");
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold">Solicitudes abiertas</h1>
      <p>Postula a los turnos disponibles.</p>
    </main>
  );
}
