// src/app/solicitudes/[id]/page.tsx
export default async function SolicitudDetallePublicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Solicitud #{id}</h1>
      <p className="text-muted-foreground mt-2">Detalle para postular.</p>
    </div>
  );
}
