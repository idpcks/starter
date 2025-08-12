import React from 'react';

interface TableColumn<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyField: keyof T;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

function Table<T extends Record<string, any>>({ 
  columns, 
  data, 
  keyField, 
  onRowClick, 
  isLoading = false,
  emptyMessage = 'No data available'
}: TableProps<T>) {
  if (isLoading) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
        <div className="animate-pulse flex justify-center">
          <div className="h-4 w-4 bg-blue-600 rounded-full mr-1"></div>
          <div className="h-4 w-4 bg-blue-600 rounded-full mr-1 animation-delay-200"></div>
          <div className="h-4 w-4 bg-blue-600 rounded-full animation-delay-400"></div>
        </div>
        <p className="mt-2 text-sm text-gray-500">Loading data...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
        <p className="text-sm text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr 
              key={String(row[keyField])} 
              className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((column, index) => {
                const cellContent = typeof column.accessor === 'function' 
                  ? column.accessor(row) 
                  : row[column.accessor];
                  
                return (
                  <td key={index} className={`px-6 py-4 whitespace-nowrap text-sm ${column.className || ''}`}>
                    {cellContent}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;