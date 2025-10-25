"use client"

/*Menu Principal para funcionalidades*/

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronUp, LogOut, Menu } from "lucide-react"
import { useRouter } from "next/navigation"

export default function MenuPrincipal() {
  const router = useRouter()

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

  const handleNavigate = (path: string) => {
    router.push(path)
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

        {/* Spacer */}
        <div className="flex-1" />

        {/* Logout Button */}
        <div className="p-4">
          <Button className="w-full justify-start text-white hover:bg-gray-600">
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Búsquedas y Listados Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Búsquedas y Listados</h2>

          <div className="space-y-2">
            {/* Buscar Trabajador */}
            <div className="bg-teal-600 rounded overflow-hidden">
              <button
                onClick={() => {
                  toggleSection("buscar-trabajador")
                  handleNavigate("/buscar-trabajador")
                }}
                className="w-full px-4 py-3 flex items-center justify-between text-white hover:bg-teal-700 transition-colors"
              >
                <span className="font-medium">Buscar Trabajador</span>
                {expandedSections["buscar-trabajador"] ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <span className="text-2xl font-light">+</span>
                )}
              </button>
              {expandedSections["buscar-trabajador"] && (
                <div className="bg-white p-4 text-gray-700">
                  <p className="text-sm">Contenido de búsqueda de trabajador...</p>
                </div>
              )}
            </div>

            {/* Listar Trabajadores */}
            <div className="bg-teal-600 rounded overflow-hidden">
              <button
           onClick={() => {
                  toggleSection("listar-trabajadores")
                  handleNavigate("/listarTrabajadores")
                }}
                className="w-full px-4 py-3 flex items-center justify-between text-white hover:bg-teal-700 transition-colors"
              >
                <span className="font-medium">Listar Trabajadores</span>
                {expandedSections["listar-trabajadores"] ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <span className="text-2xl font-light">+</span>
                )}
              </button>
              {expandedSections["listar-trabajadores"] && (
                <div className="bg-white p-4 text-gray-700">
                  <p className="text-sm">Contenido de listado de trabajadores...</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Reportes Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Reportes</h2>

          <div className="space-y-2">
            {/* Promedio Trabajadores */}
            <div className="bg-green-600 rounded overflow-hidden">
              <button
                onClick={() => { toggleSection("promedio-trabajadores")
                                 handleNavigate("/promedio")
                }}
                className="w-full px-4 py-3 flex items-center justify-between text-white hover:bg-green-700 transition-colors"
              >
                <span className="font-medium">Promedio Trabajadores</span>
                {expandedSections["promedio-trabajadores"] ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <span className="text-2xl font-light">+</span>
                )}
              </button>
              {expandedSections["promedio-trabajadores"] && (
                <div className="bg-white p-4 text-gray-700">
                  <p className="text-sm">Contenido de promedio de trabajadores...</p>
                </div>
              )}
            </div>

            {/* Trabajadores Interruptos */}
            <div className="bg-green-600 rounded overflow-hidden">
              <button
                onClick={() => {
                  toggleSection("trabajadores-interruptos")
                  handleNavigate("/interruptos")
                }}
                className="w-full px-4 py-3 flex items-center justify-between text-white hover:bg-green-700 transition-colors"
              >
                <span className="font-medium">Trabajadores Interruptos</span>
                {expandedSections["trabajadores-interruptos"] ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <span className="text-2xl font-light">+</span>
                )}
              </button>
              {expandedSections["trabajadores-interruptos"] && (
                <div className="bg-white p-4 text-gray-700">
                  <p className="text-sm">Contenido de trabajadores interruptos...</p>
                </div>
              )}
            </div>

            {/* Cantidad Trabajadores por Clave de Ausentismo */}
            <div className="bg-green-600 rounded overflow-hidden">
              <button
                onClick={() => {
                  toggleSection("cantidad-trabajadores")
                  handleNavigate("/ausentismo")
                }}
                className="w-full px-4 py-3 flex items-center justify-between text-white hover:bg-green-700 transition-colors"
              >
                <span className="font-medium">Cantidad Trabajadores por Clave de Ausentismo</span>
                {expandedSections["cantidad-trabajadores"] ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <span className="text-2xl font-light">+</span>
                )}
              </button>
            </div>

            {/* Modelo de Ausentismo RL4 */}
            <div className="bg-green-600 rounded overflow-hidden">
              <button
                onClick={() => { 
                  toggleSection("modelo-ausentismo")
                  handleNavigate ("/modeloRL4")

                }}
                className="w-full px-4 py-3 flex items-center justify-between text-white hover:bg-green-700 transition-colors"
              >
                <span className="font-medium">Modelo de Ausentismo RL4</span>
                {expandedSections["modelo-ausentismo"] ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <span className="text-2xl font-light">+</span>
                )}
              </button>
              {expandedSections["modelo-ausentismo"] && (
                <div className="bg-white p-4 text-gray-700">
                  <p className="text-sm">Contenido del modelo de ausentismo...</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
