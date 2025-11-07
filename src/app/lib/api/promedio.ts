import { PromedioDiarioResponse } from '@/app/(features)/promedio/types'
import { apiClient } from './client'
import { PromedioMensualResponse } from '@/app/(features)/promedio/types'

export const getPromedioMensual = async (ueb: string, monthDate: string) => {
    const url = `/calcularPromedio/promedioMensual?ueb=${ueb}&fecha=${monthDate}`
    const res = await apiClient.get<PromedioMensualResponse>(url)

    return res.data
}

export const getPromedioDiario = async (ueb: string, date: string, address: string) => {
    const url = `/calcularPromedio/promedioDiarioRango?ueb=${ueb}&fecha=${date}&direccion=${address}`
    const res = await apiClient.get<PromedioDiarioResponse>(url)

    return res.data
}

export const downloadPromedioDiarioPdf = async (ueb: string, date: string, address: string) => {
    const url = `/calcularPromedio/promedioDiarioRango/pdf?ueb=${ueb}&fecha=${date}&direccion=${address}`
    const res = await apiClient.get<Blob>(url, { responseType: 'blob' })

    return res.data
}

export const downloadPromedioMensualPdf = async (ueb: string, monthDate: string) => {
    const url = `/calcularPromedio/promedioMensual/pdf?ueb=${ueb}&fecha=${monthDate}`
    const res = await apiClient.get<Blob>(url, { responseType: 'blob' })

    return res.data
}