import { describe, it, expect } from 'vitest';
import { waterfallRenderer } from '../../src/diagrams/waterfall';
import type { DataSet } from '../../src/types/data';
import { DEFAULT_STYLE, DiagramSpec } from '../../src/types/diagram';

describe('waterfall renderer', () => {
    it('gracefully handles missing required columns', () => {
        const spec: DiagramSpec = { type: 'waterfall', title: 'Test', mappings: [], style: DEFAULT_STYLE, options: {} };
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
            style: DEFAULT_STYLE, options: {}
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
            style: DEFAULT_STYLE, options: {}
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
});
