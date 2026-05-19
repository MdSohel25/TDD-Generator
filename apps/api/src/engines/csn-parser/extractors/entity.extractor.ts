import { CsnDefinition, JsonValue } from '../../../domain/metadata/models/csn.types';

export class EntityExtractor {
  extractSourceTables(definition: CsnDefinition): string[] {
    const from = definition.query?.SELECT?.from;
    if (!from) return [];

    const tableSet = new Set<string>();
    this.collectRefs(from, tableSet);
    return [...tableSet];
  }

  extractAnnotations(definition: CsnDefinition): Record<string, JsonValue> {
    const annotations: Record<string, JsonValue> = {};
    for (const [key, value] of Object.entries(definition)) {
      if (key.startsWith('@') && value !== undefined) annotations[key] = value;
    }
    return annotations;
  }

  private collectRefs(value: JsonValue, sink: Set<string>): void {
    if (Array.isArray(value)) {
      value.forEach((item) => this.collectRefs(item, sink));
      return;
    }

    if (!value || typeof value !== 'object') {
      return;
    }

    const unknownValue = value as Record<string, JsonValue>;
    const ref = unknownValue.ref;
    if (Array.isArray(ref) && ref.length > 0 && typeof ref[0] === 'string') {
      sink.add(ref[0]);
    }

    Object.values(unknownValue).forEach((entry) => { if (entry !== undefined) this.collectRefs(entry, sink); });
  }
}
