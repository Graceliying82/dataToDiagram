import { describe, it, expect } from 'vitest';
import { barRenderer } from '../../src/diagrams/bar';
import type { DataSet } from '../../src/types/data';
import { DEFAULT_STYLE, DiagramSpec } from '../../src/types/diagram';

describe('bar renderer - showTotal', () => {
    const data: DataSet = {
        rowCount: 2,
        columns: [
            { name: 'Cat', type: 'string', values: ['A', 'B'] },
            { name: 'V1', type: 'number', values: [10, 20] },
            { name: 'V2', type: 'number', values: [5, 15] }
        ]
    };

    const baseSpec: DiagramSpec = {
        type: 'bar',
        title: 'Test',
        mappings: [
            { role: 'category', columnName: 'Cat' },
            { role: 'value', columnName: 'V1' },
            { role: 'value', columnName: 'V2' }
        ],
        style: { ...DEFAULT_STYLE, showTotal: true },
        options: { stacked: true },
        disabledCategories: []
    };

    it('adds a phantom _total_ series when stacked and showTotal is true', () => {
        const option = barRenderer.toOption(data, baseSpec);
        const totalSeries = (option.series as any[]).find(s => s.name === '_total_');

        expect(totalSeries).toBeDefined();
        expect(totalSeries.type).toBe('bar');
        expect(totalSeries.stack).toBe('total');
        expect(totalSeries.itemStyle.color).toBe('transparent');

        // Check labels (10+5=15, 20+15=35)
        expect(totalSeries.data[0].label.formatter()).toBe('15');
        expect(totalSeries.data[1].label.formatter()).toBe('35');
    });

    it('does not add phantom series when showTotal is false', () => {
        const spec = { ...baseSpec, style: { ...baseSpec.style, showTotal: false } };
        const option = barRenderer.toOption(data, spec);
        const totalSeries = (option.series as any[]).find(s => s.name === '_total_');
        expect(totalSeries).toBeUndefined();
    });

    it('does not add phantom series when not stacked', () => {
        const spec = { ...baseSpec, options: { stacked: false } };
        const option = barRenderer.toOption(data, spec);
        const totalSeries = (option.series as any[]).find(s => s.name === '_total_');
        expect(totalSeries).toBeUndefined();
    });

    it('filters categories and recalculates stacked totals when categories are disabled', () => {
        const spec: DiagramSpec = {
            ...baseSpec,
            disabledCategories: ['A'] // Only 'B' remains
        };
        const option = barRenderer.toOption(data, spec);
        const xAxis = option.xAxis as any;
        const totalSeries = (option.series as any[]).find(s => s.name === '_total_');

        expect(xAxis.data).toEqual(['B']);
        expect(totalSeries.data.length).toBe(1);
        // V1[B]=20, V2[B]=15 -> 35
        expect(totalSeries.data[0].label.formatter()).toBe('35');
    });
});
