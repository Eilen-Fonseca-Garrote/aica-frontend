"use client"

import Card from "@/components/ui/Card"
import { TrabajadorEstudiosData } from "../types"


interface DatosEstudiosProps {
  estudiosData: TrabajadorEstudiosData
}

const DatosEstudios = ({ estudiosData }: DatosEstudiosProps) => {
  if (!estudiosData) {
    return <p>No hay datos de estudios disponibles.</p>
  }

  const estudio = estudiosData
  const hasIdiomas = estudio.idioma && estudio.idioma.toUpperCase() !== "NINGUNO"

  return (
    <div className="space-y-6">
      {/* 1️⃣ BASIC INFO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <strong>Nivel Escolar</strong>
          <p>{estudio.nivel_escolar}</p>
        </div>
        <div>
          <strong>Fecha de Graduado</strong>
          <p>{estudio.fecha_graduado || "N/A"}</p>
        </div>
        <div>
          <strong>Graduado De</strong>
          <p>{estudio.graduado_de || "N/A"}</p>
        </div>
      </div>

      {/* 2️⃣ OTHER STUDIES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <strong>Master/Doctor</strong>
          <p>{estudio.master_doctor?.trim() || "NO"}</p>
        </div>
        <div>
          <strong>Otros Estudios</strong>
          <p>{estudio.otros_estudios || "NO"}</p>
        </div>
        <div>
          <strong>Fecha Otros Estudios</strong>
          <p>{estudio.fecha_otros_estudios || "NO"}</p>
        </div>
      </div>

      {/* 3️⃣ LANGUAGES */}
      <Card className="border border-gray-200">
        <div className="flex justify-between items-center bg-[#0a8ca8] text-white px-3 py-2 rounded mb-3">
          <h3 className="font-semibold">Idiomas que Domina</h3>
        </div>

        {hasIdiomas ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead className="bg-[#0a8ca8] text-white">
                <tr>
                  <th className="text-left p-2 border-b">Idioma</th>
                  <th className="text-left p-2 border-b">Lee</th>
                  <th className="text-left p-2 border-b">Habla</th>
                  <th className="text-left p-2 border-b">Escribe</th>
                </tr>
              </thead>
              <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-2">{estudio.idioma}</td>
                    <td className="p-2">{estudio.lee}</td>
                    <td className="p-2">{estudio.habla}</td>
                    <td className="p-2">{estudio.escribe}</td>
                  </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p className="ml-2">No domina ningún idioma.</p>
        )}
      </Card>
    </div>
  )
}

export default DatosEstudios
