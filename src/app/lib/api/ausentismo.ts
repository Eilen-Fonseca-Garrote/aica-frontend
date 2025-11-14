
import { apiClient } from './client'
import { AusentismoResponse } from '@/app/(features)/ausentismo/types'

export const downloadAusenciasPdf = async (ueb: string, fecha: string, clave: string) => {
    const url = `/export/pdf/clavesAusentismo?ueb=${ueb}&fecha=${fecha}&clave=${clave}`
    const res = await apiClient.get<Blob>(url, { responseType: 'blob' })
    return res.data
}

export const getAusencias = async (ueb: string, fecha: string, clave: string) => {
    const url = `/ausencias/claves?ueb=${ueb}&fecha=${fecha}&clave=${clave}`
    const res = await apiClient.get<AusentismoResponse>(url)
    return res.data
}

