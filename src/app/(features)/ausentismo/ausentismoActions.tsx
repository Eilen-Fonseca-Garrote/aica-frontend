import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";


interface AusentismoActionsProps {
  onCalculate: () => void;
  onDownload: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  loading?: boolean;
}

export default function AusentismoActions({
  onCalculate,
  onDownload,
  loading = false,
}: AusentismoActionsProps) {
  return (
    <div className="flex justify-between">
      <Button onClick={onCalculate} disabled={loading}>
        {loading ? "Calculando..." : "Cantidad de Trabajadores"}
      </Button>

      <a
        href="#"
        onClick={onDownload}
        className={`bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2 ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        style={{ pointerEvents: loading ? 'none' : 'auto' }}
      >
        Descargar PDF <Download/>
      </a>
    </div>
  );
}