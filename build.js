import esbuild from "esbuild";
import path from "path";

esbuild.build({
	entryPoints: ["src/index.ts"],
	bundle: true,
	platform: "node",
	target: "node20",
	outfile: "dist/index.js",

	alias: {
		"@": path.resolve("./src"),
	},

	external: [
		"bcrypt",
		"mysql2",
		"jsonwebtoken"
	],
	minify: true,
}).catch(() => process.exit(1));
