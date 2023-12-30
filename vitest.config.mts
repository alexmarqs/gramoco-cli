import { defineConfig } from "vitest/config";

export default defineConfig({
	//plugins: [tsconfigPaths()], // this is needed for tsconfig paths to work, in this case we don't need it
	test: {
		dir: "src",
		passWithNoTests: true,
		silent: true,
	},
});
