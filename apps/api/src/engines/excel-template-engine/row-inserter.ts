import ExcelJS from 'exceljs';
import { MergeGuard } from './merge-guard';
import { StyleCloner } from './style-cloner';

export class RowInserter {
  constructor(
    private readonly styleCloner = new StyleCloner(),
    private readonly mergeGuard = new MergeGuard(),
  ) {}

  insertStyledRows(
    worksheet: ExcelJS.Worksheet,
    startRow: number,
    styleRow: number,
    dataRows: Array<Array<string | number | boolean | null>>,
    startColumn: number,
  ): number {
    if (dataRows.length === 0) return 0;

    const merges = this.mergeGuard.capture(worksheet);
    worksheet.spliceRows(startRow, 0, ...dataRows.map(() => []));

    dataRows.forEach((rowData, index) => {
      const targetRowNumber = startRow + index;
      this.styleCloner.cloneRowStyle(worksheet, styleRow, targetRowNumber);

      rowData.forEach((value, cellOffset) => {
        const cell = worksheet.getRow(targetRowNumber).getCell(startColumn + cellOffset);
        cell.value = value;
      });
    });

    this.mergeGuard.reapplyWithShift(worksheet, merges, startRow, dataRows.length);
    return dataRows.length;
  }
}
