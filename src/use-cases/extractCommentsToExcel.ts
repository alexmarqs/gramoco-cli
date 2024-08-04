import { InstagramService } from "../adapters/instagram/instagram-service";

import {
	createCustomHeaderRow,
	setHyperlinkCellValue,
} from "../adapters/excel/excel-layout-utils";
import { ExcelService } from "../adapters/excel/excel-service";
import { MediaComments } from "../types";
import { getConfig } from "../utils/config";
import { Worksheet } from "exceljs";

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
		const { INSTAGRAM_ACCESS_TOKEN: accessToken } = getConfig();

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
			{ header: "Parent Comment", key: "parent", width: 20 },
			{ header: "Source", key: "source", width: 20 },
		]);

		// Add custom header
		createCustomHeaderRow(
			worksheet,
			"Powered by Gramoco",
			"https://github.com/alexmarqs/gramoco-cli",
			"Open source code",
		);

		// Add comments
		let index = 0;
		for (const comment of comments) {
			addRowToWorksheet(worksheet, index, comment, shortcode);

			if (comment.replies?.data) {
				for (const reply of comment.replies.data) {
					const parentIndex = index;
					index++;
					addRowToWorksheet(worksheet, index, reply, shortcode, parentIndex);
				}
			}

			index++;
		}

		// Save Excel file
		const filePath = await excelService.saveWorkbookToFile(
			workbook,
			`comments-${shortcode}-${new Date().getTime()}.xlsx`,
		);

		const totalComments =
			comments.length +
			comments.reduce(
				(acc, comment) => acc + (comment.replies?.data?.length || 0),
				0,
			);

		// Return response
		return { numberOfComments: totalComments, filePath: filePath };
	};

const addRowToWorksheet = (
	worksheet: Worksheet,
	index: number,
	comment: MediaComments,
	shortcode: string,
	parent?: number,
) => {
	const row = worksheet.addRow({
		seq: index + 1,
		profile: "",
		date: new Date(comment.timestamp).toLocaleString(),
		likes: comment.like_count,
		comment: comment.text,
		parent: parent === undefined ? parent : parent + 1,
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
		parent === undefined
			? `https://www.instagram.com/p/${shortcode}/c/${comment.id}`
			: `https://www.instagram.com/p/${shortcode}/c/${comment.parent_id}/r/${comment.id}`,
		"Open comment",
	);
};
