"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowser } from "@/lib/supabase-browser";

export default function AuthPage() {
  const router = useRouter();
  const supabase = createBrowser();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) return setMessage(error.message);
      setMessage("✅ Te enviamos un correo para confirmar tu registro.");
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return setMessage(error.message);
      router.push("/solicitudes");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-lg p-2"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Correo</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
          >
            {mode === "login" ? "Entrar" : "Registrarme"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}

        <p className="text-center mt-6 text-sm">
          {mode === "login" ? (
            <>
              ¿No tienes cuenta?{" "}
              <button
                onClick={() => setMode("signup")}
                className="text-blue-600 hover:underline"
              >
                Regístrate
              </button>
            </>
          ) : (
            <>
              ¿Ya tienes cuenta?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-blue-600 hover:underline"
              >
                Inicia sesión
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
