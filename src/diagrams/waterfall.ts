import type { DiagramRenderer, EChartsOption, DataSet, DiagramSpec } from './base';

export const waterfallRenderer: DiagramRenderer = {
  toOption(data: DataSet, spec: DiagramSpec): EChartsOption {
    const catMapping = spec.mappings.find(m => m.role === 'category');
    const valMapping = spec.mappings.find(m => m.role === 'value');
    if (!catMapping || !valMapping) return {};

    const catCol = data.columns.find(c => c.name === catMapping.columnName);
    const valCol = data.columns.find(c => c.name === valMapping.columnName);
    if (!catCol || !valCol) return {};

    const palette = spec.style.palette;
    const positiveColor = palette[0] || '#22c55e';
    const negativeColor = palette[1] || '#ef4444';
    const totalColor = palette[2] || '#3b82f6';
    const disabledSet = new Set(spec.disabledCategories ?? []);

    // Build waterfall data
    const allItems = catCol.values.map((cat, i) => ({
      label: String(cat),
      value: Number(valCol.values[i] ?? 0),
    }));

    // Filter to active items only
    const items = allItems.filter(item => !disabledSet.has(item.label));

    const total = items.reduce((sum, d) => sum + d.value, 0);
    const showTotal = spec.style.showTotal;
    const categories = showTotal
      ? [...items.map(d => d.label), 'Total']
      : items.map(d => d.label);

    // Calculate base (transparent) and visible bar values
    const baseData: number[] = [];
    const visibleData: (number | string)[] = [];
    const colors: string[] = [];
    let cumulative = 0;

    items.forEach(d => {
      if (d.value >= 0) {
        baseData.push(cumulative);
        visibleData.push(d.value);
        colors.push(positiveColor);
      } else {
        baseData.push(cumulative + d.value);
        visibleData.push(Math.abs(d.value));
        colors.push(negativeColor);
      }
      cumulative += d.value;
    });

    // Total bar: for a negative total, anchor the transparent base at `total`
    // so the visible bar stacks upward from `total` back to 0. This keeps the
    // label (position:'top') sitting at the zero-baseline, not floating mid-air.
    if (showTotal) {
      if (total >= 0) {
        baseData.push(0);
        visibleData.push(total);
      } else {
        baseData.push(total);
        visibleData.push(Math.abs(total));
      }
      colors.push(totalColor);
    }

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
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: '#fff',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        textStyle: { color: '#374151', fontSize: spec.style.fontSize },
        extraCssText: 'box-shadow: 0 4px 14px rgba(0,0,0,0.1); border-radius: 8px;',
        formatter: (params: unknown) => {
          const list = params as Array<{ seriesIndex: number; name: string; value: number }>;
          const visible = list.find(p => p.seriesIndex === 1);
          if (!visible) return '';
          const idx = categories.indexOf(visible.name);
          const isTotal = showTotal && idx === categories.length - 1;
          const rawValue = isTotal ? total : items[idx]?.value ?? 0;
          return `<strong>${visible.name}</strong><br/>Value: ${rawValue.toLocaleString()}`;
        },
      },
      grid: {
        top: 64,
        left: 70,
        right: 30,
        bottom: 48,
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
      series: [
        // Transparent base
        {
          type: 'bar',
          stack: 'waterfall',
          data: baseData,
          itemStyle: { color: 'transparent', borderColor: 'transparent' },
          emphasis: { itemStyle: { color: 'transparent', borderColor: 'transparent' } },
          tooltip: { show: false },
        },
        // Visible bars
        {
          type: 'bar',
          stack: 'waterfall',
          data: visibleData.map((v, i) => ({
            value: v,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: colors[i] },
                  { offset: 1, color: colors[i] + 'aa' },
                ],
              },
              borderRadius: [4, 4, 0, 0],
            },
          })),
          label: {
            show: spec.style.showLabels,
            position: 'top',
            formatter: (params: { dataIndex: number }) => {
              const idx = params.dataIndex;
              const isTotal = showTotal && idx === categories.length - 1;
              const rawValue = isTotal ? total : items[idx]?.value ?? 0;
              return rawValue.toLocaleString();
            },
            fontSize: spec.style.fontSize - 1,
            color: '#374151',
          },
          barMaxWidth: 48,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0,0,0,0.2)',
              shadowOffsetY: 4,
            },
          },
        },
      ],
      animationEasing: 'cubicOut',
      animationDuration: 700,
    };
  },
};
