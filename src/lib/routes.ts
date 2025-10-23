export type Role = "admin" | "member";

export const adminNav = [
  { href: "/admin/solicitudes", label: "Solicitudes" },
  { href: "/admin/solicitudes/1", label: "Detalle (demo)" },
];

export const memberNav = [
  { href: "/solicitudes", label: "Disponibles" },
  { href: "/mis-turnos", label: "Mis turnos" },
];
