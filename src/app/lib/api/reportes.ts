import { apiClient } from "./client"


export const downloadModelo14BXls = async () => {
    const url = `/export/excel/model14b`
    const res = await apiClient.get<Blob>(url, { responseType: 'blob' })

    return res.data
}

export const downloadModeloRL4Xls = async (noLabDays: string, fechaAusentismo: string) => {
    const params = new URLSearchParams();
    params.append("noLabDays", noLabDays);
    params.append("fechaAusentismo", fechaAusentismo.split("-").reverse().join('-'));
    
    const url = `/export/excel/ausentismo?${params.toString()}`
    const res = await apiClient.get<Blob>(url, {responseType: 'blob'})
    return res.data;
}

export const downloadAllWorkersXls = async () => {
  const url = `/export/excel/all-workers`
  const res = await apiClient.get<Blob>(url, {responseType: 'blob'})
  
  return res.data
}

export const downloadAllWorkersPdf = async () => {
  const url = `/export/pdf/all-workers`
  const res = await apiClient.get<Blob>(url, { responseType: 'blob' })
  return res.data
}

export const downloadTrabajadoresFisicosXls = async (fecha: string) => {
  const params = new URLSearchParams({ fecha });
  const url = `/export/excel/trabajadores-fisicos?${params.toString()}`;
  const res = await apiClient.get<Blob>(url, { responseType: 'blob' });
  return res.data;
};

export const downloadTrabajadoresFisicosPdf = async (fecha: string) => {
  const params = new URLSearchParams({ fecha });
  const url = `/export/pdf/trabajadores-fisicos?${params.toString()}`;
  const res = await apiClient.get<Blob>(url, { responseType: 'blob' });
  return res.data;
};
