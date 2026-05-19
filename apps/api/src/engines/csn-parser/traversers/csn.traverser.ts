import { CsnDefinition, CsnRoot, JsonValue } from '../../../domain/metadata/models/csn.types';
import { TraversalContext } from '../types';

export type DefinitionVisitor = (definition: CsnDefinition, context: TraversalContext) => void;

export class CsnTraverser {
  traverseDefinitions(root: CsnRoot, visitor: DefinitionVisitor): void {
    const definitions = root.definitions ?? {};

    Object.entries(definitions).forEach(([entityName, definition]) => {
      visitor(definition, { entityName, path: `definitions.${entityName}` });
    });
  }

  readAnnotations(node: Record<string, JsonValue> | undefined): Record<string, JsonValue> {
    if (!node) {
      return {};
    }

    const entries = Object.entries(node).filter(([key]) => key.startsWith('@'));
    return Object.fromEntries(entries);
  }
}
