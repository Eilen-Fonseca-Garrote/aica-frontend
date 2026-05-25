import { apiClient } from './client'

export interface SelectOption {
  value: string
  label: string
}

export interface ListarTrabajadoresFilterOptions {
  direcciones: SelectOption[]
  municipios: SelectOption[]
  nivelEscolar: SelectOption[]
  cargos: SelectOption[]
  categoriasCientificas: SelectOption[]
}

export interface ListarTrabajadoresFiltersPayload {
  uebSelect: string
  direccionFSelect?: string
  areaSelect?: string
  municipioSelect?: string
  reparto?: string
  sexoSelect?: string
  edad?: number
  edadOperator?: '<' | '>' | '='
  hijos?: number
  grupoFactor?: string
  nescolar?: string
  raza?: string
  carrera?: string
  camisa?: string
  pantalon?: string
  zapato?: string
  pcc?: boolean
  ujc?: boolean
  imprescindible?: boolean
  licConduc?: boolean
  auto?: boolean
  master?: string
  fechagrad?: string
  fechaGradOperator?: '<' | '>'
  fechaalta?: string
  fechaAltaOperator?: '<' | '>'
  experiencia?: number
  cargo?: string
  ubicDef?: string
  cat_cient?: string
  sub_cat_cient?: string
}

export interface ListarTrabajadoresFilterSummary {
  label: string
  value: string
}

export interface ListarTrabajadoresResponse {
  trabajadores: Record<string, unknown>[]
  total: number
  ubicDefinido: boolean
  filtrosAplicados: ListarTrabajadoresFilterSummary[]
}

export const getListarTrabajadoresOptions = async (ueb: string) => {
  const url = `/listarTrabajadores/options?ueb=${encodeURIComponent(ueb)}`
  const res = await apiClient.get<ListarTrabajadoresFilterOptions>(url)
  return res.data
}

export const getSubCategoriasCientificas = async (
  ueb: string,
  categoria: string,
) => {
  const url =
    `/listarTrabajadores/subcategorias?ueb=${encodeURIComponent(ueb)}` +
    `&categoria=${encodeURIComponent(categoria)}`
  const res = await apiClient.get<SelectOption[]>(url)
  return res.data
}

export const filtrarTrabajadores = async (
  payload: ListarTrabajadoresFiltersPayload,
) => {
  const res = await apiClient.post<ListarTrabajadoresResponse>(
    '/listarTrabajadores/filtrar',
    payload,
  )
  return res.data
}
