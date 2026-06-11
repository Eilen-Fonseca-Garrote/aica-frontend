'use client'

import ToggleSection from "@/components/ui/ToggleSection"
import Modelo14BPage from "./modelo14B/page"
import ModeloRl4Page from "./modeloRL4/page"



const ModelosPage = () => {
  return (
    <div className="grid grid-cols-1 gap-4 p-4 xl:grid-cols-1 items-start">
        <div className="h-full">
            <ToggleSection
            title="Modelo de Ausentismo RL4"
            color="blue"
            variant="minimal"
            defaultExpanded={true}
            >
            <ModeloRl4Page />
            </ToggleSection>
        </div>

        <div className="h-full">
            <ToggleSection
            title="Modelo 14B"
            color="blue"
            variant="minimal"
            defaultExpanded={true}
            >
            <Modelo14BPage />
            </ToggleSection>
        </div>
    </div>
  )
}

export default ModelosPage
