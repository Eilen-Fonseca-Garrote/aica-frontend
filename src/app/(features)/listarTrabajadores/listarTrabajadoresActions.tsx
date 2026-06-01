"use client"

import { useState } from "react"
import "react-datepicker/dist/react-datepicker.css"
import CustomDatePicker from "@/components/ui/DatePicker"
import { FileSpreadsheet, FileText } from "lucide-react"
import {
  downloadAllWorkersXls,
  downloadAllWorkersPdf,
  downloadTrabajadoresFisicosXls,
  downloadTrabajadoresFisicosPdf,
} from "@/app/lib/api/reportes"

const ListarTrabajadoresActions = () => {
  const [fecha, setFecha] = useState(
    new Date().toISOString().split("T")[0],
  )
  const [isExportingXls, setIsExportingXls] = useState(false)
  const [isExportingPdf, setIsExportingPdf] = useState(false)
  const [isExportingBioadminXls, setIsExportingBioadminXls] = useState(false)
  const [isExportingBioadminPdf, setIsExportingBioadminPdf] = useState(false)

  const isAnyExporting =
    isExportingXls || isExportingPdf || isExportingBioadminXls || isExportingBioadminPdf

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
      console.error("Error al exportar Excel SIGERH:", error)
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
      console.error("Error al exportar PDF SIGERH:", error)
      alert("Error al exportar el archivo PDF")
    } finally {
      setIsExportingPdf(false)
    }
  }

  // ── Excel Bioadmin ─────────────────────────────────────────────────────────
  const handleExportBioadminXls = async () => {
    if (!fecha) {
      alert("Seleccione una fecha para exportar el reporte Bioadmin.")
      return
    }
    try {
      setIsExportingBioadminXls(true)
      const blob = await downloadTrabajadoresFisicosXls(fecha)
      triggerDownload(blob, `trabajadores_fisicos_${fecha}.xlsx`)
    } catch (error) {
      console.error("Error al exportar Excel Bioadmin:", error)
      alert("Error al exportar el archivo Excel Bioadmin.")
    } finally {
      setIsExportingBioadminXls(false)
    }
  }

  // ── PDF Bioadmin ───────────────────────────────────────────────────────────
  const handleExportBioadminPdf = async () => {
    if (!fecha) {
      alert("Seleccione una fecha para exportar el reporte Bioadmin.")
      return
    }
    try {
      setIsExportingBioadminPdf(true)
      const blob = await downloadTrabajadoresFisicosPdf(fecha)
      triggerDownload(blob, `trabajadores_fisicos_${fecha}.pdf`)
    } catch (error) {
      console.error("Error al exportar PDF Bioadmin:", error)
      alert("Error al exportar el archivo PDF Bioadmin.")
    } finally {
      setIsExportingBioadminPdf(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">

      {/* ── Fila SIGERH ── */}
      <div className="flex flex-wrap items-center gap-6">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 w-20">
          SIGERH
        </span>
        <button
          type="button"
          onClick={handleExportExcel}
          disabled={isAnyExporting}
          className="inline-flex h-10 items-center gap-2 whitespace-nowrap text-sm font-semibold text-[#0a8ca8] hover:text-[#08778f] disabled:cursor-not-allowed disabled:text-gray-400"
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>{isExportingXls ? "Exportando..." : "Excel"}</span>
        </button>
        <button
          type="button"
          onClick={handleExportPdf}
          disabled={isAnyExporting}
          className="inline-flex h-10 items-center gap-2 whitespace-nowrap text-sm font-semibold text-[#0a8ca8] hover:text-[#08778f] disabled:cursor-not-allowed disabled:text-gray-400"
        >
          <FileText className="h-4 w-4" />
          <span>{isExportingPdf ? "Exportando..." : "PDF"}</span>
        </button>
      </div>

      {/* ── Fila Bioadmin ── */}
      <div className="flex flex-wrap items-center gap-6">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 w-20">
          Bioadmin
        </span>
        <button
          type="button"
          onClick={handleExportBioadminXls}
          disabled={isAnyExporting || !fecha}
          className="inline-flex h-10 items-center gap-2 whitespace-nowrap text-sm font-semibold text-[#0a8ca8] hover:text-[#08778f] disabled:cursor-not-allowed disabled:text-gray-400"
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>{isExportingBioadminXls ? "Exportando..." : "Excel"}</span>
        </button>
        <button
          type="button"
          onClick={handleExportBioadminPdf}
          disabled={isAnyExporting || !fecha}
          className="inline-flex h-10 items-center gap-2 whitespace-nowrap text-sm font-semibold text-[#0a8ca8] hover:text-[#08778f] disabled:cursor-not-allowed disabled:text-gray-400"
        >
          <FileText className="h-4 w-4" />
          <span>{isExportingBioadminPdf ? "Exportando..." : "PDF"}</span>
        </button>
        <span className="text-sm text-gray-600 flex items-center gap-2">
          Fecha:
          <CustomDatePicker
            value={fecha}
            onChange={setFecha}
            pickerType="day"
            placeholder="Seleccione fecha"
            className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[#0a8ca8]/40 text-black text-sm"
          />
        </span>
      </div>

    </div>
  )
}

export default ListarTrabajadoresActions
