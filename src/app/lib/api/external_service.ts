
 import { externalServiceClient } from './client'
import { Direccion } from '@/app/(features)/promedio/types'
import { ClaveAusentismo } from '@/app/(features)/ausentismo/types'

export const getDireccionesPorUeb = async (ueb: string) => { 
    const url = `/recursosHumanos/direccionesUEB?ueb=${ueb}`
    const res = await externalServiceClient.get<Direccion[]>(url)

    return res.data
}

export const getClavesAusentismo = async (ueb: string)=> {
    const url = `/recursosHumanos/clavesAusencias?ueb=${ueb}`
    const res = await externalServiceClient.get<ClaveAusentismo[]>(url)
    return res.data
}
