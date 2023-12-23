#!/usr/bin/env node
import { input, select } from "@inquirer/prompts";

import { createSpinner } from "nanospinner";
import packageJson from "../package.json";
import { ACTIONS } from "./types";
import { initConfig } from "./utils/config";
import { instagramService } from "./adapters/instagram/instagram-service-adapter";
import { extractCommentsToExcelUseCase } from "./use-cases/extractCommentsToExcel";
import { excelService } from "./adapters/excel/excel-service-adapter";
import { extractPostsToExcelUseCase } from "./use-cases/extractPostsToExcel";

const cliApp = async () => {
	console.clear();
	const version = packageJson.version;
	console.info(`Gramoco CLI ${version ? `v${version}` : ""}`);

	initConfig();

	const selectedAction = await select({
		message: "What do you want to do?",
		choices: [
			{
				name: "Extract posts summary to Excel",
				value: ACTIONS.EXTRACT_MEDIA_EXCEL,
			},
			{
				name: "Extract comments from post to Excel",
				value: ACTIONS.EXTRACT_COMMENTS_MEDIA_EXCEL,
			},
		],
	});

	switch (selectedAction) {
		case ACTIONS.EXTRACT_COMMENTS_MEDIA_EXCEL: {
			const mediaId = await input({
				message: "Enter the Media ID",
				validate: (value) => {
					if (!value) {
						return "Please enter a valid Media ID";
					}
					return true;
				},
			});

			const spinner = createSpinner();
			spinner.start({
				text: `Extracting comments of media ID ${mediaId} to Excel`,
			});

			try {
				const resultUseCase = await extractCommentsToExcelUseCase(
					{
						mediaId,
					},
					instagramService,
					excelService,
				);

				spinner.success({
					text: `${resultUseCase.numberOfComments} comments saved to ${resultUseCase.filePath}`,
				});
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			} catch (error: any) {
				spinner.error({
					text: "Something went wrong while extracting comments",
				});
				throw error;
			}

			break;
		}
		case ACTIONS.EXTRACT_MEDIA_EXCEL: {
			const numberOfPosts = await input({
				message: "Enter the number of posts to extract",
				default: "all",
				validate: (value) => {
					if (value === "all") {
						return true;
					}

					const number = Number(value);
					if (Number.isNaN(number)) {
						return "Please enter a valid number";
					}

					return true;
				},
			});

			const spinner = createSpinner();
			spinner.start({
				text: "Extracting posts from your account ID to Excel",
			});
			try {
				const resultUseCase = await extractPostsToExcelUseCase(
					{
						numberOfPosts:
							numberOfPosts === "all" ? undefined : Number(numberOfPosts),
					},
					instagramService,
					excelService,
				);

				spinner.success({
					text: `${resultUseCase.numberOfPosts} Posts saved to ${resultUseCase.filePath}`,
				});
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			} catch (error: any) {
				spinner.error({
					text: "Something went wrong while extracting posts",
				});
				throw error;
			}
		}
	}
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
cliApp().catch((error: any) => {
	console.error(`*Error* ${error?.message ? error?.message : "unknown"}`);
	process.exit();
});
