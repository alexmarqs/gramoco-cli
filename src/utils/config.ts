import path from "path";
import { z } from "zod/v4-mini";
import { loadConfig } from "zod-config";
import { envAdapter } from "zod-config/env-adapter";
import { jsonAdapter } from "zod-config/json-adapter";

const configSchema = z.object({
	INSTAGRAM_ACCESS_TOKEN: z.string(),
	INSTAGRAM_BUSINESS_ACCOUNT_ID: z.string(),
});

let config: z.infer<typeof configSchema>;

const initConfig = async () => {
	// current dir where the script is running:
	const configPath = path.join(
		path.dirname(process.execPath),
		"gramoco.config.json",
	);

	const parsedConfig = await loadConfig({
		schema: configSchema,
		adapters: [
			jsonAdapter({
				path: configPath,
				silent: true,
			}),
			envAdapter(),
		],
	});

	config = parsedConfig;
};

const getConfig = () => {
	if (!config) {
		throw new Error("Configuration not initialized");
	}

	return config;
};

export { getConfig, initConfig };
