import "react-datepicker/dist/react-datepicker.css"
import Select from "@/components/ui/Select"
import PromedioActions from "./PromedioActions"
import { Direccion } from "./types"
import CustomDatePicker from "@/components/ui/DatePicker"
import { UEB_OPTIONS_WITH_ALL } from "@/app/lib/constants/selectOptions"

interface PromedioDiarioFormProps {
  ueb: string
  direccionFuncional: string
  fecha: string
  addresses: Direccion[]
  onChangeUeb: (v: string) => void
  onChangeDireccion: (v: string) => void
  onChangeFecha: (v: string) => void
  onCalculate: () => void
  onDownload: (e: React.MouseEvent<HTMLAnchorElement>) => void
}

const PromedioDiarioForm = ({
  ueb,
  direccionFuncional,
  fecha,
  addresses,
  onChangeUeb,
  onChangeDireccion,
  onChangeFecha,
  onCalculate,
  onDownload,
}: PromedioDiarioFormProps) => {
  const validateInputFields = () => {
    if (ueb === "0") {
      alert("Por favor, seleccione una UEB valida")
      return false
    }
    if (!direccionFuncional || direccionFuncional === "0") {
      alert("Por favor, seleccione una Direccion Funcional valida")
      return false
    }
    if (!fecha) {
      alert("Por favor, seleccione una fecha")
      return false
    }
    return true
  }

  const handleCalculate = () => {
    if (!validateInputFields()) return
    onCalculate()
  }

  const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!validateInputFields()) return
    onDownload(e)
  }

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Select value={ueb} onChange={(e) => onChangeUeb(e.target.value)} options={UEB_OPTIONS_WITH_ALL} />
        <Select
          value={direccionFuncional}
          onChange={(e) => onChangeDireccion(e.target.value)}
        >
          <option value="0">Seleccionar Dirección...</option>
          {Object.values(addresses).map((d) => (
            <option key={d.Area["0"].EstNV1.toString()} value={d.Area["0"].EstNV1.toString()}>
              {d.Unidad.trim()}
            </option>
          ))}
        </Select>
        <CustomDatePicker
          value={fecha}
          onChange={onChangeFecha}
          pickerType="day"
          placeholder="Seleccione fecha"
          className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[#0a8ca8]/40 text-black"
        />
      </div>
      <hr className="border-gray-200" />
      <PromedioActions onCalculate={handleCalculate} onDownload={handleDownload} />
    </div>
  )
}

export default PromedioDiarioForm
