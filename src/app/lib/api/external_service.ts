import { externalServiceClient } from './client'
import { Direccion } from '@/app/(features)/promedio/types'

export const getDireccionesPorUeb = async (ueb: string) => { 
    const url = `/recursosHumanos/direccionesUEB?ueb=${ueb}`
    const res = await externalServiceClient.get<Direccion[]>(url)

    return res.data
}