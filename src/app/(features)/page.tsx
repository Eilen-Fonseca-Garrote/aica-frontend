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

  return (
    toSafeNumber(totals.Covid?.Total) +
    toSafeNumber(totals.Reubic?.Total) +
    toSafeNumber(totals.Prod25?.Total) +
    toSafeNumber(totals.Prod48?.Total)
  )
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

export default function Page() {
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

  const boxes = [
    {
      value: stats ? formatNumber(stats.promedioTrabajadores) : "",
      label: "Promedio Trabajadores",
      bgColor: "bg-[#0a8ca8]",
      icon: <IoAdd className="text-4xl" />,
    },
    {
      value: stats ? formatNumber(stats.fisicos) : "",
      label: "Físicos",
      bgColor: "bg-[#0a8ca8]",
      icon: <IoStatsChart className="text-4xl" />,
    },
    {
      value: stats ? formatNumber(stats.fisicosMujeres) : "",
      label: "Físicos Mujeres",
      bgColor: "bg-[#0a8ca8]",
      icon: <IoPersonAdd className="text-4xl" />,
    },
    {
      value: stats ? formatNumber(stats.interruptos) : "",
      label: "Interruptos",
      bgColor: "bg-[#0a8ca8]",
      icon: <IoRemove className="text-4xl" />,
    },
  ]

  return (
    <>
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
      <BuscarTrabajador />
    </>
  )
}
