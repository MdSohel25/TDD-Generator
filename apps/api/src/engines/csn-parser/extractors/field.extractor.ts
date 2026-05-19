import { CsnDefinition, CsnElement, JsonValue } from '../../../domain/metadata/models/csn.types';
import { ParserFieldMetadata } from '../types';

export class FieldExtractor {
  extract(definition: CsnDefinition, entityName: string): ParserFieldMetadata[] {
    const elements = definition.elements ?? {};

    return Object.entries(elements).map(([fieldName, element]) =>
      this.toFieldMetadata(entityName, fieldName, element),
    );
  }

  private toFieldMetadata(entityName: string, fieldName: string, element: CsnElement): ParserFieldMetadata {
    const annotations = this.annotations(element as Record<string, JsonValue>);
    const label = this.stringOrUndefined(annotations['@title'] ?? annotations['@Common.Label']);
    const description = this.stringOrUndefined(annotations['@description'] ?? annotations['@EndUserText.Label']);

    return {
      entityName,
      fieldName,
      sourceColumn: fieldName,
      targetColumn: fieldName,
      datatype: element.type,
      length: element.length,
      precision: element.precision,
      scale: element.scale,
      isKey: Boolean(element.key),
      nullable: !Boolean(element.notNull),
      label,
      description,
      semanticTags: Object.keys(annotations),
    };
  }

  private annotations(element: Record<string, JsonValue>): Record<string, JsonValue> {
    return Object.fromEntries(Object.entries(element).filter(([key]) => key.startsWith('@')));
  }

  private stringOrUndefined(value: JsonValue | undefined): string | undefined {
    return typeof value === 'string' ? value : undefined;
  }
}
