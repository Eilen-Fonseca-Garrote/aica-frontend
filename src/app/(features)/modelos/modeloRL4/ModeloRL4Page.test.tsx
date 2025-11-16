// ModeloRl4Page.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ModeloRl4Page from './page'

// Mock de las dependencias
jest.mock('@/app/lib/api/reportes', () => ({
  downloadModeloRL4Xls: jest.fn(),
}))

jest.mock('@/app/lib/helpers', () => ({
  downloadFile: jest.fn(),
}))

// Importar después de los mocks
import * as reportes from "@/app/lib/api/reportes"
import { downloadFile } from '@/app/lib/helpers'

// Cast explícito a jest.Mock
const mockedDownloadModeloRL4Xls = reportes.downloadModeloRL4Xls as jest.Mock;
const mockedDownloadFile = downloadFile as jest.Mock;

// Mock global de console.error para evitar errores en consola
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

describe('<ModeloRl4Page />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =========================================================================
  // ESCENARIO 1: Renderizado inicial del formulario
  // =========================================================================
  it("renders the form with initial values", () => {
    render(<ModeloRl4Page />)

    // Usar getByPlaceholderText que es más confiable
    const mesAnioInput = screen.getByPlaceholderText("09-2025") as HTMLInputElement
    const diasInput = screen.getByPlaceholderText("8") as HTMLInputElement
    
    expect(mesAnioInput).toBeInTheDocument()
    expect(diasInput).toBeInTheDocument()
    
    // Verificar botón de exportación
    expect(screen.getByRole('button', { name: /excel/i })).toBeInTheDocument()
  })

  // =========================================================================
  // ESCENARIO 2: Cambio de valores en los campos del formulario
  // =========================================================================
  it("updates form fields when changed", () => {
    render(<ModeloRl4Page />)

    const mesAnioInput = screen.getByPlaceholderText("09-2025") as HTMLInputElement
    const diasInput = screen.getByPlaceholderText("8") as HTMLInputElement
    
    // Cambiar valores
    fireEvent.change(mesAnioInput, { target: { value: '2024-12' } })
    fireEvent.change(diasInput, { target: { value: '10' } })
    
    expect(mesAnioInput.value).toBe('2024-12')
    expect(diasInput.value).toBe('10')
  })

  // =========================================================================
  // ESCENARIO 3: Exportación exitosa
  // =========================================================================
  it("successfully exports Excel", async () => {
    const mockBlob = new Blob(['excel content'])
    mockedDownloadModeloRL4Xls.mockResolvedValue(mockBlob)
    mockedDownloadFile.mockResolvedValue(undefined)

    render(<ModeloRl4Page />)

    const exportButton = screen.getByRole('button', { name: /excel/i })
    fireEvent.click(exportButton)

    // Verificar que se muestra el estado de carga
    expect(exportButton).toBeDisabled()

    // Esperar a que se complete la descarga
    await waitFor(() => {
      expect(mockedDownloadModeloRL4Xls).toHaveBeenCalledWith("8", "09-2025")
    })

    await waitFor(() => {
      expect(mockedDownloadFile).toHaveBeenCalledWith(mockBlob, 'modeloRL4.xlsx')
    })

    // Verificar que el botón se habilita nuevamente
    await waitFor(() => {
      expect(exportButton).not.toBeDisabled()
    })
  })

  // =========================================================================
  // ESCENARIO 4: Exportación con valores modificados
  // =========================================================================
  it("successfully exports Excel with modified values", async () => {
    const mockBlob = new Blob(['excel content'])
    mockedDownloadModeloRL4Xls.mockResolvedValue(mockBlob)
    mockedDownloadFile.mockResolvedValue(undefined)

    render(<ModeloRl4Page />)

    // Modificar los valores antes de exportar
    const mesAnioInput = screen.getByPlaceholderText("09-2025")
    const diasInput = screen.getByPlaceholderText("8")
    
    fireEvent.change(mesAnioInput, { target: { value: '2024-06' } })
    fireEvent.change(diasInput, { target: { value: '12' } })

    const exportButton = screen.getByRole('button', { name: /excel/i })
    fireEvent.click(exportButton)

    await waitFor(() => {
      expect(mockedDownloadModeloRL4Xls).toHaveBeenCalledWith("12", "2024-06")
    })
  })

  // =========================================================================
  // ESCENARIO 5: Estados de carga
  // =========================================================================
  it("shows loading state during export", async () => {
    // Mock de promesa pendiente
    let resolvePromise: (value: any) => void
    const pendingPromise = new Promise((resolve) => {
      resolvePromise = resolve
    })
    mockedDownloadModeloRL4Xls.mockImplementation(() => pendingPromise)

    render(<ModeloRl4Page />)

    const exportButton = screen.getByRole('button', { name: /excel/i })
    
    // Verificar que inicialmente está habilitado
    expect(exportButton).not.toBeDisabled()

    // Iniciar exportación
    fireEvent.click(exportButton)

    // Verificar que se deshabilita durante la carga
    expect(exportButton).toBeDisabled()

    // Resolver la promesa
    const mockBlob = new Blob(['content'])
    resolvePromise!(mockBlob)

    // Esperar a que se complete y se habilite
    await waitFor(() => {
      expect(exportButton).not.toBeDisabled()
    })
  })

  // =========================================================================
  // ESCENARIO 6: Múltiples exportaciones consecutivas
  // =========================================================================
  it("handles multiple consecutive exports", async () => {
    const mockBlob = new Blob(['excel content'])
    mockedDownloadModeloRL4Xls.mockResolvedValue(mockBlob)
    mockedDownloadFile.mockResolvedValue(undefined)

    render(<ModeloRl4Page />)

    const exportButton = screen.getByRole('button', { name: /excel/i })
    
    // Primera exportación
    fireEvent.click(exportButton)
    await waitFor(() => {
      expect(mockedDownloadModeloRL4Xls).toHaveBeenCalledWith("8", "09-2025")
    })

    // Cambiar valores
    const mesAnioInput = screen.getByPlaceholderText("09-2025")
    const diasInput = screen.getByPlaceholderText("8")
    fireEvent.change(mesAnioInput, { target: { value: '2024-08' } })
    fireEvent.change(diasInput, { target: { value: '7' } })

    // Segunda exportación con nuevos valores
    fireEvent.click(exportButton)
    await waitFor(() => {
      expect(mockedDownloadModeloRL4Xls).toHaveBeenCalledWith("7", "2024-08")
    })

    // Verificar que se llamó dos veces
    expect(mockedDownloadModeloRL4Xls).toHaveBeenCalledTimes(2)
  })

  // =========================================================================
  // ESCENARIO 7: Nombre del archivo descargado
  // =========================================================================
  it("uses correct filename for downloaded Excel", async () => {
    const mockBlob = new Blob(['excel content'])
    mockedDownloadModeloRL4Xls.mockResolvedValue(mockBlob)
    mockedDownloadFile.mockResolvedValue(undefined)

    render(<ModeloRl4Page />)

    const exportButton = screen.getByRole('button', { name: /excel/i })
    fireEvent.click(exportButton)

    await waitFor(() => {
      expect(mockedDownloadFile).toHaveBeenCalledWith(mockBlob, 'modeloRL4.xlsx')
    })
  })

  // =========================================================================
  // ESCENARIO 8: Verificación de tipos de campos
  // =========================================================================
  it("has correct input types", () => {
    render(<ModeloRl4Page />)

    const mesAnioInput = screen.getByPlaceholderText("09-2025")
    const diasInput = screen.getByPlaceholderText("8")

    expect(mesAnioInput).toHaveAttribute('type', 'month')
    expect(diasInput).toHaveAttribute('type', 'number')
  })

})
