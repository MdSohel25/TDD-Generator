import ExcelJS from 'exceljs';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs/promises';
import { CsnParserEngine } from '../engines/csn-parser/index';
import { ExcelTemplateEngine } from '../engines/excel-template-engine/index';
import { defaultRegistry } from '../templates/default-registry';
import { MetadataNormalizerService } from './metadata-normalizer.service';

export class TddGenerationService {
  private parser = new CsnParserEngine();
  private normalizer = new MetadataNormalizerService();
  private renderer = new ExcelTemplateEngine();

  async generate(fileBuffer: Buffer): Promise<{ jobId: string; filePath: string }> {
    const csn = JSON.parse(fileBuffer.toString('utf-8')) as unknown;
    const parsed = this.parser.parse(csn);
    const normalized = this.normalizer.normalize(parsed);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('TDD');
    sheet.addRow(['Entity', 'Source Table', 'Source Column', 'Target Column', 'Datatype', 'Key', 'Description', 'Transformation']);
    const styleRow = sheet.addRow(['', '', '', '', '', '', '', '']);
    styleRow.eachCell((c) => {
      c.border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' }, bottom: { style: 'thin' } };
    });
    while (sheet.rowCount < 5) sheet.addRow([]);

    const templateBuffer = Buffer.from(await workbook.xlsx.writeBuffer() as ArrayBuffer);
    const sections = [{
      sectionKey: 'fieldMappings',
      rows: normalized.map((n) => [n.entityName, n.sourceTable, n.sourceColumn, n.targetColumn, n.datatype, n.isKey ? 'Y' : 'N', n.description ?? '', n.transformationLogic ?? ''])
    }];
    const rendered = await this.renderer.renderFromBuffer(templateBuffer, defaultRegistry, { sections });

    const jobId = randomUUID();
    const outDir = path.resolve('apps/api/data/generated');
    await fs.mkdir(outDir, { recursive: true });
    const filePath = path.join(outDir, `${jobId}.xlsx`);
    await fs.writeFile(filePath, rendered.buffer);
    return { jobId, filePath };
  }
}
