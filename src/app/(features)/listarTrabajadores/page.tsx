import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import ListarTrabajadores from "./listarTrabajadores"
import ToggleSection from "@/components/ui/ToggleSection"

const ListarTrabajadoresPage = () => {
  return (
    
      <div className="min-h-full bg-gray-100 p-4">
        <ToggleSection
          title="Listar Trabajadores"
          color="blue"
          variant="minimal"
          defaultExpanded={true}
        >
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0a8ca8] hover:text-[#08778f]"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Menú
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

export default ListarTrabajadoresPage
