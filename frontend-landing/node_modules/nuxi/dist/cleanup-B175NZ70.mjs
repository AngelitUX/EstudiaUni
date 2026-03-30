import { t as defineCommand } from "./dist-DCppsyw9.mjs";
import { a as legacyRootDirArgs, t as cwdArgs } from "./_shared-C2cUf6jV.mjs";
import { n as logger } from "./logger-DgyoxKia.mjs";
import { c as resolve } from "./pathe.M-eThtNZ-0R4k6vpe.mjs";
import { t as loadKit } from "./kit-BNf015SG.mjs";
import "./fs-DDhFmxBK.mjs";
import { t as cleanupNuxtDirs } from "./nuxt-DeAYMQbp.mjs";

//#region src/commands/cleanup.ts
var cleanup_default = defineCommand({
	meta: {
		name: "cleanup",
		description: "Clean up generated Nuxt files and caches"
	},
	args: {
		...cwdArgs,
		...legacyRootDirArgs
	},
	async run(ctx) {
		const cwd = resolve(ctx.args.cwd || ctx.args.rootDir);
		const { loadNuxtConfig } = await loadKit(cwd);
		const nuxtOptions = await loadNuxtConfig({
			cwd,
			overrides: { dev: true }
		});
		await cleanupNuxtDirs(nuxtOptions.rootDir, nuxtOptions.buildDir);
		logger.success("Cleanup complete!");
	}
});

//#endregion
export { cleanup_default as default };