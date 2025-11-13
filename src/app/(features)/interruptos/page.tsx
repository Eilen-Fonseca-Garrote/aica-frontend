// features/interruptos/page.tsx
'use client'

import { useState } from 'react'
import InterruptosSection from '@/app/(features)/interruptos/InterruptosSection'
import InterruptosForm from '@/app/(features)/interruptos/interruptosForm'
import InterruptosResult from '@/app/(features)/interruptos/interrruptosResult'
import { InterruptosData, TotalInterruptos } from './types'
import { getInterruptos, downloadInterruptosPdf } from '@/app/lib/api/interruptos'
import { downloadFile } from '@/app/lib/helpers'
import ToggleSection from '../uiLibrary/ToggleSection'

export default function InterruptosPage() {
  const [ueb, setUeb] = useState('0')
  const [fecha, setFecha] = useState('')
  const [data, setData] = useState<InterruptosData[]>([])
  const [total, setTotal] = useState<TotalInterruptos | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCalculate = async () => {
    setLoading(true)
    setError(null)
    setData([])
    setTotal(null)

    try {
      const result = await getInterruptos(ueb, fecha)
      setData(result.interruptos)
      setTotal(result.total)
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
      const file = await downloadInterruptosPdf(ueb, fecha)
      downloadFile(file, `Interruptos_${ueb}_${fecha}.pdf`)
    } catch (err) {
      console.error(err)
      setError('Ocurrió un error inesperado durante la descarga.')
    } finally {
      setLoading(false)
    }
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
            ) : data.length > 0 && total ? (
              <InterruptosResult data={data} total={total} />
            ) : (
              <p className="text-gray-500 italic text-center">Sin resultados aún</p>
            )}
          </div>
        </div>
      </ToggleSection>
    </div>
  )
}