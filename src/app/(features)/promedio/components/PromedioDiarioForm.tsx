import Select from "../../uiLibrary/Select";
import PromedioActions from "./PromedioActions";
import { Direccion } from "../types";

interface PromedioDiarioFormProps {
  ueb: string;
  direccionFuncional: string;
  fecha: string;
  addresses: Direccion[];
  onChangeUeb: (v: string) => void;
  onChangeDireccion: (v: string) => void;
  onChangeFecha: (v: string) => void;
  onCalculate: () => void;
  onDownload: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function PromedioDiarioForm({
  ueb,
  direccionFuncional,
  fecha,
  addresses,
  onChangeUeb,
  onChangeDireccion,
  onChangeFecha,
  onCalculate,
  onDownload,
}: PromedioDiarioFormProps) {
  const uebOptions = [
    { label: "Todas las UEBs", value: "0" },
    { label: "AICA", value: "16" },
    { label: "LIORAD", value: "25" },
    { label: "CITOX", value: "100" },
    { label: "JULIO TRIGO", value: "55" },
    { label: "SH+", value: "57" },
  ];

  const handleCalculate = () => {
    if(!validateInputFields()) return;
    onCalculate();
  };

  const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if(!validateInputFields()) return;
    onDownload(e);
  };

  const validateInputFields = () => {
      if (ueb === "0") {
      alert("Por favor, seleccione una UEB válida");
      return false;
    }
    if(!direccionFuncional || direccionFuncional === "0"){
      alert("Por favor, seleccione una Dirección Funcional válida");
      return false;
    }
    if (!fecha) {
      alert("Por favor, seleccione una fecha");
      return false;
    }

    return true;
  }

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Select
          value={ueb}
          onChange={(e) => onChangeUeb(e.target.value)}
          options={uebOptions}
        />
        <Select
          value={direccionFuncional}
          onChange={(e) => onChangeDireccion(e.target.value)}
          options={[
              { label: "Seleccionar Dirección..", value: "0" },
              ...Object.values(addresses).map((d) => ({
                label: d.Unidad.trim(),
                value: d.Area["0"].EstNV1.toString(),
              })),
            ]}
        />
        <input
          type="date"
          data-testid="date-input"
          value={fecha}
          onChange={(e) => onChangeFecha(e.target.value)}
          className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
        />
      </div>
      <hr className="border-gray-200" />
      <PromedioActions onCalculate={handleCalculate} onDownload={handleDownload} />
    </div>
  );
}
