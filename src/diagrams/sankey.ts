import type { DiagramRenderer, EChartsOption, DataSet, DiagramSpec } from './base';

export const sankeyRenderer: DiagramRenderer = {
  toOption(data: DataSet, spec: DiagramSpec): EChartsOption {
    const srcMapping = spec.mappings.find(m => m.role === 'source');
    const tgtMapping = spec.mappings.find(m => m.role === 'target');
    const valMapping = spec.mappings.find(m => m.role === 'value');
    if (!srcMapping || !tgtMapping || !valMapping) return {};

    const srcCol = data.columns.find(c => c.name === srcMapping.columnName);
    const tgtCol = data.columns.find(c => c.name === tgtMapping.columnName);
    const valCol = data.columns.find(c => c.name === valMapping.columnName);
    if (!srcCol || !tgtCol || !valCol) return {};

    const palette = spec.style.palette;

    // Build links
    const links = srcCol.values
      .map((s, i) => ({
        source: String(s),
        target: String(tgtCol.values[i]),
        value: Number(valCol.values[i] ?? 0),
      }))
      .filter(l => l.value > 0);

    // Build unique nodes with color from source
    const nodeNames = [...new Set([...links.map(l => l.source), ...links.map(l => l.target)])];
    const sourceNames = [...new Set(links.map(l => l.source))];

    const nodes = nodeNames.map(name => {
      const sourceIdx = sourceNames.indexOf(name);
      const colorIdx = sourceIdx >= 0 ? sourceIdx : nodeNames.indexOf(name);
      return {
        name,
        itemStyle: {
          color: palette[colorIdx % palette.length],
          borderColor: palette[colorIdx % palette.length],
          borderWidth: 1,
          borderRadius: 3,
        },
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
        triggerOn: 'mousemove',
        backgroundColor: '#fff',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        textStyle: { color: '#374151', fontSize: spec.style.fontSize },
        extraCssText: 'box-shadow: 0 4px 14px rgba(0,0,0,0.1); border-radius: 8px;',
      },
      series: [
        {
          type: 'sankey',
          data: nodes,
          links,
          top: 56,
          left: 40,
          right: 40,
          bottom: 24,
          nodeWidth: 20,
          nodeGap: 12,
          layoutIterations: 32,
          orient: 'horizontal',
          draggable: true,
          label: {
            show: spec.style.showLabels,
            fontSize: spec.style.fontSize,
            color: '#374151',
            fontWeight: 500,
          },
          lineStyle: {
            color: 'source',
            curveness: 0.5,
            opacity: 0.35,
          },
          emphasis: {
            focus: 'adjacency',
            lineStyle: { opacity: 0.6 },
            itemStyle: {
              shadowBlur: 12,
              shadowColor: 'rgba(0,0,0,0.2)',
            },
          },
          animationEasing: 'cubicOut',
          animationDuration: 800,
        },
      ],
    };
  },
};
