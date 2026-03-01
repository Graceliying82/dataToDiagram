import type { EChartsOption } from 'echarts';
import type { DataSet } from '../types/data';
import type { DiagramSpec } from '../types/diagram';

export type { EChartsOption };
export type { DataSet, DiagramSpec };

export interface DiagramRenderer {
  toOption(data: DataSet, spec: DiagramSpec): EChartsOption;
}
