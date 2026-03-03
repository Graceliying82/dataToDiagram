import type { DataSet, Column } from '../types/data';
import type { DiagramSpec, DiagramType, ColumnMapping } from '../types/diagram';
import { DEFAULT_STYLE } from '../types/diagram';

interface Suggestion {
  type: DiagramType;
  score: number;
  mappings: ColumnMapping[];
}

function getStringColumns(ds: DataSet): Column[] {
  return ds.columns.filter(c => c.type === 'string');
}

function getNumericColumns(ds: DataSet): Column[] {
  return ds.columns.filter(c => c.type === 'number');
}

function getDateColumns(ds: DataSet): Column[] {
  return ds.columns.filter(c => c.type === 'date');
}

export function suggestDiagrams(ds: DataSet): Suggestion[] {
  const strings = getStringColumns(ds);
  const numbers = getNumericColumns(ds);
  const dates = getDateColumns(ds);
  const suggestions: Suggestion[] = [];

  // Bar chart: at least 1 category + 1 number
  if (strings.length >= 1 && numbers.length >= 1) {
    const mappings: ColumnMapping[] = [
      { role: 'category', columnName: strings[0].name },
      ...numbers.map(n => ({ role: 'value', columnName: n.name })),
    ];
    suggestions.push({ type: 'bar', score: 90, mappings });
  }

  // Line chart: date/category + numbers (time series favored)
  if ((dates.length >= 1 || strings.length >= 1) && numbers.length >= 1) {
    const xCol = dates.length > 0 ? dates[0] : strings[0];
    const mappings: ColumnMapping[] = [
      { role: 'x', columnName: xCol.name },
      ...numbers.map(n => ({ role: 'y', columnName: n.name })),
    ];
    suggestions.push({ type: 'line', score: dates.length > 0 ? 85 : 70, mappings });
  }

  // Pie: 1 category + 1 number
  if (strings.length >= 1 && numbers.length >= 1) {
    suggestions.push({
      type: 'pie',
      score: ds.rowCount <= 10 ? 80 : 50,
      mappings: [
        { role: 'category', columnName: strings[0].name },
        { role: 'value', columnName: numbers[0].name },
      ],
    });
  }

  // Treemap: good for hierarchical — 1+ categories + 1 number
  if (strings.length >= 1 && numbers.length >= 1) {
    const mappings: ColumnMapping[] = [
      ...strings.map((s, i) => ({ role: i === 0 ? 'category' : 'parent', columnName: s.name })),
      { role: 'value', columnName: numbers[0].name },
    ];
    suggestions.push({ type: 'treemap', score: strings.length >= 2 ? 85 : 60, mappings });
  }

  // Waterfall: 1 category + 1 number (works great for sub-items → total)
  if (strings.length >= 1 && numbers.length >= 1) {
    suggestions.push({
      type: 'waterfall',
      score: 75,
      mappings: [
        { role: 'category', columnName: strings[0].name },
        { role: 'value', columnName: numbers[0].name },
      ],
    });
  }

  // Combo: category + 2+ numbers
  if (strings.length >= 1 && numbers.length >= 2) {
    suggestions.push({
      type: 'combo',
      score: 80,
      mappings: [
        { role: 'category', columnName: strings[0].name },
        { role: 'bar', columnName: numbers[0].name },
        { role: 'line', columnName: numbers[1].name },
      ],
    });
  }

  // Heatmap: 2 categories + 1 number
  if (strings.length >= 2 && numbers.length >= 1) {
    suggestions.push({
      type: 'heatmap',
      score: 70,
      mappings: [
        { role: 'x', columnName: strings[0].name },
        { role: 'y', columnName: strings[1].name },
        { role: 'value', columnName: numbers[0].name },
      ],
    });
  }

  // Sankey: 2 categories + 1 number (source → target with weight)
  if (strings.length >= 2 && numbers.length >= 1) {
    suggestions.push({
      type: 'sankey',
      score: 65,
      mappings: [
        { role: 'source', columnName: strings[0].name },
        { role: 'target', columnName: strings[1].name },
        { role: 'value', columnName: numbers[0].name },
      ],
    });
  }

  // Sunburst: 2+ categories + 1 number
  if (strings.length >= 2 && numbers.length >= 1) {
    suggestions.push({
      type: 'sunburst',
      score: strings.length >= 3 ? 75 : 55,
      mappings: [
        ...strings.map((s, i) => ({ role: `level${i}`, columnName: s.name })),
        { role: 'value', columnName: numbers[0].name },
      ],
    });
  }

  // Radar: 1 category + multiple numbers (skill matrices, profiles)
  if (strings.length >= 1 && numbers.length >= 2) {
    suggestions.push({
      type: 'radar',
      score: numbers.length >= 3 ? 82 : 65,
      mappings: [
        { role: 'category', columnName: strings[0].name },
        ...numbers.map(n => ({ role: 'value', columnName: n.name })),
      ],
    });
  }

  // Rose: 1 category + 1 number (beautiful pie alternative)
  if (strings.length >= 1 && numbers.length >= 1) {
    suggestions.push({
      type: 'rose',
      score: ds.rowCount <= 12 ? 72 : 45,
      mappings: [
        { role: 'category', columnName: strings[0].name },
        { role: 'value', columnName: numbers[0].name },
      ],
    });
  }

  // Funnel: 1 category + 1 number (conversion stages)
  if (strings.length >= 1 && numbers.length >= 1) {
    suggestions.push({
      type: 'funnel',
      score: ds.rowCount <= 8 ? 68 : 40,
      mappings: [
        { role: 'category', columnName: strings[0].name },
        { role: 'value', columnName: numbers[0].name },
      ],
    });
  }

  // Scatter: 2+ numbers
  if (numbers.length >= 2) {
    const mappings: ColumnMapping[] = [
      { role: 'x', columnName: numbers[0].name },
      { role: 'y', columnName: numbers[1].name },
    ];
    if (numbers.length >= 3) {
      mappings.push({ role: 'size', columnName: numbers[2].name });
    }
    suggestions.push({
      type: 'scatter',
      score: numbers.length >= 3 ? 70 : 55,
      mappings,
    });
  }

  // Gauge: single value (first number column, first row)
  if (numbers.length >= 1) {
    suggestions.push({
      type: 'gauge',
      score: ds.rowCount === 1 ? 75 : 30,
      mappings: [
        { role: 'value', columnName: numbers[0].name },
      ],
    });
  }

  return suggestions.sort((a, b) => b.score - a.score);
}

export function buildSpec(type: DiagramType, mappings: ColumnMapping[], title?: string): DiagramSpec {
  return {
    type,
    title: title || 'Untitled Diagram',
    mappings,
    style: { ...DEFAULT_STYLE },
    options: {},
    disabledCategories: [],
  };
}
