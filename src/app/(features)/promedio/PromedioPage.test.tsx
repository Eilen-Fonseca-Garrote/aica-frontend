import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PromedioPage from './page'
import * as api from "@/app/lib/api/promedio"

// Mock ALL API calls
jest.mock('@/app/lib/api/promedio', () => ({
  getPromedioMensual: jest.fn(),
  getPromedioDiario: jest.fn(),
  downloadPromedioDiarioPdf: jest.fn(),
  downloadPromedioMensualPdf: jest.fn(),
}))

jest.mock('@/app/lib/api/external_service', () => ({
  getDireccionesPorUeb: jest.fn(),
}))

jest.mock('@/app/lib/helpers', () => ({
  downloadFile: jest.fn(),
}))

import {
  getPromedioMensual,
  getPromedioDiario,
} from '@/app/lib/api/promedio'

import { getDireccionesPorUeb } from '@/app/lib/api/external_service'

describe('<PromedioPage />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Ensure getDireccionesPorUeb always resolves to an array so code that reads .length won't fail
  })
   it("renders the page with both forms and empty state", () => {
    render(<PromedioPage />)

    expect(screen.getByText("Promedio Trabajadores")).toBeInTheDocument()
    expect(screen.getByText("Promedio Mensual")).toBeInTheDocument()
    expect(screen.getByText("Promedio Diario")).toBeInTheDocument()
    expect(screen.getByText("Sin resultados aún")).toBeInTheDocument()
  })

  it("successfully calculates and displays mensual results", async () => {
    const mockPromedioMensual = [
        {
            Unidad: "AICA",
            HPromFisic: 10,
            HPromFMuj: 20,
            HPromTot: 30,
            HPromMuj: 5,
        }

    ]
    const mockTotal = [
    {
      totalFisico: 10,
      totalFisicoMuj: 20,
      totalPromedio: 30,
      totalPromedioMujeres: 5,
    },
    ]

    api.getPromedioMensual.mockResolvedValue({
      promedio: mockPromedioMensual,
      total: mockTotal,
    })

    render(<PromedioPage />)

    // Find and interact with mensual form inputs
    fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "16" } })
    const input = screen.getByTestId("month-input");
    fireEvent.change(input, { target: { value: "2024-02" }});

    // Click calculate button
    const button = screen.getAllByRole('button', { name: "Calcular" })[0]
    fireEvent.click(button)

    // Verify loading state
    expect(screen.getByText("Calculando promedio...")).toBeInTheDocument()

    // Wait for API call and results to appear
    await waitFor(() => {
      expect(getPromedioMensual).toHaveBeenCalledWith("16", "2024-02")
    })

    // Results should be rendered
    expect(screen.queryByText("Sin resultados aún")).not.toBeInTheDocument()

    const cells_fisico = screen.getAllByRole("cell", { name: "10" })
    expect(cells_fisico.length).toBeGreaterThanOrEqual(2)
    const columnheader_fisico = screen.getAllByRole("columnheader", { name: "Físico" })
    expect(columnheader_fisico.length).toBeGreaterThanOrEqual(1)

    const cells_fisico_mujeres = screen.getAllByRole("cell", { name: "30" })
    expect(cells_fisico_mujeres.length).toBeGreaterThanOrEqual(2)
    const columnheader_fisico_mujeres = screen.getAllByRole("columnheader", { name: "Físico" })
    expect(columnheader_fisico_mujeres.length).toBeGreaterThanOrEqual(1)

    const cells_promedio = screen.getAllByRole("cell", { name: "20" })
    expect(cells_promedio.length).toBeGreaterThanOrEqual(2)
    const columnheader_promedio = screen.getAllByRole("columnheader", { name: "Físico" })
    expect(columnheader_promedio.length).toBeGreaterThanOrEqual(1)

    const cells_promedio_mujeres = screen.getAllByRole("cell", { name: "5" })
    expect(cells_promedio_mujeres.length).toBeGreaterThanOrEqual(2)
    const columnheader_promedio_mujeres = screen.getAllByRole("columnheader", { name: "Físico" })
    expect(columnheader_promedio_mujeres.length).toBeGreaterThanOrEqual(1)

  })
  it('shows an error if promedio mensual fails', async () => {
    api.getPromedioMensual.mockRejectedValue(new Error("fail"))

    render(<PromedioPage />)

    fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "16" } })
    const input = screen.getByTestId("month-input");
    fireEvent.change(input, { target: { value: "2024-02" }});
    expect(input).toHaveValue("2024-02");
    const button = screen.getAllByRole('button', { name: "Calcular" })[0]
    fireEvent.click(button)


    await waitFor(() =>
      expect(
        screen.getByText("Ha ocurrido un error calculando el promedio. Por favor contacte a un administrador")
      ).toBeInTheDocument()
    )
  })
  it("successfully calculates and displays mensual results", async () => {
    const mockPromedioDiarioResponse = {
        direcc: "Dirección A",
        fecha: "2024-02-01",
        promedio: [
            {
            Fecha: "2024-02-01",
            HPDTT: 10,
            HPDTM: 5,
            Unidad: "AICA",
            },
            {
            Fecha: "2024-02-01",
            HPDTT: 8,
            HPDTM: 3,
            Unidad: "LIORAD",
            },
        ],
        total: [
            {
            Promedio: 18,
            PromedioMujeres: 8,
            },
        ],
        success: true,
        ueb: "100",
    }

        const mockDirecciones = [
     {
        Unidad: "Aica",
        Area: [{
            EstNV1: 1,
            Unidad: "Aica"
        }]
        }
    ]

    getDireccionesPorUeb.mockResolvedValue(mockDirecciones)

    api.getPromedioDiario.mockResolvedValue(mockPromedioDiarioResponse)
      window.alert = jest.fn()

    render(<PromedioPage />)

    // Find and interact with mensual form inputs
    const input = screen.getByTestId("date-input");
    fireEvent.change(input, { target: { value: "2024-02-01" }});
    fireEvent.change(screen.getAllByRole("combobox")[1], { target: { value: "16" } })
    
    //Wait for addresses to load
    await waitFor(() => {
        const select_direc = screen.getAllByRole("combobox")[2]
        expect(screen.getAllByRole("option", { name: "Aica" }).length).toBeGreaterThanOrEqual(1)
        fireEvent.change(select_direc, { target: { value: "1" } })
    })

    // Click calculate button
    const button = screen.getAllByRole('button', { name: "Calcular" })[1]
    fireEvent.click(button)


    // Verify loading state
    expect(screen.getByText("Calculando promedio...")).toBeInTheDocument()

    // Wait for API call and results to appear
    await waitFor(() => {
      expect(getPromedioDiario).toHaveBeenCalledWith("16", "2024-02-01", "1")
    })

    // Results should be rendered
    expect(screen.queryByText("Sin resultados aún")).not.toBeInTheDocument()

    for (const item of mockPromedioDiarioResponse.promedio) {
        const cell_fecha = screen.getAllByRole("cell", { name: item.Fecha.toString() })
        expect(cell_fecha.length).toBeGreaterThanOrEqual(1)

        const cell_promedio = screen.getAllByRole("cell", { name: item.HPDTT.toString() })
        expect(cell_promedio.length).toBeGreaterThanOrEqual(1)

        const cell_promedio_mujeres = screen.getAllByRole("cell", { name: item.HPDTM.toString() })
        expect(cell_promedio_mujeres.length).toBeGreaterThanOrEqual(1)

    }
  })
  it("shows loading message", async () => {
      let resolveFn
      api.getPromedioMensual.mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveFn = resolve
          })
      )
  
      render(<PromedioPage />)
  
        fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "16" } })
        const input = screen.getByTestId("month-input");
        fireEvent.change(input, { target: { value: "2024-02" }});
        expect(input).toHaveValue("2024-02");
        const button = screen.getAllByRole('button', { name: "Calcular" })[0]
        fireEvent.click(button)
  
      expect(screen.getByText("Calculando promedio...")).toBeInTheDocument()
  
      resolveFn(
        {
        clave26: 1,
        promedio: [],
        total: [],
        }
      )
  
      await waitFor(() =>
        expect(screen.queryByText("Calculando promedio...")).toBeNull()
      )
    })
    it("alerts if UEB is missing", async () => {
      window.alert = jest.fn()
  
      render(<PromedioPage />)
  
      const button = screen.getAllByRole('button', { name: "Calcular" })[0]
      fireEvent.click(button)
  
      await waitFor(() =>
        expect(window.alert).toHaveBeenCalledWith("Por favor, seleccione una UEB válida")
      )
    })
  
    it("alerts if month date is empty", async () => {
      window.alert = jest.fn()
  
      render(<PromedioPage />)
  
      fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "16" } })
      const button = screen.getAllByRole('button', { name: "Calcular" })[0]
      fireEvent.click(button)
  
      await waitFor(() =>
        expect(window.alert).toHaveBeenCalledWith(
          "Por favor, seleccione una fecha"
        )
      )
    })
    it("loads direcciones when diario UEB is selected", async () => {
    const mockDirecciones = [
     {
        Unidad: "Aica",
        Area: [{
            EstNV1: 1,
            Unidad: "Aica"
        }]
        }
    ]

    getDireccionesPorUeb.mockResolvedValue(mockDirecciones)

    render(<PromedioPage />)

    // Get diario UEB select (second select on the page)
    fireEvent.change(screen.getAllByRole("combobox")[1], { target: { value: "16" } })

    fireEvent.change(screen.getAllByRole("combobox")[2], { target: { value: "1" } })

    // Wait for addresses to load
    await waitFor(() => {
      expect(getDireccionesPorUeb).toHaveBeenCalledWith("16")
    })

    // Verify direcciones are now available in the diario form
    expect(screen.getAllByRole("option", { name: "Aica" }).length).toBeGreaterThanOrEqual(1)
  })
})
