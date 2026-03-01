import type { ECharts } from 'echarts/core';

export type ExportFormat = 'png' | 'jpg' | 'svg';

export function exportDiagram(
  chartInstance: ECharts,
  format: ExportFormat,
  filename: string = 'diagram',
): void {
  const dataUrl = chartInstance.getDataURL({
    type: format === 'jpg' ? 'jpeg' : format,
    pixelRatio: 2,
    backgroundColor: '#ffffff',
  });

  const link = document.createElement('a');
  link.download = `${filename}.${format}`;
  link.href = dataUrl;
  link.click();
}
