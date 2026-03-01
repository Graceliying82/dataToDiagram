import type { DataSet } from '../types/data';

interface DataPreviewProps {
  data: DataSet;
  maxRows?: number;
}

export function DataPreview({ data, maxRows = 10 }: DataPreviewProps) {
  if (data.columns.length === 0) return null;

  const rowCount = Math.min(data.rowCount, maxRows);

  return (
    <div className="overflow-auto rounded-lg border border-gray-200 max-h-64">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            {data.columns.map((col) => (
              <th
                key={col.name}
                className="px-4 py-2 text-left font-medium text-gray-600 border-b"
              >
                <div>{col.name}</div>
                <div className="text-xs text-gray-400 font-normal">{col.type}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rowCount }, (_, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {data.columns.map((col) => (
                <td key={col.name} className="px-4 py-1.5 border-b border-gray-100 text-gray-700">
                  {col.values[i] instanceof Date
                    ? (col.values[i] as Date).toLocaleDateString()
                    : String(col.values[i] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.rowCount > maxRows && (
        <div className="px-4 py-2 text-xs text-gray-400 bg-gray-50">
          Showing {maxRows} of {data.rowCount} rows
        </div>
      )}
    </div>
  );
}
