import type { DiagramRenderer, EChartsOption, DataSet, DiagramSpec } from './base';
import { createDraggableLegend, createResizableLabel } from '../utils/legendUtils';

export const barRenderer: DiagramRenderer = {
  toOption(data: DataSet, spec: DiagramSpec): EChartsOption {
    const categoryMapping = spec.mappings.find(m => m.role === 'category');
    const valueMappings = spec.mappings.filter(m => m.role === 'value');
    if (!categoryMapping || valueMappings.length === 0) return {};

    const catCol = data.columns.find(c => c.name === categoryMapping.columnName);
    const valCols = valueMappings
      .map(v => data.columns.find(c => c.name === v.columnName))
      .filter(Boolean) as DataSet['columns'];
    if (!catCol || valCols.length === 0) return {};

    const categories = catCol.values.map(String);
    const isStacked = spec.options.stacked === true;
    const palette = spec.style.palette;

    const series: EChartsOption['series'] = valCols.map((col, ci) => {
      const color0 = palette[ci % palette.length];
      const color1 = palette[(ci + 1) % palette.length];
      return {
        name: col.name,
        type: 'bar' as const,
        stack: isStacked ? 'total' : undefined,
        data: col.values.map(v => Number(v ?? 0)),
        label: {
          show: spec.style.showLabels,
          position: 'top' as const,
          fontSize: spec.style.fontSize - 1,
          color: '#374151',
        },
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: color0 },
              { offset: 1, color: color1 },
            ],
          },
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 12,
            shadowColor: 'rgba(0,0,0,0.25)',
            shadowOffsetY: 4,
          },
        },
        barMaxWidth: 48,
        animationEasing: 'elasticOut' as const,
        animationDuration: 800,
        animationDelay: (idx: number) => idx * 60,
      };
    });

    return {
      title: { show: false }, // Using resizable graphic label instead
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
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
        bottom: spec.style.showLegend && valCols.length > 1 ? 48 : 48,
        containLabel: false,
      },
      xAxis: {
        type: 'category',
        data: categories,
        axisLabel: {
          fontSize: spec.style.fontSize,
          color: '#6b7280',
          rotate: categories.length > 8 ? 30 : 0,
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
          valCols.map((col, i) => ({ id: col.name, label: col.name, color: palette[i % palette.length] })),
          spec
        ) : {}) as any).elements || []),
        ...((spec.title ? createResizableLabel(spec.title, spec, { top: 12 }) : {} as any).elements || [])
      ] as NonNullable<EChartsOption['graphic']>,
      animationEasing: 'elasticOut',
      animationDuration: 800,
    };
  },
};
