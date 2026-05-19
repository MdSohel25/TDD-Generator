import ExcelJS from 'exceljs';

interface MergeRange {
  startRow: number;
  endRow: number;
  startCol: number;
  endCol: number;
}

export class MergeGuard {
  capture(worksheet: ExcelJS.Worksheet): MergeRange[] {
    const modelMerges = (worksheet.model?.merges ?? []) as string[];
    return modelMerges.map((range) => this.parseRange(range)).filter((x): x is MergeRange => Boolean(x));
  }

  reapplyWithShift(worksheet: ExcelJS.Worksheet, merges: MergeRange[], insertedAtRow: number, insertedCount: number): void {
    if (insertedCount <= 0) return;

    this.clearAllMerges(worksheet);

    merges.forEach((merge) => {
      const adjusted = this.shiftRange(merge, insertedAtRow, insertedCount);
      worksheet.mergeCells(adjusted.startRow, adjusted.startCol, adjusted.endRow, adjusted.endCol);
    });
  }

  private shiftRange(range: MergeRange, insertedAtRow: number, insertedCount: number): MergeRange {
    if (range.endRow < insertedAtRow) {
      return range;
    }

    if (range.startRow >= insertedAtRow) {
      return {
        ...range,
        startRow: range.startRow + insertedCount,
        endRow: range.endRow + insertedCount,
      };
    }

    return {
      ...range,
      endRow: range.endRow + insertedCount,
    };
  }

  private clearAllMerges(worksheet: ExcelJS.Worksheet): void {
    const merges = (worksheet.model?.merges ?? []) as string[];
    merges.forEach((range) => worksheet.unMergeCells(range));
  }

  private parseRange(range: string): MergeRange | null {
    const [from, to] = range.split(':');
    if (!from || !to) return null;
    const start = this.cellToCoordinates(from);
    const end = this.cellToCoordinates(to);

    return {
      startRow: start.row,
      startCol: start.col,
      endRow: end.row,
      endCol: end.col,
    };
  }

  private cellToCoordinates(cell: string): { row: number; col: number } {
    const match = cell.match(/^([A-Z]+)(\d+)$/i);
    if (!match) {
      throw new Error(`Invalid cell reference: ${cell}`);
    }

    const [, letters, rowRaw] = match;
    let col = 0;
    letters
      .toUpperCase()
      .split('')
      .forEach((char) => {
        col = col * 26 + (char.charCodeAt(0) - 64);
      });

    return { row: Number(rowRaw), col };
  }
}
