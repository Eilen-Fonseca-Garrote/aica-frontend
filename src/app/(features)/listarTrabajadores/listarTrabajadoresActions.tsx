"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import "react-datepicker/dist/react-datepicker.css"
import CustomDatePicker from "../uiLibrary/DatePicker"
import { FileSpreadsheet, Search } from "lucide-react"
import { downloadAllWorkersXls } from "@/app/lib/api/reportes"

export default function ListarTrabajadoresActions() {
  const [fecha, setFecha] = useState("2026-04-10")
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

  // Funcion por terminar 
  const handleExportBioadmin = () => {
    console.log("Buscando trabajadores fisicos con fecha:", fecha)
    alert(`Buscando trabajadores fisicos para la fecha: ${fecha}`)

    // Hacer aqui la funcionalidad de exportar excel de trabajadores fisicos por fecha una vez este listo en Backend 


  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[auto_minmax(260px,1fr)_auto] gap-4 md:gap-6">
      {/* Excel SIGERH Button */}
      <div className="md:pt-7">
        <button
          type="button"
          onClick={handleExportExcel}
          disabled={isExporting}
          className="inline-flex h-10 items-center gap-2 whitespace-nowrap text-sm font-semibold text-[#0a8ca8] hover:text-[#08778f] disabled:cursor-not-allowed disabled:text-gray-400"
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>{isExporting ? "Exportando todos los trabajadores..." : "Excel SIGERH"}</span>
        </button>
      </div>
      
      {/* Excel Bioadmin Button */}
      <div className="md:pt-7">
        <button
          type="button"
          onClick={handleExportBioadmin} // handleExportExcel es la q debo sustituir y usar para el nuevo excel de trabajadores fisicos 
          disabled={isExporting}
          className="inline-flex h-10 items-center gap-2 whitespace-nowrap text-sm font-semibold text-[#0a8ca8] hover:text-[#08778f] disabled:cursor-not-allowed disabled:text-gray-400"
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>{isExporting ? "Exportando todos los trabajadores..." : "Excel Bioadmin"}</span>
        </button>
         
      </div>

      <span> Fecha del reporte: <CustomDatePicker
                 value={fecha}
                 onChange={setFecha}
                 pickerType="day"
                 placeholder="Seleccione fecha"
                 className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[#0a8ca8]/40 text-black"
               /> </span>   {/* Date Picker para fecha de trabajadores fisicos Bioadmin*/}
        

      
    </div>
  )
}
