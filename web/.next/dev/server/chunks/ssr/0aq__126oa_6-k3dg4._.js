(()=>{"use strict";module.exports = [
"[project]/web/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) return obj;
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") return {
        default: obj
    };
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) return cache.get(obj);
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) Object.defineProperty(newObj, key, desc);
            else newObj[key] = obj[key];
        }
    }
    newObj.default = obj;
    if (cache) cache.set(obj, newObj);
    return newObj;
}
exports._ = _interop_require_wildcard;
}),
"[project]/web/node_modules/dequal/lite/index.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dequal",
    ()=>dequal
]);
var has = Object.prototype.hasOwnProperty;
function dequal(foo, bar) {
    var ctor, len;
    if (foo === bar) return true;
    if (foo && bar && (ctor = foo.constructor) === bar.constructor) {
        if (ctor === Date) return foo.getTime() === bar.getTime();
        if (ctor === RegExp) return foo.toString() === bar.toString();
        if (ctor === Array) {
            if ((len = foo.length) === bar.length) {
                while(len-- && dequal(foo[len], bar[len]));
            }
            return len === -1;
        }
        if (!ctor || typeof foo === 'object') {
            len = 0;
            for(ctor in foo){
                if (has.call(foo, ctor) && ++len && !has.call(bar, ctor)) return false;
                if (!(ctor in bar) || !dequal(foo[ctor], bar[ctor])) return false;
            }
            return Object.keys(bar).length === len;
        }
    }
    return foo !== foo && bar !== bar;
}
}),
"[project]/web/node_modules/swr/dist/_internal/constants.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "INFINITE_PREFIX",
    ()=>INFINITE_PREFIX
]);
const INFINITE_PREFIX = '$inf$';
;
}),
"[project]/web/node_modules/swr/dist/_internal/index.mjs [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "normalize",
    ()=>normalize,
    "preload",
    ()=>preload,
    "subscribeCallback",
    ()=>subscribeCallback,
    "useSWRConfig",
    ()=>useSWRConfig,
    "withArgs",
    ()=>withArgs,
    "withMiddleware",
    ()=>withMiddleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/swr/dist/config-context-ext53wcz.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$_internal$2f$constants$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/swr/dist/_internal/constants.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
;
;
;
// @ts-expect-error
const enableDevtools = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["p"] && window.__SWR_DEVTOOLS_USE__;
const use = enableDevtools ? window.__SWR_DEVTOOLS_USE__ : [];
const setupDevTools = ()=>{
    if (enableDevtools) {
        // @ts-expect-error
        window.__SWR_DEVTOOLS_REACT__ = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"];
    }
};
const normalize = (args)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["e"])(args[1]) ? [
        args[0],
        args[1],
        args[2] || {}
    ] : [
        args[0],
        null,
        (args[1] === null ? args[2] : args[1]) || {}
    ];
};
const useSWRConfig = ()=>{
    const parentConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["q"]);
    const mergedConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["m"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["d"], parentConfig), [
        parentConfig
    ]);
    return mergedConfig;
};
const preload = (key_, fetcher)=>{
    // preload should be a no-op on the server
    if (__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["I"]) {
        return undefined;
    }
    const [key, fnArg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["s"])(key_);
    const [, , , PRELOAD] = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["a"].get(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["o"]);
    // Prevent preload to be called multiple times before used.
    if (PRELOAD[key]) {
        return PRELOAD[key];
    }
    const req = fetcher(fnArg);
    PRELOAD[key] = req;
    return req;
};
const middleware = (useSWRNext)=>(key_, fetcher_, config)=>{
        // fetcher might be a sync function, so this should not be an async function
        const fetcher = fetcher_ && ((...args)=>{
            const [key] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["s"])(key_);
            const [, , , PRELOAD] = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["a"].get(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["o"]);
            if (key.startsWith(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$_internal$2f$constants$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["INFINITE_PREFIX"])) {
                // we want the infinite fetcher to be called.
                // handling of the PRELOAD cache happens there.
                return fetcher_(...args);
            }
            const req = PRELOAD[key];
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i"])(req)) return fetcher_(...args);
            delete PRELOAD[key];
            return req;
        });
        return useSWRNext(key_, fetcher, config);
    };
const BUILT_IN_MIDDLEWARE = use.concat(middleware);
// It's tricky to pass generic types as parameters, so we just directly override
// the types here.
const withArgs = (hook)=>{
    return function useSWRArgs(...args) {
        // Get the default and inherited configuration.
        const fallbackConfig = useSWRConfig();
        // Normalize arguments.
        const [key, fn, _config] = normalize(args);
        // Merge configurations.
        const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["t"])(fallbackConfig, _config);
        // Apply middleware
        let next = hook;
        const { use } = config;
        const middleware = (use || []).concat(BUILT_IN_MIDDLEWARE);
        for(let i = middleware.length; i--;){
            next = middleware[i](next);
        }
        return next(key, fn || config.fetcher || null, config);
    };
};
// Add a callback function to a list of keyed callback functions and return
// the unsubscribe function.
const subscribeCallback = (key, callbacks, callback)=>{
    const keyedRevalidators = callbacks[key] || (callbacks[key] = []);
    keyedRevalidators.push(callback);
    return ()=>{
        const index = keyedRevalidators.indexOf(callback);
        if (index >= 0) {
            // O(1): faster than splice
            keyedRevalidators[index] = keyedRevalidators[keyedRevalidators.length - 1];
            keyedRevalidators.pop();
        }
    };
};
// Create a custom hook with a middleware
const withMiddleware = (useSWR, middleware)=>{
    return (...args)=>{
        const [key, fn, config] = normalize(args);
        const uses = (config.use || []).concat(middleware);
        return useSWR(key, fn, {
            ...config,
            use: uses
        });
    };
};
setupDevTools();
;
}),
"[project]/web/node_modules/swr/dist/config-context-ext53wcz.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "A",
    ()=>isLegacyDeno,
    "B",
    ()=>preset,
    "C",
    ()=>events,
    "D",
    ()=>slowConnection,
    "E",
    ()=>ERROR_REVALIDATE_EVENT,
    "F",
    ()=>FOCUS_EVENT,
    "G",
    ()=>stableHash,
    "I",
    ()=>IS_SERVER,
    "M",
    ()=>MUTATE_EVENT,
    "O",
    ()=>OBJECT,
    "R",
    ()=>RECONNECT_EVENT,
    "S",
    ()=>SWRConfig,
    "U",
    ()=>UNDEFINED,
    "a",
    ()=>SWRGlobalState,
    "b",
    ()=>isPromiseLike,
    "c",
    ()=>createCacheHelper,
    "d",
    ()=>defaultConfig,
    "e",
    ()=>isFunction,
    "f",
    ()=>internalMutate,
    "g",
    ()=>getTimestamp,
    "h",
    ()=>UNLOAD_EVENT,
    "i",
    ()=>isUndefined,
    "j",
    ()=>IS_REACT_LEGACY,
    "k",
    ()=>mutate,
    "l",
    ()=>unload,
    "m",
    ()=>mergeObjects,
    "n",
    ()=>noop,
    "o",
    ()=>cache,
    "p",
    ()=>isWindowDefined,
    "q",
    ()=>SWRConfigContext,
    "r",
    ()=>rAF,
    "s",
    ()=>serialize,
    "t",
    ()=>mergeConfigs,
    "u",
    ()=>useIsomorphicLayoutEffect,
    "v",
    ()=>compare,
    "w",
    ()=>defaultConfigOptions,
    "x",
    ()=>hasRequestAnimationFrame,
    "y",
    ()=>initCache,
    "z",
    ()=>isDocumentDefined
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$dequal$2f$lite$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/dequal/lite/index.mjs [app-ssr] (ecmascript)");
'use client';
;
;
const FOCUS_EVENT = 0;
const RECONNECT_EVENT = 1;
const MUTATE_EVENT = 2;
const ERROR_REVALIDATE_EVENT = 3;
const UNLOAD_EVENT = 4;
var events = {
    __proto__: null,
    ERROR_REVALIDATE_EVENT: ERROR_REVALIDATE_EVENT,
    FOCUS_EVENT: FOCUS_EVENT,
    MUTATE_EVENT: MUTATE_EVENT,
    RECONNECT_EVENT: RECONNECT_EVENT,
    UNLOAD_EVENT: UNLOAD_EVENT
};
// Global state used to deduplicate requests and store listeners
const SWRGlobalState = new WeakMap();
// Shared state between server components and client components
const noop = ()=>{};
// Using noop() as the undefined value as undefined can be replaced
// by something else. Prettier ignore and extra parentheses are necessary here
// to ensure that tsc doesn't remove the __NOINLINE__ comment.
// prettier-ignore
const UNDEFINED = /*#__NOINLINE__*/ noop();
const OBJECT = Object;
const isUndefined = (v)=>v === UNDEFINED;
const isFunction = (v)=>typeof v == 'function';
const mergeObjects = (a, b)=>({
        ...a,
        ...b
    });
const isPromiseLike = (x)=>isFunction(x.then);
const EMPTY_CACHE = {};
const INITIAL_CACHE = {};
const STR_UNDEFINED = 'undefined';
// NOTE: Use the function to guarantee it's re-evaluated between jsdom and node runtime for tests.
const isWindowDefined = ("TURBOPACK compile-time value", "undefined") != STR_UNDEFINED;
const isDocumentDefined = typeof document != STR_UNDEFINED;
const isLegacyDeno = isWindowDefined && 'Deno' in window;
const hasRequestAnimationFrame = ()=>isWindowDefined && typeof window['requestAnimationFrame'] != STR_UNDEFINED;
const createCacheHelper = (cache, key)=>{
    const state = SWRGlobalState.get(cache);
    return [
        // Getter
        ()=>!isUndefined(key) && cache.get(key) || EMPTY_CACHE,
        // Setter
        (info)=>{
            if (!isUndefined(key)) {
                const prev = cache.get(key);
                // Before writing to the store, we keep the value in the initial cache
                // if it's not there yet.
                if (!(key in INITIAL_CACHE)) {
                    INITIAL_CACHE[key] = prev;
                }
                state[5](key, mergeObjects(prev, info), prev || EMPTY_CACHE);
            }
        },
        // Subscriber
        state[6],
        // Get server cache snapshot
        ()=>{
            if (!isUndefined(key)) {
                // If the cache was updated on the client, we return the stored initial value.
                if (key in INITIAL_CACHE) return INITIAL_CACHE[key];
            }
            // If we haven't done any client-side updates, we return the current value.
            return !isUndefined(key) && cache.get(key) || EMPTY_CACHE;
        }
    ];
} // export { UNDEFINED, OBJECT, isUndefined, isFunction, mergeObjects, isPromiseLike }
;
/**
 * Due to the bug https://bugs.chromium.org/p/chromium/issues/detail?id=678075,
 * it's not reliable to detect if the browser is currently online or offline
 * based on `navigator.onLine`.
 * As a workaround, we always assume it's online on the first load, and change
 * the status upon `online` or `offline` events.
 */ let online = true;
const isOnline = ()=>online;
// For node and React Native, `add/removeEventListener` doesn't exist on window.
const [onWindowEvent, offWindowEvent] = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : [
    noop,
    noop
];
const isVisible = ()=>{
    const visibilityState = isDocumentDefined && document.visibilityState;
    return isUndefined(visibilityState) || visibilityState !== 'hidden';
};
const initFocus = (callback)=>{
    // focus revalidate
    if (isDocumentDefined) {
        document.addEventListener('visibilitychange', callback);
    }
    onWindowEvent('focus', callback);
    return ()=>{
        if (isDocumentDefined) {
            document.removeEventListener('visibilitychange', callback);
        }
        offWindowEvent('focus', callback);
    };
};
const initReconnect = (callback)=>{
    // revalidate on reconnected
    const onOnline = ()=>{
        online = true;
        callback();
    };
    // nothing to revalidate, just update the status
    const onOffline = ()=>{
        online = false;
    };
    onWindowEvent('online', onOnline);
    onWindowEvent('offline', onOffline);
    return ()=>{
        offWindowEvent('online', onOnline);
        offWindowEvent('offline', onOffline);
    };
};
const preset = {
    isOnline,
    isVisible
};
const defaultConfigOptions = {
    initFocus,
    initReconnect
};
const IS_REACT_LEGACY = !__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useId;
const IS_SERVER = !isWindowDefined || isLegacyDeno;
// Polyfill requestAnimationFrame
const rAF = (f)=>hasRequestAnimationFrame() ? "TURBOPACK unreachable" : setTimeout(f, 1);
// React currently throws a warning when using useLayoutEffect on the server.
// To get around it, we can conditionally useEffect on the server (no-op) and
// useLayoutEffect in the browser.
const useIsomorphicLayoutEffect = ("TURBOPACK compile-time truthy", 1) ? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"] : "TURBOPACK unreachable";
// This assignment is to extend the Navigator type to use effectiveType.
const navigatorConnection = typeof navigator !== 'undefined' && navigator.connection;
// Adjust the config based on slow connection status (<= 70Kbps).
const slowConnection = !IS_SERVER && navigatorConnection && ([
    'slow-2g',
    '2g'
].includes(navigatorConnection.effectiveType) || navigatorConnection.saveData);
// use WeakMap to store the object->key mapping
// so the objects can be garbage collected.
// WeakMap uses a hashtable under the hood, so the lookup
// complexity is almost O(1).
const table = new WeakMap();
const getTypeName = (value)=>OBJECT.prototype.toString.call(value);
const isObjectTypeName = (typeName, type)=>typeName === `[object ${type}]`;
// counter of the key
let counter = 0;
// A stable hash implementation that supports:
// - Fast and ensures unique hash properties
// - Handles unserializable values
// - Handles object key ordering
// - Generates short results
//
// This is not a serialization function, and the result is not guaranteed to be
// parsable.
const stableHash = (arg)=>{
    const type = typeof arg;
    const typeName = getTypeName(arg);
    const isDate = isObjectTypeName(typeName, 'Date');
    const isRegex = isObjectTypeName(typeName, 'RegExp');
    const isPlainObject = isObjectTypeName(typeName, 'Object');
    let result;
    let index;
    if (OBJECT(arg) === arg && !isDate && !isRegex) {
        // Object/function, not null/date/regexp. Use WeakMap to store the id first.
        // If it's already hashed, directly return the result.
        result = table.get(arg);
        if (result) return result;
        // Store the hash first for circular reference detection before entering the
        // recursive `stableHash` calls.
        // For other objects like set and map, we use this id directly as the hash.
        result = ++counter + '~';
        table.set(arg, result);
        if (Array.isArray(arg)) {
            // Array.
            result = '@';
            for(index = 0; index < arg.length; index++){
                result += stableHash(arg[index]) + ',';
            }
            table.set(arg, result);
        }
        if (isPlainObject) {
            // Object, sort keys.
            result = '#';
            const keys = OBJECT.keys(arg).sort();
            while(!isUndefined(index = keys.pop())){
                if (!isUndefined(arg[index])) {
                    result += index + ':' + stableHash(arg[index]) + ',';
                }
            }
            table.set(arg, result);
        }
    } else {
        result = isDate ? arg.toJSON() : type == 'symbol' ? arg.toString() : type == 'string' ? JSON.stringify(arg) : '' + arg;
    }
    return result;
};
const serialize = (key)=>{
    if (isFunction(key)) {
        try {
            key = key();
        } catch (err) {
            // dependencies not ready
            key = '';
        }
    }
    // Use the original key as the argument of fetcher. This can be a string or an
    // array of values.
    const args = key;
    // If key is not falsy, or not an empty array, hash it.
    key = typeof key == 'string' ? key : (Array.isArray(key) ? key.length : key) ? stableHash(key) : '';
    return [
        key,
        args
    ];
};
// Global timestamp.
let __timestamp = 0;
const getTimestamp = ()=>++__timestamp;
async function internalMutate(...args) {
    const [cache, _key, _data, _opts] = args;
    // When passing as a boolean, it's explicitly used to disable/enable
    // revalidation.
    const options = mergeObjects({
        populateCache: true,
        throwOnError: true
    }, typeof _opts === 'boolean' ? {
        revalidate: _opts
    } : _opts || {});
    let populateCache = options.populateCache;
    const rollbackOnErrorOption = options.rollbackOnError;
    let optimisticData = options.optimisticData;
    const rollbackOnError = (error)=>{
        return typeof rollbackOnErrorOption === 'function' ? rollbackOnErrorOption(error) : rollbackOnErrorOption !== false;
    };
    const throwOnError = options.throwOnError;
    // If the second argument is a key filter, return the mutation results for all
    // filtered keys.
    if (isFunction(_key)) {
        const keyFilter = _key;
        const matchedKeys = [];
        const it = cache.keys();
        for (const key of it){
            if (!/^\$(inf|sub)\$/.test(key) && keyFilter(cache.get(key)._k)) {
                matchedKeys.push(key);
            }
        }
        return Promise.all(matchedKeys.map(mutateByKey));
    }
    return mutateByKey(_key);
    //TURBOPACK unreachable
    ;
    async function mutateByKey(_k) {
        // Serialize key
        const [key] = serialize(_k);
        if (!key) return;
        const [get, set] = createCacheHelper(cache, key);
        const [EVENT_REVALIDATORS, MUTATION, FETCH, PRELOAD] = SWRGlobalState.get(cache);
        const startRevalidate = ()=>{
            const revalidators = EVENT_REVALIDATORS[key];
            const revalidate = isFunction(options.revalidate) ? options.revalidate(get().data, _k) : options.revalidate !== false;
            if (revalidate) {
                // Invalidate the key by deleting the concurrent request markers so new
                // requests will not be deduped.
                delete FETCH[key];
                delete PRELOAD[key];
                if (revalidators && revalidators[0]) {
                    return revalidators[0](MUTATE_EVENT).then(()=>get().data);
                }
            }
            return get().data;
        };
        // If there is no new data provided, revalidate the key with current state.
        if (args.length < 3) {
            // Revalidate and broadcast state.
            return startRevalidate();
        }
        let data = _data;
        let error;
        let isError = false;
        // Update global timestamps.
        const beforeMutationTs = getTimestamp();
        MUTATION[key] = [
            beforeMutationTs,
            0
        ];
        const hasOptimisticData = !isUndefined(optimisticData);
        const state = get();
        // `displayedData` is the current value on screen. It could be the optimistic value
        // that is going to be overridden by a `committedData`, or get reverted back.
        // `committedData` is the validated value that comes from a fetch or mutation.
        const displayedData = state.data;
        const currentData = state._c;
        const committedData = isUndefined(currentData) ? displayedData : currentData;
        // Do optimistic data update.
        if (hasOptimisticData) {
            optimisticData = isFunction(optimisticData) ? optimisticData(committedData, displayedData) : optimisticData;
            // When we set optimistic data, backup the current committedData data in `_c`.
            set({
                data: optimisticData,
                _c: committedData
            });
        }
        if (isFunction(data)) {
            // `data` is a function, call it passing current cache value.
            try {
                data = data(committedData);
            } catch (err) {
                // If it throws an error synchronously, we shouldn't update the cache.
                error = err;
                isError = true;
            }
        }
        // `data` is a promise/thenable, resolve the final data first.
        if (data && isPromiseLike(data)) {
            // This means that the mutation is async, we need to check timestamps to
            // avoid race conditions.
            data = await data.catch((err)=>{
                error = err;
                isError = true;
            });
            // Check if other mutations have occurred since we've started this mutation.
            // If there's a race we don't update cache or broadcast the change,
            // just return the data.
            if (beforeMutationTs !== MUTATION[key][0]) {
                if (isError) throw error;
                return data;
            } else if (isError && hasOptimisticData && rollbackOnError(error)) {
                // Rollback. Always populate the cache in this case but without
                // transforming the data.
                populateCache = true;
                // Reset data to be the latest committed data, and clear the `_c` value.
                set({
                    data: committedData,
                    _c: UNDEFINED
                });
            }
        }
        // If we should write back the cache after request.
        if (populateCache) {
            if (!isError) {
                // Transform the result into data.
                if (isFunction(populateCache)) {
                    const populateCachedData = populateCache(data, committedData);
                    set({
                        data: populateCachedData,
                        error: UNDEFINED,
                        _c: UNDEFINED
                    });
                } else {
                    // Only update cached data and reset the error if there's no error. Data can be `undefined` here.
                    set({
                        data,
                        error: UNDEFINED,
                        _c: UNDEFINED
                    });
                }
            }
        }
        // Reset the timestamp to mark the mutation has ended.
        MUTATION[key][1] = getTimestamp();
        // Update existing SWR Hooks' internal states:
        Promise.resolve(startRevalidate()).then(()=>{
            // The mutation and revalidation are ended, we can clear it since the data is
            // not an optimistic value anymore.
            set({
                _c: UNDEFINED
            });
        });
        // Throw error or return data
        if (isError) {
            if (throwOnError) throw error;
            return;
        }
        return data;
    }
}
const revalidateAllKeys = (revalidators, type)=>{
    for(const key in revalidators){
        if (revalidators[key][0]) revalidators[key][0](type);
    }
};
const initCache = (provider, options)=>{
    // The global state for a specific provider will be used to deduplicate
    // requests and store listeners. As well as a mutate function that is bound to
    // the cache.
    // The provider's global state might be already initialized. Let's try to get the
    // global state associated with the provider first.
    if (!SWRGlobalState.has(provider)) {
        const opts = mergeObjects(defaultConfigOptions, options);
        // If there's no global state bound to the provider, create a new one with the
        // new mutate function.
        const EVENT_REVALIDATORS = Object.create(null);
        const mutate = internalMutate.bind(UNDEFINED, provider);
        let unmount = noop;
        const subscriptions = Object.create(null);
        const subscribe = (key, callback)=>{
            const subs = subscriptions[key] || [];
            subscriptions[key] = subs;
            subs.push(callback);
            return ()=>{
                const index = subs.indexOf(callback);
                if (index >= 0) {
                    // O(1): swap with the last element and pop
                    subs[index] = subs[subs.length - 1];
                    subs.pop();
                }
            };
        };
        const setter = (key, value, prev)=>{
            provider.set(key, value);
            const subs = subscriptions[key];
            if (subs) {
                for (const fn of subs){
                    fn(value, prev);
                }
            }
        };
        const unload = (unloadOptions)=>{
            const state = SWRGlobalState.get(provider);
            const [, MUTATION, FETCH, PRELOAD] = state;
            const ts = getTimestamp();
            // Bump the unload generation so in-flight writes that bypass the
            // request markers (e.g. `useSWRInfinite` page responses) know to
            // discard themselves when they resolve.
            state[8]++;
            // Invalidate all in-flight requests and mutations first, so nothing
            // that resolves after this point can write back to the cache: fetches
            // fail the concurrent request marker check, and mutations fail the
            // timestamp race check. Mutation timestamps are overwritten instead of
            // deleted because ongoing mutations read them on resolution.
            for(const key in FETCH)delete FETCH[key];
            for(const key in PRELOAD)delete PRELOAD[key];
            for(const key in MUTATION)MUTATION[key] = [
                ts,
                ts
            ];
            // Delete all entries — including the special `useSWRInfinite` and
            // `useSWRSubscription` keys — and notify the subscribers of each key
            // so mounted hooks re-render with the empty cache. Subscribers receive
            // the same empty state object that cache reads resolve to for missing
            // entries.
            const emptyState = {};
            for (const key of [
                ...provider.keys()
            ]){
                const prev = provider.get(key);
                provider.delete(key);
                const subs = subscriptions[key];
                if (subs) {
                    for (const fn of subs){
                        fn(emptyState, prev);
                    }
                }
            }
            // The unload event runs last so the fresh requests it may start are
            // not invalidated by the cleanup above. It always fires — even without
            // revalidation — and to every hook on the key, so each one can drop
            // the previous data kept by `keepPreviousData`. Only the first hook
            // revalidates, consistent with how mutations revalidate a key.
            const revalidate = !unloadOptions || unloadOptions.revalidate !== false;
            for(const key in EVENT_REVALIDATORS){
                const revalidators = EVENT_REVALIDATORS[key];
                for(let i = 0; i < revalidators.length; i++){
                    revalidators[i](UNLOAD_EVENT, {
                        revalidate: revalidate && !i
                    });
                }
            }
        };
        const initProvider = ()=>{
            if (!SWRGlobalState.has(provider)) {
                // Update the state if it's new, or if the provider has been extended.
                SWRGlobalState.set(provider, [
                    EVENT_REVALIDATORS,
                    Object.create(null),
                    Object.create(null),
                    Object.create(null),
                    mutate,
                    setter,
                    subscribe,
                    unload,
                    0
                ]);
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
            }
        };
        initProvider();
        // This is a new provider, we need to initialize it and setup DOM events
        // listeners for `focus` and `reconnect` actions.
        // We might want to inject an extra layer on top of `provider` in the future,
        // such as key serialization, auto GC, etc.
        // For now, it's just a `Map` interface without any modifications.
        return [
            provider,
            mutate,
            initProvider,
            unmount,
            unload
        ];
    }
    const state = SWRGlobalState.get(provider);
    return [
        provider,
        state[4],
        UNDEFINED,
        UNDEFINED,
        state[7]
    ];
};
// error retry
const onErrorRetry = (_, __, config, revalidate, opts)=>{
    const maxRetryCount = config.errorRetryCount;
    const currentRetryCount = opts.retryCount;
    // Exponential backoff
    const timeout = ~~((Math.random() + 0.5) * (1 << (currentRetryCount < 8 ? currentRetryCount : 8))) * config.errorRetryInterval;
    if (!isUndefined(maxRetryCount) && currentRetryCount > maxRetryCount) {
        return;
    }
    setTimeout(revalidate, timeout, opts);
};
const compare = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$dequal$2f$lite$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dequal"];
// Default cache provider
const [cache, mutate, , , unload] = initCache(new Map());
// Default config
const defaultConfig = mergeObjects({
    // events
    onLoadingSlow: noop,
    onSuccess: noop,
    onError: noop,
    onErrorRetry,
    onDiscarded: noop,
    // switches
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    revalidateIfStale: true,
    shouldRetryOnError: true,
    // timeouts
    errorRetryInterval: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 5000,
    focusThrottleInterval: 5 * 1000,
    dedupingInterval: 2 * 1000,
    loadingTimeout: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 3000,
    // providers
    compare,
    isPaused: ()=>false,
    cache,
    mutate,
    unload,
    fallback: {}
}, preset);
const mergeConfigs = (a, b)=>{
    // Need to create a new object to avoid mutating the original here.
    const v = mergeObjects(a, b);
    // If two configs are provided, merge their `use`, `fallback`, and
    // `cacheData` options.
    if (b) {
        const { use: u1, fallback: f1, cacheData: c1 } = a;
        const { use: u2, fallback: f2, cacheData: c2 } = b;
        if (u1 && u2) {
            v.use = u1.concat(u2);
        }
        if (f1 && f2) {
            v.fallback = mergeObjects(f1, f2);
        }
        if (c1 && c2) {
            v.cacheData = mergeObjects(c1, c2);
        }
    }
    return v;
};
const SWRConfigContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])({});
const SWRConfig = (props)=>{
    const { value } = props;
    const parentConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(SWRConfigContext);
    const isFunctionalConfig = isFunction(value);
    const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>isFunctionalConfig ? value(parentConfig) : value, [
        isFunctionalConfig,
        parentConfig,
        value
    ]);
    // Extend parent context values and middleware.
    const extendedConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>isFunctionalConfig ? config : mergeConfigs(parentConfig, config), [
        isFunctionalConfig,
        parentConfig,
        config
    ]);
    // Should not use the inherited provider.
    const provider = config && config.provider;
    // initialize the cache only on first access.
    const cacheContextRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(UNDEFINED);
    if (provider && !cacheContextRef.current) {
        cacheContextRef.current = initCache(provider(extendedConfig.cache || cache), config);
    }
    const cacheContext = cacheContextRef.current;
    // Override the cache if a new provider is given.
    if (cacheContext) {
        extendedConfig.cache = cacheContext[0];
        extendedConfig.mutate = cacheContext[1];
        extendedConfig.unload = cacheContext[4];
    }
    // Unsubscribe events.
    useIsomorphicLayoutEffect(()=>{
        if (cacheContext) {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            cacheContext[2] && cacheContext[2]();
            return cacheContext[3];
        }
    }, []);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"])(SWRConfigContext.Provider, mergeObjects(props, {
        value: extendedConfig
    }));
};
;
}),
"[project]/web/node_modules/swr/dist/use-swr-emll9s78.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "S",
    ()=>SWRConfig,
    "u",
    ()=>useSWR
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$use$2d$sync$2d$external$2d$store$2f$shim$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/use-sync-external-store/shim/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$_internal$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/swr/dist/_internal/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/swr/dist/config-context-ext53wcz.mjs [app-ssr] (ecmascript)");
;
;
;
;
/// <reference types="react/experimental" />
const use = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].use || // This extra generic is to avoid TypeScript mixing up the generic and JSX sytax
// and emitting an error.
// We assume that this is only for the `use(thenable)` case, not `use(context)`.
// https://github.com/facebook/react/blob/aed00dacfb79d17c53218404c52b1c7aa59c4a89/packages/react-server/src/ReactFizzThenable.js#L45
((thenable)=>{
    switch(thenable.status){
        case 'pending':
            throw thenable;
        case 'fulfilled':
            return thenable.value;
        case 'rejected':
            throw thenable.reason;
        default:
            thenable.status = 'pending';
            thenable.then((v)=>{
                thenable.status = 'fulfilled';
                thenable.value = v;
            }, (e)=>{
                thenable.status = 'rejected';
                thenable.reason = e;
            });
            throw thenable;
    }
});
const WITH_DEDUPE = {
    dedupe: true
};
const isCacheDataConsumed = (consumedCacheData, cacheData, key)=>{
    var _consumedCacheData_get;
    return cacheData ? ((_consumedCacheData_get = consumedCacheData.get(cacheData)) == null ? void 0 : _consumedCacheData_get.has(key)) === true : false;
};
const markCacheDataConsumed = (consumedCacheData, cacheData, key)=>{
    if (!cacheData) return;
    let consumedKeys = consumedCacheData.get(cacheData);
    if (!consumedKeys) {
        consumedKeys = new Set();
        consumedCacheData.set(cacheData, consumedKeys);
    }
    consumedKeys.add(key);
};
const commitCacheData = ({ value, getCacheData, canCommit, setCache })=>{
    const commit = (state)=>{
        if (canCommit() && (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i"])(getCacheData())) {
            setCache(state);
        }
    };
    Promise.resolve(value).then((data)=>{
        commit({
            data,
            error: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["U"]
        });
    }, (error)=>{
        commit({
            error
        });
    });
};
// React can only unwrap a thenable synchronously when it has React's thenable
// status fields, so this fulfilled no-op keeps Suspense paths from waiting.
const resolvedUndef = Promise.resolve(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["U"]);
// @ts-ignore modify react promise status
resolvedUndef.status = 'fulfilled';
// @ts-ignore modify react promise value
resolvedUndef.value = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["U"];
const sub = ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["n"];
/**
 * The core implementation of the useSWR hook.
 *
 * This is the main handler function that implements all SWR functionality including
 * data fetching, caching, revalidation, error handling, and state management.
 * It manages the complete lifecycle of SWR requests from initialization through
 * cleanup.
 *
 * Key responsibilities:
 * - Key serialization and normalization
 * - Cache state management and synchronization
 * - Automatic and manual revalidation
 * - Error handling and retry logic
 * - Suspense integration
 * - Loading state management
 * - Effect cleanup and memory management
 *
 * @template Data - The type of data returned by the fetcher
 * @template Error - The type of error that can be thrown
 *
 * @param _key - The SWR key (string, array, object, function, or falsy)
 * @param fetcher - The fetcher function to retrieve data, or null to disable fetching
 * @param config - Complete SWR configuration object with both public and internal options
 *
 * @returns SWRResponse object containing data, error, mutate function, and loading states
 *
 * @internal This is the internal implementation. Use `useSWR` instead.
 */ const useSWRHandler = (_key, fetcher, config)=>{
    const { cache, compare, suspense, fallbackData, revalidateOnMount, revalidateIfStale, refreshInterval, refreshWhenHidden, refreshWhenOffline, keepPreviousData, strictServerPrefetchWarning } = config;
    const [EVENT_REVALIDATORS, MUTATION, FETCH, PRELOAD] = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["a"].get(cache);
    // `key` is the identifier of the SWR internal state,
    // `fnArg` is the argument/arguments parsed from the key, which will be passed
    // to the fetcher.
    // All of them are derived from `_key`.
    const [key, fnArg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["s"])(_key);
    // If it's the initial render of this hook.
    const initialMountedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    // If the hook is unmounted already. This will be used to prevent some effects
    // to be called after unmounting.
    const unmountedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    // Refs to keep the key and config.
    const keyRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(key);
    const fetcherRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(fetcher);
    const configRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(config);
    const getConfig = ()=>configRef.current;
    const isActive = ()=>getConfig().isVisible() && getConfig().isOnline();
    const [getCache, setCache, subscribeCache, getInitialCache] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["c"])(cache, key);
    const stateDependencies = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({}).current;
    // Resolve the fallback data from either the inline option, or the global provider.
    // If it's a promise, we simply let React suspend and resolve it for us.
    const fallback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i"])(fallbackData) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i"])(config.fallback) ? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["U"] : config.fallback[key] : fallbackData;
    const serverCacheData = config.cacheData;
    const configCacheData = !key ? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["U"] : serverCacheData == null ? void 0 : serverCacheData[key];
    const req = key ? PRELOAD[key] : __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["U"];
    // `cacheData` is request-scoped data provided by a Server Component through
    // `SWRConfig`'s context. It's only used when there's no in-flight client
    // `preload()` response (`req`) for the same key.
    const hasCacheData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i"])(req) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i"])(configCacheData);
    const preloadedData = hasCacheData ? configCacheData : req;
    const isEqual = (prev, current)=>{
        for(const _ in stateDependencies){
            const t = _;
            if (t === 'data') {
                if (!compare(prev[t], current[t])) {
                    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i"])(prev[t])) {
                        return false;
                    }
                    if (!compare(returnedData, current[t])) {
                        return false;
                    }
                }
            } else {
                if (current[t] !== prev[t]) {
                    return false;
                }
            }
        }
        return true;
    };
    const isInitialMount = !initialMountedRef.current;
    const getSnapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const cachedData = getCache();
        const initialData = getInitialCache();
        const getSelectedCache = (state)=>{
            // We only select the needed fields from the state.
            const snapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["m"])(state);
            delete snapshot._k;
            const shouldStartRequest = (()=>{
                if (!key) return false;
                if (!fetcher) return false;
                // If it's paused, we skip revalidation.
                if (getConfig().isPaused()) return false;
                // If `revalidateOnMount` is set, we take the value directly.
                if (isInitialMount && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i"])(revalidateOnMount)) return revalidateOnMount;
                const data = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i"])(fallback) ? fallback : snapshot.data;
                // cacheData is consumed during the initial Suspense render. Once data
                // is cached, fall through to the normal mount revalidation policy.
                if (suspense && hasCacheData && (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i"])(data)) return false;
                if (suspense) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i"])(data) || revalidateIfStale;
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i"])(data) || revalidateIfStale;
            })();
            if (!shouldStartRequest) {
                return snapshot;
            }
            return {
                isValidating: true,
                isLoading: true,
                ...snapshot
            };
        };
        const clientSnapshot = getSelectedCache(cachedData);
        const serverSnapshot = cachedData === initialData ? clientSnapshot : getSelectedCache(initialData);
        // To make sure that we are returning the same object reference to avoid
        // unnecessary re-renders, we keep the previous snapshot and use deep
        // comparison to check if we need to return a new one.
        let memorizedSnapshot = clientSnapshot;
        return [
            ()=>{
                const newSnapshot = getSelectedCache(getCache());
                const compareResult = isEqual(newSnapshot, memorizedSnapshot);
                if (compareResult) {
                    // Mentally, we should always return the `memorizedSnapshot` here
                    // as there's no change between the new and old snapshots.
                    // However, since the `isEqual` function only compares selected fields,
                    // the values of the unselected fields might be changed. That's
                    // simply because we didn't track them.
                    // To support the case in https://github.com/vercel/swr/pull/2576,
                    // we need to update these fields in the `memorizedSnapshot` too
                    // with direct mutations to ensure the snapshot is always up-to-date
                    // even for the unselected fields, but only trigger re-renders when
                    // the selected fields are changed.
                    memorizedSnapshot.data = newSnapshot.data;
                    memorizedSnapshot.isLoading = newSnapshot.isLoading;
                    memorizedSnapshot.isValidating = newSnapshot.isValidating;
                    memorizedSnapshot.error = newSnapshot.error;
                    return memorizedSnapshot;
                } else {
                    memorizedSnapshot = newSnapshot;
                    return newSnapshot;
                }
            },
            ()=>serverSnapshot
        ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        cache,
        key
    ]);
    // Get the current state that SWR should return.
    const cached = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$use$2d$sync$2d$external$2d$store$2f$shim$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSyncExternalStore"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((callback)=>subscribeCache(key, (current, prev)=>{
            if (!isEqual(prev, current)) callback();
        }), [
        cache,
        key
    ]), getSnapshot[0], getSnapshot[1]);
    const hasRevalidator = EVENT_REVALIDATORS[key] && EVENT_REVALIDATORS[key].length > 0;
    const cachedData = cached.data;
    let data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i"])(cachedData) ? fallback && (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["b"])(fallback) ? use(fallback) : fallback : cachedData;
    const error = cached.error;
    // Use a ref to store previously returned data. Use the initial data as its initial value.
    const laggyDataRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(data);
    const consumedCacheDataRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["U"]);
    let consumedCacheData = consumedCacheDataRef.current;
    if (!consumedCacheData) {
        consumedCacheData = new WeakMap();
        consumedCacheDataRef.current = consumedCacheData;
    }
    const preloadCacheRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    let returnedData = keepPreviousData ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i"])(cachedData) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i"])(laggyDataRef.current) ? data : laggyDataRef.current : cachedData : data;
    const hasKeyButNoData = key && (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i"])(data);
    const hydrationRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Note: the conditionally hook call is fine because the environment
    // `IS_SERVER` never changes.
    // @ts-expect-error -- use hydrationRef directly
    !__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["I"] && // getServerSnapshot is only called during hydration
    // eslint-disable-next-line react-hooks/rules-of-hooks
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$use$2d$sync$2d$external$2d$store$2f$shim$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(sub, ()=>{
        hydrationRef.current = false;
        return hydrationRef;
    }, ()=>{
        hydrationRef.current = true;
        return hydrationRef;
    });
    const isHydration = hydrationRef.current;
    // During the initial SSR render, warn if the key has no data pre-fetched via:
    // - fallback data
    // - preload calls
    // - initial data from the cache provider
    // We only warn once for each key during Hydration.
    if (strictServerPrefetchWarning && isHydration && !suspense && hasKeyButNoData) {
        console.warn(`Missing pre-initiated data for serialized key "${key}" during server-side rendering. Data fetching should be initiated on the server and provided to SWR via fallback data. You can set "strictServerPrefetchWarning: false" to disable this warning.`);
    }
    // Resolve the default validating state:
    // If it's able to validate, and it should revalidate when mount, this will be true.
    // - Suspense mode and there's stale data for the initial render.
    // - Not suspense mode and there is no fallback data and `revalidateIfStale` is enabled.
    // - `revalidateIfStale` is enabled but `data` is not defined.
    const shouldDoInitialRevalidation = (()=>{
        if (!key || !fetcher) return false;
        // If it's paused, we skip revalidation.
        if (getConfig().isPaused()) return false;
        // if a key already has revalidators and also has error, we should not trigger revalidation
        if (hasRevalidator && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i"])(error)) return false;
        // If `revalidateOnMount` is set, we take the value directly.
        if (isInitialMount && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i"])(revalidateOnMount)) return revalidateOnMount;
        // cacheData satisfies the initial Suspense render without a duplicate
        // request. Cached data on a later mount follows revalidateIfStale.
        if (suspense && hasCacheData && hasKeyButNoData) return false;
        // Under suspense mode, it will always fetch on render if there is no
        // stale data so no need to revalidate immediately mount it again.
        // If data exists, only revalidate if `revalidateIfStale` is true.
        if (suspense) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i"])(data) ? false : revalidateIfStale;
        // If there is no stale data, we need to revalidate when mount;
        // If `revalidateIfStale` is set to true, we will always revalidate.
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i"])(data) || revalidateIfStale;
    })();
    const defaultValidatingState = isInitialMount && shouldDoInitialRevalidation;
    const isValidating = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i"])(cached.isValidating) ? defaultValidatingState : cached.isValidating;
    const isLoading = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i"])(cached.isLoading) ? defaultValidatingState : cached.isLoading;
    // The revalidation function is a carefully crafted wrapper of the original
    // `fetcher`, to correctly handle the many edge cases.
    const revalidate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (revalidateOpts)=>{
        const currentFetcher = fetcherRef.current;
        if (!key || !currentFetcher || unmountedRef.current || getConfig().isPaused()) {
            return false;
        }
        let newData;
        let startAt;
        let loading = true;
        const opts = revalidateOpts || {};
        // If there is no ongoing concurrent request, or `dedupe` is not set, a
        // new request should be initiated.
        const shouldStartNewRequest = !FETCH[key] || !opts.dedupe;
        const shouldUseRSCPreload = hasCacheData && !isCacheDataConsumed(consumedCacheData, serverCacheData, key) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i"])(preloadedData) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i"])(getCache().data);
        /*
         For React 17
         Do unmount check for calls:
         If key has changed during the revalidation, or the component has been
         unmounted, old dispatch and old event callbacks should not take any
         effect

        For React 18
        only check if key has changed
        https://github.com/reactwg/react-18/discussions/82
      */ const callbackSafeguard = ()=>{
            if (__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["j"]) {
                return !unmountedRef.current && key === keyRef.current && initialMountedRef.current;
            }
            return key === keyRef.current;
        };
        // The final state object when the request finishes.
        const finalState = {
            isValidating: false,
            isLoading: false
        };
        const finishRequestAndUpdateState = ()=>{
            setCache(finalState);
        };
        const cleanupState = ()=>{
            // Check if it's still the same request before deleting it.
            const requestInfo = FETCH[key];
            if (requestInfo && requestInfo[1] === startAt) {
                delete FETCH[key];
            }
        };
        // Start fetching. Change the `isValidating` state, update the cache.
        const initialState = {
            isValidating: true
        };
        // It is in the `isLoading` state, if and only if there is no cached data.
        // This bypasses fallback data and laggy data.
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i"])(getCache().data)) {
            initialState.isLoading = true;
        }
        try {
            if (shouldStartNewRequest) {
                setCache(initialState);
                // If no cache is being rendered currently (it shows a blank page),
                // we trigger the loading slow event.
                if (config.loadingTimeout && (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i"])(getCache().data)) {
                    setTimeout(()=>{
                        if (loading && callbackSafeguard()) {
                            getConfig().onLoadingSlow(key, config);
                        }
                    }, config.loadingTimeout);
                }
                // Start the request and save the timestamp.
                // Key must be truthy if entering here.
                if (shouldUseRSCPreload) {
                    markCacheDataConsumed(consumedCacheData, serverCacheData, key);
                }
                FETCH[key] = [
                    shouldUseRSCPreload ? preloadedData : currentFetcher(fnArg),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["g"])()
                ];
                if (shouldUseRSCPreload && PRELOAD[key]) {
                    delete PRELOAD[key];
                }
            }
            // Wait until the ongoing request is done. Deduplication is also
            // considered here.
            ;
            [newData, startAt] = FETCH[key];
            newData = await newData;
            if (shouldStartNewRequest) {
                // If the request isn't interrupted, clean it up after the
                // deduplication interval.
                setTimeout(cleanupState, config.dedupingInterval);
            }
            // If there're other ongoing request(s), started after the current one,
            // we need to ignore the current one to avoid possible race conditions:
            //   req1------------------>res1        (current one)
            //        req2---------------->res2
            // the request that fired later will always be kept.
            // The timestamp maybe be `undefined` or a number
            if (!FETCH[key] || FETCH[key][1] !== startAt) {
                if (shouldStartNewRequest) {
                    if (callbackSafeguard()) {
                        getConfig().onDiscarded(key);
                    }
                }
                return false;
            }
            // Clear error.
            finalState.error = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["U"];
            // If there're other mutations(s), that overlapped with the current revalidation:
            // case 1:
            //   req------------------>res
            //       mutate------>end
            // case 2:
            //         req------------>res
            //   mutate------>end
            // case 3:
            //   req------------------>res
            //       mutate-------...---------->
            // we have to ignore the revalidation result (res) because it's no longer fresh.
            // meanwhile, a new revalidation should be triggered when the mutation ends.
            const mutationInfo = MUTATION[key];
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i"])(mutationInfo) && // case 1
            (startAt <= mutationInfo[0] || // case 2
            startAt <= mutationInfo[1] || // case 3
            mutationInfo[1] === 0)) {
                finishRequestAndUpdateState();
                if (shouldStartNewRequest) {
                    if (callbackSafeguard()) {
                        getConfig().onDiscarded(key);
                    }
                }
                return false;
            }
            // Deep compare with the latest state to avoid extra re-renders.
            // For local state, compare and assign.
            const cacheData = getCache().data;
            // Since the compare fn could be custom fn
            // cacheData might be different from newData even when compare fn returns True
            finalState.data = compare(cacheData, newData) ? cacheData : newData;
            // Trigger the successful callback if it's the original request.
            if (shouldStartNewRequest) {
                if (callbackSafeguard()) {
                    getConfig().onSuccess(newData, key, config);
                }
            }
        } catch (err) {
            cleanupState();
            const currentConfig = getConfig();
            const { shouldRetryOnError } = currentConfig;
            // Not paused, we continue handling the error. Otherwise, discard it.
            if (!currentConfig.isPaused()) {
                // Get a new error, don't use deep comparison for errors.
                finalState.error = err;
                // Error event and retry logic. Only for the actual request, not
                // deduped ones.
                if (shouldStartNewRequest && callbackSafeguard()) {
                    currentConfig.onError(err, key, currentConfig);
                    if (shouldRetryOnError === true || (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["e"])(shouldRetryOnError) && shouldRetryOnError(err)) {
                        if (!getConfig().revalidateOnFocus || !getConfig().revalidateOnReconnect || isActive()) {
                            // If it's inactive, stop. It will auto-revalidate when
                            // refocusing or reconnecting.
                            // When retrying, deduplication is always enabled.
                            currentConfig.onErrorRetry(err, key, currentConfig, (_opts)=>{
                                const revalidators = EVENT_REVALIDATORS[key];
                                if (revalidators && revalidators[0]) {
                                    revalidators[0](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["E"], _opts);
                                }
                            }, {
                                retryCount: (opts.retryCount || 0) + 1,
                                dedupe: true
                            });
                        }
                    }
                }
            }
        }
        // Mark loading as stopped.
        loading = false;
        // Update the current hook's state.
        finishRequestAndUpdateState();
        return true;
    }, // `keyValidating` are depending on `key`, so we can exclude them from
    // the deps array.
    //
    // FIXME:
    // `fn` and `config` might be changed during the lifecycle,
    // but they might be changed every render like this.
    // `useSWR('key', () => fetch('/api/'), { suspense: true })`
    // So we omit the values from the deps array
    // even though it might cause unexpected behaviors.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
        key,
        cache
    ]);
    // Similar to the global mutate but bound to the current cache and key.
    // `cache` isn't allowed to change during the lifecycle.
    const boundMutate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((...args)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["f"])(cache, keyRef.current, ...args);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u"])(()=>{
        const preloaded = preloadCacheRef.current;
        if (!preloaded) return;
        preloadCacheRef.current = null;
        markCacheDataConsumed(consumedCacheData, preloaded.cacheData, preloaded.key);
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i"])(getCache().data)) {
            setCache({
                data: preloaded.data,
                error: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["U"],
                _k: preloaded._k
            });
        }
        if (PRELOAD[preloaded.key]) {
            delete PRELOAD[preloaded.key];
        }
    });
    // The logic for updating refs.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u"])(()=>{
        fetcherRef.current = fetcher;
        configRef.current = config;
        // Handle laggy data updates. If there's cached data of the current key,
        // it'll be the correct reference.
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i"])(cachedData)) {
            laggyDataRef.current = cachedData;
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u"])(()=>{
        if (fetcher || !hasCacheData || (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i"])(preloadedData) || isCacheDataConsumed(consumedCacheData, serverCacheData, key) || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i"])(getCache().data)) {
            return;
        }
        markCacheDataConsumed(consumedCacheData, serverCacheData, key);
        const mutation = MUTATION[key];
        commitCacheData({
            value: preloadedData,
            getCacheData: ()=>getCache().data,
            canCommit: ()=>!unmountedRef.current && key === keyRef.current && MUTATION[key] === mutation,
            setCache: (state)=>setCache({
                    ...state,
                    _k: fnArg
                })
        });
    });
    // After mounted or key changed.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u"])(()=>{
        if (!key) return;
        const softRevalidate = revalidate.bind(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["U"], WITH_DEDUPE);
        let nextFocusRevalidatedAt = 0;
        if (getConfig().revalidateOnFocus) {
            const initNow = Date.now();
            nextFocusRevalidatedAt = initNow + getConfig().focusThrottleInterval;
        }
        // Expose revalidators to global event listeners. So we can trigger
        // revalidation from the outside.
        const onRevalidate = (type, opts = {})=>{
            if (type == __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["F"]) {
                const now = Date.now();
                if (getConfig().revalidateOnFocus && now > nextFocusRevalidatedAt && isActive()) {
                    nextFocusRevalidatedAt = now + getConfig().focusThrottleInterval;
                    softRevalidate();
                }
            } else if (type == __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["R"]) {
                if (getConfig().revalidateOnReconnect && isActive()) {
                    softRevalidate();
                }
            } else if (type == __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["M"]) {
                return revalidate();
            } else if (type == __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["E"]) {
                return revalidate(opts);
            } else if (type == __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["h"]) {
                // The cache has been cleared: drop the previous data kept by
                // `keepPreviousData` so it can't stay on screen.
                laggyDataRef.current = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["U"];
                if (opts.revalidate) {
                    return revalidate();
                }
            }
            return;
        };
        const unsubEvents = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$_internal$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["subscribeCallback"])(key, EVENT_REVALIDATORS, onRevalidate);
        // Mark the component as mounted and update corresponding refs.
        unmountedRef.current = false;
        keyRef.current = key;
        initialMountedRef.current = true;
        // Keep the original key in the cache.
        setCache({
            _k: fnArg
        });
        // Trigger a revalidation
        if (shouldDoInitialRevalidation) {
            // Performance optimization: if a request is already in progress for this key,
            // skip the revalidation to avoid redundant work
            if (!FETCH[key]) {
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i"])(data) || __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["I"]) {
                    // Revalidate immediately.
                    softRevalidate();
                } else {
                    // Delay the revalidate if we have data to return so we won't block
                    // rendering.
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["r"])(softRevalidate);
                }
            }
        }
        return ()=>{
            // Mark it as unmounted.
            unmountedRef.current = true;
            unsubEvents();
        };
    }, [
        key
    ]);
    // Polling
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u"])(()=>{
        let timer;
        function next() {
            // Use the passed interval
            // ...or invoke the function with the updated data to get the interval
            const interval = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["e"])(refreshInterval) ? refreshInterval(getCache().data) : refreshInterval;
            // We only start the next interval if `refreshInterval` is not 0, and:
            // - `force` is true, which is the start of polling
            // - or `timer` is not 0, which means the effect wasn't canceled
            if (interval && timer !== -1) {
                timer = setTimeout(execute, interval);
            }
        }
        function execute() {
            // Check if it's OK to execute:
            // Only revalidate when the page is visible, online, and not errored.
            if (!getCache().error && (refreshWhenHidden || getConfig().isVisible()) && (refreshWhenOffline || getConfig().isOnline())) {
                revalidate(WITH_DEDUPE).then(next);
            } else {
                // Schedule the next interval to check again.
                next();
            }
        }
        next();
        return ()=>{
            if (timer) {
                clearTimeout(timer);
                timer = -1;
            }
        };
    }, [
        refreshInterval,
        refreshWhenHidden,
        refreshWhenOffline,
        key
    ]);
    // Display debug info in React DevTools.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDebugValue"])(returnedData);
    // In Suspense mode, we can't return the empty `data` state.
    // If there is an `error`, the `error` needs to be thrown to the error boundary.
    // If there is no `error`, the `revalidation` promise needs to be thrown to
    // the suspense boundary.
    if (suspense) {
        // SWR should throw when trying to use Suspense on the server with React 18,
        // without providing any fallback data. This causes hydration errors. See:
        // https://github.com/vercel/swr/issues/1832
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["j"] && __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["I"] && hasKeyButNoData && (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i"])(preloadedData)) {
            throw new Error('Fallback data is required when using Suspense in SSR.');
        }
        // Always update fetcher and config refs even with the Suspense mode.
        if (hasKeyButNoData) {
            fetcherRef.current = fetcher;
            configRef.current = config;
            unmountedRef.current = false;
        }
        const shouldConsumePreload = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i"])(preloadedData) && hasKeyButNoData;
        let preloadData = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["U"];
        if (shouldConsumePreload && hasCacheData) {
            preloadData = preloadedData && (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["b"])(preloadedData) ? use(preloadedData) : preloadedData;
            data = preloadData;
            returnedData = preloadData;
            if (!__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["I"]) {
                preloadCacheRef.current = {
                    data: preloadData,
                    _k: fnArg,
                    key,
                    cacheData: serverCacheData
                };
            }
        } else {
            const mutateReq = shouldConsumePreload ? boundMutate(preloadedData) : resolvedUndef;
            use(mutateReq);
        }
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i"])(error) && hasKeyButNoData) {
            throw error;
        }
        const revalidation = hasKeyButNoData && (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i"])(preloadData) ? revalidate(WITH_DEDUPE) : resolvedUndef;
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i"])(returnedData) && hasKeyButNoData) {
            // @ts-ignore modify react promise status
            revalidation.status = 'fulfilled';
            // @ts-ignore modify react promise value
            revalidation.value = true;
        }
        use(revalidation);
    }
    const swrResponse = {
        mutate: boundMutate,
        get data () {
            stateDependencies.data = true;
            return returnedData;
        },
        get error () {
            stateDependencies.error = true;
            return error;
        },
        get isValidating () {
            stateDependencies.isValidating = true;
            return isValidating;
        },
        get isLoading () {
            stateDependencies.isLoading = true;
            return isLoading;
        }
    };
    return swrResponse;
};
const SWRConfig = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["O"].defineProperty(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["S"], 'defaultValue', {
    value: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["d"]
});
/**
 * A hook to fetch data.
 *
 * @see {@link https://swr.vercel.app}
 *
 * @example
 * ```jsx
 * import useSWR from 'swr'
 * function Profile() {
 *   const { data, error, isLoading } = useSWR('/api/user', fetcher)
 *   if (error) return <div>failed to load</div>
 *   if (isLoading) return <div>loading...</div>
 *   return <div>hello {data.name}!</div>
 * }
 * ```
 */ const useSWR = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$_internal$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withArgs"])(useSWRHandler);
;
}),
"[project]/web/node_modules/swr/dist/use-swr-emll9s78.mjs [app-ssr] (ecmascript) <export S as SWRConfig>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SWRConfig",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$use$2d$swr$2d$emll9s78$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["S"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$use$2d$swr$2d$emll9s78$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/swr/dist/use-swr-emll9s78.mjs [app-ssr] (ecmascript)");
}),
"[project]/web/node_modules/swr/dist/use-swr-emll9s78.mjs [app-ssr] (ecmascript) <export u as default>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$use$2d$swr$2d$emll9s78$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["u"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$use$2d$swr$2d$emll9s78$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/swr/dist/use-swr-emll9s78.mjs [app-ssr] (ecmascript)");
}),
"[project]/web/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @license React
 * use-sync-external-store-shim.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "production" !== ("TURBOPACK compile-time value", "development") && function() {
    function is(x, y) {
        return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
    }
    function useSyncExternalStore$2(subscribe, getSnapshot) {
        didWarnOld18Alpha || void 0 === React.startTransition || (didWarnOld18Alpha = !0, console.error("You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release."));
        var value = getSnapshot();
        if (!didWarnUncachedGetSnapshot) {
            var cachedValue = getSnapshot();
            objectIs(value, cachedValue) || (console.error("The result of getSnapshot should be cached to avoid an infinite loop"), didWarnUncachedGetSnapshot = !0);
        }
        cachedValue = useState({
            inst: {
                value: value,
                getSnapshot: getSnapshot
            }
        });
        var inst = cachedValue[0].inst, forceUpdate = cachedValue[1];
        useLayoutEffect(function() {
            inst.value = value;
            inst.getSnapshot = getSnapshot;
            checkIfSnapshotChanged(inst) && forceUpdate({
                inst: inst
            });
        }, [
            subscribe,
            value,
            getSnapshot
        ]);
        useEffect(function() {
            checkIfSnapshotChanged(inst) && forceUpdate({
                inst: inst
            });
            return subscribe(function() {
                checkIfSnapshotChanged(inst) && forceUpdate({
                    inst: inst
                });
            });
        }, [
            subscribe
        ]);
        useDebugValue(value);
        return value;
    }
    function checkIfSnapshotChanged(inst) {
        var latestGetSnapshot = inst.getSnapshot;
        inst = inst.value;
        try {
            var nextValue = latestGetSnapshot();
            return !objectIs(inst, nextValue);
        } catch (error) {
            return !0;
        }
    }
    function useSyncExternalStore$1(subscribe, getSnapshot) {
        return getSnapshot();
    }
    "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var React = __turbopack_context__.r("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)"), objectIs = "function" === typeof Object.is ? Object.is : is, useState = React.useState, useEffect = React.useEffect, useLayoutEffect = React.useLayoutEffect, useDebugValue = React.useDebugValue, didWarnOld18Alpha = !1, didWarnUncachedGetSnapshot = !1, shim = ("TURBOPACK compile-time truthy", 1) ? useSyncExternalStore$1 : "TURBOPACK unreachable";
    exports.useSyncExternalStore = void 0 !== React.useSyncExternalStore ? React.useSyncExternalStore : shim;
    "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
}();
}),
"[project]/web/node_modules/use-sync-external-store/shim/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/web/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js [app-ssr] (ecmascript)");
}
}),
];})()

//# sourceMappingURL=0aq__126oa_6-k3dg4._.js.map