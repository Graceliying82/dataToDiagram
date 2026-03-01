import type { DiagramRenderer, EChartsOption, DataSet, DiagramSpec } from './base';

export const heatmapRenderer: DiagramRenderer = {
  toOption(data: DataSet, spec: DiagramSpec): EChartsOption {
    const xMapping = spec.mappings.find(m => m.role === 'x');
    const yMapping = spec.mappings.find(m => m.role === 'y');
    const valMapping = spec.mappings.find(m => m.role === 'value');
    if (!xMapping || !yMapping || !valMapping) return {};

    const xCol = data.columns.find(c => c.name === xMapping.columnName);
    const yCol = data.columns.find(c => c.name === yMapping.columnName);
    const valCol = data.columns.find(c => c.name === valMapping.columnName);
    if (!xCol || !yCol || !valCol) return {};

    const xLabels = [...new Set(xCol.values.map(String))];
    const yLabels = [...new Set(yCol.values.map(String))];

    const values = valCol.values.map(Number);
    const minVal = Math.min(...values.filter(v => !isNaN(v)));
    const maxVal = Math.max(...values.filter(v => !isNaN(v)));

    // Build heatmap data: [xIndex, yIndex, value]
    const heatmapData: [number, number, number][] = [];
    xCol.values.forEach((xv, i) => {
      const xi = xLabels.indexOf(String(xv));
      const yi = yLabels.indexOf(String(yCol.values[i]));
      const val = Number(valCol.values[i] ?? 0);
      heatmapData.push([xi, yi, val]);
    });

    const palette = spec.style.palette;

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
        formatter: (params: unknown) => {
          const p = params as { value: [number, number, number] };
          const xName = xLabels[p.value[0]] ?? '';
          const yName = yLabels[p.value[1]] ?? '';
          return `<strong>${xName} / ${yName}</strong><br/>Value: ${p.value[2].toLocaleString()}`;
        },
      },
      grid: {
        top: 64,
        left: 80,
        right: 80,
        bottom: 48,
        containLabel: false,
      },
      xAxis: {
        type: 'category',
        data: xLabels,
        axisLabel: {
          fontSize: spec.style.fontSize,
          color: '#6b7280',
          rotate: xLabels.length > 8 ? 30 : 0,
        },
        axisLine: { lineStyle: { color: '#e5e7eb' } },
        axisTick: { show: false },
        splitArea: { show: false },
      },
      yAxis: {
        type: 'category',
        data: yLabels,
        axisLabel: { fontSize: spec.style.fontSize, color: '#6b7280' },
        axisLine: { lineStyle: { color: '#e5e7eb' } },
        axisTick: { show: false },
        splitArea: { show: false },
      },
      visualMap: {
        min: minVal,
        max: maxVal,
        calculable: true,
        orient: 'vertical',
        right: 10,
        top: 'center',
        inRange: {
          color: [
            palette[0] || '#f0fdf4',
            palette[1] || '#86efac',
            palette[2] || '#22c55e',
            palette[3] || '#15803d',
          ],
        },
        textStyle: { color: '#6b7280', fontSize: spec.style.fontSize - 1 },
        itemWidth: 14,
        itemHeight: 140,
      },
      series: [
        {
          type: 'heatmap',
          data: heatmapData,
          label: {
            show: spec.style.showLabels,
            color: '#374151',
            fontSize: spec.style.fontSize - 2,
            formatter: (params: unknown) => {
              const p = params as { value: [number, number, number] };
              return p.value[2].toLocaleString();
            },
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2,
            borderRadius: 3,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 12,
              shadowColor: 'rgba(0,0,0,0.2)',
              borderColor: '#1f2937',
              borderWidth: 2,
            },
          },
          animationEasing: 'cubicOut',
          animationDuration: 600,
        },
      ],
    };
  },
};
