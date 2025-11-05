'use client'

import { useState, useEffect } from 'react'
import PromedioSection from './components/PromedioSection'
import PromedioMensualForm from './components/PromedioMensualForm'
import PromedioDiarioForm from './components/PromedioDiarioForm'
import PromedioMensualResult from './components/PromedioMensualResult'
import PromedioDiarioResult, { PromedioDiario, PromedioDiarioResponse } from './components/PromedioDiarioResult'
import { Promedio, Totales, Direccion } from './types'

export default function PromedioPage() {
  const [uebMensual, setUebMensual] = useState('0')
  const [fechaMensual, setFechaMensual] = useState('')
  const [uebDiario, setUebDiario] = useState('0')
  const [fechaDiario, setFechaDiario] = useState('')
  const [direccionFuncional, setDireccionFuncional] = useState('0')

  const [mensualData, setMensualData] = useState<Promedio[]>([])
  const [mensualTotal, setMensualTotal] = useState<Totales | null>(null)
  const [diarioData, setDiarioData] = useState<PromedioDiario[]>([])

  const [addresses, setAddresses] = useState<Direccion[]>([])

  const apiBase = process.env.NEXT_PUBLIC_BACKEND_URL
  const apiSigerh = process.env.NEXT_PUBLIC_API_SIGERH

  const safeFetch = async <T,>(url: string, fallbackData: T): Promise<T> => {
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error('API error')
      const data = await response.json()
      return data
    } catch (err) {
      console.warn('API no disponible, usando datos de prueba:', err)
      return fallbackData
    }
  }

  useEffect(() => {
  const fetchAddresses = async () => {
    if(uebDiario != "0"){
    const url = `${apiSigerh}/recursosHumanos/direccionesUEB?ueb=${uebDiario}`

    const data = await safeFetch<Direccion[]>(url, [])
    setAddresses(data)
  }
  }

  fetchAddresses()
}, [uebDiario, apiBase])

  const handlePromedioMensual = async () => {
    const url = `${apiBase}/calcularPromedio/promedioMensual?ueb=${uebMensual}&fecha=${fechaMensual}`

    const mockMensual: Promedio[] = [
      { Unidad: 'AICA', HPromFisic: 10, HPromFMuj: 5, HPromTot: 15, HPromMuj: 8 }
    ]
    const mockTotal: Totales = {
      totalFisico: 10,
      totalFisicoMuj: 5,
      totalPromedio: 15,
      totalPromedioMujeres: 8
    }

    const data = await safeFetch<{ promedio: Promedio[]; total: Totales }>(url, {
      promedio: mockMensual,
      total: mockTotal
    })

    setMensualData(data.promedio)
    setMensualTotal(data.total)
  }

const downloadPromedioMensual = async () => {
  const url = `${apiBase}/calcularPromedio/promedioMensual/pdf?ueb=${uebMensual}&fecha=${fechaMensual}`
  getPromedioPDF(url)
}

const downloadPromedioDiario = async () => {
  const url = `${apiBase}/calcularPromedio/promedioDiarioRango/pdf?ueb=${uebDiario}&fecha=${fechaDiario}&direccion=${direccionFuncional}`
  getPromedioPDF(url)
}

const getPromedioPDF = async (url: string) => {
  try {
  const response = await fetch(url, {
    method: 'GET',
  })

  if (!response.ok) throw new Error('Error al descargar el PDF')
    
  const blob = await response.blob()
  const urlBlob = window.URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = urlBlob
  link.download = `PromedioMensual_${uebMensual}_${fechaMensual}.pdf`
  document.body.appendChild(link)
  link.click()

  link.remove()
  window.URL.revokeObjectURL(urlBlob)
} catch (err) {
  console.error('Error descargando el PDF:', err)
  alert('No se pudo descargar el PDF. Inténtelo de nuevo más tarde.')
}
}


  const handlePromedioDiario = async () => {
    const url = `${apiBase}/calcularPromedio/promedioDiarioRango?ueb=${uebDiario}&fecha=${fechaDiario}&direccion=${direccionFuncional}`

    const mockPromedioDiarioResponse: PromedioDiarioResponse = {
        direcc: "DIRECCIÓN DE INFORMÁTICA",
        fecha: "2025-11-05",
        promedio: [
          {
            Fecha: "2025-11-01",
            HPDTT: 7.5,
            HPDTM: 6.8,
          },
          {
            Fecha: "2025-11-02",
            HPDTT: 8.0,
            HPDTM: 7.2,
          },
          {
            Fecha: "2025-11-03",
            HPDTT: 7.2,
            HPDTM: 6.5,
          }
        ],
        success: true,
        ueb: "Citox",
      };


    const data = await safeFetch<PromedioDiarioResponse>(url, mockPromedioDiarioResponse)
    setMensualData([])
    setMensualTotal(null)
    setDiarioData(data.promedio)
  }

  return (
    <div className='p-4'>
          <div className='p-5 space-y-6 bg-white'>
            <div className='grid md:grid-cols-2 gap-6'>
              <PromedioSection title='Promedio Mensual'>
                <PromedioMensualForm
                  ueb={uebMensual}
                  fecha={fechaMensual}
                  onChangeUeb={setUebMensual}
                  onChangeFecha={setFechaMensual}
                  onCalculate={handlePromedioMensual}
                  onDownload={downloadPromedioMensual}
                />
              </PromedioSection>

              <PromedioSection title='Promedio Diario'>
                <PromedioDiarioForm
                  ueb={uebDiario}
                  fecha={fechaDiario}
                  direccionFuncional={direccionFuncional}
                  addresses={addresses}
                  onChangeUeb={setUebDiario}
                  onChangeDireccion={setDireccionFuncional}
                  onChangeFecha={setFechaDiario}
                  onCalculate={handlePromedioDiario}
                  onDownload={downloadPromedioDiario}
                />
              </PromedioSection>
            </div>

            <div className='rounded-lg border border-gray-200 shadow-sm p-4'>
              {mensualData.length > 0 && mensualTotal ? (
                <PromedioMensualResult promedio={mensualData} total={mensualTotal} />
              ) : diarioData.length > 0 ? (
                <PromedioDiarioResult promedio={diarioData} />
              ) : (
                <p className='text-gray-500 italic text-center'>Sin resultados aún</p>
              )}
            </div>
          </div>
    </div>
  )
}
