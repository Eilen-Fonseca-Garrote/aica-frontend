"use client"

import Card from "@/app/(features)/uiLibrary/Card"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { TrabajadorPersonalData } from "../types"


interface SearchResultsTableProps {
  personalData: TrabajadorPersonalData[]
  ueb?: string | null
  selectWorker: (worker: TrabajadorPersonalData) => void
}

export default function SearchResultsTable({
  personalData,
  selectWorker
}: SearchResultsTableProps) {

  const handleViewProfile = (worker: TrabajadorPersonalData) => {
    selectWorker(worker)
  }

  return (
    <div className="w-full">
      <Card className="shadow-md border border-gray-300" title="Resultados de la Búsqueda">

          <table className="w-full table-auto border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-700 text-left">
                <th className="px-4 py-2 border-b">Nombre y Apellidos</th>
                <th className="px-4 py-2 border-b">CI</th>
                <th className="px-4 py-2 border-b text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {personalData.length > 0 ? (
                personalData.map((worker, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-100 border-b last:border-none"
                  >
                    <td className="px-4 py-2">
                      {worker.nombre}
                    </td>
                    <td className="px-4 py-2">{worker.ci}</td>
                    <td className="px-4 py-2 text-center">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        title="Ver Datos del Trabajador"
                        onClick={() => handleViewProfile(worker)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-6 text-center text-gray-500 italic"
                  >
                    No se encontraron resultados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
      </Card>
    </div>
  )
}
