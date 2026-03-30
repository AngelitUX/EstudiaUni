import { t as debug } from "./logger-DgyoxKia.mjs";
import { a as join } from "./pathe.M-eThtNZ-0R4k6vpe.mjs";
import { existsSync, promises } from "node:fs";

//#region src/utils/fs.ts
async function clearDir(path, exclude) {
	if (!exclude) await promises.rm(path, {
		recursive: true,
		force: true
	});
	else if (existsSync(path)) {
		const files = await promises.readdir(path);
		await Promise.all(files.map(async (name) => {
			if (!exclude.includes(name)) await promises.rm(join(path, name), {
				recursive: true,
				force: true
			});
		}));
	}
	await promises.mkdir(path, { recursive: true });
}
function clearBuildDir(path) {
	return clearDir(path, [
		"cache",
		"analyze",
		"nuxt.json"
	]);
}
async function rmRecursive(paths) {
	await Promise.all(paths.filter((p) => typeof p === "string").map(async (path) => {
		debug(`Removing recursive path: ${path}`);
		await promises.rm(path, {
			recursive: true,
			force: true
		}).catch(() => {});
	}));
}

//#endregion
export { clearDir as n, rmRecursive as r, clearBuildDir as t };