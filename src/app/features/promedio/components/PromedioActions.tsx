import Button from "../../uiLibrary/Button";

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
      <Button onClick={onCalculate}>Calcular</Button>

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
