import { ParserOutput } from '../engines/csn-parser/types';

export interface NormalizedField {
  entityName: string;
  sourceTable: string;
  sourceColumn: string;
  targetColumn: string;
  datatype: string;
  length?: number;
  isKey: boolean;
  description?: string;
  transformationLogic?: string;
}

export class MetadataNormalizerService {
  normalize(parserOutput: ParserOutput): NormalizedField[] {
    return parserOutput.entities.flatMap((entity) =>
      entity.fields.map((field) => ({
        entityName: entity.entityName,
        sourceTable: entity.sourceTables[0] ?? entity.entityName,
        sourceColumn: field.sourceColumn ?? field.fieldName,
        targetColumn: field.targetColumn,
        datatype: field.datatype ?? 'UNKNOWN',
        length: field.length,
        isKey: field.isKey,
        description: field.description,
        transformationLogic: field.transformationLogic,
      })),
    );
  }
}
