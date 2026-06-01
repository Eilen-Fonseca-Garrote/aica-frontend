import React from 'react';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import { PromedioMensual, TotalMensual } from './types';

interface PromedioMensualResultProps {
  promedio: PromedioMensual[];
  total: TotalMensual;
}

const PromedioMensualResult = ({
  promedio,
  total,
}: PromedioMensualResultProps) => {
  const headers = [
    { key: 'Unidad', label: 'Dirección', className: 'text-left w-[40%]' },
    { key: 'HPromFisic', label: 'Físico' },
    { key: 'HPromFMuj', label: 'Físico Mujeres' },
    { key: 'HPromTot', label: 'Promedio' },
    { key: 'HPromMuj', label: 'Promedio Mujeres' },
  ];

  const rows = promedio.map((p) => ({
    Unidad: p.Unidad,
    HPromFisic: p.HPromFisic,
    HPromFMuj: p.HPromFMuj,
    HPromTot: p.HPromTot,
    HPromMuj: p.HPromMuj,
  }));

  const footer = {
    Unidad: 'Total',
    HPromFisic: total.totalFisico,
    HPromFMuj: total.totalFisicoMuj,
    HPromTot: total.totalPromedio,
    HPromMuj: total.totalPromedioMujeres,
  };

  return (
    <Card title="Promedio Mensual">
      <Table headers={headers} rows={rows} footer={footer} />
    </Card>
  );
};

export default PromedioMensualResult;
