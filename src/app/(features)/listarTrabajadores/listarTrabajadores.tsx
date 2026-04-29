"use client"

import { useEffect, useState } from "react"
import { ChevronUp, Loader2, Search } from "lucide-react"
import ListarTrabajadoresActions from "./listarTrabajadoresActions"
import {
  filtrarTrabajadores,
  getDireccionesAreas,
  getListarTrabajadoresOptions,
  getSubCategoriasCientificas,
  ListarTrabajadoresFilterOptions,
  ListarTrabajadoresFiltersPayload,
  ListarTrabajadoresResponse,
  SelectOption,
} from "@/app/lib/api/listarTrabajadores"
import SearchResultsTable from "../buscarTrabajadores/resultados/ResultadosTrabajadores"
import WorkerProfile from "../buscarTrabajadores/perfil/PerfilTrabajador"
import {
  buscarInformacionEstudiosPorCi,
  buscarInformacionFamiliarPorCi,
  buscarInformacionLaborPorCi,
  buscarMisionesCondecoracionesPorCi,
} from "@/app/lib/api/buscar"
import {
  BuscarTrabajadorEstudiosDataResponse,
  BuscarTrabajadorFamilyDataResponse,
  BuscarTrabajadorLaborDataResponse,
  BuscarTrabajadorMisionesCondecResponse,
  TrabajadorEstudiosData,
  TrabajadorFamilyData,
  TrabajadorLaborData,
  TrabajadorMisionesCondecData,
  TrabajadorPersonalData,
} from "../buscarTrabajadores/types"

const UEB_OPTIONS = [
  { value: "16", label: "AICA" },
  { value: "25", label: "LIORAD" },
  { value: "100", label: "CITOX" },
  { value: "55", label: "JULIO TRIGO" },
  { value: "57", label: "SH+" },
]

type FilterFormState = {
  uebSelect: string
  direccionFSelect: string
  areaSelect: string
  municipioSelect: string
  reparto: string
  sexoSelect: string
  edad: string
  edadOperator: "<" | ">" | "="
  hijos: string
  grupoFactor: string
  nescolar: string
  raza: string
  carrera: string
  camisa: string
  pantalon: string
  zapato: string
  pcc: boolean
  ujc: boolean
  imprescindible: boolean
  licConduc: boolean
  auto: boolean
  master: string
  fechagrad: string
  fechaGradOperator: "<" | ">"
  fechaalta: string
  fechaAltaOperator: "<" | ">"
  experiencia: string
  cargo: string
  ubicDef: string
  cat_cient: string
  sub_cat_cient: string
}

const INITIAL_FORM: FilterFormState = {
  uebSelect: "16",
  direccionFSelect: "0",
  areaSelect: "",
  municipioSelect: "",
  reparto: "",
  sexoSelect: "",
  edad: "",
  edadOperator: "=",
  hijos: "",
  grupoFactor: "",
  nescolar: "",
  raza: "",
  carrera: "",
  camisa: "",
  pantalon: "",
  zapato: "",
  pcc: false,
  ujc: false,
  imprescindible: false,
  licConduc: false,
  auto: false,
  master: "",
  fechagrad: "",
  fechaGradOperator: ">",
  fechaalta: "",
  fechaAltaOperator: ">",
  experiencia: "",
  cargo: "",
  ubicDef: "",
  cat_cient: "",
  sub_cat_cient: "",
}

const EMPTY_OPTIONS: ListarTrabajadoresFilterOptions = {
  direcciones: [],
  municipios: [],
  nivelEscolar: [],
  cargos: [],
  categoriasCientificas: [],
}

const TEXT_ACTION_CLASS =
  "inline-flex items-center gap-2 text-sm font-semibold text-[#0a8ca8] hover:text-[#08778f] disabled:text-gray-400 disabled:cursor-not-allowed"

const OPERATOR_BUTTON_CLASS =
  "px-2 py-2 text-sm font-semibold text-[#0a8ca8] hover:text-[#08778f] disabled:text-gray-400 disabled:cursor-not-allowed"

const getWorkerValue = (worker: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const exactValue = worker[key]
    if (exactValue !== undefined && exactValue !== null) {
      return String(exactValue).trim()
    }
    const matchingKey = Object.keys(worker).find(
      (existingKey) => existingKey.toUpperCase() === key.toUpperCase(),
    )
    if (matchingKey) {
      const value = worker[matchingKey]
      if (value !== undefined && value !== null) {
        return String(value).trim()
      }
    }
  }
  return ""
}

const toNumber = (value: string) => {
  const parsed = Number(value)
  return Number.isNaN(parsed) ? 0 : parsed
}

const mapWorkerRecordToPersonalData = (
  worker: Record<string, unknown>,
): TrabajadorPersonalData => {
  const nombre = [
    getWorkerValue(worker, ["NOMBRE"]),
    getWorkerValue(worker, ["1er APELLIDO"]),
    getWorkerValue(worker, ["2do APELLIDO"]),
  ]
    .filter(Boolean)
    .join(" ")

  return {
    ci: getWorkerValue(worker, ["CI"]),
    nombre,
    sexo: getWorkerValue(worker, ["SEXO"]),
    edad: toNumber(getWorkerValue(worker, ["EDAD"])),
    estado_civil: getWorkerValue(worker, ["ESTADO CIVIL"]),
    telefono_fijo: getWorkerValue(worker, ["TELEFONO FIJO"]),
    telefono_movil: getWorkerValue(worker, ["TELEFONO MOVIL"]),
    direccion_oficial: getWorkerValue(worker, ["DIRECCION OFICIAL"]),
    municipio_especial: getWorkerValue(worker, ["MUNICIPIO OFICIAL"]),
    reparto_direccion_oficial: getWorkerValue(worker, ["REPARTO DIRECCION OFICIAL"]),
    lugar_nacimiento: getWorkerValue(worker, ["LUGAR NACIMIENTO"]),
    lic_conduccion: getWorkerValue(worker, ["LIC. CONDUCCION"]),
    direccion_ueb: getWorkerValue(worker, ["DIRECCION/UEB"]),
    area: getWorkerValue(worker, ["AREA"]),
    cargo: getWorkerValue(worker, ["CARGO"]),
    grupo_sanguineo: getWorkerValue(worker, ["GRUPO SANGUINEO"]),
    color_pelo: getWorkerValue(worker, ["COLOR PELO"]),
    estatura: toNumber(getWorkerValue(worker, ["ESTATURA"])),
    raza: getWorkerValue(worker, ["RAZA"]),
    color_ojos: getWorkerValue(worker, ["COLOR OJOS"]),
    talla_pantalon: getWorkerValue(worker, ["TALLA PANTALON"]),
    talla_blusa_camisa: getWorkerValue(worker, ["TALLA BLUSA/CAMISA"]),
    talla_calzado: getWorkerValue(worker, ["TALLA CALZADO"]),
  }
}

const mapToTrabajadorFamilyData = (
  data: BuscarTrabajadorFamilyDataResponse[],
): TrabajadorFamilyData[] => {
  return data.map((item) => ({
    nombre_padre: item["TrbPadre"] || "",
    nombre_madre: item["TrbMadre"] || "",
    cant_hijos: item["TrbCanHijo"] ?? 0,
    parentesco: item["PARENTESCO"] || "",
    familiar_nombre: item["NOMBRE del FAMILIAR"] || "",
    familiar_ci: item["CI del FAMILIAR"] || "",
    viven_juntos: item["VIVEN JUNTOS"] || "",
    afecta_contraparte: item["AFECTA CONTRAPARTE"] || "",
  }))
}

const mapToTrabajadorEstudiosData = (
  data: BuscarTrabajadorEstudiosDataResponse[],
): TrabajadorEstudiosData[] => {
  return data.map((item) => ({
    fecha_graduado: item["FECHA GRADUADO"] || "",
    idioma: item["IDIOMA"] || "",
    nivel_escolar: item["NIVEL ESCOLAR"] || "",
    otros_estudios: item["OTROS ESTUDIOS"] || "",
    escribe: item["ESCRIBE"] || "",
    ci: item["CI"] || "",
    centro_otros_estudios: item["CENTRO OTROS ESTUDIOS"] || "",
    fecha_otros_estudios: item["FECHA OTROS ESTUDIOS"] || "",
    master_doctor: item["MASTER/DOCTOR"] || "",
    lee: item["LEE"] || "",
    habla: item["HABLA"] || "",
    graduado_de: item["GRADUADO DE"] || "",
    pais: item["PAIS"] || "",
  }))
}

const mapToTrabajadorLaborData = (
  data: BuscarTrabajadorLaborDataResponse[],
): TrabajadorLaborData[] => {
  return data.map((item) => ({
    no: item["No."] ?? 0,
    fecha_baja: item["FECHA BAJA"] || "",
    pcc: item["PCC"] ?? 0,
    grupo_escala: item["GRUPO ESCALA"] || "",
    fecha_alta: item["FECHA ALTA"] || "",
    pago_antiguedad: item["PAGO ANTIGUEDAD"] ?? 0,
    es_imprescindible: item["ES IMPRESCINDIBLE"] ?? 0,
    cargo1: item["CARGO1"] || "",
    cont_cods: item["ContCods"] || "",
    annos_experiencia: item["ANNOS EXPERIENCIA"] ?? 0,
    salario_escala: item["SALARIO ESCALA"] ?? 0,
    categoria_ocupacional: item["CATEGORIA OCUPACIONAL"] || "",
    expediente: item["EXPEDIENTE"] || "",
    regimen_de_pago: item["REGIMEN DE PAGO"] || "",
    pasaporte: item["PASAPORTE"] || "",
    salario: item["SALARIO"] ?? 0,
    cdr: item["CDR"] ?? 0,
    ci: item["CI"] || "",
    fecha_alta_cargo: item["FECHA ALTA CARGO"] || "",
    cargos: item["CARGOS"] || "",
    horas_interrpcion_acum: item["HORAS INTERRPCION ACUM."] ?? 0,
    niv_esc_desc: item["NivEscDesc"] || "",
    fmc: item["FMC"] ?? 0,
    ubicacion_defensa: item["UBICACION DEFENSA"] || "",
    esta_empresa: item["ESTA EMPRESA"] || "",
    detalles_de_ubicacion: item["DETALLES DE UBICACION"] || "",
    asg_no_resol: item["AsgNoResol"] || "",
    ujc: item["UJC"] ?? 0,
    fecha_alta_empresa: item["FECHA ALTA EMPRESA"] || "",
  }))
}

const mapToTrabajadorMisionesData = (
  data: BuscarTrabajadorMisionesCondecResponse[],
): TrabajadorMisionesCondecData[] => {
  return data.map((item) => ({
    trb_num_iden: item["TrbNumIden"] || "",
    fecha_recibida: item["FECHA RECIBIDA"] || "",
    condecoracion: item["CONDECORACION"] || "",
    funciones: item["FUNCIONES"] || "",
    codigo_mis: item["CODIGOMIS"] || "",
    fin_de_mision: item["FIN DE MISION"] || "",
    codigo_cond: item["CODIGOCOND"] || "",
    pais: item["PAIS"] || "",
    inicio_mision: item["INICIO MISION"] || "",
  }))
}

export default function ListarTrabajadores() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    filtrar: false,
    exportar: false,
  })
  const [form, setForm] = useState<FilterFormState>(INITIAL_FORM)
  const [options, setOptions] = useState<ListarTrabajadoresFilterOptions>(EMPTY_OPTIONS)
  const [areas, setAreas] = useState<SelectOption[]>([])
  const [subCategorias, setSubCategorias] = useState<SelectOption[]>([])
  const [loadingOptions, setLoadingOptions] = useState(false)
  const [loadingResults, setLoadingResults] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [results, setResults] = useState<ListarTrabajadoresResponse | null>(null)
  const [selectedWorker, setSelectedWorker] = useState<TrabajadorPersonalData | null>(null)
  const [selectedWorkerFamliyData, setSelectedWorkerFamliyData] =
    useState<TrabajadorFamilyData | null>(null)
  const [selectedWorkerStudiesData, setSelectedWorkerStudiesData] =
    useState<TrabajadorEstudiosData | null>(null)
  const [selectedWorkerLaborData, setSelectedWorkerLaborData] =
    useState<TrabajadorLaborData | null>(null)
  const [selectedWorkerMissionData, setSelectedWorkerMissionData] =
    useState<TrabajadorMisionesCondecData | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(false)

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  useEffect(() => {
    if (!expandedSections.filtrar) {
      return
    }

    let isMounted = true
    const loadOptions = async () => {
      try {
        setLoadingOptions(true)
        setErrorMessage("")
        const response = await getListarTrabajadoresOptions(form.uebSelect)
        if (!isMounted) {
          return
        }
        setOptions(response)
      } catch {
        if (!isMounted) {
          return
        }
        setOptions(EMPTY_OPTIONS)
        setAreas([])
        setSubCategorias([])
        setErrorMessage("No se pudieron cargar las opciones de filtros.")
      } finally {
        if (isMounted) {
          setLoadingOptions(false)
        }
      }
    }

    loadOptions()
    return () => {
      isMounted = false
    }
  }, [expandedSections.filtrar, form.uebSelect])

  const updateForm = (name: keyof FilterFormState, value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectOrInputChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, type } = e.target
    const fieldName = name as keyof FilterFormState
    const value = type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value

    if (fieldName === "uebSelect") {
      setForm((prev) => ({
        ...prev,
        uebSelect: value as string,
        direccionFSelect: "0",
        areaSelect: "",
        municipioSelect: "",
        nescolar: "",
        cargo: "",
        cat_cient: "",
        sub_cat_cient: "",
      }))
      setAreas([])
      setSubCategorias([])
      setResults(null)
      return
    }

    updateForm(fieldName, value)

    if (fieldName === "direccionFSelect") {
      const direccionValue = value as string
      setResults(null)

      if (direccionValue === "0") {
        setAreas([])
        setForm((prev) => ({ ...prev, areaSelect: "" }))
        return
      }

      try {
        setLoadingOptions(true)
        const areasResponse = await getDireccionesAreas(form.uebSelect, direccionValue)
        setAreas(areasResponse)
      } catch {
        setAreas([])
        setErrorMessage("No se pudieron cargar las areas para esa direccion.")
      } finally {
        setLoadingOptions(false)
      }
    }

    if (fieldName === "cat_cient") {
      const categoriaValue = value as string
      setResults(null)
      setForm((prev) => ({ ...prev, sub_cat_cient: "" }))

      if (!categoriaValue) {
        setSubCategorias([])
        return
      }

      try {
        setLoadingOptions(true)
        const subCatsResponse = await getSubCategoriasCientificas(
          form.uebSelect,
          categoriaValue,
        )
        setSubCategorias(subCatsResponse)
      } catch {
        setSubCategorias([])
        setErrorMessage("No se pudieron cargar las sub categorias cientificas.")
      } finally {
        setLoadingOptions(false)
      }
    }
  }

  const toggleEdadOperator = () => {
    setForm((prev) => ({
      ...prev,
      edadOperator: prev.edadOperator === "=" ? ">" : prev.edadOperator === ">" ? "<" : "=",
    }))
  }

  const toggleFechaGradOperator = () => {
    setForm((prev) => ({
      ...prev,
      fechaGradOperator: prev.fechaGradOperator === ">" ? "<" : ">",
    }))
  }

  const toggleFechaAltaOperator = () => {
    setForm((prev) => ({
      ...prev,
      fechaAltaOperator: prev.fechaAltaOperator === ">" ? "<" : ">",
    }))
  }

  const buildPayload = (): ListarTrabajadoresFiltersPayload => {
    const payload: ListarTrabajadoresFiltersPayload = {
      uebSelect: form.uebSelect,
    }

    if (form.direccionFSelect !== "0") payload.direccionFSelect = form.direccionFSelect
    if (form.areaSelect) payload.areaSelect = form.areaSelect
    if (form.municipioSelect) payload.municipioSelect = form.municipioSelect
    if (form.reparto) payload.reparto = form.reparto
    if (form.sexoSelect) payload.sexoSelect = form.sexoSelect
    if (form.edad) {
      payload.edad = Number(form.edad)
      payload.edadOperator = form.edadOperator
    }
    if (form.hijos) payload.hijos = Number(form.hijos)
    if (form.grupoFactor) payload.grupoFactor = form.grupoFactor
    if (form.nescolar) payload.nescolar = form.nescolar
    if (form.raza) payload.raza = form.raza
    if (form.carrera) payload.carrera = form.carrera
    if (form.camisa) payload.camisa = form.camisa
    if (form.pantalon) payload.pantalon = form.pantalon
    if (form.zapato) payload.zapato = form.zapato
    if (form.pcc) payload.pcc = true
    if (form.ujc) payload.ujc = true
    if (form.imprescindible) payload.imprescindible = true
    if (form.licConduc) payload.licConduc = true
    if (form.auto) payload.auto = true
    if (form.master) payload.master = form.master
    if (form.fechagrad) {
      payload.fechagrad = form.fechagrad
      payload.fechaGradOperator = form.fechaGradOperator
    }
    if (form.fechaalta) {
      payload.fechaalta = form.fechaalta
      payload.fechaAltaOperator = form.fechaAltaOperator
    }
    if (form.experiencia) payload.experiencia = Number(form.experiencia)
    if (form.cargo) payload.cargo = form.cargo
    if (form.ubicDef) payload.ubicDef = form.ubicDef
    if (form.cat_cient) payload.cat_cient = form.cat_cient
    if (form.sub_cat_cient) payload.sub_cat_cient = form.sub_cat_cient

    return payload
  }

  const handleFilterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setResults(null)
    setErrorMessage("")
    setLoadingProfile(false)
    setSelectedWorker(null)
    setSelectedWorkerFamliyData(null)
    setSelectedWorkerStudiesData(null)
    setSelectedWorkerLaborData(null)
    setSelectedWorkerMissionData(null)

    if (form.cat_cient && !form.sub_cat_cient) {
      setErrorMessage("Seleccione una sub categoria cientifica para poder filtrar.")
      return
    }

    try {
      setLoadingResults(true)
      const response = await filtrarTrabajadores(buildPayload())
      setResults(response)
    } catch {
      setErrorMessage("No se pudieron listar los trabajadores con los filtros seleccionados.")
    } finally {
      setLoadingResults(false)
    }
  }

  const handleSelectWorker = async (worker: TrabajadorPersonalData) => {
    setSelectedWorker(worker)
    setLoadingProfile(true)
    setSelectedWorkerFamliyData(null)
    setSelectedWorkerStudiesData(null)
    setSelectedWorkerLaborData(null)
    setSelectedWorkerMissionData(null)

    try {
      const [familyResponse, studiesResponse, laborResponse, missionsResponse] =
        await Promise.all([
          buscarInformacionFamiliarPorCi(form.uebSelect, worker.ci),
          buscarInformacionEstudiosPorCi(form.uebSelect, worker.ci),
          buscarInformacionLaborPorCi(form.uebSelect, worker.ci),
          buscarMisionesCondecoracionesPorCi(form.uebSelect, worker.ci),
        ])

      if (familyResponse?.length) {
        setSelectedWorkerFamliyData(mapToTrabajadorFamilyData(familyResponse)[0] || null)
      }
      if (studiesResponse?.length) {
        setSelectedWorkerStudiesData(mapToTrabajadorEstudiosData(studiesResponse)[0] || null)
      }
      if (laborResponse?.length) {
        setSelectedWorkerLaborData(mapToTrabajadorLaborData(laborResponse)[0] || null)
      }
      if (missionsResponse?.length) {
        setSelectedWorkerMissionData(mapToTrabajadorMisionesData(missionsResponse)[0] || null)
      }
    } catch {
      setErrorMessage("No se pudieron cargar todos los datos detallados del trabajador.")
    } finally {
      setLoadingProfile(false)
    }
  }

  const goBackToResults = () => {
    setSelectedWorker(null)
    setSelectedWorkerFamliyData(null)
    setSelectedWorkerStudiesData(null)
    setSelectedWorkerLaborData(null)
    setSelectedWorkerMissionData(null)
  }

  const mappedWorkers: TrabajadorPersonalData[] = results
    ? results.trabajadores.map((worker) => mapWorkerRecordToPersonalData(worker))
    : []

  const renderResultsContent = () => {
    if (loadingProfile) {
      return <p className="text-sm text-gray-600 mt-4">Cargando perfil del trabajador...</p>
    }

    if (selectedWorker) {
      return (
        <div className="mt-6">
          <WorkerProfile
            worker={selectedWorker}
            imagenTrab="/img/default-profile.jpg"
            ueb={form.uebSelect}
            laborData={selectedWorkerLaborData}
            estudiosData={selectedWorkerStudiesData}
            familiarData={selectedWorkerFamliyData}
            misiones={selectedWorkerMissionData}
          />
        </div>
      )
    }

    if (!results) {
      return null
    }

    if (results.trabajadores.length === 0) {
      return (
        <p className="text-sm text-gray-600 mt-4">
          No se encontraron trabajadores para los filtros seleccionados.
        </p>
      )
    }

    return (
      <div className="mt-6">
        <div className="px-4 py-3 bg-[#0a8ca8] text-sm text-white flex flex-wrap gap-2 rounded-t border border-[#08778f]">
          <span className="font-semibold text-white">Total:</span>
          <span>{results.total}</span>
        </div>
        <SearchResultsTable
          personalData={mappedWorkers}
          selectWorker={handleSelectWorker}
          showLocationColumns={true}
          title="Resultados de la Busqueda"
        />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {/* Filtrar Trabajadores */}
      <div className="border border-gray-300 rounded overflow-hidden">
        <button
          onClick={() => toggleSection("filtrar")}
          className="w-full px-4 py-3 flex items-center justify-between bg-[#0a8ca8] text-white hover:bg-[#08778f] transition-colors"
        >
          <span className="font-semibold text-white">Filtrar Trabajadores</span>
          <div className="flex items-center gap-2">
            {expandedSections.filtrar ? (
              <ChevronUp className="h-5 w-5 text-white" />
            ) : (
              <span className="text-2xl font-light text-white w-8 h-8 flex items-center justify-center">
                +
              </span>
            )}
          </div>
        </button>

        {expandedSections.filtrar && (
          <div className="bg-white p-4 border-t border-gray-300">
            <form onSubmit={handleFilterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">UEB</label>
                  <select
                    name="uebSelect"
                    value={form.uebSelect}
                    onChange={handleSelectOrInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    {UEB_OPTIONS.map((ueb) => (
                      <option key={ueb.value} value={ueb.value}>
                        {ueb.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Direccion</label>
                  <select
                    name="direccionFSelect"
                    value={form.direccionFSelect}
                    onChange={handleSelectOrInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="0">Seleccionar Direccion...</option>
                    {options.direcciones.map((direccion) => (
                      <option key={direccion.value} value={direccion.value}>
                        {direccion.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Area</label>
                  <select
                    name="areaSelect"
                    value={form.areaSelect}
                    onChange={handleSelectOrInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    disabled={areas.length === 0}
                  >
                    <option value="">Seleccionar Area...</option>
                    {areas.map((area) => (
                      <option key={area.value} value={area.value}>
                        {area.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Municipio</label>
                  <select
                    name="municipioSelect"
                    value={form.municipioSelect}
                    onChange={handleSelectOrInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="">Seleccionar Municipio...</option>
                    {options.municipios.map((municipio) => (
                      <option key={municipio.value} value={municipio.value}>
                        {municipio.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Reparto</label>
                  <input
                    type="text"
                    name="reparto"
                    value={form.reparto}
                    onChange={handleSelectOrInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    placeholder="Reparto de residencia"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Sexo</label>
                  <select
                    name="sexoSelect"
                    value={form.sexoSelect}
                    onChange={handleSelectOrInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="">Seleccionar Sexo...</option>
                    <option value="F">Femenino</option>
                    <option value="M">Masculino</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Edad</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={toggleEdadOperator}
                      className={OPERATOR_BUTTON_CLASS}
                    >
                      {form.edadOperator}
                    </button>
                    <input
                      type="number"
                      name="edad"
                      value={form.edad}
                      onChange={handleSelectOrInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Cantidad de Hijos</label>
                  <input
                    type="number"
                    name="hijos"
                    value={form.hijos}
                    onChange={handleSelectOrInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Grupo Sanguineo</label>
                  <select
                    name="grupoFactor"
                    value={form.grupoFactor}
                    onChange={handleSelectOrInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="">Seleccionar Grupo...</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Nivel Escolar</label>
                  <select
                    name="nescolar"
                    value={form.nescolar}
                    onChange={handleSelectOrInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="">Seleccionar Nivel Escolar...</option>
                    {options.nivelEscolar.map((nivel) => (
                      <option key={nivel.value} value={nivel.value}>
                        {nivel.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Raza</label>
                  <select
                    name="raza"
                    value={form.raza}
                    onChange={handleSelectOrInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="">Seleccionar Raza...</option>
                    <option value="Blanca">Blanca</option>
                    <option value="Mestiza">Mestiza</option>
                    <option value="Negra">Negra</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Carrera</label>
                  <input
                    type="text"
                    name="carrera"
                    value={form.carrera}
                    onChange={handleSelectOrInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    placeholder="Carrera"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Talla Camisa/Blusa</label>
                  <select
                    name="camisa"
                    value={form.camisa}
                    onChange={handleSelectOrInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="">Seleccionar Talla...</option>
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Talla Pantalon</label>
                  <input
                    type="text"
                    name="pantalon"
                    value={form.pantalon}
                    onChange={handleSelectOrInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Talla Zapato</label>
                  <select
                    name="zapato"
                    value={form.zapato}
                    onChange={handleSelectOrInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="">Seleccionar Talla...</option>
                    {["34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47"].map(
                      (talla) => (
                        <option key={talla} value={talla}>
                          {talla}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="pcc"
                    checked={form.pcc}
                    onChange={handleSelectOrInputChange}
                  />
                  PCC
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="ujc"
                    checked={form.ujc}
                    onChange={handleSelectOrInputChange}
                  />
                  UJC
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="imprescindible"
                    checked={form.imprescindible}
                    onChange={handleSelectOrInputChange}
                  />
                  Imprescindible
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    name="licConduc"
                    checked={form.licConduc}
                    onChange={handleSelectOrInputChange}
                  />
                  Licencia de Conduccion
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    name="auto"
                    checked={form.auto}
                    onChange={handleSelectOrInputChange}
                  />
                  Tiene Auto
                </label>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Master/Doctor</label>
                  <select
                    name="master"
                    value={form.master}
                    onChange={handleSelectOrInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="">Seleccionar Opcion...</option>
                    <option value="Master">Master</option>
                    <option value="Doctor">Doctor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Fecha de Graduacion</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={toggleFechaGradOperator}
                      className={OPERATOR_BUTTON_CLASS}
                    >
                      {form.fechaGradOperator}
                    </button>
                    <input
                      type="date"
                      name="fechagrad"
                      value={form.fechagrad}
                      onChange={handleSelectOrInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Fecha Alta Empresa</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={toggleFechaAltaOperator}
                      className={OPERATOR_BUTTON_CLASS}
                    >
                      {form.fechaAltaOperator}
                    </button>
                    <input
                      type="date"
                      name="fechaalta"
                      value={form.fechaalta}
                      onChange={handleSelectOrInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Anios de Experiencia</label>
                  <input
                    type="number"
                    name="experiencia"
                    value={form.experiencia}
                    onChange={handleSelectOrInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Cargo</label>
                  <select
                    name="cargo"
                    value={form.cargo}
                    onChange={handleSelectOrInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="">Seleccionar Cargo...</option>
                    {options.cargos.map((cargo) => (
                      <option key={cargo.value} value={cargo.value}>
                        {cargo.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Ubicacion en la Defensa</label>
                  <select
                    name="ubicDef"
                    value={form.ubicDef}
                    onChange={handleSelectOrInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="">Seleccionar Ubicacion...</option>
                    <option value="BPD">BPD</option>
                    <option value="No Incorporado">No Incorporado</option>
                    <option value="MTT">MTT</option>
                    <option value="Unidad Militar">Unidad Militar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Categoria Cientifica</label>
                  <select
                    name="cat_cient"
                    value={form.cat_cient}
                    onChange={handleSelectOrInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="">Seleccionar Categoria...</option>
                    {options.categoriasCientificas.map((categoria) => (
                      <option key={categoria.value} value={categoria.value}>
                        {categoria.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Sub Categoria Cientifica</label>
                  <select
                    name="sub_cat_cient"
                    value={form.sub_cat_cient}
                    onChange={handleSelectOrInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    disabled={subCategorias.length === 0}
                  >
                    <option value="">Seleccionar Sub Categoria...</option>
                    {subCategorias.map((subCategoria) => (
                      <option key={subCategoria.value} value={subCategoria.value}>
                        {subCategoria.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                {selectedWorker && (
                  <button
                    type="button"
                    onClick={goBackToResults}
                    className={`${TEXT_ACTION_CLASS} mr-3`}
                  >
                    Atras
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loadingResults || loadingOptions}
                  className={TEXT_ACTION_CLASS}
                >
                  {loadingResults || loadingOptions ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Listando...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      Listar
                    </>
                  )}
                </button>
              </div>
            </form>

            {errorMessage && <p className="text-sm text-[#0a8ca8] mt-4">{errorMessage}</p>}

            {results?.filtrosAplicados?.length ? (
              <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700 flex flex-wrap gap-2">
                {results.filtrosAplicados.map((filtro, index) => (
                  <span
                    key={`${filtro.label}-${index}`}
                    className="inline-flex items-center rounded bg-white border border-gray-300 px-2 py-1"
                  >
                    <strong className="mr-1">{filtro.label}:</strong> {filtro.value}
                  </span>
                ))}
              </div>
            ) : null}

            {renderResultsContent()}
          </div>
        )}
      </div>

      {/* Exportar Trabajadores */}
      <div className="border border-gray-300 rounded overflow-hidden">
        <button
          onClick={() => toggleSection("exportar")}
          className="w-full px-4 py-3 flex items-center justify-between bg-[#0a8ca8] text-white hover:bg-[#08778f] transition-colors"
        >
          <span className="font-semibold text-white">Exportar Trabajadores</span>
          {expandedSections.exportar ? (
            <ChevronUp className="h-5 w-5 text-white" />
          ) : (
            <span className="text-2xl font-light text-white">+</span>
          )}
        </button>
        {expandedSections.exportar && (
          <div className="bg-white p-6 border-t border-gray-300">
            <ListarTrabajadoresActions />
          </div>
        )}
      </div>
    </div>
  )
}
