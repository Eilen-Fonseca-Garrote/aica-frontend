'use client';
import React from 'react';

export interface PromedioDiario {
  Fecha: string;
  HPDTT: number;
  HPDTM: number;
}

export interface PromedioDiarioResponse {
  direcc: string;
  fecha: string;
  promedio: PromedioDiario[];
  success: boolean;
  ueb: string;
}

interface PromedioDiarioResultProps {
  promedio: PromedioDiario[];
}

const PromedioDiarioResult: React.FC<PromedioDiarioResultProps> = ({ promedio }) => {
  const hasData = promedio.length > 0;

  return (
    <div className="rounded-lg shadow border border-gray-200 bg-white overflow-hidden text-black">
      <div className="bg-green-600 text-white px-4 py-2 font-semibold text-lg">
        Promedio Diario
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr className="text-center">
              <th className="py-2 px-4 w-[33%]">Fecha</th>
              <th className="py-2 px-4 w-[33%]">Promedio</th>
              <th className="py-2 px-4 w-[33%]">Promedio Mujeres</th>
            </tr>
          </thead>
          <tbody>
            {!hasData ? (
              <tr className="text-center text-gray-500">
                <td colSpan={3} className="py-3 italic">
                  Sin datos disponibles
                </td>
              </tr>
            ) : (
              promedio.map((prom, idx) => (
                <tr key={idx} className="text-center border-t border-gray-200">
                  <td className="py-2">{prom.Fecha}</td>
                  <td>{prom.HPDTT}</td>
                  <td>{prom.HPDTM}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PromedioDiarioResult;
