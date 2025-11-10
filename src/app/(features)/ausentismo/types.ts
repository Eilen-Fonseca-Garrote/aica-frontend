
export interface ClaveAusentismo {
  Clave: string;
  Descripcion: string;
  Cantidad: number;
  Femenino?: number;
  Masculino?: number;
}

export interface AusentismoResponse {
  UEB: string;
  CLAVES: ClaveAusentismo[];
}

export interface AusentismoRequest {
  ueb: string;
  fecha: string;
  claves?: string[];
}
