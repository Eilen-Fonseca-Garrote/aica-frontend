"use client"

import React from "react"
import {TrabajadorFamilyData } from "../types"


interface DatosFamiliaresProps {
  familiarData: TrabajadorFamilyData
}

export default function DatosFamiliares({familiarData }: DatosFamiliaresProps) {
  

  const hasFamiliares =familiarData.parentesco

  return (
    <div className="space-y-6">
      {/* Datos básicos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <strong>Cantidad de Hijos</strong>
          <p>{familiarData.cant_hijos || "—"}</p>
        </div>
        <div>
          <strong>Nombre Padre</strong>
          <p>{familiarData.nombre_padre || "—"}</p>
        </div>
        <div>
          <strong>Nombre Madre</strong>
          <p>{familiarData.nombre_madre || "—"}</p>
        </div>
      </div>

      {/* Card: Familiares en la empresa */}
      <div className="border border-green-500 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-green-500 text-white px-4 py-2 flex justify-between items-center">
          <h3 className="font-semibold">Familiares en la Empresa</h3>
        </div>

        <div className="bg-white p-4 overflow-x-auto">
          {hasFamiliares ? (
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2 border">Nombre del Familiar</th>
                  <th className="px-4 py-2 border">CI del Familiar</th>
                  <th className="px-4 py-2 border">Parentezco</th>
                  <th className="px-4 py-2 border">Viven Juntos</th>
                  <th className="px-4 py-2 border">Afecta</th>
                </tr>
              </thead>
              <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{familiarData.familiar_nombre}</td>
                    <td className="px-4 py-2 border">{familiarData.familiar_ci}</td>
                    <td className="px-4 py-2 border">{familiarData.parentesco}</td>
                    <td className="px-4 py-2 border">{familiarData.viven_juntos}</td>
                    <td className="px-4 py-2 border">{familiarData.afecta_contraparte}</td>
                  </tr>
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600">No tiene familiares trabajando en la empresa.</p>
          )}
        </div>
      </div>
    </div>
  )
}
