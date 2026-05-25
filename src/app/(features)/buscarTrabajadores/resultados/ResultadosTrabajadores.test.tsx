/**
 * @jest-environment jsdom
 */

import { fireEvent, render, screen } from "@testing-library/react"
import SearchResultsTable from "./ResultadosTrabajadores"
import { TrabajadorPersonalData } from "../types"

const createWorker = (index: number): TrabajadorPersonalData => ({
  ci: `${index}`.padStart(11, "0"),
  nombre: `Trabajador ${String(index).padStart(2, "0")}`,
  sexo: "M",
  edad: 30,
  estado_civil: "",
  telefono_fijo: "",
  telefono_movil: "",
  direccion_oficial: "",
  municipio_especial: "",
  reparto_direccion_oficial: "",
  lugar_nacimiento: "",
  lic_conduccion: "",
  direccion_ueb: "",
  area: "",
  cargo: "",
  grupo_sanguineo: "",
  color_pelo: "",
  estatura: 0,
  raza: "",
  color_ojos: "",
  talla_pantalon: "",
  talla_blusa_camisa: "",
  talla_calzado: "",
})

describe("ResultadosTrabajadores pagination", () => {
  it("paginates workers and allows switching pages", () => {
    const workers = Array.from({ length: 12 }, (_, index) => createWorker(index + 1))

    render(<SearchResultsTable personalData={workers} selectWorker={jest.fn()} />)

    expect(screen.getByText("Trabajador 01")).toBeInTheDocument()
    expect(screen.queryByText("Trabajador 11")).not.toBeInTheDocument()
    expect(screen.getByText("Mostrando 1-10 de 12")).toBeInTheDocument()
    expect(screen.getByText("Pagina 1 de 2")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: /siguiente/i }))

    expect(screen.getByText("Trabajador 11")).toBeInTheDocument()
    expect(screen.queryByText("Trabajador 01")).not.toBeInTheDocument()
    expect(screen.getByText("Mostrando 11-12 de 12")).toBeInTheDocument()
    expect(screen.getByText("Pagina 2 de 2")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: /anterior/i }))

    expect(screen.getByText("Trabajador 01")).toBeInTheDocument()
    expect(screen.queryByText("Trabajador 11")).not.toBeInTheDocument()
    expect(screen.getByText("Pagina 1 de 2")).toBeInTheDocument()
  })
})

