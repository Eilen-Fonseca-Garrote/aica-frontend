// features/interruptos/page.tsx
'use client'
import { useState } from 'react'
import InterruptosSection from './InterruptosSection'
import InterruptosForm from './interruptosForm'
import InterruptosResult from './interrruptosResult'
import { InterruptosResponse, InterruptosTableRow } from './types'
import { getInterruptos, downloadInterruptosPdf } from '@/app/lib/api/interruptos'
import { downloadFile } from '@/app/lib/helpers'
import ToggleSection from '../uiLibrary/ToggleSection'

function getDefaultDate(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const year = now.getFullYear()
  return `${year}-${month}`
}

export default function InterruptosPage() {
  const [ueb, setUeb] = useState('0')
  const [fecha, setFecha] = useState(getDefaultDate())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tableData, setTableData] = useState<InterruptosTableRow[]>([])

  const handleCalculate = async () => {
    if (!fecha) {
      alert("Por favor, seleccione una fecha");
      return;
    }

    setLoading(true)
    setError(null)
    setTableData([])

    try {
      const result: InterruptosResponse = await getInterruptos(Number(ueb), fecha)
      
      // Transformar los datos para la tabla
      const tableRows = transformToTableData(result, Number(ueb))
      setTableData(tableRows)
    } catch (err: unknown) {
      console.error('Error completo:', err)
      setError('Ocurrió un error inesperado durante la búsqueda.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (!fecha) {
      alert("Por favor, seleccione una fecha");
      return;
    }

    setLoading(true)
    setError(null)

    try {
      const file = await downloadInterruptosPdf(ueb, fecha)
      downloadFile(file, `Interruptos_${ueb}_${fecha}.pdf`)
    } catch (err: unknown) {
      console.error('Error en descarga:', err)
      setError('Ocurrió un error inesperado durante la descarga.')
    } finally {
      setLoading(false)
    }
  }

  const transformToTableData = (result: InterruptosResponse, ueb: number): InterruptosTableRow[] => {
    const tableData: InterruptosTableRow[] = [];

    // Para UEB específica - mostrar direcciones individuales
    if (ueb !== 0 && result.interruptos) {
      result.interruptos.forEach(item => {
        tableData.push({
          direccion: item.Direccion,
          covid: item.covid,
          reubicacion: item.reubicados,
          produccion100: item.produccion25,
          produccion60: item.produccion48
        });
      });
    } 
    // Para "Todas las UEBs" - mostrar solo los totales por UEB
    else if (ueb === 0) {
      // Aquí puedes agregar lógica para mostrar múltiples UEBs si es necesario
      // Por ahora, mostramos solo los totales generales
    }

    // Agregar totales generales
    if (result.totalCovid && result.totalReub && result.totalProd25 && result.totalProd48) {
      tableData.push(
        {
          direccion: "Total Femenino",
          covid: result.totalCovid.F,
          reubicacion: result.totalReub.F,
          produccion100: result.totalProd25.F,
          produccion60: result.totalProd48.F
        },
        {
          direccion: "Total Masculino", 
          covid: result.totalCovid.M,
          reubicacion: result.totalReub.M,
          produccion100: result.totalProd25.M,
          produccion60: result.totalProd48.M
        },
        {
          direccion: "Total General",
          covid: result.totalCovid.Total,
          reubicacion: result.totalReub.Total,
          produccion100: result.totalProd25.Total,
          produccion60: result.totalProd48.Total
        }
      );
    }

    return tableData;
  };

  return (
    <div className="p-4">
      <ToggleSection
        title="Trabajadores Interruptos"
        color="green"
        defaultExpanded={true}
      >
        <div className="p-5 space-y-6 bg-white">
          <InterruptosSection title="Trabajadores Interruptos">
            <InterruptosForm
              ueb={ueb}
              fecha={fecha}
              onChangeUeb={setUeb}
              onChangeFecha={setFecha}
              onCalculate={handleCalculate}
              onDownload={handleDownload}
            />
          </InterruptosSection>

          <div className="rounded-lg border border-gray-200 shadow-sm p-4">
            {loading ? (
              <p className="text-gray-500 text-2xl mt-4">Calculando interruptos...</p>
            ) : error ? (
              <p className="text-red-500 text-2xl mt-4">
                Ha ocurrido un error calculando los interruptos. Por favor contacte a un administrador
              </p>
            ) : tableData.length > 0 ? (
              <InterruptosResult data={tableData} />
            ) : (
              <p className="text-gray-500 italic text-center">Sin resultados aún</p>
            )}
          </div>
        </div>
      </ToggleSection>
    </div>
  )
}
