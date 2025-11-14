// lib/api/interruptos.ts
import { InterruptosResponse } from '@/app/(features)/interruptos/types';
import { apiClient } from './client';

export const getInterruptos = async (ueb: number, fecha: string) => {
  const url = `/ausencias/interruptos?ueb=${ueb}&fecha=${fecha}`;
  const res = await apiClient.get<InterruptosResponse>(url);
  return res.data;
};

export const downloadInterruptosPdf = async (ueb: number, fecha: string) => {
  const url = `/export/pdf/interruptos?ueb=${ueb}&fecha=${fecha}`;
  const res = await apiClient.get<Blob>(url, { responseType: 'blob' });
  return res.data;
};
