'use client';

import { useState } from 'react';
import PromedioSection from './PromedioSection';
import PromedioMensualForm from './PromedioMensualForm';
import PromedioDiarioForm from './PromedioDiarioForm';
import PromedioMensualResult from "./PromedioMensualResult";
import PromedioDiarioResult, { PromedioDiario } from "./PromedioDiarioResult";
import { Promedio, Totales } from './types';

export default function PromedioPage() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const [uebMensual, setUebMensual] = useState("0");
  const [fechaMensual, setFechaMensual] = useState("");
  const [uebDiario, setUebDiario] = useState("0");
  const [fechaDiario, setFechaDiario] = useState("");
  const [direccionFuncional, setDireccionFuncional] = useState("0");

  const [mensualData, setMensualData] = useState<Promedio[]>([]);
  const [mensualTotal, setMensualTotal] = useState<Totales | null>(null);
  const [diarioData, setDiarioData] = useState<PromedioDiario[]>([]);

  const apiBase = process.env.REACT_APP_API_URL;

  const direcciones = [
    { unidad: 'Dirección 1', valor: 'D1' },
    { unidad: 'Dirección 2', valor: 'D2' },
  ];

  const safeFetch = async <T,>(
    url: string,
    fallbackData: T
  ): Promise<T> => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      return data;
    } catch (err) {
      console.warn("API no disponible, usando datos de prueba:", err);
      return fallbackData;
    }
  };

  const handlePromedioMensual = async () => {
    const url = `${apiBase}/calcularPromedio/promedioMensual?ueb=${uebMensual}&fecha=${fechaMensual}`;

    const mockMensual: Promedio[] = [
      { Unidad: "AICA", HPromFisic: 10, HPromFMuj: 5, HPromTot: 15, HPromMuj: 8 },
    ];
    const mockTotal: Totales = {
      totalFisico: 10,
      totalFisicoMuj: 5,
      totalPromedio: 15,
      totalPromedioMujeres: 8,
    };

    const data = await safeFetch<{ promedio: Promedio[]; total: Totales }>(
      url,
      { promedio: mockMensual, total: mockTotal }
    );

    setMensualData(data.promedio);
    setMensualTotal(data.total);
  };

  const handlePromedioDiario = async () => {
    const url = `${apiBase}/calcularPromedio/promedioDiarioRango?ueb=${uebDiario}&fecha=${fechaDiario}&dir=${direccionFuncional}`;

    const mockDiario: PromedioDiario[] = [
      { Fecha: "2025-10-01", HPDTT: 20, HPDTM: 8 },
      { Fecha: "2025-10-02", HPDTT: 18, HPDTM: 7 },
    ];

    const data = await safeFetch<PromedioDiario[]>(url, mockDiario);
    setMensualData([]);
    setMensualTotal(null);
    setDiarioData(data);
  };

  const imprimirPromedioMensual = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    console.log("Descargar Promedio Mensual PDF");
  };

  const imprimirPromedioDiario = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    console.log("Descargar Promedio Diario PDF");
  };

  return (
    <div className="p-4">
      <div className="rounded-xl shadow-md bg-green-100 overflow-hidden">
        <div
          className="flex justify-between items-center bg-green-600 text-white px-5 py-3 cursor-pointer"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <h3 className="font-semibold text-lg">Promedio Trabajadores</h3>
          <button className="text-white hover:text-gray-200 transition">
            <i className={`fas ${isCollapsed ? 'fa-plus' : 'fa-minus'}`} />
          </button>
        </div>

        {!isCollapsed && (
          <div className="p-5 space-y-6 bg-white">
            <div className="grid md:grid-cols-2 gap-6">
              <PromedioSection title="Promedio Mensual">
                <PromedioMensualForm
                  ueb={uebMensual}
                  fecha={fechaMensual}
                  onChangeUeb={setUebMensual}
                  onChangeFecha={setFechaMensual}
                  onCalculate={handlePromedioMensual}
                  onDownload={imprimirPromedioMensual}
                />
              </PromedioSection>

              <PromedioSection title="Promedio Diario">
                <PromedioDiarioForm
                  ueb={uebDiario}
                  fecha={fechaDiario}
                  direccionFuncional={direccionFuncional}
                  direcciones={direcciones}
                  onChangeUeb={setUebDiario}
                  onChangeDireccion={setDireccionFuncional}
                  onChangeFecha={setFechaDiario}
                  onCalculate={handlePromedioDiario}
                  onDownload={imprimirPromedioDiario}
                />
              </PromedioSection>
            </div>

            <div className="rounded-lg border border-gray-200 shadow-sm p-4">
              {mensualData.length > 0 && mensualTotal ? (
                <PromedioMensualResult promedio={mensualData} total={mensualTotal}/>
              ) : diarioData.length > 0 ? (
                <PromedioDiarioResult promedio={diarioData} />
              ) : (
                <p className="text-gray-500 italic text-center">Sin resultados aún</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
