(()=>{"use strict";module.exports = [
"[project]/web/node_modules/@edge-runtime/cookies/dist/index.mjs [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RequestCookies",
    ()=>RequestCookies,
    "ResponseCookies",
    ()=>ResponseCookies,
    "parseCookie",
    ()=>parseCookie,
    "parseSetCookie",
    ()=>parseSetCookie,
    "stringifyCookie",
    ()=>stringifyCookie
]);
// src/serialize.ts
function stringifyCookie(c) {
    var _a;
    const attrs = [
        "path" in c && c.path && `Path=${c.path}`,
        "expires" in c && (c.expires || c.expires === 0) && `Expires=${(typeof c.expires === "number" ? new Date(c.expires) : c.expires).toUTCString()}`,
        "maxAge" in c && typeof c.maxAge === "number" && `Max-Age=${c.maxAge}`,
        "domain" in c && c.domain && `Domain=${c.domain}`,
        "secure" in c && c.secure && "Secure",
        "httpOnly" in c && c.httpOnly && "HttpOnly",
        "sameSite" in c && c.sameSite && `SameSite=${c.sameSite}`,
        "partitioned" in c && c.partitioned && "Partitioned",
        "priority" in c && c.priority && `Priority=${c.priority}`
    ].filter(Boolean);
    const stringified = `${c.name}=${encodeURIComponent((_a = c.value) != null ? _a : "")}`;
    return attrs.length === 0 ? stringified : `${stringified}; ${attrs.join("; ")}`;
}
function parseCookie(cookie) {
    const map = /* @__PURE__ */ new Map();
    for (const pair of cookie.split(/; */)){
        if (!pair) continue;
        const splitAt = pair.indexOf("=");
        if (splitAt === -1) {
            map.set(pair, "true");
            continue;
        }
        const [key, value] = [
            pair.slice(0, splitAt),
            pair.slice(splitAt + 1)
        ];
        try {
            map.set(key, decodeURIComponent(value != null ? value : "true"));
        } catch  {}
    }
    return map;
}
function parseSetCookie(setCookie) {
    if (!setCookie) {
        return void 0;
    }
    const [[name, value], ...attributes] = parseCookie(setCookie);
    const { domain, expires, httponly, maxage, path, samesite, secure, partitioned, priority } = Object.fromEntries(attributes.map(([key, value2])=>[
            key.toLowerCase().replace(/-/g, ""),
            value2
        ]));
    const cookie = {
        name,
        value: decodeURIComponent(value),
        domain,
        ...expires && {
            expires: new Date(expires)
        },
        ...httponly && {
            httpOnly: true
        },
        ...typeof maxage === "string" && {
            maxAge: Number(maxage)
        },
        path,
        ...samesite && {
            sameSite: parseSameSite(samesite)
        },
        ...secure && {
            secure: true
        },
        ...priority && {
            priority: parsePriority(priority)
        },
        ...partitioned && {
            partitioned: true
        }
    };
    return compact(cookie);
}
function compact(t) {
    const newT = {};
    for(const key in t){
        if (t[key]) {
            newT[key] = t[key];
        }
    }
    return newT;
}
var SAME_SITE = [
    "strict",
    "lax",
    "none"
];
function parseSameSite(string) {
    string = string.toLowerCase();
    return SAME_SITE.includes(string) ? string : void 0;
}
var PRIORITY = [
    "low",
    "medium",
    "high"
];
function parsePriority(string) {
    string = string.toLowerCase();
    return PRIORITY.includes(string) ? string : void 0;
}
function splitCookiesString(cookiesString) {
    if (!cookiesString) return [];
    var cookiesStrings = [];
    var pos = 0;
    var start;
    var ch;
    var lastComma;
    var nextStart;
    var cookiesSeparatorFound;
    function skipWhitespace() {
        while(pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))){
            pos += 1;
        }
        return pos < cookiesString.length;
    }
    function notSpecialChar() {
        ch = cookiesString.charAt(pos);
        return ch !== "=" && ch !== ";" && ch !== ",";
    }
    while(pos < cookiesString.length){
        start = pos;
        cookiesSeparatorFound = false;
        while(skipWhitespace()){
            ch = cookiesString.charAt(pos);
            if (ch === ",") {
                lastComma = pos;
                pos += 1;
                skipWhitespace();
                nextStart = pos;
                while(pos < cookiesString.length && notSpecialChar()){
                    pos += 1;
                }
                if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
                    cookiesSeparatorFound = true;
                    pos = nextStart;
                    cookiesStrings.push(cookiesString.substring(start, lastComma));
                    start = pos;
                } else {
                    pos = lastComma + 1;
                }
            } else {
                pos += 1;
            }
        }
        if (!cookiesSeparatorFound || pos >= cookiesString.length) {
            cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
        }
    }
    return cookiesStrings;
}
// src/request-cookies.ts
var RequestCookies = class {
    constructor(requestHeaders){
        /** @internal */ this._parsed = /* @__PURE__ */ new Map();
        this._headers = requestHeaders;
        const header = requestHeaders.get("cookie");
        if (header) {
            const parsed = parseCookie(header);
            for (const [name, value] of parsed){
                this._parsed.set(name, {
                    name,
                    value
                });
            }
        }
    }
    [Symbol.iterator]() {
        return this._parsed[Symbol.iterator]();
    }
    /**
   * The amount of cookies received from the client
   */ get size() {
        return this._parsed.size;
    }
    get(...args) {
        const name = typeof args[0] === "string" ? args[0] : args[0].name;
        return this._parsed.get(name);
    }
    getAll(...args) {
        var _a;
        const all = Array.from(this._parsed);
        if (!args.length) {
            return all.map(([_, value])=>value);
        }
        const name = typeof args[0] === "string" ? args[0] : (_a = args[0]) == null ? void 0 : _a.name;
        return all.filter(([n])=>n === name).map(([_, value])=>value);
    }
    has(name) {
        return this._parsed.has(name);
    }
    set(...args) {
        const [name, value] = args.length === 1 ? [
            args[0].name,
            args[0].value
        ] : args;
        const map = this._parsed;
        map.set(name, {
            name,
            value
        });
        this._headers.set("cookie", Array.from(map).map(([_, value2])=>stringifyCookie(value2)).join("; "));
        return this;
    }
    /**
   * Delete the cookies matching the passed name or names in the request.
   */ delete(names) {
        const map = this._parsed;
        const result = !Array.isArray(names) ? map.delete(names) : names.map((name)=>map.delete(name));
        this._headers.set("cookie", Array.from(map).map(([_, value])=>stringifyCookie(value)).join("; "));
        return result;
    }
    /**
   * Delete all the cookies in the cookies in the request.
   */ clear() {
        this.delete(Array.from(this._parsed.keys()));
        return this;
    }
    /**
   * Format the cookies in the request as a string for logging
   */ [Symbol.for("edge-runtime.inspect.custom")]() {
        return `RequestCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
    }
    toString() {
        return [
            ...this._parsed.values()
        ].map((v)=>`${v.name}=${encodeURIComponent(v.value)}`).join("; ");
    }
};
// src/response-cookies.ts
var ResponseCookies = class {
    constructor(responseHeaders){
        /** @internal */ this._parsed = /* @__PURE__ */ new Map();
        var _a, _b, _c;
        this._headers = responseHeaders;
        const setCookie = (_c = (_b = (_a = responseHeaders.getSetCookie) == null ? void 0 : _a.call(responseHeaders)) != null ? _b : responseHeaders.get("set-cookie")) != null ? _c : [];
        const cookieStrings = Array.isArray(setCookie) ? setCookie : splitCookiesString(setCookie);
        for (const cookieString of cookieStrings){
            const parsed = parseSetCookie(cookieString);
            if (parsed) this._parsed.set(parsed.name, parsed);
        }
    }
    /**
   * {@link https://wicg.github.io/cookie-store/#CookieStore-get CookieStore#get} without the Promise.
   */ get(...args) {
        const key = typeof args[0] === "string" ? args[0] : args[0].name;
        return this._parsed.get(key);
    }
    /**
   * {@link https://wicg.github.io/cookie-store/#CookieStore-getAll CookieStore#getAll} without the Promise.
   */ getAll(...args) {
        var _a;
        const all = Array.from(this._parsed.values());
        if (!args.length) {
            return all;
        }
        const key = typeof args[0] === "string" ? args[0] : (_a = args[0]) == null ? void 0 : _a.name;
        return all.filter((c)=>c.name === key);
    }
    has(name) {
        return this._parsed.has(name);
    }
    /**
   * {@link https://wicg.github.io/cookie-store/#CookieStore-set CookieStore#set} without the Promise.
   */ set(...args) {
        const [name, value, cookie] = args.length === 1 ? [
            args[0].name,
            args[0].value,
            args[0]
        ] : args;
        const map = this._parsed;
        map.set(name, normalizeCookie({
            name,
            value,
            ...cookie
        }));
        replace(map, this._headers);
        return this;
    }
    /**
   * {@link https://wicg.github.io/cookie-store/#CookieStore-delete CookieStore#delete} without the Promise.
   */ delete(...args) {
        const [name, options] = typeof args[0] === "string" ? [
            args[0]
        ] : [
            args[0].name,
            args[0]
        ];
        return this.set({
            ...options,
            name,
            value: "",
            expires: /* @__PURE__ */ new Date(0)
        });
    }
    [Symbol.for("edge-runtime.inspect.custom")]() {
        return `ResponseCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
    }
    toString() {
        return [
            ...this._parsed.values()
        ].map(stringifyCookie).join("; ");
    }
};
function replace(bag, headers) {
    headers.delete("set-cookie");
    for (const [, value] of bag){
        const serialized = stringifyCookie(value);
        headers.append("set-cookie", serialized);
    }
}
function normalizeCookie(cookie = {
    name: "",
    value: ""
}) {
    if (typeof cookie.expires === "number") {
        cookie.expires = new Date(cookie.expires);
    }
    if (cookie.maxAge) {
        cookie.expires = new Date(Date.now() + cookie.maxAge * 1e3);
    }
    if (cookie.path === null || cookie.path === void 0) {
        cookie.path = "/";
    }
    return cookie;
}
;
}),
"[project]/web/node_modules/@panva/hkdf/dist/node/esm/index.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>hkdf,
    "hkdf",
    ()=>hkdf
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$panva$2f$hkdf$2f$dist$2f$node$2f$esm$2f$runtime$2f$hkdf$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@panva/hkdf/dist/node/esm/runtime/hkdf.js [middleware] (ecmascript)");
;
function normalizeDigest(digest) {
    switch(digest){
        case 'sha256':
        case 'sha384':
        case 'sha512':
        case 'sha1':
            return digest;
        default:
            throw new TypeError('unsupported "digest" value');
    }
}
function normalizeUint8Array(input, label) {
    if (typeof input === 'string') return new TextEncoder().encode(input);
    if (!(input instanceof Uint8Array)) throw new TypeError(`"${label}"" must be an instance of Uint8Array or a string`);
    return input;
}
function normalizeIkm(input) {
    const ikm = normalizeUint8Array(input, 'ikm');
    if (!ikm.byteLength) throw new TypeError(`"ikm" must be at least one byte in length`);
    return ikm;
}
function normalizeInfo(input) {
    const info = normalizeUint8Array(input, 'info');
    if (info.byteLength > 1024) {
        throw TypeError('"info" must not contain more than 1024 bytes');
    }
    return info;
}
function normalizeKeylen(input, digest) {
    if (typeof input !== 'number' || !Number.isInteger(input) || input < 1) {
        throw new TypeError('"keylen" must be a positive integer');
    }
    const hashlen = parseInt(digest.substr(3), 10) >> 3 || 20;
    if (input > 255 * hashlen) {
        throw new TypeError('"keylen" too large');
    }
    return input;
}
async function hkdf(digest, ikm, salt, info, keylen) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$panva$2f$hkdf$2f$dist$2f$node$2f$esm$2f$runtime$2f$hkdf$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["default"])(normalizeDigest(digest), normalizeIkm(ikm), normalizeUint8Array(salt, 'salt'), normalizeInfo(info), normalizeKeylen(keylen, digest));
}
;
}),
"[project]/web/node_modules/@panva/hkdf/dist/node/esm/runtime/fallback.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
const __TURBOPACK__default__export__ = (digest, ikm, salt, info, keylen)=>{
    const hashlen = parseInt(digest.substr(3), 10) >> 3 || 20;
    const prk = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["createHmac"])(digest, salt.byteLength ? salt : new Uint8Array(hashlen)).update(ikm).digest();
    const N = Math.ceil(keylen / hashlen);
    const T = new Uint8Array(hashlen * N + info.byteLength + 1);
    let prev = 0;
    let start = 0;
    for(let c = 1; c <= N; c++){
        T.set(info, start);
        T[start + info.byteLength] = c;
        T.set((0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["createHmac"])(digest, prk).update(T.subarray(prev, start + info.byteLength + 1)).digest(), start);
        prev = start;
        start += hashlen;
    }
    return T.slice(0, keylen);
};
}),
"[project]/web/node_modules/@panva/hkdf/dist/node/esm/runtime/hkdf.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$panva$2f$hkdf$2f$dist$2f$node$2f$esm$2f$runtime$2f$fallback$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@panva/hkdf/dist/node/esm/runtime/fallback.js [middleware] (ecmascript)");
;
;
let hkdf;
if (typeof __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["hkdf"] === 'function' && !process.versions.electron) {
    hkdf = async (...args)=>new Promise((resolve, reject)=>{
            __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["hkdf"](...args, (err, arrayBuffer)=>{
                if (err) reject(err);
                else resolve(new Uint8Array(arrayBuffer));
            });
        });
}
const __TURBOPACK__default__export__ = async (digest, ikm, salt, info, keylen)=>(hkdf || __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$panva$2f$hkdf$2f$dist$2f$node$2f$esm$2f$runtime$2f$fallback$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["default"])(digest, ikm, salt, info, keylen);
}),
"[project]/web/node_modules/oauth4webapi/build/index.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AUTHORIZATION_RESPONSE_ERROR",
    ()=>AUTHORIZATION_RESPONSE_ERROR,
    "AuthorizationResponseError",
    ()=>AuthorizationResponseError,
    "ClientSecretBasic",
    ()=>ClientSecretBasic,
    "ClientSecretJwt",
    ()=>ClientSecretJwt,
    "ClientSecretPost",
    ()=>ClientSecretPost,
    "DPoP",
    ()=>DPoP,
    "HTTP_REQUEST_FORBIDDEN",
    ()=>HTTP_REQUEST_FORBIDDEN,
    "INVALID_REQUEST",
    ()=>INVALID_REQUEST,
    "INVALID_RESPONSE",
    ()=>INVALID_RESPONSE,
    "INVALID_SERVER_METADATA",
    ()=>INVALID_SERVER_METADATA,
    "JSON_ATTRIBUTE_COMPARISON",
    ()=>JSON_ATTRIBUTE_COMPARISON,
    "JWT_CLAIM_COMPARISON",
    ()=>JWT_CLAIM_COMPARISON,
    "JWT_TIMESTAMP_CHECK",
    ()=>JWT_TIMESTAMP_CHECK,
    "JWT_USERINFO_EXPECTED",
    ()=>JWT_USERINFO_EXPECTED,
    "KEY_SELECTION",
    ()=>KEY_SELECTION,
    "MISSING_SERVER_METADATA",
    ()=>MISSING_SERVER_METADATA,
    "None",
    ()=>None,
    "OperationProcessingError",
    ()=>OperationProcessingError,
    "PARSE_ERROR",
    ()=>PARSE_ERROR,
    "PrivateKeyJwt",
    ()=>PrivateKeyJwt,
    "REQUEST_PROTOCOL_FORBIDDEN",
    ()=>REQUEST_PROTOCOL_FORBIDDEN,
    "RESPONSE_BODY_ERROR",
    ()=>RESPONSE_BODY_ERROR,
    "RESPONSE_IS_NOT_CONFORM",
    ()=>RESPONSE_IS_NOT_CONFORM,
    "RESPONSE_IS_NOT_JSON",
    ()=>RESPONSE_IS_NOT_JSON,
    "ResponseBodyError",
    ()=>ResponseBodyError,
    "TlsClientAuth",
    ()=>TlsClientAuth,
    "UNSUPPORTED_OPERATION",
    ()=>UNSUPPORTED_OPERATION,
    "UnsupportedOperationError",
    ()=>UnsupportedOperationError,
    "WWWAuthenticateChallengeError",
    ()=>WWWAuthenticateChallengeError,
    "WWW_AUTHENTICATE_CHALLENGE",
    ()=>WWW_AUTHENTICATE_CHALLENGE,
    "_expectedIssuer",
    ()=>_expectedIssuer,
    "_nodiscoverycheck",
    ()=>_nodiscoverycheck,
    "_nopkce",
    ()=>_nopkce,
    "allowInsecureRequests",
    ()=>allowInsecureRequests,
    "authorizationCodeGrantRequest",
    ()=>authorizationCodeGrantRequest,
    "backchannelAuthenticationGrantRequest",
    ()=>backchannelAuthenticationGrantRequest,
    "backchannelAuthenticationRequest",
    ()=>backchannelAuthenticationRequest,
    "calculatePKCECodeChallenge",
    ()=>calculatePKCECodeChallenge,
    "checkProtocol",
    ()=>checkProtocol,
    "clientCredentialsGrantRequest",
    ()=>clientCredentialsGrantRequest,
    "clockSkew",
    ()=>clockSkew,
    "clockTolerance",
    ()=>clockTolerance,
    "customFetch",
    ()=>customFetch,
    "deviceAuthorizationRequest",
    ()=>deviceAuthorizationRequest,
    "deviceCodeGrantRequest",
    ()=>deviceCodeGrantRequest,
    "discoveryRequest",
    ()=>discoveryRequest,
    "dynamicClientRegistrationRequest",
    ()=>dynamicClientRegistrationRequest,
    "expectNoNonce",
    ()=>expectNoNonce,
    "expectNoState",
    ()=>expectNoState,
    "formPostResponse",
    ()=>formPostResponse,
    "generateKeyPair",
    ()=>generateKeyPair,
    "generateRandomCodeVerifier",
    ()=>generateRandomCodeVerifier,
    "generateRandomNonce",
    ()=>generateRandomNonce,
    "generateRandomState",
    ()=>generateRandomState,
    "genericTokenEndpointRequest",
    ()=>genericTokenEndpointRequest,
    "getContentType",
    ()=>getContentType,
    "getValidatedIdTokenClaims",
    ()=>getValidatedIdTokenClaims,
    "introspectionRequest",
    ()=>introspectionRequest,
    "isDPoPNonceError",
    ()=>isDPoPNonceError,
    "issueRequestObject",
    ()=>issueRequestObject,
    "jweDecrypt",
    ()=>jweDecrypt,
    "jwksCache",
    ()=>jwksCache,
    "modifyAssertion",
    ()=>modifyAssertion,
    "nopkce",
    ()=>nopkce,
    "processAuthorizationCodeResponse",
    ()=>processAuthorizationCodeResponse,
    "processBackchannelAuthenticationGrantResponse",
    ()=>processBackchannelAuthenticationGrantResponse,
    "processBackchannelAuthenticationResponse",
    ()=>processBackchannelAuthenticationResponse,
    "processClientCredentialsResponse",
    ()=>processClientCredentialsResponse,
    "processDeviceAuthorizationResponse",
    ()=>processDeviceAuthorizationResponse,
    "processDeviceCodeResponse",
    ()=>processDeviceCodeResponse,
    "processDiscoveryResponse",
    ()=>processDiscoveryResponse,
    "processDynamicClientRegistrationResponse",
    ()=>processDynamicClientRegistrationResponse,
    "processGenericTokenEndpointResponse",
    ()=>processGenericTokenEndpointResponse,
    "processIntrospectionResponse",
    ()=>processIntrospectionResponse,
    "processPushedAuthorizationResponse",
    ()=>processPushedAuthorizationResponse,
    "processRefreshTokenResponse",
    ()=>processRefreshTokenResponse,
    "processResourceDiscoveryResponse",
    ()=>processResourceDiscoveryResponse,
    "processRevocationResponse",
    ()=>processRevocationResponse,
    "processUserInfoResponse",
    ()=>processUserInfoResponse,
    "protectedResourceRequest",
    ()=>protectedResourceRequest,
    "pushedAuthorizationRequest",
    ()=>pushedAuthorizationRequest,
    "refreshTokenGrantRequest",
    ()=>refreshTokenGrantRequest,
    "resolveEndpoint",
    ()=>resolveEndpoint,
    "resourceDiscoveryRequest",
    ()=>resourceDiscoveryRequest,
    "revocationRequest",
    ()=>revocationRequest,
    "skipAuthTimeCheck",
    ()=>skipAuthTimeCheck,
    "skipStateCheck",
    ()=>skipStateCheck,
    "skipSubjectCheck",
    ()=>skipSubjectCheck,
    "userInfoRequest",
    ()=>userInfoRequest,
    "validateApplicationLevelSignature",
    ()=>validateApplicationLevelSignature,
    "validateAuthResponse",
    ()=>validateAuthResponse,
    "validateCodeIdTokenResponse",
    ()=>validateCodeIdTokenResponse,
    "validateDetachedSignatureResponse",
    ()=>validateDetachedSignatureResponse,
    "validateJwtAccessToken",
    ()=>validateJwtAccessToken,
    "validateJwtAuthResponse",
    ()=>validateJwtAuthResponse
]);
let USER_AGENT;
if (typeof navigator === 'undefined' || !navigator.userAgent?.startsWith?.('Mozilla/5.0 ')) {
    const NAME = 'oauth4webapi';
    const VERSION = 'v3.8.8';
    USER_AGENT = `${NAME}/${VERSION}`;
}
function looseInstanceOf(input, expected) {
    if (input == null) {
        return false;
    }
    try {
        return input instanceof expected || Object.getPrototypeOf(input)[Symbol.toStringTag] === expected.prototype[Symbol.toStringTag];
    } catch  {
        return false;
    }
}
const ERR_INVALID_ARG_VALUE = 'ERR_INVALID_ARG_VALUE';
const ERR_INVALID_ARG_TYPE = 'ERR_INVALID_ARG_TYPE';
function CodedTypeError(message, code, cause) {
    const err = new TypeError(message, {
        cause
    });
    Object.assign(err, {
        code
    });
    return err;
}
const allowInsecureRequests = Symbol();
const clockSkew = Symbol();
const clockTolerance = Symbol();
const customFetch = Symbol();
const modifyAssertion = Symbol();
const jweDecrypt = Symbol();
const jwksCache = Symbol();
const encoder = new TextEncoder();
const decoder = new TextDecoder();
function buf(input) {
    if (typeof input === 'string') {
        return encoder.encode(input);
    }
    return decoder.decode(input);
}
let encodeBase64Url;
if (Uint8Array.prototype.toBase64) {
    encodeBase64Url = (input)=>{
        if (input instanceof ArrayBuffer) {
            input = new Uint8Array(input);
        }
        return input.toBase64({
            alphabet: 'base64url',
            omitPadding: true
        });
    };
} else {
    const CHUNK_SIZE = 0x8000;
    encodeBase64Url = (input)=>{
        if (input instanceof ArrayBuffer) {
            input = new Uint8Array(input);
        }
        const arr = [];
        for(let i = 0; i < input.byteLength; i += CHUNK_SIZE){
            arr.push(String.fromCharCode.apply(null, input.subarray(i, i + CHUNK_SIZE)));
        }
        return btoa(arr.join('')).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    };
}
let decodeBase64Url;
if (Uint8Array.fromBase64) {
    decodeBase64Url = (input)=>{
        try {
            return Uint8Array.fromBase64(input, {
                alphabet: 'base64url'
            });
        } catch (cause) {
            throw CodedTypeError('The input to be decoded is not correctly encoded.', ERR_INVALID_ARG_VALUE, cause);
        }
    };
} else {
    decodeBase64Url = (input)=>{
        try {
            const binary = atob(input.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, ''));
            const bytes = new Uint8Array(binary.length);
            for(let i = 0; i < binary.length; i++){
                bytes[i] = binary.charCodeAt(i);
            }
            return bytes;
        } catch (cause) {
            throw CodedTypeError('The input to be decoded is not correctly encoded.', ERR_INVALID_ARG_VALUE, cause);
        }
    };
}
function b64u(input) {
    if (typeof input === 'string') {
        return decodeBase64Url(input);
    }
    return encodeBase64Url(input);
}
class UnsupportedOperationError extends Error {
    code;
    constructor(message, options){
        super(message, options);
        this.name = this.constructor.name;
        this.code = UNSUPPORTED_OPERATION;
        Error.captureStackTrace?.(this, this.constructor);
    }
}
class OperationProcessingError extends Error {
    code;
    constructor(message, options){
        super(message, options);
        this.name = this.constructor.name;
        if (options?.code) {
            this.code = options?.code;
        }
        Error.captureStackTrace?.(this, this.constructor);
    }
}
function OPE(message, code, cause) {
    return new OperationProcessingError(message, {
        code,
        cause
    });
}
async function calculateJwkThumbprint(jwk) {
    let components;
    switch(jwk.kty){
        case 'EC':
            components = {
                crv: jwk.crv,
                kty: jwk.kty,
                x: jwk.x,
                y: jwk.y
            };
            break;
        case 'OKP':
            components = {
                crv: jwk.crv,
                kty: jwk.kty,
                x: jwk.x
            };
            break;
        case 'AKP':
            components = {
                alg: jwk.alg,
                kty: jwk.kty,
                pub: jwk.pub
            };
            break;
        case 'RSA':
            components = {
                e: jwk.e,
                kty: jwk.kty,
                n: jwk.n
            };
            break;
        default:
            throw new UnsupportedOperationError('unsupported JWK key type', {
                cause: jwk
            });
    }
    return b64u(await crypto.subtle.digest('SHA-256', buf(JSON.stringify(components))));
}
function assertCryptoKey(key, it) {
    if (!(key instanceof CryptoKey)) {
        throw CodedTypeError(`${it} must be a CryptoKey`, ERR_INVALID_ARG_TYPE);
    }
}
function assertPrivateKey(key, it) {
    assertCryptoKey(key, it);
    if (key.type !== 'private') {
        throw CodedTypeError(`${it} must be a private CryptoKey`, ERR_INVALID_ARG_VALUE);
    }
}
function assertPublicKey(key, it) {
    assertCryptoKey(key, it);
    if (key.type !== 'public') {
        throw CodedTypeError(`${it} must be a public CryptoKey`, ERR_INVALID_ARG_VALUE);
    }
}
function normalizeTyp(value) {
    return value.toLowerCase().replace(/^application\//, '');
}
function isJsonObject(input) {
    if (input === null || typeof input !== 'object' || Array.isArray(input)) {
        return false;
    }
    return true;
}
function prepareHeaders(input) {
    if (looseInstanceOf(input, Headers)) {
        input = Object.fromEntries(input.entries());
    }
    const headers = new Headers(input ?? {});
    if (USER_AGENT && !headers.has('user-agent')) {
        headers.set('user-agent', USER_AGENT);
    }
    if (headers.has('authorization')) {
        throw CodedTypeError('"options.headers" must not include the "authorization" header name', ERR_INVALID_ARG_VALUE);
    }
    return headers;
}
function signal(url, value) {
    if (value !== undefined) {
        if (typeof value === 'function') {
            value = value(url.href);
        }
        if (!(value instanceof AbortSignal)) {
            throw CodedTypeError('"options.signal" must return or be an instance of AbortSignal', ERR_INVALID_ARG_TYPE);
        }
        return value;
    }
    return undefined;
}
function replaceDoubleSlash(pathname) {
    if (pathname.includes('//')) {
        return pathname.replace('//', '/');
    }
    return pathname;
}
function prependWellKnown(url, wellKnown, allowTerminatingSlash = false) {
    if (url.pathname === '/') {
        url.pathname = wellKnown;
    } else {
        url.pathname = replaceDoubleSlash(`${wellKnown}/${allowTerminatingSlash ? url.pathname : url.pathname.replace(/(\/)$/, '')}`);
    }
    return url;
}
function appendWellKnown(url, wellKnown) {
    url.pathname = replaceDoubleSlash(`${url.pathname}/${wellKnown}`);
    return url;
}
async function performDiscovery(input, urlName, transform, options) {
    if (!(input instanceof URL)) {
        throw CodedTypeError(`"${urlName}" must be an instance of URL`, ERR_INVALID_ARG_TYPE);
    }
    checkProtocol(input, options?.[allowInsecureRequests] !== true);
    const url = transform(new URL(input.href));
    const headers = prepareHeaders(options?.headers);
    headers.set('accept', 'application/json');
    return (options?.[customFetch] || fetch)(url.href, {
        body: undefined,
        headers: Object.fromEntries(headers.entries()),
        method: 'GET',
        redirect: 'manual',
        signal: signal(url, options?.signal)
    });
}
async function discoveryRequest(issuerIdentifier, options) {
    return performDiscovery(issuerIdentifier, 'issuerIdentifier', (url)=>{
        switch(options?.algorithm){
            case undefined:
            case 'oidc':
                appendWellKnown(url, '.well-known/openid-configuration');
                break;
            case 'oauth2':
                prependWellKnown(url, '.well-known/oauth-authorization-server');
                break;
            default:
                throw CodedTypeError('"options.algorithm" must be "oidc" (default), or "oauth2"', ERR_INVALID_ARG_VALUE);
        }
        return url;
    }, options);
}
function assertNumber(input, allow0, it, code, cause) {
    try {
        if (typeof input !== 'number' || !Number.isFinite(input)) {
            throw CodedTypeError(`${it} must be a number`, ERR_INVALID_ARG_TYPE, cause);
        }
        if (input > 0) return;
        if (allow0) {
            if (input !== 0) {
                throw CodedTypeError(`${it} must be a non-negative number`, ERR_INVALID_ARG_VALUE, cause);
            }
            return;
        }
        throw CodedTypeError(`${it} must be a positive number`, ERR_INVALID_ARG_VALUE, cause);
    } catch (err) {
        if (code) {
            throw OPE(err.message, code, cause);
        }
        throw err;
    }
}
function assertString(input, it, code, cause) {
    try {
        if (typeof input !== 'string') {
            throw CodedTypeError(`${it} must be a string`, ERR_INVALID_ARG_TYPE, cause);
        }
        if (input.length === 0) {
            throw CodedTypeError(`${it} must not be empty`, ERR_INVALID_ARG_VALUE, cause);
        }
    } catch (err) {
        if (code) {
            throw OPE(err.message, code, cause);
        }
        throw err;
    }
}
async function processDiscoveryResponse(expectedIssuerIdentifier, response) {
    const expected = expectedIssuerIdentifier;
    if (!(expected instanceof URL) && expected !== _nodiscoverycheck) {
        throw CodedTypeError('"expectedIssuerIdentifier" must be an instance of URL', ERR_INVALID_ARG_TYPE);
    }
    if (!looseInstanceOf(response, Response)) {
        throw CodedTypeError('"response" must be an instance of Response', ERR_INVALID_ARG_TYPE);
    }
    if (response.status !== 200) {
        throw OPE('"response" is not a conform Authorization Server Metadata response (unexpected HTTP status code)', RESPONSE_IS_NOT_CONFORM, response);
    }
    assertReadableResponse(response);
    const json = await getResponseJsonBody(response);
    assertString(json.issuer, '"response" body "issuer" property', INVALID_RESPONSE, {
        body: json
    });
    if (expected !== _nodiscoverycheck && new URL(json.issuer).href !== expected.href) {
        throw OPE('"response" body "issuer" property does not match the expected value', JSON_ATTRIBUTE_COMPARISON, {
            expected: expected.href,
            body: json,
            attribute: 'issuer'
        });
    }
    return json;
}
function assertApplicationJson(response) {
    assertContentType(response, 'application/json');
}
function notJson(response, ...types) {
    let msg = '"response" content-type must be ';
    if (types.length > 2) {
        const last = types.pop();
        msg += `${types.join(', ')}, or ${last}`;
    } else if (types.length === 2) {
        msg += `${types[0]} or ${types[1]}`;
    } else {
        msg += types[0];
    }
    return OPE(msg, RESPONSE_IS_NOT_JSON, response);
}
function assertContentTypes(response, ...types) {
    if (!types.includes(getContentType(response))) {
        throw notJson(response, ...types);
    }
}
function assertContentType(response, contentType) {
    if (getContentType(response) !== contentType) {
        throw notJson(response, contentType);
    }
}
function randomBytes() {
    return b64u(crypto.getRandomValues(new Uint8Array(32)));
}
function generateRandomCodeVerifier() {
    return randomBytes();
}
function generateRandomState() {
    return randomBytes();
}
function generateRandomNonce() {
    return randomBytes();
}
async function calculatePKCECodeChallenge(codeVerifier) {
    assertString(codeVerifier, 'codeVerifier');
    return b64u(await crypto.subtle.digest('SHA-256', buf(codeVerifier)));
}
function getKeyAndKid(input) {
    if (input instanceof CryptoKey) {
        return {
            key: input
        };
    }
    if (!(input?.key instanceof CryptoKey)) {
        return {};
    }
    if (input.kid !== undefined) {
        assertString(input.kid, '"kid"');
    }
    return {
        key: input.key,
        kid: input.kid
    };
}
function psAlg(key) {
    switch(key.algorithm.hash.name){
        case 'SHA-256':
            return 'PS256';
        case 'SHA-384':
            return 'PS384';
        case 'SHA-512':
            return 'PS512';
        default:
            throw new UnsupportedOperationError('unsupported RsaHashedKeyAlgorithm hash name', {
                cause: key
            });
    }
}
function rsAlg(key) {
    switch(key.algorithm.hash.name){
        case 'SHA-256':
            return 'RS256';
        case 'SHA-384':
            return 'RS384';
        case 'SHA-512':
            return 'RS512';
        default:
            throw new UnsupportedOperationError('unsupported RsaHashedKeyAlgorithm hash name', {
                cause: key
            });
    }
}
function esAlg(key) {
    switch(key.algorithm.namedCurve){
        case 'P-256':
            return 'ES256';
        case 'P-384':
            return 'ES384';
        case 'P-521':
            return 'ES512';
        default:
            throw new UnsupportedOperationError('unsupported EcKeyAlgorithm namedCurve', {
                cause: key
            });
    }
}
function keyToJws(key) {
    switch(key.algorithm.name){
        case 'RSA-PSS':
            return psAlg(key);
        case 'RSASSA-PKCS1-v1_5':
            return rsAlg(key);
        case 'ECDSA':
            return esAlg(key);
        case 'Ed25519':
        case 'ML-DSA-44':
        case 'ML-DSA-65':
        case 'ML-DSA-87':
            return key.algorithm.name;
        case 'EdDSA':
            return 'Ed25519';
        default:
            throw new UnsupportedOperationError('unsupported CryptoKey algorithm name', {
                cause: key
            });
    }
}
function getClockSkew(client) {
    const skew = client?.[clockSkew];
    return typeof skew === 'number' && Number.isFinite(skew) ? skew : 0;
}
function getClockTolerance(client) {
    const tolerance = client?.[clockTolerance];
    return typeof tolerance === 'number' && Number.isFinite(tolerance) && Math.sign(tolerance) !== -1 ? tolerance : 30;
}
function epochTime() {
    return Math.floor(Date.now() / 1000);
}
function assertAs(as) {
    if (typeof as !== 'object' || as === null) {
        throw CodedTypeError('"as" must be an object', ERR_INVALID_ARG_TYPE);
    }
    assertString(as.issuer, '"as.issuer"');
}
function assertClient(client) {
    if (typeof client !== 'object' || client === null) {
        throw CodedTypeError('"client" must be an object', ERR_INVALID_ARG_TYPE);
    }
    assertString(client.client_id, '"client.client_id"');
}
function formUrlEncode(token) {
    return encodeURIComponent(token).replace(/(?:[-_.!~*'()]|%20)/g, (substring)=>{
        switch(substring){
            case '-':
            case '_':
            case '.':
            case '!':
            case '~':
            case '*':
            case "'":
            case '(':
            case ')':
                return `%${substring.charCodeAt(0).toString(16).toUpperCase()}`;
            case '%20':
                return '+';
            default:
                throw new Error();
        }
    });
}
function ClientSecretPost(clientSecret) {
    assertString(clientSecret, '"clientSecret"');
    return (_as, client, body, _headers)=>{
        body.set('client_id', client.client_id);
        body.set('client_secret', clientSecret);
    };
}
function ClientSecretBasic(clientSecret) {
    assertString(clientSecret, '"clientSecret"');
    return (_as, client, _body, headers)=>{
        const username = formUrlEncode(client.client_id);
        const password = formUrlEncode(clientSecret);
        const credentials = btoa(`${username}:${password}`);
        headers.set('authorization', `Basic ${credentials}`);
    };
}
function clientAssertionPayload(as, client) {
    const now = epochTime() + getClockSkew(client);
    return {
        jti: randomBytes(),
        aud: as.issuer,
        exp: now + 60,
        iat: now,
        nbf: now,
        iss: client.client_id,
        sub: client.client_id
    };
}
function PrivateKeyJwt(clientPrivateKey, options) {
    const { key, kid } = getKeyAndKid(clientPrivateKey);
    assertPrivateKey(key, '"clientPrivateKey.key"');
    return async (as, client, body, _headers)=>{
        const header = {
            alg: keyToJws(key),
            kid
        };
        const payload = clientAssertionPayload(as, client);
        options?.[modifyAssertion]?.(header, payload);
        body.set('client_id', client.client_id);
        body.set('client_assertion_type', 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer');
        body.set('client_assertion', await signJwt(header, payload, key));
    };
}
function ClientSecretJwt(clientSecret, options) {
    assertString(clientSecret, '"clientSecret"');
    const modify = options?.[modifyAssertion];
    let key;
    return async (as, client, body, _headers)=>{
        key ||= await crypto.subtle.importKey('raw', buf(clientSecret), {
            hash: 'SHA-256',
            name: 'HMAC'
        }, false, [
            'sign'
        ]);
        const header = {
            alg: 'HS256'
        };
        const payload = clientAssertionPayload(as, client);
        modify?.(header, payload);
        const data = `${b64u(buf(JSON.stringify(header)))}.${b64u(buf(JSON.stringify(payload)))}`;
        const hmac = await crypto.subtle.sign(key.algorithm, key, buf(data));
        body.set('client_id', client.client_id);
        body.set('client_assertion_type', 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer');
        body.set('client_assertion', `${data}.${b64u(new Uint8Array(hmac))}`);
    };
}
function None() {
    return (_as, client, body, _headers)=>{
        body.set('client_id', client.client_id);
    };
}
function TlsClientAuth() {
    return None();
}
async function signJwt(header, payload, key) {
    if (!key.usages.includes('sign')) {
        throw CodedTypeError('CryptoKey instances used for signing assertions must include "sign" in their "usages"', ERR_INVALID_ARG_VALUE);
    }
    const input = `${b64u(buf(JSON.stringify(header)))}.${b64u(buf(JSON.stringify(payload)))}`;
    const signature = b64u(await crypto.subtle.sign(keyToSubtle(key), key, buf(input)));
    return `${input}.${signature}`;
}
async function issueRequestObject(as, client, parameters, privateKey, options) {
    assertAs(as);
    assertClient(client);
    parameters = new URLSearchParams(parameters);
    const { key, kid } = getKeyAndKid(privateKey);
    assertPrivateKey(key, '"privateKey.key"');
    parameters.set('client_id', client.client_id);
    const now = epochTime() + getClockSkew(client);
    const claims = {
        ...Object.fromEntries(parameters.entries()),
        jti: randomBytes(),
        aud: as.issuer,
        exp: now + 60,
        iat: now,
        nbf: now,
        iss: client.client_id
    };
    let resource;
    if (parameters.has('resource') && (resource = parameters.getAll('resource')) && resource.length > 1) {
        claims.resource = resource;
    }
    {
        let value = parameters.get('max_age');
        if (value !== null) {
            claims.max_age = parseInt(value, 10);
            assertNumber(claims.max_age, true, '"max_age" parameter');
        }
    }
    {
        let value = parameters.get('claims');
        if (value !== null) {
            try {
                claims.claims = JSON.parse(value);
            } catch (cause) {
                throw OPE('failed to parse the "claims" parameter as JSON', PARSE_ERROR, cause);
            }
            if (!isJsonObject(claims.claims)) {
                throw CodedTypeError('"claims" parameter must be a JSON with a top level object', ERR_INVALID_ARG_VALUE);
            }
        }
    }
    {
        let value = parameters.get('authorization_details');
        if (value !== null) {
            try {
                claims.authorization_details = JSON.parse(value);
            } catch (cause) {
                throw OPE('failed to parse the "authorization_details" parameter as JSON', PARSE_ERROR, cause);
            }
            if (!Array.isArray(claims.authorization_details)) {
                throw CodedTypeError('"authorization_details" parameter must be a JSON with a top level array', ERR_INVALID_ARG_VALUE);
            }
        }
    }
    const header = {
        alg: keyToJws(key),
        typ: 'oauth-authz-req+jwt',
        kid
    };
    options?.[modifyAssertion]?.(header, claims);
    return signJwt(header, claims, key);
}
let jwkCache;
async function getSetPublicJwkCache(key, alg) {
    const { kty, e, n, x, y, crv, pub } = await crypto.subtle.exportKey('jwk', key);
    const jwk = {
        kty,
        e,
        n,
        x,
        y,
        crv,
        pub
    };
    if (kty === 'AKP') jwk.alg = alg;
    jwkCache.set(key, jwk);
    return jwk;
}
async function publicJwk(key, alg) {
    jwkCache ||= new WeakMap();
    return jwkCache.get(key) || getSetPublicJwkCache(key, alg);
}
const URLParse = URL.parse ? (url, base)=>URL.parse(url, base) : (url, base)=>{
    try {
        return new URL(url, base);
    } catch  {
        return null;
    }
};
function checkProtocol(url, enforceHttps) {
    if (enforceHttps && url.protocol !== 'https:') {
        throw OPE('only requests to HTTPS are allowed', HTTP_REQUEST_FORBIDDEN, url);
    }
    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
        throw OPE('only HTTP and HTTPS requests are allowed', REQUEST_PROTOCOL_FORBIDDEN, url);
    }
}
function validateEndpoint(value, endpoint, useMtlsAlias, enforceHttps) {
    let url;
    if (typeof value !== 'string' || !(url = URLParse(value))) {
        throw OPE(`authorization server metadata does not contain a valid ${useMtlsAlias ? `"as.mtls_endpoint_aliases.${endpoint}"` : `"as.${endpoint}"`}`, value === undefined ? MISSING_SERVER_METADATA : INVALID_SERVER_METADATA, {
            attribute: useMtlsAlias ? `mtls_endpoint_aliases.${endpoint}` : endpoint
        });
    }
    checkProtocol(url, enforceHttps);
    return url;
}
function resolveEndpoint(as, endpoint, useMtlsAlias, enforceHttps) {
    if (useMtlsAlias && as.mtls_endpoint_aliases && endpoint in as.mtls_endpoint_aliases) {
        return validateEndpoint(as.mtls_endpoint_aliases[endpoint], endpoint, useMtlsAlias, enforceHttps);
    }
    return validateEndpoint(as[endpoint], endpoint, useMtlsAlias, enforceHttps);
}
async function pushedAuthorizationRequest(as, client, clientAuthentication, parameters, options) {
    assertAs(as);
    assertClient(client);
    const url = resolveEndpoint(as, 'pushed_authorization_request_endpoint', client.use_mtls_endpoint_aliases, options?.[allowInsecureRequests] !== true);
    const body = new URLSearchParams(parameters);
    body.set('client_id', client.client_id);
    const headers = prepareHeaders(options?.headers);
    headers.set('accept', 'application/json');
    if (options?.DPoP !== undefined) {
        assertDPoP(options.DPoP);
        await options.DPoP.addProof(url, headers, 'POST');
    }
    const response = await authenticatedRequest(as, client, clientAuthentication, url, body, headers, options);
    options?.DPoP?.cacheNonce(response, url);
    return response;
}
class DPoPHandler {
    #header;
    #privateKey;
    #publicKey;
    #clockSkew;
    #modifyAssertion;
    #map;
    #jkt;
    constructor(client, keyPair, options){
        assertPrivateKey(keyPair?.privateKey, '"DPoP.privateKey"');
        assertPublicKey(keyPair?.publicKey, '"DPoP.publicKey"');
        if (!keyPair.publicKey.extractable) {
            throw CodedTypeError('"DPoP.publicKey.extractable" must be true', ERR_INVALID_ARG_VALUE);
        }
        this.#modifyAssertion = options?.[modifyAssertion];
        this.#clockSkew = getClockSkew(client);
        this.#privateKey = keyPair.privateKey;
        this.#publicKey = keyPair.publicKey;
        branded.add(this);
    }
    #get(key) {
        this.#map ||= new Map();
        let item = this.#map.get(key);
        if (item) {
            this.#map.delete(key);
            this.#map.set(key, item);
        }
        return item;
    }
    #set(key, val) {
        this.#map ||= new Map();
        this.#map.delete(key);
        if (this.#map.size === 100) {
            this.#map.delete(this.#map.keys().next().value);
        }
        this.#map.set(key, val);
    }
    async calculateThumbprint() {
        if (!this.#jkt) {
            const jwk = await crypto.subtle.exportKey('jwk', this.#publicKey);
            this.#jkt ||= await calculateJwkThumbprint(jwk);
        }
        return this.#jkt;
    }
    async addProof(url, headers, htm, accessToken) {
        const alg = keyToJws(this.#privateKey);
        this.#header ||= {
            alg,
            typ: 'dpop+jwt',
            jwk: await publicJwk(this.#publicKey, alg)
        };
        const nonce = this.#get(url.origin);
        const now = epochTime() + this.#clockSkew;
        const payload = {
            iat: now,
            jti: randomBytes(),
            htm,
            nonce,
            htu: `${url.origin}${url.pathname}`,
            ath: accessToken ? b64u(await crypto.subtle.digest('SHA-256', buf(accessToken))) : undefined
        };
        this.#modifyAssertion?.(this.#header, payload);
        headers.set('dpop', await signJwt(this.#header, payload, this.#privateKey));
    }
    cacheNonce(response, url) {
        try {
            const nonce = response.headers.get('dpop-nonce');
            if (nonce) {
                this.#set(url.origin, nonce);
            }
        } catch  {}
    }
}
function isDPoPNonceError(err) {
    if (err instanceof WWWAuthenticateChallengeError) {
        return err.cause.some((challenge)=>challenge.scheme === 'dpop' && challenge.parameters.error === 'use_dpop_nonce');
    }
    if (err instanceof ResponseBodyError) {
        return err.error === 'use_dpop_nonce';
    }
    return false;
}
function DPoP(client, keyPair, options) {
    return new DPoPHandler(client, keyPair, options);
}
class ResponseBodyError extends Error {
    cause;
    code;
    error;
    status;
    error_description;
    response;
    constructor(message, options){
        super(message, options);
        this.name = this.constructor.name;
        this.code = RESPONSE_BODY_ERROR;
        this.cause = options.cause;
        this.error = options.cause.error;
        this.status = options.response.status;
        this.error_description = options.cause.error_description;
        Object.defineProperty(this, 'response', {
            enumerable: false,
            value: options.response
        });
        Error.captureStackTrace?.(this, this.constructor);
    }
}
class AuthorizationResponseError extends Error {
    cause;
    code;
    error;
    error_description;
    constructor(message, options){
        super(message, options);
        this.name = this.constructor.name;
        this.code = AUTHORIZATION_RESPONSE_ERROR;
        this.cause = options.cause;
        this.error = options.cause.get('error');
        this.error_description = options.cause.get('error_description') ?? undefined;
        Error.captureStackTrace?.(this, this.constructor);
    }
}
class WWWAuthenticateChallengeError extends Error {
    cause;
    code;
    response;
    status;
    constructor(message, options){
        super(message, options);
        this.name = this.constructor.name;
        this.code = WWW_AUTHENTICATE_CHALLENGE;
        this.cause = options.cause;
        this.status = options.response.status;
        this.response = options.response;
        Object.defineProperty(this, 'response', {
            enumerable: false
        });
        Error.captureStackTrace?.(this, this.constructor);
    }
}
const tokenMatch = "[a-zA-Z0-9!#$%&\\'\\*\\+\\-\\.\\^_`\\|~]+";
const token68Match = '[a-zA-Z0-9\\-\\._\\~\\+\\/]+={0,2}';
const quotedMatch = '"((?:[^"\\\\]|\\\\[\\s\\S])*)"';
const quotedParamMatcher = '(' + tokenMatch + ')\\s*=\\s*' + quotedMatch;
const paramMatcher = '(' + tokenMatch + ')\\s*=\\s*(' + tokenMatch + ')';
const schemeRE = new RegExp('^[,\\s]*(' + tokenMatch + ')');
const quotedParamRE = new RegExp('^[,\\s]*' + quotedParamMatcher + '[,\\s]*(.*)');
const unquotedParamRE = new RegExp('^[,\\s]*' + paramMatcher + '[,\\s]*(.*)');
const token68ParamRE = new RegExp('^(' + token68Match + ')(?:$|[,\\s])(.*)');
function parseWwwAuthenticateChallenges(response) {
    if (!looseInstanceOf(response, Response)) {
        throw CodedTypeError('"response" must be an instance of Response', ERR_INVALID_ARG_TYPE);
    }
    const header = response.headers.get('www-authenticate');
    if (header === null) {
        return undefined;
    }
    const challenges = [];
    let rest = header;
    while(rest){
        let match = rest.match(schemeRE);
        const scheme = match?.['1'].toLowerCase();
        if (!scheme) {
            return undefined;
        }
        const afterScheme = rest.substring(match[0].length);
        if (afterScheme && !afterScheme.match(/^[\s,]/)) {
            return undefined;
        }
        const spaceMatch = afterScheme.match(/^\s+(.*)$/);
        const hasParameters = !!spaceMatch;
        rest = spaceMatch ? spaceMatch[1] : undefined;
        const parameters = {};
        let token68;
        if (hasParameters) {
            while(rest){
                let key;
                let value;
                if (match = rest.match(quotedParamRE)) {
                    ;
                    [, key, value, rest] = match;
                    if (value.includes('\\')) {
                        value = value.replace(/\\([\s\S])/g, '$1');
                    }
                    parameters[key.toLowerCase()] = value;
                    continue;
                }
                if (match = rest.match(unquotedParamRE)) {
                    ;
                    [, key, value, rest] = match;
                    parameters[key.toLowerCase()] = value;
                    continue;
                }
                if (match = rest.match(token68ParamRE)) {
                    if (Object.keys(parameters).length) {
                        break;
                    }
                    ;
                    [, token68, rest] = match;
                    break;
                }
                return undefined;
            }
        } else {
            rest = afterScheme || undefined;
        }
        const challenge = {
            scheme,
            parameters
        };
        if (token68) {
            challenge.token68 = token68;
        }
        challenges.push(challenge);
    }
    if (!challenges.length) {
        return undefined;
    }
    return challenges;
}
async function processPushedAuthorizationResponse(as, client, response) {
    assertAs(as);
    assertClient(client);
    if (!looseInstanceOf(response, Response)) {
        throw CodedTypeError('"response" must be an instance of Response', ERR_INVALID_ARG_TYPE);
    }
    await checkOAuthBodyError(response, 201, 'Pushed Authorization Request Endpoint');
    assertReadableResponse(response);
    const json = await getResponseJsonBody(response);
    assertString(json.request_uri, '"response" body "request_uri" property', INVALID_RESPONSE, {
        body: json
    });
    let expiresIn = typeof json.expires_in !== 'number' ? parseFloat(json.expires_in) : json.expires_in;
    assertNumber(expiresIn, true, '"response" body "expires_in" property', INVALID_RESPONSE, {
        body: json
    });
    json.expires_in = expiresIn;
    return json;
}
async function parseOAuthResponseErrorBody(response) {
    if (response.status > 399 && response.status < 500) {
        assertReadableResponse(response);
        assertApplicationJson(response);
        try {
            const json = await response.clone().json();
            if (isJsonObject(json) && typeof json.error === 'string' && json.error.length) {
                return json;
            }
        } catch  {}
    }
    return undefined;
}
async function checkOAuthBodyError(response, expected, label) {
    if (response.status !== expected) {
        checkAuthenticationChallenges(response);
        let err;
        if (err = await parseOAuthResponseErrorBody(response)) {
            await response.body?.cancel();
            throw new ResponseBodyError('server responded with an error in the response body', {
                cause: err,
                response
            });
        }
        throw OPE(`"response" is not a conform ${label} response (unexpected HTTP status code)`, RESPONSE_IS_NOT_CONFORM, response);
    }
}
function assertDPoP(option) {
    if (!branded.has(option)) {
        throw CodedTypeError('"options.DPoP" is not a valid DPoPHandle', ERR_INVALID_ARG_VALUE);
    }
}
async function resourceRequest(accessToken, method, url, headers, body, options) {
    assertString(accessToken, '"accessToken"');
    if (!(url instanceof URL)) {
        throw CodedTypeError('"url" must be an instance of URL', ERR_INVALID_ARG_TYPE);
    }
    checkProtocol(url, options?.[allowInsecureRequests] !== true);
    headers = prepareHeaders(headers);
    if (options?.DPoP) {
        assertDPoP(options.DPoP);
        await options.DPoP.addProof(url, headers, method.toUpperCase(), accessToken);
    }
    headers.set('authorization', `${headers.has('dpop') ? 'DPoP' : 'Bearer'} ${accessToken}`);
    const response = await (options?.[customFetch] || fetch)(url.href, {
        duplex: looseInstanceOf(body, ReadableStream) ? 'half' : undefined,
        body,
        headers: Object.fromEntries(headers.entries()),
        method,
        redirect: 'manual',
        signal: signal(url, options?.signal)
    });
    options?.DPoP?.cacheNonce(response, url);
    return response;
}
async function protectedResourceRequest(accessToken, method, url, headers, body, options) {
    const response = await resourceRequest(accessToken, method, url, headers, body, options);
    checkAuthenticationChallenges(response);
    return response;
}
async function userInfoRequest(as, client, accessToken, options) {
    assertAs(as);
    assertClient(client);
    const url = resolveEndpoint(as, 'userinfo_endpoint', client.use_mtls_endpoint_aliases, options?.[allowInsecureRequests] !== true);
    const headers = prepareHeaders(options?.headers);
    if (client.userinfo_signed_response_alg) {
        headers.set('accept', 'application/jwt');
    } else {
        headers.set('accept', 'application/json');
        headers.append('accept', 'application/jwt');
    }
    return resourceRequest(accessToken, 'GET', url, headers, null, {
        ...options,
        [clockSkew]: getClockSkew(client)
    });
}
let jwksMap;
let jwksRequests;
let jwksKeys;
function setJwksCache(as, jwks, uat, cache) {
    jwksMap ||= new WeakMap();
    jwksMap.set(as, {
        jwks,
        uat,
        get age () {
            return epochTime() - this.uat;
        }
    });
    if (cache) {
        Object.assign(cache, {
            jwks: structuredClone(jwks),
            uat
        });
    }
}
function isFreshJwksCache(input) {
    if (typeof input !== 'object' || input === null) {
        return false;
    }
    if (!('uat' in input) || typeof input.uat !== 'number' || epochTime() - input.uat >= 300) {
        return false;
    }
    if (!('jwks' in input) || !isJsonObject(input.jwks) || !Array.isArray(input.jwks.keys) || !Array.prototype.every.call(input.jwks.keys, isJsonObject)) {
        return false;
    }
    return true;
}
function clearJwksCache(as, cache) {
    jwksMap?.delete(as);
    delete cache?.jwks;
    delete cache?.uat;
}
async function getPublicSigKeyFromIssuerJwksUri(as, options, header) {
    const { alg, kid } = header;
    checkSupportedJwsAlg(header);
    if (!jwksMap?.has(as) && isFreshJwksCache(options?.[jwksCache])) {
        setJwksCache(as, options?.[jwksCache].jwks, options?.[jwksCache].uat);
    }
    let jwks;
    let age;
    if (jwksMap?.has(as)) {
        ;
        ({ jwks, age } = jwksMap.get(as));
        if (age >= 300) {
            clearJwksCache(as, options?.[jwksCache]);
            return getPublicSigKeyFromIssuerJwksUri(as, options, header);
        }
    } else {
        const downloaded = await jwksRequest(as, options);
        jwks = downloaded.jwks;
        age = epochTime() - downloaded.uat;
        setJwksCache(as, jwks, downloaded.uat, options?.[jwksCache]);
    }
    let kty;
    switch(alg.slice(0, 2)){
        case 'RS':
        case 'PS':
            kty = 'RSA';
            break;
        case 'ES':
            kty = 'EC';
            break;
        case 'Ed':
            kty = 'OKP';
            break;
        case 'ML':
            kty = 'AKP';
            break;
        default:
            throw new UnsupportedOperationError('unsupported JWS algorithm', {
                cause: {
                    alg
                }
            });
    }
    const candidates = jwks.keys.filter((jwk)=>{
        if (jwk.kty !== kty) {
            return false;
        }
        if (kid !== undefined && kid !== jwk.kid) {
            return false;
        }
        if (jwk.alg !== undefined && alg !== jwk.alg) {
            return false;
        }
        if (jwk.use !== undefined && jwk.use !== 'sig') {
            return false;
        }
        if (jwk.key_ops?.includes('verify') === false) {
            return false;
        }
        switch(true){
            case alg === 'ES256' && jwk.crv !== 'P-256':
            case alg === 'ES384' && jwk.crv !== 'P-384':
            case alg === 'ES512' && jwk.crv !== 'P-521':
            case alg === 'Ed25519' && jwk.crv !== 'Ed25519':
            case alg === 'EdDSA' && jwk.crv !== 'Ed25519':
                return false;
        }
        return true;
    });
    const { 0: jwk, length } = candidates;
    if (!length) {
        if (age >= 60) {
            clearJwksCache(as, options?.[jwksCache]);
            return getPublicSigKeyFromIssuerJwksUri(as, options, header);
        }
        throw OPE('error when selecting a JWT verification key, no applicable keys found', KEY_SELECTION, {
            header,
            candidates,
            jwks_uri: new URL(as.jwks_uri)
        });
    }
    if (length !== 1) {
        throw OPE('error when selecting a JWT verification key, multiple applicable keys found, a "kid" JWT Header Parameter is required', KEY_SELECTION, {
            header,
            candidates,
            jwks_uri: new URL(as.jwks_uri)
        });
    }
    jwksKeys ||= new WeakMap();
    let keys = jwksKeys.get(jwk);
    if (!keys) {
        keys = new Map();
        jwksKeys.set(jwk, keys);
    }
    let key = keys.get(alg);
    if (!key) {
        key = importJwk(alg, jwk).catch((cause)=>{
            keys.delete(alg);
            throw cause;
        });
        keys.set(alg, key);
    }
    return key;
}
const skipSubjectCheck = Symbol();
function getContentType(input) {
    return input.headers.get('content-type')?.split(';')[0];
}
async function processUserInfoResponse(as, client, expectedSubject, response, options) {
    assertAs(as);
    assertClient(client);
    if (!looseInstanceOf(response, Response)) {
        throw CodedTypeError('"response" must be an instance of Response', ERR_INVALID_ARG_TYPE);
    }
    checkAuthenticationChallenges(response);
    if (response.status !== 200) {
        throw OPE('"response" is not a conform UserInfo Endpoint response (unexpected HTTP status code)', RESPONSE_IS_NOT_CONFORM, response);
    }
    assertReadableResponse(response);
    let json;
    if (getContentType(response) === 'application/jwt') {
        const { claims, jwt } = await validateJwt(await response.text(), checkSigningAlgorithm.bind(undefined, client.userinfo_signed_response_alg, as.userinfo_signing_alg_values_supported, undefined), getClockSkew(client), getClockTolerance(client), options?.[jweDecrypt]).then(validateOptionalAudience.bind(undefined, client.client_id)).then(validateOptionalIssuer.bind(undefined, as));
        jwtRefs.set(response, jwt);
        json = claims;
    } else {
        if (client.userinfo_signed_response_alg) {
            throw OPE('JWT UserInfo Response expected', JWT_USERINFO_EXPECTED, response);
        }
        json = await getResponseJsonBody(response);
    }
    assertString(json.sub, '"response" body "sub" property', INVALID_RESPONSE, {
        body: json
    });
    switch(expectedSubject){
        case skipSubjectCheck:
            break;
        default:
            assertString(expectedSubject, '"expectedSubject"');
            if (json.sub !== expectedSubject) {
                throw OPE('unexpected "response" body "sub" property value', JSON_ATTRIBUTE_COMPARISON, {
                    expected: expectedSubject,
                    body: json,
                    attribute: 'sub'
                });
            }
    }
    return json;
}
async function authenticatedRequest(as, client, clientAuthentication, url, body, headers, options) {
    await clientAuthentication(as, client, body, headers);
    headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    return (options?.[customFetch] || fetch)(url.href, {
        body,
        headers: Object.fromEntries(headers.entries()),
        method: 'POST',
        redirect: 'manual',
        signal: signal(url, options?.signal)
    });
}
async function tokenEndpointRequest(as, client, clientAuthentication, grantType, parameters, options) {
    const url = resolveEndpoint(as, 'token_endpoint', client.use_mtls_endpoint_aliases, options?.[allowInsecureRequests] !== true);
    parameters.set('grant_type', grantType);
    const headers = prepareHeaders(options?.headers);
    headers.set('accept', 'application/json');
    if (options?.DPoP !== undefined) {
        assertDPoP(options.DPoP);
        await options.DPoP.addProof(url, headers, 'POST');
    }
    const response = await authenticatedRequest(as, client, clientAuthentication, url, parameters, headers, options);
    options?.DPoP?.cacheNonce(response, url);
    return response;
}
async function refreshTokenGrantRequest(as, client, clientAuthentication, refreshToken, options) {
    assertAs(as);
    assertClient(client);
    assertString(refreshToken, '"refreshToken"');
    const parameters = new URLSearchParams(options?.additionalParameters);
    parameters.set('refresh_token', refreshToken);
    return tokenEndpointRequest(as, client, clientAuthentication, 'refresh_token', parameters, options);
}
const idTokenClaims = new WeakMap();
const jwtRefs = new WeakMap();
function getValidatedIdTokenClaims(ref) {
    if (!ref.id_token) {
        return undefined;
    }
    const claims = idTokenClaims.get(ref);
    if (!claims) {
        throw CodedTypeError('"ref" was already garbage collected or did not resolve from the proper sources', ERR_INVALID_ARG_VALUE);
    }
    return claims;
}
async function validateApplicationLevelSignature(as, ref, options) {
    assertAs(as);
    if (!jwtRefs.has(ref)) {
        throw CodedTypeError('"ref" does not contain a processed JWT Response to verify the signature of', ERR_INVALID_ARG_VALUE);
    }
    const { 0: protectedHeader, 1: payload, 2: encodedSignature } = jwtRefs.get(ref).split('.');
    const header = JSON.parse(buf(b64u(protectedHeader)));
    if (header.alg.startsWith('HS')) {
        throw new UnsupportedOperationError('unsupported JWS algorithm', {
            cause: {
                alg: header.alg
            }
        });
    }
    let key;
    key = await getPublicSigKeyFromIssuerJwksUri(as, options, header);
    await validateJwsSignature(protectedHeader, payload, key, b64u(encodedSignature));
}
async function processGenericAccessTokenResponse(as, client, response, additionalRequiredIdTokenClaims, decryptFn, recognizedTokenTypes) {
    assertAs(as);
    assertClient(client);
    if (!looseInstanceOf(response, Response)) {
        throw CodedTypeError('"response" must be an instance of Response', ERR_INVALID_ARG_TYPE);
    }
    await checkOAuthBodyError(response, 200, 'Token Endpoint');
    assertReadableResponse(response);
    const json = await getResponseJsonBody(response);
    assertString(json.access_token, '"response" body "access_token" property', INVALID_RESPONSE, {
        body: json
    });
    assertString(json.token_type, '"response" body "token_type" property', INVALID_RESPONSE, {
        body: json
    });
    json.token_type = json.token_type.toLowerCase();
    if (json.expires_in !== undefined) {
        let expiresIn = typeof json.expires_in !== 'number' ? parseFloat(json.expires_in) : json.expires_in;
        assertNumber(expiresIn, true, '"response" body "expires_in" property', INVALID_RESPONSE, {
            body: json
        });
        json.expires_in = expiresIn;
    }
    if (json.refresh_token !== undefined) {
        assertString(json.refresh_token, '"response" body "refresh_token" property', INVALID_RESPONSE, {
            body: json
        });
    }
    if (json.scope !== undefined && typeof json.scope !== 'string') {
        throw OPE('"response" body "scope" property must be a string', INVALID_RESPONSE, {
            body: json
        });
    }
    if (json.id_token !== undefined) {
        assertString(json.id_token, '"response" body "id_token" property', INVALID_RESPONSE, {
            body: json
        });
        const requiredClaims = [];
        if (client.require_auth_time === true) {
            requiredClaims.push('auth_time');
        }
        if (client.default_max_age !== undefined) {
            assertNumber(client.default_max_age, true, '"client.default_max_age"');
            requiredClaims.push('auth_time');
        }
        if (additionalRequiredIdTokenClaims?.length) {
            requiredClaims.push(...additionalRequiredIdTokenClaims);
        }
        const { claims, jwt } = await validateIdTokenClaims(as, client, json.id_token, requiredClaims, decryptFn);
        validateIdTokenAuthorizedParty(client, claims);
        validateIdTokenAuthTimeClaim(claims);
        jwtRefs.set(response, jwt);
        idTokenClaims.set(json, claims);
    }
    if (recognizedTokenTypes?.[json.token_type] !== undefined) {
        recognizedTokenTypes[json.token_type](response, json);
    } else if (json.token_type !== 'dpop' && json.token_type !== 'bearer') {
        throw new UnsupportedOperationError('unsupported `token_type` value', {
            cause: {
                body: json
            }
        });
    }
    return json;
}
function checkAuthenticationChallenges(response) {
    let challenges;
    if (challenges = parseWwwAuthenticateChallenges(response)) {
        throw new WWWAuthenticateChallengeError('server responded with a challenge in the WWW-Authenticate HTTP Header', {
            cause: challenges,
            response
        });
    }
}
async function processRefreshTokenResponse(as, client, response, options) {
    return processGenericAccessTokenResponse(as, client, response, undefined, options?.[jweDecrypt], options?.recognizedTokenTypes);
}
function validateOptionalAudience(expected, result) {
    if (result.claims.aud !== undefined) {
        return validateAudience(expected, result);
    }
    return result;
}
function validateAudience(expected, result) {
    if (Array.isArray(result.claims.aud)) {
        if (!result.claims.aud.includes(expected)) {
            throw OPE('unexpected JWT "aud" (audience) claim value', JWT_CLAIM_COMPARISON, {
                expected,
                claims: result.claims,
                claim: 'aud'
            });
        }
    } else if (result.claims.aud !== expected) {
        throw OPE('unexpected JWT "aud" (audience) claim value', JWT_CLAIM_COMPARISON, {
            expected,
            claims: result.claims,
            claim: 'aud'
        });
    }
    return result;
}
function validateOptionalIssuer(as, result) {
    if (result.claims.iss !== undefined) {
        return validateIssuer(as, result);
    }
    return result;
}
function validateIssuer(as, result) {
    const expected = as[_expectedIssuer]?.(result) ?? as.issuer;
    if (result.claims.iss !== expected) {
        throw OPE('unexpected JWT "iss" (issuer) claim value', JWT_CLAIM_COMPARISON, {
            expected,
            claims: result.claims,
            claim: 'iss'
        });
    }
    return result;
}
const branded = new WeakSet();
function brand(searchParams) {
    branded.add(searchParams);
    return searchParams;
}
const nopkce = Symbol();
async function authorizationCodeGrantRequest(as, client, clientAuthentication, callbackParameters, redirectUri, codeVerifier, options) {
    assertAs(as);
    assertClient(client);
    if (!branded.has(callbackParameters)) {
        throw CodedTypeError('"callbackParameters" must be an instance of URLSearchParams obtained from "validateAuthResponse()", or "validateJwtAuthResponse()', ERR_INVALID_ARG_VALUE);
    }
    assertString(redirectUri, '"redirectUri"');
    const code = getURLSearchParameter(callbackParameters, 'code');
    if (!code) {
        throw OPE('no authorization code in "callbackParameters"', INVALID_RESPONSE);
    }
    const parameters = new URLSearchParams(options?.additionalParameters);
    parameters.set('redirect_uri', redirectUri);
    parameters.set('code', code);
    if (codeVerifier !== nopkce) {
        assertString(codeVerifier, '"codeVerifier"');
        parameters.set('code_verifier', codeVerifier);
    }
    return tokenEndpointRequest(as, client, clientAuthentication, 'authorization_code', parameters, options);
}
const jwtClaimNames = {
    aud: 'audience',
    c_hash: 'code hash',
    client_id: 'client id',
    exp: 'expiration time',
    iat: 'issued at',
    iss: 'issuer',
    jti: 'jwt id',
    nonce: 'nonce',
    s_hash: 'state hash',
    sub: 'subject',
    ath: 'access token hash',
    htm: 'http method',
    htu: 'http uri',
    cnf: 'confirmation',
    auth_time: 'authentication time'
};
function validatePresence(required, result) {
    for (const claim of required){
        if (result.claims[claim] === undefined) {
            throw OPE(`JWT "${claim}" (${jwtClaimNames[claim]}) claim missing`, INVALID_RESPONSE, {
                claims: result.claims
            });
        }
    }
    return result;
}
function validateStringClaim(claim, result) {
    if (typeof result.claims[claim] !== 'string') {
        throw OPE(`unexpected JWT "${claim}" (${jwtClaimNames[claim]}) claim type`, INVALID_RESPONSE, {
            claims: result.claims
        });
    }
    return result;
}
function validateIdTokenClaims(as, client, idToken, requiredClaims, decryptFn) {
    return validateJwt(idToken, checkSigningAlgorithm.bind(undefined, client.id_token_signed_response_alg, as.id_token_signing_alg_values_supported, 'RS256'), getClockSkew(client), getClockTolerance(client), decryptFn).then(validatePresence.bind(undefined, [
        'aud',
        'exp',
        'iat',
        'iss',
        'sub',
        ...requiredClaims
    ])).then(validateIssuer.bind(undefined, as)).then(validateAudience.bind(undefined, client.client_id)).then(validateStringClaim.bind(undefined, 'sub'));
}
function resolveIdTokenMaxAge(client, maxAge) {
    if (maxAge === skipAuthTimeCheck) {
        return maxAge;
    }
    const fromClient = maxAge === undefined;
    if (fromClient) {
        maxAge = client.default_max_age;
    }
    if (maxAge === undefined) {
        return skipAuthTimeCheck;
    }
    assertNumber(maxAge, true, fromClient ? '"client.default_max_age"' : '"maxAge" argument');
    return maxAge;
}
function validateIdTokenAuthTimeClaim(claims) {
    if (claims.auth_time !== undefined) {
        assertNumber(claims.auth_time, true, 'ID Token "auth_time" (authentication time)', INVALID_RESPONSE, {
            claims
        });
    }
}
function validateIdTokenAuthTime(client, claims, maxAge) {
    if (maxAge === skipAuthTimeCheck) {
        return;
    }
    const now = epochTime() + getClockSkew(client);
    const tolerance = getClockTolerance(client);
    if (claims.auth_time + maxAge < now - tolerance) {
        throw OPE('too much time has elapsed since the last End-User authentication', JWT_TIMESTAMP_CHECK, {
            claims,
            now,
            tolerance,
            claim: 'auth_time'
        });
    }
}
function validateIdTokenNonce(claims, expectedNonce) {
    const expected = expectedNonce === expectNoNonce ? undefined : expectedNonce;
    if (claims.nonce !== expected) {
        throw OPE('unexpected ID Token "nonce" claim value', JWT_CLAIM_COMPARISON, {
            expected,
            claims,
            claim: 'nonce'
        });
    }
}
function validateIdTokenAuthorizedParty(client, claims) {
    if (Array.isArray(claims.aud) && claims.aud.length !== 1) {
        if (claims.azp === undefined) {
            throw OPE('ID Token "aud" (audience) claim includes additional untrusted audiences', JWT_CLAIM_COMPARISON, {
                claims,
                claim: 'aud'
            });
        }
        if (claims.azp !== client.client_id) {
            throw OPE('unexpected ID Token "azp" (authorized party) claim value', JWT_CLAIM_COMPARISON, {
                expected: client.client_id,
                claims,
                claim: 'azp'
            });
        }
    }
}
const expectNoNonce = Symbol();
const skipAuthTimeCheck = Symbol();
async function processAuthorizationCodeResponse(as, client, response, options) {
    if (typeof options?.expectedNonce === 'string' || typeof options?.maxAge === 'number' || options?.requireIdToken) {
        return processAuthorizationCodeOpenIDResponse(as, client, response, options.expectedNonce, options.maxAge, options[jweDecrypt], options.recognizedTokenTypes);
    }
    return processAuthorizationCodeOAuth2Response(as, client, response, options?.maxAge, options?.[jweDecrypt], options?.recognizedTokenTypes);
}
async function processAuthorizationCodeOpenIDResponse(as, client, response, expectedNonce, maxAge, decryptFn, recognizedTokenTypes) {
    const additionalRequiredClaims = [];
    switch(expectedNonce){
        case undefined:
            expectedNonce = expectNoNonce;
            break;
        case expectNoNonce:
            break;
        default:
            assertString(expectedNonce, '"expectedNonce" argument');
            additionalRequiredClaims.push('nonce');
    }
    maxAge = resolveIdTokenMaxAge(client, maxAge);
    if (maxAge !== skipAuthTimeCheck) {
        additionalRequiredClaims.push('auth_time');
    }
    const result = await processGenericAccessTokenResponse(as, client, response, additionalRequiredClaims, decryptFn, recognizedTokenTypes);
    assertString(result.id_token, '"response" body "id_token" property', INVALID_RESPONSE, {
        body: result
    });
    const claims = getValidatedIdTokenClaims(result);
    validateIdTokenAuthTime(client, claims, maxAge);
    validateIdTokenNonce(claims, expectedNonce);
    return result;
}
async function processAuthorizationCodeOAuth2Response(as, client, response, maxAge, decryptFn, recognizedTokenTypes) {
    const result = await processGenericAccessTokenResponse(as, client, response, undefined, decryptFn, recognizedTokenTypes);
    const claims = getValidatedIdTokenClaims(result);
    if (claims) {
        validateIdTokenAuthTime(client, claims, resolveIdTokenMaxAge(client, maxAge));
        validateIdTokenNonce(claims, expectNoNonce);
    }
    return result;
}
const WWW_AUTHENTICATE_CHALLENGE = 'OAUTH_WWW_AUTHENTICATE_CHALLENGE';
const RESPONSE_BODY_ERROR = 'OAUTH_RESPONSE_BODY_ERROR';
const UNSUPPORTED_OPERATION = 'OAUTH_UNSUPPORTED_OPERATION';
const AUTHORIZATION_RESPONSE_ERROR = 'OAUTH_AUTHORIZATION_RESPONSE_ERROR';
const JWT_USERINFO_EXPECTED = 'OAUTH_JWT_USERINFO_EXPECTED';
const PARSE_ERROR = 'OAUTH_PARSE_ERROR';
const INVALID_RESPONSE = 'OAUTH_INVALID_RESPONSE';
const INVALID_REQUEST = 'OAUTH_INVALID_REQUEST';
const RESPONSE_IS_NOT_JSON = 'OAUTH_RESPONSE_IS_NOT_JSON';
const RESPONSE_IS_NOT_CONFORM = 'OAUTH_RESPONSE_IS_NOT_CONFORM';
const HTTP_REQUEST_FORBIDDEN = 'OAUTH_HTTP_REQUEST_FORBIDDEN';
const REQUEST_PROTOCOL_FORBIDDEN = 'OAUTH_REQUEST_PROTOCOL_FORBIDDEN';
const JWT_TIMESTAMP_CHECK = 'OAUTH_JWT_TIMESTAMP_CHECK_FAILED';
const JWT_CLAIM_COMPARISON = 'OAUTH_JWT_CLAIM_COMPARISON_FAILED';
const JSON_ATTRIBUTE_COMPARISON = 'OAUTH_JSON_ATTRIBUTE_COMPARISON_FAILED';
const KEY_SELECTION = 'OAUTH_KEY_SELECTION_FAILED';
const MISSING_SERVER_METADATA = 'OAUTH_MISSING_SERVER_METADATA';
const INVALID_SERVER_METADATA = 'OAUTH_INVALID_SERVER_METADATA';
function checkJwtType(expected, result) {
    if (typeof result.header.typ !== 'string' || normalizeTyp(result.header.typ) !== expected) {
        throw OPE('unexpected JWT "typ" header parameter value', INVALID_RESPONSE, {
            header: result.header
        });
    }
    return result;
}
async function clientCredentialsGrantRequest(as, client, clientAuthentication, parameters, options) {
    assertAs(as);
    assertClient(client);
    return tokenEndpointRequest(as, client, clientAuthentication, 'client_credentials', new URLSearchParams(parameters), options);
}
async function genericTokenEndpointRequest(as, client, clientAuthentication, grantType, parameters, options) {
    assertAs(as);
    assertClient(client);
    assertString(grantType, '"grantType"');
    return tokenEndpointRequest(as, client, clientAuthentication, grantType, new URLSearchParams(parameters), options);
}
async function processGenericTokenEndpointResponse(as, client, response, options) {
    return processGenericAccessTokenResponse(as, client, response, undefined, options?.[jweDecrypt], options?.recognizedTokenTypes);
}
async function processClientCredentialsResponse(as, client, response, options) {
    return processGenericAccessTokenResponse(as, client, response, undefined, options?.[jweDecrypt], options?.recognizedTokenTypes);
}
async function revocationRequest(as, client, clientAuthentication, token, options) {
    assertAs(as);
    assertClient(client);
    assertString(token, '"token"');
    const url = resolveEndpoint(as, 'revocation_endpoint', client.use_mtls_endpoint_aliases, options?.[allowInsecureRequests] !== true);
    const body = new URLSearchParams(options?.additionalParameters);
    body.set('token', token);
    const headers = prepareHeaders(options?.headers);
    headers.delete('accept');
    return authenticatedRequest(as, client, clientAuthentication, url, body, headers, options);
}
async function processRevocationResponse(response) {
    if (!looseInstanceOf(response, Response)) {
        throw CodedTypeError('"response" must be an instance of Response', ERR_INVALID_ARG_TYPE);
    }
    await checkOAuthBodyError(response, 200, 'Revocation Endpoint');
    return undefined;
}
function assertReadableResponse(response) {
    if (response.bodyUsed) {
        throw CodedTypeError('"response" body has been used already', ERR_INVALID_ARG_VALUE);
    }
}
async function introspectionRequest(as, client, clientAuthentication, token, options) {
    assertAs(as);
    assertClient(client);
    assertString(token, '"token"');
    const url = resolveEndpoint(as, 'introspection_endpoint', client.use_mtls_endpoint_aliases, options?.[allowInsecureRequests] !== true);
    const body = new URLSearchParams(options?.additionalParameters);
    body.set('token', token);
    const headers = prepareHeaders(options?.headers);
    if (options?.requestJwtResponse ?? client.introspection_signed_response_alg) {
        headers.set('accept', 'application/token-introspection+jwt');
    } else {
        headers.set('accept', 'application/json');
    }
    return authenticatedRequest(as, client, clientAuthentication, url, body, headers, options);
}
async function processIntrospectionResponse(as, client, response, options) {
    assertAs(as);
    assertClient(client);
    if (!looseInstanceOf(response, Response)) {
        throw CodedTypeError('"response" must be an instance of Response', ERR_INVALID_ARG_TYPE);
    }
    await checkOAuthBodyError(response, 200, 'Introspection Endpoint');
    let json;
    if (getContentType(response) === 'application/token-introspection+jwt') {
        assertReadableResponse(response);
        const { claims, jwt } = await validateJwt(await response.text(), checkSigningAlgorithm.bind(undefined, client.introspection_signed_response_alg, as.introspection_signing_alg_values_supported, 'RS256'), getClockSkew(client), getClockTolerance(client), options?.[jweDecrypt]).then(checkJwtType.bind(undefined, 'token-introspection+jwt')).then(validatePresence.bind(undefined, [
            'aud',
            'iat',
            'iss'
        ])).then(validateIssuer.bind(undefined, as)).then(validateAudience.bind(undefined, client.client_id));
        jwtRefs.set(response, jwt);
        if (!isJsonObject(claims.token_introspection)) {
            throw OPE('JWT "token_introspection" claim must be a JSON object', INVALID_RESPONSE, {
                claims
            });
        }
        json = claims.token_introspection;
    } else {
        assertReadableResponse(response);
        json = await getResponseJsonBody(response);
    }
    if (typeof json.active !== 'boolean') {
        throw OPE('"response" body "active" property must be a boolean', INVALID_RESPONSE, {
            body: json
        });
    }
    return json;
}
async function jwksRequest(as, options) {
    assertAs(as);
    const url = resolveEndpoint(as, 'jwks_uri', false, options?.[allowInsecureRequests] !== true);
    const headers = prepareHeaders(options?.headers);
    headers.set('accept', 'application/json');
    headers.append('accept', 'application/jwk-set+json');
    const requestHeaders = Object.fromEntries(headers.entries());
    const headersKey = JSON.stringify(requestHeaders);
    const fetcher = options?.[customFetch] || fetch;
    const requestSignal = signal(url, options?.signal);
    jwksRequests ||= new WeakMap();
    const requests = jwksRequests.get(as) ?? new Set();
    for (const pending of requests){
        if (pending.url === url.href && pending.headers === headersKey && pending.fetch === fetcher && pending.signal === requestSignal) {
            return pending.promise;
        }
    }
    const pending = {
        url: url.href,
        headers: headersKey,
        fetch: fetcher,
        signal: requestSignal,
        promise: Promise.resolve().then(()=>fetcher(url.href, {
                body: undefined,
                headers: requestHeaders,
                method: 'GET',
                redirect: 'manual',
                signal: requestSignal
            })).then(processJwksResponse).then((jwks)=>{
            const uat = epochTime();
            setJwksCache(as, jwks, uat);
            return {
                jwks,
                uat
            };
        }).finally(()=>{
            requests.delete(pending);
            if (!requests.size) {
                jwksRequests.delete(as);
            }
        })
    };
    requests.add(pending);
    jwksRequests.set(as, requests);
    return pending.promise;
}
async function processJwksResponse(response) {
    if (!looseInstanceOf(response, Response)) {
        throw CodedTypeError('"response" must be an instance of Response', ERR_INVALID_ARG_TYPE);
    }
    if (response.status !== 200) {
        throw OPE('"response" is not a conform JSON Web Key Set response (unexpected HTTP status code)', RESPONSE_IS_NOT_CONFORM, response);
    }
    assertReadableResponse(response);
    const json = await getResponseJsonBody(response, (response)=>assertContentTypes(response, 'application/json', 'application/jwk-set+json'));
    if (!Array.isArray(json.keys)) {
        throw OPE('"response" body "keys" property must be an array', INVALID_RESPONSE, {
            body: json
        });
    }
    if (!Array.prototype.every.call(json.keys, isJsonObject)) {
        throw OPE('"response" body "keys" property members must be JWK formatted objects', INVALID_RESPONSE, {
            body: json
        });
    }
    return json;
}
function supported(alg) {
    switch(alg){
        case 'PS256':
        case 'ES256':
        case 'RS256':
        case 'PS384':
        case 'ES384':
        case 'RS384':
        case 'PS512':
        case 'ES512':
        case 'RS512':
        case 'Ed25519':
        case 'EdDSA':
        case 'ML-DSA-44':
        case 'ML-DSA-65':
        case 'ML-DSA-87':
            return true;
        default:
            return false;
    }
}
function checkSupportedJwsAlg(header) {
    if (!supported(header.alg)) {
        throw new UnsupportedOperationError('unsupported JWS "alg" identifier', {
            cause: {
                alg: header.alg
            }
        });
    }
}
function checkRsaKeyAlgorithm(key) {
    const { algorithm } = key;
    if (typeof algorithm.modulusLength !== 'number' || algorithm.modulusLength < 2048) {
        throw new UnsupportedOperationError(`unsupported ${algorithm.name} modulusLength`, {
            cause: key
        });
    }
}
function ecdsaHashName(key) {
    const { algorithm } = key;
    switch(algorithm.namedCurve){
        case 'P-256':
            return 'SHA-256';
        case 'P-384':
            return 'SHA-384';
        case 'P-521':
            return 'SHA-512';
        default:
            throw new UnsupportedOperationError('unsupported ECDSA namedCurve', {
                cause: key
            });
    }
}
function keyToSubtle(key) {
    switch(key.algorithm.name){
        case 'ECDSA':
            return {
                name: key.algorithm.name,
                hash: ecdsaHashName(key)
            };
        case 'RSA-PSS':
            {
                checkRsaKeyAlgorithm(key);
                switch(key.algorithm.hash.name){
                    case 'SHA-256':
                    case 'SHA-384':
                    case 'SHA-512':
                        return {
                            name: key.algorithm.name,
                            saltLength: parseInt(key.algorithm.hash.name.slice(-3), 10) >> 3
                        };
                    default:
                        throw new UnsupportedOperationError('unsupported RSA-PSS hash name', {
                            cause: key
                        });
                }
            }
        case 'RSASSA-PKCS1-v1_5':
            checkRsaKeyAlgorithm(key);
            return key.algorithm.name;
        case 'ML-DSA-44':
        case 'ML-DSA-65':
        case 'ML-DSA-87':
        case 'Ed25519':
            return key.algorithm.name;
    }
    throw new UnsupportedOperationError('unsupported CryptoKey algorithm name', {
        cause: key
    });
}
async function validateJwsSignature(protectedHeader, payload, key, signature) {
    const data = buf(`${protectedHeader}.${payload}`);
    const algorithm = keyToSubtle(key);
    const verified = await crypto.subtle.verify(algorithm, key, signature, data);
    if (!verified) {
        throw OPE('JWT signature verification failed', INVALID_RESPONSE, {
            key,
            data,
            signature,
            algorithm
        });
    }
}
async function validateJwt(jws, checkAlg, clockSkew, clockTolerance, decryptJwt) {
    let { 0: protectedHeader, 1: payload, length } = jws.split('.');
    if (length === 5) {
        if (decryptJwt !== undefined) {
            jws = await decryptJwt(jws);
            ({ 0: protectedHeader, 1: payload, length } = jws.split('.'));
        } else {
            throw new UnsupportedOperationError('JWE decryption is not configured', {
                cause: jws
            });
        }
    }
    if (length !== 3) {
        throw OPE('Invalid JWT', INVALID_RESPONSE, jws);
    }
    let header;
    try {
        header = JSON.parse(buf(b64u(protectedHeader)));
    } catch (cause) {
        throw OPE('failed to parse JWT Header body as base64url encoded JSON', PARSE_ERROR, cause);
    }
    if (!isJsonObject(header)) {
        throw OPE('JWT Header must be a top level object', INVALID_RESPONSE, jws);
    }
    checkAlg(header);
    if (header.crit !== undefined) {
        throw new UnsupportedOperationError('no JWT "crit" header parameter extensions are supported', {
            cause: {
                header
            }
        });
    }
    let claims;
    try {
        claims = JSON.parse(buf(b64u(payload)));
    } catch (cause) {
        throw OPE('failed to parse JWT Payload body as base64url encoded JSON', PARSE_ERROR, cause);
    }
    if (!isJsonObject(claims)) {
        throw OPE('JWT Payload must be a top level object', INVALID_RESPONSE, jws);
    }
    const now = epochTime() + clockSkew;
    if (claims.exp !== undefined) {
        if (typeof claims.exp !== 'number') {
            throw OPE('unexpected JWT "exp" (expiration time) claim type', INVALID_RESPONSE, {
                claims
            });
        }
        if (claims.exp <= now - clockTolerance) {
            throw OPE('unexpected JWT "exp" (expiration time) claim value, expiration is past current timestamp', JWT_TIMESTAMP_CHECK, {
                claims,
                now,
                tolerance: clockTolerance,
                claim: 'exp'
            });
        }
    }
    if (claims.iat !== undefined) {
        if (typeof claims.iat !== 'number') {
            throw OPE('unexpected JWT "iat" (issued at) claim type', INVALID_RESPONSE, {
                claims
            });
        }
    }
    if (claims.iss !== undefined) {
        if (typeof claims.iss !== 'string') {
            throw OPE('unexpected JWT "iss" (issuer) claim type', INVALID_RESPONSE, {
                claims
            });
        }
    }
    if (claims.nbf !== undefined) {
        if (typeof claims.nbf !== 'number') {
            throw OPE('unexpected JWT "nbf" (not before) claim type', INVALID_RESPONSE, {
                claims
            });
        }
        if (claims.nbf > now + clockTolerance) {
            throw OPE('unexpected JWT "nbf" (not before) claim value', JWT_TIMESTAMP_CHECK, {
                claims,
                now,
                tolerance: clockTolerance,
                claim: 'nbf'
            });
        }
    }
    if (claims.aud !== undefined) {
        if (typeof claims.aud !== 'string' && !Array.isArray(claims.aud)) {
            throw OPE('unexpected JWT "aud" (audience) claim type', INVALID_RESPONSE, {
                claims
            });
        }
    }
    return {
        header,
        claims,
        jwt: jws
    };
}
async function validateJwtAuthResponse(as, client, parameters, expectedState, options) {
    assertAs(as);
    assertClient(client);
    if (parameters instanceof URL) {
        parameters = parameters.searchParams;
    }
    if (!(parameters instanceof URLSearchParams)) {
        throw CodedTypeError('"parameters" must be an instance of URLSearchParams, or URL', ERR_INVALID_ARG_TYPE);
    }
    const response = getURLSearchParameter(parameters, 'response');
    if (!response) {
        throw OPE('"parameters" does not contain a JARM response', INVALID_RESPONSE);
    }
    const { claims, header, jwt } = await validateJwt(response, checkSigningAlgorithm.bind(undefined, client.authorization_signed_response_alg, as.authorization_signing_alg_values_supported, 'RS256'), getClockSkew(client), getClockTolerance(client), options?.[jweDecrypt]).then(validatePresence.bind(undefined, [
        'aud',
        'exp',
        'iss'
    ])).then(validateIssuer.bind(undefined, as)).then(validateAudience.bind(undefined, client.client_id));
    const { 0: protectedHeader, 1: payload, 2: encodedSignature } = jwt.split('.');
    const signature = b64u(encodedSignature);
    const key = await getPublicSigKeyFromIssuerJwksUri(as, options, header);
    await validateJwsSignature(protectedHeader, payload, key, signature);
    const result = new URLSearchParams();
    for (const [key, value] of Object.entries(claims)){
        if (typeof value === 'string' && key !== 'aud') {
            result.set(key, value);
        }
    }
    return validateAuthResponse(as, client, result, expectedState);
}
async function idTokenHash(data, header, claimName) {
    let algorithm;
    switch(header.alg){
        case 'RS256':
        case 'PS256':
        case 'ES256':
            algorithm = 'SHA-256';
            break;
        case 'RS384':
        case 'PS384':
        case 'ES384':
            algorithm = 'SHA-384';
            break;
        case 'RS512':
        case 'PS512':
        case 'ES512':
        case 'Ed25519':
        case 'EdDSA':
            algorithm = 'SHA-512';
            break;
        case 'ML-DSA-44':
        case 'ML-DSA-65':
        case 'ML-DSA-87':
            algorithm = {
                name: 'cSHAKE256',
                length: 512,
                outputLength: 512
            };
            break;
        default:
            throw new UnsupportedOperationError(`unsupported JWS algorithm for ${claimName} calculation`, {
                cause: {
                    alg: header.alg
                }
            });
    }
    const digest = await crypto.subtle.digest(algorithm, buf(data));
    return b64u(digest.slice(0, digest.byteLength / 2));
}
async function idTokenHashMatches(data, actual, header, claimName) {
    const expected = await idTokenHash(data, header, claimName);
    return actual === expected;
}
async function validateDetachedSignatureResponse(as, client, parameters, expectedNonce, expectedState, maxAge, options) {
    return validateHybridResponse(as, client, parameters, expectedNonce, expectedState, maxAge, options, true);
}
async function validateCodeIdTokenResponse(as, client, parameters, expectedNonce, expectedState, maxAge, options) {
    return validateHybridResponse(as, client, parameters, expectedNonce, expectedState, maxAge, options, false);
}
async function consumeStream(request) {
    if (request.bodyUsed) {
        throw CodedTypeError('form_post Request instances must contain a readable body', ERR_INVALID_ARG_VALUE, {
            cause: request
        });
    }
    return request.text();
}
async function formPostResponse(request) {
    if (request.method !== 'POST') {
        throw CodedTypeError('form_post responses are expected to use the POST method', ERR_INVALID_ARG_VALUE, {
            cause: request
        });
    }
    if (getContentType(request) !== 'application/x-www-form-urlencoded') {
        throw CodedTypeError('form_post responses are expected to use the application/x-www-form-urlencoded content-type', ERR_INVALID_ARG_VALUE, {
            cause: request
        });
    }
    return consumeStream(request);
}
async function validateHybridResponse(as, client, parameters, expectedNonce, expectedState, maxAge, options, fapi) {
    assertAs(as);
    assertClient(client);
    if (parameters instanceof URL) {
        if (!parameters.hash.length) {
            throw CodedTypeError('"parameters" as an instance of URL must contain a hash (fragment) with the Authorization Response parameters', ERR_INVALID_ARG_VALUE);
        }
        parameters = new URLSearchParams(parameters.hash.slice(1));
    } else if (looseInstanceOf(parameters, Request)) {
        parameters = new URLSearchParams(await formPostResponse(parameters));
    } else if (parameters instanceof URLSearchParams) {
        parameters = new URLSearchParams(parameters);
    } else {
        throw CodedTypeError('"parameters" must be an instance of URLSearchParams, URL, or Response', ERR_INVALID_ARG_TYPE);
    }
    const id_token = getURLSearchParameter(parameters, 'id_token');
    parameters.delete('id_token');
    switch(expectedState){
        case undefined:
        case expectNoState:
            break;
        default:
            assertString(expectedState, '"expectedState" argument');
    }
    const result = validateAuthResponse({
        ...as,
        authorization_response_iss_parameter_supported: false
    }, client, parameters, expectedState);
    if (!id_token) {
        throw OPE('"parameters" does not contain an ID Token', INVALID_RESPONSE);
    }
    const code = getURLSearchParameter(parameters, 'code');
    if (!code) {
        throw OPE('"parameters" does not contain an Authorization Code', INVALID_RESPONSE);
    }
    const requiredClaims = [
        'nonce',
        'c_hash'
    ];
    const state = parameters.get('state');
    if (fapi && (typeof expectedState === 'string' || state !== null)) {
        requiredClaims.push('s_hash');
    }
    maxAge = resolveIdTokenMaxAge(client, maxAge);
    if (client.require_auth_time || maxAge !== skipAuthTimeCheck) {
        requiredClaims.push('auth_time');
    }
    const { claims, header, jwt } = await validateIdTokenClaims(as, client, id_token, requiredClaims, options?.[jweDecrypt]);
    const clockSkew = getClockSkew(client);
    const now = epochTime() + clockSkew;
    if (claims.iat < now - 3600) {
        throw OPE('unexpected JWT "iat" (issued at) claim value, it is too far in the past', JWT_TIMESTAMP_CHECK, {
            now,
            claims,
            claim: 'iat'
        });
    }
    assertString(claims.c_hash, 'ID Token "c_hash" (code hash) claim value', INVALID_RESPONSE, {
        claims
    });
    validateIdTokenAuthTimeClaim(claims);
    validateIdTokenAuthTime(client, claims, maxAge);
    assertString(expectedNonce, '"expectedNonce" argument');
    validateIdTokenNonce(claims, expectedNonce);
    validateIdTokenAuthorizedParty(client, claims);
    const { 0: protectedHeader, 1: payload, 2: encodedSignature } = jwt.split('.');
    const signature = b64u(encodedSignature);
    const key = await getPublicSigKeyFromIssuerJwksUri(as, options, header);
    await validateJwsSignature(protectedHeader, payload, key, signature);
    if (await idTokenHashMatches(code, claims.c_hash, header, 'c_hash') !== true) {
        throw OPE('invalid ID Token "c_hash" (code hash) claim value', JWT_CLAIM_COMPARISON, {
            code,
            alg: header.alg,
            claim: 'c_hash',
            claims
        });
    }
    if (fapi && state !== null || claims.s_hash !== undefined) {
        assertString(claims.s_hash, 'ID Token "s_hash" (state hash) claim value', INVALID_RESPONSE, {
            claims
        });
        assertString(state, '"state" response parameter', INVALID_RESPONSE, {
            parameters
        });
        if (await idTokenHashMatches(state, claims.s_hash, header, 's_hash') !== true) {
            throw OPE('invalid ID Token "s_hash" (state hash) claim value', JWT_CLAIM_COMPARISON, {
                state,
                alg: header.alg,
                claim: 's_hash',
                claims
            });
        }
    }
    return result;
}
function checkSigningAlgorithm(client, issuer, fallback, header) {
    if (client !== undefined) {
        if (typeof client === 'string' ? header.alg !== client : !client.includes(header.alg)) {
            throw OPE('unexpected JWT "alg" header parameter', INVALID_RESPONSE, {
                header,
                expected: client,
                reason: 'client configuration'
            });
        }
        return;
    }
    if (Array.isArray(issuer)) {
        if (!issuer.includes(header.alg)) {
            throw OPE('unexpected JWT "alg" header parameter', INVALID_RESPONSE, {
                header,
                expected: issuer,
                reason: 'authorization server metadata'
            });
        }
        return;
    }
    if (fallback !== undefined) {
        if (typeof fallback === 'string' ? header.alg !== fallback : typeof fallback === 'function' ? !fallback(header.alg) : !fallback.includes(header.alg)) {
            throw OPE('unexpected JWT "alg" header parameter', INVALID_RESPONSE, {
                header,
                expected: fallback,
                reason: 'default value'
            });
        }
        return;
    }
    throw OPE('missing client or server configuration to verify used JWT "alg" header parameter', undefined, {
        client,
        issuer,
        fallback
    });
}
function getURLSearchParameter(parameters, name) {
    const { 0: value, length } = parameters.getAll(name);
    if (length > 1) {
        throw OPE(`"${name}" parameter must be provided only once`, INVALID_RESPONSE);
    }
    return value;
}
const skipStateCheck = Symbol();
const expectNoState = Symbol();
function validateAuthResponse(as, client, parameters, expectedState) {
    assertAs(as);
    assertClient(client);
    if (parameters instanceof URL) {
        parameters = parameters.searchParams;
    }
    if (!(parameters instanceof URLSearchParams)) {
        throw CodedTypeError('"parameters" must be an instance of URLSearchParams, or URL', ERR_INVALID_ARG_TYPE);
    }
    if (getURLSearchParameter(parameters, 'response')) {
        throw OPE('"parameters" contains a JARM response, use validateJwtAuthResponse() instead of validateAuthResponse()', INVALID_RESPONSE, {
            parameters
        });
    }
    const iss = getURLSearchParameter(parameters, 'iss');
    const state = getURLSearchParameter(parameters, 'state');
    if (!iss && as.authorization_response_iss_parameter_supported) {
        throw OPE('response parameter "iss" (issuer) missing', INVALID_RESPONSE, {
            parameters
        });
    }
    if (iss && iss !== as.issuer) {
        throw OPE('unexpected "iss" (issuer) response parameter value', INVALID_RESPONSE, {
            expected: as.issuer,
            parameters
        });
    }
    switch(expectedState){
        case undefined:
        case expectNoState:
            if (state !== undefined) {
                throw OPE('unexpected "state" response parameter encountered', INVALID_RESPONSE, {
                    expected: undefined,
                    parameters
                });
            }
            break;
        case skipStateCheck:
            break;
        default:
            assertString(expectedState, '"expectedState" argument');
            if (state !== expectedState) {
                throw OPE(state === undefined ? 'response parameter "state" missing' : 'unexpected "state" response parameter value', INVALID_RESPONSE, {
                    expected: expectedState,
                    parameters
                });
            }
    }
    const error = getURLSearchParameter(parameters, 'error');
    if (error) {
        throw new AuthorizationResponseError('authorization response from the server is an error', {
            cause: parameters
        });
    }
    const id_token = getURLSearchParameter(parameters, 'id_token');
    const token = getURLSearchParameter(parameters, 'token');
    if (id_token !== undefined || token !== undefined) {
        throw new UnsupportedOperationError('implicit and hybrid flows are not supported');
    }
    return brand(new URLSearchParams(parameters));
}
function algToSubtle(alg) {
    switch(alg){
        case 'PS256':
        case 'PS384':
        case 'PS512':
            return {
                name: 'RSA-PSS',
                hash: `SHA-${alg.slice(-3)}`
            };
        case 'RS256':
        case 'RS384':
        case 'RS512':
            return {
                name: 'RSASSA-PKCS1-v1_5',
                hash: `SHA-${alg.slice(-3)}`
            };
        case 'ES256':
        case 'ES384':
            return {
                name: 'ECDSA',
                namedCurve: `P-${alg.slice(-3)}`
            };
        case 'ES512':
            return {
                name: 'ECDSA',
                namedCurve: 'P-521'
            };
        case 'EdDSA':
            return 'Ed25519';
        case 'Ed25519':
        case 'ML-DSA-44':
        case 'ML-DSA-65':
        case 'ML-DSA-87':
            return alg;
        default:
            throw new UnsupportedOperationError('unsupported JWS algorithm', {
                cause: {
                    alg
                }
            });
    }
}
async function importJwk(alg, jwk) {
    const { ext, key_ops, use, ...key } = jwk;
    return crypto.subtle.importKey('jwk', key, algToSubtle(alg), true, [
        'verify'
    ]);
}
async function deviceAuthorizationRequest(as, client, clientAuthentication, parameters, options) {
    assertAs(as);
    assertClient(client);
    const url = resolveEndpoint(as, 'device_authorization_endpoint', client.use_mtls_endpoint_aliases, options?.[allowInsecureRequests] !== true);
    const body = new URLSearchParams(parameters);
    body.set('client_id', client.client_id);
    const headers = prepareHeaders(options?.headers);
    headers.set('accept', 'application/json');
    return authenticatedRequest(as, client, clientAuthentication, url, body, headers, options);
}
async function processDeviceAuthorizationResponse(as, client, response) {
    assertAs(as);
    assertClient(client);
    if (!looseInstanceOf(response, Response)) {
        throw CodedTypeError('"response" must be an instance of Response', ERR_INVALID_ARG_TYPE);
    }
    await checkOAuthBodyError(response, 200, 'Device Authorization Endpoint');
    assertReadableResponse(response);
    const json = await getResponseJsonBody(response);
    assertString(json.device_code, '"response" body "device_code" property', INVALID_RESPONSE, {
        body: json
    });
    assertString(json.user_code, '"response" body "user_code" property', INVALID_RESPONSE, {
        body: json
    });
    assertString(json.verification_uri, '"response" body "verification_uri" property', INVALID_RESPONSE, {
        body: json
    });
    let expiresIn = typeof json.expires_in !== 'number' ? parseFloat(json.expires_in) : json.expires_in;
    assertNumber(expiresIn, true, '"response" body "expires_in" property', INVALID_RESPONSE, {
        body: json
    });
    json.expires_in = expiresIn;
    if (json.verification_uri_complete !== undefined) {
        assertString(json.verification_uri_complete, '"response" body "verification_uri_complete" property', INVALID_RESPONSE, {
            body: json
        });
    }
    if (json.interval !== undefined) {
        assertNumber(json.interval, false, '"response" body "interval" property', INVALID_RESPONSE, {
            body: json
        });
    }
    return json;
}
async function deviceCodeGrantRequest(as, client, clientAuthentication, deviceCode, options) {
    assertAs(as);
    assertClient(client);
    assertString(deviceCode, '"deviceCode"');
    const parameters = new URLSearchParams(options?.additionalParameters);
    parameters.set('device_code', deviceCode);
    return tokenEndpointRequest(as, client, clientAuthentication, 'urn:ietf:params:oauth:grant-type:device_code', parameters, options);
}
async function processDeviceCodeResponse(as, client, response, options) {
    return processGenericAccessTokenResponse(as, client, response, undefined, options?.[jweDecrypt], options?.recognizedTokenTypes);
}
async function generateKeyPair(alg, options) {
    assertString(alg, '"alg"');
    const algorithm = algToSubtle(alg);
    if (alg.startsWith('PS') || alg.startsWith('RS')) {
        Object.assign(algorithm, {
            modulusLength: options?.modulusLength ?? 2048,
            publicExponent: new Uint8Array([
                0x01,
                0x00,
                0x01
            ])
        });
    }
    return crypto.subtle.generateKey(algorithm, options?.extractable ?? false, [
        'sign',
        'verify'
    ]);
}
function normalizeHtu(htu) {
    const url = new URL(htu);
    url.search = '';
    url.hash = '';
    return url.href;
}
async function validateDPoP(request, accessToken, accessTokenClaims, options) {
    const headerValue = request.headers.get('dpop');
    if (headerValue === null) {
        throw OPE('operation indicated DPoP use but the request has no DPoP HTTP Header', INVALID_REQUEST, {
            headers: request.headers
        });
    }
    if (request.headers.get('authorization')?.toLowerCase().startsWith('dpop ') === false) {
        throw OPE(`operation indicated DPoP use but the request's Authorization HTTP Header scheme is not DPoP`, INVALID_REQUEST, {
            headers: request.headers
        });
    }
    if (typeof accessTokenClaims.cnf?.jkt !== 'string') {
        throw OPE('operation indicated DPoP use but the JWT Access Token has no jkt confirmation claim', INVALID_REQUEST, {
            claims: accessTokenClaims
        });
    }
    const clockSkew = getClockSkew(options);
    const proof = await validateJwt(headerValue, checkSigningAlgorithm.bind(undefined, options?.signingAlgorithms, undefined, supported), clockSkew, getClockTolerance(options), undefined).then(checkJwtType.bind(undefined, 'dpop+jwt')).then(validatePresence.bind(undefined, [
        'iat',
        'jti',
        'ath',
        'htm',
        'htu'
    ])).then(validateStringClaim.bind(undefined, 'jti'));
    const now = epochTime() + clockSkew;
    const diff = Math.abs(now - proof.claims.iat);
    if (diff > 300) {
        throw OPE('DPoP Proof iat is not recent enough', JWT_TIMESTAMP_CHECK, {
            now,
            claims: proof.claims,
            claim: 'iat'
        });
    }
    if (proof.claims.htm !== request.method) {
        throw OPE('DPoP Proof htm mismatch', JWT_CLAIM_COMPARISON, {
            expected: request.method,
            claims: proof.claims,
            claim: 'htm'
        });
    }
    if (typeof proof.claims.htu !== 'string' || normalizeHtu(proof.claims.htu) !== normalizeHtu(request.url)) {
        throw OPE('DPoP Proof htu mismatch', JWT_CLAIM_COMPARISON, {
            expected: normalizeHtu(request.url),
            claims: proof.claims,
            claim: 'htu'
        });
    }
    {
        const expected = b64u(await crypto.subtle.digest('SHA-256', buf(accessToken)));
        if (proof.claims.ath !== expected) {
            throw OPE('DPoP Proof ath mismatch', JWT_CLAIM_COMPARISON, {
                expected,
                claims: proof.claims,
                claim: 'ath'
            });
        }
    }
    const { jwk, alg } = proof.header;
    if (!isJsonObject(jwk)) {
        throw OPE('DPoP Proof jwk header parameter must be a JSON object', INVALID_REQUEST, {
            header: proof.header
        });
    }
    {
        const expected = await calculateJwkThumbprint(jwk);
        if (accessTokenClaims.cnf.jkt !== expected) {
            throw OPE('JWT Access Token confirmation mismatch', JWT_CLAIM_COMPARISON, {
                expected,
                claims: accessTokenClaims,
                claim: 'cnf.jkt'
            });
        }
    }
    const { 0: protectedHeader, 1: payload, 2: encodedSignature } = headerValue.split('.');
    const signature = b64u(encodedSignature);
    const key = await importJwk(alg, jwk);
    if (key.type !== 'public') {
        throw OPE('DPoP Proof jwk header parameter must contain a public key', INVALID_REQUEST, {
            header: proof.header
        });
    }
    await validateJwsSignature(protectedHeader, payload, key, signature);
}
async function validateJwtAccessToken(as, request, expectedAudience, options) {
    assertAs(as);
    if (!looseInstanceOf(request, Request)) {
        throw CodedTypeError('"request" must be an instance of Request', ERR_INVALID_ARG_TYPE);
    }
    assertString(expectedAudience, '"expectedAudience"');
    const authorization = request.headers.get('authorization');
    if (authorization === null) {
        throw OPE('"request" is missing an Authorization HTTP Header', INVALID_REQUEST, {
            headers: request.headers
        });
    }
    let { 0: scheme, 1: accessToken, length } = authorization.split(/ +/);
    scheme = scheme.toLowerCase();
    switch(scheme){
        case 'dpop':
        case 'bearer':
            break;
        default:
            throw new UnsupportedOperationError('unsupported Authorization HTTP Header scheme', {
                cause: {
                    headers: request.headers
                }
            });
    }
    if (length !== 2) {
        throw OPE('invalid Authorization HTTP Header format', INVALID_REQUEST, {
            headers: request.headers
        });
    }
    const requiredClaims = [
        'iss',
        'exp',
        'aud',
        'sub',
        'iat',
        'jti',
        'client_id'
    ];
    if (options?.requireDPoP || scheme === 'dpop' || request.headers.has('dpop')) {
        requiredClaims.push('cnf');
    }
    const { claims, header } = await validateJwt(accessToken, checkSigningAlgorithm.bind(undefined, options?.signingAlgorithms, undefined, supported), getClockSkew(options), getClockTolerance(options), undefined).then(checkJwtType.bind(undefined, 'at+jwt')).then(validatePresence.bind(undefined, requiredClaims)).then(validateIssuer.bind(undefined, as)).then(validateAudience.bind(undefined, expectedAudience)).catch(reassignRSCode);
    for (const claim of [
        'client_id',
        'jti',
        'sub'
    ]){
        if (typeof claims[claim] !== 'string') {
            throw OPE(`unexpected JWT "${claim}" claim type`, INVALID_REQUEST, {
                claims
            });
        }
    }
    if ('cnf' in claims) {
        if (!isJsonObject(claims.cnf)) {
            throw OPE('unexpected JWT "cnf" (confirmation) claim value', INVALID_REQUEST, {
                claims
            });
        }
        const { 0: cnf, length } = Object.keys(claims.cnf);
        if (length) {
            if (length !== 1) {
                throw new UnsupportedOperationError('multiple confirmation claims are not supported', {
                    cause: {
                        claims
                    }
                });
            }
            if (cnf !== 'jkt') {
                throw new UnsupportedOperationError('unsupported JWT Confirmation method', {
                    cause: {
                        claims
                    }
                });
            }
        }
    }
    const { 0: protectedHeader, 1: payload, 2: encodedSignature } = accessToken.split('.');
    const signature = b64u(encodedSignature);
    const key = await getPublicSigKeyFromIssuerJwksUri(as, options, header);
    await validateJwsSignature(protectedHeader, payload, key, signature);
    if (options?.requireDPoP || scheme === 'dpop' || claims.cnf?.jkt !== undefined || request.headers.has('dpop')) {
        await validateDPoP(request, accessToken, claims, options).catch(reassignRSCode);
    }
    return claims;
}
function reassignRSCode(err) {
    if (err instanceof OperationProcessingError && err?.code === INVALID_REQUEST) {
        err.code = INVALID_RESPONSE;
    }
    throw err;
}
async function backchannelAuthenticationRequest(as, client, clientAuthentication, parameters, options) {
    assertAs(as);
    assertClient(client);
    const url = resolveEndpoint(as, 'backchannel_authentication_endpoint', client.use_mtls_endpoint_aliases, options?.[allowInsecureRequests] !== true);
    const body = new URLSearchParams(parameters);
    body.set('client_id', client.client_id);
    const headers = prepareHeaders(options?.headers);
    headers.set('accept', 'application/json');
    return authenticatedRequest(as, client, clientAuthentication, url, body, headers, options);
}
async function processBackchannelAuthenticationResponse(as, client, response) {
    assertAs(as);
    assertClient(client);
    if (!looseInstanceOf(response, Response)) {
        throw CodedTypeError('"response" must be an instance of Response', ERR_INVALID_ARG_TYPE);
    }
    await checkOAuthBodyError(response, 200, 'Backchannel Authentication Endpoint');
    assertReadableResponse(response);
    const json = await getResponseJsonBody(response);
    assertString(json.auth_req_id, '"response" body "auth_req_id" property', INVALID_RESPONSE, {
        body: json
    });
    let expiresIn = typeof json.expires_in !== 'number' ? parseFloat(json.expires_in) : json.expires_in;
    assertNumber(expiresIn, true, '"response" body "expires_in" property', INVALID_RESPONSE, {
        body: json
    });
    json.expires_in = expiresIn;
    if (json.interval !== undefined) {
        assertNumber(json.interval, false, '"response" body "interval" property', INVALID_RESPONSE, {
            body: json
        });
    }
    return json;
}
async function backchannelAuthenticationGrantRequest(as, client, clientAuthentication, authReqId, options) {
    assertAs(as);
    assertClient(client);
    assertString(authReqId, '"authReqId"');
    const parameters = new URLSearchParams(options?.additionalParameters);
    parameters.set('auth_req_id', authReqId);
    return tokenEndpointRequest(as, client, clientAuthentication, 'urn:openid:params:grant-type:ciba', parameters, options);
}
async function processBackchannelAuthenticationGrantResponse(as, client, response, options) {
    return processGenericAccessTokenResponse(as, client, response, undefined, options?.[jweDecrypt], options?.recognizedTokenTypes);
}
async function dynamicClientRegistrationRequest(as, metadata, options) {
    assertAs(as);
    const url = resolveEndpoint(as, 'registration_endpoint', metadata.use_mtls_endpoint_aliases, options?.[allowInsecureRequests] !== true);
    const headers = prepareHeaders(options?.headers);
    headers.set('accept', 'application/json');
    headers.set('content-type', 'application/json');
    const method = 'POST';
    if (options?.DPoP) {
        assertDPoP(options.DPoP);
        await options.DPoP.addProof(url, headers, method, options.initialAccessToken);
    }
    if (options?.initialAccessToken) {
        headers.set('authorization', `${headers.has('dpop') ? 'DPoP' : 'Bearer'} ${options.initialAccessToken}`);
    }
    const response = await (options?.[customFetch] || fetch)(url.href, {
        body: JSON.stringify(metadata),
        headers: Object.fromEntries(headers.entries()),
        method,
        redirect: 'manual',
        signal: signal(url, options?.signal)
    });
    options?.DPoP?.cacheNonce(response, url);
    return response;
}
async function processDynamicClientRegistrationResponse(response) {
    if (!looseInstanceOf(response, Response)) {
        throw CodedTypeError('"response" must be an instance of Response', ERR_INVALID_ARG_TYPE);
    }
    await checkOAuthBodyError(response, 201, 'Dynamic Client Registration Endpoint');
    assertReadableResponse(response);
    const json = await getResponseJsonBody(response);
    assertString(json.client_id, '"response" body "client_id" property', INVALID_RESPONSE, {
        body: json
    });
    if (json.client_secret !== undefined) {
        assertString(json.client_secret, '"response" body "client_secret" property', INVALID_RESPONSE, {
            body: json
        });
    }
    if (json.client_secret) {
        assertNumber(json.client_secret_expires_at, true, '"response" body "client_secret_expires_at" property', INVALID_RESPONSE, {
            body: json
        });
    }
    return json;
}
async function resourceDiscoveryRequest(resourceIdentifier, options) {
    return performDiscovery(resourceIdentifier, 'resourceIdentifier', (url)=>{
        prependWellKnown(url, '.well-known/oauth-protected-resource', true);
        return url;
    }, options);
}
async function processResourceDiscoveryResponse(expectedResourceIdentifier, response) {
    const expected = expectedResourceIdentifier;
    if (!(expected instanceof URL) && expected !== _nodiscoverycheck) {
        throw CodedTypeError('"expectedResourceIdentifier" must be an instance of URL', ERR_INVALID_ARG_TYPE);
    }
    if (!looseInstanceOf(response, Response)) {
        throw CodedTypeError('"response" must be an instance of Response', ERR_INVALID_ARG_TYPE);
    }
    if (response.status !== 200) {
        throw OPE('"response" is not a conform Resource Server Metadata response (unexpected HTTP status code)', RESPONSE_IS_NOT_CONFORM, response);
    }
    assertReadableResponse(response);
    const json = await getResponseJsonBody(response);
    assertString(json.resource, '"response" body "resource" property', INVALID_RESPONSE, {
        body: json
    });
    if (expected !== _nodiscoverycheck && new URL(json.resource).href !== expected.href) {
        throw OPE('"response" body "resource" property does not match the expected value', JSON_ATTRIBUTE_COMPARISON, {
            expected: expected.href,
            body: json,
            attribute: 'resource'
        });
    }
    return json;
}
async function getResponseJsonBody(response, check = assertApplicationJson) {
    let json;
    try {
        json = await response.json();
    } catch (cause) {
        check(response);
        throw OPE('failed to parse "response" body as JSON', PARSE_ERROR, cause);
    }
    if (!isJsonObject(json)) {
        throw OPE('"response" body must be a top level object', INVALID_RESPONSE, {
            body: json
        });
    }
    return json;
}
const _nopkce = nopkce;
const _nodiscoverycheck = Symbol();
const _expectedIssuer = Symbol();
}),
"[project]/web/node_modules/openid-client/build/index.js [middleware] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClientError",
    ()=>ClientError,
    "ClientSecretBasic",
    ()=>ClientSecretBasic,
    "ClientSecretJwt",
    ()=>ClientSecretJwt,
    "ClientSecretPost",
    ()=>ClientSecretPost,
    "Configuration",
    ()=>Configuration,
    "None",
    ()=>None,
    "PrivateKeyJwt",
    ()=>PrivateKeyJwt,
    "TlsClientAuth",
    ()=>TlsClientAuth,
    "allowInsecureRequests",
    ()=>allowInsecureRequests,
    "authorizationCodeGrant",
    ()=>authorizationCodeGrant,
    "buildAuthorizationUrl",
    ()=>buildAuthorizationUrl,
    "buildAuthorizationUrlWithJAR",
    ()=>buildAuthorizationUrlWithJAR,
    "buildAuthorizationUrlWithPAR",
    ()=>buildAuthorizationUrlWithPAR,
    "buildEndSessionUrl",
    ()=>buildEndSessionUrl,
    "calculatePKCECodeChallenge",
    ()=>calculatePKCECodeChallenge,
    "clientCredentialsGrant",
    ()=>clientCredentialsGrant,
    "clockSkew",
    ()=>clockSkew,
    "clockTolerance",
    ()=>clockTolerance,
    "customFetch",
    ()=>customFetch,
    "discovery",
    ()=>discovery,
    "dynamicClientRegistration",
    ()=>dynamicClientRegistration,
    "enableDecryptingResponses",
    ()=>enableDecryptingResponses,
    "enableDetachedSignatureResponseChecks",
    ()=>enableDetachedSignatureResponseChecks,
    "enableNonRepudiationChecks",
    ()=>enableNonRepudiationChecks,
    "fetchProtectedResource",
    ()=>fetchProtectedResource,
    "fetchUserInfo",
    ()=>fetchUserInfo,
    "genericGrantRequest",
    ()=>genericGrantRequest,
    "getDPoPHandle",
    ()=>getDPoPHandle,
    "getJwksCache",
    ()=>getJwksCache,
    "implicitAuthentication",
    ()=>implicitAuthentication,
    "initiateBackchannelAuthentication",
    ()=>initiateBackchannelAuthentication,
    "initiateDeviceAuthorization",
    ()=>initiateDeviceAuthorization,
    "modifyAssertion",
    ()=>modifyAssertion,
    "pollBackchannelAuthenticationGrant",
    ()=>pollBackchannelAuthenticationGrant,
    "pollDeviceAuthorizationGrant",
    ()=>pollDeviceAuthorizationGrant,
    "randomDPoPKeyPair",
    ()=>randomDPoPKeyPair,
    "randomNonce",
    ()=>randomNonce,
    "randomPKCECodeVerifier",
    ()=>randomPKCECodeVerifier,
    "randomState",
    ()=>randomState,
    "refreshTokenGrant",
    ()=>refreshTokenGrant,
    "setJwksCache",
    ()=>setJwksCache,
    "skipStateCheck",
    ()=>skipStateCheck,
    "skipSubjectCheck",
    ()=>skipSubjectCheck,
    "tokenIntrospection",
    ()=>tokenIntrospection,
    "tokenRevocation",
    ()=>tokenRevocation,
    "useCodeIdTokenResponseType",
    ()=>useCodeIdTokenResponseType,
    "useIdTokenResponseType",
    ()=>useIdTokenResponseType,
    "useJwtResponseMode",
    ()=>useJwtResponseMode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/oauth4webapi/build/index.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwe$2f$compact$2f$decrypt$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/jwe/compact/decrypt.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/util/errors.js [middleware] (ecmascript)");
;
;
;
let headers;
let USER_AGENT;
if (typeof navigator === 'undefined' || !navigator.userAgent?.startsWith?.('Mozilla/5.0 ')) {
    const NAME = 'openid-client';
    const VERSION = 'v6.8.8';
    USER_AGENT = `${NAME}/${VERSION}`;
    headers = {
        'user-agent': USER_AGENT
    };
}
const int = (config)=>{
    return props.get(config);
};
let props;
;
function ClientSecretPost(clientSecret) {
    if (clientSecret !== undefined) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ClientSecretPost"](clientSecret);
    }
    const cache = new WeakMap();
    return (as, client, body, headers)=>{
        let auth;
        if (!(auth = cache.get(client))) {
            assertString(client.client_secret, '"metadata.client_secret"');
            auth = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ClientSecretPost"](client.client_secret);
            cache.set(client, auth);
        }
        return auth(as, client, body, headers);
    };
}
function assertString(input, it) {
    if (typeof input !== 'string') {
        throw CodedTypeError(`${it} must be a string`, ERR_INVALID_ARG_TYPE);
    }
    if (input.length === 0) {
        throw CodedTypeError(`${it} must not be empty`, ERR_INVALID_ARG_VALUE);
    }
}
function ClientSecretBasic(clientSecret) {
    if (clientSecret !== undefined) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ClientSecretBasic"](clientSecret);
    }
    const cache = new WeakMap();
    return (as, client, body, headers)=>{
        let auth;
        if (!(auth = cache.get(client))) {
            assertString(client.client_secret, '"metadata.client_secret"');
            auth = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ClientSecretBasic"](client.client_secret);
            cache.set(client, auth);
        }
        return auth(as, client, body, headers);
    };
}
function ClientSecretJwt(clientSecret, options) {
    if (clientSecret !== undefined) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ClientSecretJwt"](clientSecret, options);
    }
    const cache = new WeakMap();
    return (as, client, body, headers)=>{
        let auth;
        if (!(auth = cache.get(client))) {
            assertString(client.client_secret, '"metadata.client_secret"');
            auth = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ClientSecretJwt"](client.client_secret, options);
            cache.set(client, auth);
        }
        return auth(as, client, body, headers);
    };
}
function None() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["None"]();
}
function PrivateKeyJwt(clientPrivateKey, options) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PrivateKeyJwt"](clientPrivateKey, options);
}
function TlsClientAuth() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["TlsClientAuth"]();
}
const skipStateCheck = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["skipStateCheck"];
const skipSubjectCheck = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["skipSubjectCheck"];
const customFetch = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["customFetch"];
const modifyAssertion = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["modifyAssertion"];
const clockSkew = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["clockSkew"];
const clockTolerance = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["clockTolerance"];
const ERR_INVALID_ARG_VALUE = 'ERR_INVALID_ARG_VALUE';
const ERR_INVALID_ARG_TYPE = 'ERR_INVALID_ARG_TYPE';
function CodedTypeError(message, code, cause) {
    const err = new TypeError(message, {
        cause
    });
    Object.assign(err, {
        code
    });
    return err;
}
function calculatePKCECodeChallenge(codeVerifier) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["calculatePKCECodeChallenge"](codeVerifier);
}
function randomPKCECodeVerifier() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["generateRandomCodeVerifier"]();
}
function randomNonce() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["generateRandomNonce"]();
}
function randomState() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["generateRandomState"]();
}
class ClientError extends Error {
    code;
    constructor(message, options){
        super(message, options);
        this.name = this.constructor.name;
        this.code = options?.code;
        Error.captureStackTrace?.(this, this.constructor);
    }
}
const decoder = new TextDecoder();
function e(msg, cause, code) {
    return new ClientError(msg, {
        cause,
        code
    });
}
function errorHandler(err) {
    if (err instanceof TypeError || err instanceof ClientError || err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ResponseBodyError"] || err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AuthorizationResponseError"] || err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["WWWAuthenticateChallengeError"]) {
        throw err;
    }
    if (err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["OperationProcessingError"]) {
        switch(err.code){
            case __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["HTTP_REQUEST_FORBIDDEN"]:
                throw e('only requests to HTTPS are allowed', err, err.code);
            case __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["REQUEST_PROTOCOL_FORBIDDEN"]:
                throw e('only requests to HTTP or HTTPS are allowed', err, err.code);
            case __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["RESPONSE_IS_NOT_CONFORM"]:
                throw e('unexpected HTTP response status code', err.cause, err.code);
            case __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["RESPONSE_IS_NOT_JSON"]:
                throw e('unexpected response content-type', err.cause, err.code);
            case __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PARSE_ERROR"]:
                throw e('parsing error occured', err, err.code);
            case __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["INVALID_RESPONSE"]:
                throw e('invalid response encountered', err, err.code);
            case __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWT_CLAIM_COMPARISON"]:
                throw e('unexpected JWT claim value encountered', err, err.code);
            case __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JSON_ATTRIBUTE_COMPARISON"]:
                throw e('unexpected JSON attribute value encountered', err, err.code);
            case __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWT_TIMESTAMP_CHECK"]:
                throw e('JWT timestamp claim value failed validation', err, err.code);
            default:
                throw e(err.message, err, err.code);
        }
    }
    if (err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["UnsupportedOperationError"]) {
        throw e('unsupported operation', err, err.code);
    }
    if (err instanceof DOMException) {
        switch(err.name){
            case 'OperationError':
                throw e('runtime operation error', err, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["UNSUPPORTED_OPERATION"]);
            case 'NotSupportedError':
                throw e('runtime unsupported operation', err, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["UNSUPPORTED_OPERATION"]);
            case 'TimeoutError':
                throw e('operation timed out', err, 'OAUTH_TIMEOUT');
            case 'AbortError':
                throw e('operation aborted', err, 'OAUTH_ABORT');
        }
    }
    throw new ClientError('something went wrong', {
        cause: err
    });
}
function randomDPoPKeyPair(alg, options) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["generateKeyPair"](alg ?? 'ES256', {
        extractable: options?.extractable
    }).catch(errorHandler);
}
function handleEntraId(server, as, options) {
    if (server.origin === 'https://login.microsoftonline.com' && (!options?.algorithm || options.algorithm === 'oidc')) {
        as[kEntraId] = true;
        return true;
    }
    return false;
}
function handleB2Clogin(server, options) {
    if (server.hostname.endsWith('.b2clogin.com') && (!options?.algorithm || options.algorithm === 'oidc')) {
        return true;
    }
    return false;
}
async function dynamicClientRegistration(server, metadata, clientAuthentication, options) {
    let as;
    if (options?.flag === retry) {
        as = options.as;
    } else {
        as = await performDiscovery(server, options);
    }
    const clockSkew = metadata[__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["clockSkew"]] ?? 0;
    const clockTolerance = metadata[__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["clockTolerance"]] ?? 30;
    metadata = structuredClone(metadata);
    metadata[__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["clockSkew"]] = clockSkew;
    metadata[__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["clockTolerance"]] = clockTolerance;
    const timeout = options?.timeout ?? 30;
    const signal = AbortSignal.timeout(timeout * 1000);
    let registered;
    try {
        registered = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["dynamicClientRegistrationRequest"](as, metadata, {
            initialAccessToken: options?.initialAccessToken,
            DPoP: options?.DPoP,
            headers: new Headers(headers),
            [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["customFetch"]]: options?.[customFetch],
            [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["allowInsecureRequests"]]: options?.execute?.includes(allowInsecureRequests),
            signal
        }).then(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["processDynamicClientRegistrationResponse"]);
    } catch (err) {
        if (retryable(err, options)) {
            return dynamicClientRegistration(server, metadata, clientAuthentication, {
                ...options,
                flag: retry,
                as
            });
        }
        errorHandler(err);
    }
    registered[__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["clockSkew"]] = clockSkew;
    registered[__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["clockTolerance"]] = clockTolerance;
    const instance = new Configuration(as, registered.client_id, registered, clientAuthentication);
    let internals = int(instance);
    if (options?.[customFetch]) {
        internals.fetch = options[customFetch];
    }
    if (options?.timeout !== undefined) {
        internals.timeout = options.timeout;
    }
    if (options?.execute) {
        for (const extension of options.execute){
            extension(instance);
        }
    }
    return instance;
}
async function discovery(server, clientId, metadata, clientAuthentication, options) {
    const as = await performDiscovery(server, options);
    const instance = new Configuration(as, clientId, metadata, clientAuthentication);
    let internals = int(instance);
    if (options?.[customFetch]) {
        internals.fetch = options[customFetch];
    }
    if (options?.timeout !== undefined) {
        internals.timeout = options.timeout;
    }
    if (options?.execute) {
        for (const extension of options.execute){
            extension(instance);
        }
    }
    return instance;
}
async function performDiscovery(server, options) {
    if (!(server instanceof URL)) {
        throw CodedTypeError('"server" must be an instance of URL', ERR_INVALID_ARG_TYPE);
    }
    const resolve = !server.href.includes('/.well-known/');
    const timeout = options?.timeout ?? 30;
    const signal = AbortSignal.timeout(timeout * 1000);
    const as = await (resolve ? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["discoveryRequest"](server, {
        algorithm: options?.algorithm,
        [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["customFetch"]]: options?.[customFetch],
        [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["allowInsecureRequests"]]: options?.execute?.includes(allowInsecureRequests),
        signal,
        headers: new Headers(headers)
    }) : (options?.[customFetch] || fetch)((()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["checkProtocol"](server, options?.execute?.includes(allowInsecureRequests) ? false : true);
        return server.href;
    })(), {
        headers: Object.fromEntries(new Headers({
            accept: 'application/json',
            ...headers
        }).entries()),
        body: undefined,
        method: 'GET',
        redirect: 'manual',
        signal
    })).then((response)=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["processDiscoveryResponse"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["_nodiscoverycheck"], response)).catch(errorHandler);
    if (resolve && new URL(as.issuer).href !== server.href) {
        handleEntraId(server, as, options) || handleB2Clogin(server, options) || (()=>{
            throw new ClientError('discovered metadata issuer does not match the expected issuer', {
                code: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JSON_ATTRIBUTE_COMPARISON"],
                cause: {
                    expected: server.href,
                    body: as,
                    attribute: 'issuer'
                }
            });
        })();
    }
    return as;
}
function isRsaOaep(input) {
    return input.name === 'RSA-OAEP';
}
function isEcdh(input) {
    return input.name === 'ECDH';
}
const ecdhEs = 'ECDH-ES';
const ecdhEsA128Kw = 'ECDH-ES+A128KW';
const ecdhEsA192Kw = 'ECDH-ES+A192KW';
const ecdhEsA256Kw = 'ECDH-ES+A256KW';
function checkEcdhAlg(algs, alg, pk) {
    switch(alg){
        case undefined:
            algs.add(ecdhEs);
            algs.add(ecdhEsA128Kw);
            algs.add(ecdhEsA192Kw);
            algs.add(ecdhEsA256Kw);
            break;
        case ecdhEs:
        case ecdhEsA128Kw:
        case ecdhEsA192Kw:
        case ecdhEsA256Kw:
            algs.add(alg);
            break;
        default:
            throw CodedTypeError('invalid key alg', ERR_INVALID_ARG_VALUE, {
                pk
            });
    }
}
function enableDecryptingResponses(config, contentEncryptionAlgorithms = [
    'A128GCM',
    'A192GCM',
    'A256GCM',
    'A128CBC-HS256',
    'A192CBC-HS384',
    'A256CBC-HS512'
], ...keys) {
    if (int(config).decrypt !== undefined) {
        throw new TypeError('enableDecryptingResponses can only be called on a given Configuration instance once');
    }
    if (keys.length === 0) {
        throw CodedTypeError('no keys were provided', ERR_INVALID_ARG_VALUE);
    }
    const algs = new Set();
    const normalized = [];
    for (const pk of keys){
        let key;
        if ('key' in pk) {
            key = {
                key: pk.key
            };
            if (typeof pk.alg === 'string') key.alg = pk.alg;
            if (typeof pk.kid === 'string') key.kid = pk.kid;
        } else {
            key = {
                key: pk
            };
        }
        if (key.key.type !== 'private') {
            throw CodedTypeError('only private keys must be provided', ERR_INVALID_ARG_VALUE);
        }
        if (isRsaOaep(key.key.algorithm)) {
            switch(key.key.algorithm.hash.name){
                case 'SHA-1':
                case 'SHA-256':
                case 'SHA-384':
                case 'SHA-512':
                    {
                        let alg = 'RSA-OAEP';
                        let sha;
                        if (sha = parseInt(key.key.algorithm.hash.name.slice(-3), 10)) {
                            alg = `${alg}-${sha}`;
                        }
                        key.alg ||= alg;
                        if (alg !== key.alg) throw CodedTypeError('invalid key alg', ERR_INVALID_ARG_VALUE, {
                            pk
                        });
                        algs.add(key.alg);
                        break;
                    }
                default:
                    throw CodedTypeError('only SHA-512, SHA-384, SHA-256, and SHA-1 RSA-OAEP keys are supported', ERR_INVALID_ARG_VALUE);
            }
        } else if (isEcdh(key.key.algorithm)) {
            if (key.key.algorithm.namedCurve !== 'P-256') {
                throw CodedTypeError('Only P-256 ECDH keys are supported', ERR_INVALID_ARG_VALUE);
            }
            checkEcdhAlg(algs, key.alg, pk);
        } else if (key.key.algorithm.name === 'X25519') {
            checkEcdhAlg(algs, key.alg, pk);
        } else {
            throw CodedTypeError('only RSA-OAEP, ECDH, or X25519 keys are supported', ERR_INVALID_ARG_VALUE);
        }
        normalized.push(key);
    }
    int(config).decrypt = async (jwe)=>decrypt(normalized, jwe, contentEncryptionAlgorithms, [
            ...algs
        ]).catch(errorHandler);
}
function checkCryptoKey(key, alg, epk) {
    if (alg.startsWith('RSA-OAEP')) {
        return key.algorithm.name === 'RSA-OAEP';
    }
    if (alg.startsWith('ECDH-ES')) {
        if (key.algorithm.name !== 'ECDH' && key.algorithm.name !== 'X25519') {
            return false;
        }
        if (key.algorithm.name === 'ECDH') {
            return epk?.crv === key.algorithm.namedCurve;
        }
        if (key.algorithm.name === 'X25519') {
            return epk?.crv === 'X25519';
        }
    }
    return false;
}
function selectCryptoKeyForDecryption(keys, alg, kid, epk) {
    const { 0: key, length } = keys.filter((key)=>{
        if (kid !== undefined && kid !== key.kid) {
            return false;
        }
        if (key.alg && alg !== key.alg) {
            return false;
        }
        return checkCryptoKey(key.key, alg, epk);
    });
    if (!key) {
        throw e('no applicable decryption key selected', undefined, 'OAUTH_DECRYPTION_FAILED');
    }
    if (length !== 1) {
        throw e('multiple applicable decryption keys selected', undefined, 'OAUTH_DECRYPTION_FAILED');
    }
    return key.key;
}
async function decrypt(keys, jwe, contentEncryptionAlgorithms, keyManagementAlgorithms) {
    return decoder.decode((await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwe$2f$compact$2f$decrypt$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["compactDecrypt"])(jwe, (header)=>{
        const { kid, alg, epk } = header;
        return selectCryptoKeyForDecryption(keys, alg, kid, epk);
    }, {
        keyManagementAlgorithms,
        contentEncryptionAlgorithms
    }).catch((err)=>{
        if (err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JOSEError"]) {
            throw e('decryption failed', err, 'OAUTH_DECRYPTION_FAILED');
        }
        errorHandler(err);
    })).plaintext);
}
function getServerHelpers(metadata) {
    return {
        supportsPKCE: {
            __proto__: null,
            value (method = 'S256') {
                return metadata.code_challenge_methods_supported?.includes(method) === true;
            }
        }
    };
}
function addServerHelpers(metadata) {
    Object.defineProperties(metadata, getServerHelpers(metadata));
}
const kEntraId = Symbol();
class Configuration {
    constructor(server, clientId, metadata, clientAuthentication){
        if (typeof clientId !== 'string' || !clientId.length) {
            throw CodedTypeError('"clientId" must be a non-empty string', ERR_INVALID_ARG_TYPE);
        }
        if (typeof metadata === 'string') {
            metadata = {
                client_secret: metadata
            };
        }
        if (metadata?.client_id !== undefined && clientId !== metadata.client_id) {
            throw CodedTypeError('"clientId" and "metadata.client_id" must be the same', ERR_INVALID_ARG_VALUE);
        }
        const client = {
            ...structuredClone(metadata),
            client_id: clientId
        };
        client[__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["clockSkew"]] = metadata?.[__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["clockSkew"]] ?? 0;
        client[__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["clockTolerance"]] = metadata?.[__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["clockTolerance"]] ?? 30;
        let auth;
        if (clientAuthentication) {
            auth = clientAuthentication;
        } else {
            if (typeof client.client_secret === 'string' && client.client_secret.length) {
                auth = ClientSecretPost(client.client_secret);
            } else {
                auth = None();
            }
        }
        let c = Object.freeze(client);
        const clone = structuredClone(server);
        if (kEntraId in server) {
            clone[__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["_expectedIssuer"]] = ({ claims: { tid } })=>server.issuer.replace('{tenantid}', tid);
        }
        let as = Object.freeze(clone);
        props ||= new WeakMap();
        props.set(this, {
            __proto__: null,
            as,
            c,
            auth,
            tlsOnly: true,
            timeout: 30,
            jwksCache: {}
        });
    }
    serverMetadata() {
        const metadata = structuredClone(int(this).as);
        addServerHelpers(metadata);
        return metadata;
    }
    clientMetadata() {
        const metadata = structuredClone(int(this).c);
        return metadata;
    }
    get timeout() {
        return int(this).timeout;
    }
    set timeout(value) {
        int(this).timeout = value;
    }
    get [customFetch]() {
        return int(this).fetch;
    }
    set [customFetch](value) {
        int(this).fetch = value;
    }
}
Object.freeze(Configuration.prototype);
function getHelpers(response) {
    let exp = undefined;
    if (response.expires_in !== undefined) {
        exp = Date.now() + response.expires_in * 1000;
    }
    return {
        expiresIn: {
            __proto__: null,
            value () {
                if (exp) {
                    const now = Date.now();
                    if (exp > now) {
                        return Math.floor((exp - now) / 1000);
                    }
                    return 0;
                }
                return undefined;
            }
        },
        claims: {
            __proto__: null,
            value () {
                return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["getValidatedIdTokenClaims"](response);
            }
        }
    };
}
function addHelpers(response) {
    Object.defineProperties(response, getHelpers(response));
}
function getDPoPHandle(config, keyPair, options) {
    checkConfig(config);
    return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DPoP"](int(config).c, keyPair, options);
}
async function handleRetryAfter(response, currentInterval, signal, throwIfInvalid = false) {
    const retryAfter = response.headers.get('retry-after')?.trim();
    if (retryAfter === undefined) return;
    let delaySeconds;
    if (/^\d+$/.test(retryAfter)) {
        delaySeconds = parseInt(retryAfter, 10);
    } else {
        const retryDate = new Date(retryAfter);
        if (Number.isFinite(retryDate.getTime())) {
            const now = new Date();
            const delayMs = retryDate.getTime() - now.getTime();
            if (delayMs > 0) {
                delaySeconds = Math.ceil(delayMs / 1000);
            }
        }
    }
    if (throwIfInvalid && !Number.isFinite(delaySeconds)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["OperationProcessingError"]('invalid Retry-After header value', {
            cause: response
        });
    }
    if (delaySeconds > currentInterval) {
        await wait(delaySeconds - currentInterval, signal);
    }
}
function wait(duration, signal) {
    return new Promise((resolve, reject)=>{
        const waitStep = (remaining)=>{
            try {
                signal.throwIfAborted();
            } catch (err) {
                reject(err);
                return;
            }
            if (remaining <= 0) {
                resolve();
                return;
            }
            const currentWait = Math.min(remaining, 5);
            setTimeout(()=>waitStep(remaining - currentWait), currentWait * 1000);
        };
        waitStep(duration);
    });
}
function pollRequestSignal(pollingSignal, timeout) {
    const timeoutSignal = signal(timeout);
    if (!timeoutSignal) {
        return {
            signal: pollingSignal,
            cleanup () {}
        };
    }
    const controller = new AbortController();
    const abort = (event)=>{
        const source = event.target;
        controller.abort(source.reason);
    };
    if (pollingSignal.aborted) {
        controller.abort(pollingSignal.reason);
    } else if (timeoutSignal.aborted) {
        controller.abort(timeoutSignal.reason);
    } else {
        pollingSignal.addEventListener('abort', abort, {
            once: true
        });
        timeoutSignal.addEventListener('abort', abort, {
            once: true
        });
    }
    return {
        signal: controller.signal,
        cleanup () {
            pollingSignal.removeEventListener('abort', abort);
            timeoutSignal.removeEventListener('abort', abort);
        }
    };
}
async function pollGrant(config, authorizationResponse, grantCode, request, processResponse, parameters, options) {
    const requestParameters = new URLSearchParams(parameters);
    let interval = authorizationResponse.interval ?? 5;
    const pollingSignal = options?.signal ?? AbortSignal.timeout(authorizationResponse.expires_in * 1000);
    for(;;){
        try {
            await wait(interval, pollingSignal);
        } catch (error) {
            errorHandler(error);
        }
        const { as, c, auth, fetch: fetch1, tlsOnly, nonRepudiation, timeout, decrypt } = int(config);
        const requestSignal = pollRequestSignal(pollingSignal, timeout);
        try {
            const response = await request(as, c, auth, grantCode, {
                [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["customFetch"]]: fetch1,
                [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["allowInsecureRequests"]]: !tlsOnly,
                additionalParameters: requestParameters,
                DPoP: options?.DPoP,
                headers: new Headers(headers),
                signal: requestSignal.signal
            }).catch(errorHandler);
            if (response.status === 503 && response.headers.has('retry-after')) {
                await response.body?.cancel();
                await handleRetryAfter(response, interval, pollingSignal, true);
                options = {
                    ...options,
                    flag: undefined
                };
                continue;
            }
            let result;
            try {
                result = await processResponse(as, c, response, {
                    [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jweDecrypt"]]: decrypt
                });
            } catch (error) {
                if (retryable(error, options)) {
                    options = {
                        ...options,
                        flag: retry
                    };
                    continue;
                }
                if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ResponseBodyError"] && (error.error === 'slow_down' || error.error === 'authorization_pending')) {
                    if (error.error === 'slow_down') interval += 5;
                    await handleRetryAfter(error.response, interval, pollingSignal);
                    options = {
                        ...options,
                        flag: undefined
                    };
                    continue;
                }
                errorHandler(error);
            }
            result.id_token && await nonRepudiation?.(response);
            addHelpers(result);
            return result;
        } finally{
            requestSignal.cleanup();
        }
    }
}
async function pollDeviceAuthorizationGrant(config, deviceAuthorizationResponse, parameters, options) {
    checkConfig(config);
    return pollGrant(config, deviceAuthorizationResponse, deviceAuthorizationResponse.device_code, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["deviceCodeGrantRequest"], __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["processDeviceCodeResponse"], parameters, options);
}
async function initiateDeviceAuthorization(config, parameters) {
    checkConfig(config);
    const { as, c, auth, fetch: fetch1, tlsOnly, timeout } = int(config);
    return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["deviceAuthorizationRequest"](as, c, auth, parameters, {
        [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["customFetch"]]: fetch1,
        [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["allowInsecureRequests"]]: !tlsOnly,
        headers: new Headers(headers),
        signal: signal(timeout)
    }).then((response)=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["processDeviceAuthorizationResponse"](as, c, response)).catch(errorHandler);
}
async function initiateBackchannelAuthentication(config, parameters) {
    checkConfig(config);
    const { as, c, auth, fetch: fetch1, tlsOnly, timeout } = int(config);
    return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["backchannelAuthenticationRequest"](as, c, auth, parameters, {
        [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["customFetch"]]: fetch1,
        [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["allowInsecureRequests"]]: !tlsOnly,
        headers: new Headers(headers),
        signal: signal(timeout)
    }).then((response)=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["processBackchannelAuthenticationResponse"](as, c, response)).catch(errorHandler);
}
async function pollBackchannelAuthenticationGrant(config, backchannelAuthenticationResponse, parameters, options) {
    checkConfig(config);
    return pollGrant(config, backchannelAuthenticationResponse, backchannelAuthenticationResponse.auth_req_id, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["backchannelAuthenticationGrantRequest"], __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["processBackchannelAuthenticationGrantResponse"], parameters, options);
}
function allowInsecureRequests(config) {
    int(config).tlsOnly = false;
}
function setJwksCache(config, jwksCache) {
    int(config).jwksCache = structuredClone(jwksCache);
}
function getJwksCache(config) {
    const cache = int(config).jwksCache;
    if (cache.uat) {
        return cache;
    }
    return undefined;
}
function enableNonRepudiationChecks(config) {
    checkConfig(config);
    int(config).nonRepudiation = (response)=>{
        const { as, fetch: fetch1, tlsOnly, timeout, jwksCache } = int(config);
        return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateApplicationLevelSignature"](as, response, {
            [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["customFetch"]]: fetch1,
            [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["allowInsecureRequests"]]: !tlsOnly,
            headers: new Headers(headers),
            signal: signal(timeout),
            [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jwksCache"]]: jwksCache
        }).catch(errorHandler);
    };
}
function useJwtResponseMode(config) {
    checkConfig(config);
    const { hybrid, implicit } = int(config);
    if (hybrid || implicit) {
        throw e('JARM cannot be combined with a hybrid or implicit response types', undefined, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["UNSUPPORTED_OPERATION"]);
    }
    int(config).jarm = (authorizationResponse, expectedState)=>validateJARMResponse(config, authorizationResponse, expectedState);
}
function enableDetachedSignatureResponseChecks(config) {
    if (!int(config).hybrid) {
        throw e('"code id_token" response type must be configured to be used first', undefined, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["UNSUPPORTED_OPERATION"]);
    }
    int(config).hybrid = (authorizationResponse, expectedNonce, expectedState, maxAge)=>validateCodeIdTokenResponse(config, authorizationResponse, expectedNonce, expectedState, maxAge, true);
}
async function implicitAuthentication(config, currentUrl, expectedNonce, checks) {
    checkConfig(config);
    if (!(currentUrl instanceof URL) && !webInstanceOf(currentUrl, 'Request')) {
        throw CodedTypeError('"currentUrl" must be an instance of URL, or Request', ERR_INVALID_ARG_TYPE);
    }
    if (typeof expectedNonce !== 'string') {
        throw CodedTypeError('"expectedNonce" must be a string', ERR_INVALID_ARG_TYPE);
    }
    const { as, c, fetch: fetch1, tlsOnly, timeout, decrypt, implicit, jwksCache } = int(config);
    if (!implicit) {
        throw new TypeError('implicitAuthentication() cannot be used by clients using flows other than response_type=id_token');
    }
    let params;
    if (!(currentUrl instanceof URL)) {
        const request = currentUrl;
        switch(request.method){
            case 'GET':
                params = new URLSearchParams(new URL(request.url).hash.slice(1));
                break;
            case 'POST':
                params = new URLSearchParams(await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["formPostResponse"](request));
                break;
            default:
                throw CodedTypeError('unexpected Request HTTP method', ERR_INVALID_ARG_VALUE);
        }
    } else {
        params = new URLSearchParams(currentUrl.hash.slice(1));
    }
    try {
        {
            const decoy = new URLSearchParams(params);
            decoy.delete('id_token');
            __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateAuthResponse"]({
                ...as,
                authorization_response_iss_parameter_supported: undefined
            }, c, decoy, checks?.expectedState);
        }
        {
            const decoy = new Response(JSON.stringify({
                access_token: 'decoy',
                token_type: 'bearer',
                id_token: params.get('id_token')
            }), {
                headers: new Headers({
                    'content-type': 'application/json'
                })
            });
            const ref = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["processAuthorizationCodeResponse"](as, c, decoy, {
                expectedNonce,
                maxAge: checks?.maxAge,
                [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jweDecrypt"]]: decrypt
            });
            await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateApplicationLevelSignature"](as, decoy, {
                [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["customFetch"]]: fetch1,
                [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["allowInsecureRequests"]]: !tlsOnly,
                headers: new Headers(headers),
                signal: signal(timeout),
                [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jwksCache"]]: jwksCache
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["getValidatedIdTokenClaims"](ref);
        }
    } catch (err) {
        errorHandler(err);
    }
}
function useCodeIdTokenResponseType(config) {
    checkConfig(config);
    const { jarm, implicit } = int(config);
    if (jarm || implicit) {
        throw e('"code id_token" response type cannot be combined with JARM or implicit response type', undefined, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["UNSUPPORTED_OPERATION"]);
    }
    int(config).hybrid = (authorizationResponse, expectedNonce, expectedState, maxAge)=>validateCodeIdTokenResponse(config, authorizationResponse, expectedNonce, expectedState, maxAge, false);
}
function useIdTokenResponseType(config) {
    checkConfig(config);
    const { jarm, hybrid } = int(config);
    if (jarm || hybrid) {
        throw e('"id_token" response type cannot be combined with JARM or hybrid response type', undefined, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["UNSUPPORTED_OPERATION"]);
    }
    int(config).implicit = true;
}
function stripParams(url) {
    url = new URL(url);
    url.search = '';
    url.hash = '';
    return url.href;
}
function webInstanceOf(input, toStringTag) {
    try {
        return Object.getPrototypeOf(input)[Symbol.toStringTag] === toStringTag;
    } catch  {
        return false;
    }
}
async function authorizationCodeGrant(config, currentUrl, checks, tokenEndpointParameters, options) {
    checkConfig(config);
    if (options?.flag !== retry && !(currentUrl instanceof URL) && !webInstanceOf(currentUrl, 'Request')) {
        throw CodedTypeError('"currentUrl" must be an instance of URL, or Request', ERR_INVALID_ARG_TYPE);
    }
    let authResponse;
    let redirectUri;
    const { as, c, auth, fetch: fetch1, tlsOnly, jarm, hybrid, nonRepudiation, timeout, decrypt, implicit } = int(config);
    if (options?.flag === retry) {
        authResponse = options.authResponse;
        redirectUri = options.redirectUri;
    } else {
        if (!(currentUrl instanceof URL)) {
            const request = currentUrl;
            currentUrl = new URL(currentUrl.url);
            switch(request.method){
                case 'GET':
                    break;
                case 'POST':
                    const params = new URLSearchParams(await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["formPostResponse"](request));
                    if (hybrid) {
                        currentUrl.hash = params.toString();
                    } else {
                        for (const [k, v] of params.entries()){
                            currentUrl.searchParams.append(k, v);
                        }
                    }
                    break;
                default:
                    throw CodedTypeError('unexpected Request HTTP method', ERR_INVALID_ARG_VALUE);
            }
        }
        redirectUri = stripParams(currentUrl);
        switch(true){
            case !!jarm:
                authResponse = await jarm(currentUrl, checks?.expectedState);
                break;
            case !!hybrid:
                authResponse = await hybrid(currentUrl, checks?.expectedNonce, checks?.expectedState, checks?.maxAge);
                break;
            case !!implicit:
                throw new TypeError('authorizationCodeGrant() cannot be used by response_type=id_token clients');
            default:
                try {
                    authResponse = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateAuthResponse"](as, c, currentUrl.searchParams, checks?.expectedState);
                } catch (err) {
                    errorHandler(err);
                }
        }
    }
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["authorizationCodeGrantRequest"](as, c, auth, authResponse, redirectUri, checks?.pkceCodeVerifier || __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["nopkce"], {
        additionalParameters: tokenEndpointParameters,
        [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["customFetch"]]: fetch1,
        [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["allowInsecureRequests"]]: !tlsOnly,
        DPoP: options?.DPoP,
        headers: new Headers(headers),
        signal: signal(timeout)
    }).catch(errorHandler);
    if (typeof checks?.expectedNonce === 'string' || typeof checks?.maxAge === 'number') {
        checks.idTokenExpected = true;
    }
    const p = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["processAuthorizationCodeResponse"](as, c, response, {
        expectedNonce: checks?.expectedNonce,
        maxAge: checks?.maxAge,
        requireIdToken: checks?.idTokenExpected,
        [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jweDecrypt"]]: decrypt
    });
    let result;
    try {
        result = await p;
    } catch (err) {
        if (retryable(err, options)) {
            return authorizationCodeGrant(config, undefined, checks, tokenEndpointParameters, {
                ...options,
                flag: retry,
                authResponse: authResponse,
                redirectUri: redirectUri
            });
        }
        errorHandler(err);
    }
    result.id_token && await nonRepudiation?.(response);
    addHelpers(result);
    return result;
}
async function validateJARMResponse(config, authorizationResponse, expectedState) {
    const { as, c, fetch: fetch1, tlsOnly, timeout, decrypt, jwksCache } = int(config);
    return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateJwtAuthResponse"](as, c, authorizationResponse, expectedState, {
        [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["customFetch"]]: fetch1,
        [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["allowInsecureRequests"]]: !tlsOnly,
        headers: new Headers(headers),
        signal: signal(timeout),
        [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jweDecrypt"]]: decrypt,
        [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jwksCache"]]: jwksCache
    }).catch(errorHandler);
}
async function validateCodeIdTokenResponse(config, authorizationResponse, expectedNonce, expectedState, maxAge, fapi) {
    if (typeof expectedNonce !== 'string') {
        throw CodedTypeError('"expectedNonce" must be a string', ERR_INVALID_ARG_TYPE);
    }
    if (expectedState !== undefined && typeof expectedState !== 'string') {
        throw CodedTypeError('"expectedState" must be a string', ERR_INVALID_ARG_TYPE);
    }
    const { as, c, fetch: fetch1, tlsOnly, timeout, decrypt, jwksCache } = int(config);
    return (fapi ? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateDetachedSignatureResponse"] : __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateCodeIdTokenResponse"])(as, c, authorizationResponse, expectedNonce, expectedState, maxAge, {
        [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["customFetch"]]: fetch1,
        [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["allowInsecureRequests"]]: !tlsOnly,
        headers: new Headers(headers),
        signal: signal(timeout),
        [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jweDecrypt"]]: decrypt,
        [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jwksCache"]]: jwksCache
    }).catch(errorHandler);
}
async function refreshTokenGrant(config, refreshToken, parameters, options) {
    checkConfig(config);
    parameters = new URLSearchParams(parameters);
    const { as, c, auth, fetch: fetch1, tlsOnly, nonRepudiation, timeout, decrypt } = int(config);
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["refreshTokenGrantRequest"](as, c, auth, refreshToken, {
        [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["customFetch"]]: fetch1,
        [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["allowInsecureRequests"]]: !tlsOnly,
        additionalParameters: parameters,
        DPoP: options?.DPoP,
        headers: new Headers(headers),
        signal: signal(timeout)
    }).catch(errorHandler);
    const p = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["processRefreshTokenResponse"](as, c, response, {
        [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jweDecrypt"]]: decrypt
    });
    let result;
    try {
        result = await p;
    } catch (err) {
        if (retryable(err, options)) {
            return refreshTokenGrant(config, refreshToken, parameters, {
                ...options,
                flag: retry
            });
        }
        errorHandler(err);
    }
    result.id_token && await nonRepudiation?.(response);
    addHelpers(result);
    return result;
}
async function clientCredentialsGrant(config, parameters, options) {
    checkConfig(config);
    parameters = new URLSearchParams(parameters);
    const { as, c, auth, fetch: fetch1, tlsOnly, timeout } = int(config);
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["clientCredentialsGrantRequest"](as, c, auth, parameters, {
        [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["customFetch"]]: fetch1,
        [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["allowInsecureRequests"]]: !tlsOnly,
        DPoP: options?.DPoP,
        headers: new Headers(headers),
        signal: signal(timeout)
    }).catch(errorHandler);
    const p = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["processClientCredentialsResponse"](as, c, response);
    let result;
    try {
        result = await p;
    } catch (err) {
        if (retryable(err, options)) {
            return clientCredentialsGrant(config, parameters, {
                ...options,
                flag: retry
            });
        }
        errorHandler(err);
    }
    addHelpers(result);
    return result;
}
function buildAuthorizationUrl(config, parameters) {
    checkConfig(config);
    const { as, c, tlsOnly, hybrid, jarm, implicit } = int(config);
    const authorizationEndpoint = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["resolveEndpoint"](as, 'authorization_endpoint', false, tlsOnly);
    parameters = new URLSearchParams(parameters);
    if (!parameters.has('client_id')) {
        parameters.set('client_id', c.client_id);
    }
    if (!parameters.has('request_uri') && !parameters.has('request')) {
        if (!parameters.has('response_type')) {
            parameters.set('response_type', hybrid ? 'code id_token' : implicit ? 'id_token' : 'code');
        }
        if (implicit && !parameters.has('nonce')) {
            throw CodedTypeError('response_type=id_token clients must provide a nonce parameter in their authorization request parameters', ERR_INVALID_ARG_VALUE);
        }
        if (jarm) {
            parameters.set('response_mode', 'jwt');
        }
    }
    for (const [k, v] of parameters.entries()){
        authorizationEndpoint.searchParams.append(k, v);
    }
    return authorizationEndpoint;
}
async function buildAuthorizationUrlWithJAR(config, parameters, signingKey, options) {
    checkConfig(config);
    const authorizationEndpoint = buildAuthorizationUrl(config, parameters);
    parameters = authorizationEndpoint.searchParams;
    if (!signingKey) {
        throw CodedTypeError('"signingKey" must be provided', ERR_INVALID_ARG_VALUE);
    }
    const { as, c } = int(config);
    const request = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["issueRequestObject"](as, c, parameters, signingKey, options).catch(errorHandler);
    return buildAuthorizationUrl(config, {
        request
    });
}
async function buildAuthorizationUrlWithPAR(config, parameters, options) {
    checkConfig(config);
    const authorizationEndpoint = buildAuthorizationUrl(config, parameters);
    const { as, c, auth, fetch: fetch1, tlsOnly, timeout } = int(config);
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["pushedAuthorizationRequest"](as, c, auth, authorizationEndpoint.searchParams, {
        [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["customFetch"]]: fetch1,
        [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["allowInsecureRequests"]]: !tlsOnly,
        DPoP: options?.DPoP,
        headers: new Headers(headers),
        signal: signal(timeout)
    }).catch(errorHandler);
    const p = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["processPushedAuthorizationResponse"](as, c, response);
    let result;
    try {
        result = await p;
    } catch (err) {
        if (retryable(err, options)) {
            return buildAuthorizationUrlWithPAR(config, parameters, {
                ...options,
                flag: retry
            });
        }
        errorHandler(err);
    }
    return buildAuthorizationUrl(config, {
        request_uri: result.request_uri
    });
}
function buildEndSessionUrl(config, parameters) {
    checkConfig(config);
    const { as, c, tlsOnly } = int(config);
    const endSessionEndpoint = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["resolveEndpoint"](as, 'end_session_endpoint', false, tlsOnly);
    parameters = new URLSearchParams(parameters);
    if (!parameters.has('client_id')) {
        parameters.set('client_id', c.client_id);
    }
    for (const [k, v] of parameters.entries()){
        endSessionEndpoint.searchParams.append(k, v);
    }
    return endSessionEndpoint;
}
function checkConfig(input) {
    if (!(input instanceof Configuration)) {
        throw CodedTypeError('"config" must be an instance of Configuration', ERR_INVALID_ARG_TYPE);
    }
    if (Object.getPrototypeOf(input) !== Configuration.prototype) {
        throw CodedTypeError('subclassing Configuration is not allowed', ERR_INVALID_ARG_VALUE);
    }
}
function signal(timeout) {
    return timeout ? AbortSignal.timeout(timeout * 1000) : undefined;
}
async function fetchUserInfo(config, accessToken, expectedSubject, options) {
    checkConfig(config);
    const { as, c, fetch: fetch1, tlsOnly, nonRepudiation, timeout, decrypt } = int(config);
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["userInfoRequest"](as, c, accessToken, {
        [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["customFetch"]]: fetch1,
        [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["allowInsecureRequests"]]: !tlsOnly,
        DPoP: options?.DPoP,
        headers: new Headers(headers),
        signal: signal(timeout)
    }).catch(errorHandler);
    let exec = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["processUserInfoResponse"](as, c, expectedSubject, response, {
        [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jweDecrypt"]]: decrypt
    });
    let result;
    try {
        result = await exec;
    } catch (err) {
        if (retryable(err, options)) {
            return fetchUserInfo(config, accessToken, expectedSubject, {
                ...options,
                flag: retry
            });
        }
        errorHandler(err);
    }
    __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["getContentType"](response) === 'application/jwt' && await nonRepudiation?.(response);
    return result;
}
function retryable(err, options) {
    if (options?.DPoP && options.flag !== retry) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isDPoPNonceError"](err);
    }
    return false;
}
async function tokenIntrospection(config, token, parameters) {
    checkConfig(config);
    const { as, c, auth, fetch: fetch1, tlsOnly, nonRepudiation, timeout, decrypt } = int(config);
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["introspectionRequest"](as, c, auth, token, {
        [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["customFetch"]]: fetch1,
        [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["allowInsecureRequests"]]: !tlsOnly,
        additionalParameters: new URLSearchParams(parameters),
        headers: new Headers(headers),
        signal: signal(timeout)
    }).catch(errorHandler);
    const result = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["processIntrospectionResponse"](as, c, response, {
        [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jweDecrypt"]]: decrypt
    }).catch(errorHandler);
    __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["getContentType"](response) === 'application/token-introspection+jwt' && await nonRepudiation?.(response);
    return result;
}
const retry = Symbol();
async function genericGrantRequest(config, grantType, parameters, options) {
    checkConfig(config);
    const { as, c, auth, fetch: fetch1, tlsOnly, timeout, decrypt, nonRepudiation } = int(config);
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["genericTokenEndpointRequest"](as, c, auth, grantType, new URLSearchParams(parameters), {
        [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["customFetch"]]: fetch1,
        [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["allowInsecureRequests"]]: !tlsOnly,
        DPoP: options?.DPoP,
        headers: new Headers(headers),
        signal: signal(timeout)
    }).catch(errorHandler);
    let recognizedTokenTypes;
    if (grantType === 'urn:ietf:params:oauth:grant-type:token-exchange') {
        recognizedTokenTypes = {
            n_a: ()=>{}
        };
    }
    const p = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["processGenericTokenEndpointResponse"](as, c, response, {
        [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jweDecrypt"]]: decrypt,
        recognizedTokenTypes
    });
    let result;
    try {
        result = await p;
    } catch (err) {
        if (retryable(err, options)) {
            return genericGrantRequest(config, grantType, parameters, {
                ...options,
                flag: retry
            });
        }
        errorHandler(err);
    }
    result.id_token && await nonRepudiation?.(response);
    addHelpers(result);
    return result;
}
async function tokenRevocation(config, token, parameters) {
    checkConfig(config);
    const { as, c, auth, fetch: fetch1, tlsOnly, timeout } = int(config);
    return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["revocationRequest"](as, c, auth, token, {
        [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["customFetch"]]: fetch1,
        [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["allowInsecureRequests"]]: !tlsOnly,
        additionalParameters: new URLSearchParams(parameters),
        headers: new Headers(headers),
        signal: signal(timeout)
    }).then(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["processRevocationResponse"]).catch(errorHandler);
}
async function fetchProtectedResource(config, accessToken, url, method, body, headers, options) {
    checkConfig(config);
    headers ||= new Headers();
    if (USER_AGENT && !headers.has('user-agent')) {
        headers.set('user-agent', USER_AGENT);
    }
    const { fetch: fetch1, tlsOnly, timeout } = int(config);
    const exec = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["protectedResourceRequest"](accessToken, method, url, headers, body, {
        [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["customFetch"]]: fetch1,
        [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["allowInsecureRequests"]]: !tlsOnly,
        DPoP: options?.DPoP,
        signal: signal(timeout)
    });
    let result;
    try {
        result = await exec;
    } catch (err) {
        if (retryable(err, options)) {
            return fetchProtectedResource(config, accessToken, url, method, body, headers, {
                ...options,
                flag: retry
            });
        }
        errorHandler(err);
    }
    return result;
}
}),
];})()

//# sourceMappingURL=0aq__1jbibpapw5ga3._.js.map