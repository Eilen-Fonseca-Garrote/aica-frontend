import { apiClient } from "./client"


export const downloadModelo14BXls = async () => {
    const url = `/export/excel/model14b`
    const res = await apiClient.get<Blob>(url, { responseType: 'blob' })

    return res.data
}

export const downloadModeloRL4Xls = async (noLabDays: string, fechaAusentismo: string) => {
    const params = new URLSearchParams();
    params.append("noLabDays", noLabDays);
    params.append("fechaAusentismo", fechaAusentismo);
    
    const url = `/export/excel/ausentismo?${params.toString()}`
    const res = await apiClient.get<Blob>(url, {responseType: 'blob'})
    return res.data;
}

// funcion para exportar excel de listar Trabajadores
export const downloadAllWorkersXls = async (fecha?: string) => {
  const params = new URLSearchParams()
  if (fecha) params.append("fecha", fecha)
  
  const url = `/export/excel/all-workers?${params.toString()}`
  const res = await apiClient.get<Blob>(url, {responseType: 'blob'})
  return res.data
}