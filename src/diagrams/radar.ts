import type { DiagramRenderer, EChartsOption, DataSet, DiagramSpec } from './base';

export const radarRenderer: DiagramRenderer = {
  toOption(data: DataSet, spec: DiagramSpec): EChartsOption {
    const catMapping = spec.mappings.find(m => m.role === 'category');
    const valueMappings = spec.mappings.filter(m => m.role === 'value');
    if (!catMapping || valueMappings.length === 0) return {};

    const catCol = data.columns.find(c => c.name === catMapping.columnName);
    const valCols = valueMappings
      .map(v => data.columns.find(c => c.name === v.columnName))
      .filter(Boolean) as DataSet['columns'];
    if (!catCol || valCols.length === 0) return {};

    const categories = catCol.values.map(String);
    const palette = spec.style.palette;

    // Find max value across all series for indicator scaling
    const allValues = valCols.flatMap(c => c.values.filter(v => v != null).map(Number));
    const maxVal = Math.max(...allValues) * 1.15;

    const indicator = categories.map(name => ({
      name,
      max: maxVal,
    }));

    const seriesData = valCols.map((col, ci) => {
      const color = palette[ci % palette.length];
      return {
        name: col.name,
        value: col.values.map(v => Number(v ?? 0)),
        lineStyle: { width: 2.5, color },
        itemStyle: { color, borderColor: '#fff', borderWidth: 2 },
        areaStyle: {
          color: {
            type: 'linear' as const,
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: color + '50' },
              { offset: 1, color: color + '10' },
            ],
          },
        },
        symbol: 'circle',
        symbolSize: 6,
      };
    });

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
      },
      legend: {
        show: spec.style.showLegend,
        bottom: 8,
        textStyle: { fontSize: spec.style.fontSize - 1, color: '#6b7280' },
        itemGap: 20,
      },
      radar: {
        indicator,
        center: ['50%', '54%'],
        radius: '68%',
        shape: 'circle',
        splitNumber: 5,
        axisName: {
          color: '#374151',
          fontSize: spec.style.fontSize,
          fontWeight: 500,
        },
        splitLine: {
          show: spec.style.showGrid,
          lineStyle: { color: '#e5e7eb', type: 'dashed' },
        },
        splitArea: {
          show: spec.style.showGrid,
          areaStyle: {
            color: ['rgba(249,250,251,0.6)', 'rgba(243,244,246,0.3)'],
          },
        },
        axisLine: {
          lineStyle: { color: '#e5e7eb' },
        },
      },
      series: [
        {
          type: 'radar',
          data: seriesData,
          emphasis: {
            lineStyle: { width: 4 },
            areaStyle: { opacity: 0.4 },
          },
          animationEasing: 'cubicOut',
          animationDuration: 700,
        },
      ],
    };
  },
};
