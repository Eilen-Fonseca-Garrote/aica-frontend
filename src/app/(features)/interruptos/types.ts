// features/interruptos/types.ts
export interface InterruptosData {
  Direccion: string;
  covid: number;
  reubicados: number;
  produccion25: number;
  produccion48: number;
}

export interface TotalInterruptos {
  totalCovid: { Total: number; F: number; M: number };
  totalReub: { Total: number; F: number; M: number };
  totalProd25: { Total: number; F: number; M: number };
  totalProd48: { Total: number; F: number; M: number };
}

export interface InterruptosResponse {
  interruptos: InterruptosData[];
  total: TotalInterruptos;
}
