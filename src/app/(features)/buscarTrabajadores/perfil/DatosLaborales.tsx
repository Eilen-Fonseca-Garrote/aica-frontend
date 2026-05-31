"use client"

import React from "react"
import { TrabajadorLaborData } from "../types";


interface Props {
  laborData: TrabajadorLaborData
}

const DatosLaborales = ({ laborData }: Props) => {

  return (
    <div className="space-y-6">
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Info label="Número de Expediente" value={laborData.expediente} />
        <Info label="Fecha de Alta en Empresa" value={laborData.fecha_alta_empresa} />
        <Info
          label="Años Experiencia"
          value={laborData.annos_experiencia === 0 ? "NO ESPECIFICADO" : laborData.annos_experiencia}
        />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Info label="Categoría Ocupacional" value={laborData.categoria_ocupacional} />
        <Info label="Grupo Escala" value={laborData.grupo_escala} />
        <Info
          label="Salario Escala"
          value={laborData.salario_escala === 0 ? "NO ESPECIFICADO" : laborData.salario_escala}
        />
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Info label="Imprescindible" value={laborData.es_imprescindible === 0 ? "NO" : "SI"} />
        <Info label="Pago Antiguedad" value={laborData.pago_antiguedad} />
        <Info label="Régimen de Pago" value={laborData.regimen_de_pago} />
      </div>

      {/* Row 4 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Info label="Horas de Interrupción Acum" value={laborData.horas_interrpcion_acum} />
        <Info label="Ubicación en la defensa" value={laborData.ubicacion_defensa} />
        <Info
          label="Detalles de Ubicación"
          value={
            laborData.detalles_de_ubicacion.trim() === ""
              ? "NO ESPECIFICADO"
              : laborData.detalles_de_ubicacion
          }
        />
      </div>

      {/* Card: Organizaciones */}
      <div className="border rounded-2xl shadow p-4 bg-white">
        <details className="group">
          <summary className="flex justify-between items-center cursor-pointer font-semibold bg-[#0a8ca8] text-white px-3 py-2 rounded">
            <span>Organizaciones a las que pertenece</span>
            <span className="transition-transform group-open:rotate-45">＋</span>
          </summary>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Info label="PCC" value={laborData.pcc === 0 ? "NO" : "SI"} />
            <Info label="UJC" value={laborData.ujc === 0 ? "NO" : "SI"} />
            <Info label="CDR" value={laborData.cdr === 0 ? "NO" : "SI"} />
            <Info label="FMC" value={laborData.fmc === 0 ? "NO" : "SI"} />
          </div>
        </details>
      </div>

      {/* Card: Historial de Cargos */}
      <div className="border rounded-2xl shadow p-4 bg-white">
        <details className="group">
          <summary className="flex justify-between items-center cursor-pointer font-semibold bg-[#0a8ca8] text-white px-3 py-2 rounded">
            <span>Historial de Cargos</span>
            <span className="transition-transform group-open:rotate-45">＋</span>
          </summary>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border text-sm text-left">
              <thead className="bg-[#0a8ca8] text-white uppercase">
                <tr>
                  <th className="px-4 py-2">Cargo</th>
                  <th className="px-4 py-2">Salario</th>
                  <th className="px-4 py-2">Fecha Alta</th>
                </tr>
              </thead>
              <tbody>

                  <tr className="border-t">
                    <td className="px-4 py-2">{laborData.cargos}</td>
                    <td className="px-4 py-2">{laborData.salario}</td>
                    <td className="px-4 py-2">{laborData.fecha_alta}</td>
                  </tr>
              </tbody>
            </table>
          </div>
        </details>
      </div>
    </div>
  )
}

/** Small helper to keep label/value layout consistent */
const Info = ({ label, value }: { label: string; value: React.ReactNode }) => {
  return (
    <div>
      <strong className="block text-gray-700">{label}</strong>
      <p className="text-gray-900">{value ?? "NO ESPECIFICADO"}</p>
    </div>
  )
}

export default DatosLaborales
