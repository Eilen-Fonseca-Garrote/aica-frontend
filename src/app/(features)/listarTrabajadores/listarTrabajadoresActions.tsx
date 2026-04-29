"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileSpreadsheet, Search } from "lucide-react"
import { downloadAllWorkersXls } from "@/app/lib/api/reportes"

export default function ListarTrabajadoresActions() {
  const [fecha, setFecha] = useState("2025-10-11")
  const [isExporting, setIsExporting] = useState(false)

  const handleExportExcel = async () => {
    try {
      setIsExporting(true)
      console.log("Exportando trabajadores a Excel...")
      
      const blob = await downloadAllWorkersXls()
      
      // Crear URL para el blob y descargar
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `trabajadores_${fecha}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.parentNode?.removeChild(link)
      window.URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error("Error al exportar:", error)
      alert("Error al exportar el archivo")
    } finally {
      setIsExporting(false)
    }
  }

  const handleBuscar = () => {
    console.log("Buscando trabajadores con fecha:", fecha)
    alert(`Buscando trabajadores para la fecha: ${fecha}`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[auto_minmax(260px,1fr)_auto] gap-4 md:gap-6">
      {/* Excel Button */}
      <div className="md:pt-7">
        <button
          type="button"
          onClick={handleExportExcel}
          disabled={isExporting}
          className="inline-flex h-10 items-center gap-2 whitespace-nowrap text-sm font-semibold text-[#0a8ca8] hover:text-[#08778f] disabled:cursor-not-allowed disabled:text-gray-400"
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>{isExporting ? "Exportando..." : "Excel"}</span>
        </button>
      </div>

      {/* Date Input */}
      <div>
        <Label htmlFor="fecha" className="text-[#0a8ca8] mb-2 block font-semibold">
          Fecha:
        </Label>
        <Input
          id="fecha"
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="h-10 w-full border-gray-300 focus-visible:border-[#0a8ca8] focus-visible:ring-[#0a8ca8]/30"
          placeholder="DD-MM-YYYY"
        />
      </div>

      {/* Buscar Button */}
      <div className="md:pt-7">
        <button
          type="button"
          onClick={handleBuscar}
          className="inline-flex h-10 items-center gap-2 whitespace-nowrap text-sm font-semibold text-[#0a8ca8] hover:text-[#08778f]"
        >
          <Search className="h-4 w-4" />
          <span>Buscar</span>
        </button>
      </div>
    </div>
  )
}
