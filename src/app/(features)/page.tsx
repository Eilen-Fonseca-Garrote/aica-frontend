"use client"

import { useEffect, useMemo, useState } from "react"
import BuscarTrabajador from "./buscarTrabajadores/BuscarTrabajador"
import { IoAdd, IoStatsChart, IoPersonAdd, IoRemove } from "react-icons/io5"
import { getInterruptos } from "@/app/lib/api/interruptos"
import { getPromedioMensual } from "@/app/lib/api/promedio"
import type { InterruptosResponse } from "./interruptos/types"
import type { TotalMensual } from "./promedio/types"

const HOME_UEBS = ["16", "25", "100", "55", "57"] as const

type HomeStats = {
  promedioTrabajadores: number
  fisicos: number
  fisicosMujeres: number
  interruptos: number
}

const homeStatsRequestsByMonth = new Map<string, Promise<HomeStats | null>>()

const emptyPromedioTotals: TotalMensual = {
  totalFisico: 0,
  totalFisicoMuj: 0,
  totalPromedio: 0,
  totalPromedioMujeres: 0,
}

const formatNumber = (value: number) => new Intl.NumberFormat("es-ES").format(value)

function hasCompleteHomeStats(stats: HomeStats | null): stats is HomeStats {
  if (!stats) return false

  return [
    stats.promedioTrabajadores,
    stats.fisicos,
    stats.fisicosMujeres,
    stats.interruptos,
  ].every(Number.isFinite)
}

function getPreviousMonthDate() {
  const today = new Date()
  const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
  const year = previousMonth.getFullYear()
  const month = String(previousMonth.getMonth() + 1).padStart(2, "0")

  return `${year}-${month}`
}

function toSafeNumber(value: unknown) {
  const numericValue = Number(value)
  return Number.isFinite(numericValue) ? numericValue : 0
}

function sumPromedioTotals(totals: TotalMensual[]) {
  return totals.reduce<TotalMensual>(
    (acc, total) => ({
      totalFisico: acc.totalFisico + toSafeNumber(total.totalFisico),
      totalFisicoMuj: acc.totalFisicoMuj + toSafeNumber(total.totalFisicoMuj),
      totalPromedio: acc.totalPromedio + toSafeNumber(total.totalPromedio),
      totalPromedioMujeres:
        acc.totalPromedioMujeres + toSafeNumber(total.totalPromedioMujeres),
    }),
    emptyPromedioTotals
  )
}

async function getHomePromedioTotals(referenceMonth: string) {
  const responses = await Promise.all(
    HOME_UEBS.map((ueb) => getPromedioMensual(ueb, referenceMonth))
  )

  return sumPromedioTotals(responses.map((response) => response.total?.[0] ?? emptyPromedioTotals))
}

function getHomeInterruptosTotal(response: InterruptosResponse) {
  const totals = response.totalesInt ?? {
    Covid: response.totalCovid,
    Reubic: response.totalReub,
    Prod25: response.totalProd25,
    Prod48: response.totalProd48,
  }

  const baseTotal =
    toSafeNumber(totals.Covid?.Total) +
    toSafeNumber(totals.Reubic?.Total) +
    toSafeNumber(totals.Prod25?.Total) +
    toSafeNumber(totals.Prod48?.Total)

  // Legacy compatibility:
  // In the old Laravel home (`todosInterruptos`), SH+ Prod25 reused the previous
  // UEB (CITOX) Prod25 total due to a missing reassignment.
  // To match historical dashboard values, we reproduce that behavior here.
  const citoxProd25 = toSafeNumber(response.totales?.CITOX?.Prod25?.Total)
  const shProd25 = toSafeNumber(response.totales?.SH?.Prod25?.Total)
  const hasCitoxAndSh = citoxProd25 > 0 && shProd25 > 0

  if (hasCitoxAndSh) {
    return baseTotal - shProd25 + citoxProd25
  }

  return baseTotal
}

async function calculateHomeStats(referenceMonth: string): Promise<HomeStats> {
  const [promedioTotals, interruptosResponse] = await Promise.all([
    getHomePromedioTotals(referenceMonth),
    getInterruptos(0, referenceMonth),
  ])

  return {
    promedioTrabajadores: promedioTotals.totalPromedio,
    fisicos: promedioTotals.totalFisico,
    fisicosMujeres: promedioTotals.totalFisicoMuj,
    interruptos: getHomeInterruptosTotal(interruptosResponse),
  }
}

function loadHomeStatsOnce(referenceMonth: string) {
  const cachedRequest = homeStatsRequestsByMonth.get(referenceMonth)
  if (cachedRequest) return cachedRequest

  const request = calculateHomeStats(referenceMonth).catch((err) => {
    console.error("Error calculando los indicadores de inicio:", err)
    return null
  })

  homeStatsRequestsByMonth.set(referenceMonth, request)
  return request
}

const Page = () => {
  const referenceMonth = useMemo(() => getPreviousMonthDate(), [])
  const [stats, setStats] = useState<HomeStats | null>(null)

  useEffect(() => {
    let isMounted = true

    void loadHomeStatsOnce(referenceMonth).then((homeStats) => {
      if (!isMounted) return
      setStats(homeStats)
    })

    return () => {
      isMounted = false
    }
  }, [referenceMonth])

  const hasCompleteStats = hasCompleteHomeStats(stats)

  const boxes = hasCompleteStats ? [
    {
      value: formatNumber(stats.promedioTrabajadores),
      label: "Promedio Trabajadores",
      bgColor: "bg-[var(--app-primary-color)]",
      icon: <IoAdd className="text-4xl" />,
    },
    {
      value: formatNumber(stats.fisicos),
      label: "Físicos",
      bgColor: "bg-[var(--app-primary-color)]",
      icon: <IoStatsChart className="text-4xl" />,
    },
    {
      value: formatNumber(stats.fisicosMujeres),
      label: "Físicos Mujeres",
      bgColor: "bg-[var(--app-primary-color)]",
      icon: <IoPersonAdd className="text-4xl" />,
    },
    {
      value: formatNumber(stats.interruptos),
      label: "Interruptos",
      bgColor: "bg-[var(--app-primary-color)]",
      icon: <IoRemove className="text-4xl" />,
    },
  ] : []

  return (
    <>
      {boxes.length > 0 ? (
        <div className="flex flex-wrap -mx-2 p-4">
          {boxes.map((box, index) => (
            <div key={index} className="w-1/2 lg:w-1/4 px-2 mb-4">
              <div className={`rounded-lg shadow p-4 text-white ${box.bgColor} flex justify-between items-center`}>
                <div>
                  <h3 className="text-4xl font-bold">{box.value}</h3>
                  <p>{box.label}</p>
                </div>
                <div className="text-4xl">{box.icon}</div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
      <BuscarTrabajador />
    </>
  )
}

export default Page
