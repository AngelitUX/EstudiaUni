import { n as logger } from "./logger-DgyoxKia.mjs";
import { c as resolve, n as dirname } from "./pathe.M-eThtNZ-0R4k6vpe.mjs";
import { r as rmRecursive } from "./fs-DDhFmxBK.mjs";
import { createHash } from "node:crypto";
import { promises } from "node:fs";

//#region ../../node_modules/.pnpm/ohash@2.0.11/node_modules/ohash/dist/shared/ohash.D__AXeF1.mjs
function serialize(o) {
	return typeof o == "string" ? `'${o}'` : new c().serialize(o);
}
const c = /* @__PURE__ */ function() {
	class o {
		#t = /* @__PURE__ */ new Map();
		compare(t, r) {
			const e = typeof t, n = typeof r;
			return e === "string" && n === "string" ? t.localeCompare(r) : e === "number" && n === "number" ? t - r : String.prototype.localeCompare.call(this.serialize(t, true), this.serialize(r, true));
		}
		serialize(t, r) {
			if (t === null) return "null";
			switch (typeof t) {
				case "string": return r ? t : `'${t}'`;
				case "bigint": return `${t}n`;
				case "object": return this.$object(t);
				case "function": return this.$function(t);
			}
			return String(t);
		}
		serializeObject(t) {
			const r = Object.prototype.toString.call(t);
			if (r !== "[object Object]") return this.serializeBuiltInType(r.length < 10 ? `unknown:${r}` : r.slice(8, -1), t);
			const e = t.constructor, n = e === Object || e === void 0 ? "" : e.name;
			if (n !== "" && globalThis[n] === e) return this.serializeBuiltInType(n, t);
			if (typeof t.toJSON == "function") {
				const i = t.toJSON();
				return n + (i !== null && typeof i == "object" ? this.$object(i) : `(${this.serialize(i)})`);
			}
			return this.serializeObjectEntries(n, Object.entries(t));
		}
		serializeBuiltInType(t, r) {
			const e = this["$" + t];
			if (e) return e.call(this, r);
			if (typeof r?.entries == "function") return this.serializeObjectEntries(t, r.entries());
			throw new Error(`Cannot serialize ${t}`);
		}
		serializeObjectEntries(t, r) {
			const e = Array.from(r).sort((i, a) => this.compare(i[0], a[0]));
			let n = `${t}{`;
			for (let i = 0; i < e.length; i++) {
				const [a, l] = e[i];
				n += `${this.serialize(a, true)}:${this.serialize(l)}`, i < e.length - 1 && (n += ",");
			}
			return n + "}";
		}
		$object(t) {
			let r = this.#t.get(t);
			return r === void 0 && (this.#t.set(t, `#${this.#t.size}`), r = this.serializeObject(t), this.#t.set(t, r)), r;
		}
		$function(t) {
			const r = Function.prototype.toString.call(t);
			return r.slice(-15) === "[native code] }" ? `${t.name || ""}()[native]` : `${t.name}(${t.length})${r.replace(/\s*\n\s*/g, "")}`;
		}
		$Array(t) {
			let r = "[";
			for (let e = 0; e < t.length; e++) r += this.serialize(t[e]), e < t.length - 1 && (r += ",");
			return r + "]";
		}
		$Date(t) {
			try {
				return `Date(${t.toISOString()})`;
			} catch {
				return "Date(null)";
			}
		}
		$ArrayBuffer(t) {
			return `ArrayBuffer[${new Uint8Array(t).join(",")}]`;
		}
		$Set(t) {
			return `Set${this.$Array(Array.from(t).sort((r, e) => this.compare(r, e)))}`;
		}
		$Map(t) {
			return this.serializeObjectEntries("Map", t.entries());
		}
	}
	for (const s of [
		"Error",
		"RegExp",
		"URL"
	]) o.prototype["$" + s] = function(t) {
		return `${s}(${t})`;
	};
	for (const s of [
		"Int8Array",
		"Uint8Array",
		"Uint8ClampedArray",
		"Int16Array",
		"Uint16Array",
		"Int32Array",
		"Uint32Array",
		"Float32Array",
		"Float64Array"
	]) o.prototype["$" + s] = function(t) {
		return `${s}[${t.join(",")}]`;
	};
	for (const s of ["BigInt64Array", "BigUint64Array"]) o.prototype["$" + s] = function(t) {
		return `${s}[${t.join("n,")}${t.length > 0 ? "n" : ""}]`;
	};
	return o;
}();

//#endregion
//#region ../../node_modules/.pnpm/ohash@2.0.11/node_modules/ohash/dist/crypto/node/index.mjs
const e = globalThis.process?.getBuiltinModule?.("crypto")?.hash, r = "sha256", s = "base64url";
function digest(t) {
	if (e) return e(r, t, s);
	const o = createHash(r).update(t);
	return globalThis.process?.versions?.webcontainer ? o.digest().toString(s) : o.digest(s);
}

//#endregion
//#region ../../node_modules/.pnpm/ohash@2.0.11/node_modules/ohash/dist/index.mjs
function hash(input) {
	return digest(serialize(input));
}

//#endregion
//#region src/utils/nuxt.ts
const GIT_ID_RE = /\.([0-9a-f]{7,8})$/;
async function cleanupNuxtDirs(rootDir, buildDir) {
	logger.info("Cleaning up generated Nuxt files and caches...");
	await rmRecursive([
		buildDir,
		".output",
		"dist",
		"node_modules/.vite",
		"node_modules/.cache"
	].map((dir) => resolve(rootDir, dir)));
}
function nuxtVersionToGitIdentifier(version) {
	const id = GIT_ID_RE.exec(version);
	if (id?.[1]) return id[1];
	return `v${version}`;
}
function resolveNuxtManifest(nuxt) {
	const manifest = {
		_hash: null,
		project: { rootDir: nuxt.options.rootDir },
		versions: { nuxt: nuxt._version }
	};
	manifest._hash = hash(manifest);
	return manifest;
}
async function writeNuxtManifest(nuxt, manifest = resolveNuxtManifest(nuxt)) {
	const manifestPath = resolve(nuxt.options.buildDir, "nuxt.json");
	await promises.mkdir(dirname(manifestPath), { recursive: true });
	await promises.writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");
	return manifest;
}
async function loadNuxtManifest(buildDir) {
	const manifestPath = resolve(buildDir, "nuxt.json");
	return await promises.readFile(manifestPath, "utf-8").then((data) => JSON.parse(data)).catch(() => null);
}

//#endregion
export { writeNuxtManifest as a, resolveNuxtManifest as i, loadNuxtManifest as n, nuxtVersionToGitIdentifier as r, cleanupNuxtDirs as t };