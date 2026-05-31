"use client"

import { useState } from "react"
import { downloadFile } from "@/app/lib/helpers"
import { downloadModeloRL4Xls } from "@/app/lib/api/reportes"
import { FileSpreadsheet } from "lucide-react"

interface ModeloRl4ActionsProps {
  mesAnio: string
  diasNoLaborables: string
}

const TEXT_ACTION_CLASS =
  "inline-flex h-10 items-center gap-2 text-sm font-semibold text-[#0a8ca8] hover:text-[#08778f] disabled:text-gray-400 disabled:cursor-not-allowed"

const ModeloRl4Actions = ({ mesAnio, diasNoLaborables }: ModeloRl4ActionsProps) => {
  const [downloading, setDownloading] = useState(false);
  
  const handleExportarExcel = async () => {
    setDownloading(true);
    try {
      const file = await downloadModeloRL4Xls(diasNoLaborables, mesAnio);
      await downloadFile(file, 'modeloRL4.xlsx');
    }
    finally {
      setDownloading(false);
    }
  }

  return (
    <div className="flex justify-end">
      <button
        type="button"
        disabled={downloading}
        onClick={handleExportarExcel}
        className={TEXT_ACTION_CLASS}
      >
         <FileSpreadsheet className="h-4 w-4" />
        <span>Excel</span>
      </button>
    </div>
  )    
}

export default ModeloRl4Actions
