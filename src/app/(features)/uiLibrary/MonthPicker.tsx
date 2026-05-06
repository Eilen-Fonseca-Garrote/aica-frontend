"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

interface CustomMonthPickerProps {
  value: string;           // formato YYYY-MM
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

const MONTHS = [
  "Ene", "Feb", "Mar", "Abr",
  "May", "Jun", "Jul", "Ago",
  "Sep", "Oct", "Nov", "Dic",
];

const MONTHS_FULL = [
  "Enero", "Febrero", "Marzo", "Abril",
  "Mayo", "Junio", "Julio", "Agosto",
  "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

/**
 * Parsea "YYYY-MM" de forma segura sin conversiones UTC→local.
 * Devuelve { year, month } donde month es 0-indexed.
 */
function parseYYYYMM(value: string): { year: number; month: number } | null {
  const match = value?.match(/^(\d{4})-(\d{2})$/);
  if (!match) return null;
  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1; // 0-indexed
  if (month < 0 || month > 11) return null;
  return { year, month };
}

export default function CustomMonthPicker({
  value,
  onChange,
  placeholder = "Seleccione mes y año",
  className,
}: CustomMonthPickerProps) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed

  const parsed = parseYYYYMM(value);

  // Año que se está navegando en el picker (paso 1)
  const [viewYear, setViewYear] = useState<number>(
    parsed?.year ?? currentYear
  );

  // Paso del picker: "year" muestra selector de año, "month" muestra grilla de meses
  const [step, setStep] = useState<"year" | "month">("year");

  // Año seleccionado en paso 1 (antes de elegir mes)
  const [selectedYear, setSelectedYear] = useState<number | null>(
    parsed?.year ?? null
  );

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sincronizar si el value cambia externamente
  useEffect(() => {
    const p = parseYYYYMM(value);
    if (p) {
      setSelectedYear(p.year);
      setViewYear(p.year);
    }
  }, [value]);

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Rango de años a mostrar (década centrada en viewYear) ──────────────────
  const decadeStart = Math.floor(viewYear / 10) * 10;
  const yearRange = Array.from({ length: 12 }, (_, i) => decadeStart + i);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleToggle = () => {
    if (!open) {
      // Al abrir, reset al paso de año
      const p = parseYYYYMM(value);
      setViewYear(p?.year ?? currentYear);
      setSelectedYear(p?.year ?? null);
      setStep("year");
    }
    setOpen((o) => !o);
  };

  const handleYearSelect = (year: number) => {
    if (year > currentYear) return; // no futuros
    setSelectedYear(year);
    setStep("month");
  };

  const handleMonthSelect = (monthIdx: number) => {
    if (!selectedYear) return;
    if (selectedYear === currentYear && monthIdx > currentMonth) return; // no futuros
    const mm = String(monthIdx + 1).padStart(2, "0");
    onChange(`${selectedYear}-${mm}`);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setSelectedYear(null);
  };

  // Navegar décadas (paso year)
  const prevDecade = () => setViewYear((y) => y - 10);
  const nextDecade = () => {
    if (decadeStart + 10 <= currentYear) setViewYear((y) => y + 10);
  };

  // ── Etiqueta del input ─────────────────────────────────────────────────────
  const displayLabel = (() => {
    const p = parseYYYYMM(value);
    if (!p) return "";
    return `${MONTHS_FULL[p.month]} ${p.year}`;
  })();

  // ── Estilos compartidos ────────────────────────────────────────────────────
  const inputBase =
    className ??
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a8ca8]/40 text-black bg-white";

  return (
    <div ref={containerRef} className="relative w-full" data-testid="month-picker">
      {/* Input visual */}
      <div className="relative">
        <input
          readOnly
          data-testid="month-input"
          value={displayLabel}
          placeholder={placeholder}
          onClick={handleToggle}
          className={`${inputBase} cursor-pointer pr-8`}
        />
        <span
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        >
          <ChevronDown className="h-4 w-4" />
        </span>
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-7 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs px-1"
            title="Limpiar"
          >
            ✕
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-64 rounded-lg border border-gray-200 bg-white shadow-lg">
          
          {/* ── PASO 1: Selección de año ── */}
          {step === "year" && (
            <div className="p-3">
              {/* Cabecera navegación décadas */}
              <div className="flex items-center justify-between mb-3">
                <button
                  type="button"
                  onClick={prevDecade}
                  className="p-1 rounded hover:bg-gray-100 text-gray-600"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-semibold text-gray-700">
                  {decadeStart} – {decadeStart + 11}
                </span>
                <button
                  type="button"
                  onClick={nextDecade}
                  disabled={decadeStart + 10 > currentYear}
                  className="p-1 rounded hover:bg-gray-100 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Grilla de años */}
              <div className="grid grid-cols-3 gap-1">
                {yearRange.map((year) => {
                  const isFuture = year > currentYear;
                  const isSelected = year === selectedYear;
                  const isCurrent = year === currentYear;
                  return (
                    <button
                      key={year}
                      type="button"
                      disabled={isFuture}
                      onClick={() => handleYearSelect(year)}
                      className={`
                        rounded py-2 text-sm font-medium transition-colors
                        ${isFuture
                          ? "text-gray-300 cursor-not-allowed"
                          : isSelected
                          ? "bg-[#0a8ca8] text-white"
                          : isCurrent
                          ? "border border-[#0a8ca8] text-[#0a8ca8] hover:bg-[#0a8ca8]/10"
                          : "text-gray-700 hover:bg-gray-100"}
                      `}
                    >
                      {year}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── PASO 2: Selección de mes ── */}
          {step === "month" && selectedYear !== null && (
            <div className="p-3">
              {/* Cabecera con año seleccionado (volver) */}
              <div className="flex items-center justify-between mb-3">
                <button
                  type="button"
                  onClick={() => setStep("year")}
                  className="p-1 rounded hover:bg-gray-100 text-gray-600"
                  title="Volver a selección de año"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-semibold text-[#0a8ca8]">
                  {selectedYear}
                </span>
                <div className="w-6" /> {/* spacer */}
              </div>

              {/* Grilla de meses */}
              <div className="grid grid-cols-3 gap-1">
                {MONTHS.map((label, idx) => {
                  const isFuture =
                    selectedYear === currentYear && idx > currentMonth;
                  const parsed2 = parseYYYYMM(value);
                  const isSelected =
                    parsed2?.year === selectedYear && parsed2?.month === idx;
                  const isCurrent =
                    selectedYear === currentYear && idx === currentMonth;

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isFuture}
                      onClick={() => handleMonthSelect(idx)}
                      className={`
                        rounded py-2 text-sm font-medium transition-colors
                        ${isFuture
                          ? "text-gray-300 cursor-not-allowed"
                          : isSelected
                          ? "bg-[#0a8ca8] text-white"
                          : isCurrent
                          ? "border border-[#0a8ca8] text-[#0a8ca8] hover:bg-[#0a8ca8]/10"
                          : "text-gray-700 hover:bg-gray-100"}
                      `}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
