import nodeCrypto from "node:crypto";

//#region ../../node_modules/.pnpm/uncrypto@0.1.3/node_modules/uncrypto/dist/crypto.node.mjs
const subtle = nodeCrypto.webcrypto?.subtle || {};
const randomUUID = () => {
	return nodeCrypto.randomUUID();
};

//#endregion
export { randomUUID as t };