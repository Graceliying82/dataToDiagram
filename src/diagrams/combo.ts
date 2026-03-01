import type { DiagramRenderer, EChartsOption, DataSet, DiagramSpec } from './base';
import { createDraggableLegend, createResizableLabel } from '../utils/legendUtils';

export const comboRenderer: DiagramRenderer = {
  toOption(data: DataSet, spec: DiagramSpec): EChartsOption {
    const catMapping = spec.mappings.find(m => m.role === 'category');
    const barMapping = spec.mappings.find(m => m.role === 'bar');
    const lineMapping = spec.mappings.find(m => m.role === 'line');
    if (!catMapping || !barMapping || !lineMapping) return {};

    const catCol = data.columns.find(c => c.name === catMapping.columnName);
    const barCol = data.columns.find(c => c.name === barMapping.columnName);
    const lineCol = data.columns.find(c => c.name === lineMapping.columnName);
    if (!catCol || !barCol || !lineCol) return {};

    const categories = catCol.values.map(String);
    const barVals = barCol.values.map(v => Number(v ?? 0));
    const lineVals = lineCol.values.map(v => Number(v ?? 0));
    const palette = spec.style.palette;
    const barColor = palette[0] || '#6366f1';
    const lineColor = palette[1] || '#f59e0b';

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
        right: 60,
        bottom: spec.style.showLegend ? 48 : 36,
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
      yAxis: [
        {
          type: 'value',
          name: barCol.name,
          nameTextStyle: { color: '#6b7280', fontSize: spec.style.fontSize - 1 },
          axisLabel: { fontSize: spec.style.fontSize, color: '#6b7280' },
          axisLine: { show: false },
          splitLine: {
            show: spec.style.showGrid,
            lineStyle: { type: 'dashed', color: '#e5e7eb' },
          },
        },
        {
          type: 'value',
          name: lineCol.name,
          nameTextStyle: { color: lineColor, fontSize: spec.style.fontSize - 1 },
          axisLabel: { fontSize: spec.style.fontSize, color: lineColor },
          axisLine: { show: false },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: barCol.name,
          type: 'bar',
          yAxisIndex: 0,
          data: barVals,
          label: {
            show: spec.style.showLabels,
            position: 'top' as const,
            fontSize: spec.style.fontSize - 1,
            color: '#374151',
          },
          barMaxWidth: 48,
          itemStyle: {
            borderRadius: [4, 4, 0, 0],
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: barColor },
                { offset: 1, color: barColor + '80' },
              ],
            },
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0,0,0,0.2)',
              shadowOffsetY: 4,
            },
          },
        },
        {
          name: lineCol.name,
          type: 'line',
          yAxisIndex: 1,
          data: lineVals,
          label: {
            show: spec.style.showLabels,
            position: 'top' as const,
            fontSize: spec.style.fontSize - 1,
            color: '#374151',
          },
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: { width: 3, color: lineColor },
          itemStyle: { color: lineColor, borderColor: '#fff', borderWidth: 2 },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: lineColor + '30' },
                { offset: 1, color: lineColor + '05' },
              ],
            },
          },
          emphasis: {
            focus: 'series',
            itemStyle: { shadowBlur: 8, shadowColor: 'rgba(0,0,0,0.15)' },
          },
        },
      ],
      animationEasing: 'cubicOut',
      animationDuration: 700,
      graphic: [
        ...(((spec.style.showLegend ? createDraggableLegend(
          [
            { id: barCol.name, label: barCol.name, color: barColor },
            { id: lineCol.name, label: lineCol.name, color: lineColor }
          ],
          spec
        ) : {}) as any).elements || []),
        ...((spec.title ? createResizableLabel(spec.title, spec, { top: 12 }) : {} as any).elements || [])
      ] as NonNullable<EChartsOption['graphic']>,
    };
  },
};
