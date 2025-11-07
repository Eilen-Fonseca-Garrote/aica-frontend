'use client'

import { useState, useEffect } from 'react'
import PromedioSection from './components/PromedioSection'
import PromedioMensualForm from './components/PromedioMensualForm'
import PromedioDiarioForm from './components/PromedioDiarioForm'
import PromedioMensualResult from './components/PromedioMensualResult'
import PromedioDiarioResult from './components/listaPromedioDiario'
import { PromedioDiario } from './types'
import { PromedioMensual, TotalMensual, Direccion } from './types'
import { getPromedioDiario, getPromedioMensual, downloadPromedioDiarioPdf, downloadPromedioMensualPdf } from '@/app/lib/api/promedio'
import { getDireccionesPorUeb } from '@/app/lib/api/external_service'
import { downloadFile } from '@/app/lib/helpers'
import ToggleSection from '../uiLibrary/ToggleSection'


export default function PromedioPage() {
  const [uebMensual, setUebMensual] = useState('0')
  const [fechaMensual, setFechaMensual] = useState('')
  const [uebDiario, setUebDiario] = useState('0')
  const [fechaDiario, setFechaDiario] = useState('')
  const [direccionFuncional, setDireccionFuncional] = useState('0')

  const [mensualData, setMensualData] = useState<PromedioMensual[]>([])
  const [mensualTotal, setMensualTotal] = useState<TotalMensual[]>([])
  const [diarioData, setDiarioData] = useState<PromedioDiario[]>([])

  const [addresses, setAddresses] = useState<Direccion[]>([])

  useEffect(() => {
  const fetchAddresses = async () => {
    if(uebDiario != "0"){
    const data = await getDireccionesPorUeb(uebDiario)
    setAddresses(data)
  }
  }

  fetchAddresses()
}, [uebDiario])

  const handlePromedioMensual = async () => {
    const data = await getPromedioMensual(uebMensual, fechaMensual)
    setMensualData(data.promedio)
    setMensualTotal(data.total)
  }

  const downloadPromedioMensual = async () => {
    const file = await downloadPromedioMensualPdf(uebMensual, fechaMensual)
    downloadFile(file, `Promedio_Mensual_${uebMensual}_${fechaMensual}.pdf`)
  }

  const handlePromedioDiario = async () => {
    const data = await getPromedioDiario(uebDiario, fechaDiario, direccionFuncional)
    setMensualData([])
    setMensualTotal([])
    setDiarioData(data.promedio)
  }

  const downloadPromedioDiario = async () => {
    const file = await downloadPromedioDiarioPdf(uebDiario, fechaDiario, direccionFuncional)
    downloadFile(file, `Promedio_Rango_Diario_${uebDiario}_${fechaDiario}.pdf`)
  }

  return (
    <div className='p-4'>
      <ToggleSection
      title="Promedio Trabajadores"
      color="green"
      defaultExpanded={true}
      >
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
                <PromedioMensualResult promedio={mensualData} total={mensualTotal[0]} />
              ) : diarioData.length > 0 ? (
                <PromedioDiarioResult promedio={diarioData} />
              ) : (
                <p className='text-gray-500 italic text-center'>Sin resultados aún</p>
              )}
            </div>
          </div>
      </ToggleSection>
    </div>
  )
}
