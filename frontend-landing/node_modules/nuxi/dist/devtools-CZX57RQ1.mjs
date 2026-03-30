import { t as defineCommand } from "./dist-DCppsyw9.mjs";
import { n as colors } from "./consola.DXBYu-KD-BxkQ5_xB.mjs";
import "./utils-D5jIbZ8_.mjs";
import { a as legacyRootDirArgs, t as cwdArgs } from "./_shared-C2cUf6jV.mjs";
import { n as logger } from "./logger-DgyoxKia.mjs";
import { c as resolve } from "./pathe.M-eThtNZ-0R4k6vpe.mjs";
import { t as K } from "./main-Dx6xQYR8.mjs";
import process from "node:process";

//#region src/commands/devtools.ts
var devtools_default = defineCommand({
	meta: {
		name: "devtools",
		description: "Enable or disable devtools in a Nuxt project"
	},
	args: {
		...cwdArgs,
		command: {
			type: "positional",
			description: "Command to run",
			valueHint: "enable|disable"
		},
		...legacyRootDirArgs
	},
	async run(ctx) {
		const cwd = resolve(ctx.args.cwd || ctx.args.rootDir);
		const command = ctx.args.command;
		if (!command || !["enable", "disable"].includes(command)) {
			logger.error(`Unknown command ${colors.cyan(command || "")}.`);
			process.exit(1);
		}
		await K("npx", [
			"@nuxt/devtools-wizard@latest",
			command,
			cwd
		], {
			throwOnError: true,
			nodeOptions: {
				stdio: "inherit",
				cwd
			}
		});
	}
});

//#endregion
export { devtools_default as default };