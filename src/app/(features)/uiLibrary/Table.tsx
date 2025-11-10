import React from 'react';

export interface TableHeader {
  key: string;
  label: string;
  className?: string;
}

export interface TableRowData {
  [key: string]: React.ReactNode;
}

interface TableProps {
  headers: TableHeader[];
  rows: TableRowData[];
  footer?: TableRowData;
  emptyMessage?: string;
}

const Table: React.FC<TableProps> = ({
  headers,
  rows,
  footer,
  emptyMessage = 'Sin datos disponibles',
}) => {
  const hasData = rows.length > 0;

  return (
    <div className="overflow-x-auto text-black">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((h) => (
              <th key={h.key} className={`py-2 px-4 text-center ${h.className || ''}`}>
                {h.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {!hasData ? (
            <tr className="text-center text-gray-500">
              <td colSpan={headers.length} className="py-3 italic">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, idx) => (
              <tr key={idx} className="text-center border-t border-gray-200">
                {headers.map((h) => (
                  <td key={h.key} className="py-2 px-4">
                    {row[h.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>

        {footer && (
          <tfoot className="bg-gray-50 font-semibold border-t border-gray-200">
            <tr>
              {headers.map((h) => (
                <td key={h.key} className="py-2 px-4 text-center">
                  {footer[h.key] ?? ''}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

export default Table;
