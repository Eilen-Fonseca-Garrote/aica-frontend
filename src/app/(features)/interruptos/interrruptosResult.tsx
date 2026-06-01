import React from 'react';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import { InterruptosTableRow } from './types';

interface InterruptosResultProps {
  data: InterruptosTableRow[];
}

const InterruptosResult = ({ data }: InterruptosResultProps) => {
  const headers = [
    { key: 'direccion', label: 'Dirección', className: 'text-left w-[30%]' },
    { key: 'covid', label: 'Interruptos por Covid' },
    { key: 'reubicacion', label: 'Interruptos por Reubicación' },
    { key: 'produccion100', label: 'Interruptos de Producción 100%' },
    { key: 'produccion60', label: 'Interruptos de Producción 60%' },
  ];

  const rows = data.map((row) => ({
  direccion: row.direccion,
  covid: row.covid,
  reubicacion: row.reubicacion,
  produccion100: row.produccion100,
  produccion60: row.produccion60,
  className:
    row.direccion?.includes('Total General')
      ? 'font-bold bg-gray-100'
      : row.direccion?.includes('Total')
        ? 'font-semibold'
        : '',
}));

  return (
    <Card title="Trabajadores Interruptos">
      <Table headers={headers} rows={rows} />
    </Card>
  );
};

export default InterruptosResult;