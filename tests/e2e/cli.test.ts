import { expect, test } from "vitest";
import { execSync } from "child_process";

test("CLI app should run", () => {
	process.env.INSTAGRAM_ACCESS_TOKEN = "test123123";
	process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID = "123124";

	const output = execSync("node ./dist/index.js").toString();
	expect(output).toMatch(/Gramoco CLI v\d+\.\d+\.\d+/);
});
