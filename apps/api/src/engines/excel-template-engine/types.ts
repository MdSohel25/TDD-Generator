export interface SectionAnchor {
  sheetName: string;
  startRow: number;
  styleRow: number;
  startColumn: number;
}

export interface SheetRegistry {
  [sectionKey: string]: SectionAnchor;
}

export interface RenderSectionInput {
  sectionKey: string;
  rows: Array<Array<string | number | boolean | null>>;
}

export interface TemplateRenderInput {
  sections: RenderSectionInput[];
}

export interface TemplateRenderOutput {
  buffer: Buffer;
  insertedRows: Record<string, number>;
}
