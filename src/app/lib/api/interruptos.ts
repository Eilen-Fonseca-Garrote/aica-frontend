// lib/api/interruptos.ts
import { apiClient } from './client';
import { 
  getInterruptosCovid, 
  getInterruptosReub, 
  getInterruptos60, 
  getInterruptos100
} from './external_service';
import { InterruptosResponse, InterruptosDataCovid, InterruptosDataReub, InterruptosData60, InterruptosData100 } from '@/app/(features)/interruptos/types';

// Tipo base para datos normalizados
interface NormalizedInterruptosData {
  direcciones: string;
  total: number;
  masculino: number;
  femenino: number;
}

export const getInterruptos = async (ueb: string, fecha: string): Promise<InterruptosResponse> => {
  try {
    // Obtener todos los datos en paralelo
    const [covidData, reubData, prod60Data, prod100Data] = await Promise.all([
      getInterruptosCovid(ueb, fecha),
      getInterruptosReub(ueb, fecha),
      getInterruptos60(ueb, fecha),
      getInterruptos100(ueb, fecha)
    ]);

    // Extraer direcciones únicas de todos los datasets
    const direcciones = extraerDireccionesUnicas(covidData, reubData, prod60Data, prod100Data);

    // Transformar los datos al formato que espera tu tabla
    const interruptos = direcciones.map(direccion => {
      const covid = encontrarValorPorDireccion(covidData, direccion);
      const reubicacion = encontrarValorPorDireccion(reubData, direccion);
      const produccion60 = encontrarValorPorDireccion(prod60Data, direccion);
      const produccion100 = encontrarValorPorDireccion(prod100Data, direccion);

      return {
        Direccion: direccion,
        covid,
        reubicados: reubicacion,
        produccion25: produccion100, // produccion100 = produccion25 en el backend
        produccion48: produccion60   // produccion60 = produccion48 en el backend
      };
    });

    // Calcular totales
    const totalCovid = calcularTotales(covidData);
    const totalReub = calcularTotales(reubData);
    const totalProd25 = calcularTotales(prod100Data);
    const totalProd48 = calcularTotales(prod60Data);

    return {
      interruptos,
      totalCovid,
      totalReub,
      totalProd25,
      totalProd48
    };
  } catch (error) {
    console.error('Error getting interruptos data:', error);
    throw error;
  }
};

// Función auxiliar para extraer direcciones únicas de todos los datasets
const extraerDireccionesUnicas = (
  covidData: NormalizedInterruptosData[], 
  reubData: NormalizedInterruptosData[], 
  prod60Data: NormalizedInterruptosData[], 
  prod100Data: NormalizedInterruptosData[]
): string[] => {
  const direccionesSet = new Set<string>();
  
  // Extraer direcciones de cada dataset
  covidData.forEach(item => {
    if (item.direcciones) direccionesSet.add(item.direcciones.trim());
  });
  reubData.forEach(item => {
    if (item.direcciones) direccionesSet.add(item.direcciones.trim());
  });
  prod60Data.forEach(item => {
    if (item.direcciones) direccionesSet.add(item.direcciones.trim());
  });
  prod100Data.forEach(item => {
    if (item.direcciones) direccionesSet.add(item.direcciones.trim());
  });
  
  return Array.from(direccionesSet).sort();
};

// Función auxiliar para encontrar valor por dirección
const encontrarValorPorDireccion = (data: NormalizedInterruptosData[], direccion: string): number => {
  const item = data.find(item => 
    item.direcciones && item.direcciones.trim() === direccion
  );
  return item ? item.total || 0 : 0;
};

// Función auxiliar para calcular totales
const calcularTotales = (data: NormalizedInterruptosData[]) => {
  const total = data.reduce((sum, item) => sum + (item.total || 0), 0);
  const F = data.reduce((sum, item) => sum + (item.femenino || 0), 0);
  const M = data.reduce((sum, item) => sum + (item.masculino || 0), 0);
  
  return { Total: total, F, M };
};

export const downloadInterruptosPdf = async (ueb: string, fecha: string) => {
  const url = `/export/pdf/interruptos?ueb=${ueb}&fecha=${fecha}`;
  const res = await apiClient.get<Blob>(url, { responseType: 'blob' });
  return res.data;
};
