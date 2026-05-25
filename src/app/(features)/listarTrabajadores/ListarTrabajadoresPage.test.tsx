// ListarTrabajadoresPage.test.tsx
/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ListarTrabajadoresPage from './page'

// Mock de las dependencias
jest.mock('@/app/lib/api/reportes', () => ({
  downloadAllWorkersXls: jest.fn(),
  downloadAllWorkersPdf: jest.fn(),
  downloadTrabajadoresFisicosXls: jest.fn(),
  downloadTrabajadoresFisicosPdf: jest.fn(),
}))

jest.mock('@/app/lib/api/listarTrabajadores', () => ({
  getListarTrabajadoresOptions: jest.fn().mockResolvedValue({
    direcciones: [],
    municipios: [],
    nivelEscolar: [],
    cargos: [],
    categoriasCientificas: [],
  }),
  getSubCategoriasCientificas: jest.fn().mockResolvedValue([]),
  filtrarTrabajadores: jest.fn(),
}))

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

// Mock simplificado para ToggleSection
jest.mock('../uiLibrary/ToggleSection', () => ({
  __esModule: true,
  default: function MockToggleSection({ 
    children, 
    title
  }: { 
    children: React.ReactNode;
    title: string;
    color?: string;
    defaultExpanded?: boolean;
  }) {
    return (
      <div>
        <h1>{title}</h1>
        <div>{children}</div>
      </div>
    );
  },
}))

// Mock simplificado para los iconos de Lucide React
jest.mock('lucide-react', () => ({
  ChevronUp: () => <div>ChevronUp</div>,
  ChevronDown: () => <div>ChevronDown</div>,
  ChevronLeft: () => <div>ChevronLeft</div>,
  ChevronRight: () => <div>ChevronRight</div>,
  ArrowLeft: () => <div>ArrowLeft</div>,
  Eye: () => <div>Eye</div>,
  FileSpreadsheet: () => <div>FileSpreadsheet</div>,
  FileText: () => <div>FileText</div>,
  Search: () => <div>Search</div>,
  Loader2: () => <div>Loader2</div>,
}))

import * as reportes from "@/app/lib/api/reportes"

// Cast explícito a jest.Mock
const mockedDownloadAllWorkersXls = reportes.downloadAllWorkersXls as jest.Mock;

describe('<ListarTrabajadoresPage /> - Pruebas Simplificadas', () => {
  beforeAll(() => {
    // Mock de console.error y alert
    jest.spyOn(console, 'error').mockImplementation(() => {});
    window.alert = jest.fn();
    
    // Mock simplificado de URL methods
    global.URL.createObjectURL = jest.fn();
    global.URL.revokeObjectURL = jest.fn();
  });

  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =========================================================================
  // ESCENARIO 1: Renderizado inicial
  // =========================================================================
  it("renders the page with initial state", () => {
    render(<ListarTrabajadoresPage />)

    // Verificar elementos principales
    expect(screen.getByText("Listar Trabajadores")).toBeInTheDocument()
    expect(screen.getByText("Volver al Menú")).toBeInTheDocument()
    
    // Verificar secciones colapsables
    expect(screen.getByText("Filtrar Trabajadores")).toBeInTheDocument()
    expect(screen.getByText("Exportar Trabajadores")).toBeInTheDocument()
    
    // Verificar que las secciones están inicialmente colapsadas
    expect(screen.queryByText("Seleccionar Direccion...")).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /excel/i })).not.toBeInTheDocument()
  })

  // =========================================================================
  // ESCENARIO 2: Exportación exitosa a Excel
  // =========================================================================
  it("successfully exports to Excel", async () => {
    // Mock exitoso de la API
    const mockBlob = new Blob(['excel content'])
    mockedDownloadAllWorkersXls.mockResolvedValue(mockBlob)

    render(<ListarTrabajadoresPage />)

    // Expandir sección de exportar
    fireEvent.click(screen.getByText("Exportar Trabajadores"))
    
    const excelButton = screen.getAllByRole('button', { name: /excel/i })[0]
    
    // Verificar estado inicial del botón
    expect(excelButton).not.toBeDisabled()
    expect(screen.getAllByText("Excel").length).toBeGreaterThan(0)

    // Iniciar exportación
    fireEvent.click(excelButton)

    // Verificar estado de carga
    expect(excelButton).toBeDisabled()
    expect(screen.getByText(/exportando/i)).toBeInTheDocument()

    // Esperar a que se complete la exportación
    await waitFor(() => {
      expect(mockedDownloadAllWorkersXls).toHaveBeenCalledTimes(1)
    })

    // Verificar que se restauró el estado del botón
    await waitFor(() => {
      expect(excelButton).not.toBeDisabled()
    })
    expect(screen.getAllByText("Excel").length).toBeGreaterThan(0)
  })

  // =========================================================================
  // ESCENARIO 3: Manejo de errores en exportación
  // =========================================================================
  it("handles export error gracefully", async () => {
    // Mock de error en la API
    mockedDownloadAllWorkersXls.mockRejectedValue(new Error("Export failed"))

    render(<ListarTrabajadoresPage />)

    // Expandir sección de exportar
    fireEvent.click(screen.getByText("Exportar Trabajadores"))
    
    const excelButton = screen.getAllByRole('button', { name: /excel/i })[0]
    
    // Iniciar exportación
    fireEvent.click(excelButton)

    // Verificar estado de carga
    expect(excelButton).toBeDisabled()

    // Esperar a que se maneje el error
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Error al exportar el archivo Excel")
    })

    // Verificar que el botón se habilita nuevamente después del error
    await waitFor(() => {
      expect(excelButton).not.toBeDisabled()
    })
  })

  // =========================================================================
  // ESCENARIO 4: Estados de carga durante exportación
  // =========================================================================
  it("shows loading state during export", async () => {
    // Mock para controlar manualmente la promesa
    let resolveExport: (value: Blob) => void;
    const exportPromise = new Promise<Blob>((resolve) => {
      resolveExport = resolve;
    });
    mockedDownloadAllWorkersXls.mockImplementation(() => exportPromise);

    render(<ListarTrabajadoresPage />);

    // Expandir sección de exportar
    fireEvent.click(screen.getByText("Exportar Trabajadores"));
    
    const excelButton = screen.getAllByRole('button', { name: /excel/i })[0];
    
    // Verificar estado inicial
    expect(excelButton).not.toBeDisabled();
    expect(screen.getAllByText("Excel").length).toBeGreaterThan(0);

    // Iniciar exportación
    fireEvent.click(excelButton);

    // Verificar estado de carga inmediatamente después del click
    expect(excelButton).toBeDisabled();
    expect(screen.getByText(/exportando/i)).toBeInTheDocument();

    // Resolver la promesa después de un breve delay para simular proceso
    setTimeout(() => {
      resolveExport(new Blob(['content']));
    }, 100);

    // Esperar a que se complete la exportación y verificar estado final
    await waitFor(() => {
      expect(excelButton).not.toBeDisabled();
    }, { timeout: 2000 });
    
    expect(screen.getAllByText("Excel").length).toBeGreaterThan(0);
  });
});
