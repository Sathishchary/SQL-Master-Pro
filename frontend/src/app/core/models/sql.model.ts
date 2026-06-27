export interface SqlExecutionResponse {
  executionId?: number;
  success: boolean;
  query: string;
  columns?: string[];
  rows?: Record<string, unknown>[];
  rowCount: number;
  affectedRows?: number;
  executionTimeMs: number;
  error?: string;
  databaseName?: string;
  executedAt: string;
}

export interface SqlExecution {
  id: number;
  query: string;
  databaseName?: string;
  success: boolean;
  rowCount: number;
  executionTimeMs: number;
  errorMessage?: string;
  saved: boolean;
  queryName?: string;
  favorite: boolean;
  executedAt: string;
}

export interface SqlDatabase {
  id: string;
  name: string;
  description?: string;
}

export interface SampleQuery {
  name: string;
  description: string;
  query: string;
}

export interface CustomTableResponse {
  schemaName: string;
  tableName: string;
  columns: string[];
  rowCount: number;
}
