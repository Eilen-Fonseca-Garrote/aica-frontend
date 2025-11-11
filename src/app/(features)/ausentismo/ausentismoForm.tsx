// AusentismoForm.tsx
import Select from "@/app/(features)/uiLibrary/Select";
import AusentismoActions from "./ausentismoActions";

interface AusentismoFormProps {
  ueb: string;
  fecha: string;
  onChangeUeb: (v: string) => void;
  onChangeFecha: (v: string) => void;
  onCalculate: () => void;
  onDownload: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  loading?: boolean;
}

export default function AusentismoForm({
  ueb,
  fecha,
  onChangeUeb,
  onChangeFecha,
  onCalculate,
  onDownload,
  loading = false,
}: AusentismoFormProps) {
  const uebOptions = [
    { label: "Todas las UEBs", value: "0" },
    { label: "AICA", value: "16" },
    { label: "LIORAD", value: "25" },
    { label: "CITOX", value: "100" },
    { label: "JULIO TRIGO", value: "55" },
    { label: "SH+", value: "57" },
  ];

  const handleCalculate = () => {
    if (!validateInputFields()) return;
    onCalculate();
  };

  const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!validateInputFields()) return;
    onDownload(e);
  };

  const validateInputFields = () => {
    if (ueb === "0") {
      alert("Por favor, seleccione una UEB válida");
      return false;
    }
    if (!fecha) {
      alert("Por favor, seleccione una fecha");
      return false;
    }
    return true;
  };

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
          placeholder="YYYY-MM"
          pattern="\d{4}-\d{2}"
          inputMode="numeric"
          className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black disabled:opacity-50"
          disabled={loading}
        />
      </div>
      <hr className="border-gray-200" />
      <AusentismoActions 
        onCalculate={handleCalculate} 
        onDownload={handleDownload}
        loading={loading}
      />
    </div>
  );
}