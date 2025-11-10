"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { downloadFile } from "@/app/lib/helpers"
import { downloadModeloRL4Xls } from "@/app/lib/api/reportes"
import { FileSpreadsheet } from "lucide-react"

interface ModeloRl4ActionsProps {
  mesAnio: string
  diasNoLaborables: string
}

export default function ModeloRl4Actions({ mesAnio, diasNoLaborables }: ModeloRl4ActionsProps) {
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
      <Button disabled={downloading} onClick={handleExportarExcel} className="bg-green-600 hover:bg-green-700 text-white px-6 py-6 flex flex-col items-center gap-1">
         <FileSpreadsheet className="h-6 w-6" />
        <span className="text-xs">Excel</span>
      </Button>
    </div>
  )    
}