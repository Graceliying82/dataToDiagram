import { describe, it, expect } from 'vitest';
import { createDraggableLegend, createResizableLabel } from '../../src/utils/legendUtils';
import type { DiagramSpec } from '../../src/types/diagram';
import { DEFAULT_STYLE } from '../../src/types/diagram';

describe('legendUtils', () => {
    const dummySpec: DiagramSpec = {
        type: 'bar',
        title: 'Test',
        mappings: [],
        style: { ...DEFAULT_STYLE, showLegend: true, legendPosition: 'top-right', fontSize: 12 },
        options: {}
    };

    describe('createDraggableLegend', () => {
        it('returns empty elements if showLegend is false', () => {
            const spec = { ...dummySpec, style: { ...dummySpec.style, showLegend: false } };
            const result = createDraggableLegend([{ id: '1', label: 'L1', color: 'red' }], spec);
            expect(result).toEqual({ elements: [] });
        });

        it('returns empty elements if no items provided', () => {
            const result = createDraggableLegend([], dummySpec);
            expect(result).toEqual({ elements: [] });
        });

        it('returns a draggable group with legend items', () => {
            const result = createDraggableLegend(
                [{ id: '1', label: 'Item 1', color: '#ff0000' }],
                dummySpec
            );

            const group = (result as any).elements?.[0];
            expect(group).toBeDefined();
            expect(group?.type).toBe('group');
            expect(group?.draggable).toBe(true);
            expect(group?.id).toBe('draggable-legend-top-right');

            // Should contain rects and texts for the legend item plus background card
            expect(group?.children?.length).toBeGreaterThan(3);
        });
    });

    describe('createResizableLabel', () => {
        it('returns a visual group for the label', () => {
            const result = createResizableLabel('My Label', dummySpec);

            const group = (result as any).elements?.[0];
            expect(group).toBeDefined();
            expect(group?.type).toBe('group');
            expect(group?.draggable).toBe(true);
            expect(group?.children?.[0].type).toBe('text');
            expect(group?.children?.[0].style?.text).toBe('My Label');
        });
    });
});
