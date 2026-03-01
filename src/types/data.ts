export interface Column {
  name: string;
  type: 'number' | 'string' | 'date';
  values: (string | number | Date | null)[];
}

export interface DataSet {
  columns: Column[];
  rowCount: number;
}

export interface ParsedFile {
  name: string;
  data: DataSet;
}
