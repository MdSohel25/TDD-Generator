import ExcelJS from 'exceljs';

export class WorkbookLoader {
  async fromFile(templatePath: string): Promise<ExcelJS.Workbook> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(templatePath);
    return workbook;
  }

  async fromBuffer(buffer: Buffer | Uint8Array): Promise<ExcelJS.Workbook> {
    const workbook = new ExcelJS.Workbook();
    const asBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
    await workbook.xlsx.load(asBuffer as any);
    return workbook;
  }

  async toBuffer(workbook: ExcelJS.Workbook): Promise<Buffer> {
    const output = await workbook.xlsx.writeBuffer();
    return Buffer.isBuffer(output) ? output : Buffer.from(output as ArrayBuffer);
  }
}
