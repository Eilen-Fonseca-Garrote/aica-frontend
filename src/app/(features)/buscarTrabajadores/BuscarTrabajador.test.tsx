/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import BuscarTrabajador from "./BuscarTrabajador"
import * as api from "@/app/lib/api/buscar"

// ----------------------
// MOCK CHILD COMPONENTS
// ----------------------




// ----------------------
// MOCK API FUNCTIONS
// ----------------------

jest.mock("@/app/lib/api/buscar", () => ({
  __esModule: true,
  buscarTrabajadorPorCi: jest.fn(),
  buscarTrabajadorPorNombre: jest.fn(),
  buscarInformacionFamiliarPorCi: jest.fn(),
  buscarInformacionEstudiosPorCi: jest.fn(),
  buscarInformacionLaborPorCi: jest.fn(),
  buscarMisionesCondecoracionesPorCi: jest.fn(),
}))

describe("BuscarTrabajador - Main Component", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // ----------------------
  // BASIC RENDERING
  // ----------------------

  it("renders inputs and checkboxes", () => {
    render(<BuscarTrabajador />)

    expect(screen.getByPlaceholderText("Buscar por CI")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Buscar por Nombre y Apellidos")).toBeInTheDocument()
    expect(screen.getByText("Todos")).toBeInTheDocument()
  })

  // ----------------------
  // CHECKBOX BEHAVIOR
  // ----------------------

  it("checks and unchecks categories correctly", () => {
    render(<BuscarTrabajador />)

    const allCat = screen.getByText("Todos").previousSibling
    const family = screen.getByText("Información Familiar").previousSibling
    const labor = screen.getByText("Información Laboral").previousSibling

    fireEvent.click(allCat)
    expect(allCat.checked).toBe(true)
    expect(family.checked).toBe(true)
    expect(labor.checked).toBe(true)

    fireEvent.click(family)
    expect(allCat.checked).toBe(false)
    expect(family.checked).toBe(false)
  })

  // ----------------------
  // VALIDATION ERRORS
  // ----------------------

  it("alerts if UEB is missing", async () => {
    window.alert = jest.fn()

    render(<BuscarTrabajador />)

    fireEvent.click(screen.getByText("Buscar"))

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith("Por favor seleccione una UEB.")
    )
  })

  it("alerts if CI and Name both empty", async () => {
    window.alert = jest.fn()

    render(<BuscarTrabajador />)

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "16" } })
    fireEvent.click(screen.getByText("Buscar"))

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith(
        "Debe ingresar al menos el CI o el Nombre del trabajador."
      )
    )
  })

  // ----------------------
  // EMPTY SEARCH
  // ----------------------

  it("renders empty message when no workers found", async () => {
    api.buscarTrabajadorPorNombre.mockResolvedValue([])

    render(<BuscarTrabajador />)

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "16" } })
    fireEvent.change(screen.getByPlaceholderText("Buscar por Nombre y Apellidos"), {
      target: { value: "nobody" },
    })

    fireEvent.click(screen.getByText("Buscar"))

    expect(await screen.findByText(/No se encontraron trabajadores/)).toBeInTheDocument()
  })

  // ----------------------
  // API ERROR
  // ----------------------

  it("renders error when API fails", async () => {
    api.buscarTrabajadorPorCi.mockRejectedValue(new Error("fail"))

    render(<BuscarTrabajador />)

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "16" } })
    fireEvent.change(screen.getByPlaceholderText("Buscar por CI"), {
      target: { value: "123123" },
    })
    fireEvent.click(screen.getByText("Buscar"))

    expect(
      await screen.findByText("Ha ocurrido un error al realizar la búsqueda. Por favor contacte a un administrador")
    ).toBeInTheDocument()
  })

  // ----------------------
  // LOADING STATE
  // ----------------------

  it("shows loading message", async () => {
    let resolveFn
    api.buscarTrabajadorPorCi.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFn = resolve
        })
    )

    render(<BuscarTrabajador />)

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "16" } })
    fireEvent.change(screen.getByPlaceholderText("Buscar por CI"), {
      target: { value: "111111" },
    })
    fireEvent.click(screen.getByText("Buscar"))

    expect(screen.getByText("Buscando trabajadores...")).toBeInTheDocument()

    resolveFn([
      {
        ci: "111111",
        nombre: "Juan",
        primerApellido: "Perez",
        segundoApellido: "Lopez",
      },
    ])

    await waitFor(() =>
      expect(screen.queryByText("Buscando trabajadores...")).toBeNull()
    )
  })

  // ----------------------
  // SELECT WORKER
  // ----------------------

  it("shows results and load worker profile", async () => {
    api.buscarTrabajadorPorNombre.mockResolvedValue([
    {
        "CI": "1",
        "NOMBRE": "Juan",
        "1er APELLIDO": "Perez",
        "2do APELLIDO": "Lopez",
        "SEXO": "M",
        "EDAD": 30,
        "ESTADO CIVIL": "Soltero",
        "TELEFONO FIJO": "12345678",
        "TELEFONO MOVIL": "987654321",
        "DIRECCION OFICIAL": "Calle X",
        "MUNICIPIO OFICIAL": "Municipio Y",
        "REPARTO DIRECCION OFICIAL": "Reparto Z",
        "LUGAR NACIMIENTO": "Ciudad A",
        "LIC. CONDUCCION": "B",
        "DIRECCION/UEB": "UEB 1",
        "AREA": "Area 1",
        "CARGO": "Cargo 1",
        "GRUPO SANGUINEO": "O+",
        "COLOR PELO": "Negro",
        "ESTATURA": 175,
        "RAZA": "Blanca",
        "COLOR OJOS": "Marron",
        "TALLA PANTALON": "M",
        "TALLA BLUSA/CAMISA": "L",
        "TALLA CALZADO": "42",
  },
  {
        "CI": "2",
        "NOMBRE": "Juan",
        "1er APELLIDO": "Prieto",
        "2do APELLIDO": "Vecino",
        "SEXO": "M",
        "EDAD": 45,
        "ESTADO CIVIL": "Soltero",
        "TELEFONO FIJO": "23424324",
        "TELEFONO MOVIL": "2342424",
        "DIRECCION OFICIAL": "Calle X",
        "MUNICIPIO OFICIAL": "Municipio Y",
        "REPARTO DIRECCION OFICIAL": "Reparto Z",
        "LUGAR NACIMIENTO": "Ciudad A",
        "LIC. CONDUCCION": "B",
        "DIRECCION/UEB": "UEB 1",
        "AREA": "Area 1",
        "CARGO": "Cargo 1",
        "GRUPO SANGUINEO": "O+",
        "COLOR PELO": "Negro",
        "ESTATURA": 185,
        "RAZA": "Blanca",
        "COLOR OJOS": "Marron",
        "TALLA PANTALON": "M",
        "TALLA BLUSA/CAMISA": "L",
        "TALLA CALZADO": "42",
  }
    ])

    render(<BuscarTrabajador />)

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "16" } })
    fireEvent.change(screen.getByPlaceholderText("Buscar por Nombre y Apellidos"), {
      target: { value: "Juan" },
    })

    fireEvent.click(screen.getByText("Buscar"))

    await waitFor(() =>{
        const restult_table = screen.queryByText("Resultados de la Búsqueda")
        expect(restult_table).not.toBeInTheDocument()
    })

    fireEvent.click(screen.getByText("Juan Perez Lopez"))

    expect(await screen.getByText("Juan Perez Lopez")).toBeInTheDocument()
  })

    it("renders worker profile directly when API returns one result", async () => {
    api.buscarTrabajadorPorNombre.mockResolvedValue([
    {
        "CI": "345",
        "NOMBRE": "Pedro",
        "1er APELLIDO": "Perez",
        "2do APELLIDO": "Lopez",
        "SEXO": "M",
        "EDAD": 30,
        "ESTADO CIVIL": "Soltero",
        "TELEFONO FIJO": "12345678",
        "TELEFONO MOVIL": "987654321",
        "DIRECCION OFICIAL": "Calle X",
        "MUNICIPIO OFICIAL": "Municipio Y",
        "REPARTO DIRECCION OFICIAL": "Reparto Z",
        "LUGAR NACIMIENTO": "Ciudad A",
        "LIC. CONDUCCION": "B",
        "DIRECCION/UEB": "UEB 1",
        "AREA": "Area 1",
        "CARGO": "Cargo 1",
        "GRUPO SANGUINEO": "O+",
        "COLOR PELO": "Negro",
        "ESTATURA": 175,
        "RAZA": "Blanca",
        "COLOR OJOS": "Marron",
        "TALLA PANTALON": "M",
        "TALLA BLUSA/CAMISA": "L",
        "TALLA CALZADO": "42",
  }
    ])

    render(<BuscarTrabajador />)

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "16" } })
    fireEvent.change(screen.getByPlaceholderText("Buscar por Nombre y Apellidos"), {
      target: { value: "Juan" },
    })
    fireEvent.click(screen.getByText("Buscar"))

    await waitFor(() =>{
        const restult_table = screen.queryByText("Resultados de la Búsqueda")
        expect(restult_table).not.toBeInTheDocument()
    })

    expect(await screen.getByText("Pedro Perez Lopez"))
  })

  it("renders profile and only the selected tabs", async () => {
    // Mock API calls
    api.buscarTrabajadorPorNombre.mockResolvedValue([
        {
            "CI": "765",
            "NOMBRE": "Pedro",
            "1er APELLIDO": "Perez",
            "2do APELLIDO": "Lopez",
            "SEXO": "M",
            "EDAD": 30,
            "ESTADO CIVIL": "Soltero",
            "TELEFONO FIJO": "12345678",
            "TELEFONO MOVIL": "987654321",
            "DIRECCION OFICIAL": "Calle X",
            "MUNICIPIO OFICIAL": "Municipio Y",
            "REPARTO DIRECCION OFICIAL": "Reparto Z",
            "LUGAR NACIMIENTO": "Ciudad A",
            "LIC. CONDUCCION": "B",
            "DIRECCION/UEB": "UEB 1",
            "AREA": "Area 1",
            "CARGO": "Cargo 1",
            "GRUPO SANGUINEO": "O+",
            "COLOR PELO": "Negro",
            "ESTATURA": 175,
            "RAZA": "Blanca",
            "COLOR OJOS": "Marron",
            "TALLA PANTALON": "M",
            "TALLA BLUSA/CAMISA": "L",
            "TALLA CALZADO": "42",
        }
    ])
    api.buscarInformacionFamiliarPorCi.mockResolvedValue([{ "TrbPadre": "Padre" }])
    api.buscarInformacionLaborPorCi.mockResolvedValue([{ "No.": 1, "CARGO1": "Ingeniero" }])
    api.buscarInformacionEstudiosPorCi.mockResolvedValue([{ "NIVEL_ESCOLAR": "Universitario" }])
    api.buscarMisionesCondecoracionesPorCi.mockResolvedValue([{ "CONDECORACION": "Medalla" }])

    render(<BuscarTrabajador />)

    const familyCheckbox = screen.getByText("Información Familiar").previousSibling
    const laborCheckbox = screen.getByText("Información Laboral").previousSibling

    fireEvent.click(familyCheckbox)
    fireEvent.click(laborCheckbox)

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "16" } })
    fireEvent.change(screen.getByPlaceholderText("Buscar por Nombre y Apellidos"), {
      target: { value: "Juan" },
    })
    fireEvent.click(screen.getByText("Buscar"))

    
    await waitFor(() =>{
        const restult_table = screen.queryByText("Resultados de la Búsqueda")
        expect(restult_table).not.toBeInTheDocument()
    })

    expect(await screen.getByText("Pedro Perez Lopez"))

    expect(screen.getByText("Datos Personales")).toBeInTheDocument()
    expect(screen.getByText("Datos Familiares")).toBeInTheDocument()
    expect(screen.getByText("Datos Laborales")).toBeInTheDocument()
     expect(screen.queryByRole("button", {name: "Estudios"})).not.toBeInTheDocument()
    expect(screen.queryByRole("button", {name: "Condecoraciones y Misiones"})).not.toBeInTheDocument()
  })
})
