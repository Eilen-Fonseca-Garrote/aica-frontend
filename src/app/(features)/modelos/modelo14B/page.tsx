'use client'

import { downloadFile } from "@/app/lib/helpers"
import { downloadModelo14BXls } from "@/app/lib/api/reportes"

const downloadModelo14B = async () => {
  const file = await downloadModelo14BXls()
  downloadFile(file, 'Modelo14B')
}

export default function Modelo14BPage() {
  return (
    <div className="grid md:grid-cols-2 gap-4 rounded-lg shadow-sm p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b px-4 py-3 font-semibold text-gray-700">
          Modelo 14B
        </div>
        <div className="p-4">
          <button
            type="button"
            onClick={downloadModelo14B}
            className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-medium"
          >
            Exportar Modelo 14B
          </button>
        </div>
      </div>
    </div>
  )
}
