import { t as defineCommand } from "./dist-DCppsyw9.mjs";
import { n as colors } from "./consola.DXBYu-KD-BxkQ5_xB.mjs";
import "./utils-D5jIbZ8_.mjs";
import { a as legacyRootDirArgs, i as extendsArgs, n as dotEnvArgs, o as logLevelArgs, r as envNameArgs, s as profileArgs, t as cwdArgs } from "./_shared-C2cUf6jV.mjs";
import { a as Gt, f as Wt, n as logger } from "./logger-DgyoxKia.mjs";
import { c as resolve, s as relative } from "./pathe.M-eThtNZ-0R4k6vpe.mjs";
import { t as overrideEnv } from "./env-Bykz_nTz.mjs";
import "./ascii-CRtOAF65.mjs";
import { n as stopCpuProfile, t as startCpuProfile } from "./profile-DJqJHaSM.mjs";
import { t as loadKit } from "./kit-BNf015SG.mjs";
import "./satisfies-C-RXCk_4.mjs";
import "./versions-Co6im98b.mjs";
import { n as showVersions } from "./banner-9Cb5bryX.mjs";
import { t as clearBuildDir } from "./fs-DDhFmxBK.mjs";
import process from "node:process";

//#region src/commands/build.ts
var build_default = defineCommand({
	meta: {
		name: "build",
		description: "Build Nuxt for production deployment"
	},
	args: {
		...cwdArgs,
		...logLevelArgs,
		prerender: {
			type: "boolean",
			description: "Build Nuxt and prerender static routes"
		},
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
		overrideEnv("production");
		const cwd = resolve(ctx.args.cwd || ctx.args.rootDir);
		const profileArg = ctx.args.profile;
		const perfValue = profileArg === "verbose" ? true : profileArg ? "quiet" : void 0;
		if (profileArg) await startCpuProfile();
		try {
			Wt(colors.cyan("Building Nuxt for production..."));
			const kit = await loadKit(cwd);
			await showVersions(cwd, kit, ctx.args.dotenv);
			const nuxt = await kit.loadNuxt({
				cwd,
				dotenv: {
					cwd,
					fileName: ctx.args.dotenv
				},
				envName: ctx.args.envName,
				overrides: {
					logLevel: ctx.args.logLevel,
					_generate: ctx.args.prerender,
					nitro: {
						static: ctx.args.prerender,
						preset: ctx.args.preset || process.env.NITRO_PRESET || process.env.SERVER_PRESET
					},
					...ctx.args.extends && { extends: ctx.args.extends },
					...ctx.data?.overrides,
					...(perfValue || ctx.data?.overrides?.debug) && { debug: {
						...ctx.data?.overrides?.debug,
						...perfValue && { perf: perfValue }
					} }
				}
			});
			let nitro;
			try {
				nitro = kit.useNitro?.();
				if (nitro) logger.info(`Nitro preset: ${colors.cyan(nitro.options.preset)}`);
			} catch {}
			await clearBuildDir(nuxt.options.buildDir);
			await kit.writeTypes(nuxt);
			nuxt.hook("build:error", async (err) => {
				logger.error(`Nuxt build error: ${err}`);
				if (profileArg) await stopCpuProfile(cwd, "build");
				process.exit(1);
			});
			await kit.buildNuxt(nuxt);
			if (ctx.args.prerender) {
				if (!nuxt.options.ssr) {
					logger.warn(`HTML content not prerendered because ${colors.cyan("ssr: false")} was set.`);
					logger.info(`You can read more in ${colors.cyan("https://nuxt.com/docs/getting-started/deployment#static-hosting")}.`);
				}
				const dir = nitro?.options.output.publicDir;
				const publicDir = dir ? relative(process.cwd(), dir) : ".output/public";
				Gt(`✨ You can now deploy ${colors.cyan(publicDir)} to any static hosting!`);
			} else Gt("✨ Build complete!");
		} finally {
			if (profileArg) await stopCpuProfile(cwd, "build");
		}
	}
});

//#endregion
export { build_default as default };