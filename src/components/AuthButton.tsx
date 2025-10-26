"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useState } from "react";

export default function AuthButton() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });
  }, []);

  async function signIn() {
    const email = prompt("Ingresa tu email para recibir un link mágico:");
    if (!email) return;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // 👇 Redirige al callback que intercambia el código por sesión
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) alert(error.message);
    else alert("✅ Revisa tu correo para continuar.");
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUserEmail(null);
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      {userEmail ? (
        <>
          <span className="text-gray-500">Hola, {userEmail}</span>
          <button
            onClick={signOut}
            className="underline text-blue-600 hover:text-blue-800"
          >
            Cerrar sesión
          </button>
        </>
      ) : (
        <button
          onClick={signIn}
          className="underline text-blue-600 hover:text-blue-800"
        >
          Iniciar sesión
        </button>
      )}
    </div>
  );
}
