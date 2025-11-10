// types.ts
export interface PromedioMensual {
  Unidad: string
  HPromFisic: number
  HPromFMuj: number
  HPromTot: number
  HPromMuj: number
}

export interface TotalMensual {
  totalFisico: number
  totalFisicoMuj: number
  totalPromedio: number
  totalPromedioMujeres: number
}

export interface PromedioMensualResponse {
  clave26: number;
  promedio: PromedioMensual[];
  total: TotalMensual[];
}

export interface PromedioDiario {
  Fecha: string;
  HPDTT: number;
  HPDTM: number;
  Unidad: string;
}

export interface TotalDiario {
  Promedio: number
  PromedioMujeres: number
}

export interface PromedioDiarioResponse {
  direcc: string;
  fecha: string;
  promedio: PromedioDiario[];
  total: TotalDiario[];
  success: boolean;
  ueb: string;
}

export interface Direccion {
  Unidad: string;
  Area: [{
    EstNV1: number,
    Unidad: string
  }];
}