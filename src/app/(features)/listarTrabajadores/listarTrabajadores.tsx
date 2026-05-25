"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronUp, FileSpreadsheet, FileText, Loader2, Search } from "lucide-react"
import ListarTrabajadoresActions from "./listarTrabajadoresActions"
import {
  filtrarTrabajadores,
  getListarTrabajadoresOptions,
  getSubCategoriasCientificas,
  ListarTrabajadoresFilterOptions,
  ListarTrabajadoresFiltersPayload,
  ListarTrabajadoresResponse,
  SelectOption,
} from "@/app/lib/api/listarTrabajadores"
import { getDireccionesPorUeb } from "@/app/lib/api/external_service"
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

const NON_NEGATIVE_NUMBER_FIELDS: Array<keyof FilterFormState> = [
  "edad",
  "hijos",
  "experiencia",
]

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
  "px-2 py-2 text-sm font-semibold text-white hover:text-black disabled:text-gray-400 disabled:cursor-not-allowed bg-[#0a8ca8]"

const RESULTS_EXPORT_BUTTON_CLASS =
  "inline-flex h-9 items-center gap-2 whitespace-nowrap text-sm font-semibold text-[#0a8ca8] hover:text-[#08778f] disabled:cursor-not-allowed disabled:text-gray-400"

type ResultsExportRow = {
  nombre: string
  ci: string
  direccion_ueb: string
  area: string
}

const RESULTS_EXPORT_COLUMNS: Array<{ key: keyof ResultsExportRow; label: string }> = [
  { key: "nombre", label: "Nombre y Apellidos" },
  { key: "ci", label: "CI" },
  { key: "direccion_ueb", label: "Direccion UEB" },
  { key: "area", label: "Area" },
]

const escapeHtmlValue = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")

const toPdfAsciiText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/\s+/g, " ")
    .trim()

const escapePdfLiteralString = (value: string) =>
  value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)")

const toPdfNumber = (value: number) => {
  if (Number.isInteger(value)) {
    return `${value}`
  }

  return value.toFixed(2).replace(/\.?0+$/, "")
}

const toPdfRgb = (r: number, g: number, b: number) =>
  `${(r / 255).toFixed(3)} ${(g / 255).toFixed(3)} ${(b / 255).toFixed(3)}`

const PDF_CHAR_WIDTH_FACTOR = 0.6

const estimatePdfTextWidth = (text: string, fontSize: number) =>
  text.length * fontSize * PDF_CHAR_WIDTH_FACTOR

const splitWordForPdf = (word: string, maxCharsPerLine: number) => {
  if (maxCharsPerLine <= 1) {
    return word.split("")
  }

  const parts: string[] = []
  let remaining = word
  const chunkSize = maxCharsPerLine - 1

  while (remaining.length > maxCharsPerLine) {
    parts.push(`${remaining.slice(0, chunkSize)}-`)
    remaining = remaining.slice(chunkSize)
  }

  if (remaining.length > 0) {
    parts.push(remaining)
  }

  return parts
}

const wrapPdfCellText = (value: string, maxCharsPerLine: number) => {
  const normalized = toPdfAsciiText(value || "-").toUpperCase()

  if (!normalized) {
    return ["-"]
  }

  const words = normalized.split(" ")
  const lines: string[] = []
  let currentLine = ""

  for (const rawWord of words) {
    if (!rawWord) {
      continue
    }

    const wordParts =
      rawWord.length > maxCharsPerLine
        ? splitWordForPdf(rawWord, maxCharsPerLine)
        : [rawWord]

    for (const part of wordParts) {
      const candidate = currentLine ? `${currentLine} ${part}` : part

      if (candidate.length <= maxCharsPerLine) {
        currentLine = candidate
        continue
      }

      if (currentLine) {
        lines.push(currentLine)
      }
      currentLine = part
    }
  }

  if (currentLine) {
    lines.push(currentLine)
  }

  return lines.length ? lines : ["-"]
}

const buildResultsPdfBlob = (rows: ResultsExportRow[]) => {
  type PdfTableColumn = {
    key: keyof ResultsExportRow
    label: string
    width: number
    headerAlign: "left" | "center"
    bodyAlign: "left" | "center"
  }

  const columns: PdfTableColumn[] = [
    { key: "nombre", label: "Nombre y Apellidos", width: 145, headerAlign: "left", bodyAlign: "left" },
    { key: "ci", label: "CI", width: 72, headerAlign: "center", bodyAlign: "center" },
    { key: "direccion_ueb", label: "Direccion", width: 160, headerAlign: "center", bodyAlign: "left" },
    { key: "area", label: "Area", width: 162, headerAlign: "center", bodyAlign: "left" },
  ]

  const pageWidth = 595
  const pageHeight = 842
  const marginX = 28
  const topMargin = 40
  const bottomMargin = 42
  const tableWidth = columns.reduce((sum, column) => sum + column.width, 0)
  const tableX = (pageWidth - tableWidth) / 2
  const titleY = pageHeight - 62
  const tableStartY = pageHeight - 108
  const headerHeight = 24
  const minRowHeight = 22
  const bodyFontSize = 9
  const headerFontSize = 9.5
  const titleFontSize = 17
  const cellPaddingX = 5
  const cellPaddingY = 5
  const lineHeight = 10.5
  const maxCharsPerLineByColumn = columns.map((column) =>
    Math.max(1, Math.floor((column.width - cellPaddingX * 2) / (bodyFontSize * PDF_CHAR_WIDTH_FACTOR))),
  )

  const preparedRows = rows.map((row) => {
    const cellLinesByColumn = columns.map((column, index) =>
      wrapPdfCellText(row[column.key] || "-", maxCharsPerLineByColumn[index]),
    )
    const maxLines = Math.max(...cellLinesByColumn.map((lines) => lines.length))
    const rowHeight = Math.max(minRowHeight, cellPaddingY * 2 + maxLines * lineHeight)

    return {
      cellLinesByColumn,
      rowHeight,
    }
  })

  const commandsByPage: string[] = []
  const totalPagesEstimate = Math.max(1, preparedRows.length)

  const drawCenteredText = (
    commands: string[],
    text: string,
    centerX: number,
    baselineY: number,
    fontRef: "F1" | "F2",
    fontSize: number,
    rgb: [number, number, number],
  ) => {
    const normalized = toPdfAsciiText(text)
    const textWidth = estimatePdfTextWidth(normalized, fontSize)
    const x = centerX - textWidth / 2
    commands.push(
      `BT /${fontRef} ${toPdfNumber(fontSize)} Tf ${toPdfRgb(rgb[0], rgb[1], rgb[2])} rg ${toPdfNumber(x)} ${toPdfNumber(baselineY)} Td (${escapePdfLiteralString(normalized)}) Tj ET`,
    )
  }

  const drawTextInCell = (
    commands: string[],
    lines: string[],
    x: number,
    yTop: number,
    width: number,
    rowHeight: number,
    align: "left" | "center",
    fontRef: "F1" | "F2",
    fontSize: number,
    rgb: [number, number, number],
  ) => {
    const firstLineY = yTop - cellPaddingY - fontSize

    lines.forEach((line, lineIndex) => {
      const lineWidth = estimatePdfTextWidth(line, fontSize)
      const y = firstLineY - lineIndex * lineHeight

      if (y < yTop - rowHeight + cellPaddingY) {
        return
      }

      let textX = x + cellPaddingX
      if (align === "center") {
        textX = x + width / 2 - lineWidth / 2
      }

      commands.push(
        `BT /${fontRef} ${toPdfNumber(fontSize)} Tf ${toPdfRgb(rgb[0], rgb[1], rgb[2])} rg ${toPdfNumber(textX)} ${toPdfNumber(y)} Td (${escapePdfLiteralString(line)}) Tj ET`,
      )
    })
  }

  const drawHeader = (commands: string[], yTop: number) => {
    const headerBottom = yTop - headerHeight

    commands.push(`${toPdfRgb(33, 57, 79)} rg ${toPdfNumber(tableX)} ${toPdfNumber(headerBottom)} ${toPdfNumber(tableWidth)} ${toPdfNumber(headerHeight)} re f`)
    commands.push(`0.5 w ${toPdfRgb(65, 84, 103)} RG`)

    let xCursor = tableX
    columns.forEach((column) => {
      commands.push(`${toPdfNumber(xCursor)} ${toPdfNumber(headerBottom)} ${toPdfNumber(column.width)} ${toPdfNumber(headerHeight)} re S`)
      const text = toPdfAsciiText(column.label).toUpperCase()
      const textWidth = estimatePdfTextWidth(text, headerFontSize)
      const textX =
        column.headerAlign === "center"
          ? xCursor + column.width / 2 - textWidth / 2
          : xCursor + cellPaddingX
      const textY = yTop - cellPaddingY - headerFontSize

      commands.push(
        `BT /F2 ${toPdfNumber(headerFontSize)} Tf 1 1 1 rg ${toPdfNumber(textX)} ${toPdfNumber(textY)} Td (${escapePdfLiteralString(text)}) Tj ET`,
      )

      xCursor += column.width
    })
  }

  let currentRowIndex = 0
  while (currentRowIndex < preparedRows.length || commandsByPage.length === 0) {
    const commands: string[] = []
    drawCenteredText(
      commands,
      "Datos Trabajadores",
      pageWidth / 2,
      titleY,
      "F2",
      titleFontSize,
      [0, 0, 0],
    )

    let yCursorTop = tableStartY
    drawHeader(commands, yCursorTop)
    yCursorTop -= headerHeight

    while (currentRowIndex < preparedRows.length) {
      const preparedRow = preparedRows[currentRowIndex]
      const nextRowBottom = yCursorTop - preparedRow.rowHeight

      if (nextRowBottom < bottomMargin) {
        break
      }

      const rowFillColor = currentRowIndex % 2 === 0 ? [240, 242, 244] : [255, 255, 255]
      commands.push(
        `${toPdfRgb(rowFillColor[0], rowFillColor[1], rowFillColor[2])} rg ${toPdfNumber(tableX)} ${toPdfNumber(nextRowBottom)} ${toPdfNumber(tableWidth)} ${toPdfNumber(preparedRow.rowHeight)} re f`,
      )
      commands.push(`0.45 w ${toPdfRgb(219, 222, 226)} RG`)

      let xCursor = tableX
      columns.forEach((column, columnIndex) => {
        commands.push(
          `${toPdfNumber(xCursor)} ${toPdfNumber(nextRowBottom)} ${toPdfNumber(column.width)} ${toPdfNumber(preparedRow.rowHeight)} re S`,
        )

        drawTextInCell(
          commands,
          preparedRow.cellLinesByColumn[columnIndex],
          xCursor,
          yCursorTop,
          column.width,
          preparedRow.rowHeight,
          column.bodyAlign,
          "F1",
          bodyFontSize,
          [0, 0, 0],
        )

        xCursor += column.width
      })

      yCursorTop = nextRowBottom
      currentRowIndex += 1
    }

    commandsByPage.push(commands.join("\n"))

    if (currentRowIndex >= preparedRows.length) {
      break
    }

    if (commandsByPage.length > totalPagesEstimate + 5) {
      break
    }
  }

  const pagesCount = commandsByPage.length
  const catalogObjectNumber = 1
  const pagesObjectNumber = 2
  const regularFontObjectNumber = 3
  const boldFontObjectNumber = 4
  const firstPageObjectNumber = 5
  const objectMap = new Map<number, string>()

  objectMap.set(catalogObjectNumber, `<< /Type /Catalog /Pages ${pagesObjectNumber} 0 R >>`)

  const pageReferences: string[] = []
  for (let pageIndex = 0; pageIndex < pagesCount; pageIndex += 1) {
    const pageObjectNumber = firstPageObjectNumber + pageIndex * 2
    pageReferences.push(`${pageObjectNumber} 0 R`)
  }

  objectMap.set(
    pagesObjectNumber,
    `<< /Type /Pages /Kids [${pageReferences.join(" ")}] /Count ${pagesCount} >>`,
  )
  objectMap.set(regularFontObjectNumber, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")
  objectMap.set(boldFontObjectNumber, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>")

  commandsByPage.forEach((pageCommands, pageIndex) => {
    const pageObjectNumber = firstPageObjectNumber + pageIndex * 2
    const contentObjectNumber = pageObjectNumber + 1
    const streamContent = `${pageCommands}\n`

    objectMap.set(
      pageObjectNumber,
      `<< /Type /Page /Parent ${pagesObjectNumber} 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${regularFontObjectNumber} 0 R /F2 ${boldFontObjectNumber} 0 R >> >> /Contents ${contentObjectNumber} 0 R >>`,
    )
    objectMap.set(
      contentObjectNumber,
      `<< /Length ${streamContent.length} >>\nstream\n${streamContent}endstream`,
    )
  })

  const maxObjectNumber = Math.max(...Array.from(objectMap.keys()))
  const objectOffsets = new Array<number>(maxObjectNumber + 1).fill(0)
  let pdf = "%PDF-1.4\n"

  for (let objectNumber = 1; objectNumber <= maxObjectNumber; objectNumber += 1) {
    const objectContent = objectMap.get(objectNumber)

    if (!objectContent) {
      continue
    }

    objectOffsets[objectNumber] = pdf.length
    pdf += `${objectNumber} 0 obj\n${objectContent}\nendobj\n`
  }

  const xrefOffset = pdf.length
  pdf += `xref\n0 ${maxObjectNumber + 1}\n`
  pdf += "0000000000 65535 f \n"

  for (let objectNumber = 1; objectNumber <= maxObjectNumber; objectNumber += 1) {
    const offset = objectOffsets[objectNumber]

    if (offset > 0) {
      pdf += `${String(offset).padStart(10, "0")} 00000 n \n`
    } else {
      pdf += "0000000000 00000 f \n"
    }
  }

  pdf += `trailer\n<< /Size ${maxObjectNumber + 1} /Root ${catalogObjectNumber} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`

  return new Blob([pdf], { type: "application/pdf" })
}

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

const toUnknownList = (value: unknown) => {
  if (Array.isArray(value)) {
    return value
  }
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>)
  }
  return []
}

const uniqueSelectOptions = (options: SelectOption[]) => {
  const uniqueOptions: SelectOption[] = []
  const seen = new Set<string>()

  for (const option of options) {
    const key = `${option.value}|${option.label}`.toUpperCase()
    if (seen.has(key)) {
      continue
    }
    seen.add(key)
    uniqueOptions.push(option)
  }

  return uniqueOptions
}

const mapDireccionesToOptions = (direcciones: unknown) => {
  const areasByDireccion: Record<string, SelectOption[]> = {}

  const parsedOptions = toUnknownList(direcciones)
    .map((direccion) => {
      if (!direccion || typeof direccion !== "object") {
        return null
      }

      const direccionRecord = direccion as Record<string, unknown>
      const areas = toUnknownList(direccionRecord.Area).filter(
        (area): area is Record<string, unknown> =>
          Boolean(area) && typeof area === "object",
      )
      const firstArea = areas[0]

      const value = firstArea ? getWorkerValue(firstArea, ["EstNV1"]) : ""
      const label = getWorkerValue(direccionRecord, ["Unidad"]) ||
        (firstArea ? getWorkerValue(firstArea, ["Unidad"]) : "")

      if (!value || !label) {
        return null
      }

      areasByDireccion[value] = uniqueSelectOptions(
        areas
          .map((area) => {
            const areaName = getWorkerValue(area, ["Area"])
            return areaName ? { value: areaName, label: areaName } : null
          })
          .filter((area): area is SelectOption => area !== null),
      )

      return {
        value,
        label,
      }
    })
    .filter((option): option is SelectOption => option !== null)

  return {
    direcciones: uniqueSelectOptions(parsedOptions),
    areasByDireccion,
  }
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
  const [areasByDireccion, setAreasByDireccion] = useState<Record<string, SelectOption[]>>({})
  const [subCategorias, setSubCategorias] = useState<SelectOption[]>([])
  const direccionesRequestIdRef = useRef(0)
  const lastDireccionesFetchUebRef = useRef("")
  const filterOptionsRequestIdRef = useRef(0)
  const lastFilterOptionsFetchUebRef = useRef("")
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
  const [isExportingResultsXls, setIsExportingResultsXls] = useState(false)
  const [isExportingResultsPdf, setIsExportingResultsPdf] = useState(false)

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const loadDireccionesForUeb = async (ueb: string, requestId: number) => {
    try {
      const direccionesResponse = await getDireccionesPorUeb(ueb)
      if (requestId !== direccionesRequestIdRef.current) {
        return
      }
      const mappedDirecciones = mapDireccionesToOptions(direccionesResponse)
      setOptions((prev) => ({
        ...prev,
        direcciones: mappedDirecciones.direcciones,
      }))
      setAreasByDireccion(mappedDirecciones.areasByDireccion)
    } catch (error) {
      if (requestId !== direccionesRequestIdRef.current) {
        return
      }
      console.error(error)
      setOptions((prev) => ({
        ...prev,
        direcciones: [],
      }))
      setAreasByDireccion({})
      setErrorMessage("No se pudieron cargar las direcciones para la UEB seleccionada.")
    }
  }

  const loadFilterOptionsForUeb = async (ueb: string, requestId: number) => {
    try {
      setLoadingOptions(true)
      const response = await getListarTrabajadoresOptions(ueb)

      if (requestId !== filterOptionsRequestIdRef.current) {
        return
      }

      setOptions((prev) => ({
        ...prev,
        municipios: response.municipios ?? [],
        nivelEscolar: response.nivelEscolar ?? [],
        cargos: response.cargos ?? [],
        categoriasCientificas: response.categoriasCientificas ?? [],
      }))
    } catch (error) {
      if (requestId !== filterOptionsRequestIdRef.current) {
        return
      }

      console.error(error)
      setOptions((prev) => ({
        ...prev,
        municipios: [],
        nivelEscolar: [],
        cargos: [],
        categoriasCientificas: [],
      }))
      setSubCategorias([])
      setErrorMessage("No se pudieron cargar las opciones de filtros.")
    } finally {
      if (requestId === filterOptionsRequestIdRef.current) {
        setLoadingOptions(false)
      }
    }
  }

  useEffect(() => {
    if (!expandedSections.filtrar) {
      return
    }

    const shouldLoadDirecciones = lastDireccionesFetchUebRef.current !== form.uebSelect
    const shouldLoadFilterOptions =
      lastFilterOptionsFetchUebRef.current !== form.uebSelect

    if (!shouldLoadDirecciones && !shouldLoadFilterOptions) {
      return
    }

    if (shouldLoadDirecciones) {
      const direccionesRequestId = direccionesRequestIdRef.current + 1
      direccionesRequestIdRef.current = direccionesRequestId
      lastDireccionesFetchUebRef.current = form.uebSelect
      setOptions((prev) => ({
        ...prev,
        direcciones: [],
      }))
      setAreas([])
      setAreasByDireccion({})
      void loadDireccionesForUeb(form.uebSelect, direccionesRequestId)
    }

    if (shouldLoadFilterOptions) {
      const optionsRequestId = filterOptionsRequestIdRef.current + 1
      filterOptionsRequestIdRef.current = optionsRequestId
      lastFilterOptionsFetchUebRef.current = form.uebSelect
      setOptions((prev) => ({
        ...prev,
        municipios: [],
        nivelEscolar: [],
        cargos: [],
        categoriasCientificas: [],
      }))
      setSubCategorias([])
      void loadFilterOptionsForUeb(form.uebSelect, optionsRequestId)
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
    let value = type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value

    if (type === "number" && NON_NEGATIVE_NUMBER_FIELDS.includes(fieldName)) {
      const numericValue = Number((e.target as HTMLInputElement).value)
      if (!Number.isNaN(numericValue) && numericValue < 0) {
        value = "0"
      }
    }

    if (fieldName === "uebSelect") {
      const nextUeb = value as string
      const direccionesRequestId = direccionesRequestIdRef.current + 1
      direccionesRequestIdRef.current = direccionesRequestId
      const optionsRequestId = filterOptionsRequestIdRef.current + 1
      filterOptionsRequestIdRef.current = optionsRequestId

      setForm((prev) => ({
        ...prev,
        uebSelect: nextUeb,
        direccionFSelect: "0",
        areaSelect: "",
        municipioSelect: "",
        nescolar: "",
        cargo: "",
        cat_cient: "",
        sub_cat_cient: "",
      }))
      setOptions(EMPTY_OPTIONS)
      setAreas([])
      setAreasByDireccion({})
      setSubCategorias([])
      setResults(null)
      setErrorMessage("")
      lastDireccionesFetchUebRef.current = nextUeb
      lastFilterOptionsFetchUebRef.current = nextUeb

      if (expandedSections.filtrar) {
        void loadDireccionesForUeb(nextUeb, direccionesRequestId)
        void loadFilterOptionsForUeb(nextUeb, optionsRequestId)
      }
      return
    }

    updateForm(fieldName, value)

    if (fieldName === "direccionFSelect") {
      const direccionValue = value as string
      setResults(null)
      setForm((prev) => ({ ...prev, areaSelect: "" }))

      if (direccionValue === "0") {
        setAreas([])
        return
      }

      setAreas(areasByDireccion[direccionValue] ?? [])
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

  const handleClearFilters = () => {
    const direccionesRequestId = direccionesRequestIdRef.current + 1
    direccionesRequestIdRef.current = direccionesRequestId
    const optionsRequestId = filterOptionsRequestIdRef.current + 1
    filterOptionsRequestIdRef.current = optionsRequestId

    setForm(INITIAL_FORM)
    setOptions(EMPTY_OPTIONS)
    setAreas([])
    setAreasByDireccion({})
    setSubCategorias([])
    setResults(null)
    setErrorMessage("")
    setLoadingProfile(false)
    setSelectedWorker(null)
    setSelectedWorkerFamliyData(null)
    setSelectedWorkerStudiesData(null)
    setSelectedWorkerLaborData(null)
    setSelectedWorkerMissionData(null)
    lastDireccionesFetchUebRef.current = INITIAL_FORM.uebSelect
    lastFilterOptionsFetchUebRef.current = INITIAL_FORM.uebSelect

    if (expandedSections.filtrar) {
      void loadDireccionesForUeb(INITIAL_FORM.uebSelect, direccionesRequestId)
      void loadFilterOptionsForUeb(INITIAL_FORM.uebSelect, optionsRequestId)
    }
  }

  const mappedWorkers: TrabajadorPersonalData[] = results
    ? results.trabajadores.map((worker) => mapWorkerRecordToPersonalData(worker))
    : []

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", filename)
    document.body.appendChild(link)
    link.click()
    link.parentNode?.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const getResultsExportRows = (): ResultsExportRow[] =>
    mappedWorkers.map((worker) => ({
      nombre: worker.nombre || "-",
      ci: worker.ci || "-",
      direccion_ueb: worker.direccion_ueb || "-",
      area: worker.area || "-",
    }))

  const handleExportResultsExcel = () => {
    try {
      setErrorMessage("")
      setIsExportingResultsXls(true)
      const rows = getResultsExportRows()

      if (rows.length === 0) {
        setErrorMessage("No hay resultados para exportar.")
        return
      }

      const colgroupHtml =
        "<colgroup>" +
        "<col style='width:40%;' />" +
        "<col style='width:20%;' />" +
        "<col style='width:20%;' />" +
        "<col style='width:20%;' />" +
        "</colgroup>"
      const titleRowHtml = `<tr><th colspan="${RESULTS_EXPORT_COLUMNS.length}" style="text-align:center;border:none;font-size:16px;padding:12px 0;width:100%;">Datos Trabajadores</th></tr>`
      const headerRowHtml = `<tr>${RESULTS_EXPORT_COLUMNS.map((column) => `<th style="border:1px solid #d1d5db;padding:6px 8px;text-align:left;background:#e5e7eb;">${escapeHtmlValue(column.label)}</th>`).join("")}</tr>`
      const bodyRowsHtml = rows
        .map(
          (row) =>
            `<tr>${RESULTS_EXPORT_COLUMNS.map((column) => `<td style="border:1px solid #d1d5db;padding:6px 8px;text-align:left;">${escapeHtmlValue(row[column.key])}</td>`).join("")}</tr>`,
        )
        .join("")

      const excelHtml = `
        <!doctype html>
        <html lang="es">
          <head>
            <meta charset="utf-8" />
          </head>
          <body>
            <table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:12px;min-width:720px;width:100%;table-layout:fixed;">
              ${colgroupHtml}
              ${titleRowHtml}
              ${headerRowHtml}
              ${bodyRowsHtml}
            </table>
          </body>
        </html>
      `

      const blob = new Blob([excelHtml], {
        type: "application/vnd.ms-excel;charset=utf-8;",
      })
      const dateLabel = new Date().toISOString().split("T")[0]

      triggerDownload(blob, `trabajadores_filtrados_${dateLabel}.xls`)
    } catch (error) {
      console.error("Error al exportar resultados en Excel:", error)
      setErrorMessage("No se pudieron exportar los resultados en Excel.")
    } finally {
      setIsExportingResultsXls(false)
    }
  }

  const handleExportResultsPdf = () => {
    try {
      setErrorMessage("")
      setIsExportingResultsPdf(true)
      const rows = getResultsExportRows()

      if (rows.length === 0) {
        setErrorMessage("No hay resultados para exportar.")
        return
      }
      const blob = buildResultsPdfBlob(rows)
      const dateLabel = new Date().toISOString().split("T")[0]
      triggerDownload(blob, `trabajadores_filtrados_${dateLabel}.pdf`)
    } catch (error) {
      console.error("Error al exportar resultados en PDF:", error)
      setErrorMessage("No se pudieron exportar los resultados en PDF.")
    } finally {
      setIsExportingResultsPdf(false)
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

  const renderResultsContent = () => {
    if (loadingProfile) {
      return <p className="text-sm text-gray-600 mt-4">Cargando perfil del trabajador...</p>
    }

    if (selectedWorker) {
      return (
        <div className="mt-6">
          <WorkerProfile
            worker={selectedWorker}
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
        <div className="px-4 py-2 border-x border-b border-gray-200 flex flex-wrap items-center gap-4 bg-white">
          <span className="text-sm text-gray-700 font-semibold">Exportar resultados:</span>
          <button
            type="button"
            onClick={handleExportResultsExcel}
            disabled={isExportingResultsXls || isExportingResultsPdf}
            className={RESULTS_EXPORT_BUTTON_CLASS}
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>{isExportingResultsXls ? "Exportando..." : "Excel"}</span>
          </button>
          <button
            type="button"
            onClick={handleExportResultsPdf}
            disabled={isExportingResultsXls || isExportingResultsPdf}
            className={RESULTS_EXPORT_BUTTON_CLASS}
          >
            <FileText className="h-4 w-4" />
            <span>{isExportingResultsPdf ? "Exportando..." : "PDF"}</span>
          </button>
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
                  <label className="block text-sm text-gray-700 mb-1 font-bold">UEB</label>
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
                  <label className="block text-sm text-gray-700 mb-1 font-bold">Dirección</label>
                  <select
                    name="direccionFSelect"
                    value={form.direccionFSelect}
                    onChange={handleSelectOrInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="0">Seleccionar Dirección...</option>
                    {options.direcciones.map((direccion) => (
                      <option key={direccion.value} value={direccion.value}>
                        {direccion.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1 font-bold">Área</label>
                  <select
                    name="areaSelect"
                    value={form.areaSelect}
                    onChange={handleSelectOrInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    disabled={areas.length === 0}
                  >
                    <option value="">Seleccionar Área...</option>
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
                  <label className="block text-sm text-gray-700 mb-1 font-bold">Municipio</label>
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
                  <label className="block text-sm text-gray-700 mb-1 font-bold">Reparto</label>
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
                  <label className="block text-sm text-gray-700 mb-1 font-bold">Sexo</label>
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
                  <label className="block text-sm text-gray-700 mb-1 font-bold">Edad</label>
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
                      min={0}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1 font-bold">Cantidad de Hijos</label>
                  <input
                    type="number"
                    name="hijos"
                    value={form.hijos}
                    onChange={handleSelectOrInputChange}
                    min={0}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1 font-bold">Grupo Sanguíneo</label>
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
                  <label className="block text-sm text-gray-700 mb-1 font-bold">Nivel Escolar</label>
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
                  <label className="block text-sm text-gray-700 mb-1 font-bold">Raza</label>
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
                  <label className="block text-sm text-gray-700 mb-1 font-bold">Carrera</label>
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
                  <label className="block text-sm text-gray-700 mb-1 font-bold">Talla Camisa/Blusa</label>
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
                  <label className="block text-sm text-gray-700 mb-1 font-bold">Talla Pantalón</label>
                  <input
                    type="text"
                    name="pantalon"
                    value={form.pantalon}
                    onChange={handleSelectOrInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1 font-bold">Talla Zapato</label>
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
                <label className="flex items-center gap-2 font-bold">
                  <input
                    type="checkbox"
                    name="pcc"
                    checked={form.pcc}
                    onChange={handleSelectOrInputChange}
                  />
                  PCC
                </label>
                <label className="flex items-center gap-2 font-bold">
                  <input
                    type="checkbox"
                    name="ujc"
                    checked={form.ujc}
                    onChange={handleSelectOrInputChange}
                  />
                  UJC
                </label>
                <label className="flex items-center gap-2 font-bold">
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
                <label className="flex items-center gap-2 text-sm text-gray-700 font-bold">
                  <input
                    type="checkbox"
                    name="licConduc"
                    checked={form.licConduc}
                    onChange={handleSelectOrInputChange}
                  />
                  Licencia de Conducción
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 font-bold">
                  <input
                    type="checkbox"
                    name="auto"
                    checked={form.auto}
                    onChange={handleSelectOrInputChange}
                  />
                  Tiene Auto
                </label>
                <div>
                  <label className="block text-sm text-gray-700 mb-1 font-bold">Master/Doctor</label>
                  <select
                    name="master"
                    value={form.master}
                    onChange={handleSelectOrInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="">Seleccionar Opción...</option>
                    <option value="Master">Master</option>
                    <option value="Doctor">Doctor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1 font-bold">Fecha de Graduación</label>
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
                  <label className="block text-sm text-gray-700 mb-1 font-bold">Fecha Alta Empresa</label>
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
                  <label className="block text-sm text-gray-700 mb-1">Años de Experiencia</label>
                  <input
                    type="number"
                    name="experiencia"
                    value={form.experiencia}
                    onChange={handleSelectOrInputChange}
                    min={0}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1 font-bold">Cargo</label>
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
                  <label className="block text-sm text-gray-700 mb-1 font-bold">Ubicación en la Defensa</label>
                  <select
                    name="ubicDef"
                    value={form.ubicDef}
                    onChange={handleSelectOrInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="">Seleccionar Ubicación...</option>
                    <option value="BPD">BPD</option>
                    <option value="No Incorporado">No Incorporado</option>
                    <option value="MTT">MTT</option>
                    <option value="Unidad Militar">Unidad Militar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1 font-bold">Categoría Científica</label>
                  <select
                    name="cat_cient"
                    value={form.cat_cient}
                    onChange={handleSelectOrInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="">Seleccionar Categoría...</option>
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
                  <label className="block text-sm text-gray-700 mb-1 font-bold">Sub Categoría Científica</label>
                  <select
                    name="sub_cat_cient"
                    value={form.sub_cat_cient}
                    onChange={handleSelectOrInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    disabled={subCategorias.length === 0}
                  >
                    <option value="">Seleccionar Sub Categoría...</option>
                    {subCategorias.map((subCategoria) => (
                      <option key={subCategoria.value} value={subCategoria.value}>
                        {subCategoria.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                {selectedWorker && (
                  <button
                    type="button"
                    onClick={goBackToResults}
                    className={TEXT_ACTION_CLASS}
                  >
                    Atras
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleClearFilters}
                  disabled={loadingResults || loadingOptions}
                  className={TEXT_ACTION_CLASS}
                >
                  Limpiar filtros
                </button>
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
