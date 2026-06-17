"use client"

import { useState } from "react"
import ModeloRl4Actions from "./exportarExcelActions"
import MonthPicker from "@/components/ui/MonthPicker"

const ModeloRl4Form = () => {
  const [mesAnio, setMesAnio] = useState("2026-06")
  const [diasNoLaborables, setDiasNoLaborables] = useState("8")
  const [exportStatus, setExportStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")

  const handleExportStatusChange = (status: "idle" | "loading" | "success" | "error", error?: string) => {
    setExportStatus(status)
    if (error) {
      setErrorMessage(error)
    } else {
      setErrorMessage("")
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-32 grid grid-cols-1 gap-32 md:grid-cols-2">
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

      <ModeloRl4Actions 
        mesAnio={mesAnio} 
        diasNoLaborables={diasNoLaborables}
        onExportStatusChange={handleExportStatusChange}
        exportStatus={exportStatus}
        errorMessage={errorMessage}
      />
    </div>
  )
}

export default ModeloRl4Form