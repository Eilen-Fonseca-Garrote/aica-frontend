"use client"
/* Página desplegada de trabajadores por clave de ausentismo*/
import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Minus, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import AusentismoActions from "./ausentismoActions"

export default function ListarClaveAusentismo() {
  const router = useRouter()

  const [selectedUEB, setSelectedUEB] = useState("AICA")
  const [mesAno, setMesAno] = useState("09-2022")
  const [leftFilter, setLeftFilter] = useState("")
  const [rightFilter, setRightFilter] = useState("")

  const [leftItems] = useState([
    "Sin Clasificar",
    "Curso",
    "Falles. de Padres Conyuge Hijo",
    "Citacion Militar o Judicial",
    "Enferm. Comun Llama",
  ])

  const [rightItems] = useState(["Vacaciones", "Movilización"])

  const [tableData, setTableData] = useState([
    { codigo: "01", cantidad: 275 },
    { codigo: "02", cantidad: 4 },
  ])

  const filteredLeftItems = leftItems.filter((item) => item.toLowerCase().includes(leftFilter.toLowerCase()))

  const filteredRightItems = rightItems.filter((item) => item.toLowerCase().includes(rightFilter.toLowerCase()))

  const handleCalculate = () => {
    // Simulando calcular hasta que implemente la funcionalidad para probar 
    const newData = [
      { codigo: "01", cantidad: Math.floor(Math.random() * 300) + 200 },
      { codigo: "02", cantidad: Math.floor(Math.random() * 10) + 1 },
      { codigo: "03", cantidad: Math.floor(Math.random() * 50) + 10 },
    ]
    setTableData(newData)
    console.log("[v0] Calculando cantidad de trabajadores para UEB:", selectedUEB, "Mes/Año:", mesAno)
  }

  const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    console.log("[v0] Descargando PDF con datos:", tableData)

    // Crear una simple representacion de los datos para probar
    const content = `Cantidad Trabajadores por Clave de Ausentismo\n\nUEB: ${selectedUEB}\nMes y Año: ${mesAno}\n\nCódigo claves | Cantidad de Trabajadores\n${tableData.map((row) => `${row.codigo} | ${row.cantidad}`).join("\n")}`

    // probando con txt para despues pasar a pdf
    const blob = new Blob([content], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ausentismo-${selectedUEB}-${mesAno}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#3d9f5c] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/")} className="hover:bg-[#358a4f] p-1 rounded" title="Volver al menú">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-normal">Cantidad Trabajadores por Clave de Ausentismo</h1>
        </div>
        <button className="hover:bg-[#358a4f] p-1 rounded" title="Minimize">
          <Minus className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Left Section - Seleccionar UEB */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar UEB</label>
            <Select value={selectedUEB} onValueChange={setSelectedUEB}>
            <SelectTrigger className="w-[280px]" onClickAction={() => {}}><SelectValue />
                          </SelectTrigger>
                          <SelectContent isOpen={true}>
                            <SelectItem value="LIORAD" onSelectAction={() => {}}>LIORAD</SelectItem>
                            <SelectItem value="UEB1" onSelectAction={() => {}}>UEB1</SelectItem>
                            <SelectItem value="UEB2" onSelectAction={() => {}}>UEB2</SelectItem>
                          </SelectContent>
            </Select>

            <div className="mt-3 text-xs text-gray-600">
              Total de elementos seleccionados / no seleccionados 65 opciones
            </div>

            <Input
              placeholder="Filtro"
              value={leftFilter}
              onChange={(e) => setLeftFilter(e.target.value)}
              className="mt-2 bg-white"
            />

            <div className="mt-2 border border-gray-300 rounded bg-white">
              <div className="flex items-center justify-center py-2 border-b border-gray-300">
                <button className="text-sm text-gray-600 hover:text-gray-900">&gt;&gt;</button>
              </div>
              <select
                multiple
                className="w-full h-32 px-2 py-1 text-sm focus:outline-none"
                size={5}
                title="Filtered left items"
              >
                {filteredLeftItems.map((item, index) => (
                  <option key={index} value={item} className="py-1">
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Section - Mes y Año */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mes y Año</label>
            <Input type="text" value={mesAno} onChange={(e) => setMesAno(e.target.value)} className="w-full bg-white" />

            <div className="mt-3 text-xs text-gray-600">
              Total de elementos seleccionados / no seleccionados 2 opciones
            </div>

            <Input
              placeholder="Filtro"
              value={rightFilter}
              onChange={(e) => setRightFilter(e.target.value)}
              className="mt-2 bg-white"
            />

            <div className="mt-2 border border-gray-300 rounded bg-white">
              <div className="flex items-center justify-center py-2 border-b border-gray-300">
                <button className="text-sm text-gray-600 hover:text-gray-900">&lt;&lt;</button>
              </div>
              <select
                multiple
                className="w-full h-32 px-2 py-1 text-sm focus:outline-none"
                size={5}
                title="Filtered right items"
              >
                {filteredRightItems.map((item, index) => (
                  <option key={index} value={item} className="py-1">
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <AusentismoActions onCalculate={handleCalculate} onDownload={handleDownload} />
        </div>

        {/* Results Table */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Claves de Ausentismo</h2>
          <div className="border border-gray-300 rounded bg-white overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-300">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Código claves</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Cantidad de Trabajadores</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index} className={index < tableData.length - 1 ? "border-b border-gray-200" : ""}>
                    <td className="px-4 py-3 text-sm text-gray-900">{row.codigo}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{row.cantidad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}