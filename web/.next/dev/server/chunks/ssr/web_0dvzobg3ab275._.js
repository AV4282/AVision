module.exports = [
(()=>{"use strict";return[
"[project]/web/app/Account.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Account",
    ()=>Account
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$hooks$2f$use$2d$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/hooks/use-user.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$account$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/web/app/account.module.css [app-ssr] (css module)");
"use client";
;
;
;
;
function Account({ className = "", showSignUp = true }) {
    const { user, isLoading, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$hooks$2f$use$2d$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUser"])();
    const ready = !isLoading && !error;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        "aria-label": "Account",
        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$account$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].account} ${className}`,
        children: [
            ready && user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$account$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].name,
                        children: user.name || user.email
                    }, void 0, false, {
                        fileName: "[project]/web/app/Account.tsx",
                        lineNumber: 25,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$account$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].link,
                        href: "/auth/logout",
                        children: "Log out"
                    }, void 0, false, {
                        fileName: "[project]/web/app/Account.tsx",
                        lineNumber: 26,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/web/app/Account.tsx",
                lineNumber: 24,
                columnNumber: 9
            }, this),
            ready && !user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$account$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].link,
                        href: "/auth/login",
                        children: "Log in"
                    }, void 0, false, {
                        fileName: "[project]/web/app/Account.tsx",
                        lineNumber: 33,
                        columnNumber: 11
                    }, this),
                    showSignUp && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$account$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].button,
                        href: "/onboarding",
                        children: "Sign up"
                    }, void 0, false, {
                        fileName: "[project]/web/app/Account.tsx",
                        lineNumber: 37,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/web/app/Account.tsx",
                lineNumber: 32,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/web/app/Account.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
}),
"[project]/web/app/Paving.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Paving",
    ()=>Paving
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$paving$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/web/app/paving.module.css [app-ssr] (css module)");
;
;
function Paving() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$paving$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].root,
        "aria-hidden": "true",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$paving$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].dots
            }, void 0, false, {
                fileName: "[project]/web/app/Paving.tsx",
                lineNumber: 12,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$paving$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].fade
            }, void 0, false, {
                fileName: "[project]/web/app/Paving.tsx",
                lineNumber: 13,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$paving$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].viewfinder,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {}, void 0, false, {
                        fileName: "[project]/web/app/Paving.tsx",
                        lineNumber: 15,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {}, void 0, false, {
                        fileName: "[project]/web/app/Paving.tsx",
                        lineNumber: 16,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {}, void 0, false, {
                        fileName: "[project]/web/app/Paving.tsx",
                        lineNumber: 17,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {}, void 0, false, {
                        fileName: "[project]/web/app/Paving.tsx",
                        lineNumber: 18,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/web/app/Paving.tsx",
                lineNumber: 14,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/web/app/Paving.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
}),
"[project]/web/app/onboarding/Onboarding.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Onboarding",
    ()=>Onboarding
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$hooks$2f$use$2d$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/hooks/use-user.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$prefs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/lib/prefs.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$Account$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/app/Account.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$Paving$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/app/Paving.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/web/app/onboarding/onboarding.module.css [app-ssr] (css module)");
"use client";
;
;
;
;
;
;
;
;
;
const QUESTIONS = {
    student: "Are you a student?",
    school: "What school do you go to?",
    marta: "Do you take MARTA?"
};
// Schools AVision supports, shown as one-tap answers. Anyone else types their
// school. To add Georgia Tech later, add a line here. `value` is what gets saved.
const SCHOOLS = [
    {
        label: "Georgia State University",
        value: "Georgia State University"
    }
];
function YesNo(props) {
    const { labelledBy, value, onAnswer } = props;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        role: "group",
        "aria-labelledby": labelledBy,
        className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].options,
        children: [
            true,
            false
        ].map((answer)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].option,
                "aria-pressed": value === answer,
                onClick: ()=>onAnswer(answer),
                children: [
                    answer ? "Yes" : "No",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].mark,
                        "aria-hidden": "true"
                    }, void 0, false, {
                        fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                        lineNumber: 37,
                        columnNumber: 11
                    }, this)
                ]
            }, String(answer), true, {
                fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                lineNumber: 29,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/web/app/onboarding/Onboarding.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
function Onboarding() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$hooks$2f$use$2d$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUser"])();
    const headingId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useId"])();
    const fieldId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useId"])();
    const errorId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useId"])();
    const [step, setStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("student");
    const [isStudent, setIsStudent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [school, setSchool] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [takesMarta, setTakesMarta] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [schoolMissing, setSchoolMissing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const headingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fieldRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isFirstRender = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(true);
    const finished = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    // The school question only exists for students.
    const steps = isStudent === false ? [
        "student",
        "marta"
    ] : [
        "student",
        "school",
        "marta"
    ];
    const position = steps.indexOf(step);
    // A new question takes focus, so keyboard and screen reader users land on it.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        window.scrollTo(0, 0);
        headingRef.current?.focus();
    }, [
        step
    ]);
    // Next.js keeps a page's state alive after you leave it. Once the questions
    // are answered, clear them as the page is hidden, so "answer again" starts
    // from the first question instead of the last one.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutEffect"])(()=>{
        return ()=>{
            if (!finished.current) return;
            finished.current = false;
            setStep("student");
            setIsStudent(null);
            setSchool("");
            setTakesMarta(null);
            setSchoolMissing(false);
        };
    }, []);
    function answerStudent(answer) {
        setIsStudent(answer);
        if (!answer) setSchool("");
        setStep(answer ? "school" : "marta");
    }
    function pickSchool(value) {
        setSchool(value);
        setSchoolMissing(false);
        setStep("marta");
    }
    function submitSchool(event) {
        event.preventDefault();
        if (!school.trim()) {
            setSchoolMissing(true);
            fieldRef.current?.focus();
            return;
        }
        setStep("marta");
    }
    function answerMarta(answer) {
        setTakesMarta(answer);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$prefs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setPrefs"])({
            onboarded: true,
            isStudent,
            school: isStudent ? school.trim() : null,
            takesMarta: answer
        });
        finished.current = true;
        if (user) {
            router.replace("/"); // already has an account, so there is nothing left to do
        } else {
            // The last step of signing up: create the account with Auth0, which
            // brings the person back to the home page. A full page load is needed
            // because Auth0 serves this address, not this app.
            // eslint-disable-next-line @next/next/no-location-assign-relative-destination
            window.location.assign("/auth/login?screen_hint=signup");
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].page,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].brand,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].wordmark,
                        children: "AVision"
                    }, void 0, false, {
                        fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                        lineNumber: 136,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].pitch,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].tagline,
                                children: "Spot an issue. Report it in a minute."
                            }, void 0, false, {
                                fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                lineNumber: 140,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].lead,
                                children: "AVision helps you report everyday problems around your city or campus, like a broken streetlight, a blocked sidewalk or an elevator that is out of service, to the people who can fix them."
                            }, void 0, false, {
                                fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                lineNumber: 141,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                        lineNumber: 139,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].paving,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$Paving$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Paving"], {}, void 0, false, {
                            fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                            lineNumber: 147,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                        lineNumber: 146,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                lineNumber: 135,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$Account$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Account"], {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].account,
                showSignUp: false
            }, void 0, false, {
                fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                lineNumber: 151,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].flow,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].panel,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].progress,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].dashes,
                                    "aria-hidden": "true",
                                    children: steps.map((name, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].dash,
                                            "data-reached": index <= position
                                        }, name, false, {
                                            fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                            lineNumber: 158,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                    lineNumber: 156,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].count,
                                    children: [
                                        "Question ",
                                        position + 1,
                                        " of ",
                                        steps.length
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                    lineNumber: 161,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                            lineNumber: 155,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].step,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    id: headingId,
                                    ref: headingRef,
                                    tabIndex: -1,
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].question,
                                    children: QUESTIONS[step]
                                }, void 0, false, {
                                    fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                    lineNumber: 168,
                                    columnNumber: 13
                                }, this),
                                step === "student" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNo, {
                                    labelledBy: headingId,
                                    value: isStudent,
                                    onAnswer: answerStudent
                                }, void 0, false, {
                                    fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                    lineNumber: 172,
                                    columnNumber: 36
                                }, this),
                                step === "school" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                    onSubmit: submitSchool,
                                    noValidate: true,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            role: "group",
                                            "aria-labelledby": headingId,
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].options,
                                            children: SCHOOLS.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].option,
                                                    "aria-pressed": school === item.value,
                                                    onClick: ()=>pickSchool(item.value),
                                                    children: [
                                                        item.label,
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].mark,
                                                            "aria-hidden": "true"
                                                        }, void 0, false, {
                                                            fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                                            lineNumber: 186,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, item.value, true, {
                                                    fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                                    lineNumber: 178,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                            lineNumber: 176,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: fieldId,
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].fieldLabel,
                                            children: "Go somewhere else? Type your school"
                                        }, void 0, false, {
                                            fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                            lineNumber: 190,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: fieldId,
                                            ref: fieldRef,
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].field,
                                            type: "text",
                                            value: SCHOOLS.some((item)=>item.value === school) ? "" : school,
                                            maxLength: 100,
                                            autoComplete: "off",
                                            autoCapitalize: "words",
                                            spellCheck: false,
                                            "aria-invalid": schoolMissing,
                                            "aria-describedby": errorId,
                                            onChange: (event)=>{
                                                setSchool(event.target.value);
                                                setSchoolMissing(false);
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                            lineNumber: 193,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            id: errorId,
                                            role: "alert",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].error,
                                            children: schoolMissing ? "Choose a school above, or type yours here." : ""
                                        }, void 0, false, {
                                            fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                            lineNumber: 210,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].note,
                                            children: "Campus reports cover Georgia State only for now."
                                        }, void 0, false, {
                                            fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                            lineNumber: 213,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "submit",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].primary,
                                            children: "Continue"
                                        }, void 0, false, {
                                            fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                            lineNumber: 214,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                    lineNumber: 175,
                                    columnNumber: 15
                                }, this),
                                step === "marta" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNo, {
                                            labelledBy: headingId,
                                            value: takesMarta,
                                            onAnswer: answerMarta
                                        }, void 0, false, {
                                            fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                            lineNumber: 222,
                                            columnNumber: 17
                                        }, this),
                                        !user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].next,
                                            children: "Next, you'll create your account."
                                        }, void 0, false, {
                                            fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                            lineNumber: 223,
                                            columnNumber: 27
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                    lineNumber: 221,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, step, true, {
                            fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                            lineNumber: 167,
                            columnNumber: 11
                        }, this),
                        position > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].back,
                            onClick: ()=>setStep(steps[position - 1]),
                            children: "Back"
                        }, void 0, false, {
                            fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                            lineNumber: 229,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                    lineNumber: 154,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                lineNumber: 153,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/web/app/onboarding/Onboarding.tsx",
        lineNumber: 134,
        columnNumber: 5
    }, this);
}
}),
"[project]/web/lib/prefs.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PREFS_KEY",
    ()=>PREFS_KEY,
    "getPrefs",
    ()=>getPrefs,
    "setPrefs",
    ()=>setPrefs,
    "usePrefs",
    ()=>usePrefs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
const PREFS_KEY = "avision.prefs";
const DEFAULTS = {
    onboarded: false,
    isStudent: null,
    school: null,
    takesMarta: null
};
// If storage is blocked (private mode, strict settings) the answers still hold
// for this visit, held in memory.
let memory = null;
let cachedRaw;
let cachedValue = DEFAULTS;
const listeners = new Set();
function readRaw() {
    try {
        return window.localStorage.getItem(PREFS_KEY) ?? memory;
    } catch  {
        return memory;
    }
}
const yesNo = (value)=>typeof value === "boolean" ? value : null;
function getPrefs() {
    const raw = readRaw();
    if (raw === cachedRaw) return cachedValue;
    let value = DEFAULTS;
    if (raw) {
        try {
            const parsed = JSON.parse(raw);
            value = {
                onboarded: parsed?.onboarded === true,
                isStudent: yesNo(parsed?.isStudent),
                school: typeof parsed?.school === "string" && parsed.school.trim() ? parsed.school.trim() : null,
                takesMarta: yesNo(parsed?.takesMarta)
            };
        } catch  {
            value = DEFAULTS;
        }
    }
    cachedRaw = raw;
    cachedValue = value;
    return value;
}
function setPrefs(patch) {
    const next = JSON.stringify({
        ...getPrefs(),
        ...patch
    });
    memory = next;
    try {
        window.localStorage.setItem(PREFS_KEY, next);
    } catch  {
    // Storage is unavailable. The in-memory copy above keeps this visit working.
    }
    listeners.forEach((notify)=>notify());
}
function subscribe(notify) {
    listeners.add(notify);
    window.addEventListener("storage", notify);
    return ()=>{
        listeners.delete(notify);
        window.removeEventListener("storage", notify);
    };
}
function usePrefs() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(subscribe, getPrefs, ()=>null);
}
}),
]})(),
"[project]/web/app/account.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "account": "account-module__o7v49a__account",
  "button": "account-module__o7v49a__button",
  "link": "account-module__o7v49a__link",
  "name": "account-module__o7v49a__name",
});
}),
"[project]/web/app/onboarding/onboarding.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "account": "onboarding-module__fN1kcW__account",
  "arrive": "onboarding-module__fN1kcW__arrive",
  "back": "onboarding-module__fN1kcW__back",
  "brand": "onboarding-module__fN1kcW__brand",
  "count": "onboarding-module__fN1kcW__count",
  "dash": "onboarding-module__fN1kcW__dash",
  "dashes": "onboarding-module__fN1kcW__dashes",
  "error": "onboarding-module__fN1kcW__error",
  "field": "onboarding-module__fN1kcW__field",
  "fieldLabel": "onboarding-module__fN1kcW__fieldLabel",
  "flow": "onboarding-module__fN1kcW__flow",
  "lane-x": "onboarding-module__fN1kcW__lane-x",
  "lane-y": "onboarding-module__fN1kcW__lane-y",
  "lead": "onboarding-module__fN1kcW__lead",
  "mark": "onboarding-module__fN1kcW__mark",
  "next": "onboarding-module__fN1kcW__next",
  "note": "onboarding-module__fN1kcW__note",
  "option": "onboarding-module__fN1kcW__option",
  "options": "onboarding-module__fN1kcW__options",
  "page": "onboarding-module__fN1kcW__page",
  "panel": "onboarding-module__fN1kcW__panel",
  "paving": "onboarding-module__fN1kcW__paving",
  "pitch": "onboarding-module__fN1kcW__pitch",
  "pop": "onboarding-module__fN1kcW__pop",
  "primary": "onboarding-module__fN1kcW__primary",
  "progress": "onboarding-module__fN1kcW__progress",
  "question": "onboarding-module__fN1kcW__question",
  "step": "onboarding-module__fN1kcW__step",
  "tagline": "onboarding-module__fN1kcW__tagline",
  "wordmark": "onboarding-module__fN1kcW__wordmark",
});
}),
"[project]/web/app/paving.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "dots": "paving-module__wvHSnG__dots",
  "fade": "paving-module__wvHSnG__fade",
  "focus": "paving-module__wvHSnG__focus",
  "lock": "paving-module__wvHSnG__lock",
  "roll": "paving-module__wvHSnG__roll",
  "root": "paving-module__wvHSnG__root",
  "settle": "paving-module__wvHSnG__settle",
  "viewfinder": "paving-module__wvHSnG__viewfinder",
});
}),
];

//# sourceMappingURL=web_0dvzobg3ab275._.js.map