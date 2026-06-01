"use client"

import { useState } from "react"
import Card from "@/components/ui/Card"
import Select from "@/components/ui/Select"
import { UEB_OPTIONS_WITH_PLACEHOLDER } from "@/app/lib/constants/selectOptions"
import { Search } from "lucide-react"
import ToggleSection from "@/components/ui/ToggleSection"
import SearchResultsTable from "./resultados/ResultadosTrabajadores"
import WorkerProfile from "./perfil/PerfilTrabajador"
import {
  buscarTrabajadorPorNombre, 
  buscarTrabajadorPorCi, 
  buscarInformacionFamiliarPorCi, 
  buscarInformacionEstudiosPorCi, 
  buscarInformacionLaborPorCi, 
  buscarMisionesCondecoracionesPorCi 
} from "@/app/lib/api/buscar"
import { 
  BuscarTrabajadorEstudiosDataResponse,
  BuscarTrabajadorFamilyDataResponse, 
  BuscarTrabajadorLaborDataResponse, 
  BuscarTrabajadorMisionesCondecResponse, 
  BuscarTrabajadorResponse, 
  TrabajadorEstudiosData, 
  TrabajadorFamilyData, 
  TrabajadorLaborData, 
  TrabajadorMisionesCondecData, 
  TrabajadorPersonalData
} from "./types"

const TEXT_ACTION_CLASS =
  "inline-flex items-center gap-2 text-sm font-semibold text-[#0a8ca8] hover:text-[#08778f] disabled:text-gray-400 disabled:cursor-not-allowed"

const BuscarTrabajador = () => {
  const [form, setForm] = useState({
    ueb: "",
    ci: "",
    name: "",
    allCat: false,
    family: false,
    labor: false,
    studies: false,
    mision: false,
  })

  const [results, setResults] = useState<TrabajadorPersonalData[] | null>(null)
  const [selectedWorker, setSelectedWorker] = useState<TrabajadorPersonalData | null>(null)
  const [selectedWorkerFamliyData, setSelectedWorkerFamliyData] = useState<TrabajadorFamilyData | null>(null)
  const [selectedWorkerStudiesData, setSelectedWorkerStudiesData] = useState<TrabajadorEstudiosData | null>(null)
  const [selectedWorkerLaborData, setSelectedWorkerlaborData] = useState<TrabajadorLaborData | null>(null)
  const [selectedWorkerMissionData, setSelectedWorkerMissionData] = useState<TrabajadorMisionesCondecData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(false)


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, type } = e.target;
  const value = type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;

  setForm((prev) => {
    if (name === "allCat") {
      if (value) {
        return {
          ...prev,
          allCat: true,
          family: true,
          labor: true,
          studies: true,
          mision: true,
        };
      } else {
        return {
          ...prev,
          allCat: false,
          family: false,
          labor: false,
          studies: false,
          mision: false,
        };
      }
    }

    // === HANDLE individual checkboxes ===
    const updated = { ...prev, [name]: value };

    // If all individual checkboxes are selected → check "Todos"
    const allSelected =
      updated.family && updated.labor && updated.studies && updated.mision;

    return {
      ...updated,
      allCat: allSelected,
    };
  });
};


  const handleSelectWorker = async (worker: TrabajadorPersonalData | null) => {
    setSelectedWorker(worker)
    setSelectedWorkerFamliyData(null)
    setSelectedWorkerStudiesData(null)
    setSelectedWorkerlaborData(null)
    setSelectedWorkerMissionData(null)
    setLoadingProfile(true)

    try{
    if(form.family && worker){
    const familyData = await getFamilyData(worker.ci)
    setSelectedWorkerFamliyData(familyData[0])
    }
    if(form.studies && worker){
    const studiesData = await getStudiesData(worker.ci)
    setSelectedWorkerStudiesData(studiesData[0])
    }
    if(form.labor && worker){
    const laborData = await getlaborData(worker.ci)
    setSelectedWorkerlaborData(laborData[0])
    }
    if(form.mision && worker){
    const misionData = await getWorkAchievementsData(worker.ci)
    setSelectedWorkerMissionData(misionData[0])
    }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  }catch(error){
  }finally{
    setLoadingProfile(false)
  }
  }

  const getFamilyData = async (worker_ci:string ) => {
    let familyData: TrabajadorFamilyData[] = []
    if(form.family && worker_ci){
      const response = await buscarInformacionFamiliarPorCi(form.ueb, worker_ci)

      if (response && Array.isArray(response) && response.length > 0){
        familyData = mapToTrabajadorFamilyData(response)
      }
    }
    return familyData
  }

   const getStudiesData = async (worker_ci:string ) => {
    let studiesData: TrabajadorEstudiosData[] = []
    if(form.studies && worker_ci){
      const response = await buscarInformacionEstudiosPorCi(form.ueb, worker_ci)

      if (response && Array.isArray(response) && response.length > 0){
        studiesData = mapEstudiosResponse(response)
      }
    }
    return studiesData
  }

  const getlaborData = async (worker_ci:string ) => {
    let laborData: TrabajadorLaborData[] = []
    if(form.labor && worker_ci){
      const response = await buscarInformacionLaborPorCi(form.ueb, worker_ci)

      if (response && Array.isArray(response) && response.length > 0){
        laborData = mapToTrabajadorLaborData(response)
      }
    }
    return laborData
  }

  const getWorkAchievementsData = async (worker_ci:string ) => {
    let workerAchievementsData: TrabajadorMisionesCondecData[] = []
    if(form.mision && worker_ci){
      const response = await buscarMisionesCondecoracionesPorCi(form.ueb, worker_ci)

      if (response && Array.isArray(response) && response.length > 0){
        workerAchievementsData = mapWorkerAchievementsList(response)
      }
    }
    return workerAchievementsData
  }

  const goBackToResults = () => {
    setSelectedWorker(null)
    if(results && results.length < 2){
      setResults(null)
    }
  }



const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  setError(false)
  setSelectedWorker(null)

    // === VALIDATION ===
  if (!form.ueb) {
    alert("Por favor seleccione una UEB.")
    setLoading(false)
    return
  }

  if (!form.ci && !form.name) {
    alert("Debe ingresar al menos el CI o el Nombre del trabajador.")
    setLoading(false)
    return
  }

  try {
    let response

    if (form.ci) {
      response = await buscarTrabajadorPorCi(form.ueb, form.ci)
    } else {
      response = await buscarTrabajadorPorNombre(form.ueb, form.name)
    }


    if (response && Array.isArray(response)) {
      if(response.length == 0){
        setResults([])
      }else if(response.length === 1){
        setResults([])
        handleSelectWorker(mapToTrabajadorPersonalData(response)[0])
      }else{
        setSelectedWorker(null)
        setResults(mapToTrabajadorPersonalData(response))
      }
    } else {
      setResults([])
    }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    setError(true)
    setResults([])
  } finally {
    setLoading(false)
  }
}

const mapToTrabajadorPersonalData = (
  data: BuscarTrabajadorResponse[]
): TrabajadorPersonalData[] => {
  return data.map(item => ({
    // Datos Personales
    ci: item.CI.trim(),
    nombre: item.NOMBRE.trim() + " " + item["1er APELLIDO"].trim() + " " + item["2do APELLIDO"].trim(),
    sexo: item.SEXO.trim(),
    edad: item.EDAD,
    estado_civil: item["ESTADO CIVIL"].trim(),
    telefono_fijo: item["TELEFONO FIJO"].trim(),
    telefono_movil: item["TELEFONO MOVIL"].trim(),
    direccion_oficial: item["DIRECCION OFICIAL"].trim(),
    municipio_especial: item["MUNICIPIO OFICIAL"].trim(),
    reparto_direccion_oficial: item["REPARTO DIRECCION OFICIAL"].trim(),
    lugar_nacimiento: item["LUGAR NACIMIENTO"].trim(),
    lic_conduccion: item["LIC. CONDUCCION"].trim(),
    direccion_ueb: item["DIRECCION/UEB"].trim(),
    area: item.AREA.trim(),
    cargo: item.CARGO.trim(),
    // Señas Particulares
    grupo_sanguineo: item["GRUPO SANGUINEO"].trim(),
    color_pelo: item["COLOR PELO"].trim(),
    estatura: item.ESTATURA,
    raza: item.RAZA.trim(),
    color_ojos: item["COLOR OJOS"].trim(),
    // Otros Datos
    talla_pantalon: item["TALLA PANTALON"].trim(),
    talla_blusa_camisa: item["TALLA BLUSA/CAMISA"].trim(),
    talla_calzado: item["TALLA CALZADO"].trim(),
  }));
}

const mapToTrabajadorFamilyData = (
  data: BuscarTrabajadorFamilyDataResponse[]
): TrabajadorFamilyData[] => {
  return data.map(item => ({
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

const mapEstudiosResponse = (
  data: BuscarTrabajadorEstudiosDataResponse[]
): TrabajadorEstudiosData[] => {
  return data.map(item => ({
    fecha_graduado: item["FECHA GRADUADO"],
    idioma: item["IDIOMA"],
    nivel_escolar: item["NIVEL ESCOLAR"],
    otros_estudios: item["OTROS ESTUDIOS"],
    escribe: item["ESCRIBE"],
    ci: item["CI"],
    centro_otros_estudios: item["CENTRO OTROS ESTUDIOS"],
    fecha_otros_estudios: item["FECHA OTROS ESTUDIOS"],
    master_doctor: item["MASTER/DOCTOR"],
    lee: item["LEE"],
    habla: item["HABLA"],
    graduado_de: item["GRADUADO DE"],
    pais: item["PAIS"],
  }))
}

const mapToTrabajadorLaborData = (
  data: BuscarTrabajadorLaborDataResponse[]
): TrabajadorLaborData[] => {
  return data.map((item) => ({
    no: item["No."],
    fecha_baja: item["FECHA BAJA"],
    pcc: item["PCC"],
    grupo_escala: item["GRUPO ESCALA"],
    fecha_alta: item["FECHA ALTA"],
    pago_antiguedad: item["PAGO ANTIGUEDAD"],
    es_imprescindible: item["ES IMPRESCINDIBLE"],
    cargo1: item["CARGO1"]?.trim(),
    cont_cods: item["ContCods"],
    annos_experiencia: item["ANNOS EXPERIENCIA"],
    salario_escala: item["SALARIO ESCALA"],
    categoria_ocupacional: item["CATEGORIA OCUPACIONAL"]?.trim(),
    expediente: item["EXPEDIENTE"]?.trim(),
    regimen_de_pago: item["REGIMEN DE PAGO"]?.trim(),
    pasaporte: item["PASAPORTE"]?.trim(),
    salario: item["SALARIO"],
    cdr: item["CDR"],
    ci: item["CI"],
    fecha_alta_cargo: item["FECHA ALTA CARGO"],
    cargos: item["CARGOS"]?.trim(),
    horas_interrpcion_acum: item["HORAS INTERRPCION ACUM."],
    niv_esc_desc: item["NivEscDesc"]?.trim(),
    fmc: item["FMC"],
    ubicacion_defensa: item["UBICACION DEFENSA"]?.trim(),
    esta_empresa: item["ESTA EMPRESA"]?.trim(),
    detalles_de_ubicacion: item["DETALLES DE UBICACION"]?.trim(),
    asg_no_resol: item["AsgNoResol"]?.trim(),
    ujc: item["UJC"],
    fecha_alta_empresa: item["FECHA ALTA EMPRESA"],
  }))
}


const mapWorkerAchievementsList = (
  data: BuscarTrabajadorMisionesCondecResponse[]
): TrabajadorMisionesCondecData[] => {
  return data.map((item) => ({
    trb_num_iden: item.TrbNumIden,
    fecha_recibida: item["FECHA RECIBIDA"],
    condecoracion: item.CONDECORACION,
    funciones: item.FUNCIONES,
    codigo_mis: item.CODIGOMIS,
    fin_de_mision: item["FIN DE MISION"],
    codigo_cond: item.CODIGOCOND,
    pais: item.PAIS,
    inicio_mision: item["INICIO MISION"],
  }))
}



  return (
    <div className="p-4">
      <ToggleSection title="Buscar Trabajadores" color="blue" variant="minimal" defaultExpanded={true}>
        <div className="space-y-6">
          {/* === Search Form === */}
          <Card className="p-6 bg-white">
            <form onSubmit={handleSubmit}>
              {/* UEB, CI, Nombre */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <Select
                    name="ueb"
                    value={form.ueb}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                    options={UEB_OPTIONS_WITH_PLACEHOLDER}
                  />
                </div>

                <input
                  type="number"
                  name="ci"
                  placeholder="Buscar por CI"
                  value={form.ci}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                />

                <input
                  type="text"
                  name="name"
                  placeholder="Buscar por Nombre y Apellidos"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                />
              </div>

              <h5 className="font-medium text-gray-700">Categorías a mostrar</h5>
              <hr className="my-2" />

              <div className="mb-3">
                <label className="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="allCat"
                    checked={form.allCat}
                    onChange={handleChange}
                    className="form-checkbox h-4 w-4"
                  />
                  <span>Todos</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked readOnly className="form-checkbox h-4 w-4" />
                    <span>Información General</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="family"
                      checked={form.family}
                      onChange={handleChange}
                      className="form-checkbox h-4 w-4"
                    />
                    <span>Información Familiar</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="labor"
                      checked={form.labor}
                      onChange={handleChange}
                      className="form-checkbox h-4 w-4"
                    />
                    <span>Información Laboral</span>
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="studies"
                      checked={form.studies}
                      onChange={handleChange}
                      className="form-checkbox h-4 w-4"
                    />
                    <span>Estudios</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="mision"
                      checked={form.mision}
                      onChange={handleChange}
                      className="form-checkbox h-4 w-4"
                    />
                    <span>Condecoraciones y Misiones</span>
                  </label>
                </div>
              </div>

              <hr className="my-4" />

              <div className="flex justify-end">
                {selectedWorker &&(
                  <button
                    type="button"
                    onClick={goBackToResults}
                    className={`${TEXT_ACTION_CLASS} mr-4`}
                  >
                  Atras
                </button>
                )}
                <button type="submit" className={TEXT_ACTION_CLASS}>
                  {loading ? "Buscando..." : <>Buscar <Search className="ml-2 h-4 w-4" /></>}
                </button>
              </div>
            </form>
          </Card>

          {/* === Results or Details === */}
          <div>
            {loading && <p className="text-gray-500 text-2xl mt-4">Buscando trabajadores...</p>}

            {!loading && error &&<p className="text-[#0a8ca8] text-2xl mt-4">Ha ocurrido un error al realizar la búsqueda. Por favor contacte a un administrador</p>}

            {!loading && !loadingProfile && !error && results?.length == 0 && !selectedWorker && 
            <p className="text-gray-500 text-2xl mt-4">No se encontraron trabajadores con los criterios de búsqueda seleccionados</p>}
            {!loading && results && results?.length > 0 && !selectedWorker && (
              <SearchResultsTable personalData={results} selectWorker={handleSelectWorker} />
            )}
            
            {loadingProfile && (
              <p className="text-gray-500 text-2xl mt-4">Cargando perfil del trabajador...</p>
            )}
            {!loading && !loadingProfile && selectedWorker && (
              <WorkerProfile
                worker={selectedWorker}
                ueb={form.ueb}
                laborData={selectedWorkerLaborData}
                estudiosData={selectedWorkerStudiesData}
                familiarData={selectedWorkerFamliyData}
                misiones={selectedWorkerMissionData}
        />
            )}
          </div>
        </div>
      </ToggleSection>
    </div>
  )
}

export default BuscarTrabajador
