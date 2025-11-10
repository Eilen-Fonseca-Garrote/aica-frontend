'use client'

import ToggleSection from "../uiLibrary/ToggleSection"
import Modelo14BPage from "./modelo14B/page"
import ModeloRl4Page from "./modeloRL4/page"



export default function ModelosPage() {
  return (
    <div className="flex gap-4 p-4">
        <div className="flex-1">
            <ToggleSection
            title="Modelo de Ausentismo RL4"
            color="green"
            defaultExpanded={true}
            >
            <ModeloRl4Page />
            </ToggleSection>
        </div>

        <div className="flex-1">
            <ToggleSection
            title="Modelo 14B"
            color="green"
            defaultExpanded={true}
            >
            <Modelo14BPage />
            </ToggleSection>
        </div>
    </div>
  )
}
