import { i as __require, o as __toESM, t as __commonJSMin } from "./chunk-C8U8pIma.mjs";
import { t as defineCommand } from "./dist-DCppsyw9.mjs";
import { n as colors } from "./consola.DXBYu-KD-BxkQ5_xB.mjs";
import "./utils-D5jIbZ8_.mjs";
import { a as legacyRootDirArgs, i as extendsArgs, n as dotEnvArgs, o as logLevelArgs, r as envNameArgs, t as cwdArgs } from "./_shared-C2cUf6jV.mjs";
import { a as Gt, n as logger, s as Mt } from "./logger-DgyoxKia.mjs";
import { c as resolve$1 } from "./pathe.M-eThtNZ-0R4k6vpe.mjs";
import "./defu-DcpjBOZc.mjs";
import { r as relativeToProcess, t as loadKit } from "./kit-BNf015SG.mjs";
import { t as K } from "./main-Dx6xQYR8.mjs";
import "./jiti-_DRHsfPn.mjs";
import { dirname } from "node:path";
import process$1 from "node:process";
import { pathToFileURL } from "node:url";
import { existsSync, promises, statSync } from "node:fs";
import { homedir } from "node:os";
import { readFile, rm } from "node:fs/promises";

//#region ../../node_modules/.pnpm/dotenv@17.3.1/node_modules/dotenv/package.json
var require_package = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		"name": "dotenv",
		"version": "17.3.1",
		"description": "Loads environment variables from .env file",
		"main": "lib/main.js",
		"types": "lib/main.d.ts",
		"exports": {
			".": {
				"types": "./lib/main.d.ts",
				"require": "./lib/main.js",
				"default": "./lib/main.js"
			},
			"./config": "./config.js",
			"./config.js": "./config.js",
			"./lib/env-options": "./lib/env-options.js",
			"./lib/env-options.js": "./lib/env-options.js",
			"./lib/cli-options": "./lib/cli-options.js",
			"./lib/cli-options.js": "./lib/cli-options.js",
			"./package.json": "./package.json"
		},
		"scripts": {
			"dts-check": "tsc --project tests/types/tsconfig.json",
			"lint": "standard",
			"pretest": "npm run lint && npm run dts-check",
			"test": "tap run tests/**/*.js --allow-empty-coverage --disable-coverage --timeout=60000",
			"test:coverage": "tap run tests/**/*.js --show-full-coverage --timeout=60000 --coverage-report=text --coverage-report=lcov",
			"prerelease": "npm test",
			"release": "standard-version"
		},
		"repository": {
			"type": "git",
			"url": "git://github.com/motdotla/dotenv.git"
		},
		"homepage": "https://github.com/motdotla/dotenv#readme",
		"funding": "https://dotenvx.com",
		"keywords": [
			"dotenv",
			"env",
			".env",
			"environment",
			"variables",
			"config",
			"settings"
		],
		"readmeFilename": "README.md",
		"license": "BSD-2-Clause",
		"devDependencies": {
			"@types/node": "^18.11.3",
			"decache": "^4.6.2",
			"sinon": "^14.0.1",
			"standard": "^17.0.0",
			"standard-version": "^9.5.0",
			"tap": "^19.2.0",
			"typescript": "^4.8.4"
		},
		"engines": { "node": ">=12" },
		"browser": { "fs": false }
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/dotenv@17.3.1/node_modules/dotenv/lib/main.js
var require_main = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const fs$1 = __require("fs");
	const path$1 = __require("path");
	const os$1 = __require("os");
	const crypto = __require("crypto");
	const version = require_package().version;
	const TIPS = [
		"🔐 encrypt with Dotenvx: https://dotenvx.com",
		"🔐 prevent committing .env to code: https://dotenvx.com/precommit",
		"🔐 prevent building .env in docker: https://dotenvx.com/prebuild",
		"🤖 agentic secret storage: https://dotenvx.com/as2",
		"⚡️ secrets for agents: https://dotenvx.com/as2",
		"🛡️ auth for agents: https://vestauth.com",
		"🛠️  run anywhere with `dotenvx run -- yourcommand`",
		"⚙️  specify custom .env file path with { path: '/custom/path/.env' }",
		"⚙️  enable debug logging with { debug: true }",
		"⚙️  override existing env vars with { override: true }",
		"⚙️  suppress all logs with { quiet: true }",
		"⚙️  write to custom object with { processEnv: myObject }",
		"⚙️  load multiple .env files with { path: ['.env.local', '.env'] }"
	];
	function _getRandomTip() {
		return TIPS[Math.floor(Math.random() * TIPS.length)];
	}
	function parseBoolean(value) {
		if (typeof value === "string") return ![
			"false",
			"0",
			"no",
			"off",
			""
		].includes(value.toLowerCase());
		return Boolean(value);
	}
	function supportsAnsi() {
		return process.stdout.isTTY;
	}
	function dim(text) {
		return supportsAnsi() ? `\x1b[2m${text}\x1b[0m` : text;
	}
	const LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/gm;
	function parse(src) {
		const obj = {};
		let lines = src.toString();
		lines = lines.replace(/\r\n?/gm, "\n");
		let match;
		while ((match = LINE.exec(lines)) != null) {
			const key = match[1];
			let value = match[2] || "";
			value = value.trim();
			const maybeQuote = value[0];
			value = value.replace(/^(['"`])([\s\S]*)\1$/gm, "$2");
			if (maybeQuote === "\"") {
				value = value.replace(/\\n/g, "\n");
				value = value.replace(/\\r/g, "\r");
			}
			obj[key] = value;
		}
		return obj;
	}
	function _parseVault(options) {
		options = options || {};
		const vaultPath = _vaultPath(options);
		options.path = vaultPath;
		const result = DotenvModule.configDotenv(options);
		if (!result.parsed) {
			const err = /* @__PURE__ */ new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
			err.code = "MISSING_DATA";
			throw err;
		}
		const keys = _dotenvKey(options).split(",");
		const length = keys.length;
		let decrypted;
		for (let i = 0; i < length; i++) try {
			const attrs = _instructions(result, keys[i].trim());
			decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
			break;
		} catch (error) {
			if (i + 1 >= length) throw error;
		}
		return DotenvModule.parse(decrypted);
	}
	function _warn(message) {
		console.error(`[dotenv@${version}][WARN] ${message}`);
	}
	function _debug(message) {
		console.log(`[dotenv@${version}][DEBUG] ${message}`);
	}
	function _log(message) {
		console.log(`[dotenv@${version}] ${message}`);
	}
	function _dotenvKey(options) {
		if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) return options.DOTENV_KEY;
		if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) return process.env.DOTENV_KEY;
		return "";
	}
	function _instructions(result, dotenvKey) {
		let uri;
		try {
			uri = new URL(dotenvKey);
		} catch (error) {
			if (error.code === "ERR_INVALID_URL") {
				const err = /* @__PURE__ */ new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
				err.code = "INVALID_DOTENV_KEY";
				throw err;
			}
			throw error;
		}
		const key = uri.password;
		if (!key) {
			const err = /* @__PURE__ */ new Error("INVALID_DOTENV_KEY: Missing key part");
			err.code = "INVALID_DOTENV_KEY";
			throw err;
		}
		const environment = uri.searchParams.get("environment");
		if (!environment) {
			const err = /* @__PURE__ */ new Error("INVALID_DOTENV_KEY: Missing environment part");
			err.code = "INVALID_DOTENV_KEY";
			throw err;
		}
		const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
		const ciphertext = result.parsed[environmentKey];
		if (!ciphertext) {
			const err = /* @__PURE__ */ new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
			err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
			throw err;
		}
		return {
			ciphertext,
			key
		};
	}
	function _vaultPath(options) {
		let possibleVaultPath = null;
		if (options && options.path && options.path.length > 0) if (Array.isArray(options.path)) {
			for (const filepath of options.path) if (fs$1.existsSync(filepath)) possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
		} else possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
		else possibleVaultPath = path$1.resolve(process.cwd(), ".env.vault");
		if (fs$1.existsSync(possibleVaultPath)) return possibleVaultPath;
		return null;
	}
	function _resolveHome(envPath) {
		return envPath[0] === "~" ? path$1.join(os$1.homedir(), envPath.slice(1)) : envPath;
	}
	function _configVault(options) {
		const debug = parseBoolean(process.env.DOTENV_CONFIG_DEBUG || options && options.debug);
		const quiet = parseBoolean(process.env.DOTENV_CONFIG_QUIET || options && options.quiet);
		if (debug || !quiet) _log("Loading env from encrypted .env.vault");
		const parsed = DotenvModule._parseVault(options);
		let processEnv = process.env;
		if (options && options.processEnv != null) processEnv = options.processEnv;
		DotenvModule.populate(processEnv, parsed, options);
		return { parsed };
	}
	function configDotenv(options) {
		const dotenvPath = path$1.resolve(process.cwd(), ".env");
		let encoding = "utf8";
		let processEnv = process.env;
		if (options && options.processEnv != null) processEnv = options.processEnv;
		let debug = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || options && options.debug);
		let quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || options && options.quiet);
		if (options && options.encoding) encoding = options.encoding;
		else if (debug) _debug("No encoding is specified. UTF-8 is used by default");
		let optionPaths = [dotenvPath];
		if (options && options.path) if (!Array.isArray(options.path)) optionPaths = [_resolveHome(options.path)];
		else {
			optionPaths = [];
			for (const filepath of options.path) optionPaths.push(_resolveHome(filepath));
		}
		let lastError;
		const parsedAll = {};
		for (const path of optionPaths) try {
			const parsed = DotenvModule.parse(fs$1.readFileSync(path, { encoding }));
			DotenvModule.populate(parsedAll, parsed, options);
		} catch (e) {
			if (debug) _debug(`Failed to load ${path} ${e.message}`);
			lastError = e;
		}
		const populated = DotenvModule.populate(processEnv, parsedAll, options);
		debug = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || debug);
		quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || quiet);
		if (debug || !quiet) {
			const keysCount = Object.keys(populated).length;
			const shortPaths = [];
			for (const filePath of optionPaths) try {
				const relative = path$1.relative(process.cwd(), filePath);
				shortPaths.push(relative);
			} catch (e) {
				if (debug) _debug(`Failed to load ${filePath} ${e.message}`);
				lastError = e;
			}
			_log(`injecting env (${keysCount}) from ${shortPaths.join(",")} ${dim(`-- tip: ${_getRandomTip()}`)}`);
		}
		if (lastError) return {
			parsed: parsedAll,
			error: lastError
		};
		else return { parsed: parsedAll };
	}
	function config(options) {
		if (_dotenvKey(options).length === 0) return DotenvModule.configDotenv(options);
		const vaultPath = _vaultPath(options);
		if (!vaultPath) {
			_warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
			return DotenvModule.configDotenv(options);
		}
		return DotenvModule._configVault(options);
	}
	function decrypt(encrypted, keyStr) {
		const key = Buffer.from(keyStr.slice(-64), "hex");
		let ciphertext = Buffer.from(encrypted, "base64");
		const nonce = ciphertext.subarray(0, 12);
		const authTag = ciphertext.subarray(-16);
		ciphertext = ciphertext.subarray(12, -16);
		try {
			const aesgcm = crypto.createDecipheriv("aes-256-gcm", key, nonce);
			aesgcm.setAuthTag(authTag);
			return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
		} catch (error) {
			const isRange = error instanceof RangeError;
			const invalidKeyLength = error.message === "Invalid key length";
			const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
			if (isRange || invalidKeyLength) {
				const err = /* @__PURE__ */ new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
				err.code = "INVALID_DOTENV_KEY";
				throw err;
			} else if (decryptionFailed) {
				const err = /* @__PURE__ */ new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
				err.code = "DECRYPTION_FAILED";
				throw err;
			} else throw error;
		}
	}
	function populate(processEnv, parsed, options = {}) {
		const debug = Boolean(options && options.debug);
		const override = Boolean(options && options.override);
		const populated = {};
		if (typeof parsed !== "object") {
			const err = /* @__PURE__ */ new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
			err.code = "OBJECT_REQUIRED";
			throw err;
		}
		for (const key of Object.keys(parsed)) if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
			if (override === true) {
				processEnv[key] = parsed[key];
				populated[key] = parsed[key];
			}
			if (debug) if (override === true) _debug(`"${key}" is already defined and WAS overwritten`);
			else _debug(`"${key}" is already defined and was NOT overwritten`);
		} else {
			processEnv[key] = parsed[key];
			populated[key] = parsed[key];
		}
		return populated;
	}
	const DotenvModule = {
		configDotenv,
		_configVault,
		_parseVault,
		config,
		decrypt,
		parse,
		populate
	};
	module.exports.configDotenv = DotenvModule.configDotenv;
	module.exports._configVault = DotenvModule._configVault;
	module.exports._parseVault = DotenvModule._parseVault;
	module.exports.config = DotenvModule.config;
	module.exports.decrypt = DotenvModule.decrypt;
	module.exports.parse = DotenvModule.parse;
	module.exports.populate = DotenvModule.populate;
	module.exports = DotenvModule;
}));

//#endregion
//#region ../../node_modules/.pnpm/c12@3.3.3_magicast@0.5.2/node_modules/c12/dist/index.mjs
var import_main = /* @__PURE__ */ __toESM(require_main(), 1);
/**
* Load and interpolate environment variables into `process.env`.
* If you need more control (or access to the values), consider using `loadDotenv` instead
*
*/
async function setupDotenv(options) {
	const targetEnvironment = options.env ?? process.env;
	const environment = await loadDotenv({
		cwd: options.cwd,
		fileName: options.fileName ?? ".env",
		env: targetEnvironment,
		interpolate: options.interpolate ?? true
	});
	const dotenvVars = getDotEnvVars(targetEnvironment);
	for (const key in environment) {
		if (key.startsWith("_")) continue;
		if (targetEnvironment[key] === void 0 || dotenvVars.has(key)) targetEnvironment[key] = environment[key];
	}
	return environment;
}
/** Load environment variables into an object. */
async function loadDotenv(options) {
	const environment = Object.create(null);
	const cwd = resolve$1(options.cwd || ".");
	const _fileName = options.fileName || ".env";
	const dotenvFiles = typeof _fileName === "string" ? [_fileName] : _fileName;
	const dotenvVars = getDotEnvVars(options.env || {});
	Object.assign(environment, options.env);
	for (const file of dotenvFiles) {
		const dotenvFile = resolve$1(cwd, file);
		if (!statSync(dotenvFile, { throwIfNoEntry: false })?.isFile()) continue;
		const parsed = import_main.parse(await promises.readFile(dotenvFile, "utf8"));
		for (const key in parsed) {
			if (key in environment && !dotenvVars.has(key)) continue;
			environment[key] = parsed[key];
			dotenvVars.add(key);
		}
	}
	if (options.interpolate) interpolate(environment);
	return environment;
}
function interpolate(target, source = {}, parse = (v) => v) {
	function getValue(key) {
		return source[key] === void 0 ? target[key] : source[key];
	}
	function interpolate$1(value, parents = []) {
		if (typeof value !== "string") return value;
		return parse((value.match(/(.?\${?(?:[\w:]+)?}?)/g) || []).reduce((newValue, match) => {
			const parts = /(.?)\${?([\w:]+)?}?/g.exec(match) || [];
			const prefix = parts[1];
			let value$1, replacePart;
			if (prefix === "\\") {
				replacePart = parts[0] || "";
				value$1 = replacePart.replace(String.raw`\$`, "$");
			} else {
				const key = parts[2];
				replacePart = (parts[0] || "").slice(prefix.length);
				if (parents.includes(key)) {
					console.warn(`Please avoid recursive environment variables ( loop: ${parents.join(" > ")} > ${key} )`);
					return "";
				}
				value$1 = getValue(key);
				value$1 = interpolate$1(value$1, [...parents, key]);
			}
			return value$1 === void 0 ? newValue : newValue.replace(replacePart, value$1);
		}, value));
	}
	for (const key in target) target[key] = interpolate$1(getValue(key));
}
function getDotEnvVars(targetEnvironment) {
	const globalRegistry = globalThis.__c12_dotenv_vars__ ||= /* @__PURE__ */ new Map();
	if (!globalRegistry.has(targetEnvironment)) globalRegistry.set(targetEnvironment, /* @__PURE__ */ new Set());
	return globalRegistry.get(targetEnvironment);
}
const SUPPORTED_EXTENSIONS = Object.freeze([
	".js",
	".ts",
	".mjs",
	".cjs",
	".mts",
	".cts",
	".json",
	".jsonc",
	".json5",
	".yaml",
	".yml",
	".toml"
]);

//#endregion
//#region src/commands/preview.ts
const command = defineCommand({
	meta: {
		name: "preview",
		description: "Launches Nitro server for local testing after `nuxi build`."
	},
	args: {
		...cwdArgs,
		...logLevelArgs,
		...envNameArgs,
		...extendsArgs,
		...legacyRootDirArgs,
		port: {
			type: "string",
			description: "Port to listen on",
			alias: ["p"]
		},
		...dotEnvArgs
	},
	async run(ctx) {
		process$1.env.NODE_ENV = process$1.env.NODE_ENV || "production";
		const cwd = resolve$1(ctx.args.cwd || ctx.args.rootDir);
		const { loadNuxt } = await loadKit(cwd);
		const nitroJSONPaths = [await new Promise((res) => {
			loadNuxt({
				cwd,
				dotenv: {
					cwd,
					fileName: ctx.args.dotenv
				},
				envName: ctx.args.envName,
				ready: true,
				overrides: {
					...ctx.args.extends && { extends: ctx.args.extends },
					modules: [function(_, nuxt) {
						nuxt.hook("nitro:init", (nitro) => {
							res(resolve$1(nuxt.options.srcDir || cwd, nitro.options.output.dir || ".output", "nitro.json"));
						});
					}]
				}
			}).then((nuxt) => nuxt.close()).catch(() => "");
		}), resolve$1(cwd, ".output", "nitro.json")].filter(Boolean);
		const nitroJSONPath = nitroJSONPaths.find((p) => existsSync(p));
		if (!nitroJSONPath) {
			logger.error(`Cannot find ${colors.cyan("nitro.json")}. Did you run ${colors.cyan("nuxi build")} first? Search path:\n${nitroJSONPaths.join("\n")}`);
			process$1.exit(1);
		}
		const outputPath = dirname(nitroJSONPath);
		const nitroJSON = JSON.parse(await promises.readFile(nitroJSONPath, "utf-8"));
		if (!nitroJSON.commands.preview) {
			logger.error("Preview is not supported for this build.");
			process$1.exit(1);
		}
		const info = [
			["Node.js:", `v${process$1.versions.node}`],
			["Nitro preset:", nitroJSON.preset],
			["Working directory:", relativeToProcess(outputPath)]
		];
		const _infoKeyLen = Math.max(...info.map(([label]) => label.length));
		logger.message("");
		Mt([
			"",
			"You are previewing a Nuxt app. In production, do not use this CLI. ",
			`Instead, run ${colors.cyan(nitroJSON.commands.preview)} directly.`,
			"",
			...info.map(([label, value]) => `${label.padEnd(_infoKeyLen, " ")} ${colors.cyan(value)}`),
			""
		].join("\n"), colors.yellow(" Previewing Nuxt app "), {
			contentAlign: "left",
			titleAlign: "left",
			width: "auto",
			titlePadding: 2,
			contentPadding: 2,
			rounded: true,
			withGuide: true,
			formatBorder: (text) => colors.yellow(text)
		});
		const envFileName = ctx.args.dotenv || ".env";
		if (existsSync(resolve$1(cwd, envFileName))) {
			logger.info(`Loading ${colors.cyan(envFileName)}. This will not be loaded when running the server in production.`);
			await setupDotenv({
				cwd,
				fileName: envFileName
			});
		} else if (ctx.args.dotenv) logger.error(`Cannot find ${colors.cyan(envFileName)}.`);
		const port = ctx.args.port ?? process$1.env.NUXT_PORT ?? process$1.env.NITRO_PORT ?? process$1.env.PORT;
		Gt(`Running ${colors.cyan(nitroJSON.commands.preview)} in ${colors.cyan(relativeToProcess(outputPath))}`);
		const [command, ...commandArgs] = nitroJSON.commands.preview.split(" ");
		await K(command, commandArgs, {
			throwOnError: true,
			nodeOptions: {
				stdio: "inherit",
				cwd: outputPath,
				env: {
					...process$1.env,
					NUXT_PORT: port,
					NITRO_PORT: port
				}
			}
		});
	}
});

//#endregion
export { command as default };