'use client'

import { useState, useEffect } from 'react'
import AusentismoSection from '@/app/(features)/ausentismo/AusentismoSection'
import AusentismoForm from '@/app/(features)/ausentismo/ausentismoForm'
import AusentismoResult from '@/app/(features)/ausentismo/ausentismoResult'
import { ClaveAusentismo, AusentismoItem } from './types'
import { getAusencias, downloadAusenciasPdf } from '@/app/lib/api/ausentismo'
import { downloadFile } from '@/app/lib/helpers'
import ToggleSection from '../uiLibrary/ToggleSection'
import { getClavesAusentismo } from '@/app/lib/api/external_service'

export default function AusentismoPage() {
  const [ueb, setUeb] = useState('16')
  const [fecha, setFecha] = useState('')
  const [data, setData] = useState<AusentismoItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [claves, setClaves] = useState<ClaveAusentismo[]>([])
  const [clavesSeleccionadas, setClavesSeleccionadas] = useState('')

  const uebNombres: { [key: string]: string } = {
    '16': 'AICA',
    '25': 'LIORAD', 
    '55': 'JULIO TRIGO',
    '100': 'CITOX',
    '57': 'SH+'
  }

  // Cargar claves de ausentismo cuando cambie la UEB
  useEffect(() => {
    const loadClaves = async () => {
      try {
      //  console.log("Cargando claves para UEB:", ueb)
        const clavesData = await getClavesAusentismo(ueb)
        setClaves(clavesData)
      //  console.log("Claves cargadas:", clavesData)
      } catch (err) {
       // console.error("Error al cargar claves de ausentismo:", err)
        setClaves([])
      }
    }
    
    if (ueb && ueb !== "0") {
      loadClaves()
    }
  }, [ueb])

  
const handleCalculate = async (clavesParam: string) => {
  setLoading(true)
  setError(null)
  try {
    console.log("=== DEBUG AUSENTISMO ===")
    console.log("UEB:", ueb)
    console.log("Fecha:", fecha)
    console.log("Claves recibidas del formulario:", clavesParam)
    
    const response = await getAusencias(ueb, fecha, clavesParam)
    
    console.log("Respuesta completa del backend:", response)
    console.log("Tipo de respuesta:", typeof response)
    console.log("Es array?", Array.isArray(response))
    
    // CORRECIÓN: La respuesta ya viene en el formato correcto AusentismoItem[]
    // Solo necesitamos verificar que sea un array
    const formattedData: AusentismoItem[] = Array.isArray(response) 
      ? response 
      : [];
    
    setData(formattedData)
    
    console.log("Datos para mostrar:", formattedData)
    console.log("Total de items recibidos:", formattedData.length)
    
  } catch (err: unknown) {
    console.error("Error detallado:", err)
    
    // Manejo type-safe del error - CORREGIDO: eliminar 'any'
    if (err && typeof err === 'object' && 'response' in err) {
      const errorWithResponse = err as { 
        response?: { 
          status: number; 
          data?: { message?: string } | unknown 
        } 
      }
      
      if (errorWithResponse.response?.status === 404) {
        setError('El servicio de ausentismo no está disponible. Contacte al administrador.')
      } else if (errorWithResponse.response?.status === 400) {
        setError('Parámetros inválidos. Verifique la fecha y UEB.')
      } else {
        // Manejo seguro del mensaje de error
        let errorMessage = 'Ocurrió un error inesperado durante la búsqueda.'
        
        if (errorWithResponse.response?.data && 
            typeof errorWithResponse.response.data === 'object' &&
            errorWithResponse.response.data !== null &&
            'message' in errorWithResponse.response.data) {
          
          const message = (errorWithResponse.response.data as { message?: string }).message
          if (typeof message === 'string') {
            errorMessage = message
          }
        }
        
        setError(errorMessage)
      }
    } else if (err instanceof Error) {
      setError(err.message)
    } else {
      setError('Ocurrió un error inesperado durante la búsqueda.')
    }
    setData([])
  } finally {
    setLoading(false)
  }
}



const handleDownload = async (e: React.MouseEvent<HTMLAnchorElement>, clavesParam: string) => {
  e.preventDefault()
  if (loading) return
  
  setLoading(true)
  setError(null)
  try {
    console.log("Descargando PDF de ausentismo para UEB:", ueb, "Mes/Año:", fecha, "Claves:", clavesParam)
    
    const file = await downloadAusenciasPdf(ueb, fecha, clavesParam)
    downloadFile(file, `ausentismo-${uebNombres[ueb]}-${fecha}.pdf`)
    
    console.log("PDF de ausentismo descargado exitosamente")
  } catch (err: unknown) {
    console.error("Error al descargar PDF de ausentismo:", err)
    
    // Manejo type-safe del error
    if (err && typeof err === 'object' && 'response' in err) {
      const errorWithResponse = err as { response?: { status: number } }
      if (errorWithResponse.response?.status === 404) {
        setError('El servicio de descarga PDF no está disponible. Contacte al administrador.')
      } else {
        setError('Ocurrió un error inesperado durante la descarga.')
      }
    } else {
      setError('Ocurrió un error inesperado durante la descarga.')
    }
  } finally {
    setLoading(false)
  }
}
  
    

  return (
    <div className='p-4'>
      <ToggleSection
        title="Cantidad Trabajadores por Clave de Ausentismo"
        color="blue"
        variant="minimal"
        defaultExpanded={true}
      >
        <div className='p-5 space-y-6 bg-white'>
          <AusentismoSection title='Configuración de Búsqueda'>
            <AusentismoForm
              ueb={ueb}
              fecha={fecha}
              claves={claves}
              clavesDireccion={[]}
              onChangeUeb={setUeb}
              onChangeFecha={setFecha}
              onChangeClaves={setClavesSeleccionadas}
              onCalculate={handleCalculate}
              onDownload={handleDownload}
              loading={loading}
            />
          </AusentismoSection>

          <div className='rounded-lg border border-gray-200 shadow-sm p-4'>
            {loading ? (
              <p className="text-gray-500 text-2xl mt-4">Calculando ausentismo...</p>
            ) : error ? (
              <div className="text-[#0a8ca8] text-center">
                <p className="text-xl font-semibold mb-2">Error</p>
                <p>{error}</p>
              </div>
            ) : data.length > 0 ? (
              <AusentismoResult 
                data={data} 
                uebNombre={uebNombres[ueb]} 
                fecha={fecha}
              />
            ) : (
              <p className='text-gray-500 italic text-center'>
                Sin resultados de ausentismo. Configure los filtros y haga clic en &quot;Cantidad de Trabajadores&quot;.
              </p>
            )}
          </div>
        </div>
      </ToggleSection>
    </div>
  )
}
