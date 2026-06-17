"use client"

import { useState } from "react"
import ModeloRl4Actions from "./exportarExcelActions"
import MonthPicker from "@/components/ui/MonthPicker"

const ModeloRl4Form = () => {
  const [mesAnio, setMesAnio] = useState("2026-06")
  const [diasNoLaborables, setDiasNoLaborables] = useState("8")
  const [exportStatus, setExportStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [validationError, setValidationError] = useState<string>("")

  const handleExportStatusChange = (status: "idle" | "loading" | "success" | "error", error?: string) => {
    setExportStatus(status)
    if (error) {
      setErrorMessage(error)
    } else {
      setErrorMessage("")
    }
  }

  const handleDiasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    
    // Permitir vacío para facilitar la edición
    if (value === "") {
      setDiasNoLaborables("")
      setValidationError("")
      return
    }
    
    // Verificar que solo contenga números
    if (!/^\d+$/.test(value)) {
      setValidationError("Solo se permiten números enteros")
      return
    }
    
    const numValue = parseInt(value, 10)
    
    // Verificar que sea un número positivo
    if (numValue < 0) {
      setValidationError("El número debe ser mayor o igual a 0")
      return
    }
    
    // Si pasa todas las validaciones
    setDiasNoLaborables(value)
    setValidationError("")
  }

  const handleBlur = () => {
    // Si el campo está vacío o es 0, establecer a "0"
    if (diasNoLaborables === "" || diasNoLaborables === "0") {
      setDiasNoLaborables("0")
      setValidationError("")
    }
  }

  // Validar si el botón debe estar habilitado
  const isFormValid = () => {
    if (validationError) return false
    if (diasNoLaborables === "") return false
    const numValue = parseInt(diasNoLaborables, 10)
    return !isNaN(numValue) && numValue >= 0
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
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={diasNoLaborables}
            onChange={handleDiasChange}
            onBlur={handleBlur}
            placeholder="0"
            className={`h-10 w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0a8ca8]/40 ${
              validationError 
                ? "border-red-500 focus:ring-red-500" 
                : "border-gray-300"
            }`}
          />
          {validationError && (
            <p className="mt-1 text-sm text-red-500">{validationError}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Ingrese un número entero mayor o igual a 0
          </p>
        </div>
      </div>

      <ModeloRl4Actions 
        mesAnio={mesAnio} 
        diasNoLaborables={diasNoLaborables}
        onExportStatusChange={handleExportStatusChange}
        exportStatus={exportStatus}
        errorMessage={errorMessage}
        isFormValid={isFormValid()}
      />
    </div>
  )
}

export default ModeloRl4Form