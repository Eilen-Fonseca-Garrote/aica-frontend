import React from 'react';
import Card from '../../uiLibrary/Card';
import Table from '../../uiLibrary/Table';
import { Promedio, Total } from '../types';

interface PromedioMensualResultProps {
  promedio: Promedio[];
  total: Total;
}

const PromedioMensualResult: React.FC<PromedioMensualResultProps> = ({
  promedio,
  total,
}) => {
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
