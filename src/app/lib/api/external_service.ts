import { externalServiceClient } from './client'
import { Direccion } from '@/app/(features)/promedio/types'
import { ClaveAusentismo } from '@/app/(features)/ausentismo/types'

// Definir interfaces para los datos brutos del backend
interface RawInterruptosData {
  "UEB/Dirección"?: string;
  direcciones?: string;
  Total_Trabajadores?: number;
  total?: number;
  Masculino?: number;
  masculino?: number;
  Femenino?: number;
  femenino?: number;
}

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

// Función de normalización reutilizable
const normalizeInterruptosData = (data: RawInterruptosData[]) => {
    return data.map(item => ({
        ...item,
        direcciones: item["UEB/Dirección"] || item.direcciones || '',
        total: item.Total_Trabajadores || item.total || 0,
        masculino: item.Masculino || item.masculino || 0,
        femenino: item.Femenino || item.femenino || 0
    }));
};

export const getInterruptosCovid = async (ueb: string, date: string) => {
    const url = `/recursosHumanos/interruptoCovid?ueb=${ueb}&fecha=${date}`  
    const res = await externalServiceClient.get<RawInterruptosData[]>(url)
    
    const normalizedData = normalizeInterruptosData(res.data);
    return normalizedData;
}

export const getInterruptosReub = async (ueb: string, date: string) => {
    const url = `/recursosHumanos/interruptoReubicacion?ueb=${ueb}&fecha=${date}`  
    const res = await externalServiceClient.get<RawInterruptosData[]>(url)
    
    const normalizedData = normalizeInterruptosData(res.data);
    return normalizedData;
}

export const getInterruptos60 = async (ueb: string, date: string) => {
    const url = `/recursosHumanos/interrupto60?ueb=${ueb}&fecha=${date}`  
    const res = await externalServiceClient.get<RawInterruptosData[]>(url)
    
    const normalizedData = normalizeInterruptosData(res.data);
    return normalizedData;
}

export const getInterruptos100 = async (ueb: string, date: string) => {
    const url = `/recursosHumanos/interrupto?ueb=${ueb}&fecha=${date}`
    const res = await externalServiceClient.get<RawInterruptosData[]>(url)
    
    const normalizedData = normalizeInterruptosData(res.data);
    return normalizedData;
}