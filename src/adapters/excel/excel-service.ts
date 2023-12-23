import type { Column, Workbook, Worksheet } from "exceljs";

export interface ExcelService {
	createWorkbook(): Workbook;
	createWorksheet(workbook: Workbook, name: string): Worksheet;
	addColumnsToWorksheet(worksheet: Worksheet, columns: Partial<Column>[]): void;
	saveWorkbookToFile(workbook: Workbook, fileName: string): Promise<string>;
}
