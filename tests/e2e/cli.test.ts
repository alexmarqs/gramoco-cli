import { expect, test } from "vitest";
import { execSync } from "child_process";

test("CLI app should run", () => {
	const output = execSync("node ./dist/index.js", {
		stdio: "pipe",
	}).toString();
	expect(output).toMatch(/Gramoco CLI v\d+\.\d+\.\d+/);
});
