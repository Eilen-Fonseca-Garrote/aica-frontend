"use client"

"use client"

import { useState } from "react"
import ModeloRl4Actions from "./exportarExcelActions"
import MonthPicker from "../../uiLibrary/MonthPicker"

const ModeloRl4Form = () => {
  const [mesAnio, setMesAnio] = useState("2025-09")
  const [diasNoLaborables, setDiasNoLaborables] = useState("8")

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-[#0a8ca8] mb-2">Mes y Año</label>
          <MonthPicker value={mesAnio} onChange={setMesAnio} />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0a8ca8] mb-2">
            Días No Laborables
          </label>
          <input
            type="number"
            value={diasNoLaborables}
            onChange={(e) => setDiasNoLaborables(e.target.value)}
            placeholder="8"
            className="h-10 w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0a8ca8]/40"
          />
        </div>
      </div>

      <ModeloRl4Actions mesAnio={mesAnio} diasNoLaborables={diasNoLaborables} />
    </div>
  )
}

export default ModeloRl4Form
