import { a as join, c as resolve, i as isAbsolute, n as dirname, o as normalize } from "./pathe.M-eThtNZ-0R4k6vpe.mjs";
import { a as resolveModulePath } from "./kit-BNf015SG.mjs";
import { fileURLToPath } from "node:url";
import { promises, statSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";

//#region ../../node_modules/.pnpm/confbox@0.2.4/node_modules/confbox/dist/_chunks/rolldown-runtime.mjs
var e$2 = Object.create, t$5 = Object.defineProperty, n$5 = Object.getOwnPropertyDescriptor, r$5 = Object.getOwnPropertyNames, i$3 = Object.getPrototypeOf, a$3 = Object.prototype.hasOwnProperty, o$3 = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports), s$1 = (e, i, o, s) => {
	if (i && typeof i == `object` || typeof i == `function`) for (var c = r$5(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a$3.call(e, d) && d !== o && t$5(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n$5(i, d)) || s.enumerable
	});
	return e;
}, c$1 = (n, r, a) => (a = n == null ? {} : e$2(i$3(n)), s$1(r || !n || !n.__esModule ? t$5(a, `default`, {
	value: n,
	enumerable: !0
}) : a, n));

//#endregion
//#region ../../node_modules/.pnpm/confbox@0.2.4/node_modules/confbox/dist/_chunks/libs/detect-indent.mjs
const e$1 = /^(?:( )+|\t+)/, t$4 = `space`;
function n$4(e, n, r) {
	return e && n === t$4 && r === 1;
}
function r$4(r, a) {
	let o = /* @__PURE__ */ new Map(), s = 0, c, l;
	for (let u of r.split(/\n/g)) {
		if (!u) continue;
		let r = u.match(e$1);
		if (r === null) s = 0, c = ``;
		else {
			let e = r[0].length, u = r[1] ? t$4 : `tab`;
			if (n$4(a, u, e)) continue;
			u !== c && (s = 0), c = u;
			let d = 1, f = 0, p = e - s;
			if (s = e, p === 0) d = 0, f = 1;
			else {
				let e = Math.abs(p);
				if (n$4(a, u, e)) continue;
				l = i$2(u, e);
			}
			let m = o.get(l);
			o.set(l, m === void 0 ? [1, 0] : [m[0] + d, m[1] + f]);
		}
	}
	return o;
}
function i$2(e, n) {
	return (e === t$4 ? `s` : `t`) + String(n);
}
function a$2(e) {
	return {
		type: e[0] === `s` ? t$4 : `tab`,
		amount: Number(e.slice(1))
	};
}
function o$2(e) {
	let t, n = 0, r = 0;
	for (let [i, [a, o]] of e) (a > n || a === n && o > r) && (n = a, r = o, t = i);
	return t;
}
function s(e, n) {
	return (e === t$4 ? ` ` : `	`).repeat(n);
}
function c(e) {
	if (typeof e != `string`) throw TypeError(`Expected a string`);
	let t = r$4(e, !0);
	t.size === 0 && (t = r$4(e, !1));
	let n = o$2(t), i, c = 0, l = ``;
	return n !== void 0 && ({type: i, amount: c} = a$2(n), l = s(i, c)), {
		amount: c,
		type: i,
		indent: l
	};
}

//#endregion
//#region ../../node_modules/.pnpm/confbox@0.2.4/node_modules/confbox/dist/_chunks/_format.mjs
const t$3 = Symbol.for(`__confbox_fmt__`), n$3 = /^(\s+)/, r$3 = /(\s+)$/;
function i$1(e, t = {}) {
	return {
		sample: t.indent === void 0 && t.preserveIndentation !== !1 && e.slice(0, t?.sampleSize || 1024),
		whiteSpace: t.preserveWhitespace === !1 ? void 0 : {
			start: n$3.exec(e)?.[0] || ``,
			end: r$3.exec(e)?.[0] || ``
		}
	};
}
function a$1(e, n, r) {
	!n || typeof n != `object` || Object.defineProperty(n, t$3, {
		enumerable: !1,
		configurable: !0,
		writable: !0,
		value: i$1(e, r)
	});
}
function o$1(n, r) {
	if (!n || typeof n != `object` || !(t$3 in n)) return {
		indent: r?.indent ?? 2,
		whitespace: {
			start: ``,
			end: ``
		}
	};
	let i = n[t$3];
	return {
		indent: r?.indent || c(i.sample || ``).indent,
		whitespace: i.whiteSpace || {
			start: ``,
			end: ``
		}
	};
}

//#endregion
//#region ../../node_modules/.pnpm/confbox@0.2.4/node_modules/confbox/dist/_chunks/libs/jsonc-parser.mjs
function e(e, i = !1) {
	let a = e.length, o = 0, s = ``, c = 0, l = 16, u = 0, d = 0, f = 0, p = 0, m = 0;
	function h(t, n) {
		let r = 0, i = 0;
		for (; r < t || !n;) {
			let t = e.charCodeAt(o);
			if (t >= 48 && t <= 57) i = i * 16 + t - 48;
			else if (t >= 65 && t <= 70) i = i * 16 + t - 65 + 10;
			else if (t >= 97 && t <= 102) i = i * 16 + t - 97 + 10;
			else break;
			o++, r++;
		}
		return r < t && (i = -1), i;
	}
	function g(e) {
		o = e, s = ``, c = 0, l = 16, m = 0;
	}
	function _() {
		let t = o;
		if (e.charCodeAt(o) === 48) o++;
		else for (o++; o < e.length && r$2(e.charCodeAt(o));) o++;
		if (o < e.length && e.charCodeAt(o) === 46) if (o++, o < e.length && r$2(e.charCodeAt(o))) for (o++; o < e.length && r$2(e.charCodeAt(o));) o++;
		else return m = 3, e.substring(t, o);
		let n = o;
		if (o < e.length && (e.charCodeAt(o) === 69 || e.charCodeAt(o) === 101)) if (o++, (o < e.length && e.charCodeAt(o) === 43 || e.charCodeAt(o) === 45) && o++, o < e.length && r$2(e.charCodeAt(o))) {
			for (o++; o < e.length && r$2(e.charCodeAt(o));) o++;
			n = o;
		} else m = 3;
		return e.substring(t, n);
	}
	function v() {
		let t = ``, r = o;
		for (;;) {
			if (o >= a) {
				t += e.substring(r, o), m = 2;
				break;
			}
			let i = e.charCodeAt(o);
			if (i === 34) {
				t += e.substring(r, o), o++;
				break;
			}
			if (i === 92) {
				if (t += e.substring(r, o), o++, o >= a) {
					m = 2;
					break;
				}
				switch (e.charCodeAt(o++)) {
					case 34:
						t += `"`;
						break;
					case 92:
						t += `\\`;
						break;
					case 47:
						t += `/`;
						break;
					case 98:
						t += `\b`;
						break;
					case 102:
						t += `\f`;
						break;
					case 110:
						t += `
`;
						break;
					case 114:
						t += `\r`;
						break;
					case 116:
						t += `	`;
						break;
					case 117:
						let e = h(4, !0);
						e >= 0 ? t += String.fromCharCode(e) : m = 4;
						break;
					default: m = 5;
				}
				r = o;
				continue;
			}
			if (i >= 0 && i <= 31) if (n$2(i)) {
				t += e.substring(r, o), m = 2;
				break;
			} else m = 6;
			o++;
		}
		return t;
	}
	function y() {
		if (s = ``, m = 0, c = o, d = u, p = f, o >= a) return c = a, l = 17;
		let i = e.charCodeAt(o);
		if (t$2(i)) {
			do
				o++, s += String.fromCharCode(i), i = e.charCodeAt(o);
			while (t$2(i));
			return l = 15;
		}
		if (n$2(i)) return o++, s += String.fromCharCode(i), i === 13 && e.charCodeAt(o) === 10 && (o++, s += `
`), u++, f = o, l = 14;
		switch (i) {
			case 123: return o++, l = 1;
			case 125: return o++, l = 2;
			case 91: return o++, l = 3;
			case 93: return o++, l = 4;
			case 58: return o++, l = 6;
			case 44: return o++, l = 5;
			case 34: return o++, s = v(), l = 10;
			case 47:
				let t = o - 1;
				if (e.charCodeAt(o + 1) === 47) {
					for (o += 2; o < a && !n$2(e.charCodeAt(o));) o++;
					return s = e.substring(t, o), l = 12;
				}
				if (e.charCodeAt(o + 1) === 42) {
					o += 2;
					let r = a - 1, i = !1;
					for (; o < r;) {
						let t = e.charCodeAt(o);
						if (t === 42 && e.charCodeAt(o + 1) === 47) {
							o += 2, i = !0;
							break;
						}
						o++, n$2(t) && (t === 13 && e.charCodeAt(o) === 10 && o++, u++, f = o);
					}
					return i || (o++, m = 1), s = e.substring(t, o), l = 13;
				}
				return s += String.fromCharCode(i), o++, l = 16;
			case 45: if (s += String.fromCharCode(i), o++, o === a || !r$2(e.charCodeAt(o))) return l = 16;
			case 48:
			case 49:
			case 50:
			case 51:
			case 52:
			case 53:
			case 54:
			case 55:
			case 56:
			case 57: return s += _(), l = 11;
			default:
				for (; o < a && b(i);) o++, i = e.charCodeAt(o);
				if (c !== o) {
					switch (s = e.substring(c, o), s) {
						case `true`: return l = 8;
						case `false`: return l = 9;
						case `null`: return l = 7;
					}
					return l = 16;
				}
				return s += String.fromCharCode(i), o++, l = 16;
		}
	}
	function b(e) {
		if (t$2(e) || n$2(e)) return !1;
		switch (e) {
			case 125:
			case 93:
			case 123:
			case 91:
			case 34:
			case 58:
			case 44:
			case 47: return !1;
		}
		return !0;
	}
	function x() {
		let e;
		do
			e = y();
		while (e >= 12 && e <= 15);
		return e;
	}
	return {
		setPosition: g,
		getPosition: () => o,
		scan: i ? x : y,
		getToken: () => l,
		getTokenValue: () => s,
		getTokenOffset: () => c,
		getTokenLength: () => o - c,
		getTokenStartLine: () => d,
		getTokenStartCharacter: () => c - p,
		getTokenError: () => m
	};
}
function t$2(e) {
	return e === 32 || e === 9;
}
function n$2(e) {
	return e === 10 || e === 13;
}
function r$2(e) {
	return e >= 48 && e <= 57;
}
var i;
(function(e) {
	e[e.lineFeed = 10] = `lineFeed`, e[e.carriageReturn = 13] = `carriageReturn`, e[e.space = 32] = `space`, e[e._0 = 48] = `_0`, e[e._1 = 49] = `_1`, e[e._2 = 50] = `_2`, e[e._3 = 51] = `_3`, e[e._4 = 52] = `_4`, e[e._5 = 53] = `_5`, e[e._6 = 54] = `_6`, e[e._7 = 55] = `_7`, e[e._8 = 56] = `_8`, e[e._9 = 57] = `_9`, e[e.a = 97] = `a`, e[e.b = 98] = `b`, e[e.c = 99] = `c`, e[e.d = 100] = `d`, e[e.e = 101] = `e`, e[e.f = 102] = `f`, e[e.g = 103] = `g`, e[e.h = 104] = `h`, e[e.i = 105] = `i`, e[e.j = 106] = `j`, e[e.k = 107] = `k`, e[e.l = 108] = `l`, e[e.m = 109] = `m`, e[e.n = 110] = `n`, e[e.o = 111] = `o`, e[e.p = 112] = `p`, e[e.q = 113] = `q`, e[e.r = 114] = `r`, e[e.s = 115] = `s`, e[e.t = 116] = `t`, e[e.u = 117] = `u`, e[e.v = 118] = `v`, e[e.w = 119] = `w`, e[e.x = 120] = `x`, e[e.y = 121] = `y`, e[e.z = 122] = `z`, e[e.A = 65] = `A`, e[e.B = 66] = `B`, e[e.C = 67] = `C`, e[e.D = 68] = `D`, e[e.E = 69] = `E`, e[e.F = 70] = `F`, e[e.G = 71] = `G`, e[e.H = 72] = `H`, e[e.I = 73] = `I`, e[e.J = 74] = `J`, e[e.K = 75] = `K`, e[e.L = 76] = `L`, e[e.M = 77] = `M`, e[e.N = 78] = `N`, e[e.O = 79] = `O`, e[e.P = 80] = `P`, e[e.Q = 81] = `Q`, e[e.R = 82] = `R`, e[e.S = 83] = `S`, e[e.T = 84] = `T`, e[e.U = 85] = `U`, e[e.V = 86] = `V`, e[e.W = 87] = `W`, e[e.X = 88] = `X`, e[e.Y = 89] = `Y`, e[e.Z = 90] = `Z`, e[e.asterisk = 42] = `asterisk`, e[e.backslash = 92] = `backslash`, e[e.closeBrace = 125] = `closeBrace`, e[e.closeBracket = 93] = `closeBracket`, e[e.colon = 58] = `colon`, e[e.comma = 44] = `comma`, e[e.dot = 46] = `dot`, e[e.doubleQuote = 34] = `doubleQuote`, e[e.minus = 45] = `minus`, e[e.openBrace = 123] = `openBrace`, e[e.openBracket = 91] = `openBracket`, e[e.plus = 43] = `plus`, e[e.slash = 47] = `slash`, e[e.formFeed = 12] = `formFeed`, e[e.tab = 9] = `tab`;
})(i ||= {}), Array(20).fill(0).map((e, t) => ` `.repeat(t)), Array(200).fill(0).map((e, t) => `
` + ` `.repeat(t)), Array(200).fill(0).map((e, t) => `\r` + ` `.repeat(t)), Array(200).fill(0).map((e, t) => `\r
` + ` `.repeat(t)), Array(200).fill(0).map((e, t) => `
` + `	`.repeat(t)), Array(200).fill(0).map((e, t) => `\r` + `	`.repeat(t)), Array(200).fill(0).map((e, t) => `\r
` + `	`.repeat(t));
var a;
(function(e) {
	e.DEFAULT = { allowTrailingComma: !1 };
})(a ||= {});
function o(e, t = [], n = a.DEFAULT) {
	let r = null, i = [], o = [];
	function s(e) {
		Array.isArray(i) ? i.push(e) : r !== null && (i[r] = e);
	}
	return d(e, {
		onObjectBegin: () => {
			let e = {};
			s(e), o.push(i), i = e, r = null;
		},
		onObjectProperty: (e) => {
			r = e;
		},
		onObjectEnd: () => {
			i = o.pop();
		},
		onArrayBegin: () => {
			let e = [];
			s(e), o.push(i), i = e, r = null;
		},
		onArrayEnd: () => {
			i = o.pop();
		},
		onLiteralValue: s,
		onError: (e, n, r) => {
			t.push({
				error: e,
				offset: n,
				length: r
			});
		}
	}, n), i[0];
}
function d(t, n, r = a.DEFAULT) {
	let i = e(t, !1), o = [], s = 0;
	function c(e) {
		return e ? () => s === 0 && e(i.getTokenOffset(), i.getTokenLength(), i.getTokenStartLine(), i.getTokenStartCharacter()) : () => !0;
	}
	function l(e) {
		return e ? (t) => s === 0 && e(t, i.getTokenOffset(), i.getTokenLength(), i.getTokenStartLine(), i.getTokenStartCharacter()) : () => !0;
	}
	function u(e) {
		return e ? (t) => s === 0 && e(t, i.getTokenOffset(), i.getTokenLength(), i.getTokenStartLine(), i.getTokenStartCharacter(), () => o.slice()) : () => !0;
	}
	function d(e) {
		return e ? () => {
			s > 0 ? s++ : e(i.getTokenOffset(), i.getTokenLength(), i.getTokenStartLine(), i.getTokenStartCharacter(), () => o.slice()) === !1 && (s = 1);
		} : () => !0;
	}
	function f(e) {
		return e ? () => {
			s > 0 && s--, s === 0 && e(i.getTokenOffset(), i.getTokenLength(), i.getTokenStartLine(), i.getTokenStartCharacter());
		} : () => !0;
	}
	let p = d(n.onObjectBegin), m = u(n.onObjectProperty), h = f(n.onObjectEnd), g = d(n.onArrayBegin), _ = f(n.onArrayEnd), v = u(n.onLiteralValue), y = l(n.onSeparator), b = c(n.onComment), x = l(n.onError), S = r && r.disallowComments, C = r && r.allowTrailingComma;
	function w() {
		for (;;) {
			let e = i.scan();
			switch (i.getTokenError()) {
				case 4:
					T(14);
					break;
				case 5:
					T(15);
					break;
				case 3:
					T(13);
					break;
				case 1:
					S || T(11);
					break;
				case 2:
					T(12);
					break;
				case 6:
					T(16);
					break;
			}
			switch (e) {
				case 12:
				case 13:
					S ? T(10) : b();
					break;
				case 16:
					T(1);
					break;
				case 15:
				case 14: break;
				default: return e;
			}
		}
	}
	function T(e, t = [], n = []) {
		if (x(e), t.length + n.length > 0) {
			let e = i.getToken();
			for (; e !== 17;) {
				if (t.indexOf(e) !== -1) {
					w();
					break;
				} else if (n.indexOf(e) !== -1) break;
				e = w();
			}
		}
	}
	function E(e) {
		let t = i.getTokenValue();
		return e ? v(t) : (m(t), o.push(t)), w(), !0;
	}
	function D() {
		switch (i.getToken()) {
			case 11:
				let e = i.getTokenValue(), t = Number(e);
				isNaN(t) && (T(2), t = 0), v(t);
				break;
			case 7:
				v(null);
				break;
			case 8:
				v(!0);
				break;
			case 9:
				v(!1);
				break;
			default: return !1;
		}
		return w(), !0;
	}
	function O() {
		return i.getToken() === 10 ? (E(!1), i.getToken() === 6 ? (y(`:`), w(), j() || T(4, [], [2, 5])) : T(5, [], [2, 5]), o.pop(), !0) : (T(3, [], [2, 5]), !1);
	}
	function k() {
		p(), w();
		let e = !1;
		for (; i.getToken() !== 2 && i.getToken() !== 17;) {
			if (i.getToken() === 5) {
				if (e || T(4, [], []), y(`,`), w(), i.getToken() === 2 && C) break;
			} else e && T(6, [], []);
			O() || T(4, [], [2, 5]), e = !0;
		}
		return h(), i.getToken() === 2 ? w() : T(7, [2], []), !0;
	}
	function A() {
		g(), w();
		let e = !0, t = !1;
		for (; i.getToken() !== 4 && i.getToken() !== 17;) {
			if (i.getToken() === 5) {
				if (t || T(4, [], []), y(`,`), w(), i.getToken() === 4 && C) break;
			} else t && T(6, [], []);
			e ? (o.push(0), e = !1) : o[o.length - 1]++, j() || T(4, [], [4, 5]), t = !0;
		}
		return _(), e || o.pop(), i.getToken() === 4 ? w() : T(8, [4], []), !0;
	}
	function j() {
		switch (i.getToken()) {
			case 3: return A();
			case 1: return k();
			case 10: return E(!0);
			default: return D();
		}
	}
	return w(), i.getToken() === 17 ? r.allowEmptyContent ? !0 : (T(4, [], []), !1) : j() ? (i.getToken() !== 17 && T(9, [], []), !0) : (T(4, [], []), !1);
}
var f;
(function(e) {
	e[e.None = 0] = `None`, e[e.UnexpectedEndOfComment = 1] = `UnexpectedEndOfComment`, e[e.UnexpectedEndOfString = 2] = `UnexpectedEndOfString`, e[e.UnexpectedEndOfNumber = 3] = `UnexpectedEndOfNumber`, e[e.InvalidUnicode = 4] = `InvalidUnicode`, e[e.InvalidEscapeCharacter = 5] = `InvalidEscapeCharacter`, e[e.InvalidCharacter = 6] = `InvalidCharacter`;
})(f ||= {});
var p;
(function(e) {
	e[e.OpenBraceToken = 1] = `OpenBraceToken`, e[e.CloseBraceToken = 2] = `CloseBraceToken`, e[e.OpenBracketToken = 3] = `OpenBracketToken`, e[e.CloseBracketToken = 4] = `CloseBracketToken`, e[e.CommaToken = 5] = `CommaToken`, e[e.ColonToken = 6] = `ColonToken`, e[e.NullKeyword = 7] = `NullKeyword`, e[e.TrueKeyword = 8] = `TrueKeyword`, e[e.FalseKeyword = 9] = `FalseKeyword`, e[e.StringLiteral = 10] = `StringLiteral`, e[e.NumericLiteral = 11] = `NumericLiteral`, e[e.LineCommentTrivia = 12] = `LineCommentTrivia`, e[e.BlockCommentTrivia = 13] = `BlockCommentTrivia`, e[e.LineBreakTrivia = 14] = `LineBreakTrivia`, e[e.Trivia = 15] = `Trivia`, e[e.Unknown = 16] = `Unknown`, e[e.EOF = 17] = `EOF`;
})(p ||= {});
const m = o;
var h;
(function(e) {
	e[e.InvalidSymbol = 1] = `InvalidSymbol`, e[e.InvalidNumberFormat = 2] = `InvalidNumberFormat`, e[e.PropertyNameExpected = 3] = `PropertyNameExpected`, e[e.ValueExpected = 4] = `ValueExpected`, e[e.ColonExpected = 5] = `ColonExpected`, e[e.CommaExpected = 6] = `CommaExpected`, e[e.CloseBraceExpected = 7] = `CloseBraceExpected`, e[e.CloseBracketExpected = 8] = `CloseBracketExpected`, e[e.EndOfFileExpected = 9] = `EndOfFileExpected`, e[e.InvalidCommentToken = 10] = `InvalidCommentToken`, e[e.UnexpectedEndOfComment = 11] = `UnexpectedEndOfComment`, e[e.UnexpectedEndOfString = 12] = `UnexpectedEndOfString`, e[e.UnexpectedEndOfNumber = 13] = `UnexpectedEndOfNumber`, e[e.InvalidUnicode = 14] = `InvalidUnicode`, e[e.InvalidEscapeCharacter = 15] = `InvalidEscapeCharacter`, e[e.InvalidCharacter = 16] = `InvalidCharacter`;
})(h ||= {});

//#endregion
//#region ../../node_modules/.pnpm/confbox@0.2.4/node_modules/confbox/dist/_chunks/json.mjs
function n$1(t, n) {
	let r = JSON.parse(t, n?.reviver);
	return a$1(t, r, n), r;
}
function r$1(e, n) {
	let r = o$1(e, n), i = JSON.stringify(e, n?.replacer, r.indent);
	return r.whitespace.start + i + r.whitespace.end;
}

//#endregion
//#region ../../node_modules/.pnpm/confbox@0.2.4/node_modules/confbox/dist/jsonc.mjs
function r(n, r) {
	let i = m(n, r?.errors, r);
	return a$1(n, i, r), i;
}

//#endregion
//#region ../../node_modules/.pnpm/confbox@0.2.4/node_modules/confbox/dist/_chunks/libs/ini.mjs
var t$1 = o$3(((e, t) => {
	let { hasOwnProperty: n } = Object.prototype, r = (e, t = {}) => {
		typeof t == `string` && (t = { section: t }), t.align = t.align === !0, t.newline = t.newline === !0, t.sort = t.sort === !0, t.whitespace = t.whitespace === !0 || t.align === !0, t.platform = t.platform || typeof process < `u` && process.platform, t.bracketedArray = t.bracketedArray !== !1;
		let n = t.platform === `win32` ? `\r
` : `
`, a = t.whitespace ? ` = ` : `=`, o = [], c = t.sort ? Object.keys(e).sort() : Object.keys(e), l = 0;
		t.align && (l = s(c.filter((t) => e[t] === null || Array.isArray(e[t]) || typeof e[t] != `object`).map((t) => Array.isArray(e[t]) ? `${t}[]` : t).concat([``]).reduce((e, t) => s(e).length >= s(t).length ? e : t)).length);
		let u = ``, d = t.bracketedArray ? `[]` : ``;
		for (let t of c) {
			let r = e[t];
			if (r && Array.isArray(r)) for (let e of r) u += s(`${t}${d}`).padEnd(l, ` `) + a + s(e) + n;
			else r && typeof r == `object` ? o.push(t) : u += s(t).padEnd(l, ` `) + a + s(r) + n;
		}
		t.section && u.length && (u = `[` + s(t.section) + `]` + (t.newline ? n + n : n) + u);
		for (let a of o) {
			let o = i(a, `.`).join(`\\.`), s = (t.section ? t.section + `.` : ``) + o, c = r(e[a], {
				...t,
				section: s
			});
			u.length && c.length && (u += n), u += c;
		}
		return u;
	};
	function i(e, t) {
		var n = 0, r = 0, i = 0, a = [];
		do
			if (i = e.indexOf(t, n), i !== -1) {
				if (n = i + t.length, i > 0 && e[i - 1] === `\\`) continue;
				a.push(e.slice(r, i)), r = i + t.length;
			}
		while (i !== -1);
		return a.push(e.slice(r)), a;
	}
	let a = (e, t = {}) => {
		t.bracketedArray = t.bracketedArray !== !1;
		let r = Object.create(null), a = r, o = null, s = /^\[([^\]]*)\]\s*$|^([^=]+)(=(.*))?$/i, l = e.split(/[\r\n]+/g), u = {};
		for (let e of l) {
			if (!e || e.match(/^\s*[;#]/) || e.match(/^\s*$/)) continue;
			let i = e.match(s);
			if (!i) continue;
			if (i[1] !== void 0) {
				if (o = c(i[1]), o === `__proto__`) {
					a = Object.create(null);
					continue;
				}
				a = r[o] = r[o] || Object.create(null);
				continue;
			}
			let l = c(i[2]), d;
			t.bracketedArray ? d = l.length > 2 && l.slice(-2) === `[]` : (u[l] = (u?.[l] || 0) + 1, d = u[l] > 1);
			let f = d && l.endsWith(`[]`) ? l.slice(0, -2) : l;
			if (f === `__proto__`) continue;
			let p = i[3] ? c(i[4]) : !0, m = p === `true` || p === `false` || p === `null` ? JSON.parse(p) : p;
			d && (n.call(a, f) ? Array.isArray(a[f]) || (a[f] = [a[f]]) : a[f] = []), Array.isArray(a[f]) ? a[f].push(m) : a[f] = m;
		}
		let d = [];
		for (let e of Object.keys(r)) {
			if (!n.call(r, e) || typeof r[e] != `object` || Array.isArray(r[e])) continue;
			let t = i(e, `.`);
			a = r;
			let o = t.pop(), s = o.replace(/\\\./g, `.`);
			for (let e of t) e !== `__proto__` && ((!n.call(a, e) || typeof a[e] != `object`) && (a[e] = Object.create(null)), a = a[e]);
			a === r && s === o || (a[s] = r[e], d.push(e));
		}
		for (let e of d) delete r[e];
		return r;
	}, o = (e) => e.startsWith(`"`) && e.endsWith(`"`) || e.startsWith(`'`) && e.endsWith(`'`), s = (e) => typeof e != `string` || e.match(/[=\r\n]/) || e.match(/^\[/) || e.length > 1 && o(e) || e !== e.trim() ? JSON.stringify(e) : e.split(`;`).join(`\\;`).split(`#`).join(`\\#`), c = (e) => {
		if (e = (e || ``).trim(), o(e)) {
			e.charAt(0) === `'` && (e = e.slice(1, -1));
			try {
				e = JSON.parse(e);
			} catch {}
		} else {
			let t = !1, n = ``;
			for (let r = 0, i = e.length; r < i; r++) {
				let i = e.charAt(r);
				if (t) `\\;#`.indexOf(i) === -1 ? n += `\\` + i : n += i, t = !1;
				else if (`;#`.indexOf(i) !== -1) break;
				else i === `\\` ? t = !0 : n += i;
			}
			return t && (n += `\\`), n.trim();
		}
		return e;
	};
	t.exports = {
		parse: a,
		decode: a,
		stringify: r,
		encode: r,
		safe: s,
		unsafe: c
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/confbox@0.2.4/node_modules/confbox/dist/ini.mjs
var t = t$1();
function n(e, n) {
	return (0, t.parse)(e, n);
}

//#endregion
//#region ../../node_modules/.pnpm/pkg-types@2.3.0/node_modules/pkg-types/dist/index.mjs
const defaultFindOptions = {
	startingFrom: ".",
	rootPattern: /^node_modules$/,
	reverse: false,
	test: (filePath) => {
		try {
			if (statSync(filePath).isFile()) return true;
		} catch {}
	}
};
async function findFile(filename, _options = {}) {
	const filenames = Array.isArray(filename) ? filename : [filename];
	const options = {
		...defaultFindOptions,
		..._options
	};
	const basePath = resolve(options.startingFrom);
	const leadingSlash = basePath[0] === "/";
	const segments = basePath.split("/").filter(Boolean);
	if (filenames.includes(segments.at(-1)) && await options.test(basePath)) return basePath;
	if (leadingSlash) segments[0] = "/" + segments[0];
	let root = segments.findIndex((r) => r.match(options.rootPattern));
	if (root === -1) root = 0;
	if (options.reverse) for (let index = root + 1; index <= segments.length; index++) for (const filename2 of filenames) {
		const filePath = join(...segments.slice(0, index), filename2);
		if (await options.test(filePath)) return filePath;
	}
	else for (let index = segments.length; index > root; index--) for (const filename2 of filenames) {
		const filePath = join(...segments.slice(0, index), filename2);
		if (await options.test(filePath)) return filePath;
	}
	throw new Error(`Cannot find matching ${filename} in ${options.startingFrom} or parent directories`);
}
function findNearestFile(filename, options = {}) {
	return findFile(filename, options);
}
function _resolvePath(id, opts = {}) {
	if (id instanceof URL || id.startsWith("file://")) return normalize(fileURLToPath(id));
	if (isAbsolute(id)) return normalize(id);
	return resolveModulePath(id, {
		...opts,
		from: opts.from || opts.parent || opts.url
	});
}
const FileCache$1 = /* @__PURE__ */ new Map();
async function readTSConfig(id, options = {}) {
	const resolvedPath = await resolveTSConfig(id, options);
	const cache = options.cache && typeof options.cache !== "boolean" ? options.cache : FileCache$1;
	if (options.cache && cache.has(resolvedPath)) return cache.get(resolvedPath);
	const parsed = r(await promises.readFile(resolvedPath, "utf8"));
	cache.set(resolvedPath, parsed);
	return parsed;
}
async function resolveTSConfig(id = process.cwd(), options = {}) {
	return findNearestFile("tsconfig.json", {
		...options,
		startingFrom: _resolvePath(id, options)
	});
}
const lockFiles = [
	"yarn.lock",
	"package-lock.json",
	"pnpm-lock.yaml",
	"npm-shrinkwrap.json",
	"bun.lockb",
	"bun.lock",
	"deno.lock"
];
const packageFiles = [
	"package.json",
	"package.json5",
	"package.yaml"
];
const workspaceFiles = [
	"pnpm-workspace.yaml",
	"lerna.json",
	"turbo.json",
	"rush.json",
	"deno.json",
	"deno.jsonc"
];
const FileCache = /* @__PURE__ */ new Map();
async function readPackageJSON(id, options = {}) {
	const resolvedPath = await resolvePackageJSON(id, options);
	const cache = options.cache && typeof options.cache !== "boolean" ? options.cache : FileCache;
	if (options.cache && cache.has(resolvedPath)) return cache.get(resolvedPath);
	const blob = await promises.readFile(resolvedPath, "utf8");
	let parsed;
	try {
		parsed = n$1(blob);
	} catch {
		parsed = r(blob);
	}
	cache.set(resolvedPath, parsed);
	return parsed;
}
async function writePackageJSON(path, pkg) {
	await promises.writeFile(path, r$1(pkg));
}
async function resolvePackageJSON(id = process.cwd(), options = {}) {
	return findNearestFile("package.json", {
		...options,
		startingFrom: _resolvePath(id, options)
	});
}
const workspaceTests = {
	workspaceFile: (opts) => findFile(workspaceFiles, opts).then((r) => dirname(r)),
	gitConfig: (opts) => findFile(".git/config", opts).then((r) => resolve(r, "../..")),
	lockFile: (opts) => findFile(lockFiles, opts).then((r) => dirname(r)),
	packageJson: (opts) => findFile(packageFiles, opts).then((r) => dirname(r))
};
async function findWorkspaceDir(id = process.cwd(), options = {}) {
	const startingFrom = _resolvePath(id, options);
	const tests = options.tests || [
		"workspaceFile",
		"gitConfig",
		"lockFile",
		"packageJson"
	];
	for (const testName of tests) {
		const test = workspaceTests[testName];
		if (options[testName] === false || !test) continue;
		const direction = options[testName] || (testName === "gitConfig" ? "closest" : "furthest");
		const detected = await test({
			...options,
			startingFrom,
			reverse: direction === "furthest"
		}).catch(() => {});
		if (detected) return detected;
	}
	throw new Error(`Cannot detect workspace root from ${id}`);
}

//#endregion
export { writePackageJSON as a, readTSConfig as i, findWorkspaceDir as n, n as o, readPackageJSON as r, findFile as t };