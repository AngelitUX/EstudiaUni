import { i as __require, t as __commonJSMin } from "./chunk-C8U8pIma.mjs";
import { n as require_picomatch, t as require_is_glob } from "./is-glob-DLHjFvAl.mjs";

//#region ../../node_modules/.pnpm/@parcel+watcher@2.5.6/node_modules/@parcel/watcher/wrapper.js
var require_wrapper = /* @__PURE__ */ __commonJSMin(((exports) => {
	const path = __require("path");
	const picomatch = require_picomatch();
	const isGlob = require_is_glob();
	function normalizeOptions(dir, opts = {}) {
		const { ignore, ...rest } = opts;
		if (Array.isArray(ignore)) {
			opts = { ...rest };
			for (const value of ignore) if (isGlob(value)) {
				if (!opts.ignoreGlobs) opts.ignoreGlobs = [];
				const regex = picomatch.makeRe(value, {
					dot: true,
					windows: process.platform === "win32"
				});
				opts.ignoreGlobs.push(regex.source);
			} else {
				if (!opts.ignorePaths) opts.ignorePaths = [];
				opts.ignorePaths.push(path.resolve(dir, value));
			}
		}
		return opts;
	}
	exports.createWrapper = (binding) => {
		return {
			writeSnapshot(dir, snapshot, opts) {
				return binding.writeSnapshot(path.resolve(dir), path.resolve(snapshot), normalizeOptions(dir, opts));
			},
			getEventsSince(dir, snapshot, opts) {
				return binding.getEventsSince(path.resolve(dir), path.resolve(snapshot), normalizeOptions(dir, opts));
			},
			async subscribe(dir, fn, opts) {
				dir = path.resolve(dir);
				opts = normalizeOptions(dir, opts);
				await binding.subscribe(dir, fn, opts);
				return { unsubscribe() {
					return binding.unsubscribe(dir, fn, opts);
				} };
			},
			unsubscribe(dir, fn, opts) {
				return binding.unsubscribe(path.resolve(dir), fn, normalizeOptions(dir, opts));
			}
		};
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/detect-libc@2.1.2/node_modules/detect-libc/lib/process.js
var require_process = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const isLinux = () => process.platform === "linux";
	let report = null;
	const getReport = () => {
		if (!report)
 /* istanbul ignore next */
		if (isLinux() && process.report) {
			const orig = process.report.excludeNetwork;
			process.report.excludeNetwork = true;
			report = process.report.getReport();
			process.report.excludeNetwork = orig;
		} else report = {};
		return report;
	};
	module.exports = {
		isLinux,
		getReport
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/detect-libc@2.1.2/node_modules/detect-libc/lib/filesystem.js
var require_filesystem = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const fs = __require("fs");
	const LDD_PATH = "/usr/bin/ldd";
	const SELF_PATH = "/proc/self/exe";
	const MAX_LENGTH = 2048;
	/**
	* Read the content of a file synchronous
	*
	* @param {string} path
	* @returns {Buffer}
	*/
	const readFileSync = (path) => {
		const fd = fs.openSync(path, "r");
		const buffer = Buffer.alloc(MAX_LENGTH);
		const bytesRead = fs.readSync(fd, buffer, 0, MAX_LENGTH, 0);
		fs.close(fd, () => {});
		return buffer.subarray(0, bytesRead);
	};
	/**
	* Read the content of a file
	*
	* @param {string} path
	* @returns {Promise<Buffer>}
	*/
	const readFile = (path) => new Promise((resolve, reject) => {
		fs.open(path, "r", (err, fd) => {
			if (err) reject(err);
			else {
				const buffer = Buffer.alloc(MAX_LENGTH);
				fs.read(fd, buffer, 0, MAX_LENGTH, 0, (_, bytesRead) => {
					resolve(buffer.subarray(0, bytesRead));
					fs.close(fd, () => {});
				});
			}
		});
	});
	module.exports = {
		LDD_PATH,
		SELF_PATH,
		readFileSync,
		readFile
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/detect-libc@2.1.2/node_modules/detect-libc/lib/elf.js
var require_elf = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const interpreterPath = (elf) => {
		if (elf.length < 64) return null;
		if (elf.readUInt32BE(0) !== 2135247942) return null;
		if (elf.readUInt8(4) !== 2) return null;
		if (elf.readUInt8(5) !== 1) return null;
		const offset = elf.readUInt32LE(32);
		const size = elf.readUInt16LE(54);
		const count = elf.readUInt16LE(56);
		for (let i = 0; i < count; i++) {
			const headerOffset = offset + i * size;
			if (elf.readUInt32LE(headerOffset) === 3) {
				const fileOffset = elf.readUInt32LE(headerOffset + 8);
				const fileSize = elf.readUInt32LE(headerOffset + 32);
				return elf.subarray(fileOffset, fileOffset + fileSize).toString().replace(/\0.*$/g, "");
			}
		}
		return null;
	};
	module.exports = { interpreterPath };
}));

//#endregion
//#region ../../node_modules/.pnpm/detect-libc@2.1.2/node_modules/detect-libc/lib/detect-libc.js
var require_detect_libc = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const childProcess = __require("child_process");
	const { isLinux, getReport } = require_process();
	const { LDD_PATH, SELF_PATH, readFile, readFileSync } = require_filesystem();
	const { interpreterPath } = require_elf();
	let cachedFamilyInterpreter;
	let cachedFamilyFilesystem;
	let cachedVersionFilesystem;
	const command = "getconf GNU_LIBC_VERSION 2>&1 || true; ldd --version 2>&1 || true";
	let commandOut = "";
	const safeCommand = () => {
		if (!commandOut) return new Promise((resolve) => {
			childProcess.exec(command, (err, out) => {
				commandOut = err ? " " : out;
				resolve(commandOut);
			});
		});
		return commandOut;
	};
	const safeCommandSync = () => {
		if (!commandOut) try {
			commandOut = childProcess.execSync(command, { encoding: "utf8" });
		} catch (_err) {
			commandOut = " ";
		}
		return commandOut;
	};
	/**
	* A String constant containing the value `glibc`.
	* @type {string}
	* @public
	*/
	const GLIBC = "glibc";
	/**
	* A Regexp constant to get the GLIBC Version.
	* @type {string}
	*/
	const RE_GLIBC_VERSION = /LIBC[a-z0-9 \-).]*?(\d+\.\d+)/i;
	/**
	* A String constant containing the value `musl`.
	* @type {string}
	* @public
	*/
	const MUSL = "musl";
	const isFileMusl = (f) => f.includes("libc.musl-") || f.includes("ld-musl-");
	const familyFromReport = () => {
		const report = getReport();
		if (report.header && report.header.glibcVersionRuntime) return GLIBC;
		if (Array.isArray(report.sharedObjects)) {
			if (report.sharedObjects.some(isFileMusl)) return MUSL;
		}
		return null;
	};
	const familyFromCommand = (out) => {
		const [getconf, ldd1] = out.split(/[\r\n]+/);
		if (getconf && getconf.includes(GLIBC)) return GLIBC;
		if (ldd1 && ldd1.includes(MUSL)) return MUSL;
		return null;
	};
	const familyFromInterpreterPath = (path) => {
		if (path) {
			if (path.includes("/ld-musl-")) return MUSL;
			else if (path.includes("/ld-linux-")) return GLIBC;
		}
		return null;
	};
	const getFamilyFromLddContent = (content) => {
		content = content.toString();
		if (content.includes("musl")) return MUSL;
		if (content.includes("GNU C Library")) return GLIBC;
		return null;
	};
	const familyFromFilesystem = async () => {
		if (cachedFamilyFilesystem !== void 0) return cachedFamilyFilesystem;
		cachedFamilyFilesystem = null;
		try {
			cachedFamilyFilesystem = getFamilyFromLddContent(await readFile(LDD_PATH));
		} catch (e) {}
		return cachedFamilyFilesystem;
	};
	const familyFromFilesystemSync = () => {
		if (cachedFamilyFilesystem !== void 0) return cachedFamilyFilesystem;
		cachedFamilyFilesystem = null;
		try {
			cachedFamilyFilesystem = getFamilyFromLddContent(readFileSync(LDD_PATH));
		} catch (e) {}
		return cachedFamilyFilesystem;
	};
	const familyFromInterpreter = async () => {
		if (cachedFamilyInterpreter !== void 0) return cachedFamilyInterpreter;
		cachedFamilyInterpreter = null;
		try {
			cachedFamilyInterpreter = familyFromInterpreterPath(interpreterPath(await readFile(SELF_PATH)));
		} catch (e) {}
		return cachedFamilyInterpreter;
	};
	const familyFromInterpreterSync = () => {
		if (cachedFamilyInterpreter !== void 0) return cachedFamilyInterpreter;
		cachedFamilyInterpreter = null;
		try {
			cachedFamilyInterpreter = familyFromInterpreterPath(interpreterPath(readFileSync(SELF_PATH)));
		} catch (e) {}
		return cachedFamilyInterpreter;
	};
	/**
	* Resolves with the libc family when it can be determined, `null` otherwise.
	* @returns {Promise<?string>}
	*/
	const family = async () => {
		let family = null;
		if (isLinux()) {
			family = await familyFromInterpreter();
			if (!family) {
				family = await familyFromFilesystem();
				if (!family) family = familyFromReport();
				if (!family) family = familyFromCommand(await safeCommand());
			}
		}
		return family;
	};
	/**
	* Returns the libc family when it can be determined, `null` otherwise.
	* @returns {?string}
	*/
	const familySync = () => {
		let family = null;
		if (isLinux()) {
			family = familyFromInterpreterSync();
			if (!family) {
				family = familyFromFilesystemSync();
				if (!family) family = familyFromReport();
				if (!family) family = familyFromCommand(safeCommandSync());
			}
		}
		return family;
	};
	/**
	* Resolves `true` only when the platform is Linux and the libc family is not `glibc`.
	* @returns {Promise<boolean>}
	*/
	const isNonGlibcLinux = async () => isLinux() && await family() !== GLIBC;
	/**
	* Returns `true` only when the platform is Linux and the libc family is not `glibc`.
	* @returns {boolean}
	*/
	const isNonGlibcLinuxSync = () => isLinux() && familySync() !== GLIBC;
	const versionFromFilesystem = async () => {
		if (cachedVersionFilesystem !== void 0) return cachedVersionFilesystem;
		cachedVersionFilesystem = null;
		try {
			const versionMatch = (await readFile(LDD_PATH)).match(RE_GLIBC_VERSION);
			if (versionMatch) cachedVersionFilesystem = versionMatch[1];
		} catch (e) {}
		return cachedVersionFilesystem;
	};
	const versionFromFilesystemSync = () => {
		if (cachedVersionFilesystem !== void 0) return cachedVersionFilesystem;
		cachedVersionFilesystem = null;
		try {
			const versionMatch = readFileSync(LDD_PATH).match(RE_GLIBC_VERSION);
			if (versionMatch) cachedVersionFilesystem = versionMatch[1];
		} catch (e) {}
		return cachedVersionFilesystem;
	};
	const versionFromReport = () => {
		const report = getReport();
		if (report.header && report.header.glibcVersionRuntime) return report.header.glibcVersionRuntime;
		return null;
	};
	const versionSuffix = (s) => s.trim().split(/\s+/)[1];
	const versionFromCommand = (out) => {
		const [getconf, ldd1, ldd2] = out.split(/[\r\n]+/);
		if (getconf && getconf.includes(GLIBC)) return versionSuffix(getconf);
		if (ldd1 && ldd2 && ldd1.includes(MUSL)) return versionSuffix(ldd2);
		return null;
	};
	/**
	* Resolves with the libc version when it can be determined, `null` otherwise.
	* @returns {Promise<?string>}
	*/
	const version = async () => {
		let version = null;
		if (isLinux()) {
			version = await versionFromFilesystem();
			if (!version) version = versionFromReport();
			if (!version) version = versionFromCommand(await safeCommand());
		}
		return version;
	};
	/**
	* Returns the libc version when it can be determined, `null` otherwise.
	* @returns {?string}
	*/
	const versionSync = () => {
		let version = null;
		if (isLinux()) {
			version = versionFromFilesystemSync();
			if (!version) version = versionFromReport();
			if (!version) version = versionFromCommand(safeCommandSync());
		}
		return version;
	};
	module.exports = {
		GLIBC,
		MUSL,
		family,
		familySync,
		isNonGlibcLinux,
		isNonGlibcLinuxSync,
		version,
		versionSync
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/@parcel+watcher@2.5.6/node_modules/@parcel/watcher/index.js
var require_watcher = /* @__PURE__ */ __commonJSMin(((exports) => {
	const { createWrapper } = require_wrapper();
	let name = `@parcel/watcher-${process.platform}-${process.arch}`;
	if (process.platform === "linux") {
		const { MUSL, familySync } = require_detect_libc();
		if (familySync() === MUSL) name += "-musl";
		else name += "-glibc";
	}
	let binding;
	try {
		binding = __require(name);
	} catch (err) {
		handleError(err);
		try {
			binding = __require("./build/Release/watcher.node");
		} catch (err) {
			handleError(err);
			try {
				binding = __require("./build/Debug/watcher.node");
			} catch (err) {
				handleError(err);
				throw new Error(`No prebuild or local build of @parcel/watcher found. Tried ${name}. Please ensure it is installed (don't use --no-optional when installing with npm). Otherwise it is possible we don't support your platform yet. If this is the case, please report an issue to https://github.com/parcel-bundler/watcher.`);
			}
		}
	}
	function handleError(err) {
		if (err?.code !== "MODULE_NOT_FOUND") throw err;
	}
	const wrapper = createWrapper(binding);
	exports.writeSnapshot = wrapper.writeSnapshot;
	exports.getEventsSince = wrapper.getEventsSince;
	exports.subscribe = wrapper.subscribe;
	exports.unsubscribe = wrapper.unsubscribe;
}));

//#endregion
export default require_watcher();

export {  };