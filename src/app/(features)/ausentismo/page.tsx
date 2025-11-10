
import ToggleSection from "../uiLibrary/ToggleSection"
import ListarClaveAusentismo from "./listarClaveAusentismo"

export default function Page() {


  return (
    <div className='p-4'>
      <ToggleSection
        title="Cantidad Trabajadores por Clave de Ausentismo"
        color="green"
        defaultExpanded={true}
      >
        <ListarClaveAusentismo />
      </ToggleSection>
    </div>
  )
}
