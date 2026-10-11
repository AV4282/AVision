(()=>{"use strict";module.exports = [
"[project]/web/node_modules/jose/dist/webapi/jwe/compact/decrypt.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "compactDecrypt",
    ()=>compactDecrypt
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwe_decrypt$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/jwe_decrypt.js [middleware] (ecmascript)");
;
async function compactDecrypt(jwe, key, options) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwe_decrypt$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decryptCompact"])(jwe, (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwe_decrypt$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["prepareDecrypt"])(options), key);
}
;
}),
"[project]/web/node_modules/jose/dist/webapi/jwk/thumbprint.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calculateJwkThumbprint",
    ()=>calculateJwkThumbprint,
    "calculateJwkThumbprintUri",
    ()=>calculateJwkThumbprintUri
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/buffer_utils.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/util/base64url.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/util/errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/key.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/validate.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$key$2f$export$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/key/export.js [middleware] (ecmascript)");
;
;
;
;
;
;
const check = (value, description)=>{
    if (typeof value != "string" || !value) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWKInvalid"](`${description} missing or invalid`);
};
async function calculateJwkThumbprint(key, digestAlgorithm) {
    let jwk;
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isObject"])(key)) {
        if (jwk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["snapshotJwk"])(key), typeof jwk.kty != "string") throw new TypeError((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["invalidKeyInput"])(key, "CryptoKey", "KeyObject", "JSON Web Key"));
    } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isKeyLike"])(key)) jwk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["snapshotJwk"])(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$key$2f$export$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["exportJWK"])(key));
    else throw new TypeError((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["invalidKeyInput"])(key, "CryptoKey", "KeyObject", "JSON Web Key"));
    if (digestAlgorithm ??= "sha256", digestAlgorithm !== "sha256" && digestAlgorithm !== "sha384" && digestAlgorithm !== "sha512") throw new TypeError('digestAlgorithm must one of "sha256", "sha384", or "sha512"');
    let components;
    switch(jwk.kty){
        case "AKP":
            check(jwk.alg, '"alg" (Algorithm) Parameter'), check(jwk.pub, '"pub" (Public key) Parameter'), components = {
                alg: jwk.alg,
                kty: jwk.kty,
                pub: jwk.pub
            };
            break;
        case "EC":
            check(jwk.crv, '"crv" (Curve) Parameter'), check(jwk.x, '"x" (X Coordinate) Parameter'), check(jwk.y, '"y" (Y Coordinate) Parameter'), components = {
                crv: jwk.crv,
                kty: jwk.kty,
                x: jwk.x,
                y: jwk.y
            };
            break;
        case "OKP":
            check(jwk.crv, '"crv" (Subtype of Key Pair) Parameter'), check(jwk.x, '"x" (Public Key) Parameter'), components = {
                crv: jwk.crv,
                kty: jwk.kty,
                x: jwk.x
            };
            break;
        case "RSA":
            check(jwk.e, '"e" (Exponent) Parameter'), check(jwk.n, '"n" (Modulus) Parameter'), components = {
                e: jwk.e,
                kty: jwk.kty,
                n: jwk.n
            };
            break;
        case "oct":
            if (typeof jwk.k != "string") throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWKInvalid"]('"k" (Key Value) Parameter missing or invalid');
            components = {
                k: jwk.k,
                kty: jwk.kty
            };
            break;
        default:
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JOSENotSupported"]('"kty" (Key Type) Parameter missing or unsupported');
    }
    const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encode"])(JSON.stringify(components));
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encode"])(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["digest"])(digestAlgorithm, data));
}
async function calculateJwkThumbprintUri(key, digestAlgorithm) {
    digestAlgorithm ??= "sha256";
    const thumbprint = await calculateJwkThumbprint(key, digestAlgorithm);
    return `urn:ietf:params:oauth:jwk-thumbprint:sha-${digestAlgorithm.slice(-3)}:${thumbprint}`;
}
;
}),
"[project]/web/node_modules/jose/dist/webapi/jwks/local.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createLocalJWKSet",
    ()=>createLocalJWKSet
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/key.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jws_algorithms$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/jws_algorithms.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/util/errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/validate.js [middleware] (ecmascript)");
;
;
;
;
function isUsableJWK(jwk, entry, alg, kid) {
    const { kty, key_ops: keyOps, ext, kid: jwkKid, alg: jwkAlg, use, crv } = jwk;
    return (ext === void 0 || typeof ext == "boolean") && (keyOps === void 0 || Array.isArray(keyOps) && keyOps.every((operation, index)=>typeof operation == "string" && keyOps.indexOf(operation) === index) && keyOps.includes("verify")) && entry.kty.includes(kty) && (kid === void 0 || typeof kid == "string" && kid === jwkKid) && (jwkAlg === void 0 ? kty !== "AKP" : alg === jwkAlg) && (use === void 0 || use === "sig") && (!entry.crv || crv === entry.crv);
}
async function importWithAlgCache(cache, jwk, entry) {
    const cached = cache.get(jwk) || cache.set(jwk, {}).get(jwk), { alg } = entry;
    if (cached[alg] === void 0) {
        const pending = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jwkToKey"])(entry, jwk, !0).then((key)=>{
            if (key.type !== "public") throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWKSInvalid"]("JSON Web Key Set members must be public keys");
            return cached[alg] = key, key;
        }).catch((error)=>{
            throw cached[alg] === pending && delete cached[alg], error;
        });
        cached[alg] = pending;
    }
    return cached[alg];
}
function createLocalJWKSet(jwks) {
    let snapshot;
    try {
        snapshot = structuredClone(jwks);
    } catch  {}
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isJwkSet"])(snapshot)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWKSInvalid"]("JSON Web Key Set malformed");
    const metadata = snapshot.keys.map((jwk)=>{
        const normalized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["snapshotJwk"])(jwk);
        return Array.isArray(normalized.key_ops) && (normalized.key_ops = [
            ...normalized.key_ops
        ]), normalized;
    }), cached = /* @__PURE__ */ new WeakMap();
    return Object.defineProperty(async (protectedHeader, token)=>{
        const { alg, kid } = {
            ...protectedHeader,
            ...token?.header
        }, entry = typeof alg == "string" ? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jws_algorithms$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWS"][alg] : void 0;
        if (!entry || entry.secret) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JOSENotSupported"]('Unsupported "alg" value for a JSON Web Key Set');
        const candidates = snapshot.keys.filter((_, index)=>isUsableJWK(metadata[index], entry, alg, kid)), { 0: jwk, length } = candidates;
        if (!length) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWKSNoMatchingKey"]();
        if (length !== 1) {
            const error = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWKSMultipleMatchingKeys"]();
            throw error[Symbol.asyncIterator] = async function*() {
                for (const jwk2 of candidates)try {
                    yield await importWithAlgCache(cached, jwk2, entry);
                } catch  {}
            }, error;
        }
        return importWithAlgCache(cached, jwk, entry);
    }, "jwks", {
        value: ()=>structuredClone(snapshot)
    });
}
;
}),
"[project]/web/node_modules/jose/dist/webapi/jwks/remote.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createRemoteJWKSet",
    ()=>createRemoteJWKSet,
    "customFetch",
    ()=>customFetch,
    "jwksCache",
    ()=>jwksCache
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/util/errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwks$2f$local$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/jwks/local.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/validate.js [middleware] (ecmascript)");
;
;
;
function isCloudflareWorkers() {
    return typeof WebSocketPair < "u" || typeof navigator < "u" && navigator.userAgent === "Cloudflare-Workers" || typeof EdgeRuntime < "u" && EdgeRuntime === "vercel";
}
let USER_AGENT;
(typeof navigator > "u" || !navigator.userAgent?.startsWith?.("Mozilla/5.0 ")) && (USER_AGENT = "jose/v6.2.12");
const customFetch = /* @__PURE__ */ Symbol();
async function fetchJwks(url, headers, signal, fetchImpl = fetch) {
    const response = await fetchImpl(url, {
        method: "GET",
        signal,
        redirect: "manual",
        headers
    }).catch((err)=>{
        throw err.name === "TimeoutError" ? new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWKSTimeout"]() : err;
    });
    if (response.status !== 200) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JOSEError"]("Expected 200 OK from the JSON Web Key Set HTTP response");
    try {
        return await response.json();
    } catch  {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JOSEError"]("Failed to parse the JSON Web Key Set HTTP response as JSON");
    }
}
const jwksCache = /* @__PURE__ */ Symbol();
function isFreshFor(timestamp, duration) {
    return Number.isFinite(timestamp) && Date.now() < timestamp + duration;
}
function validateDuration(value, fallback, option) {
    if (Number.isNaN(value)) throw new TypeError(`"${option}" option must not be NaN`);
    return typeof value == "number" ? value : fallback;
}
function createRemoteJWKSet(url, options) {
    if (!(url instanceof URL)) throw new TypeError("url must be an instance of URL");
    const href = new URL(url.href).href, opts = options ?? {}, timeoutOption = opts.timeoutDuration;
    if (typeof timeoutOption == "number" && (!Number.isInteger(timeoutOption) || timeoutOption < 0)) throw new TypeError('"timeoutDuration" option must be a non-negative integer');
    const timeoutDuration = typeof timeoutOption == "number" ? timeoutOption : 5e3, cooldownDuration = validateDuration(opts.cooldownDuration, 3e4, "cooldownDuration"), cacheMaxAge = validateDuration(opts.cacheMaxAge, 6e5, "cacheMaxAge"), headers = new Headers(opts.headers);
    USER_AGENT && !headers.has("User-Agent") && headers.set("User-Agent", USER_AGENT), headers.has("accept") || headers.set("accept", "application/json, application/jwk-set+json");
    const fetchImpl = opts[customFetch], cache = opts[jwksCache];
    let jwksTimestamp, pendingFetch, reloadSequence = 0, appliedSequence = 0, local;
    if (cache && typeof cache == "object") {
        const { uat, jwks } = cache;
        isFreshFor(uat, cacheMaxAge) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isJwkSet"])(jwks) && (jwksTimestamp = uat, local = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwks$2f$local$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["createLocalJWKSet"])(jwks));
    }
    const reload = async ()=>{
        if (pendingFetch && isCloudflareWorkers() && (pendingFetch = void 0), !pendingFetch) {
            const sequence = ++reloadSequence, current = pendingFetch = fetchJwks(href, headers, AbortSignal.timeout(timeoutDuration), fetchImpl).then((json)=>{
                const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwks$2f$local$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["createLocalJWKSet"])(json);
                if (sequence <= appliedSequence) return;
                local = next;
                const updatedAt = Date.now();
                cache && (cache.uat = updatedAt, cache.jwks = json), jwksTimestamp = updatedAt, appliedSequence = sequence;
            }).finally(()=>{
                pendingFetch === current && (pendingFetch = void 0);
            });
        }
        await pendingFetch;
    };
    return Object.defineProperties(async (protectedHeader, token)=>{
        (!local || !isFreshFor(jwksTimestamp, cacheMaxAge)) && await reload();
        try {
            return await local(protectedHeader, token);
        } catch (err) {
            if (err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWKSNoMatchingKey"] && !isFreshFor(jwksTimestamp, cooldownDuration)) return await reload(), local(protectedHeader, token);
            throw err;
        }
    }, {
        coolingDown: {
            get: ()=>isFreshFor(jwksTimestamp, cooldownDuration),
            enumerable: !0
        },
        fresh: {
            get: ()=>isFreshFor(jwksTimestamp, cacheMaxAge),
            enumerable: !0
        },
        reload: {
            value: reload,
            enumerable: !0
        },
        reloading: {
            get: ()=>!!pendingFetch,
            enumerable: !0
        },
        jwks: {
            value: ()=>local?.jwks(),
            enumerable: !0
        }
    });
}
;
}),
"[project]/web/node_modules/jose/dist/webapi/jws/flattened/sign.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FlattenedSign",
    ()=>FlattenedSign
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jws_sign$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/jws_sign.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/validate.js [middleware] (ecmascript)");
;
;
class FlattenedSign {
    #input;
    constructor(payload){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["assertUint8Array"])(payload, "payload"), this.#input = [
            payload
        ];
    }
    setProtectedHeader(protectedHeader) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["assertNotSet"])(this.#input[1], "setProtectedHeader"), this.#input[1] = protectedHeader, this;
    }
    setUnprotectedHeader(unprotectedHeader) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["assertNotSet"])(this.#input[2], "setUnprotectedHeader"), this.#input[2] = unprotectedHeader, this;
    }
    async sign(key, options) {
        const input = [
            ...this.#input
        ];
        input[3] = options?.crit;
        const [jws] = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jws_sign$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["createSignature"])(input, key);
        return jws;
    }
}
;
}),
"[project]/web/node_modules/jose/dist/webapi/jws/flattened/verify.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "flattenedVerify",
    ()=>flattenedVerify
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/util/errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/validate.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jws_verify$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/jws_verify.js [middleware] (ecmascript)");
;
;
;
async function flattenedVerify(jws, key, options) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isObject"])(jws)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWSInvalid"]("Flattened JWS must be an object");
    const snapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jws_verify$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["snapshotJws"])(jws), [result] = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jws_verify$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["verifySignature"])(snapshot, (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jws_verify$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["prepareVerify"])(options), key, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jws_verify$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encodeJsonUnencodedPayload"]);
    return result;
}
;
}),
"[project]/web/node_modules/jose/dist/webapi/jwt/decrypt.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "jwtDecrypt",
    ()=>jwtDecrypt
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwe_decrypt$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/jwe_decrypt.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwt_claims_set$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/jwt_claims_set.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/util/errors.js [middleware] (ecmascript)");
;
;
;
async function jwtDecrypt(jwt, key, options) {
    const { plaintext, ...result } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwe_decrypt$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decryptCompact"])(jwt, (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwe_decrypt$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["prepareDecrypt"])(options), key), { protectedHeader } = result, payload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwt_claims_set$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateClaimsSet"])(protectedHeader, plaintext, options);
    for (const claim of [
        "iss",
        "sub",
        "aud"
    ])if (protectedHeader[claim] !== void 0 && (claim === "aud" ? JSON.stringify(protectedHeader.aud) !== JSON.stringify(payload.aud) : protectedHeader[claim] !== payload[claim])) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWTClaimValidationFailed"](`replicated "${claim}" claim header parameter mismatch`, payload, claim, "mismatch");
    return {
        payload,
        ...result
    };
}
;
}),
"[project]/web/node_modules/jose/dist/webapi/jwt/encrypt.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EncryptJWT",
    ()=>EncryptJWT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwe_encrypt$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/jwe_encrypt.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwt_claims_set$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/jwt_claims_set.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/validate.js [middleware] (ecmascript)");
;
;
;
const EncryptJWT_base = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwt_claims_set$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWTClaimsBuilder"];
class EncryptJWT extends EncryptJWT_base {
    #input = [
        void 0
    ];
    #replicateIssuerAsHeader;
    #replicateSubjectAsHeader;
    #replicateAudienceAsHeader;
    setProtectedHeader(protectedHeader) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["assertNotSet"])(this.#input[1], "setProtectedHeader"), this.#input[1] = protectedHeader, this;
    }
    setKeyManagementParameters(parameters) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["assertNotSet"])(this.#input[7], "setKeyManagementParameters"), this.#input[7] = parameters, this;
    }
    setContentEncryptionKey(cek) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["assertNotSet"])(this.#input[5], "setContentEncryptionKey"), this.#input[5] = cek, this;
    }
    setInitializationVector(iv) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["assertNotSet"])(this.#input[6], "setInitializationVector"), this.#input[6] = iv, this;
    }
    replicateIssuerAsHeader() {
        return this.#replicateIssuerAsHeader = !0, this;
    }
    replicateSubjectAsHeader() {
        return this.#replicateSubjectAsHeader = !0, this;
    }
    replicateAudienceAsHeader() {
        return this.#replicateAudienceAsHeader = !0, this;
    }
    async encrypt(key, options) {
        const plaintext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwt_claims_set$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jwtData"])(this);
        this.#input[1] && (this.#replicateIssuerAsHeader || this.#replicateSubjectAsHeader || this.#replicateAudienceAsHeader) && (this.#input[1] = {
            ...this.#input[1],
            iss: this.#replicateIssuerAsHeader ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwt_claims_set$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jwtClaim"])(this, "iss") : void 0,
            sub: this.#replicateSubjectAsHeader ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwt_claims_set$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jwtClaim"])(this, "sub") : void 0,
            aud: this.#replicateAudienceAsHeader ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwt_claims_set$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jwtClaim"])(this, "aud") : void 0
        });
        const input = [
            ...this.#input
        ];
        return input[0] = plaintext, (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwe_encrypt$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["compactJWE"])(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwe_encrypt$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["createJWE"])(input, key, options));
    }
}
;
}),
"[project]/web/node_modules/jose/dist/webapi/jwt/verify.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "jwtVerify",
    ()=>jwtVerify
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jws_verify$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/jws_verify.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwt_claims_set$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/jwt_claims_set.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/util/errors.js [middleware] (ecmascript)");
;
;
;
async function jwtVerify(jwt, key, options) {
    const [verified, b64] = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jws_verify$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["verifyCompact"])(jwt, (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jws_verify$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["prepareVerify"])(options), key);
    if (!b64) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWTInvalid"]("JWTs MUST NOT use unencoded payload");
    const payload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwt_claims_set$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateClaimsSet"])(verified.protectedHeader, verified.payload, options);
    return {
        ...verified,
        payload
    };
}
;
}),
"[project]/web/node_modules/jose/dist/webapi/key/export.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "exportJWK",
    ()=>exportJWK,
    "exportPKCS8",
    ()=>exportPKCS8,
    "exportSPKI",
    ()=>exportSPKI
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$asn1$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/asn1.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/key.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/util/base64url.js [middleware] (ecmascript)");
;
;
;
function exportSPKI(key) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$asn1$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["toSPKI"])(key);
}
function exportPKCS8(key) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$asn1$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["toPKCS8"])(key);
}
async function exportJWK(key) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isKeyObject"])(key)) if (key.type === "secret") key = key.export();
    else return key.export({
        format: "jwk"
    });
    if (key instanceof Uint8Array) return {
        kty: "oct",
        k: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encode"])(key)
    };
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isCryptoKey"])(key)) throw new TypeError((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["invalidKeyInput"])(key, "CryptoKey", "KeyObject", "Uint8Array"));
    if (!key.extractable) throw new TypeError("non-extractable CryptoKey cannot be exported as a JWK");
    const jwk = await crypto.subtle.exportKey("jwk", key);
    delete jwk.ext, delete jwk.key_ops, delete jwk.use, jwk.kty !== "AKP" && delete jwk.alg;
    for (const parameter of Object.keys(jwk))jwk[parameter] === void 0 && delete jwk[parameter];
    return jwk;
}
;
}),
"[project]/web/node_modules/jose/dist/webapi/key/import.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "importJWK",
    ()=>importJWK,
    "importPKCS8",
    ()=>importPKCS8,
    "importSPKI",
    ()=>importSPKI,
    "importX509",
    ()=>importX509
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/util/base64url.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$asn1$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/asn1.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/key.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key_algorithm$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/key_algorithm.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/util/errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/validate.js [middleware] (ecmascript)");
;
;
;
;
;
;
async function importSPKI(spki, alg, options) {
    if (typeof spki != "string" || spki.indexOf("-----BEGIN PUBLIC KEY-----") !== 0) throw new TypeError('"spki" must be SPKI formatted string');
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$asn1$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["fromSPKI"])(spki, alg, options);
}
async function importX509(x509, alg, options) {
    if (typeof x509 != "string" || x509.indexOf("-----BEGIN CERTIFICATE-----") !== 0) throw new TypeError('"x509" must be X.509 formatted string');
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$asn1$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["fromX509"])(x509, alg, options);
}
async function importPKCS8(pkcs8, alg, options) {
    if (typeof pkcs8 != "string" || pkcs8.indexOf("-----BEGIN PRIVATE KEY-----") !== 0) throw new TypeError('"pkcs8" must be PKCS#8 formatted string');
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$asn1$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["fromPKCS8"])(pkcs8, alg, options);
}
async function importJWK(jwk, alg, options) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isObject"])(jwk)) throw new TypeError("JWK must be an object");
    const normalized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["normalizeJwk"])(jwk), extractable = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateExtractableOption"])(options?.extractable), { alg: jwkAlg } = normalized;
    if (alg ??= jwkAlg, normalized.kty !== "oct" && !alg) throw new TypeError('"alg" argument is required when "jwk.alg" is not present');
    switch(normalized.kty){
        case "oct":
            if (typeof normalized.k != "string") throw new TypeError('missing "k" (Key Value) Parameter value');
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decode"])(normalized.k);
        case "AKP":
            {
                if (typeof jwkAlg != "string" || !jwkAlg) throw new TypeError('missing "alg" (Algorithm) Parameter value');
                if (alg !== jwkAlg) throw new TypeError("JWK alg and alg option value mismatch");
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jwkToKey"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key_algorithm$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["keyAlgorithm"])(alg), normalized, extractable);
            }
        case "RSA":
        case "EC":
        case "OKP":
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jwkToKey"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key_algorithm$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["keyAlgorithm"])(alg), normalized, extractable);
        default:
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JOSENotSupported"]('Unsupported "kty" (Key Type) Parameter value');
    }
}
;
}),
"[project]/web/node_modules/jose/dist/webapi/lib/asn1.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fromPKCS8",
    ()=>fromPKCS8,
    "fromSPKI",
    ()=>fromSPKI,
    "fromX509",
    ()=>fromX509,
    "toPKCS8",
    ()=>toPKCS8,
    "toSPKI",
    ()=>toSPKI
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/key.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/buffer_utils.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/util/errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key_algorithm$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/key_algorithm.js [middleware] (ecmascript)");
;
;
;
;
const formatPEM = (b64, descriptor)=>{
    const newlined = (b64.match(/.{1,64}/g) || []).join(`
`);
    return `-----BEGIN ${descriptor}-----
${newlined}
-----END ${descriptor}-----`;
}, genericExport = async (keyType, keyFormat, key)=>{
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isKeyObject"])(key)) {
        if (key.type !== keyType) throw new TypeError(`key is not a ${keyType} key`);
        return key.export({
            format: "pem",
            type: keyFormat
        });
    }
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isCryptoKey"])(key)) throw new TypeError((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["invalidKeyInput"])(key, "CryptoKey", "KeyObject"));
    if (!key.extractable) throw new TypeError("CryptoKey is not extractable");
    if (key.type !== keyType) throw new TypeError(`key is not a ${keyType} key`);
    return formatPEM((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encodeBase64"])(new Uint8Array(await crypto.subtle.exportKey(keyFormat, key))), `${keyType.toUpperCase()} KEY`);
}, toSPKI = (key)=>genericExport("public", "spki", key), toPKCS8 = (key)=>genericExport("private", "pkcs8", key), bytesEqual = (a, b)=>{
    if (a.byteLength !== b.length) return !1;
    for(let i = 0; i < a.byteLength; i++)if (a[i] !== b[i]) return !1;
    return !0;
}, createASN1State = (data)=>({
        data,
        pos: 0
    }), readByte = (state)=>{
    const byte = state.data[state.pos++];
    if (byte === void 0) throw new Error("Unexpected end of ASN.1 input");
    return byte;
}, parseLength = (state)=>{
    const first = readByte(state);
    if (first & 128) {
        const lengthOfLen = first & 127;
        let length = 0;
        for(let i = 0; i < lengthOfLen; i++)length = length << 8 | readByte(state);
        return length;
    }
    return first;
}, skipElement = (state, count = 1)=>{
    for(; count-- > 0;){
        state.pos++;
        const length = parseLength(state);
        state.pos += length;
    }
}, expectTag = (state, expectedTag, errorMessage)=>{
    if (readByte(state) !== expectedTag) throw new Error(errorMessage);
}, getSubarray = (state, length)=>{
    if (length < 0 || state.pos + length > state.data.length) throw new Error("Unexpected end of ASN.1 input");
    const result = state.data.subarray(state.pos, state.pos + length);
    return state.pos += length, result;
}, parseAlgorithmOID = (state)=>{
    expectTag(state, 6, "Expected algorithm OID");
    const oidLen = parseLength(state);
    return getSubarray(state, oidLen);
};
function parseKeyHeader(state, keyFormat) {
    if (expectTag(state, 48, `Invalid ${keyFormat === "spki" ? "SPKI" : "PKCS#8"} structure`), parseLength(state), keyFormat === "pkcs8") {
        expectTag(state, 2, "Expected version field");
        const length = parseLength(state);
        state.pos += length;
    }
    expectTag(state, 48, "Expected algorithm identifier"), parseLength(state);
}
const parseECAlgorithmIdentifier = (state)=>{
    const algOid = parseAlgorithmOID(state);
    if (bytesEqual(algOid, [
        43,
        101,
        110
    ])) return "X25519";
    if (!bytesEqual(algOid, [
        42,
        134,
        72,
        206,
        61,
        2,
        1
    ])) throw new Error("Unsupported key algorithm");
    expectTag(state, 6, "Expected curve OID");
    const curveOidLen = parseLength(state), curveOid = getSubarray(state, curveOidLen);
    if (bytesEqual(curveOid, [
        42,
        134,
        72,
        206,
        61,
        3,
        1,
        7
    ])) return "P-256";
    if (bytesEqual(curveOid, [
        43,
        129,
        4,
        0,
        34
    ])) return "P-384";
    if (bytesEqual(curveOid, [
        43,
        129,
        4,
        0,
        35
    ])) return "P-521";
    throw new Error("Unsupported named curve");
}, genericImport = async (keyFormat, keyData, alg, options)=>{
    const extractable = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateExtractableOption"])(options?.extractable), entry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key_algorithm$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["keyAlgorithm"])(alg, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key_algorithm$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["algArgument"]);
    entry.secret && (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key_algorithm$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["unsupportedAlg"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key_algorithm$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["algArgument"]);
    const isPublic = keyFormat === "spki";
    let algorithm;
    if (entry.resolve) try {
        const state = createASN1State(keyData);
        parseKeyHeader(state, keyFormat), algorithm = entry.resolve({
            crv: parseECAlgorithmIdentifier(state)
        });
    } catch  {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JOSENotSupported"]("Invalid or unsupported key format");
    }
    else algorithm = entry.subtle;
    return crypto.subtle.importKey(keyFormat, keyData, algorithm, extractable ?? isPublic, entry.usages[isPublic ? 0 : 1]);
}, processPEMData = (pem, pattern)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decodeBase64"])(pem.replace(pattern, "")), fromPKCS8 = (pem, alg, options)=>{
    const keyData = processPEMData(pem, /(?:-----(?:BEGIN|END) PRIVATE KEY-----|\s)/g);
    return genericImport("pkcs8", keyData, alg, options);
}, fromSPKI = (pem, alg, options)=>{
    const keyData = processPEMData(pem, /(?:-----(?:BEGIN|END) PUBLIC KEY-----|\s)/g);
    return genericImport("spki", keyData, alg, options);
};
function spkiFromX509(buf) {
    const state = createASN1State(buf);
    expectTag(state, 48, "Invalid certificate structure");
    const certificateLength = parseLength(state);
    if (certificateLength < 0 || state.pos + certificateLength > state.data.length) throw new Error("Unexpected end of ASN.1 input");
    expectTag(state, 48, "Invalid tbsCertificate structure"), parseLength(state), buf[state.pos] === 160 ? skipElement(state, 6) : skipElement(state, 5);
    const spkiStart = state.pos;
    expectTag(state, 48, "Invalid SPKI structure");
    const spkiContentLen = parseLength(state);
    return buf.subarray(spkiStart, spkiStart + spkiContentLen + (state.pos - spkiStart));
}
const fromX509 = (pem, alg, options)=>{
    let spki;
    try {
        const certificate = processPEMData(pem, /(?:-----(?:BEGIN|END) CERTIFICATE-----|\s)/g);
        spki = spkiFromX509(certificate);
    } catch (cause) {
        throw new TypeError("Failed to parse the X.509 certificate", {
            cause
        });
    }
    return genericImport("spki", spki, alg, options);
};
;
}),
"[project]/web/node_modules/jose/dist/webapi/lib/buffer_utils.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "concat",
    ()=>concat,
    "decodeBase64",
    ()=>decodeBase64,
    "decoder",
    ()=>decoder,
    "digest",
    ()=>digest,
    "encode",
    ()=>encode,
    "encodeBase64",
    ()=>encodeBase64,
    "encoder",
    ()=>encoder,
    "strictDecoder",
    ()=>strictDecoder,
    "uint32be",
    ()=>uint32be,
    "uint64be",
    ()=>uint64be
]);
const encoder = new TextEncoder(), decoder = new TextDecoder(), strictDecoder = new TextDecoder("utf-8", {
    fatal: !0
}), MAX_INT32 = 2 ** 32;
function concat(...buffers) {
    const size = buffers.reduce((acc, { length })=>acc + length, 0), buf = new Uint8Array(size);
    let i = 0;
    for (const buffer of buffers)buf.set(buffer, i), i += buffer.length;
    return buf;
}
function writeUInt32BE(buf, value, offset) {
    if (value < 0 || value >= MAX_INT32) throw new RangeError(`value must be >= 0 and <= ${MAX_INT32 - 1}. Received ${value}`);
    buf.set([
        value >>> 24,
        value >>> 16,
        value >>> 8,
        value & 255
    ], offset);
}
function uint64be(value) {
    const high = Math.floor(value / MAX_INT32), low = value % MAX_INT32, buf = new Uint8Array(8);
    return writeUInt32BE(buf, high, 0), writeUInt32BE(buf, low, 4), buf;
}
function uint32be(value) {
    const buf = new Uint8Array(4);
    return writeUInt32BE(buf, value), buf;
}
const NON_ASCII = /[^\x00-\x7f]/;
function encode(string) {
    if (typeof string == "string" && string.length >= 128) {
        if (NON_ASCII.test(string)) throw new TypeError("non-ASCII string encountered in encode()");
        return encoder.encode(string);
    }
    const bytes = new Uint8Array(string.length);
    for(let i = 0; i < string.length; i++){
        const code = string.charCodeAt(i);
        if (code > 127) throw new TypeError("non-ASCII string encountered in encode()");
        bytes[i] = code;
    }
    return bytes;
}
function encodeBase64(input, url = !1) {
    if (Uint8Array.prototype.toBase64) return input.toBase64({
        alphabet: url ? "base64url" : "base64",
        omitPadding: url
    });
    const CHUNK_SIZE = 32768, arr = [];
    for(let i = 0; i < input.length; i += CHUNK_SIZE)arr.push(String.fromCharCode.apply(null, input.subarray(i, i + CHUNK_SIZE)));
    const encoded = btoa(arr.join(""));
    return url ? encoded.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_") : encoded;
}
function decodeBase64(encoded, url = !1) {
    if (Uint8Array.fromBase64) return Uint8Array.fromBase64(encoded, {
        alphabet: url ? "base64url" : "base64"
    });
    if (url) {
        if (encoded.includes("+") || encoded.includes("/")) throw new TypeError("Invalid base64url");
        encoded = encoded.replace(/-/g, "+").replace(/_/g, "/");
    }
    const binary = atob(encoded), bytes = new Uint8Array(binary.length);
    for(let i = 0; i < binary.length; i++)bytes[i] = binary.charCodeAt(i);
    return bytes;
}
async function digest(algorithm, data) {
    const subtleDigest = `SHA-${algorithm.slice(-3)}`;
    return new Uint8Array(await crypto.subtle.digest(subtleDigest, data));
}
;
}),
"[project]/web/node_modules/jose/dist/webapi/lib/content_encryption.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkCekLength",
    ()=>checkCekLength,
    "checkIvLength",
    ()=>checkIvLength,
    "decrypt",
    ()=>decrypt,
    "encrypt",
    ()=>encrypt,
    "generateCek",
    ()=>generateCek,
    "generateIv",
    ()=>generateIv
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/buffer_utils.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/key.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/util/errors.js [middleware] (ecmascript)");
;
;
;
const generateCek = (enc)=>crypto.getRandomValues(new Uint8Array(enc.cekBits >> 3));
function checkCekLength(cek, expected) {
    const actual = cek.byteLength << 3;
    if (actual !== expected) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"](`Invalid Content Encryption Key length. Expected ${expected} bits, got ${actual} bits`);
}
const generateIv = (enc)=>crypto.getRandomValues(new Uint8Array(enc.ivBits >> 3));
function checkIvLength(enc, iv) {
    if (iv.length << 3 !== enc.ivBits) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]("Invalid Initialization Vector length");
}
async function cbcKeySetup(enc, cek, usage) {
    if (!(cek instanceof Uint8Array)) throw new TypeError((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["invalidKeyInput"])(cek, "Uint8Array"));
    const keySize = enc.cekBits >> 1, encKey = await crypto.subtle.importKey("raw", cek.subarray(keySize >> 3), "AES-CBC", !1, [
        usage
    ]), macKey = await crypto.subtle.importKey("raw", cek.subarray(0, keySize >> 3), {
        hash: `SHA-${keySize << 1}`,
        name: "HMAC"
    }, !1, [
        "sign"
    ]);
    return [
        encKey,
        macKey,
        keySize
    ];
}
async function cbcHmacTag(macKey, macData, keySize) {
    return new Uint8Array((await crypto.subtle.sign("HMAC", macKey, macData)).slice(0, keySize >> 3));
}
async function cbcEncrypt(enc, plaintext, cek, iv, aad) {
    const [encKey, macKey, keySize] = await cbcKeySetup(enc, cek, "encrypt"), ciphertext = new Uint8Array(await crypto.subtle.encrypt({
        iv,
        name: "AES-CBC"
    }, encKey, plaintext)), macData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["concat"])(aad, iv, ciphertext, (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["uint64be"])(aad.length * 8)), tag = await cbcHmacTag(macKey, macData, keySize);
    return {
        ciphertext,
        tag,
        iv
    };
}
async function timingSafeEqual(a, b) {
    const algorithm = {
        name: "HMAC",
        hash: "SHA-256"
    }, key = await crypto.subtle.generateKey(algorithm, !1, [
        "sign",
        "verify"
    ]), aHmac = await crypto.subtle.sign(algorithm, key, a);
    return crypto.subtle.verify(algorithm, key, aHmac, b);
}
async function cbcDecrypt(enc, cek, ciphertext, iv, tag, aad) {
    const [encKey, macKey, keySize] = await cbcKeySetup(enc, cek, "decrypt"), macData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["concat"])(aad, iv, ciphertext, (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["uint64be"])(aad.length * 8)), expectedTag = await cbcHmacTag(macKey, macData, keySize);
    try {
        if (await timingSafeEqual(tag, expectedTag)) return new Uint8Array(await crypto.subtle.decrypt({
            iv,
            name: "AES-CBC"
        }, encKey, ciphertext));
    } catch  {}
    throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEDecryptionFailed"]();
}
async function encrypt(enc, plaintext, cek, iv, aad) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isCryptoKey"])(cek) && !(cek instanceof Uint8Array)) throw new TypeError((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["invalidKeyInput"])(cek, "CryptoKey", "KeyObject", "Uint8Array", "JSON Web Key"));
    if (iv ? checkIvLength(enc, iv) : iv = generateIv(enc), cek instanceof Uint8Array && checkCekLength(cek, enc.cekBits), enc.cbc) return cbcEncrypt(enc, plaintext, cek, iv, aad);
    const encKey = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["rawKey"])(cek, enc.subtle, "encrypt"), encrypted = new Uint8Array(await crypto.subtle.encrypt({
        additionalData: aad,
        iv,
        name: "AES-GCM",
        tagLength: 128
    }, encKey, plaintext));
    return {
        ciphertext: encrypted.subarray(0, -16),
        tag: encrypted.subarray(-16),
        iv
    };
}
async function decrypt(enc, cek, ciphertext, iv, tag, aad) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isCryptoKey"])(cek) && !(cek instanceof Uint8Array)) throw new TypeError((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["invalidKeyInput"])(cek, "CryptoKey", "KeyObject", "Uint8Array", "JSON Web Key"));
    if (!iv) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]("JWE Initialization Vector missing");
    if (!tag) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]("JWE Authentication Tag missing");
    if (!enc.cbc && tag.length !== 16) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]("Invalid Authentication Tag length");
    if (checkIvLength(enc, iv), cek instanceof Uint8Array && checkCekLength(cek, enc.cekBits), enc.cbc) return cbcDecrypt(enc, cek, ciphertext, iv, tag, aad);
    const encKey = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["rawKey"])(cek, enc.subtle, "decrypt");
    try {
        return new Uint8Array(await crypto.subtle.decrypt({
            additionalData: aad,
            iv,
            name: "AES-GCM",
            tagLength: 128
        }, encKey, (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["concat"])(ciphertext, tag)));
    } catch  {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEDecryptionFailed"]();
    }
}
;
}),
"[project]/web/node_modules/jose/dist/webapi/lib/deflate.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "compress",
    ()=>compress,
    "decompress",
    ()=>decompress,
    "validateZip",
    ()=>validateZip
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/util/errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/buffer_utils.js [middleware] (ecmascript)");
;
;
function validateZip(joseHeader, protectedHeader) {
    if (joseHeader.zip !== void 0 && joseHeader.zip !== "DEF") throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JOSENotSupported"]('Unsupported JWE "zip" (Compression Algorithm) Header Parameter value.');
    if (joseHeader.zip !== void 0 && !protectedHeader?.zip) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]('JWE "zip" (Compression Algorithm) Header Parameter MUST be in a protected header.');
}
function supported(name) {
    if (typeof globalThis[name] > "u") throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JOSENotSupported"](`JWE "zip" (Compression Algorithm) Header Parameter requires the ${name} API.`);
}
async function transform(stream, input, maxLength = 1 / 0) {
    const writer = stream.writable.getWriter();
    writer.write(input).catch(()=>{}), writer.close().catch(()=>{});
    const chunks = [];
    let length = 0;
    const reader = stream.readable.getReader();
    for(;;){
        const { value, done } = await reader.read();
        if (done) break;
        if (chunks.push(value), length += value.byteLength, maxLength !== 1 / 0 && length > maxLength) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]("Decompressed plaintext exceeded the configured limit");
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["concat"])(...chunks);
}
async function compress(input) {
    return supported("CompressionStream"), transform(new CompressionStream("deflate-raw"), input);
}
async function decompress(input, maxLength) {
    return supported("DecompressionStream"), transform(new DecompressionStream("deflate-raw"), input, maxLength);
}
;
}),
"[project]/web/node_modules/jose/dist/webapi/lib/jwe_algorithms.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "JWE",
    ()=>JWE,
    "isJWECEKTransport",
    ()=>isJWECEKTransport,
    "jweAlgorithm",
    ()=>jweAlgorithm,
    "jweEncryption",
    ()=>jweEncryption
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/util/errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key_descriptor$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/key_descriptor.js [middleware] (ecmascript)");
;
;
const wrap = [
    [
        "encrypt",
        "wrapKey"
    ],
    [
        "decrypt",
        "unwrapKey"
    ]
], derive = [
    [],
    [
        "deriveBits"
    ]
], none = [
    [],
    []
];
function rsaes(bits) {
    return {
        kty: [
            "RSA"
        ],
        mode: "key-encryption",
        subtle: {
            name: "RSA-OAEP",
            hash: `SHA-${bits}`
        },
        usages: wrap,
        ops: [
            "wrapKey",
            "unwrapKey"
        ]
    };
}
function ecdh(mode) {
    return {
        kty: [
            "EC",
            "OKP"
        ],
        mode,
        subtle: {
            name: "ECDH"
        },
        resolve: ({ kty, crv, asymmetricKeyType })=>{
            if (crv === "X25519" || asymmetricKeyType === "x25519") return {
                name: "X25519"
            };
            if (kty === "OKP") throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JOSENotSupported"]('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
            return {
                name: "ECDH",
                namedCurve: crv
            };
        },
        usages: derive,
        ops: [
            void 0,
            "deriveBits"
        ]
    };
}
function aeskw(bits, gcm = !1) {
    return {
        kty: [
            "oct"
        ],
        mode: "key-wrapping",
        secret: !0,
        subtle: {
            name: gcm ? "AES-GCM" : "AES-KW",
            length: bits
        },
        usages: none,
        ops: gcm ? [
            "encrypt",
            "decrypt"
        ] : [
            "wrapKey",
            "unwrapKey"
        ]
    };
}
function pbes2() {
    return {
        kty: [
            "oct"
        ],
        mode: "key-wrapping",
        secret: !0,
        subtle: {
            name: "PBKDF2"
        },
        usages: none,
        ops: [
            "deriveBits",
            "deriveBits"
        ]
    };
}
const JWE = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key_descriptor$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["table"])({
    dir: {
        kty: [
            "oct"
        ],
        mode: "direct-encryption",
        secret: !0,
        subtle: {
            name: "AES-GCM"
        },
        usages: none,
        ops: [
            "encrypt",
            "decrypt"
        ]
    },
    "RSA-OAEP": rsaes(1),
    "RSA-OAEP-256": rsaes(256),
    "RSA-OAEP-384": rsaes(384),
    "RSA-OAEP-512": rsaes(512),
    "ECDH-ES": ecdh("direct-key-agreement"),
    "ECDH-ES+A128KW": ecdh("key-agreement-with-key-wrapping"),
    "ECDH-ES+A192KW": ecdh("key-agreement-with-key-wrapping"),
    "ECDH-ES+A256KW": ecdh("key-agreement-with-key-wrapping"),
    A128KW: aeskw(128),
    A192KW: aeskw(192),
    A256KW: aeskw(256),
    A128GCMKW: aeskw(128, !0),
    A192GCMKW: aeskw(192, !0),
    A256GCMKW: aeskw(256, !0),
    "PBES2-HS256+A128KW": pbes2(),
    "PBES2-HS384+A192KW": pbes2(),
    "PBES2-HS512+A256KW": pbes2()
}), contentOps = [
    "encrypt",
    "decrypt"
];
function contentEncryption(bits, cbc = !1) {
    return {
        kty: [
            "oct"
        ],
        secret: !0,
        subtle: {
            name: cbc ? "AES-CBC" : "AES-GCM",
            length: bits
        },
        usages: none,
        ops: contentOps,
        cekBits: bits,
        ivBits: cbc ? 128 : 96,
        cbc
    };
}
const ENC = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key_descriptor$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["table"])({
    A128GCM: contentEncryption(128),
    A192GCM: contentEncryption(192),
    A256GCM: contentEncryption(256),
    "A128CBC-HS256": contentEncryption(256, !0),
    "A192CBC-HS384": contentEncryption(384, !0),
    "A256CBC-HS512": contentEncryption(512, !0)
});
function unsupported(parameter, name) {
    throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JOSENotSupported"](`Invalid or unsupported "${parameter}" (JWE ${name}) header value`);
}
function jweAlgorithm(alg) {
    return (typeof alg == "string" ? JWE[alg] : void 0) ?? unsupported("alg", "Algorithm");
}
function isJWECEKTransport(algorithm) {
    return algorithm.mode === "key-wrapping" || algorithm.mode === "key-encryption" || algorithm.mode === "key-agreement-with-key-wrapping";
}
function jweEncryption(enc) {
    return (typeof enc == "string" ? ENC[enc] : void 0) ?? unsupported("enc", "Encryption Algorithm");
}
;
}),
"[project]/web/node_modules/jose/dist/webapi/lib/jwe_decrypt.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkRecipient",
    ()=>checkRecipient,
    "decryptCompact",
    ()=>decryptCompact,
    "decryptJWE",
    ()=>decryptJWE,
    "prepareDecrypt",
    ()=>prepareDecrypt,
    "shareJWE",
    ()=>shareJWE,
    "snapshotRecipientJWE",
    ()=>snapshotRecipientJWE,
    "snapshotSharedJWE",
    ()=>snapshotSharedJWE
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$content_encryption$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/content_encryption.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/validate.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/util/errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key_management$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/key_management.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/buffer_utils.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/key.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwe_algorithms$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/jwe_algorithms.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$deflate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/deflate.js [middleware] (ecmascript)");
;
;
;
;
;
;
;
;
function snapshotSharedJWE(jwe) {
    const { aad, ciphertext, iv, protected: encodedProtected, tag, unprotected } = jwe;
    if (iv !== void 0 && (typeof iv != "string" || !iv)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]("JWE Initialization Vector incorrect type");
    if (typeof ciphertext != "string") throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]("JWE Ciphertext missing or incorrect type");
    if (tag !== void 0 && (typeof tag != "string" || !tag)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]("JWE Authentication Tag incorrect type");
    if (encodedProtected !== void 0 && typeof encodedProtected != "string") throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]("JWE Protected Header incorrect type");
    if (aad !== void 0 && (typeof aad != "string" || !aad)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]("JWE AAD incorrect type");
    if (unprotected !== void 0 && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isObject"])(unprotected)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]("JWE Shared Unprotected Header incorrect type");
    return {
        aad,
        ciphertext,
        iv,
        protected: encodedProtected,
        tag,
        unprotected: unprotected === void 0 ? void 0 : {
            ...unprotected
        }
    };
}
function snapshotRecipientJWE(recipient) {
    let header, headerAlg;
    try {
        const { header: inputHeader } = recipient;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isObject"])(inputHeader)) {
            headerAlg = inputHeader.alg;
            const parameters = Object.keys(inputHeader);
            parameters.includes("alg") || (headerAlg = void 0), header = Object.fromEntries(parameters.map((parameter)=>[
                    parameter,
                    parameter === "alg" ? headerAlg : inputHeader[parameter]
                ]));
        } else header = inputHeader;
        const { encrypted_key: encryptedKey } = recipient;
        return [
            {
                encrypted_key: encryptedKey,
                header
            },
            headerAlg
        ];
    } catch (error) {
        return [
            void 0,
            headerAlg,
            error
        ];
    }
}
function checkRecipient(jwe) {
    const { encrypted_key: encryptedKey, header } = jwe;
    if (encryptedKey !== void 0 && typeof encryptedKey != "string") throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]("JWE Encrypted Key incorrect type");
    if (header !== void 0 && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isObject"])(header)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]("JWE Per-Recipient Unprotected Header incorrect type");
    if (jwe.protected === void 0 && header === void 0 && jwe.unprotected === void 0) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]("JOSE Header missing");
}
function shareJWE(jwe) {
    const { protected: encodedProtected, ciphertext, iv, tag, aad } = jwe;
    let parsedProt;
    return encodedProtected !== void 0 && (parsedProt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["parseJoseHeader"])(encodedProtected, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"], "JWE Protected Header is invalid")), [
        parsedProt,
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decodeBase64url"])(ciphertext, "ciphertext", __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]),
        iv !== void 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decodeBase64url"])(iv, "iv", __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]) : void 0,
        tag !== void 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decodeBase64url"])(tag, "tag", __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]) : void 0,
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encodeBase64url"])((encodedProtected ?? "") + (aad !== void 0 ? `.${aad}` : ""), "aad", __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"])
    ];
}
function prepareDecrypt(options) {
    return [
        options && (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateAlgorithms"])("keyManagementAlgorithms", options.keyManagementAlgorithms),
        options && (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateAlgorithms"])("contentEncryptionAlgorithms", options.contentEncryptionAlgorithms),
        options?.crit,
        options?.maxPBES2Count,
        options?.maxDecompressedLength
    ];
}
async function decryptJWE(jwe, shared, key, token = shareJWE(jwe)) {
    const [parsedProt, ciphertext, iv, tag, additionalData] = token, { header, unprotected, aad } = jwe;
    let joseHeader;
    if (header !== void 0 || unprotected !== void 0) {
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isDisjoint"])(parsedProt, header, unprotected)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]("JWE Protected, JWE Unprotected Header, and JWE Per-Recipient Unprotected Header Parameter names must be disjoint");
        joseHeader = {
            ...parsedProt,
            ...header,
            ...unprotected
        };
    } else joseHeader = parsedProt ?? {};
    const [keyManagementAlgorithms, contentEncryptionAlgorithms, crit, maxPBES2Count, maxDecompressedLength] = shared, { encrypted_key: encodedKey } = jwe;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateCrit"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"], __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWE_RECOGNIZED"], crit, parsedProt, joseHeader), (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$deflate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateZip"])(joseHeader, parsedProt);
    const { alg, enc } = joseHeader;
    if (typeof alg != "string" || !alg) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]("missing JWE Algorithm (alg) in JWE Header");
    const selected = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwe_algorithms$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWE"][alg];
    if (encodedKey === "" && (!selected || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwe_algorithms$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isJWECEKTransport"])(selected))) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]("JWE Encrypted Key incorrect type");
    const integrated = selected?.mode === "integrated-encryption";
    if (!integrated && (typeof enc != "string" || !enc)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]("missing JWE Encryption Algorithm (enc) in JWE Header");
    if (keyManagementAlgorithms && !keyManagementAlgorithms.has(alg) || !keyManagementAlgorithms && alg.startsWith("PBES2")) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JOSEAlgNotAllowed"]('"alg" (Algorithm) Header Parameter value not allowed');
    let encEntry;
    if (integrated) {
        if (enc !== void 0) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]('JWE "enc" (Encryption Algorithm) Header Parameter must not be present for integrated encryption');
        if (iv?.byteLength) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]("JWE Initialization Vector must be empty for integrated encryption");
        if (tag?.byteLength) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]("JWE Authentication Tag must be empty for integrated encryption");
    } else {
        if (contentEncryptionAlgorithms && !contentEncryptionAlgorithms.has(enc)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JOSEAlgNotAllowed"]('"enc" (Encryption Algorithm) Header Parameter value not allowed');
        encEntry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwe_algorithms$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jweEncryption"])(enc);
    }
    let encryptedKey;
    if (encodedKey !== void 0) try {
        encryptedKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decodeBase64url"])(encodedKey, "encrypted_key", __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]);
    } catch (error) {
        if (!selected || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwe_algorithms$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isJWECEKTransport"])(selected)) throw error;
        encryptedKey = new Uint8Array();
    }
    let resolvedKey = !1;
    typeof key == "function" && (key = await key(parsedProt, jwe), resolvedKey = !0);
    const algEntry = selected ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwe_algorithms$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jweAlgorithm"])(alg);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwe_algorithms$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isJWECEKTransport"])(algEntry) && encryptedKey === void 0 && (encryptedKey = new Uint8Array());
    const k = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["prepareKey"])(algEntry.mode === "direct-encryption" ? encEntry : algEntry, key, "decrypt");
    let plaintext;
    if (algEntry.mode === "integrated-encryption") plaintext = await algEntry.decrypt(k, encryptedKey, ciphertext, additionalData, parsedProt, joseHeader);
    else {
        const encryption = encEntry;
        let cek;
        try {
            cek = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key_management$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decryptKeyManagement"])(algEntry, encryption, k, encryptedKey, joseHeader, maxPBES2Count), (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwe_algorithms$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isJWECEKTransport"])(algEntry) && cek instanceof Uint8Array && cek.byteLength << 3 !== encryption.cekBits && (cek = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$content_encryption$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["generateCek"])(encryption));
        } catch (err) {
            if (err instanceof TypeError || err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"] || err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JOSENotSupported"]) throw err;
            cek = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$content_encryption$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["generateCek"])(encryption);
        }
        plaintext = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$content_encryption$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decrypt"])(encryption, cek, ciphertext, iv, tag, additionalData);
    }
    if (joseHeader.zip === "DEF") {
        const decompressionLimit = maxDecompressedLength ?? 25e4;
        if (decompressionLimit === 0) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JOSENotSupported"]('JWE "zip" (Compression Algorithm) Header Parameter is not supported.');
        if (decompressionLimit !== 1 / 0 && (!Number.isSafeInteger(decompressionLimit) || decompressionLimit < 1)) throw new TypeError("maxDecompressedLength must be 0, a positive safe integer, or Infinity");
        plaintext = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$deflate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decompress"])(plaintext, decompressionLimit).catch((cause)=>{
            throw cause instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"] ? cause : new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]("Failed to decompress plaintext", {
                cause
            });
        });
    }
    return {
        plaintext,
        ...parsedProt && {
            protectedHeader: parsedProt
        },
        ...aad !== void 0 && {
            additionalAuthenticatedData: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decodeBase64url"])(aad, "aad", __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"])
        },
        ...unprotected && {
            sharedUnprotectedHeader: unprotected
        },
        ...header && {
            unprotectedHeader: header
        },
        ...resolvedKey && {
            key: k
        }
    };
}
async function decryptCompact(jwe, shared, key) {
    if (jwe instanceof Uint8Array && (jwe = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decoder"].decode(jwe)), typeof jwe != "string") throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]("Compact JWE must be a string or Uint8Array");
    const { 0: protectedHeader, 1: encryptedKey, 2: iv, 3: ciphertext, 4: tag, length } = jwe.split(".");
    if (length !== 5) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]("Invalid Compact JWE");
    return decryptJWE({
        ciphertext,
        iv: iv || void 0,
        protected: protectedHeader,
        tag: tag || void 0,
        encrypted_key: encryptedKey || void 0
    }, shared, key);
}
;
}),
"[project]/web/node_modules/jose/dist/webapi/lib/jwe_encrypt.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkDisjoint",
    ()=>checkDisjoint,
    "checkEncryptHeaders",
    ()=>checkEncryptHeaders,
    "compactJWE",
    ()=>compactJWE,
    "createJWE",
    ()=>createJWE,
    "encryptJWE",
    ()=>encryptJWE
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/util/base64url.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$content_encryption$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/content_encryption.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key_management$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/key_management.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/util/errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/validate.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/buffer_utils.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/key.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwe_algorithms$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/jwe_algorithms.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$deflate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/deflate.js [middleware] (ecmascript)");
;
;
;
;
;
;
;
;
;
function checkDisjoint(protectedHeader, unprotectedHeader, sharedUnprotectedHeader) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isDisjoint"])(protectedHeader, unprotectedHeader, sharedUnprotectedHeader)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]("JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint");
}
function checkEncryptHeaders(input, options, sharedHeadersNormalized = !1) {
    if (!input[1] && !input[2] && !input[3]) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]("either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()");
    options !== void 0 && (input[8] = options?.crit);
    let [, protectedHeader, unprotectedHeader, sharedUnprotectedHeader, aad, cek, iv, keyManagementParameters, crit] = input;
    if (aad !== void 0 && (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["assertUint8Array"])(aad, "JWE Additional Authenticated Data"), cek !== void 0 && (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["assertUint8Array"])(cek, "JWE Content Encryption Key"), iv !== void 0 && (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["assertUint8Array"])(iv, "JWE Initialization Vector"), !sharedHeadersNormalized && protectedHeader !== void 0 && (protectedHeader = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["serializeJoseHeader"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"], protectedHeader)[0], input[1] = protectedHeader), unprotectedHeader !== void 0 && (unprotectedHeader = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["serializeJoseHeader"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"], unprotectedHeader)[0], input[2] = unprotectedHeader), !sharedHeadersNormalized && sharedUnprotectedHeader !== void 0 && (sharedUnprotectedHeader = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["serializeJoseHeader"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"], sharedUnprotectedHeader)[0], input[3] = sharedUnprotectedHeader), keyManagementParameters !== void 0 && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isObject"])(keyManagementParameters)) throw new TypeError("JWE Key Management Parameters must be an object");
    checkDisjoint(protectedHeader, unprotectedHeader, sharedUnprotectedHeader);
    const joseHeader = {
        ...protectedHeader,
        ...unprotectedHeader,
        ...sharedUnprotectedHeader
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateCritDuplicates"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"], protectedHeader), (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateCrit"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"], __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWE_RECOGNIZED"], crit, protectedHeader, joseHeader), (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$deflate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateZip"])(joseHeader, protectedHeader);
    const { alg, enc } = joseHeader;
    if (typeof alg != "string" || !alg) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]('JWE "alg" (Algorithm) Header Parameter missing or invalid');
    const algEntry = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwe_algorithms$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWE"][alg];
    if (algEntry?.mode === "integrated-encryption") {
        if (enc !== void 0) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]('JWE "enc" (Encryption Algorithm) Header Parameter must not be present for integrated encryption');
        if (cek !== void 0) throw new TypeError(`setContentEncryptionKey cannot be called with JWE "alg" (Algorithm) Header ${alg}`);
        if (iv !== void 0) throw new TypeError(`setInitializationVector cannot be called with JWE "alg" (Algorithm) Header ${alg}`);
        return [
            joseHeader,
            void 0,
            algEntry
        ];
    }
    if (typeof enc != "string" || !enc) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]('JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid');
    return [
        joseHeader,
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwe_algorithms$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jweEncryption"])(enc),
        algEntry
    ];
}
async function encryptJWE(input, checked, key) {
    const [joseHeader, encEntry, selected] = checked, [inputPlaintext, inputProtectedHeader, inputUnprotectedHeader, sharedUnprotectedHeader, aad, providedCek, inputIv, keyManagementParameters, , unprotectedParameters] = input;
    let protectedHeader = inputProtectedHeader, unprotectedHeader = inputUnprotectedHeader;
    const algEntry = selected ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwe_algorithms$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jweAlgorithm"])(joseHeader.alg);
    let encryptedKey, parameters, cek;
    algEntry.mode === "integrated-encryption" ? cek = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["prepareKey"])(algEntry, key, "encrypt") : [cek, encryptedKey, parameters] = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key_management$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encryptKeyManagement"])(algEntry, encEntry, key, joseHeader, providedCek, keyManagementParameters), parameters && (unprotectedParameters ? unprotectedHeader = unprotectedHeader ? {
        ...unprotectedHeader,
        ...parameters
    } : parameters : protectedHeader = protectedHeader ? {
        ...protectedHeader,
        ...parameters
    } : parameters, checkDisjoint(protectedHeader, unprotectedHeader, sharedUnprotectedHeader));
    const protectedHeaderS = protectedHeader ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encode"])(JSON.stringify(protectedHeader)) : "", aadMember = aad?.byteLength ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encode"])(aad) : void 0, additionalData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encode"])(aadMember ? `${protectedHeaderS}.${aadMember}` : protectedHeaderS);
    let plaintext = inputPlaintext;
    joseHeader.zip === "DEF" && (plaintext = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$deflate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["compress"])(plaintext).catch((cause)=>{
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]("Failed to compress plaintext", {
            cause
        });
    }));
    let ciphertext, tag, iv;
    algEntry.mode === "integrated-encryption" ? [encryptedKey, ciphertext] = await algEntry.encrypt(cek, plaintext, additionalData, protectedHeader, joseHeader, keyManagementParameters) : { ciphertext, tag, iv } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$content_encryption$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encrypt"])(encEntry, plaintext, cek, inputIv, additionalData);
    const jwe = {
        ciphertext: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encode"])(ciphertext)
    };
    return iv && (jwe.iv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encode"])(iv)), tag && (jwe.tag = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encode"])(tag)), encryptedKey?.byteLength && (jwe.encrypted_key = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encode"])(encryptedKey)), aadMember && (jwe.aad = aadMember), protectedHeader && (jwe.protected = protectedHeaderS), sharedUnprotectedHeader && (jwe.unprotected = sharedUnprotectedHeader), unprotectedHeader && (jwe.header = unprotectedHeader), jwe;
}
async function createJWE(input, key, options) {
    return encryptJWE(input, checkEncryptHeaders(input, options), key);
}
function compactJWE(jwe) {
    return [
        jwe.protected,
        jwe.encrypted_key,
        jwe.iv,
        jwe.ciphertext,
        jwe.tag
    ].join(".");
}
;
}),
"[project]/web/node_modules/jose/dist/webapi/lib/jws_algorithms.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "JWS",
    ()=>JWS,
    "jwsAlgorithm",
    ()=>jwsAlgorithm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/util/errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key_descriptor$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/key_descriptor.js [middleware] (ecmascript)");
;
;
const sig = [
    [
        "verify"
    ],
    [
        "sign"
    ]
];
function hmac(bits) {
    const subtle = {
        name: "HMAC",
        hash: `SHA-${bits}`
    };
    return {
        kty: [
            "oct"
        ],
        secret: !0,
        subtle,
        signing: subtle,
        usages: sig
    };
}
function rsa(bits, saltLength) {
    const subtle = {
        name: saltLength ? "RSA-PSS" : "RSASSA-PKCS1-v1_5",
        hash: `SHA-${bits}`
    };
    return {
        kty: [
            "RSA"
        ],
        subtle,
        signing: saltLength ? {
            ...subtle,
            saltLength
        } : subtle,
        usages: sig,
        minRsaBits: 2048
    };
}
function ecdsa(crv, bits) {
    return {
        kty: [
            "EC"
        ],
        crv,
        subtle: {
            name: "ECDSA",
            namedCurve: crv
        },
        signing: {
            name: "ECDSA",
            hash: `SHA-${bits}`
        },
        usages: sig
    };
}
function eddsa() {
    const subtle = {
        name: "Ed25519"
    };
    return {
        kty: [
            "OKP"
        ],
        crv: "Ed25519",
        subtle,
        signing: subtle,
        usages: sig
    };
}
function mldsa(bits) {
    const subtle = {
        name: `ML-DSA-${bits}`
    };
    return {
        kty: [
            "AKP"
        ],
        subtle,
        signing: subtle,
        usages: sig
    };
}
const JWS = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key_descriptor$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["table"])({
    HS256: hmac(256),
    HS384: hmac(384),
    HS512: hmac(512),
    RS256: rsa(256),
    RS384: rsa(384),
    RS512: rsa(512),
    PS256: rsa(256, 32),
    PS384: rsa(384, 48),
    PS512: rsa(512, 64),
    ES256: ecdsa("P-256", 256),
    ES384: ecdsa("P-384", 384),
    ES512: ecdsa("P-521", 512),
    EdDSA: eddsa(),
    Ed25519: eddsa(),
    "ML-DSA-44": mldsa(44),
    "ML-DSA-65": mldsa(65),
    "ML-DSA-87": mldsa(87)
});
function jwsAlgorithm(alg) {
    const entry = typeof alg == "string" ? JWS[alg] : void 0;
    if (!entry) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JOSENotSupported"](`alg ${alg} is not supported either by JOSE or your javascript runtime`);
    return entry;
}
;
}),
"[project]/web/node_modules/jose/dist/webapi/lib/jws_sign.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createCompactSignature",
    ()=>createCompactSignature,
    "createSignature",
    ()=>createSignature
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/util/base64url.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jws_algorithms$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/jws_algorithms.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/validate.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/util/errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/buffer_utils.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/key.js [middleware] (ecmascript)");
;
;
;
;
;
;
async function createSignature(input, key, rejectUnencoded) {
    let [payload, protectedHeader, unprotectedHeader, crit] = input, protectedHeaderString = "";
    if (protectedHeader !== void 0) {
        const normalized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["serializeJoseHeader"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWSInvalid"], protectedHeader);
        protectedHeader = normalized[0], protectedHeaderString = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encode"])(normalized[1]);
    }
    if (unprotectedHeader !== void 0 && (unprotectedHeader = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["serializeJoseHeader"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWSInvalid"], unprotectedHeader)[0]), !protectedHeader && !unprotectedHeader) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWSInvalid"]("either setProtectedHeader or setUnprotectedHeader must be called before #sign()");
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isDisjoint"])(protectedHeader, unprotectedHeader)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWSInvalid"]("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
    const joseHeader = {
        ...protectedHeader,
        ...unprotectedHeader
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateCritDuplicates"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWSInvalid"], protectedHeader);
    const b64 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateB64"])(protectedHeader, (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateCrit"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWSInvalid"], __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWS_RECOGNIZED"], crit, protectedHeader, joseHeader));
    b64 || rejectUnencoded?.();
    const { alg } = joseHeader;
    if (typeof alg != "string" || !alg) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWSInvalid"]('JWS "alg" (Algorithm) Header Parameter missing or invalid');
    const entry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jws_algorithms$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jwsAlgorithm"])(alg);
    let payloadS = "", payloadB = payload, data;
    if (b64) {
        const encoded = input[4];
        encoded ? (payloadS = encoded[0] ??= (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encode"])(payload), payloadB = encoded[1] ??= (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encode"])(payloadS)) : (payloadS = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encode"])(payload), data = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encoder"].encode(`${protectedHeaderString}.${payloadS}`));
    }
    data ??= (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["concat"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encode"])(protectedHeaderString), (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encode"])("."), payloadB);
    const k = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["rawKey"])(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["prepareKey"])(entry, key, "sign"), entry.subtle, "sign");
    entry.minRsaBits && (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["checkModulusLength"])(entry.alg, k);
    const jws = {
        signature: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encode"])(new Uint8Array(await crypto.subtle.sign(entry.signing, k, data))),
        payload: payloadS
    };
    return protectedHeader && (jws.protected = protectedHeaderString), unprotectedHeader && (jws.header = unprotectedHeader), [
        jws,
        b64
    ];
}
async function createCompactSignature(payload, protectedHeader, crit, key, rejectUnencoded) {
    const [jws] = await createSignature([
        payload,
        protectedHeader,
        void 0,
        crit
    ], key, rejectUnencoded);
    return `${jws.protected}.${jws.payload}.${jws.signature}`;
}
;
}),
"[project]/web/node_modules/jose/dist/webapi/lib/jws_verify.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "encodeJsonUnencodedPayload",
    ()=>encodeJsonUnencodedPayload,
    "parseProtectedHeader",
    ()=>parseProtectedHeader,
    "prepareVerify",
    ()=>prepareVerify,
    "snapshotJws",
    ()=>snapshotJws,
    "verifyCompact",
    ()=>verifyCompact,
    "verifySignature",
    ()=>verifySignature
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jws_algorithms$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/jws_algorithms.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/util/errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/buffer_utils.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/validate.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/key.js [middleware] (ecmascript)");
;
;
;
;
;
function snapshotJws(jws, sharedPayload) {
    const encodedProtected = jws.protected, inputHeader = jws.header, header = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isObject"])(inputHeader) ? {
        ...inputHeader
    } : inputHeader;
    let payload = sharedPayload ? sharedPayload[0] : jws.payload;
    !sharedPayload && payload instanceof Uint8Array && (payload = new Uint8Array(payload));
    const signature = jws.signature, snapshot = {
        payload,
        signature
    };
    if (encodedProtected !== void 0 && (snapshot.protected = encodedProtected), inputHeader !== void 0 && (snapshot.header = header), encodedProtected === void 0 && header === void 0) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWSInvalid"]('Flattened JWS must have either of the "protected" or "header" members');
    if (encodedProtected !== void 0 && typeof encodedProtected != "string") throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWSInvalid"]("JWS Protected Header incorrect type");
    if (payload === void 0) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWSInvalid"]("JWS Payload missing");
    if (typeof signature != "string") throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWSInvalid"]("JWS Signature missing or incorrect type");
    if (header !== void 0 && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isObject"])(header)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWSInvalid"]("JWS Unprotected Header incorrect type");
    return snapshot;
}
function prepareVerify(options) {
    return [
        options && (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateAlgorithms"])("algorithms", options.algorithms),
        options?.crit
    ];
}
function parseProtectedHeader(encodedProtected) {
    return encodedProtected === void 0 ? {} : (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["parseJoseHeader"])(encodedProtected, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWSInvalid"], "JWS Protected Header is invalid");
}
function encodeJsonUnencodedPayload(payload) {
    const invalid = /[\p{Cs}\p{Cn}]/u.exec(payload)?.[0];
    if (invalid !== void 0) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWSInvalid"](/\p{Cs}/u.test(invalid) ? "JWS Payload must be a well-formed Unicode string" : "JWS Payload must not contain unassigned Unicode code points");
    return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encoder"].encode(payload);
}
function encodeCompactUnencodedPayload(payload) {
    try {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encode"])(payload);
    } catch  {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWSInvalid"]("JWS Compact Serialization payload must use only ASCII characters");
    }
}
async function verifySignature(jws, shared, key, encodeUnencodedPayload, parsedProtected) {
    const { protected: encodedProtected, header, payload: inputPayload } = jws, parsedProt = parsedProtected ?? parseProtectedHeader(encodedProtected);
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isDisjoint"])(parsedProt, header)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWSInvalid"]("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
    const joseHeader = {
        ...parsedProt,
        ...header
    }, b64 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateB64"])(parsedProt, (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateCrit"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWSInvalid"], __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWS_RECOGNIZED"], shared[1], parsedProt, joseHeader)), { alg } = joseHeader;
    if (typeof alg != "string" || !alg) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWSInvalid"]('JWS "alg" (Algorithm) Header Parameter missing or invalid');
    if (shared[0] && !shared[0].has(alg)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JOSEAlgNotAllowed"]('"alg" (Algorithm) Header Parameter value not allowed');
    if (b64) {
        if (typeof inputPayload != "string") throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWSInvalid"]("JWS Payload must be a string");
    } else if (typeof inputPayload != "string" && !(inputPayload instanceof Uint8Array)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWSInvalid"]("JWS Payload must be a string or an Uint8Array instance");
    const signingPayload = b64 || typeof inputPayload != "string" ? inputPayload : encodeUnencodedPayload(inputPayload);
    let resolvedKey = !1;
    typeof key == "function" && (key = await key(parsedProt, jws), resolvedKey = !0);
    const entry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jws_algorithms$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jwsAlgorithm"])(alg), data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["concat"])(encodedProtected !== void 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encode"])(encodedProtected) : new Uint8Array(), (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encode"])("."), typeof signingPayload == "string" ? shared[2] ??= (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encodeBase64url"])(signingPayload, "payload", __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWSInvalid"]) : signingPayload), signature = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decodeBase64url"])(jws.signature, "signature", __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWSInvalid"]), k = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["prepareKey"])(entry, key, "verify"), cryptoKey = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["rawKey"])(k, entry.subtle, "verify");
    entry.minRsaBits && (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["checkModulusLength"])(entry.alg, cryptoKey);
    let verified = !1;
    try {
        verified = await crypto.subtle.verify(entry.signing, cryptoKey, signature, data);
    } catch  {}
    if (!verified) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWSSignatureVerificationFailed"]();
    const result = {
        payload: typeof signingPayload == "string" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decodeBase64url"])(signingPayload, "payload", __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWSInvalid"]) : signingPayload
    };
    return encodedProtected !== void 0 && (result.protectedHeader = parsedProt), header !== void 0 && (result.unprotectedHeader = header), resolvedKey ? [
        {
            ...result,
            key: k
        },
        b64
    ] : [
        result,
        b64
    ];
}
async function verifyCompact(jws, shared, key) {
    if (jws instanceof Uint8Array && (jws = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decoder"].decode(jws)), typeof jws != "string") throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWSInvalid"]("Compact JWS must be a string or Uint8Array");
    const { 0: protectedHeader, 1: payload, 2: signature, length } = jws.split(".");
    if (length !== 3) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWSInvalid"]("Invalid Compact JWS");
    return verifySignature({
        payload,
        protected: protectedHeader,
        signature
    }, shared, key, encodeCompactUnencodedPayload);
}
;
}),
"[project]/web/node_modules/jose/dist/webapi/lib/jwt_claims_set.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "JWTClaimsBuilder",
    ()=>JWTClaimsBuilder,
    "jwtClaim",
    ()=>jwtClaim,
    "jwtData",
    ()=>jwtData,
    "secs",
    ()=>secs,
    "validateClaimsSet",
    ()=>validateClaimsSet
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/util/errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/buffer_utils.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/validate.js [middleware] (ecmascript)");
;
;
;
const epoch = (date)=>Math.floor(date.getTime() / 1e3), multipliers = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
    w: 604800,
    y: 31557600
}, REGEX = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i, checkFailed = "check_failed";
function invalidDuration() {
    throw new TypeError("Invalid time period format");
}
function secs(str) {
    typeof str != "string" && invalidDuration();
    const matched = REGEX.exec(str);
    (!matched || matched[4] && matched[1]) && invalidDuration();
    const value = parseFloat(matched[2]), numericDate2 = Math.round(value * multipliers[matched[3][0].toLowerCase()]);
    return Number.isFinite(numericDate2) || invalidDuration(), matched[1] === "-" || matched[4] === "ago" ? -numericDate2 : numericDate2;
}
function validateInput(label, input) {
    if (!Number.isFinite(input)) throw new TypeError(`Invalid ${label} input`);
    return input;
}
function validateStringClaim(claim, value) {
    if (typeof value != "string") throw new TypeError(`"${claim}" claim must be a string`);
}
function validateAudienceClaim(value) {
    if (typeof value != "string" && (!Array.isArray(value) || Array.from(value).some((member)=>typeof member != "string"))) throw new TypeError('"aud" claim must be a string or an array of strings');
}
function numericDate(value, label) {
    return typeof value == "number" ? validateInput(label, value) : value instanceof Date ? validateInput(label, epoch(value)) : epoch(/* @__PURE__ */ new Date()) + secs(value);
}
const normalizeTyp = (value)=>{
    const normalized = value.toLowerCase();
    return value.includes("/") ? normalized : `application/${normalized}`;
}, checkAudiencePresence = (audPayload, audOption)=>typeof audPayload == "string" ? audOption.includes(audPayload) : Array.isArray(audPayload) ? audOption.some((aud)=>audPayload.includes(aud)) : !1;
function validateNumericDate(payload, claim, required = !1) {
    const value = payload[claim];
    if (!(value === void 0 && !required)) {
        if (typeof value != "number") throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWTClaimValidationFailed"](`"${claim}" claim must be a number`, payload, claim, "invalid");
        return value;
    }
}
function unexpectedClaim(payload, claim) {
    throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWTClaimValidationFailed"](`unexpected "${claim}" claim value`, payload, claim, checkFailed);
}
function validateClaimsSet(protectedHeader, encodedPayload, options = {}) {
    let payload;
    try {
        payload = JSON.parse(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["strictDecoder"].decode(encodedPayload));
    } catch  {}
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isObject"])(payload)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWTInvalid"]("JWT Claims Set must be a top-level JSON object");
    const { typ } = options;
    if (typ !== void 0 && (typeof protectedHeader.typ != "string" || normalizeTyp(protectedHeader.typ) !== normalizeTyp(typ))) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWTClaimValidationFailed"]('unexpected "typ" JWT header value', payload, "typ", checkFailed);
    const { requiredClaims = [], issuer, subject, audience, maxTokenAge } = options, presenceCheck = [
        ...requiredClaims
    ];
    maxTokenAge !== void 0 && presenceCheck.push("iat"), audience !== void 0 && presenceCheck.push("aud"), subject !== void 0 && presenceCheck.push("sub"), issuer !== void 0 && presenceCheck.push("iss");
    for (const claim of new Set(presenceCheck.reverse()))if (!Object.hasOwn(payload, claim)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWTClaimValidationFailed"](`missing required "${claim}" claim`, payload, claim, "missing");
    issuer !== void 0 && !(Array.isArray(issuer) ? issuer : [
        issuer
    ]).includes(payload.iss) && unexpectedClaim(payload, "iss"), subject !== void 0 && payload.sub !== subject && unexpectedClaim(payload, "sub"), audience !== void 0 && !checkAudiencePresence(payload.aud, typeof audience == "string" ? [
        audience
    ] : audience) && unexpectedClaim(payload, "aud");
    const { clockTolerance } = options;
    let tolerance = 0;
    if (typeof clockTolerance == "string") tolerance = secs(clockTolerance);
    else if (clockTolerance !== void 0) {
        if (typeof clockTolerance != "number") throw new TypeError("Invalid clockTolerance option type");
        tolerance = clockTolerance;
    }
    validateInput("clockTolerance option", tolerance);
    const { currentDate } = options, now = validateInput("currentDate option", epoch(currentDate === void 0 ? /* @__PURE__ */ new Date() : currentDate)), iat = validateNumericDate(payload, "iat", maxTokenAge !== void 0), nbf = validateNumericDate(payload, "nbf");
    if (nbf !== void 0 && nbf > now + tolerance) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWTClaimValidationFailed"]('"nbf" claim timestamp check failed', payload, "nbf", checkFailed);
    const exp = validateNumericDate(payload, "exp");
    if (exp !== void 0 && exp <= now - tolerance) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWTExpired"]('"exp" claim timestamp check failed', payload, "exp", checkFailed);
    if (maxTokenAge !== void 0) {
        const age = now - iat, max = validateInput("maxTokenAge option", typeof maxTokenAge == "number" ? maxTokenAge : secs(maxTokenAge));
        if (age - tolerance > max) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWTExpired"]('"iat" claim timestamp check failed (too far in the past)', payload, "iat", checkFailed);
        if (age < -tolerance) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWTClaimValidationFailed"]('"iat" claim timestamp check failed (it should be in the past)', payload, "iat", checkFailed);
    }
    return payload;
}
let producerPayloads;
function producerPayload(producer) {
    return producerPayloads.get(producer);
}
function jwtData(producer) {
    const payload = producerPayload(producer);
    for (const claim of [
        "iat",
        "nbf",
        "exp"
    ]){
        const value = payload[claim];
        if (typeof value == "number" && !Number.isFinite(value)) throw new TypeError(`"${claim}" claim must be a finite number`);
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encoder"].encode(JSON.stringify(payload));
}
function jwtClaim(producer, claim) {
    return producerPayload(producer)[claim];
}
class JWTClaimsBuilder {
    constructor(payload = {}){
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isObject"])(payload)) throw new TypeError("JWT Claims Set MUST be an object");
        (producerPayloads ||= /* @__PURE__ */ new WeakMap()).set(this, structuredClone(payload));
    }
    setIssuer(value) {
        return validateStringClaim("iss", value), producerPayload(this).iss = value, this;
    }
    setSubject(value) {
        return validateStringClaim("sub", value), producerPayload(this).sub = value, this;
    }
    setAudience(value) {
        return validateAudienceClaim(value), producerPayload(this).aud = value, this;
    }
    setJti(value) {
        return validateStringClaim("jti", value), producerPayload(this).jti = value, this;
    }
    setNotBefore(value) {
        return producerPayload(this).nbf = numericDate(value, "setNotBefore"), this;
    }
    setExpirationTime(value) {
        return producerPayload(this).exp = numericDate(value, "setExpirationTime"), this;
    }
    setIssuedAt(value) {
        const payload = producerPayload(this);
        return value === void 0 ? payload.iat = epoch(/* @__PURE__ */ new Date()) : typeof value == "string" ? payload.iat = validateInput("setIssuedAt", epoch(/* @__PURE__ */ new Date()) + secs(value)) : payload.iat = numericDate(value, "setIssuedAt"), this;
    }
}
;
}),
"[project]/web/node_modules/jose/dist/webapi/lib/key.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "assertCryptoKey",
    ()=>assertCryptoKey,
    "checkCryptoKey",
    ()=>checkCryptoKey,
    "checkModulusLength",
    ()=>checkModulusLength,
    "checkUsage",
    ()=>checkUsage,
    "invalidKeyInput",
    ()=>invalidKeyInput,
    "isCryptoKey",
    ()=>isCryptoKey,
    "isKeyLike",
    ()=>isKeyLike,
    "isKeyObject",
    ()=>isKeyObject,
    "jwkToKey",
    ()=>jwkToKey,
    "normalizeJwk",
    ()=>normalizeJwk,
    "prepareKey",
    ()=>prepareKey,
    "rawKey",
    ()=>rawKey,
    "snapshotJwk",
    ()=>snapshotJwk,
    "validateExtractableOption",
    ()=>validateExtractableOption
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/validate.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/util/base64url.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/util/errors.js [middleware] (ecmascript)");
;
;
;
const tag = (key)=>key[Symbol.toStringTag], jwkMatchesOp = (entry, key, usage)=>{
    const { alg } = entry;
    if (key.use !== void 0) {
        const expected = usage === "sign" || usage === "verify" ? "sig" : "enc";
        if (key.use !== expected) throw new TypeError(`Invalid key for this operation, its "use" must be "${expected}" when present`);
    }
    if (key.alg !== void 0 && key.alg !== alg) throw new TypeError(`Invalid key for this operation, its "alg" must be "${alg}" when present`);
    if (Array.isArray(key.key_ops)) {
        const expectedKeyOp = usage === "encrypt" || usage === "decrypt" ? entry.ops?.[usage === "encrypt" ? 0 : 1] : usage;
        if (expectedKeyOp && !key.key_ops.includes(expectedKeyOp)) throw new TypeError(`Invalid key for this operation, its "key_ops" must include "${expectedKeyOp}" when present`);
    }
};
async function prepareKey(entry, key, usage) {
    const { alg, secret } = entry, privateKey = usage === "decrypt" || usage === "sign";
    if (secret && key instanceof Uint8Array) return key;
    let normalized, keyObject;
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isObject"])(key)) {
        if (normalized = normalizeJwk(key), typeof normalized.kty != "string") throw invalidKeyType(alg, key, secret);
        if (!(secret ? normalized.kty === "oct" && typeof normalized.k == "string" : normalized.kty !== "oct" && (privateKey ? normalized.kty === "AKP" && typeof normalized.priv == "string" || typeof normalized.d == "string" : normalized.d === void 0 && normalized.priv === void 0))) throw new TypeError(secret ? 'JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present' : `JSON Web Key for this operation must be a ${privateKey ? "private" : "public"} JWK`);
        if (jwkMatchesOp(entry, normalized, usage), normalized.kty === "oct") return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decode"])(normalized.k);
        if (!Object.isFrozen(key)) {
            const { key_ops } = key;
            Array.isArray(key_ops) && Object.freeze(key_ops), Object.freeze(key);
        }
    } else {
        if (!isKeyLike(key)) throw invalidKeyType(alg, key, secret);
        const expectedType = secret ? "secret" : privateKey ? "private" : "public";
        if (key.type !== expectedType && (secret || [
            "secret",
            "public",
            "private"
        ].includes(key.type))) throw new TypeError(`${tag(key)} instances must be of type "${expectedType}" for the ${alg} algorithm`);
        if (isCryptoKey(key)) return key;
        if (keyObject = key, keyObject.type === "secret") return keyObject.export();
    }
    cache ||= /* @__PURE__ */ new WeakMap();
    const cacheKey = key;
    let cached = cache.get(cacheKey);
    if (cached?.[alg]) return cached[alg];
    if (cached || cache.set(cacheKey, cached = {}), keyObject && typeof keyObject.toCryptoKey == "function") {
        const isPublic = keyObject.type === "public", crv = nist[keyObject.asymmetricKeyDetails?.namedCurve], params = entry.resolve?.({
            crv,
            asymmetricKeyType: keyObject.asymmetricKeyType
        }) ?? entry.subtle;
        return cached[alg] = keyObject.toCryptoKey(params, isPublic, entry.usages[isPublic ? 0 : 1]);
    }
    return normalized ??= keyObject.export({
        format: "jwk"
    }), normalized.alg = alg, cached[alg] = await jwkToKey(entry, normalized);
}
let cache;
const nist = {
    __proto__: null,
    prime256v1: "P-256",
    secp384r1: "P-384",
    secp521r1: "P-521"
};
function assertCryptoKey(key) {
    if (!isCryptoKey(key)) throw new Error("CryptoKey instance expected");
}
const isCryptoKey = (key)=>{
    if (key?.[Symbol.toStringTag] === "CryptoKey") return !0;
    try {
        return key instanceof CryptoKey;
    } catch  {
        return !1;
    }
}, isKeyObject = (key)=>key?.[Symbol.toStringTag] === "KeyObject", isKeyLike = (key)=>isCryptoKey(key) || isKeyObject(key);
function message(msg, actual, ...types) {
    if (types.length > 2) {
        const last = types.pop();
        msg += `one of type ${types.join(", ")}, or ${last}.`;
    } else types.length === 2 ? msg += `one of type ${types[0]} or ${types[1]}.` : msg += `of type ${types[0]}.`;
    return actual == null ? msg += ` Received ${actual}` : typeof actual == "function" && actual.name ? msg += ` Received function ${actual.name}` : typeof actual == "object" && actual != null && actual.constructor?.name && (msg += ` Received an instance of ${actual.constructor.name}`), msg;
}
const invalidKeyInput = (actual, ...types)=>message("Key must be ", actual, ...types);
function invalidKeyType(alg, actual, secret) {
    const types = [
        "CryptoKey",
        "KeyObject",
        "JSON Web Key"
    ];
    return secret && types.push("Uint8Array"), new TypeError(message(`Key for the ${alg} algorithm must be `, actual, ...types));
}
const unusable = (name, prop = "algorithm.name")=>new TypeError(`CryptoKey does not support this operation, its ${prop} must be ${name}`);
function checkUsage(key, usage) {
    if (usage && !key.usages.includes(usage)) throw new TypeError(`CryptoKey does not support this operation, its usages must include ${usage}.`);
}
function checkModulusLength(alg, key) {
    const { modulusLength } = key.algorithm;
    if (typeof modulusLength != "number" || modulusLength < 2048) throw new TypeError(`${alg} requires key modulusLength to be 2048 bits or larger`);
}
function checkCryptoKey(key, expected, usage) {
    const algorithm = key.algorithm;
    if (algorithm.name !== expected.name) throw unusable(expected.name);
    if (expected.hash && algorithm.hash?.name !== expected.hash) throw unusable(expected.hash, "algorithm.hash");
    if (expected.namedCurve && algorithm.namedCurve !== expected.namedCurve) throw unusable(expected.namedCurve, "algorithm.namedCurve");
    if (expected.length !== void 0 && algorithm.length !== expected.length) throw unusable(expected.length, "algorithm.length");
    checkUsage(key, usage);
}
function snapshotJwk(jwk) {
    return {
        __proto__: null,
        ...jwk
    };
}
function normalizeJwk(jwk) {
    const normalized = snapshotJwk(jwk);
    if (normalized.ext !== void 0 && typeof normalized.ext != "boolean") throw new TypeError('"ext" (Extractable) Parameter must be a boolean');
    if (normalized.key_ops !== void 0) {
        const value = normalized.key_ops, keyOps = Array.isArray(value) ? [
            ...value
        ] : void 0;
        if (!keyOps || keyOps.some((operation)=>typeof operation != "string") || new Set(keyOps).size !== keyOps.length) throw new TypeError('"key_ops" (Key Operations) Parameter must be an array of unique strings');
        normalized.key_ops = keyOps;
    }
    return normalized;
}
function validateExtractableOption(extractable) {
    if (extractable !== void 0 && typeof extractable != "boolean") throw new TypeError('"extractable" option must be a boolean');
    return extractable;
}
async function jwkToKey(entry, jwk, extractable) {
    if (!entry.kty.includes(jwk.kty)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JOSENotSupported"]('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
    const algorithm = entry.resolve?.({
        kty: jwk.kty,
        crv: jwk.crv
    }) ?? entry.subtle, isPrivate = !!(jwk.d || jwk.priv), keyData = {
        ...jwk,
        ext: extractable ?? jwk.ext
    };
    return keyData.kty !== "AKP" && delete keyData.alg, delete keyData.use, crypto.subtle.importKey("jwk", keyData, algorithm, keyData.ext ?? !isPrivate, jwk.key_ops ?? entry.usages[isPrivate ? 1 : 0]);
}
async function rawKey(key, expected, usage, extractable = !1) {
    return key instanceof Uint8Array && (key = await crypto.subtle.importKey("raw", key, expected, extractable, [
        usage
    ])), checkCryptoKey(key, expected, usage), key;
}
;
}),
"[project]/web/node_modules/jose/dist/webapi/lib/key_algorithm.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "algArgument",
    ()=>algArgument,
    "keyAlgorithm",
    ()=>keyAlgorithm,
    "unsupportedAlg",
    ()=>unsupportedAlg
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/util/errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jws_algorithms$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/jws_algorithms.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwe_algorithms$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/jwe_algorithms.js [middleware] (ecmascript)");
;
;
;
const algArgument = '"alg" (Algorithm)';
function unsupportedAlg(source = 'JWK "alg" (Algorithm) Parameter') {
    throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JOSENotSupported"](`Invalid or unsupported ${source} value`);
}
function keyAlgorithm(alg, source) {
    return (typeof alg == "string" ? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jws_algorithms$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWS"][alg] ?? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwe_algorithms$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWE"][alg] : void 0) ?? unsupportedAlg(source);
}
;
}),
"[project]/web/node_modules/jose/dist/webapi/lib/key_descriptor.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "table",
    ()=>table
]);
function table(entries) {
    const out = {
        __proto__: null
    };
    for(const alg in entries)out[alg] = {
        ...entries[alg],
        alg
    };
    return out;
}
;
}),
"[project]/web/node_modules/jose/dist/webapi/lib/key_management.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "decryptKeyManagement",
    ()=>decryptKeyManagement,
    "encryptKeyManagement",
    ()=>encryptKeyManagement,
    "validateMaxPBES2Count",
    ()=>validateMaxPBES2Count
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/util/base64url.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/key.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwe_algorithms$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/jwe_algorithms.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/util/errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/validate.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/buffer_utils.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$content_encryption$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/content_encryption.js [middleware] (ecmascript)");
;
;
;
;
;
;
;
function checkEcdhCryptoKey(key, usage) {
    if (key.algorithm.name !== "ECDH" && key.algorithm.name !== "X25519") throw new TypeError("CryptoKey does not support this operation, its algorithm.name must be ECDH or X25519");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["checkUsage"])(key, usage);
}
async function aeskwWrap(alg, key, cek) {
    const cryptoKey = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["rawKey"])(key, (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwe_algorithms$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jweAlgorithm"])(alg).subtle, "wrapKey", !0), cryptoKeyCek = await crypto.subtle.importKey("raw", cek, {
        hash: "SHA-256",
        name: "HMAC"
    }, !0, [
        "sign"
    ]);
    return new Uint8Array(await crypto.subtle.wrapKey("raw", cryptoKeyCek, cryptoKey, "AES-KW"));
}
async function aeskwUnwrap(alg, key, encryptedKey) {
    const cryptoKey = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["rawKey"])(key, (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwe_algorithms$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jweAlgorithm"])(alg).subtle, "unwrapKey", !0), cryptoKeyCek = await crypto.subtle.unwrapKey("raw", encryptedKey, cryptoKey, "AES-KW", {
        hash: "SHA-256",
        name: "HMAC"
    }, !0, [
        "sign"
    ]);
    return new Uint8Array(await crypto.subtle.exportKey("raw", cryptoKeyCek));
}
function checkRsaKey(alg, key, usage) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["checkCryptoKey"])(key, (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwe_algorithms$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jweAlgorithm"])(alg).subtle, usage), (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["checkModulusLength"])(alg, key);
}
async function deriveKey(p2s, alg, p2c, key) {
    if (!(p2s instanceof Uint8Array) || p2s.length < 8) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]("PBES2 Salt Input must be 8 or more octets");
    if (!Number.isSafeInteger(p2c) || Math.sign(p2c) !== 1) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]("PBES2 Count Input must be a positive integer");
    const salt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["concat"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encode"])(alg), Uint8Array.of(0), p2s), keylen = parseInt(alg.slice(13, 16), 10), subtleAlg = {
        hash: `SHA-${alg.slice(8, 11)}`,
        iterations: p2c,
        name: "PBKDF2",
        salt
    }, cryptoKey = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["rawKey"])(key, (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwe_algorithms$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jweAlgorithm"])(alg).subtle, "deriveBits");
    return new Uint8Array(await crypto.subtle.deriveBits(subtleAlg, cryptoKey, keylen));
}
function lengthAndInput(input) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["concat"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["uint32be"])(input.length), input);
}
async function concatKdf(Z, L, OtherInfo) {
    const dkLen = L >> 3, hashLen = 32, reps = Math.ceil(dkLen / hashLen), dk = new Uint8Array(reps * hashLen);
    for(let i = 1; i <= reps; i++){
        const hashResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["digest"])("sha256", (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["concat"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["uint32be"])(i), Z, OtherInfo));
        dk.set(hashResult, (i - 1) * hashLen);
    }
    return dk.slice(0, dkLen);
}
async function ecdhesDeriveKey(publicKey, privateKey, algorithm, keyLength, apu = new Uint8Array(), apv = new Uint8Array()) {
    checkEcdhCryptoKey(publicKey), checkEcdhCryptoKey(privateKey, "deriveBits");
    const otherInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["concat"])(lengthAndInput((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encode"])(algorithm)), lengthAndInput(apu), lengthAndInput(apv), (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["uint32be"])(keyLength)), Z = new Uint8Array(await crypto.subtle.deriveBits({
        name: publicKey.algorithm.name,
        public: publicKey
    }, privateKey, publicKey.algorithm.name === "X25519" ? 256 : Math.ceil(parseInt(publicKey.algorithm.namedCurve.slice(-3), 10) / 8) << 3));
    return concatKdf(Z, keyLength, otherInfo);
}
function assertEcdhKey(key) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["assertCryptoKey"])(key);
    const curve = key.algorithm.namedCurve;
    if (curve !== "P-256" && curve !== "P-384" && curve !== "P-521" && key.algorithm.name !== "X25519") throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JOSENotSupported"]("ECDH with the provided key is not allowed or not supported by your javascript runtime");
}
function partyInfo(joseHeader, name) {
    const value = joseHeader[name];
    if (value !== void 0) {
        if (typeof value != "string") throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"](`JOSE Header "${name}" (Agreement Party${name === "apu" ? "U" : "V"}Info) invalid`);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decodeBase64url"])(value, name, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]);
    }
}
function checkPartyInfo(apu, apv) {
    if (!(apu === void 0 || apv === void 0 || apu.byteLength !== apv.byteLength)) {
        for(let i = 0; i < apu.byteLength; i++)if (apu[i] !== apv[i]) return;
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]('JOSE Header "apu" and "apv" values must be distinct');
    }
}
function assertEncryptedKey(encryptedKey) {
    if (encryptedKey === void 0) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]("JWE Encrypted Key missing");
}
function assertNoEncryptedKey(encryptedKey) {
    if (encryptedKey !== void 0) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]("Encountered unexpected JWE Encrypted Key");
}
function validateMaxPBES2Count(value) {
    if (value !== void 0 && value !== 1 / 0 && (!Number.isSafeInteger(value) || value < 1)) throw new TypeError("maxPBES2Count must be a positive safe integer or Infinity");
}
async function decryptKeyManagement(entry, enc, key, encryptedKey, joseHeader, maxPBES2Count) {
    const { alg } = entry, mode = entry.mode;
    if (mode === "direct-encryption") return assertNoEncryptedKey(encryptedKey), key;
    const direct = mode === "direct-key-agreement";
    switch(direct ? assertNoEncryptedKey(encryptedKey) : assertEncryptedKey(encryptedKey), entry.subtle.name){
        case "ECDH":
            {
                const { epk } = joseHeader;
                if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isObject"])(epk) || [
                    "d",
                    "k",
                    "p",
                    "q",
                    "dp",
                    "dq",
                    "qi",
                    "oth",
                    "priv"
                ].some((parameter)=>Object.hasOwn(epk, parameter))) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]('JOSE Header "epk" (Ephemeral Public Key) missing or invalid');
                assertEcdhKey(key);
                const ephemeralPublicKey = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jwkToKey"])(entry, epk), partyUInfo = partyInfo(joseHeader, "apu"), partyVInfo = partyInfo(joseHeader, "apv");
                checkPartyInfo(partyUInfo, partyVInfo);
                const sharedSecret = await ecdhesDeriveKey(ephemeralPublicKey, key, direct ? enc.alg : alg, direct ? enc.cekBits : parseInt(alg.slice(-5, -2), 10), partyUInfo, partyVInfo);
                if (direct) return sharedSecret;
                key = sharedSecret;
                break;
            }
        case "RSA-OAEP":
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["assertCryptoKey"])(key), checkRsaKey(alg, key, "decrypt"), new Uint8Array(await crypto.subtle.decrypt("RSA-OAEP", key, encryptedKey));
        case "PBKDF2":
            {
                if (typeof joseHeader.p2c != "number") throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]('JOSE Header "p2c" (PBES2 Count) missing or invalid');
                validateMaxPBES2Count(maxPBES2Count);
                const p2cLimit = maxPBES2Count ?? 1e4;
                if (joseHeader.p2c > p2cLimit) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]('JOSE Header "p2c" (PBES2 Count) out is of acceptable bounds');
                if (typeof joseHeader.p2s != "string") throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]('JOSE Header "p2s" (PBES2 Salt) missing or invalid');
                const p2s = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decodeBase64url"])(joseHeader.p2s, "p2s", __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]);
                key = await deriveKey(p2s, alg, joseHeader.p2c, key);
                break;
            }
        case "AES-GCM":
            {
                if (typeof joseHeader.iv != "string") throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]('JOSE Header "iv" (Initialization Vector) missing or invalid');
                if (typeof joseHeader.tag != "string") throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]('JOSE Header "tag" (Authentication Tag) missing or invalid');
                const iv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decodeBase64url"])(joseHeader.iv, "iv", __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]), tag = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decodeBase64url"])(joseHeader.tag, "tag", __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]);
                if (iv.byteLength !== 12) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]("Invalid Initialization Vector length");
                if (tag.byteLength !== 16) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWEInvalid"]("Invalid Authentication Tag length");
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$content_encryption$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decrypt"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwe_algorithms$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jweEncryption"])(alg.slice(0, -2)), key, encryptedKey, iv, tag, new Uint8Array());
            }
    }
    return aeskwUnwrap(alg.slice(-6), key, encryptedKey);
}
async function encryptKeyManagement(entry, enc, inputKey, joseHeader, providedCek, providedParameters = {}) {
    const { alg, mode } = entry, transport = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwe_algorithms$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isJWECEKTransport"])(entry);
    if (providedCek !== void 0 && !transport) throw new TypeError(`setContentEncryptionKey cannot be called with JWE "alg" (Algorithm) Header ${alg}`);
    let key = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["prepareKey"])(mode === "direct-encryption" ? enc : entry, inputKey, "encrypt");
    if (mode === "direct-encryption") return [
        key,
        void 0,
        void 0
    ];
    const cek = transport ? providedCek ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$content_encryption$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["generateCek"])(enc) : void 0;
    cek && (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$content_encryption$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["checkCekLength"])(cek, enc.cekBits);
    let encryptedKey, parameters;
    switch(entry.subtle.name){
        case "ECDH":
            {
                assertEcdhKey(key);
                const { apu: providedApu, apv: providedApv } = providedParameters;
                providedApu !== void 0 && (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["assertUint8Array"])(providedApu, '"apu"'), providedApv !== void 0 && (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["assertUint8Array"])(providedApv, '"apv"');
                const apu = providedApu ?? partyInfo(joseHeader, "apu"), apv = providedApv ?? partyInfo(joseHeader, "apv");
                checkPartyInfo(apu, apv);
                let ephemeralKey;
                providedParameters.epk !== void 0 ? ephemeralKey = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["prepareKey"])(entry, providedParameters.epk, "decrypt") : ephemeralKey = (await crypto.subtle.generateKey(key.algorithm, !0, [
                    "deriveBits"
                ])).privateKey;
                const subtle = crypto.subtle;
                let exportableEpk = ephemeralKey;
                if (!exportableEpk.extractable) {
                    if (typeof subtle.getPublicKey != "function") throw new TypeError('CryptoKey for "epk" must be extractable');
                    exportableEpk = await subtle.getPublicKey(ephemeralKey, []);
                }
                const { x, y, crv, kty } = await subtle.exportKey("jwk", exportableEpk), direct = mode === "direct-key-agreement", sharedSecret = await ecdhesDeriveKey(key, ephemeralKey, direct ? enc.alg : alg, direct ? enc.cekBits : parseInt(alg.slice(-5, -2), 10), apu, apv), epk = {
                    x,
                    crv,
                    kty
                };
                if (kty === "EC" && (epk.y = y), parameters = {
                    epk
                }, providedApu !== void 0 && (parameters.apu = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encode"])(providedApu)), providedApv !== void 0 && (parameters.apv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encode"])(providedApv)), direct) return [
                    sharedSecret,
                    void 0,
                    parameters
                ];
                key = sharedSecret;
                break;
            }
        case "RSA-OAEP":
            {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$key$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["assertCryptoKey"])(key), checkRsaKey(alg, key, "encrypt"), encryptedKey = new Uint8Array(await crypto.subtle.encrypt("RSA-OAEP", key, cek));
                break;
            }
        case "PBKDF2":
            {
                const { p2c = 2048, p2s = crypto.getRandomValues(new Uint8Array(16)) } = providedParameters;
                key = await deriveKey(p2s, alg, p2c, key), parameters = {
                    p2c,
                    p2s: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encode"])(p2s)
                };
                break;
            }
        case "AES-GCM":
            {
                const iv = providedParameters.iv === void 0 ? crypto.getRandomValues(new Uint8Array(12)) : providedParameters.iv;
                if (!(iv instanceof Uint8Array)) throw new TypeError('"iv" must be an instance of Uint8Array');
                const wrapped = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$content_encryption$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encrypt"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$jwe_algorithms$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jweEncryption"])(alg.slice(0, -2)), cek, key, iv, new Uint8Array());
                encryptedKey = wrapped.ciphertext, parameters = {
                    iv: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encode"])(wrapped.iv),
                    tag: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encode"])(wrapped.tag)
                };
            }
    }
    if (encryptedKey ??= await aeskwWrap(alg.slice(-6), key, cek), !(encryptedKey instanceof Uint8Array) || !encryptedKey.byteLength) throw new TypeError("JWE key management algorithm did not produce an Encrypted Key");
    return [
        cek,
        encryptedKey,
        parameters
    ];
}
;
}),
"[project]/web/node_modules/jose/dist/webapi/lib/validate.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "JWE_RECOGNIZED",
    ()=>JWE_RECOGNIZED,
    "JWS_RECOGNIZED",
    ()=>JWS_RECOGNIZED,
    "assertNotSet",
    ()=>assertNotSet,
    "assertUint8Array",
    ()=>assertUint8Array,
    "decodeBase64url",
    ()=>decodeBase64url,
    "encodeBase64url",
    ()=>encodeBase64url,
    "isDisjoint",
    ()=>isDisjoint,
    "isJwkSet",
    ()=>isJwkSet,
    "isObject",
    ()=>isObject,
    "parseJoseHeader",
    ()=>parseJoseHeader,
    "serializeJoseHeader",
    ()=>serializeJoseHeader,
    "validateAlgorithms",
    ()=>validateAlgorithms,
    "validateB64",
    ()=>validateB64,
    "validateCrit",
    ()=>validateCrit,
    "validateCritDuplicates",
    ()=>validateCritDuplicates
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/util/errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/util/base64url.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/buffer_utils.js [middleware] (ecmascript)");
;
;
;
function assertUint8Array(input, label) {
    if (!(input instanceof Uint8Array)) throw new TypeError(`${label} must be an instance of Uint8Array`);
}
function isObject(input) {
    if (typeof input != "object" || input === null || Object.prototype.toString.call(input) !== "[object Object]") return !1;
    const prototype = Object.getPrototypeOf(input);
    return prototype === null || Object.getPrototypeOf(prototype) === null;
}
function isJwkSet(input) {
    return isObject(input) && Array.isArray(input.keys) && Array.from(input.keys).every(isObject);
}
function isDisjoint(...headers) {
    const parameters = /* @__PURE__ */ new Set();
    for (const header of headers)if (header) for (const parameter of Object.keys(header)){
        if (parameters.has(parameter)) return !1;
        parameters.add(parameter);
    }
    return !0;
}
function assertNotSet(value, name) {
    if (value !== void 0) throw new TypeError(`${name} can only be called once`);
}
function decodeBase64url(value, label, ErrorClass) {
    try {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decode"])(value);
    } catch  {
        throw new ErrorClass(`Failed to base64url decode the ${label}`);
    }
}
function encodeBase64url(value, label, ErrorClass) {
    try {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encode"])(value);
    } catch  {
        throw new ErrorClass(`The ${label} is not a valid base64url string`);
    }
}
function parseJoseHeader(b64, ErrorClass, message) {
    let parsed;
    try {
        parsed = JSON.parse(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["strictDecoder"].decode((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decode"])(b64)));
    } catch  {
        throw new ErrorClass(message);
    }
    if (!isObject(parsed)) throw new ErrorClass(message);
    return parsed;
}
const JWS_RECOGNIZED = {
    __proto__: null,
    b64: !0
}, JWE_RECOGNIZED = {
    __proto__: null
};
function validateAlgorithms(option, algorithms) {
    if (algorithms !== void 0 && (!Array.isArray(algorithms) || algorithms.some((s)=>typeof s != "string"))) throw new TypeError(`"${option}" option must be an array of strings`);
    return algorithms === void 0 ? void 0 : new Set(algorithms);
}
function validateCritDuplicates(Err, protectedHeader) {
    const { crit } = protectedHeader ?? {};
    if (Array.isArray(crit) && new Set(crit).size !== crit.length) throw new Err('"crit" (Critical) Header Parameter MUST NOT contain duplicate values');
}
function validateCrit(Err, recognizedDefault, recognizedOption, protectedHeader, joseHeader) {
    if (joseHeader.crit !== void 0 && protectedHeader?.crit === void 0) throw new Err('"crit" (Critical) Header Parameter MUST be integrity protected');
    if (!protectedHeader || protectedHeader.crit === void 0) return [];
    if (!Array.isArray(protectedHeader.crit) || protectedHeader.crit.length === 0 || protectedHeader.crit.some((input)=>typeof input != "string" || input.length === 0)) throw new Err('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
    const recognized = recognizedOption === void 0 ? recognizedDefault : {
        __proto__: null,
        ...recognizedOption,
        ...recognizedDefault
    };
    for (const parameter of protectedHeader.crit){
        if (!(parameter in recognized)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JOSENotSupported"](`Extension Header Parameter "${parameter}" is not recognized`);
        if (!Object.hasOwn(joseHeader, parameter) || joseHeader[parameter] === void 0) throw new Err(`Extension Header Parameter "${parameter}" is missing`);
        if (recognized[parameter] && (!Object.hasOwn(protectedHeader, parameter) || protectedHeader[parameter] === void 0)) throw new Err(`Extension Header Parameter "${parameter}" MUST be integrity protected`);
    }
    return protectedHeader.crit;
}
function validateB64(protectedHeader, extensions) {
    if (extensions.includes("b64")) {
        const b64 = protectedHeader.b64;
        if (typeof b64 != "boolean") throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWSInvalid"]('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
        return b64;
    }
    return !0;
}
function serializeJoseHeader(Err, header) {
    let serialized, parsed;
    try {
        serialized = JSON.stringify(header), parsed = JSON.parse(serialized);
    } catch (cause) {
        throw new Err("JOSE Header is not valid JSON", {
            cause
        });
    }
    if (!isObject(parsed)) throw new Err("JOSE Header is not a JSON object");
    return [
        parsed,
        serialized
    ];
}
;
}),
"[project]/web/node_modules/jose/dist/webapi/util/base64url.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "decode",
    ()=>decode,
    "encode",
    ()=>encode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/buffer_utils.js [middleware] (ecmascript)");
;
const invalid = "The input to be decoded is not correctly encoded.";
function decode(input) {
    try {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decodeBase64"])(typeof input == "string" ? input : __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decoder"].decode(input), !0);
    } catch (cause) {
        throw new TypeError(invalid, {
            cause
        });
    }
}
function encode(input) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encodeBase64"])(typeof input == "string" ? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encoder"].encode(input) : input, !0);
}
;
}),
"[project]/web/node_modules/jose/dist/webapi/util/base64url.js [middleware] (ecmascript) <export * as base64url>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "base64url",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/util/base64url.js [middleware] (ecmascript)");
}),
"[project]/web/node_modules/jose/dist/webapi/util/decode_jwt.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "decodeJwt",
    ()=>decodeJwt
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/util/base64url.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/buffer_utils.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/lib/validate.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/util/errors.js [middleware] (ecmascript)");
;
;
;
;
function decodeJwt(jwt) {
    if (typeof jwt != "string") throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWTInvalid"]("JWTs must use Compact JWS serialization, JWT must be a string");
    const { 1: payload, length } = jwt.split(".");
    if (length === 5) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWTInvalid"]("Only JWTs using Compact JWS serialization can be decoded");
    if (length !== 3) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWTInvalid"]("Invalid JWT");
    if (!payload) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWTInvalid"]("JWTs must contain a payload");
    let decoded;
    try {
        decoded = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decode"])(payload);
    } catch  {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWTInvalid"]("Failed to base64url decode the payload");
    }
    let result;
    try {
        result = JSON.parse(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$buffer_utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["strictDecoder"].decode(decoded));
    } catch  {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWTInvalid"]("Failed to parse the decoded payload as JSON");
    }
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$lib$2f$validate$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isObject"])(result)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWTInvalid"]("Invalid JWT Claims Set");
    return result;
}
;
}),
"[project]/web/node_modules/jose/dist/webapi/util/errors.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "JOSEAlgNotAllowed",
    ()=>JOSEAlgNotAllowed,
    "JOSEError",
    ()=>JOSEError,
    "JOSENotSupported",
    ()=>JOSENotSupported,
    "JWEDecryptionFailed",
    ()=>JWEDecryptionFailed,
    "JWEInvalid",
    ()=>JWEInvalid,
    "JWKInvalid",
    ()=>JWKInvalid,
    "JWKSInvalid",
    ()=>JWKSInvalid,
    "JWKSMultipleMatchingKeys",
    ()=>JWKSMultipleMatchingKeys,
    "JWKSNoMatchingKey",
    ()=>JWKSNoMatchingKey,
    "JWKSTimeout",
    ()=>JWKSTimeout,
    "JWSInvalid",
    ()=>JWSInvalid,
    "JWSSignatureVerificationFailed",
    ()=>JWSSignatureVerificationFailed,
    "JWTClaimValidationFailed",
    ()=>JWTClaimValidationFailed,
    "JWTExpired",
    ()=>JWTExpired,
    "JWTInvalid",
    ()=>JWTInvalid
]);
class JOSEError extends Error {
    static code = "ERR_JOSE_GENERIC";
    code = "ERR_JOSE_GENERIC";
    constructor(message, options){
        super(message, options), this.name = this.constructor.name, Error.captureStackTrace?.(this, this.constructor);
    }
}
class JWTClaimValidationFailed extends JOSEError {
    static code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
    code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
    claim;
    reason;
    payload;
    constructor(message, payload, claim = "unspecified", reason = "unspecified"){
        super(message, {
            cause: {
                claim,
                reason,
                payload
            }
        }), this.claim = claim, this.reason = reason, this.payload = payload;
    }
}
class JWTExpired extends JOSEError {
    static code = "ERR_JWT_EXPIRED";
    code = "ERR_JWT_EXPIRED";
    claim;
    reason;
    payload;
    constructor(message, payload, claim = "unspecified", reason = "unspecified"){
        super(message, {
            cause: {
                claim,
                reason,
                payload
            }
        }), this.claim = claim, this.reason = reason, this.payload = payload;
    }
}
class JOSEAlgNotAllowed extends JOSEError {
    static code = "ERR_JOSE_ALG_NOT_ALLOWED";
    code = "ERR_JOSE_ALG_NOT_ALLOWED";
}
class JOSENotSupported extends JOSEError {
    static code = "ERR_JOSE_NOT_SUPPORTED";
    code = "ERR_JOSE_NOT_SUPPORTED";
}
class JWEDecryptionFailed extends JOSEError {
    static code = "ERR_JWE_DECRYPTION_FAILED";
    code = "ERR_JWE_DECRYPTION_FAILED";
    constructor(message = "decryption operation failed", options){
        super(message, options);
    }
}
class JWEInvalid extends JOSEError {
    static code = "ERR_JWE_INVALID";
    code = "ERR_JWE_INVALID";
}
class JWSInvalid extends JOSEError {
    static code = "ERR_JWS_INVALID";
    code = "ERR_JWS_INVALID";
}
class JWTInvalid extends JOSEError {
    static code = "ERR_JWT_INVALID";
    code = "ERR_JWT_INVALID";
}
class JWKInvalid extends JOSEError {
    static code = "ERR_JWK_INVALID";
    code = "ERR_JWK_INVALID";
}
class JWKSInvalid extends JOSEError {
    static code = "ERR_JWKS_INVALID";
    code = "ERR_JWKS_INVALID";
}
class JWKSNoMatchingKey extends JOSEError {
    static code = "ERR_JWKS_NO_MATCHING_KEY";
    code = "ERR_JWKS_NO_MATCHING_KEY";
    constructor(message = "no applicable key found in the JSON Web Key Set", options){
        super(message, options);
    }
}
class JWKSMultipleMatchingKeys extends JOSEError {
    [Symbol.asyncIterator] = async function*() {};
    static code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
    code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
    constructor(message = "multiple matching keys found in the JSON Web Key Set", options){
        super(message, options);
    }
}
class JWKSTimeout extends JOSEError {
    static code = "ERR_JWKS_TIMEOUT";
    code = "ERR_JWKS_TIMEOUT";
    constructor(message = "request timed out", options){
        super(message, options);
    }
}
class JWSSignatureVerificationFailed extends JOSEError {
    static code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
    code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
    constructor(message = "signature verification failed", options){
        super(message, options);
    }
}
;
}),
];})()

//# sourceMappingURL=0aq__jose_dist_webapi_0o7uq6c3ldwsk._.js.map