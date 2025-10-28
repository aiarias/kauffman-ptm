"use client";

import { useState } from "react";
import { createBrowser } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [message, setMessage] = useState("");
  const supabase = createBrowser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    // 🟦 1. Chequear si el usuario ya existe
    const { data: existing, error: existErr } =
      await supabase.auth.admin.listUsers();
    if (existErr) {
      setMessage("Error verificando usuarios");
      return;
    }

    const userExists = existing.users.some(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    // 🟧 2. Control de flujo según modo
    if (mode === "signup" && userExists) {
      setMessage("Este correo ya está registrado. Inicia sesión.");
      return;
    }
    if (mode === "login" && !userExists) {
      setMessage("Usuario no encontrado. Regístrate primero.");
      return;
    }

    // 🟩 3. Enviar magic link
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) setMessage(error.message);
    else setMessage("Revisa tu correo para continuar.");
  };

  return (
    <div className="max-w-sm mx-auto mt-12 p-6 border rounded-2xl shadow-md bg-white/80">
      <h1 className="text-xl font-semibold text-center mb-4">
        {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="email"
          placeholder="tu@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" className="w-full">
          {mode === "login" ? "Enviar enlace de acceso" : "Registrarme"}
        </Button>
      </form>

      <p className="text-center mt-3 text-sm text-gray-600">
        {mode === "login" ? (
          <>
            ¿No tienes cuenta?{" "}
            <button
              onClick={() => setMode("signup")}
              className="text-blue-600 underline"
            >
              Regístrate
            </button>
          </>
        ) : (
          <>
            ¿Ya tienes cuenta?{" "}
            <button
              onClick={() => setMode("login")}
              className="text-blue-600 underline"
            >
              Inicia sesión
            </button>
          </>
        )}
      </p>

      {message && (
        <p className="text-center mt-3 text-sm text-gray-700">{message}</p>
      )}
    </div>
  );
}
