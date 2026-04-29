'use client'

import { downloadFile } from "@/app/lib/helpers"
import { downloadModelo14BXls } from "@/app/lib/api/reportes"
import { FileSpreadsheet } from "lucide-react"

const downloadModelo14B = async () => {
  const file = await downloadModelo14BXls()
  downloadFile(file, 'Modelo14B')
}

export default function Modelo14BPage() {
  return (
    <div className="rounded-lg bg-white p-6">
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-[#08778f] bg-[#0a8ca8] px-4 py-3 font-semibold text-white">
          Modelo 14B
        </div>
        <div className="p-4">
          <button
            type="button"
            onClick={downloadModelo14B}
            className="inline-flex h-10 items-center gap-2 text-sm font-semibold text-[#0a8ca8] hover:text-[#08778f]"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span className="text-xs">Excel</span>
          </button>
        </div>
      </div>
    </div>
  )
}
