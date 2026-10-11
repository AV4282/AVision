(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
(()=>{"use strict";return[
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/helpers/get-access-token.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAccessToken",
    ()=>getAccessToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/web/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/oauth-errors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/mfa-errors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/pathUtils.js [app-client] (ecmascript)");
;
;
async function getAccessToken(options = {}) {
    const urlParams = new URLSearchParams();
    // We only want to add the audience if it's explicitly provided
    if (options.audience) {
        urlParams.append("audience", options.audience);
    }
    // We only want to add the scope if it's explicitly provided
    if (options.scope) {
        urlParams.append("scope", options.scope);
    }
    // Forward mergeScopes to server-side handleAccessToken
    // Only forward when explicitly false to maintain backward compatibility
    // (server defaults to true when param is absent)
    if (options.mergeScopes === false) {
        urlParams.append("mergeScopes", "false");
    }
    let url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(options.route || __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_ACCESS_TOKEN_ROUTE || "/auth/access-token");
    // Only append the query string if we have any url parameters to add
    if (urlParams.size > 0) {
        url = url + `?${urlParams.toString()}`;
    }
    const tokenRes = await fetch(url);
    if (!tokenRes.ok) {
        // try to parse it as JSON and throw the error from the API
        // otherwise, throw a generic error
        let accessTokenError;
        try {
            accessTokenError = await tokenRes.json();
        } catch (e) {
            throw new Error("An unexpected error occurred while trying to fetch the access token.");
        }
        // Detect MFA required response (403 with flat { error: "mfa_required", mfa_token, ... })
        // Server returns MfaRequiredError.toJSON() format from #createMfaRequiredResponse
        if (tokenRes.status === 403 && accessTokenError.error === "mfa_required") {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MfaRequiredError"](accessTokenError.error_description || "Multi-factor authentication is required.", accessTokenError.mfa_token || "", accessTokenError.mfa_requirements, undefined);
        }
        // Standard error format: { error: { code, message } }
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AccessTokenError"](accessTokenError.error?.code || accessTokenError.error, accessTokenError.error?.message || accessTokenError.error_description);
    }
    const tokenSet = await tokenRes.json();
    return options.includeFullResponse ? tokenSet : tokenSet.token;
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/helpers/start-enterprise-login.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "startEnterpriseLogin",
    ()=>startEnterpriseLogin
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/web/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/pathUtils.js [app-client] (ecmascript)");
;
async function startEnterpriseLogin(options) {
    const { email, authorizationParameters } = options;
    const federatedDomainRoute = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(options.federatedDomainRoute || __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_FEDERATED_DOMAIN_ROUTE || "/auth/federated-domain");
    const res = await fetch(federatedDomainRoute, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email
        })
    });
    if (!res.ok) {
        throw new Error("An unexpected error occurred while checking the email domain.");
    }
    const { isFederated } = await res.json();
    if (!isFederated) {
        return false;
    }
    const loginRoute = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(options.loginRoute || __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_LOGIN_ROUTE || "/auth/login");
    // Forward any caller-supplied authorization parameters onto the /auth/login
    // query string (the same transport the login route already reads them from),
    // then set login_hint from email last so it wins.
    const merged = {
        ...authorizationParameters,
        login_hint: email
    };
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(merged)){
        if (value != null) {
            params.set(key, String(value));
        }
    }
    if (options.returnTo) {
        params.set("returnTo", options.returnTo);
    }
    window.location.assign(`${loginRoute}?${params.toString()}`);
    return true;
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/helpers/with-page-auth-required.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "withPageAuthRequired",
    ()=>withPageAuthRequired
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/web/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$compat$2f$router$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/compat/router.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/pathUtils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$hooks$2f$use$2d$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/hooks/use-user.js [app-client] (ecmascript)");
"use client";
;
;
;
;
;
const defaultOnRedirecting = ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Fragment, null);
const defaultOnError = ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Fragment, null);
const withPageAuthRequired = (Component, options = {})=>{
    return function WithPageAuthRequired(props) {
        const { returnTo, onRedirecting = defaultOnRedirecting, onError = defaultOnError } = options;
        const loginUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_LOGIN_ROUTE || "/auth/login");
        const { user, error, isLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$hooks$2f$use$2d$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUser"])();
        const pagesRouter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$compat$2f$router$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
        const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
            "withPageAuthRequired.WithPageAuthRequired.useEffect": ()=>{
                if (pagesRouter && !pagesRouter.isReady) return;
                if (user && !error || isLoading) return;
                let returnToPath;
                if (!returnTo) {
                    const currentLocation = window.location;
                    returnToPath = pathname + currentLocation.search + currentLocation.hash;
                } else {
                    returnToPath = returnTo;
                }
                window.location.assign(`${loginUrl}?returnTo=${encodeURIComponent(returnToPath)}`);
            }
        }["withPageAuthRequired.WithPageAuthRequired.useEffect"], [
            user,
            error,
            isLoading
        ]);
        if (error) return onError(error);
        if (user) {
            const componentProps = {
                ...props,
                user
            };
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(Component, {
                ...componentProps
            });
        }
        return onRedirecting();
    };
};
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/hooks/use-anonymous-session.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAnonymousSession",
    ()=>useAnonymousSession
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/web/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$use$2d$swr$2d$emll9s78$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__u__as__default$3e$__ = __turbopack_context__.i("[project]/web/node_modules/swr/dist/use-swr-emll9s78.mjs [app-client] (ecmascript) <export u as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/pathUtils.js [app-client] (ecmascript)");
"use client";
;
;
/**
 * Fetch the anonymous session from the read route.
 *
 * The route answers 204 with an empty body when there is no session, which maps
 * to null, and 200 with the session object otherwise. Any other status is a
 * failure the hook surfaces through `error`.
 *
 * The return type is declared rather than inferred so the session case is a
 * concrete value rather than the `any` that `Response.json()` produces. That is
 * what keeps `null` from being the only value a reader (human or static analysis)
 * can see the fetcher resolve to.
 */ async function fetchAnonymousSession(route) {
    const res = await fetch(route);
    if (!res.ok) {
        throw new Error("Failed to load anonymous session");
    }
    // 204 No Content → null (no session)
    if (res.status === 204) {
        return null;
    }
    // 200 + JSON → return session object
    return await res.json();
}
function useAnonymousSession(options = {}) {
    // Resolve SWR key (route path, normalized with basePath)
    const route = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(options.route || __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_ANONYMOUS_SESSION_ROUTE || "/auth/anonymous-session");
    // Fetch via SWR with standard error handling
    const { data, error, isLoading, mutate } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$use$2d$swr$2d$emll9s78$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__u__as__default$3e$__["default"])(route, fetchAnonymousSession);
    // Return shape matching useUser() pattern
    if (error) {
        return {
            anonymous: null,
            isLoading: false,
            error,
            invalidate: ()=>mutate()
        };
    }
    // The fetcher resolves to null for a 204, so `data` carries three distinct
    // states: undefined while the first request is in flight, null once the route
    // has answered that there is no session, and the session object otherwise. A
    // truthiness test cannot tell the first two apart, and it reads as a test that
    // can never succeed to a reader that only sees the null-returning branch of the
    // fetcher. Comparing against undefined names the state that is actually being
    // asked about, and every branch below is reachable for some value of `data`.
    const hasLoaded = data !== undefined;
    return {
        anonymous: data ?? null,
        isLoading: hasLoaded ? false : isLoading,
        error: null,
        invalidate: ()=>mutate()
    };
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/hooks/use-user.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useUser",
    ()=>useUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/web/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$use$2d$swr$2d$emll9s78$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__u__as__default$3e$__ = __turbopack_context__.i("[project]/web/node_modules/swr/dist/use-swr-emll9s78.mjs [app-client] (ecmascript) <export u as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/pathUtils.js [app-client] (ecmascript)");
"use client";
;
;
function useUser(options = {}) {
    const { data, error, isLoading, mutate } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$use$2d$swr$2d$emll9s78$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__u__as__default$3e$__["default"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(options.route || __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_PROFILE_ROUTE || "/auth/profile"), {
        "useUser.useSWR": (...args)=>fetch(...args).then({
                "useUser.useSWR": (res)=>{
                    if (!res.ok) {
                        throw new Error("Unauthorized");
                    }
                    if (res.status === 204) {
                        return null;
                    }
                    return res.json();
                }
            }["useUser.useSWR"])
    }["useUser.useSWR"]);
    if (error) {
        return {
            user: null,
            isLoading: false,
            error,
            invalidate: ()=>mutate()
        };
    }
    if (data) {
        return {
            user: data,
            isLoading: false,
            error: null,
            invalidate: ()=>mutate()
        };
    }
    return {
        user: data,
        isLoading,
        error,
        invalidate: ()=>mutate()
    };
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/index.js [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$hooks$2f$use$2d$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/hooks/use-user.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$hooks$2f$use$2d$anonymous$2d$session$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/hooks/use-anonymous-session.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$helpers$2f$get$2d$access$2d$token$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/helpers/get-access-token.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$helpers$2f$start$2d$enterprise$2d$login$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/helpers/start-enterprise-login.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$helpers$2f$with$2d$page$2d$auth$2d$required$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/helpers/with-page-auth-required.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$providers$2f$auth0$2d$provider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/providers/auth0-provider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$mfa$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/mfa/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$passwordless$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/passwordless/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$passkey$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/passkey/index.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/mfa/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mfa",
    ()=>mfa
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/web/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/oauth-errors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/mfa-errors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$popup$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/popup-errors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$transform$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/mfa-transform-utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/pathUtils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$popup$2d$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/popup-helpers.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/constants.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$helpers$2f$get$2d$access$2d$token$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/helpers/get-access-token.js [app-client] (ecmascript)");
;
;
;
;
;
;
// Singleton popup guard - prevents concurrent popups
let activePopup = null;
/**
 * Parse error from postMessage payload into typed SdkError.
 * Called when popup sends {type: 'auth_complete', success: false, error: {...}}
 */ function parsePopupError(error) {
    const { code, message } = error;
    switch(code){
        case "mfa_required":
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MfaRequiredError"](message, "", undefined, undefined);
        case "access_denied":
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AccessTokenError"](code, message, undefined);
        default:
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AccessTokenError"](code, message, undefined);
    }
}
/**
 * Client-side MFA API (singleton).
 *
 * All operations are thin wrappers that fetch() to SDK routes.
 * Business logic executes server-side for security.
 *
 * @example React Component
 * ```typescript
 * 'use client';
 *
 * import { mfa } from '@auth0/nextjs-auth0/client';
 * import { useState } from 'react';
 *
 * export function MfaVerification({ mfaToken }) {
 *   const [otp, setOtp] = useState('');
 *   const [error, setError] = useState(null);
 *
 *   async function handleVerify() {
 *     try {
 *       await mfa.verify({ mfaToken, otp });
 *       window.location.href = '/dashboard'; // Redirect after success
 *     } catch (err) {
 *       setError(err.message);
 *     }
 *   }
 *
 *   return (
 *     <form onSubmit={e => { e.preventDefault(); handleVerify(); }}>
 *       <input value={otp} onChange={e => setOtp(e.target.value)} />
 *       <button type="submit">Verify</button>
 *       {error && <p>{error}</p>}
 *     </form>
 *   );
 * }
 * ```
 */ class ClientMfaClient {
    /**
     * List enrolled MFA authenticators.
     *
     * Server-side logic:
     * - Decrypts mfaToken (validates TTL and integrity)
     * - Calls Auth0 API with raw mfa_token
     * - Filters by allowed challenge types
     * - Returns array of authenticators
     *
     * @param options - Options containing encrypted mfaToken
     * @returns Array of available authenticators
     * @throws {MfaTokenExpiredError} Token TTL exceeded
     * @throws {MfaTokenInvalidError} Token tampered or malformed
     * @throws {MfaGetAuthenticatorsError} Auth0 API error
     *
     * @example
     * ```typescript
     * 'use client';
     * import { mfa } from '@auth0/nextjs-auth0/client';
     * import { useState, useEffect } from 'react';
     *
     * export function AuthenticatorList({ mfaToken }) {
     *   const [authenticators, setAuthenticators] = useState([]);
     *
     *   useEffect(() => {
     *     mfa.getAuthenticators({ mfaToken })
     *       .then(setAuthenticators)
     *       .catch(console.error);
     *   }, [mfaToken]);
     *
     *   return (
     *     <ul>
     *       {authenticators.map(auth => (
     *         <li key={auth.id}>{auth.authenticatorType}</li>
     *       ))}
     *     </ul>
     *   );
     * }
     * ```
     */ async getAuthenticators(options) {
        try {
            const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_MFA_AUTHENTICATORS_ROUTE || "/auth/mfa/authenticators");
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${options.mfaToken}`
                },
                credentials: "omit" // Stateless operation, no session needed
            });
            if (!response.ok) {
                const error = await response.json();
                throw this.parseError(error, "getAuthenticators", response.url);
            }
            // Route handler returns snake_case, camelize for SDK
            const data = await response.json();
            return data.map(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$transform$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["camelizeAuthenticator"]);
        } catch (e) {
            // Re-throw typed errors
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MfaTokenExpiredError"] || e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MfaTokenInvalidError"] || e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MfaGetAuthenticatorsError"]) {
                throw e;
            }
            // Network/parse errors → MfaGetAuthenticatorsError with client_error code
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MfaGetAuthenticatorsError"]("client_error", e instanceof Error ? e.message : "Network or parsing error", undefined);
        }
    }
    /**
     * Initiate an MFA challenge.
     *
     * Server-side logic:
     * - Decrypts mfaToken (validates TTL and integrity)
     * - Calls Auth0 challenge API
     * - Returns challenge response (oobCode, bindingMethod)
     *
     * @param options - Challenge options
     * @returns Challenge response with oobCode and bindingMethod
     * @throws {MfaTokenExpiredError} Token TTL exceeded
     * @throws {MfaTokenInvalidError} Token tampered or malformed
     * @throws {MfaChallengeError} Auth0 API error
     *
     * @example
     * ```typescript
     * 'use client';
     * import { mfa } from '@auth0/nextjs-auth0/client';
     *
     * async function sendSmsCode(mfaToken, authenticatorId) {
     *   const challenge = await mfa.challenge({
     *     mfaToken,
     *     challengeType: 'oob',
     *     authenticatorId
     *   });
     *   // SMS sent, now collect binding code from user
     *   return challenge.oobCode;
     * }
     * ```
     */ async challenge(options) {
        try {
            const body = {
                mfa_token: options.mfaToken,
                challenge_type: options.challengeType
            };
            if (options.authenticatorId) {
                body.authenticator_id = options.authenticatorId;
            }
            const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_MFA_CHALLENGE_ROUTE || "/auth/mfa/challenge");
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "omit",
                body: JSON.stringify(body)
            });
            if (!response.ok) {
                const error = await response.json();
                throw this.parseError(error, "challenge", response.url);
            }
            // Route handler returns snake_case, camelize for SDK
            const data = await response.json();
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$transform$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["camelizeChallengeResponse"])(data);
        } catch (e) {
            // Re-throw typed errors
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MfaTokenExpiredError"] || e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MfaTokenInvalidError"] || e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MfaChallengeError"]) {
                throw e;
            }
            // Network/parse errors
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MfaChallengeError"]("client_error", e instanceof Error ? e.message : "Network or parsing error", undefined);
        }
    }
    /**
     * Verify MFA code and complete authentication.
     *
     * Server-side logic:
     * - Decrypts mfaToken (validates TTL and integrity)
     * - Calls Auth0 verify API
     * - Stores resulting tokens in the session cookie (server-side only)
     * - Returns `{ success: true }` — tokens are never sent in the response body
     *
     * Call `getAccessToken()` after a successful verify to retrieve the access token
     * from the session.
     *
     * Chained MFA: If Auth0 returns mfa_required, throws MfaRequiredError with
     * a new encrypted mfa_token for the next factor.
     *
     * @param options - Verification options (otp, oobCode+bindingCode, or recoveryCode)
     * @returns `{ success: true }` — call `getAccessToken()` to retrieve the token.
     * @throws {MfaTokenExpiredError} Token TTL exceeded
     * @throws {MfaTokenInvalidError} Token tampered or malformed
     * @throws {MfaRequiredError} Additional MFA factor required (chained MFA)
     * @throws {MfaVerifyError} Auth0 API error (wrong code, rate limit, etc.)
     */ async verify(options) {
        try {
            const body = {};
            // Type-based field mapping (matches VerifyMfaOptions union type)
            if ("otp" in options) {
                body.otp = options.otp;
            } else if ("oobCode" in options) {
                body.oob_code = options.oobCode;
                body.binding_code = options.bindingCode;
            } else if ("recoveryCode" in options) {
                body.recovery_code = options.recoveryCode;
            }
            const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_MFA_VERIFY_ROUTE || "/auth/mfa/verify");
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${options.mfaToken}`
                },
                credentials: "include",
                body: JSON.stringify(body)
            });
            if (!response.ok) {
                const error = await response.json();
                throw this.parseError(error, "verify", response.url);
            }
            // Verify response is already snake_case from oauth4webapi
            return await response.json();
        } catch (e) {
            // Re-throw typed errors
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MfaTokenExpiredError"] || e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MfaTokenInvalidError"] || e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MfaRequiredError"] || e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MfaVerifyError"]) {
                throw e;
            }
            // Network/parse errors
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MfaVerifyError"]("client_error", e instanceof Error ? e.message : "Network or parsing error", undefined);
        }
    }
    /**
     * Enroll a new MFA authenticator.
     *
     * Server-side logic:
     * - Decrypts mfaToken (validates TTL and integrity)
     * - Calls Auth0 enrollment API
     * - Returns enrollment response with authenticator details and optional recovery codes
     *
     * @param options - Enrollment options (otp | oob | email)
     * @returns Enrollment response with authenticator ID, secret (for OTP), and optional recovery codes
     * @throws {MfaTokenExpiredError} Token TTL exceeded
     * @throws {MfaTokenInvalidError} Token tampered or malformed
     * @throws {MfaEnrollmentError} Auth0 API error
     *
     * @example
     * ```typescript
     * 'use client';
     * import { mfa } from '@auth0/nextjs-auth0/client';
     * import QRCode from 'qrcode.react';
     *
     * export function EnrollOtp({ mfaToken }) {
     *   const [enrollment, setEnrollment] = useState(null);
     *
     *   async function handleEnroll() {
     *     const result = await mfa.enroll({
     *       mfaToken,
     *       authenticatorTypes: ['otp']
     *     });
     *     setEnrollment(result);
     *   }
     *
     *   return enrollment ? (
     *     <QRCode value={enrollment.barcodeUri} />
     *   ) : (
     *     <button onClick={handleEnroll}>Enroll</button>
     *   );
     * }
     * ```
     */ async enroll(options) {
        try {
            // Normalize factorType variants to standard authenticatorTypes format
            const normalizedOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$transform$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeEnrollOptions"])(options);
            const { mfaToken, ...enrollOptions } = normalizedOptions;
            const body = {
                authenticator_types: enrollOptions.authenticatorTypes
            };
            if ("oobChannels" in enrollOptions) {
                body.oob_channels = enrollOptions.oobChannels;
                if (enrollOptions.phoneNumber) {
                    body.phone_number = enrollOptions.phoneNumber;
                }
                if (enrollOptions.email) {
                    body.email = enrollOptions.email;
                }
            }
            const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_MFA_ASSOCIATE_ROUTE || "/auth/mfa/associate");
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${mfaToken}`
                },
                body: JSON.stringify(body),
                credentials: "omit" // Stateless operation
            });
            if (!response.ok) {
                const error = await response.json();
                throw this.parseError(error, "enroll", response.url);
            }
            // Route handler returns snake_case, camelize for SDK
            const data = await response.json();
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$transform$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildEnrollmentResponse"])(data);
        } catch (e) {
            // Re-throw typed errors
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MfaTokenExpiredError"] || e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MfaTokenInvalidError"] || e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MfaEnrollmentError"]) {
                throw e;
            }
            // Network/parse errors
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MfaEnrollmentError"]("client_error", e instanceof Error ? e.message : "Network or parsing error", undefined);
        }
    }
    /**
     * Triggers MFA step-up authentication via a Universal Login popup.
     *
     * Opens a centered popup window that navigates to `/auth/login` with
     * `challengeMode=popup`. The user completes MFA through Auth0's
     * Universal Login in the popup. On completion, the popup sends a
     * `postMessage` back to the parent window, and the SDK retrieves the
     * cached access token from the server session.
     *
     * **Important:** Must be called from a user-initiated event handler
     * (e.g., click) to avoid browser popup blockers.
     *
     * @param options - Configuration for the popup MFA flow
     * @returns Access token response with token, scope, and expiry metadata
     *
     * @throws {ExecutionContextError} Called in server/middleware context (requires `window`)
     * @throws {PopupBlockedError} Browser blocked the popup (not user-initiated or popups disabled)
     * @throws {PopupInProgressError} Another `challengeWithPopup()` call is already active
     * @throws {PopupCancelledError} User manually closed the popup window
     * @throws {PopupTimeoutError} Popup did not complete within the configured timeout
     * @throws {AccessTokenError} Token retrieval from session failed after popup completed
     * @throws {MfaRequiredError} MFA is still required (unexpected after successful popup)
     *
     * @example
     * ```typescript
     * 'use client';
     * import { mfa, getAccessToken } from '@auth0/nextjs-auth0/client';
     * import { MfaRequiredError } from '@auth0/nextjs-auth0/errors';
     *
     * async function fetchProtectedData() {
     *   try {
     *     return await getAccessToken({ audience: 'https://api.example.com' });
     *   } catch (err) {
     *     if (err instanceof MfaRequiredError) {
     *       const { token } = await mfa.challengeWithPopup({
     *         audience: 'https://api.example.com'
     *       });
     *       return token;
     *     }
     *     throw err;
     *   }
     * }
     * ```
     */ async challengeWithPopup(options) {
        // 1. Execution context guard
        if (typeof window === "undefined") {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$popup$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ExecutionContextError"]("challengeWithPopup() can only be called in browser context");
        }
        // 2. Concurrent popup guard (singleton)
        if (activePopup !== null && !activePopup.closed) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$popup$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopupInProgressError"]();
        }
        // 3. Construct login URL with challengeMode=popup
        const params = new URLSearchParams({
            returnTo: options.returnTo || "/",
            acr_values: options.acr_values || "http://schemas.openid.net/pape/policies/2007/06/multi-factor",
            audience: options.audience,
            challengeMode: "popup"
        });
        // Only include prompt when explicitly provided. Omitting it lets Auth0
        // recognise the existing session and skip straight to the MFA challenge
        // instead of showing the full login screen again.
        if (options.prompt) {
            params.set("prompt", options.prompt);
        }
        // Only override scope if the caller explicitly provided one.
        // When omitted, startInteractiveLogin uses the global scope config,
        // so transactionState.scope matches what a default getAccessToken()
        // lookup computes — preventing cache misses on subsequent calls.
        // See session-helpers.ts for detailed explanation of why
        // requestedScope must use transactionState.scope (not oidcRes.scope).
        if (options.scope) {
            params.set("scope", options.scope);
        }
        const loginUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_LOGIN_ROUTE || "/auth/login") + "?" + params.toString();
        // 4. Open centered popup
        const width = options.popupWidth || __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_POPUP_WIDTH"];
        const height = options.popupHeight || __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_POPUP_HEIGHT"];
        const popup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$popup$2d$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["openCenteredPopup"])(loginUrl, width, height);
        if (popup === null) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$popup$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopupBlockedError"]();
        }
        // 5. Track active popup (singleton guard)
        activePopup = popup;
        try {
            // 6. Wait for postMessage completion or timeout/cancel
            const timeout = options.timeout || __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_POPUP_TIMEOUT"];
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$popup$2d$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["waitForPopupCompletion"])(popup, timeout);
            // 7. Check postMessage result (discriminated union)
            if (!result.success) {
                throw parsePopupError(result.error);
            }
            // 8. Retrieve token from session via getAccessToken()
            // When caller provided explicit scope: use mergeScopes:false for
            // precise lookup matching exactly what was stored.
            // When no explicit scope: use default behavior (server merges global
            // scopes) so the lookup key matches what the popup flow stored
            // in transactionState.scope (which inherited global scopes).
            // See session-helpers.ts for the full requestedScope rationale.
            return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$helpers$2f$get$2d$access$2d$token$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAccessToken"])({
                audience: options.audience,
                includeFullResponse: true,
                ...options.scope ? {
                    scope: options.scope,
                    mergeScopes: false
                } : {}
            });
        } finally{
            // 9. Cleanup: reset singleton guard
            activePopup = null;
        }
    }
    /**
     * Parse server error response into typed error classes.
     *
     * Server returns JSON: { error, error_description, mfa_token? }
     * Maps to SDK error types based on error code and route context.
     *
     * Chained MFA: error === 'mfa_required' → MfaRequiredError (not MfaVerifyError)
     *
     * @param error - Parsed JSON error from server
     * @param route - Route name for fallback error detection
     * @param url - Full URL for route extraction
     * @returns Typed error instance
     */ parseError(error, route, url) {
        const code = error.error || "unknown_error";
        const description = error.error_description || "Unknown error occurred";
        // SDK errors (fixed codes)
        if (code === "mfa_token_expired") {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MfaTokenExpiredError"]();
        }
        if (code === "mfa_token_invalid") {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MfaTokenInvalidError"]();
        }
        if (code === "mfa_no_available_factors") {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MfaNoAvailableFactorsError"](description);
        }
        // Chained MFA: mfa_required means "success, continue to next factor"
        // NOT a verification failure, so use MfaRequiredError (not MfaVerifyError)
        if (code === "mfa_required") {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MfaRequiredError"](description, error.mfa_token, error.mfa_requirements, undefined);
        }
        // Auth0 API errors (dynamic codes) - route-based fallback
        // Route detection from URL (fallback if route param is unreliable)
        const isAuthenticators = route === "getAuthenticators" || url.includes("/authenticators");
        const isChallenge = route === "challenge" || url.includes("/challenge");
        const isVerify = route === "verify" || url.includes("/verify");
        const isEnroll = route === "enroll" || url.includes("/associate");
        if (isAuthenticators) {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MfaGetAuthenticatorsError"](code, description, undefined);
        }
        if (isChallenge) {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MfaChallengeError"](code, description, undefined);
        }
        if (isVerify) {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MfaVerifyError"](code, description, undefined);
        }
        if (isEnroll) {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MfaEnrollmentError"](code, description, undefined);
        }
        // Fallback: unknown route (shouldn't happen)
        return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MfaVerifyError"](code, description, undefined);
    }
}
const mfa = new ClientMfaClient();
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/passkey/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "passkey",
    ()=>passkey,
    "serializeCredential",
    ()=>serializeCredential
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/web/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/passkey-errors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/pathUtils.js [app-client] (ecmascript)");
;
;
// ---------------------------------------------------------------------------
// base64url helpers (no external deps, works in all modern browsers)
// ---------------------------------------------------------------------------
function base64urlEncode(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for(let i = 0; i < bytes.byteLength; i++){
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
function base64urlDecode(value) {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/");
    const padding = (4 - padded.length % 4) % 4;
    const base64 = padded + "=".repeat(padding);
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for(let i = 0; i < binary.length; i++){
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}
// ---------------------------------------------------------------------------
// WebAuthn options normalisation
// Converts base64url-encoded strings from Auth0 back into ArrayBuffers
// so they can be passed to navigator.credentials.create/get.
// ---------------------------------------------------------------------------
function decodeCreationOptions(raw) {
    const opts = raw;
    return {
        ...opts,
        challenge: base64urlDecode(opts.challenge),
        user: {
            ...opts.user,
            id: base64urlDecode(opts.user.id)
        },
        excludeCredentials: (opts.excludeCredentials ?? []).map((c)=>({
                ...c,
                id: base64urlDecode(c.id)
            }))
    };
}
function decodeRequestOptions(raw) {
    const opts = raw;
    return {
        ...opts,
        challenge: base64urlDecode(opts.challenge),
        allowCredentials: (opts.allowCredentials ?? []).map((c)=>({
                ...c,
                id: base64urlDecode(c.id)
            }))
    };
}
function serializeCredential(credential) {
    const response = credential.response;
    return {
        id: credential.id,
        rawId: base64urlEncode(credential.rawId),
        type: "public-key",
        authenticatorAttachment: credential.authenticatorAttachment ?? null,
        response: {
            clientDataJSON: base64urlEncode(response.clientDataJSON),
            ...response.attestationObject !== undefined && {
                attestationObject: base64urlEncode(response.attestationObject)
            },
            ...response.authenticatorData !== undefined && {
                authenticatorData: base64urlEncode(response.authenticatorData)
            },
            ...response.signature !== undefined && {
                signature: base64urlEncode(response.signature)
            },
            ...response.userHandle !== undefined && {
                userHandle: response.userHandle ? base64urlEncode(response.userHandle) : null
            }
        },
        clientExtensionResults: credential.getClientExtensionResults()
    };
}
// ---------------------------------------------------------------------------
// Fetch helpers
// ---------------------------------------------------------------------------
async function postJson(url, body) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "same-origin",
        body: JSON.stringify(body)
    });
    if (!response.ok) {
        const err = await response.json().catch(()=>({
                error: "client_error",
                error_description: "Failed to parse error response"
            }));
        return Promise.reject(err);
    }
    if (response.status === 204) {
        return undefined;
    }
    return response.json();
}
// ---------------------------------------------------------------------------
// ClientPasskeyClient
// ---------------------------------------------------------------------------
/**
 * Client-side passkey (WebAuthn) authentication singleton.
 *
 * Handles the signup and login flows — fetches the challenge from the SDK route
 * handler, calls navigator.credentials.create/get, then posts the serialised
 * credential back to the verify route to create a session.
 *
 * All ArrayBuffer ↔ base64url conversion is handled internally.
 *
 * @example Signup
 * ```typescript
 * 'use client';
 * import { passkey } from '@auth0/nextjs-auth0/client';
 *
 * await passkey.signup();
 * window.location.href = '/dashboard';
 * ```
 *
 * @example Login
 * ```typescript
 * 'use client';
 * import { passkey } from '@auth0/nextjs-auth0/client';
 *
 * await passkey.login();
 * window.location.href = '/dashboard';
 * ```
 *
 * @example Enroll a passkey for an existing user
 * ```typescript
 * 'use client';
 * import { passkey, serializeCredential } from '@auth0/nextjs-auth0/client';
 *
 * const challenge = await passkey.enrollmentChallenge();
 * const rawCredential = await navigator.credentials.create({ publicKey: challenge.authnParamsPublicKey });
 * await passkey.enrollmentVerify({
 *   authenticationMethodId: challenge.authenticationMethodId,
 *   authSession: challenge.authSession,
 *   authResponse: serializeCredential(rawCredential as PublicKeyCredential)
 * });
 * ```
 */ class ClientPasskeyClient {
    assertWebAuthnSupported() {
        if (typeof window === "undefined" || !window.PublicKeyCredential || typeof navigator?.credentials?.create !== "function" || typeof navigator?.credentials?.get !== "function") {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PasskeyGetTokenError"]("webauthn_not_supported", "WebAuthn is not supported in this browser", undefined);
        }
    }
    // ---------------------------------------------------------------------------
    // One-call convenience methods
    // ---------------------------------------------------------------------------
    /**
     * Complete a full passkey signup in one call.
     * Fetches the challenge, runs navigator.credentials.create(), then verifies.
     *
     * @throws {PasskeyGetTokenError} If WebAuthn is not supported in this browser
     * @throws {PasskeyRegisterError} If the challenge request fails
     * @throws {PasskeyGetTokenError} If the WebAuthn ceremony or token exchange fails
     */ async signup(options) {
        this.assertWebAuthnSupported();
        const challengeUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_PASSKEY_REGISTER_ROUTE || "/auth/passkey/register");
        let challenge;
        try {
            challenge = await postJson(challengeUrl, options ?? {});
        } catch (err) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PasskeyRegisterError"](err?.error ?? "client_error", err?.error_description ?? "Failed to get passkey signup challenge", err?.error ? err : undefined);
        }
        let credential;
        try {
            credential = await navigator.credentials.create({
                publicKey: decodeCreationOptions(challenge.authnParamsPublicKey)
            });
        } catch (err) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PasskeyGetTokenError"]("webauthn_error", err?.message ?? "WebAuthn credential creation failed", undefined);
        }
        if (!credential) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PasskeyGetTokenError"]("webauthn_error", "navigator.credentials.create returned null", undefined);
        }
        await this._verify(challenge.authSession, credential);
    }
    /**
     * Complete a full passkey login in one call.
     * Fetches the challenge, runs navigator.credentials.get(), then verifies.
     *
     * @throws {PasskeyGetTokenError} If WebAuthn is not supported in this browser
     * @throws {PasskeyChallengeError} If the challenge request fails
     * @throws {PasskeyGetTokenError} If the WebAuthn ceremony or token exchange fails
     */ async login(options) {
        this.assertWebAuthnSupported();
        const challengeUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_PASSKEY_CHALLENGE_ROUTE || "/auth/passkey/challenge");
        let challenge;
        try {
            challenge = await postJson(challengeUrl, options ?? {});
        } catch (err) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PasskeyChallengeError"](err?.error ?? "client_error", err?.error_description ?? "Failed to get passkey login challenge", err?.error ? err : undefined);
        }
        let credential;
        try {
            credential = await navigator.credentials.get({
                publicKey: decodeRequestOptions(challenge.authnParamsPublicKey)
            });
        } catch (err) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PasskeyGetTokenError"]("webauthn_error", err?.message ?? "WebAuthn credential assertion failed", undefined);
        }
        if (!credential) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PasskeyGetTokenError"]("webauthn_error", "navigator.credentials.get returned null", undefined);
        }
        await this._verify(challenge.authSession, credential);
    }
    // Shared verify step used by both signup() and login()
    async _verify(authSession, credential) {
        const verifyUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_PASSKEY_GET_TOKEN_ROUTE || "/auth/passkey/get-token");
        try {
            await postJson(verifyUrl, {
                authSession,
                authResponse: serializeCredential(credential)
            });
        } catch (err) {
            if (err?.error === "mfa_required") {
                throw err;
            }
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PasskeyGetTokenError"](err?.error ?? "client_error", err?.error_description ?? "Passkey verification failed", err?.error ? err : undefined);
        }
    }
    async enrollmentChallenge(options) {
        const challengeUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_PASSKEY_ENROLLMENT_CHALLENGE_ROUTE || "/auth/passkey/enrollment-challenge");
        try {
            return await postJson(challengeUrl, options ?? {});
        } catch (err) {
            if (err?.error === "mfa_required") {
                throw err;
            }
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PasskeyEnrollmentChallengeError"](err?.error ?? "unknown_error", err?.error_description ?? "Failed to get passkey enrollment challenge");
        }
    }
    async enrollmentVerify(options) {
        const verifyUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_PASSKEY_ENROLLMENT_VERIFY_ROUTE || "/auth/passkey/enrollment-verify");
        try {
            return await postJson(verifyUrl, options);
        } catch (err) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PasskeyEnrollmentVerifyError"](err?.error ?? "unknown_error", err?.error_description ?? "Passkey enrollment verification failed");
        }
    }
}
const passkey = new ClientPasskeyClient();
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/passwordless/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "passwordless",
    ()=>passwordless
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/web/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$db$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/passwordless-db-errors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/passwordless-errors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/pathUtils.js [app-client] (ecmascript)");
var __classPrivateFieldGet = ("TURBOPACK compile-time value", void 0) && ("TURBOPACK compile-time value", void 0).__classPrivateFieldGet || function(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ClientPasswordlessClient_instances, _ClientPasswordlessClient_sendChallenge;
;
;
/**
 * Client-side passwordless authentication API (singleton).
 *
 * Thin fetch() wrappers that call the SDK's server-side route handlers.
 * All business logic (OTP delivery, token exchange, session creation) runs server-side.
 *
 * @example Email OTP
 * ```typescript
 * 'use client';
 * import { passwordless } from '@auth0/nextjs-auth0/client';
 *
 * // 1. Send OTP
 * await passwordless.start({ connection: 'email', email: 'user@example.com', send: 'code' });
 *
 * // 2. Verify OTP — creates session automatically
 * await passwordless.verify({ connection: 'email', email: 'user@example.com', verificationCode: '123456' });
 * window.location.href = '/dashboard';
 * ```
 *
 * @example SMS OTP
 * ```typescript
 * 'use client';
 * import { passwordless } from '@auth0/nextjs-auth0/client';
 *
 * await passwordless.start({ connection: 'sms', phoneNumber: '+14155550100' });
 * await passwordless.verify({ connection: 'sms', phoneNumber: '+14155550100', verificationCode: '123456' });
 * ```
 *
 * @example Magic link (email)
 * ```typescript
 * 'use client';
 * import { passwordless } from '@auth0/nextjs-auth0/client';
 *
 * // Send the magic link — server stores a transaction cookie in the response.
 * // The browser stores it automatically (credentials: "same-origin").
 * // When the user clicks the link, Auth0 redirects to /auth/callback which
 * // completes the code exchange using that cookie and creates the session.
 * await passwordless.start({ connection: 'email', email: 'user@example.com', send: 'link' });
 * // No verify() call needed — the callback route handles it.
 * ```
 */ class ClientPasswordlessClient {
    constructor(){
        _ClientPasswordlessClient_instances.add(this);
    }
    /**
     * Initiate a passwordless flow by sending an OTP to the user's email or phone.
     *
     * @param options - Email or SMS start options
     * @throws {PasswordlessStartError} On Auth0 API failure or network error
     */ async start(options) {
        const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_PASSWORDLESS_START_ROUTE || "/auth/passwordless/start");
        let response;
        try {
            response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "same-origin",
                body: JSON.stringify(options)
            });
        } catch (e) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PasswordlessStartError"]("client_error", e instanceof Error ? e.message : "Network error", undefined);
        }
        if (!response.ok) {
            const error = await response.json().catch(()=>({
                    error: "client_error",
                    error_description: "Failed to parse error response"
                }));
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PasswordlessStartError"](error.error ?? "client_error", error.error_description ?? "Passwordless start failed", undefined);
        }
    }
    /**
     * Verify a passwordless OTP. On success the server creates a session
     * and sets the session cookie — the browser picks it up automatically.
     *
     * @param options - Email or SMS verify options including the OTP
     * @throws {PasswordlessVerifyError} On wrong code, expired code, or network error
     */ async verify(options) {
        const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_PASSWORDLESS_VERIFY_ROUTE || "/auth/passwordless/verify");
        let response;
        try {
            response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(options)
            });
        } catch (e) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PasswordlessVerifyError"]("client_error", e instanceof Error ? e.message : "Network error", undefined);
        }
        if (!response.ok) {
            const error = await response.json().catch(()=>({
                    error: "client_error",
                    error_description: "Failed to parse error response"
                }));
            if (error.error === "mfa_required") {
                throw error;
            }
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PasswordlessVerifyError"](error.error ?? "client_error", error.error_description ?? "Passwordless verify failed", undefined);
        }
    }
    async challengeWithEmail(options) {
        return __classPrivateFieldGet(this, _ClientPasswordlessClient_instances, "m", _ClientPasswordlessClient_sendChallenge).call(this, options);
    }
    async challengeWithPhoneNumber(options) {
        return __classPrivateFieldGet(this, _ClientPasswordlessClient_instances, "m", _ClientPasswordlessClient_sendChallenge).call(this, options);
    }
    async loginWithOtp(options) {
        const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_PASSWORDLESS_DB_GET_TOKEN_ROUTE || "/auth/passwordless/otp/token");
        let response;
        try {
            response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(options)
            });
        } catch (e) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$db$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PasswordlessDbGetTokenError"]("client_error", e instanceof Error ? e.message : "Network error", undefined);
        }
        if (!response.ok) {
            const error = await response.json().catch(()=>({
                    error: "client_error",
                    error_description: "Failed to parse error response"
                }));
            if (error.error === "mfa_required") {
                // Thrown as a raw object so callers can access mfa_token directly
                // to initiate the MFA challenge flow. Consistent with verify().
                throw error;
            }
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$db$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PasswordlessDbGetTokenError"](error.error ?? "client_error", error.error_description ?? "OTP token exchange failed", undefined);
        }
    }
}
_ClientPasswordlessClient_instances = new WeakSet(), _ClientPasswordlessClient_sendChallenge = async function _ClientPasswordlessClient_sendChallenge(options) {
    const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_PASSWORDLESS_DB_OTP_CHALLENGE_ROUTE || "/auth/passwordless/otp/challenge");
    let response;
    try {
        response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "same-origin",
            body: JSON.stringify(options)
        });
    } catch (e) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$db$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PasswordlessDbChallengeError"]("client_error", e instanceof Error ? e.message : "Network error", undefined);
    }
    if (!response.ok) {
        const error = await response.json().catch(()=>({
                error: "client_error",
                error_description: "Failed to parse error response"
            }));
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$db$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PasswordlessDbChallengeError"](error.error ?? "client_error", error.error_description ?? "OTP challenge failed", undefined);
    }
    const data = await response.json().catch(()=>{
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$db$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PasswordlessDbChallengeError"]("client_error", "Failed to parse challenge response", undefined);
    });
    return {
        authSession: data.authSession
    };
};
const passwordless = new ClientPasswordlessClient();
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/providers/auth0-provider.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Auth0Provider",
    ()=>Auth0Provider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/web/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$use$2d$swr$2d$emll9s78$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__S__as__SWRConfig$3e$__ = __turbopack_context__.i("[project]/web/node_modules/swr/dist/use-swr-emll9s78.mjs [app-client] (ecmascript) <export S as SWRConfig>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/pathUtils.js [app-client] (ecmascript)");
"use client";
;
;
;
function Auth0Provider({ user, anonymousSession, children, profileRoute, anonymousSessionRoute }) {
    // Resolve profile route
    const profileKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(profileRoute || __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_PROFILE_ROUTE || "/auth/profile");
    // Resolve anonymous session route
    const anonKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(anonymousSessionRoute || __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_ANONYMOUS_SESSION_ROUTE || "/auth/anonymous-session");
    // Build SWR fallback cache with both user and anonymous session
    // Avoids loading flashes when both are available from server-side fetch
    const fallback = {
        [profileKey]: user
    };
    // Seed anonymous session only if provided (may be null or undefined)
    if (anonymousSession !== undefined) {
        fallback[anonKey] = anonymousSession;
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$use$2d$swr$2d$emll9s78$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__S__as__SWRConfig$3e$__["SWRConfig"], {
        value: {
            fallback
        }
    }, children);
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/anonymous-session-errors.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AnonymousSessionError",
    ()=>AnonymousSessionError,
    "getStatusForAnonymousError",
    ()=>getStatusForAnonymousError,
    "mapAnonymousErrorCode",
    ()=>mapAnonymousErrorCode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/sdk-error.js [app-client] (ecmascript)");
;
class AnonymousSessionError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SdkError"] {
    /**
     * Construct an AnonymousSessionError.
     * @param code Error code from auth server or SDK validation (e.g., "metadata_too_large")
     * @param message Human-readable error message; defaults to generic message
     * @param description Server's error_description field (optional)
     * @param cause Raw error body or underlying cause (optional)
     */ constructor(code, message, description, cause){
        super(message ?? "An error occurred while performing the anonymous session operation.");
        this.name = "AnonymousSessionError";
        this.code = code;
        this.description = description;
        this.cause = cause;
    }
}
function mapAnonymousErrorCode(code, serverDescription, rawBody) {
    const codeToMessage = {
        metadata_too_large: "The metadata object exceeds the 1KB limit.",
        invalid_session_token: "The session token is invalid or malformed.",
        invalid_target: "The audience is unresolved or the resource server does not allow anonymous access.",
        invalid_scope: "The requested scope is not granted to anonymous subjects.",
        invalid_client: "Client authentication failed.",
        feature_not_enabled: "Anonymous sessions are not enabled on this tenant.",
        unauthorized_client: "This client is not enabled for anonymous sessions.",
        server_error: "The authorization server encountered an error.",
        invalid_request: "The request is malformed.",
        invalid_response: "The authorization server returned an invalid or incomplete response.",
        session_expired: "The session has expired."
    };
    const trimmedDescription = serverDescription?.trim();
    // The `code` in the last-resort fallback message is the raw `error` field from
    // the authorization server's HTTP response, i.e. attacker-influenceable, upstream
    // content. Any known code is already handled by `codeToMessage` above, so this
    // branch is only reached for an unrecognized value. Sanitize it to the charset
    // real OAuth/OIDC error codes use (lowercase letters + underscore) before
    // interpolating, so a malformed or hostile value cannot inject markup/control
    // characters into an error string an application might surface. An empty result
    // (nothing survived the filter) degrades to a static message.
    const sanitizedCode = code.replace(/[^a-z_]/g, "");
    const fallbackMessage = sanitizedCode ? `An error occurred: ${sanitizedCode}` : "An error occurred (unknown error code).";
    return new AnonymousSessionError(code, trimmedDescription || codeToMessage[code] || fallbackMessage, trimmedDescription, rawBody);
}
function getStatusForAnonymousError(code) {
    switch(code){
        case "invalid_client":
            return 401;
        case "feature_not_enabled":
        case "unauthorized_client":
            return 403;
        // `server_error` is an authorization-server fault; `invalid_response` is a
        // protocol violation the SDK raises when Auth0 returns a malformed payload
        // (out-of-range `expires_in`, missing `session_token`). Neither is the
        // caller's fault, so both surface as 5xx rather than a misleading 400.
        case "server_error":
        case "invalid_response":
            return 500;
        default:
            return 400;
    }
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/dpop-errors.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DPoPError",
    ()=>DPoPError,
    "DPoPErrorCode",
    ()=>DPoPErrorCode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/sdk-error.js [app-client] (ecmascript)");
;
var DPoPErrorCode;
(function(DPoPErrorCode) {
    /**
     * Failed to calculate dpop_jkt (JWK thumbprint) parameter.
     * This occurs when the SDK cannot generate the required thumbprint
     * from the provided public key for the authorization request.
     */ DPoPErrorCode["DPOP_JKT_CALCULATION_FAILED"] = "dpop_jkt_calculation_failed";
    /**
     * Failed to export DPoP public key to JWK format.
     * This occurs when the SDK cannot convert the CryptoKey to the
     * JSON Web Key format required for DPoP proofs.
     */ DPoPErrorCode["DPOP_KEY_EXPORT_FAILED"] = "dpop_key_export_failed";
    /**
     * DPoP configuration is invalid or incomplete.
     * This occurs when the provided DPoP configuration contains
     * invalid values or missing required components.
     */ DPoPErrorCode["DPOP_CONFIGURATION_ERROR"] = "dpop_configuration_error";
})(DPoPErrorCode || (DPoPErrorCode = {}));
class DPoPError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SdkError"] {
    /**
     * Constructs a new `DPoPError` instance.
     *
     * @param code - The DPoP error code indicating the specific type of failure
     * @param message - A descriptive error message explaining what went wrong
     * @param cause - The underlying error that caused this DPoP error (optional)
     *
     * @example
     * ```typescript
     * const dpopError = new DPoPError(
     *   DPoPErrorCode.DPOP_KEY_EXPORT_FAILED,
     *   "Unable to export public key to JWK format",
     *   keyExportError
     * );
     * ```
     */ constructor(code, message, cause){
        super(message);
        this.name = "DPoPError";
        this.code = code;
        this.cause = cause;
    }
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/index.js [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/oauth-errors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$dpop$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/dpop-errors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mtls$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/mtls-errors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$my$2d$account$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/my-account-errors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/mfa-errors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$popup$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/popup-errors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/passwordless-errors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$db$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/passwordless-db-errors.js [app-client] (ecmascript)");
// MCD (Multiple Custom Domains) error classes
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mcd$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/mcd.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/passkey-errors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$anonymous$2d$session$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/anonymous-session-errors.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/mcd.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DomainResolutionError",
    ()=>DomainResolutionError,
    "DomainValidationError",
    ()=>DomainValidationError,
    "IssuerValidationError",
    ()=>IssuerValidationError,
    "SessionDomainMismatchError",
    ()=>SessionDomainMismatchError
]);
/**
 * MCD (Multiple Custom Domains) specific error classes.
 *
 * Note: `BackchannelLogoutError` is renamed with `Mcd` prefix to avoid
 * collision with the identically-named class in `oauth-errors.ts`.
 * MCD configuration errors use the shared `InvalidConfigurationError`
 * from `oauth-errors.ts`.
 *
 * @module errors/mcd
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/sdk-error.js [app-client] (ecmascript)");
;
class DomainResolutionError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SdkError"] {
    /**
     * Creates a new DomainResolutionError instance.
     *
     * @param message - A descriptive error message
     * @param cause - The underlying error that caused the resolution failure (optional)
     */ constructor(message, cause){
        super(message ?? "Failed to resolve the domain from the request.");
        this.cause = cause;
        this.code = "domain_resolution_error";
        this.name = "DomainResolutionError";
    }
}
class DomainValidationError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SdkError"] {
    /**
     * Creates a new DomainValidationError instance.
     *
     * @param message - A descriptive error message
     */ constructor(message){
        super(message ?? "The domain failed validation.");
        this.code = "domain_validation_error";
        this.name = "DomainValidationError";
    }
}
class IssuerValidationError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SdkError"] {
    /**
     * Creates a new IssuerValidationError instance.
     *
     * @param expectedIssuer - The expected issuer URL
     * @param actualIssuer - The actual issuer URL from the token
     */ constructor(expectedIssuer, actualIssuer){
        super(`Issuer Mismatch: expected "${expectedIssuer}" but received "${actualIssuer}"`);
        this.expectedIssuer = expectedIssuer;
        this.actualIssuer = actualIssuer;
        this.code = "issuer_validation_error";
        this.name = "IssuerValidationError";
    }
}
class SessionDomainMismatchError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SdkError"] {
    /**
     * Creates a new SessionDomainMismatchError instance.
     *
     * @param message - A descriptive error message
     */ constructor(message){
        super(message ?? "The session domain does not match the current request domain.");
        this.code = "session_domain_mismatch";
        this.name = "SessionDomainMismatchError";
    }
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/mfa-errors.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InvalidRequestError",
    ()=>InvalidRequestError,
    "MfaChallengeError",
    ()=>MfaChallengeError,
    "MfaEnrollmentError",
    ()=>MfaEnrollmentError,
    "MfaGetAuthenticatorsError",
    ()=>MfaGetAuthenticatorsError,
    "MfaNoAvailableFactorsError",
    ()=>MfaNoAvailableFactorsError,
    "MfaRequiredError",
    ()=>MfaRequiredError,
    "MfaTokenExpiredError",
    ()=>MfaTokenExpiredError,
    "MfaTokenInvalidError",
    ()=>MfaTokenInvalidError,
    "MfaVerifyError",
    ()=>MfaVerifyError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/sdk-error.js [app-client] (ecmascript)");
;
/**
 * Base class for all MFA-related errors.
 * Provides standardized JSON serialization matching Auth0 API format.
 *
 * Supports two consumption paths with identical shape:
 * 1. Direct SDK call: properties accessed on error instance
 * 2. HTTP API route: Response.json(error) uses toJSON() automatically
 *
 * @example
 * ```typescript
 * try {
 *   await mfa.getAuthenticators({ mfaToken });
 * } catch (error) {
 *   if (error instanceof MfaError) {
 *     return Response.json(error, { status: 400 });
 *   }
 * }
 * ```
 */ class MfaError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SdkError"] {
    /**
     * Serialize error for HTTP responses.
     * Called automatically by Response.json() and JSON.stringify().
     * Ensures both SDK and HTTP API consumers get identical shape.
     */ toJSON() {
        return {
            error: this.error,
            error_description: this.error_description
        };
    }
    get code() {
        return this.error;
    }
}
class InvalidRequestError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(message){
        super(message);
        this.code = "invalid_request";
        Object.setPrototypeOf(this, InvalidRequestError.prototype);
        this.name = "InvalidRequestError";
    }
    toJSON() {
        return {
            error: this.code,
            error_description: this.message
        };
    }
}
class MfaGetAuthenticatorsError extends MfaError {
    constructor(error, error_description, cause){
        super(error_description);
        this.name = "MfaGetAuthenticatorsError";
        this.error = error;
        this.error_description = error_description;
        this.cause = cause;
        Object.setPrototypeOf(this, MfaGetAuthenticatorsError.prototype);
    }
}
class MfaChallengeError extends MfaError {
    constructor(error, error_description, cause){
        super(error_description);
        this.name = "MfaChallengeError";
        this.error = error;
        this.error_description = error_description;
        this.cause = cause;
        Object.setPrototypeOf(this, MfaChallengeError.prototype);
    }
}
class MfaVerifyError extends MfaError {
    constructor(error, error_description, cause){
        super(error_description);
        this.name = "MfaVerifyError";
        this.error = error;
        this.error_description = error_description;
        this.cause = cause;
        Object.setPrototypeOf(this, MfaVerifyError.prototype);
    }
}
class MfaNoAvailableFactorsError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(error_description){
        super(error_description);
        this.code = "mfa_no_available_factors";
        this.error = "mfa_no_available_factors";
        this.name = "MfaNoAvailableFactorsError";
        this.error_description = error_description;
        Object.setPrototypeOf(this, MfaNoAvailableFactorsError.prototype);
    }
}
class MfaEnrollmentError extends MfaError {
    constructor(error, error_description, cause){
        super(error_description);
        this.name = "MfaEnrollmentError";
        this.error = error;
        this.error_description = error_description;
        this.cause = cause;
        Object.setPrototypeOf(this, MfaEnrollmentError.prototype);
    }
}
class MfaRequiredError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SdkError"] {
    /**
     * @param error_description - Error description from Auth0
     * @param mfaToken - Encrypted MFA token (constructor param uses camelCase)
     * @param mfaRequirements - MFA requirements from Auth0 (constructor param uses camelCase)
     * @param cause - Underlying error
     *
     * @remarks
     * Constructor parameters use camelCase (mfaToken, mfaRequirements) for consistency
     * with SDK conventions, but they are assigned to snake_case properties (mfa_token,
     * mfa_requirements) to match Auth0 API response format.
     */ constructor(error_description, mfaToken, mfaRequirements, cause){
        super(error_description);
        this.code = "mfa_required";
        /** Original Auth0 error code */ this.error = "mfa_required";
        this.name = "MfaRequiredError";
        this.error_description = error_description;
        this.mfa_token = mfaToken;
        this.mfa_requirements = mfaRequirements;
        this.cause = cause;
    }
    /**
     * Serialize error for HTTP responses.
     * Called automatically by Response.json() and JSON.stringify().
     * Ensures both SDK and HTTP API consumers get identical shape.
     */ toJSON() {
        return {
            error: this.error,
            error_description: this.error_description,
            mfa_token: this.mfa_token,
            ...this.mfa_requirements && {
                mfa_requirements: this.mfa_requirements
            }
        };
    }
}
class MfaTokenExpiredError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(){
        super("MFA token has expired. Please restart the MFA flow.");
        this.code = "mfa_token_expired";
        this.name = "MfaTokenExpiredError";
    }
}
class MfaTokenInvalidError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(){
        super("MFA token is invalid.");
        this.code = "mfa_token_invalid";
        this.name = "MfaTokenInvalidError";
    }
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/mtls-errors.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MtlsError",
    ()=>MtlsError,
    "MtlsErrorCode",
    ()=>MtlsErrorCode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/sdk-error.js [app-client] (ecmascript)");
;
var MtlsErrorCode;
(function(MtlsErrorCode) {
    /**
     * `useMtls` was set to `true` but no `customFetch` implementation was provided.
     *
     * mTLS requires a TLS-aware `fetch` replacement (e.g. using Node.js `undici`
     * with a client certificate) because the standard `fetch` global has no API
     * for attaching client certificates. The SDK cannot enforce mTLS without it.
     */ MtlsErrorCode["MTLS_REQUIRES_CUSTOM_FETCH"] = "mtls_requires_custom_fetch";
    /**
     * `useMtls` was set to `true` but the authorization server's discovery
     * document does not advertise `mtls_endpoint_aliases`.
     *
     * RFC 8705 certificate-bound tokens require that token requests are sent to
     * the mTLS-specific endpoint. Without `mtls_endpoint_aliases` in discovery,
     * the SDK cannot route requests correctly and refuses to proceed rather than
     * silently issuing non-certificate-bound tokens.
     */ MtlsErrorCode["MTLS_ENDPOINT_ALIASES_MISSING"] = "mtls_endpoint_aliases_missing";
    /**
     * `useMtls` was set to `true` alongside a `clientSecret` or
     * `clientAssertionSigningKey`, which are mutually exclusive with mTLS.
     *
     * mTLS replaces secret-based client authentication entirely. Providing both
     * creates ambiguity and likely indicates a misconfiguration.
     */ MtlsErrorCode["MTLS_INCOMPATIBLE_CLIENT_AUTH"] = "mtls_incompatible_client_auth";
})(MtlsErrorCode || (MtlsErrorCode = {}));
class MtlsError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SdkError"] {
    /**
     * Constructs a new `MtlsError` instance.
     *
     * @param code - The mTLS error code indicating the specific type of failure
     * @param message - A descriptive error message explaining what went wrong
     *
     * @example
     * ```typescript
     * throw new MtlsError(
     *   MtlsErrorCode.MTLS_REQUIRES_CUSTOM_FETCH,
     *   "useMtls requires a customFetch option with a TLS client certificate."
     * );
     * ```
     */ constructor(code, message){
        super(message);
        this.name = "MtlsError";
        this.code = code;
    }
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/my-account-errors.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ConnectAccountError",
    ()=>ConnectAccountError,
    "ConnectAccountErrorCodes",
    ()=>ConnectAccountErrorCodes,
    "ConnectedAccountsError",
    ()=>ConnectedAccountsError,
    "ConnectedAccountsErrorCodes",
    ()=>ConnectedAccountsErrorCodes,
    "MyAccountApiError",
    ()=>MyAccountApiError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/sdk-error.js [app-client] (ecmascript)");
;
class MyAccountApiError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor({ type, title, detail, status, validationErrors }){
        super(`${title}: ${detail}`);
        this.name = "MyAccountApiError";
        this.code = "my_account_api_error";
        this.type = type;
        this.title = title;
        this.detail = detail;
        this.status = status;
        this.validationErrors = validationErrors;
    }
}
var ConnectAccountErrorCodes;
(function(ConnectAccountErrorCodes) {
    /**
     * The session is missing.
     */ ConnectAccountErrorCodes["MISSING_SESSION"] = "missing_session";
    /**
     * Failed to initiate the connect account flow.
     */ ConnectAccountErrorCodes["FAILED_TO_INITIATE"] = "failed_to_initiate";
    /**
     * Failed to complete the connect account flow.
     */ ConnectAccountErrorCodes["FAILED_TO_COMPLETE"] = "failed_to_complete";
})(ConnectAccountErrorCodes || (ConnectAccountErrorCodes = {}));
class ConnectAccountError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor({ code, message, cause }){
        super(message);
        this.name = "ConnectAccountError";
        this.code = code;
        this.cause = cause;
    }
}
var ConnectedAccountsErrorCodes;
(function(ConnectedAccountsErrorCodes) {
    /**
     * The session is missing.
     */ ConnectedAccountsErrorCodes["MISSING_SESSION"] = "missing_session";
    /**
     * Failed to list the connected accounts.
     */ ConnectedAccountsErrorCodes["FAILED_TO_LIST"] = "failed_to_list";
    /**
     * Failed to delete the connected account.
     */ ConnectedAccountsErrorCodes["FAILED_TO_DELETE"] = "failed_to_delete";
})(ConnectedAccountsErrorCodes || (ConnectedAccountsErrorCodes = {}));
class ConnectedAccountsError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor({ code, message, cause }){
        super(message);
        this.name = "ConnectedAccountsError";
        this.code = code;
        this.cause = cause;
    }
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/oauth-errors.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AccessTokenError",
    ()=>AccessTokenError,
    "AccessTokenErrorCode",
    ()=>AccessTokenErrorCode,
    "AccessTokenForConnectionError",
    ()=>AccessTokenForConnectionError,
    "AccessTokenForConnectionErrorCode",
    ()=>AccessTokenForConnectionErrorCode,
    "AuthorizationCodeGrantError",
    ()=>AuthorizationCodeGrantError,
    "AuthorizationCodeGrantRequestError",
    ()=>AuthorizationCodeGrantRequestError,
    "AuthorizationError",
    ()=>AuthorizationError,
    "BackchannelAuthenticationError",
    ()=>BackchannelAuthenticationError,
    "BackchannelAuthenticationNotSupportedError",
    ()=>BackchannelAuthenticationNotSupportedError,
    "BackchannelLogoutError",
    ()=>BackchannelLogoutError,
    "CustomTokenExchangeError",
    ()=>CustomTokenExchangeError,
    "CustomTokenExchangeErrorCode",
    ()=>CustomTokenExchangeErrorCode,
    "DiscoveryError",
    ()=>DiscoveryError,
    "EnterpriseConnectError",
    ()=>EnterpriseConnectError,
    "InvalidConfigurationError",
    ()=>InvalidConfigurationError,
    "InvalidStateError",
    ()=>InvalidStateError,
    "MissingStateError",
    ()=>MissingStateError,
    "OAuth2Error",
    ()=>OAuth2Error,
    "TokenRevocationError",
    ()=>TokenRevocationError,
    "TokenRevocationErrorCode",
    ()=>TokenRevocationErrorCode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/sdk-error.js [app-client] (ecmascript)");
;
class OAuth2Error extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor({ code, message }){
        super(message ?? "An error occurred while interacting with the authorization server.");
        this.name = "OAuth2Error";
        this.code = code;
    }
}
class DiscoveryError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(message){
        super(message ?? "Discovery failed for the OpenID Connect configuration.");
        this.code = "discovery_error";
        this.name = "DiscoveryError";
    }
}
class MissingStateError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(message){
        super(message ?? "The state parameter is missing.");
        this.code = "missing_state";
        this.name = "MissingStateError";
    }
}
class InvalidStateError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(message){
        super(message ?? "The state parameter is invalid.");
        this.code = "invalid_state";
        this.name = "InvalidStateError";
    }
}
class InvalidConfigurationError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(message){
        super(message ?? "The configuration is invalid.");
        this.code = "invalid_configuration";
        this.name = "InvalidConfigurationError";
    }
}
class EnterpriseConnectError extends InvalidConfigurationError {
    constructor(message){
        super(message ?? "This method is not available in Enterprise Connect mode.");
        this.code = "enterprise_connect_not_supported";
        this.name = "EnterpriseConnectError";
    }
}
class AuthorizationError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor({ cause, message }){
        super(message ?? "An error occurred during the authorization flow.");
        this.code = "authorization_error";
        this.cause = cause;
        this.name = "AuthorizationError";
    }
}
class AuthorizationCodeGrantRequestError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(message){
        super(message ?? "An error occurred while preparing or performing the authorization code grant request.");
        this.code = "authorization_code_grant_request_error";
        this.name = "AuthorizationCodeGrantRequestError";
    }
}
class AuthorizationCodeGrantError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor({ cause, message }){
        super(message ?? "An error occurred while trying to exchange the authorization code.");
        this.code = "authorization_code_grant_error";
        this.cause = cause;
        this.name = "AuthorizationCodeGrantError";
    }
}
class BackchannelLogoutError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(message){
        super(message ?? "An error occurred while completing the backchannel logout request.");
        this.code = "backchannel_logout_error";
        this.name = "BackchannelLogoutError";
    }
}
class BackchannelAuthenticationNotSupportedError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(){
        super("The authorization server does not support backchannel authentication. Learn how to enable it here: https://auth0.com/docs/get-started/applications/configure-client-initiated-backchannel-authentication");
        this.code = "backchannel_authentication_not_supported_error";
        this.name = "BackchannelAuthenticationNotSupportedError";
    }
}
class BackchannelAuthenticationError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor({ cause }){
        super("There was an error when trying to use Client-Initiated Backchannel Authentication.");
        this.code = "backchannel_authentication_error";
        this.cause = cause;
        this.name = "BackchannelAuthenticationError";
    }
}
var AccessTokenErrorCode;
(function(AccessTokenErrorCode) {
    AccessTokenErrorCode["MISSING_SESSION"] = "missing_session";
    AccessTokenErrorCode["MISSING_REFRESH_TOKEN"] = "missing_refresh_token";
    AccessTokenErrorCode["FAILED_TO_REFRESH_TOKEN"] = "failed_to_refresh_token";
    AccessTokenErrorCode["SESSION_EXPIRED"] = "session_expired";
})(AccessTokenErrorCode || (AccessTokenErrorCode = {}));
class AccessTokenError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(code, message, cause){
        super(message);
        this.name = "AccessTokenError";
        this.code = code;
        this.cause = cause;
    }
}
var AccessTokenForConnectionErrorCode;
(function(AccessTokenForConnectionErrorCode) {
    /**
     * The session is missing.
     */ AccessTokenForConnectionErrorCode["MISSING_SESSION"] = "missing_session";
    /**
     * The refresh token is missing.
     */ AccessTokenForConnectionErrorCode["MISSING_REFRESH_TOKEN"] = "missing_refresh_token";
    /**
     * Failed to exchange the refresh token.
     */ AccessTokenForConnectionErrorCode["FAILED_TO_EXCHANGE"] = "failed_to_exchange_refresh_token";
})(AccessTokenForConnectionErrorCode || (AccessTokenForConnectionErrorCode = {}));
class AccessTokenForConnectionError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SdkError"] {
    /**
     * Constructs a new `AccessTokenForConnectionError` instance.
     *
     * @param code - The error code.
     * @param message - The error message.
     * @param cause - The OAuth2 cause of the error.
     */ constructor(code, message, cause){
        super(message);
        this.name = "AccessTokenForConnectionError";
        this.code = code;
        this.cause = cause;
    }
}
var TokenRevocationErrorCode;
(function(TokenRevocationErrorCode) {
    /**
     * No session exists for the current request.
     */ TokenRevocationErrorCode["MISSING_SESSION"] = "missing_session";
    /**
     * The session (or request) has no refresh token to revoke.
     */ TokenRevocationErrorCode["MISSING_REFRESH_TOKEN"] = "missing_refresh_token";
    /**
     * The revocation request to Auth0 failed.
     */ TokenRevocationErrorCode["FAILED_TO_REVOKE"] = "failed_to_revoke";
})(TokenRevocationErrorCode || (TokenRevocationErrorCode = {}));
class TokenRevocationError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SdkError"] {
    /**
     * Constructs a new `TokenRevocationError` instance.
     *
     * @param code - The error code.
     * @param message - The error message.
     * @param cause - The OAuth2 cause of the error.
     */ constructor(code, message, cause){
        super(message);
        this.name = "TokenRevocationError";
        this.code = code;
        this.cause = cause;
    }
}
var CustomTokenExchangeErrorCode;
(function(CustomTokenExchangeErrorCode) {
    /**
     * The subject_token is missing or empty.
     */ CustomTokenExchangeErrorCode["MISSING_SUBJECT_TOKEN"] = "missing_subject_token";
    /**
     * The subject_token_type is not a valid URI, wrong length, or uses a reserved namespace.
     */ CustomTokenExchangeErrorCode["INVALID_SUBJECT_TOKEN_TYPE"] = "invalid_subject_token_type";
    /**
     * The actor_token was provided without actor_token_type.
     */ CustomTokenExchangeErrorCode["MISSING_ACTOR_TOKEN_TYPE"] = "missing_actor_token_type";
    /**
     * The actor_token_type is not a valid URI.
     */ CustomTokenExchangeErrorCode["INVALID_ACTOR_TOKEN_TYPE"] = "invalid_actor_token_type";
    /**
     * The token exchange request failed.
     */ CustomTokenExchangeErrorCode["EXCHANGE_FAILED"] = "exchange_failed";
    /**
     * No actor could be resolved for the STT exchange: no explicit `actor` was passed
     * and no usable session ID token is available (missing or expired with no refresh token).
     * Thrown client-side before any network call.
     */ CustomTokenExchangeErrorCode["ACTOR_UNAVAILABLE"] = "actor_unavailable";
    /**
     * The CTE Action did not call `setActor`, which is required when requesting an STT.
     * Surfaces the server 400 response.
     */ CustomTokenExchangeErrorCode["SETACTOR_REQUIRED"] = "setactor_required";
    /**
     * The `cte_session_transfer_token` feature flag is disabled on the tenant.
     * Surfaces the server 400 response.
     */ CustomTokenExchangeErrorCode["SESSION_TRANSFER_DISABLED"] = "session_transfer_disabled";
})(CustomTokenExchangeErrorCode || (CustomTokenExchangeErrorCode = {}));
class CustomTokenExchangeError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SdkError"] {
    /**
     * Constructs a new `CustomTokenExchangeError` instance.
     *
     * @param code - The error code.
     * @param message - The error message.
     * @param cause - The OAuth2 cause of the error.
     */ constructor(code, message, cause){
        super(message);
        this.name = "CustomTokenExchangeError";
        this.code = code;
        this.cause = cause;
    }
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/passkey-errors.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PasskeyChallengeError",
    ()=>PasskeyChallengeError,
    "PasskeyEnrollmentChallengeError",
    ()=>PasskeyEnrollmentChallengeError,
    "PasskeyEnrollmentVerifyError",
    ()=>PasskeyEnrollmentVerifyError,
    "PasskeyGetTokenError",
    ()=>PasskeyGetTokenError,
    "PasskeyRegisterError",
    ()=>PasskeyRegisterError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/sdk-error.js [app-client] (ecmascript)");
;
/**
 * Base class for all passkey-related errors.
 * Provides standardized JSON serialization matching Auth0 API format.
 */ class PasskeyError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SdkError"] {
    toJSON() {
        return {
            error: this.error,
            error_description: this.error_description
        };
    }
}
class PasskeyRegisterError extends PasskeyError {
    get code() {
        return "passkey_register_error";
    }
    constructor(error, error_description, cause){
        super(error_description);
        this.name = "PasskeyRegisterError";
        this.error = error;
        this.error_description = error_description;
        this.cause = cause;
        Object.setPrototypeOf(this, PasskeyRegisterError.prototype);
    }
}
class PasskeyChallengeError extends PasskeyError {
    get code() {
        return "passkey_challenge_error";
    }
    constructor(error, error_description, cause){
        super(error_description);
        this.name = "PasskeyChallengeError";
        this.error = error;
        this.error_description = error_description;
        this.cause = cause;
        Object.setPrototypeOf(this, PasskeyChallengeError.prototype);
    }
}
class PasskeyGetTokenError extends PasskeyError {
    get code() {
        return "passkey_get_token_error";
    }
    constructor(error, error_description, cause){
        super(error_description);
        this.name = "PasskeyGetTokenError";
        this.error = error;
        this.error_description = error_description;
        this.cause = cause;
        Object.setPrototypeOf(this, PasskeyGetTokenError.prototype);
    }
}
class PasskeyEnrollmentChallengeError extends PasskeyError {
    get code() {
        return "passkey_enrollment_challenge_error";
    }
    constructor(error, error_description, cause){
        super(error_description);
        this.name = "PasskeyEnrollmentChallengeError";
        this.error = error;
        this.error_description = error_description;
        this.cause = cause;
        Object.setPrototypeOf(this, PasskeyEnrollmentChallengeError.prototype);
    }
}
class PasskeyEnrollmentVerifyError extends PasskeyError {
    get code() {
        return "passkey_enrollment_verify_error";
    }
    constructor(error, error_description, cause){
        super(error_description);
        this.name = "PasskeyEnrollmentVerifyError";
        this.error = error;
        this.error_description = error_description;
        this.cause = cause;
        Object.setPrototypeOf(this, PasskeyEnrollmentVerifyError.prototype);
    }
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/passwordless-db-errors.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PasswordlessDbChallengeError",
    ()=>PasswordlessDbChallengeError,
    "PasswordlessDbGetTokenError",
    ()=>PasswordlessDbGetTokenError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/sdk-error.js [app-client] (ecmascript)");
;
class PasswordlessDbError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SdkError"] {
    toJSON() {
        return {
            error: this.error,
            error_description: this.error_description
        };
    }
}
class PasswordlessDbChallengeError extends PasswordlessDbError {
    get code() {
        return "passwordless_challenge_error";
    }
    constructor(error, error_description, cause){
        super(error_description);
        this.name = "PasswordlessDbChallengeError";
        this.error = error;
        this.error_description = error_description;
        this.cause = cause;
        Object.setPrototypeOf(this, PasswordlessDbChallengeError.prototype);
    }
}
class PasswordlessDbGetTokenError extends PasswordlessDbError {
    get code() {
        return "passwordless_login_error";
    }
    constructor(error, error_description, cause){
        super(error_description);
        this.name = "PasswordlessDbGetTokenError";
        this.error = error;
        this.error_description = error_description;
        this.cause = cause;
        Object.setPrototypeOf(this, PasswordlessDbGetTokenError.prototype);
    }
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/passwordless-errors.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PasswordlessStartError",
    ()=>PasswordlessStartError,
    "PasswordlessVerifyError",
    ()=>PasswordlessVerifyError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/sdk-error.js [app-client] (ecmascript)");
;
/**
 * Base class for all passwordless-related errors.
 * Provides standardized JSON serialization matching Auth0 API format.
 *
 * Supports two consumption paths with identical shape:
 * 1. Direct SDK call: properties accessed on error instance
 * 2. HTTP API route: Response.json(error) uses toJSON() automatically
 */ class PasswordlessError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SdkError"] {
    toJSON() {
        return {
            error: this.error,
            error_description: this.error_description
        };
    }
}
class PasswordlessStartError extends PasswordlessError {
    get code() {
        return "passwordless_start_error";
    }
    constructor(error, error_description, cause){
        super(error_description);
        this.name = "PasswordlessStartError";
        this.error = error;
        this.error_description = error_description;
        this.cause = cause;
        Object.setPrototypeOf(this, PasswordlessStartError.prototype);
    }
}
class PasswordlessVerifyError extends PasswordlessError {
    get code() {
        return "passwordless_verify_error";
    }
    constructor(error, error_description, cause){
        super(error_description);
        this.name = "PasswordlessVerifyError";
        this.error = error;
        this.error_description = error_description;
        this.cause = cause;
        Object.setPrototypeOf(this, PasswordlessVerifyError.prototype);
    }
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/popup-errors.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ExecutionContextError",
    ()=>ExecutionContextError,
    "PopupBlockedError",
    ()=>PopupBlockedError,
    "PopupCancelledError",
    ()=>PopupCancelledError,
    "PopupInProgressError",
    ()=>PopupInProgressError,
    "PopupTimeoutError",
    ()=>PopupTimeoutError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/sdk-error.js [app-client] (ecmascript)");
;
class PopupBlockedError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(message){
        super(message || "Popup was blocked by browser. Enable popups for this site.");
        this.code = "popup_blocked";
        this.name = "PopupBlockedError";
        Object.setPrototypeOf(this, PopupBlockedError.prototype);
    }
}
class PopupCancelledError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(message){
        super(message || "Popup was closed by user");
        this.code = "popup_cancelled";
        this.name = "PopupCancelledError";
        Object.setPrototypeOf(this, PopupCancelledError.prototype);
    }
}
class PopupTimeoutError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(message){
        super(message || "Popup did not complete within timeout");
        this.code = "popup_timeout";
        this.name = "PopupTimeoutError";
        Object.setPrototypeOf(this, PopupTimeoutError.prototype);
    }
}
class PopupInProgressError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(message){
        super(message || "Another popup authentication is already in progress");
        this.code = "popup_in_progress";
        this.name = "PopupInProgressError";
        Object.setPrototypeOf(this, PopupInProgressError.prototype);
    }
}
class ExecutionContextError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(message){
        super(message || "Method can only be called in browser context");
        this.code = "invalid_execution_context";
        this.name = "ExecutionContextError";
        Object.setPrototypeOf(this, ExecutionContextError.prototype);
    }
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/sdk-error.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SdkError",
    ()=>SdkError
]);
class SdkError extends Error {
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/types/mfa.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * MFA-related types for authentication flow.
 *
 * Response types use snake_case to match Auth0 API conventions (consistent with SPA SDK).
 * SDK-facing types use camelCase.
 */ /**
 * Grant type for MFA token exchange.
 * Used in token endpoint requests to exchange an mfa_token for access/refresh tokens.
 *
 * @see https://auth0.com/docs/api/authentication#verify-with-one-time-password-otp-
 */ __turbopack_context__.s([
    "GRANT_TYPE_MFA_OOB",
    ()=>GRANT_TYPE_MFA_OOB,
    "GRANT_TYPE_MFA_OTP",
    ()=>GRANT_TYPE_MFA_OTP,
    "GRANT_TYPE_MFA_RECOVERY_CODE",
    ()=>GRANT_TYPE_MFA_RECOVERY_CODE
]);
const GRANT_TYPE_MFA_OTP = "http://auth0.com/oauth/grant-type/mfa-otp";
const GRANT_TYPE_MFA_OOB = "http://auth0.com/oauth/grant-type/mfa-oob";
const GRANT_TYPE_MFA_RECOVERY_CODE = "http://auth0.com/oauth/grant-type/mfa-recovery-code";
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/constants.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * The default scopes to request when none are provided.
 * These scopes provide basic user information and authentication capabilities.
 */ __turbopack_context__.s([
    "AUTO_CLOSE_DELAY",
    ()=>AUTO_CLOSE_DELAY,
    "DEFAULT_DPOP_CLOCK_SKEW",
    ()=>DEFAULT_DPOP_CLOCK_SKEW,
    "DEFAULT_DPOP_CLOCK_TOLERANCE",
    ()=>DEFAULT_DPOP_CLOCK_TOLERANCE,
    "DEFAULT_MFA_CONTEXT_TTL_SECONDS",
    ()=>DEFAULT_MFA_CONTEXT_TTL_SECONDS,
    "DEFAULT_POPUP_HEIGHT",
    ()=>DEFAULT_POPUP_HEIGHT,
    "DEFAULT_POPUP_TIMEOUT",
    ()=>DEFAULT_POPUP_TIMEOUT,
    "DEFAULT_POPUP_WIDTH",
    ()=>DEFAULT_POPUP_WIDTH,
    "DEFAULT_RETRY_DELAY",
    ()=>DEFAULT_RETRY_DELAY,
    "DEFAULT_RETRY_JITTER",
    ()=>DEFAULT_RETRY_JITTER,
    "DEFAULT_SCOPES",
    ()=>DEFAULT_SCOPES,
    "DEFAULT_STT_SCOPES",
    ()=>DEFAULT_STT_SCOPES,
    "MAX_RECOMMENDED_DPOP_CLOCK_TOLERANCE",
    ()=>MAX_RECOMMENDED_DPOP_CLOCK_TOLERANCE,
    "POLL_INTERVAL",
    ()=>POLL_INTERVAL
]);
const DEFAULT_SCOPES = [
    "openid",
    "profile",
    "email",
    "offline_access"
].join(" ");
const DEFAULT_STT_SCOPES = [
    "openid",
    "profile",
    "email"
].join(" ");
const DEFAULT_DPOP_CLOCK_SKEW = 0;
const DEFAULT_DPOP_CLOCK_TOLERANCE = 30;
const MAX_RECOMMENDED_DPOP_CLOCK_TOLERANCE = 300;
const DEFAULT_RETRY_DELAY = 100;
const DEFAULT_RETRY_JITTER = true;
const DEFAULT_MFA_CONTEXT_TTL_SECONDS = 5 * 60; // 5 minutes (300 seconds)
const DEFAULT_POPUP_WIDTH = 400;
const DEFAULT_POPUP_HEIGHT = 600;
const DEFAULT_POPUP_TIMEOUT = 60000;
const AUTO_CLOSE_DELAY = 2000;
const POLL_INTERVAL = 500;
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/mfa-transform-utils.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FACTOR_MAPPING",
    ()=>FACTOR_MAPPING,
    "buildEnrollmentResponse",
    ()=>buildEnrollmentResponse,
    "buildVerifyParams",
    ()=>buildVerifyParams,
    "camelizeAuthenticator",
    ()=>camelizeAuthenticator,
    "camelizeChallengeResponse",
    ()=>camelizeChallengeResponse,
    "getVerifyGrantType",
    ()=>getVerifyGrantType,
    "normalizeEnrollOptions",
    ()=>normalizeEnrollOptions,
    "transformVerifyBodyToOptions",
    ()=>transformVerifyBodyToOptions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/mfa-errors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$types$2f$mfa$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/types/mfa.js [app-client] (ecmascript)");
;
;
function camelizeAuthenticator(auth) {
    return {
        id: auth.id,
        authenticatorType: auth.authenticator_type,
        type: auth.type,
        active: auth.active,
        name: auth.name,
        phoneNumber: auth.phone_number,
        oobChannel: auth.oob_channel,
        createdAt: auth.created_at,
        lastAuthenticatedAt: auth.last_auth
    };
}
function camelizeChallengeResponse(result) {
    return {
        challengeType: result.challenge_type,
        oobCode: result.oob_code,
        bindingMethod: result.binding_method
    };
}
function buildEnrollmentResponse(result) {
    const baseResponse = {
        authenticatorType: result.authenticator_type,
        id: result.id,
        recoveryCodes: result.recovery_codes
    };
    if (result.authenticator_type === "otp") {
        const response = {
            ...baseResponse,
            authenticatorType: "otp",
            secret: result.secret,
            barcodeUri: result.barcode_uri
        };
        return response;
    } else if (result.authenticator_type === "oob") {
        return {
            ...baseResponse,
            authenticatorType: "oob",
            oobChannel: result.oob_channel,
            name: result.name,
            oobCode: result.oob_code,
            bindingMethod: result.binding_method,
            barcodeUri: result.barcode_uri
        };
    }
    throw new Error(`Unknown authenticator type: ${result.authenticator_type}`);
}
function transformVerifyBodyToOptions(body) {
    if (body.otp) {
        return {
            otp: body.otp
        };
    }
    if (body.oob_code && body.binding_code) {
        return {
            oobCode: body.oob_code,
            bindingCode: body.binding_code
        };
    }
    if (body.recovery_code) {
        return {
            recoveryCode: body.recovery_code
        };
    }
    throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InvalidRequestError"]("Missing verification credential");
}
const buildVerifyParams = (options, mfaToken, audience, scope)=>{
    const params = new URLSearchParams();
    params.append("mfa_token", mfaToken);
    if (audience) params.append("audience", audience);
    if (scope) params.append("scope", scope);
    if ("otp" in options && options.otp) {
        params.append("otp", options.otp);
    } else if ("oobCode" in options && "bindingCode" in options && options.oobCode && options.bindingCode) {
        params.append("oob_code", options.oobCode);
        params.append("binding_code", options.bindingCode);
    } else if ("recoveryCode" in options && options.recoveryCode) {
        params.append("recovery_code", options.recoveryCode);
    } else {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MfaVerifyError"]("invalid_request", "At least one verification credential required (otp, oobCode+bindingCode, or recoveryCode)");
    }
    return params;
};
const getVerifyGrantType = (params)=>{
    if (params.has("otp")) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$types$2f$mfa$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GRANT_TYPE_MFA_OTP"];
    } else if (params.has("oob_code") && params.has("binding_code")) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$types$2f$mfa$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GRANT_TYPE_MFA_OOB"];
    } else if (params.has("recovery_code")) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$types$2f$mfa$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GRANT_TYPE_MFA_RECOVERY_CODE"];
    } else {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MfaVerifyError"]("invalid_request", "No verification credential provided");
    }
};
const FACTOR_MAPPING = {
    otp: {
        authenticator_types: [
            "otp"
        ]
    },
    sms: {
        authenticator_types: [
            "oob"
        ],
        oob_channels: [
            "sms"
        ]
    },
    voice: {
        authenticator_types: [
            "oob"
        ],
        oob_channels: [
            "voice"
        ]
    },
    email: {
        authenticator_types: [
            "oob"
        ],
        oob_channels: [
            "email"
        ]
    },
    push: {
        authenticator_types: [
            "oob"
        ],
        oob_channels: [
            "auth0"
        ]
    }
};
function normalizeEnrollOptions(options) {
    if ("factorType" in options) {
        const mapping = FACTOR_MAPPING[options.factorType];
        if (!mapping) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InvalidRequestError"](`Unknown factorType: ${options.factorType}`);
        if ((options.factorType === "sms" || options.factorType === "voice") && !("phoneNumber" in options && options.phoneNumber)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InvalidRequestError"](`phoneNumber is required for factorType: ${options.factorType}`);
        }
        const result = {
            mfaToken: options.mfaToken,
            authenticatorTypes: mapping.authenticator_types
        };
        if (mapping.oob_channels) {
            result.oobChannels = mapping.oob_channels;
        }
        if ("phoneNumber" in options && options.phoneNumber !== undefined) {
            result.phoneNumber = options.phoneNumber;
        }
        if ("email" in options && options.email !== undefined) {
            result.email = options.email;
        }
        return result;
    }
    // Passthrough for existing authenticatorTypes format
    return options;
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/pathUtils.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createRouteUrl",
    ()=>createRouteUrl,
    "ensureLeadingSlash",
    ()=>ensureLeadingSlash,
    "ensureNoLeadingSlash",
    ()=>ensureNoLeadingSlash,
    "ensureTrailingSlash",
    ()=>ensureTrailingSlash,
    "normalizeWithBasePath",
    ()=>normalizeWithBasePath,
    "removeTrailingSlash",
    ()=>removeTrailingSlash
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/web/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/oauth-errors.js [app-client] (ecmascript)");
;
function ensureLeadingSlash(value) {
    return value && !value.startsWith("/") ? `/${value}` : value;
}
function ensureTrailingSlash(value) {
    return value && !value.endsWith("/") ? `${value}/` : value;
}
function ensureNoLeadingSlash(value) {
    return value && value.startsWith("/") ? value.substring(1, value.length) : value;
}
const removeTrailingSlash = (path)=>path.endsWith("/") ? path.slice(0, -1) : path;
function createRouteUrl(path, baseUrl) {
    if (!baseUrl) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InvalidConfigurationError"]("appBaseUrl is required for this operation. Provide it in Auth0ClientOptions or ensure it can be resolved from request headers.");
    }
    return new URL(ensureNoLeadingSlash(normalizeWithBasePath(path)), ensureTrailingSlash(baseUrl));
}
const normalizeWithBasePath = (path)=>{
    const basePath = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_BASE_PATH;
    if (!basePath) {
        return path;
    }
    // basePath can be `docs` or `/docs`
    const sanitizedBasePath = ensureLeadingSlash(basePath);
    return ensureTrailingSlash(sanitizedBasePath) + ensureNoLeadingSlash(path);
};
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/popup-helpers.js [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "openCenteredPopup",
    ()=>openCenteredPopup,
    "waitForPopupCompletion",
    ()=>waitForPopupCompletion
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$popup$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/popup-errors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/constants.js [app-client] (ecmascript)");
;
;
;
function openCenteredPopup(url, width, height) {
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    return window.open(url, "_blank", `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`);
}
function waitForPopupCompletion(popup, timeout) {
    return new Promise((resolve, reject)=>{
        const timeoutId = setTimeout(()=>{
            cleanup();
            reject(new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$popup$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopupTimeoutError"](`Popup did not complete within ${timeout}ms`));
        }, timeout);
        const pollId = setInterval(()=>{
            if (popup.closed) {
                cleanup();
                reject(new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$popup$2d$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopupCancelledError"]("Popup was closed by user"));
            }
        }, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["POLL_INTERVAL"]);
        function messageHandler(event) {
            if (event.origin !== window.location.origin) {
                return; // Ignore cross-origin messages
            }
            if (event.data?.type === "auth_complete") {
                cleanup();
                resolve(event.data);
            }
        }
        function cleanup() {
            clearTimeout(timeoutId);
            clearInterval(pollId);
            window.removeEventListener("message", messageHandler);
        }
        window.addEventListener("message", messageHandler);
    });
}
}),
"[project]/web/node_modules/dequal/lite/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/web/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/web/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    default: null,
    useLinkStatus: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    /**
 * A React component that extends the HTML `<a>` element to provide
 * [prefetching](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#2-prefetching)
 * and client-side navigation. This is the primary way to navigate between routes in Next.js.
 *
 * @remarks
 * - Prefetching is only enabled in production.
 *
 * @see https://nextjs.org/docs/app/api-reference/components/link
 */ default: function() {
        return LinkComponent;
    },
    useLinkStatus: function() {
        return useLinkStatus;
    }
});
const _interop_require_wildcard = __turbopack_context__.r("[project]/web/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs [app-client] (ecmascript)");
const _jsxruntime = __turbopack_context__.r("[project]/web/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const _react = /*#__PURE__*/ _interop_require_wildcard._(__turbopack_context__.r("[project]/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"));
const _formaturl = __turbopack_context__.r("[project]/web/node_modules/next/dist/shared/lib/router/utils/format-url.js [app-client] (ecmascript)");
const _approutercontextsharedruntime = __turbopack_context__.r("[project]/web/node_modules/next/dist/shared/lib/app-router-context.shared-runtime.js [app-client] (ecmascript)");
const _usemergedref = __turbopack_context__.r("[project]/web/node_modules/next/dist/client/use-merged-ref.js [app-client] (ecmascript)");
const _utils = __turbopack_context__.r("[project]/web/node_modules/next/dist/shared/lib/utils.js [app-client] (ecmascript)");
const _addbasepath = __turbopack_context__.r("[project]/web/node_modules/next/dist/client/add-base-path.js [app-client] (ecmascript)");
const _routerreducertypes = __turbopack_context__.r("[project]/web/node_modules/next/dist/client/components/router-reducer/router-reducer-types.js [app-client] (ecmascript)");
const _links = __turbopack_context__.r("[project]/web/node_modules/next/dist/client/components/links.js [app-client] (ecmascript)");
const _islocalurl = __turbopack_context__.r("[project]/web/node_modules/next/dist/shared/lib/router/utils/is-local-url.js [app-client] (ecmascript)");
const _types = __turbopack_context__.r("[project]/web/node_modules/next/dist/client/components/segment-cache/types.js [app-client] (ecmascript)");
function isModifiedEvent(event) {
    const eventTarget = event.currentTarget;
    const target = eventTarget.getAttribute('target');
    return target && target !== '_self' || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || // triggers resource download
    event.nativeEvent && event.nativeEvent.which === 2;
}
function linkClicked(e, href, linkInstanceRef, replace, scroll, onNavigate, transitionTypes, prefetchIntent = 'none') {
    if (typeof window !== 'undefined') {
        const { nodeName } = e.currentTarget;
        // anchors inside an svg have a lowercase nodeName
        const isAnchorNodeName = nodeName.toUpperCase() === 'A';
        if (isAnchorNodeName && isModifiedEvent(e) || e.currentTarget.hasAttribute('download')) {
            // ignore click for browser’s default behavior
            return;
        }
        if (!(0, _islocalurl.isLocalURL)(href)) {
            if (replace) {
                // browser default behavior does not replace the history state
                // so we need to do it manually
                e.preventDefault();
                location.replace(href);
            }
            // ignore click for browser’s default behavior
            return;
        }
        e.preventDefault();
        if (onNavigate) {
            let isDefaultPrevented = false;
            onNavigate({
                preventDefault: ()=>{
                    isDefaultPrevented = true;
                }
            });
            if (isDefaultPrevented) {
                return;
            }
        }
        const { navigate } = __turbopack_context__.r("[project]/web/node_modules/next/dist/client/components/navigator.js [app-client] (ecmascript)");
        navigate(href, replace ? 'replace' : 'push', scroll === false ? _routerreducertypes.ScrollBehavior.NoScroll : _routerreducertypes.ScrollBehavior.Default, linkInstanceRef.current, transitionTypes, prefetchIntent);
    }
}
function formatStringOrUrl(urlObjOrString) {
    if (typeof urlObjOrString === 'string') {
        return urlObjOrString;
    }
    return (0, _formaturl.formatUrl)(urlObjOrString);
}
function LinkComponent(props) {
    const [linkStatus, setOptimisticLinkStatus] = (0, _react.useOptimistic)(_links.IDLE_LINK_STATUS);
    let children;
    const linkInstanceRef = (0, _react.useRef)(null);
    const { href: hrefProp, as: asProp, children: childrenProp, prefetch: prefetchProp = null, passHref, replace, shallow, scroll, onClick, onMouseEnter: onMouseEnterProp, onTouchStart: onTouchStartProp, legacyBehavior = false, onNavigate, transitionTypes, ref: forwardedRef, unstable_dynamicOnHover, ...restProps } = props;
    children = childrenProp;
    if (legacyBehavior && (typeof children === 'string' || typeof children === 'number')) {
        children = /*#__PURE__*/ (0, _jsxruntime.jsx)("a", {
            children: children
        });
    }
    const router = _react.default.useContext(_approutercontextsharedruntime.AppRouterContext);
    const prefetchEnabled = prefetchProp !== false;
    const prefetchIntent = prefetchProp === false ? 'none' : prefetchProp === true ? 'full' : 'auto';
    const fetchStrategy = prefetchIntent !== 'none' ? getFetchStrategyFromPrefetchIntent(prefetchIntent) : _types.FetchStrategy.PPR;
    if ("TURBOPACK compile-time truthy", 1) {
        function createPropError(args) {
            return new Error(`Failed prop type: The prop \`${args.key}\` expects a ${args.expected} in \`<Link>\`, but got \`${args.actual}\` instead.` + (typeof window !== 'undefined' ? "\nOpen your browser's console to view the Component stack trace." : ''));
        }
        // TypeScript trick for type-guarding:
        const requiredPropsGuard = {
            href: true
        };
        const requiredProps = Object.keys(requiredPropsGuard);
        requiredProps.forEach((key)=>{
            if (key === 'href') {
                if (props[key] == null || typeof props[key] !== 'string' && typeof props[key] !== 'object') {
                    throw createPropError({
                        key,
                        expected: '`string` or `object`',
                        actual: props[key] === null ? 'null' : typeof props[key]
                    });
                }
            } else {
                // TypeScript trick for type-guarding:
                const _ = key;
            }
        });
        // TypeScript trick for type-guarding:
        const optionalPropsGuard = {
            as: true,
            replace: true,
            scroll: true,
            shallow: true,
            passHref: true,
            prefetch: true,
            unstable_dynamicOnHover: true,
            onClick: true,
            onMouseEnter: true,
            onTouchStart: true,
            legacyBehavior: true,
            onNavigate: true,
            transitionTypes: true
        };
        const optionalProps = Object.keys(optionalPropsGuard);
        optionalProps.forEach((key)=>{
            const valType = typeof props[key];
            if (key === 'as') {
                if (props[key] && valType !== 'string' && valType !== 'object') {
                    throw createPropError({
                        key,
                        expected: '`string` or `object`',
                        actual: valType
                    });
                }
            } else if (key === 'onClick' || key === 'onMouseEnter' || key === 'onTouchStart' || key === 'onNavigate') {
                if (props[key] && valType !== 'function') {
                    throw createPropError({
                        key,
                        expected: '`function`',
                        actual: valType
                    });
                }
            } else if (key === 'replace' || key === 'scroll' || key === 'shallow' || key === 'passHref' || key === 'legacyBehavior' || key === 'unstable_dynamicOnHover') {
                if (props[key] != null && valType !== 'boolean') {
                    throw createPropError({
                        key,
                        expected: '`boolean`',
                        actual: valType
                    });
                }
            } else if (key === 'prefetch') {
                if (props[key] != null && valType !== 'boolean' && props[key] !== 'auto') {
                    throw createPropError({
                        key,
                        expected: '`boolean | "auto"`',
                        actual: valType
                    });
                }
            } else if (key === 'transitionTypes') {
                if (props[key] != null && !Array.isArray(props[key])) {
                    throw createPropError({
                        key,
                        expected: '`string[]`',
                        actual: valType
                    });
                }
            } else {
                // TypeScript trick for type-guarding:
                const _ = key;
            }
        });
    }
    const resolvedHref = asProp || hrefProp;
    const formattedHref = formatStringOrUrl(resolvedHref);
    if ("TURBOPACK compile-time truthy", 1) {
        const { warnOnce } = __turbopack_context__.r("[project]/web/node_modules/next/dist/shared/lib/utils/warn-once.js [app-client] (ecmascript)");
        if (props.locale) {
            warnOnce('The `locale` prop is not supported in `next/link` while using the `app` router. Read more about app router internalization: https://nextjs.org/docs/app/building-your-application/routing/internationalization');
        }
        if (!asProp) {
            let href;
            if (typeof resolvedHref === 'string') {
                href = resolvedHref;
            } else if (typeof resolvedHref === 'object' && typeof resolvedHref.pathname === 'string') {
                href = resolvedHref.pathname;
            }
            if (href) {
                const hasDynamicSegment = href.split('/').some((segment)=>segment.startsWith('[') && segment.endsWith(']'));
                if (hasDynamicSegment) {
                    throw new Error(`Dynamic href \`${href}\` found in <Link> while using the \`/app\` router, this is not supported. Read more: https://nextjs.org/docs/messages/app-dir-dynamic-href`);
                }
            }
        }
    }
    // This will return the first child, if multiple are provided it will throw an error
    let child;
    if (legacyBehavior) {
        if (children?.$$typeof === Symbol.for('react.lazy')) {
            throw new Error(`\`<Link legacyBehavior>\` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's \`<a>\` tag.`);
        }
        if ("TURBOPACK compile-time truthy", 1) {
            if (onClick) {
                console.warn(`"onClick" was passed to <Link> with \`href\` of \`${formattedHref}\` but "legacyBehavior" was set. The legacy behavior requires onClick be set on the child of next/link`);
            }
            if (onMouseEnterProp) {
                console.warn(`"onMouseEnter" was passed to <Link> with \`href\` of \`${formattedHref}\` but "legacyBehavior" was set. The legacy behavior requires onMouseEnter be set on the child of next/link`);
            }
            try {
                child = _react.default.Children.only(children);
            } catch (err) {
                if (!children) {
                    throw new Error(`No children were passed to <Link> with \`href\` of \`${formattedHref}\` but one child is required https://nextjs.org/docs/messages/link-no-children`);
                }
                throw new Error(`Multiple children were passed to <Link> with \`href\` of \`${formattedHref}\` but only one child is supported https://nextjs.org/docs/messages/link-multiple-children` + (typeof window !== 'undefined' ? " \nOpen your browser's console to view the Component stack trace." : ''));
            }
        } else //TURBOPACK unreachable
        ;
    } else {
        if ("TURBOPACK compile-time truthy", 1) {
            if (children?.type === 'a') {
                throw new Error('Invalid <Link> with <a> child. Please remove <a> or use <Link legacyBehavior>.\nLearn more: https://nextjs.org/docs/messages/invalid-new-link-with-extra-anchor');
            }
        }
    }
    const childRef = legacyBehavior ? child && typeof child === 'object' && child.ref : forwardedRef;
    // Capture the Owner Stack during render so dev-only warnings emitted later
    // at navigation time can be associated with the JSX that created
    // this <Link>.
    const ownerStack = ("TURBOPACK compile-time truthy", 1) ? _react.default.useMemo({
        "LinkComponent.useMemo": ()=>{
            // Only capture when a warning might actually need it. Otherwise leave
            // it `undefined` so consumers can detect the opt-out and degrade
            // gracefully.
            if (fetchStrategy === _types.FetchStrategy.Full) {
                return _react.default.captureOwnerStack();
            }
            return undefined;
        }
    }["LinkComponent.useMemo"], [
        fetchStrategy
    ]) : "TURBOPACK unreachable";
    // Use a callback ref to attach an IntersectionObserver to the anchor tag on
    // mount. In the future we will also use this to keep track of all the
    // currently mounted <Link> instances, e.g. so we can re-prefetch them after
    // a revalidation or refresh.
    const observeLinkVisibilityOnMount = _react.default.useCallback({
        "LinkComponent.useCallback[observeLinkVisibilityOnMount]": (element)=>{
            if (router !== null) {
                linkInstanceRef.current = (0, _links.mountLinkInstance)(element, formattedHref, router, fetchStrategy, prefetchEnabled, setOptimisticLinkStatus, ownerStack);
            }
            return ({
                "LinkComponent.useCallback[observeLinkVisibilityOnMount]": ()=>{
                    if (linkInstanceRef.current) {
                        (0, _links.unmountLinkForCurrentNavigation)(linkInstanceRef.current);
                        linkInstanceRef.current = null;
                    }
                    (0, _links.unmountPrefetchableInstance)(element);
                }
            })["LinkComponent.useCallback[observeLinkVisibilityOnMount]"];
        }
    }["LinkComponent.useCallback[observeLinkVisibilityOnMount]"], [
        prefetchEnabled,
        formattedHref,
        router,
        fetchStrategy,
        setOptimisticLinkStatus,
        ownerStack
    ]);
    const mergedRef = (0, _usemergedref.useMergedRef)(observeLinkVisibilityOnMount, childRef);
    const childProps = {
        ref: mergedRef,
        onClick (e) {
            if ("TURBOPACK compile-time truthy", 1) {
                if (!e) {
                    throw new Error(`Component rendered inside next/link has to pass click event to "onClick" prop.`);
                }
            }
            if (!legacyBehavior && typeof onClick === 'function') {
                onClick(e);
            }
            if (legacyBehavior && child.props && typeof child.props.onClick === 'function') {
                child.props.onClick(e);
            }
            if (!router) {
                return;
            }
            if (e.defaultPrevented) {
                return;
            }
            linkClicked(e, formattedHref, linkInstanceRef, replace, scroll, onNavigate, transitionTypes, prefetchIntent);
        },
        onMouseEnter (e) {
            if (!legacyBehavior && typeof onMouseEnterProp === 'function') {
                onMouseEnterProp(e);
            }
            if (legacyBehavior && child.props && typeof child.props.onMouseEnter === 'function') {
                child.props.onMouseEnter(e);
            }
            if (!router) {
                return;
            }
            if ("TURBOPACK compile-time truthy", 1) {
                return;
            }
            //TURBOPACK unreachable
            ;
            const upgradeToDynamicPrefetch = undefined;
        },
        onTouchStart: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : function onTouchStart(e) {
            if (!legacyBehavior && typeof onTouchStartProp === 'function') {
                onTouchStartProp(e);
            }
            if (legacyBehavior && child.props && typeof child.props.onTouchStart === 'function') {
                child.props.onTouchStart(e);
            }
            if (!router) {
                return;
            }
            if (!prefetchEnabled) {
                return;
            }
            const upgradeToDynamicPrefetch = unstable_dynamicOnHover === true;
            (0, _links.onNavigationIntent)(e.currentTarget, upgradeToDynamicPrefetch);
        }
    };
    // If the url is absolute, we can bypass the logic to prepend the basePath.
    if ((0, _utils.isAbsoluteUrl)(formattedHref)) {
        childProps.href = formattedHref;
    } else if (!legacyBehavior || passHref || child.type === 'a' && !('href' in child.props)) {
        childProps.href = (0, _addbasepath.addBasePath)(formattedHref);
    }
    let link;
    if (legacyBehavior) {
        if ("TURBOPACK compile-time truthy", 1) {
            const { errorOnce } = __turbopack_context__.r("[project]/web/node_modules/next/dist/shared/lib/utils/error-once.js [app-client] (ecmascript)");
            errorOnce('`legacyBehavior` is deprecated and will be removed in a future ' + 'release. A codemod is available to upgrade your components:\n\n' + 'npx @next/codemod@latest new-link .\n\n' + 'Learn more: https://nextjs.org/docs/app/building-your-application/upgrading/codemods#remove-a-tags-from-link-components');
        }
        link = /*#__PURE__*/ _react.default.cloneElement(child, childProps);
    } else {
        link = /*#__PURE__*/ (0, _jsxruntime.jsx)("a", {
            ...restProps,
            ...childProps,
            children: children
        });
    }
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(LinkStatusContext.Provider, {
        value: linkStatus,
        children: link
    });
}
const LinkStatusContext = /*#__PURE__*/ (0, _react.createContext)(_links.IDLE_LINK_STATUS);
const useLinkStatus = ()=>{
    return (0, _react.useContext)(LinkStatusContext);
};
function getFetchStrategyFromPrefetchIntent(prefetchIntent) {
    if ("TURBOPACK compile-time truthy", 1) {
        if (prefetchIntent === 'full') {
            return _types.FetchStrategy.Full;
        }
        // `"auto"`: the default mode, where we will prefetch partially if the link is in the viewport.
        prefetchIntent;
        return _types.FetchStrategy.PPR;
    } else //TURBOPACK unreachable
    ;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/web/node_modules/next/dist/client/compat/router.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useRouter", {
    enumerable: true,
    get: function() {
        return useRouter;
    }
});
const _react = __turbopack_context__.r("[project]/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
const _routercontextsharedruntime = __turbopack_context__.r("[project]/web/node_modules/next/dist/shared/lib/router-context.shared-runtime.js [app-client] (ecmascript)");
function useRouter() {
    return (0, _react.useContext)(_routercontextsharedruntime.RouterContext);
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/web/node_modules/next/dist/client/use-merged-ref.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useMergedRef", {
    enumerable: true,
    get: function() {
        return useMergedRef;
    }
});
const _react = __turbopack_context__.r("[project]/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
function useMergedRef(refA, refB) {
    const cleanupA = (0, _react.useRef)(null);
    const cleanupB = (0, _react.useRef)(null);
    // NOTE: In theory, we could skip the wrapping if only one of the refs is non-null.
    // (this happens often if the user doesn't pass a ref to Link/Form/Image)
    // But this can cause us to leak a cleanup-ref into user code (previously via `<Link legacyBehavior>`),
    // and the user might pass that ref into ref-merging library that doesn't support cleanup refs
    // (because it hasn't been updated for React 19)
    // which can then cause things to blow up, because a cleanup-returning ref gets called with `null`.
    // So in practice, it's safer to be defensive and always wrap the ref, even on React 19.
    return (0, _react.useCallback)((current)=>{
        if (current === null) {
            const cleanupFnA = cleanupA.current;
            if (cleanupFnA) {
                cleanupA.current = null;
                cleanupFnA();
            }
            const cleanupFnB = cleanupB.current;
            if (cleanupFnB) {
                cleanupB.current = null;
                cleanupFnB();
            }
        } else {
            if (refA) {
                cleanupA.current = applyRef(refA, current);
            }
            if (refB) {
                cleanupB.current = applyRef(refB, current);
            }
        }
    }, [
        refA,
        refB
    ]);
}
function applyRef(refA, current) {
    if (typeof refA === 'function') {
        const cleanup = refA(current);
        if (typeof cleanup === 'function') {
            return cleanup;
        } else {
            return ()=>refA(null);
        }
    } else {
        refA.current = current;
        return ()=>{
            refA.current = null;
        };
    }
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/web/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/web/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/web/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/web/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
"[project]/web/node_modules/next/dist/shared/lib/router-context.shared-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/web/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RouterContext", {
    enumerable: true,
    get: function() {
        return RouterContext;
    }
});
const _interop_require_default = __turbopack_context__.r("[project]/web/node_modules/@swc/helpers/cjs/_interop_require_default.cjs [app-client] (ecmascript)");
const _react = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r("[project]/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"));
const RouterContext = _react.default.createContext(null);
if ("TURBOPACK compile-time truthy", 1) {
    RouterContext.displayName = 'RouterContext';
}
}),
"[project]/web/node_modules/next/dist/shared/lib/router/utils/format-url.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/web/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
// Format function modified from nodejs
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    formatUrl: null,
    formatWithValidation: null,
    urlObjectKeys: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    formatUrl: function() {
        return formatUrl;
    },
    formatWithValidation: function() {
        return formatWithValidation;
    },
    urlObjectKeys: function() {
        return urlObjectKeys;
    }
});
const _interop_require_wildcard = __turbopack_context__.r("[project]/web/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs [app-client] (ecmascript)");
const _querystring = /*#__PURE__*/ _interop_require_wildcard._(__turbopack_context__.r("[project]/web/node_modules/next/dist/shared/lib/router/utils/querystring.js [app-client] (ecmascript)"));
const slashedProtocols = /https?|ftp|gopher|file/;
function formatUrl(urlObj) {
    let { auth, hostname } = urlObj;
    let protocol = urlObj.protocol || '';
    let pathname = urlObj.pathname || '';
    let hash = urlObj.hash || '';
    let query = urlObj.query || '';
    let host = false;
    auth = auth ? encodeURIComponent(auth).replace(/%3A/i, ':') + '@' : '';
    if (urlObj.host) {
        host = auth + urlObj.host;
    } else if (hostname) {
        host = auth + (~hostname.indexOf(':') ? `[${hostname}]` : hostname);
        if (urlObj.port) {
            host += ':' + urlObj.port;
        }
    }
    if (query && typeof query === 'object') {
        query = String(_querystring.urlQueryToSearchParams(query));
    }
    let search = urlObj.search || query && `?${query}` || '';
    if (protocol && !protocol.endsWith(':')) protocol += ':';
    if (urlObj.slashes || (!protocol || slashedProtocols.test(protocol)) && host !== false) {
        host = '//' + (host || '');
        if (pathname && pathname[0] !== '/') pathname = '/' + pathname;
    } else if (!host) {
        host = '';
    }
    if (hash && hash[0] !== '#') hash = '#' + hash;
    if (search && search[0] !== '?') search = '?' + search;
    pathname = pathname.replace(/[?#]/g, encodeURIComponent);
    search = search.replace('#', '%23');
    return `${protocol}${host}${pathname}${search}${hash}`;
}
const urlObjectKeys = [
    'auth',
    'hash',
    'host',
    'hostname',
    'href',
    'path',
    'pathname',
    'port',
    'protocol',
    'query',
    'search',
    'slashes'
];
function formatWithValidation(url) {
    if ("TURBOPACK compile-time truthy", 1) {
        if (url !== null && typeof url === 'object') {
            Object.keys(url).forEach((key)=>{
                if (!urlObjectKeys.includes(key)) {
                    console.warn(`Unknown key passed via urlObject into url.format: ${key}`);
                }
            });
        }
    }
    return formatUrl(url);
}
}),
"[project]/web/node_modules/next/dist/shared/lib/router/utils/is-local-url.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isLocalURL", {
    enumerable: true,
    get: function() {
        return isLocalURL;
    }
});
const _utils = __turbopack_context__.r("[project]/web/node_modules/next/dist/shared/lib/utils.js [app-client] (ecmascript)");
const _hasbasepath = __turbopack_context__.r("[project]/web/node_modules/next/dist/client/has-base-path.js [app-client] (ecmascript)");
function isLocalURL(url) {
    // prevent a hydration mismatch on href for url with anchor refs
    if (!(0, _utils.isAbsoluteUrl)(url)) return true;
    try {
        // absolute urls can be local if they are on the same origin
        const locationOrigin = (0, _utils.getLocationOrigin)();
        const resolved = new URL(url, locationOrigin);
        return resolved.origin === locationOrigin && (0, _hasbasepath.hasBasePath)(resolved.pathname);
    } catch (_) {
        return false;
    }
}
}),
"[project]/web/node_modules/next/dist/shared/lib/utils.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/web/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    DecodeError: null,
    MiddlewareNotFoundError: null,
    MissingStaticPage: null,
    NormalizeError: null,
    PageNotFoundError: null,
    SP: null,
    ST: null,
    WEB_VITALS: null,
    execOnce: null,
    getDisplayName: null,
    getLocationOrigin: null,
    getURL: null,
    isAbsoluteUrl: null,
    isResSent: null,
    loadGetInitialProps: null,
    normalizeRepeatedSlashes: null,
    stringifyError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    DecodeError: function() {
        return DecodeError;
    },
    MiddlewareNotFoundError: function() {
        return MiddlewareNotFoundError;
    },
    MissingStaticPage: function() {
        return MissingStaticPage;
    },
    NormalizeError: function() {
        return NormalizeError;
    },
    PageNotFoundError: function() {
        return PageNotFoundError;
    },
    SP: function() {
        return SP;
    },
    ST: function() {
        return ST;
    },
    WEB_VITALS: function() {
        return WEB_VITALS;
    },
    execOnce: function() {
        return execOnce;
    },
    getDisplayName: function() {
        return getDisplayName;
    },
    getLocationOrigin: function() {
        return getLocationOrigin;
    },
    getURL: function() {
        return getURL;
    },
    isAbsoluteUrl: function() {
        return isAbsoluteUrl;
    },
    isResSent: function() {
        return isResSent;
    },
    loadGetInitialProps: function() {
        return loadGetInitialProps;
    },
    normalizeRepeatedSlashes: function() {
        return normalizeRepeatedSlashes;
    },
    stringifyError: function() {
        return stringifyError;
    }
});
const WEB_VITALS = [
    'CLS',
    'FCP',
    'INP',
    'LCP',
    'TTFB'
];
function execOnce(fn) {
    let used = false;
    let result;
    return (...args)=>{
        if (!used) {
            used = true;
            result = fn(...args);
        }
        return result;
    };
}
// Scheme: https://tools.ietf.org/html/rfc3986#section-3.1
// Absolute URL: https://tools.ietf.org/html/rfc3986#section-4.3
const ABSOLUTE_URL_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/;
const isAbsoluteUrl = (url)=>{
    // Fast path: an absolute URL must start with a letter (the scheme).
    // Check for a-z and A-Z without the cost of the regex.
    const c = url.charCodeAt(0);
    const isLetter = c >= 65 /* A */  && c <= 90 || c >= 97 /* a */  && c <= 122;
    /* z */ if (!isLetter) {
        return false;
    }
    return ABSOLUTE_URL_REGEX.test(url);
};
function getLocationOrigin() {
    const { protocol, hostname, port } = window.location;
    return `${protocol}//${hostname}${port ? ':' + port : ''}`;
}
function getURL() {
    const { href } = window.location;
    const origin = getLocationOrigin();
    return href.substring(origin.length);
}
function getDisplayName(Component) {
    return typeof Component === 'string' ? Component : Component.displayName || Component.name || 'Unknown';
}
function isResSent(res) {
    return res.finished || res.headersSent;
}
function normalizeRepeatedSlashes(url) {
    const urlParts = url.split('?');
    const urlNoQuery = urlParts[0];
    return urlNoQuery // first we replace any non-encoded backslashes with forward
    // then normalize repeated forward slashes
    .replace(/\\/g, '/').replace(/\/\/+/g, '/') + (urlParts[1] ? `?${urlParts.slice(1).join('?')}` : '');
}
async function loadGetInitialProps(App, ctx) {
    if ("TURBOPACK compile-time truthy", 1) {
        if (App.prototype?.getInitialProps) {
            const message = `"${getDisplayName(App)}.getInitialProps()" is defined as an instance method - visit https://nextjs.org/docs/messages/get-initial-props-as-an-instance-method for more information.`;
            throw new Error(message);
        }
    }
    // when called from _app `ctx` is nested in `ctx`
    const res = ctx.res || ctx.ctx && ctx.ctx.res;
    if (!App.getInitialProps) {
        if (ctx.ctx && ctx.Component) {
            // @ts-ignore pageProps default
            return {
                pageProps: await loadGetInitialProps(ctx.Component, ctx.ctx)
            };
        }
        return {};
    }
    const props = await App.getInitialProps(ctx);
    if (res && isResSent(res)) {
        return props;
    }
    if (!props) {
        const message = `"${getDisplayName(App)}.getInitialProps()" should resolve to an object. But found "${props}" instead.`;
        throw new Error(message);
    }
    if ("TURBOPACK compile-time truthy", 1) {
        if (Object.keys(props).length === 0 && !ctx.ctx) {
            console.warn(`${getDisplayName(App)} returned an empty object from \`getInitialProps\`. This de-optimizes and prevents automatic static optimization. https://nextjs.org/docs/messages/empty-object-getInitialProps`);
        }
    }
    return props;
}
const SP = typeof performance !== 'undefined';
const ST = SP && [
    'mark',
    'measure',
    'getEntriesByName'
].every((method)=>typeof performance[method] === 'function');
class DecodeError extends Error {
}
class NormalizeError extends Error {
}
class PageNotFoundError extends Error {
    constructor(page){
        super();
        this.code = 'ENOENT';
        this.name = 'PageNotFoundError';
        this.message = `Cannot find module for page: ${page}`;
    }
}
class MissingStaticPage extends Error {
    constructor(page, message){
        super();
        this.message = `Failed to load static file for page: ${page} ${message}`;
    }
}
class MiddlewareNotFoundError extends Error {
    constructor(){
        super();
        this.code = 'ENOENT';
        this.message = `Cannot find the middleware module`;
    }
}
function stringifyError(error) {
    return JSON.stringify({
        message: error.message,
        stack: error.stack
    });
}
}),
"[project]/web/node_modules/next/dist/shared/lib/utils/error-once.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/web/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "errorOnce", {
    enumerable: true,
    get: function() {
        return errorOnce;
    }
});
let errorOnce = (_)=>{};
if ("TURBOPACK compile-time truthy", 1) {
    const errors = new Set();
    errorOnce = (msg)=>{
        if (!errors.has(msg)) {
            console.error(msg);
        }
        errors.add(msg);
    };
}
}),
"[project]/web/node_modules/swr/dist/_internal/constants.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "INFINITE_PREFIX",
    ()=>INFINITE_PREFIX
]);
const INFINITE_PREFIX = '$inf$';
;
}),
"[project]/web/node_modules/swr/dist/_internal/index.mjs [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/swr/dist/config-context-ext53wcz.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$_internal$2f$constants$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/swr/dist/_internal/constants.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
;
;
;
// @ts-expect-error
const enableDevtools = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["p"] && window.__SWR_DEVTOOLS_USE__;
const use = enableDevtools ? window.__SWR_DEVTOOLS_USE__ : [];
const setupDevTools = ()=>{
    if (enableDevtools) {
        // @ts-expect-error
        window.__SWR_DEVTOOLS_REACT__ = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"];
    }
};
const normalize = (args)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["e"])(args[1]) ? [
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
    const parentConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["q"]);
    const mergedConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useSWRConfig.useMemo[mergedConfig]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["m"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["d"], parentConfig)
    }["useSWRConfig.useMemo[mergedConfig]"], [
        parentConfig
    ]);
    return mergedConfig;
};
const preload = (key_, fetcher)=>{
    // preload should be a no-op on the server
    if (__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["I"]) {
        return undefined;
    }
    const [key, fnArg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["s"])(key_);
    const [, , , PRELOAD] = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["a"].get(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["o"]);
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
            const [key] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["s"])(key_);
            const [, , , PRELOAD] = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["a"].get(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["o"]);
            if (key.startsWith(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$_internal$2f$constants$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INFINITE_PREFIX"])) {
                // we want the infinite fetcher to be called.
                // handling of the PRELOAD cache happens there.
                return fetcher_(...args);
            }
            const req = PRELOAD[key];
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])(req)) return fetcher_(...args);
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
        const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"])(fallbackConfig, _config);
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
"[project]/web/node_modules/swr/dist/config-context-ext53wcz.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$dequal$2f$lite$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/dequal/lite/index.mjs [app-client] (ecmascript)");
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
const isWindowDefined = typeof window != STR_UNDEFINED;
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
const [onWindowEvent, offWindowEvent] = isWindowDefined && window.addEventListener ? [
    window.addEventListener.bind(window),
    window.removeEventListener.bind(window)
] : [
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
const IS_REACT_LEGACY = !__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useId;
const IS_SERVER = !isWindowDefined || isLegacyDeno;
// Polyfill requestAnimationFrame
const rAF = (f)=>hasRequestAnimationFrame() ? window['requestAnimationFrame'](f) : setTimeout(f, 1);
// React currently throws a warning when using useLayoutEffect on the server.
// To get around it, we can conditionally useEffect on the server (no-op) and
// useLayoutEffect in the browser.
const useIsomorphicLayoutEffect = IS_SERVER ? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"] : __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"];
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
                if (!IS_SERVER) {
                    // When listening to the native events for auto revalidations,
                    // we intentionally put a delay (setTimeout) here to make sure they are
                    // fired after immediate JavaScript executions, which can be
                    // React's state updates.
                    // This avoids some unnecessary revalidations such as
                    // https://github.com/vercel/swr/issues/1680.
                    const releaseFocus = opts.initFocus(setTimeout.bind(UNDEFINED, revalidateAllKeys.bind(UNDEFINED, EVENT_REVALIDATORS, FOCUS_EVENT)));
                    const releaseReconnect = opts.initReconnect(setTimeout.bind(UNDEFINED, revalidateAllKeys.bind(UNDEFINED, EVENT_REVALIDATORS, RECONNECT_EVENT)));
                    unmount = ()=>{
                        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                        releaseFocus && releaseFocus();
                        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                        releaseReconnect && releaseReconnect();
                        // When un-mounting, we need to remove the cache provider from the state
                        // storage too because it's a side-effect. Otherwise, when re-mounting we
                        // will not re-register those event listeners.
                        SWRGlobalState.delete(provider);
                    };
                }
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
const compare = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$dequal$2f$lite$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dequal"];
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
    errorRetryInterval: slowConnection ? 10000 : 5000,
    focusThrottleInterval: 5 * 1000,
    dedupingInterval: 2 * 1000,
    loadingTimeout: slowConnection ? 5000 : 3000,
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
const SWRConfigContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])({});
const SWRConfig = (props)=>{
    const { value } = props;
    const parentConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(SWRConfigContext);
    const isFunctionalConfig = isFunction(value);
    const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SWRConfig.useMemo[config]": ()=>isFunctionalConfig ? value(parentConfig) : value
    }["SWRConfig.useMemo[config]"], [
        isFunctionalConfig,
        parentConfig,
        value
    ]);
    // Extend parent context values and middleware.
    const extendedConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SWRConfig.useMemo[extendedConfig]": ()=>isFunctionalConfig ? config : mergeConfigs(parentConfig, config)
    }["SWRConfig.useMemo[extendedConfig]"], [
        isFunctionalConfig,
        parentConfig,
        config
    ]);
    // Should not use the inherited provider.
    const provider = config && config.provider;
    // initialize the cache only on first access.
    const cacheContextRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(UNDEFINED);
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
    useIsomorphicLayoutEffect({
        "SWRConfig.useIsomorphicLayoutEffect": ()=>{
            if (cacheContext) {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                cacheContext[2] && cacheContext[2]();
                return cacheContext[3];
            }
        }
    }["SWRConfig.useIsomorphicLayoutEffect"], []);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])(SWRConfigContext.Provider, mergeObjects(props, {
        value: extendedConfig
    }));
};
;
}),
"[project]/web/node_modules/swr/dist/use-swr-emll9s78.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "S",
    ()=>SWRConfig,
    "u",
    ()=>useSWR
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$use$2d$sync$2d$external$2d$store$2f$shim$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/use-sync-external-store/shim/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$_internal$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/swr/dist/_internal/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/swr/dist/config-context-ext53wcz.mjs [app-client] (ecmascript)");
;
;
;
;
/// <reference types="react/experimental" />
const use = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].use || // This extra generic is to avoid TypeScript mixing up the generic and JSX sytax
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
        if (canCommit() && (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])(getCacheData())) {
            setCache(state);
        }
    };
    Promise.resolve(value).then((data)=>{
        commit({
            data,
            error: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["U"]
        });
    }, (error)=>{
        commit({
            error
        });
    });
};
// React can only unwrap a thenable synchronously when it has React's thenable
// status fields, so this fulfilled no-op keeps Suspense paths from waiting.
const resolvedUndef = Promise.resolve(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["U"]);
// @ts-ignore modify react promise status
resolvedUndef.status = 'fulfilled';
// @ts-ignore modify react promise value
resolvedUndef.value = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["U"];
const sub = ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["n"];
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
    const [EVENT_REVALIDATORS, MUTATION, FETCH, PRELOAD] = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["a"].get(cache);
    // `key` is the identifier of the SWR internal state,
    // `fnArg` is the argument/arguments parsed from the key, which will be passed
    // to the fetcher.
    // All of them are derived from `_key`.
    const [key, fnArg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["s"])(_key);
    // If it's the initial render of this hook.
    const initialMountedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    // If the hook is unmounted already. This will be used to prevent some effects
    // to be called after unmounting.
    const unmountedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    // Refs to keep the key and config.
    const keyRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(key);
    const fetcherRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(fetcher);
    const configRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(config);
    const getConfig = ()=>configRef.current;
    const isActive = ()=>getConfig().isVisible() && getConfig().isOnline();
    const [getCache, setCache, subscribeCache, getInitialCache] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(cache, key);
    const stateDependencies = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({}).current;
    // Resolve the fallback data from either the inline option, or the global provider.
    // If it's a promise, we simply let React suspend and resolve it for us.
    const fallback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])(fallbackData) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])(config.fallback) ? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["U"] : config.fallback[key] : fallbackData;
    const serverCacheData = config.cacheData;
    const configCacheData = !key ? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["U"] : serverCacheData == null ? void 0 : serverCacheData[key];
    const req = key ? PRELOAD[key] : __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["U"];
    // `cacheData` is request-scoped data provided by a Server Component through
    // `SWRConfig`'s context. It's only used when there's no in-flight client
    // `preload()` response (`req`) for the same key.
    const hasCacheData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])(req) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])(configCacheData);
    const preloadedData = hasCacheData ? configCacheData : req;
    const isEqual = (prev, current)=>{
        for(const _ in stateDependencies){
            const t = _;
            if (t === 'data') {
                if (!compare(prev[t], current[t])) {
                    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])(prev[t])) {
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
    const getSnapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useSWRHandler.useMemo[getSnapshot]": ()=>{
            const cachedData = getCache();
            const initialData = getInitialCache();
            const getSelectedCache = {
                "useSWRHandler.useMemo[getSnapshot].getSelectedCache": (state)=>{
                    // We only select the needed fields from the state.
                    const snapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["m"])(state);
                    delete snapshot._k;
                    const shouldStartRequest = ({
                        "useSWRHandler.useMemo[getSnapshot].getSelectedCache.shouldStartRequest": ()=>{
                            if (!key) return false;
                            if (!fetcher) return false;
                            // If it's paused, we skip revalidation.
                            if (getConfig().isPaused()) return false;
                            // If `revalidateOnMount` is set, we take the value directly.
                            if (isInitialMount && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])(revalidateOnMount)) return revalidateOnMount;
                            const data = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])(fallback) ? fallback : snapshot.data;
                            // cacheData is consumed during the initial Suspense render. Once data
                            // is cached, fall through to the normal mount revalidation policy.
                            if (suspense && hasCacheData && (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])(data)) return false;
                            if (suspense) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])(data) || revalidateIfStale;
                            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])(data) || revalidateIfStale;
                        }
                    })["useSWRHandler.useMemo[getSnapshot].getSelectedCache.shouldStartRequest"]();
                    if (!shouldStartRequest) {
                        return snapshot;
                    }
                    return {
                        isValidating: true,
                        isLoading: true,
                        ...snapshot
                    };
                }
            }["useSWRHandler.useMemo[getSnapshot].getSelectedCache"];
            const clientSnapshot = getSelectedCache(cachedData);
            const serverSnapshot = cachedData === initialData ? clientSnapshot : getSelectedCache(initialData);
            // To make sure that we are returning the same object reference to avoid
            // unnecessary re-renders, we keep the previous snapshot and use deep
            // comparison to check if we need to return a new one.
            let memorizedSnapshot = clientSnapshot;
            return [
                {
                    "useSWRHandler.useMemo[getSnapshot]": ()=>{
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
                    }
                }["useSWRHandler.useMemo[getSnapshot]"],
                {
                    "useSWRHandler.useMemo[getSnapshot]": ()=>serverSnapshot
                }["useSWRHandler.useMemo[getSnapshot]"]
            ];
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["useSWRHandler.useMemo[getSnapshot]"], [
        cache,
        key
    ]);
    // Get the current state that SWR should return.
    const cached = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$use$2d$sync$2d$external$2d$store$2f$shim$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSWRHandler.useSyncExternalStore[cached]": (callback)=>subscribeCache(key, {
                "useSWRHandler.useSyncExternalStore[cached]": (current, prev)=>{
                    if (!isEqual(prev, current)) callback();
                }
            }["useSWRHandler.useSyncExternalStore[cached]"])
    }["useSWRHandler.useSyncExternalStore[cached]"], [
        cache,
        key
    ]), getSnapshot[0], getSnapshot[1]);
    const hasRevalidator = EVENT_REVALIDATORS[key] && EVENT_REVALIDATORS[key].length > 0;
    const cachedData = cached.data;
    let data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])(cachedData) ? fallback && (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["b"])(fallback) ? use(fallback) : fallback : cachedData;
    const error = cached.error;
    // Use a ref to store previously returned data. Use the initial data as its initial value.
    const laggyDataRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(data);
    const consumedCacheDataRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["U"]);
    let consumedCacheData = consumedCacheDataRef.current;
    if (!consumedCacheData) {
        consumedCacheData = new WeakMap();
        consumedCacheDataRef.current = consumedCacheData;
    }
    const preloadCacheRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    let returnedData = keepPreviousData ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])(cachedData) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])(laggyDataRef.current) ? data : laggyDataRef.current : cachedData : data;
    const hasKeyButNoData = key && (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])(data);
    const hydrationRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Note: the conditionally hook call is fine because the environment
    // `IS_SERVER` never changes.
    // @ts-expect-error -- use hydrationRef directly
    !__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["I"] && // getServerSnapshot is only called during hydration
    // eslint-disable-next-line react-hooks/rules-of-hooks
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$use$2d$sync$2d$external$2d$store$2f$shim$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(sub, {
        "useSWRHandler.useSyncExternalStore": ()=>{
            hydrationRef.current = false;
            return hydrationRef;
        }
    }["useSWRHandler.useSyncExternalStore"], {
        "useSWRHandler.useSyncExternalStore": ()=>{
            hydrationRef.current = true;
            return hydrationRef;
        }
    }["useSWRHandler.useSyncExternalStore"]);
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
        if (hasRevalidator && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])(error)) return false;
        // If `revalidateOnMount` is set, we take the value directly.
        if (isInitialMount && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])(revalidateOnMount)) return revalidateOnMount;
        // cacheData satisfies the initial Suspense render without a duplicate
        // request. Cached data on a later mount follows revalidateIfStale.
        if (suspense && hasCacheData && hasKeyButNoData) return false;
        // Under suspense mode, it will always fetch on render if there is no
        // stale data so no need to revalidate immediately mount it again.
        // If data exists, only revalidate if `revalidateIfStale` is true.
        if (suspense) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])(data) ? false : revalidateIfStale;
        // If there is no stale data, we need to revalidate when mount;
        // If `revalidateIfStale` is set to true, we will always revalidate.
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])(data) || revalidateIfStale;
    })();
    const defaultValidatingState = isInitialMount && shouldDoInitialRevalidation;
    const isValidating = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])(cached.isValidating) ? defaultValidatingState : cached.isValidating;
    const isLoading = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])(cached.isLoading) ? defaultValidatingState : cached.isLoading;
    // The revalidation function is a carefully crafted wrapper of the original
    // `fetcher`, to correctly handle the many edge cases.
    const revalidate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSWRHandler.useCallback[revalidate]": async (revalidateOpts)=>{
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
            const shouldUseRSCPreload = hasCacheData && !isCacheDataConsumed(consumedCacheData, serverCacheData, key) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])(preloadedData) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])(getCache().data);
            /*
         For React 17
         Do unmount check for calls:
         If key has changed during the revalidation, or the component has been
         unmounted, old dispatch and old event callbacks should not take any
         effect

        For React 18
        only check if key has changed
        https://github.com/reactwg/react-18/discussions/82
      */ const callbackSafeguard = {
                "useSWRHandler.useCallback[revalidate].callbackSafeguard": ()=>{
                    if (__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["j"]) {
                        return !unmountedRef.current && key === keyRef.current && initialMountedRef.current;
                    }
                    return key === keyRef.current;
                }
            }["useSWRHandler.useCallback[revalidate].callbackSafeguard"];
            // The final state object when the request finishes.
            const finalState = {
                isValidating: false,
                isLoading: false
            };
            const finishRequestAndUpdateState = {
                "useSWRHandler.useCallback[revalidate].finishRequestAndUpdateState": ()=>{
                    setCache(finalState);
                }
            }["useSWRHandler.useCallback[revalidate].finishRequestAndUpdateState"];
            const cleanupState = {
                "useSWRHandler.useCallback[revalidate].cleanupState": ()=>{
                    // Check if it's still the same request before deleting it.
                    const requestInfo = FETCH[key];
                    if (requestInfo && requestInfo[1] === startAt) {
                        delete FETCH[key];
                    }
                }
            }["useSWRHandler.useCallback[revalidate].cleanupState"];
            // Start fetching. Change the `isValidating` state, update the cache.
            const initialState = {
                isValidating: true
            };
            // It is in the `isLoading` state, if and only if there is no cached data.
            // This bypasses fallback data and laggy data.
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])(getCache().data)) {
                initialState.isLoading = true;
            }
            try {
                if (shouldStartNewRequest) {
                    setCache(initialState);
                    // If no cache is being rendered currently (it shows a blank page),
                    // we trigger the loading slow event.
                    if (config.loadingTimeout && (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])(getCache().data)) {
                        setTimeout({
                            "useSWRHandler.useCallback[revalidate]": ()=>{
                                if (loading && callbackSafeguard()) {
                                    getConfig().onLoadingSlow(key, config);
                                }
                            }
                        }["useSWRHandler.useCallback[revalidate]"], config.loadingTimeout);
                    }
                    // Start the request and save the timestamp.
                    // Key must be truthy if entering here.
                    if (shouldUseRSCPreload) {
                        markCacheDataConsumed(consumedCacheData, serverCacheData, key);
                    }
                    FETCH[key] = [
                        shouldUseRSCPreload ? preloadedData : currentFetcher(fnArg),
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["g"])()
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
                finalState.error = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["U"];
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
                if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])(mutationInfo) && // case 1
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
                        if (shouldRetryOnError === true || (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["e"])(shouldRetryOnError) && shouldRetryOnError(err)) {
                            if (!getConfig().revalidateOnFocus || !getConfig().revalidateOnReconnect || isActive()) {
                                // If it's inactive, stop. It will auto-revalidate when
                                // refocusing or reconnecting.
                                // When retrying, deduplication is always enabled.
                                currentConfig.onErrorRetry(err, key, currentConfig, {
                                    "useSWRHandler.useCallback[revalidate]": (_opts)=>{
                                        const revalidators = EVENT_REVALIDATORS[key];
                                        if (revalidators && revalidators[0]) {
                                            revalidators[0](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["E"], _opts);
                                        }
                                    }
                                }["useSWRHandler.useCallback[revalidate]"], {
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
        }
    }["useSWRHandler.useCallback[revalidate]"], // `keyValidating` are depending on `key`, so we can exclude them from
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
    const boundMutate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSWRHandler.useCallback[boundMutate]": (...args)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["f"])(cache, keyRef.current, ...args);
        }
    }["useSWRHandler.useCallback[boundMutate]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["u"])({
        "useSWRHandler.useIsomorphicLayoutEffect": ()=>{
            const preloaded = preloadCacheRef.current;
            if (!preloaded) return;
            preloadCacheRef.current = null;
            markCacheDataConsumed(consumedCacheData, preloaded.cacheData, preloaded.key);
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])(getCache().data)) {
                setCache({
                    data: preloaded.data,
                    error: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["U"],
                    _k: preloaded._k
                });
            }
            if (PRELOAD[preloaded.key]) {
                delete PRELOAD[preloaded.key];
            }
        }
    }["useSWRHandler.useIsomorphicLayoutEffect"]);
    // The logic for updating refs.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["u"])({
        "useSWRHandler.useIsomorphicLayoutEffect": ()=>{
            fetcherRef.current = fetcher;
            configRef.current = config;
            // Handle laggy data updates. If there's cached data of the current key,
            // it'll be the correct reference.
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])(cachedData)) {
                laggyDataRef.current = cachedData;
            }
        }
    }["useSWRHandler.useIsomorphicLayoutEffect"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["u"])({
        "useSWRHandler.useIsomorphicLayoutEffect": ()=>{
            if (fetcher || !hasCacheData || (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])(preloadedData) || isCacheDataConsumed(consumedCacheData, serverCacheData, key) || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])(getCache().data)) {
                return;
            }
            markCacheDataConsumed(consumedCacheData, serverCacheData, key);
            const mutation = MUTATION[key];
            commitCacheData({
                value: preloadedData,
                getCacheData: {
                    "useSWRHandler.useIsomorphicLayoutEffect": ()=>getCache().data
                }["useSWRHandler.useIsomorphicLayoutEffect"],
                canCommit: {
                    "useSWRHandler.useIsomorphicLayoutEffect": ()=>!unmountedRef.current && key === keyRef.current && MUTATION[key] === mutation
                }["useSWRHandler.useIsomorphicLayoutEffect"],
                setCache: {
                    "useSWRHandler.useIsomorphicLayoutEffect": (state)=>setCache({
                            ...state,
                            _k: fnArg
                        })
                }["useSWRHandler.useIsomorphicLayoutEffect"]
            });
        }
    }["useSWRHandler.useIsomorphicLayoutEffect"]);
    // After mounted or key changed.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["u"])({
        "useSWRHandler.useIsomorphicLayoutEffect": ()=>{
            if (!key) return;
            const softRevalidate = revalidate.bind(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["U"], WITH_DEDUPE);
            let nextFocusRevalidatedAt = 0;
            if (getConfig().revalidateOnFocus) {
                const initNow = Date.now();
                nextFocusRevalidatedAt = initNow + getConfig().focusThrottleInterval;
            }
            // Expose revalidators to global event listeners. So we can trigger
            // revalidation from the outside.
            const onRevalidate = {
                "useSWRHandler.useIsomorphicLayoutEffect.onRevalidate": (type, opts = {})=>{
                    if (type == __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["F"]) {
                        const now = Date.now();
                        if (getConfig().revalidateOnFocus && now > nextFocusRevalidatedAt && isActive()) {
                            nextFocusRevalidatedAt = now + getConfig().focusThrottleInterval;
                            softRevalidate();
                        }
                    } else if (type == __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["R"]) {
                        if (getConfig().revalidateOnReconnect && isActive()) {
                            softRevalidate();
                        }
                    } else if (type == __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["M"]) {
                        return revalidate();
                    } else if (type == __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["E"]) {
                        return revalidate(opts);
                    } else if (type == __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["h"]) {
                        // The cache has been cleared: drop the previous data kept by
                        // `keepPreviousData` so it can't stay on screen.
                        laggyDataRef.current = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["U"];
                        if (opts.revalidate) {
                            return revalidate();
                        }
                    }
                    return;
                }
            }["useSWRHandler.useIsomorphicLayoutEffect.onRevalidate"];
            const unsubEvents = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$_internal$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["subscribeCallback"])(key, EVENT_REVALIDATORS, onRevalidate);
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
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])(data) || __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["I"]) {
                        // Revalidate immediately.
                        softRevalidate();
                    } else {
                        // Delay the revalidate if we have data to return so we won't block
                        // rendering.
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["r"])(softRevalidate);
                    }
                }
            }
            return ({
                "useSWRHandler.useIsomorphicLayoutEffect": ()=>{
                    // Mark it as unmounted.
                    unmountedRef.current = true;
                    unsubEvents();
                }
            })["useSWRHandler.useIsomorphicLayoutEffect"];
        }
    }["useSWRHandler.useIsomorphicLayoutEffect"], [
        key
    ]);
    // Polling
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["u"])({
        "useSWRHandler.useIsomorphicLayoutEffect": ()=>{
            let timer;
            function next() {
                // Use the passed interval
                // ...or invoke the function with the updated data to get the interval
                const interval = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["e"])(refreshInterval) ? refreshInterval(getCache().data) : refreshInterval;
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
            return ({
                "useSWRHandler.useIsomorphicLayoutEffect": ()=>{
                    if (timer) {
                        clearTimeout(timer);
                        timer = -1;
                    }
                }
            })["useSWRHandler.useIsomorphicLayoutEffect"];
        }
    }["useSWRHandler.useIsomorphicLayoutEffect"], [
        refreshInterval,
        refreshWhenHidden,
        refreshWhenOffline,
        key
    ]);
    // Display debug info in React DevTools.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDebugValue"])(returnedData);
    // In Suspense mode, we can't return the empty `data` state.
    // If there is an `error`, the `error` needs to be thrown to the error boundary.
    // If there is no `error`, the `revalidation` promise needs to be thrown to
    // the suspense boundary.
    if (suspense) {
        // SWR should throw when trying to use Suspense on the server with React 18,
        // without providing any fallback data. This causes hydration errors. See:
        // https://github.com/vercel/swr/issues/1832
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["j"] && __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["I"] && hasKeyButNoData && (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])(preloadedData)) {
            throw new Error('Fallback data is required when using Suspense in SSR.');
        }
        // Always update fetcher and config refs even with the Suspense mode.
        if (hasKeyButNoData) {
            fetcherRef.current = fetcher;
            configRef.current = config;
            unmountedRef.current = false;
        }
        const shouldConsumePreload = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])(preloadedData) && hasKeyButNoData;
        let preloadData = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["U"];
        if (shouldConsumePreload && hasCacheData) {
            preloadData = preloadedData && (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["b"])(preloadedData) ? use(preloadedData) : preloadedData;
            data = preloadData;
            returnedData = preloadData;
            if (!__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["I"]) {
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
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])(error) && hasKeyButNoData) {
            throw error;
        }
        const revalidation = hasKeyButNoData && (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])(preloadData) ? revalidate(WITH_DEDUPE) : resolvedUndef;
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])(returnedData) && hasKeyButNoData) {
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
const SWRConfig = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["O"].defineProperty(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["S"], 'defaultValue', {
    value: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$config$2d$context$2d$ext53wcz$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["d"]
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
 */ const useSWR = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$_internal$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["withArgs"])(useSWRHandler);
;
}),
"[project]/web/node_modules/swr/dist/use-swr-emll9s78.mjs [app-client] (ecmascript) <export S as SWRConfig>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SWRConfig",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$use$2d$swr$2d$emll9s78$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["S"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$use$2d$swr$2d$emll9s78$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/swr/dist/use-swr-emll9s78.mjs [app-client] (ecmascript)");
}),
"[project]/web/node_modules/swr/dist/use-swr-emll9s78.mjs [app-client] (ecmascript) <export u as default>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$use$2d$swr$2d$emll9s78$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["u"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$use$2d$swr$2d$emll9s78$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/swr/dist/use-swr-emll9s78.mjs [app-client] (ecmascript)");
}),
"[project]/web/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/web/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * use-sync-external-store-shim.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
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
        useLayoutEffect({
            "useSyncExternalStore$2.useLayoutEffect": function() {
                inst.value = value;
                inst.getSnapshot = getSnapshot;
                checkIfSnapshotChanged(inst) && forceUpdate({
                    inst: inst
                });
            }
        }["useSyncExternalStore$2.useLayoutEffect"], [
            subscribe,
            value,
            getSnapshot
        ]);
        useEffect({
            "useSyncExternalStore$2.useEffect": function() {
                checkIfSnapshotChanged(inst) && forceUpdate({
                    inst: inst
                });
                return subscribe({
                    "useSyncExternalStore$2.useEffect": function() {
                        checkIfSnapshotChanged(inst) && forceUpdate({
                            inst: inst
                        });
                    }
                }["useSyncExternalStore$2.useEffect"]);
            }
        }["useSyncExternalStore$2.useEffect"], [
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
    var React = __turbopack_context__.r("[project]/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), objectIs = "function" === typeof Object.is ? Object.is : is, useState = React.useState, useEffect = React.useEffect, useLayoutEffect = React.useLayoutEffect, useDebugValue = React.useDebugValue, didWarnOld18Alpha = !1, didWarnUncachedGetSnapshot = !1, shim = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? useSyncExternalStore$1 : useSyncExternalStore$2;
    exports.useSyncExternalStore = void 0 !== React.useSyncExternalStore ? React.useSyncExternalStore : shim;
    "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
}();
}),
"[project]/web/node_modules/use-sync-external-store/shim/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/web/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/web/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js [app-client] (ecmascript)");
}
}),
]})(),
"[project]/web/node_modules/next/compat/router.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/web/node_modules/next/dist/client/compat/router.js [app-client] (ecmascript)");
}),
"[project]/web/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/web/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=0aq__1ls61-mdi919y._.js.map