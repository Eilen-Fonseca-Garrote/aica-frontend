// features/interruptos/types.ts
export interface InterruptosData {
  direccion: string;
  covid: number;
  reubicacion: number;
  produccion100: number;
  produccion60: number;
}

// Esta interfaz es la que realmente usa tu componente
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


// Mantener estas interfaces para uso futuro si son necesarias
/*export interface InterruptosDataCovid {
  masculino: number;
  total: number;
  femenino: number;
  EstNV1: number;
  direcciones: string;
}

export interface InterruptosDataReub {
  masculino: number;
  total: number;
  femenino: number;
  EstNV1: number;
  direcciones: string;
}

export interface InterruptosData60 {
  masculino: number;
  total: number;
  femenino: number;
  EstNV1: number;
  direcciones: string;
}

export interface InterruptosData100 {
  masculino: number;
  total: number;
  femenino: number;
  EstNV1: number;
  direcciones: string;
} */
