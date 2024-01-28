import { Worksheet } from "exceljs";
import { describe, expect, it, vi } from "vitest";
import { ExcelService } from "../adapters/excel/excel-service";
import { InstagramService } from "../adapters/instagram/instagram-service";
import { extractPostsToExcelUseCase } from "./extractPostsToExcel";

const mockedInstagramService = vi.mocked<InstagramService>({
	getPostsFromBusinessAccount: vi.fn(),
	getShortcodeFromMediaId: vi.fn(),
	getCommentsFromMedia: vi.fn(),
});

const mockedExcelService = vi.mocked<ExcelService>({
	createWorkbook: vi.fn(),
	createWorksheet: vi.fn(),
	addColumnsToWorksheet: vi.fn(),
	saveWorkbookToFile: vi.fn(),
});

vi.mock("../utils/config", () => ({
	getConfig: vi.fn().mockImplementation(() => {
		return {
			INSTAGRAM_ACCESS_TOKEN: "mocked_access_token",
			INSTAGRAM_BUSINESS_ACCOUNT_ID: "mocked_business_account_id",
		};
	}),
}));

describe("extractPostsToExcelUseCase", () => {
	it("should extract posts and create an Excel file", async () => {
		mockInstagramService();
		mockExcelService();
		const response = await extractPostsToExcelUseCase(
			{ numberOfPosts: 2 },
			mockedInstagramService,
			mockedExcelService,
		);

		expect(response.filePath).toBe("path/to/file.xlsx");
		expect(response.numberOfPosts).toBe(2);
		expect(
			mockedInstagramService.getPostsFromBusinessAccount,
		).toHaveBeenCalled();
		expect(mockedExcelService.createWorkbook).toHaveBeenCalled();
		expect(mockedExcelService.createWorksheet).toHaveBeenCalled();
	});

	it("should throw an error if no posts are found", async () => {
		mockedInstagramService.getPostsFromBusinessAccount.mockResolvedValue({
			data: [],
		});

		await expect(
			extractPostsToExcelUseCase(
				{ numberOfPosts: 2 },
				mockedInstagramService,
				mockedExcelService,
			),
		).rejects.toThrow("No posts found");
	});
});

const mockInstagramService = () => {
	mockedInstagramService.getPostsFromBusinessAccount.mockResolvedValue({
		data: [
			{
				id: "mocked_post_id",
				permalink: "mocked_permalink",
				caption: "mocked_caption",
				timestamp: 0,
				like_count: 0,
				comments_count: 0,
			},
			{
				id: "mocked_post_id_2",
				permalink: "mocked_permalink_2",
				caption: "mocked_caption_2",
				timestamp: 0,
				like_count: 0,
				comments_count: 0,
			},
		],
	});
};

const mockExcelService = () => {
	mockedExcelService.createWorksheet.mockImplementation(createMockWorksheet);
	mockedExcelService.saveWorkbookToFile.mockResolvedValue("path/to/file.xlsx");
};

const createMockWorksheet = () => {
	return {
		addRow: vi.fn().mockReturnValue({
			eachCell: vi.fn(),
			getCell: vi.fn().mockReturnValue({
				value: {},
			}),
		}),
		insertRow: vi.fn().mockReturnValue({
			getCell: vi.fn().mockReturnValue({
				value: {},
			}),
		}),
		getCell: vi.fn().mockReturnValue({
			value: {},
		}),
		columns: [],
		getRow: vi.fn().mockReturnValue({
			eachCell: vi.fn(),
		}),
		mergeCells: vi.fn(),
	} as unknown as Worksheet;
};
