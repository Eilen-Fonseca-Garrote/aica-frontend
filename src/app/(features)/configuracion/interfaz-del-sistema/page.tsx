"use client"

/* eslint-disable @next/next/no-img-element */
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react"
import { ImageIcon, RotateCcw, Save, UploadCloud } from "lucide-react"
import {
  ALLOWED_IMAGE_TYPES,
  DEFAULT_SYSTEM_INTERFACE_CONFIG,
  MAX_FILE_SIZES,
  PREDEFINED_COLORS,
  buildResourceFileName,
  createSystemInterfaceConfig,
  getResourceUrl,
  restoreSystemInterfaceConfig,
  updateSystemInterfaceConfig,
  uploadResource,
  type SystemInterfacePayload,
} from "@/app/lib/api/systemInterface"
import { useSystemInterfaceConfig } from "@/app/lib/system-interface-context"

type ImageField = "logo" | "favicon"

type StatusMessage = {
  type: "success" | "error" | "info"
  text: string
} | null

type FormState = {
  primaryColor: string
  sidebarColor: string
}

const fileLabels = {
  logo: "Logo",
  favicon: "Favicon",
}

function isAllowedFile(field: ImageField, file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase()
  const extensionIsAllowed =
    field === "favicon"
      ? ["ico", "png", "svg"].includes(extension || "")
      : ["jpeg", "jpg", "png", "svg", "webp"].includes(extension || "")

  return ALLOWED_IMAGE_TYPES[field].includes(file.type) || extensionIsAllowed
}

function formatFileSize(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function buildInitialForm(config: SystemInterfacePayload): FormState {
  return {
    primaryColor: config.primaryColor,
    sidebarColor: config.sidebarColor,
  }
}

const SystemInterfaceConfigurationPage = () => {
  const { config, loading, setConfig } = useSystemInterfaceConfig()
  const [form, setForm] = useState<FormState>(() => buildInitialForm(config))
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [faviconFile, setFaviconFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState(getResourceUrl(config.logo))
  const [faviconPreview, setFaviconPreview] = useState(getResourceUrl(config.favicon))
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<StatusMessage>(null)

  useEffect(() => {
    setForm(buildInitialForm(config))
    setLogoFile(null)
    setFaviconFile(null)
    setLogoPreview(getResourceUrl(config.logo))
    setFaviconPreview(getResourceUrl(config.favicon))
  }, [config])

  const hasChanges = useMemo(
    () =>
      Boolean(
        logoFile ||
          faviconFile ||
          form.primaryColor !== config.primaryColor ||
          form.sidebarColor !== config.sidebarColor
      ),
    [config, faviconFile, form, logoFile]
  )

  const previewConfig = {
    logo: logoPreview,
    favicon: faviconPreview,
    primaryColor: form.primaryColor,
    sidebarColor: form.sidebarColor,
  }

  const updateColor = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    setStatus(null)
  }

  const handleFileChange =
    (field: ImageField) => (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      event.target.value = ""

      if (!file) return

      if (!isAllowedFile(field, file)) {
        setStatus({
          type: "error",
          text: `${fileLabels[field]} tiene un formato no soportado.`,
        })
        return
      }

      if (file.size > MAX_FILE_SIZES[field]) {
        setStatus({
          type: "error",
          text: `${fileLabels[field]} no puede superar ${formatFileSize(
            MAX_FILE_SIZES[field]
          )}.`,
        })
        return
      }

      const preview = URL.createObjectURL(file)

      if (field === "logo") {
        setLogoFile(file)
        setLogoPreview(preview)
      } else {
        setFaviconFile(file)
        setFaviconPreview(preview)
      }

      setStatus(null)
    }

  const uploadImageIfNeeded = async (
    field: ImageField,
    file: File | null,
    fallback: string
  ) => {
    if (!file) return fallback

    const filename = buildResourceFileName(field, file)
    await uploadResource(file, filename)
    return filename
  }

  const resetLocalChanges = () => {
    setForm(buildInitialForm(config))
    setLogoFile(null)
    setFaviconFile(null)
    setLogoPreview(getResourceUrl(config.logo))
    setFaviconPreview(getResourceUrl(config.favicon))
    setStatus(null)
  }

  const handleRestore = async () => {
    setSaving(true)
    setStatus({ type: "info", text: "Restaurando valores por defecto..." })

    try {
      const restored = config.id
        ? await restoreSystemInterfaceConfig(config.id)
        : DEFAULT_SYSTEM_INTERFACE_CONFIG

      setConfig(restored)
      setLogoFile(null)
      setFaviconFile(null)
      setStatus({ type: "success", text: "Configuración restaurada." })
    } catch (error) {
      console.error("No se pudo restaurar la configuración:", error)
      setStatus({ type: "error", text: "No se pudo restaurar la configuración." })
    } finally {
      setSaving(false)
    }
  }

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setStatus({ type: "info", text: "Guardando configuración..." })

    try {
      const [logo, favicon] = await Promise.all([
        uploadImageIfNeeded("logo", logoFile, config.logo),
        uploadImageIfNeeded("favicon", faviconFile, config.favicon),
      ])

      const payload: SystemInterfacePayload = {
        logo,
        favicon,
        primaryColor: form.primaryColor,
        sidebarColor: form.sidebarColor,
      }

      const saved = config.id
        ? await updateSystemInterfaceConfig(config.id, payload)
        : await createSystemInterfaceConfig(payload)

      setConfig(saved)
      setLogoFile(null)
      setFaviconFile(null)
      setStatus({ type: "success", text: "Configuración guardada." })
    } catch (error) {
      console.error("No se pudo guardar la configuración:", error)
      setStatus({ type: "error", text: "No se pudo guardar la configuración." })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-full bg-slate-50 p-4 text-slate-900 md:p-8">
      <form onSubmit={handleSave} className="mx-auto max-w-6xl space-y-6">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-6 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--app-primary-color)]">
                Configuración
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                Interfaz del sistema
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Ajusta los colores principales y los recursos visuales que se
                usan en la navegación del sistema.
              </p>
            </div>

            <div
              className="rounded-2xl border border-slate-200 p-4 text-white shadow-inner"
              style={{ backgroundColor: previewConfig.sidebarColor }}
            >
              <div className="flex items-center gap-3">
                <img
                  src={previewConfig.logo}
                  alt="Vista previa del logo"
                  className="h-12 w-12 rounded-lg bg-white/95 object-contain p-1"
                />
                <div>
                  <p className="text-sm font-semibold">Sistema de Personal AICA</p>
                  <p className="text-xs text-white/70">Vista previa</p>
                </div>
              </div>
              <div className="mt-5 rounded-xl bg-white/10 p-3 text-sm">
                <div
                  className="rounded-lg px-3 py-2 font-medium"
                  style={{ backgroundColor: previewConfig.primaryColor }}
                >
                  Opción activa
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-[var(--app-primary-soft)] p-3 text-[var(--app-primary-color)]">
                <ImageIcon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Recursos visuales</h2>
                <p className="text-sm text-slate-500">
                  Sube una imagen para el logo y otra para el favicon.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ImageUploader
                accept={ALLOWED_IMAGE_TYPES.logo.join(",")}
                description="PNG, JPG, SVG o WEBP. Maximo 5 MB."
                imageClassName="h-24 w-24"
                label="Logo"
                onChange={handleFileChange("logo")}
                preview={logoPreview}
              />
              <ImageUploader
                accept={ALLOWED_IMAGE_TYPES.favicon.join(",")}
                description="ICO, PNG o SVG. Maximo 1 MB."
                imageClassName="h-16 w-16"
                label="Favicon"
                onChange={handleFileChange("favicon")}
                preview={faviconPreview}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Colores</h2>
            <p className="mt-1 text-sm text-slate-500">
              Selecciona colores guardados o introduce un valor hexadecimal.
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <ColorPicker
                label="Color primario"
                onChange={(value) => updateColor("primaryColor", value)}
                options={PREDEFINED_COLORS.primary}
                value={form.primaryColor}
              />
              <ColorPicker
                label="Color del sidebar"
                onChange={(value) => updateColor("sidebarColor", value)}
                options={PREDEFINED_COLORS.sidebar}
                value={form.sidebarColor}
              />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          {status ? (
            <div
              className={`mb-4 rounded-2xl border px-4 py-3 text-sm ${
                status.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : status.type === "error"
                  ? "border-red-200 bg-red-50 text-red-800"
                  : "border-sky-200 bg-sky-50 text-sky-800"
              }`}
            >
              {status.text}
            </div>
          ) : null}

          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={resetLocalChanges}
              disabled={!hasChanges || saving}
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400"
            >
              Cancelar cambios
            </button>
            <button
              type="button"
              onClick={handleRestore}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:text-red-300"
            >
              <RotateCcw className="h-4 w-4" />
              Restaurar valores por defecto
            </button>
            <button
              type="submit"
              disabled={!hasChanges || saving || loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--app-primary-color)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--app-primary-hover)] disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <Save className="h-4 w-4" />
              {saving ? "Guardando..." : "Guardar configuración"}
            </button>
          </div>
        </section>
      </form>
    </div>
  )
}

const ImageUploader = ({
  accept,
  description,
  imageClassName,
  label,
  onChange,
  preview,
}: {
  accept: string
  description: string
  imageClassName: string
  label: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  preview: string
}) => {
  return (
    <label className="group block cursor-pointer rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 transition hover:border-[var(--app-primary-color)] hover:bg-white">
      <input accept={accept} className="sr-only" type="file" onChange={onChange} />
      <div className="flex items-center gap-4">
        <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-white shadow-inner">
          <img
            src={preview}
            alt={`Vista previa de ${label}`}
            className={`${imageClassName} object-contain`}
          />
        </div>
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--app-primary-color)] shadow-sm">
            <UploadCloud className="h-3.5 w-3.5" />
            Cambiar {label.toLowerCase()}
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-900">{label}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
        </div>
      </div>
    </label>
  )
}

const ColorPicker = ({
  label,
  onChange,
  options,
  value,
}: {
  label: string
  onChange: (value: string) => void
  options: string[]
  value: string
}) => {
  const colorInputValue = /^#[0-9a-fA-F]{6}$/.test(value)
    ? value
    : DEFAULT_SYSTEM_INTERFACE_CONFIG.primaryColor

  return (
    <div>
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <div className="mt-3 flex items-center gap-3">
        <input
          type="color"
          value={colorInputValue}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-14 cursor-pointer rounded-lg border border-slate-300 bg-white p-1"
        />
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 flex-1 rounded-xl border border-slate-300 px-3 text-sm font-medium uppercase outline-none transition focus:border-[var(--app-primary-color)] focus:ring-2 focus:ring-[var(--app-primary-color)]"
          pattern="^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$"
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`h-8 w-8 rounded-full border-2 transition ${
              value.toLowerCase() === option.toLowerCase()
                ? "border-slate-950 scale-110"
                : "border-white shadow"
            }`}
            style={{ backgroundColor: option }}
            aria-label={`Usar ${option}`}
          />
        ))}
      </div>
    </div>
  )
}

export default SystemInterfaceConfigurationPage
