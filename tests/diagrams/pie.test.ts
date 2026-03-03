import { describe, it, expect } from 'vitest';
import { pieRenderer } from '../../src/diagrams/pie';
import type { DataSet } from '../../src/types/data';
import { DEFAULT_STYLE, DiagramSpec } from '../../src/types/diagram';

describe('pie renderer - showTotal', () => {
    const data: DataSet = {
        rowCount: 3,
        columns: [
            { name: 'Cat', type: 'string', values: ['A', 'B', 'C'] },
            { name: 'Val', type: 'number', values: [100, 200, 0] } // Total should be 300
        ]
    };

    const baseSpec: DiagramSpec = {
        type: 'pie',
        title: 'Test',
        mappings: [
            { role: 'category', columnName: 'Cat' },
            { role: 'value', columnName: 'Val' }
        ],
        style: { ...DEFAULT_STYLE, showTotal: true },
        options: { donut: true },
        disabledCategories: []
    };

    it('adds center graphic labels when donut and showTotal is true', () => {
        const option = pieRenderer.toOption(data, baseSpec);
        const graphics = option.graphic as any[];

        // find text graphics
        const textGraphics = graphics.filter(g => g.type === 'text');

        // One for the value (300), one for the "Total" sub-label
        const valueLabel = textGraphics.find(g => g.style.text === '300');
        const subLabel = textGraphics.find(g => g.style.text === 'Total');

        expect(valueLabel).toBeDefined();
        expect(subLabel).toBeDefined();
        expect(valueLabel.left).toBe('center');
    });

    it('does not add center labels when showTotal is false', () => {
        const spec = { ...baseSpec, style: { ...baseSpec.style, showTotal: false } };
        const option = pieRenderer.toOption(data, spec);
        const graphics = option.graphic as any[];

        const textGraphics = graphics.filter(g => g.type === 'text' && (g.style.text === '300' || g.style.text === 'Total'));
        expect(textGraphics.length).toBe(0);
    });

    it('does not add center labels when not a donut', () => {
        const spec = { ...baseSpec, options: { donut: false } };
        const option = pieRenderer.toOption(data, spec);
        const graphics = option.graphic as any[];

        const textGraphics = graphics.filter(g => g.type === 'text' && (g.style.text === '300' || g.style.text === 'Total'));
        expect(textGraphics.length).toBe(0);
    });

    it('recalculates total when categories are disabled', () => {
        const spec: DiagramSpec = {
            ...baseSpec,
            disabledCategories: ['A'] // 100 is removed, total should be 200
        };
        const option = pieRenderer.toOption(data, spec);
        const graphics = option.graphic as any[];

        const valueLabel = graphics.find(g => g.type === 'text' && g.style.text === '200');
        expect(valueLabel).toBeDefined();

        const pieData = (option.series as any[])[0].data;
        expect(pieData.length).toBe(1); // Only 'B' remains ('C' is 0, 'A' is disabled)
        expect(pieData[0].name).toBe('B');
    });
});
