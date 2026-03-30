import { r as __exportAll } from "./chunk-C8U8pIma.mjs";
import { t as defineCommand } from "./dist-DCppsyw9.mjs";
import { n as colors } from "./consola.DXBYu-KD-BxkQ5_xB.mjs";
import { a as legacyRootDirArgs, i as extendsArgs, n as dotEnvArgs, o as logLevelArgs, r as envNameArgs, t as cwdArgs } from "./_shared-C2cUf6jV.mjs";
import { n as logger } from "./logger-DgyoxKia.mjs";
import { c as resolve } from "./pathe.M-eThtNZ-0R4k6vpe.mjs";
import { r as relativeToProcess, t as loadKit } from "./kit-BNf015SG.mjs";
import { t as clearBuildDir } from "./fs-DDhFmxBK.mjs";
import process from "node:process";

//#region src/commands/prepare.ts
var prepare_exports = /* @__PURE__ */ __exportAll({ default: () => prepare_default });
var prepare_default = defineCommand({
	meta: {
		name: "prepare",
		description: "Prepare Nuxt for development/build"
	},
	args: {
		...dotEnvArgs,
		...cwdArgs,
		...logLevelArgs,
		...envNameArgs,
		...extendsArgs,
		...legacyRootDirArgs
	},
	async run(ctx) {
		process.env.NODE_ENV = process.env.NODE_ENV || "production";
		const cwd = resolve(ctx.args.cwd || ctx.args.rootDir);
		const { loadNuxt, buildNuxt, writeTypes } = await loadKit(cwd);
		const nuxt = await loadNuxt({
			cwd,
			dotenv: {
				cwd,
				fileName: ctx.args.dotenv
			},
			envName: ctx.args.envName,
			overrides: {
				_prepare: true,
				logLevel: ctx.args.logLevel,
				...ctx.args.extends && { extends: ctx.args.extends },
				...ctx.data?.overrides
			}
		});
		await clearBuildDir(nuxt.options.buildDir);
		await buildNuxt(nuxt);
		await writeTypes(nuxt);
		logger.success(`Types generated in ${colors.cyan(relativeToProcess(nuxt.options.buildDir))}.`);
	}
});

//#endregion
export { prepare_exports as n, prepare_default as t };