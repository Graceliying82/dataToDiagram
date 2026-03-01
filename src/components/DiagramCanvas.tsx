import { useRef, useMemo } from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { BarChart, LineChart, PieChart, ScatterChart, RadarChart, FunnelChart, SunburstChart, TreemapChart, HeatmapChart, SankeyChart, GaugeChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent, TitleComponent, VisualMapComponent, DataZoomComponent, ToolboxComponent, GraphicComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { DataSet } from '../types/data';
import type { DiagramSpec } from '../types/diagram';
import { buildOption } from '../engine/renderer';

echarts.use([
  BarChart, LineChart, PieChart, ScatterChart, RadarChart, FunnelChart, SunburstChart, TreemapChart, HeatmapChart, SankeyChart, GaugeChart,
  GridComponent, TooltipComponent, LegendComponent, TitleComponent, VisualMapComponent, DataZoomComponent, ToolboxComponent, GraphicComponent,
  CanvasRenderer,
]);

interface DiagramCanvasProps {
  data: DataSet;
  spec: DiagramSpec;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChartReady?: (instance: any) => void;
}

export function DiagramCanvas({ data, spec, onChartReady }: DiagramCanvasProps) {
  const chartRef = useRef<ReactEChartsCore>(null);

  const option = useMemo(() => buildOption(data, spec), [data, spec]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChartReady = (instance: any) => {
    onChartReady?.(instance);
  };

  return (
    <div id="diagram-canvas" className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <ReactEChartsCore
        ref={chartRef}
        echarts={echarts}
        option={option}
        style={{ height: '520px', width: '100%' }}
        opts={{ renderer: 'canvas', devicePixelRatio: 2 }}
        onChartReady={handleChartReady}
        notMerge={true}
      />
    </div>
  );
}
