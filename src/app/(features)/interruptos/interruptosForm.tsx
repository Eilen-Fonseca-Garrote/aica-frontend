import Select from "../uiLibrary/Select";
import CustomMonthPicker from "../uiLibrary/MonthPicker";
import InterruptosActions from "@/app/(features)/interruptos/interruptosActions";

interface InterruptosFormProps {
  ueb: string;
  fecha: string;
  onChangeUeb: (v: string) => void;
  onChangeFecha: (v: string) => void;
  onCalculate: () => void;
  onDownload: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function InterruptosForm({
  ueb,
  fecha,
  onChangeUeb,
  onChangeFecha,
  onCalculate,
  onDownload,
}: InterruptosFormProps) {
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
    if (!validateInputFields()) return;
    onDownload(e);
  };


const validateInputFields = () => {
  // Permitir ueb "0" (Todas las UEBs)
  if (!ueb) {
    alert("Por favor, seleccione una UEB");
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
        <CustomMonthPicker
          value={fecha}
          onChange={onChangeFecha}
          placeholder="Seleccione mes y año"
          className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[#0a8ca8]/40 text-black"
        />
      </div>
      <hr className="border-gray-200" />
      <InterruptosActions onCalculate={handleCalculate} onDownload={handleDownload} />
    </div>
  );
}
