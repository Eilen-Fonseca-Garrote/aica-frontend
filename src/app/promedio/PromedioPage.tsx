'use client'

import { useState, useEffect } from 'react'
import PromedioSection from './PromedioSection'
import PromedioMensualForm from './PromedioMensualForm'
import PromedioDiarioForm from './PromedioDiarioForm'
import PromedioMensualResult from './PromedioMensualResult'
import PromedioDiarioResult, { PromedioDiario, PromedioDiarioResponse } from './PromedioDiarioResult'
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

  const imprimirPromedioMensual = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    console.log('Descargar Promedio Mensual PDF')
  }

  const imprimirPromedioDiario = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    console.log('Descargar Promedio Diario PDF')
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
                  onDownload={imprimirPromedioMensual}
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
                  onDownload={imprimirPromedioDiario}
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
