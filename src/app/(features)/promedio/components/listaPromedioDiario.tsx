import React from "react";

export interface PromedioDiario {
  Fecha: string;
  HPDTT: number;
  HPDTM: number;
}

interface Props {
  promedio: PromedioDiario[];
}

const PromedioDiarioResult: React.FC<Props> = ({ promedio }) => {
  if (!promedio || promedio.length === 0) {
    return (
      <div className="text-center text-gray-500 italic p-4">
        No hay datos disponibles.
      </div>
    );
  }

  return (
    <div className="border rounded-lg shadow-sm text-black">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-200">
          <thead className="bg-[#0a8ca8] text-white">
            <tr>
              <th className="p-2 text-center">Fecha</th>
              <th className="p-2 text-center">Promedio</th>
              <th className="p-2 text-center">Promedio Mujeres</th>
            </tr>
          </thead>
          <tbody>
            {promedio.map((row, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="p-2 text-center">{row.Fecha}</td>
                <td className="p-2 text-center">{row.HPDTT}</td>
                <td className="p-2 text-center">{row.HPDTM}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PromedioDiarioResult;
