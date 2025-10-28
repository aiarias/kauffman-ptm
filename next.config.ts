import type { NextConfig } from "next";

const nextConfig = {
  eslint: {
    // ❗️Vercel/Next no detendrá el build por errores de ESLint
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
