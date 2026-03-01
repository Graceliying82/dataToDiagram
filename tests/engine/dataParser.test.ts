import { describe, it, expect } from 'vitest';
import * as XLSX from 'xlsx';
import { parseCSV, parseExcel } from '../../src/engine/dataParser';

describe('dataParser', () => {
    describe('parseCSV', () => {
        it('should parse a simple CSV string', () => {
            const csv = `name,age,date
Alice,30,2023-01-01
Bob,25,2023-02-01`;

            const result = parseCSV(csv);

            expect(result.rowCount).toBe(2);
            expect(result.columns).toHaveLength(3);

            expect(result.columns[0]).toEqual({
                name: 'name',
                type: 'string',
                values: ['Alice', 'Bob']
            });

            expect(result.columns[1]).toEqual({
                name: 'age',
                type: 'number',
                values: [30, 25]
            });

            // The date parsing will create Date objects
            expect(result.columns[2].name).toBe('date');
            expect(result.columns[2].type).toBe('date');
            expect(result.columns[2].values[0]).toBeInstanceOf(Date);
            expect((result.columns[2].values[0] as Date).toISOString().startsWith('2023-01-01')).toBe(true);
        });

        it('should handle empty csv gracefully', () => {
            const result = parseCSV('');
            expect(result.rowCount).toBe(0);
            expect(result.columns).toEqual([]);
        });
    });

    describe('parseExcel', () => {
        it('should parse an excel file from an ArrayBuffer', () => {
            const ws = XLSX.utils.aoa_to_sheet([
                ['name', 'age'],
                ['Alice', 30],
                ['Bob', 25]
            ]);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            const buffer = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });

            const result = parseExcel(buffer as ArrayBuffer);

            expect(result.rowCount).toBe(2);
            expect(result.columns).toHaveLength(2);
            expect(result.columns[0]).toEqual({ name: 'name', type: 'string', values: ['Alice', 'Bob'] });
            expect(result.columns[1]).toEqual({ name: 'age', type: 'number', values: [30, 25] });
        });

        it('should handle empty excel sheet gracefully', () => {
            const ws = XLSX.utils.aoa_to_sheet([]);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            const buffer = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });

            const result = parseExcel(buffer as ArrayBuffer);
            expect(result.rowCount).toBe(0);
            expect(result.columns).toEqual([]);
        });
    });
});

