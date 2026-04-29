"use client"

import { useState } from "react"
import Card from "@/app/(features)/uiLibrary/Card"
import { ChevronDown, ChevronUp, Eye } from "lucide-react"
import { TrabajadorPersonalData } from "../types"

interface SearchResultsTableProps {
  personalData: TrabajadorPersonalData[]
  ueb?: string | null
  selectWorker: (worker: TrabajadorPersonalData) => void
  showLocationColumns?: boolean
  title?: string
}

type SortColumn = "nombre" | "ci" | "direccion_ueb" | "area"
type SortDirection = "asc" | "desc"

const textCollator = new Intl.Collator("es", {
  numeric: true,
  sensitivity: "base",
})

export default function SearchResultsTable({
  personalData,
  selectWorker,
  showLocationColumns = false,
  title = "Resultados de la Busqueda",
}: SearchResultsTableProps) {
  const [sortState, setSortState] = useState<{
    column: SortColumn
    direction: SortDirection
  } | null>(null)

  const handleViewProfile = (worker: TrabajadorPersonalData) => {
    selectWorker(worker)
  }

  const handleSortByColumn = (column: SortColumn) => {
    setSortState((previousSort) => {
      if (!previousSort || previousSort.column !== column) {
        return { column, direction: "asc" }
      }

      return {
        column,
        direction: previousSort.direction === "asc" ? "desc" : "asc",
      }
    })
  }

  const getSortArrowClass = (column: SortColumn, direction: SortDirection) => {
    const isActive = sortState?.column === column && sortState.direction === direction
    return isActive ? "text-black" : "text-gray-400"
  }

  const renderSortArrows = (column: SortColumn) => (
    <span className="flex flex-col leading-none" aria-hidden="true">
      <ChevronUp className={`h-3 w-3 ${getSortArrowClass(column, "asc")}`} />
      <ChevronDown className={`h-3 w-3 -mt-0.5 ${getSortArrowClass(column, "desc")}`} />
    </span>
  )

  const getWorkerSortableValue = (worker: TrabajadorPersonalData, column: SortColumn) => {
    const value = worker[column]
    return value ? String(value).trim() : ""
  }

  const sortedData = sortState
    ? [...personalData].sort((workerA, workerB) => {
        const valueA = getWorkerSortableValue(workerA, sortState.column)
        const valueB = getWorkerSortableValue(workerB, sortState.column)

        if (!valueA && !valueB) {
          return 0
        }
        if (!valueA) {
          return 1
        }
        if (!valueB) {
          return -1
        }

        const compareResult = textCollator.compare(valueA, valueB)
        return sortState.direction === "asc" ? compareResult : -compareResult
      })
    : personalData

  return (
    <div className="w-full">
      <Card className="shadow-sm border border-gray-200" title={title}>
        <table className="w-full table-auto border-collapse text-sm">
          <thead>
            <tr className="bg-[#0a8ca8] text-white text-left">
              <th className="px-4 py-2 border-b">
                <button
                  type="button"
                  onClick={() => handleSortByColumn("nombre")}
                  className="inline-flex items-center gap-1.5 text-white hover:text-gray-100"
                >
                  Nombre y Apellidos
                  {renderSortArrows("nombre")}
                </button>
              </th>
              <th className="px-4 py-2 border-b">
                <button
                  type="button"
                  onClick={() => handleSortByColumn("ci")}
                  className="inline-flex items-center gap-1.5 text-white hover:text-gray-100"
                >
                  CI
                  {renderSortArrows("ci")}
                </button>
              </th>
              {showLocationColumns && (
                <>
                  <th className="px-4 py-2 border-b">
                    <button
                      type="button"
                      onClick={() => handleSortByColumn("direccion_ueb")}
                      className="inline-flex items-center gap-1.5 text-white hover:text-gray-100"
                    >
                      Direccion
                      {renderSortArrows("direccion_ueb")}
                    </button>
                  </th>
                  <th className="px-4 py-2 border-b">
                    <button
                      type="button"
                      onClick={() => handleSortByColumn("area")}
                      className="inline-flex items-center gap-1.5 text-white hover:text-gray-100"
                    >
                      Area
                      {renderSortArrows("area")}
                    </button>
                  </th>
                </>
              )}
              <th className="px-4 py-2 border-b text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.length > 0 ? (
              sortedData.map((worker, idx) => (
                <tr key={idx} className="hover:bg-gray-100 border-b last:border-none">
                  <td className="px-4 py-2">{worker.nombre}</td>
                  <td className="px-4 py-2">{worker.ci}</td>
                  {showLocationColumns && (
                    <>
                      <td className="px-4 py-2">{worker.direccion_ueb || "-"}</td>
                      <td className="px-4 py-2">{worker.area || "-"}</td>
                    </>
                  )}
                  <td className="px-4 py-2 text-center">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center text-[#0a8ca8] hover:text-[#08778f]"
                      title="Ver Datos del Trabajador"
                      onClick={() => handleViewProfile(worker)}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={showLocationColumns ? 5 : 3}
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
