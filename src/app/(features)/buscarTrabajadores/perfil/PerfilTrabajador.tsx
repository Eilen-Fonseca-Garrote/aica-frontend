"use client"

import Card from "@/app/(features)/uiLibrary/Card"
import { Tabs } from "@/components/ui/tabs"
import { TrabajadorEstudiosData, TrabajadorFamilyData, TrabajadorLaborData, TrabajadorMisionesCondecData, TrabajadorPersonalData } from "../types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import NoProfilePic from "public/img/nofoto.jpg"
import { DatosPersonales } from "./DatosPersonales"
import DatosFamiliares from "./DatosFamiliares"
import DatosEstudios from "./DatosEstudios"
import DatosLaborales from "./DatosLaborales"
import DatosCondecoracionesMisiones from "./DatosCondecoracionesMisiones"


interface WorkerProfileProps {
  worker: TrabajadorPersonalData
  imagenTrab: string
  ueb: string
  laborData?: TrabajadorLaborData | null
  estudiosData?: TrabajadorEstudiosData | null
  familiarData: TrabajadorFamilyData | null
  misiones?: TrabajadorMisionesCondecData | null
}

export default function WorkerProfile({
  worker,
  ueb,
  laborData,
  estudiosData,
  familiarData,
  misiones,
}: WorkerProfileProps) {
  const getUebName = (uebCode: string) => {
    switch (uebCode) {
      case "100":
        return "CITOX"
      case "25":
        return "LIORAD"
      case "55":
        return "JULIO TRIGO"
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
            <div className="flex justify-center mb-4">
                <Avatar className="h-10 w-10">
                      <AvatarImage src={NoProfilePic} alt="avatar" />
                      <AvatarFallback className="bg-gray-500">AL</AvatarFallback>
                </Avatar>
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
