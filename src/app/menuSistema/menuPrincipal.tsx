"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LogOut, Menu } from "lucide-react"
import ListarTrabajadoresPage from "../listarTrabajadores/page"
import PromedioPage from "../promedio/PromedioPage"
import TrabajadoresInterruptos from "../interruptos/listarInterruptosUEB"
import ListarClaveAusentismo from "../ausentismo/listarClaveAusentismo"
import ModeloRl4Page from "../modeloRL4/page"
import ToggleSection from "@/app/uiLibrary/ToggleSection"
import BuscarTrabajador from "../buscarTrabajadores/BuscarTrabajador"

export default function MenuPrincipal() {

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "buscar-trabajador": false,
    "listar-trabajadores": false,
    "promedio-trabajadores": false,
    "trabajadores-interruptos": false,
    "cantidad-trabajadores": false,
    "modelo-ausentismo": false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#3a3f47] text-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-600 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded flex items-center justify-center text-xs font-bold">aica</div>
            <span className="text-sm">Datos Trabajador</span>
          </div>
          <button className="text-white hover:bg-gray-600 p-2 rounded" title="Toggle Menu">
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-gray-600">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback className="bg-gray-500">AL</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Ana Lilian Infante Abreu</span>
              <span className="text-xs text-gray-300">Sistema de Personal de Aica</span>
            </div>
          </div>
        </div>

        <div className="flex-1" />

        {/* Logout */}
        <div className="p-4">
          <Button className="w-full justify-start text-white hover:bg-gray-600">
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Búsquedas y Listados */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Búsquedas y Listados</h2>

          <div className="space-y-2">
            <ToggleSection
              title="Buscar Trabajador"
              sectionKey="buscar-trabajador"
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              color="teal"
            >
              <BuscarTrabajador/>
            </ToggleSection>

            <ToggleSection
              title="Listar Trabajadores"
              sectionKey="listar-trabajadores"
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              color="teal"
            >
              <ListarTrabajadoresPage />
            </ToggleSection>
          </div>
        </section>

        {/* Reportes */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Reportes</h2>

          <div className="space-y-2">
            <ToggleSection
              title="Promedio Trabajadores"
              sectionKey="promedio-trabajadores"
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              color="green"
            >
              <PromedioPage />
            </ToggleSection>

            <ToggleSection
              title="Trabajadores Interruptos"
              sectionKey="trabajadores-interruptos"
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              color="green"
            >
              <TrabajadoresInterruptos />
            </ToggleSection>

            <ToggleSection
              title="Cantidad Trabajadores por Clave de Ausentismo"
              sectionKey="cantidad-trabajadores"
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              color="green"
            >
              <ListarClaveAusentismo />
            </ToggleSection>

            <ToggleSection
              title="Modelo de Ausentismo RL4"
              sectionKey="modelo-ausentismo"
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              color="green"
            >
              <ModeloRl4Page />
            </ToggleSection>
          </div>
        </section>
      </main>
    </div>
  )
}
