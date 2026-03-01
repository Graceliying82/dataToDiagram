import type { DiagramRenderer, EChartsOption, DataSet, DiagramSpec } from './base';
import { createResizableLabel } from '../utils/legendUtils';

export const scatterRenderer: DiagramRenderer = {
  toOption(data: DataSet, spec: DiagramSpec): EChartsOption {
    const xMapping = spec.mappings.find(m => m.role === 'x');
    const yMapping = spec.mappings.find(m => m.role === 'y');
    const sizeMapping = spec.mappings.find(m => m.role === 'size');
    if (!xMapping || !yMapping) return {};

    const xCol = data.columns.find(c => c.name === xMapping.columnName);
    const yCol = data.columns.find(c => c.name === yMapping.columnName);
    const sizeCol = sizeMapping
      ? data.columns.find(c => c.name === sizeMapping.columnName)
      : null;
    if (!xCol || !yCol) return {};

    const palette = spec.style.palette;
    const mainColor = palette[0] || '#6366f1';
    const isBubble = !!sizeCol;

    // Build scatter data
    const scatterData: (number | null)[][] = [];
    const sizeValues = sizeCol ? sizeCol.values.map(v => Number(v ?? 0)) : [];
    const maxSize = sizeValues.length > 0 ? Math.max(...sizeValues) : 1;

    for (let i = 0; i < data.rowCount; i++) {
      const xv = xCol.values[i] != null ? Number(xCol.values[i]) : NaN;
      const yv = yCol.values[i] != null ? Number(yCol.values[i]) : NaN;
      if (isNaN(xv) || isNaN(yv)) continue; // skip rows with non-numeric coordinates
      if (isBubble) {
        scatterData.push([xv, yv, sizeValues[i]]);
      } else {
        scatterData.push([xv, yv]);
      }
    }

    return {
      title: { show: false }, // Using resizable graphic label instead
      tooltip: {
        trigger: 'item',
        backgroundColor: '#fff',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        textStyle: { color: '#374151', fontSize: spec.style.fontSize },
        extraCssText: 'box-shadow: 0 4px 14px rgba(0,0,0,0.1); border-radius: 8px;',
        formatter: (params: unknown) => {
          const p = params as { value: number[] };
          let html = `<strong>${xCol.name}</strong>: ${p.value[0]}<br/><strong>${yCol.name}</strong>: ${p.value[1]}`;
          if (isBubble && sizeCol) {
            html += `<br/><strong>${sizeCol.name}</strong>: ${p.value[2]}`;
          }
          return html;
        },
      },
      grid: {
        top: 64,
        left: 60,
        right: 30,
        bottom: 48,
        containLabel: false,
      },
      xAxis: {
        type: 'value',
        name: xCol.name,
        nameLocation: 'center',
        nameGap: 32,
        nameTextStyle: { color: '#6b7280', fontSize: spec.style.fontSize },
        axisLabel: { fontSize: spec.style.fontSize, color: '#6b7280' },
        axisLine: { lineStyle: { color: '#e5e7eb' } },
        splitLine: {
          show: spec.style.showGrid,
          lineStyle: { type: 'dashed', color: '#e5e7eb' },
        },
      },
      yAxis: {
        type: 'value',
        name: yCol.name,
        nameLocation: 'center',
        nameGap: 44,
        nameTextStyle: { color: '#6b7280', fontSize: spec.style.fontSize },
        axisLabel: { fontSize: spec.style.fontSize, color: '#6b7280' },
        axisLine: { show: false },
        splitLine: {
          show: spec.style.showGrid,
          lineStyle: { type: 'dashed', color: '#e5e7eb' },
        },
      },
      series: [
        {
          type: 'scatter',
          data: scatterData,
          symbolSize: isBubble
            ? (val: number[]) => Math.max(6, (val[2] / maxSize) * 50)
            : 12,
          itemStyle: {
            color: {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.5,
              colorStops: [
                { offset: 0, color: mainColor + 'dd' },
                { offset: 0.7, color: mainColor + '88' },
                { offset: 1, color: mainColor + '33' },
              ],
            },
            borderColor: mainColor,
            borderWidth: 1,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 14,
              shadowColor: 'rgba(0,0,0,0.25)',
              borderWidth: 2,
            },
            scale: 1.3,
          },
          animationEasing: 'cubicOut',
          animationDuration: 600,
          animationDelay: (idx: number) => idx * 10,
        },
      ],
      graphic: [
        ...((spec.title ? createResizableLabel(spec.title, spec, { top: 12 }) : {} as any).elements || [])
      ] as NonNullable<EChartsOption['graphic']>,
    };
  },
};
