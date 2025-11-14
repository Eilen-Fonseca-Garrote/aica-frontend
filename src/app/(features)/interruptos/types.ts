// features/interruptos/types.ts
export interface TotalResult {
  Total: number;
  F: number;
  M: number;
}

export interface InterruptosEntry {
  Direccion: string;
  covid: number;
  reubicados: number;
  produccion25: number;
  produccion48: number;
}

export interface TotalInterruptosUEB {
  Covid: TotalResult;
  Reubic: TotalResult;
  Prod25: TotalResult;
  Prod48: TotalResult;
}

export interface InterruptosResponse {
  interruptos?: InterruptosEntry[] | null;
  interruptosAica?: InterruptosEntry[] | null;
  interruptosLiorad?: InterruptosEntry[] | null;
  interruptosJT?: InterruptosEntry[] | null;
  interruptosCitox?: InterruptosEntry[] | null;
  interruptosSH?: InterruptosEntry[] | null;
  totalReub: TotalResult;
  totalCovid: TotalResult;
  totalProd25: TotalResult;
  totalProd48: TotalResult;
  totales: {
    [key: string]: {
      [key: string]: TotalResult;
    };
  };
  totalesInt: TotalInterruptosUEB | null;
}

// Para la tabla del frontend
export interface InterruptosData {
  direccion: string;
  covid: number;
  reubicacion: number;
  produccion100: number;
  produccion60: number;
}

/*
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
} */
