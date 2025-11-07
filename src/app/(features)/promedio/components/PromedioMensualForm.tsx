import Select from "../../uiLibrary/Select";
import PromedioActions from "./PromedioActions";

interface PromedioMensualFormProps {
  ueb: string;
  fecha: string;
  onChangeUeb: (v: string) => void;
  onChangeFecha: (v: string) => void;
  onCalculate: () => void;
  onDownload: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function PromedioMensualForm({
  ueb,
  fecha,
  onChangeUeb,
  onChangeFecha,
  onCalculate,
  onDownload,
}: PromedioMensualFormProps) {
  const uebOptions = [
    { label: "Todas las UEBs", value: "0" },
    { label: "AICA", value: "16" },
    { label: "LIORAD", value: "25" },
    { label: "CITOX", value: "100" },
    { label: "JULIO TRIGO", value: "55" },
    { label: "SH+", value: "57" },
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Select
          value={ueb}
          onChange={(e) => onChangeUeb(e.target.value)}
          options={uebOptions}
        />
        <input
          type="month"
          value={fecha}
          onChange={(e) => onChangeFecha(e.target.value)}
          className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
        />
      </div>
      <hr className="border-gray-200" />
      <PromedioActions onCalculate={onCalculate} onDownload={onDownload} />
    </div>
  );
}
