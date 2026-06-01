"use client"

import ToggleSection from "@/components/ui/ToggleSection"
import { TrabajadorMisionesCondecData } from "../types"

interface WorkerAchievementsProps {
  misiones: TrabajadorMisionesCondecData
}

const WorkerAchievements = ({
  misiones,
}: WorkerAchievementsProps) => {
  return (
    <div className="space-y-4">
      {/* Condecoraciones */}
      <ToggleSection title="Condecoraciones" color="blue" variant="minimal">
        {misiones.codigo_cond ? (
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Condecoración</th>
                <th className="px-4 py-2 text-left font-medium">Fecha Recibida</th>
              </tr>
            </thead>
            <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2">{misiones.condecoracion.trim()}</td>
                  <td className="px-4 py-2">{misiones.fecha_recibida}</td>
                </tr>
            </tbody>
          </table>
        ) : (
          <p className="p-4 text-gray-500">No ha recibido condecoraciones.</p>
        )}
      </ToggleSection>

      {/* Misiones */}
      <ToggleSection title="Misiones" color="blue" variant="minimal">
        {misiones.codigo_mis ? (
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium">País de Misión</th>
                <th className="px-4 py-2 text-left font-medium">Funciones</th>
                <th className="px-4 py-2 text-left font-medium">Inicio</th>
                <th className="px-4 py-2 text-left font-medium">Fin</th>
              </tr>
            </thead>
            <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2">{misiones.pais}</td>
                  <td className="px-4 py-2">{misiones.funciones}</td>
                  <td className="px-4 py-2">{misiones.inicio_mision}</td>
                  <td className="px-4 py-2">{misiones.fin_de_mision}</td>
                </tr>
            </tbody>
          </table>
        ) : (
          <p className="p-4 text-gray-500">No ha hecho misiones.</p>
        )}
      </ToggleSection>
    </div>
  )
}

export default WorkerAchievements
