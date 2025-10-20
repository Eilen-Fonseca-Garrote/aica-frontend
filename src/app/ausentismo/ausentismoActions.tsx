import { Button } from "@/components/ui/button";

/* acciones para descargar pdf y calcular claves de ausentismo*/
interface AusentismoActionsProps {
  onCalculate: () => void;
  onDownload: (e: React.MouseEvent<HTMLAnchorElement>) => void;
} 

export default function AusentismoActions({
  onCalculate,
  onDownload,
}: AusentismoActionsProps) {
  return (
    <div className="flex justify-between">
      <Button onClick={onCalculate}>Cantidad de Trabajadores</Button>
      <a
        href="#"
        onClick={onDownload}
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
      >
        Descargar <i className="fa fa-file-pdf" />
      </a>
    </div>
  );
}