export interface ClaveAusentismo {
  ClvCod: string;
  ClvDesc: string;
}

export interface AusentismoItem {
  CLAVE: string;
  CANTIDAD: string; // creo q cantidad es un string
  HORAS:number;
}

// CORRECIÓN: La respuesta del backend es un array de objetos con Clave y Cantidad
export type AusentismoResponse = AusentismoItem[];

export interface AusentismoRequest {
  codigos: string[];
  date: string;
  ueb: string;
}