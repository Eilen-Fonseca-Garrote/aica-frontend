
import { apiClient } from './client'
import { AusentismoResponse } from '@/app/(features)/ausentismo/types'

export const downloadAusenciasPdf = async (ueb: string, fecha: string) => {
    const url = `/export/pdf/clavesAusentismo?ueb=${ueb}&fecha=${fecha}`
    const res = await apiClient.get<Blob>(url, { responseType: 'blob' })
    return res.data
}

export const getAusencias = async (ueb: string, fecha: string, direccion: string) => {
    const url = `/ausencias/clavesAusentismo?ueb=${ueb}&fecha=${fecha}&direccion=${direccion}`
    const res = await apiClient.get<AusentismoResponse>(url)
    return res.data
}

/*export const getUebsMap = async () => {
  const url = `/ausencias/uebs`;
  const res = await apiClient.get(url);
  
  return res.data as {
    [uebCode: string]: string;
  };
} 
*/

 /* export const getUebs = async (): Promise<Ueb[]> => {
  return Object.entries(await getUebsMap()).map(([code, name]) => ({
    code,
    name,
  }));
};   */

