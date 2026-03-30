import "./consola.DXBYu-KD-BxkQ5_xB.mjs";
import { t as consola } from "./dist-DwEdCcyS.mjs";
import { existsSync } from "node:fs";

//#region ../../node_modules/.pnpm/untun@0.1.3/node_modules/untun/dist/index.mjs
async function startTunnel(opts) {
	const { installCloudflared, startCloudflaredTunnel, cloudflaredBinPath, cloudflaredNotice } = await import("./chunks-BxWMT0RV.mjs");
	const url = opts.url || `${opts.protocol || "http"}://${opts.hostname ?? "localhost"}:${opts.port ?? 3e3}`;
	consola.start(`Starting cloudflared tunnel to ${url}`);
	if (!existsSync(cloudflaredBinPath)) {
		consola.log(cloudflaredNotice);
		if (!(opts.acceptCloudflareNotice || process.env.UNTUN_ACCEPT_CLOUDFLARE_NOTICE || await consola.prompt(`Do you agree with the above terms and wish to install the binary from GitHub?`, { type: "confirm" }))) {
			consola.fail("Skipping tunnel setup.");
			return;
		}
		await installCloudflared();
	}
	const args = [["--url", url], opts.verifyTLS ? void 0 : ["--no-tls-verify", ""]].filter(Boolean);
	const tunnel = await startCloudflaredTunnel(Object.fromEntries(args));
	const cleanup = async () => {
		await tunnel.stop();
	};
	for (const signal of [
		"SIGINT",
		"SIGUSR1",
		"SIGUSR2"
	]) process.once(signal, cleanup);
	return {
		getURL: async () => await tunnel.url,
		close: async () => {
			await cleanup();
		}
	};
}

//#endregion
export { startTunnel };