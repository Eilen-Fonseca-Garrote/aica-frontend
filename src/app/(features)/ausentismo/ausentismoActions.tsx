import { Download } from "lucide-react";

const TEXT_ACTION_CLASS =
  "inline-flex items-center gap-2 text-sm font-semibold text-[#0a8ca8] hover:text-[#08778f] no-underline disabled:text-gray-400 disabled:cursor-not-allowed";

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
      <button type="button" onClick={onCalculate} disabled={loading} className={TEXT_ACTION_CLASS}>
        {loading ? "Calculando..." : "Cantidad de Trabajadores"}
      </button>

      <a
        href="#"
        onClick={onDownload}
        className={`${TEXT_ACTION_CLASS} ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        style={{ pointerEvents: loading ? 'none' : 'auto' }}
      >
        Descargar PDF <Download/>
      </a>
    </div>
  );
}
