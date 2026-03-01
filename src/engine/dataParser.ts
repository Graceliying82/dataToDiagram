import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import type { Column, DataSet } from '../types/data';

function inferColumnType(values: unknown[]): Column['type'] {
  let dateCount = 0;
  let numberCount = 0;
  let total = 0;

  for (const v of values) {
    if (v == null || v === '') continue;
    total++;
    const s = String(v).trim();
    if (!isNaN(Number(s))) {
      numberCount++;
    } else if (!isNaN(Date.parse(s)) && s.length > 4) {
      dateCount++;
    }
  }

  if (total === 0) return 'string';
  if (numberCount / total > 0.8) return 'number';
  if (dateCount / total > 0.8) return 'date';
  return 'string';
}

function buildColumns(headers: string[], rows: unknown[][]): Column[] {
  return headers.map((name, i) => {
    const rawValues = rows.map(row => row[i]);
    const type = inferColumnType(rawValues);
    const values = rawValues.map(v => {
      if (v == null || v === '') return null;
      if (type === 'number') return Number(v);
      if (type === 'date') return new Date(String(v));
      return String(v);
    });
    return { name, type, values };
  });
}

export function parseCSV(text: string): DataSet {
  const result = Papa.parse(text, { header: false, skipEmptyLines: true });
  const rows = result.data as string[][];
  if (rows.length === 0) return { columns: [], rowCount: 0 };

  const headers = rows[0];
  const dataRows = rows.slice(1);
  const columns = buildColumns(headers, dataRows);
  return { columns, rowCount: dataRows.length };
}

export function parseExcel(buffer: ArrayBuffer): DataSet {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1 });
  if (rows.length === 0) return { columns: [], rowCount: 0 };

  const headers = (rows[0] as unknown[]).map(String);
  const dataRows = rows.slice(1) as unknown[][];
  const columns = buildColumns(headers, dataRows);
  return { columns, rowCount: dataRows.length };
}

export async function parseFile(file: File): Promise<DataSet> {
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext === 'csv') {
    const text = await file.text();
    return parseCSV(text);
  }
  if (ext === 'xlsx' || ext === 'xls') {
    const buffer = await file.arrayBuffer();
    return parseExcel(buffer);
  }
  throw new Error(`Unsupported file type: .${ext}`);
}
