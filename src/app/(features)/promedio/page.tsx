'use client'

import { useRef, useState } from 'react'
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
import ToggleSection from '@/components/ui/ToggleSection'


const PromedioPage = () => {
  const [uebMensual, setUebMensual] = useState('0')
  const [fechaMensual, setFechaMensual] = useState('')
  const [uebDiario, setUebDiario] = useState('0')
  const [fechaDiario, setFechaDiario] = useState('')
  const [direccionFuncional, setDireccionFuncional] = useState('0')

  const [mensualData, setMensualData] = useState<PromedioMensual[]>([])
  const [mensualTotal, setMensualTotal] = useState<TotalMensual[]>([])
  const [diarioData, setDiarioData] = useState<PromedioDiario[]>([])

  const [addresses, setAddresses] = useState<Direccion[]>([])
  const addressRequestIdRef = useRef(0)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUebDiarioChange = (nextUeb: string) => {
    const requestId = addressRequestIdRef.current + 1
    addressRequestIdRef.current = requestId

    setUebDiario(nextUeb)
    setDireccionFuncional('0')
    setAddresses([])

    if (nextUeb === '0') {
      return
    }

    void getDireccionesPorUeb(nextUeb)
      .then((data) => {
        if (requestId !== addressRequestIdRef.current) {
          return
        }
        setAddresses(data)
      })
      .catch((err) => {
        if (requestId !== addressRequestIdRef.current) {
          return
        }
        console.error(err)
        setAddresses([])
      })
  }

    const handlePromedioMensual = async () => {
      setLoading(true)
      setError(null)
      setMensualData([])
      setDiarioData([])

      try {
        const data = await getPromedioMensual(uebMensual, fechaMensual)
        setMensualData(data.promedio)
        setMensualTotal(data.total)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError('Ocurrió un error inesperado durante la búsqueda.')
      } finally {
        setLoading(false)
      }
  }

  const downloadPromedioMensual = async () => {
      setError(null)

      try {
        const file = await downloadPromedioMensualPdf(uebMensual, fechaMensual)
        downloadFile(file, `Promedio_Mensual_${uebMensual}_${fechaMensual}.pdf`)
      } catch (err) {
        console.error(err)
        setError('Ocurrió un error inesperado durante la búsqueda.')
      } finally {
        setLoading(false)
      }
  }

  const handlePromedioDiario = async () => {
    setLoading(true)
    setError(null)
    setMensualData([])
    setDiarioData([])

    try {
      const data = await getPromedioDiario(uebDiario, fechaDiario, direccionFuncional)
      setDiarioData(data.promedio)
    } catch (err) {
      console.error(err)
      setError('Ocurrió un error inesperado durante la búsqueda.')
    } finally {
      setLoading(false)
    }
  }

  const downloadPromedioDiario = async () => {
      setError(null)

      try {
        const file = await downloadPromedioDiarioPdf(uebDiario, fechaDiario, direccionFuncional)
        downloadFile(file, `Promedio_Rango_Diario_${uebDiario}_${fechaDiario}.pdf`)
      } catch (err) {
        console.error(err)
        setError('Ocurrió un error inesperado durante la búsqueda.')
      } finally {
        setLoading(false)
      }
  }

  return (
    <div className='p-4'>
      <ToggleSection
      title="Promedio Trabajadores"
      color="blue"
      variant="minimal"
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
                  onChangeUeb={handleUebDiarioChange}
                  onChangeDireccion={setDireccionFuncional}
                  onChangeFecha={setFechaDiario}
                  onCalculate={handlePromedioDiario}
                  onDownload={downloadPromedioDiario}
                />
              </PromedioSection>
            </div>


            <div className='rounded-lg border border-gray-200 shadow-sm p-4'>
              {loading ? (
                <p className="text-gray-500 text-2xl mt-4">Calculando promedio...</p>
              ) : !loading && error ? (
                <p className="text-[#0a8ca8] text-2xl mt-4">Ha ocurrido un error calculando el promedio. Por favor contacte a un administrador</p>
              ) : mensualData.length > 0 && mensualTotal ? (
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

export default PromedioPage
