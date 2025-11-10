import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import ListarTrabajadores from "./listarTrabajadores"
import ToggleSection from "../uiLibrary/ToggleSection"

export default function ListarTrabajadoresPage() {
  return (
    
      <div className="min-h-screen bg-gray-100 p-4">
        <ToggleSection
          title="Listar Trabajadores"
          color="green"
          defaultExpanded={true}
        >
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <Link href="/">
              <Button className="border border-gray-300 text-sm px-4 py-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Menú
              </Button>
            </Link>
          </div>

          {/* Contenido */}
          <div className="bg-white rounded-lg shadow p-6">
            <ListarTrabajadores />
          </div>
        </div>
        </ToggleSection>
      </div>

  )
}
