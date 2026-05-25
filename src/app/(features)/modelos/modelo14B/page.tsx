'use client'

import { useState } from "react"
import { downloadFile } from "@/app/lib/helpers"
import { downloadModelo14BXls } from "@/app/lib/api/reportes"
import { FileSpreadsheet, Loader2 } from "lucide-react"

type ExportStatus = "idle" | "loading" | "success" | "error"

const TEXT_ACTION_CLASS =
  "inline-flex h-10 items-center gap-2 text-sm font-semibold text-[#0a8ca8] hover:text-[#08778f] disabled:cursor-not-allowed disabled:text-gray-400"
const TEXT_ACTION_LABEL_CLASS = "text-sm font-semibold text-[#0a8ca8]"

export default function Modelo14BPage() {
  const [exportStatus, setExportStatus] = useState<ExportStatus>("idle")

  const handleDownloadModelo14B = async () => {
    try {
      setExportStatus("loading")
      const file = await downloadModelo14BXls()
      await downloadFile(file, "Modelo14B.xlsx")
      setExportStatus("success")
    } catch (error) {
      console.error("Error al exportar Modelo 14B:", error)
      setExportStatus("error")
    }
  }

  return (
    <div className="rounded-lg bg-white p-6">
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="px-4 py-3 font-semibold text-[#0a8ca8]">
          Modelo 14B
        </div>
        <div className="p-4">
          <button
            type="button"
            onClick={handleDownloadModelo14B}
            disabled={exportStatus === "loading"}
            className={TEXT_ACTION_CLASS}
          >
            {exportStatus === "loading" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="h-4 w-4" />
            )}
            <span>Excel</span>
          </button>
        </div>
      </div>
    </div>
  )
}
