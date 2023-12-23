import { Cell, Row, Worksheet } from "exceljs";

const setHyperlinkCellValue = (
	row: Row,
	cellName: string,
	text: string,
	hyperlink: string,
	tooltip = "",
) => {
	row.getCell(cellName).value = {
		text: text,
		hyperlink: hyperlink,
		tooltip: tooltip,
	};
	row.getCell(cellName).font = {
		color: { argb: "FF0000FF" },
		underline: true,
	};
};

const setFillColor = (cell: Cell, color: string) => {
	cell.fill = {
		type: "pattern",
		pattern: "solid",
		fgColor: { argb: color },
	};
};

const setFontColorAndSize = (cell: Cell, color: string, size?: number) => {
	cell.font = {
		color: { argb: color },
		size: size,
	};
};

const createCustomHeaderRow = (
	worksheet: Worksheet,
	text: string,
	hyperlink: string,
	tooltip = "",
) => {
	const customHeaderRow = worksheet.insertRow(1, []);
	worksheet.mergeCells(1, 1, 1, worksheet.columns.length);
	customHeaderRow.getCell(1).value = {
		text: text,
		hyperlink: hyperlink,
		tooltip: tooltip,
	};
	customHeaderRow.getCell(1).alignment = { horizontal: "center" };
	customHeaderRow.getCell(1).font = { size: 14, underline: true };

	const headerRow = worksheet.getRow(2);
	headerRow.eachCell((cell) => {
		setFillColor(cell, "508D69");
		setFontColorAndSize(cell, "FFFFFFFF", 14);
	});
};

export {
	setHyperlinkCellValue,
	setFillColor,
	setFontColorAndSize,
	createCustomHeaderRow,
};
