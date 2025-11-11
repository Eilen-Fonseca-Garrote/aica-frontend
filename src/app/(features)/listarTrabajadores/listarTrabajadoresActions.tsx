"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileSpreadsheet, Search } from "lucide-react"
import { downloadAllWorkersXls } from "@/app/lib/api/reportes"

export default function ListarTrabajadoresActions() {
  const [fecha, setFecha] = useState("2022-10-11")
  const [isExporting, setIsExporting] = useState(false)

  const handleExportExcel = async () => {
    try {
      setIsExporting(true)
      console.log("Exportando trabajadores a Excel...")
      
      const blob = await downloadAllWorkersXls(fecha)
      
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
    <div className="flex items-end gap-4">
      {/* Excel Button */}
      <Button
        onClick={handleExportExcel}
        disabled={isExporting}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-6 flex flex-col items-center gap-1 disabled:opacity-50"
      >
        <FileSpreadsheet className="h-6 w-6" />
        <span className="text-xs">
          {isExporting ? "Exportando..." : "Excel"}
        </span>
      </Button>

      {/* Date Input */}
      <div className="flex-1">
        <Label htmlFor="fecha" className="text-gray-700 mb-2 block">
          Fecha:
        </Label>
        <Input
          id="fecha"
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="w-full"
          placeholder="DD-MM-YYYY"
        />
      </div>

      {/* Buscar Button */}
      <Button
        onClick={handleBuscar}
        className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-6 flex flex-col items-center gap-1"
      >
        <Search className="h-6 w-6" />
        <span className="text-xs">Buscar</span>
      </Button>
    </div>
  )
}
