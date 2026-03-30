import { t as defineCommand } from "./dist-DCppsyw9.mjs";
import { n as colors } from "./consola.DXBYu-KD-BxkQ5_xB.mjs";
import "./utils-D5jIbZ8_.mjs";
import { o as logLevelArgs, t as cwdArgs } from "./_shared-C2cUf6jV.mjs";
import { a as Gt, c as Nt, f as Wt, n as logger } from "./logger-DgyoxKia.mjs";
import { c as resolve, n as dirname, r as extname } from "./pathe.M-eThtNZ-0R4k6vpe.mjs";
import { n as templates, t as templateNames } from "./templates-CHkyABdG.mjs";
import { r as relativeToProcess, t as loadKit } from "./kit-BNf015SG.mjs";
import process from "node:process";
import { existsSync, promises } from "node:fs";

//#region src/commands/add-template.ts
var add_template_default = defineCommand({
	meta: {
		name: "add-template",
		description: "Create a new template file."
	},
	args: {
		...cwdArgs,
		...logLevelArgs,
		force: {
			type: "boolean",
			description: "Force override file if it already exists",
			default: false
		},
		template: {
			type: "positional",
			required: true,
			valueHint: templateNames.join("|"),
			description: `Specify which template to generate`
		},
		name: {
			type: "positional",
			required: true,
			description: "Specify name of the generated file"
		}
	},
	async run(ctx) {
		const cwd = resolve(ctx.args.cwd);
		Wt(colors.cyan("Adding template..."));
		const templateName = ctx.args.template;
		if (!templateNames.includes(templateName)) {
			const templateNames = Object.keys(templates).map((name) => colors.cyan(name));
			const lastTemplateName = templateNames.pop();
			logger.error(`Template ${colors.cyan(templateName)} is not supported.`);
			logger.info(`Possible values are ${templateNames.join(", ")} or ${lastTemplateName}.`);
			process.exit(1);
		}
		const ext = extname(ctx.args.name);
		const name = ext === ".vue" || ext === ".ts" ? ctx.args.name.replace(ext, "") : ctx.args.name;
		if (!name) {
			Nt("name argument is missing!");
			process.exit(1);
		}
		const config = await (await loadKit(cwd)).loadNuxtConfig({ cwd });
		const template = templates[templateName];
		const res = template({
			name,
			args: ctx.args,
			nuxtOptions: config
		});
		if (!ctx.args.force && existsSync(res.path)) {
			logger.error(`File exists at ${colors.cyan(relativeToProcess(res.path))}.`);
			logger.info(`Use ${colors.cyan("--force")} to override or use a different name.`);
			process.exit(1);
		}
		const parentDir = dirname(res.path);
		if (!existsSync(parentDir)) {
			logger.step(`Creating directory ${colors.cyan(relativeToProcess(parentDir))}.`);
			if (templateName === "page") logger.info("This enables vue-router functionality!");
			await promises.mkdir(parentDir, { recursive: true });
		}
		await promises.writeFile(res.path, `${res.contents.trim()}\n`);
		logger.success(`Created ${colors.cyan(relativeToProcess(res.path))}.`);
		Gt(`Generated a new ${colors.cyan(templateName)}!`);
	}
});

//#endregion
export { add_template_default as default };