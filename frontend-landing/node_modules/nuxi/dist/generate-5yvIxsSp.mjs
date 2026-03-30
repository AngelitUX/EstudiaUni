import { t as defineCommand } from "./dist-DCppsyw9.mjs";
import "./consola.DXBYu-KD-BxkQ5_xB.mjs";
import "./utils-D5jIbZ8_.mjs";
import { a as legacyRootDirArgs, i as extendsArgs, n as dotEnvArgs, o as logLevelArgs, r as envNameArgs, s as profileArgs, t as cwdArgs } from "./_shared-C2cUf6jV.mjs";
import "./logger-DgyoxKia.mjs";
import "./env-Bykz_nTz.mjs";
import "./ascii-CRtOAF65.mjs";
import "./profile-DJqJHaSM.mjs";
import "./kit-BNf015SG.mjs";
import "./satisfies-C-RXCk_4.mjs";
import "./versions-Co6im98b.mjs";
import "./banner-9Cb5bryX.mjs";
import "./fs-DDhFmxBK.mjs";
import build_default from "./build-DPVU_ad-.mjs";

//#region src/commands/generate.ts
var generate_default = defineCommand({
	meta: {
		name: "generate",
		description: "Build Nuxt and prerender all routes"
	},
	args: {
		...cwdArgs,
		...logLevelArgs,
		preset: {
			type: "string",
			description: "Nitro server preset"
		},
		...dotEnvArgs,
		...envNameArgs,
		...extendsArgs,
		...profileArgs,
		...legacyRootDirArgs
	},
	async run(ctx) {
		ctx.args.prerender = true;
		await build_default.run(ctx);
	}
});

//#endregion
export { generate_default as default };