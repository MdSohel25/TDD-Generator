import { ParserError } from '../../shared/errors/parser.error';
import { SectionPopulator } from './sheet-populators/section.populator';
import { TemplateRenderInput, TemplateRenderOutput, SheetRegistry } from './types';
import { WorkbookLoader } from './workbook-loader';

export class ExcelTemplateEngine {
  constructor(
    private readonly workbookLoader = new WorkbookLoader(),
    private readonly sectionPopulator = new SectionPopulator(),
  ) {}

  async renderFromFile(
    templatePath: string,
    registry: SheetRegistry,
    input: TemplateRenderInput,
  ): Promise<TemplateRenderOutput> {
    const workbook = await this.workbookLoader.fromFile(templatePath);
    return this.renderWorkbook(workbook, registry, input);
  }

  async renderFromBuffer(
    templateBuffer: Buffer,
    registry: SheetRegistry,
    input: TemplateRenderInput,
  ): Promise<TemplateRenderOutput> {
    const workbook = await this.workbookLoader.fromBuffer(templateBuffer);
    return this.renderWorkbook(workbook, registry, input);
  }

  private async renderWorkbook(
    workbook: import('exceljs').Workbook,
    registry: SheetRegistry,
    input: TemplateRenderInput,
  ): Promise<TemplateRenderOutput> {
    const insertedRows: Record<string, number> = {};

    for (const section of input.sections) {
      const anchor = registry[section.sectionKey];
      if (!anchor) {
        throw new ParserError(`Missing section registry for key: ${section.sectionKey}`);
      }

      const worksheet = workbook.getWorksheet(anchor.sheetName);
      if (!worksheet) {
        throw new ParserError(`Missing worksheet: ${anchor.sheetName}`);
      }

      insertedRows[section.sectionKey] = this.sectionPopulator.populate(worksheet, anchor, section.rows);
    }

    return {
      buffer: await this.workbookLoader.toBuffer(workbook),
      insertedRows,
    };
  }
}
