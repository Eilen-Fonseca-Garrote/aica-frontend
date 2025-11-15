// lib/api/interruptos.ts
import { InterruptosResponse } from '@/app/(features)/interruptos/types';
import { apiClient } from './client';

export const getInterruptos = async (ueb: number, fecha: string) => {
  // Convertir fecha de YYYY-MM a MM-YYYY para el backend
  const [year, month] = fecha.split('-');
  const formattedFecha = `${month}-${year}`;
  
  const url = `/ausencias/interruptos?ueb=${ueb}&fecha=${formattedFecha}`;
  const res = await apiClient.get<InterruptosResponse>(url);
  return res.data;
};


export const downloadInterruptosPdf = async (ueb: string, fecha: string) => {
  // Convertir fecha de YYYY-MM a MM-YYYY
  const [year, month] = fecha.split('-');
  const date = `${month}-${year}`;
  const url = `/export/pdf/interruptos?ueb=${ueb}&fecha=${date}`;
  const res = await apiClient.get<Blob>(url, { responseType: 'blob' });
  return res.data;
};
