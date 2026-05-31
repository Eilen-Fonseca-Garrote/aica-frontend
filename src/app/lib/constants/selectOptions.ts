export interface SharedSelectOption {
  label: string
  value: string
  disabled?: boolean
}

export const UEB_OPTIONS: SharedSelectOption[] = [
  { label: "AICA", value: "16" },
  { label: "LIORAD", value: "25" },
  { label: "CITOX", value: "100" },
  { label: "JULIO TRIGO", value: "55" },
  { label: "SH+", value: "57" },
]

export const UEB_OPTIONS_WITH_ALL: SharedSelectOption[] = [
  { label: "Todas las UEBs", value: "0" },
  ...UEB_OPTIONS,
]

export const UEB_OPTIONS_WITH_PLACEHOLDER: SharedSelectOption[] = [
  { label: "Seleccionar UEB...", value: "" },
  ...UEB_OPTIONS,
]

export const SEX_OPTIONS: SharedSelectOption[] = [
  { label: "Femenino", value: "F" },
  { label: "Masculino", value: "M" },
]

export const SEX_OPTIONS_WITH_PLACEHOLDER: SharedSelectOption[] = [
  { label: "Seleccionar Sexo...", value: "" },
  ...SEX_OPTIONS,
]

export const BLOOD_GROUP_OPTIONS: SharedSelectOption[] = [
  { label: "O+", value: "O+" },
  { label: "O-", value: "O-" },
  { label: "A+", value: "A+" },
  { label: "A-", value: "A-" },
  { label: "B+", value: "B+" },
  { label: "B-", value: "B-" },
  { label: "AB+", value: "AB+" },
  { label: "AB-", value: "AB-" },
]

export const BLOOD_GROUP_OPTIONS_WITH_PLACEHOLDER: SharedSelectOption[] = [
  { label: "Seleccionar Grupo...", value: "" },
  ...BLOOD_GROUP_OPTIONS,
]

export const RACE_OPTIONS: SharedSelectOption[] = [
  { label: "Blanca", value: "Blanca" },
  { label: "Mestiza", value: "Mestiza" },
  { label: "Negra", value: "Negra" },
]

export const RACE_OPTIONS_WITH_PLACEHOLDER: SharedSelectOption[] = [
  { label: "Seleccionar Raza...", value: "" },
  ...RACE_OPTIONS,
]

export const SHIRT_SIZE_OPTIONS: SharedSelectOption[] = [
  { label: "XS", value: "XS" },
  { label: "S", value: "S" },
  { label: "M", value: "M" },
  { label: "L", value: "L" },
  { label: "XL", value: "XL" },
  { label: "XXL", value: "XXL" },
]

export const SHIRT_SIZE_OPTIONS_WITH_PLACEHOLDER: SharedSelectOption[] = [
  { label: "Seleccionar Talla...", value: "" },
  ...SHIRT_SIZE_OPTIONS,
]

export const SHOE_SIZE_OPTIONS: SharedSelectOption[] = [
  "34",
  "35",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
  "47",
].map((value) => ({ label: value, value }))

export const SHOE_SIZE_OPTIONS_WITH_PLACEHOLDER: SharedSelectOption[] = [
  { label: "Seleccionar Talla...", value: "" },
  ...SHOE_SIZE_OPTIONS,
]

export const MASTER_DOCTOR_OPTIONS: SharedSelectOption[] = [
  { label: "Master", value: "Master" },
  { label: "Doctor", value: "Doctor" },
]

export const MASTER_DOCTOR_OPTIONS_WITH_PLACEHOLDER: SharedSelectOption[] = [
  { label: "Seleccionar Opción...", value: "" },
  ...MASTER_DOCTOR_OPTIONS,
]

export const DEFENSE_LOCATION_OPTIONS: SharedSelectOption[] = [
  { label: "BPD", value: "BPD" },
  { label: "No Incorporado", value: "No Incorporado" },
  { label: "MTT", value: "MTT" },
  { label: "Unidad Militar", value: "Unidad Militar" },
]

export const DEFENSE_LOCATION_OPTIONS_WITH_PLACEHOLDER: SharedSelectOption[] = [
  { label: "Seleccionar Ubicación...", value: "" },
  ...DEFENSE_LOCATION_OPTIONS,
]
