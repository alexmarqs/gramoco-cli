#!/usr/bin/env node
import { input, select } from "@inquirer/prompts";
import readline from "node:readline";
import { createSpinner } from "nanospinner";
import { z } from "zod";
import packageJson from "../package.json";
import { excelService } from "./adapters/excel/excel-service-adapter";
import { instagramService } from "./adapters/instagram/instagram-service-adapter";
import { ACTIONS } from "./types";
import { extractCommentsToExcelUseCase } from "./use-cases/extractCommentsToExcel";
import { extractPostsToExcelUseCase } from "./use-cases/extractPostsToExcel";
import { initConfig } from "./utils/config";

const cliApp = async () => {
	console.clear();
	const version = packageJson.version;
	console.info(`Gramoco CLI ${version ? `v${version}` : ""}`);

	// Initialize configuration
	await initConfig();

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

cliApp()
	.catch((error) => {
		if (error instanceof z.ZodError) {
			console.error(
				`\nINVALID CONFIGURATION: ${error.issues
					.map((e) => `${e.path.join(".")}: ${e.message}`)
					.join(" ; ")}`,
			);
		} else {
			console.error(`\nERROR: ${error?.message ? error?.message : "unknown"}`);
		}
	})
	.finally(() => {
		// Prompt user to press any key to exit
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});

		console.log("\nPress any key to exit...");

		if (process.stdin.isTTY && typeof process.stdin.setRawMode === "function") {
			process.stdin.setRawMode(true);
		}

		process.stdin.resume();
		process.stdin.on("data", () => {
			if (
				process.stdin.isTTY &&
				typeof process.stdin.setRawMode === "function"
			) {
				process.stdin.setRawMode(false);
			}
			rl.close();
			process.stdin.pause();
			process.exit();
		});
	});
