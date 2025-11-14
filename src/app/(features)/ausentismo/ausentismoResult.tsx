// AusentismoResult.tsx
import React from 'react';
import { AusentismoItem } from './types';

interface AusentismoResultProps {
  data: AusentismoItem[];
  uebNombre: string;
  fecha: string;
}

const AusentismoResult: React.FC<AusentismoResultProps> = ({ 
  data, 
  uebNombre, 
  fecha 
}) => {
  const hasData = data.length > 0;

  return (
    <div className="rounded-lg shadow border border-gray-200 bg-white overflow-hidden text-black">
      <div className="bg-green-600 text-white px-4 py-2 font-semibold text-lg">
        Claves de Ausentismo - {uebNombre} - {fecha}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr className="text-center">
              <th className="py-2 px-4 w-1/2">Código Clave</th>
              <th className="py-2 px-4 w-1/2">Cantidad de Trabajadores</th>
            </tr>
          </thead>
          <tbody>
            {!hasData ? (
              <tr className="text-center text-gray-500">
                <td colSpan={2} className="py-3 italic">
                  Sin datos disponibles
                </td>
              </tr>
            ) : (
              data.map((item, idx) => (
                <tr key={idx} className="text-center border-t border-gray-200">
                  <td className="py-2">{item.Clave}</td>
                  <td>{item.Cantidad}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AusentismoResult;