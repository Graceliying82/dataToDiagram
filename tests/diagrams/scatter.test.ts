import { describe, it, expect } from 'vitest';
import { scatterRenderer } from '../../src/diagrams/scatter';
import type { DataSet } from '../../src/types/data';
import { DEFAULT_STYLE, DiagramSpec } from '../../src/types/diagram';

describe('scatter renderer', () => {
    const baseSpec: DiagramSpec = {
        type: 'scatter',
        title: 'Test Scatter',
        mappings: [
            { role: 'x', columnName: 'X' },
            { role: 'y', columnName: 'Y' }
        ],
        style: DEFAULT_STYLE,
        options: {}
    };

    it('gracefully handles missing columns', () => {
        const data: DataSet = { rowCount: 0, columns: [] };
        expect(scatterRenderer.toOption(data, baseSpec)).toEqual({});
    });

    it('filters out non-numeric coordinates (NaN) cleanly', () => {
        const data: DataSet = {
            rowCount: 4,
            columns: [
                { name: 'X', type: 'string', values: [1, 'invalid', null, 4] },
                { name: 'Y', type: 'number', values: [10, 20, 30, 40] }
            ]
        };

        const option = scatterRenderer.toOption(data, baseSpec);
        const seriesData = (option.series as any)[0].data;

        // Should only contain rows 0 and 3
        expect(seriesData.length).toBe(2);
        expect(seriesData[0]).toEqual([1, 10]);
        expect(seriesData[1]).toEqual([4, 40]);
    });

    it('handles bubble sizing logic correctly', () => {
        const bubbleSpec = { ...baseSpec, mappings: [...baseSpec.mappings, { role: 'size', columnName: 'Size' }] };
        const data: DataSet = {
            rowCount: 2,
            columns: [
                { name: 'X', type: 'number', values: [1, 2] },
                { name: 'Y', type: 'number', values: [10, 20] },
                { name: 'Size', type: 'number', values: [50, 100] } // maxSize is 100
            ]
        };

        const option = scatterRenderer.toOption(data, bubbleSpec);
        const seriesData = (option.series as any)[0].data;

        expect(seriesData.length).toBe(2);
        expect(seriesData[0]).toEqual([1, 10, 50]);
        expect(seriesData[1]).toEqual([2, 20, 100]);

        const symbolSizeFn = (option.series as any)[0].symbolSize;
        expect(symbolSizeFn([1, 10, 50])).toBe(25); // Math.max(6, (50/100) * 50) = 25
        expect(symbolSizeFn([2, 20, 100])).toBe(50); // Math.max(6, (100/100) * 50) = 50
    });
});
