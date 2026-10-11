module.exports = [
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/dpopUtils.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "validateDpopConfiguration",
    ()=>validateDpopConfiguration,
    "validateKeyPairCompatibility",
    ()=>validateKeyPairCompatibility
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/constants.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$dpopRetry$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/dpopRetry.js [middleware] (ecmascript)");
;
;
async function validateKeyPairCompatibility(privateKey, publicKey) {
    // Skip key pair validation in Edge Runtime environments
    // Edge Runtime doesn't have access to Node.js crypto APIs needed for validation
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$dpopRetry$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isEdgeRuntime"])()) {
        return true;
    }
    try {
        // Dynamic import with runtime-constructed path prevents ALL bundlers from bundling crypto
        // String concatenation at runtime makes the import path impossible to statically analyze
        // This is bundler-agnostic and works with webpack, Turbopack, Vite, esbuild, Rollup, etc.
        const cryptoModule = "cry" + "pto";
        const { createSign, createVerify } = await __turbopack_context__.A("[externals]/crypto [external] (crypto, cjs, async loader)");
        // Create test data
        const testData = "test-data-for-key-pair-validation";
        // Sign with private key
        const sign = createSign("sha256");
        sign.update(testData);
        const signature = sign.sign(privateKey);
        // Verify with public key
        const verify = createVerify("sha256");
        verify.update(testData);
        const isValid = verify.verify(publicKey, signature);
        if (!isValid) {
            console.warn("WARNING: Private and public keys do not form a valid key pair - signature verification failed. " + "Please ensure the keys are properly paired and in the correct format. " + "DPoP will be disabled and bearer authentication will be used instead.");
            return false;
        }
        return true;
    } catch (error) {
        console.warn("WARNING: Failed to validate key pair compatibility. " + "This may indicate invalid key format, mismatched algorithms, or corrupted key data. " + "DPoP will be disabled and bearer authentication will be used instead. " + `Error: ${error instanceof Error ? error.message : String(error)}`);
        return false;
    }
}
async function validateDpopConfiguration(options) {
    const useDPoP = options.useDPoP || false;
    // If DPoP is not enabled, return early with undefined values
    if (!useDPoP) {
        return {
            dpopKeyPair: undefined,
            dpopOptions: undefined
        };
    }
    // Build DPoP options with defaults from environment variables or provided options
    const clockTolerance = options.dpopOptions?.clockTolerance ?? (process.env.AUTH0_DPOP_CLOCK_TOLERANCE ? parseInt(process.env.AUTH0_DPOP_CLOCK_TOLERANCE, 10) : __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DEFAULT_DPOP_CLOCK_TOLERANCE"]);
    // Warn if clock tolerance exceeds recommended maximum (but don't enforce)
    if (clockTolerance > __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MAX_RECOMMENDED_DPOP_CLOCK_TOLERANCE"]) {
        const productionMaxTolerance = process.env.AUTH0_DPOP_CLOCK_TOLERANCE_MAX_PROD ? parseInt(process.env.AUTH0_DPOP_CLOCK_TOLERANCE_MAX_PROD, 10) : __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MAX_RECOMMENDED_DPOP_CLOCK_TOLERANCE"];
        if (("TURBOPACK compile-time value", "development") === "production" && clockTolerance > productionMaxTolerance) //TURBOPACK unreachable
        ;
        console.warn(`WARNING: clockTolerance of ${clockTolerance}s exceeds recommended maximum of ${__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MAX_RECOMMENDED_DPOP_CLOCK_TOLERANCE"]}s. ` + "This may weaken DPoP security by allowing replay attacks within a wider time window. " + "Consider synchronizing server clocks using NTP instead of increasing tolerance.");
    }
    const dpopOptions = {
        clockSkew: options.dpopOptions?.clockSkew ?? (process.env.AUTH0_DPOP_CLOCK_SKEW ? parseInt(process.env.AUTH0_DPOP_CLOCK_SKEW, 10) : __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DEFAULT_DPOP_CLOCK_SKEW"]),
        clockTolerance,
        retry: {
            delay: options.dpopOptions?.retry?.delay ?? (process.env.AUTH0_RETRY_DELAY ? parseInt(process.env.AUTH0_RETRY_DELAY, 10) : __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DEFAULT_RETRY_DELAY"]),
            jitter: options.dpopOptions?.retry?.jitter ?? (process.env.AUTH0_RETRY_JITTER ? process.env.AUTH0_RETRY_JITTER === "true" : __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DEFAULT_RETRY_JITTER"])
        }
    };
    // Validate retry configuration
    if (dpopOptions.retry && typeof dpopOptions.retry.delay === "number" && dpopOptions.retry.delay < 0) {
        throw new Error("Retry delay must be non-negative");
    }
    // If we already have a keypair, return it with options
    if (options.dpopKeyPair) {
        return {
            dpopKeyPair: options.dpopKeyPair,
            dpopOptions
        };
    }
    // If DPoP is enabled but no keypair provided, check if environment variables exist
    if (useDPoP) {
        const privateKeyPem = process.env.AUTH0_DPOP_PRIVATE_KEY;
        const publicKeyPem = process.env.AUTH0_DPOP_PUBLIC_KEY;
        // In Edge Runtime, we can't use Node.js crypto APIs to load keys from environment variables
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$dpopRetry$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isEdgeRuntime"])() && (privateKeyPem || publicKeyPem)) {
            console.warn("WARNING: Running in Edge Runtime environment. DPoP keypair loading from environment variables " + "is not supported due to limited Node.js crypto API access. DPoP has been disabled. " + "To use DPoP in Edge Runtime, provide a pre-generated keypair via the dpopKeyPair option.");
            return {
                dpopKeyPair: undefined,
                dpopOptions: undefined
            };
        }
        if (privateKeyPem && publicKeyPem) {
            try {
                // Dynamic import with runtime-constructed path prevents ALL bundlers from bundling crypto
                // String concatenation at runtime makes the import path impossible to statically analyze
                // This is bundler-agnostic and works with webpack, Turbopack, Vite, esbuild, Rollup, etc.
                const cryptoModule = "cry" + "pto";
                const { createPrivateKey, createPublicKey, webcrypto } = await __turbopack_context__.A("[externals]/crypto [external] (crypto, cjs, async loader)");
                const privateKeyNodeJS = createPrivateKey(privateKeyPem);
                const publicKeyNodeJS = createPublicKey(publicKeyPem);
                // Validate algorithm - DPoP requires ES256 (ECDSA using P-256 and SHA-256)
                if (privateKeyNodeJS.asymmetricKeyType !== "ec") {
                    throw new Error(`DPoP private key must be an Elliptic Curve key for ES256 algorithm, got: ${privateKeyNodeJS.asymmetricKeyType}`);
                }
                if (publicKeyNodeJS.asymmetricKeyType !== "ec") {
                    throw new Error(`DPoP public key must be an Elliptic Curve key for ES256 algorithm, got: ${publicKeyNodeJS.asymmetricKeyType}`);
                }
                const privateKeyDetails = privateKeyNodeJS.asymmetricKeyDetails;
                const publicKeyDetails = publicKeyNodeJS.asymmetricKeyDetails;
                // Validate P-256 curve requirement for ES256 algorithm
                if (privateKeyDetails?.namedCurve !== "prime256v1") {
                    throw new Error(`DPoP private key must use P-256 curve (prime256v1) for ES256 algorithm, got: ${privateKeyDetails?.namedCurve}`);
                }
                if (publicKeyDetails?.namedCurve !== "prime256v1") {
                    throw new Error(`DPoP public key must use P-256 curve (prime256v1) for ES256 algorithm, got: ${publicKeyDetails?.namedCurve}`);
                }
                // Validate key pair compatibility
                const isKeyPairValid = await validateKeyPairCompatibility(privateKeyNodeJS, publicKeyNodeJS);
                if (!isKeyPairValid) {
                    // Key pair validation failed, completely disable DPoP to ensure consistent state
                    // When validation fails, we should not use DPoP at all and fallback to bearer auth
                    console.warn("WARNING: DPoP key pair validation failed. DPoP has been completely disabled. " + "Falling back to bearer authentication. Please verify your key pair configuration.");
                    return {
                        dpopKeyPair: undefined,
                        dpopOptions: undefined
                    };
                }
                // Convert NodeJS KeyObjects to Web Crypto CryptoKeys
                // Export to DER format then import via Web Crypto API
                const privateKeyDer = privateKeyNodeJS.export({
                    type: "pkcs8",
                    format: "der"
                });
                const publicKeyDer = publicKeyNodeJS.export({
                    type: "spki",
                    format: "der"
                });
                const privateKey = await webcrypto.subtle.importKey("pkcs8", privateKeyDer, {
                    name: "ECDSA",
                    namedCurve: "P-256"
                }, true, [
                    "sign"
                ]);
                const publicKey = await webcrypto.subtle.importKey("spki", publicKeyDer, {
                    name: "ECDSA",
                    namedCurve: "P-256"
                }, true, [
                    "verify"
                ]);
                return {
                    dpopKeyPair: {
                        privateKey,
                        publicKey
                    },
                    dpopOptions
                };
            } catch (error) {
                console.warn("WARNING: Failed to load DPoP keypair from environment variables. " + "Please ensure AUTH0_DPOP_PUBLIC_KEY and AUTH0_DPOP_PRIVATE_KEY contain valid ES256 keys in PEM format. " + `Error: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
        if (!privateKeyPem || !publicKeyPem) {
            // Issue warning if no keypair is available
            console.warn("WARNING: useDPoP is set to true but dpopKeyPair is not provided. " + "DPoP will not be used and protected requests will use bearer authentication instead. " + "To enable DPoP, provide a dpopKeyPair in the Auth0Client options or set " + "AUTH0_DPOP_PUBLIC_KEY and AUTH0_DPOP_PRIVATE_KEY environment variables.");
        }
    }
    // No DPoP keypair available, but DPoP is enabled, return options without keypair
    return {
        dpopKeyPair: undefined,
        dpopOptions
    };
}
}),
];

//# sourceMappingURL=0aq__%40auth0_nextjs-auth0_dist_utils_dpopUtils_0lv3vre0xk770.js.map