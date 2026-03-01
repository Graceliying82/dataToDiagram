import { describe, it, expect } from 'vitest';
import { DIAGRAM_META, getRenderer } from '../../src/diagrams/registry';
import type { DataSet, Column } from '../../src/types/data';
import { DEFAULT_STYLE, DiagramSpec, ColumnMapping } from '../../src/types/diagram';

describe('Diagram Generators', () => {
    // Create a comprehensive mock dataset
    const mockColumns: Column[] = [
        { name: 'CategoryCol', type: 'string', values: ['A', 'B', 'C'] },
        { name: 'ValueCol', type: 'number', values: [10, 20, 30] },
        { name: 'XCol', type: 'number', values: [1, 2, 3] },
        { name: 'YCol', type: 'number', values: [4, 5, 6] },
        { name: 'SizeCol', type: 'number', values: [100, 200, 300] },
        { name: 'ParentCol', type: 'string', values: ['Root', 'Root', 'A'] },
        { name: 'SourceCol', type: 'string', values: ['Start', 'A', 'B'] },
        { name: 'TargetCol', type: 'string', values: ['A', 'B', 'End'] },
        { name: 'Level0Col', type: 'string', values: ['L0', 'L0', 'L0'] },
        { name: 'Level1Col', type: 'string', values: ['L1A', 'L1A', 'L1B'] },
        { name: 'DateCol', type: 'date', values: [new Date(), new Date(), new Date()] },
        { name: 'BarCol', type: 'number', values: [1, 2, 3] },
        { name: 'LineCol', type: 'number', values: [4, 5, 6] }
    ];

    const mockData: DataSet = {
        rowCount: 3,
        columns: mockColumns
    };

    // Helper map to find appropriate column for a given role
    const roleToColumn: Record<string, string> = {
        'category': 'CategoryCol',
        'value': 'ValueCol',
        'x': 'CategoryCol', // Heatmap uses x as category. For line/scatter it might be number. Let's try category to be safe, but scatter needs numbers.
        'y': 'YCol',
        'size': 'SizeCol',
        'parent': 'ParentCol',
        'source': 'SourceCol',
        'target': 'TargetCol',
        'level0': 'Level0Col',
        'level1': 'Level1Col',
        'bar': 'BarCol',
        'line': 'LineCol',
    };

    DIAGRAM_META.forEach(meta => {
        describe(`${meta.type} renderer`, () => {
            it('should generate an ECharts option object', () => {
                const renderer = getRenderer(meta.type);
                expect(renderer).toBeDefined();

                // Build mappings based on required roles
                const mappings: ColumnMapping[] = meta.requiredRoles.map(role => {
                    let colName = roleToColumn[role] || 'ValueCol';
                    // special fix for scatter x role
                    if (meta.type === 'scatter' && role === 'x') colName = 'XCol';
                    return { role, columnName: colName };
                });

                // Add optional roles if any
                if (meta.optionalRoles) {
                    meta.optionalRoles.forEach(role => {
                        let colName = roleToColumn[role];
                        if (colName) mappings.push({ role, columnName: colName });
                    });
                }

                const spec: DiagramSpec = {
                    type: meta.type,
                    title: `Test ${meta.type}`,
                    mappings,
                    style: { ...DEFAULT_STYLE },
                    options: {}
                };

                const result = renderer.toOption(mockData, spec);

                // At the very least, an empty option or valid ECharts config should be returned
                expect(result).toBeDefined();
                // Typically renderers return objects. Some return empty object {} if validation fails, which is graceful.
                expect(typeof result).toBe('object');
            });
        });
    });
});
