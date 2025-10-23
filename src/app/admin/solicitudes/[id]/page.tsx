// src/app/admin/solicitudes/[id]/page.tsx
export default async function SolicitudDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // 👈 importante

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Detalle de Solicitud #{id}</h1>
      <p className="text-muted-foreground mt-2">
        Aquí se mostrará la lista de postulantes y asignaciones.
      </p>
    </div>
  );
}
