(()=>{"use strict";module.exports = [
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/helpers/get-access-token.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAccessToken",
    ()=>getAccessToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/oauth-errors.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/mfa-errors.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/pathUtils.js [app-ssr] (ecmascript)");
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
    let url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(options.route || process.env.NEXT_PUBLIC_ACCESS_TOKEN_ROUTE || "/auth/access-token");
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
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MfaRequiredError"](accessTokenError.error_description || "Multi-factor authentication is required.", accessTokenError.mfa_token || "", accessTokenError.mfa_requirements, undefined);
        }
        // Standard error format: { error: { code, message } }
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AccessTokenError"](accessTokenError.error?.code || accessTokenError.error, accessTokenError.error?.message || accessTokenError.error_description);
    }
    const tokenSet = await tokenRes.json();
    return options.includeFullResponse ? tokenSet : tokenSet.token;
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/helpers/start-enterprise-login.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "startEnterpriseLogin",
    ()=>startEnterpriseLogin
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/pathUtils.js [app-ssr] (ecmascript)");
;
async function startEnterpriseLogin(options) {
    const { email, authorizationParameters } = options;
    const federatedDomainRoute = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(options.federatedDomainRoute || process.env.NEXT_PUBLIC_FEDERATED_DOMAIN_ROUTE || "/auth/federated-domain");
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
    const loginRoute = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(options.loginRoute || process.env.NEXT_PUBLIC_LOGIN_ROUTE || "/auth/login");
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
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/helpers/with-page-auth-required.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "withPageAuthRequired",
    ()=>withPageAuthRequired
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$compat$2f$router$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/compat/router.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/pathUtils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$hooks$2f$use$2d$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/hooks/use-user.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const defaultOnRedirecting = ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Fragment, null);
const defaultOnError = ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Fragment, null);
const withPageAuthRequired = (Component, options = {})=>{
    return function WithPageAuthRequired(props) {
        const { returnTo, onRedirecting = defaultOnRedirecting, onError = defaultOnError } = options;
        const loginUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(process.env.NEXT_PUBLIC_LOGIN_ROUTE || "/auth/login");
        const { user, error, isLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$hooks$2f$use$2d$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUser"])();
        const pagesRouter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$compat$2f$router$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
        const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
        }, [
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
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(Component, {
                ...componentProps
            });
        }
        return onRedirecting();
    };
};
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/hooks/use-anonymous-session.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAnonymousSession",
    ()=>useAnonymousSession
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$use$2d$swr$2d$emll9s78$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__u__as__default$3e$__ = __turbopack_context__.i("[project]/web/node_modules/swr/dist/use-swr-emll9s78.mjs [app-ssr] (ecmascript) <export u as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/pathUtils.js [app-ssr] (ecmascript)");
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
    const route = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(options.route || process.env.NEXT_PUBLIC_ANONYMOUS_SESSION_ROUTE || "/auth/anonymous-session");
    // Fetch via SWR with standard error handling
    const { data, error, isLoading, mutate } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$use$2d$swr$2d$emll9s78$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__u__as__default$3e$__["default"])(route, fetchAnonymousSession);
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
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/hooks/use-user.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useUser",
    ()=>useUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$use$2d$swr$2d$emll9s78$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__u__as__default$3e$__ = __turbopack_context__.i("[project]/web/node_modules/swr/dist/use-swr-emll9s78.mjs [app-ssr] (ecmascript) <export u as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/pathUtils.js [app-ssr] (ecmascript)");
"use client";
;
;
function useUser(options = {}) {
    const { data, error, isLoading, mutate } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$use$2d$swr$2d$emll9s78$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__u__as__default$3e$__["default"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(options.route || process.env.NEXT_PUBLIC_PROFILE_ROUTE || "/auth/profile"), (...args)=>fetch(...args).then((res)=>{
            if (!res.ok) {
                throw new Error("Unauthorized");
            }
            if (res.status === 204) {
                return null;
            }
            return res.json();
        }));
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
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/index.js [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$hooks$2f$use$2d$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/hooks/use-user.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$hooks$2f$use$2d$anonymous$2d$session$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/hooks/use-anonymous-session.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$helpers$2f$get$2d$access$2d$token$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/helpers/get-access-token.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$helpers$2f$start$2d$enterprise$2d$login$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/helpers/start-enterprise-login.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$helpers$2f$with$2d$page$2d$auth$2d$required$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/helpers/with-page-auth-required.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$providers$2f$auth0$2d$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/providers/auth0-provider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$mfa$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/mfa/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$passwordless$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/passwordless/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$passkey$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/passkey/index.js [app-ssr] (ecmascript)");
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
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/mfa/index.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mfa",
    ()=>mfa
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/oauth-errors.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/mfa-errors.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$popup$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/popup-errors.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$transform$2d$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/mfa-transform-utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/pathUtils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$popup$2d$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/popup-helpers.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/constants.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$helpers$2f$get$2d$access$2d$token$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/helpers/get-access-token.js [app-ssr] (ecmascript)");
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
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MfaRequiredError"](message, "", undefined, undefined);
        case "access_denied":
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AccessTokenError"](code, message, undefined);
        default:
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AccessTokenError"](code, message, undefined);
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
            const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(process.env.NEXT_PUBLIC_MFA_AUTHENTICATORS_ROUTE || "/auth/mfa/authenticators");
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
            return data.map(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$transform$2d$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["camelizeAuthenticator"]);
        } catch (e) {
            // Re-throw typed errors
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MfaTokenExpiredError"] || e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MfaTokenInvalidError"] || e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MfaGetAuthenticatorsError"]) {
                throw e;
            }
            // Network/parse errors → MfaGetAuthenticatorsError with client_error code
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MfaGetAuthenticatorsError"]("client_error", e instanceof Error ? e.message : "Network or parsing error", undefined);
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
            const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(process.env.NEXT_PUBLIC_MFA_CHALLENGE_ROUTE || "/auth/mfa/challenge");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$transform$2d$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["camelizeChallengeResponse"])(data);
        } catch (e) {
            // Re-throw typed errors
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MfaTokenExpiredError"] || e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MfaTokenInvalidError"] || e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MfaChallengeError"]) {
                throw e;
            }
            // Network/parse errors
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MfaChallengeError"]("client_error", e instanceof Error ? e.message : "Network or parsing error", undefined);
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
            const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(process.env.NEXT_PUBLIC_MFA_VERIFY_ROUTE || "/auth/mfa/verify");
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
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MfaTokenExpiredError"] || e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MfaTokenInvalidError"] || e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MfaRequiredError"] || e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MfaVerifyError"]) {
                throw e;
            }
            // Network/parse errors
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MfaVerifyError"]("client_error", e instanceof Error ? e.message : "Network or parsing error", undefined);
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
            const normalizedOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$transform$2d$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeEnrollOptions"])(options);
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
            const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(process.env.NEXT_PUBLIC_MFA_ASSOCIATE_ROUTE || "/auth/mfa/associate");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$transform$2d$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildEnrollmentResponse"])(data);
        } catch (e) {
            // Re-throw typed errors
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MfaTokenExpiredError"] || e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MfaTokenInvalidError"] || e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MfaEnrollmentError"]) {
                throw e;
            }
            // Network/parse errors
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MfaEnrollmentError"]("client_error", e instanceof Error ? e.message : "Network or parsing error", undefined);
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
        if ("TURBOPACK compile-time truthy", 1) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$popup$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ExecutionContextError"]("challengeWithPopup() can only be called in browser context");
        }
        // 2. Concurrent popup guard (singleton)
        if (activePopup !== null && !activePopup.closed) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$popup$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PopupInProgressError"]();
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
        const loginUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(process.env.NEXT_PUBLIC_LOGIN_ROUTE || "/auth/login") + "?" + params.toString();
        // 4. Open centered popup
        const width = options.popupWidth || __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_POPUP_WIDTH"];
        const height = options.popupHeight || __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_POPUP_HEIGHT"];
        const popup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$popup$2d$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["openCenteredPopup"])(loginUrl, width, height);
        if (popup === null) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$popup$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PopupBlockedError"]();
        }
        // 5. Track active popup (singleton guard)
        activePopup = popup;
        try {
            // 6. Wait for postMessage completion or timeout/cancel
            const timeout = options.timeout || __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_POPUP_TIMEOUT"];
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$popup$2d$helpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["waitForPopupCompletion"])(popup, timeout);
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
            return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$helpers$2f$get$2d$access$2d$token$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAccessToken"])({
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
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MfaTokenExpiredError"]();
        }
        if (code === "mfa_token_invalid") {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MfaTokenInvalidError"]();
        }
        if (code === "mfa_no_available_factors") {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MfaNoAvailableFactorsError"](description);
        }
        // Chained MFA: mfa_required means "success, continue to next factor"
        // NOT a verification failure, so use MfaRequiredError (not MfaVerifyError)
        if (code === "mfa_required") {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MfaRequiredError"](description, error.mfa_token, error.mfa_requirements, undefined);
        }
        // Auth0 API errors (dynamic codes) - route-based fallback
        // Route detection from URL (fallback if route param is unreliable)
        const isAuthenticators = route === "getAuthenticators" || url.includes("/authenticators");
        const isChallenge = route === "challenge" || url.includes("/challenge");
        const isVerify = route === "verify" || url.includes("/verify");
        const isEnroll = route === "enroll" || url.includes("/associate");
        if (isAuthenticators) {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MfaGetAuthenticatorsError"](code, description, undefined);
        }
        if (isChallenge) {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MfaChallengeError"](code, description, undefined);
        }
        if (isVerify) {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MfaVerifyError"](code, description, undefined);
        }
        if (isEnroll) {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MfaEnrollmentError"](code, description, undefined);
        }
        // Fallback: unknown route (shouldn't happen)
        return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MfaVerifyError"](code, description, undefined);
    }
}
const mfa = new ClientMfaClient();
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/passkey/index.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "passkey",
    ()=>passkey,
    "serializeCredential",
    ()=>serializeCredential
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/passkey-errors.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/pathUtils.js [app-ssr] (ecmascript)");
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
        if (("TURBOPACK compile-time value", "undefined") === "undefined" || !window.PublicKeyCredential || typeof navigator?.credentials?.create !== "function" || typeof navigator?.credentials?.get !== "function") {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PasskeyGetTokenError"]("webauthn_not_supported", "WebAuthn is not supported in this browser", undefined);
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
        const challengeUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(process.env.NEXT_PUBLIC_PASSKEY_REGISTER_ROUTE || "/auth/passkey/register");
        let challenge;
        try {
            challenge = await postJson(challengeUrl, options ?? {});
        } catch (err) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PasskeyRegisterError"](err?.error ?? "client_error", err?.error_description ?? "Failed to get passkey signup challenge", err?.error ? err : undefined);
        }
        let credential;
        try {
            credential = await navigator.credentials.create({
                publicKey: decodeCreationOptions(challenge.authnParamsPublicKey)
            });
        } catch (err) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PasskeyGetTokenError"]("webauthn_error", err?.message ?? "WebAuthn credential creation failed", undefined);
        }
        if (!credential) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PasskeyGetTokenError"]("webauthn_error", "navigator.credentials.create returned null", undefined);
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
        const challengeUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(process.env.NEXT_PUBLIC_PASSKEY_CHALLENGE_ROUTE || "/auth/passkey/challenge");
        let challenge;
        try {
            challenge = await postJson(challengeUrl, options ?? {});
        } catch (err) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PasskeyChallengeError"](err?.error ?? "client_error", err?.error_description ?? "Failed to get passkey login challenge", err?.error ? err : undefined);
        }
        let credential;
        try {
            credential = await navigator.credentials.get({
                publicKey: decodeRequestOptions(challenge.authnParamsPublicKey)
            });
        } catch (err) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PasskeyGetTokenError"]("webauthn_error", err?.message ?? "WebAuthn credential assertion failed", undefined);
        }
        if (!credential) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PasskeyGetTokenError"]("webauthn_error", "navigator.credentials.get returned null", undefined);
        }
        await this._verify(challenge.authSession, credential);
    }
    // Shared verify step used by both signup() and login()
    async _verify(authSession, credential) {
        const verifyUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(process.env.NEXT_PUBLIC_PASSKEY_GET_TOKEN_ROUTE || "/auth/passkey/get-token");
        try {
            await postJson(verifyUrl, {
                authSession,
                authResponse: serializeCredential(credential)
            });
        } catch (err) {
            if (err?.error === "mfa_required") {
                throw err;
            }
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PasskeyGetTokenError"](err?.error ?? "client_error", err?.error_description ?? "Passkey verification failed", err?.error ? err : undefined);
        }
    }
    async enrollmentChallenge(options) {
        const challengeUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(process.env.NEXT_PUBLIC_PASSKEY_ENROLLMENT_CHALLENGE_ROUTE || "/auth/passkey/enrollment-challenge");
        try {
            return await postJson(challengeUrl, options ?? {});
        } catch (err) {
            if (err?.error === "mfa_required") {
                throw err;
            }
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PasskeyEnrollmentChallengeError"](err?.error ?? "unknown_error", err?.error_description ?? "Failed to get passkey enrollment challenge");
        }
    }
    async enrollmentVerify(options) {
        const verifyUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(process.env.NEXT_PUBLIC_PASSKEY_ENROLLMENT_VERIFY_ROUTE || "/auth/passkey/enrollment-verify");
        try {
            return await postJson(verifyUrl, options);
        } catch (err) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PasskeyEnrollmentVerifyError"](err?.error ?? "unknown_error", err?.error_description ?? "Passkey enrollment verification failed");
        }
    }
}
const passkey = new ClientPasskeyClient();
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/passwordless/index.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "passwordless",
    ()=>passwordless
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$db$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/passwordless-db-errors.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/passwordless-errors.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/pathUtils.js [app-ssr] (ecmascript)");
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
        const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(process.env.NEXT_PUBLIC_PASSWORDLESS_START_ROUTE || "/auth/passwordless/start");
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
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PasswordlessStartError"]("client_error", e instanceof Error ? e.message : "Network error", undefined);
        }
        if (!response.ok) {
            const error = await response.json().catch(()=>({
                    error: "client_error",
                    error_description: "Failed to parse error response"
                }));
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PasswordlessStartError"](error.error ?? "client_error", error.error_description ?? "Passwordless start failed", undefined);
        }
    }
    /**
     * Verify a passwordless OTP. On success the server creates a session
     * and sets the session cookie — the browser picks it up automatically.
     *
     * @param options - Email or SMS verify options including the OTP
     * @throws {PasswordlessVerifyError} On wrong code, expired code, or network error
     */ async verify(options) {
        const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(process.env.NEXT_PUBLIC_PASSWORDLESS_VERIFY_ROUTE || "/auth/passwordless/verify");
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
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PasswordlessVerifyError"]("client_error", e instanceof Error ? e.message : "Network error", undefined);
        }
        if (!response.ok) {
            const error = await response.json().catch(()=>({
                    error: "client_error",
                    error_description: "Failed to parse error response"
                }));
            if (error.error === "mfa_required") {
                throw error;
            }
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PasswordlessVerifyError"](error.error ?? "client_error", error.error_description ?? "Passwordless verify failed", undefined);
        }
    }
    async challengeWithEmail(options) {
        return __classPrivateFieldGet(this, _ClientPasswordlessClient_instances, "m", _ClientPasswordlessClient_sendChallenge).call(this, options);
    }
    async challengeWithPhoneNumber(options) {
        return __classPrivateFieldGet(this, _ClientPasswordlessClient_instances, "m", _ClientPasswordlessClient_sendChallenge).call(this, options);
    }
    async loginWithOtp(options) {
        const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(process.env.NEXT_PUBLIC_PASSWORDLESS_DB_GET_TOKEN_ROUTE || "/auth/passwordless/otp/token");
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
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$db$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PasswordlessDbGetTokenError"]("client_error", e instanceof Error ? e.message : "Network error", undefined);
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
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$db$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PasswordlessDbGetTokenError"](error.error ?? "client_error", error.error_description ?? "OTP token exchange failed", undefined);
        }
    }
}
_ClientPasswordlessClient_instances = new WeakSet(), _ClientPasswordlessClient_sendChallenge = async function _ClientPasswordlessClient_sendChallenge(options) {
    const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(process.env.NEXT_PUBLIC_PASSWORDLESS_DB_OTP_CHALLENGE_ROUTE || "/auth/passwordless/otp/challenge");
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
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$db$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PasswordlessDbChallengeError"]("client_error", e instanceof Error ? e.message : "Network error", undefined);
    }
    if (!response.ok) {
        const error = await response.json().catch(()=>({
                error: "client_error",
                error_description: "Failed to parse error response"
            }));
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$db$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PasswordlessDbChallengeError"](error.error ?? "client_error", error.error_description ?? "OTP challenge failed", undefined);
    }
    const data = await response.json().catch(()=>{
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$db$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PasswordlessDbChallengeError"]("client_error", "Failed to parse challenge response", undefined);
    });
    return {
        authSession: data.authSession
    };
};
const passwordless = new ClientPasswordlessClient();
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/providers/auth0-provider.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Auth0Provider",
    ()=>Auth0Provider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$use$2d$swr$2d$emll9s78$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__S__as__SWRConfig$3e$__ = __turbopack_context__.i("[project]/web/node_modules/swr/dist/use-swr-emll9s78.mjs [app-ssr] (ecmascript) <export S as SWRConfig>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/pathUtils.js [app-ssr] (ecmascript)");
"use client";
;
;
;
function Auth0Provider({ user, anonymousSession, children, profileRoute, anonymousSessionRoute }) {
    // Resolve profile route
    const profileKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(profileRoute || process.env.NEXT_PUBLIC_PROFILE_ROUTE || "/auth/profile");
    // Resolve anonymous session route
    const anonKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeWithBasePath"])(anonymousSessionRoute || process.env.NEXT_PUBLIC_ANONYMOUS_SESSION_ROUTE || "/auth/anonymous-session");
    // Build SWR fallback cache with both user and anonymous session
    // Avoids loading flashes when both are available from server-side fetch
    const fallback = {
        [profileKey]: user
    };
    // Seed anonymous session only if provided (may be null or undefined)
    if (anonymousSession !== undefined) {
        fallback[anonKey] = anonymousSession;
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$swr$2f$dist$2f$use$2d$swr$2d$emll9s78$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__S__as__SWRConfig$3e$__["SWRConfig"], {
        value: {
            fallback
        }
    }, children);
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/anonymous-session-errors.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AnonymousSessionError",
    ()=>AnonymousSessionError,
    "getStatusForAnonymousError",
    ()=>getStatusForAnonymousError,
    "mapAnonymousErrorCode",
    ()=>mapAnonymousErrorCode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/sdk-error.js [app-ssr] (ecmascript)");
;
class AnonymousSessionError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SdkError"] {
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
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/dpop-errors.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DPoPError",
    ()=>DPoPError,
    "DPoPErrorCode",
    ()=>DPoPErrorCode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/sdk-error.js [app-ssr] (ecmascript)");
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
class DPoPError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SdkError"] {
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
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/index.js [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/oauth-errors.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$dpop$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/dpop-errors.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mtls$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/mtls-errors.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$my$2d$account$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/my-account-errors.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/mfa-errors.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$popup$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/popup-errors.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/passwordless-errors.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$db$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/passwordless-db-errors.js [app-ssr] (ecmascript)");
// MCD (Multiple Custom Domains) error classes
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mcd$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/mcd.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/passkey-errors.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$anonymous$2d$session$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/anonymous-session-errors.js [app-ssr] (ecmascript)");
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
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/mcd.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/sdk-error.js [app-ssr] (ecmascript)");
;
class DomainResolutionError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SdkError"] {
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
class DomainValidationError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SdkError"] {
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
class IssuerValidationError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SdkError"] {
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
class SessionDomainMismatchError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SdkError"] {
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
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/mfa-errors.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/sdk-error.js [app-ssr] (ecmascript)");
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
 */ class MfaError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SdkError"] {
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
class InvalidRequestError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SdkError"] {
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
class MfaNoAvailableFactorsError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SdkError"] {
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
class MfaRequiredError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SdkError"] {
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
class MfaTokenExpiredError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(){
        super("MFA token has expired. Please restart the MFA flow.");
        this.code = "mfa_token_expired";
        this.name = "MfaTokenExpiredError";
    }
}
class MfaTokenInvalidError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(){
        super("MFA token is invalid.");
        this.code = "mfa_token_invalid";
        this.name = "MfaTokenInvalidError";
    }
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/mtls-errors.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MtlsError",
    ()=>MtlsError,
    "MtlsErrorCode",
    ()=>MtlsErrorCode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/sdk-error.js [app-ssr] (ecmascript)");
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
class MtlsError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SdkError"] {
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
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/my-account-errors.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/sdk-error.js [app-ssr] (ecmascript)");
;
class MyAccountApiError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SdkError"] {
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
class ConnectAccountError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SdkError"] {
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
class ConnectedAccountsError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor({ code, message, cause }){
        super(message);
        this.name = "ConnectedAccountsError";
        this.code = code;
        this.cause = cause;
    }
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/oauth-errors.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/sdk-error.js [app-ssr] (ecmascript)");
;
class OAuth2Error extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor({ code, message }){
        super(message ?? "An error occurred while interacting with the authorization server.");
        this.name = "OAuth2Error";
        this.code = code;
    }
}
class DiscoveryError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(message){
        super(message ?? "Discovery failed for the OpenID Connect configuration.");
        this.code = "discovery_error";
        this.name = "DiscoveryError";
    }
}
class MissingStateError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(message){
        super(message ?? "The state parameter is missing.");
        this.code = "missing_state";
        this.name = "MissingStateError";
    }
}
class InvalidStateError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(message){
        super(message ?? "The state parameter is invalid.");
        this.code = "invalid_state";
        this.name = "InvalidStateError";
    }
}
class InvalidConfigurationError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SdkError"] {
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
class AuthorizationError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor({ cause, message }){
        super(message ?? "An error occurred during the authorization flow.");
        this.code = "authorization_error";
        this.cause = cause;
        this.name = "AuthorizationError";
    }
}
class AuthorizationCodeGrantRequestError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(message){
        super(message ?? "An error occurred while preparing or performing the authorization code grant request.");
        this.code = "authorization_code_grant_request_error";
        this.name = "AuthorizationCodeGrantRequestError";
    }
}
class AuthorizationCodeGrantError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor({ cause, message }){
        super(message ?? "An error occurred while trying to exchange the authorization code.");
        this.code = "authorization_code_grant_error";
        this.cause = cause;
        this.name = "AuthorizationCodeGrantError";
    }
}
class BackchannelLogoutError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(message){
        super(message ?? "An error occurred while completing the backchannel logout request.");
        this.code = "backchannel_logout_error";
        this.name = "BackchannelLogoutError";
    }
}
class BackchannelAuthenticationNotSupportedError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(){
        super("The authorization server does not support backchannel authentication. Learn how to enable it here: https://auth0.com/docs/get-started/applications/configure-client-initiated-backchannel-authentication");
        this.code = "backchannel_authentication_not_supported_error";
        this.name = "BackchannelAuthenticationNotSupportedError";
    }
}
class BackchannelAuthenticationError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SdkError"] {
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
class AccessTokenError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SdkError"] {
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
class AccessTokenForConnectionError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SdkError"] {
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
class TokenRevocationError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SdkError"] {
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
class CustomTokenExchangeError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SdkError"] {
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
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/passkey-errors.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/sdk-error.js [app-ssr] (ecmascript)");
;
/**
 * Base class for all passkey-related errors.
 * Provides standardized JSON serialization matching Auth0 API format.
 */ class PasskeyError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SdkError"] {
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
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/passwordless-db-errors.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PasswordlessDbChallengeError",
    ()=>PasswordlessDbChallengeError,
    "PasswordlessDbGetTokenError",
    ()=>PasswordlessDbGetTokenError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/sdk-error.js [app-ssr] (ecmascript)");
;
class PasswordlessDbError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SdkError"] {
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
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/passwordless-errors.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PasswordlessStartError",
    ()=>PasswordlessStartError,
    "PasswordlessVerifyError",
    ()=>PasswordlessVerifyError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/sdk-error.js [app-ssr] (ecmascript)");
;
/**
 * Base class for all passwordless-related errors.
 * Provides standardized JSON serialization matching Auth0 API format.
 *
 * Supports two consumption paths with identical shape:
 * 1. Direct SDK call: properties accessed on error instance
 * 2. HTTP API route: Response.json(error) uses toJSON() automatically
 */ class PasswordlessError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SdkError"] {
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
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/popup-errors.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/sdk-error.js [app-ssr] (ecmascript)");
;
class PopupBlockedError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(message){
        super(message || "Popup was blocked by browser. Enable popups for this site.");
        this.code = "popup_blocked";
        this.name = "PopupBlockedError";
        Object.setPrototypeOf(this, PopupBlockedError.prototype);
    }
}
class PopupCancelledError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(message){
        super(message || "Popup was closed by user");
        this.code = "popup_cancelled";
        this.name = "PopupCancelledError";
        Object.setPrototypeOf(this, PopupCancelledError.prototype);
    }
}
class PopupTimeoutError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(message){
        super(message || "Popup did not complete within timeout");
        this.code = "popup_timeout";
        this.name = "PopupTimeoutError";
        Object.setPrototypeOf(this, PopupTimeoutError.prototype);
    }
}
class PopupInProgressError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(message){
        super(message || "Another popup authentication is already in progress");
        this.code = "popup_in_progress";
        this.name = "PopupInProgressError";
        Object.setPrototypeOf(this, PopupInProgressError.prototype);
    }
}
class ExecutionContextError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(message){
        super(message || "Method can only be called in browser context");
        this.code = "invalid_execution_context";
        this.name = "ExecutionContextError";
        Object.setPrototypeOf(this, ExecutionContextError.prototype);
    }
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/sdk-error.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SdkError",
    ()=>SdkError
]);
class SdkError extends Error {
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/types/mfa.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/constants.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/mfa-transform-utils.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/mfa-errors.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$types$2f$mfa$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/types/mfa.js [app-ssr] (ecmascript)");
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
    throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InvalidRequestError"]("Missing verification credential");
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
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MfaVerifyError"]("invalid_request", "At least one verification credential required (otp, oobCode+bindingCode, or recoveryCode)");
    }
    return params;
};
const getVerifyGrantType = (params)=>{
    if (params.has("otp")) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$types$2f$mfa$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GRANT_TYPE_MFA_OTP"];
    } else if (params.has("oob_code") && params.has("binding_code")) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$types$2f$mfa$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GRANT_TYPE_MFA_OOB"];
    } else if (params.has("recovery_code")) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$types$2f$mfa$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GRANT_TYPE_MFA_RECOVERY_CODE"];
    } else {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MfaVerifyError"]("invalid_request", "No verification credential provided");
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
        if (!mapping) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InvalidRequestError"](`Unknown factorType: ${options.factorType}`);
        if ((options.factorType === "sms" || options.factorType === "voice") && !("phoneNumber" in options && options.phoneNumber)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InvalidRequestError"](`phoneNumber is required for factorType: ${options.factorType}`);
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
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/pathUtils.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/oauth-errors.js [app-ssr] (ecmascript)");
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
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InvalidConfigurationError"]("appBaseUrl is required for this operation. Provide it in Auth0ClientOptions or ensure it can be resolved from request headers.");
    }
    return new URL(ensureNoLeadingSlash(normalizeWithBasePath(path)), ensureTrailingSlash(baseUrl));
}
const normalizeWithBasePath = (path)=>{
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH;
    if (!basePath) {
        return path;
    }
    // basePath can be `docs` or `/docs`
    const sanitizedBasePath = ensureLeadingSlash(basePath);
    return ensureTrailingSlash(sanitizedBasePath) + ensureNoLeadingSlash(path);
};
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/popup-helpers.js [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "openCenteredPopup",
    ()=>openCenteredPopup,
    "waitForPopupCompletion",
    ()=>waitForPopupCompletion
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$popup$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/popup-errors.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/constants.js [app-ssr] (ecmascript)");
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
            reject(new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$popup$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PopupTimeoutError"](`Popup did not complete within ${timeout}ms`));
        }, timeout);
        const pollId = setInterval(()=>{
            if (popup.closed) {
                cleanup();
                reject(new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$popup$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PopupCancelledError"]("Popup was closed by user"));
            }
        }, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["POLL_INTERVAL"]);
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
];})()

//# sourceMappingURL=0aq__%40auth0_nextjs-auth0_dist_1ayc7pv4mre7i._.js.map