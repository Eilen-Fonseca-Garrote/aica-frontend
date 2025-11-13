// features/interruptos/components/InterruptosResult.tsx
import React from 'react';
import Card from '../uiLibrary/Card';
import Table from '../uiLibrary/Table';
import { InterruptosData, TotalInterruptos } from '@/app/(features)/interruptos/types';

interface InterruptosResultProps {
  data: InterruptosData[];
  total: TotalInterruptos;
}

const InterruptosResult: React.FC<InterruptosResultProps> = ({ data, total }) => {
  const headers = [
    { key: 'Direccion', label: 'Dirección', className: 'text-left w-[30%]' },
    { key: 'covid', label: 'Interruptos por Covid' },
    { key: 'reubicados', label: 'Interruptos por Reubicación' },
    { key: 'produccion25', label: 'Interruptos de Producción 100%' },
    { key: 'produccion48', label: 'Interruptos de Producción 60%' },
  ];

  const rows = data.map((row, index) => ({
    Direccion: row.Direccion,
    covid: row.covid,
    reubicados: row.reubicados,
    produccion25: row.produccion25,
    produccion48: row.produccion48,
  }));

  const footer = {
    Direccion: 'Total',
    covid: total.totalCovid.Total,
    reubicados: total.totalReub.Total,
    produccion25: total.totalProd25.Total,
    produccion48: total.totalProd48.Total,
  };

  return (
    <Card title="Trabajadores Interruptos">
      <Table headers={headers} rows={rows} footer={footer} />
    </Card>
  );
};

export default InterruptosResult;