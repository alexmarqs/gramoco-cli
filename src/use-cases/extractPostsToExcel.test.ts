import { describe, it, expect, vi } from "vitest";
import { extractPostsToExcelUseCase } from "./extractPostsToExcel";
import { instagramService } from "../adapters/instagram/instagram-service-adapter";
import { excelService } from "../adapters/excel/excel-service-adapter";
import { Config } from "../types";
import { afterEach } from "node:test";

vi.mock("../utils/config", () => ({
	getConfig: vi.fn((key: keyof Config) => {
		if (key === "INSTAGRAM_ACCESS_TOKEN") {
			return "mocked_access_token";
		}
		if (key === "INSTAGRAM_BUSINESS_ACCOUNT_ID") {
			return "mocked_business_account_id";
		}
		return null;
	}),
}));

vi.mock("../adapters/instagram/instagram-service");
vi.mock("../adapters/excel/excel-service");

describe("extractPostsToExcelUseCase", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should extract posts and create an Excel file", async () => {
		mockInstagramService();
		mockExcelService();
		const response = await extractPostsToExcelUseCase(
			{ numberOfPosts: 2 },
			instagramService,
			excelService,
		);

		expect(response.filePath).toBe("path/to/file.xlsx");
		expect(response.numberOfPosts).toBe(2);
		expect(instagramService.getPostsFromBusinessAccount).toHaveBeenCalled();
		expect(excelService.createWorkbook).toHaveBeenCalled();
		expect(excelService.createWorksheet).toHaveBeenCalled();
	});

	it("should throw an error if no posts are found", async () => {
		instagramService.getPostsFromBusinessAccount = vi.fn().mockResolvedValue({
			data: [],
		});

		await expect(
			extractPostsToExcelUseCase(
				{ numberOfPosts: 2 },
				instagramService,
				excelService,
			),
		).rejects.toThrow("No posts found");
	});
});

const mockInstagramService = () => {
	instagramService.getPostsFromBusinessAccount = vi.fn().mockResolvedValue({
		data: [{ id: "1" }, { id: "2" }],
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
		columns: [],
		mergeCells: vi.fn(),
	};
}
