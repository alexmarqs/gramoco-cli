import { InstagramService } from "../adapters/instagram/instagram-service";

import { getConfig } from "../utils/config";
import { ExcelService } from "../adapters/excel/excel-service";
import { MediaComments } from "../types";
import {
	createCustomHeaderRow,
	setHyperlinkCellValue,
} from "../adapters/excel/excel-layout-utils";

export type ExtractCommentsToExcelUseCaseRequest = {
	mediaId: string;
};

export type ExtractCommentsToExcelUseCaseResponse = {
	numberOfComments: number;
	filePath: string;
};

export type ExtractCommentsToExcelUseCase = (
	request: ExtractCommentsToExcelUseCaseRequest,
	instagramService: InstagramService,
	excelService: ExcelService,
) => Promise<ExtractCommentsToExcelUseCaseResponse>;

export const extractCommentsToExcelUseCase: ExtractCommentsToExcelUseCase =
	async (request, instagramService, excelService) => {
		const { mediaId } = request;
		const accessToken = getConfig("INSTAGRAM_ACCESS_TOKEN");

		// Fetch shortcode from mediaId
		const { shortcode } = await instagramService.getShortcodeFromMediaId(
			accessToken,
			mediaId,
		);

		// Fetch comments from media
		const comments: MediaComments[] = [];
		let nextCursor: string | undefined;

		do {
			const response = await instagramService.getCommentsFromMedia(
				accessToken,
				mediaId,
				nextCursor,
			);

			response?.data?.length && comments.push(...response.data);
			nextCursor = response?.paging?.cursors?.after;
		} while (nextCursor);

		if (!comments.length) {
			throw new Error("No comments found");
		}

		// Create Excel file
		const workbook = excelService.createWorkbook();
		const worksheet = excelService.createWorksheet(workbook, "Comments");

		excelService.addColumnsToWorksheet(worksheet, [
			{ header: "", key: "seq", width: 5 },
			{ header: "Profile", key: "profile", width: 20 },
			{ header: "Date", key: "date", width: 20 },
			{ header: "Likes", key: "likes", width: 10 },
			{ header: "Comment", key: "comment", width: 40 },
			{ header: "Source", key: "source", width: 20 },
		]);

		// Add custom header
		createCustomHeaderRow(
			worksheet,
			"Powered by Gramoco",
			"https://github.com/alexmarqs/gramoco-cli-app/",
			"Open source code",
		);

		// Add comments
		// biome-ignore lint/complexity/noForEach: <explanation>
		comments.forEach((comment, index) => {
			const row = worksheet.addRow({
				seq: index + 1,
				profile: "",
				date: new Date(comment.timestamp).toLocaleString(),
				likes: comment.like_count,
				comment: comment.text,
				source: "",
			});

			setHyperlinkCellValue(
				row,
				"profile",
				comment.username,
				`https://www.instagram.com/${comment.username}`,
				"Open profile",
			);

			setHyperlinkCellValue(
				row,
				"source",
				"View comment",
				`https://www.instagram.com/p/${shortcode}/c/${comment.id}`,
				"Open comment",
			);
		});

		// Save Excel file
		const filePath = await excelService.saveWorkbookToFile(
			workbook,
			`comments-${shortcode}-${new Date().getTime()}.xlsx`,
		);

		// Return response
		return { numberOfComments: comments.length, filePath: filePath };
	};
