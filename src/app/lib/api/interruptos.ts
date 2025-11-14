// lib/api/interruptos.ts

import { 
  getInterruptosCovid, 
  getInterruptosReub, 
  getInterruptos60, 
  getInterruptos100
} from './external_service';
import { InterruptosResponse } from '@/app/(features)/interruptos/types';
import { apiClient } from './client';

// Tipo para datos normalizados
interface NormalizedInterruptosData {
  direcciones: string;
  total: number;
  masculino: number;
  femenino: number;
}

export const getInterruptos = async (ueb: string, fecha: string): Promise<InterruptosResponse> => {
  try {
    const [covidData, reubData, prod60Data, prod100Data] = await Promise.all([
      getInterruptosCovid(ueb, fecha),
      getInterruptosReub(ueb, fecha),
      getInterruptos60(ueb, fecha),
      getInterruptos100(ueb, fecha)
    ]);

    // Usar las direcciones del primer dataset (son las mismas para todos)
    const direcciones = [...new Set(covidData.map(item => item.direcciones))].sort();

    const interruptos = direcciones.map(direccion => {
      const encontrarValor = (data: NormalizedInterruptosData[]) => {
        const item = data.find(d => d.direcciones === direccion);
        return item ? item.total : 0;
      };

      return {
        Direccion: direccion,
        covid: encontrarValor(covidData),
        reubicados: encontrarValor(reubData),
        produccion25: encontrarValor(prod100Data), // produccion100 = produccion25
        produccion48: encontrarValor(prod60Data)   // produccion60 = produccion48
      };
    });

    // Calcular totales correctamente
    const calcularTotal = (data: NormalizedInterruptosData[]) => ({
      Total: data.reduce((sum, item) => sum + item.total, 0),
      F: data.reduce((sum, item) => sum + item.femenino, 0),
      M: data.reduce((sum, item) => sum + item.masculino, 0)
    });

    return {
      interruptos,
      totalCovid: calcularTotal(covidData),
      totalReub: calcularTotal(reubData),
      totalProd25: calcularTotal(prod100Data),
      totalProd48: calcularTotal(prod60Data)
    };
  } catch (error) {
    console.error('Error getting interruptos data:', error);
    throw error;
  }
};

export const downloadInterruptosPdf = async (ueb: string, fecha: string) => {
  const url = `/export/pdf/interruptos?ueb=${ueb}&fecha=${fecha}`;
  const res = await apiClient.get<Blob>(url, { responseType: 'blob' });
  return res.data;
};



/*
export const getInterruptos = async (ueb: string, fecha: string) => {
  const url = `/ausencias/interruptos?ueb=${ueb}&fecha=${fecha}`;
  const res = await apiClient.get<InterruptosResponse>(url);
  return res.data;
};

export const downloadInterruptosPdf = async (ueb: string, fecha: string) => {
  const url = `/export/pdf/interruptos?ueb=${ueb}&fecha=${fecha}`;
  const res = await apiClient.get<Blob>(url, { responseType: 'blob' });
  return res.data;
}; */