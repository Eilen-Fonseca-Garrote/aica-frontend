"use client"

import { downloadFile } from "@/app/lib/helpers"
import { downloadModeloRL4Xls } from "@/app/lib/api/reportes"
import { FileSpreadsheet, Loader2, AlertCircle, CheckCircle } from "lucide-react"

interface ModeloRl4ActionsProps {
  mesAnio: string
  diasNoLaborables: string
  onExportStatusChange?: (status: "idle" | "loading" | "success" | "error", error?: string) => void
  exportStatus?: "idle" | "loading" | "success" | "error"
  errorMessage?: string
  isFormValid?: boolean
}

const TEXT_ACTION_CLASS =
  "inline-flex h-10 items-center gap-2 text-sm font-semibold text-[#0a8ca8] hover:text-[#08778f] disabled:text-gray-400 disabled:cursor-not-allowed"

const ModeloRl4Actions = ({ 
  mesAnio, 
  diasNoLaborables,
  onExportStatusChange,
  exportStatus = "idle",
  errorMessage = "",
  isFormValid = true
}: ModeloRl4ActionsProps) => {
  
  const downloading = exportStatus === "loading";
  const isDisabled = downloading || !isFormValid;
  
  const handleExportarExcel = async () => {
    if (!isFormValid) return;
    
    onExportStatusChange?.("loading");
    
    try {
      const file = await downloadModeloRL4Xls(diasNoLaborables, mesAnio);
      await downloadFile(file, 'modeloRL4.xlsx');
      onExportStatusChange?.("success");
      
      setTimeout(() => {
        onExportStatusChange?.("idle");
      }, 3000);
      
    } catch (error) {
      console.error("Error al exportar Modelo RL4:", error);
      const errorMsg = error instanceof Error ? error.message : "Error al exportar el archivo";
      onExportStatusChange?.("error", errorMsg);
    }
  }

  const getStatusIcon = () => {
    switch (exportStatus) {
      case "loading":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileSpreadsheet className="h-4 w-4" />;
    }
  }

  const getButtonText = () => {
    switch (exportStatus) {
      case "loading":
        return "Exportando...";
      case "success":
        return "¡Exportado!";
      case "error":
        return "Error";
      default:
        return "Excel";
    }
  }

  return (
    <div className="flex flex-col items-end gap-4">
      <div className="flex items-center gap-4">
        <button
          type="button"
          disabled={isDisabled}
          onClick={handleExportarExcel}
          className={TEXT_ACTION_CLASS}
          title={!isFormValid ? "Complete los campos correctamente" : ""}
        >
          {getStatusIcon()}
          <span>{getButtonText()}</span>
        </button>
      </div>
      
      {/* Mensaje de error de validación del formulario */}
      {!isFormValid && exportStatus !== "error" && (
        <div className="flex items-start gap-2 rounded-md bg-yellow-50 p-3 text-sm text-yellow-800 border border-yellow-200 w-full max-w-md">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Campos inválidos</p>
            <p>Complete el campo de días no laborables correctamente antes de exportar</p>
          </div>
        </div>
      )}
      
      {/* Mensaje de error de exportación */}
      {exportStatus === "error" && errorMessage && (
        <div className="flex items-start gap-2 rounded-md bg-red-50 p-3 text-sm text-red-800 border border-red-200 w-full max-w-md">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error al exportar</p>
            <p className="text-red-700">{errorMessage}</p>
          </div>
        </div>
      )}
      
      {/* Mensaje de éxito */}
      {exportStatus === "success" && (
        <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-800 border border-green-200 w-full max-w-md">
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          <span>Archivo exportado correctamente</span>
        </div>
      )}
    </div>
  )    
}

export default ModeloRl4Actions