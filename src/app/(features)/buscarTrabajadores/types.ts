export interface BuscarTrabajadorResponse {
  "TALLA PANTALON": string;
  "GRUPO SANGUINEO": string;
  "PAGO ANTIGUEDAD": number;
  "TIENE AUTO": number;
  "APTITUD CULTURAL": string;
  "ESTADO CIVIL": string;
  "2do APELLIDO": string;
  "ContCods": string;
  "ANNOS EXPERIENCIA": number;
  "MADRE": string;
  "PADRE": string;
  "EXPEDIENTE": string;
  "LIC. CONDUCCION": string;
  "1er APELLIDO": string;
  "COLOR PELO": string;
  "FECHA GRADUADO": string;
  "CI": string;
  "SEXO": string;
  "MUNICIPIO OFICIAL": string;
  "MASTER/DOCTOR": string;
  "TELEFONO FIJO": string;
  "UBICACION DEFENSA": string;
  "LUGAR NACIMIENTO": string;
  "TALLA BLUSA/CAMISA": string;
  "AsgNoResol": string;
  "DETALLES DE UBICACION": string;
  "TALLA CALZADO": string;
  "CARGO": string;
  "FECHA ALTA EMPRESA": string;
  "UJC": number;
  "PCC": number;
  "GRUPO ESCALA": string;
  "EDAD": number;
  "ESTATURA": number;
  "ES IMPRESCINDIBLE": number;
  "RAZA": string;
  "ALIAS": string;
  "SALARIO ESCALA": number;
  "DIRECCION/UEB": string;
  "PRACTICA DEPORTE": string;
  "FUMA": number;
  "TOMA": number;
  "CATEGORIA OCUPACIONAL": string;
  "CANT. HIJOS": number;
  "HORAS COVID ACUM.": number;
  "REGIMEN DE PAGO": string;
  "PASAPORTE": string;
  "REPARTO DIRECCION OFICIAL": string;
  "DIRECCION RESIDENCIAL": string;
  "FECHA ALTA CARGO": string;
  "CDR": number;
  "TELEFONO MOVIL": string;
  "NivEscDesc": string;
  "HORAS INTERRPCION ACUM.": number;
  "FMC": number;
  "NOMBRE": string;
  "DIRECCION OFICIAL": string;
  "PESO": number;
  "COLOR OJOS": string;
  "OTRA SENNA": string;
  "AREA": string;
  "GRADUADO DE": string;
}

export interface BuscarTrabajadorFamilyDataResponse  {
    "VIVEN JUNTOS": string,
    "TrbNumIden": string,
    "AFECTA CONTRAPARTE": string,
    "TRABAJA EN ESTA EMPRESA": string,
    "TrbPadre": string,
    "TrbMadre": string,
    "TrbCanHijo": number,
    "PARENTESCO": string,
    "NOMBRE del FAMILIAR": string,
    "CI del FAMILIAR": string
  }

export interface TrabajadorPersonalData {
    // Datos Personales
    "ci": string;
    "nombre": string;
    "sexo": string;
    "edad": number;
    "estado_civil": string;
    "telefono_fijo": string;
    "telefono_movil": string;
    "direccion_oficial": string;
    "municipio_especial": string;
    "reparto_direccion_oficial": string;
    "lugar_nacimiento": string;
    "lic_conduccion": string;
    "direccion_ueb": string;
    "area": string;
    "cargo": string;
    // Señas Particulares
    "grupo_sanguineo": string;
    "color_pelo": string;
    "estatura": number;
    "raza": string;
    "color_ojos": string;
    // Otros Datos
    "talla_pantalon": string;
    "talla_blusa_camisa": string;
    "talla_calzado": string;
}

export interface TrabajadorFamilyData  {
    "nombre_padre": string;
    "nombre_madre": string;
    "cant_hijos": number;
    "parentesco": string;
    "familiar_nombre": string;
    "familiar_ci": string;
    "viven_juntos": string;
    "afecta_contraparte": string
  }

export interface BuscarTrabajadorEstudiosDataResponse {
  "FECHA GRADUADO": string
  "IDIOMA": string
  "NIVEL ESCOLAR": string
  "OTROS ESTUDIOS": string
  "ESCRIBE": string
  "CI": string
  "CENTRO OTROS ESTUDIOS": string
  "FECHA OTROS ESTUDIOS": string
  "MASTER/DOCTOR": string
  "LEE": string
  "HABLA": string
  "GRADUADO DE": string
  "PAIS": string
}

export interface TrabajadorEstudiosData {
  fecha_graduado: string
  idioma: string
  nivel_escolar: string
  otros_estudios: string
  escribe: string
  ci: string
  centro_otros_estudios: string
  fecha_otros_estudios: string
  master_doctor: string
  lee: string
  habla: string
  graduado_de: string
  pais: string
}

export interface BuscarTrabajadorLaborDataResponse {
  "No.": number
  "FECHA BAJA": string
  "PCC": number
  "GRUPO ESCALA": string
  "FECHA ALTA": string
  "PAGO ANTIGUEDAD": number
  "ES IMPRESCINDIBLE": number
  "CARGO1": string
  "ContCods": string
  "ANNOS EXPERIENCIA": number
  "SALARIO ESCALA": number
  "CATEGORIA OCUPACIONAL": string
  "EXPEDIENTE": string
  "REGIMEN DE PAGO": string
  "PASAPORTE": string
  "SALARIO": number
  "CDR": number
  "CI": string
  "FECHA ALTA CARGO": string
  "CARGOS": string
  "HORAS INTERRPCION ACUM.": number
  "NivEscDesc": string
  "FMC": number
  "UBICACION DEFENSA": string
  "ESTA EMPRESA": string
  "DETALLES DE UBICACION": string
  "AsgNoResol": string
  "UJC": number
  "FECHA ALTA EMPRESA": string
}

export interface TrabajadorLaborData {
  no: number
  fecha_baja: string
  pcc: number
  grupo_escala: string
  fecha_alta: string
  pago_antiguedad: number
  es_imprescindible: number
  cargo1: string
  cont_cods: string
  annos_experiencia: number
  salario_escala: number
  categoria_ocupacional: string
  expediente: string
  regimen_de_pago: string
  pasaporte: string
  salario: number
  cdr: number
  ci: string
  fecha_alta_cargo: string
  cargos: string
  horas_interrpcion_acum: number
  niv_esc_desc: string
  fmc: number
  ubicacion_defensa: string
  esta_empresa: string
  detalles_de_ubicacion: string
  asg_no_resol: string
  ujc: number
  fecha_alta_empresa: string
}

export interface BuscarTrabajadorMisionesCondecResponse {
  "TrbNumIden": string
  "FECHA RECIBIDA": string
  "CONDECORACION": string
  "FUNCIONES": string
  "CODIGOMIS": string
  "FIN DE MISION": string
  "CODIGOCOND": string
  "PAIS": string
  "INICIO MISION": string
}

export interface TrabajadorMisionesCondecData {
  trb_num_iden: string
  fecha_recibida: string
  condecoracion: string
  funciones: string
  codigo_mis: string
  fin_de_mision: string
  codigo_cond: string
  pais: string
  inicio_mision: string
}

