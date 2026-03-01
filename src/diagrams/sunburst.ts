import type { DiagramRenderer, EChartsOption, DataSet, DiagramSpec } from './base';

export const sunburstRenderer: DiagramRenderer = {
  toOption(data: DataSet, spec: DiagramSpec): EChartsOption {
    const valMapping = spec.mappings.find(m => m.role === 'value');
    const levelMappings = spec.mappings
      .filter(m => m.role.startsWith('level'))
      .sort((a, b) => a.role.localeCompare(b.role));
    if (!valMapping || levelMappings.length === 0) return {};

    const valCol = data.columns.find(c => c.name === valMapping.columnName);
    const levelCols = levelMappings
      .map(m => data.columns.find(c => c.name === m.columnName))
      .filter(Boolean) as DataSet['columns'];
    if (!valCol || levelCols.length === 0) return {};

    const palette = spec.style.palette;

    interface SunburstItem {
      name: string;
      value?: number;
      children?: SunburstItem[];
      itemStyle?: Record<string, unknown>;
    }

    // Build hierarchy from flat data
    const root: SunburstItem = { name: 'root', children: [] };
    let topLevelIndex = 0;
    const topLevelColors = new Map<string, string>();

    for (let i = 0; i < data.rowCount; i++) {
      let current = root;
      for (let li = 0; li < levelCols.length; li++) {
        const col = levelCols[li];
        const name = String(col.values[i] ?? 'Unknown');
        let child = current.children?.find(c => c.name === name);
        if (!child) {
          child = { name, children: [] };
          if (!current.children) current.children = [];
          // Assign color based on top-level group
          if (li === 0) {
            if (!topLevelColors.has(name)) {
              topLevelColors.set(name, palette[topLevelIndex % palette.length]);
              topLevelIndex++;
            }
            child.itemStyle = { color: topLevelColors.get(name) };
          }
          current.children.push(child);
        }
        current = child;
      }
      current.value = (current.value || 0) + Number(valCol.values[i] ?? 0);
      delete current.children;
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
        trigger: 'item',
        backgroundColor: '#fff',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        textStyle: { color: '#374151', fontSize: spec.style.fontSize },
        extraCssText: 'box-shadow: 0 4px 14px rgba(0,0,0,0.1); border-radius: 8px;',
        formatter: '{b}: {c}',
      },
      series: [
        {
          type: 'sunburst',
          data: root.children || [],
          radius: ['12%', '88%'],
          center: ['50%', '54%'],
          sort: 'desc',
          label: {
            show: spec.style.showLabels,
            fontSize: spec.style.fontSize - 2,
            color: '#374151',
            rotate: 'radial',
            minAngle: 12,
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2,
            borderRadius: 4,
          },
          emphasis: {
            focus: 'ancestor',
            itemStyle: {
              shadowBlur: 16,
              shadowColor: 'rgba(0,0,0,0.2)',
            },
          },
          levels: [
            {},
            {
              r0: '12%',
              r: '40%',
              label: { fontSize: spec.style.fontSize, fontWeight: 600 },
              itemStyle: { borderWidth: 3 },
            },
            {
              r0: '40%',
              r: '64%',
              label: { fontSize: spec.style.fontSize - 1 },
              itemStyle: { borderWidth: 2, opacity: 0.88 },
            },
            {
              r0: '64%',
              r: '88%',
              label: { fontSize: spec.style.fontSize - 2 },
              itemStyle: { borderWidth: 1, opacity: 0.75 },
            },
          ],
          animationEasing: 'cubicOut',
          animationDuration: 800,
        },
      ],
    };
  },
};
