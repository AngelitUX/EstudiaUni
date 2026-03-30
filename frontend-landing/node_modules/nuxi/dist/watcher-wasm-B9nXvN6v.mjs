import { i as __require, t as __commonJSMin } from "./chunk-C8U8pIma.mjs";
import { n as require_picomatch, t as require_is_glob } from "./is-glob-DLHjFvAl.mjs";
import fs from "fs";
import Path from "path";

//#region ../../node_modules/.pnpm/@parcel+watcher-wasm@2.5.6/node_modules/@parcel/watcher-wasm/node_modules/napi-wasm/index.mjs
const NAPI_OK = 0;
const NAPI_GENERIC_FAILURE = 9;
const NAPI_PENDING_EXCEPTION = 10;
const NAPI_CANCELED = 11;
const NAPI_HANDLE_SCOPE_MISMATCH = 13;
const NAPI_NO_EXTERNAL_BUFFERS_ALLOWED = 22;
const NAPI_WRITABLE = 1;
const NAPI_ENUMERABLE = 2;
const NAPI_CONFIGURABLE = 4;
const NAPI_STATIC = 1024;
const typedArrays = [
	Int8Array,
	Uint8Array,
	Uint8ClampedArray,
	Int16Array,
	Uint16Array,
	Int32Array,
	Uint32Array,
	Float32Array,
	Float64Array,
	BigInt64Array,
	BigUint64Array
];
const environments = [];
var Environment = class {
	scopes = [];
	referenceId = 1;
	references = /* @__PURE__ */ new Map();
	deferred = [null];
	wrappedObjects = /* @__PURE__ */ new WeakMap();
	externalObjects = /* @__PURE__ */ new WeakMap();
	buffers = /* @__PURE__ */ new Map();
	instanceData = 0;
	pendingException = null;
	constructor(instance) {
		this.id = environments.length;
		environments.push(this);
		this.instance = instance;
		this.table = instance.exports.__indirect_function_table;
		this.exports = {};
		this.pushScope();
		let values = this.scopes[this.scopes.length - 1];
		let exports = values.length;
		values.push(this.exports);
		try {
			if (this.instance.exports.napi_register_module_v1) this.instance.exports.napi_register_module_v1(this.id, exports);
			if (this.instance.exports.napi_register_wasm_v1) this.instance.exports.napi_register_wasm_v1(this.id, exports);
		} finally {
			this.popScope();
			if (this.pendingException) {
				let e = this.pendingException;
				this.pendingException = null;
				throw e;
			}
		}
	}
	destroy() {
		environments[this.id] = void 0;
	}
	getString(ptr, len = strlen(this.memory, ptr)) {
		return decoder.decode(this.memory.subarray(ptr, Math.max(0, ptr + len)));
	}
	pushScope() {
		let id = this.scopes.length;
		this.scopes.push(id ? [...this.scopes[id - 1]] : [
			void 0,
			null,
			globalThis,
			true,
			false
		]);
		return id;
	}
	popScope() {
		this.scopes.pop();
		for (let [buffer, slice] of this.buffers) if (buffer.byteLength && slice.byteLength) buffer.set(slice);
		this.buffers.clear();
	}
	get(idx) {
		return this.scopes[this.scopes.length - 1][idx];
	}
	set(idx, value) {
		this.scopes[this.scopes.length - 1][idx] = value;
	}
	pushValue(value, scope = this.scopes.length - 1) {
		let values = this.scopes[scope];
		let id = values.length;
		values.push(value);
		return id;
	}
	createValue(value, result, scope) {
		if (typeof value === "boolean") {
			this.setPointer(result, value ? 3 : 4);
			return NAPI_OK;
		} else if (typeof value === "undefined") {
			this.setPointer(result, 0);
			return NAPI_OK;
		} else if (value === null) {
			this.setPointer(result, 1);
			return NAPI_OK;
		} else if (value === globalThis) {
			this.setPointer(result, 2);
			return NAPI_OK;
		}
		let id = this.pushValue(value, scope);
		this.setPointer(result, id);
		return NAPI_OK;
	}
	setPointer(ptr, value) {
		this.u32[ptr >> 2] = value;
		return NAPI_OK;
	}
	_u32 = new Uint32Array();
	get u32() {
		if (this._u32.byteLength === 0) this._u32 = new Uint32Array(this.instance.exports.memory.buffer);
		return this._u32;
	}
	_i32 = new Int32Array();
	get i32() {
		if (this._i32.byteLength === 0) this._i32 = new Int32Array(this.instance.exports.memory.buffer);
		return this._i32;
	}
	_u16 = new Uint16Array();
	get u16() {
		if (this._u16.byteLength === 0) this._u16 = new Uint16Array(this.instance.exports.memory.buffer);
		return this._u16;
	}
	_u64 = new BigUint64Array();
	get u64() {
		if (this._u64.byteLength === 0) this._u64 = new BigUint64Array(this.instance.exports.memory.buffer);
		return this._u64;
	}
	_i64 = new BigInt64Array();
	get i64() {
		if (this._i64.byteLength === 0) this._i64 = new BigInt64Array(this.instance.exports.memory.buffer);
		return this._i64;
	}
	_f64 = new Float64Array();
	get f64() {
		if (this._f64.byteLength === 0) this._f64 = new Float64Array(this.instance.exports.memory.buffer);
		return this._f64;
	}
	_buf = new Uint8Array();
	get memory() {
		if (this._buf.byteLength === 0) this._buf = new Uint8Array(this.instance.exports.memory.buffer);
		return this._buf;
	}
	getBufferInfo(buf, ptr) {
		if (this.buffers.has(buf)) {
			let b = this.buffers.get(buf);
			this.setPointer(ptr, b.byteOffset);
			return b.byteLength;
		}
		if (buf instanceof ArrayBuffer) {
			let b = this.copyBuffer(new Uint8Array(buf));
			this.setPointer(ptr, b.byteOffset);
			return b.byteLength;
		}
		if (buf.buffer === this.instance.exports.memory.buffer) {
			this.setPointer(ptr, buf.byteOffset);
			return buf.byteLength;
		}
		let b = this.copyBuffer(new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength));
		this.setPointer(ptr, b.byteOffset);
		return b.byteLength;
	}
	copyBuffer(data) {
		let ptr = this.instance.exports.napi_wasm_malloc(data.byteLength);
		let mem = this.memory;
		mem.set(data, ptr);
		let buf = mem.subarray(ptr, ptr + data.byteLength);
		this.buffers.set(data, buf);
		return buf;
	}
	createFunction(cb, data) {
		let env = this;
		let fn = env.table.get(cb);
		let func = function(...args) {
			let scope = env.pushScope();
			try {
				let values = env.scopes[scope];
				let info = values.length;
				values.push({
					thisArg: this,
					args,
					data,
					newTarget: new.target
				});
				let res = fn(env.id, info);
				return env.get(res);
			} finally {
				env.popScope();
				if (env.pendingException) {
					let e = env.pendingException;
					env.pendingException = null;
					throw e;
				}
			}
		};
		return func;
	}
	readPropertyDescriptor(ptr) {
		let buf = this.u32;
		let utf8name = buf[ptr++];
		let nameValue = buf[ptr++];
		let method = buf[ptr++];
		let getter = buf[ptr++];
		let setter = buf[ptr++];
		let val = buf[ptr++];
		let attrs = buf[ptr++];
		let data = buf[ptr++];
		let name = utf8name ? this.getString(utf8name) : this.get(nameValue);
		let writable = Boolean(attrs & NAPI_WRITABLE);
		let enumerable = Boolean(attrs & NAPI_ENUMERABLE);
		let configurable = Boolean(attrs & NAPI_CONFIGURABLE);
		let isStatic = Boolean(attrs & NAPI_STATIC);
		let get = getter ? this.createFunction(getter, data) : void 0;
		let set = setter ? this.createFunction(setter, data) : void 0;
		let value = method ? this.createFunction(method, data) : val ? this.get(val) : void 0;
		let descriptor = {
			name,
			static: isStatic,
			configurable,
			enumerable
		};
		if (get || set) {
			descriptor.get = get;
			descriptor.set = set;
		} else if (value) {
			descriptor.writable = writable;
			descriptor.value = value;
		}
		return descriptor;
	}
};
const decoder = new TextDecoder("utf-8", {
	ignoreBOM: true,
	fatal: true
});
const latin1Decoder = new TextDecoder("latin1");
const utf16Decoder = new TextDecoder("utf-16");
const encoder$1 = new TextEncoder();
var FinalizeRecord = class {
	constructor(env, finalize, hint, data) {
		this.env = env;
		this.finalize = finalize;
		this.hint = hint;
		this.data = data;
	}
};
const finalizationRegistry = new FinalizationRegistry((buffer) => {
	if (buffer.finalize) buffer.finalize(buffer.env, buffer.data, buffer.hint);
});
var ExternalValue = class {};
const threadsafeFunctions = [];
var ThreadSafeFunction = class {
	constructor(env, fn, nativeFn, context) {
		this.env = env;
		this.fn = fn;
		this.nativeFn = nativeFn;
		this.context = context;
		this.id = threadsafeFunctions.length;
		threadsafeFunctions.push(this);
	}
};
const asyncWork = [null];
var AsyncWork = class {
	constructor(env, execute, complete, data) {
		this.env = env;
		this.execute = execute;
		this.complete = complete;
		this.data = data;
		this.id = asyncWork.length;
		asyncWork.push(this);
	}
};
const napi = {
	napi_open_handle_scope(env_id, result) {
		let env = environments[env_id];
		let id = env.pushScope();
		return env.setPointer(result, id);
	},
	napi_close_handle_scope(env_id, scope) {
		let env = environments[env_id];
		if (scope !== env.scopes.length - 1) return NAPI_HANDLE_SCOPE_MISMATCH;
		env.popScope();
		return NAPI_OK;
	},
	napi_open_escapable_handle_scope(env_id, result) {
		let env = environments[env_id];
		let id = env.pushScope();
		return env.setPointer(result, id);
	},
	napi_close_escapable_handle_scope(env_id, scope) {
		let env = environments[env_id];
		if (scope !== env.scopes.length - 1) return NAPI_HANDLE_SCOPE_MISMATCH;
		env.popScope();
		return NAPI_OK;
	},
	napi_escape_handle(env_id, scope_id, escapee, result) {
		let env = environments[env_id];
		let value = env.get(escapee);
		return env.createValue(value, result, scope_id - 1);
	},
	napi_create_object(env_id, result) {
		return environments[env_id].createValue({}, result);
	},
	napi_set_property(env_id, object, key, value) {
		let env = environments[env_id];
		let obj = env.get(object);
		let name = env.get(key);
		obj[name] = env.get(value);
		return NAPI_OK;
	},
	napi_get_property(env_id, object, key, result) {
		let env = environments[env_id];
		let obj = env.get(object);
		let name = env.get(key);
		return env.createValue(obj[name], result);
	},
	napi_delete_property(env_id, object, key, result) {
		let env = environments[env_id];
		let obj = env.get(object);
		let name = env.get(key);
		let res = false;
		try {
			res = delete obj[name];
		} catch (err) {}
		if (result) env.memory[result] = res ? 1 : 0;
		return NAPI_OK;
	},
	napi_has_property(env_id, object, key, result) {
		let env = environments[env_id];
		let obj = env.get(object);
		let name = env.get(key);
		env.memory[result] = name in obj ? 1 : 0;
		return NAPI_OK;
	},
	napi_has_own_property(env_id, object, key, result) {
		let env = environments[env_id];
		let obj = env.get(object);
		let name = env.get(key);
		env.memory[result] = obj.hasOwnProperty(name) ? 1 : 0;
		return NAPI_OK;
	},
	napi_set_named_property(env_id, object, utf8Name, value) {
		let env = environments[env_id];
		let obj = env.get(object);
		let val = env.get(value);
		let name = env.getString(utf8Name);
		obj[name] = val;
		return NAPI_OK;
	},
	napi_get_named_property(env_id, object, utf8Name, result) {
		let env = environments[env_id];
		let obj = env.get(object);
		let name = env.getString(utf8Name);
		return env.createValue(obj[name], result);
	},
	napi_has_named_property(env_id, object, utf8Name, result) {
		let env = environments[env_id];
		let obj = env.get(object);
		let name = env.getString(utf8Name);
		env.memory[result] = name in obj ? 1 : 0;
		return NAPI_OK;
	},
	napi_get_property_names(env_id, object, result) {
		let env = environments[env_id];
		let obj = env.get(object);
		let properties = Object.keys(obj);
		return env.createValue(properties, result);
	},
	napi_get_all_property_names(env_id, object, key_mode, key_filter, key_conversion, result) {
		throw new Error("not implemented");
	},
	napi_define_properties(env_id, object, property_count, properties) {
		let env = environments[env_id];
		let obj = env.get(object);
		let ptr = properties >> 2;
		for (let i = 0; i < property_count; i++) {
			let descriptor = env.readPropertyDescriptor(ptr);
			Object.defineProperty(obj, descriptor.name, descriptor);
			ptr += 8;
		}
		return NAPI_OK;
	},
	napi_object_freeze(env_id, object) {
		let obj = environments[env_id].get(object);
		Object.freeze(obj);
		return NAPI_OK;
	},
	napi_object_seal(env_id, object) {
		let obj = environments[env_id].get(object);
		Object.seal(obj);
		return NAPI_OK;
	},
	napi_get_prototype(env_id, object, result) {
		let env = environments[env_id];
		let obj = env.get(object);
		return env.createValue(Object.getPrototypeOf(obj), result);
	},
	napi_define_class(env_id, utf8name, length, constructor, data, property_count, properties, result) {
		let env = environments[env_id];
		let func = env.createFunction(constructor, data);
		Object.defineProperty(func, "name", {
			value: env.getString(utf8name, length),
			configurable: true
		});
		let ptr = properties >> 2;
		for (let i = 0; i < property_count; i++) {
			let descriptor = env.readPropertyDescriptor(ptr);
			if (descriptor.static) Object.defineProperty(func, descriptor.name, descriptor);
			else Object.defineProperty(func.prototype, descriptor.name, descriptor);
			ptr += 8;
		}
		return env.createValue(func, result);
	},
	napi_create_reference(env_id, value, refcount, result) {
		let env = environments[env_id];
		let id = env.referenceId++;
		env.references.set(id, {
			value: env.get(value),
			refcount
		});
		return env.setPointer(result, id);
	},
	napi_delete_reference(env_id, ref) {
		environments[env_id].references.delete(ref);
		return NAPI_OK;
	},
	napi_get_reference_value(env_id, ref, result) {
		let env = environments[env_id];
		let reference = env.references.get(ref);
		return env.createValue(reference.value, result);
	},
	napi_reference_ref(env_id, ref, result) {
		let env = environments[env_id];
		let reference = env.references.get(ref);
		reference.refcount++;
		return env.setPointer(result, reference.refcount);
	},
	napi_reference_unref(env_id, ref, result) {
		let env = environments[env_id];
		let reference = env.references.get(ref);
		if (reference.refcount === 0) return NAPI_GENERIC_FAILURE;
		reference.refcount--;
		return env.setPointer(result, reference.refcount);
	},
	napi_add_env_cleanup_hook() {
		return NAPI_OK;
	},
	napi_remove_env_cleanup_hook() {
		return NAPI_OK;
	},
	napi_add_async_cleanup_hook() {
		return NAPI_OK;
	},
	napi_remove_async_cleanup_hook() {
		return NAPI_OK;
	},
	napi_set_instance_data(env_id, data, finalize_cb, finalize_hint) {
		let env = environments[env_id];
		env.instanceData = data;
		return NAPI_OK;
	},
	napi_get_instance_data(env_id, data) {
		let env = environments[env_id];
		return env.setPointer(data, env.instanceData);
	},
	napi_get_boolean(env_id, value, result) {
		return environments[env_id].setPointer(result, value ? 3 : 4);
	},
	napi_get_value_bool(env_id, value, result) {
		let env = environments[env_id];
		let val = env.get(value);
		env.memory[result] = val ? 1 : 0;
		return NAPI_OK;
	},
	napi_create_int32(env_id, value, result) {
		return environments[env_id].createValue(value, result);
	},
	napi_get_value_int32(env_id, value, result) {
		let env = environments[env_id];
		let val = env.get(value);
		env.i32[result >> 2] = val;
		return NAPI_OK;
	},
	napi_create_uint32(env_id, value, result) {
		return environments[env_id].createValue(value, result);
	},
	napi_get_value_uint32(env_id, value, result) {
		let env = environments[env_id];
		let val = env.get(value);
		return env.setPointer(result, val);
	},
	napi_create_int64(env_id, value, result) {
		return environments[env_id].createValue(Number(value), result);
	},
	napi_get_value_int64(env_id, value, result) {
		let env = environments[env_id];
		let val = env.get(value);
		env.i64[result >> 3] = val;
		return NAPI_OK;
	},
	napi_create_double(env_id, value, result) {
		return environments[env_id].createValue(value, result);
	},
	napi_get_value_double(env_id, value, result) {
		let env = environments[env_id];
		let val = env.get(value);
		env.f64[result >> 3] = val;
		return NAPI_OK;
	},
	napi_create_bigint_int64(env_id, value, result) {
		return environments[env_id].createValue(BigInt.asIntN(64, value), result);
	},
	napi_get_value_bigint_int64(env_id, value, result, lossless) {
		let env = environments[env_id];
		let val = env.get(value);
		env.i64[result >> 3] = val;
		if (lossless) env.memory[lossless] = BigInt.asIntN(64, val) === val ? 1 : 0;
		return NAPI_OK;
	},
	napi_create_bigint_uint64(env_id, value, result) {
		return environments[env_id].createValue(BigInt.asUintN(64, value), result);
	},
	napi_get_value_bigint_uint64(env_id, value, result, lossless) {
		let env = environments[env_id];
		let val = env.get(value);
		env.u64[result >> 3] = val;
		if (lossless) env.memory[lossless] = BigInt.asUintN(64, val) === val ? 1 : 0;
		return NAPI_OK;
	},
	napi_create_bigint_words(env_id, sign_bit, word_count, words, result) {
		let env = environments[env_id];
		let buf = env.u64;
		let ptr = words >> 3;
		let res = 0n;
		let shift = 0n;
		for (let i = 0; i < word_count; i++) {
			let word = buf[ptr++];
			res += word << shift;
			shift += 64n;
		}
		res *= BigInt((-1) ** sign_bit);
		return env.createValue(res, result);
	},
	napi_get_value_bigint_words(env_id, value, sign_bit, word_count, words) {
		let env = environments[env_id];
		let val = env.get(value);
		let count = env.u32[word_count >> 2];
		if (sign_bit) env.i32[sign_bit] = val < 0n ? 1 : 0;
		let i = 0;
		if (words) {
			let mask = (1n << 64n) - 1n;
			let buf = env.u64;
			let ptr = words >> 3;
			if (val < 0n) val = -val;
			for (; i < count && val !== 0n; i++) {
				buf[ptr++] = val & mask;
				val >>= 64n;
			}
		}
		while (val > 0n) {
			i++;
			val >>= 64n;
		}
		return env.setPointer(word_count, i);
	},
	napi_get_null(env_id, result) {
		return environments[env_id].setPointer(result, 1);
	},
	napi_create_array(env_id, result) {
		return environments[env_id].createValue([], result);
	},
	napi_create_array_with_length(env_id, length, result) {
		return environments[env_id].createValue(new Array(length), result);
	},
	napi_set_element(env_id, object, index, value) {
		let env = environments[env_id];
		let obj = env.get(object);
		obj[index] = env.get(value);
		return NAPI_OK;
	},
	napi_get_element(env_id, object, index, result) {
		let env = environments[env_id];
		let val = env.get(object)[index];
		return env.createValue(val, result);
	},
	napi_has_element(env_id, object, index, result) {
		let env = environments[env_id];
		let obj = env.get(object);
		env.memory[result] = obj.hasOwnProperty(index) ? 1 : 0;
		return NAPI_OK;
	},
	napi_delete_element(env_id, object, index, result) {
		let env = environments[env_id];
		let obj = env.get(object);
		let res = false;
		try {
			res = delete obj[index];
		} catch (err) {}
		if (result) env.memory[result] = res ? 1 : 0;
		return NAPI_OK;
	},
	napi_get_array_length(env_id, value, result) {
		let env = environments[env_id];
		let val = env.get(value);
		return env.setPointer(result, val.length);
	},
	napi_get_undefined(env_id, result) {
		return environments[env_id].setPointer(result, 0);
	},
	napi_create_function(env_id, utf8name, length, cb, data, result) {
		let env = environments[env_id];
		let func = env.createFunction(cb, data);
		Object.defineProperty(func, "name", {
			value: env.getString(utf8name, length),
			configurable: true
		});
		return env.createValue(func, result);
	},
	napi_call_function(env_id, recv, func, argc, argv, result) {
		let env = environments[env_id];
		let thisArg = env.get(recv);
		let fn = env.get(func);
		let args = new Array(argc);
		let mem = env.u32;
		for (let i = 0; i < argc; i++) {
			args[i] = env.get(mem[argv >> 2]);
			argv += 4;
		}
		try {
			let res = fn.apply(thisArg, args);
			return env.createValue(res, result);
		} catch (err) {
			env.pendingException = err;
			return NAPI_PENDING_EXCEPTION;
		}
	},
	napi_new_instance(env_id, cons, argc, argv, result) {
		let env = environments[env_id];
		let Class = env.get(cons);
		let args = new Array(argc);
		let mem = env.u32;
		for (let i = 0; i < argc; i++) {
			args[i] = env.get(mem[argv >> 2]);
			argv += 4;
		}
		try {
			let value = new Class(...args);
			return env.createValue(value, result);
		} catch (err) {
			env.pendingException = err;
			return NAPI_PENDING_EXCEPTION;
		}
	},
	napi_get_cb_info(env_id, cbinfo, argc, argv, thisArg, data) {
		let env = environments[env_id];
		let info = env.get(cbinfo);
		env.setPointer(argc, info.args.length);
		for (let i = 0; i < info.args.length; i++) {
			env.createValue(info.args[i], argv);
			argv += 4;
		}
		env.createValue(info.thisArg, thisArg);
		env.setPointer(data, info.data);
		return NAPI_OK;
	},
	napi_get_new_target(env_id, cbinfo, result) {
		let env = environments[env_id];
		let info = env.get(cbinfo);
		return env.createValue(info.newTarget, result);
	},
	napi_create_threadsafe_function(env_id, func, async_resource, async_resource_name, max_queue_size, initial_thread_count, thread_finalize_data, thread_finalize_cb, context, call_js_cb, result) {
		let env = environments[env_id];
		let f = new ThreadSafeFunction(env, func ? env.get(func) : void 0, call_js_cb ? env.table.get(call_js_cb) : void 0, context);
		if (thread_finalize_cb) {
			let cb = env.table.get(thread_finalize_cb);
			finalizationRegistry.register(f, new FinalizeRecord(env_id, cb, 0, f.id));
		}
		env.setPointer(result, f.id);
		return NAPI_OK;
	},
	napi_ref_threadsafe_function() {
		return NAPI_OK;
	},
	napi_unref_threadsafe_function() {
		return NAPI_OK;
	},
	napi_acquire_threadsafe_function() {
		return NAPI_OK;
	},
	napi_release_threadsafe_function(func, mode) {
		threadsafeFunctions[func] = void 0;
		return NAPI_OK;
	},
	napi_call_threadsafe_function(func, data, is_blocking) {
		let f = threadsafeFunctions[func];
		f.env.pushScope();
		try {
			if (f.nativeFn) {
				let id = f.fn ? f.env.pushValue(f.fn) : 0;
				f.nativeFn(f.env.id, id, f.context, data);
			} else if (f.fn) f.fn();
		} finally {
			f.env.popScope();
		}
	},
	napi_get_threadsafe_function_context(func, result) {
		let f = threadsafeFunctions[func];
		f.env.setPointer(result, f.context);
		return NAPI_OK;
	},
	napi_create_async_work(env_id, async_resource, async_resource_name, execute, complete, data, result) {
		let env = environments[env_id];
		let w = new AsyncWork(env, execute ? env.table.get(execute) : void 0, complete ? env.table.get(complete) : void 0, data);
		env.setPointer(result, w.id);
		return NAPI_OK;
	},
	napi_delete_async_work(env, work) {
		asyncWork[work] = void 0;
		return NAPI_OK;
	},
	napi_queue_async_work(env, work) {
		queueMicrotask(() => {
			let w = asyncWork[work];
			if (w) {
				w.execute(env, w.data);
				w.complete(env, NAPI_OK, w.data);
			}
		});
		return NAPI_OK;
	},
	napi_cancel_async_work() {
		let w = asyncWork[work];
		w.complete(env, NAPI_CANCELED, w.data);
		asyncWork[work] = void 0;
		return NAPI_OK;
	},
	napi_throw(env_id, error) {
		let env = environments[env_id];
		env.pendingException = env.get(error);
		return NAPI_OK;
	},
	napi_throw_error(env_id, code, msg) {
		let env = environments[env_id];
		let err = new Error(env.getString(msg));
		err.code = code;
		env.pendingException = err;
		return NAPI_OK;
	},
	napi_throw_type_error(env_id, code, msg) {
		let env = environments[env_id];
		let err = new TypeError(env.getString(msg));
		err.code = code;
		env.pendingException = err;
		return NAPI_OK;
	},
	napi_throw_range_error(env_id, code, msg) {
		let env = environments[env_id];
		let err = new RangeError(env.getString(msg));
		err.code = code;
		env.pendingException = err;
		return NAPI_OK;
	},
	napi_create_error(env_id, code, msg, result) {
		let env = environments[env_id];
		let err = new Error(env.get(msg));
		err.code = env.get(code);
		return env.createValue(err, result);
	},
	napi_create_type_error(env_id, code, msg, result) {
		let env = environments[env_id];
		let err = new TypeError(env.get(msg));
		err.code = env.get(code);
		return env.createValue(err, result);
	},
	napi_create_range_error(env_id, code, msg, result) {
		let env = environments[env_id];
		let err = new RangeError(env.get(msg));
		err.code = env.get(code);
		return env.createValue(err, result);
	},
	napi_get_and_clear_last_exception(env_id, result) {
		let env = environments[env_id];
		let e = env.pendingException;
		env.pendingException = null;
		return env.createValue(e, result);
	},
	napi_is_exception_pending(env_id, result) {
		let env = environments[env_id];
		env.memory[result] = env.pendingException ? 1 : 0;
		return NAPI_OK;
	},
	napi_fatal_exception(env_id, err) {
		throw new Error("not implemented");
	},
	napi_fatal_error(location, location_len, message, message_len) {
		throw new Error("not implemented");
	},
	napi_get_global(env_id, result) {
		return environments[env_id].setPointer(result, 2);
	},
	napi_create_buffer(env_id, length, data, result) {
		let env = environments[env_id];
		let ptr = env.instance.exports.napi_wasm_malloc(length);
		if (data) env.setPointer(data, ptr);
		let buf = typeof globalThis.Buffer !== "undefined" ? globalThis.Buffer.from(env.memory.buffer, ptr, length) : env.memory.subarray(ptr, ptr + length);
		return env.createValue(buf, result);
	},
	napi_create_buffer_copy(env_id, length, data, result_data, result) {
		let env = environments[env_id];
		let ptr = env.instance.exports.napi_wasm_malloc(length);
		env.memory.set(env.memory.subarray(data, data + length), ptr);
		if (result_data) env.setPointer(result_data, ptr);
		let res = typeof globalThis.Buffer !== "undefined" ? globalThis.Buffer.from(env.memory.buffer, ptr, length) : env.memory.subarray(ptr, ptr + length);
		return env.createValue(res, result);
	},
	napi_create_external_buffer(env_id, length, data, finalize_cb, finalize_hint, result) {
		let env = environments[env_id];
		let buf = typeof globalThis.Buffer !== "undefined" ? globalThis.Buffer.from(env.memory.buffer, data, length) : env.memory.subarray(data, data + length);
		if (finalize_cb) {
			let cb = env.table.get(finalize_cb);
			finalizationRegistry.register(buf, new FinalizeRecord(env_id, cb, finalize_hint, data));
		}
		return env.createValue(buf, result);
	},
	napi_get_buffer_info(env_id, value, data, length) {
		let env = environments[env_id];
		let buf = env.get(value);
		let len = env.getBufferInfo(buf, data);
		return env.setPointer(length, len);
	},
	napi_create_arraybuffer(env_id, length, data, result) {
		let env = environments[env_id];
		let buf = new ArrayBuffer(length);
		if (data) env.getBufferInfo(buf, data);
		return env.createValue(buf, result);
	},
	napi_create_external_arraybuffer(env_id, data, length, finalize_cb, finalize_hint, result) {
		return NAPI_NO_EXTERNAL_BUFFERS_ALLOWED;
	},
	napi_get_arraybuffer_info(env_id, value, data, length) {
		let env = environments[env_id];
		let len = env.getBufferInfo(env.get(value), data);
		return env.setPointer(length, len);
	},
	napi_detach_arraybuffer(env_id, arraybuffer) {
		let buffer = environments[env_id].get(arraybuffer);
		if (typeof structuredClone === "function") structuredClone(buffer, { transfer: [buffer] });
		return NAPI_OK;
	},
	napi_is_detached_arraybuffer(env_id, arraybuffer, result) {
		let env = environments[env_id];
		let buffer = env.get(arraybuffer);
		env.memory[result] = buffer.byteLength === 0 ? 1 : 0;
		return NAPI_OK;
	},
	napi_create_typedarray(env_id, type, length, arraybuffer, offset, result) {
		let env = environments[env_id];
		let Class = typedArrays[type];
		let buf = new Class(env.get(arraybuffer), offset, length);
		return env.createValue(buf, result);
	},
	napi_create_dataview(env_id, byte_length, arraybuffer, byte_offset, result) {
		let env = environments[env_id];
		let buffer = env.get(arraybuffer);
		let view = new DataView(buffer, byte_offset, byte_length);
		return env.createValue(view, result);
	},
	napi_get_typedarray_info(env_id, typedarray, type, length, data, arraybuffer, byte_offset) {
		let env = environments[env_id];
		let val = env.get(typedarray);
		env.setPointer(type, typedArrays.indexOf(val.constructor));
		env.setPointer(length, val.length);
		env.getBufferInfo(val, data);
		env.createValue(val.buffer, arraybuffer);
		return env.setPointer(byte_offset, val.byteOffset);
	},
	napi_get_dataview_info(env_id, dataview, byte_length, data, arraybuffer, byte_offset) {
		let env = environments[env_id];
		let val = env.get(dataview);
		env.setPointer(byte_length, val.byteLength);
		env.getBufferInfo(val, data);
		env.createValue(val.buffer, arraybuffer);
		return env.setPointer(byte_offset, val.byteOffset);
	},
	napi_create_string_utf8(env_id, str, length, result) {
		let env = environments[env_id];
		let s = decoder.decode(env.memory.subarray(str, str + length));
		return env.createValue(s, result);
	},
	napi_get_value_string_utf8(env_id, value, buf, bufsize, result) {
		let env = environments[env_id];
		let val = env.get(value);
		if (buf == 0) return env.setPointer(result, utf8Length$1(val));
		let res = encoder$1.encodeInto(val, env.memory.subarray(buf, buf + bufsize - 1));
		env.memory[buf + res.written] = 0;
		return env.setPointer(result, res.written);
	},
	napi_create_string_latin1(env_id, str, length, result) {
		let env = environments[env_id];
		let s = latin1Decoder.decode(env.memory.subarray(str, str + length));
		return env.createValue(s, result);
	},
	napi_get_value_string_latin1(env_id, value, buf, bufsize, result) {
		let env = environments[env_id];
		let val = env.get(value);
		if (buf == 0) return env.setPointer(result, val.length);
		let mem = env.memory;
		let len = Math.min(val.length, bufsize - 1);
		for (let i = 0; i < len; i++) {
			let code = val.charCodeAt(i);
			mem[buf++] = code;
		}
		mem[buf] = 0;
		return env.setPointer(result, len);
	},
	napi_create_string_utf16(env_id, str, length, result) {
		let env = environments[env_id];
		let s = utf16Decoder.decode(env.memory.subarray(str, str + length * 2));
		return env.createValue(s, result);
	},
	napi_get_value_string_utf16(env_id, value, buf, bufsize, result) {
		let env = environments[env_id];
		let val = env.get(value);
		if (buf == 0) return env.setPointer(result, val.length);
		let mem = env.u16;
		let ptr = buf >> 1;
		let len = Math.min(val.length, bufsize - 1);
		for (let i = 0; i < len; i++) {
			let code = val.charCodeAt(i);
			mem[ptr++] = code;
		}
		mem[ptr] = 0;
		return env.setPointer(result, len);
	},
	napi_create_date(env_id, time, result) {
		return environments[env_id].createValue(new Date(time), result);
	},
	napi_get_date_value(env_id, value, result) {
		let env = environments[env_id];
		let date = env.get(value);
		env.f64[result >> 3] = date.valueOf();
	},
	napi_create_symbol(env_id, description, result) {
		let env = environments[env_id];
		let desc = env.get(description);
		return env.createValue(Symbol(desc), result);
	},
	napi_coerce_to_bool(env_id, value, result) {
		let env = environments[env_id];
		return env.createValue(Boolean(env.get(value)), result);
	},
	napi_coerce_to_number(env_id, value, result) {
		let env = environments[env_id];
		return env.createValue(Number(env.get(value)), result);
	},
	napi_coerce_to_object(env_id, value, result) {
		let env = environments[env_id];
		return env.createValue(Object(env.get(value)), result);
	},
	napi_coerce_to_string(env_id, value, result) {
		let env = environments[env_id];
		return env.createValue(String(env.get(value)), result);
	},
	napi_typeof(env_id, value, result) {
		let env = environments[env_id];
		let val = env.get(value);
		return env.setPointer(result, (() => {
			switch (typeof val) {
				case "undefined": return 0;
				case "boolean": return 2;
				case "number": return 3;
				case "string": return 4;
				case "symbol": return 5;
				case "object":
					if (val === null) return 1;
					else if (val instanceof ExternalValue) return 8;
					return 6;
				case "function": return 7;
				case "bigint": return 9;
			}
		})());
	},
	napi_instanceof(env_id, object, constructor, result) {
		let env = environments[env_id];
		let obj = env.get(object);
		let cons = env.get(constructor);
		env.memory[result] = obj instanceof cons ? 1 : 0;
		return NAPI_OK;
	},
	napi_is_array(env_id, value, result) {
		let env = environments[env_id];
		let val = env.get(value);
		env.memory[result] = Array.isArray(val) ? 1 : 0;
		return NAPI_OK;
	},
	napi_is_buffer(env_id, value, result) {
		let env = environments[env_id];
		let val = env.get(value);
		env.memory[result] = (typeof globalThis.Buffer !== "undefined" ? globalThis.Buffer.isBuffer(val) : val instanceof Uint8Array) ? 1 : 0;
		return NAPI_OK;
	},
	napi_is_date(env_id, value, result) {
		let env = environments[env_id];
		let val = env.get(value);
		env.memory[result] = val instanceof Date ? 1 : 0;
		return NAPI_OK;
	},
	napi_is_error(env_id, value, result) {
		let env = environments[env_id];
		let err = env.get(value);
		env.memory[result] = err instanceof Error ? 1 : 0;
		return NAPI_OK;
	},
	napi_is_typedarray(env_id, value, result) {
		let env = environments[env_id];
		let buf = env.get(value);
		env.memory[result] = ArrayBuffer.isView(buf) && !(buf instanceof DataView) ? 1 : 0;
		return NAPI_OK;
	},
	napi_is_dataview(env_id, value, result) {
		let env = environments[env_id];
		let val = env.get(value);
		env.memory[result] = val instanceof DataView ? 1 : 0;
		return NAPI_OK;
	},
	napi_strict_equals(env_id, lhs, rhs, result) {
		let env = environments[env_id];
		env.memory[result] = env.get(lhs) === env.get(rhs) ? 1 : 0;
		return NAPI_OK;
	},
	napi_wrap(env_id, js_object, native_object, finalize_cb, finalize_hint, result) {
		let env = environments[env_id];
		let obj = env.get(js_object);
		env.wrappedObjects.set(obj, native_object);
		if (finalize_cb) {
			let cb = env.table.get(finalize_cb);
			finalizationRegistry.register(obj, new FinalizeRecord(env_id, cb, finalize_hint, native_object));
		}
		if (result) return napi.napi_create_reference(env_id, js_object, 1, result);
		return NAPI_OK;
	},
	napi_unwrap(env_id, js_object, result) {
		let env = environments[env_id];
		let obj = env.get(js_object);
		let native_object = env.wrappedObjects.get(obj);
		env.setPointer(result, native_object);
		return NAPI_OK;
	},
	napi_remove_wrap(env_id, js_object, result) {
		let env = environments[env_id];
		let obj = env.get(js_object);
		let native_object = env.wrappedObjects.get(obj);
		finalizationRegistry.unregister(obj);
		env.wrappedObjects.delete(obj);
		return env.setPointer(result, native_object);
	},
	napi_type_tag_object(env_id, js_object, type_tag) {
		throw new Error("not implemented");
	},
	napi_check_object_type_tag(env_id, js_object, type_tag) {
		throw new Error("not implemented");
	},
	napi_add_finalizer(env_id, js_object, native_object, finalize_cb, finalize_hint, result) {
		let env = environments[env_id];
		let obj = env.get(js_object);
		let cb = env.table.get(finalize_cb);
		finalizationRegistry.register(obj, new FinalizeRecord(env_id, cb, finalize_hint, native_object));
		if (result) return napi.napi_create_reference(env_id, js_object, 1, result);
		return NAPI_OK;
	},
	napi_create_promise(env_id, deferred, promise) {
		let env = environments[env_id];
		let p = new Promise((resolve, reject) => {
			let id = env.deferred.length;
			env.deferred.push({
				resolve,
				reject
			});
			env.setPointer(deferred, id);
		});
		return env.createValue(p, promise);
	},
	napi_resolve_deferred(env_id, deferred, resolution) {
		let env = environments[env_id];
		let { resolve } = env.deferred[deferred];
		resolve(env.get(resolution));
		env.deferred[deferred] = void 0;
		return NAPI_OK;
	},
	napi_reject_deferred(env_id, deferred, rejection) {
		let env = environments[env_id];
		let { reject } = env.deferred[deferred];
		reject(env.get(rejection));
		env.deferred[deferred] = void 0;
		return NAPI_OK;
	},
	napi_is_promise(env_id, value, result) {
		let env = environments[env_id];
		let val = env.get(value);
		env.memory[result] = val instanceof Promise ? 1 : 0;
		return NAPI_OK;
	},
	napi_run_script(env_id, script, result) {
		let env = environments[env_id];
		let source = env.get(script);
		let res = (0, eval)(source);
		return env.createValue(res, result);
	},
	napi_create_external(env_id, data, finalize_cb, finalize_hint, result) {
		let env = environments[env_id];
		let external = new ExternalValue();
		env.externalObjects.set(external, data);
		if (finalize_cb) {
			let cb = env.table.get(finalize_cb);
			finalizationRegistry.register(external, new FinalizeRecord(env_id, cb, finalize_hint, data));
		}
		return env.createValue(external, result);
	},
	napi_get_value_external(env_id, value, result) {
		let env = environments[env_id];
		let external = env.get(value);
		let val = env.externalObjects.get(external);
		return env.setPointer(result, val);
	},
	napi_adjust_external_memory() {
		return NAPI_OK;
	}
};
function strlen(buf, ptr) {
	let len = 0;
	while (buf[ptr] !== 0) {
		len++;
		ptr++;
	}
	return len;
}
function utf8Length$1(string) {
	let len = 0;
	for (let i = 0; i < string.length; i++) {
		let c = string.charCodeAt(i);
		if (c >= 55296 && c <= 56319 && i < string.length - 1) {
			let c2 = string.charCodeAt(++i);
			if ((c2 & 64512) === 56320) c = ((c & 1023) << 10) + (c2 & 1023) + 65536;
			else i--;
		}
		if ((c & 4294967168) === 0) len++;
		else if ((c & 4294965248) === 0) len += 2;
		else if ((c & 4294901760) === 0) len += 3;
		else if ((c & 4292870144) === 0) len += 4;
	}
	return len;
}

//#endregion
//#region ../../node_modules/.pnpm/@parcel+watcher-wasm@2.5.6/node_modules/@parcel/watcher-wasm/wrapper.js
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
//#region ../../node_modules/.pnpm/@parcel+watcher-wasm@2.5.6/node_modules/@parcel/watcher-wasm/index.mjs
var import_wrapper = require_wrapper();
let env$1;
let encoder = new TextEncoder();
let constants = {
	O_ACCMODE: 3,
	O_RDONLY: 0,
	O_WRONLY: 1,
	O_RDWR: 2,
	O_CREAT: 64,
	O_EXCL: 128,
	O_NOCTTY: 256,
	O_TRUNC: 512,
	O_APPEND: 1024,
	O_NONBLOCK: 2048,
	O_SYNC: 4096,
	FASYNC: 8192,
	O_DIRECT: 16384,
	O_LARGEFILE: 32768,
	O_DIRECTORY: 65536,
	O_NOFOLLOW: 131072,
	O_NOATIME: 262144,
	O_CLOEXEC: 524288
};
napi.napi_get_last_error_info = () => {};
const fds = /* @__PURE__ */ new Map();
const dirs = /* @__PURE__ */ new Map();
const regexCache = /* @__PURE__ */ new Map();
const watches = [null];
const wasm_env = {
	__syscall_newfstatat(dirfd, path, buf, flags) {
		let dir = dirfd === -100 ? process.cwd() : fds.get(dirfd).path;
		let p = Path.resolve(dir, env$1.getString(path));
		let nofollow = flags & 256;
		try {
			return writeStat(nofollow ? fs.lstatSync(p, { bigint: true }) : fs.statSync(p, { bigint: true }), buf);
		} catch (err) {
			env$1.i32[env$1.instance.exports.__errno_location >> 2] = err.errno;
			return -1;
		}
	},
	__syscall_lstat64(path, buf) {
		let p = env$1.getString(path);
		try {
			return writeStat(fs.lstatSync(p, { bigint: true }), buf);
		} catch (err) {
			env$1.i32[env$1.instance.exports.__errno_location >> 2] = err.errno;
			return -1;
		}
	},
	__syscall_fstat64(fd, buf) {
		try {
			return writeStat(fs.fstatSync(fd, { bigint: true }), buf);
		} catch (err) {
			env$1.i32[env$1.instance.exports.__errno_location >> 2] = err.errno;
			return -1;
		}
	},
	__syscall_stat64(path, buf) {
		let p = env$1.getString(path);
		try {
			return writeStat(fs.statSync(p, { bigint: true }), buf);
		} catch (err) {
			env$1.i32[env$1.instance.exports.__errno_location >> 2] = err.errno;
			return -1;
		}
	},
	__syscall_getdents64(fd, dirp, count) {
		let p = fds.get(fd).path;
		let dir = dirs.get(fd);
		let entries = dir?.entries;
		if (!entries) try {
			entries = fs.readdirSync(p, { withFileTypes: true });
		} catch (err) {
			env$1.i32[env$1.instance.exports.__errno_location >> 2] = err.errno;
			return -1;
		}
		let start = dirp;
		let i = dir?.index || 0;
		for (; i < entries.length; i++) {
			let entry = entries[i];
			let type = entry.isFIFO() ? 1 : entry.isCharacterDevice() ? 2 : entry.isDirectory() ? 4 : entry.isBlockDevice() ? 6 : entry.isFile() ? 8 : entry.isSymbolicLink() ? 10 : entry.isSocket() ? 12 : 0;
			let len = align(utf8Length(entry.name) + 20, 8);
			if (dirp - start + len > count) break;
			env$1.u64[dirp >> 3] = 1n;
			env$1.u64[dirp + 8 >> 3] = BigInt(dirp - start + len);
			env$1.u16[dirp + 16 >> 1] = len;
			env$1.memory[dirp + 18] = type;
			let { written } = encoder.encodeInto(entry.name, env$1.memory.subarray(dirp + 19));
			env$1.memory[dirp + 19 + written] = 0;
			dirp += len;
		}
		dirs.set(fd, {
			index: i,
			entries
		});
		return dirp - start;
	},
	__syscall_openat(dirfd, path, flags, mode) {
		let f = 0;
		for (let c in constants) if (flags & constants[c]) f |= fs.constants[c] || 0;
		let dir = dirfd === -100 ? process.cwd() : fds.get(dirfd)?.path;
		if (!dir) {
			env$1.i32[env$1.instance.exports.__errno_location >> 2] = 9970;
			return -1;
		}
		let p = Path.resolve(dir, env$1.getString(path));
		try {
			let fd = fs.openSync(p, f);
			fds.set(fd, {
				path: p,
				flags
			});
			return fd;
		} catch (err) {
			env$1.i32[env$1.instance.exports.__errno_location >> 2] = err.errno;
			return -1;
		}
	},
	__syscall_fcntl64(fd, cmd) {
		switch (cmd) {
			case 3: return fds.get(fd).flags;
			case 2: return 0;
			default: throw new Error("Unknown fcntl64 call: " + cmd);
		}
	},
	__syscall_ioctl() {},
	emscripten_resize_heap() {
		return 0;
	},
	_abort_js() {},
	wasm_backend_add_watch(filename, backend) {
		let path = env$1.getString(filename);
		let watch = fs.watch(path, { encoding: "buffer" }, (eventType, filename) => {
			if (filename) {
				let type = eventType === "change" ? 1 : 2;
				let fptr = env$1.instance.exports.malloc(filename.byteLength + 1);
				env$1.memory.set(filename, fptr);
				env$1.memory[fptr + filename.byteLength] = 0;
				env$1.instance.exports.wasm_backend_event_handler(backend, wd, type, fptr);
				env$1.instance.exports.free(fptr);
			}
		});
		let wd = watches.length;
		watches.push(watch);
		return wd;
	},
	wasm_backend_remove_watch(wd) {
		watches[wd].close();
		watches[wd] = void 0;
	},
	set_timeout(ms, ctx) {
		return setTimeout(() => {
			env$1.instance.exports.on_timeout(ctx);
		}, ms);
	},
	clear_timeout(t) {
		clearTimeout(t);
	},
	_setitimer_js() {},
	emscripten_date_now() {
		return Date.now();
	},
	_emscripten_get_now_is_monotonic() {
		return true;
	},
	_emscripten_runtime_keepalive_clear() {},
	emscripten_get_now() {
		return performance.now();
	},
	wasm_regex_match(string, regex) {
		let re = regexCache.get(regex);
		if (!re) {
			re = new RegExp(env$1.getString(regex));
			regexCache.set(regex, re);
		}
		return re.test(env$1.getString(string)) ? 1 : 0;
	}
};
const wasi = {
	fd_close(fd) {
		fs.closeSync(fd);
		fds.delete(fd);
		dirs.delete(fd);
		return 0;
	},
	fd_seek(fd, offset_low, offset_high, whence, newOffset) {
		return 0;
	},
	fd_write(fd, iov, iovcnt, pnum) {
		let buffers = [];
		for (let i = 0; i < iovcnt; i++) {
			let ptr = env$1.u32[iov >> 2];
			let len = env$1.u32[iov + 4 >> 2];
			iov += 8;
			if (len > 0) buffers.push(env$1.memory.subarray(ptr, ptr + len));
		}
		let wrote = fs.writevSync(fd, buffers);
		env$1.u32[pnum >> 2] = wrote;
		return 0;
	},
	fd_read(fd, iov, iovcnt, pnum) {
		let buffers = [];
		for (let i = 0; i < iovcnt; i++) {
			let ptr = env$1.u32[iov >> 2];
			let len = env$1.u32[iov + 4 >> 2];
			iov += 8;
			if (len > 0) buffers.push(env$1.memory.subarray(ptr, ptr + len));
		}
		let read = fs.readvSync(fd, buffers);
		env$1.u32[pnum >> 2] = read;
		return 0;
	},
	proc_exit() {},
	clock_time_get() {}
};
function writeStat(stat, buf) {
	env$1.i32[buf >> 2] = Number(stat.dev);
	env$1.i32[buf + 4 >> 2] = Number(stat.mode);
	env$1.u32[buf + 8 >> 2] = Number(stat.nlink);
	env$1.i32[buf + 12 >> 2] = Number(stat.uid);
	env$1.i32[buf + 16 >> 2] = Number(stat.gid);
	env$1.i32[buf + 20 >> 2] = Number(stat.rdev);
	env$1.u64[buf + 24 >> 3] = stat.size;
	env$1.i32[buf + 32 >> 2] = Number(stat.blksize);
	env$1.i32[buf + 36 >> 2] = Number(stat.blocks);
	env$1.u64[buf + 40 >> 3] = stat.atimeMs;
	env$1.u32[buf + 48 >> 2] = Number(stat.atimeNs);
	env$1.u64[buf + 56 >> 3] = stat.mtimeMs;
	env$1.u32[buf + 64 >> 2] = Number(stat.mtimeNs);
	env$1.u64[buf + 72 >> 3] = stat.ctimeMs;
	env$1.u32[buf + 80 >> 2] = Number(stat.ctimeNs);
	env$1.u64[buf + 88 >> 3] = stat.ino;
	return 0;
}
function utf8Length(string) {
	let len = 0;
	for (let i = 0; i < string.length; i++) {
		let c = string.charCodeAt(i);
		if (c >= 55296 && c <= 56319 && i < string.length - 1) {
			let c2 = string.charCodeAt(++i);
			if ((c2 & 64512) === 56320) c = ((c & 1023) << 10) + (c2 & 1023) + 65536;
			else i--;
		}
		if ((c & 4294967168) === 0) len++;
		else if ((c & 4294965248) === 0) len += 2;
		else if ((c & 4294901760) === 0) len += 3;
		else if ((c & 4292870144) === 0) len += 4;
	}
	return len;
}
function align(len, p) {
	return Math.ceil(len / p) * p;
}
let wasmBytes = fs.readFileSync(new URL("watcher.wasm", import.meta.url));
let wasmModule = new WebAssembly.Module(wasmBytes);
env$1 = new Environment(new WebAssembly.Instance(wasmModule, {
	napi,
	env: wasm_env,
	wasi_snapshot_preview1: wasi
}));
let wrapper = (0, import_wrapper.createWrapper)(env$1.exports);
function subscribe(dir, fn, opts) {
	return wrapper.subscribe(dir, fn, opts);
}

//#endregion
export { subscribe };