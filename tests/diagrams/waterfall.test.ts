import { describe, it, expect } from 'vitest';
import { waterfallRenderer } from '../../src/diagrams/waterfall';
import type { DataSet } from '../../src/types/data';
import { DEFAULT_STYLE, DiagramSpec } from '../../src/types/diagram';

describe('waterfall renderer', () => {
    it('gracefully handles missing required columns', () => {
        const spec: DiagramSpec = { type: 'waterfall', title: 'Test', mappings: [], style: DEFAULT_STYLE, options: {}, disabledCategories: [] };
        const data: DataSet = { rowCount: 0, columns: [] };
        expect(waterfallRenderer.toOption(data, spec)).toEqual({});
    });

    it('processes positive totals correctly', () => {
        const data: DataSet = {
            rowCount: 3,
            columns: [
                { name: 'Category', type: 'string', values: ['Start', 'Add', 'Subtract'] },
                { name: 'Value', type: 'number', values: [100, 50, -20] } // Total = 130
            ]
        };
        const spec: DiagramSpec = {
            type: 'waterfall', title: 'Test',
            mappings: [{ role: 'category', columnName: 'Category' }, { role: 'value', columnName: 'Value' }],
            style: DEFAULT_STYLE, options: {}, disabledCategories: []
        };

        const option = waterfallRenderer.toOption(data, spec);
        expect(option.series).toBeDefined();

        // Assert total bar values
        const baseSeriesData = (option.series as any)[0].data;
        const visibleSeriesData = (option.series as any)[1].data;

        // Final total element
        expect(baseSeriesData[baseSeriesData.length - 1]).toBe(0);
        expect(visibleSeriesData[visibleSeriesData.length - 1].value).toBe(130);
    });

    it('anchors negative totals correctly to the baseline', () => {
        const data: DataSet = {
            rowCount: 3,
            columns: [
                { name: 'Category', type: 'string', values: ['Start', 'Big Loss', 'Small Gain'] },
                { name: 'Value', type: 'number', values: [10, -50, 5] } // Total = -35
            ]
        };
        const spec: DiagramSpec = {
            type: 'waterfall', title: 'Test',
            mappings: [{ role: 'category', columnName: 'Category' }, { role: 'value', columnName: 'Value' }],
            style: DEFAULT_STYLE, options: {}, disabledCategories: []
        };

        const option = waterfallRenderer.toOption(data, spec);
        expect(option.series).toBeDefined();

        // Assert total bar values for negative total
        const baseSeriesData = (option.series as any)[0].data;
        const visibleSeriesData = (option.series as any)[1].data;

        const totalIndex = baseSeriesData.length - 1;
        // The base should start at the negative total, and the visible part should stretch back up by Math.abs(total)
        expect(baseSeriesData[totalIndex]).toBe(-35);
        expect(visibleSeriesData[totalIndex].value).toBe(35);
    });

    it('removes the total bar when showTotal is false', () => {
        const data: DataSet = {
            rowCount: 2,
            columns: [
                { name: 'Category', type: 'string', values: ['A', 'B'] },
                { name: 'Value', type: 'number', values: [10, 20] }
            ]
        };
        const spec: DiagramSpec = {
            type: 'waterfall', title: 'Test',
            mappings: [{ role: 'category', columnName: 'Category' }, { role: 'value', columnName: 'Value' }],
            style: { ...DEFAULT_STYLE, showTotal: false },
            options: {},
            disabledCategories: []
        };

        const option = waterfallRenderer.toOption(data, spec);
        const categories = (option.xAxis as any).data;
        const visibleData = (option.series as any)[1].data;

        expect(categories).not.toContain('Total');
        expect(categories).toHaveLength(2);
        expect(visibleData).toHaveLength(2);
    });

    it('correctly formats tooltips and labels for total and non-total items', () => {
        const data: DataSet = {
            rowCount: 1,
            columns: [
                { name: 'Cat', type: 'string', values: ['Start'] },
                { name: 'Val', type: 'number', values: [100] }
            ]
        };
        const spec: DiagramSpec = {
            type: 'waterfall', title: 'Test',
            mappings: [{ role: 'category', columnName: 'Cat' }, { role: 'value', columnName: 'Val' }],
            style: { ...DEFAULT_STYLE, showTotal: true },
            options: {},
            disabledCategories: []
        };

        const option = waterfallRenderer.toOption(data, spec);

        // Test label formatter
        const labelFormatter = (option.series as any)[1].label.formatter;
        expect(labelFormatter({ dataIndex: 0 })).toBe('100');
        expect(labelFormatter({ dataIndex: 1 })).toBe('100'); // Total index

        // Test tooltip formatter
        const tooltipFormatter = (option.tooltip as any).formatter;
        const params = [
            { name: 'Start', seriesIndex: 0, value: 0 }, // Transparent series
            { name: 'Start', seriesIndex: 1, value: 100 },
        ];
        expect(tooltipFormatter(params)).toContain('Start');
        expect(tooltipFormatter(params)).toContain('100');

        const paramsTotal = [
            { name: 'Total', seriesIndex: 0, value: 0 },
            { name: 'Total', seriesIndex: 1, value: 100 },
        ];
        expect(tooltipFormatter(paramsTotal)).toContain('Total');
        expect(tooltipFormatter(paramsTotal)).toContain('100');
    });

    it('filters items and recalculates flow when categories are disabled', () => {
        const data: DataSet = {
            rowCount: 3,
            columns: [
                { name: 'Category', type: 'string', values: ['A', 'B', 'C'] },
                { name: 'Value', type: 'number', values: [100, 50, -20] }
            ]
        };
        const spec: DiagramSpec = {
            type: 'waterfall', title: 'Test',
            mappings: [{ role: 'category', columnName: 'Category' }, { role: 'value', columnName: 'Value' }],
            style: { ...DEFAULT_STYLE, showTotal: true },
            options: {},
            disabledCategories: ['B'] // Only A (100) and C (-20) remain. Total = 80.
        };

        const option = waterfallRenderer.toOption(data, spec);
        const categories = (option.xAxis as any).data;
        const visibleData = (option.series as any)[1].data;

        expect(categories).toEqual(['A', 'C', 'Total']);
        expect(visibleData).toHaveLength(3);

        // Check labels/values
        const labelFormatter = (option.series as any)[1].label.formatter;
        expect(labelFormatter({ dataIndex: 0 })).toBe('100'); // A
        expect(labelFormatter({ dataIndex: 1 })).toBe('-20'); // C
        expect(labelFormatter({ dataIndex: 2 })).toBe('80');  // Total
    });
});
