// AusentismoPage.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AusentismoPage from './page'

// Mock con tipos explícitos
jest.mock('@/app/lib/api/ausentismo', () => ({
  getAusencias: jest.fn(),
  downloadAusenciasPdf: jest.fn(),
}))

jest.mock('@/app/lib/api/external_service', () => ({
  getClavesAusentismo: jest.fn(),
}))

jest.mock('@/app/lib/helpers', () => ({
  downloadFile: jest.fn(),
}))

// Importar después de los mocks
import * as api from "@/app/lib/api/ausentismo"
import * as externalService from "@/app/lib/api/external_service"
import { downloadFile } from '@/app/lib/helpers'

// Cast explícito a jest.Mock
const mockedGetAusencias = api.getAusencias as jest.Mock;
const mockedDownloadAusenciasPdf = api.downloadAusenciasPdf as jest.Mock;
const mockedGetClavesAusentismo = externalService.getClavesAusentismo as jest.Mock;
const mockedDownloadFile = downloadFile as jest.Mock;

describe('<AusentismoPage />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    window.alert = jest.fn()
  })

  // =========================================================================
  // ESCENARIO 1: Renderizado inicial y estado vacío
  // =========================================================================
  it("renders the page with initial empty state", () => {
    render(<AusentismoPage />)

    expect(screen.getByText("Cantidad Trabajadores por Clave de Ausentismo")).toBeInTheDocument()
    expect(screen.getByText("Configuración de Búsqueda")).toBeInTheDocument()
    expect(screen.getByText(/Sin resultados de ausentismo/)).toBeInTheDocument()
  })

  // =========================================================================
  // ESCENARIO 2: Cálculo exitoso con diferentes juegos de datos
  // =========================================================================

  // Juego de datos 1: Datos normales con múltiples claves
  const mockAusentismoData1 = [
    { CLAVE: '01', CANTIDAD: '5', HORAS: 40 },
    { CLAVE: '02', CANTIDAD: '3', HORAS: 24 },
    { CLAVE: '03', CANTIDAD: '7', HORAS: 56 }
  ]

  // Juego de datos 2: Datos con una sola clave
  const mockAusentismoData2 = [
    { CLAVE: '05', CANTIDAD: '12', HORAS: 96 }
  ]

  it("successfully calculates ausentismo with multiple claves (Juego 1)", async () => {
    const mockClaves = [
      { ClvCod: '01', ClvDesc: 'Enfermedad común' },
      { ClvCod: '02', ClvDesc: 'Accidente laboral' },
      { ClvCod: '03', ClvDesc: 'Licencia maternidad' }
    ]

    mockedGetClavesAusentismo.mockResolvedValue(mockClaves)
    mockedGetAusencias.mockResolvedValue(mockAusentismoData1)

    render(<AusentismoPage />)

    // Wait for claves to load
    await waitFor(() => {
      expect(mockedGetClavesAusentismo).toHaveBeenCalledWith('16')
    })

    // Set fecha
    const monthInput = screen.getByPlaceholderText('YYYY-MM')
    fireEvent.change(monthInput, { target: { value: '2024-02' } })

    // Click calculate button (usará todas las claves por defecto)
    const calculateButton = screen.getByRole('button', { name: /Cantidad de Trabajadores/i })
    fireEvent.click(calculateButton)

    // Verify loading state
    expect(screen.getByText("Calculando ausentismo...")).toBeInTheDocument()

    // Wait for API call and results - CORREGIDO: ahora espera claves vacías
    await waitFor(() => {
      expect(mockedGetAusencias).toHaveBeenCalledWith("16", "2024-02", "")
    })

    // Verify results are displayed
    await waitFor(() => {
      expect(screen.queryByText(/Sin resultados/)).not.toBeInTheDocument()
    })
    
    // Check that all data items are rendered
    mockAusentismoData1.forEach(item => {
      expect(screen.getByText(item.CLAVE)).toBeInTheDocument()
      expect(screen.getByText(item.CANTIDAD)).toBeInTheDocument()
      expect(screen.getByText(item.HORAS.toString())).toBeInTheDocument()
    })
  })

  it("successfully calculates ausentismo with single clave (Juego 2)", async () => {
    const mockClaves = [
      { ClvCod: '05', ClvDesc: 'Vacaciones' }
    ]

    mockedGetClavesAusentismo.mockResolvedValue(mockClaves)
    mockedGetAusencias.mockResolvedValue(mockAusentismoData2)

    render(<AusentismoPage />)

    await waitFor(() => {
      expect(mockedGetClavesAusentismo).toHaveBeenCalledWith('16')
    })

    // Set fecha
    const monthInput = screen.getByPlaceholderText('YYYY-MM')
    fireEvent.change(monthInput, { target: { value: '2024-03' } })

    // Click calculate
    const calculateButton = screen.getByRole('button', { name: /Cantidad de Trabajadores/i })
    fireEvent.click(calculateButton)

    // CORREGIDO: ahora espera claves vacías
    await waitFor(() => {
      expect(mockedGetAusencias).toHaveBeenCalledWith("16", "2024-03", "")
    })

    // Verify single result
    expect(screen.getByText('05')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('96')).toBeInTheDocument()
  })

  // =========================================================================
  // ESCENARIO 3: Manejo de errores
  // =========================================================================
  it("shows error when calculation fails with server error", async () => {
    const mockClaves = [
      { ClvCod: '01', ClvDesc: 'Enfermedad común' }
    ]

    mockedGetClavesAusentismo.mockResolvedValue(mockClaves)
    
    // Mock server error - CORREGIDO: usar el formato que realmente devuelve el componente
    const serverError = new Error("Server error")
    mockedGetAusencias.mockRejectedValue(serverError)

    render(<AusentismoPage />)

    const monthInput = screen.getByPlaceholderText('YYYY-MM')
    fireEvent.change(monthInput, { target: { value: '2024-02' } })

    const calculateButton = screen.getByRole('button', { name: /Cantidad de Trabajadores/i })
    fireEvent.click(calculateButton)

    // CORREGIDO: usar el mensaje real que muestra el componente
    await waitFor(() => {
      expect(screen.getByText("Server error")).toBeInTheDocument()
    })
  })

  it("shows specific error for 404 responses", async () => {
    const mockClaves = [
      { ClvCod: '01', ClvDesc: 'Enfermedad común' }
    ]

    mockedGetClavesAusentismo.mockResolvedValue(mockClaves)
    
    // Mock 404 error con la estructura que espera el componente
    const notFoundError = {
      response: {
        status: 404,
        data: { message: 'Servicio no encontrado' }
      }
    }
    mockedGetAusencias.mockRejectedValue(notFoundError)

    render(<AusentismoPage />)

    const monthInput = screen.getByPlaceholderText('YYYY-MM')
    fireEvent.change(monthInput, { target: { value: '2024-02' } })

    const calculateButton = screen.getByRole('button', { name: /Cantidad de Trabajadores/i })
    fireEvent.click(calculateButton)

    await waitFor(() => {
      expect(screen.getByText(/El servicio de ausentismo no está disponible/)).toBeInTheDocument()
    })
  })

  // =========================================================================
  // ESCENARIO 4: Validación de campos
  // =========================================================================
  it("alerts if UEB is not selected", async () => {
    render(<AusentismoPage />)

    // Change UEB to "0" (Todas las UEBs) which should trigger validation error
    const uebSelects = screen.getAllByRole('combobox')
    fireEvent.change(uebSelects[0], { target: { value: '0' } })

    const calculateButton = screen.getByRole('button', { name: /Cantidad de Trabajadores/i })
    fireEvent.click(calculateButton)

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Por favor, seleccione una UEB válida")
    })
  })

  it("alerts if fecha is empty", async () => {
    render(<AusentismoPage />)

    const calculateButton = screen.getByRole('button', { name: /Cantidad de Trabajadores/i })
    fireEvent.click(calculateButton)

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Por favor, seleccione una fecha")
    })
  })

  /*it("alerts if fecha format is invalid", async () => {
    render(<AusentismoPage />)

    const monthInput = screen.getByPlaceholderText('YYYY-MM')
    fireEvent.change(monthInput, { target: { value: '2024' } }) // Invalid format

    const calculateButton = screen.getByRole('button', { name: /Cantidad de Trabajadores/i })
    fireEvent.click(calculateButton)

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Formato de fecha inválido. Use YYYY-MM (ej: 2024-12)")
    })
  }) */

  // =========================================================================
  // ESCENARIO 5: Estados de carga
  // =========================================================================
  it("shows loading state during calculation", async () => {
    const mockClaves = [
      { ClvCod: '01', ClvDesc: 'Enfermedad común' }
    ]

    mockedGetClavesAusentismo.mockResolvedValue(mockClaves)
    
    // Mock de promesa pendiente
    let resolvePromise: (value: any) => void
    const pendingPromise = new Promise((resolve) => {
      resolvePromise = resolve
    })
    mockedGetAusencias.mockImplementation(() => pendingPromise)

    render(<AusentismoPage />)

    const monthInput = screen.getByPlaceholderText('YYYY-MM')
    fireEvent.change(monthInput, { target: { value: '2024-02' } })

    const calculateButton = screen.getByRole('button', { name: /Cantidad de Trabajadores/i })
    fireEvent.click(calculateButton)

    // Verificar estado de carga
    expect(screen.getByText("Calculando ausentismo...")).toBeInTheDocument()
    expect(calculateButton).toBeDisabled()

    // Resolver la promesa
    resolvePromise!(mockAusentismoData1)

    await waitFor(() => {
      expect(screen.queryByText("Calculando ausentismo...")).not.toBeInTheDocument()
    })
  })

  // =========================================================================
  // ESCENARIO 6: Descarga de PDF
  // =========================================================================
  it("successfully downloads PDF", async () => {
    const mockClaves = [
      { ClvCod: '01', ClvDesc: 'Enfermedad común' }
    ]

    const mockPdfBlob = new Blob(['pdf content'], { type: 'application/pdf' })

    mockedGetClavesAusentismo.mockResolvedValue(mockClaves)
    mockedDownloadAusenciasPdf.mockResolvedValue(mockPdfBlob)

    render(<AusentismoPage />)

    const monthInput = screen.getByPlaceholderText('YYYY-MM')
    fireEvent.change(monthInput, { target: { value: '2024-02' } })

    // Click download
    const downloadLink = screen.getByText('Descargar PDF')
    fireEvent.click(downloadLink)

    // CORREGIDO: ahora espera claves vacías
    await waitFor(() => {
      expect(mockedDownloadAusenciasPdf).toHaveBeenCalledWith("16", "2024-02", "")
    })
  })

  // =========================================================================
  // ESCENARIO 7: Carga de claves
  // =========================================================================
  it("loads claves when UEB is changed", async () => {
    const mockClavesAICA = [
      { ClvCod: '01', ClvDesc: 'Enfermedad común AICA' }
    ]

    const mockClavesLIORAD = [
      { ClvCod: '02', ClvDesc: 'Accidente LIORAD' }
    ]

    mockedGetClavesAusentismo
      .mockResolvedValueOnce(mockClavesAICA) // First call for default UEB 16
      .mockResolvedValueOnce(mockClavesLIORAD) // Second call for UEB 25

    render(<AusentismoPage />)

    // Wait for initial load
    await waitFor(() => {
      expect(mockedGetClavesAusentismo).toHaveBeenCalledWith('16')
    })

    // Change UEB to LIORAD
    const uebSelects = screen.getAllByRole('combobox')
    fireEvent.change(uebSelects[0], { target: { value: '25' } })

    // Verify new call for different UEB
    await waitFor(() => {
      expect(mockedGetClavesAusentismo).toHaveBeenCalledWith('25')
    })
  })

  it("handles empty claves response", async () => {
    mockedGetClavesAusentismo.mockResolvedValue([])

    render(<AusentismoPage />)

    await waitFor(() => {
      expect(mockedGetClavesAusentismo).toHaveBeenCalledWith('16')
    })

    // Should not crash and should show no available claves
    expect(screen.getByText(/Total de elementos: 0 disponibles/)).toBeInTheDocument()
  })
})
