/*'use client';
import React from 'react';

export interface AusentismoData {
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

interface PromedioMensualResultProps {
  promedio: PromedioData[];
  total: TotalData;
  title?: string;
}

const TableRow = ({ prom }: { prom: AusentismoData }) => (
  <tr className="text-center border-t border-gray-200">
    <td className="py-2">{prom.Unidad}</td>
    <td>{prom.HPromFisic}</td>
    <td>{prom.HPromFMuj}</td>
    <td>{prom.HPromTot}</td>
    <td>{prom.HPromMuj}</td>
  </tr>
);

const PromedioMensualResult: React.FC<PromedioMensualResultProps> = ({
  promedio,
  total,
  title = 'Promedio Mensual',
}) => {
  const hasData = promedio.length > 0;

  return (
    <div className="space-y-6 text-black">
      <div className="rounded-lg shadow border border-gray-200 bg-white overflow-hidden">
        <div className="bg-green-600 text-white px-4 py-2 font-semibold text-lg">
          {title}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left w-[40%]">Dirección</th>
                <th className="py-2 px-4 text-center w-[10%]">Físico</th>
                <th className="py-2 px-4 text-center w-[10%]">Físico Mujeres</th>
                <th className="py-2 px-4 text-center w-[10%]">Promedio</th>
                <th className="py-2 px-4 text-center w-[10%]">Promedio Mujeres</th>
              </tr>
            </thead>
            <tbody>
              {!hasData ? (
                <tr className="text-center text-gray-500">
                  <td colSpan={5} className="py-3 italic">
                    Sin datos disponibles
                  </td>
                </tr>
              ) : (
                promedio.map((prom, idx) => <TableRow key={idx} prom={prom} />)
              )}
            </tbody>
            <tfoot className="bg-gray-50 font-semibold border-t border-gray-200">
              <tr>
                <th className="py-2 px-4 text-left">Total</th>
                <th>{total.totalFisico}</th>
                <th>{total.totalFisicoMuj}</th>
                <th>{total.totalPromedio}</th>
                <th>{total.totalPromedioMujeres}</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PromedioMensualResult;  */