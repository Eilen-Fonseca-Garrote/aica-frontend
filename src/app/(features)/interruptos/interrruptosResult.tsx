import React from 'react';
import Card from '../uiLibrary/Card';
import Table from '../uiLibrary/Table';
import { InterruptosTableRow } from './types';

interface InterruptosResultProps {
  data: InterruptosTableRow[];
}

const InterruptosResult: React.FC<InterruptosResultProps> = ({ data }) => {
  const headers = [
    { key: 'direccion', label: 'Dirección', className: 'text-left w-[30%]' },
    { key: 'covid', label: 'Interruptos por Covid' },
    { key: 'reubicacion', label: 'Interruptos por Reubicación' },
    { key: 'produccion100', label: 'Interruptos de Producción 100%' },
    { key: 'produccion60', label: 'Interruptos de Producción 60%' },
  ];

  const rows = data.map((row) => ({
  direccion: row.isHeader
    ? <span className="font-bold text-[#0a8ca8] tracking-wide">{row.direccion}</span>
    : row.direccion,
  covid:         row.isHeader ? '' : row.covid,
  reubicacion:   row.isHeader ? '' : row.reubicacion,
  produccion100: row.isHeader ? '' : row.produccion100,
  produccion60:  row.isHeader ? '' : row.produccion60,
  className: row.isHeader
    ? 'bg-[#e8f6f9]'
    : row.direccion?.includes('Total General')
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