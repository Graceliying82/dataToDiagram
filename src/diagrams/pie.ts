import type { DiagramRenderer, EChartsOption, DataSet, DiagramSpec } from './base';
import { createDraggableLegend, createResizableLabel } from '../utils/legendUtils';

export const pieRenderer: DiagramRenderer = {
  toOption(data: DataSet, spec: DiagramSpec): EChartsOption {
    const catMapping = spec.mappings.find(m => m.role === 'category');
    const valMapping = spec.mappings.find(m => m.role === 'value');
    if (!catMapping || !valMapping) return {};

    const catCol = data.columns.find(c => c.name === catMapping.columnName);
    const valCol = data.columns.find(c => c.name === valMapping.columnName);
    if (!catCol || !valCol) return {};

    const isDonut = spec.options.donut === true;
    const isRose = spec.options.rose === true;
    const palette = spec.style.palette;

    const pieData = catCol.values
      .map((cat, i) => ({
        name: String(cat),
        value: Number(valCol.values[i] ?? 0),
        itemStyle: {
          color: {
            type: 'linear' as const,
            x: 0,
            y: 0,
            x2: 1,
            y2: 1,
            colorStops: [
              { offset: 0, color: palette[i % palette.length] },
              { offset: 1, color: palette[(i + 1) % palette.length] + 'cc' },
            ],
          },
          shadowBlur: 8,
          shadowColor: 'rgba(0,0,0,0.12)',
          shadowOffsetY: 2,
        },
      }))
      .filter(d => d.value > 0);

    return {
      title: { show: false }, // Using resizable graphic label instead
      tooltip: {
        trigger: 'item',
        backgroundColor: '#fff',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        textStyle: { color: '#374151', fontSize: spec.style.fontSize },
        extraCssText: 'box-shadow: 0 4px 14px rgba(0,0,0,0.1); border-radius: 8px;',
        formatter: '{b}: {c} ({d}%)',
      },
      legend: { show: false }, // Use custom graphic legend instead
      series: [
        {
          type: 'pie',
          radius: isDonut ? ['45%', '72%'] : ['0%', '72%'],
          center: ['50%', '52%'],
          roseType: isRose ? 'area' : undefined,
          avoidLabelOverlap: true,
          label: {
            show: spec.style.showLabels,
            formatter: '{b}\n{d}%',
            fontSize: spec.style.fontSize - 1,
            color: '#374151',
            lineHeight: 18,
          },
          labelLine: {
            show: spec.style.showLabels,
            length: 16,
            length2: 20,
            smooth: true,
            lineStyle: { color: '#d1d5db' },
          },
          emphasis: {
            scaleSize: 8,
            itemStyle: {
              shadowBlur: 20,
              shadowColor: 'rgba(0,0,0,0.2)',
              shadowOffsetY: 6,
            },
          },
          data: pieData,
          animationType: 'expansion' as const,
          animationEasing: 'cubicOut' as const,
          animationDuration: 800,
        },
      ],
      graphic: [
        ...(((spec.style.showLegend ? createDraggableLegend(
          catCol.values.map((val, i) => ({ id: String(val), label: String(val), color: palette[i % palette.length] })),
          spec
        ) : {}) as any).elements || []),
        ...((spec.title ? createResizableLabel(spec.title, spec, { top: 12 }) : {} as any).elements || [])
      ] as NonNullable<EChartsOption['graphic']>,
      animationEasing: 'cubicOut',
      animationDuration: 800,
    };
  },
};
