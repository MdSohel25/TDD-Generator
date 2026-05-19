import { CsnRoot } from '../../domain/metadata/models/csn.types';
import { ParserError } from '../../shared/errors/parser.error';
import { DefaultCsnVersionAdapter } from './adapters/csn-version.adapter';
import { EntityExtractor } from './extractors/entity.extractor';
import { FieldExtractor } from './extractors/field.extractor';
import { QueryExtractor } from './extractors/query.extractor';
import { CsnTraverser } from './traversers/csn.traverser';
import { ParserEntityMetadata, ParserOutput } from './types';

export class CsnParserEngine {
  private readonly adapter = new DefaultCsnVersionAdapter();
  private readonly traverser = new CsnTraverser();
  private readonly entityExtractor = new EntityExtractor();
  private readonly fieldExtractor = new FieldExtractor();
  private readonly queryExtractor = new QueryExtractor();

  parse(input: unknown): ParserOutput {
    const root = this.validateInput(input);
    const normalizedRoot = this.adapter.normalize(root);

    const entities: ParserEntityMetadata[] = [];
    const warnings: string[] = [];

    this.traverser.traverseDefinitions(normalizedRoot, (definition, context) => {
      if (!definition || typeof definition !== 'object') {
        warnings.push(`Skipped invalid definition at ${context.path}`);
        return;
      }

      const fields = this.fieldExtractor.extract(definition, context.entityName);
      const queryMetadata = this.queryExtractor.extract(definition);
      const byTarget = new Map(queryMetadata.map((q) => [q.targetColumn, q]));

      const enrichedFields = fields.map((field) => {
        const queryInfo = byTarget.get(field.targetColumn);
        return {
          ...field,
          transformationLogic: queryInfo?.transformationLogic,
          selectPath: queryInfo?.selectPath,
        };
      });

      entities.push({
        entityName: context.entityName,
        sourceTables: this.entityExtractor.extractSourceTables(definition),
        targetTable: context.entityName,
        fields: enrichedFields,
        annotations: this.entityExtractor.extractAnnotations(definition),
      });
    });

    return { entities, warnings };
  }

  private validateInput(input: unknown): CsnRoot {
    if (!input || typeof input !== 'object' || Array.isArray(input)) {
      throw new ParserError('Invalid CSN payload: expected object root.');
    }

    const root = input as CsnRoot;
    if (!root.definitions || typeof root.definitions !== 'object') {
      throw new ParserError('Invalid CSN payload: missing definitions node.');
    }

    return root;
  }
}
