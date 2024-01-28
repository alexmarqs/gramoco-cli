import { describe, expect, it, vi } from "vitest";

import { excelService } from "../adapters/excel/excel-service-adapter";
import { instagramService } from "../adapters/instagram/instagram-service-adapter";
import { extractCommentsToExcelUseCase } from "./extractCommentsToExcel";

vi.mock("../utils/config", () => ({
	getConfig: vi.fn().mockImplementation(() => {
		return {
			INSTAGRAM_ACCESS_TOKEN: "mocked_access_token",
			INSTAGRAM_BUSINESS_ACCOUNT_ID: "mocked_business_account_id",
		};
	}),
}));

vi.mock("../adapters/instagram/instagram-service");
vi.mock("../adapters/excel/excel-service");

describe("extractCommentsToExcelUseCase", () => {
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
