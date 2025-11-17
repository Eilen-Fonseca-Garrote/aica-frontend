"use client"

import { useState } from "react"
import { ChevronUp } from "lucide-react"
import ListarTrabajadoresActions from "./listarTrabajadoresActions"

export default function ListarTrabajadores() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    filtrar: false,
    exportar: false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <div className="space-y-2">
      {/* Filtrar Trabajadores */}
      <div className="border border-gray-300 rounded">
        <button
          onClick={() => toggleSection("filtrar")}
          className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
        >
          <span className="font-medium text-gray-700">Filtrar Trabajadores</span>
          <div className="flex items-center gap-2">
            {expandedSections["filtrar"] ? (
              <ChevronUp className="h-5 w-5 text-gray-600" />
            ) : (
              <span className="text-2xl font-light text-red-500 border-2 border-red-500 w-8 h-8 flex items-center justify-center rounded">
                +
              </span>
            )}
          </div>
        </button>
        {expandedSections["filtrar"] && (
          <div className="bg-white p-4 border-t border-gray-300">
            <p className="text-sm text-gray-600">Contenido de filtros...</p>
          </div>
        )}
      </div>

      {/* Exportar Trabajadores */}
      <div className="border border-gray-300 rounded">
        <button
          onClick={() => toggleSection("exportar")}
          className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
        >
          <span className="font-medium text-gray-700">Exportar Trabajadores</span>
          {expandedSections["exportar"] ? (
            <ChevronUp className="h-5 w-5 text-gray-600" />
          ) : (
            <span className="text-2xl font-light text-gray-600">+</span>
          )}
        </button>
        {expandedSections["exportar"] && (
          <div className="bg-white p-6 border-t border-gray-300">
            <ListarTrabajadoresActions />
          </div>
        )}
      </div>
    </div>
  )
}
