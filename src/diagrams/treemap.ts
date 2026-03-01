import type { DiagramRenderer, EChartsOption, DataSet, DiagramSpec } from './base';

export const treemapRenderer: DiagramRenderer = {
  toOption(data: DataSet, spec: DiagramSpec): EChartsOption {
    const catMapping = spec.mappings.find(m => m.role === 'category');
    const parentMapping = spec.mappings.find(m => m.role === 'parent');
    const valMapping = spec.mappings.find(m => m.role === 'value');
    if (!catMapping || !valMapping) return {};

    const catCol = data.columns.find(c => c.name === catMapping.columnName);
    const parentCol = parentMapping
      ? data.columns.find(c => c.name === parentMapping.columnName)
      : null;
    const valCol = data.columns.find(c => c.name === valMapping.columnName);
    if (!catCol || !valCol) return {};

    const palette = spec.style.palette;

    interface TreeItem {
      name: string;
      value?: number;
      children?: TreeItem[];
      itemStyle?: Record<string, unknown>;
    }

    let treeData: TreeItem[];

    if (parentCol) {
      const groups = new Map<string, TreeItem>();
      catCol.values.forEach((cat, i) => {
        const parent = String(parentCol.values[i] ?? 'Other');
        const value = Number(valCol.values[i] ?? 0);
        if (!groups.has(parent)) {
          groups.set(parent, { name: parent, children: [] });
        }
        groups.get(parent)!.children!.push({ name: String(cat), value });
      });
      treeData = Array.from(groups.values()).map((group, gi) => ({
        ...group,
        itemStyle: {
          borderColor: palette[gi % palette.length],
          color: palette[gi % palette.length],
        },
      }));
    } else {
      treeData = catCol.values.map((cat, i) => ({
        name: String(cat),
        value: Number(valCol.values[i] ?? 0),
        itemStyle: { color: palette[i % palette.length] },
      }));
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
          type: 'treemap',
          data: treeData,
          width: '92%',
          height: '78%',
          top: 56,
          left: 'center',
          roam: false,
          breadcrumb: {
            show: true,
            bottom: 8,
            itemStyle: {
              color: '#f3f4f6',
              borderColor: '#e5e7eb',
              textStyle: { color: '#374151', fontSize: spec.style.fontSize - 1 },
            },
          },
          label: {
            show: spec.style.showLabels,
            formatter: '{b}\n{c}',
            fontSize: spec.style.fontSize - 1,
            color: '#fff',
            fontWeight: 500,
            lineHeight: 18,
          },
          upperLabel: {
            show: !!parentCol,
            height: 24,
            color: '#fff',
            fontSize: spec.style.fontSize,
            fontWeight: 600,
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2,
            gapWidth: 2,
            borderRadius: 4,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 16,
              shadowColor: 'rgba(0,0,0,0.2)',
            },
          },
          levels: [
            {
              itemStyle: {
                borderColor: '#fff',
                borderWidth: 3,
                gapWidth: 3,
                borderRadius: 6,
              },
            },
            {
              itemStyle: {
                borderColor: 'rgba(255,255,255,0.5)',
                borderWidth: 1,
                gapWidth: 1,
                borderRadius: 4,
              },
              colorSaturation: [0.35, 0.6],
              colorMappingBy: 'value',
            },
          ],
          animationEasing: 'cubicOut',
          animationDuration: 700,
        },
      ],
    };
  },
};
