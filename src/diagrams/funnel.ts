import type { DiagramRenderer, EChartsOption, DataSet, DiagramSpec } from './base';

export const funnelRenderer: DiagramRenderer = {
  toOption(data: DataSet, spec: DiagramSpec): EChartsOption {
    const catMapping = spec.mappings.find(m => m.role === 'category');
    const valMapping = spec.mappings.find(m => m.role === 'value');
    if (!catMapping || !valMapping) return {};

    const catCol = data.columns.find(c => c.name === catMapping.columnName);
    const valCol = data.columns.find(c => c.name === valMapping.columnName);
    if (!catCol || !valCol) return {};

    const palette = spec.style.palette;

    const funnelData = catCol.values
      .map((cat, i) => {
        const color0 = palette[i % palette.length];
        const color1 = palette[(i + 1) % palette.length];
        return {
          name: String(cat),
          value: Number(valCol.values[i] ?? 0),
          itemStyle: {
            color: {
              type: 'linear' as const,
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: color0 },
                { offset: 1, color: color1 + 'cc' },
              ],
            },
            borderColor: '#fff',
            borderWidth: 2,
            shadowBlur: 6,
            shadowColor: 'rgba(0,0,0,0.08)',
            shadowOffsetY: 2,
          },
        };
      })
      .filter(d => d.value > 0)
      .sort((a, b) => b.value - a.value);

    return {
      title: {
        text: spec.title,
        left: 'center',
        top: 12,
        textStyle: {
          fontSize: spec.style.fontSize + 4,
          fontWeight: 600,
          color: '#1f2937',
        },
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: '#fff',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        textStyle: { color: '#374151', fontSize: spec.style.fontSize },
        extraCssText: 'box-shadow: 0 4px 14px rgba(0,0,0,0.1); border-radius: 8px;',
        formatter: '{b}: {c}',
      },
      legend: {
        show: spec.style.showLegend,
        type: 'scroll',
        orient: 'vertical',
        right: 16,
        top: 'center',
        width: 120, // constrain the container width 
        textStyle: {
          fontSize: spec.style.fontSize - 1,
          color: '#6b7280',
          width: 80,
          overflow: 'truncate',
          ellipsis: '...'
        },
        itemGap: 12,
      },
      series: [
        {
          type: 'funnel',
          left: '10%',
          top: 56,
          bottom: 24,
          width: '65%',
          min: 0,
          max: Math.max(...funnelData.map(d => d.value)),
          minSize: '8%',
          maxSize: '100%',
          sort: 'descending',
          gap: 4,
          data: funnelData,
          label: {
            show: spec.style.showLabels,
            position: 'right',
            fontSize: spec.style.fontSize,
            color: '#374151',
            formatter: '{b}: {c}',
          },
          labelLine: {
            show: spec.style.showLabels,
            length: 16,
            lineStyle: { color: '#d1d5db', width: 1 },
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 16,
              shadowColor: 'rgba(0,0,0,0.2)',
              shadowOffsetY: 4,
            },
          },
          animationEasing: 'cubicOut',
          animationDuration: 700,
          animationDelay: (idx: number) => idx * 100,
        },
      ],
    };
  },
};
