export type DiagramType =
  | 'bar'
  | 'line'
  | 'pie'
  | 'treemap'
  | 'sunburst'
  | 'sankey'
  | 'waterfall'
  | 'heatmap'
  | 'combo'
  | 'radar'
  | 'rose'
  | 'funnel'
  | 'scatter'
  | 'gauge';

export interface ColumnMapping {
  role: string;
  columnName: string;
}

export interface DiagramStyle {
  theme: 'light' | 'dark';
  palette: string[];
  fontSize: number;
  showLegend: boolean;
  showLabels: boolean;
  showGrid: boolean;
  animate: boolean;
  legendPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export interface DiagramSpec {
  type: DiagramType;
  title: string;
  mappings: ColumnMapping[];
  style: DiagramStyle;
  options: Record<string, unknown>;
}

export interface DiagramMeta {
  type: DiagramType;
  label: string;
  description: string;
  icon: string;
  requiredRoles: string[];
  optionalRoles: string[];
}

export const DEFAULT_STYLE: DiagramStyle = {
  theme: 'light',
  palette: ['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#00C7BE', '#007AFF', '#5856D6', '#FF2D55'],
  fontSize: 12,
  showLegend: true,
  showLabels: true,
  showGrid: true,
  animate: true,
  legendPosition: 'bottom-right',
};
