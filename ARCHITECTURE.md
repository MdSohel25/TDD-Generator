# Datasphere TDD Generator — Enterprise Architecture Blueprint

## 1) Full Enterprise Folder Structure

```text
Datasphere-TDD-Generator/
├─ apps/
│  ├─ web/                                 # React + Vite + TS UI
│  │  ├─ public/
│  │  ├─ src/
│  │  │  ├─ app/
│  │  │  │  ├─ router/
│  │  │  │  ├─ providers/                 # theme, query, auth, toasts
│  │  │  │  └─ layouts/
│  │  │  ├─ features/
│  │  │  │  ├─ upload/
│  │  │  │  │  ├─ components/
│  │  │  │  │  ├─ hooks/
│  │  │  │  │  ├─ services/
│  │  │  │  │  ├─ schemas/
│  │  │  │  │  └─ types/
│  │  │  │  ├─ jobs/
│  │  │  │  ├─ templates/
│  │  │  │  └─ previews/
│  │  │  ├─ shared/
│  │  │  │  ├─ components/ui/             # shadcn components
│  │  │  │  ├─ components/charts/
│  │  │  │  ├─ lib/                       # utilities, formatters
│  │  │  │  ├─ hooks/
│  │  │  │  ├─ api/                       # axios/fetch wrappers
│  │  │  │  ├─ constants/
│  │  │  │  └─ types/
│  │  │  ├─ styles/
│  │  │  ├─ assets/
│  │  │  └─ main.tsx
│  │  ├─ tailwind.config.ts
│  │  ├─ vite.config.ts
│  │  └─ package.json
│  │
│  └─ api/                                 # Node + Express + TS backend
│     ├─ src/
│     │  ├─ server.ts
│     │  ├─ app.ts
│     │  ├─ config/
│     │  │  ├─ env.ts
│     │  │  ├─ logger.ts
│     │  │  └─ constants.ts
│     │  ├─ bootstrap/
│     │  │  ├─ middlewares.ts
│     │  │  ├─ routes.ts
│     │  │  └─ error-handlers.ts
│     │  ├─ modules/
│     │  │  ├─ upload/
│     │  │  │  ├─ upload.controller.ts
│     │  │  │  ├─ upload.service.ts
│     │  │  │  ├─ upload.routes.ts
│     │  │  │  ├─ upload.validator.ts
│     │  │  │  └─ upload.types.ts
│     │  │  ├─ parser/
│     │  │  │  ├─ parser.controller.ts
│     │  │  │  ├─ parser.service.ts
│     │  │  │  ├─ parser.routes.ts
│     │  │  │  └─ parser.types.ts
│     │  │  ├─ generation/
│     │  │  │  ├─ generation.controller.ts
│     │  │  │  ├─ generation.service.ts
│     │  │  │  ├─ generation.routes.ts
│     │  │  │  └─ generation.types.ts
│     │  │  └─ template/
│     │  │     ├─ template.controller.ts
│     │  │     ├─ template.service.ts
│     │  │     └─ template.routes.ts
│     │  ├─ domain/
│     │  │  ├─ metadata/
│     │  │  │  ├─ models/
│     │  │  │  ├─ normalizers/
│     │  │  │  ├─ mappers/
│     │  │  │  └─ validators/
│     │  │  └─ tdd/
│     │  │     ├─ models/
│     │  │     └─ policies/
│     │  ├─ engines/
│     │  │  ├─ csn-parser/
│     │  │  │  ├─ index.ts
│     │  │  │  ├─ extractors/
│     │  │  │  ├─ traversers/
│     │  │  │  └─ adapters/
│     │  │  ├─ metadata-normalizer/
│     │  │  │  ├─ index.ts
│     │  │  │  ├─ rules/
│     │  │  │  └─ transformers/
│     │  │  ├─ mapping-engine/
│     │  │  │  ├─ index.ts
│     │  │  │  ├─ strategies/
│     │  │  │  └─ resolvers/
│     │  │  └─ excel-template-engine/
│     │  │     ├─ index.ts
│     │  │     ├─ workbook-loader.ts
│     │  │     ├─ row-inserter.ts
│     │  │     ├─ style-cloner.ts
│     │  │     ├─ merge-guard.ts
│     │  │     └─ sheet-populators/
│     │  ├─ infra/
│     │  │  ├─ storage/
│     │  │  │  ├─ local/
│     │  │  │  └─ s3/
│     │  │  ├─ queue/                      # BullMQ (optional async)
│     │  │  ├─ cache/
│     │  │  └─ telemetry/
│     │  ├─ shared/
│     │  │  ├─ middleware/
│     │  │  ├─ errors/
│     │  │  ├─ dto/
│     │  │  ├─ types/
│     │  │  └─ utils/
│     │  └─ tests/
│     │     ├─ unit/
│     │     ├─ integration/
│     │     └─ fixtures/
│     └─ package.json
│
├─ packages/
│  ├─ contracts/                           # shared DTO/types (frontend/backend)
│  ├─ eslint-config/
│  ├─ tsconfig/
│  └─ ui/                                  # optional shared design system wrappers
│
├─ templates/
│  ├─ tdd-master-template.xlsx
│  └─ mappings/
│     ├─ section-map.v1.json
│     └─ sheet-registry.v1.json
│
├─ docs/
│  ├─ architecture/
│  ├─ api/
│  ├─ parser/
│  └─ runbooks/
│
├─ .github/
│  ├─ workflows/
│  └─ pull_request_template.md
├─ turbo.json
├─ pnpm-workspace.yaml
└─ README.md
```

## 2) Backend Architecture

### Layered + Modular Design
1. **Transport Layer**: Express routes/controllers only handle HTTP concerns.
2. **Application Layer**: Services orchestrate parser → normalizer → mapper → excel engine.
3. **Domain Layer**: Strong metadata models, rules, and mapping policies.
4. **Infrastructure Layer**: File storage, queueing, telemetry, and external adapters.

### Request Flow
`POST /api/v1/tdd/generate`
→ Upload middleware (Multer + validation)
→ CSN parser engine
→ Metadata normalizer
→ Mapping engine
→ Excel template engine
→ file storage + download token
→ response with job/file metadata.

### Why this design
- Keeps parser/excel logic independent from HTTP.
- Easy to test each engine independently.
- Future extensibility for async jobs and multiple template versions.

## 3) Frontend Architecture

### Feature-first React Structure
- **Feature modules** (`upload`, `jobs`, `templates`, `previews`) own UI + hooks + API calls.
- **Shared layer** holds reusable UI atoms, utilities, and app-level hooks.
- **Provider composition** in `app/providers` (theme, query client, toasts).

### UX Patterns
- Drag-and-drop upload zone with progressive states.
- Job progress timeline (uploaded → parsed → mapped → generated).
- Success/error toasts and retriable failures.
- Dark/light theming with SAP/Fiori-inspired color tokens.

### Why this design
- Avoids monolithic component trees.
- Supports enterprise UX consistency and maintainability.

## 4) Parser Module Structure

### Parser Pipeline
1. **File decoder**: validates JSON shape and size.
2. **CSN traverser**: walks `definitions`, `elements`, `query.SELECT` recursively.
3. **Extractors**:
   - entity extractor
   - column extractor
   - relationship/source-target extractor
   - annotation/semantic extractor
   - transformation/query extractor
4. **Raw metadata bundle**: intermediate structured output for normalization.

### Critical parser behavior
- Dynamic traversal (no entity-name hardcoding).
- Tolerant optional-node handling.
- Version-aware adaptors for CSN variants.

## 5) Excel Generation Architecture (ExcelJS)

### Engine Components
- **WorkbookLoader**: loads template workbook unchanged.
- **SheetRegistry**: maps metadata section type → sheet/anchor range.
- **RowInserter**: inserts rows safely in target sections.
- **StyleCloner**: clones style from template reference row to inserted rows.
- **MergeGuard**: preserves/repairs merged cell ranges after insertion.
- **FormulaRetainer**: ensures formulas are copied or adjusted as needed.
- **SheetPopulators**: section-specific population logic (field mapping, table info, transformations).

### Generation Strategy
- Never rebuild workbook from scratch.
- Use anchor rows defined in mapping config (`templates/mappings/*.json`).
- Apply dynamic data only in allowed ranges.
- Freeze all non-data areas from mutation.

## 6) Metadata Normalization Strategy

### Canonical Contract
Use normalized objects so mapping logic is template-agnostic:

```ts
interface NormalizedFieldMapping {
  entityName: string;
  sourceTable?: string;
  sourceColumn?: string;
  targetTable?: string;
  targetColumn: string;
  datatype?: string;
  length?: number;
  precision?: number;
  scale?: number;
  isKey: boolean;
  nullable?: boolean;
  label?: string;
  description?: string;
  semanticTags: string[];
  transformationLogic?: string;
  selectPath?: string;
}
```

### Normalization Principles
- Standardize datatype names (`cds.String` → `STRING`, etc.).
- Flatten nested refs into deterministic dot paths.
- Preserve raw references for traceability (`sourcePath`, `queryPath`).
- Attach confidence flags for inferred mappings.

## 7) Upload API Structure

### Endpoints (v1)
- `POST /api/v1/uploads/csn`
  - multipart upload (JSON/CSN)
  - returns `uploadId`, file checksum, basic metadata
- `POST /api/v1/tdd/generate`
  - body: `uploadId`, `templateId`, optional options
  - returns `jobId`
- `GET /api/v1/jobs/:jobId`
  - returns status and stage logs
- `GET /api/v1/tdd/download/:jobId`
  - secure one-time or short-lived link

### Security & Validation
- Helmet, CORS allowlist, rate limiting.
- MIME/type/size validation + checksum.
- JSON schema validation for CSN minimum structure.
- Sanitized file names and isolated upload directory.

## 8) Reusable Service Layer Design

### Service Contracts
- `UploadService`: validate/store/retrieve upload artifacts.
- `ParserService`: parse upload into raw metadata.
- `NormalizationService`: produce canonical metadata contract.
- `MappingService`: resolve template section mappings.
- `ExcelGenerationService`: inject metadata into workbook template.
- `JobService`: track lifecycle and status events.
- `AuditService`: capture operational trail (who/when/template/version).

### Cross-cutting standards
- Typed result envelopes (`success`, `data`, `errors`, `warnings`).
- Central error taxonomy (`ValidationError`, `ParserError`, `TemplateError`, `GenerationError`).
- Structured logging with correlation IDs.
- Deterministic test fixtures for CSN variants.

---

## Architectural Decisions Summary (Before Implementation)

1. **Template-first Excel generation** protects formatting fidelity and enterprise quality.
2. **Canonical normalization contract** decouples parser variability from output template changes.
3. **Config-driven mapping registry** avoids hardcoded mappings and enables future CSN compatibility.
4. **Engine-based backend modules** keep concerns isolated and highly testable.
5. **Feature-first frontend architecture** supports premium UX without creating tight coupling.
6. **Job-oriented API workflow** prepares the platform for large-file processing and async scaling.
