import React from "react";

export interface PromedioData {
  Unidad: string;
  HPromFisic: number;
  HPromFMuj: number;
  HPromTot: number;
  HPromMuj: number;
}

export interface TotalData {
  totalFisico: number;
  totalFisicoMuj: number;
  totalPromedio: number;
  totalPromedioMujeres: number;
}

interface Props {
  title?: string;
  promedio: PromedioData[];
  total: TotalData;
}

const PromedioMensualResult: React.FC<Props> = ({ title, promedio, total }) => {
  if (!promedio || promedio.length === 0) {
    return (
      <div className="text-center text-gray-500 italic p-4">
        No hay datos disponibles.
      </div>
    );
  }

  return (
    <div className="mb-6 border rounded-lg shadow-sm text-black">
      {title && (
        <div className="bg-gray-100 px-4 py-2 border-b">
          <h3 className="font-semibold text-gray-700">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">Dirección</th>
              <th className="p-2 text-center">Físico</th>
              <th className="p-2 text-center">Físico Mujeres</th>
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
                <td className="p-2">{row.Unidad}</td>
                <td className="p-2 text-center">{row.HPromFisic}</td>
                <td className="p-2 text-center">{row.HPromFMuj}</td>
                <td className="p-2 text-center">{row.HPromTot}</td>
                <td className="p-2 text-center">{row.HPromMuj}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-100 font-semibold">
            <tr>
              <td className="p-2 text-left">Total</td>
              <td className="p-2 text-center">{total.totalFisico}</td>
              <td className="p-2 text-center">{total.totalFisicoMuj}</td>
              <td className="p-2 text-center">{total.totalPromedio}</td>
              <td className="p-2 text-center">{total.totalPromedioMujeres}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default PromedioMensualResult;
