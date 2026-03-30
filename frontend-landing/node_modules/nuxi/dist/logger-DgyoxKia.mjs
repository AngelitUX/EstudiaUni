import { a as __toCommonJS, i as __require, n as __esmMin, o as __toESM, r as __exportAll, t as __commonJSMin } from "./chunk-C8U8pIma.mjs";
import { dirname, join } from "node:path";
import process$1, { stdin, stdout } from "node:process";
import { stripVTControlCharacters, styleText } from "node:util";
import tty, { ReadStream } from "node:tty";
import * as k from "node:readline";
import c from "node:readline";
import { existsSync, lstatSync, readdirSync } from "node:fs";
import os from "node:os";

//#region ../../node_modules/.pnpm/sisteransi@1.0.5/node_modules/sisteransi/src/index.js
var require_src$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const ESC = "\x1B";
	const CSI = `${ESC}[`;
	const beep = "\x07";
	const cursor = {
		to(x, y) {
			if (!y) return `${CSI}${x + 1}G`;
			return `${CSI}${y + 1};${x + 1}H`;
		},
		move(x, y) {
			let ret = "";
			if (x < 0) ret += `${CSI}${-x}D`;
			else if (x > 0) ret += `${CSI}${x}C`;
			if (y < 0) ret += `${CSI}${-y}A`;
			else if (y > 0) ret += `${CSI}${y}B`;
			return ret;
		},
		up: (count = 1) => `${CSI}${count}A`,
		down: (count = 1) => `${CSI}${count}B`,
		forward: (count = 1) => `${CSI}${count}C`,
		backward: (count = 1) => `${CSI}${count}D`,
		nextLine: (count = 1) => `${CSI}E`.repeat(count),
		prevLine: (count = 1) => `${CSI}F`.repeat(count),
		left: `${CSI}G`,
		hide: `${CSI}?25l`,
		show: `${CSI}?25h`,
		save: `${ESC}7`,
		restore: `${ESC}8`
	};
	const scroll = {
		up: (count = 1) => `${CSI}S`.repeat(count),
		down: (count = 1) => `${CSI}T`.repeat(count)
	};
	const erase = {
		screen: `${CSI}2J`,
		up: (count = 1) => `${CSI}1J`.repeat(count),
		down: (count = 1) => `${CSI}J`.repeat(count),
		line: `${CSI}2K`,
		lineEnd: `${CSI}K`,
		lineStart: `${CSI}1K`,
		lines(count) {
			let clear = "";
			for (let i = 0; i < count; i++) clear += this.line + (i < count - 1 ? cursor.up() : "");
			if (count) clear += cursor.left;
			return clear;
		}
	};
	module.exports = {
		cursor,
		scroll,
		erase,
		beep
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/@clack+core@1.1.0/node_modules/@clack/core/dist/index.mjs
var import_src$1 = require_src$1();
function x$1(t, e, s) {
	if (!s.some((u) => !u.disabled)) return t;
	const i = t + e, r = Math.max(s.length - 1, 0), n = i < 0 ? r : i > r ? 0 : i;
	return s[n].disabled ? x$1(n, e < 0 ? -1 : 1, s) : n;
}
const at = (t) => t === 161 || t === 164 || t === 167 || t === 168 || t === 170 || t === 173 || t === 174 || t >= 176 && t <= 180 || t >= 182 && t <= 186 || t >= 188 && t <= 191 || t === 198 || t === 208 || t === 215 || t === 216 || t >= 222 && t <= 225 || t === 230 || t >= 232 && t <= 234 || t === 236 || t === 237 || t === 240 || t === 242 || t === 243 || t >= 247 && t <= 250 || t === 252 || t === 254 || t === 257 || t === 273 || t === 275 || t === 283 || t === 294 || t === 295 || t === 299 || t >= 305 && t <= 307 || t === 312 || t >= 319 && t <= 322 || t === 324 || t >= 328 && t <= 331 || t === 333 || t === 338 || t === 339 || t === 358 || t === 359 || t === 363 || t === 462 || t === 464 || t === 466 || t === 468 || t === 470 || t === 472 || t === 474 || t === 476 || t === 593 || t === 609 || t === 708 || t === 711 || t >= 713 && t <= 715 || t === 717 || t === 720 || t >= 728 && t <= 731 || t === 733 || t === 735 || t >= 768 && t <= 879 || t >= 913 && t <= 929 || t >= 931 && t <= 937 || t >= 945 && t <= 961 || t >= 963 && t <= 969 || t === 1025 || t >= 1040 && t <= 1103 || t === 1105 || t === 8208 || t >= 8211 && t <= 8214 || t === 8216 || t === 8217 || t === 8220 || t === 8221 || t >= 8224 && t <= 8226 || t >= 8228 && t <= 8231 || t === 8240 || t === 8242 || t === 8243 || t === 8245 || t === 8251 || t === 8254 || t === 8308 || t === 8319 || t >= 8321 && t <= 8324 || t === 8364 || t === 8451 || t === 8453 || t === 8457 || t === 8467 || t === 8470 || t === 8481 || t === 8482 || t === 8486 || t === 8491 || t === 8531 || t === 8532 || t >= 8539 && t <= 8542 || t >= 8544 && t <= 8555 || t >= 8560 && t <= 8569 || t === 8585 || t >= 8592 && t <= 8601 || t === 8632 || t === 8633 || t === 8658 || t === 8660 || t === 8679 || t === 8704 || t === 8706 || t === 8707 || t === 8711 || t === 8712 || t === 8715 || t === 8719 || t === 8721 || t === 8725 || t === 8730 || t >= 8733 && t <= 8736 || t === 8739 || t === 8741 || t >= 8743 && t <= 8748 || t === 8750 || t >= 8756 && t <= 8759 || t === 8764 || t === 8765 || t === 8776 || t === 8780 || t === 8786 || t === 8800 || t === 8801 || t >= 8804 && t <= 8807 || t === 8810 || t === 8811 || t === 8814 || t === 8815 || t === 8834 || t === 8835 || t === 8838 || t === 8839 || t === 8853 || t === 8857 || t === 8869 || t === 8895 || t === 8978 || t >= 9312 && t <= 9449 || t >= 9451 && t <= 9547 || t >= 9552 && t <= 9587 || t >= 9600 && t <= 9615 || t >= 9618 && t <= 9621 || t === 9632 || t === 9633 || t >= 9635 && t <= 9641 || t === 9650 || t === 9651 || t === 9654 || t === 9655 || t === 9660 || t === 9661 || t === 9664 || t === 9665 || t >= 9670 && t <= 9672 || t === 9675 || t >= 9678 && t <= 9681 || t >= 9698 && t <= 9701 || t === 9711 || t === 9733 || t === 9734 || t === 9737 || t === 9742 || t === 9743 || t === 9756 || t === 9758 || t === 9792 || t === 9794 || t === 9824 || t === 9825 || t >= 9827 && t <= 9829 || t >= 9831 && t <= 9834 || t === 9836 || t === 9837 || t === 9839 || t === 9886 || t === 9887 || t === 9919 || t >= 9926 && t <= 9933 || t >= 9935 && t <= 9939 || t >= 9941 && t <= 9953 || t === 9955 || t === 9960 || t === 9961 || t >= 9963 && t <= 9969 || t === 9972 || t >= 9974 && t <= 9977 || t === 9979 || t === 9980 || t === 9982 || t === 9983 || t === 10045 || t >= 10102 && t <= 10111 || t >= 11094 && t <= 11097 || t >= 12872 && t <= 12879 || t >= 57344 && t <= 63743 || t >= 65024 && t <= 65039 || t === 65533 || t >= 127232 && t <= 127242 || t >= 127248 && t <= 127277 || t >= 127280 && t <= 127337 || t >= 127344 && t <= 127373 || t === 127375 || t === 127376 || t >= 127387 && t <= 127404 || t >= 917760 && t <= 917999 || t >= 983040 && t <= 1048573 || t >= 1048576 && t <= 1114109, lt = (t) => t === 12288 || t >= 65281 && t <= 65376 || t >= 65504 && t <= 65510, ht = (t) => t >= 4352 && t <= 4447 || t === 8986 || t === 8987 || t === 9001 || t === 9002 || t >= 9193 && t <= 9196 || t === 9200 || t === 9203 || t === 9725 || t === 9726 || t === 9748 || t === 9749 || t >= 9800 && t <= 9811 || t === 9855 || t === 9875 || t === 9889 || t === 9898 || t === 9899 || t === 9917 || t === 9918 || t === 9924 || t === 9925 || t === 9934 || t === 9940 || t === 9962 || t === 9970 || t === 9971 || t === 9973 || t === 9978 || t === 9981 || t === 9989 || t === 9994 || t === 9995 || t === 10024 || t === 10060 || t === 10062 || t >= 10067 && t <= 10069 || t === 10071 || t >= 10133 && t <= 10135 || t === 10160 || t === 10175 || t === 11035 || t === 11036 || t === 11088 || t === 11093 || t >= 11904 && t <= 11929 || t >= 11931 && t <= 12019 || t >= 12032 && t <= 12245 || t >= 12272 && t <= 12287 || t >= 12289 && t <= 12350 || t >= 12353 && t <= 12438 || t >= 12441 && t <= 12543 || t >= 12549 && t <= 12591 || t >= 12593 && t <= 12686 || t >= 12688 && t <= 12771 || t >= 12783 && t <= 12830 || t >= 12832 && t <= 12871 || t >= 12880 && t <= 19903 || t >= 19968 && t <= 42124 || t >= 42128 && t <= 42182 || t >= 43360 && t <= 43388 || t >= 44032 && t <= 55203 || t >= 63744 && t <= 64255 || t >= 65040 && t <= 65049 || t >= 65072 && t <= 65106 || t >= 65108 && t <= 65126 || t >= 65128 && t <= 65131 || t >= 94176 && t <= 94180 || t === 94192 || t === 94193 || t >= 94208 && t <= 100343 || t >= 100352 && t <= 101589 || t >= 101632 && t <= 101640 || t >= 110576 && t <= 110579 || t >= 110581 && t <= 110587 || t === 110589 || t === 110590 || t >= 110592 && t <= 110882 || t === 110898 || t >= 110928 && t <= 110930 || t === 110933 || t >= 110948 && t <= 110951 || t >= 110960 && t <= 111355 || t === 126980 || t === 127183 || t === 127374 || t >= 127377 && t <= 127386 || t >= 127488 && t <= 127490 || t >= 127504 && t <= 127547 || t >= 127552 && t <= 127560 || t === 127568 || t === 127569 || t >= 127584 && t <= 127589 || t >= 127744 && t <= 127776 || t >= 127789 && t <= 127797 || t >= 127799 && t <= 127868 || t >= 127870 && t <= 127891 || t >= 127904 && t <= 127946 || t >= 127951 && t <= 127955 || t >= 127968 && t <= 127984 || t === 127988 || t >= 127992 && t <= 128062 || t === 128064 || t >= 128066 && t <= 128252 || t >= 128255 && t <= 128317 || t >= 128331 && t <= 128334 || t >= 128336 && t <= 128359 || t === 128378 || t === 128405 || t === 128406 || t === 128420 || t >= 128507 && t <= 128591 || t >= 128640 && t <= 128709 || t === 128716 || t >= 128720 && t <= 128722 || t >= 128725 && t <= 128727 || t >= 128732 && t <= 128735 || t === 128747 || t === 128748 || t >= 128756 && t <= 128764 || t >= 128992 && t <= 129003 || t === 129008 || t >= 129292 && t <= 129338 || t >= 129340 && t <= 129349 || t >= 129351 && t <= 129535 || t >= 129648 && t <= 129660 || t >= 129664 && t <= 129672 || t >= 129680 && t <= 129725 || t >= 129727 && t <= 129733 || t >= 129742 && t <= 129755 || t >= 129760 && t <= 129768 || t >= 129776 && t <= 129784 || t >= 131072 && t <= 196605 || t >= 196608 && t <= 262141, O = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/y, y = /[\x00-\x08\x0A-\x1F\x7F-\x9F]{1,1000}/y, L = /\t{1,1000}/y, P = /[\u{1F1E6}-\u{1F1FF}]{2}|\u{1F3F4}[\u{E0061}-\u{E007A}]{2}[\u{E0030}-\u{E0039}\u{E0061}-\u{E007A}]{1,3}\u{E007F}|(?:\p{Emoji}\uFE0F\u20E3?|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation})(?:\u200D(?:\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F\u20E3?))*/uy, M = /(?:[\x20-\x7E\xA0-\xFF](?!\uFE0F)){1,1000}/y, ct = /\p{M}+/gu, ft$1 = {
	limit: Infinity,
	ellipsis: ""
}, X$1 = (t, e = {}, s = {}) => {
	const i = e.limit ?? Infinity, r = e.ellipsis ?? "", n = e?.ellipsisWidth ?? (r ? X$1(r, ft$1, s).width : 0), u = s.ansiWidth ?? 0, a = s.controlWidth ?? 0, l = s.tabWidth ?? 8, E = s.ambiguousWidth ?? 1, g = s.emojiWidth ?? 2, m = s.fullWidthWidth ?? 2, A = s.regularWidth ?? 1, V = s.wideWidth ?? 2;
	let h = 0, o = 0, p = t.length, v = 0, F = !1, d = p, b = Math.max(0, i - n), C = 0, w = 0, c = 0, f = 0;
	t: for (;;) {
		if (w > C || o >= p && o > h) {
			const ut = t.slice(C, w) || t.slice(h, o);
			v = 0;
			for (const Y of ut.replaceAll(ct, "")) {
				const $ = Y.codePointAt(0) || 0;
				if (lt($) ? f = m : ht($) ? f = V : E !== A && at($) ? f = E : f = A, c + f > b && (d = Math.min(d, Math.max(C, h) + v)), c + f > i) {
					F = !0;
					break t;
				}
				v += Y.length, c += f;
			}
			C = w = 0;
		}
		if (o >= p) break;
		if (M.lastIndex = o, M.test(t)) {
			if (v = M.lastIndex - o, f = v * A, c + f > b && (d = Math.min(d, o + Math.floor((b - c) / A))), c + f > i) {
				F = !0;
				break;
			}
			c += f, C = h, w = o, o = h = M.lastIndex;
			continue;
		}
		if (O.lastIndex = o, O.test(t)) {
			if (c + u > b && (d = Math.min(d, o)), c + u > i) {
				F = !0;
				break;
			}
			c += u, C = h, w = o, o = h = O.lastIndex;
			continue;
		}
		if (y.lastIndex = o, y.test(t)) {
			if (v = y.lastIndex - o, f = v * a, c + f > b && (d = Math.min(d, o + Math.floor((b - c) / a))), c + f > i) {
				F = !0;
				break;
			}
			c += f, C = h, w = o, o = h = y.lastIndex;
			continue;
		}
		if (L.lastIndex = o, L.test(t)) {
			if (v = L.lastIndex - o, f = v * l, c + f > b && (d = Math.min(d, o + Math.floor((b - c) / l))), c + f > i) {
				F = !0;
				break;
			}
			c += f, C = h, w = o, o = h = L.lastIndex;
			continue;
		}
		if (P.lastIndex = o, P.test(t)) {
			if (c + g > b && (d = Math.min(d, o)), c + g > i) {
				F = !0;
				break;
			}
			c += g, C = h, w = o, o = h = P.lastIndex;
			continue;
		}
		o += 1;
	}
	return {
		width: F ? b : c,
		index: F ? d : p,
		truncated: F,
		ellipsed: F && i >= n
	};
}, pt$1 = {
	limit: Infinity,
	ellipsis: "",
	ellipsisWidth: 0
}, S = (t, e = {}) => X$1(t, pt$1, e).width, T = "\x1B", Z = "", Ft$1 = 39, j = "\x07", Q$1 = "[", dt = "]", tt = "m", U$1 = `${dt}8;;`, et = new RegExp(`(?:\\${Q$1}(?<code>\\d+)m|\\${U$1}(?<uri>.*)${j})`, "y"), mt$1 = (t) => {
	if (t >= 30 && t <= 37 || t >= 90 && t <= 97) return 39;
	if (t >= 40 && t <= 47 || t >= 100 && t <= 107) return 49;
	if (t === 1 || t === 2) return 22;
	if (t === 3) return 23;
	if (t === 4) return 24;
	if (t === 7) return 27;
	if (t === 8) return 28;
	if (t === 9) return 29;
	if (t === 0) return 0;
}, st = (t) => `${T}${Q$1}${t}${tt}`, it = (t) => `${T}${U$1}${t}${j}`, gt$1 = (t) => t.map((e) => S(e)), G = (t, e, s) => {
	const i = e[Symbol.iterator]();
	let r = !1, n = !1, u = t.at(-1), a = u === void 0 ? 0 : S(u), l = i.next(), E = i.next(), g = 0;
	for (; !l.done;) {
		const m = l.value, A = S(m);
		a + A <= s ? t[t.length - 1] += m : (t.push(m), a = 0), (m === T || m === Z) && (r = !0, n = e.startsWith(U$1, g + 1)), r ? n ? m === j && (r = !1, n = !1) : m === tt && (r = !1) : (a += A, a === s && !E.done && (t.push(""), a = 0)), l = E, E = i.next(), g += m.length;
	}
	u = t.at(-1), !a && u !== void 0 && u.length > 0 && t.length > 1 && (t[t.length - 2] += t.pop());
}, vt$1 = (t) => {
	const e = t.split(" ");
	let s = e.length;
	for (; s > 0 && !(S(e[s - 1]) > 0);) s--;
	return s === e.length ? t : e.slice(0, s).join(" ") + e.slice(s).join("");
}, Et$1 = (t, e, s = {}) => {
	if (s.trim !== !1 && t.trim() === "") return "";
	let i = "", r, n;
	const u = t.split(" "), a = gt$1(u);
	let l = [""];
	for (const [h, o] of u.entries()) {
		s.trim !== !1 && (l[l.length - 1] = (l.at(-1) ?? "").trimStart());
		let p = S(l.at(-1) ?? "");
		if (h !== 0 && (p >= e && (s.wordWrap === !1 || s.trim === !1) && (l.push(""), p = 0), (p > 0 || s.trim === !1) && (l[l.length - 1] += " ", p++)), s.hard && a[h] > e) {
			const v = e - p, F = 1 + Math.floor((a[h] - v - 1) / e);
			Math.floor((a[h] - 1) / e) < F && l.push(""), G(l, o, e);
			continue;
		}
		if (p + a[h] > e && p > 0 && a[h] > 0) {
			if (s.wordWrap === !1 && p < e) {
				G(l, o, e);
				continue;
			}
			l.push("");
		}
		if (p + a[h] > e && s.wordWrap === !1) {
			G(l, o, e);
			continue;
		}
		l[l.length - 1] += o;
	}
	s.trim !== !1 && (l = l.map((h) => vt$1(h)));
	const E = l.join(`
`), g = E[Symbol.iterator]();
	let m = g.next(), A = g.next(), V = 0;
	for (; !m.done;) {
		const h = m.value, o = A.value;
		if (i += h, h === T || h === Z) {
			et.lastIndex = V + 1;
			const F = et.exec(E)?.groups;
			if (F?.code !== void 0) {
				const d = Number.parseFloat(F.code);
				r = d === Ft$1 ? void 0 : d;
			} else F?.uri !== void 0 && (n = F.uri.length === 0 ? void 0 : F.uri);
		}
		const p = r ? mt$1(r) : void 0;
		o === `
` ? (n && (i += it("")), r && p && (i += st(p))) : h === `
` && (r && p && (i += st(r)), n && (i += it(n))), V += h.length, m = A, A = g.next();
	}
	return i;
};
function K$1(t, e, s) {
	return String(t).normalize().replaceAll(`\r
`, `
`).split(`
`).map((i) => Et$1(i, e, s)).join(`
`);
}
const _ = {
	actions: new Set([
		"up",
		"down",
		"left",
		"right",
		"space",
		"enter",
		"cancel"
	]),
	aliases: new Map([
		["k", "up"],
		["j", "down"],
		["h", "left"],
		["l", "right"],
		["", "cancel"],
		["escape", "cancel"]
	]),
	messages: {
		cancel: "Canceled",
		error: "Something went wrong"
	},
	withGuide: !0
};
function H$1(t, e) {
	if (typeof t == "string") return _.aliases.get(t) === e;
	for (const s of t) if (s !== void 0 && H$1(s, e)) return !0;
	return !1;
}
function _t$1(t, e) {
	if (t === e) return;
	const s = t.split(`
`), i = e.split(`
`), r = Math.max(s.length, i.length), n = [];
	for (let u = 0; u < r; u++) s[u] !== i[u] && n.push(u);
	return {
		lines: n,
		numLinesBefore: s.length,
		numLinesAfter: i.length,
		numLines: r
	};
}
const bt$1 = globalThis.process.platform.startsWith("win"), z$1 = Symbol("clack:cancel");
function Ct$1(t) {
	return t === z$1;
}
function W$1(t, e) {
	const s = t;
	s.isTTY && s.setRawMode(e);
}
function xt$1({ input: t = stdin, output: e = stdout, overwrite: s = !0, hideCursor: i = !0 } = {}) {
	const r = k.createInterface({
		input: t,
		output: e,
		prompt: "",
		tabSize: 1
	});
	k.emitKeypressEvents(t, r), t instanceof ReadStream && t.isTTY && t.setRawMode(!0);
	const n = (u, { name: a, sequence: l }) => {
		if (H$1([
			String(u),
			a,
			l
		], "cancel")) {
			i && e.write(import_src$1.cursor.show), process.exit(0);
			return;
		}
		if (!s) return;
		const g = a === "return" ? 0 : -1, m = a === "return" ? -1 : 0;
		k.moveCursor(e, g, m, () => {
			k.clearLine(e, 1, () => {
				t.once("keypress", n);
			});
		});
	};
	return i && e.write(import_src$1.cursor.hide), t.once("keypress", n), () => {
		t.off("keypress", n), i && e.write(import_src$1.cursor.show), t instanceof ReadStream && t.isTTY && !bt$1 && t.setRawMode(!1), r.terminal = !1, r.close();
	};
}
const rt = (t) => "columns" in t && typeof t.columns == "number" ? t.columns : 80, nt = (t) => "rows" in t && typeof t.rows == "number" ? t.rows : 20;
function Bt$1(t, e, s, i = s) {
	return K$1(e, rt(t ?? stdout) - s.length, {
		hard: !0,
		trim: !1
	}).split(`
`).map((n, u) => `${u === 0 ? i : s}${n}`).join(`
`);
}
var B = class {
	input;
	output;
	_abortSignal;
	rl;
	opts;
	_render;
	_track = !1;
	_prevFrame = "";
	_subscribers = /* @__PURE__ */ new Map();
	_cursor = 0;
	state = "initial";
	error = "";
	value;
	userInput = "";
	constructor(e, s = !0) {
		const { input: i = stdin, output: r = stdout, render: n, signal: u, ...a } = e;
		this.opts = a, this.onKeypress = this.onKeypress.bind(this), this.close = this.close.bind(this), this.render = this.render.bind(this), this._render = n.bind(this), this._track = s, this._abortSignal = u, this.input = i, this.output = r;
	}
	unsubscribe() {
		this._subscribers.clear();
	}
	setSubscriber(e, s) {
		const i = this._subscribers.get(e) ?? [];
		i.push(s), this._subscribers.set(e, i);
	}
	on(e, s) {
		this.setSubscriber(e, { cb: s });
	}
	once(e, s) {
		this.setSubscriber(e, {
			cb: s,
			once: !0
		});
	}
	emit(e, ...s) {
		const i = this._subscribers.get(e) ?? [], r = [];
		for (const n of i) n.cb(...s), n.once && r.push(() => i.splice(i.indexOf(n), 1));
		for (const n of r) n();
	}
	prompt() {
		return new Promise((e) => {
			if (this._abortSignal) {
				if (this._abortSignal.aborted) return this.state = "cancel", this.close(), e(z$1);
				this._abortSignal.addEventListener("abort", () => {
					this.state = "cancel", this.close();
				}, { once: !0 });
			}
			this.rl = c.createInterface({
				input: this.input,
				tabSize: 2,
				prompt: "",
				escapeCodeTimeout: 50,
				terminal: !0
			}), this.rl.prompt(), this.opts.initialUserInput !== void 0 && this._setUserInput(this.opts.initialUserInput, !0), this.input.on("keypress", this.onKeypress), W$1(this.input, !0), this.output.on("resize", this.render), this.render(), this.once("submit", () => {
				this.output.write(import_src$1.cursor.show), this.output.off("resize", this.render), W$1(this.input, !1), e(this.value);
			}), this.once("cancel", () => {
				this.output.write(import_src$1.cursor.show), this.output.off("resize", this.render), W$1(this.input, !1), e(z$1);
			});
		});
	}
	_isActionKey(e, s) {
		return e === "	";
	}
	_setValue(e) {
		this.value = e, this.emit("value", this.value);
	}
	_setUserInput(e, s) {
		this.userInput = e ?? "", this.emit("userInput", this.userInput), s && this._track && this.rl && (this.rl.write(this.userInput), this._cursor = this.rl.cursor);
	}
	_clearUserInput() {
		this.rl?.write(null, {
			ctrl: !0,
			name: "u"
		}), this._setUserInput("");
	}
	onKeypress(e, s) {
		if (this._track && s.name !== "return" && (s.name && this._isActionKey(e, s) && this.rl?.write(null, {
			ctrl: !0,
			name: "h"
		}), this._cursor = this.rl?.cursor ?? 0, this._setUserInput(this.rl?.line)), this.state === "error" && (this.state = "active"), s?.name && (!this._track && _.aliases.has(s.name) && this.emit("cursor", _.aliases.get(s.name)), _.actions.has(s.name) && this.emit("cursor", s.name)), e && (e.toLowerCase() === "y" || e.toLowerCase() === "n") && this.emit("confirm", e.toLowerCase() === "y"), this.emit("key", e?.toLowerCase(), s), s?.name === "return") {
			if (this.opts.validate) {
				const i = this.opts.validate(this.value);
				i && (this.error = i instanceof Error ? i.message : i, this.state = "error", this.rl?.write(this.userInput));
			}
			this.state !== "error" && (this.state = "submit");
		}
		H$1([
			e,
			s?.name,
			s?.sequence
		], "cancel") && (this.state = "cancel"), (this.state === "submit" || this.state === "cancel") && this.emit("finalize"), this.render(), (this.state === "submit" || this.state === "cancel") && this.close();
	}
	close() {
		this.input.unpipe(), this.input.removeListener("keypress", this.onKeypress), this.output.write(`
`), W$1(this.input, !1), this.rl?.close(), this.rl = void 0, this.emit(`${this.state}`, this.value), this.unsubscribe();
	}
	restoreCursor() {
		const e = K$1(this._prevFrame, process.stdout.columns, {
			hard: !0,
			trim: !1
		}).split(`
`).length - 1;
		this.output.write(import_src$1.cursor.move(-999, e * -1));
	}
	render() {
		const e = K$1(this._render(this) ?? "", process.stdout.columns, {
			hard: !0,
			trim: !1
		});
		if (e !== this._prevFrame) {
			if (this.state === "initial") this.output.write(import_src$1.cursor.hide);
			else {
				const s = _t$1(this._prevFrame, e), i = nt(this.output);
				if (this.restoreCursor(), s) {
					const r = Math.max(0, s.numLinesAfter - i), n = Math.max(0, s.numLinesBefore - i);
					let u = s.lines.find((a) => a >= r);
					if (u === void 0) {
						this._prevFrame = e;
						return;
					}
					if (s.lines.length === 1) {
						this.output.write(import_src$1.cursor.move(0, u - n)), this.output.write(import_src$1.erase.lines(1));
						const a = e.split(`
`);
						this.output.write(a[u]), this._prevFrame = e, this.output.write(import_src$1.cursor.move(0, a.length - u - 1));
						return;
					} else if (s.lines.length > 1) {
						if (r < n) u = r;
						else {
							const l = u - n;
							l > 0 && this.output.write(import_src$1.cursor.move(0, l));
						}
						this.output.write(import_src$1.erase.down());
						const a = e.split(`
`).slice(u);
						this.output.write(a.join(`
`)), this._prevFrame = e;
						return;
					}
				}
				this.output.write(import_src$1.erase.down());
			}
			this.output.write(e), this.state === "initial" && (this.state = "active"), this._prevFrame = e;
		}
	}
};
function wt$1(t, e) {
	if (t === void 0 || e.length === 0) return 0;
	const s = e.findIndex((i) => i.value === t);
	return s !== -1 ? s : 0;
}
function Dt$1(t, e) {
	return (e.label ?? String(e.value)).toLowerCase().includes(t.toLowerCase());
}
function St$1(t, e) {
	if (e) return t ? e : e[0];
}
var Vt$1 = class extends B {
	filteredOptions;
	multiple;
	isNavigating = !1;
	selectedValues = [];
	focusedValue;
	#t = 0;
	#s = "";
	#i;
	#e;
	get cursor() {
		return this.#t;
	}
	get userInputWithCursor() {
		if (!this.userInput) return styleText(["inverse", "hidden"], "_");
		if (this._cursor >= this.userInput.length) return `${this.userInput}\u2588`;
		const e = this.userInput.slice(0, this._cursor), [s, ...i] = this.userInput.slice(this._cursor);
		return `${e}${styleText("inverse", s)}${i.join("")}`;
	}
	get options() {
		return typeof this.#e == "function" ? this.#e() : this.#e;
	}
	constructor(e) {
		super(e), this.#e = e.options;
		const s = this.options;
		this.filteredOptions = [...s], this.multiple = e.multiple === !0, this.#i = e.filter ?? Dt$1;
		let i;
		if (e.initialValue && Array.isArray(e.initialValue) ? this.multiple ? i = e.initialValue : i = e.initialValue.slice(0, 1) : !this.multiple && this.options.length > 0 && (i = [this.options[0].value]), i) for (const r of i) {
			const n = s.findIndex((u) => u.value === r);
			n !== -1 && (this.toggleSelected(r), this.#t = n);
		}
		this.focusedValue = this.options[this.#t]?.value, this.on("key", (r, n) => this.#r(r, n)), this.on("userInput", (r) => this.#n(r));
	}
	_isActionKey(e, s) {
		return e === "	" || this.multiple && this.isNavigating && s.name === "space" && e !== void 0 && e !== "";
	}
	#r(e, s) {
		const i = s.name === "up", r = s.name === "down", n = s.name === "return";
		i || r ? (this.#t = x$1(this.#t, i ? -1 : 1, this.filteredOptions), this.focusedValue = this.filteredOptions[this.#t]?.value, this.multiple || (this.selectedValues = [this.focusedValue]), this.isNavigating = !0) : n ? this.value = St$1(this.multiple, this.selectedValues) : this.multiple ? this.focusedValue !== void 0 && (s.name === "tab" || this.isNavigating && s.name === "space") ? this.toggleSelected(this.focusedValue) : this.isNavigating = !1 : (this.focusedValue && (this.selectedValues = [this.focusedValue]), this.isNavigating = !1);
	}
	deselectAll() {
		this.selectedValues = [];
	}
	toggleSelected(e) {
		this.filteredOptions.length !== 0 && (this.multiple ? this.selectedValues.includes(e) ? this.selectedValues = this.selectedValues.filter((s) => s !== e) : this.selectedValues = [...this.selectedValues, e] : this.selectedValues = [e]);
	}
	#n(e) {
		if (e !== this.#s) {
			this.#s = e;
			const s = this.options;
			e ? this.filteredOptions = s.filter((n) => this.#i(e, n)) : this.filteredOptions = [...s];
			this.#t = x$1(wt$1(this.focusedValue, this.filteredOptions), 0, this.filteredOptions);
			const r = this.filteredOptions[this.#t];
			r && !r.disabled ? this.focusedValue = r.value : this.focusedValue = void 0, this.multiple || (this.focusedValue !== void 0 ? this.toggleSelected(this.focusedValue) : this.deselectAll());
		}
	}
};
var kt$1 = class extends B {
	get cursor() {
		return this.value ? 0 : 1;
	}
	get _value() {
		return this.cursor === 0;
	}
	constructor(e) {
		super(e, !1), this.value = !!e.initialValue, this.on("userInput", () => {
			this.value = this._value;
		}), this.on("confirm", (s) => {
			this.output.write(import_src$1.cursor.move(0, -1)), this.value = s, this.state = "submit", this.close();
		}), this.on("cursor", () => {
			this.value = !this.value;
		});
	}
};
var yt$1 = class extends B {
	options;
	cursor = 0;
	#t;
	getGroupItems(e) {
		return this.options.filter((s) => s.group === e);
	}
	isGroupSelected(e) {
		const s = this.getGroupItems(e), i = this.value;
		return i === void 0 ? !1 : s.every((r) => i.includes(r.value));
	}
	toggleValue() {
		const e = this.options[this.cursor];
		if (this.value === void 0 && (this.value = []), e.group === !0) {
			const s = e.value, i = this.getGroupItems(s);
			this.isGroupSelected(s) ? this.value = this.value.filter((r) => i.findIndex((n) => n.value === r) === -1) : this.value = [...this.value, ...i.map((r) => r.value)], this.value = Array.from(new Set(this.value));
		} else this.value = this.value.includes(e.value) ? this.value.filter((i) => i !== e.value) : [...this.value, e.value];
	}
	constructor(e) {
		super(e, !1);
		const { options: s } = e;
		this.#t = e.selectableGroups !== !1, this.options = Object.entries(s).flatMap(([i, r]) => [{
			value: i,
			group: !0,
			label: i
		}, ...r.map((n) => ({
			...n,
			group: i
		}))]), this.value = [...e.initialValues ?? []], this.cursor = Math.max(this.options.findIndex(({ value: i }) => i === e.cursorAt), this.#t ? 0 : 1), this.on("cursor", (i) => {
			switch (i) {
				case "left":
				case "up": {
					this.cursor = this.cursor === 0 ? this.options.length - 1 : this.cursor - 1;
					const r = this.options[this.cursor]?.group === !0;
					!this.#t && r && (this.cursor = this.cursor === 0 ? this.options.length - 1 : this.cursor - 1);
					break;
				}
				case "down":
				case "right": {
					this.cursor = this.cursor === this.options.length - 1 ? 0 : this.cursor + 1;
					const r = this.options[this.cursor]?.group === !0;
					!this.#t && r && (this.cursor = this.cursor === this.options.length - 1 ? 0 : this.cursor + 1);
					break;
				}
				case "space":
					this.toggleValue();
					break;
			}
		});
	}
};
let Lt$1 = class extends B {
	options;
	cursor = 0;
	get _value() {
		return this.options[this.cursor].value;
	}
	get _enabledOptions() {
		return this.options.filter((e) => e.disabled !== !0);
	}
	toggleAll() {
		const e = this._enabledOptions;
		this.value = this.value !== void 0 && this.value.length === e.length ? [] : e.map((i) => i.value);
	}
	toggleInvert() {
		const e = this.value;
		if (!e) return;
		this.value = this._enabledOptions.filter((i) => !e.includes(i.value)).map((i) => i.value);
	}
	toggleValue() {
		this.value === void 0 && (this.value = []);
		this.value = this.value.includes(this._value) ? this.value.filter((s) => s !== this._value) : [...this.value, this._value];
	}
	constructor(e) {
		super(e, !1), this.options = e.options, this.value = [...e.initialValues ?? []];
		const s = Math.max(this.options.findIndex(({ value: i }) => i === e.cursorAt), 0);
		this.cursor = this.options[s].disabled ? x$1(s, 1, this.options) : s, this.on("key", (i) => {
			i === "a" && this.toggleAll(), i === "i" && this.toggleInvert();
		}), this.on("cursor", (i) => {
			switch (i) {
				case "left":
				case "up":
					this.cursor = x$1(this.cursor, -1, this.options);
					break;
				case "down":
				case "right":
					this.cursor = x$1(this.cursor, 1, this.options);
					break;
				case "space":
					this.toggleValue();
					break;
			}
		});
	}
};
var Mt$1 = class extends B {
	_mask = "•";
	get cursor() {
		return this._cursor;
	}
	get masked() {
		return this.userInput.replaceAll(/./g, this._mask);
	}
	get userInputWithCursor() {
		if (this.state === "submit" || this.state === "cancel") return this.masked;
		const e = this.userInput;
		if (this.cursor >= e.length) return `${this.masked}${styleText(["inverse", "hidden"], "_")}`;
		const s = this.masked, i = s.slice(0, this.cursor), r = s.slice(this.cursor);
		return `${i}${styleText("inverse", r[0])}${r.slice(1)}`;
	}
	clear() {
		this._clearUserInput();
	}
	constructor({ mask: e, ...s }) {
		super(s), this._mask = e ?? "•", this.on("userInput", (i) => {
			this._setValue(i);
		});
	}
};
var Tt$1 = class extends B {
	options;
	cursor = 0;
	get _selectedValue() {
		return this.options[this.cursor];
	}
	changeValue() {
		this.value = this._selectedValue.value;
	}
	constructor(e) {
		super(e, !1), this.options = e.options;
		const s = this.options.findIndex(({ value: r }) => r === e.initialValue), i = s === -1 ? 0 : s;
		this.cursor = this.options[i].disabled ? x$1(i, 1, this.options) : i, this.changeValue(), this.on("cursor", (r) => {
			switch (r) {
				case "left":
				case "up":
					this.cursor = x$1(this.cursor, -1, this.options);
					break;
				case "down":
				case "right":
					this.cursor = x$1(this.cursor, 1, this.options);
					break;
			}
			this.changeValue();
		});
	}
};
var Wt$1 = class extends B {
	options;
	cursor = 0;
	constructor(e) {
		super(e, !1), this.options = e.options;
		const s = e.caseSensitive === !0, i = this.options.map(({ value: [r] }) => s ? r : r?.toLowerCase());
		this.cursor = Math.max(i.indexOf(e.initialValue), 0), this.on("key", (r, n) => {
			if (!r) return;
			const u = s && n.shift ? r.toUpperCase() : r;
			if (!i.includes(u)) return;
			const a = this.options.find(({ value: [l] }) => s ? l === u : l?.toLowerCase() === r);
			a && (this.value = a.value, this.state = "submit", this.emit("submit"));
		});
	}
};
var $t = class extends B {
	get userInputWithCursor() {
		if (this.state === "submit") return this.userInput;
		const e = this.userInput;
		if (this.cursor >= e.length) return `${this.userInput}\u2588`;
		const s = e.slice(0, this.cursor), [i, ...r] = e.slice(this.cursor);
		return `${s}${styleText("inverse", i)}${r.join("")}`;
	}
	get cursor() {
		return this._cursor;
	}
	constructor(e) {
		super({
			...e,
			initialUserInput: e.initialUserInput ?? e.initialValue
		}), this.on("userInput", (s) => {
			this._setValue(s);
		}), this.on("finalize", () => {
			this.value || (this.value = e.defaultValue), this.value === void 0 && (this.value = "");
		});
	}
};

//#endregion
//#region ../../node_modules/.pnpm/@clack+prompts@1.1.0/node_modules/@clack/prompts/dist/index.mjs
function pt() {
	return process$1.platform !== "win32" ? process$1.env.TERM !== "linux" : !!process$1.env.CI || !!process$1.env.WT_SESSION || !!process$1.env.TERMINUS_SUBLIME || process$1.env.ConEmuTask === "{cmd::Cmder}" || process$1.env.TERM_PROGRAM === "Terminus-Sublime" || process$1.env.TERM_PROGRAM === "vscode" || process$1.env.TERM === "xterm-256color" || process$1.env.TERM === "alacritty" || process$1.env.TERMINAL_EMULATOR === "JetBrains-JediTerm";
}
const ee = pt(), ce = () => process.env.CI === "true", Me = (e) => e.isTTY === !0, I = (e, r) => ee ? e : r, Re = I("◆", "*"), $e = I("■", "x"), de = I("▲", "x"), V = I("◇", "o"), he = I("┌", "T"), h = I("│", "|"), x = I("└", "—"), Oe = I("┐", "T"), Pe = I("┘", "—"), z = I("●", ">"), H = I("○", " "), te = I("◻", "[•]"), U = I("◼", "[+]"), q = I("◻", "[ ]"), Ne = I("▪", "•"), se = I("─", "-"), pe = I("╮", "+"), We = I("├", "+"), me = I("╯", "+"), ge = I("╰", "+"), Ge = I("╭", "+"), fe = I("●", "•"), Fe = I("◆", "*"), ye = I("▲", "!"), Ee = I("■", "x"), W = (e) => {
	switch (e) {
		case "initial":
		case "active": return styleText("cyan", Re);
		case "cancel": return styleText("red", $e);
		case "error": return styleText("yellow", de);
		case "submit": return styleText("green", V);
	}
}, ve = (e) => {
	switch (e) {
		case "initial":
		case "active": return styleText("cyan", h);
		case "cancel": return styleText("red", h);
		case "error": return styleText("yellow", h);
		case "submit": return styleText("green", h);
	}
}, mt = (e) => e === 161 || e === 164 || e === 167 || e === 168 || e === 170 || e === 173 || e === 174 || e >= 176 && e <= 180 || e >= 182 && e <= 186 || e >= 188 && e <= 191 || e === 198 || e === 208 || e === 215 || e === 216 || e >= 222 && e <= 225 || e === 230 || e >= 232 && e <= 234 || e === 236 || e === 237 || e === 240 || e === 242 || e === 243 || e >= 247 && e <= 250 || e === 252 || e === 254 || e === 257 || e === 273 || e === 275 || e === 283 || e === 294 || e === 295 || e === 299 || e >= 305 && e <= 307 || e === 312 || e >= 319 && e <= 322 || e === 324 || e >= 328 && e <= 331 || e === 333 || e === 338 || e === 339 || e === 358 || e === 359 || e === 363 || e === 462 || e === 464 || e === 466 || e === 468 || e === 470 || e === 472 || e === 474 || e === 476 || e === 593 || e === 609 || e === 708 || e === 711 || e >= 713 && e <= 715 || e === 717 || e === 720 || e >= 728 && e <= 731 || e === 733 || e === 735 || e >= 768 && e <= 879 || e >= 913 && e <= 929 || e >= 931 && e <= 937 || e >= 945 && e <= 961 || e >= 963 && e <= 969 || e === 1025 || e >= 1040 && e <= 1103 || e === 1105 || e === 8208 || e >= 8211 && e <= 8214 || e === 8216 || e === 8217 || e === 8220 || e === 8221 || e >= 8224 && e <= 8226 || e >= 8228 && e <= 8231 || e === 8240 || e === 8242 || e === 8243 || e === 8245 || e === 8251 || e === 8254 || e === 8308 || e === 8319 || e >= 8321 && e <= 8324 || e === 8364 || e === 8451 || e === 8453 || e === 8457 || e === 8467 || e === 8470 || e === 8481 || e === 8482 || e === 8486 || e === 8491 || e === 8531 || e === 8532 || e >= 8539 && e <= 8542 || e >= 8544 && e <= 8555 || e >= 8560 && e <= 8569 || e === 8585 || e >= 8592 && e <= 8601 || e === 8632 || e === 8633 || e === 8658 || e === 8660 || e === 8679 || e === 8704 || e === 8706 || e === 8707 || e === 8711 || e === 8712 || e === 8715 || e === 8719 || e === 8721 || e === 8725 || e === 8730 || e >= 8733 && e <= 8736 || e === 8739 || e === 8741 || e >= 8743 && e <= 8748 || e === 8750 || e >= 8756 && e <= 8759 || e === 8764 || e === 8765 || e === 8776 || e === 8780 || e === 8786 || e === 8800 || e === 8801 || e >= 8804 && e <= 8807 || e === 8810 || e === 8811 || e === 8814 || e === 8815 || e === 8834 || e === 8835 || e === 8838 || e === 8839 || e === 8853 || e === 8857 || e === 8869 || e === 8895 || e === 8978 || e >= 9312 && e <= 9449 || e >= 9451 && e <= 9547 || e >= 9552 && e <= 9587 || e >= 9600 && e <= 9615 || e >= 9618 && e <= 9621 || e === 9632 || e === 9633 || e >= 9635 && e <= 9641 || e === 9650 || e === 9651 || e === 9654 || e === 9655 || e === 9660 || e === 9661 || e === 9664 || e === 9665 || e >= 9670 && e <= 9672 || e === 9675 || e >= 9678 && e <= 9681 || e >= 9698 && e <= 9701 || e === 9711 || e === 9733 || e === 9734 || e === 9737 || e === 9742 || e === 9743 || e === 9756 || e === 9758 || e === 9792 || e === 9794 || e === 9824 || e === 9825 || e >= 9827 && e <= 9829 || e >= 9831 && e <= 9834 || e === 9836 || e === 9837 || e === 9839 || e === 9886 || e === 9887 || e === 9919 || e >= 9926 && e <= 9933 || e >= 9935 && e <= 9939 || e >= 9941 && e <= 9953 || e === 9955 || e === 9960 || e === 9961 || e >= 9963 && e <= 9969 || e === 9972 || e >= 9974 && e <= 9977 || e === 9979 || e === 9980 || e === 9982 || e === 9983 || e === 10045 || e >= 10102 && e <= 10111 || e >= 11094 && e <= 11097 || e >= 12872 && e <= 12879 || e >= 57344 && e <= 63743 || e >= 65024 && e <= 65039 || e === 65533 || e >= 127232 && e <= 127242 || e >= 127248 && e <= 127277 || e >= 127280 && e <= 127337 || e >= 127344 && e <= 127373 || e === 127375 || e === 127376 || e >= 127387 && e <= 127404 || e >= 917760 && e <= 917999 || e >= 983040 && e <= 1048573 || e >= 1048576 && e <= 1114109, gt = (e) => e === 12288 || e >= 65281 && e <= 65376 || e >= 65504 && e <= 65510, ft = (e) => e >= 4352 && e <= 4447 || e === 8986 || e === 8987 || e === 9001 || e === 9002 || e >= 9193 && e <= 9196 || e === 9200 || e === 9203 || e === 9725 || e === 9726 || e === 9748 || e === 9749 || e >= 9800 && e <= 9811 || e === 9855 || e === 9875 || e === 9889 || e === 9898 || e === 9899 || e === 9917 || e === 9918 || e === 9924 || e === 9925 || e === 9934 || e === 9940 || e === 9962 || e === 9970 || e === 9971 || e === 9973 || e === 9978 || e === 9981 || e === 9989 || e === 9994 || e === 9995 || e === 10024 || e === 10060 || e === 10062 || e >= 10067 && e <= 10069 || e === 10071 || e >= 10133 && e <= 10135 || e === 10160 || e === 10175 || e === 11035 || e === 11036 || e === 11088 || e === 11093 || e >= 11904 && e <= 11929 || e >= 11931 && e <= 12019 || e >= 12032 && e <= 12245 || e >= 12272 && e <= 12287 || e >= 12289 && e <= 12350 || e >= 12353 && e <= 12438 || e >= 12441 && e <= 12543 || e >= 12549 && e <= 12591 || e >= 12593 && e <= 12686 || e >= 12688 && e <= 12771 || e >= 12783 && e <= 12830 || e >= 12832 && e <= 12871 || e >= 12880 && e <= 19903 || e >= 19968 && e <= 42124 || e >= 42128 && e <= 42182 || e >= 43360 && e <= 43388 || e >= 44032 && e <= 55203 || e >= 63744 && e <= 64255 || e >= 65040 && e <= 65049 || e >= 65072 && e <= 65106 || e >= 65108 && e <= 65126 || e >= 65128 && e <= 65131 || e >= 94176 && e <= 94180 || e === 94192 || e === 94193 || e >= 94208 && e <= 100343 || e >= 100352 && e <= 101589 || e >= 101632 && e <= 101640 || e >= 110576 && e <= 110579 || e >= 110581 && e <= 110587 || e === 110589 || e === 110590 || e >= 110592 && e <= 110882 || e === 110898 || e >= 110928 && e <= 110930 || e === 110933 || e >= 110948 && e <= 110951 || e >= 110960 && e <= 111355 || e === 126980 || e === 127183 || e === 127374 || e >= 127377 && e <= 127386 || e >= 127488 && e <= 127490 || e >= 127504 && e <= 127547 || e >= 127552 && e <= 127560 || e === 127568 || e === 127569 || e >= 127584 && e <= 127589 || e >= 127744 && e <= 127776 || e >= 127789 && e <= 127797 || e >= 127799 && e <= 127868 || e >= 127870 && e <= 127891 || e >= 127904 && e <= 127946 || e >= 127951 && e <= 127955 || e >= 127968 && e <= 127984 || e === 127988 || e >= 127992 && e <= 128062 || e === 128064 || e >= 128066 && e <= 128252 || e >= 128255 && e <= 128317 || e >= 128331 && e <= 128334 || e >= 128336 && e <= 128359 || e === 128378 || e === 128405 || e === 128406 || e === 128420 || e >= 128507 && e <= 128591 || e >= 128640 && e <= 128709 || e === 128716 || e >= 128720 && e <= 128722 || e >= 128725 && e <= 128727 || e >= 128732 && e <= 128735 || e === 128747 || e === 128748 || e >= 128756 && e <= 128764 || e >= 128992 && e <= 129003 || e === 129008 || e >= 129292 && e <= 129338 || e >= 129340 && e <= 129349 || e >= 129351 && e <= 129535 || e >= 129648 && e <= 129660 || e >= 129664 && e <= 129672 || e >= 129680 && e <= 129725 || e >= 129727 && e <= 129733 || e >= 129742 && e <= 129755 || e >= 129760 && e <= 129768 || e >= 129776 && e <= 129784 || e >= 131072 && e <= 196605 || e >= 196608 && e <= 262141, we = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/y, re = /[\x00-\x08\x0A-\x1F\x7F-\x9F]{1,1000}/y, ie = /\t{1,1000}/y, Ae = /[\u{1F1E6}-\u{1F1FF}]{2}|\u{1F3F4}[\u{E0061}-\u{E007A}]{2}[\u{E0030}-\u{E0039}\u{E0061}-\u{E007A}]{1,3}\u{E007F}|(?:\p{Emoji}\uFE0F\u20E3?|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation})(?:\u200D(?:\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F\u20E3?))*/uy, ne = /(?:[\x20-\x7E\xA0-\xFF](?!\uFE0F)){1,1000}/y, Ft = /\p{M}+/gu, yt = {
	limit: Infinity,
	ellipsis: ""
}, Le = (e, r = {}, s = {}) => {
	const i = r.limit ?? Infinity, a = r.ellipsis ?? "", o = r?.ellipsisWidth ?? (a ? Le(a, yt, s).width : 0), u = s.ansiWidth ?? 0, l = s.controlWidth ?? 0, n = s.tabWidth ?? 8, c = s.ambiguousWidth ?? 1, p = s.emojiWidth ?? 2, f = s.fullWidthWidth ?? 2, g = s.regularWidth ?? 1, E = s.wideWidth ?? 2;
	let $ = 0, m = 0, d = e.length, F = 0, y = !1, v = d, C = Math.max(0, i - o), A = 0, b = 0, w = 0, S = 0;
	e: for (;;) {
		if (b > A || m >= d && m > $) {
			const T = e.slice(A, b) || e.slice($, m);
			F = 0;
			for (const M of T.replaceAll(Ft, "")) {
				const O = M.codePointAt(0) || 0;
				if (gt(O) ? S = f : ft(O) ? S = E : c !== g && mt(O) ? S = c : S = g, w + S > C && (v = Math.min(v, Math.max(A, $) + F)), w + S > i) {
					y = !0;
					break e;
				}
				F += M.length, w += S;
			}
			A = b = 0;
		}
		if (m >= d) break;
		if (ne.lastIndex = m, ne.test(e)) {
			if (F = ne.lastIndex - m, S = F * g, w + S > C && (v = Math.min(v, m + Math.floor((C - w) / g))), w + S > i) {
				y = !0;
				break;
			}
			w += S, A = $, b = m, m = $ = ne.lastIndex;
			continue;
		}
		if (we.lastIndex = m, we.test(e)) {
			if (w + u > C && (v = Math.min(v, m)), w + u > i) {
				y = !0;
				break;
			}
			w += u, A = $, b = m, m = $ = we.lastIndex;
			continue;
		}
		if (re.lastIndex = m, re.test(e)) {
			if (F = re.lastIndex - m, S = F * l, w + S > C && (v = Math.min(v, m + Math.floor((C - w) / l))), w + S > i) {
				y = !0;
				break;
			}
			w += S, A = $, b = m, m = $ = re.lastIndex;
			continue;
		}
		if (ie.lastIndex = m, ie.test(e)) {
			if (F = ie.lastIndex - m, S = F * n, w + S > C && (v = Math.min(v, m + Math.floor((C - w) / n))), w + S > i) {
				y = !0;
				break;
			}
			w += S, A = $, b = m, m = $ = ie.lastIndex;
			continue;
		}
		if (Ae.lastIndex = m, Ae.test(e)) {
			if (w + p > C && (v = Math.min(v, m)), w + p > i) {
				y = !0;
				break;
			}
			w += p, A = $, b = m, m = $ = Ae.lastIndex;
			continue;
		}
		m += 1;
	}
	return {
		width: y ? C : w,
		index: y ? v : d,
		truncated: y,
		ellipsed: y && i >= o
	};
}, Et = {
	limit: Infinity,
	ellipsis: "",
	ellipsisWidth: 0
}, D = (e, r = {}) => Le(e, Et, r).width, ae = "\x1B", je = "", vt = 39, Ce = "\x07", ke = "[", wt = "]", Ve = "m", Se = `${wt}8;;`, He = new RegExp(`(?:\\${ke}(?<code>\\d+)m|\\${Se}(?<uri>.*)${Ce})`, "y"), At = (e) => {
	if (e >= 30 && e <= 37 || e >= 90 && e <= 97) return 39;
	if (e >= 40 && e <= 47 || e >= 100 && e <= 107) return 49;
	if (e === 1 || e === 2) return 22;
	if (e === 3) return 23;
	if (e === 4) return 24;
	if (e === 7) return 27;
	if (e === 8) return 28;
	if (e === 9) return 29;
	if (e === 0) return 0;
}, Ue = (e) => `${ae}${ke}${e}${Ve}`, Ke = (e) => `${ae}${Se}${e}${Ce}`, Ct = (e) => e.map((r) => D(r)), Ie = (e, r, s) => {
	const i = r[Symbol.iterator]();
	let a = !1, o = !1, u = e.at(-1), l = u === void 0 ? 0 : D(u), n = i.next(), c = i.next(), p = 0;
	for (; !n.done;) {
		const f = n.value, g = D(f);
		l + g <= s ? e[e.length - 1] += f : (e.push(f), l = 0), (f === ae || f === je) && (a = !0, o = r.startsWith(Se, p + 1)), a ? o ? f === Ce && (a = !1, o = !1) : f === Ve && (a = !1) : (l += g, l === s && !c.done && (e.push(""), l = 0)), n = c, c = i.next(), p += f.length;
	}
	u = e.at(-1), !l && u !== void 0 && u.length > 0 && e.length > 1 && (e[e.length - 2] += e.pop());
}, St = (e) => {
	const r = e.split(" ");
	let s = r.length;
	for (; s > 0 && !(D(r[s - 1]) > 0);) s--;
	return s === r.length ? e : r.slice(0, s).join(" ") + r.slice(s).join("");
}, It = (e, r, s = {}) => {
	if (s.trim !== !1 && e.trim() === "") return "";
	let i = "", a, o;
	const u = e.split(" "), l = Ct(u);
	let n = [""];
	for (const [$, m] of u.entries()) {
		s.trim !== !1 && (n[n.length - 1] = (n.at(-1) ?? "").trimStart());
		let d = D(n.at(-1) ?? "");
		if ($ !== 0 && (d >= r && (s.wordWrap === !1 || s.trim === !1) && (n.push(""), d = 0), (d > 0 || s.trim === !1) && (n[n.length - 1] += " ", d++)), s.hard && l[$] > r) {
			const F = r - d, y = 1 + Math.floor((l[$] - F - 1) / r);
			Math.floor((l[$] - 1) / r) < y && n.push(""), Ie(n, m, r);
			continue;
		}
		if (d + l[$] > r && d > 0 && l[$] > 0) {
			if (s.wordWrap === !1 && d < r) {
				Ie(n, m, r);
				continue;
			}
			n.push("");
		}
		if (d + l[$] > r && s.wordWrap === !1) {
			Ie(n, m, r);
			continue;
		}
		n[n.length - 1] += m;
	}
	s.trim !== !1 && (n = n.map(($) => St($)));
	const c = n.join(`
`), p = c[Symbol.iterator]();
	let f = p.next(), g = p.next(), E = 0;
	for (; !f.done;) {
		const $ = f.value, m = g.value;
		if (i += $, $ === ae || $ === je) {
			He.lastIndex = E + 1;
			const y = He.exec(c)?.groups;
			if (y?.code !== void 0) {
				const v = Number.parseFloat(y.code);
				a = v === vt ? void 0 : v;
			} else y?.uri !== void 0 && (o = y.uri.length === 0 ? void 0 : y.uri);
		}
		const d = a ? At(a) : void 0;
		m === `
` ? (o && (i += Ke("")), a && d && (i += Ue(d))) : $ === `
` && (a && d && (i += Ue(a)), o && (i += Ke(o))), E += $.length, f = g, g = p.next();
	}
	return i;
};
function J(e, r, s) {
	return String(e).normalize().replaceAll(`\r
`, `
`).split(`
`).map((i) => It(i, r, s)).join(`
`);
}
const bt = (e, r, s, i, a) => {
	let o = r, u = 0;
	for (let l = s; l < i; l++) {
		const n = e[l];
		if (o = o - n.length, u++, o <= a) break;
	}
	return {
		lineCount: o,
		removals: u
	};
}, X = ({ cursor: e, options: r, style: s, output: i = process.stdout, maxItems: a = Number.POSITIVE_INFINITY, columnPadding: o = 0, rowPadding: u = 4 }) => {
	const l = rt(i) - o, n = nt(i), c = styleText("dim", "..."), p = Math.max(n - u, 0), f = Math.max(Math.min(a, p), 5);
	let g = 0;
	e >= f - 3 && (g = Math.max(Math.min(e - f + 3, r.length - f), 0));
	let E = f < r.length && g > 0, $ = f < r.length && g + f < r.length;
	const m = Math.min(g + f, r.length), d = [];
	let F = 0;
	E && F++, $ && F++;
	const y = g + (E ? 1 : 0), v = m - ($ ? 1 : 0);
	for (let A = y; A < v; A++) {
		const b = J(s(r[A], A === e), l, {
			hard: !0,
			trim: !1
		}).split(`
`);
		d.push(b), F += b.length;
	}
	if (F > p) {
		let A = 0, b = 0, w = F;
		const S = e - y, T = (M, O) => bt(d, w, M, O, p);
		E ? ({lineCount: w, removals: A} = T(0, S), w > p && ({lineCount: w, removals: b} = T(S + 1, d.length))) : ({lineCount: w, removals: b} = T(S + 1, d.length), w > p && ({lineCount: w, removals: A} = T(0, S))), A > 0 && (E = !0, d.splice(0, A)), b > 0 && ($ = !0, d.splice(d.length - b, b));
	}
	const C = [];
	E && C.push(c);
	for (const A of d) for (const b of A) C.push(b);
	return $ && C.push(c), C;
};
function qe(e) {
	return e.label ?? String(e.value ?? "");
}
function Je(e, r) {
	if (!e) return !0;
	const s = (r.label ?? String(r.value ?? "")).toLowerCase(), i = (r.hint ?? "").toLowerCase(), a = String(r.value).toLowerCase(), o = e.toLowerCase();
	return s.includes(o) || i.includes(o) || a.includes(o);
}
function Bt(e, r) {
	const s = [];
	for (const i of r) e.includes(i.value) && s.push(i);
	return s;
}
const Xe = (e) => new Vt$1({
	options: e.options,
	initialValue: e.initialValue ? [e.initialValue] : void 0,
	initialUserInput: e.initialUserInput,
	filter: e.filter ?? ((r, s) => Je(r, s)),
	signal: e.signal,
	input: e.input,
	output: e.output,
	validate: e.validate,
	render() {
		const r = e.withGuide ?? _.withGuide, s = r ? [`${styleText("gray", h)}`, `${W(this.state)}  ${e.message}`] : [`${W(this.state)}  ${e.message}`], i = this.userInput, a = this.options, o = e.placeholder, u = i === "" && o !== void 0, l = (n, c) => {
			const p = qe(n), f = n.hint && n.value === this.focusedValue ? styleText("dim", ` (${n.hint})`) : "";
			switch (c) {
				case "active": return `${styleText("green", z)} ${p}${f}`;
				case "inactive": return `${styleText("dim", H)} ${styleText("dim", p)}`;
				case "disabled": return `${styleText("gray", H)} ${styleText(["strikethrough", "gray"], p)}`;
			}
		};
		switch (this.state) {
			case "submit": {
				const n = Bt(this.selectedValues, a), c = n.length > 0 ? `  ${styleText("dim", n.map(qe).join(", "))}` : "", p = r ? styleText("gray", h) : "";
				return `${s.join(`
`)}
${p}${c}`;
			}
			case "cancel": {
				const n = i ? `  ${styleText(["strikethrough", "dim"], i)}` : "", c = r ? styleText("gray", h) : "";
				return `${s.join(`
`)}
${c}${n}`;
			}
			default: {
				const n = this.state === "error" ? "yellow" : "cyan", c = r ? `${styleText(n, h)}  ` : "", p = r ? styleText(n, x) : "";
				let f = "";
				if (this.isNavigating || u) {
					const y = u ? o : i;
					f = y !== "" ? ` ${styleText("dim", y)}` : "";
				} else f = ` ${this.userInputWithCursor}`;
				const g = this.filteredOptions.length !== a.length ? styleText("dim", ` (${this.filteredOptions.length} match${this.filteredOptions.length === 1 ? "" : "es"})`) : "", E = this.filteredOptions.length === 0 && i ? [`${c}${styleText("yellow", "No matches found")}`] : [], $ = this.state === "error" ? [`${c}${styleText("yellow", this.error)}`] : [];
				r && s.push(`${c.trimEnd()}`), s.push(`${c}${styleText("dim", "Search:")}${f}${g}`, ...E, ...$);
				const d = [`${c}${[
					`${styleText("dim", "↑/↓")} to select`,
					`${styleText("dim", "Enter:")} confirm`,
					`${styleText("dim", "Type:")} to search`
				].join(" • ")}`, p], F = this.filteredOptions.length === 0 ? [] : X({
					cursor: this.cursor,
					options: this.filteredOptions,
					columnPadding: r ? 3 : 0,
					rowPadding: s.length + d.length,
					style: (y, v) => l(y, y.disabled ? "disabled" : v ? "active" : "inactive"),
					maxItems: e.maxItems,
					output: e.output
				});
				return [
					...s,
					...F.map((y) => `${c}${y}`),
					...d
				].join(`
`);
			}
		}
	}
}).prompt(), xt = (e) => {
	const r = (i, a, o, u) => {
		const l = o.includes(i.value), n = i.label ?? String(i.value ?? ""), c = i.hint && u !== void 0 && i.value === u ? styleText("dim", ` (${i.hint})`) : "", p = l ? styleText("green", U) : styleText("dim", q);
		return i.disabled ? `${styleText("gray", q)} ${styleText(["strikethrough", "gray"], n)}` : a ? `${p} ${n}${c}` : `${p} ${styleText("dim", n)}`;
	}, s = new Vt$1({
		options: e.options,
		multiple: !0,
		filter: e.filter ?? ((i, a) => Je(i, a)),
		validate: () => {
			if (e.required && s.selectedValues.length === 0) return "Please select at least one item";
		},
		initialValue: e.initialValues,
		signal: e.signal,
		input: e.input,
		output: e.output,
		render() {
			const i = `${styleText("gray", h)}
${W(this.state)}  ${e.message}
`, a = this.userInput, o = e.placeholder, u = a === "" && o !== void 0, l = this.isNavigating || u ? styleText("dim", u ? o : a) : this.userInputWithCursor, n = this.options, c = this.filteredOptions.length !== n.length ? styleText("dim", ` (${this.filteredOptions.length} match${this.filteredOptions.length === 1 ? "" : "es"})`) : "";
			switch (this.state) {
				case "submit": return `${i}${styleText("gray", h)}  ${styleText("dim", `${this.selectedValues.length} items selected`)}`;
				case "cancel": return `${i}${styleText("gray", h)}  ${styleText(["strikethrough", "dim"], a)}`;
				default: {
					const p = this.state === "error" ? "yellow" : "cyan", f = [
						`${styleText("dim", "↑/↓")} to navigate`,
						`${styleText("dim", this.isNavigating ? "Space/Tab:" : "Tab:")} select`,
						`${styleText("dim", "Enter:")} confirm`,
						`${styleText("dim", "Type:")} to search`
					], g = this.filteredOptions.length === 0 && a ? [`${styleText(p, h)}  ${styleText("yellow", "No matches found")}`] : [], E = this.state === "error" ? [`${styleText(p, h)}  ${styleText("yellow", this.error)}`] : [], $ = [
						...`${i}${styleText(p, h)}`.split(`
`),
						`${styleText(p, h)}  ${styleText("dim", "Search:")} ${l}${c}`,
						...g,
						...E
					], m = [`${styleText(p, h)}  ${f.join(" • ")}`, styleText(p, x)], d = X({
						cursor: this.cursor,
						options: this.filteredOptions,
						style: (F, y) => r(F, y, this.selectedValues, this.focusedValue),
						maxItems: e.maxItems,
						output: e.output,
						rowPadding: $.length + m.length
					});
					return [
						...$,
						...d.map((F) => `${styleText(p, h)}  ${F}`),
						...m
					].join(`
`);
				}
			}
		}
	});
	return s.prompt();
}, _t = [
	Ge,
	pe,
	ge,
	me
], Dt = [
	he,
	Oe,
	x,
	Pe
];
function Ye(e, r, s, i) {
	let a = s, o = s;
	return i === "center" ? a = Math.floor((r - e) / 2) : i === "right" && (a = r - e - s), o = r - a - e, [a, o];
}
const Tt = (e) => e, Mt = (e = "", r = "", s) => {
	const i = s?.output ?? process.stdout, a = rt(i), o = 2, u = s?.titlePadding ?? 1, l = s?.contentPadding ?? 2, n = s?.width === void 0 || s.width === "auto" ? 1 : Math.min(1, s.width), c = s?.withGuide ?? _.withGuide ? `${h} ` : "", p = s?.formatBorder ?? Tt, f = (s?.rounded ? _t : Dt).map(p), g = p(se), E = p(h), $ = D(c), m = D(r), d = a - $;
	let F = Math.floor(a * n) - $;
	if (s?.width === "auto") {
		const T = e.split(`
`);
		let M = m + u * 2;
		for (const le of T) {
			const k = D(le) + l * 2;
			k > M && (M = k);
		}
		const O = M + o;
		O < F && (F = O);
	}
	F % 2 !== 0 && (F < d ? F++ : F--);
	const y = F - o, v = y - u * 2, C = m > v ? `${r.slice(0, v - 3)}...` : r, [A, b] = Ye(D(C), y, u, s?.titleAlign), w = J(e, y - l * 2, {
		hard: !0,
		trim: !1
	});
	i.write(`${c}${f[0]}${g.repeat(A)}${C}${g.repeat(b)}${f[1]}
`);
	const S = w.split(`
`);
	for (const T of S) {
		const [M, O] = Ye(D(T), y, l, s?.contentAlign);
		i.write(`${c}${E}${" ".repeat(M)}${T}${" ".repeat(O)}${E}
`);
	}
	i.write(`${c}${f[2]}${g.repeat(y)}${f[3]}
`);
}, Rt = (e) => {
	const r = e.active ?? "Yes", s = e.inactive ?? "No";
	return new kt$1({
		active: r,
		inactive: s,
		signal: e.signal,
		input: e.input,
		output: e.output,
		initialValue: e.initialValue ?? !0,
		render() {
			const i = e.withGuide ?? _.withGuide, a = `${i ? `${styleText("gray", h)}
` : ""}${W(this.state)}  ${e.message}
`, o = this.value ? r : s;
			switch (this.state) {
				case "submit": return `${a}${i ? `${styleText("gray", h)}  ` : ""}${styleText("dim", o)}`;
				case "cancel": return `${a}${i ? `${styleText("gray", h)}  ` : ""}${styleText(["strikethrough", "dim"], o)}${i ? `
${styleText("gray", h)}` : ""}`;
				default: {
					const u = i ? `${styleText("cyan", h)}  ` : "", l = i ? styleText("cyan", x) : "";
					return `${a}${u}${this.value ? `${styleText("green", z)} ${r}` : `${styleText("dim", H)} ${styleText("dim", r)}`}${e.vertical ? i ? `
${styleText("cyan", h)}  ` : `
` : ` ${styleText("dim", "/")} `}${this.value ? `${styleText("dim", H)} ${styleText("dim", s)}` : `${styleText("green", z)} ${s}`}
${l}
`;
				}
			}
		}
	}).prompt();
}, Ot = async (e, r) => {
	const s = {}, i = Object.keys(e);
	for (const a of i) {
		const o = e[a], u = await o({ results: s })?.catch((l) => {
			throw l;
		});
		if (typeof r?.onCancel == "function" && Ct$1(u)) {
			s[a] = "canceled", r.onCancel({ results: s });
			continue;
		}
		s[a] = u;
	}
	return s;
}, Pt = (e) => {
	const { selectableGroups: r = !0, groupSpacing: s = 0 } = e, i = (o, u, l = []) => {
		const n = o.label ?? String(o.value), c = typeof o.group == "string", p = c && (l[l.indexOf(o) + 1] ?? { group: !0 }), f = c && p && p.group === !0, g = c ? r ? `${f ? x : h} ` : "  " : "";
		let E = "";
		if (s > 0 && !c) {
			const m = `
${styleText("cyan", h)}`;
			E = `${m.repeat(s - 1)}${m}  `;
		}
		if (u === "active") return `${E}${styleText("dim", g)}${styleText("cyan", te)} ${n}${o.hint ? ` ${styleText("dim", `(${o.hint})`)}` : ""}`;
		if (u === "group-active") return `${E}${g}${styleText("cyan", te)} ${styleText("dim", n)}`;
		if (u === "group-active-selected") return `${E}${g}${styleText("green", U)} ${styleText("dim", n)}`;
		if (u === "selected") {
			const m = c || r ? styleText("green", U) : "";
			return `${E}${styleText("dim", g)}${m} ${styleText("dim", n)}${o.hint ? ` ${styleText("dim", `(${o.hint})`)}` : ""}`;
		}
		if (u === "cancelled") return `${styleText(["strikethrough", "dim"], n)}`;
		if (u === "active-selected") return `${E}${styleText("dim", g)}${styleText("green", U)} ${n}${o.hint ? ` ${styleText("dim", `(${o.hint})`)}` : ""}`;
		if (u === "submitted") return `${styleText("dim", n)}`;
		const $ = c || r ? styleText("dim", q) : "";
		return `${E}${styleText("dim", g)}${$} ${styleText("dim", n)}`;
	}, a = e.required ?? !0;
	return new yt$1({
		options: e.options,
		signal: e.signal,
		input: e.input,
		output: e.output,
		initialValues: e.initialValues,
		required: a,
		cursorAt: e.cursorAt,
		selectableGroups: r,
		validate(o) {
			if (a && (o === void 0 || o.length === 0)) return `Please select at least one option.
${styleText("reset", styleText("dim", `Press ${styleText([
				"gray",
				"bgWhite",
				"inverse"
			], " space ")} to select, ${styleText("gray", styleText(["bgWhite", "inverse"], " enter "))} to submit`))}`;
		},
		render() {
			const o = `${styleText("gray", h)}
${W(this.state)}  ${e.message}
`, u = this.value ?? [];
			switch (this.state) {
				case "submit": {
					const l = this.options.filter(({ value: c }) => u.includes(c)).map((c) => i(c, "submitted")), n = l.length === 0 ? "" : `  ${l.join(styleText("dim", ", "))}`;
					return `${o}${styleText("gray", h)}${n}`;
				}
				case "cancel": {
					const l = this.options.filter(({ value: n }) => u.includes(n)).map((n) => i(n, "cancelled")).join(styleText("dim", ", "));
					return `${o}${styleText("gray", h)}  ${l.trim() ? `${l}
${styleText("gray", h)}` : ""}`;
				}
				case "error": {
					const l = this.error.split(`
`).map((n, c) => c === 0 ? `${styleText("yellow", x)}  ${styleText("yellow", n)}` : `   ${n}`).join(`
`);
					return `${o}${styleText("yellow", h)}  ${this.options.map((n, c, p) => {
						const f = u.includes(n.value) || n.group === !0 && this.isGroupSelected(`${n.value}`), g = c === this.cursor;
						return !g && typeof n.group == "string" && this.options[this.cursor].value === n.group ? i(n, f ? "group-active-selected" : "group-active", p) : g && f ? i(n, "active-selected", p) : f ? i(n, "selected", p) : i(n, g ? "active" : "inactive", p);
					}).join(`
${styleText("yellow", h)}  `)}
${l}
`;
				}
				default: {
					const l = this.options.map((c, p, f) => {
						const g = u.includes(c.value) || c.group === !0 && this.isGroupSelected(`${c.value}`), E = p === this.cursor, $ = !E && typeof c.group == "string" && this.options[this.cursor].value === c.group;
						let m = "";
						return $ ? m = i(c, g ? "group-active-selected" : "group-active", f) : E && g ? m = i(c, "active-selected", f) : g ? m = i(c, "selected", f) : m = i(c, E ? "active" : "inactive", f), `${p !== 0 && !m.startsWith(`
`) ? "  " : ""}${m}`;
					}).join(`
${styleText("cyan", h)}`), n = l.startsWith(`
`) ? "" : "  ";
					return `${o}${styleText("cyan", h)}${n}${l}
${styleText("cyan", x)}
`;
				}
			}
		}
	}).prompt();
}, R = {
	message: (e = [], { symbol: r = styleText("gray", h), secondarySymbol: s = styleText("gray", h), output: i = process.stdout, spacing: a = 1, withGuide: o } = {}) => {
		const u = [], l = o ?? _.withGuide, n = l ? s : "", c = l ? `${r}  ` : "", p = l ? `${s}  ` : "";
		for (let g = 0; g < a; g++) u.push(n);
		const f = Array.isArray(e) ? e : e.split(`
`);
		if (f.length > 0) {
			const [g, ...E] = f;
			g.length > 0 ? u.push(`${c}${g}`) : u.push(l ? r : "");
			for (const $ of E) $.length > 0 ? u.push(`${p}${$}`) : u.push(l ? s : "");
		}
		i.write(`${u.join(`
`)}
`);
	},
	info: (e, r) => {
		R.message(e, {
			...r,
			symbol: styleText("blue", fe)
		});
	},
	success: (e, r) => {
		R.message(e, {
			...r,
			symbol: styleText("green", Fe)
		});
	},
	step: (e, r) => {
		R.message(e, {
			...r,
			symbol: styleText("green", V)
		});
	},
	warn: (e, r) => {
		R.message(e, {
			...r,
			symbol: styleText("yellow", ye)
		});
	},
	warning: (e, r) => {
		R.warn(e, r);
	},
	error: (e, r) => {
		R.message(e, {
			...r,
			symbol: styleText("red", Ee)
		});
	}
}, Nt = (e = "", r) => {
	const s = r?.output ?? process.stdout, i = r?.withGuide ?? _.withGuide ? `${styleText("gray", x)}  ` : "";
	s.write(`${i}${styleText("red", e)}

`);
}, Wt = (e = "", r) => {
	const s = r?.output ?? process.stdout, i = r?.withGuide ?? _.withGuide ? `${styleText("gray", he)}  ` : "";
	s.write(`${i}${e}
`);
}, Gt = (e = "", r) => {
	const s = r?.output ?? process.stdout, i = r?.withGuide ?? _.withGuide ? `${styleText("gray", h)}
${styleText("gray", x)}  ` : "";
	s.write(`${i}${e}

`);
}, Q = (e, r) => e.split(`
`).map((s) => r(s)).join(`
`), Lt = (e) => {
	const r = (i, a) => {
		const o = i.label ?? String(i.value);
		return a === "disabled" ? `${styleText("gray", q)} ${Q(o, (u) => styleText(["strikethrough", "gray"], u))}${i.hint ? ` ${styleText("dim", `(${i.hint ?? "disabled"})`)}` : ""}` : a === "active" ? `${styleText("cyan", te)} ${o}${i.hint ? ` ${styleText("dim", `(${i.hint})`)}` : ""}` : a === "selected" ? `${styleText("green", U)} ${Q(o, (u) => styleText("dim", u))}${i.hint ? ` ${styleText("dim", `(${i.hint})`)}` : ""}` : a === "cancelled" ? `${Q(o, (u) => styleText(["strikethrough", "dim"], u))}` : a === "active-selected" ? `${styleText("green", U)} ${o}${i.hint ? ` ${styleText("dim", `(${i.hint})`)}` : ""}` : a === "submitted" ? `${Q(o, (u) => styleText("dim", u))}` : `${styleText("dim", q)} ${Q(o, (u) => styleText("dim", u))}`;
	}, s = e.required ?? !0;
	return new Lt$1({
		options: e.options,
		signal: e.signal,
		input: e.input,
		output: e.output,
		initialValues: e.initialValues,
		required: s,
		cursorAt: e.cursorAt,
		validate(i) {
			if (s && (i === void 0 || i.length === 0)) return `Please select at least one option.
${styleText("reset", styleText("dim", `Press ${styleText([
				"gray",
				"bgWhite",
				"inverse"
			], " space ")} to select, ${styleText("gray", styleText("bgWhite", styleText("inverse", " enter ")))} to submit`))}`;
		},
		render() {
			const i = Bt$1(e.output, e.message, `${ve(this.state)}  `, `${W(this.state)}  `), a = `${styleText("gray", h)}
${i}
`, o = this.value ?? [], u = (l, n) => {
				if (l.disabled) return r(l, "disabled");
				const c = o.includes(l.value);
				return n && c ? r(l, "active-selected") : c ? r(l, "selected") : r(l, n ? "active" : "inactive");
			};
			switch (this.state) {
				case "submit": {
					const l = this.options.filter(({ value: c }) => o.includes(c)).map((c) => r(c, "submitted")).join(styleText("dim", ", ")) || styleText("dim", "none");
					return `${a}${Bt$1(e.output, l, `${styleText("gray", h)}  `)}`;
				}
				case "cancel": {
					const l = this.options.filter(({ value: c }) => o.includes(c)).map((c) => r(c, "cancelled")).join(styleText("dim", ", "));
					if (l.trim() === "") return `${a}${styleText("gray", h)}`;
					return `${a}${Bt$1(e.output, l, `${styleText("gray", h)}  `)}
${styleText("gray", h)}`;
				}
				case "error": {
					const l = `${styleText("yellow", h)}  `, n = this.error.split(`
`).map((f, g) => g === 0 ? `${styleText("yellow", x)}  ${styleText("yellow", f)}` : `   ${f}`).join(`
`), c = a.split(`
`).length, p = n.split(`
`).length + 1;
					return `${a}${l}${X({
						output: e.output,
						options: this.options,
						cursor: this.cursor,
						maxItems: e.maxItems,
						columnPadding: l.length,
						rowPadding: c + p,
						style: u
					}).join(`
${l}`)}
${n}
`;
				}
				default: {
					const l = `${styleText("cyan", h)}  `, n = a.split(`
`).length;
					return `${a}${l}${X({
						output: e.output,
						options: this.options,
						cursor: this.cursor,
						maxItems: e.maxItems,
						columnPadding: l.length,
						rowPadding: n + 2,
						style: u
					}).join(`
${l}`)}
${styleText("cyan", x)}
`;
				}
			}
		}
	}).prompt();
}, jt = (e) => styleText("dim", e), kt = (e, r, s) => {
	const i = {
		hard: !0,
		trim: !1
	}, a = J(e, r, i).split(`
`), o = a.reduce((n, c) => Math.max(D(c), n), 0);
	return J(e, r - (a.map(s).reduce((n, c) => Math.max(D(c), n), 0) - o), i);
}, Vt = (e = "", r = "", s) => {
	const i = s?.output ?? process$1.stdout, a = s?.withGuide ?? _.withGuide, o = s?.format ?? jt, u = [
		"",
		...kt(e, rt(i) - 6, o).split(`
`).map(o),
		""
	], l = D(r), n = Math.max(u.reduce((g, E) => {
		const $ = D(E);
		return $ > g ? $ : g;
	}, 0), l) + 2, c = u.map((g) => `${styleText("gray", h)}  ${g}${" ".repeat(n - D(g))}${styleText("gray", h)}`).join(`
`), p = a ? `${styleText("gray", h)}
` : "", f = a ? We : ge;
	i.write(`${p}${styleText("green", V)}  ${styleText("reset", r)} ${styleText("gray", se.repeat(Math.max(n - l - 1, 1)) + pe)}
${c}
${styleText("gray", f + se.repeat(n + 2) + me)}
`);
}, Ht = (e) => new Mt$1({
	validate: e.validate,
	mask: e.mask ?? Ne,
	signal: e.signal,
	input: e.input,
	output: e.output,
	render() {
		const r = e.withGuide ?? _.withGuide, s = `${r ? `${styleText("gray", h)}
` : ""}${W(this.state)}  ${e.message}
`, i = this.userInputWithCursor, a = this.masked;
		switch (this.state) {
			case "error": {
				const o = r ? `${styleText("yellow", h)}  ` : "", u = r ? `${styleText("yellow", x)}  ` : "", l = a ?? "";
				return e.clearOnError && this.clear(), `${s.trim()}
${o}${l}
${u}${styleText("yellow", this.error)}
`;
			}
			case "submit": return `${s}${r ? `${styleText("gray", h)}  ` : ""}${a ? styleText("dim", a) : ""}`;
			case "cancel": return `${s}${r ? `${styleText("gray", h)}  ` : ""}${a ? styleText(["strikethrough", "dim"], a) : ""}${a && r ? `
${styleText("gray", h)}` : ""}`;
			default: return `${s}${r ? `${styleText("cyan", h)}  ` : ""}${i}
${r ? styleText("cyan", x) : ""}
`;
		}
	}
}).prompt(), Ut = (e) => {
	const r = e.validate;
	return Xe({
		...e,
		initialUserInput: e.initialValue ?? e.root ?? process.cwd(),
		maxItems: 5,
		validate(s) {
			if (!Array.isArray(s)) {
				if (!s) return "Please select a path";
				if (r) return r(s);
			}
		},
		options() {
			const s = this.userInput;
			if (s === "") return [];
			try {
				let i;
				return existsSync(s) ? lstatSync(s).isDirectory() ? i = s : i = dirname(s) : i = dirname(s), readdirSync(i).map((a) => {
					const o = join(i, a);
					return {
						name: a,
						path: o,
						isDirectory: lstatSync(o).isDirectory()
					};
				}).filter(({ path: a, isDirectory: o }) => a.startsWith(s) && (e.directory || !o)).map((a) => ({ value: a.path }));
			} catch {
				return [];
			}
		}
	});
}, Kt = (e) => styleText("magenta", e), be = ({ indicator: e = "dots", onCancel: r, output: s = process.stdout, cancelMessage: i, errorMessage: a, frames: o = ee ? [
	"◒",
	"◐",
	"◓",
	"◑"
] : [
	"•",
	"o",
	"O",
	"0"
], delay: u = ee ? 80 : 120, signal: l, ...n } = {}) => {
	const c = ce();
	let p, f, g = !1, E = !1, $ = "", m, d = performance.now();
	const F = rt(s), y = n?.styleFrame ?? Kt, v = (B) => {
		const P = B > 1 ? a ?? _.messages.error : i ?? _.messages.cancel;
		E = B === 1, g && (k(P, B), E && typeof r == "function" && r());
	}, C = () => v(2), A = () => v(1), b = () => {
		process.on("uncaughtExceptionMonitor", C), process.on("unhandledRejection", C), process.on("SIGINT", A), process.on("SIGTERM", A), process.on("exit", v), l && l.addEventListener("abort", A);
	}, w = () => {
		process.removeListener("uncaughtExceptionMonitor", C), process.removeListener("unhandledRejection", C), process.removeListener("SIGINT", A), process.removeListener("SIGTERM", A), process.removeListener("exit", v), l && l.removeEventListener("abort", A);
	}, S = () => {
		if (m === void 0) return;
		c && s.write(`
`);
		const B = J(m, F, {
			hard: !0,
			trim: !1
		}).split(`
`);
		B.length > 1 && s.write(import_src$1.cursor.up(B.length - 1)), s.write(import_src$1.cursor.to(0)), s.write(import_src$1.erase.down());
	}, T = (B) => B.replace(/\.+$/, ""), M = (B) => {
		const P = (performance.now() - B) / 1e3, G = Math.floor(P / 60), L = Math.floor(P % 60);
		return G > 0 ? `[${G}m ${L}s]` : `[${L}s]`;
	}, O = n.withGuide ?? _.withGuide, le = (B = "") => {
		g = !0, p = xt$1({ output: s }), $ = T(B), d = performance.now(), O && s.write(`${styleText("gray", h)}
`);
		let P = 0, G = 0;
		b(), f = setInterval(() => {
			if (c && $ === m) return;
			S(), m = $;
			const L = y(o[P]);
			let Z;
			if (c) Z = `${L}  ${$}...`;
			else if (e === "timer") Z = `${L}  ${$} ${M(d)}`;
			else {
				const et = ".".repeat(Math.floor(G)).slice(0, 3);
				Z = `${L}  ${$}${et}`;
			}
			const Ze = J(Z, F, {
				hard: !0,
				trim: !1
			});
			s.write(Ze), P = P + 1 < o.length ? P + 1 : 0, G = G < 4 ? G + .125 : 0;
		}, u);
	}, k = (B = "", P = 0, G = !1) => {
		if (!g) return;
		g = !1, clearInterval(f), S();
		const L = P === 0 ? styleText("green", V) : P === 1 ? styleText("red", $e) : styleText("red", de);
		$ = B ?? $, G || (e === "timer" ? s.write(`${L}  ${$} ${M(d)}
`) : s.write(`${L}  ${$}
`)), w(), p();
	};
	return {
		start: le,
		stop: (B = "") => k(B, 0),
		message: (B = "") => {
			$ = T(B ?? $);
		},
		cancel: (B = "") => k(B, 1),
		error: (B = "") => k(B, 2),
		clear: () => k("", 0, !0),
		get isCancelled() {
			return E;
		}
	};
}, ze = {
	light: I("─", "-"),
	heavy: I("━", "="),
	block: I("█", "#")
};
const oe = (e, r) => e.includes(`
`) ? e.split(`
`).map((s) => r(s)).join(`
`) : r(e), Jt = (e) => {
	const r = (s, i) => {
		const a = s.label ?? String(s.value);
		switch (i) {
			case "disabled": return `${styleText("gray", H)} ${oe(a, (o) => styleText("gray", o))}${s.hint ? ` ${styleText("dim", `(${s.hint ?? "disabled"})`)}` : ""}`;
			case "selected": return `${oe(a, (o) => styleText("dim", o))}`;
			case "active": return `${styleText("green", z)} ${a}${s.hint ? ` ${styleText("dim", `(${s.hint})`)}` : ""}`;
			case "cancelled": return `${oe(a, (o) => styleText(["strikethrough", "dim"], o))}`;
			default: return `${styleText("dim", H)} ${oe(a, (o) => styleText("dim", o))}`;
		}
	};
	return new Tt$1({
		options: e.options,
		signal: e.signal,
		input: e.input,
		output: e.output,
		initialValue: e.initialValue,
		render() {
			const s = e.withGuide ?? _.withGuide, i = `${W(this.state)}  `, a = `${ve(this.state)}  `, o = Bt$1(e.output, e.message, a, i), u = `${s ? `${styleText("gray", h)}
` : ""}${o}
`;
			switch (this.state) {
				case "submit": {
					const l = s ? `${styleText("gray", h)}  ` : "";
					return `${u}${Bt$1(e.output, r(this.options[this.cursor], "selected"), l)}`;
				}
				case "cancel": {
					const l = s ? `${styleText("gray", h)}  ` : "";
					return `${u}${Bt$1(e.output, r(this.options[this.cursor], "cancelled"), l)}${s ? `
${styleText("gray", h)}` : ""}`;
				}
				default: {
					const l = s ? `${styleText("cyan", h)}  ` : "", n = s ? styleText("cyan", x) : "", c = u.split(`
`).length, p = s ? 2 : 1;
					return `${u}${l}${X({
						output: e.output,
						cursor: this.cursor,
						options: this.options,
						maxItems: e.maxItems,
						columnPadding: l.length,
						rowPadding: c + p,
						style: (f, g) => r(f, f.disabled ? "disabled" : g ? "active" : "inactive")
					}).join(`
${l}`)}
${n}
`;
				}
			}
		}
	}).prompt();
}, Xt = (e) => {
	const r = (s, i = "inactive") => {
		const a = s.label ?? String(s.value);
		return i === "selected" ? `${styleText("dim", a)}` : i === "cancelled" ? `${styleText(["strikethrough", "dim"], a)}` : i === "active" ? `${styleText(["bgCyan", "gray"], ` ${s.value} `)} ${a}${s.hint ? ` ${styleText("dim", `(${s.hint})`)}` : ""}` : `${styleText([
			"gray",
			"bgWhite",
			"inverse"
		], ` ${s.value} `)} ${a}${s.hint ? ` ${styleText("dim", `(${s.hint})`)}` : ""}`;
	};
	return new Wt$1({
		options: e.options,
		signal: e.signal,
		input: e.input,
		output: e.output,
		initialValue: e.initialValue,
		caseSensitive: e.caseSensitive,
		render() {
			const s = e.withGuide ?? _.withGuide, i = `${s ? `${styleText("gray", h)}
` : ""}${W(this.state)}  ${e.message}
`;
			switch (this.state) {
				case "submit": {
					const a = s ? `${styleText("gray", h)}  ` : "", o = this.options.find((l) => l.value === this.value) ?? e.options[0];
					return `${i}${Bt$1(e.output, r(o, "selected"), a)}`;
				}
				case "cancel": {
					const a = s ? `${styleText("gray", h)}  ` : "";
					return `${i}${Bt$1(e.output, r(this.options[0], "cancelled"), a)}${s ? `
${styleText("gray", h)}` : ""}`;
				}
				default: {
					const a = s ? `${styleText("cyan", h)}  ` : "", o = s ? styleText("cyan", x) : "";
					return `${i}${this.options.map((l, n) => Bt$1(e.output, r(l, n === this.cursor ? "active" : "inactive"), a)).join(`
`)}
${o}
`;
				}
			}
		}
	}).prompt();
}, Qe = `${styleText("gray", h)}  `, K = {
	message: async (e, { symbol: r = styleText("gray", h) } = {}) => {
		process.stdout.write(`${styleText("gray", h)}
${r}  `);
		let s = 3;
		for await (let i of e) {
			i = i.replace(/\n/g, `
${Qe}`), i.includes(`
`) && (s = 3 + stripVTControlCharacters(i.slice(i.lastIndexOf(`
`))).length);
			const a = stripVTControlCharacters(i).length;
			s + a < process.stdout.columns ? (s += a, process.stdout.write(i)) : (process.stdout.write(`
${Qe}${i.trimStart()}`), s = 3 + stripVTControlCharacters(i.trimStart()).length);
		}
		process.stdout.write(`
`);
	},
	info: (e) => K.message(e, { symbol: styleText("blue", fe) }),
	success: (e) => K.message(e, { symbol: styleText("green", Fe) }),
	step: (e) => K.message(e, { symbol: styleText("green", V) }),
	warn: (e) => K.message(e, { symbol: styleText("yellow", ye) }),
	warning: (e) => K.warn(e),
	error: (e) => K.message(e, { symbol: styleText("red", Ee) })
}, Yt = async (e, r) => {
	for (const s of e) {
		if (s.enabled === !1) continue;
		const i = be(r);
		i.start(s.title);
		const a = await s.task(i.message);
		i.stop(a || s.title);
	}
}, zt = (e) => e.replace(/\x1b\[(?:\d+;)*\d*[ABCDEFGHfJKSTsu]|\x1b\[(s|u)/g, ""), Qt = (e) => {
	const r = e.output ?? process.stdout, s = rt(r), i = styleText("gray", h), a = e.spacing ?? 1, o = 3, u = e.retainLog === !0, l = !ce() && Me(r);
	r.write(`${i}
`), r.write(`${styleText("green", V)}  ${e.title}
`);
	for (let d = 0; d < a; d++) r.write(`${i}
`);
	const n = [{
		value: "",
		full: ""
	}];
	let c = !1;
	const p = (d) => {
		if (n.length === 0) return;
		let F = 0;
		d && (F += a + 2);
		for (const y of n) {
			const { value: v, result: C } = y;
			let A = C?.message ?? v;
			if (A.length === 0) continue;
			C === void 0 && y.header !== void 0 && y.header !== "" && (A += `
${y.header}`);
			const b = A.split(`
`).reduce((w, S) => S === "" ? w + 1 : w + Math.ceil((S.length + o) / s), 0);
			F += b;
		}
		F > 0 && (F += 1, r.write(import_src$1.erase.lines(F)));
	}, f = (d, F, y) => {
		const v = y ? `${d.full}
${d.value}` : d.value;
		d.header !== void 0 && d.header !== "" && R.message(d.header.split(`
`).map((C) => styleText("bold", C)), {
			output: r,
			secondarySymbol: i,
			symbol: i,
			spacing: 0
		}), R.message(v.split(`
`).map((C) => styleText("dim", C)), {
			output: r,
			secondarySymbol: i,
			symbol: i,
			spacing: F ?? a
		});
	}, g = () => {
		for (const d of n) {
			const { header: F, value: y, full: v } = d;
			(F === void 0 || F.length === 0) && y.length === 0 || f(d, void 0, u === !0 && v.length > 0);
		}
	}, E = (d, F, y) => {
		if (p(!1), (y?.raw !== !0 || !c) && d.value !== "" && (d.value += `
`), d.value += zt(F), c = y?.raw === !0, e.limit !== void 0) {
			const v = d.value.split(`
`), C = v.length - e.limit;
			if (C > 0) {
				const A = v.splice(0, C);
				u && (d.full += (d.full === "" ? "" : `
`) + A.join(`
`));
			}
			d.value = v.join(`
`);
		}
		l && $();
	}, $ = () => {
		for (const d of n) d.result ? d.result.status === "error" ? R.error(d.result.message, {
			output: r,
			secondarySymbol: i,
			spacing: 0
		}) : R.success(d.result.message, {
			output: r,
			secondarySymbol: i,
			spacing: 0
		}) : d.value !== "" && f(d, 0);
	}, m = (d, F) => {
		p(!1), d.result = F, l && $();
	};
	return {
		message(d, F) {
			E(n[0], d, F);
		},
		group(d) {
			const F = {
				header: d,
				value: "",
				full: ""
			};
			return n.push(F), {
				message(y, v) {
					E(F, y, v);
				},
				error(y) {
					m(F, {
						status: "error",
						message: y
					});
				},
				success(y) {
					m(F, {
						status: "success",
						message: y
					});
				}
			};
		},
		error(d, F) {
			p(!0), R.error(d, {
				output: r,
				secondarySymbol: i,
				spacing: 1
			}), F?.showLog !== !1 && g(), n.splice(1, n.length - 1), n[0].value = "", n[0].full = "";
		},
		success(d, F) {
			p(!0), R.success(d, {
				output: r,
				secondarySymbol: i,
				spacing: 1
			}), F?.showLog === !0 && g(), n.splice(1, n.length - 1), n[0].value = "", n[0].full = "";
		}
	};
}, Zt = (e) => new $t({
	validate: e.validate,
	placeholder: e.placeholder,
	defaultValue: e.defaultValue,
	initialValue: e.initialValue,
	output: e.output,
	signal: e.signal,
	input: e.input,
	render() {
		const r = e?.withGuide ?? _.withGuide, s = `${`${r ? `${styleText("gray", h)}
` : ""}${W(this.state)}  `}${e.message}
`, i = e.placeholder ? styleText("inverse", e.placeholder[0]) + styleText("dim", e.placeholder.slice(1)) : styleText(["inverse", "hidden"], "_"), a = this.userInput ? this.userInputWithCursor : i, o = this.value ?? "";
		switch (this.state) {
			case "error": {
				const u = this.error ? `  ${styleText("yellow", this.error)}` : "", l = r ? `${styleText("yellow", h)}  ` : "", n = r ? styleText("yellow", x) : "";
				return `${s.trim()}
${l}${a}
${n}${u}
`;
			}
			case "submit": {
				const u = o ? `  ${styleText("dim", o)}` : "";
				return `${s}${r ? styleText("gray", h) : ""}${u}`;
			}
			case "cancel": {
				const u = o ? `  ${styleText(["strikethrough", "dim"], o)}` : "", l = r ? styleText("gray", h) : "";
				return `${s}${l}${u}${o.trim() ? `
${l}` : ""}`;
			}
			default: return `${s}${r ? `${styleText("cyan", h)}  ` : ""}${a}
${r ? styleText("cyan", x) : ""}
`;
		}
	}
}).prompt();

//#endregion
//#region ../../node_modules/.pnpm/ms@2.1.3/node_modules/ms/index.js
var require_ms = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Helpers.
	*/
	var s = 1e3;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var w = d * 7;
	var y = d * 365.25;
	/**
	* Parse or format the given `val`.
	*
	* Options:
	*
	*  - `long` verbose formatting [false]
	*
	* @param {String|Number} val
	* @param {Object} [options]
	* @throws {Error} throw an error if val is not a non-empty string or a number
	* @return {String|Number}
	* @api public
	*/
	module.exports = function(val, options) {
		options = options || {};
		var type = typeof val;
		if (type === "string" && val.length > 0) return parse(val);
		else if (type === "number" && isFinite(val)) return options.long ? fmtLong(val) : fmtShort(val);
		throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
	};
	/**
	* Parse the given `str` and return milliseconds.
	*
	* @param {String} str
	* @return {Number}
	* @api private
	*/
	function parse(str) {
		str = String(str);
		if (str.length > 100) return;
		var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
		if (!match) return;
		var n = parseFloat(match[1]);
		switch ((match[2] || "ms").toLowerCase()) {
			case "years":
			case "year":
			case "yrs":
			case "yr":
			case "y": return n * y;
			case "weeks":
			case "week":
			case "w": return n * w;
			case "days":
			case "day":
			case "d": return n * d;
			case "hours":
			case "hour":
			case "hrs":
			case "hr":
			case "h": return n * h;
			case "minutes":
			case "minute":
			case "mins":
			case "min":
			case "m": return n * m;
			case "seconds":
			case "second":
			case "secs":
			case "sec":
			case "s": return n * s;
			case "milliseconds":
			case "millisecond":
			case "msecs":
			case "msec":
			case "ms": return n;
			default: return;
		}
	}
	/**
	* Short format for `ms`.
	*
	* @param {Number} ms
	* @return {String}
	* @api private
	*/
	function fmtShort(ms) {
		var msAbs = Math.abs(ms);
		if (msAbs >= d) return Math.round(ms / d) + "d";
		if (msAbs >= h) return Math.round(ms / h) + "h";
		if (msAbs >= m) return Math.round(ms / m) + "m";
		if (msAbs >= s) return Math.round(ms / s) + "s";
		return ms + "ms";
	}
	/**
	* Long format for `ms`.
	*
	* @param {Number} ms
	* @return {String}
	* @api private
	*/
	function fmtLong(ms) {
		var msAbs = Math.abs(ms);
		if (msAbs >= d) return plural(ms, msAbs, d, "day");
		if (msAbs >= h) return plural(ms, msAbs, h, "hour");
		if (msAbs >= m) return plural(ms, msAbs, m, "minute");
		if (msAbs >= s) return plural(ms, msAbs, s, "second");
		return ms + " ms";
	}
	/**
	* Pluralization helper.
	*/
	function plural(ms, msAbs, n, name) {
		var isPlural = msAbs >= n * 1.5;
		return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
	}
}));

//#endregion
//#region ../../node_modules/.pnpm/debug@4.4.3/node_modules/debug/src/common.js
var require_common = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* This is the common logic for both the Node.js and web browser
	* implementations of `debug()`.
	*/
	function setup(env) {
		createDebug.debug = createDebug;
		createDebug.default = createDebug;
		createDebug.coerce = coerce;
		createDebug.disable = disable;
		createDebug.enable = enable;
		createDebug.enabled = enabled;
		createDebug.humanize = require_ms();
		createDebug.destroy = destroy;
		Object.keys(env).forEach((key) => {
			createDebug[key] = env[key];
		});
		/**
		* The currently active debug mode names, and names to skip.
		*/
		createDebug.names = [];
		createDebug.skips = [];
		/**
		* Map of special "%n" handling functions, for the debug "format" argument.
		*
		* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
		*/
		createDebug.formatters = {};
		/**
		* Selects a color for a debug namespace
		* @param {String} namespace The namespace string for the debug instance to be colored
		* @return {Number|String} An ANSI color code for the given namespace
		* @api private
		*/
		function selectColor(namespace) {
			let hash = 0;
			for (let i = 0; i < namespace.length; i++) {
				hash = (hash << 5) - hash + namespace.charCodeAt(i);
				hash |= 0;
			}
			return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
		}
		createDebug.selectColor = selectColor;
		/**
		* Create a debugger with the given `namespace`.
		*
		* @param {String} namespace
		* @return {Function}
		* @api public
		*/
		function createDebug(namespace) {
			let prevTime;
			let enableOverride = null;
			let namespacesCache;
			let enabledCache;
			function debug(...args) {
				if (!debug.enabled) return;
				const self = debug;
				const curr = Number(/* @__PURE__ */ new Date());
				self.diff = curr - (prevTime || curr);
				self.prev = prevTime;
				self.curr = curr;
				prevTime = curr;
				args[0] = createDebug.coerce(args[0]);
				if (typeof args[0] !== "string") args.unshift("%O");
				let index = 0;
				args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
					if (match === "%%") return "%";
					index++;
					const formatter = createDebug.formatters[format];
					if (typeof formatter === "function") {
						const val = args[index];
						match = formatter.call(self, val);
						args.splice(index, 1);
						index--;
					}
					return match;
				});
				createDebug.formatArgs.call(self, args);
				(self.log || createDebug.log).apply(self, args);
			}
			debug.namespace = namespace;
			debug.useColors = createDebug.useColors();
			debug.color = createDebug.selectColor(namespace);
			debug.extend = extend;
			debug.destroy = createDebug.destroy;
			Object.defineProperty(debug, "enabled", {
				enumerable: true,
				configurable: false,
				get: () => {
					if (enableOverride !== null) return enableOverride;
					if (namespacesCache !== createDebug.namespaces) {
						namespacesCache = createDebug.namespaces;
						enabledCache = createDebug.enabled(namespace);
					}
					return enabledCache;
				},
				set: (v) => {
					enableOverride = v;
				}
			});
			if (typeof createDebug.init === "function") createDebug.init(debug);
			return debug;
		}
		function extend(namespace, delimiter) {
			const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
			newDebug.log = this.log;
			return newDebug;
		}
		/**
		* Enables a debug mode by namespaces. This can include modes
		* separated by a colon and wildcards.
		*
		* @param {String} namespaces
		* @api public
		*/
		function enable(namespaces) {
			createDebug.save(namespaces);
			createDebug.namespaces = namespaces;
			createDebug.names = [];
			createDebug.skips = [];
			const split = (typeof namespaces === "string" ? namespaces : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
			for (const ns of split) if (ns[0] === "-") createDebug.skips.push(ns.slice(1));
			else createDebug.names.push(ns);
		}
		/**
		* Checks if the given string matches a namespace template, honoring
		* asterisks as wildcards.
		*
		* @param {String} search
		* @param {String} template
		* @return {Boolean}
		*/
		function matchesTemplate(search, template) {
			let searchIndex = 0;
			let templateIndex = 0;
			let starIndex = -1;
			let matchIndex = 0;
			while (searchIndex < search.length) if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) if (template[templateIndex] === "*") {
				starIndex = templateIndex;
				matchIndex = searchIndex;
				templateIndex++;
			} else {
				searchIndex++;
				templateIndex++;
			}
			else if (starIndex !== -1) {
				templateIndex = starIndex + 1;
				matchIndex++;
				searchIndex = matchIndex;
			} else return false;
			while (templateIndex < template.length && template[templateIndex] === "*") templateIndex++;
			return templateIndex === template.length;
		}
		/**
		* Disable debug output.
		*
		* @return {String} namespaces
		* @api public
		*/
		function disable() {
			const namespaces = [...createDebug.names, ...createDebug.skips.map((namespace) => "-" + namespace)].join(",");
			createDebug.enable("");
			return namespaces;
		}
		/**
		* Returns true if the given mode name is enabled, false otherwise.
		*
		* @param {String} name
		* @return {Boolean}
		* @api public
		*/
		function enabled(name) {
			for (const skip of createDebug.skips) if (matchesTemplate(name, skip)) return false;
			for (const ns of createDebug.names) if (matchesTemplate(name, ns)) return true;
			return false;
		}
		/**
		* Coerce `val`.
		*
		* @param {Mixed} val
		* @return {Mixed}
		* @api private
		*/
		function coerce(val) {
			if (val instanceof Error) return val.stack || val.message;
			return val;
		}
		/**
		* XXX DO NOT USE. This is a temporary stub function.
		* XXX It WILL be removed in the next major release.
		*/
		function destroy() {
			console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
		}
		createDebug.enable(createDebug.load());
		return createDebug;
	}
	module.exports = setup;
}));

//#endregion
//#region ../../node_modules/.pnpm/debug@4.4.3/node_modules/debug/src/browser.js
var require_browser = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* This is the web browser implementation of `debug()`.
	*/
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = localstorage();
	exports.destroy = (() => {
		let warned = false;
		return () => {
			if (!warned) {
				warned = true;
				console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
			}
		};
	})();
	/**
	* Colors.
	*/
	exports.colors = [
		"#0000CC",
		"#0000FF",
		"#0033CC",
		"#0033FF",
		"#0066CC",
		"#0066FF",
		"#0099CC",
		"#0099FF",
		"#00CC00",
		"#00CC33",
		"#00CC66",
		"#00CC99",
		"#00CCCC",
		"#00CCFF",
		"#3300CC",
		"#3300FF",
		"#3333CC",
		"#3333FF",
		"#3366CC",
		"#3366FF",
		"#3399CC",
		"#3399FF",
		"#33CC00",
		"#33CC33",
		"#33CC66",
		"#33CC99",
		"#33CCCC",
		"#33CCFF",
		"#6600CC",
		"#6600FF",
		"#6633CC",
		"#6633FF",
		"#66CC00",
		"#66CC33",
		"#9900CC",
		"#9900FF",
		"#9933CC",
		"#9933FF",
		"#99CC00",
		"#99CC33",
		"#CC0000",
		"#CC0033",
		"#CC0066",
		"#CC0099",
		"#CC00CC",
		"#CC00FF",
		"#CC3300",
		"#CC3333",
		"#CC3366",
		"#CC3399",
		"#CC33CC",
		"#CC33FF",
		"#CC6600",
		"#CC6633",
		"#CC9900",
		"#CC9933",
		"#CCCC00",
		"#CCCC33",
		"#FF0000",
		"#FF0033",
		"#FF0066",
		"#FF0099",
		"#FF00CC",
		"#FF00FF",
		"#FF3300",
		"#FF3333",
		"#FF3366",
		"#FF3399",
		"#FF33CC",
		"#FF33FF",
		"#FF6600",
		"#FF6633",
		"#FF9900",
		"#FF9933",
		"#FFCC00",
		"#FFCC33"
	];
	/**
	* Currently only WebKit-based Web Inspectors, Firefox >= v31,
	* and the Firebug extension (any Firefox version) are known
	* to support "%c" CSS customizations.
	*
	* TODO: add a `localStorage` variable to explicitly enable/disable colors
	*/
	function useColors() {
		if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) return true;
		if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) return false;
		let m;
		return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator !== "undefined" && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
	}
	/**
	* Colorize log arguments if enabled.
	*
	* @api public
	*/
	function formatArgs(args) {
		args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
		if (!this.useColors) return;
		const c = "color: " + this.color;
		args.splice(1, 0, c, "color: inherit");
		let index = 0;
		let lastC = 0;
		args[0].replace(/%[a-zA-Z%]/g, (match) => {
			if (match === "%%") return;
			index++;
			if (match === "%c") lastC = index;
		});
		args.splice(lastC, 0, c);
	}
	/**
	* Invokes `console.debug()` when available.
	* No-op when `console.debug` is not a "function".
	* If `console.debug` is not available, falls back
	* to `console.log`.
	*
	* @api public
	*/
	exports.log = console.debug || console.log || (() => {});
	/**
	* Save `namespaces`.
	*
	* @param {String} namespaces
	* @api private
	*/
	function save(namespaces) {
		try {
			if (namespaces) exports.storage.setItem("debug", namespaces);
			else exports.storage.removeItem("debug");
		} catch (error) {}
	}
	/**
	* Load `namespaces`.
	*
	* @return {String} returns the previously persisted debug modes
	* @api private
	*/
	function load() {
		let r;
		try {
			r = exports.storage.getItem("debug") || exports.storage.getItem("DEBUG");
		} catch (error) {}
		if (!r && typeof process !== "undefined" && "env" in process) r = process.env.DEBUG;
		return r;
	}
	/**
	* Localstorage attempts to return the localstorage.
	*
	* This is necessary because safari throws
	* when a user disables cookies/localstorage
	* and you attempt to access it.
	*
	* @return {LocalStorage}
	* @api private
	*/
	function localstorage() {
		try {
			return localStorage;
		} catch (error) {}
	}
	module.exports = require_common()(exports);
	const { formatters } = module.exports;
	/**
	* Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	*/
	formatters.j = function(v) {
		try {
			return JSON.stringify(v);
		} catch (error) {
			return "[UnexpectedJSONParseError]: " + error.message;
		}
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/supports-color@10.2.2/node_modules/supports-color/index.js
var supports_color_exports = /* @__PURE__ */ __exportAll({
	createSupportsColor: () => createSupportsColor,
	default: () => supportsColor
});
function hasFlag(flag, argv = globalThis.Deno ? globalThis.Deno.args : process$1.argv) {
	const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
	const position = argv.indexOf(prefix + flag);
	const terminatorPosition = argv.indexOf("--");
	return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
}
function envForceColor() {
	if (!("FORCE_COLOR" in env)) return;
	if (env.FORCE_COLOR === "true") return 1;
	if (env.FORCE_COLOR === "false") return 0;
	if (env.FORCE_COLOR.length === 0) return 1;
	const level = Math.min(Number.parseInt(env.FORCE_COLOR, 10), 3);
	if (![
		0,
		1,
		2,
		3
	].includes(level)) return;
	return level;
}
function translateLevel(level) {
	if (level === 0) return false;
	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
}
function _supportsColor(haveStream, { streamIsTTY, sniffFlags = true } = {}) {
	const noFlagForceColor = envForceColor();
	if (noFlagForceColor !== void 0) flagForceColor = noFlagForceColor;
	const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;
	if (forceColor === 0) return 0;
	if (sniffFlags) {
		if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) return 3;
		if (hasFlag("color=256")) return 2;
	}
	if ("TF_BUILD" in env && "AGENT_NAME" in env) return 1;
	if (haveStream && !streamIsTTY && forceColor === void 0) return 0;
	const min = forceColor || 0;
	if (env.TERM === "dumb") return min;
	if (process$1.platform === "win32") {
		const osRelease = os.release().split(".");
		if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) return Number(osRelease[2]) >= 14931 ? 3 : 2;
		return 1;
	}
	if ("CI" in env) {
		if ([
			"GITHUB_ACTIONS",
			"GITEA_ACTIONS",
			"CIRCLECI"
		].some((key) => key in env)) return 3;
		if ([
			"TRAVIS",
			"APPVEYOR",
			"GITLAB_CI",
			"BUILDKITE",
			"DRONE"
		].some((sign) => sign in env) || env.CI_NAME === "codeship") return 1;
		return min;
	}
	if ("TEAMCITY_VERSION" in env) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	if (env.COLORTERM === "truecolor") return 3;
	if (env.TERM === "xterm-kitty") return 3;
	if (env.TERM === "xterm-ghostty") return 3;
	if (env.TERM === "wezterm") return 3;
	if ("TERM_PROGRAM" in env) {
		const version = Number.parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
		switch (env.TERM_PROGRAM) {
			case "iTerm.app": return version >= 3 ? 3 : 2;
			case "Apple_Terminal": return 2;
		}
	}
	if (/-256(color)?$/i.test(env.TERM)) return 2;
	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) return 1;
	if ("COLORTERM" in env) return 1;
	return min;
}
function createSupportsColor(stream, options = {}) {
	return translateLevel(_supportsColor(stream, {
		streamIsTTY: stream && stream.isTTY,
		...options
	}));
}
var env, flagForceColor, supportsColor;
var init_supports_color = __esmMin((() => {
	({env} = process$1);
	;
	if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) flagForceColor = 0;
	else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) flagForceColor = 1;
	supportsColor = {
		stdout: createSupportsColor({ isTTY: tty.isatty(1) }),
		stderr: createSupportsColor({ isTTY: tty.isatty(2) })
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/debug@4.4.3/node_modules/debug/src/node.js
var require_node = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Module dependencies.
	*/
	const tty$1 = __require("tty");
	const util = __require("util");
	/**
	* This is the Node.js implementation of `debug()`.
	*/
	exports.init = init;
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.destroy = util.deprecate(() => {}, "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
	/**
	* Colors.
	*/
	exports.colors = [
		6,
		2,
		3,
		4,
		5,
		1
	];
	try {
		const supportsColor = (init_supports_color(), __toCommonJS(supports_color_exports));
		if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) exports.colors = [
			20,
			21,
			26,
			27,
			32,
			33,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			56,
			57,
			62,
			63,
			68,
			69,
			74,
			75,
			76,
			77,
			78,
			79,
			80,
			81,
			92,
			93,
			98,
			99,
			112,
			113,
			128,
			129,
			134,
			135,
			148,
			149,
			160,
			161,
			162,
			163,
			164,
			165,
			166,
			167,
			168,
			169,
			170,
			171,
			172,
			173,
			178,
			179,
			184,
			185,
			196,
			197,
			198,
			199,
			200,
			201,
			202,
			203,
			204,
			205,
			206,
			207,
			208,
			209,
			214,
			215,
			220,
			221
		];
	} catch (error) {}
	/**
	* Build up the default `inspectOpts` object from the environment variables.
	*
	*   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
	*/
	exports.inspectOpts = Object.keys(process.env).filter((key) => {
		return /^debug_/i.test(key);
	}).reduce((obj, key) => {
		const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
			return k.toUpperCase();
		});
		let val = process.env[key];
		if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
		else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
		else if (val === "null") val = null;
		else val = Number(val);
		obj[prop] = val;
		return obj;
	}, {});
	/**
	* Is stdout a TTY? Colored output is enabled when `true`.
	*/
	function useColors() {
		return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty$1.isatty(process.stderr.fd);
	}
	/**
	* Adds ANSI color escape codes if enabled.
	*
	* @api public
	*/
	function formatArgs(args) {
		const { namespace: name, useColors } = this;
		if (useColors) {
			const c = this.color;
			const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
			const prefix = `  ${colorCode};1m${name} \u001B[0m`;
			args[0] = prefix + args[0].split("\n").join("\n" + prefix);
			args.push(colorCode + "m+" + module.exports.humanize(this.diff) + "\x1B[0m");
		} else args[0] = getDate() + name + " " + args[0];
	}
	function getDate() {
		if (exports.inspectOpts.hideDate) return "";
		return (/* @__PURE__ */ new Date()).toISOString() + " ";
	}
	/**
	* Invokes `util.formatWithOptions()` with the specified arguments and writes to stderr.
	*/
	function log(...args) {
		return process.stderr.write(util.formatWithOptions(exports.inspectOpts, ...args) + "\n");
	}
	/**
	* Save `namespaces`.
	*
	* @param {String} namespaces
	* @api private
	*/
	function save(namespaces) {
		if (namespaces) process.env.DEBUG = namespaces;
		else delete process.env.DEBUG;
	}
	/**
	* Load `namespaces`.
	*
	* @return {String} returns the previously persisted debug modes
	* @api private
	*/
	function load() {
		return process.env.DEBUG;
	}
	/**
	* Init logic for `debug` instances.
	*
	* Create a new `inspectOpts` object in case `useColors` is set
	* differently for a particular `debug` instance.
	*/
	function init(debug) {
		debug.inspectOpts = {};
		const keys = Object.keys(exports.inspectOpts);
		for (let i = 0; i < keys.length; i++) debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
	}
	module.exports = require_common()(exports);
	const { formatters } = module.exports;
	/**
	* Map %o to `util.inspect()`, all on a single line.
	*/
	formatters.o = function(v) {
		this.inspectOpts.colors = this.useColors;
		return util.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
	};
	/**
	* Map %O to `util.inspect()`, allowing multiple lines if needed.
	*/
	formatters.O = function(v) {
		this.inspectOpts.colors = this.useColors;
		return util.inspect(v, this.inspectOpts);
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/debug@4.4.3/node_modules/debug/src/index.js
var require_src = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Detect Electron renderer / nwjs process, which is node, but we should
	* treat as a browser.
	*/
	if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) module.exports = require_browser();
	else module.exports = require_node();
}));

//#endregion
//#region src/utils/logger.ts
var import_src = /* @__PURE__ */ __toESM(require_src(), 1);
const logger = R;
const debug = (0, import_src.default)("nuxi");

//#endregion
export { Ct$1 as _, Gt as a, Nt as c, Vt as d, Wt as f, xt as g, be as h, supportsColor as i, Qt as l, Zt as m, logger as n, Jt as o, Yt as p, init_supports_color as r, Mt as s, debug as t, Rt as u };