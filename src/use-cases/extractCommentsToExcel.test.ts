import { describe, expect, it, vi, afterEach } from "vitest";

import { extractCommentsToExcelUseCase } from "./extractCommentsToExcel";
import { instagramService } from "../adapters/instagram/instagram-service-adapter";
import { excelService } from "../adapters/excel/excel-service-adapter";

vi.mock("../utils/config", () => ({
	getConfig: vi.fn().mockReturnValue("mocked_access_token"),
}));

vi.mock("../adapters/instagram/instagram-service");
vi.mock("../adapters/excel/excel-service");

describe("extractCommentsToExcelUseCase", () => {
	afterEach(() => {
		vi.resetAllMocks();
	});

	it("should extract comments and create an Excel file", async () => {
		mockInstagramService();
		mockExcelService();

		const response = await extractCommentsToExcelUseCase(
			{ mediaId: "testMediaId" },
			instagramService,
			excelService,
		);

		expect(response).toEqual({
			numberOfComments: 1,
			filePath: "path/to/file.xlsx",
		});

		expect(instagramService.getShortcodeFromMediaId).toHaveBeenCalledWith(
			"mocked_access_token",
			"testMediaId",
		);

		expect(instagramService.getCommentsFromMedia).toHaveBeenCalledWith(
			"mocked_access_token",
			"testMediaId",
			undefined,
		);
	});
});

const mockInstagramService = () => {
	instagramService.getShortcodeFromMediaId = vi.fn().mockResolvedValue({
		shortcode: "mocked_shortcode",
	});

	instagramService.getCommentsFromMedia = vi.fn().mockResolvedValue({
		data: [
			{
				id: "mocked_comment_id",
				username: "mocked_username",
				timestamp: "mocked_timestamp",
				text: "mocked_text",
				like_count: 0,
			},
		],
	});
};

const mockExcelService = () => {
	excelService.createWorkbook = vi.fn();
	excelService.createWorksheet = vi
		.fn()
		.mockImplementation(createMockWorksheet);

	excelService.addColumnsToWorksheet = vi.fn();
	excelService.saveWorkbookToFile = vi
		.fn()
		.mockResolvedValue("path/to/file.xlsx");
};

function createMockWorksheet() {
	return {
		addRow: vi.fn().mockReturnValue({
			getCell: vi.fn().mockReturnValue({
				value: "mocked_value",
			}),
		}),
		getRow: vi.fn().mockReturnValue({
			eachCell: vi.fn(),
		}),
		insertRow: vi.fn().mockReturnValue({
			getCell: vi.fn().mockReturnValue({
				value: "mocked_value",
			}),
		}),
		getCell: vi.fn(),
		columns: [],
		mergeCells: vi.fn(),
	};
}
