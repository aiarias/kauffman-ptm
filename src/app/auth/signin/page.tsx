"use client";
import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setBusy(false);
    if (error) return alert(error.message);
    window.location.href = "/solicitudes";
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-4">Iniciar sesión</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          disabled={busy}
          className="w-full rounded bg-blue-600 text-white py-2"
        >
          {busy ? "Ingresando..." : "Entrar"}
        </button>
      </form>

      <p className="mt-3 text-sm">
        ¿No tienes cuenta?{" "}
        <Link className="underline" href="/auth/signup">
          Regístrate
        </Link>
      </p>
    </main>
  );
}
