'use client'

import { useState } from 'react'
import AusentismoSection from '@/app/(features)/ausentismo/AusentismoSection'
import AusentismoForm from '@/app/(features)//ausentismo/ausentismoForm'
import AusentismoResult from '@/app/(features)/ausentismo/ausentismoResult'
import { ClaveAusentismo } from './types'
import { getAusencias, downloadAusenciasPdf } from '@/app/lib/api/ausentismo'
import { downloadFile } from '@/app/lib/helpers'
import ToggleSection from '../uiLibrary/ToggleSection'

export default function AusentismoPage() {
  const [ueb, setUeb] = useState('16') // Valor por defecto AICA
  const [fecha, setFecha] = useState('')
  const [data, setData] = useState<ClaveAusentismo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uebNombres: { [key: string]: string } = {
    '16': 'AICA',
    '25': 'LIORAD', 
    '55': 'JULIO TRIGO',
    '100': 'CITOX',
    '57': 'SH+'
  }

  const handleCalculate = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log("Calculando ausentismo para UEB:", ueb, "Mes/Año:", fecha)
      
      const response = await getAusencias(ueb, fecha, "")
      setData(response.CLAVES || [])
      
      console.log("Datos de ausentismo obtenidos:", response.CLAVES)
    } catch (err) {
      console.error("Error al calcular ausentismo:", err)
      setError('Ocurrió un error inesperado durante la búsqueda.')
      setData([])
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (loading) return
    
    setLoading(true)
    setError(null)
    try {
      console.log("Descargando PDF de ausentismo para UEB:", ueb, "Mes/Año:", fecha)
      
      const file = await downloadAusenciasPdf(ueb, fecha)
      downloadFile(file, `ausentismo-${uebNombres[ueb]}-${fecha}.pdf`)
      
      console.log("PDF de ausentismo descargado exitosamente")
    } catch (err) {
      console.error("Error al descargar PDF de ausentismo:", err)
      setError('Ocurrió un error inesperado durante la descarga.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='p-4'>
      <ToggleSection
        title="Cantidad Trabajadores por Clave de Ausentismo"
        color="green"
        defaultExpanded={true}
      >
        <div className='p-5 space-y-6 bg-white'>
          <AusentismoSection title='Configuración de Búsqueda'>
            <AusentismoForm
              ueb={ueb}
              fecha={fecha}
              onChangeUeb={setUeb}
              onChangeFecha={setFecha}
              onCalculate={handleCalculate}
              onDownload={handleDownload}
              loading={loading}
            />
          </AusentismoSection>

          <div className='rounded-lg border border-gray-200 shadow-sm p-4'>
            {loading ? (
              <p className="text-gray-500 text-2xl mt-4">Calculando ausentismo...</p>
            ) : error ? (
              <p className="text-red-500 text-2xl mt-4">{error}</p>
            ) : data.length > 0 ? (
              <AusentismoResult 
                data={data} 
                uebNombre={uebNombres[ueb]} 
                fecha={fecha}
              />
            ) : (
              <p className='text-gray-500 italic text-center'>
                Sin resultados de ausentismo. Configure los filtros y haga clic en "Cantidad de Trabajadores".
              </p>
            )}
          </div>
        </div>
      </ToggleSection>
    </div>
  )
}
