import type { EChartsOption } from 'echarts';
import type { DataSet } from '../types/data';
import type { DiagramSpec } from '../types/diagram';
import { getRenderer } from '../diagrams/registry';

export function buildOption(data: DataSet, spec: DiagramSpec): EChartsOption {
  const renderer = getRenderer(spec.type);
  if (!renderer) {
    console.error(`No renderer found for type: ${spec.type}`);
    return {};
  }
  return renderer.toOption(data, spec);
}
