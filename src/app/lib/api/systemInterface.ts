import { apiClient } from "./client"

export type SystemInterfaceConfig = {
  id: string | null
  logo: string
  favicon: string
  primaryColor: string
  sidebarColor: string
}

export type SystemInterfacePayload = Omit<SystemInterfaceConfig, "id">

export const DEFAULT_SYSTEM_INTERFACE_CONFIG: SystemInterfaceConfig = {
  id: null,
  logo: "/img/aica-logo.jpg",
  favicon: "/favicon.ico",
  primaryColor: "#0a8ca8",
  sidebarColor: "#0B1A20",
}

export const PREDEFINED_COLORS = {
  primary: ["#0a8ca8", "#08778f", "#0f766e", "#2563eb", "#d97706", "#dc2626"],
  sidebar: ["#0B1A20", "#111827", "#1f2937", "#263037", "#164e63", "#3f2d20"],
}

export const ALLOWED_IMAGE_TYPES = {
  logo: ["image/jpeg", "image/png", "image/svg+xml", "image/webp"],
  favicon: ["image/x-icon", "image/vnd.microsoft.icon", "image/png", "image/svg+xml"],
}

export const MAX_FILE_SIZES = {
  logo: 5 * 1024 * 1024,
  favicon: 1 * 1024 * 1024,
}

const localOrAbsoluteResourceRegex = /^(https?:|data:|blob:|\/)/i

export function normalizeSystemInterfaceConfig(
  data?: Partial<SystemInterfaceConfig> | null
): SystemInterfaceConfig {
  return {
    id: data?.id || null,
    logo: data?.logo || DEFAULT_SYSTEM_INTERFACE_CONFIG.logo,
    favicon: data?.favicon || DEFAULT_SYSTEM_INTERFACE_CONFIG.favicon,
    primaryColor: data?.primaryColor || DEFAULT_SYSTEM_INTERFACE_CONFIG.primaryColor,
    sidebarColor: data?.sidebarColor || DEFAULT_SYSTEM_INTERFACE_CONFIG.sidebarColor,
  }
}

export async function fetchSystemInterfaceConfig() {
  try {
    const { data } = await apiClient.get<SystemInterfaceConfig>(
      "configuration/system-interface"
    )

    return normalizeSystemInterfaceConfig(data)
  } catch (error) {
    console.error("No se pudo cargar la configuración de interfaz:", error)
    return DEFAULT_SYSTEM_INTERFACE_CONFIG
  }
}

export async function createSystemInterfaceConfig(payload: SystemInterfacePayload) {
  const { data } = await apiClient.post<SystemInterfaceConfig>(
    "configuration/system-interface",
    payload
  )

  return normalizeSystemInterfaceConfig(data)
}

export async function updateSystemInterfaceConfig(
  id: string,
  payload: SystemInterfacePayload
) {
  const { data } = await apiClient.put<SystemInterfaceConfig>(
    `configuration/system-interface/${id}`,
    payload
  )

  return normalizeSystemInterfaceConfig(data)
}

export async function restoreSystemInterfaceConfig(id: string | null) {
  if (!id) return DEFAULT_SYSTEM_INTERFACE_CONFIG

  const { data } = await apiClient.delete<SystemInterfaceConfig>(
    `configuration/system-interface/${id}`
  )

  return normalizeSystemInterfaceConfig(data)
}

export async function uploadResource(file: File, filename: string) {
  const data = new FormData()
  data.append("file", file)

  await apiClient.post(`resources/${encodeURIComponent(filename)}`, data)
}

export function getResourceUrl(resource?: string | null) {
  if (!resource) return ""

  if (localOrAbsoluteResourceRegex.test(resource)) {
    return resource
  }

  const baseUrl = (
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    apiClient.defaults.baseURL ||
    ""
  ).replace(/\/$/, "")

  return `${baseUrl}/resources/${encodeURIComponent(resource)}`
}

export function buildResourceFileName(kind: "logo" | "favicon", file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase() || "png"
  const randomSuffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2)

  return `${kind}-${Date.now()}-${randomSuffix}.${extension}`
}
