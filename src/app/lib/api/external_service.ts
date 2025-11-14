
 
 import { externalServiceClient } from './client'
import { Direccion } from '@/app/(features)/promedio/types'
import { ClaveAusentismo } from '@/app/(features)/ausentismo/types'
import { InterruptosDataCovid,InterruptosData100,InterruptosData60,InterruptosData, InterruptosDataReub} from '@/app/(features)/interruptos/types'

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

// external_service.ts - Agregar funciones de normalización
export const getInterruptosCovid = async (ueb: string, date: string) => {
    const url = `/recursosHumanos/interruptoCovid?ueb=${ueb}&fecha=${date}`  
    const res = await externalServiceClient.get<any[]>(url)
    
    // Normalizar datos
    const normalizedData = res.data.map(item => ({
        ...item,
        // Mapear nombres de propiedades para consistencia
        direcciones: item["UEB/Dirección"] || item.direcciones,
        total: item.Total_Trabajadores || item.total,
        masculino: item.Masculino || item.masculino,
        femenino: item.Femenino || item.femenino
    }));
    
    return normalizedData;
}

// Aplicar la misma normalización a los otros endpoints
export const getInterruptosReub = async (ueb: string, date: string) => {
    const url = `/recursosHumanos/interruptoReubicacion?ueb=${ueb}&fecha=${date}`  
    const res = await externalServiceClient.get<any[]>(url)
    
    const normalizedData = res.data.map(item => ({
        ...item,
        direcciones: item["UEB/Dirección"] || item.direcciones,
        total: item.Total_Trabajadores || item.total,
        masculino: item.Masculino || item.masculino,
        femenino: item.Femenino || item.femenino
    }));
    
    return normalizedData;
}

export const getInterruptos60 = async (ueb: string, date: string) => {
    const url = `/recursosHumanos/interrupto60?ueb=${ueb}&fecha=${date}`  
    const res = await externalServiceClient.get<any[]>(url)
    
    const normalizedData = res.data.map(item => ({
        ...item,
        direcciones: item["UEB/Dirección"] || item.direcciones,
        total: item.Total_Trabajadores || item.total,
        masculino: item.Masculino || item.masculino,
        femenino: item.Femenino || item.femenino
    }));
    
    return normalizedData;
}

export const getInterruptos100 = async (ueb: string, date: string) => {
    const url = `/recursosHumanos/interrupto?ueb=${ueb}&fecha=${date}`
    const res = await externalServiceClient.get<any[]>(url)
    
    const normalizedData = res.data.map(item => ({
        ...item,
        direcciones: item["UEB/Dirección"] || item.direcciones,
        total: item.Total_Trabajadores || item.total,
        masculino: item.Masculino || item.masculino,
        femenino: item.Femenino || item.femenino
    }));
    
    return normalizedData;
}
