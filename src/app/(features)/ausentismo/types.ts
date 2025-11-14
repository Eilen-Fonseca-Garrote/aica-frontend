export interface ClaveAusentismo {
  ClvCod: string;
  ClvDesc: string;
}

export interface AusentismoItem {
  Clave: string;
  Cantidad: number;
}

// La respuesta del backend es un array de strings (claves)
export type AusentismoResponse = string[];

export interface AusentismoRequest {
  codigos: string[];
  date: string;
  ueb: string;
}
