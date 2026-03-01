import { describe, it, expect } from 'vitest';
import { suggestDiagrams, buildSpec } from '../../src/engine/specBuilder';
import type { DataSet } from '../../src/types/data';
import { DEFAULT_STYLE } from '../../src/types/diagram';

describe('specBuilder', () => {
    describe('suggestDiagrams', () => {
        it('should suggest bar and pie chart for 1 string and 1 number column', () => {
            const ds: DataSet = {
                rowCount: 5,
                columns: [
                    { name: 'Category', type: 'string', values: ['A', 'B', 'C', 'D', 'E'] },
                    { name: 'Value', type: 'number', values: [10, 20, 30, 40, 50] }
                ]
            };

            const suggestions = suggestDiagrams(ds);

            const barSuggestion = suggestions.find(s => s.type === 'bar');
            expect(barSuggestion).toBeDefined();
            expect(barSuggestion?.mappings).toEqual([
                { role: 'category', columnName: 'Category' },
                { role: 'value', columnName: 'Value' }
            ]);

            const pieSuggestion = suggestions.find(s => s.type === 'pie');
            expect(pieSuggestion).toBeDefined();
        });

        it('should favor line chart when date column is present', () => {
            const ds: DataSet = {
                rowCount: 3,
                columns: [
                    { name: 'Date', type: 'date', values: [new Date('2023-01-01'), new Date('2023-01-02'), new Date('2023-01-03')] },
                    { name: 'Value', type: 'number', values: [1, 2, 3] }
                ]
            };

            const suggestions = suggestDiagrams(ds);

            const topSuggestion = suggestions[0];
            expect(topSuggestion.type).toBe('line');
            expect(topSuggestion.mappings).toEqual([
                { role: 'x', columnName: 'Date' },
                { role: 'y', columnName: 'Value' }
            ]);
        });

        it('should suggest scatter for 2+ numbers', () => {
            const ds: DataSet = {
                rowCount: 10,
                columns: [
                    { name: 'X', type: 'number', values: [1, 2, 3] },
                    { name: 'Y', type: 'number', values: [4, 5, 6] },
                    { name: 'Size', type: 'number', values: [10, 20, 30] }
                ]
            };

            const suggestions = suggestDiagrams(ds);
            const scatter = suggestions.find(s => s.type === 'scatter');
            expect(scatter).toBeDefined();
            expect(scatter?.mappings).toHaveLength(3);
            expect(scatter?.mappings[2].role).toBe('size');
        });
    });

    describe('buildSpec', () => {
        it('should build a valid diagram spec', () => {
            const mappings = [{ role: 'category', columnName: 'Cat' }, { role: 'value', columnName: 'Val' }];
            const spec = buildSpec('bar', mappings, 'Test Bar');

            expect(spec.type).toBe('bar');
            expect(spec.title).toBe('Test Bar');
            expect(spec.mappings).toEqual(mappings);
            expect(spec.style).toEqual(DEFAULT_STYLE);
            expect(spec.options).toEqual({});
        });
    });
});
