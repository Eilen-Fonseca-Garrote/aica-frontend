
import { apiClient } from './client'
import { InterruptosResponse } from '@/app/(features)/interruptos/types'

export const getInterruptos = async (ueb: string, date: string) => {
    const url = `/ausencias/interruptos?ueb=${ueb}&fecha=${date}`
    const res = await apiClient.get<InterruptosResponse>(url)
    return res.data
}

export const downloadInterruptosPdf = async (ueb: string, date: string) => {
    const url = `/export/pdf/interruptos?ueb=${ueb}&fecha=${date}`
    const res = await apiClient.get<Blob>(url, { responseType: 'blob' })
    return res.data
}