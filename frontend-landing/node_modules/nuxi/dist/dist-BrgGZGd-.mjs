import { a as join$1, c as resolve$1, o as normalize$1 } from "./pathe.M-eThtNZ-0R4k6vpe.mjs";
import { t as K } from "./main-Dx6xQYR8.mjs";
import { createRequire } from "node:module";
import { join } from "node:path";
import * as fs$1 from "node:fs";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";

//#region ../../node_modules/.pnpm/nypm@0.6.5/node_modules/nypm/dist/index.mjs
async function findup(cwd, match, options = {}) {
	const segments = normalize$1(cwd).split("/");
	while (segments.length > 0) {
		const result = await match(segments.join("/") || "/");
		if (result || !options.includeParentDirs) return result;
		segments.pop();
	}
}
async function readPackageJSON(cwd) {
	return findup(cwd, (p) => {
		const pkgPath = join(p, "package.json");
		if (existsSync(pkgPath)) return readFile(pkgPath, "utf8").then((data) => JSON.parse(data));
	});
}
function cached(fn) {
	let v;
	return () => {
		if (v === void 0) v = fn().then((r) => {
			v = r;
			return v;
		});
		return v;
	};
}
const hasCorepack = cached(async () => {
	if (globalThis.process?.versions?.webcontainer) return false;
	try {
		const { exitCode } = await K("corepack", ["--version"]);
		return exitCode === 0;
	} catch {
		return false;
	}
});
async function executeCommand(command, args, options = {}) {
	const xArgs = command !== "npm" && command !== "bun" && command !== "deno" && options.corepack !== false && await hasCorepack() ? ["corepack", [command, ...args]] : [command, args];
	const { exitCode, stdout, stderr } = await K(xArgs[0], xArgs[1], { nodeOptions: {
		cwd: resolve$1(options.cwd || process.cwd()),
		env: options.env,
		stdio: options.silent ? "pipe" : "inherit"
	} });
	if (exitCode !== 0) throw new Error(`\`${xArgs.flat().join(" ")}\` failed.${options.silent ? [
		"",
		stdout,
		stderr
	].join("\n") : ""}`);
}
const NO_PACKAGE_MANAGER_DETECTED_ERROR_MSG = "No package manager auto-detected.";
async function resolveOperationOptions(options = {}) {
	const cwd = options.cwd || process.cwd();
	const env = {
		...process.env,
		...options.env
	};
	const packageManager = (typeof options.packageManager === "string" ? packageManagers.find((pm) => pm.name === options.packageManager) : options.packageManager) || await detectPackageManager(options.cwd || process.cwd());
	if (!packageManager) throw new Error(NO_PACKAGE_MANAGER_DETECTED_ERROR_MSG);
	return {
		cwd,
		env,
		silent: options.silent ?? false,
		packageManager,
		dev: options.dev ?? false,
		workspace: options.workspace,
		global: options.global ?? false,
		dry: options.dry ?? false,
		corepack: options.corepack ?? true
	};
}
function getWorkspaceArgs(options) {
	if (!options.workspace) return [];
	const workspacePkg = typeof options.workspace === "string" && options.workspace !== "" ? options.workspace : void 0;
	if (options.packageManager.name === "pnpm") return workspacePkg ? ["--filter", workspacePkg] : ["--workspace-root"];
	if (options.packageManager.name === "npm") return workspacePkg ? ["-w", workspacePkg] : ["--workspaces"];
	if (options.packageManager.name === "yarn") if (!options.packageManager.majorVersion || options.packageManager.majorVersion === "1") return workspacePkg ? ["--cwd", workspacePkg] : ["-W"];
	else return workspacePkg ? ["workspace", workspacePkg] : [];
	return [];
}
function parsePackageManagerField(packageManager) {
	const [name, _version] = (packageManager || "").split("@");
	const [version, buildMeta] = _version?.split("+") || [];
	if (name && name !== "-" && /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(name)) return {
		name,
		version,
		buildMeta
	};
	const sanitized = (name || "").replace(/\W+/g, "");
	return {
		name: sanitized,
		version,
		buildMeta,
		warnings: [`Abnormal characters found in \`packageManager\` field, sanitizing from \`${name}\` to \`${sanitized}\``]
	};
}
const packageManagers = [
	{
		name: "npm",
		command: "npm",
		lockFile: "package-lock.json"
	},
	{
		name: "pnpm",
		command: "pnpm",
		lockFile: "pnpm-lock.yaml",
		files: ["pnpm-workspace.yaml"]
	},
	{
		name: "bun",
		command: "bun",
		lockFile: ["bun.lockb", "bun.lock"]
	},
	{
		name: "yarn",
		command: "yarn",
		lockFile: "yarn.lock",
		files: [".yarnrc.yml"]
	},
	{
		name: "deno",
		command: "deno",
		lockFile: "deno.lock",
		files: ["deno.json"]
	}
];
async function detectPackageManager(cwd, options = {}) {
	const detected = await findup(resolve$1(cwd || "."), async (path) => {
		if (!options.ignorePackageJSON) {
			const packageJSONPath = join$1(path, "package.json");
			if (existsSync(packageJSONPath)) {
				const packageJSON = JSON.parse(await readFile(packageJSONPath, "utf8"));
				if (packageJSON?.packageManager) {
					const { name, version = "0.0.0", buildMeta, warnings } = parsePackageManagerField(packageJSON.packageManager);
					if (name) {
						const majorVersion = version.split(".")[0];
						const packageManager = packageManagers.find((pm) => pm.name === name && pm.majorVersion === majorVersion) || packageManagers.find((pm) => pm.name === name);
						return {
							name,
							command: name,
							version,
							majorVersion,
							buildMeta,
							warnings,
							files: packageManager?.files,
							lockFile: packageManager?.lockFile
						};
					}
				}
			}
			if (existsSync(join$1(path, "deno.json"))) return packageManagers.find((pm) => pm.name === "deno");
		}
		if (!options.ignoreLockFile) {
			for (const packageManager of packageManagers) if ([packageManager.lockFile, packageManager.files].flat().filter(Boolean).some((file) => existsSync(resolve$1(path, file)))) return { ...packageManager };
		}
	}, { includeParentDirs: options.includeParentDirs ?? true });
	if (!detected && !options.ignoreArgv) {
		const scriptArg = process.argv[1];
		if (scriptArg) {
			for (const packageManager of packageManagers) if (new RegExp(`[/\\\\]\\.?${packageManager.command}`).test(scriptArg)) return packageManager;
		}
	}
	return detected;
}
async function installDependencies(options = {}) {
	const resolvedOptions = await resolveOperationOptions(options);
	const commandArgs = options.frozenLockFile ? {
		npm: ["ci"],
		yarn: ["install", "--immutable"],
		bun: ["install", "--frozen-lockfile"],
		pnpm: ["install", "--frozen-lockfile"],
		deno: ["install", "--frozen"]
	}[resolvedOptions.packageManager.name] : ["install"];
	if (options.ignoreWorkspace && resolvedOptions.packageManager.name === "pnpm") commandArgs.push("--ignore-workspace");
	if (!resolvedOptions.dry) await executeCommand(resolvedOptions.packageManager.command, commandArgs, {
		cwd: resolvedOptions.cwd,
		silent: resolvedOptions.silent,
		corepack: resolvedOptions.corepack
	});
	return { exec: {
		command: resolvedOptions.packageManager.command,
		args: commandArgs
	} };
}
async function addDependency(name, options = {}) {
	const resolvedOptions = await resolveOperationOptions(options);
	const names = Array.isArray(name) ? name : [name];
	if (resolvedOptions.packageManager.name === "deno") {
		for (let i = 0; i < names.length; i++) if (!/^(npm|jsr|file):.+$/.test(names[i] || "")) names[i] = `npm:${names[i]}`;
	}
	if (names.length === 0) return {};
	const args = (resolvedOptions.packageManager.name === "yarn" ? [
		...getWorkspaceArgs(resolvedOptions),
		resolvedOptions.global && resolvedOptions.packageManager.majorVersion === "1" ? "global" : "",
		"add",
		resolvedOptions.dev ? "-D" : "",
		...names
	] : [
		resolvedOptions.packageManager.name === "npm" ? "install" : "add",
		...getWorkspaceArgs(resolvedOptions),
		resolvedOptions.dev ? "-D" : "",
		resolvedOptions.global ? "-g" : "",
		...names
	]).filter(Boolean);
	if (!resolvedOptions.dry) await executeCommand(resolvedOptions.packageManager.command, args, {
		cwd: resolvedOptions.cwd,
		silent: resolvedOptions.silent,
		corepack: resolvedOptions.corepack
	});
	if (!resolvedOptions.dry && options.installPeerDependencies) {
		const existingPkg = await readPackageJSON(resolvedOptions.cwd);
		const peerDeps = [];
		const peerDevDeps = [];
		const _require = createRequire(join(resolvedOptions.cwd, "/_.js"));
		for (const _name of names) {
			const pkgName = _name.match(/^(.[^@]+)/)?.[0];
			const pkg = await readPackageJSON(_require.resolve(pkgName));
			if (!pkg?.peerDependencies || pkg?.name !== pkgName) continue;
			for (const [peerDependency, version] of Object.entries(pkg.peerDependencies)) {
				if (pkg.peerDependenciesMeta?.[peerDependency]?.optional) continue;
				if (existingPkg?.dependencies?.[peerDependency] || existingPkg?.devDependencies?.[peerDependency]) continue;
				(pkg.peerDependenciesMeta?.[peerDependency]?.dev ? peerDevDeps : peerDeps).push(`${peerDependency}@${version}`);
			}
		}
		if (peerDeps.length > 0) await addDependency(peerDeps, { ...resolvedOptions });
		if (peerDevDeps.length > 0) await addDevDependency(peerDevDeps, { ...resolvedOptions });
	}
	return { exec: {
		command: resolvedOptions.packageManager.command,
		args
	} };
}
async function addDevDependency(name, options = {}) {
	return await addDependency(name, {
		...options,
		dev: true
	});
}
async function dedupeDependencies(options = {}) {
	const resolvedOptions = await resolveOperationOptions(options);
	const isSupported = !["bun", "deno"].includes(resolvedOptions.packageManager.name);
	if (options.recreateLockfile ?? !isSupported) {
		const lockfiles = Array.isArray(resolvedOptions.packageManager.lockFile) ? resolvedOptions.packageManager.lockFile : [resolvedOptions.packageManager.lockFile];
		for (const lockfile of lockfiles) if (lockfile) fs$1.rmSync(resolve$1(resolvedOptions.cwd, lockfile), { force: true });
		return await installDependencies(resolvedOptions);
	}
	if (isSupported) {
		const isyarnv1 = resolvedOptions.packageManager.name === "yarn" && resolvedOptions.packageManager.majorVersion === "1";
		if (!resolvedOptions.dry) await executeCommand(resolvedOptions.packageManager.command, [isyarnv1 ? "install" : "dedupe"], {
			cwd: resolvedOptions.cwd,
			silent: resolvedOptions.silent,
			corepack: resolvedOptions.corepack
		});
		return { exec: {
			command: resolvedOptions.packageManager.command,
			args: [isyarnv1 ? "install" : "dedupe"]
		} };
	}
	throw new Error(`Deduplication is not supported for ${resolvedOptions.packageManager.name}`);
}

//#endregion
export { installDependencies as i, dedupeDependencies as n, detectPackageManager as r, addDependency as t };