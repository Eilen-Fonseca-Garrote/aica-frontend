import ToggleSection from "../uiLibrary/ToggleSection"
import TrabajadoresInterruptos from "./listarInterruptosUEB"
export default function Page() {
  return (
    <div className='p-4'>
      <ToggleSection
      title="Trabajadores Interruptos"
      color="green"
      defaultExpanded={true}
      >
        <TrabajadoresInterruptos />
      </ToggleSection>
    </div>
  )
}