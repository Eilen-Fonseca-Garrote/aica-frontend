"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import {
  DEFAULT_SYSTEM_INTERFACE_CONFIG,
  fetchSystemInterfaceConfig,
  getResourceUrl,
  normalizeSystemInterfaceConfig,
  type SystemInterfaceConfig,
} from "./api/systemInterface"

type SystemInterfaceContextValue = {
  config: SystemInterfaceConfig
  loading: boolean
  refresh: () => Promise<SystemInterfaceConfig>
  setConfig: (config: Partial<SystemInterfaceConfig>) => void
}

const SystemInterfaceContext = createContext<SystemInterfaceContextValue | null>(null)

function expandHexColor(hex: string) {
  const clean = hex.replace("#", "")

  if (clean.length === 3) {
    return clean
      .split("")
      .map((char) => char + char)
      .join("")
  }

  return clean.padEnd(6, "0").slice(0, 6)
}

function shadeHexColor(hex: string, amount: number) {
  const expanded = expandHexColor(hex)
  const number = Number.parseInt(expanded, 16)

  if (!Number.isFinite(number)) return hex

  const red = Math.min(255, Math.max(0, (number >> 16) + amount))
  const green = Math.min(255, Math.max(0, ((number >> 8) & 0x00ff) + amount))
  const blue = Math.min(255, Math.max(0, (number & 0x0000ff) + amount))

  return `#${(blue | (green << 8) | (red << 16)).toString(16).padStart(6, "0")}`
}

function updateFavicon(favicon: string) {
  const href = getResourceUrl(favicon)
  let link = document.querySelector<HTMLLinkElement>("link[rel='icon']")

  if (!link) {
    link = document.createElement("link")
    link.rel = "icon"
    document.head.appendChild(link)
  }

  link.href = href
}

function applyConfigToDocument(config: SystemInterfaceConfig) {
  const root = document.documentElement

  root.style.setProperty("--app-primary-color", config.primaryColor)
  root.style.setProperty("--app-primary-hover", shadeHexColor(config.primaryColor, -22))
  root.style.setProperty("--app-primary-soft", `${config.primaryColor}1A`)
  root.style.setProperty("--app-sidebar-color", config.sidebarColor)
  root.style.setProperty("--app-sidebar-hover", shadeHexColor(config.sidebarColor, 28))
  root.style.setProperty("--app-sidebar-border", shadeHexColor(config.sidebarColor, 42))

  updateFavicon(config.favicon)
}

export const SystemInterfaceProvider = ({ children }: { children: React.ReactNode }) => {
  const [config, setInternalConfig] = useState<SystemInterfaceConfig>(
    DEFAULT_SYSTEM_INTERFACE_CONFIG
  )
  const [loading, setLoading] = useState(true)

  const setConfig = useCallback((nextConfig: Partial<SystemInterfaceConfig>) => {
    setInternalConfig((current) =>
      normalizeSystemInterfaceConfig({ ...current, ...nextConfig })
    )
  }, [])

  const refresh = useCallback(async () => {
    setLoading(true)

    try {
      const nextConfig = await fetchSystemInterfaceConfig()
      setInternalConfig(nextConfig)
      return nextConfig
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  useEffect(() => {
    applyConfigToDocument(config)
  }, [config])

  const value = useMemo(
    () => ({
      config,
      loading,
      refresh,
      setConfig,
    }),
    [config, loading, refresh, setConfig]
  )

  return (
    <SystemInterfaceContext.Provider value={value}>
      {children}
    </SystemInterfaceContext.Provider>
  )
}

export function useSystemInterfaceConfig() {
  const context = useContext(SystemInterfaceContext)

  if (!context) {
    throw new Error("useSystemInterfaceConfig must be used inside SystemInterfaceProvider")
  }

  return context
}
