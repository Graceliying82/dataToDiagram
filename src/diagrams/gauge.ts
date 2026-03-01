import type { DiagramRenderer, EChartsOption, DataSet, DiagramSpec } from './base';

export const gaugeRenderer: DiagramRenderer = {
  toOption(data: DataSet, spec: DiagramSpec): EChartsOption {
    const valMapping = spec.mappings.find(m => m.role === 'value');
    if (!valMapping) return {};

    const valCol = data.columns.find(c => c.name === valMapping.columnName);
    if (!valCol) return {};

    const value = Number(valCol.values[0] ?? 0);
    const maxVal = Number(spec.options.max ?? 100);
    const palette = spec.style.palette;
    const mainColor = palette[0] || '#6366f1';
    const trackColor = palette[1] || '#f3f4f6';

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
        formatter: `${valCol.name}: ${value}`,
      },
      series: [
        // Background track
        {
          type: 'gauge',
          center: ['50%', '58%'],
          radius: '80%',
          min: 0,
          max: maxVal,
          startAngle: 220,
          endAngle: -40,
          splitNumber: 10,
          progress: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              width: 24,
              color: [[1, trackColor]],
            },
          },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          pointer: { show: false },
          detail: { show: false },
          data: [{ value: 0 }],
        },
        // Progress arc
        {
          type: 'gauge',
          center: ['50%', '58%'],
          radius: '80%',
          min: 0,
          max: maxVal,
          startAngle: 220,
          endAngle: -40,
          splitNumber: 10,
          progress: {
            show: true,
            width: 24,
            roundCap: true,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  { offset: 0, color: mainColor },
                  { offset: 0.5, color: palette[2] || mainColor + 'cc' },
                  { offset: 1, color: palette[3] || mainColor + '88' },
                ],
              },
              shadowBlur: 8,
              shadowColor: mainColor + '44',
            },
          },
          axisLine: {
            lineStyle: {
              width: 24,
              color: [[1, 'transparent']],
            },
          },
          axisTick: {
            show: true,
            distance: -30,
            length: 6,
            lineStyle: { color: '#d1d5db', width: 1 },
          },
          splitLine: {
            show: true,
            distance: -34,
            length: 12,
            lineStyle: { color: '#9ca3af', width: 2 },
          },
          axisLabel: {
            show: true,
            distance: -44,
            fontSize: spec.style.fontSize - 2,
            color: '#9ca3af',
          },
          pointer: {
            show: true,
            length: '55%',
            width: 5,
            itemStyle: {
              color: mainColor,
              shadowBlur: 6,
              shadowColor: 'rgba(0,0,0,0.15)',
              shadowOffsetY: 2,
            },
          },
          anchor: {
            show: true,
            size: 14,
            showAbove: true,
            itemStyle: {
              color: mainColor,
              borderColor: '#fff',
              borderWidth: 3,
              shadowBlur: 8,
              shadowColor: 'rgba(0,0,0,0.15)',
            },
          },
          detail: {
            show: true,
            valueAnimation: true,
            fontSize: spec.style.fontSize + 14,
            fontWeight: 700,
            color: '#1f2937',
            offsetCenter: [0, '72%'],
            formatter: '{value}',
          },
          title: {
            show: true,
            offsetCenter: [0, '90%'],
            fontSize: spec.style.fontSize,
            color: '#6b7280',
          },
          data: [
            {
              value,
              name: valCol.name,
            },
          ],
          animationEasing: 'cubicOut',
          animationDuration: 1000,
        },
      ],
    };
  },
};
