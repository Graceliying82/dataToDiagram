import type { DiagramRenderer, EChartsOption, DataSet, DiagramSpec } from './base';
import { createDraggableLegend, createResizableLabel } from '../utils/legendUtils';

export const lineRenderer: DiagramRenderer = {
  toOption(data: DataSet, spec: DiagramSpec): EChartsOption {
    const xMapping = spec.mappings.find(m => m.role === 'x');
    const yMappings = spec.mappings.filter(m => m.role === 'y');
    if (!xMapping || yMappings.length === 0) return {};

    const xCol = data.columns.find(c => c.name === xMapping.columnName);
    const yCols = yMappings
      .map(m => data.columns.find(c => c.name === m.columnName))
      .filter(Boolean) as DataSet['columns'];
    if (!xCol || yCols.length === 0) return {};

    const labels = xCol.values.map(String);
    const palette = spec.style.palette;

    const series: EChartsOption['series'] = yCols.map((col, ci) => {
      const color = palette[ci % palette.length];
      return {
        name: col.name,
        type: 'line' as const,
        data: col.values.map(v => Number(v ?? 0)),
        label: {
          show: spec.style.showLabels,
          position: 'top' as const,
          fontSize: spec.style.fontSize - 1,
          color: '#374151',
        },
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { width: 3, color },
        itemStyle: {
          color,
          borderColor: '#fff',
          borderWidth: 2,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: color + '40' },
              { offset: 1, color: color + '05' },
            ],
          },
        },
        emphasis: {
          focus: 'series' as const,
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.2)',
            borderWidth: 3,
          },
        },
        animationEasing: 'cubicOut' as const,
        animationDuration: 700,
      };
    });

    return {
      title: { show: false }, // Using resizable graphic label instead
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#fff',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        textStyle: { color: '#374151', fontSize: spec.style.fontSize },
        extraCssText: 'box-shadow: 0 4px 14px rgba(0,0,0,0.1); border-radius: 8px;',
      },
      legend: { show: false }, // Use custom graphic legend instead
      grid: {
        top: 64,
        left: 60,
        right: 30,
        bottom: spec.style.showLegend && yCols.length > 1 ? 48 : 36,
        containLabel: false,
      },
      xAxis: {
        type: 'category',
        data: labels,
        boundaryGap: false,
        axisLabel: {
          fontSize: spec.style.fontSize,
          color: '#6b7280',
          rotate: labels.length > 10 ? 30 : 0,
        },
        axisLine: { lineStyle: { color: '#e5e7eb' } },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        axisLabel: { fontSize: spec.style.fontSize, color: '#6b7280' },
        axisLine: { show: false },
        splitLine: {
          show: spec.style.showGrid,
          lineStyle: { type: 'dashed', color: '#e5e7eb' },
        },
      },
      series,
      graphic: [
        ...(((spec.style.showLegend ? createDraggableLegend(
          yCols.map((col, i) => ({ id: col.name, label: col.name, color: palette[i % palette.length] })),
          spec
        ) : {}) as any).elements || []),
        ...((spec.title ? createResizableLabel(spec.title, spec, { top: 12 }) : {} as any).elements || [])
      ] as NonNullable<EChartsOption['graphic']>,
      animationEasing: 'cubicOut',
      animationDuration: 700,
    };
  },
};
