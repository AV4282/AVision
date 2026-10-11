module.exports = [
(()=>{"use strict";return[
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
"[project]/web/node_modules/next/dist/client/compat/router.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
const _react = __turbopack_context__.r("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
const _routercontextsharedruntime = __turbopack_context__.r("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/contexts/router-context.js [app-ssr] (ecmascript)");
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
"[project]/web/node_modules/next/dist/client/components/forbidden.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "forbidden", {
    enumerable: true,
    get: function() {
        return forbidden;
    }
});
const _httpaccessfallback = __turbopack_context__.r("[project]/web/node_modules/next/dist/client/components/http-access-fallback/http-access-fallback.js [app-ssr] (ecmascript)");
// TODO: Add `forbidden` docs
/**
 * @experimental
 * This function allows you to render the [forbidden.js file](https://nextjs.org/docs/app/api-reference/file-conventions/forbidden)
 * within a route segment as well as inject a tag.
 *
 * `forbidden()` can be used in
 * [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components),
 * [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers), and
 * [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations).
 *
 * Read more: [Next.js Docs: `forbidden`](https://nextjs.org/docs/app/api-reference/functions/forbidden)
 */ const DIGEST = `${_httpaccessfallback.HTTP_ERROR_FALLBACK_ERROR_CODE};403`;
function forbidden() {
    if ("TURBOPACK compile-time truthy", 1) {
        throw new Error(`\`forbidden()\` is experimental and only allowed to be enabled when \`experimental.authInterrupts\` is enabled.`);
    }
    const error = new Error(DIGEST);
    error.digest = DIGEST;
    throw error;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/web/node_modules/next/dist/client/components/hooks-server-context.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    DynamicServerError: null,
    isDynamicServerError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    DynamicServerError: function() {
        return DynamicServerError;
    },
    isDynamicServerError: function() {
        return isDynamicServerError;
    }
});
const DYNAMIC_ERROR_CODE = 'DYNAMIC_SERVER_USAGE';
class DynamicServerError extends Error {
    constructor(description){
        super(`Dynamic server usage: ${description}`), this.description = description, this.digest = DYNAMIC_ERROR_CODE;
    }
}
function isDynamicServerError(err) {
    if (typeof err !== 'object' || err === null || !('digest' in err) || typeof err.digest !== 'string') {
        return false;
    }
    return err.digest === DYNAMIC_ERROR_CODE;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/web/node_modules/next/dist/client/components/http-access-fallback/http-access-fallback.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    HTTPAccessErrorStatus: null,
    HTTP_ERROR_FALLBACK_ERROR_CODE: null,
    getAccessFallbackErrorTypeByStatus: null,
    getAccessFallbackHTTPStatus: null,
    isHTTPAccessFallbackError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    HTTPAccessErrorStatus: function() {
        return HTTPAccessErrorStatus;
    },
    HTTP_ERROR_FALLBACK_ERROR_CODE: function() {
        return HTTP_ERROR_FALLBACK_ERROR_CODE;
    },
    getAccessFallbackErrorTypeByStatus: function() {
        return getAccessFallbackErrorTypeByStatus;
    },
    getAccessFallbackHTTPStatus: function() {
        return getAccessFallbackHTTPStatus;
    },
    isHTTPAccessFallbackError: function() {
        return isHTTPAccessFallbackError;
    }
});
const HTTPAccessErrorStatus = {
    NOT_FOUND: 404,
    FORBIDDEN: 403,
    UNAUTHORIZED: 401
};
const ALLOWED_CODES = new Set(Object.values(HTTPAccessErrorStatus));
const HTTP_ERROR_FALLBACK_ERROR_CODE = 'NEXT_HTTP_ERROR_FALLBACK';
function isHTTPAccessFallbackError(error) {
    if (typeof error !== 'object' || error === null || !('digest' in error) || typeof error.digest !== 'string') {
        return false;
    }
    const [prefix, httpStatus] = error.digest.split(';');
    return prefix === HTTP_ERROR_FALLBACK_ERROR_CODE && ALLOWED_CODES.has(Number(httpStatus));
}
function getAccessFallbackHTTPStatus(error) {
    const httpStatus = error.digest.split(';')[1];
    return Number(httpStatus);
}
function getAccessFallbackErrorTypeByStatus(status) {
    switch(status){
        case 401:
            return 'unauthorized';
        case 403:
            return 'forbidden';
        case 404:
            return 'not-found';
        default:
            return;
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
"[project]/web/node_modules/next/dist/client/components/instant-samples.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    expectCompleteParamsInClientValidation: null,
    instrumentParamsForClientValidation: null,
    instrumentSearchParamsForClientValidation: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    expectCompleteParamsInClientValidation: function() {
        return expectCompleteParamsInClientValidation;
    },
    instrumentParamsForClientValidation: function() {
        return instrumentParamsForClientValidation;
    },
    instrumentSearchParamsForClientValidation: function() {
        return instrumentSearchParamsForClientValidation;
    }
});
const _workunitasyncstorageexternal = __turbopack_context__.r("[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)");
const _workasyncstorageexternal = __turbopack_context__.r("[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)");
const _instantsamples = __turbopack_context__.r("[project]/web/node_modules/next/dist/server/app-render/instant-validation/instant-samples.js [app-ssr] (ecmascript)");
const _instantvalidationerror = __turbopack_context__.r("[project]/web/node_modules/next/dist/server/app-render/instant-validation/instant-validation-error.js [app-ssr] (ecmascript)");
function instrumentParamsForClientValidation(underlyingParams) {
    const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
    const workUnitStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
    if (workStore && workUnitStore) {
        switch(workUnitStore.type){
            case 'validation-client':
                {
                    if (workUnitStore.validationSamples) {
                        const declaredKeys = new Set(Object.keys(workUnitStore.validationSamples.params ?? {}));
                        return (0, _instantsamples.createExhaustiveParamsProxy)(underlyingParams, declaredKeys, workStore.route);
                    }
                    break;
                }
            case 'prerender-runtime':
            case 'prerender-client':
            case 'prerender-legacy':
            case 'prerender':
            case 'cache':
            case 'request':
            case 'private-cache':
            case 'unstable-cache':
            case 'build-time-generator':
                break;
            default:
                workUnitStore;
        }
    }
    return underlyingParams;
}
function expectCompleteParamsInClientValidation(expression) {
    const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
    const workUnitStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
    if (workStore && workUnitStore) {
        switch(workUnitStore.type){
            case 'validation-client':
                {
                    if (workUnitStore.validationSamples) {
                        const fallbackParams = workUnitStore.fallbackRouteParams;
                        if (fallbackParams && fallbackParams.size > 0) {
                            const missingParams = Array.from(fallbackParams.keys());
                            (0, _instantsamples.trackMissingSampleErrorAndThrow)(new _instantvalidationerror.InstantValidationError(`Route "${workStore.route}" called ${expression} but param${missingParams.length > 1 ? 's' : ''} ${missingParams.map((p)=>`"${p}"`).join(', ')} ${missingParams.length > 1 ? 'are' : 'is'} not defined in the \`unstable_samples\` of \`instant\`. ` + `${expression} requires all route params to be provided.`));
                        }
                    }
                    break;
                }
            case 'prerender-runtime':
            case 'prerender-client':
            case 'prerender-legacy':
            case 'prerender':
            case 'cache':
            case 'request':
            case 'private-cache':
            case 'unstable-cache':
            case 'build-time-generator':
                break;
            default:
                workUnitStore;
        }
    }
}
function instrumentSearchParamsForClientValidation(underlyingSearchParams) {
    const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
    const workUnitStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
    if (workStore && workUnitStore) {
        switch(workUnitStore.type){
            case 'validation-client':
                {
                    if (workUnitStore.validationSamples) {
                        const declaredKeys = new Set(Object.keys(workUnitStore.validationSamples.searchParams ?? {}));
                        return (0, _instantsamples.createExhaustiveURLSearchParamsProxy)(underlyingSearchParams, declaredKeys, workStore.route);
                    }
                    break;
                }
            case 'prerender-runtime':
            case 'prerender-client':
            case 'prerender-legacy':
            case 'prerender':
            case 'cache':
            case 'request':
            case 'private-cache':
            case 'unstable-cache':
            case 'build-time-generator':
                break;
            default:
                workUnitStore;
        }
    }
    return underlyingSearchParams;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/web/node_modules/next/dist/client/components/is-next-router-error.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isNextRouterError", {
    enumerable: true,
    get: function() {
        return isNextRouterError;
    }
});
const _httpaccessfallback = __turbopack_context__.r("[project]/web/node_modules/next/dist/client/components/http-access-fallback/http-access-fallback.js [app-ssr] (ecmascript)");
const _redirecterror = __turbopack_context__.r("[project]/web/node_modules/next/dist/client/components/redirect-error.js [app-ssr] (ecmascript)");
function isNextRouterError(error) {
    return (0, _redirecterror.isRedirectError)(error) || (0, _httpaccessfallback.isHTTPAccessFallbackError)(error);
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/web/node_modules/next/dist/client/components/navigation-dynamic-rendering.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Client-safe access to the server-only dynamic-rendering hooks used by the
// navigation hooks. On the server these re-export the real implementations; in
// the browser bundle this module is aliased to
// `./navigation-dynamic-rendering.browser` (see
// scripts/generate-browser-variant-aliases.mjs), which exports `undefined` so
// the server module is not bundled into the client. Callers use optional calls
// (`useDynamicRouteParams?.(...)`), so the browser stub is a no-op.
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    useDynamicRouteParams: null,
    useDynamicSearchParams: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    useDynamicRouteParams: function() {
        return _dynamicrenderingclient.useDynamicRouteParams;
    },
    useDynamicSearchParams: function() {
        return _dynamicrenderingclient.useDynamicSearchParams;
    }
});
const _dynamicrenderingclient = __turbopack_context__.r("[project]/web/node_modules/next/dist/server/app-render/dynamic-rendering-client.js [app-ssr] (ecmascript)");
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/web/node_modules/next/dist/client/components/navigation.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    ReadonlyURLSearchParams: null,
    RedirectType: null,
    ServerInsertedHTMLContext: null,
    forbidden: null,
    notFound: null,
    permanentRedirect: null,
    redirect: null,
    unauthorized: null,
    unstable_isUnrecognizedActionError: null,
    unstable_rethrow: null,
    useParams: null,
    usePathname: null,
    useRouter: null,
    useSearchParams: null,
    useSelectedLayoutSegment: null,
    useSelectedLayoutSegments: null,
    useServerInsertedHTML: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    // We need the same class that was used to instantiate the context value
    // Otherwise instanceof checks will fail in usercode
    ReadonlyURLSearchParams: function() {
        return _hooksclientcontextsharedruntime.ReadonlyURLSearchParams;
    },
    RedirectType: function() {
        return _navigationreactserver.RedirectType;
    },
    ServerInsertedHTMLContext: function() {
        return _serverinsertedhtmlsharedruntime.ServerInsertedHTMLContext;
    },
    forbidden: function() {
        return _navigationreactserver.forbidden;
    },
    notFound: function() {
        return _navigationreactserver.notFound;
    },
    permanentRedirect: function() {
        return _navigationreactserver.permanentRedirect;
    },
    redirect: function() {
        return _navigationreactserver.redirect;
    },
    unauthorized: function() {
        return _navigationreactserver.unauthorized;
    },
    unstable_isUnrecognizedActionError: function() {
        return _unrecognizedactionerror.unstable_isUnrecognizedActionError;
    },
    unstable_rethrow: function() {
        return _navigationreactserver.unstable_rethrow;
    },
    useParams: function() {
        return useParams;
    },
    usePathname: function() {
        return usePathname;
    },
    useRouter: function() {
        return useRouter;
    },
    useSearchParams: function() {
        return useSearchParams;
    },
    useSelectedLayoutSegment: function() {
        return useSelectedLayoutSegment;
    },
    useSelectedLayoutSegments: function() {
        return useSelectedLayoutSegments;
    },
    useServerInsertedHTML: function() {
        return _serverinsertedhtmlsharedruntime.useServerInsertedHTML;
    }
});
const _interop_require_wildcard = __turbopack_context__.r("[project]/web/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs [app-ssr] (ecmascript)");
const _react = /*#__PURE__*/ _interop_require_wildcard._(__turbopack_context__.r("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)"));
const _approutercontextsharedruntime = __turbopack_context__.r("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/contexts/app-router-context.js [app-ssr] (ecmascript)");
const _hooksclientcontextsharedruntime = __turbopack_context__.r("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/contexts/hooks-client-context.js [app-ssr] (ecmascript)");
const _segment = __turbopack_context__.r("[project]/web/node_modules/next/dist/shared/lib/segment.js [app-ssr] (ecmascript)");
const _navigationdynamicrendering = __turbopack_context__.r("[project]/web/node_modules/next/dist/client/components/navigation-dynamic-rendering.js [app-ssr] (ecmascript)");
const _serverinsertedhtmlsharedruntime = __turbopack_context__.r("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/contexts/server-inserted-html.js [app-ssr] (ecmascript)");
const _unrecognizedactionerror = __turbopack_context__.r("[project]/web/node_modules/next/dist/client/components/unrecognized-action-error.js [app-ssr] (ecmascript)");
const _navigationreactserver = __turbopack_context__.r("[project]/web/node_modules/next/dist/client/components/navigation.react-server.js [app-ssr] (ecmascript)");
const { instrumentParamsForClientValidation, instrumentSearchParamsForClientValidation, expectCompleteParamsInClientValidation } = ("TURBOPACK compile-time truthy", 1) ? __turbopack_context__.r("[project]/web/node_modules/next/dist/client/components/instant-samples.js [app-ssr] (ecmascript)") : "TURBOPACK unreachable";
function useSearchParams() {
    _navigationdynamicrendering.useDynamicSearchParams?.('useSearchParams()');
    const searchParams = (0, _react.useContext)(_hooksclientcontextsharedruntime.SearchParamsContext);
    // In the case where this is `null`, the compat types added in
    // `next-env.d.ts` will add a new overload that changes the return type to
    // include `null`.
    const readonlySearchParams = (0, _react.useMemo)(()=>{
        if (!searchParams) {
            // When the router is not ready in pages, we won't have the search params
            // available.
            return null;
        }
        return new _hooksclientcontextsharedruntime.ReadonlyURLSearchParams(searchParams);
    }, [
        searchParams
    ]);
    // During build-time instant validation, wrap with an proxy
    // so that accessing undeclared search params throws an error.
    if (("TURBOPACK compile-time value", "undefined") === 'undefined' && ("TURBOPACK compile-time value", true) && readonlySearchParams) {
        return instrumentSearchParamsForClientValidation(readonlySearchParams);
    }
    // Instrument with Suspense DevTools (dev-only)
    if (("TURBOPACK compile-time value", "development") !== 'production' && 'use' in _react.default) {
        const navigationPromises = (0, _react.use)(_hooksclientcontextsharedruntime.NavigationPromisesContext);
        if (navigationPromises) {
            return (0, _react.use)(navigationPromises.searchParams);
        }
    }
    return readonlySearchParams;
}
function usePathname() {
    _navigationdynamicrendering.useDynamicRouteParams?.('usePathname()');
    // In the case where this is `null`, the compat types added in `next-env.d.ts`
    // will add a new overload that changes the return type to include `null`.
    const pathname = (0, _react.useContext)(_hooksclientcontextsharedruntime.PathnameContext);
    // During build-time instant validation, error if fallback params exist
    // because usePathname() can't return a sensible value without all params.
    if (("TURBOPACK compile-time value", "undefined") === 'undefined' && ("TURBOPACK compile-time value", true) && pathname) {
        expectCompleteParamsInClientValidation('usePathname()');
        return pathname;
    }
    // Instrument with Suspense DevTools (dev-only)
    if (("TURBOPACK compile-time value", "development") !== 'production' && 'use' in _react.default) {
        const navigationPromises = (0, _react.use)(_hooksclientcontextsharedruntime.NavigationPromisesContext);
        if (navigationPromises) {
            return (0, _react.use)(navigationPromises.pathname);
        }
    }
    return pathname;
}
function useRouter() {
    const router = (0, _react.useContext)(_approutercontextsharedruntime.AppRouterContext);
    if (router === null) {
        throw new Error('invariant expected app router to be mounted');
    }
    // Read the bfcacheId of the closest CacheNode and merge it into the
    // returned router instance. This is contextual: callers in a shared
    // layout get the layout's id; callers in a leaf segment get the leaf's.
    // The id is stored on the CacheNode as a number and materialized as a
    // string here. The format mirrors React's `useId()` (e.g. `_r_0_`) with
    // a `b` prefix, so the id can be safely concatenated with other keys
    // without collision.
    const layout = (0, _react.useContext)(_approutercontextsharedruntime.LayoutRouterContext);
    const bfcacheIdNumber = layout?.parentRenderTree.data.bfcacheId ?? 0;
    return (0, _react.useMemo)(()=>({
            back: router.back,
            forward: router.forward,
            refresh: router.refresh,
            hmrRefresh: router.hmrRefresh,
            push: router.push,
            replace: router.replace,
            prefetch: router.prefetch,
            experimental_gesturePush: router.experimental_gesturePush,
            bfcacheId: '_b_' + bfcacheIdNumber + '_'
        }), [
        router,
        bfcacheIdNumber
    ]);
}
function useParams() {
    _navigationdynamicrendering.useDynamicRouteParams?.('useParams()');
    const params = (0, _react.useContext)(_hooksclientcontextsharedruntime.PathParamsContext);
    // During build-time instant validation, wrap with a proxy
    // so that accessing undeclared params throws an error.
    if (("TURBOPACK compile-time value", "undefined") === 'undefined' && ("TURBOPACK compile-time value", true) && params) {
        return instrumentParamsForClientValidation(params);
    }
    // Instrument with Suspense DevTools (dev-only)
    if (("TURBOPACK compile-time value", "development") !== 'production' && 'use' in _react.default) {
        const navigationPromises = (0, _react.use)(_hooksclientcontextsharedruntime.NavigationPromisesContext);
        if (navigationPromises) {
            return (0, _react.use)(navigationPromises.params);
        }
    }
    return params;
}
function useSelectedLayoutSegments(parallelRouteKey = 'children') {
    _navigationdynamicrendering.useDynamicRouteParams?.('useSelectedLayoutSegments()');
    const context = (0, _react.useContext)(_approutercontextsharedruntime.LayoutRouterContext);
    // @ts-expect-error This only happens in `pages`. Type is overwritten in navigation.d.ts
    if (!context) return null;
    // During build-time instant validation, error if fallback params exist
    // because useSelectedLayoutSegments() can't return a sensible value without all params.
    if (("TURBOPACK compile-time value", "undefined") === 'undefined' && ("TURBOPACK compile-time value", true) && context) {
        expectCompleteParamsInClientValidation('useSelectedLayoutSegments()');
    }
    // Instrument with Suspense DevTools (dev-only)
    if (("TURBOPACK compile-time value", "development") !== 'production' && 'use' in _react.default) {
        const navigationPromises = (0, _react.use)(_hooksclientcontextsharedruntime.NavigationPromisesContext);
        if (navigationPromises) {
            const promise = navigationPromises.selectedLayoutSegmentsPromises?.get(parallelRouteKey);
            if (promise) {
                // We should always have a promise here, but if we don't, it's not worth erroring over.
                // We just won't be able to instrument it, but can still provide the value.
                return (0, _react.use)(promise);
            }
        }
    }
    return (0, _segment.getSelectedLayoutSegmentPath)(context.parentTree, parallelRouteKey);
}
function useSelectedLayoutSegment(parallelRouteKey = 'children') {
    _navigationdynamicrendering.useDynamicRouteParams?.('useSelectedLayoutSegment()');
    const navigationPromises = (0, _react.useContext)(_hooksclientcontextsharedruntime.NavigationPromisesContext);
    const selectedLayoutSegments = useSelectedLayoutSegments(parallelRouteKey);
    // During build-time instant validation, error if fallback params exist
    // because useSelectedLayoutSegment() can't return a sensible value without all params.
    if ("TURBOPACK compile-time truthy", 1) {
        expectCompleteParamsInClientValidation('useSelectedLayoutSegment()');
    }
    // Instrument with Suspense DevTools (dev-only)
    if (("TURBOPACK compile-time value", "development") !== 'production' && navigationPromises && 'use' in _react.default) {
        const promise = navigationPromises.selectedLayoutSegmentPromises?.get(parallelRouteKey);
        if (promise) {
            // We should always have a promise here, but if we don't, it's not worth erroring over.
            // We just won't be able to instrument it, but can still provide the value.
            return (0, _react.use)(promise);
        }
    }
    return (0, _segment.computeSelectedLayoutSegment)(selectedLayoutSegments, parallelRouteKey);
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/web/node_modules/next/dist/client/components/navigation.react-server.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    ReadonlyURLSearchParams: null,
    RedirectType: null,
    forbidden: null,
    notFound: null,
    permanentRedirect: null,
    redirect: null,
    unauthorized: null,
    unstable_isUnrecognizedActionError: null,
    unstable_rethrow: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    ReadonlyURLSearchParams: function() {
        return _readonlyurlsearchparams.ReadonlyURLSearchParams;
    },
    RedirectType: function() {
        return RedirectType;
    },
    forbidden: function() {
        return _forbidden.forbidden;
    },
    notFound: function() {
        return _notfound.notFound;
    },
    permanentRedirect: function() {
        return _redirect.permanentRedirect;
    },
    redirect: function() {
        return _redirect.redirect;
    },
    unauthorized: function() {
        return _unauthorized.unauthorized;
    },
    unstable_isUnrecognizedActionError: function() {
        return unstable_isUnrecognizedActionError;
    },
    unstable_rethrow: function() {
        return _unstablerethrow.unstable_rethrow;
    }
});
const _readonlyurlsearchparams = __turbopack_context__.r("[project]/web/node_modules/next/dist/client/components/readonly-url-search-params.js [app-ssr] (ecmascript)");
const _redirect = __turbopack_context__.r("[project]/web/node_modules/next/dist/client/components/redirect.js [app-ssr] (ecmascript)");
const _notfound = __turbopack_context__.r("[project]/web/node_modules/next/dist/client/components/not-found.js [app-ssr] (ecmascript)");
const _forbidden = __turbopack_context__.r("[project]/web/node_modules/next/dist/client/components/forbidden.js [app-ssr] (ecmascript)");
const _unauthorized = __turbopack_context__.r("[project]/web/node_modules/next/dist/client/components/unauthorized.js [app-ssr] (ecmascript)");
const _unstablerethrow = __turbopack_context__.r("[project]/web/node_modules/next/dist/client/components/unstable-rethrow.js [app-ssr] (ecmascript)");
function unstable_isUnrecognizedActionError() {
    throw new Error('`unstable_isUnrecognizedActionError` can only be used on the client.');
}
const RedirectType = {
    push: 'push',
    replace: 'replace'
};
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/web/node_modules/next/dist/client/components/not-found.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "notFound", {
    enumerable: true,
    get: function() {
        return notFound;
    }
});
const _httpaccessfallback = __turbopack_context__.r("[project]/web/node_modules/next/dist/client/components/http-access-fallback/http-access-fallback.js [app-ssr] (ecmascript)");
/**
 * This function allows you to render the [not-found.js file](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)
 * within a route segment as well as inject a tag.
 *
 * `notFound()` can be used in
 * [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components),
 * [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers), and
 * [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations).
 *
 * - In a Server Component, this will insert a `<meta name="robots" content="noindex" />` meta tag and set the status code to 404.
 * - In a Route Handler or Server Action, it will serve a 404 to the caller.
 *
 * Read more: [Next.js Docs: `notFound`](https://nextjs.org/docs/app/api-reference/functions/not-found)
 */ const DIGEST = `${_httpaccessfallback.HTTP_ERROR_FALLBACK_ERROR_CODE};404`;
function notFound() {
    const error = new Error(DIGEST);
    error.digest = DIGEST;
    throw error;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/web/node_modules/next/dist/client/components/readonly-url-search-params.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * ReadonlyURLSearchParams implementation shared between client and server.
 * This file is intentionally not marked as 'use client' or 'use server'
 * so it can be imported by both environments.
 */ /** @internal */ Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ReadonlyURLSearchParams", {
    enumerable: true,
    get: function() {
        return ReadonlyURLSearchParams;
    }
});
class ReadonlyURLSearchParamsError extends Error {
    constructor(){
        super('Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams');
    }
}
class ReadonlyURLSearchParams extends URLSearchParams {
    /** @deprecated Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams */ append() {
        throw new ReadonlyURLSearchParamsError();
    }
    /** @deprecated Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams */ delete() {
        throw new ReadonlyURLSearchParamsError();
    }
    /** @deprecated Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams */ set() {
        throw new ReadonlyURLSearchParamsError();
    }
    /** @deprecated Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams */ sort() {
        throw new ReadonlyURLSearchParamsError();
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
"[project]/web/node_modules/next/dist/client/components/redirect-error.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    REDIRECT_ERROR_CODE: null,
    isRedirectError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    REDIRECT_ERROR_CODE: function() {
        return REDIRECT_ERROR_CODE;
    },
    isRedirectError: function() {
        return isRedirectError;
    }
});
const _redirectstatuscode = __turbopack_context__.r("[project]/web/node_modules/next/dist/client/components/redirect-status-code.js [app-ssr] (ecmascript)");
const REDIRECT_ERROR_CODE = 'NEXT_REDIRECT';
function isRedirectError(error) {
    if (typeof error !== 'object' || error === null || !('digest' in error) || typeof error.digest !== 'string') {
        return false;
    }
    const digest = error.digest.split(';');
    const [errorCode, type] = digest;
    const destination = digest.slice(2, -2).join(';');
    const status = digest.at(-2);
    const statusCode = Number(status);
    return errorCode === REDIRECT_ERROR_CODE && (type === 'replace' || type === 'push') && typeof destination === 'string' && !isNaN(statusCode) && statusCode in _redirectstatuscode.RedirectStatusCode;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/web/node_modules/next/dist/client/components/redirect-status-code.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RedirectStatusCode", {
    enumerable: true,
    get: function() {
        return RedirectStatusCode;
    }
});
var RedirectStatusCode = /*#__PURE__*/ function(RedirectStatusCode) {
    RedirectStatusCode[RedirectStatusCode["SeeOther"] = 303] = "SeeOther";
    RedirectStatusCode[RedirectStatusCode["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    RedirectStatusCode[RedirectStatusCode["PermanentRedirect"] = 308] = "PermanentRedirect";
    return RedirectStatusCode;
}({});
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/web/node_modules/next/dist/client/components/redirect.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getRedirectError: null,
    getRedirectStatusCodeFromError: null,
    getRedirectTypeFromError: null,
    getURLFromRedirectError: null,
    permanentRedirect: null,
    redirect: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getRedirectError: function() {
        return getRedirectError;
    },
    getRedirectStatusCodeFromError: function() {
        return getRedirectStatusCodeFromError;
    },
    getRedirectTypeFromError: function() {
        return getRedirectTypeFromError;
    },
    getURLFromRedirectError: function() {
        return getURLFromRedirectError;
    },
    permanentRedirect: function() {
        return permanentRedirect;
    },
    redirect: function() {
        return redirect;
    }
});
const _redirectstatuscode = __turbopack_context__.r("[project]/web/node_modules/next/dist/client/components/redirect-status-code.js [app-ssr] (ecmascript)");
const _redirecterror = __turbopack_context__.r("[project]/web/node_modules/next/dist/client/components/redirect-error.js [app-ssr] (ecmascript)");
const _serverasyncstorage = __turbopack_context__.r("[project]/web/node_modules/next/dist/client/components/server-async-storage.js [app-ssr] (ecmascript)");
function getRedirectError(url, type, statusCode = _redirectstatuscode.RedirectStatusCode.TemporaryRedirect) {
    const error = new Error(_redirecterror.REDIRECT_ERROR_CODE);
    error.digest = `${_redirecterror.REDIRECT_ERROR_CODE};${type};${url};${statusCode};`;
    return error;
}
function redirect(/** The URL to redirect to */ url, type) {
    type ??= _serverasyncstorage.actionAsyncStorage?.getStore()?.isAction ? 'push' : 'replace';
    throw getRedirectError(url, type, _redirectstatuscode.RedirectStatusCode.TemporaryRedirect);
}
function permanentRedirect(/** The URL to redirect to */ url, type = 'replace') {
    throw getRedirectError(url, type, _redirectstatuscode.RedirectStatusCode.PermanentRedirect);
}
function getURLFromRedirectError(error) {
    if (!(0, _redirecterror.isRedirectError)(error)) return null;
    // Slices off the beginning of the digest that contains the code and the
    // separating ';'.
    return error.digest.split(';').slice(2, -2).join(';');
}
function getRedirectTypeFromError(error) {
    if (!(0, _redirecterror.isRedirectError)(error)) {
        throw new Error('Not a redirect error');
    }
    return error.digest.split(';', 2)[1];
}
function getRedirectStatusCodeFromError(error) {
    if (!(0, _redirecterror.isRedirectError)(error)) {
        throw new Error('Not a redirect error');
    }
    return Number(error.digest.split(';').at(-2));
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/web/node_modules/next/dist/client/components/server-async-storage.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Client-safe access to the server-only async-storage singletons. On the
// server these re-export the real storages; in the browser bundle this module
// is aliased to `./server-async-storage.browser` (see
// scripts/generate-browser-variant-aliases.mjs), which exports `undefined`
// stubs so the AsyncLocalStorage modules are never bundled into the client.
// Consumers must guard usage so the stubs are not dereferenced in the browser.
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    actionAsyncStorage: null,
    workAsyncStorage: null,
    workUnitAsyncStorage: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    actionAsyncStorage: function() {
        return _actionasyncstorageexternal.actionAsyncStorage;
    },
    workAsyncStorage: function() {
        return _workasyncstorageexternal.workAsyncStorage;
    },
    workUnitAsyncStorage: function() {
        return _workunitasyncstorageexternal.workUnitAsyncStorage;
    }
});
const _actionasyncstorageexternal = __turbopack_context__.r("[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)");
const _workasyncstorageexternal = __turbopack_context__.r("[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)");
const _workunitasyncstorageexternal = __turbopack_context__.r("[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)");
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/web/node_modules/next/dist/client/components/static-generation-bailout.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    StaticGenBailoutError: null,
    isStaticGenBailoutError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    StaticGenBailoutError: function() {
        return StaticGenBailoutError;
    },
    isStaticGenBailoutError: function() {
        return isStaticGenBailoutError;
    }
});
const NEXT_STATIC_GEN_BAILOUT = 'NEXT_STATIC_GEN_BAILOUT';
class StaticGenBailoutError extends Error {
    constructor(...args){
        super(...args), this.code = NEXT_STATIC_GEN_BAILOUT;
    }
}
function isStaticGenBailoutError(error) {
    if (typeof error !== 'object' || error === null || !('code' in error)) {
        return false;
    }
    return error.code === NEXT_STATIC_GEN_BAILOUT;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/web/node_modules/next/dist/client/components/unauthorized.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "unauthorized", {
    enumerable: true,
    get: function() {
        return unauthorized;
    }
});
const _httpaccessfallback = __turbopack_context__.r("[project]/web/node_modules/next/dist/client/components/http-access-fallback/http-access-fallback.js [app-ssr] (ecmascript)");
// TODO: Add `unauthorized` docs
/**
 * @experimental
 * This function allows you to render the [unauthorized.js file](https://nextjs.org/docs/app/api-reference/file-conventions/unauthorized)
 * within a route segment as well as inject a tag.
 *
 * `unauthorized()` can be used in
 * [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components),
 * [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers), and
 * [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations).
 *
 *
 * Read more: [Next.js Docs: `unauthorized`](https://nextjs.org/docs/app/api-reference/functions/unauthorized)
 */ const DIGEST = `${_httpaccessfallback.HTTP_ERROR_FALLBACK_ERROR_CODE};401`;
function unauthorized() {
    if ("TURBOPACK compile-time truthy", 1) {
        throw new Error(`\`unauthorized()\` is experimental and only allowed to be used when \`experimental.authInterrupts\` is enabled.`);
    }
    const error = new Error(DIGEST);
    error.digest = DIGEST;
    throw error;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/web/node_modules/next/dist/client/components/unrecognized-action-error.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    UnrecognizedActionError: null,
    unstable_isUnrecognizedActionError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    UnrecognizedActionError: function() {
        return UnrecognizedActionError;
    },
    unstable_isUnrecognizedActionError: function() {
        return unstable_isUnrecognizedActionError;
    }
});
class UnrecognizedActionError extends Error {
    constructor(...args){
        super(...args);
        this.name = 'UnrecognizedActionError';
    }
}
function unstable_isUnrecognizedActionError(error) {
    return !!(error && typeof error === 'object' && error instanceof UnrecognizedActionError);
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/web/node_modules/next/dist/client/components/unstable-rethrow.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "unstable_rethrow", {
    enumerable: true,
    get: function() {
        return unstable_rethrow;
    }
});
const _dynamicrenderingutils = __turbopack_context__.r("[project]/web/node_modules/next/dist/server/dynamic-rendering-utils.js [app-ssr] (ecmascript)");
const _bailouttocsr = __turbopack_context__.r("[project]/web/node_modules/next/dist/shared/lib/lazy-dynamic/bailout-to-csr.js [app-ssr] (ecmascript)");
const _isnextroutererror = __turbopack_context__.r("[project]/web/node_modules/next/dist/client/components/is-next-router-error.js [app-ssr] (ecmascript)");
const _dynamicrendering = __turbopack_context__.r("[project]/web/node_modules/next/dist/server/app-render/dynamic-rendering.js [app-ssr] (ecmascript)");
const _hooksservercontext = __turbopack_context__.r("[project]/web/node_modules/next/dist/client/components/hooks-server-context.js [app-ssr] (ecmascript)");
function unstable_rethrow(error) {
    if ((0, _isnextroutererror.isNextRouterError)(error) || (0, _bailouttocsr.isBailoutToCSRError)(error) || (0, _hooksservercontext.isDynamicServerError)(error) || (0, _dynamicrenderingutils.isHangingPromiseRejectionError)(error) || (0, _dynamicrendering.isPrerenderInterruptedError)(error)) {
        throw error;
    }
    if (error instanceof Error && 'cause' in error) {
        unstable_rethrow(error.cause);
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
"[project]/web/node_modules/next/dist/lib/framework/boundary-constants.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    METADATA_BOUNDARY_NAME: null,
    OUTLET_BOUNDARY_NAME: null,
    ROOT_LAYOUT_BOUNDARY_NAME: null,
    VIEWPORT_BOUNDARY_NAME: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    METADATA_BOUNDARY_NAME: function() {
        return METADATA_BOUNDARY_NAME;
    },
    OUTLET_BOUNDARY_NAME: function() {
        return OUTLET_BOUNDARY_NAME;
    },
    ROOT_LAYOUT_BOUNDARY_NAME: function() {
        return ROOT_LAYOUT_BOUNDARY_NAME;
    },
    VIEWPORT_BOUNDARY_NAME: function() {
        return VIEWPORT_BOUNDARY_NAME;
    }
});
const METADATA_BOUNDARY_NAME = '__next_metadata_boundary__';
const VIEWPORT_BOUNDARY_NAME = '__next_viewport_boundary__';
const OUTLET_BOUNDARY_NAME = '__next_outlet_boundary__';
const ROOT_LAYOUT_BOUNDARY_NAME = '__next_root_layout_boundary__';
}),
"[project]/web/node_modules/next/dist/lib/scheduler.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    atLeastOneTask: null,
    scheduleImmediate: null,
    scheduleOnNextTick: null,
    waitAtLeastOneReactRenderTask: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    atLeastOneTask: function() {
        return atLeastOneTask;
    },
    scheduleImmediate: function() {
        return scheduleImmediate;
    },
    scheduleOnNextTick: function() {
        return scheduleOnNextTick;
    },
    waitAtLeastOneReactRenderTask: function() {
        return waitAtLeastOneReactRenderTask;
    }
});
const scheduleOnNextTick = (cb)=>{
    // We use Promise.resolve().then() here so that the operation is scheduled at
    // the end of the promise job queue, we then add it to the next process tick
    // to ensure it's evaluated afterwards.
    //
    // This was inspired by the implementation of the DataLoader interface: https://github.com/graphql/dataloader/blob/d336bd15282664e0be4b4a657cb796f09bafbc6b/src/index.js#L213-L255
    //
    Promise.resolve().then(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        else {
            process.nextTick(cb);
        }
    });
};
const scheduleImmediate = (cb)=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        setImmediate(cb);
    }
};
function atLeastOneTask() {
    return new Promise((resolve)=>scheduleImmediate(resolve));
}
function waitAtLeastOneReactRenderTask() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        return new Promise((r)=>setImmediate(r));
    }
}
}),
"[project]/web/node_modules/next/dist/server/app-render/blocking-route-messages.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createDynamicBodyError: null,
    createDynamicBodyErrorInNavigation: null,
    createDynamicBodyErrorInStaticRoute: null,
    createDynamicMetadataError: null,
    createDynamicMetadataErrorInStaticRoute: null,
    createDynamicOrRuntimeBodyError: null,
    createDynamicOrRuntimeMetadataError: null,
    createDynamicOrRuntimeViewportError: null,
    createDynamicViewportError: null,
    createDynamicViewportErrorInStaticRoute: null,
    createLinkBodyErrorInNavigation: null,
    createLinkMetadataError: null,
    createLinkViewportError: null,
    createNavigationBodyErrorInNavigation: null,
    createNavigationMetadataError: null,
    createNavigationViewportError: null,
    createNonPrerenderableBodyErrorInStaticRoute: null,
    createNonPrerenderableMetadataErrorInStaticRoute: null,
    createNonPrerenderableViewportErrorInStaticRoute: null,
    createPrefetchBodyErrorInNavigation: null,
    createPrefetchMetadataError: null,
    createPrefetchViewportError: null,
    createRuntimeBodyError: null,
    createRuntimeBodyErrorInNavigation: null,
    createRuntimeBodyErrorInStaticRoute: null,
    createRuntimeMetadataError: null,
    createRuntimeMetadataErrorInStaticRoute: null,
    createRuntimeViewportError: null,
    createRuntimeViewportErrorInStaticRoute: null,
    logBuildDebugHint: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    createDynamicBodyError: function() {
        return createDynamicBodyError;
    },
    createDynamicBodyErrorInNavigation: function() {
        return createDynamicBodyErrorInNavigation;
    },
    createDynamicBodyErrorInStaticRoute: function() {
        return createDynamicBodyErrorInStaticRoute;
    },
    createDynamicMetadataError: function() {
        return createDynamicMetadataError;
    },
    createDynamicMetadataErrorInStaticRoute: function() {
        return createDynamicMetadataErrorInStaticRoute;
    },
    createDynamicOrRuntimeBodyError: function() {
        return createDynamicOrRuntimeBodyError;
    },
    createDynamicOrRuntimeMetadataError: function() {
        return createDynamicOrRuntimeMetadataError;
    },
    createDynamicOrRuntimeViewportError: function() {
        return createDynamicOrRuntimeViewportError;
    },
    createDynamicViewportError: function() {
        return createDynamicViewportError;
    },
    createDynamicViewportErrorInStaticRoute: function() {
        return createDynamicViewportErrorInStaticRoute;
    },
    createLinkBodyErrorInNavigation: function() {
        return createLinkBodyErrorInNavigation;
    },
    createLinkMetadataError: function() {
        return createLinkMetadataError;
    },
    createLinkViewportError: function() {
        return createLinkViewportError;
    },
    createNavigationBodyErrorInNavigation: function() {
        return createNavigationBodyErrorInNavigation;
    },
    createNavigationMetadataError: function() {
        return createNavigationMetadataError;
    },
    createNavigationViewportError: function() {
        return createNavigationViewportError;
    },
    createNonPrerenderableBodyErrorInStaticRoute: function() {
        return createNonPrerenderableBodyErrorInStaticRoute;
    },
    createNonPrerenderableMetadataErrorInStaticRoute: function() {
        return createNonPrerenderableMetadataErrorInStaticRoute;
    },
    createNonPrerenderableViewportErrorInStaticRoute: function() {
        return createNonPrerenderableViewportErrorInStaticRoute;
    },
    createPrefetchBodyErrorInNavigation: function() {
        return createPrefetchBodyErrorInNavigation;
    },
    createPrefetchMetadataError: function() {
        return createPrefetchMetadataError;
    },
    createPrefetchViewportError: function() {
        return createPrefetchViewportError;
    },
    createRuntimeBodyError: function() {
        return createRuntimeBodyError;
    },
    createRuntimeBodyErrorInNavigation: function() {
        return createRuntimeBodyErrorInNavigation;
    },
    createRuntimeBodyErrorInStaticRoute: function() {
        return createRuntimeBodyErrorInStaticRoute;
    },
    createRuntimeMetadataError: function() {
        return createRuntimeMetadataError;
    },
    createRuntimeMetadataErrorInStaticRoute: function() {
        return createRuntimeMetadataErrorInStaticRoute;
    },
    createRuntimeViewportError: function() {
        return createRuntimeViewportError;
    },
    createRuntimeViewportErrorInStaticRoute: function() {
        return createRuntimeViewportErrorInStaticRoute;
    },
    logBuildDebugHint: function() {
        return logBuildDebugHint;
    }
});
function createRuntimeBodyError(route) {
    return new Error(`Route "${route}": Next.js encountered runtime data during prerendering.\n\n` + `\`cookies()\`, \`headers()\`, \`params\`, or \`searchParams\` accessed outside of \`<Suspense>\` prevents the route from being prerendered, blocking the page load and leading to a slower user experience.\n\n` + `Ways to fix this:\n` + `  - [stream] Provide a placeholder with \`<Suspense fallback={...}>\` around the data access\n` + `  - [block] Set \`export const instant = false\` to allow a blocking route\n\n` + `Learn more: https://nextjs.org/docs/messages/blocking-prerender-runtime`);
}
function createDynamicBodyError(route) {
    return new Error(`Route "${route}": Next.js encountered uncached data during prerendering.\n\n` + `\`fetch(...)\` or \`connection()\` accessed outside of \`<Suspense>\` prevents the route from being prerendered, blocking the page load and leading to a slower user experience.\n\n` + `Ways to fix this:\n` + `  - [stream] Provide a placeholder with \`<Suspense fallback={...}>\` around the data access\n` + `  - [cache] Cache the data access with \`"use cache"\` (does not apply to \`connection()\`)\n` + `  - [block] Set \`export const instant = false\` to allow a blocking route\n\n` + `Learn more: https://nextjs.org/docs/messages/blocking-prerender-dynamic`);
}
function createRuntimeBodyErrorInNavigation(route) {
    return new Error(`Route "${route}": Next.js encountered runtime data during prerendering or a navigation.\n\n` + `\`cookies()\`, \`headers()\`, \`params\`, or \`searchParams\` accessed outside of \`<Suspense>\` prevents the route from being prerendered or the navigation from being instant, leading to a slower user experience.\n\n` + `Ways to fix this:\n` + `  - [stream] Provide a placeholder with \`<Suspense fallback={...}>\` around the data access\n` + `  - [block] Set \`export const instant = false\` to allow a blocking route\n\n` + `Learn more: https://nextjs.org/docs/messages/blocking-prerender-runtime`);
}
function createLinkBodyErrorInNavigation(route) {
    return new Error(`Route "${route}": Next.js encountered URL data during prerendering or a navigation.\n\n` + `\`params\` or \`searchParams\` accessed outside of \`<Suspense>\` may prevent the navigation from being instant, leading to a slower user experience.\n\n` + `Ways to fix this:\n` + `  - [stream] Provide a placeholder with \`<Suspense fallback={...}>\` around the data access\n` + `  - [block] Set \`export const instant = false\` to allow a blocking route\n\n` + `Learn more: https://nextjs.org/docs/messages/instant-shell-url-data`);
}
function createNavigationBodyErrorInNavigation(route) {
    return new Error(`Route "${route}": Next.js encountered \`navigation()\` during prerendering or a navigation.\n\n` + `\`navigation()\` called outside of \`<Suspense>\` may prevent the navigation from being instant, leading to a slower user experience.\n\n` + `Ways to fix this:\n` + `  - [stream] Provide a placeholder with \`<Suspense fallback={...}>\` around the component that calls \`navigation()\`\n` + `  - [block] Set \`export const instant = false\` to allow a blocking route\n\n` + `Learn more: https://nextjs.org/docs/messages/instant-navigation-stage`);
}
function createPrefetchBodyErrorInNavigation(route) {
    return new Error(`Route "${route}": Next.js encountered \`prefetch()\` during prerendering or a navigation.\n\n` + `\`prefetch()\` called outside of \`<Suspense>\` may prevent the navigation from being instant, leading to a slower user experience.\n\n` + `Ways to fix this:\n` + `  - [stream] Provide a placeholder with \`<Suspense fallback={...}>\` around the component that calls \`prefetch()\`\n` + `  - [block] Set \`export const instant = false\` to allow a blocking route\n\n` + `Learn more: https://nextjs.org/docs/messages/instant-navigation-stage`);
}
function createDynamicBodyErrorInNavigation(route) {
    return new Error(`Route "${route}": Next.js encountered uncached data during prerendering or a navigation.\n\n` + `\`fetch(...)\` or \`connection()\` accessed outside of \`<Suspense>\` prevents the route from being prerendered or the navigation from being instant, leading to a slower user experience.\n\n` + `Ways to fix this:\n` + `  - [stream] Provide a placeholder with \`<Suspense fallback={...}>\` around the data access\n` + `  - [cache] Cache the data access with \`"use cache"\` (does not apply to \`connection()\`)\n` + `  - [block] Set \`export const instant = false\` to allow a blocking route\n\n` + `Learn more: https://nextjs.org/docs/messages/blocking-prerender-dynamic`);
}
function createDynamicOrRuntimeBodyError(route) {
    return new Error(`Route "${route}": Next.js encountered uncached or runtime data during prerendering.\n\n` + `\`fetch(...)\`, \`cookies()\`, \`headers()\`, \`params\`, \`searchParams\`, or \`connection()\` accessed outside of \`<Suspense>\` prevents the route from being prerendered, blocking the page load and leading to a slower user experience.\n\n` + `Ways to fix this:\n` + `  - [stream] Provide a placeholder with \`<Suspense fallback={...}>\` around the data access\n` + `  - [cache] For uncached data (\`fetch\`, database calls): cache the access with \`"use cache"\` (does not apply to \`connection()\`)\n` + `  - [block] Set \`export const instant = false\` to allow a blocking route\n\n` + `Learn more: https://nextjs.org/docs/messages/blocking-prerender-dynamic`);
}
function createLinkMetadataError(route) {
    return new Error(`Route "${route}": Next.js encountered URL data in \`generateMetadata()\`.\n\n` + `This route's metadata is blocked, but the rest of its content can be prefetched. \`params\` or \`searchParams\` accessed in \`generateMetadata()\` prevent it from being prefetched.\n\n` + `Ways to fix this:\n` + `  - [static] Use a static metadata export instead of \`generateMetadata()\`\n` + `  - [dynamic] Render a marker component that calls \`await connection()\` inside \`<Suspense>\` on the page\n\n` + `Learn more: https://nextjs.org/docs/messages/blocking-prerender-metadata-runtime`);
}
function createRuntimeMetadataError(route) {
    return new Error(`Route "${route}": Next.js encountered runtime data in \`generateMetadata()\`.\n\n` + `This route's metadata is blocked, but the rest of its content can be prerendered. \`cookies()\`, \`headers()\`, \`params\`, or \`searchParams\` accessed in \`generateMetadata()\` cause it to run dynamically.\n\n` + `Ways to fix this:\n` + `  - [static] Use a static metadata export instead of \`generateMetadata()\`\n` + `  - [dynamic] Render a marker component that calls \`await connection()\` inside \`<Suspense>\` on the page\n\n` + `Learn more: https://nextjs.org/docs/messages/blocking-prerender-metadata-runtime`);
}
function createNavigationMetadataError(route) {
    return new Error(`Route "${route}": Next.js encountered \`navigation()\` in \`generateMetadata()\`.\n\n` + `Metadata can already stream without blocking the route's UI, so delaying it until navigation may be unintentional.\n\n` + `Ways to fix this:\n` + `  - [remove] Remove \`navigation()\` from \`generateMetadata()\`\n` + `  - [mark] Render a marker component that calls \`await navigation()\` inside \`<Suspense>\` on the page\n\n` + `Learn more: https://nextjs.org/docs/messages/instant-navigation-stage-metadata`);
}
function createPrefetchMetadataError(route) {
    return new Error(`Route "${route}": Next.js encountered \`prefetch()\` in \`generateMetadata()\`.\n\n` + `Metadata can already stream without blocking the route's UI, so delaying it until a per-link prefetch or navigation may be unintentional.\n\n` + `Ways to fix this:\n` + `  - [remove] Remove \`prefetch()\` from \`generateMetadata()\`\n` + `  - [mark] Render a marker component that calls \`await prefetch()\` inside \`<Suspense>\` on the page\n\n` + `Learn more: https://nextjs.org/docs/messages/instant-navigation-stage-metadata`);
}
function createDynamicMetadataError(route) {
    return new Error(`Route "${route}": Next.js encountered uncached data in \`generateMetadata()\`.\n\n` + `This route's metadata is blocked, but the rest of its content can be prerendered. \`fetch(...)\` or \`connection()\` accessed in \`generateMetadata()\` cause it to run dynamically.\n\n` + `Ways to fix this:\n` + `  - [cache] Cache the metadata with \`"use cache"\` in \`generateMetadata()\` (does not apply to \`connection()\`)\n` + `  - [dynamic] Render a marker component that calls \`await connection()\` inside \`<Suspense>\` on the page\n\n` + `Learn more: https://nextjs.org/docs/messages/blocking-prerender-metadata-dynamic`);
}
function createLinkViewportError(route) {
    return new Error(`Route "${route}": Next.js encountered URL data in \`generateViewport()\`.\n\n` + `\`params\` or \`searchParams\` in \`generateViewport()\` prevents the page from being prerendered, leading to a slower user experience.\n\n` + `Ways to fix this:\n` + `  - [static] Use a static viewport export instead of \`generateViewport()\`\n` + `  - [block] Set \`export const instant = false\` to allow a blocking route\n\n` + `Learn more: https://nextjs.org/docs/messages/blocking-prerender-viewport-runtime`);
}
function createRuntimeViewportError(route) {
    return new Error(`Route "${route}": Next.js encountered runtime data in \`generateViewport()\`.\n\n` + `\`cookies()\`, \`headers()\`, \`params\`, or \`searchParams\` in \`generateViewport()\` prevents the page from being prerendered, leading to a slower user experience.\n\n` + `Ways to fix this:\n` + `  - [static] Use a static viewport export instead of \`generateViewport()\`\n` + `  - [block] Set \`export const instant = false\` to allow a blocking route\n\n` + `Learn more: https://nextjs.org/docs/messages/blocking-prerender-viewport-runtime`);
}
function createNavigationViewportError(route) {
    return new Error(`Route "${route}": Next.js encountered \`navigation()\` in \`generateViewport()\`.\n\n` + `This prevents Next.js from creating the App Shell, leading to a slower user experience.\n\n` + `Ways to fix this:\n` + `  - [remove] Remove \`navigation()\` from \`generateViewport()\`\n` + `  - [ignore] Set \`export const instant = false\` to disable validation for this segment\n\n` + `Learn more: https://nextjs.org/docs/messages/instant-navigation-stage-viewport`);
}
function createPrefetchViewportError(route) {
    return new Error(`Route "${route}": Next.js encountered \`prefetch()\` in \`generateViewport()\`.\n\n` + `This prevents Next.js from creating the App Shell, leading to a slower user experience.\n\n` + `Ways to fix this:\n` + `  - [remove] Remove \`prefetch()\` from \`generateViewport()\`\n` + `  - [ignore] Set \`export const instant = false\` to disable validation for this segment\n\n` + `Learn more: https://nextjs.org/docs/messages/instant-navigation-stage-viewport`);
}
function createDynamicViewportError(route) {
    return new Error(`Route "${route}": Next.js encountered uncached data in \`generateViewport()\`.\n\n` + `\`fetch(...)\` or \`connection()\` in \`generateViewport()\` prevents the page from being prerendered, leading to a slower user experience.\n\n` + `Ways to fix this:\n` + `  - [cache] Cache the viewport data with \`"use cache"\` in \`generateViewport()\` (does not apply to \`connection()\`)\n` + `  - [block] Set \`export const instant = false\` to allow a blocking route\n\n` + `Learn more: https://nextjs.org/docs/messages/blocking-prerender-viewport-dynamic`);
}
function createDynamicOrRuntimeViewportError(route) {
    return new Error(`Route "${route}": Next.js encountered uncached or runtime data in \`generateViewport()\`.\n\n` + `This prevents the page from being prerendered, leading to a slower user experience. Unlike metadata, viewport cannot be streamed behind \`<Suspense>\` because it affects the initial page load.\n\n` + `Ways to fix this:\n` + `  - [static] Use a static viewport export instead of \`generateViewport()\`\n` + `  - [cache] For uncached data (\`fetch\`, database calls): cache the viewport with \`"use cache"\` in \`generateViewport()\` (does not apply to \`connection()\`)\n` + `  - [block] Set \`export const instant = false\` to allow a blocking route\n\n` + `Learn more: https://nextjs.org/docs/messages/blocking-prerender-viewport-runtime`);
}
function createDynamicOrRuntimeMetadataError(route) {
    return new Error(`Route "${route}": Next.js encountered uncached or runtime data in \`generateMetadata()\`.\n\n` + `This route's metadata is blocked, but the rest of its content can be prerendered.\n\n` + `Ways to fix this:\n` + `  - [static] Use a static metadata export instead of \`generateMetadata()\`\n` + `  - [cache] Cache the metadata with \`"use cache"\` in \`generateMetadata()\` (does not apply to \`connection()\`)\n` + `  - [dynamic] Render a marker component that calls \`await connection()\` inside \`<Suspense>\` on the page\n\n` + `Learn more: https://nextjs.org/docs/messages/blocking-prerender-metadata-runtime`);
}
function createRuntimeBodyErrorInStaticRoute(route) {
    return new Error(`Route "${route}": Next.js encountered runtime data on a route that must be fully static.\n\n` + `This route is configured to be fully static, but runtime data from \`cookies()\`, \`headers()\`, \`params\`, \`searchParams\`, or a short-lived cache requires rendering at request time.\n\n` + `Ways to fix this:\n` + `  - [remove] Remove the data access\n` + `  - [client] Read the data on the client\n\n` + `Learn more: https://nextjs.org/docs/messages/static-route-runtime`);
}
function createDynamicBodyErrorInStaticRoute(route) {
    return new Error(`Route "${route}": Next.js encountered uncached data on a route that must be fully static.\n\n` + `This route is configured to be fully static, but an uncached \`fetch(...)\`, database call, or \`connection()\` requires rendering at request time.\n\n` + `Ways to fix this:\n` + `  - [cache] Cache the data access with \`"use cache"\` (does not apply to \`connection()\`)\n` + `  - [remove] Remove the data access\n` + `  - [client] Read the data on the client\n\n` + `Learn more: https://nextjs.org/docs/messages/static-route-dynamic`);
}
function createNonPrerenderableBodyErrorInStaticRoute(route) {
    return new Error(`Route "${route}": Next.js encountered uncached or runtime data on a route that must be fully static.\n\n` + `This route is configured to be fully static, but some data requires rendering at request time.\n\n` + `Ways to fix this:\n` + `  - [cache] For uncached data (\`fetch\`, database calls): cache the access with \`"use cache"\` (does not apply to \`connection()\`)\n` + `  - [remove] Remove the data access\n` + `  - [client] Read the data on the client\n\n` + `Learn more: https://nextjs.org/docs/messages/static-route-dynamic`);
}
function createRuntimeMetadataErrorInStaticRoute(route) {
    return new Error(`Route "${route}": Next.js encountered runtime data in \`generateMetadata()\` on a route that must be fully static.\n\n` + `This route is configured to be fully static, but runtime data from \`cookies()\`, \`headers()\`, \`params\`, \`searchParams\`, or a short-lived cache requires rendering at request time.\n\n` + `Ways to fix this:\n` + `  - [static] Replace the dynamic data used by \`generateMetadata()\` with static data\n\n` + `Learn more: https://nextjs.org/docs/messages/static-metadata-runtime`);
}
function createDynamicMetadataErrorInStaticRoute(route) {
    return new Error(`Route "${route}": Next.js encountered uncached data in \`generateMetadata()\` on a route that must be fully static.\n\n` + `This route is configured to be fully static, but an uncached \`fetch(...)\`, database call, or \`connection()\` requires rendering at request time.\n\n` + `Ways to fix this:\n` + `  - [cache] Cache the data used by \`generateMetadata()\` with \`"use cache"\` (does not apply to \`connection()\`)\n` + `  - [static] Replace the dynamic data used by \`generateMetadata()\` with static data\n\n` + `Learn more: https://nextjs.org/docs/messages/static-metadata-dynamic`);
}
function createNonPrerenderableMetadataErrorInStaticRoute(route) {
    return new Error(`Route "${route}": Next.js encountered uncached or runtime data in \`generateMetadata()\` on a route that must be fully static.\n\n` + `This route is configured to be fully static, but some data requires rendering at request time.\n\n` + `Ways to fix this:\n` + `  - [cache] For uncached data: cache the data used by \`generateMetadata()\` with \`"use cache"\` (does not apply to \`connection()\`)\n` + `  - [static] Replace the dynamic data used by \`generateMetadata()\` with static data\n\n` + `Learn more: https://nextjs.org/docs/messages/static-metadata-dynamic`);
}
function createRuntimeViewportErrorInStaticRoute(route) {
    return new Error(`Route "${route}": Next.js encountered runtime data in \`generateViewport()\` on a route that must be fully static.\n\n` + `This route is configured to be fully static, but runtime data from \`cookies()\`, \`headers()\`, \`params\`, \`searchParams\`, or a short-lived cache requires rendering at request time.\n\n` + `Ways to fix this:\n` + `  - [static] Replace the dynamic data used by \`generateViewport()\` with static data\n\n` + `Learn more: https://nextjs.org/docs/messages/static-viewport-runtime`);
}
function createDynamicViewportErrorInStaticRoute(route) {
    return new Error(`Route "${route}": Next.js encountered uncached data in \`generateViewport()\` on a route that must be fully static.\n\n` + `This route is configured to be fully static, but an uncached \`fetch(...)\`, database call, or \`connection()\` requires rendering at request time.\n\n` + `Ways to fix this:\n` + `  - [cache] Cache the data used by \`generateViewport()\` with \`"use cache"\` (does not apply to \`connection()\`)\n` + `  - [static] Replace the dynamic data used by \`generateViewport()\` with static data\n\n` + `Learn more: https://nextjs.org/docs/messages/static-viewport-dynamic`);
}
function createNonPrerenderableViewportErrorInStaticRoute(route) {
    return new Error(`Route "${route}": Next.js encountered uncached or runtime data in \`generateViewport()\` on a route that must be fully static.\n\n` + `This route is configured to be fully static, but some data requires rendering at request time.\n\n` + `Ways to fix this:\n` + `  - [cache] For uncached data: cache the data used by \`generateViewport()\` with \`"use cache"\` (does not apply to \`connection()\`)\n` + `  - [static] Replace the dynamic data used by \`generateViewport()\` with static data\n\n` + `Learn more: https://nextjs.org/docs/messages/static-viewport-dynamic`);
}
function logBuildDebugHint(route) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
}
}),
"[project]/web/node_modules/next/dist/server/app-render/dynamic-rendering-client.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    useDynamicRouteParams: null,
    useDynamicSearchParams: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    useDynamicRouteParams: function() {
        return useDynamicRouteParams;
    },
    useDynamicSearchParams: function() {
        return useDynamicSearchParams;
    }
});
const _react = /*#__PURE__*/ _interop_require_default(__turbopack_context__.r("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)"));
const _reactdom = __turbopack_context__.r("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)");
const _workunitasyncstorageexternal = __turbopack_context__.r("[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)");
const _workasyncstorageexternal = __turbopack_context__.r("[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)");
const _dynamicrenderingutils = __turbopack_context__.r("[project]/web/node_modules/next/dist/server/dynamic-rendering-utils.js [app-ssr] (ecmascript)");
const _invarianterror = __turbopack_context__.r("[project]/web/node_modules/next/dist/shared/lib/invariant-error.js [app-ssr] (ecmascript)");
const _bailouttocsr = __turbopack_context__.r("[project]/web/node_modules/next/dist/shared/lib/lazy-dynamic/bailout-to-csr.js [app-ssr] (ecmascript)");
const _reactbrowserbailout = __turbopack_context__.r("[project]/web/node_modules/next/dist/shared/lib/lazy-dynamic/react-browser-bailout.js [app-ssr] (ecmascript)");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const getUseSearchParamsBailoutReason = _reactbrowserbailout.createReactBrowserBailoutReason.bind(null, 'useSearchParams()');
function useDynamicRouteParams(expression) {
    const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
    const workUnitStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
    if (workStore && workUnitStore) {
        switch(workUnitStore.type){
            case 'prerender-client':
                {
                    const fallbackParams = workUnitStore.fallbackRouteParams;
                    if (fallbackParams && fallbackParams.size > 0) {
                        // We are in a prerender with cacheComponents semantics. We are going to
                        // hang here and never resolve. This will cause the currently
                        // rendering component to effectively be a dynamic hole.
                        _react.default.use((0, _dynamicrenderingutils.makeClientHookHangingPromise)(workUnitStore.renderSignal, new _dynamicrenderingutils.ClientHookDynamicError(workStore.route, expression)));
                    }
                    break;
                }
            case 'prerender':
                throw new _invarianterror.InvariantError(`\`${expression}\` was called from a Server Component. Next.js should be preventing ${expression} from being included in server components statically, but did not in this case.`);
            case 'validation-client':
                {
                    break;
                }
            case 'prerender-runtime':
                throw new _invarianterror.InvariantError(`\`${expression}\` was called during a runtime prerender. Next.js should be preventing ${expression} from being included in server components statically, but did not in this case.`);
            case 'cache':
            case 'private-cache':
                throw new _invarianterror.InvariantError(`\`${expression}\` was called inside a cache scope. Next.js should be preventing ${expression} from being included in server components statically, but did not in this case.`);
            case 'build-time-generator':
                throw new _invarianterror.InvariantError(`\`${expression}\` was called in \`${workUnitStore.functionName}\`. Next.js should be preventing ${expression} from being included in server component files statically, but did not in this case.`);
            case 'prerender-legacy':
            case 'request':
            case 'unstable-cache':
                break;
            default:
                workUnitStore;
        }
    }
}
function useDynamicSearchParams(expression) {
    const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
    const workUnitStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
    if (!workStore) {
        // We assume pages router context and just return
        return;
    }
    if (!workUnitStore) {
        (0, _workunitasyncstorageexternal.throwForMissingRequestStore)(expression);
    }
    switch(workUnitStore.type){
        case 'validation-client':
            // During instant validation we try to behave as close to client as possible,
            // so this shouldn't hang during SSR.
            return;
        case 'prerender-client':
            {
                _react.default.use((0, _dynamicrenderingutils.makeClientHookHangingPromise)(workUnitStore.renderSignal, new _dynamicrenderingutils.ClientHookDynamicError(workStore.route, expression)));
                break;
            }
        case 'prerender-legacy':
            {
                if (workStore.forceStatic) {
                    return;
                }
                if ("TURBOPACK compile-time truthy", 1) {
                    // @ts-expect-error TODO: Update @types/react-dom to include the reason argument.
                    _react.default.use((0, _reactdom.browser)(getUseSearchParamsBailoutReason));
                    return;
                } else //TURBOPACK unreachable
                ;
            }
        case 'prerender':
        case 'prerender-runtime':
            throw new _invarianterror.InvariantError(`\`${expression}\` was called from a Server Component. Next.js should be preventing ${expression} from being included in server components statically, but did not in this case.`);
        case 'cache':
        case 'unstable-cache':
        case 'private-cache':
            throw new _invarianterror.InvariantError(`\`${expression}\` was called inside a cache scope. Next.js should be preventing ${expression} from being included in server components statically, but did not in this case.`);
        case 'build-time-generator':
            throw new _invarianterror.InvariantError(`\`${expression}\` was called in \`${workUnitStore.functionName}\`. Next.js should be preventing ${expression} from being included in server component files statically, but did not in this case.`);
        case 'request':
            return;
        default:
            workUnitStore;
    }
}
}),
"[project]/web/node_modules/next/dist/server/app-render/dynamic-rendering.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * The functions provided by this module are used to communicate certain properties
 * about the currently running code so that Next.js can make decisions on how to handle
 * the current execution in different rendering modes such as pre-rendering, resuming, and SSR.
 *
 * Today Next.js treats all code as potentially static. Certain APIs may only make sense when dynamically rendering.
 * Traditionally this meant deopting the entire render to dynamic however with PPR we can now deopt parts
 * of a React tree as dynamic while still keeping other parts static. There are really two different kinds of
 * Dynamic indications.
 *
 * The first is simply an intention to be dynamic. unstable_noStore is an example of this where
 * the currently executing code simply declares that the current scope is dynamic but if you use it
 * inside unstable_cache it can still be cached. This type of indication can be removed if we ever
 * make the default dynamic to begin with because the only way you would ever be static is inside
 * a cache scope which this indication does not affect.
 *
 * The second is an indication that a dynamic data source was read. This is a stronger form of dynamic
 * because it means that it is inappropriate to cache this at all. using a dynamic data source inside
 * unstable_cache should error. If you want to use some dynamic data inside unstable_cache you should
 * read that data outside the cache and pass it in as an argument to the cached function.
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    DynamicHoleKind: null,
    PreludeState: null,
    abortAndThrowOnSynchronousRequestDataAccess: null,
    abortOnSynchronousPlatformIOAccess: null,
    accessedDynamicData: null,
    annotateDynamicAccess: null,
    consumeDynamicAccess: null,
    createDynamicTrackingState: null,
    createDynamicValidationState: null,
    createHangingInputAbortSignal: null,
    createInstantValidationState: null,
    formatDynamicAPIAccesses: null,
    getDisallowedReasonsInStaticRoute: null,
    getFirstDynamicReason: null,
    getNavigationDisallowedDynamicReasons: null,
    getStaticShellDisallowedDynamicReasons: null,
    isPrerenderInterruptedError: null,
    logDisallowedDynamicError: null,
    markCurrentScopeAsDynamic: null,
    throwIfDisallowedDynamic: null,
    throwIfDisallowedDynamicInStaticRoute: null,
    throwIfSyncIOUsed: null,
    throwToInterruptStaticGeneration: null,
    trackAllowedDynamicAccess: null,
    trackDynamicAccessInStaticRoute: null,
    trackDynamicDataInDynamicRender: null,
    trackDynamicHoleInNavigation: null,
    trackDynamicHoleInStaticShell: null,
    trackThrownErrorInNavigation: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    DynamicHoleKind: function() {
        return DynamicHoleKind;
    },
    PreludeState: function() {
        return PreludeState;
    },
    abortAndThrowOnSynchronousRequestDataAccess: function() {
        return abortAndThrowOnSynchronousRequestDataAccess;
    },
    abortOnSynchronousPlatformIOAccess: function() {
        return abortOnSynchronousPlatformIOAccess;
    },
    accessedDynamicData: function() {
        return accessedDynamicData;
    },
    annotateDynamicAccess: function() {
        return annotateDynamicAccess;
    },
    consumeDynamicAccess: function() {
        return consumeDynamicAccess;
    },
    createDynamicTrackingState: function() {
        return createDynamicTrackingState;
    },
    createDynamicValidationState: function() {
        return createDynamicValidationState;
    },
    createHangingInputAbortSignal: function() {
        return createHangingInputAbortSignal;
    },
    createInstantValidationState: function() {
        return createInstantValidationState;
    },
    formatDynamicAPIAccesses: function() {
        return formatDynamicAPIAccesses;
    },
    getDisallowedReasonsInStaticRoute: function() {
        return getDisallowedReasonsInStaticRoute;
    },
    getFirstDynamicReason: function() {
        return getFirstDynamicReason;
    },
    getNavigationDisallowedDynamicReasons: function() {
        return getNavigationDisallowedDynamicReasons;
    },
    getStaticShellDisallowedDynamicReasons: function() {
        return getStaticShellDisallowedDynamicReasons;
    },
    isPrerenderInterruptedError: function() {
        return isPrerenderInterruptedError;
    },
    logDisallowedDynamicError: function() {
        return logDisallowedDynamicError;
    },
    markCurrentScopeAsDynamic: function() {
        return markCurrentScopeAsDynamic;
    },
    throwIfDisallowedDynamic: function() {
        return throwIfDisallowedDynamic;
    },
    throwIfDisallowedDynamicInStaticRoute: function() {
        return throwIfDisallowedDynamicInStaticRoute;
    },
    throwIfSyncIOUsed: function() {
        return throwIfSyncIOUsed;
    },
    throwToInterruptStaticGeneration: function() {
        return throwToInterruptStaticGeneration;
    },
    trackAllowedDynamicAccess: function() {
        return trackAllowedDynamicAccess;
    },
    trackDynamicAccessInStaticRoute: function() {
        return trackDynamicAccessInStaticRoute;
    },
    trackDynamicDataInDynamicRender: function() {
        return trackDynamicDataInDynamicRender;
    },
    trackDynamicHoleInNavigation: function() {
        return trackDynamicHoleInNavigation;
    },
    trackDynamicHoleInStaticShell: function() {
        return trackDynamicHoleInStaticShell;
    },
    trackThrownErrorInNavigation: function() {
        return trackThrownErrorInNavigation;
    }
});
const _react = /*#__PURE__*/ _interop_require_default(__turbopack_context__.r("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)"));
const _hooksservercontext = __turbopack_context__.r("[project]/web/node_modules/next/dist/client/components/hooks-server-context.js [app-ssr] (ecmascript)");
const _staticgenerationbailout = __turbopack_context__.r("[project]/web/node_modules/next/dist/client/components/static-generation-bailout.js [app-ssr] (ecmascript)");
const _workunitasyncstorageexternal = __turbopack_context__.r("[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)");
const _dynamicrenderingutils = __turbopack_context__.r("[project]/web/node_modules/next/dist/server/dynamic-rendering-utils.js [app-ssr] (ecmascript)");
const _boundaryconstants = __turbopack_context__.r("[project]/web/node_modules/next/dist/lib/framework/boundary-constants.js [app-ssr] (ecmascript)");
const _scheduler = __turbopack_context__.r("[project]/web/node_modules/next/dist/lib/scheduler.js [app-ssr] (ecmascript)");
const _blockingroutemessages = __turbopack_context__.r("[project]/web/node_modules/next/dist/server/app-render/blocking-route-messages.js [app-ssr] (ecmascript)");
const _invarianterror = __turbopack_context__.r("[project]/web/node_modules/next/dist/shared/lib/invariant-error.js [app-ssr] (ecmascript)");
const _boundaryconstants1 = __turbopack_context__.r("[project]/web/node_modules/next/dist/server/app-render/instant-validation/boundary-constants.js [app-ssr] (ecmascript)");
const _boundarytracking = __turbopack_context__.r("[project]/web/node_modules/next/dist/server/app-render/instant-validation/boundary-tracking.js [app-ssr] (ecmascript)");
const _instantmessages = __turbopack_context__.r("[project]/web/node_modules/next/dist/shared/lib/instant-messages.js [app-ssr] (ecmascript)");
const _reactbrowserbailout = __turbopack_context__.r("[project]/web/node_modules/next/dist/shared/lib/lazy-dynamic/react-browser-bailout.js [app-ssr] (ecmascript)");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function createDynamicTrackingState(isDebugDynamicAccesses) {
    return {
        isDebugDynamicAccesses,
        dynamicAccesses: [],
        syncDynamicErrorWithStack: null,
        syncDynamicErrorWithStackPostMicrotask: false
    };
}
function createDynamicValidationState() {
    return {
        hasSuspenseAboveBody: false,
        hasDynamicMetadata: false,
        dynamicMetadata: null,
        hasDynamicViewport: false,
        hasAllowedDynamic: false,
        dynamicErrors: []
    };
}
function getPendingClientSyncDynamicError(clientDynamic) {
    return clientDynamic.syncDynamicErrorWithStackPostMicrotask ? null : clientDynamic.syncDynamicErrorWithStack;
}
function getFirstDynamicReason(trackingState) {
    var _trackingState_dynamicAccesses_;
    return (_trackingState_dynamicAccesses_ = trackingState.dynamicAccesses[0]) == null ? void 0 : _trackingState_dynamicAccesses_.expression;
}
function markCurrentScopeAsDynamic(store, workUnitStore, expression) {
    if (workUnitStore) {
        switch(workUnitStore.type){
            case 'cache':
            case 'unstable-cache':
                // Inside cache scopes, marking a scope as dynamic has no effect,
                // because the outer cache scope creates a cache boundary. This is
                // subtly different from reading a dynamic data source, which is
                // forbidden inside a cache scope.
                return;
            case 'private-cache':
                // A private cache scope is already dynamic by definition.
                return;
            case 'prerender-legacy':
            case 'request':
            case 'build-time-generator':
                break;
            default:
                workUnitStore;
        }
    }
    // If we're forcing dynamic rendering or we're forcing static rendering, we
    // don't need to do anything here because the entire page is already dynamic
    // or it's static and it should not throw or postpone here.
    if (store.forceDynamic || store.forceStatic) return;
    if (store.dynamicShouldError) {
        throw new _staticgenerationbailout.StaticGenBailoutError(`Route ${store.route} with \`dynamic = "error"\` couldn't be rendered statically because it used \`${expression}\`. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`);
    }
    if (workUnitStore) {
        switch(workUnitStore.type){
            case 'prerender-legacy':
                workUnitStore.revalidate = 0;
                // We aren't prerendering, but we are generating a static page. We need
                // to bail out of static generation.
                const err = new _hooksservercontext.DynamicServerError(`Route ${store.route} couldn't be rendered statically because it used ${expression}. See more info here: https://nextjs.org/docs/messages/dynamic-server-error`);
                store.dynamicUsageDescription = expression;
                store.dynamicUsageStack = err.stack;
                throw err;
            case 'request':
                markRequestStoreAsDynamic(workUnitStore);
                break;
            case 'build-time-generator':
                break;
            default:
                workUnitStore;
        }
    }
}
function throwToInterruptStaticGeneration(expression, store, prerenderStore) {
    // We aren't prerendering but we are generating a static page. We need to bail out of static generation
    const err = new _hooksservercontext.DynamicServerError(`Route ${store.route} couldn't be rendered statically because it used \`${expression}\`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error`);
    prerenderStore.revalidate = 0;
    store.dynamicUsageDescription = expression;
    store.dynamicUsageStack = err.stack;
    throw err;
}
function trackDynamicDataInDynamicRender(workUnitStore) {
    switch(workUnitStore.type){
        case 'cache':
        case 'unstable-cache':
            // Inside cache scopes, marking a scope as dynamic has no effect,
            // because the outer cache scope creates a cache boundary. This is
            // subtly different from reading a dynamic data source, which is
            // forbidden inside a cache scope.
            return;
        case 'private-cache':
            // A private cache scope is already dynamic by definition.
            return;
        case 'prerender':
        case 'prerender-runtime':
        case 'prerender-legacy':
        case 'prerender-client':
        case 'validation-client':
        case 'build-time-generator':
            break;
        case 'request':
            markRequestStoreAsDynamic(workUnitStore);
            break;
        default:
            workUnitStore;
    }
}
function markRequestStoreAsDynamic(requestStore) {
    if (("TURBOPACK compile-time value", "1") && requestStore.phase === 'render') {
        requestStore.usedDynamic = true;
    }
}
function abortOnSynchronousDynamicDataAccess(route, expression, prerenderStore) {
    const reason = `Route ${route} needs to bail out of prerendering at this point because it used ${expression}.`;
    const error = createPrerenderInterruptedError(reason);
    prerenderStore.controller.abort(error);
    const dynamicTracking = prerenderStore.dynamicTracking;
    if (dynamicTracking) {
        dynamicTracking.dynamicAccesses.push({
            // When we aren't debugging, we don't need to create another error for the
            // stack trace.
            stack: dynamicTracking.isDebugDynamicAccesses ? new Error().stack : undefined,
            expression
        });
    }
}
function abortOnSynchronousPlatformIOAccess(route, expression, errorWithStack, prerenderStore) {
    const dynamicTracking = prerenderStore.dynamicTracking;
    if (dynamicTracking && dynamicTracking.syncDynamicErrorWithStack === null) {
        dynamicTracking.syncDynamicErrorWithStack = errorWithStack;
        // React completes the task that is currently rendering before scheduled
        // abort cleanup. Client tracking can attribute the sync IO only during
        // that current task; server tracking keeps the error regardless.
        queueMicrotask(()=>{
            dynamicTracking.syncDynamicErrorWithStackPostMicrotask = true;
        });
    }
    abortOnSynchronousDynamicDataAccess(route, expression, prerenderStore);
}
function abortAndThrowOnSynchronousRequestDataAccess(route, expression, errorWithStack, prerenderStore) {
    const prerenderSignal = prerenderStore.controller.signal;
    if (prerenderSignal.aborted === false) {
        // TODO it would be better to move this aborted check into the callsite so we can avoid making
        // the error object when it isn't relevant to the aborting of the prerender however
        // since we need the throw semantics regardless of whether we abort it is easier to land
        // this way. See how this was handled with `abortOnSynchronousPlatformIOAccess` for a closer
        // to ideal implementation
        abortOnSynchronousDynamicDataAccess(route, expression, prerenderStore);
        // Preserve the exact server-side dynamic access for final validation after
        // interrupting this render.
        const dynamicTracking = prerenderStore.dynamicTracking;
        if (dynamicTracking) {
            if (dynamicTracking.syncDynamicErrorWithStack === null) {
                dynamicTracking.syncDynamicErrorWithStack = errorWithStack;
            }
        }
    }
    throw createPrerenderInterruptedError(`Route ${route} needs to bail out of prerendering at this point because it used ${expression}.`);
}
const NEXT_PRERENDER_INTERRUPTED = 'NEXT_PRERENDER_INTERRUPTED';
function createPrerenderInterruptedError(message) {
    const error = new Error(message);
    error.digest = NEXT_PRERENDER_INTERRUPTED;
    return error;
}
function isPrerenderInterruptedError(error) {
    return typeof error === 'object' && error !== null && error.digest === NEXT_PRERENDER_INTERRUPTED && 'name' in error && 'message' in error && error instanceof Error;
}
function accessedDynamicData(dynamicAccesses) {
    return dynamicAccesses.length > 0;
}
function consumeDynamicAccess(serverDynamic, clientDynamic) {
    // We mutate because we only call this once we are no longer writing
    // to the dynamicTrackingState and it's more efficient than creating a new
    // array.
    serverDynamic.dynamicAccesses.push(...clientDynamic.dynamicAccesses);
    return serverDynamic.dynamicAccesses;
}
function formatDynamicAPIAccesses(dynamicAccesses) {
    return dynamicAccesses.filter((access)=>typeof access.stack === 'string' && access.stack.length > 0).map(({ expression, stack })=>{
        stack = stack.split('\n') // Remove the "Error: " prefix from the first line of the stack trace as
        // well as the first 4 lines of the stack trace which is the distance
        // from the user code and the `new Error().stack` call.
        .slice(4).filter((line)=>{
            // Exclude Next.js internals from the stack trace.
            if (line.includes('node_modules/next/')) {
                return false;
            }
            // Exclude anonymous functions from the stack trace.
            if (line.includes(' (<anonymous>)')) {
                return false;
            }
            // Exclude Node.js internals from the stack trace.
            if (line.includes(' (node:')) {
                return false;
            }
            return true;
        }).join('\n');
        return `Dynamic API Usage Debug - ${expression}:\n${stack}`;
    });
}
function createHangingInputAbortSignal(workUnitStore) {
    switch(workUnitStore.type){
        case 'prerender':
        case 'prerender-runtime':
            const controller = new AbortController();
            if (workUnitStore.cacheSignal) {
                // If we have a cacheSignal it means we're in a prospective render. If
                // the input we're waiting on is coming from another cache, we do want
                // to wait for it so that we can resolve this cache entry too.
                workUnitStore.cacheSignal.inputReady().then(()=>{
                    controller.abort();
                });
            } else {
                // Otherwise we're in the final render and we should already have all
                // our caches filled.
                // If the prerender uses stages, we have wait until the final stage.
                // if an input didn't resolve at that point, then we can assume it never will.
                //
                // We might still be waiting on some microtasks so we
                // wait one tick before giving up. When we give up, we still want to
                // render the content of this cache as deeply as we can so that we can
                // suspend as deeply as possible in the tree or not at all if we don't
                // end up waiting for the input.
                const stagedRendering = (0, _workunitasyncstorageexternal.getStagedRenderingController)(workUnitStore);
                if (stagedRendering && stagedRendering.finalStage !== null) {
                    stagedRendering.waitForStage(stagedRendering.finalStage).then(()=>(0, _scheduler.scheduleOnNextTick)(()=>controller.abort()), noop);
                } else {
                    (0, _scheduler.scheduleOnNextTick)(()=>controller.abort());
                }
            }
            return controller.signal;
        case 'prerender-client':
        case 'validation-client':
        case 'prerender-legacy':
        case 'request':
        case 'cache':
        case 'private-cache':
        case 'unstable-cache':
        case 'build-time-generator':
            return undefined;
        default:
            workUnitStore;
    }
}
function noop() {}
function annotateDynamicAccess(expression, prerenderStore) {
    const dynamicTracking = prerenderStore.dynamicTracking;
    if (dynamicTracking) {
        dynamicTracking.dynamicAccesses.push({
            stack: dynamicTracking.isDebugDynamicAccesses ? new Error().stack : undefined,
            expression
        });
    }
}
const hasSuspenseRegex = /\n\s+at Suspense \(<anonymous>\)/;
// Common implicit body tags that React will treat as body when placed directly in html
const bodyAndImplicitTags = 'body|div|main|section|article|aside|header|footer|nav|form|p|span|h1|h2|h3|h4|h5|h6';
// Detects when RootLayoutBoundary (our framework marker component) appears
// after Suspense in the component stack, indicating the root layout is wrapped
// within a Suspense boundary. Ensures no body/html/implicit-body components are in between.
//
// Example matches:
//   at Suspense (<anonymous>)
//   at __next_root_layout_boundary__ (<anonymous>)
//
// Or with other components in between (but not body/html/implicit-body):
//   at Suspense (<anonymous>)
//   at SomeComponent (<anonymous>)
//   at __next_root_layout_boundary__ (<anonymous>)
const hasSuspenseBeforeRootLayoutWithoutBodyOrImplicitBodyRegex = new RegExp(`\\n\\s+at Suspense \\(<anonymous>\\)(?:(?!\\n\\s+at (?:${bodyAndImplicitTags}) \\(<anonymous>\\))[\\s\\S])*?\\n\\s+at ${_boundaryconstants.ROOT_LAYOUT_BOUNDARY_NAME} \\([^\\n]*\\)`);
const hasMetadataRegex = new RegExp(`\\n\\s+at ${_boundaryconstants.METADATA_BOUNDARY_NAME}[\\n\\s]`);
const hasViewportRegex = new RegExp(`\\n\\s+at ${_boundaryconstants.VIEWPORT_BOUNDARY_NAME}[\\n\\s]`);
const hasOutletRegex = new RegExp(`\\n\\s+at ${_boundaryconstants.OUTLET_BOUNDARY_NAME}[\\n\\s]`);
const hasInstantValidationBoundaryRegex = new RegExp(`\\n\\s+at ${_boundaryconstants1.INSTANT_VALIDATION_BOUNDARY_NAME}[\\n\\s]`);
const slotMarkerRegex = new RegExp(`\\n\\s+at ${_boundaryconstants1.INSTANT_SLOT_MARKER_PREFIX}(\\d+)${_boundaryconstants1.INSTANT_SLOT_MARKER_SUFFIX}[\\n\\s]`);
/** Look up the config factory for the slot this error belongs to.
 * Checks the component stack for a slot marker (__next_instant_slot_N__)
 * and returns the config at that index. Falls back to index 0 (root
 * config) when no slot marker is found or the slot has no config. */ function resolveInstantStack(componentStack, dynamicValidation) {
    const { slotStacks } = dynamicValidation;
    if (slotStacks.length > 1) {
        const match = slotMarkerRegex.exec(componentStack);
        if (match) {
            // Slot markers are 0-indexed in the component name but
            // slotStacks is 1-indexed (index 0 is the root config).
            const slotIndex = parseInt(match[1], 10) + 1;
            const slotStack = slotStacks[slotIndex];
            if (slotStack != null) {
                return slotStack;
            }
        }
    }
    // Fall back to root config (index 0)
    return slotStacks[0] ?? null;
}
/**
 * Inspects the component stack of an outlet boundary to discover whether the
 * user placed a Suspense boundary above the document body, and records the
 * opt-in on `dynamicValidation.hasSuspenseAboveBody` if so.
 *
 * The outlet itself isn't a meaningful source of dynamic — it only resolves
 * when metadata/viewport are dynamic, which we track via their own boundaries.
 * However, the outlet renders alongside the page content, so its stack passes
 * through the user's layout chain (typically reaching into `<body>` via the
 * root layout). That makes the outlet stack our best opportunity to spot a
 * Suspense boundary above the body, even when no real body content is dynamic.
 * Without this, a route whose only dynamic source is `generateViewport()` would
 * miss the Suspense-above-body opt-in, because the viewport's stack lives in
 * the head and never sees the user's root layout.
 *
 * We deliberately only set `hasSuspenseAboveBody`, not `hasAllowedDynamic`. The
 * latter tracks whether the body has dynamic content that's been wrapped in
 * Suspense (i.e., the page is partially dynamic). The outlet rendering tells us
 * about the structural opt-in for an empty shell, not about the body being
 * partially dynamic. The distinction matters because dynamic metadata is only
 * acceptable when the page is partially dynamic (via real body holes), and we
 * don't want this outlet-based detection to mask that case.
 */ function trackOutletSuspenseAboveBody(componentStack, dynamicValidation) {
    if (hasSuspenseBeforeRootLayoutWithoutBodyOrImplicitBodyRegex.test(componentStack)) {
        dynamicValidation.hasSuspenseAboveBody = true;
    }
}
function trackDynamicAccessInStaticRoute(dynamicReason, workStore, componentStack, dynamicValidation, clientDynamic, isServerPartial, kind) {
    const syncDynamicError = getPendingClientSyncDynamicError(clientDynamic);
    if (hasOutletRegex.test(componentStack)) {
        trackOutletSuspenseAboveBody(componentStack, dynamicValidation);
        return;
    }
    if (hasMetadataRegex.test(componentStack)) {
        dynamicValidation.dynamicErrors.push(addErrorContext(createMetadataErrorInStaticRoute(kind, workStore.route), componentStack, null));
        return;
    }
    if (hasViewportRegex.test(componentStack)) {
        dynamicValidation.dynamicErrors.push(addErrorContext(createViewportErrorInStaticRoute(kind, workStore.route), componentStack, null));
        return;
    }
    let hasSuspense = false;
    if (hasSuspenseBeforeRootLayoutWithoutBodyOrImplicitBodyRegex.test(componentStack)) {
        // this error had a Suspense boundary above it, and it's above the body as well.
        dynamicValidation.hasSuspenseAboveBody = true;
        hasSuspense = true;
    } else if (hasSuspenseRegex.test(componentStack)) {
        // this error had a Suspense boundary above it.
        hasSuspense = true;
    }
    if (hasSuspense) {
        if (!isServerPartial) {
            // If we don't have holes caused by server data, then any holes must be caused
            // by client-only code, which is allowed.
            dynamicValidation.hasAllowedDynamic = true;
            return;
        }
        // We have holes that may be caused by server data.
        if (syncDynamicError || (0, _dynamicrenderingutils.isClientHookDynamicError)(dynamicReason)) {
            // We know this hole wasn't caused by server data, so it's allowed
            // (because it's wrapped in a Suspense)
            dynamicValidation.hasAllowedDynamic = true;
            return;
        }
        // Any remaining hole may be caused by a server hole.
        // These are not allowed even with Suspense.
        // (NOTE: this may misreport valid client dynamic holes as server holes)
        dynamicValidation.dynamicErrors.push(addErrorContext(createBodyErrorInStaticRoute(kind, workStore.route), componentStack, null));
        return;
    }
    if (syncDynamicError) {
        dynamicValidation.dynamicErrors.push(syncDynamicError);
        return;
    }
    if ((0, _dynamicrenderingutils.isClientHookDynamicError)(dynamicReason)) {
        dynamicValidation.dynamicErrors.push(addErrorContext(dynamicReason, componentStack, null));
        return;
    }
    const error = addErrorContext(isServerPartial ? createBodyErrorInStaticRoute(kind, workStore.route) : createBodyError(kind, workStore.route), componentStack, null);
    dynamicValidation.dynamicErrors.push(error);
}
function trackAllowedDynamicAccess(dynamicReason, workStore, componentStack, dynamicValidation, clientDynamic) {
    const dynamicHoleKind = 6;
    const syncDynamicError = getPendingClientSyncDynamicError(clientDynamic);
    if (hasOutletRegex.test(componentStack)) {
        trackOutletSuspenseAboveBody(componentStack, dynamicValidation);
        return;
    } else if (hasMetadataRegex.test(componentStack)) {
        dynamicValidation.hasDynamicMetadata = true;
        return;
    } else if (hasViewportRegex.test(componentStack)) {
        dynamicValidation.hasDynamicViewport = true;
        return;
    } else if (hasSuspenseBeforeRootLayoutWithoutBodyOrImplicitBodyRegex.test(componentStack)) {
        // For Suspense within body, the prelude wouldn't be empty so it wouldn't violate the empty static shells rule.
        // But if you have Suspense above body, the prelude is empty but we allow that because having Suspense
        // is an explicit signal from the user that they acknowledge the empty shell and want dynamic rendering.
        dynamicValidation.hasAllowedDynamic = true;
        dynamicValidation.hasSuspenseAboveBody = true;
        return;
    } else if (hasSuspenseRegex.test(componentStack)) {
        // this error had a Suspense boundary above it so we don't need to report it as a source
        // of disallowed
        dynamicValidation.hasAllowedDynamic = true;
        return;
    } else if (syncDynamicError) {
        dynamicValidation.dynamicErrors.push(syncDynamicError);
        return;
    }
    if ((0, _dynamicrenderingutils.isClientHookDynamicError)(dynamicReason)) {
        dynamicValidation.dynamicErrors.push(addErrorContext(dynamicReason, componentStack, null));
        return;
    }
    const error = addErrorContext(createBodyError(dynamicHoleKind, workStore.route), componentStack, null);
    dynamicValidation.dynamicErrors.push(error);
    return;
}
var DynamicHoleKind = /*#__PURE__*/ function(DynamicHoleKind) {
    /** We know that this hole is caused by runtime data. */ DynamicHoleKind[DynamicHoleKind["Runtime"] = 1] = "Runtime";
    /** We know that this hole is caused by link data. */ DynamicHoleKind[DynamicHoleKind["Link"] = 2] = "Link";
    /** We know that this hole is caused by navigation(). */ DynamicHoleKind[DynamicHoleKind["Navigation"] = 3] = "Navigation";
    /** We know that this hole is caused by prefetch(). */ DynamicHoleKind[DynamicHoleKind["Prefetch"] = 4] = "Prefetch";
    /** We know that this hole is caused by dynamic data. */ DynamicHoleKind[DynamicHoleKind["Dynamic"] = 5] = "Dynamic";
    /** We know that this hole is caused by runtime or dynamic data, but don't know which. */ DynamicHoleKind[DynamicHoleKind["RuntimeOrDynamic"] = 6] = "RuntimeOrDynamic";
    return DynamicHoleKind;
}({});
function createInstantValidationState(slotStacks) {
    return {
        hasDynamicMetadata: false,
        hasAllowedClientDynamicAboveBoundary: false,
        dynamicMetadata: null,
        hasDynamicViewport: false,
        hasAllowedDynamic: false,
        dynamicErrors: [],
        validationPreventingErrors: [],
        thrownErrorsOutsideBoundary: [],
        slotStacks
    };
}
function trackDynamicHoleInNavigation(dynamicReason, workStore, componentStack, dynamicValidation, clientDynamic, kind, boundaryState) {
    const syncDynamicError = getPendingClientSyncDynamicError(clientDynamic);
    if (hasOutletRegex.test(componentStack)) {
        // We don't need to track that this is dynamic. It is only so when something else is also dynamic.
        return;
    }
    // Resolve the config stack for this specific error. If the error
    // is inside a slot marker, use that slot's config. Otherwise fall
    // back to the default.
    const effectiveCreateInstantStack = resolveInstantStack(componentStack, dynamicValidation);
    if (hasMetadataRegex.test(componentStack)) {
        const error = addErrorContext(createMetadataError(kind, workStore.route), componentStack, effectiveCreateInstantStack);
        dynamicValidation.dynamicMetadata = error;
        return;
    }
    if (hasViewportRegex.test(componentStack)) {
        const error = addErrorContext(createViewportError(kind, workStore.route), componentStack, effectiveCreateInstantStack);
        dynamicValidation.dynamicErrors.push(error);
        return;
    }
    const boundaryLocation = hasInstantValidationBoundaryRegex.exec(componentStack);
    if (!boundaryLocation) {
        // We don't see the validation boundary in the component stack,
        // so this hole must be coming from a shared parent.
        // Shared parents are fully resolved and don't have RSC holes,
        // but they can still suspend in a client component during SSR.
        // If we managed to render all the validation boundaries, that means
        // that the client holes aren't blocking validation and we can disregard them.
        // Note that we don't even care whether they have suspense or not.
        if ((0, _boundarytracking.allRequiredBoundariesRendered)(boundaryState)) {
            dynamicValidation.hasAllowedClientDynamicAboveBoundary = true;
            dynamicValidation.hasAllowedDynamic = true // Holes outside the boundary contribute to allowing dynamic metadata
            ;
            return;
        } else {
            // TODO(instant-validation) TODO(NAR-787)
            // If shared parents blocked us from validating, we should only log
            // the errors from the innermost (segments), i.e. omit layouts whose
            // slots managed to render (because clearly they didn't block validation)
            const message = `Route "${workStore.route}": Could not validate \`instant\` because a Client Component in a parent segment prevented the page from rendering.`;
            const error = addErrorContext(new Error(message), componentStack, effectiveCreateInstantStack);
            dynamicValidation.validationPreventingErrors.push(error);
            return;
        }
    } else {
        // The hole originates inside the validation boundary.
        //
        // Check if we have a Suspense above the hole, but below the validation boundary.
        // If we do, then this dynamic usage wouldn't block a navigation to this subtree.
        // Conversely, if the nearest suspense is above the validation boundary, then this subtree would block.
        //
        // Note that in the component stack, children come before parents.
        //
        // Valid:
        //   ...
        //   at Suspense
        //   ...
        //   at __next_prefetch_validation_boundary__
        //
        // Invalid:
        //   ...
        //   at __next_prefetch_validation_boundary__
        //   ...
        //   at Suspense
        //
        const suspenseLocation = hasSuspenseRegex.exec(componentStack);
        if (suspenseLocation) {
            if (suspenseLocation.index < boundaryLocation.index) {
                dynamicValidation.hasAllowedDynamic = true;
                return;
            } else {
            // invalid - fallthrough
            }
        }
    }
    if (syncDynamicError) {
        if (effectiveCreateInstantStack !== null && syncDynamicError.cause === undefined) {
            syncDynamicError.cause = effectiveCreateInstantStack();
        }
        dynamicValidation.dynamicErrors.push(syncDynamicError);
        return;
    }
    if ((0, _dynamicrenderingutils.isClientHookDynamicError)(dynamicReason)) {
        dynamicValidation.dynamicErrors.push(addErrorContext(dynamicReason, componentStack, effectiveCreateInstantStack));
        return;
    }
    const error = addErrorContext(createBodyErrorInNavigation(kind, workStore.route), componentStack, effectiveCreateInstantStack);
    dynamicValidation.dynamicErrors.push(error);
    return;
}
function createBodyError(kind, route) {
    switch(kind){
        case 1:
            return (0, _blockingroutemessages.createRuntimeBodyError)(route);
        case 5:
            return (0, _blockingroutemessages.createDynamicBodyError)(route);
        case 6:
            return (0, _blockingroutemessages.createDynamicOrRuntimeBodyError)(route);
    }
}
function createBodyErrorInNavigation(kind, route) {
    switch(kind){
        case 1:
            return (0, _blockingroutemessages.createRuntimeBodyErrorInNavigation)(route);
        case 2:
            return (0, _blockingroutemessages.createLinkBodyErrorInNavigation)(route);
        case 3:
            return (0, _blockingroutemessages.createNavigationBodyErrorInNavigation)(route);
        case 4:
            return (0, _blockingroutemessages.createPrefetchBodyErrorInNavigation)(route);
        case 5:
            return (0, _blockingroutemessages.createDynamicBodyErrorInNavigation)(route);
    }
}
function createMetadataError(kind, route) {
    switch(kind){
        case 1:
            return (0, _blockingroutemessages.createRuntimeMetadataError)(route);
        case 2:
            return (0, _blockingroutemessages.createLinkMetadataError)(route);
        case 3:
            return (0, _blockingroutemessages.createNavigationMetadataError)(route);
        case 4:
            return (0, _blockingroutemessages.createPrefetchMetadataError)(route);
        case 5:
            return (0, _blockingroutemessages.createDynamicMetadataError)(route);
        case 6:
            return (0, _blockingroutemessages.createDynamicOrRuntimeMetadataError)(route);
    }
}
function createViewportError(kind, route) {
    switch(kind){
        case 1:
            return (0, _blockingroutemessages.createRuntimeViewportError)(route);
        case 2:
            return (0, _blockingroutemessages.createLinkViewportError)(route);
        case 3:
            return (0, _blockingroutemessages.createNavigationViewportError)(route);
        case 4:
            return (0, _blockingroutemessages.createPrefetchViewportError)(route);
        case 5:
            return (0, _blockingroutemessages.createDynamicViewportError)(route);
        case 6:
            return (0, _blockingroutemessages.createDynamicOrRuntimeViewportError)(route);
    }
}
function createBodyErrorInStaticRoute(kind, route) {
    switch(kind){
        case 1:
            return (0, _blockingroutemessages.createRuntimeBodyErrorInStaticRoute)(route);
        case 5:
            return (0, _blockingroutemessages.createDynamicBodyErrorInStaticRoute)(route);
        case 6:
            return (0, _blockingroutemessages.createNonPrerenderableBodyErrorInStaticRoute)(route);
    }
}
function createMetadataErrorInStaticRoute(kind, route) {
    switch(kind){
        case 1:
            return (0, _blockingroutemessages.createRuntimeMetadataErrorInStaticRoute)(route);
        case 5:
            return (0, _blockingroutemessages.createDynamicMetadataErrorInStaticRoute)(route);
        case 6:
            return (0, _blockingroutemessages.createNonPrerenderableMetadataErrorInStaticRoute)(route);
    }
}
function createViewportErrorInStaticRoute(kind, route) {
    switch(kind){
        case 1:
            return (0, _blockingroutemessages.createRuntimeViewportErrorInStaticRoute)(route);
        case 5:
            return (0, _blockingroutemessages.createDynamicViewportErrorInStaticRoute)(route);
        case 6:
            return (0, _blockingroutemessages.createNonPrerenderableViewportErrorInStaticRoute)(route);
    }
}
function trackThrownErrorInNavigation(workStore, dynamicValidation, thrownValue, componentStack, reactBrowserBailout) {
    const boundaryLocation = hasInstantValidationBoundaryRegex.exec(componentStack);
    if (!boundaryLocation) {
        // There's no validation boundary on the component stack.
        // This error may have blocked a boundary from rendering.
        // Wrap the error to provide component context.
        // This helps for errors from node_modules which would otherwise
        // have no useful stack information due to ignore-listing,
        // e.g. next/dynamic with `ssr: false`.
        if (reactBrowserBailout) {
            // React preserves Next's branded bailout reason as the error cause.
            // Replace the internal wrapper before storing the user-facing diagnostic.
            const browserBailoutReason = (0, _reactbrowserbailout.getReactBrowserBailoutReason)(thrownValue);
            if (browserBailoutReason !== undefined) {
                const browserBailoutError = thrownValue;
                browserBailoutError.cause = browserBailoutReason;
            }
        }
        const error = addErrorContext(new Error('An error occurred while attempting to validate instant UI. This error may be preventing the validation from completing.', {
            cause: thrownValue
        }), componentStack, null);
        dynamicValidation.thrownErrorsOutsideBoundary.push(error);
    } else {
        // There's validation boundary on the component stack,
        // so we know this error didn't block a validation boundary from rendering.
        // However, this error might be hiding be hiding dynamic content that would
        // cause validation to fail.
        const suspenseLocation = hasSuspenseRegex.exec(componentStack);
        if (suspenseLocation) {
            if (suspenseLocation.index < boundaryLocation.index) {
                // There's a Suspense below the validation boundary but above this error's location.
                // This subtree can't fail instant validation because any potential
                // dynamic holes would be guarded by the Suspense anyway,
                // so we can allow this.
                return;
            } else {
            // invalid - fallthrough
            }
        }
        if (reactBrowserBailout) {
            // React preserves Next's branded bailout reason as the error cause.
            // Replace the internal wrapper before storing the user-facing diagnostic.
            const browserBailoutReason = (0, _reactbrowserbailout.getReactBrowserBailoutReason)(thrownValue);
            if (browserBailoutReason !== undefined) {
                const browserBailoutError = thrownValue;
                browserBailoutError.cause = browserBailoutReason;
            }
        }
        const message = `Route "${workStore.route}": Could not validate \`instant\` because an error prevented the target segment from rendering.`;
        const error = addErrorContext(new Error(message, {
            cause: thrownValue
        }), componentStack, null // TODO(instant-validation-build): conflicting use of cause
        );
        dynamicValidation.validationPreventingErrors.push(error);
    }
}
function trackDynamicHoleInStaticShell(dynamicReason, workStore, componentStack, dynamicValidation, clientDynamic, kind) {
    const syncDynamicError = getPendingClientSyncDynamicError(clientDynamic);
    if (hasOutletRegex.test(componentStack)) {
        trackOutletSuspenseAboveBody(componentStack, dynamicValidation);
        return;
    } else if (hasMetadataRegex.test(componentStack)) {
        const error = addErrorContext(createMetadataError(kind, workStore.route), componentStack, null);
        dynamicValidation.dynamicMetadata = error;
        return;
    } else if (hasViewportRegex.test(componentStack)) {
        const error = addErrorContext(createViewportError(kind, workStore.route), componentStack, null);
        dynamicValidation.dynamicErrors.push(error);
        return;
    } else if (hasSuspenseBeforeRootLayoutWithoutBodyOrImplicitBodyRegex.test(componentStack)) {
        // For Suspense within body, the prelude wouldn't be empty so it wouldn't violate the empty static shells rule.
        // But if you have Suspense above body, the prelude is empty but we allow that because having Suspense
        // is an explicit signal from the user that they acknowledge the empty shell and want dynamic rendering.
        dynamicValidation.hasAllowedDynamic = true;
        dynamicValidation.hasSuspenseAboveBody = true;
        return;
    } else if (hasSuspenseRegex.test(componentStack)) {
        // this error had a Suspense boundary above it so we don't need to report it as a source
        // of disallowed
        dynamicValidation.hasAllowedDynamic = true;
        return;
    } else if (syncDynamicError) {
        dynamicValidation.dynamicErrors.push(syncDynamicError);
        return;
    }
    if ((0, _dynamicrenderingutils.isClientHookDynamicError)(dynamicReason)) {
        dynamicValidation.dynamicErrors.push(addErrorContext(dynamicReason, componentStack, null));
        return;
    }
    const error = addErrorContext(kind === 1 ? (0, _blockingroutemessages.createRuntimeBodyError)(workStore.route) : (0, _blockingroutemessages.createDynamicBodyError)(workStore.route), componentStack, null);
    dynamicValidation.dynamicErrors.push(error);
    return;
}
/**
 * In dev mode, we prefer using the owner stack, otherwise the provided
 * component stack is used.
 */ function addErrorContext(error, componentStack, createInstantStack) {
    const ownerStack = ("TURBOPACK compile-time value", "development") !== 'production' && _react.default.captureOwnerStack ? _react.default.captureOwnerStack() : null;
    if (createInstantStack !== null) {
        error.cause = createInstantStack();
    }
    // TODO go back to owner stack here if available. This is temporarily using componentStack to get the right
    //
    error.stack = error.name + ': ' + error.message + (ownerStack || componentStack);
    return error;
}
var PreludeState = /*#__PURE__*/ function(PreludeState) {
    PreludeState[PreludeState["Full"] = 0] = "Full";
    PreludeState[PreludeState["Empty"] = 1] = "Empty";
    PreludeState[PreludeState["Errored"] = 2] = "Errored";
    return PreludeState;
}({});
function logDisallowedDynamicError(workStore, error) {
    console.error(error);
    (0, _blockingroutemessages.logBuildDebugHint)(workStore.route);
}
function throwIfSyncIOUsed(workStore, serverDynamic) {
    if (serverDynamic.syncDynamicErrorWithStack) {
        logDisallowedDynamicError(workStore, serverDynamic.syncDynamicErrorWithStack);
        throw new _staticgenerationbailout.StaticGenBailoutError();
    }
}
function throwIfDisallowedDynamic(workStore, prelude, dynamicValidation, serverDynamic, allowEmptyStaticShell) {
    const dynamicHoleKind = 6;
    throwIfSyncIOUsed(workStore, serverDynamic);
    // The dynamic metadata error is a mistake-detection signal. It fires when the
    // rest of the shell is otherwise fully static apart from metadata, suggesting
    // the dynamic data access in `generateMetadata` was probably unintentional.
    // That condition is independent of whether the user or build phase accepted
    // an empty shell, so we surface it before any opt-in bypass.
    if (prelude === 0 && dynamicValidation.hasAllowedDynamic === false && dynamicValidation.hasDynamicMetadata) {
        console.error(createMetadataError(dynamicHoleKind, workStore.route).message);
        throw new _staticgenerationbailout.StaticGenBailoutError();
    }
    // Either flag expresses "this shell is allowed to be empty/blocking":
    //   - `allowEmptyStaticShell` covers `instant = false` (user opt-in)
    //     and the build-phase fallback-shell case.
    //   - `hasSuspenseAboveBody` is the structural opt-in inside the user's root
    //     layout.
    // Treat them as synonyms for the purpose of bypassing shell-failure errors.
    if (allowEmptyStaticShell || dynamicValidation.hasSuspenseAboveBody) {
        return;
    }
    if (prelude !== 0) {
        // We didn't have any sync bailouts but there may be user code which
        // blocked the root. We would have captured these during the prerender
        // and can log them here and then terminate the build/validating render
        const dynamicErrors = dynamicValidation.dynamicErrors;
        if (dynamicErrors.length > 0) {
            for(let i = 0; i < dynamicErrors.length; i++){
                logDisallowedDynamicError(workStore, dynamicErrors[i]);
            }
            throw new _staticgenerationbailout.StaticGenBailoutError();
        }
        // If we got this far then the only other thing that could be blocking
        // the root is dynamic Viewport. If this is dynamic then
        // you need to opt into that by adding a Suspense boundary above the body
        // to indicate your are ok with fully dynamic rendering.
        if (dynamicValidation.hasDynamicViewport) {
            console.error(createViewportError(dynamicHoleKind, workStore.route).message);
            throw new _staticgenerationbailout.StaticGenBailoutError();
        }
        if (prelude === 1) {
            // If we ever get this far then we messed up the tracking of invalid dynamic.
            // We still adhere to the constraint that you must produce a shell but invite the
            // user to report this as a bug in Next.js.
            console.error(`Route "${workStore.route}" did not produce a static shell and Next.js was unable to determine a reason. This is a bug in Next.js.`);
            throw new _staticgenerationbailout.StaticGenBailoutError();
        }
    }
}
function throwIfDisallowedDynamicInStaticRoute(workStore, prelude, dynamicValidation, serverDynamic, isFallbackShell, allowEmptyStaticShell, isServerPartial) {
    const reasons = getDisallowedReasonsInStaticRoute(workStore, prelude, dynamicValidation, serverDynamic, isFallbackShell, allowEmptyStaticShell, isServerPartial);
    if (reasons.length > 0) {
        for (const reason of reasons){
            logDisallowedDynamicError(workStore, reason);
        }
        throw new _staticgenerationbailout.StaticGenBailoutError();
    }
}
function getDisallowedReasonsInStaticRoute(workStore, prelude, dynamicValidation, serverDynamic, isFallbackShell, allowEmptyStaticShell, isServerPartial) {
    if (serverDynamic && serverDynamic.syncDynamicErrorWithStack) {
        return [
            serverDynamic.syncDynamicErrorWithStack
        ];
    }
    // We do a fallback shell prerender, but it's not meant to be validated --
    // we just need it to create the relevant prerender outputs.
    if (isFallbackShell) {
        return [];
    }
    // Suspense-above-body and `instant = false` bypass reporting
    // that the shell is blocked. However, if we have non-prerenderable server
    // data, we still have to error, regardless of those two.
    if (!isServerPartial && (allowEmptyStaticShell || dynamicValidation.hasSuspenseAboveBody)) {
        return [];
    }
    const { dynamicErrors } = dynamicValidation;
    if (dynamicErrors.length > 0) {
        return dynamicErrors;
    }
    // Dynamic data may have been passed into a client component without calling `use()`,
    // in which case we wouldn't see it during the prerender, but still need to error.
    // Fall back to a generic error message.
    if (isServerPartial) {
        return [
            new Error(`Route "${workStore.route}": Next.js encountered data that is not available during a static prerender, but is unable to provide a location.`)
        ];
    }
    if (prelude === 1 || prelude === 2) {
        // We've somehow ended up with an empty prelude but no dynamic errors.
        // We must've messed up the tracking somehow.
        return [
            new _invarianterror.InvariantError(`Route "${workStore.route}" did not produce a static shell and Next.js was unable to determine a reason.`)
        ];
    }
    return [];
}
function getStaticShellDisallowedDynamicReasons(workStore, prelude, dynamicValidation, allowEmptyStaticShell) {
    // The dynamic metadata error is a mistake-detection signal. It fires when the
    // rest of the shell is otherwise fully static apart from metadata, suggesting
    // the dynamic data access in `generateMetadata` was probably unintentional.
    // That condition is independent of whether the user or build phase accepted
    // an empty shell, so we surface it before any opt-in bypass.
    if (prelude === 0 && dynamicValidation.hasAllowedDynamic === false && dynamicValidation.dynamicErrors.length === 0 && dynamicValidation.dynamicMetadata) {
        return [
            dynamicValidation.dynamicMetadata
        ];
    }
    // Either flag expresses "this shell is allowed to be empty/blocking":
    //   - `allowEmptyStaticShell` covers `instant = false` (user opt-in)
    //     and the build-phase fallback-shell case.
    //   - `hasSuspenseAboveBody` is the structural opt-in inside the user's root
    //     layout.
    // Treat them as synonyms for the purpose of bypassing shell-failure errors.
    if (allowEmptyStaticShell || dynamicValidation.hasSuspenseAboveBody) {
        return [];
    }
    if (prelude !== 0) {
        // We didn't have any sync bailouts but there may be user code which
        // blocked the root. We would have captured these during the prerender
        // and can log them here and then terminate the build/validating render
        const dynamicErrors = dynamicValidation.dynamicErrors;
        if (dynamicErrors.length > 0) {
            return dynamicErrors;
        }
        if (prelude === 1) {
            // If we ever get this far then we messed up the tracking of invalid dynamic.
            // We still adhere to the constraint that you must produce a shell but invite the
            // user to report this as a bug in Next.js.
            return [
                new _invarianterror.InvariantError(`Route "${workStore.route}" did not produce a static shell and Next.js was unable to determine a reason.`)
            ];
        }
    }
    // We had a non-empty prelude and there are no dynamic holes
    return [];
}
function getNavigationDisallowedDynamicReasons(workStore, prelude, dynamicValidation, validationSampleTracking, boundaryState, devRenderDidError) {
    // If we have errors related to missing samples, those should take precedence over everything else.
    if (validationSampleTracking) {
        const { missingSampleErrors } = validationSampleTracking;
        if (missingSampleErrors.length > 0) {
            return missingSampleErrors;
        }
    }
    const { validationPreventingErrors } = dynamicValidation;
    if (validationPreventingErrors.length > 0) {
        if (("TURBOPACK compile-time value", "1") && devRenderDidError) {
            // The dev render already surfaced server errors to the user.
            // The same errors likely caused validation to be inconclusive,
            // so reporting them again as validation failures would be noisy.
            return [];
        }
        return validationPreventingErrors;
    }
    // NOTE: We don't care about Suspense above body here,
    // we're only concerned with the validation boundary
    if (prelude !== 0) {
        const dynamicErrors = dynamicValidation.dynamicErrors;
        if (dynamicErrors.length > 0) {
            return dynamicErrors;
        }
        if (prelude === 1 && !dynamicValidation.hasAllowedClientDynamicAboveBoundary && (0, _boundarytracking.allRequiredBoundariesRendered)(boundaryState)) {
            // If we ever get this far then we messed up the tracking of invalid
            // dynamic. (When boundaries are missing the deferred fallback below
            // will surface a more useful error.)
            return new _invarianterror.InvariantError(`Route "${workStore.route}" failed to render during instant validation and Next.js was unable to determine a reason.`);
        }
    } else {
        const dynamicErrors = dynamicValidation.dynamicErrors;
        if (dynamicErrors.length > 0) {
            return dynamicErrors;
        }
        if (dynamicValidation.hasAllowedDynamic === false && dynamicValidation.dynamicMetadata) {
            return [
                dynamicValidation.dynamicMetadata
            ];
        }
    }
    // Missing boundaries on their own aren't a strong signal — a parent
    // layout may legitimately omit a slot. Defer this so the caller can
    // try shallower validation depths first; if every depth comes up
    // empty we still want to surface this so the user is made aware that
    // validation didn't complete. When we add a markers API, the
    // marker-based variant of this check can become strict again.
    if (!(0, _boundarytracking.allRequiredBoundariesRendered)(boundaryState)) {
        const { thrownErrorsOutsideBoundary } = dynamicValidation;
        const rootInstantStack = dynamicValidation.slotStacks[0];
        if (thrownErrorsOutsideBoundary.length === 0) {
            const missingFiles = [];
            for (const [id, filePaths] of boundaryState.requiredIds){
                if (!boundaryState.renderedIds.has(id)) {
                    for (const filePath of filePaths){
                        let normalized = filePath.replace(/^\[project\][\\/]?/, '').replace(process.cwd() + '/', '').replace(process.cwd() + '\\', '');
                        missingFiles.push(normalized);
                    }
                }
            }
            missingFiles.sort();
            return (0, _instantmessages.createUnrenderedSegmentError)(workStore.route, missingFiles);
        } else if (("TURBOPACK compile-time value", "1") && devRenderDidError) {
            // Errors outside the boundary likely blocked it from rendering,
            // but they're already being reported to the user via the dev
            // render. Suppress the validation failure to avoid noise.
            return [];
        } else if (thrownErrorsOutsideBoundary.length === 1) {
            const message = `Route "${workStore.route}": Could not validate \`instant\` because the target segment was prevented from rendering, likely due to the following error.`;
            const error = rootInstantStack !== null ? rootInstantStack() : new Error();
            error.name = 'Error';
            error.message = message;
            return new AggregateError([
                error,
                thrownErrorsOutsideBoundary[0]
            ]);
        } else {
            const message = `Route "${workStore.route}": Could not validate \`instant\` because the target segment was prevented from rendering, likely due to one of the following errors.`;
            const error = rootInstantStack !== null ? rootInstantStack() : new Error();
            error.name = 'Error';
            error.message = message;
            return new AggregateError([
                error,
                ...thrownErrorsOutsideBoundary
            ]);
        }
    }
    // We had a non-empty prelude and there are no dynamic holes
    return [];
}
}),
"[project]/web/node_modules/next/dist/server/app-render/instant-validation/boundary-constants.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    INSTANT_SLOT_MARKER_PREFIX: null,
    INSTANT_SLOT_MARKER_SUFFIX: null,
    INSTANT_VALIDATION_BOUNDARY_NAME: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    INSTANT_SLOT_MARKER_PREFIX: function() {
        return INSTANT_SLOT_MARKER_PREFIX;
    },
    INSTANT_SLOT_MARKER_SUFFIX: function() {
        return INSTANT_SLOT_MARKER_SUFFIX;
    },
    INSTANT_VALIDATION_BOUNDARY_NAME: function() {
        return INSTANT_VALIDATION_BOUNDARY_NAME;
    }
});
const INSTANT_VALIDATION_BOUNDARY_NAME = '__next_instant_validation_boundary__';
const INSTANT_SLOT_MARKER_PREFIX = '__next_instant_slot_';
const INSTANT_SLOT_MARKER_SUFFIX = '__';
}),
"[project]/web/node_modules/next/dist/server/app-render/instant-validation/boundary-tracking.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    allRequiredBoundariesRendered: null,
    createValidationBoundaryTracking: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    allRequiredBoundariesRendered: function() {
        return allRequiredBoundariesRendered;
    },
    createValidationBoundaryTracking: function() {
        return createValidationBoundaryTracking;
    }
});
function createValidationBoundaryTracking(/** Pass if the render is expected to render the same IDs as a previous one. */ matchPrevious) {
    return {
        requiredIds: matchPrevious ? new Map(matchPrevious.requiredIds) : new Map(),
        renderedIds: new Set()
    };
}
function allRequiredBoundariesRendered(state) {
    for (const id of state.requiredIds.keys()){
        if (!state.renderedIds.has(id)) {
            return false;
        }
    }
    return true;
}
}),
"[project]/web/node_modules/next/dist/server/app-render/instant-validation/instant-samples.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    assertRootParamInSamples: null,
    createCookiesFromSample: null,
    createDraftModeForValidation: null,
    createExhaustiveParamsProxy: null,
    createExhaustiveSearchParamsProxy: null,
    createExhaustiveURLSearchParamsProxy: null,
    createHeadersFromSample: null,
    createRelativeURLFromSamples: null,
    createValidationSampleTracking: null,
    trackMissingSampleError: null,
    trackMissingSampleErrorAndThrow: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    assertRootParamInSamples: function() {
        return assertRootParamInSamples;
    },
    createCookiesFromSample: function() {
        return createCookiesFromSample;
    },
    createDraftModeForValidation: function() {
        return createDraftModeForValidation;
    },
    createExhaustiveParamsProxy: function() {
        return createExhaustiveParamsProxy;
    },
    createExhaustiveSearchParamsProxy: function() {
        return createExhaustiveSearchParamsProxy;
    },
    createExhaustiveURLSearchParamsProxy: function() {
        return createExhaustiveURLSearchParamsProxy;
    },
    createHeadersFromSample: function() {
        return createHeadersFromSample;
    },
    createRelativeURLFromSamples: function() {
        return createRelativeURLFromSamples;
    },
    createValidationSampleTracking: function() {
        return createValidationSampleTracking;
    },
    trackMissingSampleError: function() {
        return trackMissingSampleError;
    },
    trackMissingSampleErrorAndThrow: function() {
        return trackMissingSampleErrorAndThrow;
    }
});
const _cookies = __turbopack_context__.r("[project]/web/node_modules/next/dist/server/web/spec-extension/cookies.js [app-ssr] (ecmascript)");
const _requestcookies = __turbopack_context__.r("[project]/web/node_modules/next/dist/server/web/spec-extension/adapters/request-cookies.js [app-ssr] (ecmascript)");
const _headers = __turbopack_context__.r("[project]/web/node_modules/next/dist/server/web/spec-extension/adapters/headers.js [app-ssr] (ecmascript)");
const _getsegmentparam = __turbopack_context__.r("[project]/web/node_modules/next/dist/shared/lib/router/utils/get-segment-param.js [app-ssr] (ecmascript)");
const _parserelativeurl = __turbopack_context__.r("[project]/web/node_modules/next/dist/shared/lib/router/utils/parse-relative-url.js [app-ssr] (ecmascript)");
const _invarianterror = __turbopack_context__.r("[project]/web/node_modules/next/dist/shared/lib/invariant-error.js [app-ssr] (ecmascript)");
const _instantvalidationerror = __turbopack_context__.r("[project]/web/node_modules/next/dist/server/app-render/instant-validation/instant-validation-error.js [app-ssr] (ecmascript)");
const _workunitasyncstorageexternal = __turbopack_context__.r("[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)");
const _reflectutils = __turbopack_context__.r("[project]/web/node_modules/next/dist/shared/lib/utils/reflect-utils.js [app-ssr] (ecmascript)");
function createValidationSampleTracking() {
    return {
        missingSampleErrors: []
    };
}
function getExpectedSampleTracking() {
    let validationSampleTracking = null;
    const workUnitStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
    if (workUnitStore) {
        switch(workUnitStore.type){
            case 'request':
            case 'validation-client':
                // TODO(instant-validation-build): do we need any special handling for caches?
                validationSampleTracking = workUnitStore.validationSampleTracking ?? null;
                break;
            case 'cache':
            case 'private-cache':
            case 'unstable-cache':
            case 'prerender-legacy':
            case 'prerender-client':
            case 'prerender':
            case 'prerender-runtime':
            case 'build-time-generator':
                break;
            default:
                workUnitStore;
        }
    }
    if (!validationSampleTracking) {
        throw new _invarianterror.InvariantError('Expected to have a workUnitStore that provides validationSampleTracking');
    }
    return validationSampleTracking;
}
function trackMissingSampleError(error) {
    const validationSampleTracking = getExpectedSampleTracking();
    validationSampleTracking.missingSampleErrors.push(error);
}
function trackMissingSampleErrorAndThrow(error) {
    // TODO(instant-validation-build): this should abort the render
    trackMissingSampleError(error);
    throw error;
}
function createCookiesFromSample(sampleCookies, route) {
    const declaredNames = new Set();
    const cookies = new _cookies.RequestCookies(new Headers());
    if (sampleCookies) {
        for (const cookie of sampleCookies){
            declaredNames.add(cookie.name);
            if (cookie.value !== null) {
                cookies.set(cookie.name, cookie.value);
            }
        }
    }
    const sealed = _requestcookies.RequestCookiesAdapter.seal(cookies);
    return new Proxy(sealed, {
        get (target, prop, receiver) {
            if (prop === 'has') {
                const originalMethod = Reflect.get(target, prop, receiver);
                const wrappedMethod = function(name) {
                    if (!declaredNames.has(name)) {
                        trackMissingSampleErrorAndThrow(createMissingCookieSampleError(route, name));
                    }
                    return originalMethod.call(target, name);
                };
                return wrappedMethod;
            }
            if (prop === 'get') {
                const originalMethod = Reflect.get(target, prop, receiver);
                const wrappedMethod = function(nameOrCookie) {
                    let name;
                    if (typeof nameOrCookie === 'string') {
                        name = nameOrCookie;
                    } else if (nameOrCookie && typeof nameOrCookie === 'object' && typeof nameOrCookie.name === 'string') {
                        name = nameOrCookie.name;
                    } else {
                        // This is an invalid input. Pass it through to the original method so it can error.
                        return originalMethod.call(target, nameOrCookie);
                    }
                    if (!declaredNames.has(name)) {
                        trackMissingSampleErrorAndThrow(createMissingCookieSampleError(route, name));
                    }
                    return originalMethod.call(target, name);
                };
                return wrappedMethod;
            }
            // TODO(instant-validation-build): what should getAll do?
            // Maybe we should only allow it if there's an array (possibly empty?)
            return Reflect.get(target, prop, receiver);
        }
    });
}
function createMissingCookieSampleError(route, name) {
    return new _instantvalidationerror.InstantValidationError(`Route "${route}" accessed cookie "${name}" which is not defined in the \`unstable_samples\` ` + `of \`instant\`. Add it to the sample's \`cookies\` array, ` + `or \`{ name: "${name}", value: null }\` if it should be absent.`);
}
function createHeadersFromSample(rawSampleHeaders, sampleCookies, route) {
    // If we have cookie samples, add a `cookie` header to match.
    // Accessing it will be implicitly allowed by the proxy --
    // if the user defined some cookies, accessing the "cookie" header is also fine.
    const sampleHeaders = rawSampleHeaders ? [
        ...rawSampleHeaders
    ] : [];
    if (sampleHeaders.find(([name])=>name.toLowerCase() === 'cookie')) {
        throw new _instantvalidationerror.InstantValidationError('Invalid sample: Defining cookies via a "cookie" header is not supported. Use `cookies: [{ name: ..., value: ... }]` instead.');
    }
    if (sampleCookies) {
        const cookieHeaderValue = sampleCookies.toString();
        sampleHeaders.push([
            'cookie',
            // if the `cookies` samples were empty, or they were all `null`, then we have no cookies,
            // and the header isn't present, but should remains readable, so we set it to null.
            cookieHeaderValue !== '' ? cookieHeaderValue : null
        ]);
    }
    const declaredNames = new Set();
    const headersInit = {};
    for (const [name, value] of sampleHeaders){
        declaredNames.add(name.toLowerCase());
        if (value !== null) {
            headersInit[name.toLowerCase()] = value;
        }
    }
    const sealed = _headers.HeadersAdapter.seal(_headers.HeadersAdapter.from(headersInit));
    return new Proxy(sealed, {
        get (target, prop, receiver) {
            if (prop === 'get' || prop === 'has') {
                const originalMethod = Reflect.get(target, prop, receiver);
                const patchedMethod = function(rawName) {
                    const name = rawName.toLowerCase();
                    if (!declaredNames.has(name)) {
                        trackMissingSampleErrorAndThrow(new _instantvalidationerror.InstantValidationError(`Route "${route}" accessed header "${name}" which is not defined in the \`unstable_samples\` ` + `of \`instant\`. Add it to the sample's \`headers\` array, ` + `or \`["${name}", null]\` if it should be absent.`));
                    }
                    // typescript can't reconcile a union of functions with a union of return types,
                    // so we have to cast the original return type away
                    return originalMethod.call(target, name);
                };
                return patchedMethod;
            }
            return Reflect.get(target, prop, receiver);
        }
    });
}
function createDraftModeForValidation() {
    // Create a minimal DraftModeProvider-compatible object
    // that always reports draft mode as disabled.
    //
    // private properties that can't be set from outside the class.
    return {
        get isEnabled () {
            return false;
        },
        enable () {
            throw new Error('Draft mode cannot be enabled during build-time instant validation.');
        },
        disable () {
            throw new Error('Draft mode cannot be disabled during build-time instant validation.');
        }
    };
}
function createExhaustiveParamsProxy(underlyingParams, declaredParamNames, route) {
    return new Proxy(underlyingParams, {
        get (target, prop, receiver) {
            if (typeof prop === 'string' && !_reflectutils.wellKnownProperties.has(prop) && // Only error when accessing a param that is part of the route but wasn't provided.
            // accessing properties that aren't expected to be a valid param value is fine.
            prop in underlyingParams && !declaredParamNames.has(prop)) {
                trackMissingSampleErrorAndThrow(new _instantvalidationerror.InstantValidationError(`Route "${route}" accessed param "${prop}" which is not defined in the \`unstable_samples\` ` + `of \`instant\`. Add it to the sample's \`params\` object.`));
            }
            return Reflect.get(target, prop, receiver);
        }
    });
}
function createExhaustiveSearchParamsProxy(searchParams, declaredSearchParamNames, route) {
    return new Proxy(searchParams, {
        get (target, prop, receiver) {
            if (typeof prop === 'string' && !_reflectutils.wellKnownProperties.has(prop) && !declaredSearchParamNames.has(prop)) {
                trackMissingSampleErrorAndThrow(createMissingSearchParamSampleError(route, prop));
            }
            return Reflect.get(target, prop, receiver);
        },
        has (target, prop) {
            if (typeof prop === 'string' && !_reflectutils.wellKnownProperties.has(prop) && !declaredSearchParamNames.has(prop)) {
                trackMissingSampleErrorAndThrow(createMissingSearchParamSampleError(route, prop));
            }
            return Reflect.has(target, prop);
        }
    });
}
function createExhaustiveURLSearchParamsProxy(searchParams, declaredSearchParamNames, route) {
    return new Proxy(searchParams, {
        get (target, prop, receiver) {
            // Intercept method calls that access specific param names
            if (prop === 'get' || prop === 'getAll' || prop === 'has') {
                const originalMathod = Reflect.get(target, prop, receiver);
                return (name)=>{
                    if (typeof name === 'string' && !declaredSearchParamNames.has(name)) {
                        trackMissingSampleErrorAndThrow(createMissingSearchParamSampleError(route, name));
                    }
                    return originalMathod.call(target, name);
                };
            }
            const value = Reflect.get(target, prop, receiver);
            // Prevent `TypeError: Value of "this" must be of type URLSearchParams` for methods
            if (typeof value === 'function' && !Object.hasOwn(target, prop)) {
                return value.bind(target);
            }
            return value;
        }
    });
}
function createMissingSearchParamSampleError(route, name) {
    return new _instantvalidationerror.InstantValidationError(`Route "${route}" accessed searchParam "${name}" which is not defined in the \`unstable_samples\` ` + `of \`instant\`. Add it to the sample's \`searchParams\` object, ` + `or \`{ "${name}": null }\` if it should be absent.`);
}
function createRelativeURLFromSamples(route, sampleParams, sampleSearchParams) {
    // Build searchParams query object and URL search string from sample
    const pathname = createPathnameFromRouteAndSampleParams(route, sampleParams ?? {});
    let search = '';
    if (sampleSearchParams) {
        const qs = createURLSearchParamsFromSample(sampleSearchParams).toString();
        if (qs) {
            search = '?' + qs;
        }
    }
    return (0, _parserelativeurl.parseRelativeUrl)(pathname + search, undefined, true);
}
function createURLSearchParamsFromSample(sampleSearchParams) {
    const result = new URLSearchParams();
    if (sampleSearchParams) {
        for (const [key, value] of Object.entries(sampleSearchParams)){
            if (value === null || value === undefined) continue;
            if (Array.isArray(value)) {
                for (const v of value){
                    result.append(key, v);
                }
            } else {
                result.set(key, value);
            }
        }
    }
    return result;
}
/**
 * Substitute sample params into `workStore.route` to create a plausible pathname.
 * TODO(instant-validation-build): this logic is somewhat hacky and likely incomplete,
 * but it should be good enough for some initial testing.
 */ function createPathnameFromRouteAndSampleParams(route, params) {
    let interpolatedSegments = [];
    const rawSegments = route.split('/');
    for (const rawSegment of rawSegments){
        const param = (0, _getsegmentparam.getSegmentParam)(rawSegment);
        if (param) {
            switch(param.paramType){
                case 'catchall':
                case 'optional-catchall':
                    {
                        let paramValue = params[param.paramName];
                        if (paramValue === undefined) {
                            // The value for the param was not provided. `usePathname` will detect this and throw
                            // before this can surface to userspace. Use `[...NAME]` as a placeholder for the param value
                            // in case it pops up somewhere unexpectedly.
                            paramValue = [
                                rawSegment
                            ];
                        } else if (!Array.isArray(paramValue)) {
                            // NOTE: this happens outside of render, so we don't need `trackMissingSampleErrorAndThrow`
                            throw new _instantvalidationerror.InstantValidationError(`Expected sample param value for segment '${rawSegment}' to be an array of strings, got ${typeof paramValue}`);
                        }
                        interpolatedSegments.push(...paramValue.map((v)=>encodeURIComponent(v)));
                        break;
                    }
                case 'dynamic':
                    {
                        let paramValue = params[param.paramName];
                        if (paramValue === undefined) {
                            // The value for the param was not provided. `usePathname` will detect this and throw
                            // before this can surface to userspace. Use `[NAME]` as a placeholder for the param value
                            // in case it pops up somewhere unexpectedly.
                            paramValue = rawSegment;
                        } else if (typeof paramValue !== 'string') {
                            // NOTE: this happens outside of render, so we don't need `trackMissingSampleErrorAndThrow`
                            throw new _instantvalidationerror.InstantValidationError(`Expected sample param value for segment '${rawSegment}' to be a string, got ${typeof paramValue}`);
                        }
                        interpolatedSegments.push(encodeURIComponent(paramValue));
                        break;
                    }
                case 'catchall-intercepted-(..)(..)':
                case 'catchall-intercepted-(.)':
                case 'catchall-intercepted-(..)':
                case 'catchall-intercepted-(...)':
                case 'dynamic-intercepted-(..)(..)':
                case 'dynamic-intercepted-(.)':
                case 'dynamic-intercepted-(..)':
                case 'dynamic-intercepted-(...)':
                    {
                        // TODO(instant-validation-build): i don't know how these are supposed to work, or if we can even get them here
                        throw new _invarianterror.InvariantError('Not implemented: Validation of interception routes');
                    }
                default:
                    {
                        param.paramType;
                    }
            }
        } else {
            interpolatedSegments.push(rawSegment);
        }
    }
    return interpolatedSegments.join('/');
}
function assertRootParamInSamples(workStore, sampleParams, paramName) {
    if (sampleParams && paramName in sampleParams) {
    // The param is defined in the samples.
    } else {
        const route = workStore.route;
        trackMissingSampleErrorAndThrow(new _instantvalidationerror.InstantValidationError(`Route "${route}" accessed root param "${paramName}" which is not defined in the \`unstable_samples\` ` + `of \`instant\`. Add it to the sample's \`params\` object.`));
    }
}
}),
"[project]/web/node_modules/next/dist/server/app-render/instant-validation/instant-validation-error.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    InstantValidationError: null,
    isInstantValidationError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    InstantValidationError: function() {
        return InstantValidationError;
    },
    isInstantValidationError: function() {
        return isInstantValidationError;
    }
});
const INSTANT_VALIDATION_ERROR_DIGEST = 'INSTANT_VALIDATION_ERROR';
function isInstantValidationError(err) {
    return !!(err && typeof err === 'object' && err instanceof Error && err.digest === INSTANT_VALIDATION_ERROR_DIGEST);
}
class InstantValidationError extends Error {
    constructor(...args){
        super(...args), this.digest = INSTANT_VALIDATION_ERROR_DIGEST;
    }
}
}),
"[project]/web/node_modules/next/dist/server/app-render/segment-config/ensure-static.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    EnsureStaticLevel: null,
    resolveEnsureStaticConfig: null,
    resolveEnsureStaticLevel: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    EnsureStaticLevel: function() {
        return EnsureStaticLevel;
    },
    resolveEnsureStaticConfig: function() {
        return resolveEnsureStaticConfig;
    },
    resolveEnsureStaticLevel: function() {
        return resolveEnsureStaticLevel;
    }
});
const _parseloadertree = __turbopack_context__.r("[project]/web/node_modules/next/dist/shared/lib/router/utils/parse-loader-tree.js [app-ssr] (ecmascript)");
const _appdirmodule = __turbopack_context__.r("[project]/web/node_modules/next/dist/server/lib/app-dir-module.js [app-ssr] (ecmascript)");
var EnsureStaticLevel = /*#__PURE__*/ function(EnsureStaticLevel) {
    /** The route follows standard Partial Prefetching semantics. */ EnsureStaticLevel[EnsureStaticLevel["None"] = 0] = "None";
    /** The route requires that app shells must be statically prerendered. */ EnsureStaticLevel[EnsureStaticLevel["Shell"] = 1] = "Shell";
    /** The route requires that app shells and prefetches must be statically prerendered. */ EnsureStaticLevel[EnsureStaticLevel["Prefetch"] = 2] = "Prefetch";
    /** The route requires that app shells, prefetches, and the whole page must be statically prerendered. */ EnsureStaticLevel[EnsureStaticLevel["Navigation"] = 3] = "Navigation";
    return EnsureStaticLevel;
}({});
function getEnsureStaticLevel(ensureStatic) {
    switch(ensureStatic){
        case 'auto':
        case false:
            {
                return 0;
            }
        case 'shell':
            {
                return 1;
            }
        case 'prefetch':
            {
                return 2;
            }
        case 'navigation':
            {
                return 3;
            }
    }
}
async function resolveEnsureStaticLevel(tree, partialPrefetching) {
    return getEnsureStaticLevel(await resolveEnsureStaticConfig(tree, partialPrefetching));
}
async function resolveEnsureStaticConfig(tree, partialPrefetching) {
    let { config, filePath } = await resolveEnsureStaticConfigImpl(tree);
    if (!partialPrefetching) {
        // If Partial Prefetching is not enabled for this route, we only support
        // a subset of `ensureStatic` values.
        // (We error in `getAppPageStaticInfo` if `ensureStatic` is used without enabling
        // Cache Components, so we don't have to assert that here)
        switch(config){
            case 'auto':
                {
                    // Default to the equivalent of Cache Components prefetching behavior.
                    config = 'prefetch';
                    break;
                }
            case false:
            case 'shell':
                {
                    // Not meaningful in Cache Components without Partial Prefetching
                    const originalConfig = config;
                    config = 'prefetch';
                    console.warn(`${formatEnsureStaticExport(originalConfig)} has no effect unless the route is using Partial Prefetching.` + `\n  (from: ${filePath})`);
                    break;
                }
            case 'prefetch':
                break;
            case 'navigation':
                break;
            default:
                config;
        }
    }
    if (config === false) {
        // `false` and "auto" are equivalent once resolved.
        return 'auto';
    } else {
        return config;
    }
}
async function resolveEnsureStaticConfigImpl(tree) {
    const { mod: layoutOrPageMod, filePath } = await (0, _appdirmodule.getLayoutOrPageModule)(tree);
    const config = getEnsureStaticConfigForModule(layoutOrPageMod);
    const parentResult = {
        config,
        filePath: filePath ?? null
    };
    // Walk the slots if any and validate that they don't have incompatible configs
    // with each other. If compatible, pick the most constrained value from the slots.
    let slotsResult = null;
    let slotResultKey = null;
    const { parallelRoutes } = (0, _parseloadertree.parseLoaderTree)(tree);
    for(const parallelRouteKey in parallelRoutes){
        const parallelRoute = parallelRoutes[parallelRouteKey];
        const childResult = await resolveEnsureStaticConfigImpl(parallelRoute);
        if (!slotsResult) {
            slotsResult = childResult;
            slotResultKey = parallelRouteKey;
        } else {
            // Check if the child is compatible with the current result for the slots.
            switch(compareEnsureStatic(childResult.config, slotsResult.config)){
                case 2:
                    {
                        // 'auto' is compatible with anything, but if the current result is 'auto' and the new one isn't,
                        // we want to use the more specific result.
                        if (slotsResult.config === 'auto' && childResult.config !== 'auto') {
                            slotsResult = childResult;
                            slotResultKey = parallelRouteKey;
                        }
                        break;
                    }
                case 4:
                case 1:
                case 3:
                    {
                        throw new Error(`Parallel slots cannot have incompatible \`ensureStatic\`.` + `\n  ${formatParallelSlot(slotResultKey)}: ` + `\n    ${formatEnsureStaticExport(slotsResult.config)}` + `\n    (from: ${slotsResult.filePath})` + `\n` + `\n  ${formatParallelSlot(parallelRouteKey)}: ` + `\n    ${formatEnsureStaticExport(childResult.config)}` + `\n    (from: ${childResult.filePath})` + `\n` + `\n Possible fixes:` + `\n - Remove one of the \`ensureStatic\` exports` + `\n - Change one of the  \`ensureStatic\` exports to match the other`);
                    }
            }
        }
    }
    // Child segments can override the config from the parent with a more constrained value,
    // but they cannot have a less constrained value.
    if (!slotsResult) {
        return parentResult;
    } else {
        const comparison = compareEnsureStatic(slotsResult.config, parentResult.config);
        switch(comparison){
            case 2:
                {
                    // 'auto' is compatible with anything, but if the parent result is 'auto' and the slots one isn't,
                    // we want to use the more constrained result.
                    if (parentResult.config === 'auto' && slotsResult.config !== 'auto') {
                        return slotsResult;
                    } else {
                        return parentResult;
                    }
                }
            case 3:
                {
                    return slotsResult;
                }
            case 1:
            case 4:
                {
                    throw new Error((comparison === 1 ? `A child segment cannot override a parent segment with a less-constrained \`ensureStatic\`.` : `A child segment cannot override a parent segment with an incompatible \`ensureStatic\`.`) + `\n  Parent has: ` + `\n    ${formatEnsureStaticExport(parentResult.config)}` + `\n    (from: ${parentResult.filePath})` + `\n  Child has: ` + `\n    ${formatEnsureStaticExport(slotsResult.config)}` + `\n    (from: ${slotsResult.filePath})` + `\n` + `\n Possible fixes:` + `\n - Remove one of the \`ensureStatic\` exports` + `\n - Change one of the  \`ensureStatic\` exports to match the other`);
                }
        }
    }
}
function formatParallelSlot(slot) {
    return slot === 'children' ? slot : `@${slot}`;
}
function formatEnsureStaticExport(config) {
    return `export const ensureStatic = ${JSON.stringify(config)}`;
}
var Comparison = /*#__PURE__*/ function(Comparison) {
    Comparison[Comparison["LessConstrained"] = 1] = "LessConstrained";
    Comparison[Comparison["Compatible"] = 2] = "Compatible";
    Comparison[Comparison["MoreConstrained"] = 3] = "MoreConstrained";
    Comparison[Comparison["Incompatible"] = 4] = "Incompatible";
    return Comparison;
}(Comparison || {});
const ENSURE_STATIC_ORDER = [
    'shell',
    'prefetch',
    'navigation'
];
function compareEnsureStatic(left, right) {
    // 'auto' is compatible with everything.
    if (left === 'auto' || right === 'auto') {
        return 2;
    }
    // `false` is compatible with false.
    if (left === false && right === false) {
        return 2;
    }
    // If only one of the values is `false` (we know it's not both), it's incompatible.
    if (left === false || right === false) {
        return 4;
    }
    const leftSort = ENSURE_STATIC_ORDER.indexOf(left);
    const rightSort = ENSURE_STATIC_ORDER.indexOf(right);
    return leftSort < rightSort ? 1 : leftSort === rightSort ? 2 : 3;
}
function getEnsureStaticConfigForModule(mod) {
    return (mod ? mod.ensureStatic : undefined) ?? 'auto';
}
}),
"[project]/web/node_modules/next/dist/server/app-render/staged-rendering.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    RENDER_STAGE_ADVANCE_ORDER: null,
    RenderStage: null,
    StagedRenderingController: null,
    SyncIOMode: null,
    getNextStage: null,
    isAdvanceableRenderStage: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    RENDER_STAGE_ADVANCE_ORDER: function() {
        return RENDER_STAGE_ADVANCE_ORDER;
    },
    RenderStage: function() {
        return RenderStage;
    },
    StagedRenderingController: function() {
        return StagedRenderingController;
    },
    SyncIOMode: function() {
        return SyncIOMode;
    },
    getNextStage: function() {
        return getNextStage;
    },
    isAdvanceableRenderStage: function() {
        return isAdvanceableRenderStage;
    }
});
const _invarianterror = __turbopack_context__.r("[project]/web/node_modules/next/dist/shared/lib/invariant-error.js [app-ssr] (ecmascript)");
const _promisewithresolvers = __turbopack_context__.r("[project]/web/node_modules/next/dist/shared/lib/promise-with-resolvers.js [app-ssr] (ecmascript)");
var RenderStage = /*#__PURE__*/ function(RenderStage) {
    RenderStage[RenderStage["Before"] = 1] = "Before";
    //
    RenderStage[RenderStage["ShellStatic"] = 10] = "ShellStatic";
    /** Discrimination-only stage: `prefetch()` in validation renders (static) */ RenderStage[RenderStage["PrefetchStatic_prefetchApi"] = 11] = "PrefetchStatic_prefetchApi";
    RenderStage[RenderStage["PrefetchStatic"] = 12] = "PrefetchStatic";
    RenderStage[RenderStage["NavigationStatic"] = 13] = "NavigationStatic";
    RenderStage[RenderStage["Static"] = 14] = "Static";
    //
    RenderStage[RenderStage["ShellRuntime"] = 20] = "ShellRuntime";
    /** Discrimination-only stage: `prefetch()` in validation renders (runtime) */ RenderStage[RenderStage["PrefetchRuntime_prefetchApi"] = 21] = "PrefetchRuntime_prefetchApi";
    RenderStage[RenderStage["PrefetchRuntime"] = 22] = "PrefetchRuntime";
    RenderStage[RenderStage["NavigationRuntime"] = 23] = "NavigationRuntime";
    //
    RenderStage[RenderStage["Dynamic"] = 30] = "Dynamic";
    RenderStage[RenderStage["Abandoned"] = 40] = "Abandoned";
    return RenderStage;
}({});
const RENDER_STAGE_ADVANCE_ORDER = [
    10,
    11,
    12,
    13,
    14,
    20,
    21,
    22,
    23,
    30
];
function getNextStage(stage) {
    return RENDER_STAGE_ADVANCE_ORDER[RENDER_STAGE_ADVANCE_ORDER.indexOf(stage) + 1];
}
function isAdvanceableRenderStage(stage) {
    return 1 < stage && stage <= 30;
}
var SyncIOMode = /*#__PURE__*/ function(SyncIOMode) {
    /** Sync IO does not error in any stage. */ SyncIOMode[SyncIOMode["Untracked"] = 1] = "Untracked";
    /** Before `partialPrefetching`: Sync IO errors in static stages, and is allowed otherwise. */ SyncIOMode[SyncIOMode["AllowedInRuntimeOrDynamic"] = 2] = "AllowedInRuntimeOrDynamic";
    /** After `partialPrefetching`: Sync IO errors in all stages other than dynamic. */ SyncIOMode[SyncIOMode["AllowedInDynamic"] = 3] = "AllowedInDynamic";
    return SyncIOMode;
}({});
class StagedRenderingController {
    constructor({ abortSignal, abandonController, syncIO, finalStage }){
        this.currentStage = 1;
        this.syncInterruptReason = null;
        this.triggers = createAdvanceableStageTriggers();
        this.abortSignal = abortSignal;
        this.abandonController = abandonController;
        this.syncIOMode = syncIO;
        this.finalStage = finalStage;
        if (abortSignal) {
            abortSignal.addEventListener('abort', ()=>{
                // Reject all stage promises that haven't already been resolved.
                // `cancelStageTrigger` is a noop if the trigger already resolved.
                const { reason } = abortSignal;
                for (const trigger of Object.values(this.triggers)){
                    cancelStageTrigger(trigger, reason);
                }
            }, {
                once: true
            });
        }
        if (abandonController) {
            abandonController.signal.addEventListener('abort', ()=>{
                this.abandonRender();
            }, {
                once: true
            });
        }
    }
    /**
   * Schedules a callback that will execute synchronously when the controller is advanced
   * to `stage` or past it, before any promises for that stage are resolved.
   * If the controller is already past `stage`, the callback is executed immediately.
   * */ onStage(stage, callback) {
        addSyncTriggerListener(this.triggers[stage], callback);
    }
    shouldTrackSyncInterrupt() {
        const { syncIOMode, currentStage } = this;
        switch(syncIOMode){
            case 1:
                {
                    return false;
                }
            case 2:
                {
                    // Legacy: track Sync IO only in static stages.
                    // Do not track it before the render, or in runtime/dynamic stages.
                    return currentStage > 1 && currentStage <= 14;
                }
            case 3:
                {
                    // Track sync IO in all cacheable stages.
                    // This means all stages except:
                    // - before the render
                    // - in the dynamic stage
                    return currentStage > 1 && currentStage < 30;
                }
        }
    }
    /** Note: only call this if `shouldTrackSyncInterrupt()` returned true */ syncInterruptCurrentStageWithReason(reason) {
        const { currentStage } = this;
        if (currentStage === 1 || currentStage === 30 || currentStage === 40) {
            // Not interruptible. Defensive noop.
            return;
        }
        // If Sync IO occurs during an abandonable render, we trigger the abandon.
        // The abandon listener will call abandonRender which advances through
        // stages to let caches fill before marking as Abandoned.
        if (this.abandonController) {
            this.abandonController.abort();
            return;
        }
        if (this.abortSignal) {
            // If this is an abortable render, we capture the interruption reason and stop advancing.
            // We don't release any more promises.
            // The caller is expected to abort the signal.
            this.syncInterruptReason = reason;
            this.currentStage = 40;
            return;
        }
        // If we're in a non-abandonable & non-abortable render,
        // we need to advance to the Dynamic stage and capture the interruption reason.
        // (in dev, this will be the restarted render)
        this.syncInterruptReason = reason;
        this.advanceStage(30);
    }
    getSyncInterruptReason() {
        return this.syncInterruptReason;
    }
    getStageEndTime(stage) {
        return this.triggers[getNextStage(stage)].triggeredAt ?? Infinity;
    }
    abandonRender() {
        // In staged rendering, only the initial render is abandonable.
        // We can abandon the initial render if
        //   1. We notice a cache miss, and need to wait for caches to fill
        //   2. A sync IO error occurs, and the render should be interrupted
        //      (this might be a lazy intitialization of a module,
        //       so we still want to restart in this case and see if it still occurs)
        // In either case, we'll be doing another render after this one,
        // so we only want to unblock the next stage, not Dynamic, because
        // unblocking the dynamic stage would likely lead to wasted (uncached) IO.
        const { currentStage } = this;
        if (currentStage === 1) {
            throw new _invarianterror.InvariantError("A render that hasn't started yet cannot be abandoned");
        }
        if (currentStage === 30 || currentStage === 40) {
            // We shouldn't ever trigger an abandon in these. Defensive noop.
            return;
        }
        // Resolve all stages after the current one, up to runtime (excluding dynamic)
        const nextStageIx = RENDER_STAGE_ADVANCE_ORDER.indexOf(currentStage) + 1;
        const dynamicStageIx = RENDER_STAGE_ADVANCE_ORDER.indexOf(30);
        for(let i = nextStageIx; i < dynamicStageIx; i++){
            this.resolveStage(RENDER_STAGE_ADVANCE_ORDER[i]);
        }
        this.currentStage = 40;
    }
    advanceStage(targetStage) {
        if (this.finalStage !== null && targetStage > this.finalStage) {
            throw new _invarianterror.InvariantError(`Attempted to advance to stage ${RenderStage[targetStage]} but the render is limited to ${RenderStage[this.finalStage]}`);
        }
        const { currentStage } = this;
        if (currentStage === 30 || currentStage === 40) {
            // Terminal stages, nowhere left to advance.
            return;
        }
        // If we're already at the target stage or beyond, do nothing.
        if (targetStage <= currentStage) {
            return;
        }
        this.currentStage = targetStage;
        // Resolve all stages between the current stage and the target.
        const nextStageIx = currentStage === 1 ? 0 : RENDER_STAGE_ADVANCE_ORDER.indexOf(currentStage) + 1;
        const targetStageIx = RENDER_STAGE_ADVANCE_ORDER.indexOf(targetStage);
        for(let i = nextStageIx; i <= targetStageIx; i++){
            this.resolveStage(RENDER_STAGE_ADVANCE_ORDER[i]);
        }
    }
    resolveStage(stage) {
        fireStageTrigger(this.triggers[stage]);
    }
    getStagePromise(stage) {
        return this.triggers[stage].promise;
    }
    waitForStage(stage) {
        return this.getStagePromise(stage);
    }
    delayUntilStage(stage, displayName, resolvedValue) {
        const stagePromise = this.getStagePromise(stage);
        const promise = ("TURBOPACK compile-time truthy", 1) ? makeDevtoolsIOPromiseFromIOTrigger(stagePromise, displayName, resolvedValue) : "TURBOPACK unreachable";
        // Analogously to `makeDynamicHangingPromise`, we might reject this promise if the signal is invoked.
        // (e.g. in the case where we don't want want the render to proceed to the dynamic stage and abort it).
        // We shouldn't consider this an unhandled rejection, so we attach a noop catch handler here to suppress this warning.
        if (this.abortSignal) {
            promise.catch(ignoreReject);
        }
        return promise;
    }
}
function createAdvanceableStageTriggers() {
    const triggers = {};
    for (const stage of RENDER_STAGE_ADVANCE_ORDER){
        triggers[stage] = createStageTrigger();
    }
    return triggers;
}
function ignoreReject() {}
// TODO(restart-on-cache-miss): the layering of `delayUntilStage`,
// `makeDevtoolsIOPromiseFromIOTrigger` and and `makeDevtoolsIOAwarePromise`
// is confusing, we should clean it up.
function makeDevtoolsIOPromiseFromIOTrigger(ioTrigger, displayName, resolvedValue) {
    // If we create a `new Promise` and give it a displayName
    // (with no userspace code above us in the stack)
    // React Devtools will use it as the IO cause when determining "suspended by".
    // In particular, it should shadow any inner IO that resolved/rejected the promise
    // (in case of staged rendering, this will be the `setTimeout` that triggers the relevant stage)
    const promise = new Promise((resolve, reject)=>{
        ioTrigger.then(resolve.bind(null, resolvedValue), reject);
    });
    if (displayName !== undefined) {
        // @ts-expect-error
        promise.displayName = displayName;
    }
    return promise;
}
function addSyncTriggerListener(trigger, listener) {
    if (trigger.state === 'pending') {
        trigger._listeners.push(listener);
    } else {
        listener();
    }
}
function createStageTrigger() {
    const { promise, resolve, reject } = (0, _promisewithresolvers.createPromiseWithResolvers)();
    return {
        state: 'pending',
        triggeredAt: null,
        promise,
        _listeners: [],
        _resolvePromise: resolve,
        _rejectPromise: reject
    };
}
function fireStageTrigger(trigger) {
    if (trigger.state !== 'pending') {
        return;
    }
    trigger.state = 'triggered';
    trigger.triggeredAt = performance.now() + performance.timeOrigin;
    try {
        const { _listeners: listeners } = trigger;
        for(let i = 0; i < listeners.length; i++){
            listeners[i]();
        }
        listeners.length = 0;
    } finally{
        trigger._resolvePromise();
    }
}
function cancelStageTrigger(trigger, reason) {
    if (trigger.state !== 'pending') {
        return;
    }
    trigger.state = 'cancelled';
    // we didn't trigger, so don't save `triggeredAt`.
    // We're not gonna fire the listeners, we may as well free them.
    trigger._listeners.length = 0;
    // Suppress unhandled rejection warnings for promises that no one is awaiting.
    trigger.promise.catch(ignoreReject);
    trigger._rejectPromise(reason);
}
}),
"[project]/web/node_modules/next/dist/server/dynamic-rendering-utils.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    ClientHookDynamicError: null,
    RENDER_STAGES_BY_DATA_KIND: null,
    applyOwnerStack: null,
    createPrerenderDataTracking: null,
    finishPrerenderDataTracking: null,
    isClientHookDynamicError: null,
    isHangingPromiseRejectionError: null,
    makeClientHookHangingPromise: null,
    makeDevtoolsIOAwarePromise: null,
    makeDynamicHangingPromise: null,
    makeFallbackParamsHangingPromise: null,
    makePrefetchHangingPromise: null,
    makePromiseFromTrigger: null,
    makeSessionDataHangingPromise: null,
    makeURLDataHangingPromise: null,
    makeUnknownRuntimeDataHangingPromise: null,
    makeUntrackedHangingPromise: null,
    trackFallbackParamsAccessed: null,
    trackIncompatibleShellContent: null,
    trackPromiseUsed: null,
    trackURLDataAccessed: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    ClientHookDynamicError: function() {
        return ClientHookDynamicError;
    },
    RENDER_STAGES_BY_DATA_KIND: function() {
        return RENDER_STAGES_BY_DATA_KIND;
    },
    applyOwnerStack: function() {
        return applyOwnerStack;
    },
    createPrerenderDataTracking: function() {
        return createPrerenderDataTracking;
    },
    finishPrerenderDataTracking: function() {
        return finishPrerenderDataTracking;
    },
    isClientHookDynamicError: function() {
        return isClientHookDynamicError;
    },
    isHangingPromiseRejectionError: function() {
        return isHangingPromiseRejectionError;
    },
    makeClientHookHangingPromise: function() {
        return makeClientHookHangingPromise;
    },
    makeDevtoolsIOAwarePromise: function() {
        return makeDevtoolsIOAwarePromise;
    },
    makeDynamicHangingPromise: function() {
        return makeDynamicHangingPromise;
    },
    makeFallbackParamsHangingPromise: function() {
        return makeFallbackParamsHangingPromise;
    },
    makePrefetchHangingPromise: function() {
        return makePrefetchHangingPromise;
    },
    makePromiseFromTrigger: function() {
        return makePromiseFromTrigger;
    },
    makeSessionDataHangingPromise: function() {
        return makeSessionDataHangingPromise;
    },
    makeURLDataHangingPromise: function() {
        return makeURLDataHangingPromise;
    },
    makeUnknownRuntimeDataHangingPromise: function() {
        return makeUnknownRuntimeDataHangingPromise;
    },
    makeUntrackedHangingPromise: function() {
        return makeUntrackedHangingPromise;
    },
    trackFallbackParamsAccessed: function() {
        return trackFallbackParamsAccessed;
    },
    trackIncompatibleShellContent: function() {
        return trackIncompatibleShellContent;
    },
    trackPromiseUsed: function() {
        return trackPromiseUsed;
    },
    trackURLDataAccessed: function() {
        return trackURLDataAccessed;
    }
});
const _invarianterror = __turbopack_context__.r("[project]/web/node_modules/next/dist/shared/lib/invariant-error.js [app-ssr] (ecmascript)");
const _promisewithresolvers = __turbopack_context__.r("[project]/web/node_modules/next/dist/shared/lib/promise-with-resolvers.js [app-ssr] (ecmascript)");
const _ensurestatic = __turbopack_context__.r("[project]/web/node_modules/next/dist/server/app-render/segment-config/ensure-static.js [app-ssr] (ecmascript)");
const _stagedrendering = __turbopack_context__.r("[project]/web/node_modules/next/dist/server/app-render/staged-rendering.js [app-ssr] (ecmascript)");
const _workasyncstorageexternal = __turbopack_context__.r("[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)");
const _workunitasyncstorageexternal = __turbopack_context__.r("[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)");
const _runtimereactsexternal = __turbopack_context__.r("[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)");
function isHangingPromiseRejectionError(err) {
    if (typeof err !== 'object' || err === null || !('digest' in err)) {
        return false;
    }
    return err.digest === HANGING_PROMISE_REJECTION;
}
const HANGING_PROMISE_REJECTION = 'HANGING_PROMISE_REJECTION';
class HangingPromiseRejectionError extends Error {
    constructor(route, expression){
        super(`During prerendering, ${expression} rejects when the prerender is complete. Typically these errors are handled by React but if you move ${expression} to a different context by using \`setTimeout\`, \`after\`, or similar functions you may observe this error and you should handle it in that context. This occurred at route "${route}".`), this.route = route, this.expression = expression, this.digest = HANGING_PROMISE_REJECTION;
    }
}
const CLIENT_HOOK_DYNAMIC = 'CLIENT_HOOK_DYNAMIC';
class ClientHookDynamicError extends Error {
    constructor(route, expression){
        super(`Route "${route}": Next.js encountered URL data \`${expression}\` in a Client Component outside of \`<Suspense>\`.\n\n` + `This blocks prerendering because the value is only available at runtime.\n\n` + `Ways to fix this:\n` + `  - [stream] Wrap the component in \`<Suspense fallback={...}>\` so the hook value streams in after prerendering\n` + `  - [block] Set \`export const instant = false\` to allow a blocking route\n\n` + `Learn more: https://nextjs.org/docs/messages/blocking-prerender-client-hook`), this.digest = CLIENT_HOOK_DYNAMIC;
    }
}
function isClientHookDynamicError(err) {
    if (typeof err !== 'object' || err === null || !('digest' in err)) {
        return false;
    }
    return err.digest === CLIENT_HOOK_DYNAMIC;
}
const abortListenersBySignal = new WeakMap();
function makeDynamicHangingPromise(signal, route, expression) {
    return makeHangingPromiseWithError(signal, new HangingPromiseRejectionError(route, expression));
}
function makeUntrackedHangingPromise(signal, route, expression) {
    return makeHangingPromiseWithError(signal, new HangingPromiseRejectionError(route, expression));
}
function makeSessionDataHangingPromise(signal, route, expression, workUnitStore) {
    const promise = makeHangingPromiseWithError(signal, new HangingPromiseRejectionError(route, expression));
    return trackPromiseUsed(promise, trackSessionDataAccessed.bind(null, workUnitStore, expression));
}
function makeURLDataHangingPromise(signal, route, expression, workUnitStore) {
    const promise = makeHangingPromiseWithError(signal, new HangingPromiseRejectionError(route, expression));
    if (workUnitStore === null) {
        return promise;
    }
    return trackPromiseUsed(promise, trackURLDataAccessed.bind(null, workUnitStore, expression));
}
function makeUnknownRuntimeDataHangingPromise(signal, route, expression, workUnitStore) {
    // We don't know if this is session or URL data, i.e. if it should affect the shell
    // or only the prefetch. Track it conservatively as affecting both.
    return makeSessionDataHangingPromise(signal, route, expression, workUnitStore);
}
function makePrefetchHangingPromise(signal, route, expression) {
    return makeUntrackedHangingPromise(signal, route, expression);
}
function makeFallbackParamsHangingPromise(signal, route, expression, workUnitStore) {
    const promise = makeHangingPromiseWithError(signal, new HangingPromiseRejectionError(route, expression));
    if (workUnitStore === null) {
        return promise;
    }
    return trackPromiseUsed(promise, trackFallbackParamsAccessed.bind(null, workUnitStore, expression));
}
function createPrerenderDataTracking() {
    return {
        runtimeDataAccessed: (0, _promisewithresolvers.createPromiseWithResolvers)(),
        shouldAttemptStaticShell: true,
        shouldAttemptStaticPrefetch: true
    };
}
function finishPrerenderDataTracking(prerenderDataTracking) {
    // If a runtime data access already resolved this promise, this is a no-op.
    prerenderDataTracking.runtimeDataAccessed.resolve(false);
}
/**
 * Records on a static prerender store that the render accessed a data source
 * which would have resolved in a runtime shell (or runtime prefetch).
 * No-op for all other store types.
 *
 * Prefer `makeRuntimeHangingPromise`. Use this function only when implementing
 * similar tracking and that one is not enough.
 */ function trackSessionDataAccessed(workUnitStore, expression) {
    trackRuntimeDataAccessed(workUnitStore, 1, expression);
}
function trackURLDataAccessed(workUnitStore, expression) {
    trackRuntimeDataAccessed(workUnitStore, 2, expression);
}
function trackFallbackParamsAccessed(workUnitStore, expression) {
    trackRuntimeDataAccessed(workUnitStore, 3, expression);
}
function trackRuntimeDataAccessed(workUnitStore, dataKind, expression) {
    switch(workUnitStore.type){
        case 'prerender':
            {
                const { prerenderDataTracking, stagedRendering } = workUnitStore;
                if (!prerenderDataTracking || !stagedRendering) {
                    return;
                }
                const { currentStage } = stagedRendering;
                if (currentStage === _stagedrendering.RenderStage.Before) {
                    console.error(new _invarianterror.InvariantError('Unexpected trackRuntimeDataAccessed in the Before stage.'));
                    return;
                }
                if (currentStage >= _stagedrendering.RenderStage.NavigationStatic) {
                    // Ignore any accesses that happen after `navigation()` resolves.
                    // The purpose of this tracking is to judge whether a runtime prefetch
                    // would give us a more complete result than a static one.
                    // But `navigation()` wouldn't have resolved in a runtime prefetch,
                    // so e.g. `await navigation(); await cookies()` wouldn't have more content
                    // in those, and we shouldn't count it.
                    return;
                }
                const ensureStaticLevel = workUnitStore.ensureStaticLevel ?? _ensurestatic.EnsureStaticLevel.None;
                // NOTE: In general, we keep hints in sync with `needsRuntimeRequest`, but they
                // don't have to always match. The client re-uses hints for the entire route,
                // while `needsRuntimeRequest` can vary across individual prerendered param values
                // (e.g. if cookies are accessed depending on a param value).
                // Hints can also become outdated if a route only starts using runtime data
                // after a revalidation, so we have to expect this and be resilient to it.
                // Also see the upgradeable fallback params case below, which deliberately
                // puts them out of sync.
                switch(dataKind){
                    case 1:
                        {
                            // Potentially deopt both the shell and the prefetch,
                            // because if the shell accessed runtime data, so does the prefetch.
                            // However, if we're already past the shell stage, the shell is not affected.
                            // (which makes e.g. `await prefetch(); await cookies()` only affect the prefetch)
                            let firstAffectedStage = null;
                            if (currentStage <= _stagedrendering.RenderStage.ShellStatic && // Only track if we're not forcing the shell to be static.
                            ensureStaticLevel < _ensurestatic.EnsureStaticLevel.Shell) {
                                prerenderDataTracking.shouldAttemptStaticShell = false;
                                firstAffectedStage ??= _stagedrendering.RenderStage.ShellStatic;
                                logRuntimeDeopt == null ? void 0 : logRuntimeDeopt(expression, 'shell');
                            }
                            if (currentStage <= _stagedrendering.RenderStage.PrefetchStatic && // Only track if we're not forcing the prefetch to be static.
                            ensureStaticLevel < _ensurestatic.EnsureStaticLevel.Prefetch) {
                                prerenderDataTracking.shouldAttemptStaticPrefetch = false;
                                // NOTE: if the shell is affected, don't override it.
                                firstAffectedStage ??= _stagedrendering.RenderStage.PrefetchStatic;
                                logRuntimeDeopt == null ? void 0 : logRuntimeDeopt(expression, 'prefetch');
                            }
                            if (firstAffectedStage !== null) {
                                markRuntimeDataAccessWhenStageReached(prerenderDataTracking, stagedRendering, firstAffectedStage);
                            }
                            break;
                        }
                    case 3:
                        {
                            if (workUnitStore.isFallbackUpgradeable) {
                                // An fallback-param access is transient when the route is
                                // fallback-upgradeable (i.e. ISR later produces the concrete prerender a
                                // static prefetch would hit) so it does not indicate the need for a runtime
                                // request and thus does not affect the static hints.
                                //
                                // If runtime prefetches are not disallowed by `ensureStatic`, then we still
                                // set `runtimeDataAccessed` (while keeping the hints static). This means that
                                // if the concrete prerender isn't ready yet and we served the fallback, then
                                // the client knows it can use a *runtime* prefetch for speculative links --
                                // a runtime prefetch can provide the same content (or more) as the concrete
                                // prerender would.
                                if (ensureStaticLevel < _ensurestatic.EnsureStaticLevel.Prefetch) {
                                    markRuntimeDataAccessWhenStageReached(prerenderDataTracking, stagedRendering, _stagedrendering.RenderStage.PrefetchStatic);
                                    logRuntimeUpgradeableFallback == null ? void 0 : logRuntimeUpgradeableFallback();
                                }
                                break;
                            }
                        // not an upgradeable fallback param access, so we treat it as URL data.
                        // intentional fallthrough
                        }
                    case 2:
                        {
                            // Only deopt the prefetch, not the shell, which cannot access URL data anyway.
                            if (currentStage <= _stagedrendering.RenderStage.PrefetchStatic && ensureStaticLevel < _ensurestatic.EnsureStaticLevel.Prefetch) {
                                prerenderDataTracking.shouldAttemptStaticPrefetch = false;
                                logRuntimeDeopt == null ? void 0 : logRuntimeDeopt(expression, 'prefetch');
                                markRuntimeDataAccessWhenStageReached(prerenderDataTracking, stagedRendering, _stagedrendering.RenderStage.PrefetchStatic);
                            }
                            break;
                        }
                }
                break;
            }
        case 'prerender-client':
        case 'prerender-legacy':
        case 'prerender-runtime':
        case 'validation-client':
        case 'request':
        case 'cache':
        case 'private-cache':
        case 'unstable-cache':
        case 'build-time-generator':
            break;
        default:
            workUnitStore;
    }
}
/**
 * Tracks a runtime data access on the `runtimeDataAccessed` promise,
 * but with a delay until `targetStage`.
 *
 * When we encounter a URL data access like `await params`, we need to mark the
 * *prefetch* as needing runtime data, but the *shell* should remain unaffected
 * (because it cannot access params anyway).
 *
 * However, the shell and the prefetch share one `runtimeDataAccessed` promise,
 * and it needs to be accurately rewindable by the client
 * In other words, we need to make sure that it reads as `false` when rewound
 * to a shell, but as `true` in the final response (the prefetch).
 *
 * This means that if the `await params` is encountered during the shell stage, we
 * cannot resolve `runtimeDataAccessed` immediately.
 * Instead, we delay the resolution until the PrefetchStatic stage, so the promise
 * will remain unresolved when rewound to the shell stage (which reads as `false`).
 */ function markRuntimeDataAccessWhenStageReached(prerenderDataTracking, stageController, targetStage) {
    const { runtimeDataAccessed } = prerenderDataTracking;
    // NOTE: If we're already in or past the target stage, we can avoid allocating a closure,
    // because `onStage` would've executed the callback immediately anyway.
    if (stageController.currentStage >= targetStage) {
        runtimeDataAccessed.resolve(true);
    } else {
        stageController.onStage(targetStage, runtimeDataAccessed.resolve.bind(null, true));
    }
}
const logRuntimeDeopt = process.env.NEXT_PRIVATE_DEBUG_RUNTIME_DATA ? (expression, kind)=>{
    const { route } = _workasyncstorageexternal.workAsyncStorage.getStore();
    console.log(`Route '${route}': deopting to a runtime ${kind} because it used ${expression}`);
} : undefined;
const logRuntimeUpgradeableFallback = process.env.NEXT_PRIVATE_DEBUG_RUNTIME_DATA ? ()=>{
    const { route } = _workasyncstorageexternal.workAsyncStorage.getStore();
    console.log(`Route '${route}': marking upgradeable fallback as runtime prefetchable`);
} : undefined;
function trackIncompatibleShellContent(workUnitStore, reason) {
    const { stagedRendering } = workUnitStore;
    if (!stagedRendering) {
        return;
    }
    // TODO(app-shells): optimize this to only consider stages that are relevant for validation.
    // We should only track incompatible content when it can affect them.
    // For now, we simply exclude everything that happens in the dynamic stage.
    // (Note that we also need to account for cache misses that move things to a
    // different stage -- those should also preemptively set `hasIncompatibleShellContent`
    // because there's a chance that a render with warm caches would set it)
    const { currentStage } = stagedRendering;
    if (currentStage === _stagedrendering.RenderStage.Dynamic || currentStage === _stagedrendering.RenderStage.Abandoned) {
        return;
    }
    if (process.env.NEXT_PRIVATE_DEBUG_VALIDATION) {
        const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
        console.log(`Route ${workStore.route}: Incompatible shell content: ${reason}`);
    }
    workUnitStore.hasIncompatibleShellContent = true;
}
function makeClientHookHangingPromise(signal, error) {
    return makeHangingPromiseWithError(signal, error);
}
function makeHangingPromiseWithError(signal, error) {
    if (signal.aborted) {
        return Promise.reject(error);
    } else {
        const hangingPromise = new Promise((_, reject)=>{
            const boundRejection = reject.bind(null, error);
            let currentListeners = abortListenersBySignal.get(signal);
            if (currentListeners) {
                currentListeners.push(boundRejection);
            } else {
                const listeners = [
                    boundRejection
                ];
                abortListenersBySignal.set(signal, listeners);
                signal.addEventListener('abort', ()=>{
                    for(let i = 0; i < listeners.length; i++){
                        listeners[i]();
                    }
                }, {
                    once: true
                });
            }
        });
        // We are fine if no one actually awaits this promise. We shouldn't consider this an unhandled rejection so
        // we attach a noop catch handler here to suppress this warning. If you actually await somewhere or construct
        // your own promise out of it you'll need to ensure you handle the error when it rejects.
        hangingPromise.catch(ignoreReject);
        return hangingPromise;
    }
}
function ignoreReject() {}
function makePromiseFromTrigger(trigger, value) {
    const promise = trigger.then(()=>value);
    promise.catch(ignoreReject);
    return promise;
}
function makeDevtoolsIOAwarePromise(underlying, requestStore, stage) {
    if (requestStore.stagedRendering) {
        // We resolve each stage in a timeout, so React DevTools will pick this up as IO.
        return requestStore.stagedRendering.delayUntilStage(stage, undefined, underlying);
    }
    // in React DevTools if we resolve in a setTimeout we will observe
    // the promise resolution as something that can suspend a boundary or root.
    return new Promise((resolve)=>{
        // Must use setTimeout to be considered IO React DevTools. setImmediate will not work.
        setTimeout(()=>{
            resolve(underlying);
        }, 0);
    });
}
function trackPromiseUsed(promise, onUse) {
    // We can instrument `.then()/.catch()/.finally()` in one go by using a Promise subclass
    // that implements a custom `.then()`, because `catch` and `finally` delegate to it.
    //
    // Alternative implementation ideas that were tried and rejected:
    //
    // 1. Patching the methods directly via `promise.then = (..args) => { ... }`:
    //   doesn't work, because Node does not call the monkeypatched methods for native `await`:
    //   > Native Promise [...]: The promise is directly used and awaited natively, without calling `then()`.
    //   > https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#description
    //
    // 2. Wrapping in a proxy that returns a custom `then/catch/finally`:
    //   breaks async stacks in React's IO tracking (stack becomes `Promise.then`)
    return TrackedPromise.from(promise, onUse);
}
class TrackedPromise extends Promise {
    #onUse;
    // We don't need derived promises to also be a TrackedPromise.
    // We only care about the first level of `.then()`.
    static get [Symbol.species]() {
        return Promise;
    }
    static from(promise, onUse) {
        // Whenever the promise we're tracking resolves/rejects, we should follow.
        const tracked = new TrackedPromise(promise.then.bind(promise));
        tracked.#onUse = onUse;
        // Hanging promises catch rejections when created. Tracked promises are generally derived
        // from promises that may hang & reject, so we need to do the same.
        // However, we have to bypass the tracking we do in `TrackedPromise.then`.
        // (we're using `then` directly, because `catch` ends up delegating `TrackedPromise.then`)
        Promise.prototype.then.call(tracked, undefined, ignoreReject);
        return tracked;
    }
    then(onFulfilled, onRejected) {
        const onUse = this.#onUse;
        if (onUse) {
            try {
                onUse();
            } catch (err) {
                // We don't want to break the method even if our tracking errored.
                console.error(err);
            }
        }
        return Promise.prototype.then.call(this, onFulfilled, onRejected);
    }
    constructor(...args){
        super(...args), this.#onUse = null;
    }
}
const RENDER_STAGES_BY_DATA_KIND = {
    sessionData: _stagedrendering.RenderStage.ShellRuntime,
    /**
   * Statically-prerenderable URL data, like static `params`.
   * It may need to be pushed to a runtime stage in a runtime prerender,
   * but it's semantically distinct from `runtimeUrlData` like `searchParams`,
   * which is always excluded from static prerenders.
   * */ staticUrlData: {
        /**
     * From that app's point of view, `prefetch()` is semantically the same as
     * `staticUrlData`, because it does not resolve in a shell but resolves in
     * a prefetch (even a static one).
     * We handle it separately to provide a specialized error in validation renders.
     */ prefetchApi: {
            static: _stagedrendering.RenderStage.PrefetchStatic_prefetchApi,
            runtime: _stagedrendering.RenderStage.PrefetchRuntime_prefetchApi
        },
        static: _stagedrendering.RenderStage.PrefetchStatic,
        runtime: _stagedrendering.RenderStage.PrefetchRuntime
    },
    /**
   * URL data that is never statically-prerenderable, like static `searchParams`.
   * */ runtimeUrlData: _stagedrendering.RenderStage.PrefetchRuntime
};
function applyOwnerStack(error) {
    if ("TURBOPACK compile-time truthy", 1) {
        var _getClientReact_captureOwnerStack, _getClientReact, _getServerReact_captureOwnerStack, _getServerReact;
        let ownerStack;
        const workUnitStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
        // captureOwnerStack() returns the owner stack for the current React
        // rendering context. Inside a cache scope this only includes the inner
        // component tree. The outer owner stack (captured before entering the
        // cache boundary in use-cache-wrapper.ts) is stored on the cache store.
        // We concatenate both to get the full component tree.
        const innerOwnerStack = ((_getClientReact = (0, _runtimereactsexternal.getClientReact)()) == null ? void 0 : (_getClientReact_captureOwnerStack = _getClientReact.captureOwnerStack) == null ? void 0 : _getClientReact_captureOwnerStack.call(_getClientReact)) ?? ((_getServerReact = (0, _runtimereactsexternal.getServerReact)()) == null ? void 0 : (_getServerReact_captureOwnerStack = _getServerReact.captureOwnerStack) == null ? void 0 : _getServerReact_captureOwnerStack.call(_getServerReact));
        switch(workUnitStore == null ? void 0 : workUnitStore.type){
            case 'cache':
            case 'private-cache':
                ownerStack = (innerOwnerStack || '') + (workUnitStore.outerOwnerStack || '') || undefined;
                break;
            case 'unstable-cache':
            case 'request':
            case 'prerender':
            case 'prerender-legacy':
            case 'prerender-runtime':
            case 'prerender-client':
            case 'validation-client':
            case 'build-time-generator':
            case undefined:
                ownerStack = innerOwnerStack;
                break;
            default:
                workUnitStore;
        }
        if (ownerStack) {
            let stack = ownerStack;
            if (error.stack) {
                const frames = [];
                for (const frame of error.stack.split('\n').slice(1)){
                    if (frame.includes('react_stack_bottom_frame')) {
                        break;
                    }
                    frames.push(frame);
                }
                stack = '\n' + frames.join('\n') + stack;
            }
            error.stack = error.name + ': ' + error.message + stack;
        }
    }
    return error;
}
}),
"[project]/web/node_modules/next/dist/server/lib/app-dir-module.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getComponentTypeModule: null,
    getLayoutOrPageModule: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getComponentTypeModule: function() {
        return getComponentTypeModule;
    },
    getLayoutOrPageModule: function() {
        return getLayoutOrPageModule;
    }
});
const _segment = __turbopack_context__.r("[project]/web/node_modules/next/dist/shared/lib/segment.js [app-ssr] (ecmascript)");
async function getLayoutOrPageModule(loaderTree) {
    const { layout, page, defaultPage } = loaderTree[2];
    const isLayout = typeof layout !== 'undefined';
    const isPage = typeof page !== 'undefined';
    const isDefaultPage = typeof defaultPage !== 'undefined' && loaderTree[0] === _segment.DEFAULT_SEGMENT_KEY;
    let mod = undefined;
    let modType = undefined;
    let filePath = undefined;
    if (isLayout) {
        mod = await layout[0]();
        modType = 'layout';
        filePath = layout[1];
    } else if (isPage) {
        mod = await page[0]();
        modType = 'page';
        filePath = page[1];
    } else if (isDefaultPage) {
        mod = await defaultPage[0]();
        modType = 'page';
        filePath = defaultPage[1];
    }
    return {
        mod,
        modType,
        filePath
    };
}
async function getComponentTypeModule(loaderTree, moduleType) {
    const { [moduleType]: module1 } = loaderTree[2];
    if (typeof module1 !== 'undefined') {
        return await module1[0]();
    }
    return undefined;
}
}),
"[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/contexts/router-context.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/web/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['contexts'].RouterContext;
}),
"[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/web/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime;
}),
"[project]/web/node_modules/next/dist/server/web/spec-extension/adapters/headers.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    HeadersAdapter: null,
    ReadonlyHeadersError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    HeadersAdapter: function() {
        return HeadersAdapter;
    },
    ReadonlyHeadersError: function() {
        return ReadonlyHeadersError;
    }
});
const _reflect = __turbopack_context__.r("[project]/web/node_modules/next/dist/server/web/spec-extension/adapters/reflect.js [app-ssr] (ecmascript)");
class ReadonlyHeadersError extends Error {
    constructor(){
        super('Headers cannot be modified. Read more: https://nextjs.org/docs/app/api-reference/functions/headers');
    }
    static callable() {
        throw new ReadonlyHeadersError();
    }
}
/**
 * Builds the read methods for a sealed view that exposes all of `target`.
 */ function createPassThroughMethods(target, sealed) {
    return {
        get: target.get.bind(target),
        has: target.has.bind(target),
        getSetCookie: target.getSetCookie.bind(target),
        keys: target.keys.bind(target),
        values: target.values.bind(target),
        entries: target.entries.bind(target),
        [Symbol.iterator]: target[Symbol.iterator].bind(target),
        // The native method passes the unsealed target as the callback's `parent`
        // argument. That is a mutable handle on the underlying headers. Pass the
        // sealed view instead.
        forEach (callbackfn, thisArg) {
            for (const [name, value] of target.entries()){
                callbackfn.call(thisArg, value, name, sealed);
            }
        }
    };
}
/**
 * Builds the read methods for a sealed view that omits the header names matched
 * by `isHidden`.
 */ function createHidingMethods(target, sealed, isHidden) {
    function* entries() {
        for (const entry of target.entries()){
            if (!isHidden(entry[0])) {
                yield entry;
            }
        }
    }
    return {
        entries,
        [Symbol.iterator]: entries,
        get: (name)=>isHidden(name) ? null : target.get(name),
        has: (name)=>isHidden(name) ? false : target.has(name),
        getSetCookie: ()=>isHidden('set-cookie') ? [] : target.getSetCookie(),
        *keys () {
            for (const name of target.keys()){
                if (!isHidden(name)) {
                    yield name;
                }
            }
        },
        *values () {
            for (const [, value] of entries()){
                yield value;
            }
        },
        // The native method passes the unsealed target as the callback's `parent`
        // argument. That is a mutable handle on the underlying headers. Pass the
        // sealed view instead.
        forEach (callbackfn, thisArg) {
            for (const [name, value] of entries()){
                callbackfn.call(thisArg, value, name, sealed);
            }
        }
    };
}
class HeadersAdapter extends Headers {
    constructor(headers){
        // We've already overridden the methods that would be called, so we're just
        // calling the super constructor to ensure that the instanceof check works.
        super();
        this.headers = new Proxy(headers, {
            get (target, prop, receiver) {
                // Because this is just an object, we expect that all "get" operations
                // are for properties. If it's a "get" for a symbol, we'll just return
                // the symbol.
                if (typeof prop === 'symbol') {
                    return _reflect.ReflectAdapter.get(target, prop, receiver);
                }
                const lowercased = prop.toLowerCase();
                // Let's find the original casing of the key. This assumes that there is
                // no mixed case keys (e.g. "Content-Type" and "content-type") in the
                // headers object.
                const original = Object.keys(headers).find((o)=>o.toLowerCase() === lowercased);
                // If the original casing doesn't exist, return undefined.
                if (typeof original === 'undefined') return;
                // If the original casing exists, return the value.
                return _reflect.ReflectAdapter.get(target, original, receiver);
            },
            set (target, prop, value, receiver) {
                if (typeof prop === 'symbol') {
                    return _reflect.ReflectAdapter.set(target, prop, value, receiver);
                }
                const lowercased = prop.toLowerCase();
                // Let's find the original casing of the key. This assumes that there is
                // no mixed case keys (e.g. "Content-Type" and "content-type") in the
                // headers object.
                const original = Object.keys(headers).find((o)=>o.toLowerCase() === lowercased);
                // If the original casing doesn't exist, use the prop as the key.
                return _reflect.ReflectAdapter.set(target, original ?? prop, value, receiver);
            },
            has (target, prop) {
                if (typeof prop === 'symbol') return _reflect.ReflectAdapter.has(target, prop);
                const lowercased = prop.toLowerCase();
                // Let's find the original casing of the key. This assumes that there is
                // no mixed case keys (e.g. "Content-Type" and "content-type") in the
                // headers object.
                const original = Object.keys(headers).find((o)=>o.toLowerCase() === lowercased);
                // If the original casing doesn't exist, return false.
                if (typeof original === 'undefined') return false;
                // If the original casing exists, return true.
                return _reflect.ReflectAdapter.has(target, original);
            },
            deleteProperty (target, prop) {
                if (typeof prop === 'symbol') return _reflect.ReflectAdapter.deleteProperty(target, prop);
                const lowercased = prop.toLowerCase();
                // Let's find the original casing of the key. This assumes that there is
                // no mixed case keys (e.g. "Content-Type" and "content-type") in the
                // headers object.
                const original = Object.keys(headers).find((o)=>o.toLowerCase() === lowercased);
                // If the original casing doesn't exist, return true.
                if (typeof original === 'undefined') return true;
                // If the original casing exists, delete the property.
                return _reflect.ReflectAdapter.deleteProperty(target, original);
            }
        });
    }
    /**
   * Seals a Headers instance to prevent modification by throwing an error when
   * any mutating method is called.
   *
   * The sealed view stays live. Later writes to `headers` remain visible
   * through it.
   *
   * `hidden` omits the given header names from every read operation (`get`,
   * `has`, `getSetCookie`, `forEach`, and iteration). The names must be
   * lowercase. The underlying headers are neither copied nor mutated, so hidden
   * headers remain available to the framework.
   */ static seal(headers, hidden) {
        const isHidden = hidden && hidden.size > 0 ? (name)=>hidden.has(name.toLowerCase()) : null;
        // The methods are built once per sealed view and reused, so repeated access
        // returns the same function instead of a fresh closure. They are assigned
        // after the proxy exists because `forEach` hands the proxy to its callback.
        // Creating the proxy runs no trap, so nothing can read them before then.
        let methods;
        const sealed = new Proxy(headers, {
            get (target, prop, receiver) {
                switch(prop){
                    case 'append':
                    case 'delete':
                    case 'set':
                        return ReadonlyHeadersError.callable;
                    case Symbol.iterator:
                        return methods[Symbol.iterator];
                    case 'get':
                    case 'has':
                    case 'getSetCookie':
                    case 'keys':
                    case 'values':
                    case 'entries':
                    case 'forEach':
                        return methods[prop];
                    default:
                        return _reflect.ReflectAdapter.get(target, prop, receiver);
                }
            }
        });
        methods = isHidden ? createHidingMethods(headers, sealed, isHidden) : createPassThroughMethods(headers, sealed);
        return sealed;
    }
    /**
   * @param headers
   * @returns A fresh object identity backed by the original value
   */ static fresh(headers) {
        return new Proxy(headers, {
            get (target, prop, receiver) {
                return _reflect.ReflectAdapter.get(target, prop, receiver);
            }
        });
    }
    /**
   * Merges a header value into a string. This stores multiple values as an
   * array, so we need to merge them into a string.
   *
   * @param value a header value
   * @returns a merged header value (a string)
   */ merge(value) {
        if (Array.isArray(value)) return value.join(', ');
        return value;
    }
    /**
   * Creates a Headers instance from a plain object or a Headers instance.
   *
   * @param headers a plain object or a Headers instance
   * @returns a headers instance
   */ static from(headers) {
        if (headers instanceof Headers) return headers;
        return new HeadersAdapter(headers);
    }
    append(name, value) {
        const existing = this.headers[name];
        if (typeof existing === 'string') {
            this.headers[name] = [
                existing,
                value
            ];
        } else if (Array.isArray(existing)) {
            existing.push(value);
        } else {
            this.headers[name] = value;
        }
    }
    delete(name) {
        delete this.headers[name];
    }
    get(name) {
        const value = this.headers[name];
        if (typeof value !== 'undefined') return this.merge(value);
        return null;
    }
    has(name) {
        return typeof this.headers[name] !== 'undefined';
    }
    set(name, value) {
        this.headers[name] = value;
    }
    forEach(callbackfn, thisArg) {
        for (const [name, value] of this.entries()){
            callbackfn.call(thisArg, value, name, this);
        }
    }
    *entries() {
        for (const key of Object.keys(this.headers)){
            const name = key.toLowerCase();
            // We assert here that this is a string because we got it from the
            // Object.keys() call above.
            const value = this.get(name);
            yield [
                name,
                value
            ];
        }
    }
    *keys() {
        for (const key of Object.keys(this.headers)){
            const name = key.toLowerCase();
            yield name;
        }
    }
    *values() {
        for (const key of Object.keys(this.headers)){
            // We assert here that this is a string because we got it from the
            // Object.keys() call above.
            const value = this.get(key);
            yield value;
        }
    }
    [Symbol.iterator]() {
        return this.entries();
    }
}
}),
"[project]/web/node_modules/next/dist/server/web/spec-extension/adapters/reflect.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ReflectAdapter", {
    enumerable: true,
    get: function() {
        return ReflectAdapter;
    }
});
class ReflectAdapter {
    static get(target, prop, receiver) {
        const value = Reflect.get(target, prop, receiver);
        if (typeof value === 'function') {
            return value.bind(target);
        }
        return value;
    }
    static set(target, prop, value, receiver) {
        return Reflect.set(target, prop, value, receiver);
    }
    static has(target, prop) {
        return Reflect.has(target, prop);
    }
    static deleteProperty(target, prop) {
        return Reflect.deleteProperty(target, prop);
    }
}
}),
"[project]/web/node_modules/next/dist/server/web/spec-extension/adapters/request-cookies.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    MutableRequestCookiesAdapter: null,
    ReadonlyRequestCookiesError: null,
    RequestCookiesAdapter: null,
    appendMutableCookies: null,
    areCookiesMutableInCurrentPhase: null,
    createCookiesWithMutableAccessCheck: null,
    getModifiedCookieValues: null,
    responseCookiesToRequestCookies: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    MutableRequestCookiesAdapter: function() {
        return MutableRequestCookiesAdapter;
    },
    ReadonlyRequestCookiesError: function() {
        return ReadonlyRequestCookiesError;
    },
    RequestCookiesAdapter: function() {
        return RequestCookiesAdapter;
    },
    appendMutableCookies: function() {
        return appendMutableCookies;
    },
    areCookiesMutableInCurrentPhase: function() {
        return areCookiesMutableInCurrentPhase;
    },
    createCookiesWithMutableAccessCheck: function() {
        return createCookiesWithMutableAccessCheck;
    },
    getModifiedCookieValues: function() {
        return getModifiedCookieValues;
    },
    responseCookiesToRequestCookies: function() {
        return responseCookiesToRequestCookies;
    }
});
const _cookies = __turbopack_context__.r("[project]/web/node_modules/next/dist/server/web/spec-extension/cookies.js [app-ssr] (ecmascript)");
const _reflect = __turbopack_context__.r("[project]/web/node_modules/next/dist/server/web/spec-extension/adapters/reflect.js [app-ssr] (ecmascript)");
const _workasyncstorageexternal = __turbopack_context__.r("[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)");
const _actionrevalidationkind = __turbopack_context__.r("[project]/web/node_modules/next/dist/shared/lib/action-revalidation-kind.js [app-ssr] (ecmascript)");
class ReadonlyRequestCookiesError extends Error {
    constructor(){
        super('Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#options');
    }
    static callable() {
        throw new ReadonlyRequestCookiesError();
    }
}
class RequestCookiesAdapter {
    static seal(cookies) {
        return new Proxy(cookies, {
            get (target, prop, receiver) {
                switch(prop){
                    case 'clear':
                    case 'delete':
                    case 'set':
                        return ReadonlyRequestCookiesError.callable;
                    default:
                        return _reflect.ReflectAdapter.get(target, prop, receiver);
                }
            }
        });
    }
    /**
   * @param cookies
   * @returns A fresh object identity backed by the original value
   */ static fresh(cookies) {
        return new Proxy(cookies, {
            get (target, prop, receiver) {
                return _reflect.ReflectAdapter.get(target, prop, receiver);
            }
        });
    }
}
const SYMBOL_MODIFY_COOKIE_VALUES = Symbol.for('next.mutated.cookies');
function getModifiedCookieValues(cookies) {
    const modified = cookies[SYMBOL_MODIFY_COOKIE_VALUES];
    if (!modified || !Array.isArray(modified) || modified.length === 0) {
        return [];
    }
    return modified;
}
function appendMutableCookies(headers, mutableCookies) {
    const modifiedCookieValues = getModifiedCookieValues(mutableCookies);
    if (modifiedCookieValues.length === 0) {
        return false;
    }
    // Return a new response that extends the response with
    // the modified cookies as fallbacks. `res` cookies
    // will still take precedence.
    const resCookies = new _cookies.ResponseCookies(headers);
    const returnedCookies = resCookies.getAll();
    // Set the modified cookies as fallbacks.
    for (const cookie of modifiedCookieValues){
        resCookies.set(cookie);
    }
    // Set the original cookies as the final values.
    for (const cookie of returnedCookies){
        resCookies.set(cookie);
    }
    return true;
}
class MutableRequestCookiesAdapter {
    static wrap(cookies, onUpdateCookies) {
        const responseCookies = new _cookies.ResponseCookies(new Headers());
        for (const cookie of cookies.getAll()){
            responseCookies.set(cookie);
        }
        let modifiedValues = [];
        const modifiedCookies = new Set();
        const updateResponseCookies = ()=>{
            // TODO-APP: change method of getting workStore
            const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
            if (workStore) {
                workStore.pathWasRevalidated = _actionrevalidationkind.ActionDidRevalidateStaticAndDynamic;
            }
            const allCookies = responseCookies.getAll();
            modifiedValues = allCookies.filter((c)=>modifiedCookies.has(c.name));
            if (onUpdateCookies) {
                const serializedCookies = [];
                for (const cookie of modifiedValues){
                    const tempCookies = new _cookies.ResponseCookies(new Headers());
                    tempCookies.set(cookie);
                    serializedCookies.push(tempCookies.toString());
                }
                onUpdateCookies(serializedCookies);
            }
        };
        const wrappedCookies = new Proxy(responseCookies, {
            get (target, prop, receiver) {
                switch(prop){
                    // A special symbol to get the modified cookie values
                    case SYMBOL_MODIFY_COOKIE_VALUES:
                        return modifiedValues;
                    // TODO: Throw error if trying to set a cookie after the response
                    // headers have been set.
                    case 'delete':
                        return function(...args) {
                            modifiedCookies.add(typeof args[0] === 'string' ? args[0] : args[0].name);
                            try {
                                target.delete(...args);
                                return wrappedCookies;
                            } finally{
                                updateResponseCookies();
                            }
                        };
                    case 'set':
                        return function(...args) {
                            modifiedCookies.add(typeof args[0] === 'string' ? args[0] : args[0].name);
                            try {
                                target.set(...args);
                                return wrappedCookies;
                            } finally{
                                updateResponseCookies();
                            }
                        };
                    default:
                        return _reflect.ReflectAdapter.get(target, prop, receiver);
                }
            }
        });
        return wrappedCookies;
    }
}
function createCookiesWithMutableAccessCheck(requestStore) {
    const wrappedCookies = new Proxy(requestStore.mutableCookies, {
        get (target, prop, receiver) {
            switch(prop){
                case 'delete':
                    return function(...args) {
                        ensureCookiesAreStillMutable(requestStore, 'cookies().delete');
                        target.delete(...args);
                        return wrappedCookies;
                    };
                case 'set':
                    return function(...args) {
                        ensureCookiesAreStillMutable(requestStore, 'cookies().set');
                        target.set(...args);
                        return wrappedCookies;
                    };
                default:
                    return _reflect.ReflectAdapter.get(target, prop, receiver);
            }
        }
    });
    return wrappedCookies;
}
function areCookiesMutableInCurrentPhase(requestStore) {
    return requestStore.phase === 'action';
}
/** Ensure that cookies() starts throwing on mutation
 * if we changed phases and can no longer mutate.
 *
 * This can happen when going:
 *   'render' -> 'after'
 *   'action' -> 'render'
 * */ function ensureCookiesAreStillMutable(requestStore, _callingExpression) {
    if (!areCookiesMutableInCurrentPhase(requestStore)) {
        // TODO: maybe we can give a more precise error message based on callingExpression?
        throw new ReadonlyRequestCookiesError();
    }
}
function responseCookiesToRequestCookies(responseCookies) {
    const requestCookies = new _cookies.RequestCookies(new Headers());
    for (const cookie of responseCookies.getAll()){
        requestCookies.set(cookie);
    }
    return requestCookies;
}
}),
"[project]/web/node_modules/next/dist/server/web/spec-extension/cookies.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    RequestCookies: null,
    ResponseCookies: null,
    stringifyCookie: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    RequestCookies: function() {
        return _cookies.RequestCookies;
    },
    ResponseCookies: function() {
        return _cookies.ResponseCookies;
    },
    stringifyCookie: function() {
        return _cookies.stringifyCookie;
    }
});
const _cookies = __turbopack_context__.r("[project]/web/node_modules/next/dist/compiled/@edge-runtime/cookies/index.js [app-ssr] (ecmascript)");
}),
"[project]/web/node_modules/next/dist/shared/lib/action-revalidation-kind.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    ActionDidNotRevalidate: null,
    ActionDidRevalidateDynamicOnly: null,
    ActionDidRevalidateStaticAndDynamic: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    ActionDidNotRevalidate: function() {
        return ActionDidNotRevalidate;
    },
    ActionDidRevalidateDynamicOnly: function() {
        return ActionDidRevalidateDynamicOnly;
    },
    ActionDidRevalidateStaticAndDynamic: function() {
        return ActionDidRevalidateStaticAndDynamic;
    }
});
const ActionDidNotRevalidate = 0;
const ActionDidRevalidateStaticAndDynamic = 1;
const ActionDidRevalidateDynamicOnly = 2;
}),
"[project]/web/node_modules/next/dist/shared/lib/instant-messages.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createLinkPrefetchPartialError: null,
    createUnrenderedSegmentError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    createLinkPrefetchPartialError: function() {
        return createLinkPrefetchPartialError;
    },
    createUnrenderedSegmentError: function() {
        return createUnrenderedSegmentError;
    }
});
function createUnrenderedSegmentError(route, missingFiles) {
    let message = `Route "${route}": Could not validate that a segment in your UI has instant navigation.`;
    if (missingFiles.length > 0) {
        const label = missingFiles.length === 1 ? 'Dropped segment' : 'Dropped segments';
        message += `\n\nThis segment was dropped from rendering. Issues that would prevent instant navigation will go undetected.` + `\n\n${label}:\n${missingFiles.map((p)=>`  ${p}`).join('\n')}` + `\n\nWays to fix this:` + `\n  - [render] Render the dropped segment` + `\n  - [ignore] Set \`export const instant = false\` to opt the dropped segment out of instant-navigation validation` + `\n\nLearn more: https://nextjs.org/docs/messages/instant-unrendered-segment`;
    }
    return new Error(message);
}
function createLinkPrefetchPartialError(pathname) {
    return new Error(`Next.js encountered dynamic data during prefetching for "${pathname}".\n\n` + `This will lead to slower, more expensive prefetches.\n\n` + `Ways to fix this:\n` + `  - [upgrade] Opt into Partial Prefetching by exporting \`const prefetch = 'partial'\` from the page or layout, or by setting \`partialPrefetching: true\` in next.config to opt the whole app in\n` + `  - [disable] Remove \`prefetch={true}\` from the <Link> to use the default prefetch\n` + `  - [ignore] Set \`export const instant = false\` to opt the route out of instant-navigation validation\n\n` + `Learn more: https://nextjs.org/docs/messages/instant-link-prefetch-partial`);
}
}),
"[project]/web/node_modules/next/dist/shared/lib/invariant-error.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "InvariantError", {
    enumerable: true,
    get: function() {
        return InvariantError;
    }
});
class InvariantError extends Error {
    constructor(message, options){
        super(`Invariant: ${message.endsWith('.') ? message : message + '.'} This is a bug in Next.js.`, options);
        this.name = 'InvariantError';
    }
}
}),
"[project]/web/node_modules/next/dist/shared/lib/lazy-dynamic/bailout-to-csr.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// This has to be a shared module which is shared between client component error boundary and dynamic component
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    BailoutToCSRError: null,
    isBailoutToCSRError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    BailoutToCSRError: function() {
        return BailoutToCSRError;
    },
    isBailoutToCSRError: function() {
        return isBailoutToCSRError;
    }
});
const BAILOUT_TO_CSR = 'BAILOUT_TO_CLIENT_SIDE_RENDERING';
class BailoutToCSRError extends Error {
    constructor(reason){
        super(`Bail out to client-side rendering: ${reason}`), this.reason = reason, this.digest = BAILOUT_TO_CSR;
    }
}
function isBailoutToCSRError(err) {
    if (typeof err !== 'object' || err === null || !('digest' in err)) {
        return false;
    }
    return err.digest === BAILOUT_TO_CSR;
}
}),
"[project]/web/node_modules/next/dist/shared/lib/lazy-dynamic/react-browser-bailout.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// This module is bundled separately into user code and the precompiled App
// Router runtime. Use the global symbol registry so both copies recognize the
// same browser bailout reason.
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createReactBrowserBailoutReason: null,
    getReactBrowserBailoutReason: null,
    isNextBrowserBailoutError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    createReactBrowserBailoutReason: function() {
        return createReactBrowserBailoutReason;
    },
    getReactBrowserBailoutReason: function() {
        return getReactBrowserBailoutReason;
    },
    isNextBrowserBailoutError: function() {
        return isNextBrowserBailoutError;
    }
});
const REACT_BROWSER_BAILOUT_REASON = Symbol.for('next.browser-bailout-reason');
function createReactBrowserBailoutReason(reason) {
    return {
        $$typeof: REACT_BROWSER_BAILOUT_REASON,
        reason
    };
}
function getReactBrowserBailoutReason(error) {
    const cause = error?.cause;
    return cause?.$$typeof === REACT_BROWSER_BAILOUT_REASON ? cause.reason : undefined;
}
function isNextBrowserBailoutError(error) {
    return getReactBrowserBailoutReason(error) !== undefined;
}
}),
"[project]/web/node_modules/next/dist/shared/lib/page-path/ensure-leading-slash.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * For a given page path, this function ensures that there is a leading slash.
 * If there is not a leading slash, one is added, otherwise it is noop.
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ensureLeadingSlash", {
    enumerable: true,
    get: function() {
        return ensureLeadingSlash;
    }
});
function ensureLeadingSlash(path) {
    return path.startsWith('/') ? path : `/${path}`;
}
}),
"[project]/web/node_modules/next/dist/shared/lib/promise-with-resolvers.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createPromiseWithResolvers", {
    enumerable: true,
    get: function() {
        return createPromiseWithResolvers;
    }
});
function createPromiseWithResolvers() {
    // Shim of Stage 4 Promise.withResolvers proposal
    let resolve;
    let reject;
    const promise = new Promise((res, rej)=>{
        resolve = res;
        reject = rej;
    });
    return {
        resolve: resolve,
        reject: reject,
        promise
    };
}
}),
"[project]/web/node_modules/next/dist/shared/lib/router/utils/app-paths.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    compareAppPaths: null,
    normalizeAppPath: null,
    normalizeRscURL: null,
    selectAppPageEntry: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    compareAppPaths: function() {
        return compareAppPaths;
    },
    normalizeAppPath: function() {
        return normalizeAppPath;
    },
    normalizeRscURL: function() {
        return normalizeRscURL;
    },
    selectAppPageEntry: function() {
        return selectAppPageEntry;
    }
});
const _ensureleadingslash = __turbopack_context__.r("[project]/web/node_modules/next/dist/shared/lib/page-path/ensure-leading-slash.js [app-ssr] (ecmascript)");
const _segment = __turbopack_context__.r("[project]/web/node_modules/next/dist/shared/lib/segment.js [app-ssr] (ecmascript)");
function normalizeAppPath(route) {
    return (0, _ensureleadingslash.ensureLeadingSlash)(route.split('/').reduce((pathname, segment, index, segments)=>{
        // Empty segments are ignored.
        if (!segment) {
            return pathname;
        }
        // Groups are ignored.
        if ((0, _segment.isGroupSegment)(segment)) {
            return pathname;
        }
        // Parallel segments are ignored.
        if (segment[0] === '@') {
            return pathname;
        }
        // The last segment (if it's a leaf) should be ignored.
        if ((segment === 'page' || segment === 'route') && index === segments.length - 1) {
            return pathname;
        }
        return `${pathname}/${segment}`;
    }, ''));
}
function compareAppPaths(a, b) {
    const aHasSlot = a.includes('/@');
    const bHasSlot = b.includes('/@');
    if (aHasSlot && !bHasSlot) return -1;
    if (!aHasSlot && bHasSlot) return 1;
    return a.localeCompare(b);
}
function normalizeAppPageEntryPathname(appPath) {
    // Webpack app entries preserve escaped underscore segments as `%5F`, while
    // normalized request pathnames expose the decoded `_` segment.
    return normalizeAppPath(appPath).replace(/%5F/g, '_');
}
function selectAppPageEntry(pathname, appPaths, normalizePathname = normalizeAppPageEntryPathname) {
    let entry;
    for (const appPath of appPaths){
        if (normalizePathname(appPath) !== pathname) continue;
        if (entry === undefined || compareAppPaths(entry, appPath) < 0) {
            entry = appPath;
        }
    }
    if (entry === undefined) {
        throw new Error(`Invariant: no direct app page entry found for ${pathname}`);
    }
    return entry;
}
function normalizeRscURL(url) {
    return url.replace(/\.rsc($|\?)/, '$1');
}
}),
"[project]/web/node_modules/next/dist/shared/lib/router/utils/get-segment-param.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getParamProperties: null,
    getSegmentParam: null,
    isCatchAll: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getParamProperties: function() {
        return getParamProperties;
    },
    getSegmentParam: function() {
        return getSegmentParam;
    },
    isCatchAll: function() {
        return isCatchAll;
    }
});
const _interceptionroutes = __turbopack_context__.r("[project]/web/node_modules/next/dist/shared/lib/router/utils/interception-routes.js [app-ssr] (ecmascript)");
function getSegmentParam(segment) {
    const interceptionMarker = _interceptionroutes.INTERCEPTION_ROUTE_MARKERS.find((marker)=>segment.startsWith(marker));
    // if an interception marker is part of the path segment, we need to jump ahead
    // to the relevant portion for param parsing
    if (interceptionMarker) {
        segment = segment.slice(interceptionMarker.length);
    }
    if (segment.startsWith('[[...') && segment.endsWith(']]')) {
        return {
            // TODO-APP: Optional catchall does not currently work with parallel routes,
            // so for now aren't handling a potential interception marker.
            paramType: 'optional-catchall',
            paramName: segment.slice(5, -2)
        };
    }
    if (segment.startsWith('[...') && segment.endsWith(']')) {
        return {
            paramType: interceptionMarker ? `catchall-intercepted-${interceptionMarker}` : 'catchall',
            paramName: segment.slice(4, -1)
        };
    }
    if (segment.startsWith('[') && segment.endsWith(']')) {
        return {
            paramType: interceptionMarker ? `dynamic-intercepted-${interceptionMarker}` : 'dynamic',
            paramName: segment.slice(1, -1)
        };
    }
    return null;
}
function isCatchAll(type) {
    return type === 'catchall' || type === 'catchall-intercepted-(..)(..)' || type === 'catchall-intercepted-(.)' || type === 'catchall-intercepted-(..)' || type === 'catchall-intercepted-(...)' || type === 'optional-catchall';
}
function getParamProperties(paramType) {
    let repeat = false;
    let optional = false;
    switch(paramType){
        case 'catchall':
        case 'catchall-intercepted-(..)(..)':
        case 'catchall-intercepted-(.)':
        case 'catchall-intercepted-(..)':
        case 'catchall-intercepted-(...)':
            repeat = true;
            break;
        case 'optional-catchall':
            repeat = true;
            optional = true;
            break;
        case 'dynamic':
        case 'dynamic-intercepted-(..)(..)':
        case 'dynamic-intercepted-(.)':
        case 'dynamic-intercepted-(..)':
        case 'dynamic-intercepted-(...)':
            break;
        default:
            paramType;
    }
    return {
        repeat,
        optional
    };
}
}),
"[project]/web/node_modules/next/dist/shared/lib/router/utils/interception-routes.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    INTERCEPTION_ROUTE_MARKERS: null,
    extractInterceptionRouteInformation: null,
    findMissingCanonicalInterceptionRoutes: null,
    isInterceptionRouteAppPath: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    INTERCEPTION_ROUTE_MARKERS: function() {
        return INTERCEPTION_ROUTE_MARKERS;
    },
    extractInterceptionRouteInformation: function() {
        return extractInterceptionRouteInformation;
    },
    findMissingCanonicalInterceptionRoutes: function() {
        return findMissingCanonicalInterceptionRoutes;
    },
    isInterceptionRouteAppPath: function() {
        return isInterceptionRouteAppPath;
    }
});
const _apppaths = __turbopack_context__.r("[project]/web/node_modules/next/dist/shared/lib/router/utils/app-paths.js [app-ssr] (ecmascript)");
const INTERCEPTION_ROUTE_MARKERS = [
    '(..)(..)',
    '(.)',
    '(..)',
    '(...)'
];
function parseRoutePattern(route) {
    const segments = route.split('/').filter(Boolean);
    const tail = segments.at(-1);
    const isOptionalCatchAll = tail !== undefined && tail.startsWith('[[...') && tail.endsWith(']]');
    const isCatchAll = tail !== undefined && tail.startsWith('[...') && tail.endsWith(']');
    const unbounded = isOptionalCatchAll || isCatchAll;
    const prefixSegments = unbounded ? segments.slice(0, -1) : segments;
    return {
        prefix: prefixSegments.map((segment)=>segment.startsWith('[') && segment.endsWith(']') ? null : segment),
        minLength: prefixSegments.length + (isCatchAll && !isOptionalCatchAll ? 1 : 0),
        unbounded
    };
}
function acceptsLength(pattern, length) {
    return pattern.unbounded ? length >= pattern.minLength : length === pattern.minLength;
}
function prefixCovers(canonical, intercepted) {
    return canonical.prefix.every((canonicalSegment, index)=>{
        if (canonicalSegment === null) return true;
        const interceptedSegment = intercepted.prefix[index];
        return interceptedSegment !== undefined && interceptedSegment !== null && canonicalSegment === interceptedSegment;
    });
}
function patternCoversAtLength(canonical, intercepted, length) {
    return acceptsLength(canonical, length) && acceptsLength(intercepted, length) && prefixCovers(canonical, intercepted);
}
/** Returns whether ordinary route patterns cover every URL in `route`. */ function isRoutePatternCovered(route, ordinaryRoutes) {
    const intercepted = parseRoutePattern(route);
    if (!intercepted.unbounded) {
        return ordinaryRoutes.some((pattern)=>patternCoversAtLength(pattern, intercepted, intercepted.minLength));
    }
    let unboundedCoverageStart = Infinity;
    for (const pattern of ordinaryRoutes){
        if (pattern.unbounded && prefixCovers(pattern, intercepted)) {
            unboundedCoverageStart = Math.min(unboundedCoverageStart, Math.max(intercepted.minLength, pattern.minLength));
        }
    }
    if (unboundedCoverageStart === Infinity) return false;
    // An optional or required catchall can have its shorter paths covered by
    // fixed routes before another catchall takes over the remaining suffix.
    for(let length = intercepted.minLength; length < unboundedCoverageStart; length++){
        if (!ordinaryRoutes.some((pattern)=>patternCoversAtLength(pattern, intercepted, length))) {
            return false;
        }
    }
    return true;
}
function isInterceptionRouteAppPath(path) {
    // TODO-APP: add more serious validation
    return path.split('/').find((segment)=>INTERCEPTION_ROUTE_MARKERS.find((m)=>segment.startsWith(m))) !== undefined;
}
function extractInterceptionRouteInformation(path) {
    let interceptingRoute;
    let marker;
    let interceptedRoute;
    for (const segment of path.split('/')){
        marker = INTERCEPTION_ROUTE_MARKERS.find((m)=>segment.startsWith(m));
        if (marker) {
            ;
            [interceptingRoute, interceptedRoute] = path.split(marker, 2);
            break;
        }
    }
    if (!interceptingRoute || !marker || !interceptedRoute) {
        throw new Error(`Invalid interception route: ${path}. Must be in the format /<intercepting route>/(..|...|..)(..)/<intercepted route>`);
    }
    interceptingRoute = (0, _apppaths.normalizeAppPath)(interceptingRoute) // normalize the path, e.g. /(blog)/feed -> /feed
    ;
    switch(marker){
        case '(.)':
            // (.) indicates that we should match with sibling routes, so we just need to append the intercepted route to the intercepting route
            if (interceptingRoute === '/') {
                interceptedRoute = `/${interceptedRoute}`;
            } else {
                interceptedRoute = interceptingRoute + '/' + interceptedRoute;
            }
            break;
        case '(..)':
            // (..) indicates that we should match at one level up, so we need to remove the last segment of the intercepting route
            if (interceptingRoute === '/') {
                throw new Error(`Invalid interception route: ${path}. Cannot use (..) marker at the root level, use (.) instead.`);
            }
            interceptedRoute = interceptingRoute.split('/').slice(0, -1).concat(interceptedRoute).join('/');
            break;
        case '(...)':
            // (...) will match the route segment in the root directory, so we need to use the root directory to prepend the intercepted route
            interceptedRoute = '/' + interceptedRoute;
            break;
        case '(..)(..)':
            // (..)(..) indicates that we should match at two levels up, so we need to remove the last two segments of the intercepting route
            const splitInterceptingRoute = interceptingRoute.split('/');
            if (splitInterceptingRoute.length <= 2) {
                throw new Error(`Invalid interception route: ${path}. Cannot use (..)(..) marker at the root level or one level up.`);
            }
            interceptedRoute = splitInterceptingRoute.slice(0, -2).concat(interceptedRoute).join('/');
            break;
        default:
            throw new Error('Invariant: unexpected marker');
    }
    return {
        interceptingRoute,
        interceptedRoute
    };
}
function findMissingCanonicalInterceptionRoutes(appPaths) {
    const canonicalRoutes = Object.keys(appPaths).filter((route)=>!isInterceptionRouteAppPath(route));
    const canonicalRoutePatterns = canonicalRoutes.map(parseRoutePattern);
    return Object.keys(appPaths).filter(isInterceptionRouteAppPath).map((interceptionRoute)=>({
            interceptionRoute,
            canonicalRoute: extractInterceptionRouteInformation(interceptionRoute).interceptedRoute
        })).filter(({ canonicalRoute })=>!isRoutePatternCovered(canonicalRoute, canonicalRoutePatterns)).sort((a, b)=>a.interceptionRoute.localeCompare(b.interceptionRoute));
}
}),
"[project]/web/node_modules/next/dist/shared/lib/router/utils/parse-loader-tree.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "parseLoaderTree", {
    enumerable: true,
    get: function() {
        return parseLoaderTree;
    }
});
const _segment = __turbopack_context__.r("[project]/web/node_modules/next/dist/shared/lib/segment.js [app-ssr] (ecmascript)");
function parseLoaderTree(tree) {
    const [segment, parallelRoutes, modules, staticSiblings] = tree;
    const { layout, template } = modules;
    let { page } = modules;
    // a __DEFAULT__ segment means that this route didn't match any of the
    // segments in the route, so we should use the default page
    page = segment === _segment.DEFAULT_SEGMENT_KEY ? modules.defaultPage : page;
    const conventionPath = layout?.[1] || template?.[1] || page?.[1];
    return {
        page,
        segment,
        modules,
        /* it can be either layout / template / page */ conventionPath,
        parallelRoutes,
        staticSiblings
    };
}
}),
"[project]/web/node_modules/next/dist/shared/lib/router/utils/parse-relative-url.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "parseRelativeUrl", {
    enumerable: true,
    get: function() {
        return parseRelativeUrl;
    }
});
const _utils = __turbopack_context__.r("[project]/web/node_modules/next/dist/shared/lib/utils.js [app-ssr] (ecmascript)");
const _querystring = __turbopack_context__.r("[project]/web/node_modules/next/dist/shared/lib/router/utils/querystring.js [app-ssr] (ecmascript)");
function parseRelativeUrl(url, base, parseQuery = true) {
    const globalBase = new URL(("TURBOPACK compile-time truthy", 1) ? 'http://n' : "TURBOPACK unreachable");
    const resolvedBase = base ? new URL(base, globalBase) : url.startsWith('.') ? new URL(("TURBOPACK compile-time truthy", 1) ? 'http://n' : "TURBOPACK unreachable") : globalBase;
    const { pathname, searchParams, search, hash, href, origin } = url.startsWith('/') ? // Not using `origin` to support other protocols
    new URL(`${resolvedBase.protocol}//${resolvedBase.host}${url}`) : new URL(url, resolvedBase);
    if (origin !== globalBase.origin) {
        throw new Error(`invariant: invalid relative URL, router received ${url}`);
    }
    return {
        auth: null,
        host: null,
        hostname: null,
        pathname,
        port: null,
        protocol: null,
        query: parseQuery ? (0, _querystring.searchParamsToUrlQuery)(searchParams) : undefined,
        search,
        hash,
        href: href.slice(origin.length),
        // We don't know for relative URLs at this point since we set a custom, internal
        // base that isn't surfaced to users.
        slashes: null
    };
}
}),
"[project]/web/node_modules/next/dist/shared/lib/router/utils/querystring.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    assign: null,
    getRenderedSearch: null,
    searchParamsToUrlQuery: null,
    urlQueryToSearchParams: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    assign: function() {
        return assign;
    },
    getRenderedSearch: function() {
        return getRenderedSearch;
    },
    searchParamsToUrlQuery: function() {
        return searchParamsToUrlQuery;
    },
    urlQueryToSearchParams: function() {
        return urlQueryToSearchParams;
    }
});
function getRenderedSearch(query) {
    // Inlined implementation of querystring.encode, which is not available in
    // the Edge runtime.
    const pairs = [];
    for(const key in query){
        const value = query[key];
        if (value == null) continue;
        if (Array.isArray(value)) {
            for (const v of value){
                pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`);
            }
        } else {
            pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
        }
    }
    // The result should match the format of a web URL's `search` property, since
    // this is the format that's stored in the App Router state.
    // TODO: We're a bit inconsistent about this. The x-nextjs-rewritten-query
    // header omits the leading question mark. Should refactor to always do
    // that instead.
    if (pairs.length === 0) {
        // If the search string is empty, return an empty string.
        return '';
    }
    // Prepend '?' to the search params string.
    return '?' + pairs.join('&');
}
function searchParamsToUrlQuery(searchParams) {
    const query = {};
    for (const [key, value] of searchParams.entries()){
        const existing = query[key];
        if (typeof existing === 'undefined') {
            query[key] = value;
        } else if (Array.isArray(existing)) {
            existing.push(value);
        } else {
            query[key] = [
                existing,
                value
            ];
        }
    }
    return query;
}
function stringifyUrlQueryParam(param) {
    if (typeof param === 'string') {
        return param;
    }
    if (typeof param === 'number' && !isNaN(param) || typeof param === 'boolean') {
        return String(param);
    } else {
        return '';
    }
}
function urlQueryToSearchParams(query) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(query)){
        if (Array.isArray(value)) {
            for (const item of value){
                searchParams.append(key, stringifyUrlQueryParam(item));
            }
        } else {
            searchParams.set(key, stringifyUrlQueryParam(value));
        }
    }
    return searchParams;
}
function assign(target, ...searchParamsList) {
    for (const searchParams of searchParamsList){
        for (const key of searchParams.keys()){
            target.delete(key);
        }
        for (const [key, value] of searchParams.entries()){
            target.append(key, value);
        }
    }
    return target;
}
}),
"[project]/web/node_modules/next/dist/shared/lib/segment.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    DEFAULT_SEGMENT_KEY: null,
    NOT_FOUND_SEGMENT_KEY: null,
    PAGE_SEGMENT_KEY: null,
    computeSelectedLayoutSegment: null,
    getSegmentValue: null,
    getSelectedLayoutSegmentPath: null,
    isGroupSegment: null,
    isParallelRouteSegment: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    DEFAULT_SEGMENT_KEY: function() {
        return DEFAULT_SEGMENT_KEY;
    },
    NOT_FOUND_SEGMENT_KEY: function() {
        return NOT_FOUND_SEGMENT_KEY;
    },
    PAGE_SEGMENT_KEY: function() {
        return PAGE_SEGMENT_KEY;
    },
    computeSelectedLayoutSegment: function() {
        return computeSelectedLayoutSegment;
    },
    getSegmentValue: function() {
        return getSegmentValue;
    },
    getSelectedLayoutSegmentPath: function() {
        return getSelectedLayoutSegmentPath;
    },
    isGroupSegment: function() {
        return isGroupSegment;
    },
    isParallelRouteSegment: function() {
        return isParallelRouteSegment;
    }
});
function getSegmentValue(segment) {
    return Array.isArray(segment) ? segment[1] : segment;
}
function isGroupSegment(segment) {
    // Use array[0] for performant purpose
    return segment[0] === '(' && segment.endsWith(')');
}
function isParallelRouteSegment(segment) {
    return segment.startsWith('@') && segment !== '@children';
}
function computeSelectedLayoutSegment(segments, parallelRouteKey) {
    if (!segments || segments.length === 0) {
        return null;
    }
    // For 'children', use first segment; for other parallel routes, use last segment
    const rawSegment = parallelRouteKey === 'children' ? segments[0] : segments[segments.length - 1];
    // If the default slot is showing, return null since it's not technically "selected" (it's a fallback)
    // Returning an internal value like `__DEFAULT__` would be confusing
    return rawSegment === DEFAULT_SEGMENT_KEY ? null : rawSegment;
}
function getSelectedLayoutSegmentPath(tree, parallelRouteKey, first = true, segmentPath = []) {
    let node;
    if (first) {
        // Use the provided parallel route key on the first parallel route
        node = tree[1][parallelRouteKey];
    } else {
        // After first parallel route prefer children, if there's no children pick the first parallel route.
        const parallelRoutes = tree[1];
        node = parallelRoutes.children ?? Object.values(parallelRoutes)[0];
    }
    if (!node) return segmentPath;
    const segment = node[0];
    let segmentValue = getSegmentValue(segment);
    if (!segmentValue || segmentValue === PAGE_SEGMENT_KEY) {
        return segmentPath;
    }
    segmentPath.push(segmentValue);
    return getSelectedLayoutSegmentPath(node, parallelRouteKey, false, segmentPath);
}
const PAGE_SEGMENT_KEY = '__PAGE__';
const DEFAULT_SEGMENT_KEY = '__DEFAULT__';
const NOT_FOUND_SEGMENT_KEY = '/_not-found';
}),
"[project]/web/node_modules/next/dist/shared/lib/utils.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
"[project]/web/node_modules/next/dist/shared/lib/utils/reflect-utils.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// This regex will have fast negatives meaning valid identifiers may not pass
// this test. However this is only used during static generation to provide hints
// about why a page bailed out of some or all prerendering and we can use bracket notation
// for example while `ಠ_ಠ` is a valid identifier it's ok to print `searchParams['ಠ_ಠ']`
// even if this would have been fine too `searchParams.ಠ_ಠ`
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    describeHasCheckingStringProperty: null,
    describeStringPropertyAccess: null,
    wellKnownProperties: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    describeHasCheckingStringProperty: function() {
        return describeHasCheckingStringProperty;
    },
    describeStringPropertyAccess: function() {
        return describeStringPropertyAccess;
    },
    wellKnownProperties: function() {
        return wellKnownProperties;
    }
});
const isDefinitelyAValidIdentifier = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
function describeStringPropertyAccess(target, prop) {
    if (isDefinitelyAValidIdentifier.test(prop)) {
        return `\`${target}.${prop}\``;
    }
    return `\`${target}[${JSON.stringify(prop)}]\``;
}
function describeHasCheckingStringProperty(target, prop) {
    const stringifiedProp = JSON.stringify(prop);
    return `\`Reflect.has(${target}, ${stringifiedProp})\`, \`${stringifiedProp} in ${target}\`, or similar`;
}
const wellKnownProperties = new Set([
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toString',
    'valueOf',
    'toLocaleString',
    // Promise prototype
    'then',
    'catch',
    'finally',
    // React Promise extension
    'status',
    // 'value',
    // 'error',
    // React introspection
    'displayName',
    '_debugInfo',
    // Common tested properties
    'toJSON',
    '$$typeof',
    '__esModule',
    // Tested by flight when checking for iterables
    '@@iterator'
]);
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
]})(),
"[project]/web/node_modules/next/compat/router.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/web/node_modules/next/dist/client/compat/router.js [app-ssr] (ecmascript)");
}),
"[project]/web/node_modules/next/navigation.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/web/node_modules/next/dist/client/components/navigation.js [app-ssr] (ecmascript)");
}),
];

//# sourceMappingURL=0aq__1ljextzutf88g._.js.map