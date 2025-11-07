"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileSpreadsheet, Search } from "lucide-react"

export default function ListarTrabajadoresActions() {
  const [fecha, setFecha] = useState("11-10-2022")

  const handleExportExcel = () => {
    // Simular exportación a Excel
    console.log("[v0] Exportando trabajadores a Excel...")

    // Crear datos de ejemplo
    const data = [
      ["Nombre", "CI", "Cargo", "Fecha"],
      ["Juan Pérez", "12345678", "Técnico", fecha],
      ["María García", "87654321", "Administradora", fecha],
      ["Carlos López", "11223344", "Operario", fecha],
    ]

    // Convertir a CSV
    const csvContent = data.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", `trabajadores_${fecha}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleBuscar = () => {
    console.log("[v0] Buscando trabajadores con fecha:", fecha)
    alert(`Buscando trabajadores para la fecha: ${fecha}`)
  }

  return (
    <div className="flex items-end gap-4">
      {/* Excel Button */}
      <Button
        onClick={handleExportExcel}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-6 flex flex-col items-center gap-1"
      >
        <FileSpreadsheet className="h-6 w-6" />
        <span className="text-xs">Excel</span>
      </Button>

      {/* Date Input */}
      <div className="flex-1">
        <Label htmlFor="fecha" className="text-gray-700 mb-2 block">
          Fecha:
        </Label>
        <Input
          id="fecha"
          type="text"
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
