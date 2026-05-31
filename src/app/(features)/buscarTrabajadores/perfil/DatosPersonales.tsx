"use client"

import ToggleSection from "../../uiLibrary/ToggleSection"
import { TrabajadorPersonalData } from "../types"

interface DatosPersonalesProps {
  worker: TrabajadorPersonalData
}

export const DatosPersonales = ({ worker }: DatosPersonalesProps) => {

  const displayValue = (val?: string | number) =>
    val && val !== "" && val !== "0" ? val : "NO ESPECIFICADO"

  return (
    <div className="space-y-4">
      {/* Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <strong>CI</strong>
          <p>{worker.ci}</p>
        </div>
        <div>
          <strong>Sexo</strong>
          <p>{worker.sexo}</p>
        </div>
        <div>
          <strong>Edad</strong>
          <p>{worker.edad}</p>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <strong>Estado Civil</strong>
          <p>{worker.estado_civil}</p>
        </div>
        <div>
          <strong>Teléfono Fijo</strong>
          <p>{worker.telefono_fijo}</p>
        </div>
        <div>
          <strong>Teléfono Móvil</strong>
          <p>{worker.telefono_movil}</p>
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <strong>Dirección</strong>
          <p>{worker.direccion_oficial}</p>
        </div>
        <div>
          <strong>Municipio</strong>
          <p>{worker.municipio_especial}</p>
        </div>
        <div>
          <strong>Reparto</strong>
          <p>{worker.reparto_direccion_oficial}</p>
        </div>
      </div>

      {/* Row 4 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <strong>Lugar de Nacimiento</strong>
          <p>{worker.lugar_nacimiento}</p>
        </div>
        <div>
          <strong>Licencia de Conducción</strong>
          <p>{displayValue(worker.lic_conduccion)}</p>
        </div>
      </div>

      {/* Señas Particulares */}
      <div className="border border-gray-200 rounded">
        <ToggleSection title="Señas Particulares" color="blue" variant="minimal">
          <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <strong>Grupo Sanguíneo</strong>
              <p>{displayValue(worker.grupo_sanguineo)}</p>
            </div>
            <div>
              <strong>Color de Pelo</strong>
              <p>{displayValue(worker.color_pelo)}</p>
            </div>
            <div>
              <strong>Estatura</strong>
              <p>{displayValue(worker.estatura)}</p>
            </div>
            <div>
              <strong>Raza</strong>
              <p>{displayValue(worker.raza)}</p>
            </div>
            <div>
              <strong>Color de Ojos</strong>
              <p>{displayValue(worker.color_ojos)}</p>
            </div>
          </div>
        </ToggleSection>
      </div>

      {/* Otros datos */}
      <div className="border border-gray-200 rounded">
        <ToggleSection title="Otros Datos" color="blue" variant="minimal">
          <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <strong>Talla Pantalón</strong>
              <p>{displayValue(worker.talla_pantalon)}</p>
            </div>
            <div>
              <strong>Talla de Blusa/Camisa</strong>
              <p>{displayValue(worker.talla_blusa_camisa)}</p>
            </div>
            <div>
              <strong>Talla Calzado</strong>
              <p>{displayValue(worker.talla_calzado)}</p>
            </div>
          </div>
        </ToggleSection>
      </div>
    </div>
  )
}

