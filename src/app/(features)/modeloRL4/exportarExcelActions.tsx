"use client"

import { Button } from "@/components/ui/button"

interface ModeloRl4ActionsProps {
  mesAnio: string
  diasNoLaborables: string
}

export default function ModeloRl4Actions({ mesAnio, diasNoLaborables }: ModeloRl4ActionsProps) {
  const handleExportarExcel = () => {
    // Create CSV content (Excel can open CSV files)
    const csvContent = [
      ["Modelo de Ausentismo RL4"],
      [""],
      ["Mes y Año", mesAnio],
      ["Días No Laborables Mes", diasNoLaborables],
      [""],
      ["Generado el", new Date().toLocaleString("es-ES")],
    ]
      .map((row) => row.join(","))
      .join("\n")

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `modelo_rl4_${mesAnio}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex justify-end">
      <Button onClick={handleExportarExcel} className="bg-blue-600 hover:bg-blue-700 text-white">
        Exportar a Excel
      </Button>
    </div>
  )    
}

