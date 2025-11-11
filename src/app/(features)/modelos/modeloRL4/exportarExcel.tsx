"use client"

import { useState } from "react"
import ModeloRl4Actions from "./exportarExcelActions"

export default function ModeloRl4Form() {
  const [mesAnio, setMesAnio] = useState("09-2025")
  const [diasNoLaborables, setDiasNoLaborables] = useState("8")

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Mes y Año */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mes y Año</label>
          <input
            type="month"
            value={mesAnio}
            onChange={(e) => setMesAnio(e.target.value)}
            placeholder="09-2025"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Días No Laborables Mes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Días No Laborables </label>
          <input
            type="number"
            value={diasNoLaborables}
            onChange={(e) => setDiasNoLaborables(e.target.value)}
            placeholder="8"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Actions Component */}
      <ModeloRl4Actions mesAnio={mesAnio} diasNoLaborables={diasNoLaborables} />
    </div>
  )
}
