// AusentismoForm.tsx
import Select from "@/app/(features)/uiLibrary/Select";
import AusentismoActions from "./ausentismoActions";
import { useState, useMemo, useEffect } from "react"
import { ClaveAusentismo } from "./types";

interface AusentismoFormProps {
  ueb: string;
  fecha: string;
  claves: ClaveAusentismo[];
  clavesDireccion: string[];
  onChangeUeb: (v: string) => void;
  onChangeFecha: (v: string) => void;
  onChangeClaves: (v: string) => void;
  onCalculate: () => void;
  onDownload: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  loading?: boolean;
}

export default function AusentismoForm({
  ueb,
  fecha,
  claves,
  clavesDireccion,
  onChangeUeb,
  onChangeFecha,
  onChangeClaves,
  onCalculate,
  onDownload,
  loading = false,
}: AusentismoFormProps) {
  const uebOptions = [
    { label: "Todas las UEBs", value: "0" },
    { label: "AICA", value: "16" },
    { label: "LIORAD", value: "25" },
    { label: "CITOX", value: "100" },
    { label: "JULIO TRIGO", value: "55" },
    { label: "SH+", value: "57" },
  ];

  const [leftFilter, setLeftFilter] = useState("");
  const [rightFilter, setRightFilter] = useState("");
  const [selectedItems, setSelectedItems] = useState<ClaveAusentismo[]>([]);
  const [availableItems, setAvailableItems] = useState<ClaveAusentismo[]>([]);

  // Actualizar availableItems cuando cambien las claves de la API
  useEffect(() => {
    setAvailableItems(claves);
  }, [claves]);

  // Filtrar items disponibles
  const filteredLeftItems = useMemo(() => {
    return availableItems
      .filter(item => !selectedItems.some(selected => selected.ClvCod === item.ClvCod))
      .filter(item => 
        item.ClvDesc.toLowerCase().includes(leftFilter.toLowerCase())
      );
  }, [availableItems, leftFilter, selectedItems]);

  // Filtrar items seleccionados
  const filteredRightItems = useMemo(() => {
    return selectedItems.filter(item => 
      item.ClvDesc.toLowerCase().includes(rightFilter.toLowerCase())
    );
  }, [selectedItems, rightFilter]);

  // Mover elemento de disponibles a seleccionados
  const moveToSelected = (item: ClaveAusentismo) => {
    setSelectedItems(prev => [...prev, item]);
  };

  // Mover elemento de seleccionados a disponibles
  const moveToAvailable = (item: ClaveAusentismo) => {
    setSelectedItems(prev => prev.filter(i => i.ClvCod !== item.ClvCod));
  };

  // Mover todos los elementos filtrados
  const moveAllFilteredToSelected = () => {
    setSelectedItems(prev => [...prev, ...filteredLeftItems]);
  };

  const moveAllFilteredToAvailable = () => {
    setSelectedItems(prev => prev.filter(item => 
      !filteredRightItems.some(filtered => filtered.ClvCod === item.ClvCod)
    ));
  };

  const handleCalculate = () => {
    if (!validateInputFields()) return;
    
    // Convertir selectedItems a string de claves separadas por comas
    const clavesParam = selectedItems.map(item => item.ClvCod).join(',');
    onChangeClaves(clavesParam);
    
    onCalculate();
  };

  const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!validateInputFields()) return;
    
    // Convertir selectedItems a string de claves separadas por comas
    const clavesParam = selectedItems.map(item => item.ClvCod).join(',');
    onChangeClaves(clavesParam);
    
    onDownload(e);
  };


const validateInputFields = () => {
  if (ueb === "0") {
    alert("Por favor, seleccione una UEB válida");
    return false;
  }
  if (!fecha) {
    alert("Por favor, seleccione una fecha");
    return false;
  }
  // Validar formato YYYY-MM
  const fechaRegex = /^\d{4}-\d{2}$/;
  if (!fechaRegex.test(fecha)) {
    alert("Formato de fecha inválido. Use YYYY-MM");
    return false;
  }
  return true;
};
  /*const validateInputFields = () => {
    if (ueb === "0") {
      alert("Por favor, seleccione una UEB válida");
      return false;
    }
    if (!fecha) {
      alert("Por favor, seleccione una fecha");
      return false;
    }
    return true;
  }; */

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Select
          value={ueb}
          onChange={(e) => onChangeUeb(e.target.value)}
          options={uebOptions}
        />

        <input
          type="month"
          value={fecha}
          onChange={(e) => onChangeFecha(e.target.value)}
          placeholder="YYYY-MM"
          pattern="\d{4}-\d{2}"
          inputMode="numeric"
          className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black disabled:opacity-50"
          disabled={loading}
        />
      </div>

      <div className="mt-3 text-xs text-gray-600">
        Total de elementos: {availableItems.length} disponibles, {selectedItems.length} seleccionados
      </div>

      {/* Contenedor principal de las dos listas */}
      <div className="grid grid-cols-2 gap-6">
        
        {/* Columna izquierda - Elementos disponibles */}
        <div className="space-y-2">
          <div className="font-medium text-sm">Elementos Disponibles</div>
          <input
            placeholder="Filtrar disponibles..."
            value={leftFilter}
            onChange={(e) => setLeftFilter(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
          />
          
          <div className="border border-gray-300 rounded bg-white">
            <div className="flex items-center justify-center py-2 border-b border-gray-300">
              <button 
                onClick={moveAllFilteredToSelected}
                className="text-sm text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100"
                title="Mover todos los elementos filtrados a seleccionados"
              >
                &gt;&gt;
              </button>
            </div>
            <select
              multiple
              className="w-full h-32 px-2 py-1 text-sm focus:outline-none"
              size={5}
              title="Elementos disponibles filtrados"
            >
              {filteredLeftItems.map((item, index) => (
                <option 
                  key={index} 
                  value={item.ClvCod} 
                  className="py-1 cursor-pointer hover:bg-gray-100"
                  onDoubleClick={() => moveToSelected(item)}
                >
                  {item.ClvDesc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Columna derecha - Elementos seleccionados */}
        <div className="space-y-2">
          <div className="font-medium text-sm">Elementos Seleccionados</div>
          <input
            placeholder="Filtrar seleccionados..."
            value={rightFilter}
            onChange={(e) => setRightFilter(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
          />
          
          <div className="border border-gray-300 rounded bg-white">
            <div className="flex items-center justify-center py-2 border-b border-gray-300">
              <button 
                onClick={moveAllFilteredToAvailable}
                className="text-sm text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100"
                title="Remover todos los elementos filtrados de seleccionados"
              >
                &lt;&lt;
              </button>
            </div>
            <select
              multiple
              className="w-full h-32 px-2 py-1 text-sm focus:outline-none"
              size={5}
              title="Elementos seleccionados filtrados"
            >
              {filteredRightItems.map((item, index) => (
                <option 
                  key={index} 
                  value={item.ClvCod}
                  className="py-1 cursor-pointer hover:bg-gray-100"
                  onDoubleClick={() => moveToAvailable(item)}
                >
                  {item.ClvDesc}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <hr className="border-gray-200" />
      <AusentismoActions 
        onCalculate={handleCalculate} 
        onDownload={handleDownload}
        loading={loading}
      />
    </div>
  );
}
