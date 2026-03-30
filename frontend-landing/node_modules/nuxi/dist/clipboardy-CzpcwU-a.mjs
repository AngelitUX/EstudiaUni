import { i as __require, o as __toESM, t as __commonJSMin } from "./chunk-C8U8pIma.mjs";
import path from "node:path";
import process$1 from "node:process";
import { debuglog, promisify } from "node:util";
import { fileURLToPath } from "node:url";
import fs, { createReadStream, createWriteStream, readFileSync } from "node:fs";
import os, { constants as constants$1 } from "node:os";
import { Buffer as Buffer$1 } from "node:buffer";
import childProcess, { ChildProcess } from "node:child_process";
import { setTimeout as setTimeout$1 } from "node:timers/promises";

//#region ../../node_modules/.pnpm/is-docker@3.0.0/node_modules/is-docker/index.js
let isDockerCached;
function hasDockerEnv() {
	try {
		fs.statSync("/.dockerenv");
		return true;
	} catch {
		return false;
	}
}
function hasDockerCGroup() {
	try {
		return fs.readFileSync("/proc/self/cgroup", "utf8").includes("docker");
	} catch {
		return false;
	}
}
function isDocker() {
	if (isDockerCached === void 0) isDockerCached = hasDockerEnv() || hasDockerCGroup();
	return isDockerCached;
}

//#endregion
//#region ../../node_modules/.pnpm/is-inside-container@1.0.0/node_modules/is-inside-container/index.js
let cachedResult;
const hasContainerEnv = () => {
	try {
		fs.statSync("/run/.containerenv");
		return true;
	} catch {
		return false;
	}
};
function isInsideContainer() {
	if (cachedResult === void 0) cachedResult = hasContainerEnv() || isDocker();
	return cachedResult;
}

//#endregion
//#region ../../node_modules/.pnpm/is-wsl@3.1.1/node_modules/is-wsl/index.js
const isWsl = () => {
	if (process$1.platform !== "linux") return false;
	if (os.release().toLowerCase().includes("microsoft")) {
		if (isInsideContainer()) return false;
		return true;
	}
	try {
		if (fs.readFileSync("/proc/version", "utf8").toLowerCase().includes("microsoft")) return !isInsideContainer();
	} catch {}
	if (fs.existsSync("/proc/sys/fs/binfmt_misc/WSLInterop") || fs.existsSync("/run/WSL")) return !isInsideContainer();
	return false;
};
var is_wsl_default = process$1.env.__IS_WSL_TEST__ ? isWsl : isWsl();

//#endregion
//#region ../../node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/windows.js
var require_windows = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = isexe;
	isexe.sync = sync;
	var fs$3 = __require("fs");
	function checkPathExt(path, options) {
		var pathext = options.pathExt !== void 0 ? options.pathExt : process.env.PATHEXT;
		if (!pathext) return true;
		pathext = pathext.split(";");
		if (pathext.indexOf("") !== -1) return true;
		for (var i = 0; i < pathext.length; i++) {
			var p = pathext[i].toLowerCase();
			if (p && path.substr(-p.length).toLowerCase() === p) return true;
		}
		return false;
	}
	function checkStat(stat, path, options) {
		if (!stat.isSymbolicLink() && !stat.isFile()) return false;
		return checkPathExt(path, options);
	}
	function isexe(path, options, cb) {
		fs$3.stat(path, function(er, stat) {
			cb(er, er ? false : checkStat(stat, path, options));
		});
	}
	function sync(path, options) {
		return checkStat(fs$3.statSync(path), path, options);
	}
}));

//#endregion
//#region ../../node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/mode.js
var require_mode = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = isexe;
	isexe.sync = sync;
	var fs$2 = __require("fs");
	function isexe(path, options, cb) {
		fs$2.stat(path, function(er, stat) {
			cb(er, er ? false : checkStat(stat, options));
		});
	}
	function sync(path, options) {
		return checkStat(fs$2.statSync(path), options);
	}
	function checkStat(stat, options) {
		return stat.isFile() && checkMode(stat, options);
	}
	function checkMode(stat, options) {
		var mod = stat.mode;
		var uid = stat.uid;
		var gid = stat.gid;
		var myUid = options.uid !== void 0 ? options.uid : process.getuid && process.getuid();
		var myGid = options.gid !== void 0 ? options.gid : process.getgid && process.getgid();
		var u = parseInt("100", 8);
		var g = parseInt("010", 8);
		var o = parseInt("001", 8);
		var ug = u | g;
		return mod & o || mod & g && gid === myGid || mod & u && uid === myUid || mod & ug && myUid === 0;
	}
}));

//#endregion
//#region ../../node_modules/.pnpm/isexe@2.0.0/node_modules/isexe/index.js
var require_isexe = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	__require("fs");
	var core;
	if (process.platform === "win32" || global.TESTING_WINDOWS) core = require_windows();
	else core = require_mode();
	module.exports = isexe;
	isexe.sync = sync;
	function isexe(path, options, cb) {
		if (typeof options === "function") {
			cb = options;
			options = {};
		}
		if (!cb) {
			if (typeof Promise !== "function") throw new TypeError("callback not provided");
			return new Promise(function(resolve, reject) {
				isexe(path, options || {}, function(er, is) {
					if (er) reject(er);
					else resolve(is);
				});
			});
		}
		core(path, options || {}, function(er, is) {
			if (er) {
				if (er.code === "EACCES" || options && options.ignoreErrors) {
					er = null;
					is = false;
				}
			}
			cb(er, is);
		});
	}
	function sync(path, options) {
		try {
			return core.sync(path, options || {});
		} catch (er) {
			if (options && options.ignoreErrors || er.code === "EACCES") return false;
			else throw er;
		}
	}
}));

//#endregion
//#region ../../node_modules/.pnpm/which@2.0.2/node_modules/which/which.js
var require_which = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const isWindows = process.platform === "win32" || process.env.OSTYPE === "cygwin" || process.env.OSTYPE === "msys";
	const path$3 = __require("path");
	const COLON = isWindows ? ";" : ":";
	const isexe = require_isexe();
	const getNotFoundError = (cmd) => Object.assign(/* @__PURE__ */ new Error(`not found: ${cmd}`), { code: "ENOENT" });
	const getPathInfo = (cmd, opt) => {
		const colon = opt.colon || COLON;
		const pathEnv = cmd.match(/\//) || isWindows && cmd.match(/\\/) ? [""] : [...isWindows ? [process.cwd()] : [], ...(opt.path || process.env.PATH || "").split(colon)];
		const pathExtExe = isWindows ? opt.pathExt || process.env.PATHEXT || ".EXE;.CMD;.BAT;.COM" : "";
		const pathExt = isWindows ? pathExtExe.split(colon) : [""];
		if (isWindows) {
			if (cmd.indexOf(".") !== -1 && pathExt[0] !== "") pathExt.unshift("");
		}
		return {
			pathEnv,
			pathExt,
			pathExtExe
		};
	};
	const which = (cmd, opt, cb) => {
		if (typeof opt === "function") {
			cb = opt;
			opt = {};
		}
		if (!opt) opt = {};
		const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
		const found = [];
		const step = (i) => new Promise((resolve, reject) => {
			if (i === pathEnv.length) return opt.all && found.length ? resolve(found) : reject(getNotFoundError(cmd));
			const ppRaw = pathEnv[i];
			const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
			const pCmd = path$3.join(pathPart, cmd);
			resolve(subStep(!pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd, i, 0));
		});
		const subStep = (p, i, ii) => new Promise((resolve, reject) => {
			if (ii === pathExt.length) return resolve(step(i + 1));
			const ext = pathExt[ii];
			isexe(p + ext, { pathExt: pathExtExe }, (er, is) => {
				if (!er && is) if (opt.all) found.push(p + ext);
				else return resolve(p + ext);
				return resolve(subStep(p, i, ii + 1));
			});
		});
		return cb ? step(0).then((res) => cb(null, res), cb) : step(0);
	};
	const whichSync = (cmd, opt) => {
		opt = opt || {};
		const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
		const found = [];
		for (let i = 0; i < pathEnv.length; i++) {
			const ppRaw = pathEnv[i];
			const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
			const pCmd = path$3.join(pathPart, cmd);
			const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
			for (let j = 0; j < pathExt.length; j++) {
				const cur = p + pathExt[j];
				try {
					if (isexe.sync(cur, { pathExt: pathExtExe })) if (opt.all) found.push(cur);
					else return cur;
				} catch (ex) {}
			}
		}
		if (opt.all && found.length) return found;
		if (opt.nothrow) return null;
		throw getNotFoundError(cmd);
	};
	module.exports = which;
	which.sync = whichSync;
}));

//#endregion
//#region ../../node_modules/.pnpm/path-key@3.1.1/node_modules/path-key/index.js
var require_path_key = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const pathKey = (options = {}) => {
		const environment = options.env || process.env;
		if ((options.platform || process.platform) !== "win32") return "PATH";
		return Object.keys(environment).reverse().find((key) => key.toUpperCase() === "PATH") || "Path";
	};
	module.exports = pathKey;
	module.exports.default = pathKey;
}));

//#endregion
//#region ../../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/lib/util/resolveCommand.js
var require_resolveCommand = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const path$2 = __require("path");
	const which = require_which();
	const getPathKey = require_path_key();
	function resolveCommandAttempt(parsed, withoutPathExt) {
		const env = parsed.options.env || process.env;
		const cwd = process.cwd();
		const hasCustomCwd = parsed.options.cwd != null;
		const shouldSwitchCwd = hasCustomCwd && process.chdir !== void 0 && !process.chdir.disabled;
		if (shouldSwitchCwd) try {
			process.chdir(parsed.options.cwd);
		} catch (err) {}
		let resolved;
		try {
			resolved = which.sync(parsed.command, {
				path: env[getPathKey({ env })],
				pathExt: withoutPathExt ? path$2.delimiter : void 0
			});
		} catch (e) {} finally {
			if (shouldSwitchCwd) process.chdir(cwd);
		}
		if (resolved) resolved = path$2.resolve(hasCustomCwd ? parsed.options.cwd : "", resolved);
		return resolved;
	}
	function resolveCommand(parsed) {
		return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
	}
	module.exports = resolveCommand;
}));

//#endregion
//#region ../../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/lib/util/escape.js
var require_escape = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;
	function escapeCommand(arg) {
		arg = arg.replace(metaCharsRegExp, "^$1");
		return arg;
	}
	function escapeArgument(arg, doubleEscapeMetaChars) {
		arg = `${arg}`;
		arg = arg.replace(/(?=(\\+?)?)\1"/g, "$1$1\\\"");
		arg = arg.replace(/(?=(\\+?)?)\1$/, "$1$1");
		arg = `"${arg}"`;
		arg = arg.replace(metaCharsRegExp, "^$1");
		if (doubleEscapeMetaChars) arg = arg.replace(metaCharsRegExp, "^$1");
		return arg;
	}
	module.exports.command = escapeCommand;
	module.exports.argument = escapeArgument;
}));

//#endregion
//#region ../../node_modules/.pnpm/shebang-regex@3.0.0/node_modules/shebang-regex/index.js
var require_shebang_regex = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = /^#!(.*)/;
}));

//#endregion
//#region ../../node_modules/.pnpm/shebang-command@2.0.0/node_modules/shebang-command/index.js
var require_shebang_command = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const shebangRegex = require_shebang_regex();
	module.exports = (string = "") => {
		const match = string.match(shebangRegex);
		if (!match) return null;
		const [path, argument] = match[0].replace(/#! ?/, "").split(" ");
		const binary = path.split("/").pop();
		if (binary === "env") return argument;
		return argument ? `${binary} ${argument}` : binary;
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/lib/util/readShebang.js
var require_readShebang = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const fs$1 = __require("fs");
	const shebangCommand = require_shebang_command();
	function readShebang(command) {
		const size = 150;
		const buffer = Buffer.alloc(size);
		let fd;
		try {
			fd = fs$1.openSync(command, "r");
			fs$1.readSync(fd, buffer, 0, size, 0);
			fs$1.closeSync(fd);
		} catch (e) {}
		return shebangCommand(buffer.toString());
	}
	module.exports = readShebang;
}));

//#endregion
//#region ../../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/lib/parse.js
var require_parse = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const path$1 = __require("path");
	const resolveCommand = require_resolveCommand();
	const escape = require_escape();
	const readShebang = require_readShebang();
	const isWin = process.platform === "win32";
	const isExecutableRegExp = /\.(?:com|exe)$/i;
	const isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;
	function detectShebang(parsed) {
		parsed.file = resolveCommand(parsed);
		const shebang = parsed.file && readShebang(parsed.file);
		if (shebang) {
			parsed.args.unshift(parsed.file);
			parsed.command = shebang;
			return resolveCommand(parsed);
		}
		return parsed.file;
	}
	function parseNonShell(parsed) {
		if (!isWin) return parsed;
		const commandFile = detectShebang(parsed);
		const needsShell = !isExecutableRegExp.test(commandFile);
		if (parsed.options.forceShell || needsShell) {
			const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);
			parsed.command = path$1.normalize(parsed.command);
			parsed.command = escape.command(parsed.command);
			parsed.args = parsed.args.map((arg) => escape.argument(arg, needsDoubleEscapeMetaChars));
			parsed.args = [
				"/d",
				"/s",
				"/c",
				`"${[parsed.command].concat(parsed.args).join(" ")}"`
			];
			parsed.command = process.env.comspec || "cmd.exe";
			parsed.options.windowsVerbatimArguments = true;
		}
		return parsed;
	}
	function parse(command, args, options) {
		if (args && !Array.isArray(args)) {
			options = args;
			args = null;
		}
		args = args ? args.slice(0) : [];
		options = Object.assign({}, options);
		const parsed = {
			command,
			args,
			options,
			file: void 0,
			original: {
				command,
				args
			}
		};
		return options.shell ? parsed : parseNonShell(parsed);
	}
	module.exports = parse;
}));

//#endregion
//#region ../../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/lib/enoent.js
var require_enoent = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const isWin = process.platform === "win32";
	function notFoundError(original, syscall) {
		return Object.assign(/* @__PURE__ */ new Error(`${syscall} ${original.command} ENOENT`), {
			code: "ENOENT",
			errno: "ENOENT",
			syscall: `${syscall} ${original.command}`,
			path: original.command,
			spawnargs: original.args
		});
	}
	function hookChildProcess(cp, parsed) {
		if (!isWin) return;
		const originalEmit = cp.emit;
		cp.emit = function(name, arg1) {
			if (name === "exit") {
				const err = verifyENOENT(arg1, parsed);
				if (err) return originalEmit.call(cp, "error", err);
			}
			return originalEmit.apply(cp, arguments);
		};
	}
	function verifyENOENT(status, parsed) {
		if (isWin && status === 1 && !parsed.file) return notFoundError(parsed.original, "spawn");
		return null;
	}
	function verifyENOENTSync(status, parsed) {
		if (isWin && status === 1 && !parsed.file) return notFoundError(parsed.original, "spawnSync");
		return null;
	}
	module.exports = {
		hookChildProcess,
		verifyENOENT,
		verifyENOENTSync,
		notFoundError
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/cross-spawn@7.0.6/node_modules/cross-spawn/index.js
var require_cross_spawn = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const cp = __require("child_process");
	const parse = require_parse();
	const enoent = require_enoent();
	function spawn(command, args, options) {
		const parsed = parse(command, args, options);
		const spawned = cp.spawn(parsed.command, parsed.args, parsed.options);
		enoent.hookChildProcess(spawned, parsed);
		return spawned;
	}
	function spawnSync(command, args, options) {
		const parsed = parse(command, args, options);
		const result = cp.spawnSync(parsed.command, parsed.args, parsed.options);
		result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);
		return result;
	}
	module.exports = spawn;
	module.exports.spawn = spawn;
	module.exports.sync = spawnSync;
	module.exports._parse = parse;
	module.exports._enoent = enoent;
}));

//#endregion
//#region ../../node_modules/.pnpm/strip-final-newline@3.0.0/node_modules/strip-final-newline/index.js
var import_cross_spawn = /* @__PURE__ */ __toESM(require_cross_spawn(), 1);
function stripFinalNewline(input) {
	const LF = typeof input === "string" ? "\n" : "\n".charCodeAt();
	const CR = typeof input === "string" ? "\r" : "\r".charCodeAt();
	if (input[input.length - 1] === LF) input = input.slice(0, -1);
	if (input[input.length - 1] === CR) input = input.slice(0, -1);
	return input;
}

//#endregion
//#region ../../node_modules/.pnpm/path-key@4.0.0/node_modules/path-key/index.js
function pathKey(options = {}) {
	const { env = process.env, platform = process.platform } = options;
	if (platform !== "win32") return "PATH";
	return Object.keys(env).reverse().find((key) => key.toUpperCase() === "PATH") || "Path";
}

//#endregion
//#region ../../node_modules/.pnpm/npm-run-path@5.3.0/node_modules/npm-run-path/index.js
const npmRunPath = ({ cwd = process$1.cwd(), path: pathOption = process$1.env[pathKey()], preferLocal = true, execPath = process$1.execPath, addExecPath = true } = {}) => {
	const cwdString = cwd instanceof URL ? fileURLToPath(cwd) : cwd;
	const cwdPath = path.resolve(cwdString);
	const result = [];
	if (preferLocal) applyPreferLocal(result, cwdPath);
	if (addExecPath) applyExecPath(result, execPath, cwdPath);
	return [...result, pathOption].join(path.delimiter);
};
const applyPreferLocal = (result, cwdPath) => {
	let previous;
	while (previous !== cwdPath) {
		result.push(path.join(cwdPath, "node_modules/.bin"));
		previous = cwdPath;
		cwdPath = path.resolve(cwdPath, "..");
	}
};
const applyExecPath = (result, execPath, cwdPath) => {
	const execPathString = execPath instanceof URL ? fileURLToPath(execPath) : execPath;
	result.push(path.resolve(cwdPath, execPathString, ".."));
};
const npmRunPathEnv = ({ env = process$1.env, ...options } = {}) => {
	env = { ...env };
	const pathName = pathKey({ env });
	options.path = env[pathName];
	env[pathName] = npmRunPath(options);
	return env;
};

//#endregion
//#region ../../node_modules/.pnpm/mimic-fn@4.0.0/node_modules/mimic-fn/index.js
const copyProperty = (to, from, property, ignoreNonConfigurable) => {
	if (property === "length" || property === "prototype") return;
	if (property === "arguments" || property === "caller") return;
	const toDescriptor = Object.getOwnPropertyDescriptor(to, property);
	const fromDescriptor = Object.getOwnPropertyDescriptor(from, property);
	if (!canCopyProperty(toDescriptor, fromDescriptor) && ignoreNonConfigurable) return;
	Object.defineProperty(to, property, fromDescriptor);
};
const canCopyProperty = function(toDescriptor, fromDescriptor) {
	return toDescriptor === void 0 || toDescriptor.configurable || toDescriptor.writable === fromDescriptor.writable && toDescriptor.enumerable === fromDescriptor.enumerable && toDescriptor.configurable === fromDescriptor.configurable && (toDescriptor.writable || toDescriptor.value === fromDescriptor.value);
};
const changePrototype = (to, from) => {
	const fromPrototype = Object.getPrototypeOf(from);
	if (fromPrototype === Object.getPrototypeOf(to)) return;
	Object.setPrototypeOf(to, fromPrototype);
};
const wrappedToString = (withName, fromBody) => `/* Wrapped ${withName}*/\n${fromBody}`;
const toStringDescriptor = Object.getOwnPropertyDescriptor(Function.prototype, "toString");
const toStringName = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name");
const changeToString = (to, from, name) => {
	const withName = name === "" ? "" : `with ${name.trim()}() `;
	const newToString = wrappedToString.bind(null, withName, from.toString());
	Object.defineProperty(newToString, "name", toStringName);
	Object.defineProperty(to, "toString", {
		...toStringDescriptor,
		value: newToString
	});
};
function mimicFunction(to, from, { ignoreNonConfigurable = false } = {}) {
	const { name } = to;
	for (const property of Reflect.ownKeys(from)) copyProperty(to, from, property, ignoreNonConfigurable);
	changePrototype(to, from);
	changeToString(to, from, name);
	return to;
}

//#endregion
//#region ../../node_modules/.pnpm/onetime@6.0.0/node_modules/onetime/index.js
const calledFunctions = /* @__PURE__ */ new WeakMap();
const onetime = (function_, options = {}) => {
	if (typeof function_ !== "function") throw new TypeError("Expected a function");
	let returnValue;
	let callCount = 0;
	const functionName = function_.displayName || function_.name || "<anonymous>";
	const onetime = function(...arguments_) {
		calledFunctions.set(onetime, ++callCount);
		if (callCount === 1) {
			returnValue = function_.apply(this, arguments_);
			function_ = null;
		} else if (options.throw === true) throw new Error(`Function \`${functionName}\` can only be called once`);
		return returnValue;
	};
	mimicFunction(onetime, function_);
	calledFunctions.set(onetime, callCount);
	return onetime;
};
onetime.callCount = (function_) => {
	if (!calledFunctions.has(function_)) throw new Error(`The given function \`${function_.name}\` is not wrapped by the \`onetime\` package`);
	return calledFunctions.get(function_);
};

//#endregion
//#region ../../node_modules/.pnpm/human-signals@5.0.0/node_modules/human-signals/build/src/realtime.js
const getRealtimeSignals = () => {
	const length = SIGRTMAX - SIGRTMIN + 1;
	return Array.from({ length }, getRealtimeSignal);
};
const getRealtimeSignal = (value, index) => ({
	name: `SIGRT${index + 1}`,
	number: SIGRTMIN + index,
	action: "terminate",
	description: "Application-specific signal (realtime)",
	standard: "posix"
});
const SIGRTMIN = 34;
const SIGRTMAX = 64;

//#endregion
//#region ../../node_modules/.pnpm/human-signals@5.0.0/node_modules/human-signals/build/src/core.js
const SIGNALS = [
	{
		name: "SIGHUP",
		number: 1,
		action: "terminate",
		description: "Terminal closed",
		standard: "posix"
	},
	{
		name: "SIGINT",
		number: 2,
		action: "terminate",
		description: "User interruption with CTRL-C",
		standard: "ansi"
	},
	{
		name: "SIGQUIT",
		number: 3,
		action: "core",
		description: "User interruption with CTRL-\\",
		standard: "posix"
	},
	{
		name: "SIGILL",
		number: 4,
		action: "core",
		description: "Invalid machine instruction",
		standard: "ansi"
	},
	{
		name: "SIGTRAP",
		number: 5,
		action: "core",
		description: "Debugger breakpoint",
		standard: "posix"
	},
	{
		name: "SIGABRT",
		number: 6,
		action: "core",
		description: "Aborted",
		standard: "ansi"
	},
	{
		name: "SIGIOT",
		number: 6,
		action: "core",
		description: "Aborted",
		standard: "bsd"
	},
	{
		name: "SIGBUS",
		number: 7,
		action: "core",
		description: "Bus error due to misaligned, non-existing address or paging error",
		standard: "bsd"
	},
	{
		name: "SIGEMT",
		number: 7,
		action: "terminate",
		description: "Command should be emulated but is not implemented",
		standard: "other"
	},
	{
		name: "SIGFPE",
		number: 8,
		action: "core",
		description: "Floating point arithmetic error",
		standard: "ansi"
	},
	{
		name: "SIGKILL",
		number: 9,
		action: "terminate",
		description: "Forced termination",
		standard: "posix",
		forced: true
	},
	{
		name: "SIGUSR1",
		number: 10,
		action: "terminate",
		description: "Application-specific signal",
		standard: "posix"
	},
	{
		name: "SIGSEGV",
		number: 11,
		action: "core",
		description: "Segmentation fault",
		standard: "ansi"
	},
	{
		name: "SIGUSR2",
		number: 12,
		action: "terminate",
		description: "Application-specific signal",
		standard: "posix"
	},
	{
		name: "SIGPIPE",
		number: 13,
		action: "terminate",
		description: "Broken pipe or socket",
		standard: "posix"
	},
	{
		name: "SIGALRM",
		number: 14,
		action: "terminate",
		description: "Timeout or timer",
		standard: "posix"
	},
	{
		name: "SIGTERM",
		number: 15,
		action: "terminate",
		description: "Termination",
		standard: "ansi"
	},
	{
		name: "SIGSTKFLT",
		number: 16,
		action: "terminate",
		description: "Stack is empty or overflowed",
		standard: "other"
	},
	{
		name: "SIGCHLD",
		number: 17,
		action: "ignore",
		description: "Child process terminated, paused or unpaused",
		standard: "posix"
	},
	{
		name: "SIGCLD",
		number: 17,
		action: "ignore",
		description: "Child process terminated, paused or unpaused",
		standard: "other"
	},
	{
		name: "SIGCONT",
		number: 18,
		action: "unpause",
		description: "Unpaused",
		standard: "posix",
		forced: true
	},
	{
		name: "SIGSTOP",
		number: 19,
		action: "pause",
		description: "Paused",
		standard: "posix",
		forced: true
	},
	{
		name: "SIGTSTP",
		number: 20,
		action: "pause",
		description: "Paused using CTRL-Z or \"suspend\"",
		standard: "posix"
	},
	{
		name: "SIGTTIN",
		number: 21,
		action: "pause",
		description: "Background process cannot read terminal input",
		standard: "posix"
	},
	{
		name: "SIGBREAK",
		number: 21,
		action: "terminate",
		description: "User interruption with CTRL-BREAK",
		standard: "other"
	},
	{
		name: "SIGTTOU",
		number: 22,
		action: "pause",
		description: "Background process cannot write to terminal output",
		standard: "posix"
	},
	{
		name: "SIGURG",
		number: 23,
		action: "ignore",
		description: "Socket received out-of-band data",
		standard: "bsd"
	},
	{
		name: "SIGXCPU",
		number: 24,
		action: "core",
		description: "Process timed out",
		standard: "bsd"
	},
	{
		name: "SIGXFSZ",
		number: 25,
		action: "core",
		description: "File too big",
		standard: "bsd"
	},
	{
		name: "SIGVTALRM",
		number: 26,
		action: "terminate",
		description: "Timeout or timer",
		standard: "bsd"
	},
	{
		name: "SIGPROF",
		number: 27,
		action: "terminate",
		description: "Timeout or timer",
		standard: "bsd"
	},
	{
		name: "SIGWINCH",
		number: 28,
		action: "ignore",
		description: "Terminal window size changed",
		standard: "bsd"
	},
	{
		name: "SIGIO",
		number: 29,
		action: "terminate",
		description: "I/O is available",
		standard: "other"
	},
	{
		name: "SIGPOLL",
		number: 29,
		action: "terminate",
		description: "Watched event",
		standard: "other"
	},
	{
		name: "SIGINFO",
		number: 29,
		action: "ignore",
		description: "Request for process information",
		standard: "other"
	},
	{
		name: "SIGPWR",
		number: 30,
		action: "terminate",
		description: "Device running out of power",
		standard: "systemv"
	},
	{
		name: "SIGSYS",
		number: 31,
		action: "core",
		description: "Invalid system call",
		standard: "other"
	},
	{
		name: "SIGUNUSED",
		number: 31,
		action: "terminate",
		description: "Invalid system call",
		standard: "other"
	}
];

//#endregion
//#region ../../node_modules/.pnpm/human-signals@5.0.0/node_modules/human-signals/build/src/signals.js
const getSignals = () => {
	const realtimeSignals = getRealtimeSignals();
	return [...SIGNALS, ...realtimeSignals].map(normalizeSignal);
};
const normalizeSignal = ({ name, number: defaultNumber, description, action, forced = false, standard }) => {
	const { signals: { [name]: constantSignal } } = constants$1;
	const supported = constantSignal !== void 0;
	return {
		name,
		number: supported ? constantSignal : defaultNumber,
		description,
		supported,
		action,
		forced,
		standard
	};
};

//#endregion
//#region ../../node_modules/.pnpm/human-signals@5.0.0/node_modules/human-signals/build/src/main.js
const getSignalsByName = () => {
	const signals = getSignals();
	return Object.fromEntries(signals.map(getSignalByName));
};
const getSignalByName = ({ name, number, description, supported, action, forced, standard }) => [name, {
	name,
	number,
	description,
	supported,
	action,
	forced,
	standard
}];
const signalsByName = getSignalsByName();
const getSignalsByNumber = () => {
	const signals = getSignals();
	const length = SIGRTMAX + 1;
	const signalsA = Array.from({ length }, (value, number) => getSignalByNumber(number, signals));
	return Object.assign({}, ...signalsA);
};
const getSignalByNumber = (number, signals) => {
	const signal = findSignalByNumber(number, signals);
	if (signal === void 0) return {};
	const { name, description, supported, action, forced, standard } = signal;
	return { [number]: {
		name,
		number,
		description,
		supported,
		action,
		forced,
		standard
	} };
};
const findSignalByNumber = (number, signals) => {
	const signal = signals.find(({ name }) => constants$1.signals[name] === number);
	if (signal !== void 0) return signal;
	return signals.find((signalA) => signalA.number === number);
};
const signalsByNumber = getSignalsByNumber();

//#endregion
//#region ../../node_modules/.pnpm/execa@8.0.1/node_modules/execa/lib/error.js
const getErrorPrefix = ({ timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled }) => {
	if (timedOut) return `timed out after ${timeout} milliseconds`;
	if (isCanceled) return "was canceled";
	if (errorCode !== void 0) return `failed with ${errorCode}`;
	if (signal !== void 0) return `was killed with ${signal} (${signalDescription})`;
	if (exitCode !== void 0) return `failed with exit code ${exitCode}`;
	return "failed";
};
const makeError$1 = ({ stdout, stderr, all, error, signal, exitCode, command, escapedCommand, timedOut, isCanceled, killed, parsed: { options: { timeout, cwd = process$1.cwd() } } }) => {
	exitCode = exitCode === null ? void 0 : exitCode;
	signal = signal === null ? void 0 : signal;
	const signalDescription = signal === void 0 ? void 0 : signalsByName[signal].description;
	const execaMessage = `Command ${getErrorPrefix({
		timedOut,
		timeout,
		errorCode: error && error.code,
		signal,
		signalDescription,
		exitCode,
		isCanceled
	})}: ${command}`;
	const isError = Object.prototype.toString.call(error) === "[object Error]";
	const shortMessage = isError ? `${execaMessage}\n${error.message}` : execaMessage;
	const message = [
		shortMessage,
		stderr,
		stdout
	].filter(Boolean).join("\n");
	if (isError) {
		error.originalMessage = error.message;
		error.message = message;
	} else error = new Error(message);
	error.shortMessage = shortMessage;
	error.command = command;
	error.escapedCommand = escapedCommand;
	error.exitCode = exitCode;
	error.signal = signal;
	error.signalDescription = signalDescription;
	error.stdout = stdout;
	error.stderr = stderr;
	error.cwd = cwd;
	if (all !== void 0) error.all = all;
	if ("bufferedData" in error) delete error.bufferedData;
	error.failed = true;
	error.timedOut = Boolean(timedOut);
	error.isCanceled = isCanceled;
	error.killed = killed && !timedOut;
	return error;
};

//#endregion
//#region ../../node_modules/.pnpm/execa@8.0.1/node_modules/execa/lib/stdio.js
const aliases = [
	"stdin",
	"stdout",
	"stderr"
];
const hasAlias = (options) => aliases.some((alias) => options[alias] !== void 0);
const normalizeStdio = (options) => {
	if (!options) return;
	const { stdio } = options;
	if (stdio === void 0) return aliases.map((alias) => options[alias]);
	if (hasAlias(options)) throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${aliases.map((alias) => `\`${alias}\``).join(", ")}`);
	if (typeof stdio === "string") return stdio;
	if (!Array.isArray(stdio)) throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof stdio}\``);
	const length = Math.max(stdio.length, aliases.length);
	return Array.from({ length }, (value, index) => stdio[index]);
};

//#endregion
//#region ../../node_modules/.pnpm/signal-exit@4.1.0/node_modules/signal-exit/dist/mjs/signals.js
/**
* This is not the set of all possible signals.
*
* It IS, however, the set of all signals that trigger
* an exit on either Linux or BSD systems.  Linux is a
* superset of the signal names supported on BSD, and
* the unknown signals just fail to register, so we can
* catch that easily enough.
*
* Windows signals are a different set, since there are
* signals that terminate Windows processes, but don't
* terminate (or don't even exist) on Posix systems.
*
* Don't bother with SIGKILL.  It's uncatchable, which
* means that we can't fire any callbacks anyway.
*
* If a user does happen to register a handler on a non-
* fatal signal like SIGWINCH or something, and then
* exit, it'll end up firing `process.emit('exit')`, so
* the handler will be fired anyway.
*
* SIGBUS, SIGFPE, SIGSEGV and SIGILL, when not raised
* artificially, inherently leave the process in a
* state from which it is not safe to try and enter JS
* listeners.
*/
const signals = [];
signals.push("SIGHUP", "SIGINT", "SIGTERM");
if (process.platform !== "win32") signals.push("SIGALRM", "SIGABRT", "SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
if (process.platform === "linux") signals.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");

//#endregion
//#region ../../node_modules/.pnpm/signal-exit@4.1.0/node_modules/signal-exit/dist/mjs/index.js
const processOk = (process) => !!process && typeof process === "object" && typeof process.removeListener === "function" && typeof process.emit === "function" && typeof process.reallyExit === "function" && typeof process.listeners === "function" && typeof process.kill === "function" && typeof process.pid === "number" && typeof process.on === "function";
const kExitEmitter = Symbol.for("signal-exit emitter");
const global$1 = globalThis;
const ObjectDefineProperty = Object.defineProperty.bind(Object);
var Emitter = class {
	emitted = {
		afterExit: false,
		exit: false
	};
	listeners = {
		afterExit: [],
		exit: []
	};
	count = 0;
	id = Math.random();
	constructor() {
		if (global$1[kExitEmitter]) return global$1[kExitEmitter];
		ObjectDefineProperty(global$1, kExitEmitter, {
			value: this,
			writable: false,
			enumerable: false,
			configurable: false
		});
	}
	on(ev, fn) {
		this.listeners[ev].push(fn);
	}
	removeListener(ev, fn) {
		const list = this.listeners[ev];
		const i = list.indexOf(fn);
		/* c8 ignore start */
		if (i === -1) return;
		/* c8 ignore stop */
		if (i === 0 && list.length === 1) list.length = 0;
		else list.splice(i, 1);
	}
	emit(ev, code, signal) {
		if (this.emitted[ev]) return false;
		this.emitted[ev] = true;
		let ret = false;
		for (const fn of this.listeners[ev]) ret = fn(code, signal) === true || ret;
		if (ev === "exit") ret = this.emit("afterExit", code, signal) || ret;
		return ret;
	}
};
var SignalExitBase = class {};
const signalExitWrap = (handler) => {
	return {
		onExit(cb, opts) {
			return handler.onExit(cb, opts);
		},
		load() {
			return handler.load();
		},
		unload() {
			return handler.unload();
		}
	};
};
var SignalExitFallback = class extends SignalExitBase {
	onExit() {
		return () => {};
	}
	load() {}
	unload() {}
};
var SignalExit = class extends SignalExitBase {
	/* c8 ignore start */
	#hupSig = process$2.platform === "win32" ? "SIGINT" : "SIGHUP";
	/* c8 ignore stop */
	#emitter = new Emitter();
	#process;
	#originalProcessEmit;
	#originalProcessReallyExit;
	#sigListeners = {};
	#loaded = false;
	constructor(process) {
		super();
		this.#process = process;
		this.#sigListeners = {};
		for (const sig of signals) this.#sigListeners[sig] = () => {
			const listeners = this.#process.listeners(sig);
			let { count } = this.#emitter;
			/* c8 ignore start */
			const p = process;
			if (typeof p.__signal_exit_emitter__ === "object" && typeof p.__signal_exit_emitter__.count === "number") count += p.__signal_exit_emitter__.count;
			/* c8 ignore stop */
			if (listeners.length === count) {
				this.unload();
				const ret = this.#emitter.emit("exit", null, sig);
				/* c8 ignore start */
				const s = sig === "SIGHUP" ? this.#hupSig : sig;
				if (!ret) process.kill(process.pid, s);
			}
		};
		this.#originalProcessReallyExit = process.reallyExit;
		this.#originalProcessEmit = process.emit;
	}
	onExit(cb, opts) {
		/* c8 ignore start */
		if (!processOk(this.#process)) return () => {};
		/* c8 ignore stop */
		if (this.#loaded === false) this.load();
		const ev = opts?.alwaysLast ? "afterExit" : "exit";
		this.#emitter.on(ev, cb);
		return () => {
			this.#emitter.removeListener(ev, cb);
			if (this.#emitter.listeners["exit"].length === 0 && this.#emitter.listeners["afterExit"].length === 0) this.unload();
		};
	}
	load() {
		if (this.#loaded) return;
		this.#loaded = true;
		this.#emitter.count += 1;
		for (const sig of signals) try {
			const fn = this.#sigListeners[sig];
			if (fn) this.#process.on(sig, fn);
		} catch (_) {}
		this.#process.emit = (ev, ...a) => {
			return this.#processEmit(ev, ...a);
		};
		this.#process.reallyExit = (code) => {
			return this.#processReallyExit(code);
		};
	}
	unload() {
		if (!this.#loaded) return;
		this.#loaded = false;
		signals.forEach((sig) => {
			const listener = this.#sigListeners[sig];
			/* c8 ignore start */
			if (!listener) throw new Error("Listener not defined for signal: " + sig);
			/* c8 ignore stop */
			try {
				this.#process.removeListener(sig, listener);
			} catch (_) {}
			/* c8 ignore stop */
		});
		this.#process.emit = this.#originalProcessEmit;
		this.#process.reallyExit = this.#originalProcessReallyExit;
		this.#emitter.count -= 1;
	}
	#processReallyExit(code) {
		/* c8 ignore start */
		if (!processOk(this.#process)) return 0;
		this.#process.exitCode = code || 0;
		/* c8 ignore stop */
		this.#emitter.emit("exit", this.#process.exitCode, null);
		return this.#originalProcessReallyExit.call(this.#process, this.#process.exitCode);
	}
	#processEmit(ev, ...args) {
		const og = this.#originalProcessEmit;
		if (ev === "exit" && processOk(this.#process)) {
			if (typeof args[0] === "number") this.#process.exitCode = args[0];
			/* c8 ignore start */
			const ret = og.call(this.#process, ev, ...args);
			/* c8 ignore start */
			this.#emitter.emit("exit", this.#process.exitCode, null);
			/* c8 ignore stop */
			return ret;
		} else return og.call(this.#process, ev, ...args);
	}
};
const process$2 = globalThis.process;
const { onExit, load, unload } = signalExitWrap(processOk(process$2) ? new SignalExit(process$2) : new SignalExitFallback());

//#endregion
//#region ../../node_modules/.pnpm/execa@8.0.1/node_modules/execa/lib/kill.js
const DEFAULT_FORCE_KILL_TIMEOUT = 1e3 * 5;
const spawnedKill = (kill, signal = "SIGTERM", options = {}) => {
	const killResult = kill(signal);
	setKillTimeout(kill, signal, options, killResult);
	return killResult;
};
const setKillTimeout = (kill, signal, options, killResult) => {
	if (!shouldForceKill(signal, options, killResult)) return;
	const timeout = getForceKillAfterTimeout(options);
	const t = setTimeout(() => {
		kill("SIGKILL");
	}, timeout);
	// istanbul ignore else
	if (t.unref) t.unref();
};
const shouldForceKill = (signal, { forceKillAfterTimeout }, killResult) => isSigterm(signal) && forceKillAfterTimeout !== false && killResult;
const isSigterm = (signal) => signal === os.constants.signals.SIGTERM || typeof signal === "string" && signal.toUpperCase() === "SIGTERM";
const getForceKillAfterTimeout = ({ forceKillAfterTimeout = true }) => {
	if (forceKillAfterTimeout === true) return DEFAULT_FORCE_KILL_TIMEOUT;
	if (!Number.isFinite(forceKillAfterTimeout) || forceKillAfterTimeout < 0) throw new TypeError(`Expected the \`forceKillAfterTimeout\` option to be a non-negative integer, got \`${forceKillAfterTimeout}\` (${typeof forceKillAfterTimeout})`);
	return forceKillAfterTimeout;
};
const spawnedCancel = (spawned, context) => {
	if (spawned.kill()) context.isCanceled = true;
};
const timeoutKill = (spawned, signal, reject) => {
	spawned.kill(signal);
	reject(Object.assign(/* @__PURE__ */ new Error("Timed out"), {
		timedOut: true,
		signal
	}));
};
const setupTimeout = (spawned, { timeout, killSignal = "SIGTERM" }, spawnedPromise) => {
	if (timeout === 0 || timeout === void 0) return spawnedPromise;
	let timeoutId;
	const timeoutPromise = new Promise((resolve, reject) => {
		timeoutId = setTimeout(() => {
			timeoutKill(spawned, killSignal, reject);
		}, timeout);
	});
	const safeSpawnedPromise = spawnedPromise.finally(() => {
		clearTimeout(timeoutId);
	});
	return Promise.race([timeoutPromise, safeSpawnedPromise]);
};
const validateTimeout = ({ timeout }) => {
	if (timeout !== void 0 && (!Number.isFinite(timeout) || timeout < 0)) throw new TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${timeout}\` (${typeof timeout})`);
};
const setExitHandler = async (spawned, { cleanup, detached }, timedPromise) => {
	if (!cleanup || detached) return timedPromise;
	const removeExitHandler = onExit(() => {
		spawned.kill();
	});
	return timedPromise.finally(() => {
		removeExitHandler();
	});
};

//#endregion
//#region ../../node_modules/.pnpm/is-stream@3.0.0/node_modules/is-stream/index.js
function isStream(stream) {
	return stream !== null && typeof stream === "object" && typeof stream.pipe === "function";
}
function isWritableStream(stream) {
	return isStream(stream) && stream.writable !== false && typeof stream._write === "function" && typeof stream._writableState === "object";
}

//#endregion
//#region ../../node_modules/.pnpm/execa@8.0.1/node_modules/execa/lib/pipe.js
const isExecaChildProcess = (target) => target instanceof ChildProcess && typeof target.then === "function";
const pipeToTarget = (spawned, streamName, target) => {
	if (typeof target === "string") {
		spawned[streamName].pipe(createWriteStream(target));
		return spawned;
	}
	if (isWritableStream(target)) {
		spawned[streamName].pipe(target);
		return spawned;
	}
	if (!isExecaChildProcess(target)) throw new TypeError("The second argument must be a string, a stream or an Execa child process.");
	if (!isWritableStream(target.stdin)) throw new TypeError("The target child process's stdin must be available.");
	spawned[streamName].pipe(target.stdin);
	return target;
};
const addPipeMethods = (spawned) => {
	if (spawned.stdout !== null) spawned.pipeStdout = pipeToTarget.bind(void 0, spawned, "stdout");
	if (spawned.stderr !== null) spawned.pipeStderr = pipeToTarget.bind(void 0, spawned, "stderr");
	if (spawned.all !== void 0) spawned.pipeAll = pipeToTarget.bind(void 0, spawned, "all");
};

//#endregion
//#region ../../node_modules/.pnpm/get-stream@8.0.1/node_modules/get-stream/source/contents.js
const getStreamContents = async (stream, { init, convertChunk, getSize, truncateChunk, addChunk, getFinalChunk, finalize }, { maxBuffer = Number.POSITIVE_INFINITY } = {}) => {
	if (!isAsyncIterable(stream)) throw new Error("The first argument must be a Readable, a ReadableStream, or an async iterable.");
	const state = init();
	state.length = 0;
	try {
		for await (const chunk of stream) appendChunk({
			convertedChunk: convertChunk[getChunkType(chunk)](chunk, state),
			state,
			getSize,
			truncateChunk,
			addChunk,
			maxBuffer
		});
		appendFinalChunk({
			state,
			convertChunk,
			getSize,
			truncateChunk,
			addChunk,
			getFinalChunk,
			maxBuffer
		});
		return finalize(state);
	} catch (error) {
		error.bufferedData = finalize(state);
		throw error;
	}
};
const appendFinalChunk = ({ state, getSize, truncateChunk, addChunk, getFinalChunk, maxBuffer }) => {
	const convertedChunk = getFinalChunk(state);
	if (convertedChunk !== void 0) appendChunk({
		convertedChunk,
		state,
		getSize,
		truncateChunk,
		addChunk,
		maxBuffer
	});
};
const appendChunk = ({ convertedChunk, state, getSize, truncateChunk, addChunk, maxBuffer }) => {
	const chunkSize = getSize(convertedChunk);
	const newLength = state.length + chunkSize;
	if (newLength <= maxBuffer) {
		addNewChunk(convertedChunk, state, addChunk, newLength);
		return;
	}
	const truncatedChunk = truncateChunk(convertedChunk, maxBuffer - state.length);
	if (truncatedChunk !== void 0) addNewChunk(truncatedChunk, state, addChunk, maxBuffer);
	throw new MaxBufferError();
};
const addNewChunk = (convertedChunk, state, addChunk, newLength) => {
	state.contents = addChunk(convertedChunk, state, newLength);
	state.length = newLength;
};
const isAsyncIterable = (stream) => typeof stream === "object" && stream !== null && typeof stream[Symbol.asyncIterator] === "function";
const getChunkType = (chunk) => {
	const typeOfChunk = typeof chunk;
	if (typeOfChunk === "string") return "string";
	if (typeOfChunk !== "object" || chunk === null) return "others";
	if (globalThis.Buffer?.isBuffer(chunk)) return "buffer";
	const prototypeName = objectToString.call(chunk);
	if (prototypeName === "[object ArrayBuffer]") return "arrayBuffer";
	if (prototypeName === "[object DataView]") return "dataView";
	if (Number.isInteger(chunk.byteLength) && Number.isInteger(chunk.byteOffset) && objectToString.call(chunk.buffer) === "[object ArrayBuffer]") return "typedArray";
	return "others";
};
const { toString: objectToString } = Object.prototype;
var MaxBufferError = class extends Error {
	name = "MaxBufferError";
	constructor() {
		super("maxBuffer exceeded");
	}
};

//#endregion
//#region ../../node_modules/.pnpm/get-stream@8.0.1/node_modules/get-stream/source/utils.js
const identity = (value) => value;
const noop = () => void 0;
const getContentsProp = ({ contents }) => contents;
const throwObjectStream = (chunk) => {
	throw new Error(`Streams in object mode are not supported: ${String(chunk)}`);
};
const getLengthProp = (convertedChunk) => convertedChunk.length;

//#endregion
//#region ../../node_modules/.pnpm/get-stream@8.0.1/node_modules/get-stream/source/array-buffer.js
async function getStreamAsArrayBuffer(stream, options) {
	return getStreamContents(stream, arrayBufferMethods, options);
}
const initArrayBuffer = () => ({ contents: /* @__PURE__ */ new ArrayBuffer(0) });
const useTextEncoder = (chunk) => textEncoder.encode(chunk);
const textEncoder = new TextEncoder();
const useUint8Array = (chunk) => new Uint8Array(chunk);
const useUint8ArrayWithOffset = (chunk) => new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength);
const truncateArrayBufferChunk = (convertedChunk, chunkSize) => convertedChunk.slice(0, chunkSize);
const addArrayBufferChunk = (convertedChunk, { contents, length: previousLength }, length) => {
	const newContents = hasArrayBufferResize() ? resizeArrayBuffer(contents, length) : resizeArrayBufferSlow(contents, length);
	new Uint8Array(newContents).set(convertedChunk, previousLength);
	return newContents;
};
const resizeArrayBufferSlow = (contents, length) => {
	if (length <= contents.byteLength) return contents;
	const arrayBuffer = new ArrayBuffer(getNewContentsLength(length));
	new Uint8Array(arrayBuffer).set(new Uint8Array(contents), 0);
	return arrayBuffer;
};
const resizeArrayBuffer = (contents, length) => {
	if (length <= contents.maxByteLength) {
		contents.resize(length);
		return contents;
	}
	const arrayBuffer = new ArrayBuffer(length, { maxByteLength: getNewContentsLength(length) });
	new Uint8Array(arrayBuffer).set(new Uint8Array(contents), 0);
	return arrayBuffer;
};
const getNewContentsLength = (length) => SCALE_FACTOR ** Math.ceil(Math.log(length) / Math.log(SCALE_FACTOR));
const SCALE_FACTOR = 2;
const finalizeArrayBuffer = ({ contents, length }) => hasArrayBufferResize() ? contents : contents.slice(0, length);
const hasArrayBufferResize = () => "resize" in ArrayBuffer.prototype;
const arrayBufferMethods = {
	init: initArrayBuffer,
	convertChunk: {
		string: useTextEncoder,
		buffer: useUint8Array,
		arrayBuffer: useUint8Array,
		dataView: useUint8ArrayWithOffset,
		typedArray: useUint8ArrayWithOffset,
		others: throwObjectStream
	},
	getSize: getLengthProp,
	truncateChunk: truncateArrayBufferChunk,
	addChunk: addArrayBufferChunk,
	getFinalChunk: noop,
	finalize: finalizeArrayBuffer
};

//#endregion
//#region ../../node_modules/.pnpm/get-stream@8.0.1/node_modules/get-stream/source/buffer.js
async function getStreamAsBuffer(stream, options) {
	if (!("Buffer" in globalThis)) throw new Error("getStreamAsBuffer() is only supported in Node.js");
	try {
		return arrayBufferToNodeBuffer(await getStreamAsArrayBuffer(stream, options));
	} catch (error) {
		if (error.bufferedData !== void 0) error.bufferedData = arrayBufferToNodeBuffer(error.bufferedData);
		throw error;
	}
}
const arrayBufferToNodeBuffer = (arrayBuffer) => globalThis.Buffer.from(arrayBuffer);

//#endregion
//#region ../../node_modules/.pnpm/get-stream@8.0.1/node_modules/get-stream/source/string.js
async function getStreamAsString(stream, options) {
	return getStreamContents(stream, stringMethods, options);
}
const initString = () => ({
	contents: "",
	textDecoder: new TextDecoder()
});
const useTextDecoder = (chunk, { textDecoder }) => textDecoder.decode(chunk, { stream: true });
const addStringChunk = (convertedChunk, { contents }) => contents + convertedChunk;
const truncateStringChunk = (convertedChunk, chunkSize) => convertedChunk.slice(0, chunkSize);
const getFinalStringChunk = ({ textDecoder }) => {
	const finalChunk = textDecoder.decode();
	return finalChunk === "" ? void 0 : finalChunk;
};
const stringMethods = {
	init: initString,
	convertChunk: {
		string: identity,
		buffer: useTextDecoder,
		arrayBuffer: useTextDecoder,
		dataView: useTextDecoder,
		typedArray: useTextDecoder,
		others: throwObjectStream
	},
	getSize: getLengthProp,
	truncateChunk: truncateStringChunk,
	addChunk: addStringChunk,
	getFinalChunk: getFinalStringChunk,
	finalize: getContentsProp
};

//#endregion
//#region ../../node_modules/.pnpm/merge-stream@2.0.0/node_modules/merge-stream/index.js
var require_merge_stream = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { PassThrough } = __require("stream");
	module.exports = function() {
		var sources = [];
		var output = new PassThrough({ objectMode: true });
		output.setMaxListeners(0);
		output.add = add;
		output.isEmpty = isEmpty;
		output.on("unpipe", remove);
		Array.prototype.slice.call(arguments).forEach(add);
		return output;
		function add(source) {
			if (Array.isArray(source)) {
				source.forEach(add);
				return this;
			}
			sources.push(source);
			source.once("end", remove.bind(null, source));
			source.once("error", output.emit.bind(output, "error"));
			source.pipe(output, { end: false });
			return this;
		}
		function isEmpty() {
			return sources.length == 0;
		}
		function remove(source) {
			sources = sources.filter(function(it) {
				return it !== source;
			});
			if (!sources.length && output.readable) output.end();
		}
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/execa@8.0.1/node_modules/execa/lib/stream.js
var import_merge_stream = /* @__PURE__ */ __toESM(require_merge_stream(), 1);
const validateInputOptions = (input) => {
	if (input !== void 0) throw new TypeError("The `input` and `inputFile` options cannot be both set.");
};
const getInputSync = ({ input, inputFile }) => {
	if (typeof inputFile !== "string") return input;
	validateInputOptions(input);
	return readFileSync(inputFile);
};
const handleInputSync = (options) => {
	const input = getInputSync(options);
	if (isStream(input)) throw new TypeError("The `input` option cannot be a stream in sync mode");
	return input;
};
const getInput = ({ input, inputFile }) => {
	if (typeof inputFile !== "string") return input;
	validateInputOptions(input);
	return createReadStream(inputFile);
};
const handleInput = (spawned, options) => {
	const input = getInput(options);
	if (input === void 0) return;
	if (isStream(input)) input.pipe(spawned.stdin);
	else spawned.stdin.end(input);
};
const makeAllStream = (spawned, { all }) => {
	if (!all || !spawned.stdout && !spawned.stderr) return;
	const mixed = (0, import_merge_stream.default)();
	if (spawned.stdout) mixed.add(spawned.stdout);
	if (spawned.stderr) mixed.add(spawned.stderr);
	return mixed;
};
const getBufferedData = async (stream, streamPromise) => {
	if (!stream || streamPromise === void 0) return;
	await setTimeout$1(0);
	stream.destroy();
	try {
		return await streamPromise;
	} catch (error) {
		return error.bufferedData;
	}
};
const getStreamPromise = (stream, { encoding, buffer, maxBuffer }) => {
	if (!stream || !buffer) return;
	if (encoding === "utf8" || encoding === "utf-8") return getStreamAsString(stream, { maxBuffer });
	if (encoding === null || encoding === "buffer") return getStreamAsBuffer(stream, { maxBuffer });
	return applyEncoding(stream, maxBuffer, encoding);
};
const applyEncoding = async (stream, maxBuffer, encoding) => {
	return (await getStreamAsBuffer(stream, { maxBuffer })).toString(encoding);
};
const getSpawnedResult = async ({ stdout, stderr, all }, { encoding, buffer, maxBuffer }, processDone) => {
	const stdoutPromise = getStreamPromise(stdout, {
		encoding,
		buffer,
		maxBuffer
	});
	const stderrPromise = getStreamPromise(stderr, {
		encoding,
		buffer,
		maxBuffer
	});
	const allPromise = getStreamPromise(all, {
		encoding,
		buffer,
		maxBuffer: maxBuffer * 2
	});
	try {
		return await Promise.all([
			processDone,
			stdoutPromise,
			stderrPromise,
			allPromise
		]);
	} catch (error) {
		return Promise.all([
			{
				error,
				signal: error.signal,
				timedOut: error.timedOut
			},
			getBufferedData(stdout, stdoutPromise),
			getBufferedData(stderr, stderrPromise),
			getBufferedData(all, allPromise)
		]);
	}
};

//#endregion
//#region ../../node_modules/.pnpm/execa@8.0.1/node_modules/execa/lib/promise.js
const nativePromisePrototype = (async () => {})().constructor.prototype;
const descriptors = [
	"then",
	"catch",
	"finally"
].map((property) => [property, Reflect.getOwnPropertyDescriptor(nativePromisePrototype, property)]);
const mergePromise = (spawned, promise) => {
	for (const [property, descriptor] of descriptors) {
		const value = typeof promise === "function" ? (...args) => Reflect.apply(descriptor.value, promise(), args) : descriptor.value.bind(promise);
		Reflect.defineProperty(spawned, property, {
			...descriptor,
			value
		});
	}
};
const getSpawnedPromise = (spawned) => new Promise((resolve, reject) => {
	spawned.on("exit", (exitCode, signal) => {
		resolve({
			exitCode,
			signal
		});
	});
	spawned.on("error", (error) => {
		reject(error);
	});
	if (spawned.stdin) spawned.stdin.on("error", (error) => {
		reject(error);
	});
});

//#endregion
//#region ../../node_modules/.pnpm/execa@8.0.1/node_modules/execa/lib/command.js
const normalizeArgs = (file, args = []) => {
	if (!Array.isArray(args)) return [file];
	return [file, ...args];
};
const NO_ESCAPE_REGEXP = /^[\w.-]+$/;
const escapeArg = (arg) => {
	if (typeof arg !== "string" || NO_ESCAPE_REGEXP.test(arg)) return arg;
	return `"${arg.replaceAll("\"", "\\\"")}"`;
};
const joinCommand = (file, args) => normalizeArgs(file, args).join(" ");
const getEscapedCommand = (file, args) => normalizeArgs(file, args).map((arg) => escapeArg(arg)).join(" ");
const SPACES_REGEXP = / +/g;
const parseExpression = (expression) => {
	const typeOfExpression = typeof expression;
	if (typeOfExpression === "string") return expression;
	if (typeOfExpression === "number") return String(expression);
	if (typeOfExpression === "object" && expression !== null && !(expression instanceof ChildProcess) && "stdout" in expression) {
		const typeOfStdout = typeof expression.stdout;
		if (typeOfStdout === "string") return expression.stdout;
		if (Buffer$1.isBuffer(expression.stdout)) return expression.stdout.toString();
		throw new TypeError(`Unexpected "${typeOfStdout}" stdout in template expression`);
	}
	throw new TypeError(`Unexpected "${typeOfExpression}" in template expression`);
};
const concatTokens = (tokens, nextTokens, isNew) => isNew || tokens.length === 0 || nextTokens.length === 0 ? [...tokens, ...nextTokens] : [
	...tokens.slice(0, -1),
	`${tokens.at(-1)}${nextTokens[0]}`,
	...nextTokens.slice(1)
];
const parseTemplate = ({ templates, expressions, tokens, index, template }) => {
	const templateString = template ?? templates.raw[index];
	const newTokens = concatTokens(tokens, templateString.split(SPACES_REGEXP).filter(Boolean), templateString.startsWith(" "));
	if (index === expressions.length) return newTokens;
	const expression = expressions[index];
	return concatTokens(newTokens, Array.isArray(expression) ? expression.map((expression) => parseExpression(expression)) : [parseExpression(expression)], templateString.endsWith(" "));
};
const parseTemplates = (templates, expressions) => {
	let tokens = [];
	for (const [index, template] of templates.entries()) tokens = parseTemplate({
		templates,
		expressions,
		tokens,
		index,
		template
	});
	return tokens;
};

//#endregion
//#region ../../node_modules/.pnpm/execa@8.0.1/node_modules/execa/lib/verbose.js
const verboseDefault = debuglog("execa").enabled;
const padField = (field, padding) => String(field).padStart(padding, "0");
const getTimestamp = () => {
	const date = /* @__PURE__ */ new Date();
	return `${padField(date.getHours(), 2)}:${padField(date.getMinutes(), 2)}:${padField(date.getSeconds(), 2)}.${padField(date.getMilliseconds(), 3)}`;
};
const logCommand = (escapedCommand, { verbose }) => {
	if (!verbose) return;
	process$1.stderr.write(`[${getTimestamp()}] ${escapedCommand}\n`);
};

//#endregion
//#region ../../node_modules/.pnpm/execa@8.0.1/node_modules/execa/index.js
const DEFAULT_MAX_BUFFER = 1e3 * 1e3 * 100;
const getEnv = ({ env: envOption, extendEnv, preferLocal, localDir, execPath }) => {
	const env = extendEnv ? {
		...process$1.env,
		...envOption
	} : envOption;
	if (preferLocal) return npmRunPathEnv({
		env,
		cwd: localDir,
		execPath
	});
	return env;
};
const handleArguments = (file, args, options = {}) => {
	const parsed = import_cross_spawn.default._parse(file, args, options);
	file = parsed.command;
	args = parsed.args;
	options = parsed.options;
	options = {
		maxBuffer: DEFAULT_MAX_BUFFER,
		buffer: true,
		stripFinalNewline: true,
		extendEnv: true,
		preferLocal: false,
		localDir: options.cwd || process$1.cwd(),
		execPath: process$1.execPath,
		encoding: "utf8",
		reject: true,
		cleanup: true,
		all: false,
		windowsHide: true,
		verbose: verboseDefault,
		...options
	};
	options.env = getEnv(options);
	options.stdio = normalizeStdio(options);
	if (process$1.platform === "win32" && path.basename(file, ".exe") === "cmd") args.unshift("/q");
	return {
		file,
		args,
		options,
		parsed
	};
};
const handleOutput = (options, value, error) => {
	if (typeof value !== "string" && !Buffer$1.isBuffer(value)) return error === void 0 ? void 0 : "";
	if (options.stripFinalNewline) return stripFinalNewline(value);
	return value;
};
function execa(file, args, options) {
	const parsed = handleArguments(file, args, options);
	const command = joinCommand(file, args);
	const escapedCommand = getEscapedCommand(file, args);
	logCommand(escapedCommand, parsed.options);
	validateTimeout(parsed.options);
	let spawned;
	try {
		spawned = childProcess.spawn(parsed.file, parsed.args, parsed.options);
	} catch (error) {
		const dummySpawned = new childProcess.ChildProcess();
		mergePromise(dummySpawned, Promise.reject(makeError$1({
			error,
			stdout: "",
			stderr: "",
			all: "",
			command,
			escapedCommand,
			parsed,
			timedOut: false,
			isCanceled: false,
			killed: false
		})));
		return dummySpawned;
	}
	const spawnedPromise = getSpawnedPromise(spawned);
	const timedPromise = setupTimeout(spawned, parsed.options, spawnedPromise);
	const processDone = setExitHandler(spawned, parsed.options, timedPromise);
	const context = { isCanceled: false };
	spawned.kill = spawnedKill.bind(null, spawned.kill.bind(spawned));
	spawned.cancel = spawnedCancel.bind(null, spawned, context);
	const handlePromise = async () => {
		const [{ error, exitCode, signal, timedOut }, stdoutResult, stderrResult, allResult] = await getSpawnedResult(spawned, parsed.options, processDone);
		const stdout = handleOutput(parsed.options, stdoutResult);
		const stderr = handleOutput(parsed.options, stderrResult);
		const all = handleOutput(parsed.options, allResult);
		if (error || exitCode !== 0 || signal !== null) {
			const returnedError = makeError$1({
				error,
				exitCode,
				signal,
				stdout,
				stderr,
				all,
				command,
				escapedCommand,
				parsed,
				timedOut,
				isCanceled: context.isCanceled || (parsed.options.signal ? parsed.options.signal.aborted : false),
				killed: spawned.killed
			});
			if (!parsed.options.reject) return returnedError;
			throw returnedError;
		}
		return {
			command,
			escapedCommand,
			exitCode: 0,
			stdout,
			stderr,
			all,
			failed: false,
			timedOut: false,
			isCanceled: false,
			killed: false
		};
	};
	const handlePromiseOnce = onetime(handlePromise);
	handleInput(spawned, parsed.options);
	spawned.all = makeAllStream(spawned, parsed.options);
	addPipeMethods(spawned);
	mergePromise(spawned, handlePromiseOnce);
	return spawned;
}
function execaSync(file, args, options) {
	const parsed = handleArguments(file, args, options);
	const command = joinCommand(file, args);
	const escapedCommand = getEscapedCommand(file, args);
	logCommand(escapedCommand, parsed.options);
	const input = handleInputSync(parsed.options);
	let result;
	try {
		result = childProcess.spawnSync(parsed.file, parsed.args, {
			...parsed.options,
			input
		});
	} catch (error) {
		throw makeError$1({
			error,
			stdout: "",
			stderr: "",
			all: "",
			command,
			escapedCommand,
			parsed,
			timedOut: false,
			isCanceled: false,
			killed: false
		});
	}
	const stdout = handleOutput(parsed.options, result.stdout, result.error);
	const stderr = handleOutput(parsed.options, result.stderr, result.error);
	if (result.error || result.status !== 0 || result.signal !== null) {
		const error = makeError$1({
			stdout,
			stderr,
			error: result.error,
			signal: result.signal,
			exitCode: result.status,
			command,
			escapedCommand,
			parsed,
			timedOut: result.error && result.error.code === "ETIMEDOUT",
			isCanceled: false,
			killed: result.signal !== null
		});
		if (!parsed.options.reject) return error;
		throw error;
	}
	return {
		command,
		escapedCommand,
		exitCode: 0,
		stdout,
		stderr,
		failed: false,
		timedOut: false,
		isCanceled: false,
		killed: false
	};
}
const normalizeScriptStdin = ({ input, inputFile, stdio }) => input === void 0 && inputFile === void 0 && stdio === void 0 ? { stdin: "inherit" } : {};
const normalizeScriptOptions = (options = {}) => ({
	preferLocal: true,
	...normalizeScriptStdin(options),
	...options
});
function create$(options) {
	function $(templatesOrOptions, ...expressions) {
		if (!Array.isArray(templatesOrOptions)) return create$({
			...options,
			...templatesOrOptions
		});
		const [file, ...args] = parseTemplates(templatesOrOptions, expressions);
		return execa(file, args, normalizeScriptOptions(options));
	}
	$.sync = (templates, ...expressions) => {
		if (!Array.isArray(templates)) throw new TypeError("Please use $(options).sync`command` instead of $.sync(options)`command`.");
		const [file, ...args] = parseTemplates(templates, expressions);
		return execaSync(file, args, normalizeScriptOptions(options));
	};
	return $;
}
const $ = create$();

//#endregion
//#region ../../node_modules/.pnpm/clipboardy@4.0.0/node_modules/clipboardy/lib/termux.js
const handler = (error) => {
	if (error.code === "ENOENT") throw new Error("Couldn't find the termux-api scripts. You can install them with: apt install termux-api");
	throw error;
};
const clipboard$4 = {
	async copy(options) {
		try {
			await execa("termux-clipboard-set", options);
		} catch (error) {
			handler(error);
		}
	},
	async paste(options) {
		try {
			const { stdout } = await execa("termux-clipboard-get", options);
			return stdout;
		} catch (error) {
			handler(error);
		}
	},
	copySync(options) {
		try {
			execaSync("termux-clipboard-set", options);
		} catch (error) {
			handler(error);
		}
	},
	pasteSync(options) {
		try {
			return execaSync("termux-clipboard-get", options).stdout;
		} catch (error) {
			handler(error);
		}
	}
};

//#endregion
//#region ../../node_modules/.pnpm/clipboardy@4.0.0/node_modules/clipboardy/lib/linux.js
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
const xsel = "xsel";
const xselFallback = path.join(__dirname$1, "../fallbacks/linux/xsel");
const copyArguments = ["--clipboard", "--input"];
const pasteArguments = ["--clipboard", "--output"];
const makeError = (xselError, fallbackError) => {
	let error;
	if (xselError.code === "ENOENT") error = /* @__PURE__ */ new Error("Couldn't find the `xsel` binary and fallback didn't work. On Debian/Ubuntu you can install xsel with: sudo apt install xsel");
	else {
		error = /* @__PURE__ */ new Error("Both xsel and fallback failed");
		error.xselError = xselError;
	}
	error.fallbackError = fallbackError;
	return error;
};
const xselWithFallback = async (argumentList, options) => {
	try {
		const { stdout } = await execa(xsel, argumentList, options);
		return stdout;
	} catch (xselError) {
		try {
			const { stdout } = await execa(xselFallback, argumentList, options);
			return stdout;
		} catch (fallbackError) {
			throw makeError(xselError, fallbackError);
		}
	}
};
const xselWithFallbackSync = (argumentList, options) => {
	try {
		return execaSync(xsel, argumentList, options).stdout;
	} catch (xselError) {
		try {
			return execaSync(xselFallback, argumentList, options).stdout;
		} catch (fallbackError) {
			throw makeError(xselError, fallbackError);
		}
	}
};
const clipboard$3 = {
	async copy(options) {
		await xselWithFallback(copyArguments, options);
	},
	copySync(options) {
		xselWithFallbackSync(copyArguments, options);
	},
	paste: (options) => xselWithFallback(pasteArguments, options),
	pasteSync: (options) => xselWithFallbackSync(pasteArguments, options)
};

//#endregion
//#region ../../node_modules/.pnpm/clipboardy@4.0.0/node_modules/clipboardy/lib/macos.js
const env = { LC_CTYPE: "UTF-8" };
const clipboard$2 = {
	copy: async (options) => execa("pbcopy", {
		...options,
		env
	}),
	async paste(options) {
		const { stdout } = await execa("pbpaste", {
			...options,
			env
		});
		return stdout;
	},
	copySync: (options) => execaSync("pbcopy", {
		...options,
		env
	}),
	pasteSync: (options) => execaSync("pbpaste", {
		...options,
		env
	}).stdout
};

//#endregion
//#region ../../node_modules/.pnpm/system-architecture@0.1.0/node_modules/system-architecture/index.js
const execFilePromises = promisify(childProcess.execFile);
function systemArchitectureSync() {
	const { arch, platform, env } = process$1;
	if (platform === "darwin" && arch === "x64") return childProcess.execFileSync("sysctl", ["-inq", "sysctl.proc_translated"], { encoding: "utf8" }).trim() === "1" ? "arm64" : "x64";
	if (arch === "arm64" || arch === "x64") return arch;
	if (platform === "win32" && Object.hasOwn(env, "PROCESSOR_ARCHITEW6432")) return "x64";
	if (platform === "linux") {
		if (childProcess.execFileSync("getconf", ["LONG_BIT"], { encoding: "utf8" }).trim() === "64") return "x64";
	}
	return arch;
}

//#endregion
//#region ../../node_modules/.pnpm/is64bit@2.0.0/node_modules/is64bit/index.js
const archtectures64bit = new Set([
	"arm64",
	"x64",
	"ppc64",
	"riscv64"
]);
function is64bitSync() {
	return archtectures64bit.has(systemArchitectureSync());
}

//#endregion
//#region ../../node_modules/.pnpm/clipboardy@4.0.0/node_modules/clipboardy/lib/windows.js
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const binarySuffix = is64bitSync() ? "x86_64" : "i686";
const windowBinaryPath = path.join(__dirname, `../fallbacks/windows/clipboard_${binarySuffix}.exe`);
const clipboard$1 = {
	copy: async (options) => execa(windowBinaryPath, ["--copy"], options),
	async paste(options) {
		const { stdout } = await execa(windowBinaryPath, ["--paste"], options);
		return stdout;
	},
	copySync: (options) => execaSync(windowBinaryPath, ["--copy"], options),
	pasteSync: (options) => execaSync(windowBinaryPath, ["--paste"], options).stdout
};

//#endregion
//#region ../../node_modules/.pnpm/clipboardy@4.0.0/node_modules/clipboardy/index.js
const platformLib = (() => {
	switch (process$1.platform) {
		case "darwin": return clipboard$2;
		case "win32": return clipboard$1;
		case "android":
			if (process$1.env.PREFIX !== "/data/data/com.termux/files/usr") throw new Error("You need to install Termux for this module to work on Android: https://termux.com");
			return clipboard$4;
		default:
			if (is_wsl_default) return clipboard$1;
			return clipboard$3;
	}
})();
const clipboard = {};
clipboard.write = async (text) => {
	if (typeof text !== "string") throw new TypeError(`Expected a string, got ${typeof text}`);
	await platformLib.copy({ input: text });
};
clipboard.read = async () => platformLib.paste({ stripFinalNewline: false });
clipboard.writeSync = (text) => {
	if (typeof text !== "string") throw new TypeError(`Expected a string, got ${typeof text}`);
	platformLib.copySync({ input: text });
};
clipboard.readSync = () => platformLib.pasteSync({ stripFinalNewline: false });

//#endregion
export { clipboard as default };