"use client"

import { useEffect, useMemo, useState } from "react"
import Card from "@/components/ui/Card"
import { Tabs } from "@/components/ui/tabs"
import { TrabajadorEstudiosData, TrabajadorFamilyData, TrabajadorLaborData, TrabajadorMisionesCondecData, TrabajadorPersonalData } from "../types"
import { DatosPersonales } from "./DatosPersonales"
import DatosFamiliares from "./DatosFamiliares"
import DatosEstudios from "./DatosEstudios"
import DatosLaborales from "./DatosLaborales"
import DatosCondecoracionesMisiones from "./DatosCondecoracionesMisiones"

const DEFAULT_PROFILE_IMAGE = "/img/nofoto.jpg"

const buildPhotoCandidates = (ci: string, imagenTrab?: string) => {
  const candidates: string[] = []
  const providedImage = imagenTrab?.trim()

  if (providedImage) {
    candidates.push(providedImage)
  }

  const photosBaseUrl = process.env.NEXT_PUBLIC_FOTOS_AICA?.trim() ?? ""
  if (photosBaseUrl && ci) {
    const normalizedBaseUrl = photosBaseUrl.endsWith("/")
      ? photosBaseUrl
      : `${photosBaseUrl}/`
    const encodedCi = encodeURIComponent(ci.trim())

    candidates.push(`${normalizedBaseUrl}${encodedCi}.JPG`)
    candidates.push(`${normalizedBaseUrl}${encodedCi}.jpg`)
  }

  candidates.push(DEFAULT_PROFILE_IMAGE)

  return Array.from(new Set(candidates.filter(Boolean)))
}

interface WorkerProfileProps {
  worker: TrabajadorPersonalData
  imagenTrab?: string
  ueb: string
  laborData?: TrabajadorLaborData | null
  estudiosData?: TrabajadorEstudiosData | null
  familiarData: TrabajadorFamilyData | null
  misiones?: TrabajadorMisionesCondecData | null
}

const WorkerProfile = ({
  worker,
  imagenTrab,
  ueb,
  laborData,
  estudiosData,
  familiarData,
  misiones,
}: WorkerProfileProps) => {
  const photoCandidates = useMemo(
    () => buildPhotoCandidates(worker.ci, imagenTrab),
    [worker.ci, imagenTrab],
  )
  const [photoCandidateIndex, setPhotoCandidateIndex] = useState(0)

  useEffect(() => {
    setPhotoCandidateIndex(0)
  }, [photoCandidates])

  const currentPhoto =
    photoCandidates[Math.min(photoCandidateIndex, photoCandidates.length - 1)] ??
    DEFAULT_PROFILE_IMAGE

  const handlePhotoError = () => {
    setPhotoCandidateIndex((currentIndex) =>
      currentIndex < photoCandidates.length - 1 ? currentIndex + 1 : currentIndex,
    )
  }

  const getUebName = (uebCode: string) => {
    switch (uebCode) {
      case "100":
        return "CITOX"
      case "25":
        return "LIORAD"
      case "55":
        return "JULIO TRIGO"
      case "57":
        return "SH+"
      default:
        return "AICA"
    }
  }

  const uebName = getUebName(ueb)

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* LEFT COLUMN: Profile Info */}
      <div className="col-span-1">
        <Card className="border border-gray-200 shadow-sm">
          <div className="mb-4 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentPhoto}
              alt={`Foto de ${worker.nombre}`}
              onError={handlePhotoError}
              className="h-28 w-28 rounded-full border border-gray-200 object-cover"
            />
          </div>
            <h3 className="text-lg font-semibold">
              {worker.nombre}
            </h3>
            <p className="text-gray-500 text-sm mb-4 text-center">{worker.cargo}</p>

            <ul className="space-y-2 text-left text-sm text-gray-700">
              <li>
                <b>UEB:</b> {uebName}
              </li>
              <li>
                <b>Dirección Funcional:</b> {worker.direccion_oficial}
              </li>
              <li>
                <b>Área:</b> {worker.area}
              </li>
            </ul>

        </Card>
      </div>

      {/* RIGHT COLUMN: Tabs */}
      <div className="col-span-1 md:col-span-3">
        <Card className="border border-gray-200 shadow-sm" title="Perfil del Trabajador">
            <Tabs
            defaultTab="personal"
            tabs={[
                {
                id: "personal",
                label: "Datos Personales",
                content: <DatosPersonales worker={worker} />
                },
                ...(laborData
                  ? [{
                      id: "labor",
                      label: "Datos Laborales",
                      content: <DatosLaborales laborData={laborData} />
                    }]
                  : []),
                ...(estudiosData
                  ? [{
                      id: "estudios",
                      label: "Datos de Estudios",
                      content: <DatosEstudios estudiosData={estudiosData} />
                    }]
                  : []),
                ...(familiarData
                  ? [{
                      id: "familia",
                      label: "Datos Familiares",
                      content: <DatosFamiliares familiarData={familiarData}/>
                    }]
                  : []),
                ...(misiones
                  ? [{
                      id: "misiones",
                      label: "Condecoraciones y Misiones",
                      content: <DatosCondecoracionesMisiones misiones={misiones} />
                    }]
                  : []),
            ]}
            />
        </Card>
      </div>
    </div>
  )
}

export default WorkerProfile
