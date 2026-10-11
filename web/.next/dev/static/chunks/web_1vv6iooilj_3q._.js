(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
(()=>{"use strict";return[
"[project]/web/app/Account.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Account",
    ()=>Account
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$hooks$2f$use$2d$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/client/hooks/use-user.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$account$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/web/app/account.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function Account({ className = "" }) {
    _s();
    const { user, isLoading, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$hooks$2f$use$2d$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUser"])();
    const ready = !isLoading && !error;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        "aria-label": "Account",
        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$account$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].account} ${className}`,
        children: [
            ready && user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$account$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].name,
                        children: user.name || user.email
                    }, void 0, false, {
                        fileName: "[project]/web/app/Account.tsx",
                        lineNumber: 21,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$account$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].link,
                        href: "/auth/logout",
                        children: "Log out"
                    }, void 0, false, {
                        fileName: "[project]/web/app/Account.tsx",
                        lineNumber: 22,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/web/app/Account.tsx",
                lineNumber: 20,
                columnNumber: 9
            }, this),
            ready && !user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$account$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].link,
                        href: "/auth/login",
                        children: "Log in"
                    }, void 0, false, {
                        fileName: "[project]/web/app/Account.tsx",
                        lineNumber: 29,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$account$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].button,
                        href: "/auth/login?screen_hint=signup",
                        children: "Sign up"
                    }, void 0, false, {
                        fileName: "[project]/web/app/Account.tsx",
                        lineNumber: 32,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/web/app/Account.tsx",
                lineNumber: 28,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/web/app/Account.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
_s(Account, "HS4ZDCYBfte8Xd6ooaGKP8za5HY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$client$2f$hooks$2f$use$2d$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUser"]
    ];
});
_c = Account;
var _c;
__turbopack_context__.k.register(_c, "Account");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/web/app/onboarding/Onboarding.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Onboarding",
    ()=>Onboarding
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$prefs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/lib/prefs.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$Account$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/app/Account.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/web/app/onboarding/onboarding.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
"use client";
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        role: "group",
        "aria-labelledby": labelledBy,
        className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].options,
        children: [
            true,
            false
        ].map((answer)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].option,
                "aria-pressed": value === answer,
                onClick: ()=>onAnswer(answer),
                children: [
                    answer ? "Yes" : "No",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].mark,
                        "aria-hidden": "true"
                    }, void 0, false, {
                        fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                        lineNumber: 34,
                        columnNumber: 11
                    }, this)
                ]
            }, String(answer), true, {
                fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                lineNumber: 26,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/web/app/onboarding/Onboarding.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
_c = YesNo;
function Onboarding() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const headingId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    const fieldId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    const errorId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    const [step, setStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("student");
    const [isStudent, setIsStudent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [school, setSchool] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [takesMarta, setTakesMarta] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [schoolMissing, setSchoolMissing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const headingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fieldRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isFirstRender = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(true);
    const finished = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Onboarding.useEffect": ()=>{
            if (isFirstRender.current) {
                isFirstRender.current = false;
                return;
            }
            window.scrollTo(0, 0);
            headingRef.current?.focus();
        }
    }["Onboarding.useEffect"], [
        step
    ]);
    // Next.js keeps a page's state alive after you leave it. Once the questions
    // are answered, clear them as the page is hidden, so "answer again" starts
    // from the first question instead of the last one.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "Onboarding.useLayoutEffect": ()=>{
            return ({
                "Onboarding.useLayoutEffect": ()=>{
                    if (!finished.current) return;
                    finished.current = false;
                    setStep("student");
                    setIsStudent(null);
                    setSchool("");
                    setTakesMarta(null);
                    setSchoolMissing(false);
                }
            })["Onboarding.useLayoutEffect"];
        }
    }["Onboarding.useLayoutEffect"], []);
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
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$lib$2f$prefs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setPrefs"])({
            onboarded: true,
            isStudent,
            school: isStudent ? school.trim() : null,
            takesMarta: answer
        });
        finished.current = true;
        router.replace("/");
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].page,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].brand,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].wordmark,
                        children: "AVision"
                    }, void 0, false, {
                        fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                        lineNumber: 124,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].pitch,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].tagline,
                                children: "Spot an issue. Report it in a minute."
                            }, void 0, false, {
                                fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                lineNumber: 126,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].lead,
                                children: "AVision helps you report everyday problems around your city or campus, like a broken streetlight, a blocked sidewalk or an elevator that is out of service, to the people who can fix them."
                            }, void 0, false, {
                                fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                lineNumber: 127,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                        lineNumber: 125,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].paving,
                        "aria-hidden": "true",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].dots
                            }, void 0, false, {
                                fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                lineNumber: 133,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].viewfinder,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {}, void 0, false, {
                                        fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                        lineNumber: 135,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {}, void 0, false, {
                                        fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                        lineNumber: 136,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {}, void 0, false, {
                                        fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                        lineNumber: 137,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {}, void 0, false, {
                                        fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                        lineNumber: 138,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                lineNumber: 134,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                        lineNumber: 132,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                lineNumber: 123,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$Account$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Account"], {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].account
            }, void 0, false, {
                fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                lineNumber: 143,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].flow,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].panel,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].progress,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].dashes,
                                    "aria-hidden": "true",
                                    children: steps.map((name, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].dash,
                                            "data-reached": index <= position
                                        }, name, false, {
                                            fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                            lineNumber: 150,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                    lineNumber: 148,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].count,
                                    children: [
                                        "Question ",
                                        position + 1,
                                        " of ",
                                        steps.length
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                    lineNumber: 153,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                            lineNumber: 147,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].step,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    id: headingId,
                                    ref: headingRef,
                                    tabIndex: -1,
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].question,
                                    children: QUESTIONS[step]
                                }, void 0, false, {
                                    fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                    lineNumber: 160,
                                    columnNumber: 13
                                }, this),
                                step === "student" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNo, {
                                    labelledBy: headingId,
                                    value: isStudent,
                                    onAnswer: answerStudent
                                }, void 0, false, {
                                    fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                    lineNumber: 164,
                                    columnNumber: 36
                                }, this),
                                step === "school" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                    onSubmit: submitSchool,
                                    noValidate: true,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            role: "group",
                                            "aria-labelledby": headingId,
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].options,
                                            children: SCHOOLS.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].option,
                                                    "aria-pressed": school === item.value,
                                                    onClick: ()=>pickSchool(item.value),
                                                    children: [
                                                        item.label,
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].mark,
                                                            "aria-hidden": "true"
                                                        }, void 0, false, {
                                                            fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                                            lineNumber: 178,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, item.value, true, {
                                                    fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                                    lineNumber: 170,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                            lineNumber: 168,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: fieldId,
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].fieldLabel,
                                            children: "Go somewhere else? Type your school"
                                        }, void 0, false, {
                                            fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                            lineNumber: 182,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: fieldId,
                                            ref: fieldRef,
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].field,
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
                                            lineNumber: 185,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            id: errorId,
                                            role: "alert",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].error,
                                            children: schoolMissing ? "Choose a school above, or type yours here." : ""
                                        }, void 0, false, {
                                            fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                            lineNumber: 202,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].note,
                                            children: "Campus reports cover Georgia State only for now."
                                        }, void 0, false, {
                                            fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                            lineNumber: 205,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "submit",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].primary,
                                            children: "Continue"
                                        }, void 0, false, {
                                            fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                            lineNumber: 206,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                    lineNumber: 167,
                                    columnNumber: 15
                                }, this),
                                step === "marta" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YesNo, {
                                    labelledBy: headingId,
                                    value: takesMarta,
                                    onAnswer: answerMarta
                                }, void 0, false, {
                                    fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                                    lineNumber: 212,
                                    columnNumber: 34
                                }, this)
                            ]
                        }, step, true, {
                            fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                            lineNumber: 159,
                            columnNumber: 11
                        }, this),
                        position > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$app$2f$onboarding$2f$onboarding$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].back,
                            onClick: ()=>setStep(steps[position - 1]),
                            children: "Back"
                        }, void 0, false, {
                            fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                            lineNumber: 216,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                    lineNumber: 146,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/web/app/onboarding/Onboarding.tsx",
                lineNumber: 145,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/web/app/onboarding/Onboarding.tsx",
        lineNumber: 122,
        columnNumber: 5
    }, this);
}
_s(Onboarding, "bqaLCriJe0yBHm3vRoqEjGVDOO0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"],
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"],
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]
    ];
});
_c1 = Onboarding;
var _c, _c1;
__turbopack_context__.k.register(_c, "YesNo");
__turbopack_context__.k.register(_c1, "Onboarding");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/web/lib/prefs.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
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
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(subscribe, getPrefs, {
        "usePrefs.useSyncExternalStore": ()=>null
    }["usePrefs.useSyncExternalStore"]);
}
_s(usePrefs, "FpwL93IKMLJZuQQXefVtWynbBPQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]})(),
"[project]/web/app/account.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "account": "account-module__o7v49a__account",
  "button": "account-module__o7v49a__button",
  "link": "account-module__o7v49a__link",
  "name": "account-module__o7v49a__name",
});
}),
"[project]/web/app/onboarding/onboarding.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "account": "onboarding-module__fN1kcW__account",
  "arrive": "onboarding-module__fN1kcW__arrive",
  "back": "onboarding-module__fN1kcW__back",
  "brand": "onboarding-module__fN1kcW__brand",
  "count": "onboarding-module__fN1kcW__count",
  "dash": "onboarding-module__fN1kcW__dash",
  "dashes": "onboarding-module__fN1kcW__dashes",
  "dots": "onboarding-module__fN1kcW__dots",
  "error": "onboarding-module__fN1kcW__error",
  "field": "onboarding-module__fN1kcW__field",
  "fieldLabel": "onboarding-module__fN1kcW__fieldLabel",
  "flow": "onboarding-module__fN1kcW__flow",
  "lead": "onboarding-module__fN1kcW__lead",
  "mark": "onboarding-module__fN1kcW__mark",
  "note": "onboarding-module__fN1kcW__note",
  "option": "onboarding-module__fN1kcW__option",
  "options": "onboarding-module__fN1kcW__options",
  "page": "onboarding-module__fN1kcW__page",
  "panel": "onboarding-module__fN1kcW__panel",
  "paving": "onboarding-module__fN1kcW__paving",
  "pitch": "onboarding-module__fN1kcW__pitch",
  "primary": "onboarding-module__fN1kcW__primary",
  "progress": "onboarding-module__fN1kcW__progress",
  "question": "onboarding-module__fN1kcW__question",
  "settle": "onboarding-module__fN1kcW__settle",
  "step": "onboarding-module__fN1kcW__step",
  "tagline": "onboarding-module__fN1kcW__tagline",
  "viewfinder": "onboarding-module__fN1kcW__viewfinder",
  "wordmark": "onboarding-module__fN1kcW__wordmark",
});
}),
]);

//# sourceMappingURL=web_1vv6iooilj_3q._.js.map