'use client';
import React from 'react';
import { PromedioDiario } from '../types';


interface PromedioDiarioResultProps {
  promedio: PromedioDiario[];
}

const PromedioDiarioResult: React.FC<PromedioDiarioResultProps> = ({ promedio }) => {
  const hasData = promedio.length > 0;

  return (
    <div className="rounded-lg shadow border border-gray-200 bg-white text-black">
      <div className="px-4 py-3 font-semibold text-base border-b border-[#08778f] bg-[#0a8ca8] text-white">
        Promedio Diario
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-[#0a8ca8] text-white">
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
