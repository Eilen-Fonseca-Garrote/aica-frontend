// features/interruptos/components/InterruptosResult.tsx
import React from 'react';
import Card from '../uiLibrary/Card';
import Table from '../uiLibrary/Table';
import { InterruptosData } from './types';

interface InterruptosResultProps {
  data: InterruptosData[];
}

const InterruptosResult: React.FC<InterruptosResultProps> = ({ data }) => {
  const headers = [
    { key: 'direccion', label: 'Dirección', className: 'text-left w-[30%]' },
    { key: 'covid', label: 'Interruptos por Covid' },
    { key: 'reubicacion', label: 'Interruptos por Reubicación' },
    { key: 'produccion100', label: 'Interruptos de Producción 100%' },
    { key: 'produccion60', label: 'Interruptos de Producción 60%' },
  ];

  const rows = data.map((row, index) => ({
    direccion: row.direccion,
    covid: row.covid,
    reubicacion: row.reubicacion,
    produccion100: row.produccion100,
    produccion60: row.produccion60,
    // Aplicar estilos especiales para las filas de totales
    className: row.direccion === "Total" 
      ? "font-semibold bg-gray-50" 
      : row.direccion.includes("Total") 
        ? "font-semibold" 
        : ""
  }));

  return (
    <Card title="Trabajadores Interruptos">
      <Table headers={headers} rows={rows} />
    </Card>
  );
};

export default InterruptosResult;