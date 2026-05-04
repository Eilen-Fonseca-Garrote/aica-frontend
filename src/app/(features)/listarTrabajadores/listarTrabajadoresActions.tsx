"use client"

import { useState } from "react"
import "react-datepicker/dist/react-datepicker.css"
import CustomDatePicker from "../uiLibrary/DatePicker"
import { FileSpreadsheet, FileText } from "lucide-react"
import { downloadAllWorkersXls, downloadAllWorkersPdf } from "@/app/lib/api/reportes"

export default function ListarTrabajadoresActions() {
  const [fecha, setFecha] = useState("2026-04-10")
  const [isExportingXls, setIsExportingXls] = useState(false)
  const [isExportingPdf, setIsExportingPdf] = useState(false)

  // ── Helper reutilizable para disparar la descarga ──────────────────────────
  const triggerDownload = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", filename)
    document.body.appendChild(link)
    link.click()
    link.parentNode?.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  // ── Excel SIGERH ───────────────────────────────────────────────────────────
  const handleExportExcel = async () => {
    try {
      setIsExportingXls(true)
      const blob = await downloadAllWorkersXls()
      triggerDownload(blob, `trabajadores_${new Date().toISOString().split("T")[0]}.xlsx`)
    } catch (error) {
      console.error("Error al exportar Excel:", error)
      alert("Error al exportar el archivo Excel")
    } finally {
      setIsExportingXls(false)
    }
  }

  // ── PDF SIGERH ─────────────────────────────────────────────────────────────
  const handleExportPdf = async () => {
    try {
      setIsExportingPdf(true)
      const blob = await downloadAllWorkersPdf()
      triggerDownload(blob, `trabajadores_${new Date().toISOString().split("T")[0]}.pdf`)
    } catch (error) {
      console.error("Error al exportar PDF:", error)
      alert("Error al exportar el archivo PDF")
    } finally {
      setIsExportingPdf(false)
    }
  }

  // ── Excel Bioadmin ─────────────────────────────────────────────────────────
  const handleExportBioadmin = () => {
    console.log("Buscando trabajadores fisicos con fecha:", fecha)
    alert(`Buscando trabajadores fisicos para la fecha: ${fecha}`)
    // TODO: implementar cuando esté listo en backend
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[auto_auto_auto_minmax(260px,1fr)] gap-4 md:gap-6 items-end">

      {/* Excel SIGERH */}
      <button
        type="button"
        onClick={handleExportExcel}
        disabled={isExportingXls || isExportingPdf}
        className="inline-flex h-10 items-center gap-2 whitespace-nowrap text-sm font-semibold text-[#0a8ca8] hover:text-[#08778f] disabled:cursor-not-allowed disabled:text-gray-400"
      >
        <FileSpreadsheet className="h-4 w-4" />
        <span>{isExportingXls ? "Exportando..." : "Excel SIGERH"}</span>
      </button>

      {/* PDF SIGERH */}
      <button
        type="button"
        onClick={handleExportPdf}
        disabled={isExportingXls || isExportingPdf}
        className="inline-flex h-10 items-center gap-2 whitespace-nowrap text-sm font-semibold text-[#0a8ca8] hover:text-[#08778f] disabled:cursor-not-allowed disabled:text-gray-400"
      >
        <FileText className="h-4 w-4" />
        <span>{isExportingPdf ? "Exportando..." : "PDF SIGERH"}</span>
      </button>

      {/* Excel Bioadmin */}
      <button
        type="button"
        onClick={handleExportBioadmin}
        disabled={isExportingXls || isExportingPdf}
        className="inline-flex h-10 items-center gap-2 whitespace-nowrap text-sm font-semibold text-[#0a8ca8] hover:text-[#08778f] disabled:cursor-not-allowed disabled:text-gray-400"
      >
        <FileSpreadsheet className="h-4 w-4" />
        <span>Excel Bioadmin</span>
      </button>

      {/* Date Picker para Bioadmin */}
      <span className="text-sm text-gray-700">
        Fecha del reporte:{" "}
        <CustomDatePicker
          value={fecha}
          onChange={setFecha}
          pickerType="day"
          placeholder="Seleccione fecha"
          className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[#0a8ca8]/40 text-black"
        />
      </span>
    </div>
  )
}