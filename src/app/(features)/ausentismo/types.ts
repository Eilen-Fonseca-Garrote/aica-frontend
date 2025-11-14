export interface ClaveAusentismo {
  Clave: string;
  ClvDescripcion: string;
}

export interface AusentismoItem {
  Clave: string;
  Cantidad: number;
}

export interface AusentismoResponse {
  CLAVES: AusentismoItem[];
}

export interface AusentismoRequest {
  ueb: string;
  fecha: string;
  claves?: string[];
}
