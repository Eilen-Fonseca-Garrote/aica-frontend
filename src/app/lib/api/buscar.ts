import { BuscarTrabajadorEstudiosDataResponse, BuscarTrabajadorFamilyDataResponse, BuscarTrabajadorLaborDataResponse, BuscarTrabajadorMisionesCondecResponse, BuscarTrabajadorResponse } from '@/app/(features)/buscarTrabajadores/types'
import { apiClient } from './client'


export const buscarTrabajadorPorNombre = async (ueb: string, name: string) => {
    const url = `/buscarTrabajador/trabajadoresPorNombre?nomApell=${name}&ueb=${ueb}`
    const res = await apiClient.get<BuscarTrabajadorResponse[]>(url)

    return res.data
}

export const buscarTrabajadorPorCi = async (ueb: string, ci: string) => {
    const url = `/buscarTrabajador/trabajador?ci=${ci}&ueb=${ueb}`
    const res = await apiClient.get<BuscarTrabajadorResponse[]>(url)

    return res.data
}

export const buscarInformacionFamiliarPorCi = async (ueb: string, ci: string) => {
    const url = `/buscarTrabajador/informacionFamiliar?ci=${ci}&ueb=${ueb}`
    const res = await apiClient.get<BuscarTrabajadorFamilyDataResponse[]>(url)

    return res.data
}

export const buscarInformacionEstudiosPorCi = async (ueb: string, ci: string) => {
    const url = `/buscarTrabajador/estudiosTrabajador?ci=${ci}&ueb=${ueb}`
    const res = await apiClient.get<BuscarTrabajadorEstudiosDataResponse[]>(url)

    return res.data
}

export const buscarInformacionLaborPorCi = async (ueb: string, ci: string) => {
    const url = `/buscarTrabajador/laboralTrabajador?ci=${ci}&ueb=${ueb}`
    const res = await apiClient.get<BuscarTrabajadorLaborDataResponse[]>(url)

    return res.data
}

export const buscarMisionesCondecoracionesPorCi = async (ueb: string, ci: string) => {
    const url = `/buscarTrabajador/condecMisionesTrabajador?ci=${ci}&ueb=${ueb}&type=M`
    const res = await apiClient.get<BuscarTrabajadorMisionesCondecResponse[]>(url)
    return res.data
}
