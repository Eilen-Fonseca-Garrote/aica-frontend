// features/interruptos/types.ts
export interface InterruptosData {
  direccion: string;
  covid: number;
  reubicacion: number;
  produccion100: number;
  produccion60: number;
}

export interface InterruptosResponse {
  interruptos?: Array<{
    Direccion: string;
    covid: number;
    reubicados: number;
    produccion25: number;
    produccion48: number;
  }>;
  totalReub?: { Total: number; F: number; M: number };
  totalCovid?: { Total: number; F: number; M: number };
  totalProd25?: { Total: number; F: number; M: number };
  totalProd48?: { Total: number; F: number; M: number };
}

// Interfaces actualizadas según la documentación
export interface InterruptosDataCovid {
  Masculino: number;
  Total_Trabajadores: number;
  Femenino: number;
  EstNV1: number;
  "UEB/Dirección": string;
  // Propiedades adicionales para compatibilidad
  masculino?: number;
  total?: number;
  femenino?: number;
  direcciones?: string;
}

export interface InterruptosDataReub {
  Masculino: number;
  Total_Trabajadores: number;
  Femenino: number;
  EstNV1: number;
  "UEB/Dirección": string;
  // Propiedades adicionales para compatibilidad
  masculino?: number;
  total?: number;
  femenino?: number;
  direcciones?: string;
}

export interface InterruptosData60 {
  Masculino: number;
  Total_Trabajadores: number;
  Femenino: number;
  EstNV1: number;
  "UEB/Dirección": string;
  // Propiedades adicionales para compatibilidad
  masculino?: number;
  total?: number;
  femenino?: number;
  direcciones?: string;
}

export interface InterruptosData100 {
  Masculino: number;
  Total_Trabajadores: number;
  Femenino: number;
  EstNV1: number;
  "UEB/Dirección": string;
  // Propiedades adicionales para compatibilidad
  masculino?: number;
  total?: number;
  femenino?: number;
  direcciones?: string;
}
