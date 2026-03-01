import type { DiagramRenderer, EChartsOption, DataSet, DiagramSpec } from './base';
import { createDraggableLegend, createResizableLabel } from '../utils/legendUtils';

export const roseRenderer: DiagramRenderer = {
  toOption(data: DataSet, spec: DiagramSpec): EChartsOption {
    const catMapping = spec.mappings.find(m => m.role === 'category');
    const valMapping = spec.mappings.find(m => m.role === 'value');
    if (!catMapping || !valMapping) return {};

    const catCol = data.columns.find(c => c.name === catMapping.columnName);
    const valCol = data.columns.find(c => c.name === valMapping.columnName);
    if (!catCol || !valCol) return {};

    const palette = spec.style.palette;

    const roseData = catCol.values
      .map((cat, i) => {
        const color0 = palette[i % palette.length];
        const color1 = palette[(i + 2) % palette.length];
        return {
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
                { offset: 0, color: color0 },
                { offset: 1, color: color1 + 'bb' },
              ],
            },
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.12)',
            shadowOffsetY: 3,
            borderRadius: 6,
          },
        };
      })
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
          roseType: 'area',
          radius: ['18%', '72%'],
          center: ['50%', '52%'],
          data: roseData,
          label: {
            show: spec.style.showLabels,
            formatter: '{b}\n{d}%',
            fontSize: spec.style.fontSize - 1,
            color: '#374151',
            lineHeight: 18,
          },
          labelLine: {
            show: spec.style.showLabels,
            length: 14,
            length2: 18,
            smooth: true,
            lineStyle: { color: '#d1d5db' },
          },
          emphasis: {
            scaleSize: 10,
            itemStyle: {
              shadowBlur: 24,
              shadowColor: 'rgba(0,0,0,0.25)',
              shadowOffsetY: 8,
            },
          },
          animationType: 'expansion',
          animationEasing: 'cubicOut',
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
    };
  },
};
