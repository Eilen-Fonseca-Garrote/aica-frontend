import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InterruptosPage from './page';
import { getInterruptos, downloadInterruptosPdf } from '@/app/lib/api/interruptos';
import { downloadFile } from '@/app/lib/helpers';
import { InterruptosResponse } from './types';

// Mock de las dependencias
jest.mock('@/app/lib/api/interruptos');
jest.mock('@/app/lib/helpers');

// Mock de ToggleSection para simplificar pruebas
jest.mock('../uiLibrary/ToggleSection', () => ({
  __esModule: true,
  default: ({ children, title }: { children: React.ReactNode; title: string }) => (
    <div data-testid="toggle-section">
      <h1>{title}</h1>
      {children}
    </div>
  ),
}));

const mockedGetInterruptos = getInterruptos as jest.MockedFunction<typeof getInterruptos>;
const mockedDownloadInterruptosPdf = downloadInterruptosPdf as jest.MockedFunction<typeof downloadInterruptosPdf>;
const mockedDownloadFile = downloadFile as jest.MockedFunction<typeof downloadFile>;

describe('InterruptosPage - Pruebas de Caja Negra', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Helper para crear mock responses completos
  const createMockUEBResponse = (data: any): InterruptosResponse => ({
    interruptos: data.interruptos || null,
    interruptosAica: null,
    interruptosLiorad: null,
    interruptosJT: null,
    interruptosCitox: null,
    interruptosSH: null,
    totalReub: data.totalReub || { Total: 0, F: 0, M: 0 },
    totalCovid: data.totalCovid || { Total: 0, F: 0, M: 0 },
    totalProd25: data.totalProd25 || { Total: 0, F: 0, M: 0 },
    totalProd48: data.totalProd48 || { Total: 0, F: 0, M: 0 },
    totales: data.totales || {},
    totalesInt: data.totalesInt || null
  });

  // Escenario 1: Renderizado inicial y validaciones
  describe('Escenario 1 - Renderizado inicial y validaciones', () => {
    test('1.1 - Debe renderizar correctamente con valores por defecto', () => {
      render(<InterruptosPage />);
      
      // Verificar el título principal del ToggleSection
      expect(screen.getByRole('heading', { name: 'Trabajadores Interruptos', level: 1 })).toBeInTheDocument();
      
      // Verificar elementos específicos del formulario
      expect(screen.getByDisplayValue('Todas las UEBs')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /calcular/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /descargar/i })).toBeInTheDocument();
      
      // Verificar que hay un input de tipo month
      expect(screen.getByDisplayValue(/\d{4}-\d{2}/)).toBeInTheDocument();
    });

    test('1.2 - Debe mostrar mensaje de error al calcular sin fecha seleccionada', async () => {
      // Mock de window.alert
      const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
      
      render(<InterruptosPage />);
      
      // Cambiar UEB pero dejar fecha vacía
      const uebSelect = screen.getByDisplayValue('Todas las UEBs');
      await user.selectOptions(uebSelect, '16'); // AICA
      
      // Limpiar fecha
      const fechaInput = screen.getByDisplayValue(/\d{4}-\d{2}/) as HTMLInputElement;
      await user.clear(fechaInput);
      
      const calculateButton = screen.getByRole('button', { name: /calcular/i });
      await user.click(calculateButton);
      
      expect(mockAlert).toHaveBeenCalledWith('Por favor, seleccione una fecha');
      mockAlert.mockRestore();
    });
  });

  // Escenario 2: UEB Específica con Datos Válidos
  describe('Escenario 2 - UEB Específica con Datos Válidos', () => {
    const mockDataUEB16 = createMockUEBResponse({
      interruptos: [
        { Direccion: "Dirección A", covid: 5, reubicados: 3, produccion25: 2, produccion48: 1 },
        { Direccion: "Dirección B", covid: 2, reubicados: 1, produccion25: 0, produccion48: 4 }
      ],
      totalCovid: { Total: 7, F: 3, M: 4 },
      totalReub: { Total: 4, F: 2, M: 2 },
      totalProd25: { Total: 2, F: 1, M: 1 },
      totalProd48: { Total: 5, F: 2, M: 3 }
    });

    const mockDataUEB25 = createMockUEBResponse({
      interruptos: [
        { Direccion: "Sección X", covid: 0, reubicados: 0, produccion25: 0, produccion48: 0 },
        { Direccion: "Sección Y", covid: 10, reubicados: 5, produccion25: 3, produccion48: 2 }
      ],
      totalCovid: { Total: 10, F: 6, M: 4 },
      totalReub: { Total: 5, F: 3, M: 2 },
      totalProd25: { Total: 3, F: 2, M: 1 },
      totalProd48: { Total: 2, F: 1, M: 1 }
    });

    test('2.1 - Debe calcular correctamente para UEB AICA con datos completos', async () => {
      mockedGetInterruptos.mockResolvedValue(mockDataUEB16);
      
      render(<InterruptosPage />);
      
      // Configurar parámetros
      const uebSelect = screen.getByDisplayValue('Todas las UEBs');
      await user.selectOptions(uebSelect, '16'); // AICA
      
      const fechaInput = screen.getByDisplayValue(/\d{4}-\d{2}/);
      await user.clear(fechaInput);
      await user.type(fechaInput, '2024-03');
      
      // Ejecutar cálculo
      const calculateButton = screen.getByRole('button', { name: /calcular/i });
      await user.click(calculateButton);
      
      // Verificar llamada a API
      await waitFor(() => {
        expect(mockedGetInterruptos).toHaveBeenCalledWith(16, '2024-03');
      });
      
      // Verificar que se muestran los datos
      await waitFor(() => {
        expect(screen.getByText('Dirección A')).toBeInTheDocument();
        expect(screen.getByText('Dirección B')).toBeInTheDocument();
      });
    });

    test('2.2 - Debe calcular correctamente para UEB LIORAD con datos mixtos', async () => {
      mockedGetInterruptos.mockResolvedValue(mockDataUEB25);
      
      render(<InterruptosPage />);
      
      // Configurar parámetros
      const uebSelect = screen.getByDisplayValue('Todas las UEBs');
      await user.selectOptions(uebSelect, '25'); // LIORAD
      
      const fechaInput = screen.getByDisplayValue(/\d{4}-\d{2}/);
      await user.clear(fechaInput);
      await user.type(fechaInput, '2024-04');
      
      // Ejecutar cálculo
      const calculateButton = screen.getByRole('button', { name: /calcular/i });
      await user.click(calculateButton);
      
      // Verificar llamada a API
      await waitFor(() => {
        expect(mockedGetInterruptos).toHaveBeenCalledWith(25, '2024-04');
      });
      
      // Verificar datos
      await waitFor(() => {
        expect(screen.getByText('Sección X')).toBeInTheDocument();
        expect(screen.getByText('Sección Y')).toBeInTheDocument();
      });
    });
  });

  // Escenario 3: Todas las UEBs (ueb = "0")
  describe('Escenario 3 - Todas las UEBs', () => {
    const mockDataTodasUEBs1 = createMockUEBResponse({
      totales: {
        "AICA": {
          "Covid": { Total: 7, F: 3, M: 4 },
          "Reubic": { Total: 4, F: 2, M: 2 },
          "Prod25": { Total: 2, F: 1, M: 1 },
          "Prod48": { Total: 5, F: 2, M: 3 }
        },
        "LIORAD": {
          "Covid": { Total: 10, F: 6, M: 4 },
          "Reubic": { Total: 5, F: 3, M: 2 },
          "Prod25": { Total: 3, F: 2, M: 1 },
          "Prod48": { Total: 2, F: 1, M: 1 }
        }
      },
      totalesInt: {
        Covid: { Total: 17, F: 9, M: 8 },
        Reubic: { Total: 9, F: 5, M: 4 },
        Prod25: { Total: 5, F: 3, M: 2 },
        Prod48: { Total: 7, F: 3, M: 4 }
      }
    });

    const mockDataTodasUEBs2 = createMockUEBResponse({
      totales: {
        "CITOX": {
          "Covid": { Total: 3, F: 1, M: 2 },
          "Reubic": { Total: 2, F: 1, M: 1 },
          "Prod25": { Total: 1, F: 0, M: 1 },
          "Prod48": { Total: 4, F: 2, M: 2 }
        },
        "JULIO TRIGO": {
          "Covid": { Total: 8, F: 5, M: 3 },
          "Reubic": { Total: 3, F: 2, M: 1 },
          "Prod25": { Total: 2, F: 1, M: 1 },
          "Prod48": { Total: 1, F: 0, M: 1 }
        },
        "SH+": {
          "Covid": { Total: 6, F: 4, M: 2 },
          "Reubic": { Total: 4, F: 2, M: 2 },
          "Prod25": { Total: 3, F: 2, M: 1 },
          "Prod48": { Total: 2, F: 1, M: 1 }
        }
      },
      totalesInt: {
        Covid: { Total: 17, F: 10, M: 7 },
        Reubic: { Total: 9, F: 5, M: 4 },
        Prod25: { Total: 6, F: 3, M: 3 },
        Prod48: { Total: 7, F: 3, M: 4 }
      }
    });

    test('3.1 - Debe calcular correctamente para todas las UEBs con datos completos', async () => {
      mockedGetInterruptos.mockResolvedValue(mockDataTodasUEBs1);
      
      render(<InterruptosPage />);
      
      // Ya está seleccionada "Todas las UEBs" por defecto
      const fechaInput = screen.getByDisplayValue(/\d{4}-\d{2}/);
      await user.clear(fechaInput);
      await user.type(fechaInput, '2024-05');
      
      const calculateButton = screen.getByRole('button', { name: /calcular/i });
      await user.click(calculateButton);
      
      await waitFor(() => {
        expect(mockedGetInterruptos).toHaveBeenCalledWith(0, '2024-05');
      });
      
      // Verificar que se muestran las UEBs individuales
      await waitFor(() => {
        expect(screen.getByText('UEB AICA')).toBeInTheDocument();
        expect(screen.getByText('UEB LIORAD')).toBeInTheDocument();
      });
    });

    test('3.2 - Debe calcular correctamente para todas las UEBs con múltiples empresas', async () => {
      mockedGetInterruptos.mockResolvedValue(mockDataTodasUEBs2);
      
      render(<InterruptosPage />);
      
      const fechaInput = screen.getByDisplayValue(/\d{4}-\d{2}/);
      await user.clear(fechaInput);
      await user.type(fechaInput, '2024-06');
      
      const calculateButton = screen.getByRole('button', { name: /calcular/i });
      await user.click(calculateButton);
      
      await waitFor(() => {
        expect(mockedGetInterruptos).toHaveBeenCalledWith(0, '2024-06');
      });
      
      // Verificar múltiples UEBs
      await waitFor(() => {
        expect(screen.getByText('UEB CITOX')).toBeInTheDocument();
        expect(screen.getByText('UEB JULIO TRIGO')).toBeInTheDocument();
        expect(screen.getByText('UEB SH+')).toBeInTheDocument();
      });
    });
  });

  // Escenario 4: Descarga de PDF
  describe('Escenario 4 - Descarga de PDF', () => {
    const mockPdfBlob = new Blob(['mock pdf content'], { type: 'application/pdf' });

    test('4.1 - Debe descargar PDF para UEB específica', async () => {
      mockedDownloadInterruptosPdf.mockResolvedValue(mockPdfBlob);
      
      render(<InterruptosPage />);
      
      // Configurar parámetros
      const uebSelect = screen.getByDisplayValue('Todas las UEBs');
      await user.selectOptions(uebSelect, '55'); // JULIO TRIGO
      
      const fechaInput = screen.getByDisplayValue(/\d{4}-\d{2}/);
      await user.clear(fechaInput);
      await user.type(fechaInput, '2024-07');
      
      // Ejecutar descarga
      const downloadLink = screen.getByRole('link', { name: /descargar/i });
      await user.click(downloadLink);
      
      await waitFor(() => {
        expect(mockedDownloadInterruptosPdf).toHaveBeenCalledWith('55', '2024-07');
        expect(mockedDownloadFile).toHaveBeenCalledWith(mockPdfBlob, 'Interruptos_55_2024-07.pdf');
      });
    });

    test('4.2 - Debe descargar PDF para todas las UEBs', async () => {
      mockedDownloadInterruptosPdf.mockResolvedValue(mockPdfBlob);
      
      render(<InterruptosPage />);
      
      // Usar "Todas las UEBs" por defecto
      const fechaInput = screen.getByDisplayValue(/\d{4}-\d{2}/);
      await user.clear(fechaInput);
      await user.type(fechaInput, '2024-08');
      
      const downloadLink = screen.getByRole('link', { name: /descargar/i });
      await user.click(downloadLink);
      
      await waitFor(() => {
        expect(mockedDownloadInterruptosPdf).toHaveBeenCalledWith('0', '2024-08');
        expect(mockedDownloadFile).toHaveBeenCalledWith(mockPdfBlob, 'Interruptos_0_2024-08.pdf');
      });
    });
  });

  // Escenario 5: Estados de Error
  describe('Escenario 5 - Estados de Error', () => {
    test('5.1 - Debe manejar error en cálculo de interruptos', async () => {
      mockedGetInterruptos.mockRejectedValue(new Error('Error de servidor'));
      
      render(<InterruptosPage />);
      
      const fechaInput = screen.getByDisplayValue(/\d{4}-\d{2}/);
      await user.clear(fechaInput);
      await user.type(fechaInput, '2024-09');
      
      const calculateButton = screen.getByRole('button', { name: /calcular/i });
      await user.click(calculateButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Ha ocurrido un error calculando los interruptos/)).toBeInTheDocument();
      });
    });

    test('5.2 - Debe manejar error en descarga de PDF', async () => {
      mockedDownloadInterruptosPdf.mockRejectedValue(new Error('Error de descarga'));
      
      render(<InterruptosPage />);
      
      const fechaInput = screen.getByDisplayValue(/\d{4}-\d{2}/);
      await user.clear(fechaInput);
      await user.type(fechaInput, '2024-10');
      
      const downloadLink = screen.getByRole('link', { name: /descargar/i });
      await user.click(downloadLink);
      
      // El componente muestra el mismo mensaje de error genérico para ambos casos
      // según el código que proporcionaste
      await waitFor(() => {
        expect(screen.getByText(/Ha ocurrido un error calculando los interruptos/)).toBeInTheDocument();
      });
    });
  });

  // Escenario 6: Casos Especiales
  describe('Escenario 6 - Casos Especiales', () => {
    test('6.1 - Debe manejar respuesta vacía para UEB específica', async () => {
      mockedGetInterruptos.mockResolvedValue(createMockUEBResponse({
        interruptos: [],
        totalCovid: { Total: 0, F: 0, M: 0 },
        totalReub: { Total: 0, F: 0, M: 0 },
        totalProd25: { Total: 0, F: 0, M: 0 },
        totalProd48: { Total: 0, F: 0, M: 0 }
      }));
      
      render(<InterruptosPage />);
      
      const uebSelect = screen.getByDisplayValue('Todas las UEBs');
      await user.selectOptions(uebSelect, '57'); // SH+
      
      const fechaInput = screen.getByDisplayValue(/\d{4}-\d{2}/);
      await user.clear(fechaInput);
      await user.type(fechaInput, '2024-11');
      
      const calculateButton = screen.getByRole('button', { name: /calcular/i });
      await user.click(calculateButton);
      
      // Debe mostrar los totales aunque no haya datos específicos
      await waitFor(() => {
        expect(screen.getByText('Total Femenino')).toBeInTheDocument();
        expect(screen.getByText('Total Masculino')).toBeInTheDocument();
        expect(screen.getByText('Total General')).toBeInTheDocument();
      });
    });

    test('6.2 - Debe manejar datos nulos en respuesta de todas las UEBs', async () => {
      mockedGetInterruptos.mockResolvedValue(createMockUEBResponse({
        totales: {},
        totalesInt: null
      }));
      
      render(<InterruptosPage />);
      
      const fechaInput = screen.getByDisplayValue(/\d{4}-\d{2}/);
      await user.clear(fechaInput);
      await user.type(fechaInput, '2024-12');
      
      const calculateButton = screen.getByRole('button', { name: /calcular/i });
      await user.click(calculateButton);
      
      // No debería crashar y mostrar "Sin resultados aún"
      await waitFor(() => {
        expect(screen.getByText(/Sin resultados aún/)).toBeInTheDocument();
      });
    });
  });
});
