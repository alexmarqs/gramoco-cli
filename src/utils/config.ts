import { existsSync, readFileSync } from "fs";
import { Config } from "../types";
import path from "path";

let config: Config;

const initConfig = () => {
	const configPath = path.join(process.cwd(), "gramoco.config.json");

	if (!existsSync(configPath)) {
		throw new Error(
			"No config file found. Please create one according to the docs.",
		);
	}

	const configJsonFile = readFileSync(configPath, "utf-8");

	const parsedConfig: Config = JSON.parse(configJsonFile);

	if (
		!parsedConfig.INSTAGRAM_ACCESS_TOKEN ||
		!parsedConfig.INSTAGRAM_BUSINESS_ACCOUNT_ID
	) {
		throw new Error(
			"Missing config values. Please check your config file according to the docs: https://github.com/alexmarqs/gramoco-cli.",
		);
	}

	config = parsedConfig;
};

const getConfig = (key: keyof Config) => {
	if (!config) {
		throw new Error("Config not initialized or invalid");
	}

	return config[key];
};

export { initConfig, getConfig };
