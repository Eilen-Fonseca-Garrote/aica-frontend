'use client';

import { useState, MouseEvent, ChangeEvent } from 'react';
import PromedioMensualResult, {
  PromedioData,
  TotalData,
} from "./listaPromedioMensual";
import PromedioDiarioResult, {
  PromedioDiario,
} from "./listaPromedioDiario";

interface Direccion {
  unidad: string;
  valor: string;
}

export default function PromedioPage() {
  const [uebMensual, setUebMensual] = useState<string>('0');
  const [fechaMensual, setFechaMensual] = useState<string>('');
  const [uebDiario, setUebDiario] = useState<string>('0');
  const [fechaDiario, setFechaDiario] = useState<string>('');
  const [direccionFuncional, setDireccionFuncional] = useState<string>('0');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  const [mensualData, setMensualData] = useState<PromedioData[]>([]);
  const [mensualTotal, setMensualTotal] = useState<TotalData | null>(null);

  const [diarioData, setDiarioData] = useState<PromedioDiario[]>([]);

  const handlePromedioMensual = () => {
    // Fetch or compute data here
    setMensualData([
      { Unidad: "AICA", HPromFisic: 10, HPromFMuj: 5, HPromTot: 15, HPromMuj: 8 },
    ]);
    setMensualTotal({
      totalFisico: 10,
      totalFisicoMuj: 5,
      totalPromedio: 15,
      totalPromedioMujeres: 8,
    });
  };

  const handlePromedioDiario = () => {
    setDiarioData([
      { Fecha: "2025-10-01", HPDTT: 20, HPDTM: 8 },
      { Fecha: "2025-10-02", HPDTT: 18, HPDTM: 7 },
    ]);
  };

  const direcciones: Direccion[] = [
    { unidad: 'Dirección 1', valor: 'D1' },
    { unidad: 'Dirección 2', valor: 'D2' },
  ];


  const imprimirPromedioMensual = (e: MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    console.log('Descargar Promedio Mensual PDF');
  };

  const imprimirPromedioDiario = (e: MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    console.log('Descargar Promedio Diario PDF');
  };

  const handleSelectChange =
    (setter: (value: string) => void) => (e: ChangeEvent<HTMLSelectElement>) =>
      setter(e.target.value);

  const handleInputChange =
    (setter: (value: string) => void) => (e: ChangeEvent<HTMLInputElement>) =>
      setter(e.target.value);

  return (
    <div className="p-4">
      <div className="rounded-xl shadow-md bg-green-100 overflow-hidden">
        <div
          className="flex justify-between items-center bg-green-600 text-white px-5 py-3 cursor-pointer"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <h3 className="font-semibold text-lg">Promedio Trabajadores</h3>
          <button
            className="text-white hover:text-gray-200 transition"
            aria-label="toggle collapse"
          >
            <i className={`fas ${isCollapsed ? 'fa-plus' : 'fa-minus'}`} />
          </button>
        </div>

        {!isCollapsed && (
          <div className="p-5 space-y-6 bg-white">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Promedio Mensual */}
              <div className="rounded-lg shadow-sm border border-gray-200">
                <div className="bg-gray-100 px-4 py-2 border-b">
                  <h5 className="font-medium text-gray-700">Promedio Mensual</h5>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                      value={uebMensual}
                      onChange={handleSelectChange(setUebMensual)}
                    >
                      <option value="0">Todas las UEBs</option>
                      <option value="16">AICA</option>
                      <option value="25">LIORAD</option>
                      <option value="100">CITOX</option>
                      <option value="55">JULIO TRIGO</option>
                      <option value="57">SH+</option>
                    </select>

                    <input
                      type="month"
                      className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                      value={fechaMensual}
                      onChange={handleInputChange(setFechaMensual)}
                    />
                  </div>

                  <hr className="border-gray-200" />

                  <div className="flex justify-between">
                    <button
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                      onClick={handlePromedioMensual}
                    >
                      Calcular
                    </button>

                    <a
                      href="#"
                      onClick={imprimirPromedioMensual}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                    >
                      Descargar <i className="fa fa-file-pdf" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Promedio Diario */}
              <div className="rounded-lg shadow-sm border border-gray-200">
                <div className="bg-gray-100 px-4 py-2 border-b">
                  <h5 className="font-medium text-gray-700">Promedio Diario</h5>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <select
                      className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={uebDiario}
                      onChange={handleSelectChange(setUebDiario)}
                    >
                      <option value="0">Todas las UEBs</option>
                      <option value="16">AICA</option>
                      <option value="25">LIORAD</option>
                      <option value="100">CITOX</option>
                      <option value="55">JULIO TRIGO</option>
                      <option value="57">SH+</option>
                    </select>

                    <select
                      className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={direccionFuncional}
                      onChange={handleSelectChange(setDireccionFuncional)}
                    >
                      <option value="0">Seleccionar Dirección..</option>
                      {direcciones.map((dr) => (
                        <option key={dr.valor} value={dr.valor}>
                          {dr.unidad}
                        </option>
                      ))}
                    </select>

                    <input
                      type="date"
                      className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={fechaDiario}
                      onChange={handleInputChange(setFechaDiario)}
                    />
                  </div>

                  <hr className="border-gray-200" />

                  <div className="flex justify-between">
                    <button
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                      onClick={handlePromedioDiario}
                    >
                      Calcular
                    </button>

                    <a
                      href="#"
                      onClick={imprimirPromedioDiario}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                    >
                      Descargar <i className="fa fa-file-pdf" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Listado (Resultados) */}
            <div className="rounded-lg border border-gray-200 shadow-sm p-4">
                    {mensualData.length > 0 && mensualTotal ? (
                      <PromedioMensualResult
                        promedio={mensualData}
                        total={mensualTotal}
                        title="Promedio Mensual"
                      />
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
