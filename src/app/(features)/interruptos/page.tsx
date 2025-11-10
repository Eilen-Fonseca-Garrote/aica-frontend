// features/interruptos/page.tsx
'use client'

import { useState } from 'react'
import InterruptosSection from '../interruptos/InterruptosSection'
import InterruptosForm from '../interruptos/interruptosForm'
import InterruptosResult from '../interruptos/interrruptosResult'
import { InterruptosData } from './types'
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
  const [data, setData] = useState<InterruptosData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCalculate = async () => {
    setLoading(true)
    setError(null)
    setData([])

    try {
      const result = await getInterruptos(ueb, formatDateForBackend(fecha))
      const transformedData = transformInterruptosData(result)
      setData(transformedData)
    } catch (err) {
      console.error(err)
      setError('Ocurrió un error inesperado durante la búsqueda.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const file = await downloadInterruptosPdf(ueb, formatDateForBackend(fecha))
      downloadFile(file, `Interruptos_${ueb}_${fecha}.pdf`)
    } catch (err) {
      console.error(err)
      setError('Ocurrió un error inesperado durante la descarga.')
    } finally {
      setLoading(false)
    }
  }

  const formatDateForBackend = (date: string): string => {
    // Convierte de YYYY-MM a MM-YYYY
    const [year, month] = date.split('-')
    return `${month}-${year}`
  }

  const transformInterruptosData = (result: any): InterruptosData[] => {
    const transformedData: InterruptosData[] = []

    // Agregar datos por dirección
    if (result.interruptos) {
      result.interruptos.forEach((item: any) => {
        transformedData.push({
          direccion: item.Direccion,
          covid: item.covid,
          reubicacion: item.reubicados,
          produccion100: item.produccion25, // produccion25 corresponde a 100%
          produccion60: item.produccion48   // produccion48 corresponde a 60%
        })
      })
    }

    // Agregar totales
    if (result.totalCovid && result.totalProd25 && result.totalProd48) {
      transformedData.push({
        direccion: "Total Femenino",
        covid: result.totalCovid.F,
        reubicacion: result.totalReub?.F || 0,
        produccion100: result.totalProd25.F,
        produccion60: result.totalProd48.F
      })

      transformedData.push({
        direccion: "Total Masculino",
        covid: result.totalCovid.M,
        reubicacion: result.totalReub?.M || 0,
        produccion100: result.totalProd25.M,
        produccion60: result.totalProd48.M
      })

      transformedData.push({
        direccion: "Total",
        covid: result.totalCovid.Total,
        reubicacion: result.totalReub?.Total || 0,
        produccion100: result.totalProd25.Total,
        produccion60: result.totalProd48.Total
      })
    }

    return transformedData
  }

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
            ) : data.length > 0 ? (
              <InterruptosResult data={data} />
            ) : (
              <p className="text-gray-500 italic text-center">Sin resultados aún</p>
            )}
          </div>
        </div>
      </ToggleSection>
    </div>
  )
}