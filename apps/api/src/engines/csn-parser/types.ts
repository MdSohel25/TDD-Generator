import { JsonValue } from '../../domain/metadata/models/csn.types';

export interface ParserFieldMetadata {
  entityName: string;
  fieldName: string;
  sourceColumn?: string;
  targetColumn: string;
  datatype?: string;
  length?: number;
  precision?: number;
  scale?: number;
  isKey: boolean;
  nullable: boolean;
  label?: string;
  description?: string;
  semanticTags: string[];
  transformationLogic?: string;
  selectPath?: string;
}

export interface ParserEntityMetadata {
  entityName: string;
  sourceTables: string[];
  targetTable: string;
  fields: ParserFieldMetadata[];
  annotations: Record<string, JsonValue>;
}

export interface ParserOutput {
  entities: ParserEntityMetadata[];
  warnings: string[];
}

export interface TraversalContext {
  entityName: string;
  path: string;
}
