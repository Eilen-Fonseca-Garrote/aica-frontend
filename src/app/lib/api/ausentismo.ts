import { apiClient } from './client'
import { AusentismoResponse, AusentismoRequest } from '@/app/(features)/ausentismo/types'

export const getAusencias = async (ueb: string, fecha: string, claves: string) => {
    // Convertir fecha de YYYY-MM a MM-YYYY
    const [year, month] = fecha.split('-');
    const date = `${month}-${year}`;
    
    // Convertir string de claves a array
    const codigos = claves ? claves.split(',') : [];
    
    const requestBody: AusentismoRequest = {
        codigos,
        date,
        ueb
    };
    
    const url = `/ausencias/claves`;
    const res = await apiClient.post<AusentismoResponse>(url, requestBody);
    return res.data;
}

// Para el PDF, mantenemos el formato actual si el endpoint existe
export const downloadAusenciasPdf = async (ueb: string, fecha: string, claves: string) => {
    // Convertir fecha de YYYY-MM a MM-YYYY
    const [year, month] = fecha.split('-');
    const date = `${month}-${year}`;
    
    const url = `/export/pdf/clavesAusentismo?ueb=${ueb}&fecha=${date}&clave=${claves}`;
    const res = await apiClient.get<Blob>(url, { responseType: 'blob' });
    return res.data;
}