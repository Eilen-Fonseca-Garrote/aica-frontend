const TEXT_ACTION_CLASS =
  "inline-flex items-center gap-2 text-sm font-semibold text-[#0a8ca8] hover:text-[#08778f] no-underline disabled:text-gray-400 disabled:cursor-not-allowed";

interface PromedioActionsProps {
  onCalculate: () => void;
  onDownload: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function PromedioActions({
  onCalculate,
  onDownload,
}: PromedioActionsProps) {
  return (
    <div className="flex justify-between">
      <button type="button" onClick={onCalculate} className={TEXT_ACTION_CLASS}>
        Calcular
      </button>

      <a
        href="#"
        onClick={onDownload}
        className={TEXT_ACTION_CLASS}
      >
        Descargar <i className="fa fa-file-pdf" />
      </a>
    </div>
  );
}
