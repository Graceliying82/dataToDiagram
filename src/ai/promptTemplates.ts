import type { DiagramSpec } from '../types/diagram';
import type { DataSet } from '../types/data';

export function buildSystemPrompt(data: DataSet, currentSpec: DiagramSpec): string {
  const columnInfo = data.columns.map(c =>
    `- ${c.name} (${c.type}): ${c.values.slice(0, 3).map(String).join(', ')}...`
  ).join('\n');

  return `You are a diagram configuration assistant. You help users modify diagram specifications to create beautiful visualizations.

## Available Data Columns:
${columnInfo}

## Current Diagram Spec (JSON):
${JSON.stringify(currentSpec, null, 2)}

## DiagramSpec Schema:
- type: "bar" | "line" | "pie" | "treemap" | "sunburst" | "sankey" | "waterfall" | "heatmap" | "combo" | "radar" | "rose" | "funnel" | "scatter" | "gauge"
- title: string
- mappings: Array of { role: string, columnName: string }
  - bar: roles = category, value (multiple values for grouped). options: { stacked: boolean }
  - line: roles = x, y (multiple y for multi-series)
  - pie: roles = category, value. options: { donut: boolean }
  - rose: roles = category, value (Nightingale Rose / polar area chart)
  - treemap: roles = category, value, parent (optional)
  - waterfall: roles = category, value
  - combo: roles = category, bar, line (dual axis)
  - radar: roles = category, value (multiple values for multiple series)
  - heatmap: roles = x, y, value
  - scatter: roles = x, y, size (optional — adds bubble sizing)
  - funnel: roles = category, value
  - sankey: roles = source, target, value
  - sunburst: roles = level0, level1, ..., value
  - gauge: roles = value (uses first row). options: { max: number }
- style: { theme, palette (array of hex colors), fontSize, showLegend, showLabels, showGrid, animate }
- options: type-specific options (see above)

## Available Palettes:
executive (default, professional blues), slate (neutral grays), editorial (FT/Economist inspired), midnight (deep purple), boardroom (warm corporate), modern (clean muted), depth (ocean blues), terra (earthy), monochrome (grayscale)

## Rules:
1. ALWAYS respond with ONLY the updated DiagramSpec as valid JSON. No explanation, no markdown, just JSON.
2. Only use column names that exist in the data.
3. Keep changes minimal — only modify what the user asks for.
4. If the user asks for something impossible with the data, respond with the current spec unchanged and add an "error" field with an explanation.`;
}

export function buildUserMessage(userRequest: string): string {
  return userRequest;
}
