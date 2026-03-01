import type { DiagramMeta, DiagramType } from '../types/diagram';
import type { DiagramRenderer } from './base';
import { barRenderer } from './bar';
import { lineRenderer } from './line';
import { pieRenderer } from './pie';
import { treemapRenderer } from './treemap';
import { waterfallRenderer } from './waterfall';
import { comboRenderer } from './combo';
import { heatmapRenderer } from './heatmap';
import { sankeyRenderer } from './sankey';
import { sunburstRenderer } from './sunburst';
import { radarRenderer } from './radar';
import { roseRenderer } from './rose';
import { funnelRenderer } from './funnel';
import { scatterRenderer } from './scatter';
import { gaugeRenderer } from './gauge';

const renderers: Record<DiagramType, DiagramRenderer> = {
  bar: barRenderer,
  line: lineRenderer,
  pie: pieRenderer,
  treemap: treemapRenderer,
  waterfall: waterfallRenderer,
  combo: comboRenderer,
  heatmap: heatmapRenderer,
  sankey: sankeyRenderer,
  sunburst: sunburstRenderer,
  radar: radarRenderer,
  rose: roseRenderer,
  funnel: funnelRenderer,
  scatter: scatterRenderer,
  gauge: gaugeRenderer,
};

export function getRenderer(type: DiagramType): DiagramRenderer {
  return renderers[type];
}

export const DIAGRAM_META: DiagramMeta[] = [
  {
    type: 'bar',
    label: 'Bar Chart',
    description: 'Compare values across categories with gradient bars. Grouped or stacked.',
    icon: '📊',
    requiredRoles: ['category', 'value'],
    optionalRoles: [],
  },
  {
    type: 'line',
    label: 'Line / Area',
    description: 'Smooth curves with gradient area fills. Great for trends over time.',
    icon: '📈',
    requiredRoles: ['x', 'y'],
    optionalRoles: [],
  },
  {
    type: 'pie',
    label: 'Pie / Donut',
    description: 'Proportions with gradient slices, rich labels, and hover effects.',
    icon: '🥧',
    requiredRoles: ['category', 'value'],
    optionalRoles: [],
  },
  {
    type: 'rose',
    label: 'Nightingale Rose',
    description: 'Polar area chart — a stunning alternative to pie. Varies by angle and radius.',
    icon: '🌹',
    requiredRoles: ['category', 'value'],
    optionalRoles: [],
  },
  {
    type: 'treemap',
    label: 'Treemap',
    description: 'Nested rectangles for hierarchical data. See sub-items within totals at a glance.',
    icon: '🗂️',
    requiredRoles: ['category', 'value'],
    optionalRoles: ['parent'],
  },
  {
    type: 'waterfall',
    label: 'Waterfall',
    description: 'Show how items build up to a total. Green for gains, red for losses.',
    icon: '🌊',
    requiredRoles: ['category', 'value'],
    optionalRoles: [],
  },
  {
    type: 'combo',
    label: 'Combo (Bar + Line)',
    description: 'Dual-axis chart combining bars and a smooth line. Compare two metrics.',
    icon: '📉',
    requiredRoles: ['category', 'bar', 'line'],
    optionalRoles: [],
  },
  {
    type: 'radar',
    label: 'Radar / Spider',
    description: 'Compare multiple dimensions on radial axes. Great for skill matrices and profiles.',
    icon: '🕸️',
    requiredRoles: ['category', 'value'],
    optionalRoles: [],
  },
  {
    type: 'heatmap',
    label: 'Heatmap',
    description: 'Color-intensity matrix. Perfect for correlations and dense comparisons.',
    icon: '🟧',
    requiredRoles: ['x', 'y', 'value'],
    optionalRoles: [],
  },
  {
    type: 'scatter',
    label: 'Scatter / Bubble',
    description: 'Plot points by two axes. Add a size column for bubble charts.',
    icon: '🫧',
    requiredRoles: ['x', 'y'],
    optionalRoles: ['size'],
  },
  {
    type: 'funnel',
    label: 'Funnel',
    description: 'Visualize stages in a process — conversions, pipelines, or workflows.',
    icon: '🔻',
    requiredRoles: ['category', 'value'],
    optionalRoles: [],
  },
  {
    type: 'sankey',
    label: 'Sankey Flow',
    description: 'Show weighted flows between categories. Ideal for user journeys and transfers.',
    icon: '🔀',
    requiredRoles: ['source', 'target', 'value'],
    optionalRoles: [],
  },
  {
    type: 'sunburst',
    label: 'Sunburst',
    description: 'Radial rings for deep hierarchies. Drill down from center outward.',
    icon: '☀️',
    requiredRoles: ['level0', 'value'],
    optionalRoles: ['level1', 'level2'],
  },
  {
    type: 'gauge',
    label: 'Gauge',
    description: 'Single KPI display with progress arc. Great for dashboards and targets.',
    icon: '🎯',
    requiredRoles: ['value'],
    optionalRoles: [],
  },
];
