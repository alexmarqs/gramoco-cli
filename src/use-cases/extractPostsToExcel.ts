import {
	createCustomHeaderRow,
	setHyperlinkCellValue,
} from "../adapters/excel/excel-layout-utils";
import { ExcelService } from "../adapters/excel/excel-service";
import { InstagramService } from "../adapters/instagram/instagram-service";
import { MediaPosts } from "../types";
import { getConfig } from "../utils/config";

type ExtractPostsToExcelUseCaseResponse = {
	filePath: string;
	numberOfPosts: number;
};

type ExtractPostsToExcelUseCaseRequest = {
	numberOfPosts: number | undefined;
};

type ExtractPostsToExcelUseCase = (
	request: ExtractPostsToExcelUseCaseRequest,
	instagramService: InstagramService,
	excelService: ExcelService,
) => Promise<ExtractPostsToExcelUseCaseResponse>;

export const extractPostsToExcelUseCase: ExtractPostsToExcelUseCase = async (
	request,
	instagramService,
	excelService,
) => {
	const { numberOfPosts } = request;
	const {
		INSTAGRAM_ACCESS_TOKEN: accessToken,
		INSTAGRAM_BUSINESS_ACCOUNT_ID: accountId,
	} = getConfig();

	// Fetch posts
	const posts: MediaPosts[] = [];
	let nextCursor: string | undefined;

	do {
		const response = await instagramService.getPostsFromBusinessAccount(
			accessToken,
			accountId,
			numberOfPosts,
			nextCursor,
		);

		response?.data?.length && posts.push(...response.data);
		nextCursor = response?.paging?.cursors?.after;

		// Break the loop if we have fetched the desired number of posts
		if (numberOfPosts && posts.length >= numberOfPosts) {
			break;
		}
	} while (nextCursor);

	if (!posts.length) {
		throw new Error("No posts found");
	}

	// Create Excel file
	const workbook = excelService.createWorkbook();
	const worksheet = excelService.createWorksheet(workbook, "Posts");

	excelService.addColumnsToWorksheet(worksheet, [
		{ header: "", key: "seq", width: 5 },
		{ header: "Media ID", key: "id", width: 20 },
		{ header: "Caption", key: "caption", width: 50 },
		{ header: "Link", key: "link", width: 20 },
		{ header: "Date", key: "date", width: 20 },
		{ header: "Likes", key: "likes", width: 15 },
		{ header: "Comments", key: "comments", width: 15 },
	]);

	// Add custom header
	createCustomHeaderRow(
		worksheet,
		"Powered by Gramoco",
		"https://github.com/alexmarqs/gramoco-cli",
		"Open source code",
	);

	// biome-ignore lint/complexity/noForEach: <explanation>
	posts.forEach((post, index) => {
		const row = worksheet.addRow({
			seq: index + 1,
			id: post.id,
			caption: post.caption,
			link: post.permalink,
			date: new Date(post.timestamp).toLocaleString(),
			likes: post.like_count,
			comments: post.comments_count,
		});

		setHyperlinkCellValue(
			row,
			"link",
			"View post",
			post.permalink,
			"Open post",
		);
	});

	const filePath = await excelService.saveWorkbookToFile(
		workbook,
		`posts-${accountId}-${new Date().getTime()}.xlsx`,
	);

	return {
		filePath,
		numberOfPosts: posts.length,
	};
};
