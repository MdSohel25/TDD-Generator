import { CsnDefinition, JsonArray, JsonValue } from '../../../domain/metadata/models/csn.types';

export interface FieldTransformation {
  targetColumn: string;
  transformationLogic?: string;
  selectPath?: string;
}

export class QueryExtractor {
  extract(definition: CsnDefinition): FieldTransformation[] {
    const columns = definition.query?.SELECT?.columns;
    if (!Array.isArray(columns)) return [];

    return columns
      .map((column, index) => this.parseColumn(column, index))
      .filter((x): x is FieldTransformation => Boolean(x));
  }

  private parseColumn(column: JsonValue, index: number): FieldTransformation | null {
    if (!column || typeof column !== 'object' || Array.isArray(column)) return null;

    const node = column as Record<string, JsonValue>;
    const as = typeof node.as === 'string' ? node.as : undefined;
    const ref = this.refToString(node.ref as JsonArray | undefined);

    const targetColumn = as ?? ref;
    if (!targetColumn) return null;

    return {
      targetColumn,
      transformationLogic: this.extractTransformation(node),
      selectPath: `query.SELECT.columns[${index}]`,
    };
  }

  private extractTransformation(node: Record<string, JsonValue>): string | undefined {
    if (Array.isArray(node.xpr)) {
      return JSON.stringify(node.xpr);
    }
    if (node.func && typeof node.func === 'string') {
      return node.func;
    }
    return undefined;
  }

  private refToString(ref: JsonArray | undefined): string | undefined {
    if (!Array.isArray(ref)) return undefined;
    const values = ref.filter((part): part is string => typeof part === 'string');
    if (values.length === 0) return undefined;
    return values.join('.');
  }
}
