export interface ClaveAusentismo {
  ClvCod: string;
  ClvDesc: string;
}

export interface AusentismoItem {
  Clave: string;
  Cantidad: number;
}

// CORRECIÓN: La respuesta del backend es un array de objetos con Clave y Cantidad
export type AusentismoResponse = AusentismoItem[];

export interface AusentismoRequest {
  codigos: string[];
  date: string;
  ueb: string;
}
