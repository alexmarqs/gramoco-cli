import path from "path";
import { ExcelService } from "./excel-service";
import ExcelJS from "exceljs";

export const excelService: ExcelService = {
	createWorkbook: () => {
		const workbook = new ExcelJS.Workbook();
		return workbook;
	},
	createWorksheet: (workbook, name) => {
		const worksheet = workbook.addWorksheet(name);
		return worksheet;
	},
	saveWorkbookToFile: async (workbook, fileName) => {
		const filePath = path.join(process.cwd(), fileName);
		await workbook.xlsx.writeFile(filePath);
		return filePath;
	},
	addColumnsToWorksheet: (worksheet, columns) => {
		worksheet.columns = columns;
	},
};
