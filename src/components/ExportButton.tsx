import { useState } from 'react';
import type { ECharts } from 'echarts/core';
import { exportDiagram, type ExportFormat } from '../utils/export';

interface ExportButtonProps {
  chartInstance: ECharts | null;
}

export function ExportButton({ chartInstance }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = (format: ExportFormat) => {
    if (!chartInstance) return;
    setExporting(true);
    try {
      exportDiagram(chartInstance, format, 'diagram');
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex gap-2">
      {(['png', 'jpg', 'svg'] as ExportFormat[]).map((fmt) => (
        <button
          key={fmt}
          onClick={() => handleExport(fmt)}
          disabled={exporting || !chartInstance}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-indigo-300 transition-all disabled:opacity-50"
        >
          {exporting ? '...' : `Export ${fmt.toUpperCase()}`}
        </button>
      ))}
    </div>
  );
}
