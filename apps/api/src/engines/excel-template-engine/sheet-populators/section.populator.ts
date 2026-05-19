import ExcelJS from 'exceljs';
import { RowInserter } from '../row-inserter';
import { SectionAnchor } from '../types';

export class SectionPopulator {
  constructor(private readonly rowInserter = new RowInserter()) {}

  populate(
    worksheet: ExcelJS.Worksheet,
    anchor: SectionAnchor,
    rows: Array<Array<string | number | boolean | null>>,
  ): number {
    return this.rowInserter.insertStyledRows(
      worksheet,
      anchor.startRow,
      anchor.styleRow,
      rows,
      anchor.startColumn,
    );
  }
}
