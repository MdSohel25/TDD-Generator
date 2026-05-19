import ExcelJS from 'exceljs';

export class StyleCloner {
  cloneRowStyle(worksheet: ExcelJS.Worksheet, sourceRowNumber: number, targetRowNumber: number): void {
    const sourceRow = worksheet.getRow(sourceRowNumber);
    const targetRow = worksheet.getRow(targetRowNumber);

    targetRow.height = sourceRow.height;

    sourceRow.eachCell({ includeEmpty: true }, (sourceCell, colNumber) => {
      const targetCell = targetRow.getCell(colNumber);
      targetCell.style = JSON.parse(JSON.stringify(sourceCell.style));
      targetCell.numFmt = sourceCell.numFmt;
      targetCell.protection = sourceCell.protection;
      targetCell.alignment = sourceCell.alignment ? { ...sourceCell.alignment } : sourceCell.alignment;
      targetCell.border = sourceCell.border ? { ...sourceCell.border } : sourceCell.border;
      targetCell.fill = sourceCell.fill ? { ...sourceCell.fill } : sourceCell.fill;
      targetCell.font = sourceCell.font ? { ...sourceCell.font } : sourceCell.font;
    });
  }
}
