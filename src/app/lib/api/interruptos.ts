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

// lib/api/interruptos.ts
export const getInterruptos = async (ueb: string, fecha: string): Promise<InterruptosResponse> => {
  try {
    console.log('🔍 Solicitando datos para UEB:', ueb, 'Fecha:', fecha);
    
    const [covidData, reubData, prod60Data, prod100Data] = await Promise.all([
      getInterruptosCovid(ueb, fecha),
      getInterruptosReub(ueb, fecha),
      getInterruptos60(ueb, fecha),
      getInterruptos100(ueb, fecha)
    ]);

    // DEBUG: Ver qué datos estamos recibiendo
    console.log('📊 COVID Data:', covidData);
    console.log('📊 REUB Data:', reubData);
    console.log('📊 60% Data:', prod60Data);
    console.log('📊 100% Data:', prod100Data);

    // Extraer TODAS las direcciones únicas de todos los datasets
    const allDirecciones = [
      ...covidData.map(item => item.direcciones?.trim()).filter(Boolean),
      ...reubData.map(item => item.direcciones?.trim()).filter(Boolean),
      ...prod60Data.map(item => item.direcciones?.trim()).filter(Boolean),
      ...prod100Data.map(item => item.direcciones?.trim()).filter(Boolean)
    ];
    
    const direccionesUnicas = [...new Set(allDirecciones)].sort();
    console.log('📍 Direcciones únicas encontradas:', direccionesUnicas);

    // Función mejorada para buscar valores
    const encontrarValor = (data: NormalizedInterruptosData[], direccion: string): number => {
      const item = data.find(item => 
        item.direcciones && item.direcciones.trim().toLowerCase().includes(direccion.toLowerCase())
      );
      const valor = item ? item.total : 0;
      console.log(`🔎 Buscando ${direccion} en dataset:`, valor);
      return valor;
    };

    const interruptos = direccionesUnicas.map(direccion => {
      const covid = encontrarValor(covidData, direccion);
      const reubicacion = encontrarValor(reubData, direccion);
      const produccion60 = encontrarValor(prod60Data, direccion);
      const produccion100 = encontrarValor(prod100Data, direccion);

      return {
        Direccion: direccion,
        covid,
        reubicados: reubicacion,
        produccion25: produccion100, // produccion100 = produccion25
        produccion48: produccion60   // produccion60 = produccion48
      };
    });

    console.log('📋 Interruptos procesados:', interruptos);

    // Calcular totales CORRECTAMENTE
    const calcularTotal = (data: NormalizedInterruptosData[]) => {
      const total = data.reduce((sum, item) => sum + (item.total || 0), 0);
      const F = data.reduce((sum, item) => sum + (item.femenino || 0), 0);
      const M = data.reduce((sum, item) => sum + (item.masculino || 0), 0);
      
      console.log(`🧮 Totales calculados - Total: ${total}, F: ${F}, M: ${M}`);
      return { Total: total, F, M };
    };

    const result = {
      interruptos,
      totalCovid: calcularTotal(covidData),
      totalReub: calcularTotal(reubData),
      totalProd25: calcularTotal(prod100Data),
      totalProd48: calcularTotal(prod60Data)
    };

    console.log('✅ Resultado final:', result);
    return result;

  } catch (error) {
    console.error('❌ Error getting interruptos data:', error);
    throw error;
  }
};

// Función auxiliar mejorada para encontrar valor por dirección
const encontrarValorPorDireccion = (data: NormalizedInterruptosData[], direccion: string): number => {
  if (!direccion) return 0;
  
  // Buscar coincidencia exacta primero
  let item = data.find(item => 
    item.direcciones && item.direcciones.trim().toLowerCase() === direccion.toLowerCase()
  );
  
  // Si no encuentra coincidencia exacta, buscar parcial
  if (!item) {
    item = data.find(item => 
      item.direcciones && item.direcciones.trim().toLowerCase().includes(direccion.toLowerCase())
    );
  }
  
  return item ? (item.total || 0) : 0;
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