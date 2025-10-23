export default function SolicitudDetallePage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Detalle de Solicitud #{params.id}</h1>
      <p className="text-muted-foreground mt-2">
        Aquí se mostrará la lista de postulantes y asignaciones.
      </p>
    </div>
  );
}
