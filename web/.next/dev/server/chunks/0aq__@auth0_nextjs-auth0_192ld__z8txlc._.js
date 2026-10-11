(()=>{"use strict";module.exports = [
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/anonymous-session-errors.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AnonymousSessionError",
    ()=>AnonymousSessionError,
    "getStatusForAnonymousError",
    ()=>getStatusForAnonymousError,
    "mapAnonymousErrorCode",
    ()=>mapAnonymousErrorCode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/sdk-error.js [middleware] (ecmascript)");
;
class AnonymousSessionError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"] {
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
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/dpop-errors.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DPoPError",
    ()=>DPoPError,
    "DPoPErrorCode",
    ()=>DPoPErrorCode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/sdk-error.js [middleware] (ecmascript)");
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
class DPoPError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"] {
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
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/index.js [middleware] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/oauth-errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$dpop$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/dpop-errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mtls$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/mtls-errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$my$2d$account$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/my-account-errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/mfa-errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$popup$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/popup-errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/passwordless-errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$db$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/passwordless-db-errors.js [middleware] (ecmascript)");
// MCD (Multiple Custom Domains) error classes
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mcd$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/mcd.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/passkey-errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$anonymous$2d$session$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/anonymous-session-errors.js [middleware] (ecmascript)");
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
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/mcd.js [middleware] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/sdk-error.js [middleware] (ecmascript)");
;
class DomainResolutionError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"] {
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
class DomainValidationError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"] {
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
class IssuerValidationError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"] {
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
class SessionDomainMismatchError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"] {
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
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/mfa-errors.js [middleware] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/sdk-error.js [middleware] (ecmascript)");
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
 */ class MfaError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"] {
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
class InvalidRequestError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"] {
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
class MfaNoAvailableFactorsError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"] {
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
class MfaRequiredError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"] {
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
class MfaTokenExpiredError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(){
        super("MFA token has expired. Please restart the MFA flow.");
        this.code = "mfa_token_expired";
        this.name = "MfaTokenExpiredError";
    }
}
class MfaTokenInvalidError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(){
        super("MFA token is invalid.");
        this.code = "mfa_token_invalid";
        this.name = "MfaTokenInvalidError";
    }
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/mtls-errors.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MtlsError",
    ()=>MtlsError,
    "MtlsErrorCode",
    ()=>MtlsErrorCode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/sdk-error.js [middleware] (ecmascript)");
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
class MtlsError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"] {
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
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/my-account-errors.js [middleware] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/sdk-error.js [middleware] (ecmascript)");
;
class MyAccountApiError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"] {
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
class ConnectAccountError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"] {
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
class ConnectedAccountsError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor({ code, message, cause }){
        super(message);
        this.name = "ConnectedAccountsError";
        this.code = code;
        this.cause = cause;
    }
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/oauth-errors.js [middleware] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/sdk-error.js [middleware] (ecmascript)");
;
class OAuth2Error extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor({ code, message }){
        super(message ?? "An error occurred while interacting with the authorization server.");
        this.name = "OAuth2Error";
        this.code = code;
    }
}
class DiscoveryError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(message){
        super(message ?? "Discovery failed for the OpenID Connect configuration.");
        this.code = "discovery_error";
        this.name = "DiscoveryError";
    }
}
class MissingStateError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(message){
        super(message ?? "The state parameter is missing.");
        this.code = "missing_state";
        this.name = "MissingStateError";
    }
}
class InvalidStateError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(message){
        super(message ?? "The state parameter is invalid.");
        this.code = "invalid_state";
        this.name = "InvalidStateError";
    }
}
class InvalidConfigurationError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"] {
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
class AuthorizationError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor({ cause, message }){
        super(message ?? "An error occurred during the authorization flow.");
        this.code = "authorization_error";
        this.cause = cause;
        this.name = "AuthorizationError";
    }
}
class AuthorizationCodeGrantRequestError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(message){
        super(message ?? "An error occurred while preparing or performing the authorization code grant request.");
        this.code = "authorization_code_grant_request_error";
        this.name = "AuthorizationCodeGrantRequestError";
    }
}
class AuthorizationCodeGrantError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor({ cause, message }){
        super(message ?? "An error occurred while trying to exchange the authorization code.");
        this.code = "authorization_code_grant_error";
        this.cause = cause;
        this.name = "AuthorizationCodeGrantError";
    }
}
class BackchannelLogoutError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(message){
        super(message ?? "An error occurred while completing the backchannel logout request.");
        this.code = "backchannel_logout_error";
        this.name = "BackchannelLogoutError";
    }
}
class BackchannelAuthenticationNotSupportedError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(){
        super("The authorization server does not support backchannel authentication. Learn how to enable it here: https://auth0.com/docs/get-started/applications/configure-client-initiated-backchannel-authentication");
        this.code = "backchannel_authentication_not_supported_error";
        this.name = "BackchannelAuthenticationNotSupportedError";
    }
}
class BackchannelAuthenticationError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"] {
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
class AccessTokenError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"] {
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
class AccessTokenForConnectionError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"] {
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
class TokenRevocationError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"] {
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
class CustomTokenExchangeError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"] {
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
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/passkey-errors.js [middleware] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/sdk-error.js [middleware] (ecmascript)");
;
/**
 * Base class for all passkey-related errors.
 * Provides standardized JSON serialization matching Auth0 API format.
 */ class PasskeyError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"] {
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
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/passwordless-db-errors.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PasswordlessDbChallengeError",
    ()=>PasswordlessDbChallengeError,
    "PasswordlessDbGetTokenError",
    ()=>PasswordlessDbGetTokenError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/sdk-error.js [middleware] (ecmascript)");
;
class PasswordlessDbError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"] {
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
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/passwordless-errors.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PasswordlessStartError",
    ()=>PasswordlessStartError,
    "PasswordlessVerifyError",
    ()=>PasswordlessVerifyError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/sdk-error.js [middleware] (ecmascript)");
;
/**
 * Base class for all passwordless-related errors.
 * Provides standardized JSON serialization matching Auth0 API format.
 *
 * Supports two consumption paths with identical shape:
 * 1. Direct SDK call: properties accessed on error instance
 * 2. HTTP API route: Response.json(error) uses toJSON() automatically
 */ class PasswordlessError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"] {
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
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/popup-errors.js [middleware] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/sdk-error.js [middleware] (ecmascript)");
;
class PopupBlockedError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(message){
        super(message || "Popup was blocked by browser. Enable popups for this site.");
        this.code = "popup_blocked";
        this.name = "PopupBlockedError";
        Object.setPrototypeOf(this, PopupBlockedError.prototype);
    }
}
class PopupCancelledError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(message){
        super(message || "Popup was closed by user");
        this.code = "popup_cancelled";
        this.name = "PopupCancelledError";
        Object.setPrototypeOf(this, PopupCancelledError.prototype);
    }
}
class PopupTimeoutError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(message){
        super(message || "Popup did not complete within timeout");
        this.code = "popup_timeout";
        this.name = "PopupTimeoutError";
        Object.setPrototypeOf(this, PopupTimeoutError.prototype);
    }
}
class PopupInProgressError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(message){
        super(message || "Another popup authentication is already in progress");
        this.code = "popup_in_progress";
        this.name = "PopupInProgressError";
        Object.setPrototypeOf(this, PopupInProgressError.prototype);
    }
}
class ExecutionContextError extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"] {
    constructor(message){
        super(message || "Method can only be called in browser context");
        this.code = "invalid_execution_context";
        this.name = "ExecutionContextError";
        Object.setPrototypeOf(this, ExecutionContextError.prototype);
    }
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/sdk-error.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SdkError",
    ()=>SdkError
]);
class SdkError extends Error {
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/auth-client-provider.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthClientProvider",
    ()=>AuthClientProvider
]);
/**
 * AuthClientProvider manages AuthClient instances for multiple custom domains
 * @internal
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/index.js [middleware] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/oauth-errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mcd$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/mcd.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$lru$2d$map$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/lru-map.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$normalize$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/normalize.js [middleware] (ecmascript)");
;
;
;
;
/**
 * Maximum number of domain clients to cache.
 * This prevents unbounded memory growth when using a domain resolver.
 */ const MAX_DOMAIN_CLIENTS = 100;
class AuthClientProvider {
    /**
     * Creates a new AuthClientProvider instance.
     *
     * @param options - Configuration options
     * @throws {InvalidConfigurationError} If configuration is invalid (neither domain nor resolver)
     *
     * @internal
     */ constructor(options){
        this.createAuthClientFactory = options.createAuthClient;
        // Initialize LRU caches
        this.domainClients = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$lru$2d$map$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["LruMap"](MAX_DOMAIN_CLIENTS);
        // Detect mode and validate configuration
        if (typeof options.domain === "string") {
            // Static mode: normalize and validate domain
            this.mode = "static";
            const normalized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$normalize$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["normalizeDomain"])(options.domain, {
                allowInsecureRequests: options.allowInsecureRequests ?? ("TURBOPACK compile-time value", "development") === "test"
            });
            this.staticDomain = normalized.domain;
            this.staticIssuer = normalized.issuer;
            // Pre-populate cache with singleton AuthClient keyed by issuer URL
            // (same key shape as resolver mode) to allow unified LRU lookup.
            const client = this.createAuthClientFactory(this.staticDomain, normalized.issuer);
            this.domainClients.set(normalized.issuer, client);
        } else if (typeof options.domain === "function") {
            // Resolver mode: store resolver function
            this.mode = "resolver";
            this.resolver = options.domain;
        } else {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["InvalidConfigurationError"]("You must provide either a domain string or a DomainResolver function.");
        }
    }
    /**
     * Returns the configured static domain (if in static mode).
     *
     * @returns The static domain, or undefined if in resolver mode
     *
     * @internal
     */ get configuredDomain() {
        return this.staticDomain;
    }
    /**
     * Returns true if operating in resolver mode, false in static mode.
     *
     * @returns True if using a domain resolver, false if using a static domain
     *
     * @internal
     */ get isResolverMode() {
        return this.mode === "resolver";
    }
    /**
     * Gets the AuthClient for static mode (if available).
     *
     * Used internally to update provider references after construction.
     *
     * @returns The cached AuthClient in static mode, or undefined in resolver mode
     *
     * @internal
     */ getAuthClientForStaticMode() {
        if (this.mode === "static" && this.staticIssuer) {
            return this.domainClients.get(this.staticIssuer);
        }
        return undefined;
    }
    /**
     * Gets an AuthClient for the current request in resolver mode.
     *
     * In static mode, always returns the same cached client.
     * In resolver mode, resolves the domain from headers and caches the client.
     *
     * @param headers - Request headers used for domain resolution
     * @param url - Optional request URL for enhanced domain resolution
     * @returns A promise resolving to the appropriate AuthClient
     * @throws {DomainResolutionError} If domain resolution fails
     *
     * @internal
     */ async forRequest(headers, url) {
        if (this.mode === "static" && this.staticIssuer) {
            // Static mode: always return the pre-cached client
            return this.domainClients.get(this.staticIssuer);
        }
        // Resolver mode: resolve domain and get/create client
        const domain = await this.resolveDomain(headers, url);
        return this.forDomainSync(domain);
    }
    /**
     * Gets an AuthClient for a specific domain synchronously.
     *
     * Uses bounded LRU caching. If the cache exceeds MAX_DOMAIN_CLIENTS,
     * the oldest entry is evicted.
     *
     * @param domain - The domain to get a client for
     * @returns The AuthClient for the domain
     *
     * @internal
     */ forDomainSync(domain) {
        // Normalize and validate the domain
        const normalized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$normalize$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["normalizeDomain"])(domain);
        // Cache key is the full normalized issuer URL (including path for providers like
        // Okta custom authorization servers: e.g. https://myorg.okta.com/oauth2/default/).
        // Using only the hostname would cause cache collisions between distinct issuer paths
        // on the same host (e.g. /oauth2/default vs /oauth2/custom).
        // When mTLS support is added, extend key to `${normalized.issuer}:${mtlsEnabled}`
        // to cache separate AuthClient instances per mTLS mode (cf. server-js PR #119).
        const cacheKey = normalized.issuer;
        const client = this.domainClients.get(cacheKey);
        if (client) {
            return client;
        }
        // Create new client (LruMap.set() handles eviction)
        const newClient = this.createAuthClientFactory(normalized.domain, normalized.issuer);
        this.domainClients.set(cacheKey, newClient);
        return newClient;
    }
    /**
     * Resolves the domain from request headers using the resolver function.
     *
     * Only valid in resolver mode.
     *
     * @param headers - Request headers
     * @param url - Optional request URL for enhanced domain resolution
     * @returns A promise resolving to the resolved domain
     * @throws {DomainResolutionError} If resolution fails or returns empty string
     *
     * @private
     * @internal
     */ async resolveDomain(headers, url) {
        if (!this.resolver) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["InvalidConfigurationError"]("Domain resolver is not configured.");
        }
        let resolved;
        try {
            resolved = await this.resolver({
                headers,
                url
            });
        } catch (err) {
            const cause = err instanceof Error ? err : new Error(String(err));
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mcd$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DomainResolutionError"]("Domain resolver threw an error.", cause);
        }
        if (!resolved) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mcd$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DomainResolutionError"]("Domain resolver returned an empty string.");
        }
        // Normalize the resolved domain and return the full issuer URL (including
        // any path component, e.g. https://myorg.okta.com/oauth2/default/) so that
        // forDomainSync can use it as a precise cache key and construct the correct
        // AuthClient with the right issuer for OIDC discovery.
        const normalized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$normalize$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["normalizeDomain"])(resolved);
        return normalized.issuer;
    }
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/auth-client.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthClient",
    ()=>AuthClient,
    "buildConnectAccountErrorResponse",
    ()=>buildConnectAccountErrorResponse,
    "buildConnectedAccountsErrorResponse",
    ()=>buildConnectedAccountsErrorResponse
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/server.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$key$2f$export$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/key/export.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwk$2f$thumbprint$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/jwk/thumbprint.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$decode_jwt$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/util/decode_jwt.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwks$2f$remote$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/jwks/remote.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/jwt/verify.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$key$2f$import$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/key/import.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/oauth4webapi/build/index.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$openid$2d$client$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/openid-client/build/index.js [middleware] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$package$2e$json$2e5b$json$5d2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/package.json.[json].mjs [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$anonymous$2d$session$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/anonymous-session-errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/index.js [middleware] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/oauth-errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$my$2d$account$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/my-account-errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$dpop$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/dpop-errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/mfa-errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mtls$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/mtls-errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/passkey-errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$db$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/passwordless-db-errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/passwordless-errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/sdk-error.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mcd$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/mcd.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$types$2f$anonymous$2d$session$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/types/anonymous-session.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$types$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/types/index.js [middleware] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$types$2f$token$2d$vault$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/types/token-vault.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$types$2f$passkey$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/types/passkey.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$types$2f$passwordless$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/types/passwordless.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$types$2f$connected$2d$accounts$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/types/connected-accounts.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$anonymous$2d$session$2d$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/anonymous-session-constants.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$app$2d$base$2d$url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/app-base-url.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$authorization$2d$params$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/authorization-params-helpers.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/constants.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$dpopRetry$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/dpopRetry.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$fetchUtils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/fetchUtils.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$html$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/html-helpers.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$server$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/mfa-server-utils.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$transform$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/mfa-transform-utils.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/mfa-utils.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$validation$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/mfa-validation-utils.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$normalize$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/normalize.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$oauth$2d$error$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/oauth-error-utils.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/pathUtils.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$proxy$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/proxy.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$request$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/request.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$scope$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/scope-helpers.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$session$2d$changes$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/session-changes-helpers.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$session$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/session-helpers.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$session$2d$transfer$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/session-transfer-helpers.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$token$2d$set$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/token-set-helpers.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$url$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/url-helpers.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$webfingerCache$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/webfingerCache.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/cookies.js [middleware] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$discovery$2d$cache$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/discovery-cache.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$fetcher$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/fetcher.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$transaction$2d$store$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/transaction-store.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$user$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/user.js [middleware] (ecmascript)");
var __classPrivateFieldGet = ("TURBOPACK compile-time value", void 0) && ("TURBOPACK compile-time value", void 0).__classPrivateFieldGet || function(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _AuthClient_instances, _AuthClient_clearAnonymousSessionCookieOnLogin, _AuthClient_getTokenSetFromSession, _AuthClient_throwIfMfaRequired, _AuthClient_handlePreflight, _AuthClient_handleProxy, _AuthClient_updateSessionAfterTokenRetrieval, _AuthClient_createMfaRequiredResponse, _AuthClient_refreshTokenSet;
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
;
;
// params passed to the /authorize endpoint that cannot be overwritten
const INTERNAL_AUTHORIZE_PARAMS = [
    "client_id",
    "redirect_uri",
    "response_type",
    "code_challenge",
    "code_challenge_method",
    "state",
    "nonce",
    __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$anonymous$2d$session$2d$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["RESERVED_SESSION_TOKEN_PARAM"],
    __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$anonymous$2d$session$2d$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ANON_TRANSFER_TOKEN_PARAM"] // strip any caller-supplied ticket; SDK mints its own
];
/**
 * A constant representing the grant type for federated connection access token exchange.
 *
 * This grant type is used in OAuth token exchange scenarios where a federated connection
 * access token is required. It is specific to Auth0's implementation and follows the
 * "urn:auth0:params:oauth:grant-type:token-exchange:federated-connection-access-token" format.
 */ const GRANT_TYPE_FEDERATED_CONNECTION_ACCESS_TOKEN = "urn:auth0:params:oauth:grant-type:token-exchange:federated-connection-access-token";
/**
 * A constant representing the token type for federated connection access tokens.
 * This is used to specify the type of token being requested from Auth0.
 *
 * @constant
 * @type {string}
 */ const REQUESTED_TOKEN_TYPE_FEDERATED_CONNECTION_ACCESS_TOKEN = "http://auth0.com/oauth/token-type/federated-connection-access-token";
class AuthClient {
    constructor(options){
        _AuthClient_instances.add(this);
        this.dpopValidated = false;
        this.proxyDpopHandles = {};
        // dependencies
        this.fetch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$fetchUtils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["createSizeLimitedFetch"])(options.fetch || fetch, AuthClient.MAX_RESPONSE_BODY_SIZE);
        this.discoveryCache = options.discoveryCache || new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$discovery$2d$cache$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DiscoveryCache"]();
        this.provider = options.provider;
        this.allowInsecureRequests = options.allowInsecureRequests ?? false;
        this.httpTimeout = options.httpTimeout ?? 5000;
        this.httpOptions = ()=>{
            const headers = new Headers();
            const enableTelemetry = options.enableTelemetry ?? true;
            if (enableTelemetry) {
                const name = "nextjs-auth0";
                const version = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$package$2e$json$2e5b$json$5d2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__["default"].version;
                headers.set("User-Agent", `${name}/${version}`);
                headers.set("Auth0-Client", encodeBase64(JSON.stringify({
                    name,
                    version
                })));
            }
            return {
                signal: AbortSignal.timeout(this.httpTimeout),
                headers
            };
        };
        if (this.allowInsecureRequests && ("TURBOPACK compile-time value", "development") === "production") //TURBOPACK unreachable
        ;
        // stores
        this.transactionStore = options.transactionStore;
        this.sessionStore = options.sessionStore;
        // authorization server
        this.domain = options.domain;
        this._issuer = options.issuer ?? `https://${options.domain}/`;
        this.clientMetadata = {
            client_id: options.clientId
        };
        // Apply DPoP timing validation options to client metadata if provided
        if (options.dpopOptions) {
            if (typeof options.dpopOptions.clockSkew === "number") {
                this.clientMetadata[__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["clockSkew"]] = options.dpopOptions.clockSkew;
            }
            if (typeof options.dpopOptions.clockTolerance === "number") {
                this.clientMetadata[__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["clockTolerance"]] = options.dpopOptions.clockTolerance;
            }
        }
        // Store dpopOptions for use in retry logic
        this.dpopOptions = options.dpopOptions;
        this.clientSecret = options.clientSecret;
        this.authorizationParameters = options.authorizationParameters || {
            scope: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DEFAULT_SCOPES"]
        };
        this.pushedAuthorizationRequests = options.pushedAuthorizationRequests ?? false;
        this.clientAssertionSigningKey = options.clientAssertionSigningKey;
        this.clientAssertionSigningAlg = options.clientAssertionSigningAlg || "RS256";
        this.authorizationParameters.scope = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$scope$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ensureDefaultScope"])(this.authorizationParameters);
        const scope = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$scope$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["getScopeForAudience"])(this.authorizationParameters.scope, this.authorizationParameters.audience)?.split(" ").map((s)=>s.trim());
        if (!scope || !scope.includes("openid")) {
            throw new Error("The 'openid' scope must be included in the set of scopes. See https://auth0.com/docs");
        }
        // application
        if (Array.isArray(options.appBaseUrl)) {
            if (options.appBaseUrl.length === 0) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["InvalidConfigurationError"]("APP_BASE_URL array configuration cannot be empty.");
            }
            const invalidUrls = options.appBaseUrl.filter((url)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$url$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isUrl"])(url) === false);
            if (invalidUrls.length > 0) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["InvalidConfigurationError"](`APP_BASE_URL array contains invalid URLs: ${invalidUrls.join(", ")}`);
            }
        }
        this.appBaseUrl = options.appBaseUrl;
        this.signInReturnToPath = options.signInReturnToPath || "/";
        // validate logout strategy
        const validStrategies = [
            "auto",
            "oidc",
            "v2"
        ];
        let logoutStrategy = options.logoutStrategy || "auto";
        if (!validStrategies.includes(logoutStrategy)) {
            console.error(`Invalid logoutStrategy: ${logoutStrategy}. Must be one of: ${validStrategies.join(", ")}. Defaulting to "auto"`);
            logoutStrategy = "auto";
        }
        this.logoutStrategy = logoutStrategy;
        this.includeIdTokenHintInOIDCLogoutUrl = options.includeIdTokenHintInOIDCLogoutUrl ?? true;
        // hooks
        this.beforeSessionSaved = options.beforeSessionSaved;
        this.onCallback = options.onCallback || this.defaultOnCallback;
        this.enterpriseConnect = options.enterpriseConnect;
        // routes
        this.routes = options.routes;
        this.enableAccessTokenEndpoint = options.enableAccessTokenEndpoint ?? true;
        this.noContentProfileResponseWhenUnauthenticated = options.noContentProfileResponseWhenUnauthenticated ?? false;
        this.enableConnectAccountEndpoint = options.enableConnectAccountEndpoint ?? false;
        this.tokenRefreshBuffer = options.tokenRefreshBuffer ?? 0;
        this.useDPoP = options.useDPoP ?? false;
        this.useMtls = options.useMtls ?? false;
        if (this.useMtls && this.useDPoP) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mtls$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MtlsError"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mtls$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MtlsErrorCode"].MTLS_INCOMPATIBLE_CLIENT_AUTH, "useMtls and useDPoP cannot be used together. " + "When both are present, the server always issues a DPoP-bound token (cnf.jkt) " + "and the certificate is ignored for token binding.");
        }
        if (this.useMtls && !options.fetch) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mtls$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MtlsError"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mtls$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MtlsErrorCode"].MTLS_REQUIRES_CUSTOM_FETCH, "useMtls requires the customFetch option (Auth0Client) or the fetch option (AuthClient) " + "to be set with a TLS-aware implementation (e.g. Node.js undici with a client certificate). " + "The standard fetch global has no client certificate API. " + "See https://github.com/auth0/nextjs-auth0/blob/main/EXAMPLES.md#mtls for setup instructions.");
        }
        if (this.useMtls && (options.clientSecret || options.clientAssertionSigningKey)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mtls$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MtlsError"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mtls$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MtlsErrorCode"].MTLS_INCOMPATIBLE_CLIENT_AUTH, "useMtls cannot be combined with clientSecret or clientAssertionSigningKey. " + "mTLS replaces secret-based client authentication entirely.");
        }
        if (this.useMtls) {
            this.clientMetadata.use_mtls_endpoint_aliases = true;
        }
        // MFA token TTL for token encryption
        this.mfaTokenTtl = options.mfaTokenTtl ?? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DEFAULT_MFA_CONTEXT_TTL_SECONDS"];
        // CSP nonce for popup postMessage inline scripts
        this.cspNonce = options.cspNonce;
        // Store keypair if provided, but validate lazily to avoid crypto bundling
        this.dpopKeyPair = options.dpopKeyPair;
        // Anonymous session configuration
        this.secret = options.secret;
        const anonConfig = options.anonymousSession ?? {
            enabled: false
        };
        this.anonymousSessionEnabled = anonConfig.enabled;
        this.anonymousCookieName = anonConfig.cookie?.name ?? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$anonymous$2d$session$2d$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DEFAULT_ANONYMOUS_SESSION_COOKIE_NAME"];
        this.anonymousCookieMaxAge = anonConfig.cookie?.maxAge ?? 2592000; // 30 days default (CASCADE §C)
        this.anonymousAudience = anonConfig.audience;
        this.anonymousScope = anonConfig.scope;
        this.anonymousClearOnLogin = anonConfig.clearAnonymousSessionOnLogin ?? true;
        this.anonymousCookieOptions = {
            httpOnly: true,
            secure: anonConfig.cookie?.secure ?? true,
            sameSite: anonConfig.cookie?.sameSite ?? "lax",
            path: "/"
        };
    }
    /**
     * Lazy validation of DPoP configuration.
     * Validates both provided keypairs and environment variables.
     * Only imports dpopUtils (with crypto) when actually needed.
     */ async ensureDpopValidated() {
        if (this.dpopValidated || !this.useDPoP) {
            return;
        }
        // Dynamic import only when needed - prevents crypto from being bundled
        const dpopModule = await __turbopack_context__.A("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/dpopUtils.js [middleware] (ecmascript, async loader)");
        const dpopConfig = await dpopModule.validateDpopConfiguration({
            useDPoP: this.useDPoP,
            dpopKeyPair: this.dpopKeyPair,
            dpopOptions: this.dpopOptions
        });
        if (dpopConfig.dpopKeyPair) {
            this.dpopKeyPair = dpopConfig.dpopKeyPair;
        }
        if (dpopConfig.dpopOptions) {
            this.dpopOptions = dpopConfig.dpopOptions;
            // Update clientMetadata with resolved values from environment variables
            // This ensures clockSkew/clockTolerance from env vars are applied to OAuth operations
            if (typeof this.dpopOptions.clockSkew === "number") {
                this.clientMetadata[__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["clockSkew"]] = this.dpopOptions.clockSkew;
            }
            if (typeof this.dpopOptions.clockTolerance === "number") {
                this.clientMetadata[__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["clockTolerance"]] = this.dpopOptions.clockTolerance;
            }
        }
        this.dpopValidated = true;
    }
    async handler(req) {
        let { pathname } = req.nextUrl;
        // Next.js does NOT automatically strip basePath from pathname in middleware.
        // We must manually strip it to match against our route configurations.
        // Example: With basePath='/app', a request to '/app/auth/login' will have
        // pathname='/app/auth/login', but routes are configured as '/auth/login'.
        const basePath = req.nextUrl.basePath;
        if (basePath && pathname.startsWith(basePath)) {
            pathname = pathname.slice(basePath.length) || "/";
        }
        const sanitizedPathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["removeTrailingSlash"])(pathname);
        const method = req.method;
        if (method === "GET" && sanitizedPathname === this.routes.login) {
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$request$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isNonNavigationalRequest"])(req)) {
                // 204 No Content signals "intentionally did nothing" for prefetch/
                // non-navigational requests, avoiding polluting auth-failure telemetry
                // and access logs. Next.js discards prefetch responses regardless, so
                // behavior is unaffected.
                // Cache-Control: no-store prevents CDNs and reverse proxies from caching
                // this 204 — RFC 9111 makes 204 heuristically cacheable without an explicit
                // directive, so a cached 204 would silently break real login navigations.
                return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"](null, {
                    status: 204,
                    headers: {
                        "Cache-Control": "no-store"
                    }
                });
            }
            return this.handleLogin(req);
        } else if (method === "GET" && sanitizedPathname === this.routes.logout) {
            return this.handleLogout(req);
        } else if (method === "GET" && sanitizedPathname === this.routes.callback) {
            return this.handleCallback(req);
        } else if (method === "GET" && sanitizedPathname === this.routes.profile) {
            return this.handleProfile(req);
        } else if (method === "GET" && sanitizedPathname === this.routes.accessToken && this.enableAccessTokenEndpoint) {
            return this.handleAccessToken(req);
        } else if (method === "POST" && sanitizedPathname === this.routes.federatedDomain && this.enterpriseConnect) {
            return this.handleFederatedDomain(req);
        } else if (method === "POST" && sanitizedPathname === this.routes.backChannelLogout) {
            return this.handleBackChannelLogout(req);
        } else if (method === "GET" && sanitizedPathname === this.routes.connectAccount && this.enableConnectAccountEndpoint) {
            return this.handleConnectAccount(req);
        } else if (method === "GET" && sanitizedPathname === this.routes.mfaAuthenticators) {
            return this.handleGetAuthenticators(req);
        } else if (method === "POST" && sanitizedPathname === this.routes.mfaChallenge) {
            return this.handleChallenge(req);
        } else if (method === "POST" && sanitizedPathname === this.routes.mfaAssociate) {
            return this.handleAssociate(req);
        } else if (method === "POST" && sanitizedPathname === this.routes.mfaVerify) {
            return this.handleVerify(req);
        } else if (method === "POST" && sanitizedPathname === this.routes.passwordlessStart) {
            return this.handlePasswordlessStart(req);
        } else if (method === "POST" && sanitizedPathname === this.routes.passwordlessVerify) {
            return this.handlePasswordlessVerify(req);
        } else if (method === "POST" && sanitizedPathname === this.routes.passwordlessDbOtpChallenge) {
            return this.handlePasswordlessDbOtpChallenge(req);
        } else if (method === "POST" && sanitizedPathname === this.routes.passwordlessDbGetToken) {
            return this.handlePasswordlessDbGetToken(req);
        } else if (method === "POST" && sanitizedPathname === this.routes.passkeyRegister) {
            return this.handlePasskeyRegister(req);
        } else if (method === "POST" && sanitizedPathname === this.routes.passkeyChallenge) {
            return this.handlePasskeyChallenge(req);
        } else if (method === "POST" && sanitizedPathname === this.routes.passkeyGetToken) {
            return this.handlePasskeyGetToken(req);
        } else if (method === "POST" && sanitizedPathname === this.routes.passkeyEnrollmentChallenge) {
            return this.handlePasskeyEnrollmentChallenge(req);
        } else if (method === "POST" && sanitizedPathname === this.routes.passkeyEnrollmentVerify) {
            return this.handlePasskeyEnrollmentVerify(req);
        } else if (method === "GET" && sanitizedPathname === this.routes.anonymousSession) {
            // The three anonymous routes are matched on path and method regardless of
            // whether the feature is enabled. Each handler owns the enabled check and
            // answers 404 when the feature is off, which is the documented contract; a
            // dispatcher-level gate would instead fall through to the default handler
            // and answer 200.
            return this.handleGetAnonymousSession(req);
        } else if (method === "POST" && sanitizedPathname === this.routes.anonymousSessionLogout) {
            return this.handleAnonymousLogout(req);
        }
        if (sanitizedPathname.startsWith("/me/")) {
            return this.handleMyAccount(req);
        } else if (sanitizedPathname.startsWith("/my-org/")) {
            return this.handleMyOrg(req);
        } else {
            // no auth handler found, simply touch the sessions if rolling sessions are enabled.
            // TODO: we should try to avoid reading from the DB (for stateful sessions) on every
            // request if possible.
            const res = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
            if (this.sessionStore.isRolling && await this.sessionStore.shouldRollSession(req)) {
                const { error, session } = await this.getSessionWithDomainCheck(req.cookies);
                if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mcd$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SessionDomainMismatchError"]) {
                    console.warn(`[nextjs-auth0] ${error.message}`);
                }
                if (!error && session) {
                    // we pass the existing session (containing an `createdAt` timestamp) to the set method
                    // which will update the cookie's `maxAge` property based on the `createdAt` time
                    await this.sessionStore.set(req.cookies, res.cookies, {
                        ...session
                    });
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["addCacheControlHeadersForSession"])(res);
                }
            }
            return res;
        }
    }
    /**
     * Returns a fetch function pre-loaded with the SDK telemetry headers and the
     * configured size-limited fetch. Used by isFederatedDomain so WebFinger calls
     * share the same fetch pipeline (proxy, size limit, telemetry) as all other
     * Auth0 requests.
     *
     * @internal
     */ createWebFingerFetch() {
        return (url, init)=>{
            const { headers } = this.httpOptions();
            const merged = new Headers(headers);
            for (const [k, v] of new Headers(init?.headers ?? {}))merged.set(k, v);
            return this.fetch(url, {
                ...init,
                headers: merged
            });
        };
    }
    /**
     * @param options Login options.
     * @param req The incoming request, when one is available.
     * @param reqCookies Request cookies to read for this login when there is no
     * request object, which is the case for the programmatic Server Action form.
     * Ignored when `req` is supplied, since the request carries its own cookies.
     */ async startInteractiveLogin(options = {}, req, reqCookies) {
        await this.ensureDpopValidated();
        const appBaseUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$app$2d$base$2d$url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["resolveAppBaseUrl"])(this.appBaseUrl, req);
        const redirectUri = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["createRouteUrl"])(this.routes.callback, appBaseUrl).toString(); // must be registered with the authorization server
        let returnTo = this.signInReturnToPath;
        // Validate returnTo parameter
        if (options.returnTo) {
            const safeBaseUrl = new URL(this.authorizationParameters.redirect_uri || appBaseUrl);
            const sanitizedReturnTo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$url$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["toSafeRedirect"])(options.returnTo, safeBaseUrl);
            if (sanitizedReturnTo) {
                returnTo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$transaction$2d$store$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["clampReturnTo"])(sanitizedReturnTo.pathname + sanitizedReturnTo.search + sanitizedReturnTo.hash, this.signInReturnToPath);
            }
        }
        // Generate PKCE challenges
        const codeChallengeMethod = "S256";
        const codeVerifier = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["generateRandomCodeVerifier"]();
        const codeChallenge = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["calculatePKCECodeChallenge"](codeVerifier);
        const state = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["generateRandomState"]();
        const nonce = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["generateRandomNonce"]();
        // Construct base authorization parameters
        // If provided on both sides, this does not merge the scope property,
        // instead, the scope from the right side (options) fully overrides the left side.
        const authorizationParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$authorization$2d$params$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["mergeAuthorizationParamsIntoSearchParams"])(this.authorizationParameters, options.authorizationParameters, INTERNAL_AUTHORIZE_PARAMS);
        authorizationParams.set("client_id", this.clientMetadata.client_id);
        authorizationParams.set("redirect_uri", redirectUri);
        authorizationParams.set("response_type", __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$types$2f$connected$2d$accounts$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["RESPONSE_TYPES"].CODE);
        authorizationParams.set("code_challenge", codeChallenge);
        authorizationParams.set("code_challenge_method", codeChallengeMethod);
        authorizationParams.set("state", state);
        authorizationParams.set("nonce", nonce);
        // Add dpop_jkt parameter if DPoP is enabled
        if (this.dpopKeyPair) {
            try {
                const publicKeyJwk = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$key$2f$export$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["exportJWK"](this.dpopKeyPair.publicKey);
                const dpopJkt = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwk$2f$thumbprint$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["calculateJwkThumbprint"](publicKeyJwk);
                authorizationParams.set("dpop_jkt", dpopJkt);
            } catch (error) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$dpop$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DPoPError"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$dpop$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DPoPErrorCode"].DPOP_JKT_CALCULATION_FAILED, "DPoP is enabled but failed to calculate key thumbprint (dpop_jkt). " + "This is required for secure DPoP binding. Please check your key configuration.", error instanceof Error ? error : undefined);
            }
        }
        // SEC-1: Three-layer session-fixation mitigation for anonymous session transfer.
        // Layer 1 (reserved-param stripping) already ran via mergeAuthorizationParamsIntoSearchParams:
        //   RESERVED_SESSION_TOKEN_PARAM and ANON_TRANSFER_TOKEN_PARAM stripped from caller input.
        // Layers 2 (own-cookie sourcing) and 3 (transaction digest binding) applied below.
        let anonymousSessionLinked = false;
        let anonymousSessionRef;
        const anonymousLoginCookies = req?.cookies ?? reqCookies;
        if (this.anonymousSessionEnabled && anonymousLoginCookies) {
            try {
                const anonCookie = await this.readAnonymousCookie(anonymousLoginCookies);
                if (anonCookie?.session_token) {
                    // Layer 2: session_token is sourced ONLY from the SDK's own encrypted cookie.
                    // Never from request params (those were stripped by Layer 1 above).
                    //
                    // No client-side gate for Enterprise Connections or passwordless logins:
                    // Auth0 handles anonymous session linking for EC/passwordless at the server
                    // level; the server ignores an anon_transfer_token it cannot use, so minting
                    // is unconditional (matches auth0-auth-js/server-js precedent).
                    //
                    // PAR: NOT an exclusion. When pushedAuthorizationRequests is true, the ticket
                    // is submitted to the PAR endpoint as a normal authorizationParams entry.
                    // Verified against EA tenant (Sep 21).
                    const ticket = await this.mintTransferToken(anonCookie.session_token);
                    if (ticket !== null) {
                        // Layer 3: digest FIRST — if digestAnonymousSessionToken throws, none of
                        // the three assignments below execute, keeping all three unset and preserving
                        // the fail-open invariant. digestAnonymousSessionToken stores SHA-256 of
                        // session_token, never the token itself.
                        const ref = await digestAnonymousSessionToken(anonCookie.session_token);
                        // Append ticket to /authorize (replaces the old session_token injection)
                        authorizationParams.set(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$anonymous$2d$session$2d$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ANON_TRANSFER_TOKEN_PARAM"], ticket);
                        // "link attempted, not confirmed": Auth0 may silently discard expired or
                        // replayed tickets; authoritative confirmation requires the platform event.
                        anonymousSessionRef = ref;
                        anonymousSessionLinked = true;
                    }
                // else: ticket null → fail-open, login continues without ticket
                }
            } catch  {
            // Fail-open: any error in cookie-read, mint, or append must not block login.
            }
        }
        // Resolve challengeMode: controls whether handleCallback returns a redirect
        // (standard) or postMessage HTML (popup flows). Only stored in TransactionState
        // when non-default to minimize encrypted cookie size.
        const challengeMode = options.challengeMode || "redirect";
        // Runtime guard — TypeScript enforces at compile time, but JS callers
        // or incorrect casts could pass invalid values.
        if (challengeMode !== "redirect" && challengeMode !== "popup") {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["InvalidConfigurationError"](`Invalid challengeMode: ${challengeMode}. Expected 'redirect' or 'popup'.`);
        }
        // Enforce openid scope in resolver mode
        if (this.provider?.isResolverMode) {
            // Merge scopes from baseConfig defaults and explicit options
            const explicitScope = options.authorizationParameters?.scope;
            const defaultScope = this.authorizationParameters.scope || "";
            // Combine scopes: base config defaults + explicit options
            const scopeString = [
                defaultScope,
                explicitScope
            ].filter(Boolean).join(" ");
            const scopeSet = new Set(scopeString.split(/\s+/).filter(Boolean));
            // Enforce openid scope in resolver mode
            if (!scopeSet.has("openid")) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["InvalidConfigurationError"]('The "openid" scope is required in resolver mode (DomainResolver). ' + 'Add "openid" to your SDK configuration or login options.');
            }
        }
        // Prepare transaction state
        // Read max_age from the already-merged authorizationParams (not the static SDK config)
        // so that per-request values (e.g. max_age=0 for step-up auth) are preserved for
        // auth_time validation at callback. Falls back to SDK-level config when absent.
        const requestedMaxAgeStr = authorizationParams.get("max_age");
        let resolvedMaxAge = this.authorizationParameters.max_age;
        if (requestedMaxAgeStr !== null) {
            const parsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$authorization$2d$params$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["parseNonNegativeIntegerParam"])("max_age", requestedMaxAgeStr);
            if (parsed === null) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["InvalidConfigurationError"](`Invalid max_age parameter: "${requestedMaxAgeStr}". Must be a non-negative integer.`);
            }
            resolvedMaxAge = parsed;
        }
        // scope and audience come from user-controllable query params on
        // /auth/login, so clamp each independently to keep the resulting cookie
        // under the byte cap. A ridiculous value gets replaced with `undefined`
        // (equivalent to not passing the field), and the authorization server
        // will reject any invalid value at /authorize.
        const transactionState = {
            nonce,
            maxAge: resolvedMaxAge,
            codeVerifier,
            responseType: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$types$2f$connected$2d$accounts$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["RESPONSE_TYPES"].CODE,
            state,
            returnTo,
            scope: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$transaction$2d$store$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["clampTransactionField"])("scope", authorizationParams.get("scope") || undefined, undefined),
            audience: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$transaction$2d$store$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["clampTransactionField"])("audience", authorizationParams.get("audience") || undefined, undefined),
            challengeMode: challengeMode !== "redirect" ? challengeMode : undefined,
            // Store origin domain and issuer for callback delegation in resolver mode
            originDomain: this.provider?.isResolverMode ? this.domain : undefined,
            originIssuer: this.provider?.isResolverMode ? this.issuer : undefined,
            // Store anonymous session linked flag for callback migration logic
            anonymousSessionLinked: anonymousSessionLinked || undefined,
            // Bind the flag to the anonymous session it was derived from (SEC-1 layer 3)
            anonymousSessionRef
        };
        // Generate authorization URL with PAR handling
        const [error, authorizationUrl] = await this.authorizationUrl(authorizationParams);
        if (error) {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"]("An error occurred while trying to initiate the login request.", {
                status: 500
            });
        }
        // Set response and save transaction
        const res = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(authorizationUrl.toString());
        await this.transactionStore.save(res.cookies, transactionState, req?.cookies ?? reqCookies);
        return res;
    }
    async handleLogin(req) {
        const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
        // Extract challengeMode from URL query params.
        // URL param takes precedence over programmatic StartInteractiveLoginOptions.challengeMode.
        // Must be deleted before forwarding remaining params to Auth0 /authorize.
        const queryChallengeMode = searchParams.challengeMode;
        delete searchParams.challengeMode;
        // Validate challengeMode value
        if (queryChallengeMode && queryChallengeMode !== "popup" && queryChallengeMode !== "redirect") {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"](`Invalid challengeMode query param: ${queryChallengeMode}. Expected 'redirect', 'popup', or omit.`, {
                status: 400
            });
        }
        // Popup mode is not supported in Enterprise Connect mode: the callback
        // returns the app's own session cookie via onCallback, not postMessage HTML,
        // so the popup never closes and the parent window never receives the result.
        if (this.enterpriseConnect && queryChallengeMode === "popup") {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"]("challengeMode=popup is not supported in Enterprise Connect mode.", {
                status: 400
            });
        }
        // Validate max_age query param value
        if (searchParams.max_age !== undefined && (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$authorization$2d$params$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["parseNonNegativeIntegerParam"])("max_age", searchParams.max_age) === null) {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"](`Invalid max_age query param: "${searchParams.max_age}". Must be a non-negative integer.`, {
                status: 400
            });
        }
        // do not pass returnTo as part of authorizationParameters
        // returnTo should only be used in txn state
        const { returnTo, ...authorizationParameters } = searchParams;
        const options = {
            authorizationParameters,
            returnTo: returnTo,
            challengeMode: queryChallengeMode
        };
        return this.startInteractiveLogin(options, req);
    }
    async handleLogout(req) {
        const { error: sessionError, session, exists: sessionExists } = await this.getSessionWithDomainCheck(req.cookies);
        // Propagate domain mismatch error but don't delete session on domain mismatch
        const hasDomainMismatch = sessionError && sessionExists;
        const [discoveryError, authorizationServerMetadata] = await this.discoverAuthorizationServerMetadata();
        if (discoveryError) {
            // Clean up session on discovery error (unless domain mismatch)
            const errorResponse = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"]("An error occurred while trying to initiate the logout request.", {
                status: 500
            });
            if (!hasDomainMismatch) {
                await this.sessionStore.delete(req.cookies, errorResponse.cookies);
            }
            await this.transactionStore.deleteAll(req.cookies, errorResponse.cookies);
            return errorResponse;
        }
        const appBaseUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$app$2d$base$2d$url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["resolveAppBaseUrl"])(this.appBaseUrl, req);
        const returnTo = req.nextUrl.searchParams.get("returnTo") || appBaseUrl;
        const logoutState = req.nextUrl.searchParams.get("state");
        const federatedParam = req.nextUrl.searchParams.get("federated");
        const federated = federatedParam === "false" ? false : req.nextUrl.searchParams.has("federated") || !!this.enterpriseConnect;
        const createV2LogoutResponse = ()=>{
            const url = new URL("/v2/logout", this.issuer);
            url.searchParams.set("returnTo", returnTo);
            url.searchParams.set("client_id", this.clientMetadata.client_id);
            if (federated) {
                url.searchParams.set("federated", "");
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(url);
        };
        const createOIDCLogoutResponse = ()=>{
            const url = new URL(authorizationServerMetadata.end_session_endpoint);
            url.searchParams.set("client_id", this.clientMetadata.client_id);
            url.searchParams.set("post_logout_redirect_uri", returnTo);
            if (logoutState) {
                url.searchParams.set("state", logoutState);
            }
            if (session?.internal.sid) {
                url.searchParams.set("logout_hint", session.internal.sid);
            }
            // Only include id_token_hint if we have a valid session (domain match)
            if (this.includeIdTokenHintInOIDCLogoutUrl && session?.tokenSet.idToken) {
                url.searchParams.set("id_token_hint", session.tokenSet.idToken);
            }
            if (federated) {
                url.searchParams.set("federated", "");
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(url);
        };
        // Determine logout strategy and create appropriate response
        let logoutResponse;
        if (this.logoutStrategy === "v2") {
            // Always use v2 logout endpoint
            logoutResponse = createV2LogoutResponse();
        } else if (this.logoutStrategy === "oidc") {
            // Always use OIDC RP-Initiated Logout
            if (!authorizationServerMetadata.end_session_endpoint) {
                // Clean up session on OIDC error (unless domain mismatch)
                const errorResponse = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"]("OIDC RP-Initiated Logout is not supported by the authorization server. Enable it or use a different logout strategy.", {
                    status: 500
                });
                if (!hasDomainMismatch) {
                    await this.sessionStore.delete(req.cookies, errorResponse.cookies);
                }
                await this.transactionStore.deleteAll(req.cookies, errorResponse.cookies);
                return errorResponse;
            }
            logoutResponse = createOIDCLogoutResponse();
        } else {
            // Auto strategy (default): Try OIDC first, fallback to v2 if not available
            if (!authorizationServerMetadata.end_session_endpoint) {
                console.warn("The Auth0 client does not have RP-initiated logout enabled, the user will be redirected to the `/v2/logout` endpoint instead. Learn how to enable it here: https://auth0.com/docs/authenticate/login/logout/log-users-out-of-auth0#enable-endpoint-discovery");
                logoutResponse = createV2LogoutResponse();
            } else {
                logoutResponse = createOIDCLogoutResponse();
            }
        }
        // Revoke the refresh token before clearing the session so it cannot be
        // replayed after logout (e.g. from a stolen session cookie). Errors are
        // swallowed — a failed revocation must never block the logout redirect.
        if (session?.tokenSet.refreshToken && !hasDomainMismatch) {
            try {
                await this.performTokenRevocation(authorizationServerMetadata, session.tokenSet.refreshToken, "refresh_token");
            } catch (e) {
                console.warn("[nextjs-auth0] Failed to revoke refresh token during logout (logout will still proceed):", e);
            }
        }
        // Clean up session and transaction cookies (only if session matched domain)
        if (!hasDomainMismatch) {
            await this.sessionStore.delete(req.cookies, logoutResponse.cookies);
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["addCacheControlHeadersForSession"])(logoutResponse);
        // Clear any orphaned transaction cookies
        await this.transactionStore.deleteAll(req.cookies, logoutResponse.cookies);
        return logoutResponse;
    }
    /**
     * Handle OAuth2/OIDC callback.
     * @internal This method is not part of the public SDK API. It is called internally
     * during callback delegation in resolver mode to route callbacks to the correct domain.
     * @public (explicit visibility marker for cross-instance delegation)
     */ async handleCallback(req) {
        await this.ensureDpopValidated();
        const state = req.nextUrl.searchParams.get("state");
        if (!state) {
            return this.handleCallbackError(new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MissingStateError"](), {}, req);
        }
        const transactionStateCookie = await this.transactionStore.get(req.cookies, state);
        if (!transactionStateCookie) {
            return this.onCallback(new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["InvalidStateError"](), {}, null);
        }
        const transactionState = transactionStateCookie.payload;
        const appBaseUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$app$2d$base$2d$url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["resolveAppBaseUrl"])(this.appBaseUrl, req);
        const onCallbackCtx = {
            responseType: transactionState.responseType,
            returnTo: transactionState.returnTo,
            challengeMode: transactionState.challengeMode || "redirect",
            appBaseUrl,
            anonymousSessionLinked: await this.verifyAnonymousSessionLink(transactionState, req)
        };
        // Callback domain delegation in resolver mode
        if (state && this.provider?.isResolverMode && (transactionState.originIssuer || transactionState.originDomain)) {
            // Prefer originIssuer (available since MCD v4.17.x) as it preserves path-based
            // issuers (e.g. https://myorg.okta.com/oauth2/default). Fall back to
            // originDomain for pre-MCD transaction cookies that only stored the hostname.
            const originKey = transactionState.originIssuer ?? transactionState.originDomain;
            const normalizedOrigin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$normalize$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["normalizeDomain"])(originKey);
            // Delegation is needed when the origin issuer differs from the current client's
            // issuer (covers both hostname differences and same-host path differences).
            if (normalizedOrigin.issuer !== this.issuer) {
                // Pass the full issuer URL so forDomainSync can look up the correct
                // path-based cache entry (e.g. /oauth2/default vs /oauth2/custom).
                const delegatedClient = this.provider.forDomainSync(originKey);
                return delegatedClient.handleCallback(req);
            }
        }
        if (transactionState.responseType === __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$types$2f$connected$2d$accounts$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["RESPONSE_TYPES"].CONNECT_CODE) {
            const { error: sessionError, session } = await this.getSessionWithDomainCheck(req.cookies);
            if (sessionError || !session) {
                return this.handleCallbackError(sessionError || new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$my$2d$account$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ConnectAccountError"]({
                    code: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$my$2d$account$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ConnectAccountErrorCodes"].MISSING_SESSION,
                    message: "The user does not have an active session."
                }), onCallbackCtx, req, state, transactionState);
            }
            // get an access token for connected accounts
            const [tokenSetError, tokenSetResponse] = await this.getTokenSet(session, {
                audience: `${this.issuer}me/`,
                scope: "create:me:connected_accounts"
            });
            if (tokenSetError) {
                return this.handleCallbackError(tokenSetError, onCallbackCtx, req, state, transactionState);
            }
            const [completeConnectAccountError, connectedAccount] = await this.completeConnectAccount({
                tokenSet: tokenSetResponse.tokenSet,
                authSession: transactionState.authSession,
                connectCode: req.nextUrl.searchParams.get("connect_code"),
                redirectUri: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["createRouteUrl"])(this.routes.callback, appBaseUrl).toString(),
                codeVerifier: transactionState.codeVerifier
            });
            if (completeConnectAccountError) {
                return this.handleCallbackError(completeConnectAccountError, onCallbackCtx, req, state, transactionState);
            }
            const res = await this.onCallback(null, {
                ...onCallbackCtx,
                connectedAccount
            }, session);
            await this.transactionStore.delete(res.cookies, state);
            return res;
        }
        const [discoveryError, authorizationServerMetadata] = await this.discoverAuthorizationServerMetadata();
        if (discoveryError) {
            return this.handleCallbackError(discoveryError, onCallbackCtx, req, state, transactionState);
        }
        let codeGrantParams;
        try {
            codeGrantParams = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateAuthResponse"](authorizationServerMetadata, this.clientMetadata, req.nextUrl.searchParams, transactionState.state);
        } catch (e) {
            const oauthErr = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$oauth$2d$error$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["extractOAuthErrorDetails"])(e);
            return this.handleCallbackError(new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AuthorizationError"]({
                cause: new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["OAuth2Error"]({
                    code: oauthErr.error ?? "unknown_error",
                    message: oauthErr.error_description
                })
            }), onCallbackCtx, req, state, transactionState);
        }
        let codeGrantResponse;
        let redirectUri;
        let authorizationCodeGrantRequestCall;
        try {
            redirectUri = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["createRouteUrl"])(this.routes.callback, appBaseUrl); // must be registered with the authorization server
            // Create DPoP handle ONCE outside the closure so it persists across retries.
            // This is required by RFC 9449: the handle must learn and reuse the nonce from
            // the DPoP-Nonce header across multiple attempts.
            const dpopHandle = this.useDPoP && this.dpopKeyPair ? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DPoP"](this.clientMetadata, this.dpopKeyPair) : undefined;
            authorizationCodeGrantRequestCall = async ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["authorizationCodeGrantRequest"](authorizationServerMetadata, this.clientMetadata, await this.getClientAuth(), codeGrantParams, redirectUri.toString(), transactionState.codeVerifier ?? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["nopkce"], {
                    ...this.httpOptions(),
                    [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["customFetch"]]: this.fetch,
                    [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["allowInsecureRequests"]]: this.allowInsecureRequests,
                    ...dpopHandle && {
                        DPoP: dpopHandle
                    }
                });
            // NOTE: Unlike refresh token and connection token flows, the auth code flow
            // wraps only the HTTP request (not response processing) in withDPoPNonceRetry().
            // This is intentional: withDPoPNonceRetry() expects a Response object to inspect
            // for nonce retries. If response processing is included in the wrapper, it returns
            // a processed object and retry logic breaks. Response processing happens after
            // (see line 807) to maintain compatibility with the retry mechanism.
            codeGrantResponse = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$dpopRetry$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["withDPoPNonceRetry"])(authorizationCodeGrantRequestCall, {
                isDPoPEnabled: !!dpopHandle,
                ...this.dpopOptions?.retry
            });
        } catch (e) {
            return this.handleCallbackError(new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AuthorizationCodeGrantRequestError"](e.message), onCallbackCtx, req, state, transactionState);
        }
        // Determine return strategy BEFORE processing token response
        const challengeMode = transactionState.challengeMode || "redirect";
        let oidcRes;
        try {
            // Process the authorization code response
            // For authorization code flows, oauth4webapi handles DPoP nonce management internally
            // No need for manual retry since authorization codes are single-use
            //
            // Popup flows (postMessage): requireIdToken: false because API-only audiences
            // may not return an ID token. If requireIdToken: true is used,
            // processAuthorizationCodeResponse would throw AuthorizationCodeGrantError.
            oidcRes = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["processAuthorizationCodeResponse"](authorizationServerMetadata, this.clientMetadata, codeGrantResponse, {
                expectedNonce: transactionState.nonce,
                maxAge: transactionState.maxAge,
                requireIdToken: challengeMode !== "popup"
            });
        } catch (e) {
            const oauthErr = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$oauth$2d$error$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["extractOAuthErrorDetails"])(e);
            return this.handleCallbackError(new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AuthorizationCodeGrantError"]({
                cause: new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["OAuth2Error"]({
                    code: oauthErr.error ?? "unknown_error",
                    message: oauthErr.error_description
                })
            }), onCallbackCtx, req, state, transactionState);
        }
        // For standard flows, idTokenClaims is always present (requireIdToken: true)
        // For popup flows, idTokenClaims may be undefined (requireIdToken: false)
        const idTokenClaims = oidcRes.id_token ? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["getValidatedIdTokenClaims"](oidcRes) : undefined;
        // Secondary issuer check for defense-in-depth (MCD)
        if (transactionState.originIssuer && idTokenClaims) {
            const actualIssuer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$normalize$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["normalizeIssuer"])(idTokenClaims.iss);
            const expectedIssuer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$normalize$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["normalizeIssuer"])(transactionState.originIssuer);
            if (actualIssuer !== expectedIssuer) {
                return this.handleCallbackError(new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mcd$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["IssuerValidationError"](expectedIssuer, actualIssuer), onCallbackCtx, req, state);
            }
        }
        if (this.useMtls) {
            this.warnIfNotCertificateBound(oidcRes.access_token);
        }
        // ★ POSTMESSAGE BRANCH
        if (challengeMode === "popup") {
            // Merge new token into existing session (do NOT create fresh session)
            // Use getSessionWithDomainCheck to enforce MCD domain isolation
            const { error: sessionError, session: existingSession } = await this.getSessionWithDomainCheck(req.cookies);
            // If domain check failed in MCD mode, return error via postMessage
            if (sessionError) {
                const popupResponse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$html$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["createAuthCompletePostMessageResponse"])({
                    success: false,
                    error: {
                        code: sessionError.code || "session_domain_mismatch",
                        message: sessionError.message
                    },
                    nonce: this.cspNonce
                });
                await this.transactionStore.delete(popupResponse.cookies, state);
                return popupResponse;
            }
            if (existingSession) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$session$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["mergePopupTokenIntoSession"])(existingSession, oidcRes, transactionState, idTokenClaims);
                const mergedSession = await this.finalizeSession(existingSession, oidcRes.id_token);
                // Call onCallback after finalization with the actual saved session
                await this.onCallback(null, onCallbackCtx, mergedSession);
                const popupResponse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$html$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["createAuthCompletePostMessageResponse"])({
                    success: true,
                    user: {
                        sub: mergedSession.user.sub,
                        email: mergedSession.user.email
                    },
                    nonce: this.cspNonce
                });
                await this.sessionStore.set(req.cookies, popupResponse.cookies, mergedSession, true);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["addCacheControlHeadersForSession"])(popupResponse);
                __classPrivateFieldGet(this, _AuthClient_instances, "m", _AuthClient_clearAnonymousSessionCookieOnLogin).call(this, req.cookies, popupResponse.cookies);
                await this.transactionStore.delete(popupResponse.cookies, state);
                return popupResponse;
            } else {
                // No existing session (edge case: session expired during popup flow)
                if (!idTokenClaims) {
                    const popupResponse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$html$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["createAuthCompletePostMessageResponse"])({
                        success: false,
                        error: {
                            code: "session_expired",
                            message: "Session expired during popup flow and no ID token available to create new session"
                        },
                        nonce: this.cspNonce
                    });
                    await this.transactionStore.delete(popupResponse.cookies, state);
                    return popupResponse;
                }
                const fallbackSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$session$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["buildSessionFromCallback"])(idTokenClaims, oidcRes, transactionState);
                // IPSIE: reject a session whose ceiling is already in the past at login.
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$session$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isSessionCeilingInPast"])(fallbackSession.internal.sessionExpiresAt, idTokenClaims?.iat)) {
                    const expiredError = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AccessTokenError"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AccessTokenErrorCode"].SESSION_EXPIRED, "The session has expired and the user must re-authenticate.");
                    await this.onCallback(expiredError, onCallbackCtx, null);
                    const popupResponse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$html$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["createAuthCompletePostMessageResponse"])({
                        success: false,
                        error: {
                            code: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AccessTokenErrorCode"].SESSION_EXPIRED,
                            message: expiredError.message
                        },
                        nonce: this.cspNonce
                    });
                    await this.transactionStore.delete(popupResponse.cookies, state);
                    return popupResponse;
                }
                const mergedSession = await this.finalizeSession(fallbackSession, oidcRes.id_token);
                // Call onCallback after finalization with the actual saved session
                await this.onCallback(null, onCallbackCtx, mergedSession);
                const popupResponse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$html$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["createAuthCompletePostMessageResponse"])({
                    success: true,
                    user: {
                        sub: mergedSession.user.sub,
                        email: mergedSession.user.email
                    },
                    nonce: this.cspNonce
                });
                await this.sessionStore.set(req.cookies, popupResponse.cookies, mergedSession, true);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["addCacheControlHeadersForSession"])(popupResponse);
                __classPrivateFieldGet(this, _AuthClient_instances, "m", _AuthClient_clearAnonymousSessionCookieOnLogin).call(this, req.cookies, popupResponse.cookies);
                await this.transactionStore.delete(popupResponse.cookies, state);
                return popupResponse;
            }
        }
        // ★ STANDARD REDIRECT BRANCH (default, unchanged)
        let session = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$session$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["buildSessionFromCallback"])(idTokenClaims, oidcRes, transactionState);
        // IPSIE: reject a session whose ceiling is already in the past at login.
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$session$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isSessionCeilingInPast"])(session.internal.sessionExpiresAt, idTokenClaims?.iat)) {
            return this.handleCallbackError(new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AccessTokenError"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AccessTokenErrorCode"].SESSION_EXPIRED, "The session has expired and the user must re-authenticate."), onCallbackCtx, req, state, transactionState);
        }
        // Add MCD metadata when in resolver mode
        if (this.provider?.isResolverMode) {
            session.internal = {
                ...session.internal,
                mcd: {
                    domain: this.domain,
                    issuer: this.issuer
                }
            };
        }
        const res = await this.onCallback(null, onCallbackCtx, session);
        // Enterprise Connect: Auth0 acts as an SSO relay only. No Auth0 session
        // cookie is written and beforeSessionSaved is not run. The hook's response is
        // the only way a cookie reaches the browser on the callback, so the app is
        // expected to attach its own session cookie to it.
        if (this.enterpriseConnect) {
            if (!res) {
                console.warn("[nextjs-auth0] onCallback returned a falsy value in Enterprise Connect mode. " + "Ensure your hook returns a NextResponse on all code paths — the response is the " + "only way a session cookie reaches the browser in this mode.");
            } else {
                await this.transactionStore.delete(res.cookies, state);
            }
            return res;
        }
        // call beforeSessionSaved callback if present
        // if not then filter id_token claims with default rules
        session = await this.finalizeSession(session, oidcRes.id_token);
        // Post-hook MCD validation - ensure hooks don't remove internal.mcd in resolver mode
        if (this.provider?.isResolverMode) {
            if (!session.internal?.mcd) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["InvalidConfigurationError"]("beforeSessionSaved hook must not remove the internal.mcd field in resolver mode. " + "The internal.mcd object is required for multi-custom-domain session isolation. " + "If you need to modify session.internal, preserve the .mcd field.");
            }
        }
        await this.sessionStore.set(req.cookies, res.cookies, session, true);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["addCacheControlHeadersForSession"])(res);
        // Clear the local anonymous cookie after a successful authentication.
        // Placed here (after session is established) so that abandoned logins leave
        // the anon cookie intact. Local cookie only: the tenant-domain auth0_anon
        // cookie cannot be cleared server-to-server.
        __classPrivateFieldGet(this, _AuthClient_instances, "m", _AuthClient_clearAnonymousSessionCookieOnLogin).call(this, req.cookies, res.cookies);
        // Clean up the current transaction cookie after successful authentication
        await this.transactionStore.delete(res.cookies, state);
        return res;
    }
    async handleProfile(req) {
        const { error: sessionError, session } = await this.getSessionWithDomainCheck(req.cookies);
        if (sessionError || !session) {
            if (this.noContentProfileResponseWhenUnauthenticated) {
                return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"](null, {
                    status: 204
                });
            }
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"](null, {
                status: 401
            });
        }
        const res = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json(session?.user);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["addCacheControlHeadersForSession"])(res);
        return res;
    }
    /**
     * Route: POST /auth/federated-domain
     * Server-side Home Realm Discovery for Enterprise Connect. Reads `{ email }`
     * from the request body and returns `{ isFederated }`. Backs the client-side
     * `startEnterpriseLogin` helper so the browser never calls WebFinger directly
     * (which would expose the tenant's customer domains to enumeration).
     */ async handleFederatedDomain(req) {
        let email;
        try {
            ({ email } = await req.json());
        } catch  {
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "invalid request body"
            }, {
                status: 400
            });
        }
        if (typeof email !== "string" || /\s/.test(email) || email.indexOf("@") <= 0 || email.indexOf("@") !== email.lastIndexOf("@") || email.endsWith("@")) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "invalid email"
            }, {
                status: 400
            });
        }
        const emailDomain = email.slice(email.lastIndexOf("@") + 1).toLowerCase();
        const isFederated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$webfingerCache$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isFederatedDomain"])(this.domain, emailDomain, {
            customFetch: this.createWebFingerFetch()
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
            isFederated
        });
    }
    /**
     * Route: GET /auth/mfa/authenticators
     * Lists enrolled MFA authenticators.
     *
     * Headers:
     *   Authorization: Bearer <encrypted-mfa-token>
     *
     * Response: 200 + snake_case AuthenticatorApiResponse[]
     * Error: 400/401 + {error, error_description}
     *
     */ async handleGetAuthenticators(req) {
        try {
            const mfaToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$validation$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["extractMfaToken"])(req);
            const authenticators = await this.mfaGetAuthenticators(mfaToken);
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json(authenticators);
        } catch (e) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["handleMfaError"])(e);
        }
    }
    /**
     * Route: POST /auth/mfa/challenge
     * Initiates an MFA challenge.
     *
     * Body: {mfa_token, challenge_type, authenticator_id?}
     *
     * Response: 200 + snake_case ChallengeApiResponse
     * Error: 400 + {error, error_description}
     *
     * mfa_token in body (NOT Authorization header, matching Auth0 API contract).
     */ async handleChallenge(req) {
        try {
            const body = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$validation$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["parseJsonBody"])(req);
            const bodyRecord = body;
            const mfaToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$validation$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateStringFieldAndThrow"])(bodyRecord.mfa_token, "mfa_token");
            const challengeType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$validation$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateStringFieldAndThrow"])(bodyRecord.challenge_type, "challenge_type");
            const authenticatorId = bodyRecord.authenticator_id ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$validation$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateStringFieldAndThrow"])(bodyRecord.authenticator_id, "authenticator_id") : undefined;
            const result = await this.mfaChallenge(mfaToken, challengeType, authenticatorId);
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json(result);
        } catch (e) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["handleMfaError"])(e);
        }
    }
    /**
     * Route: POST /auth/mfa/associate
     * Enrolls a new MFA authenticator.
     *
     * Headers:
     *   Authorization: Bearer <encrypted-mfa-token>
     *
     * Body: {authenticator_types, oob_channels?, phone_number?, email?}
     *
     * Response: 200 + snake_case EnrollmentApiResponse
     * Error: 400 + {error, error_description}
     *
     * snake_case body fields ONLY. No camelCase fallback.
     */ async handleAssociate(req) {
        try {
            const mfaToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$validation$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["extractMfaToken"])(req);
            const body = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$validation$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["parseJsonBody"])(req);
            const bodyRecord = body;
            const authenticatorTypes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$validation$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateArrayFieldAndThrow"])(bodyRecord.authenticator_types, "authenticator_types");
            const authenticatorType = authenticatorTypes[0];
            const [enrollOptions, errorResponse] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$server$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["buildEnrollOptions"])(body, authenticatorType);
            if (errorResponse) return errorResponse;
            const result = await this.mfaAssociate(mfaToken, enrollOptions);
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json(result);
        } catch (e) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["handleMfaError"])(e);
        }
    }
    /**
     * Route: POST /auth/mfa/verify
     * Verifies MFA code and returns tokens.
     *
     * Headers:
     *   Authorization: Bearer <encrypted-mfa-token>
     *
     * Body: {otp | oob_code+binding_code | recovery_code}
     *
     * Response: 200 + TokenResponse + Set-Cookie
     * Error: 400 + {error, error_description, mfa_token?}
  
     * snake_case credential fields ONLY (oob_code, binding_code, recovery_code).
     */ async handleVerify(req) {
        try {
            const mfaToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$validation$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["extractMfaToken"])(req);
            const body = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$validation$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["parseJsonBody"])(req);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$validation$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateVerificationCredentialAndThrow"])(body);
            const credentialOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$transform$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["transformVerifyBodyToOptions"])(body);
            const verifyOptions = {
                mfaToken,
                ...credentialOptions
            };
            // Verify MFA and get tokens
            const result = await this.mfaVerify(verifyOptions);
            const { error: sessionError, session } = await this.getSessionWithDomainCheck(req.cookies);
            const successBody = {
                success: true,
                ...result.recovery_code !== undefined && {
                    recovery_code: result.recovery_code
                }
            };
            if (!sessionError && session) {
                // Step-up MFA: session exists — cache new token and return success.
                // Tokens are stored in the session cookie; the body must not expose them.
                const res = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json(successBody);
                await this.cacheTokenFromMfaVerify(result, mfaToken, req.cookies, res.cookies);
                return res;
            } else if (result.id_token) {
                // First-factor MFA (e.g. passkey + MFA): no session yet — create one from
                // the token response. Return { success: true } only; tokens stay in the
                // session cookie and must not be exposed in the response body.
                const res = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json(successBody);
                await this.createSessionFromPasswordlessVerify(result, req.cookies, res.cookies);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["addCacheControlHeadersForSession"])(res);
                return res;
            }
            // mfaVerify succeeded but no id_token and no existing session —
            // malformed Auth0 response; returning success here would leave the user
            // authenticated in their mind but with no session cookie.
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MfaVerifyError"]("missing_session", "MFA verification succeeded but no session could be established. Ensure 'openid' scope is requested.");
        } catch (e) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["handleMfaError"])(e);
        }
    }
    /**
     * Route: POST /auth/passwordless/start
     * Initiates a passwordless authentication flow.
     *
     * Body: { connection: "email", email, send: "code" | "link" }
     *       { connection: "sms", phoneNumber }
     *
     * Response: 204 No Content
     * Error: 400 + { error, error_description }
     */ async handlePasswordlessStart(req) {
        try {
            const body = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$validation$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["parseJsonBody"])(req);
            const bodyRecord = body;
            const connection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$validation$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateStringFieldAndThrow"])(bodyRecord.connection, "connection");
            const res = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"](null, {
                status: 204
            });
            const language = typeof bodyRecord.language === "string" && bodyRecord.language ? bodyRecord.language : undefined;
            if (connection === "email") {
                const email = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$validation$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateStringFieldAndThrow"])(bodyRecord.email, "email");
                const send = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$validation$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateStringFieldAndThrow"])(bodyRecord.send, "send");
                await this.passwordlessStart({
                    connection: "email",
                    email,
                    send,
                    language
                }, res.cookies, req);
            } else if (connection === "sms") {
                const phoneNumber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$validation$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateStringFieldAndThrow"])(bodyRecord.phoneNumber, "phoneNumber");
                await this.passwordlessStart({
                    connection: "sms",
                    phoneNumber,
                    language
                });
            } else {
                return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "invalid_connection",
                    error_description: "connection must be 'email' or 'sms'"
                }, {
                    status: 400
                });
            }
            return res;
        } catch (e) {
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasswordlessStartError"]) {
                if (e.error === "unexpected_error") {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: "server_error",
                        error_description: "Internal server error"
                    }, {
                        status: 500
                    });
                }
                return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json(e.toJSON(), {
                    status: 400
                });
            }
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"]) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: e.code,
                    error_description: e.message
                }, {
                    status: 400
                });
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "server_error",
                error_description: "Internal server error"
            }, {
                status: 500
            });
        }
    }
    /**
     * Route: POST /auth/passwordless/verify
     * Verifies a passwordless OTP and establishes a session.
     *
     * Body: { connection: "email", email, verificationCode }
     *       { connection: "sms", phoneNumber, verificationCode }
     *
     * Response: 200 { success: true } + Set-Cookie
     * Error: 400/403 + { error, error_description }
     */ async handlePasswordlessVerify(req) {
        try {
            const body = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$validation$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["parseJsonBody"])(req);
            const bodyRecord = body;
            const connection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$validation$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateStringFieldAndThrow"])(bodyRecord.connection, "connection");
            const verificationCode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$validation$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateStringFieldAndThrow"])(bodyRecord.verificationCode, "verificationCode");
            let options;
            if (connection === "email") {
                const email = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$validation$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateStringFieldAndThrow"])(bodyRecord.email, "email");
                options = {
                    connection: "email",
                    email,
                    verificationCode
                };
            } else if (connection === "sms") {
                const phoneNumber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$validation$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateStringFieldAndThrow"])(bodyRecord.phoneNumber, "phoneNumber");
                options = {
                    connection: "sms",
                    phoneNumber,
                    verificationCode
                };
            } else {
                return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "invalid_connection",
                    error_description: "connection must be 'email' or 'sms'"
                }, {
                    status: 400
                });
            }
            const tokenResponse = await this.passwordlessVerify(options);
            const res = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true
            });
            await this.createSessionFromPasswordlessVerify(tokenResponse, req.cookies, res.cookies);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["addCacheControlHeadersForSession"])(res);
            return res;
        } catch (e) {
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MfaRequiredError"]) {
                return __classPrivateFieldGet(this, _AuthClient_instances, "m", _AuthClient_createMfaRequiredResponse).call(this, req, null, e);
            }
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasswordlessVerifyError"]) {
                const serverErrorCodes = new Set([
                    "discovery_error",
                    "unexpected_error"
                ]);
                if (serverErrorCodes.has(e.error)) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: "server_error",
                        error_description: "Internal server error"
                    }, {
                        status: 500
                    });
                }
                return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json(e.toJSON(), {
                    status: 403
                });
            }
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"]) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: e.code,
                    error_description: e.message
                }, {
                    status: 400
                });
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "server_error",
                error_description: "Internal server error"
            }, {
                status: 500
            });
        }
    }
    /**
     * Route: POST /auth/passwordless/otp/challenge
     * Requests an OTP challenge against a database connection via /otp/challenge.
     *
     * Body: { email, connection, allowSignup? }
     *       { phoneNumber, connection, deliveryMethod?, allowSignup? }
     *
     * Response: 200 { authSession: "<opaque>" }
     * Error: 400 + { error, error_description }
     */ async handlePasswordlessDbOtpChallenge(req) {
        try {
            const body = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$validation$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["parseJsonBody"])(req);
            const bodyRecord = body;
            const connection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$validation$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateStringFieldAndThrow"])(bodyRecord.connection, "connection");
            const allowSignup = typeof bodyRecord.allowSignup === "boolean" ? bodyRecord.allowSignup : false;
            let challenge;
            if (typeof bodyRecord.email === "string" && bodyRecord.email) {
                challenge = await this.passwordlessDbOtpChallenge({
                    email: bodyRecord.email,
                    connection,
                    allowSignup
                });
            } else if (typeof bodyRecord.phoneNumber === "string" && bodyRecord.phoneNumber) {
                const deliveryMethod = bodyRecord.deliveryMethod === "voice" || bodyRecord.deliveryMethod === "text" ? bodyRecord.deliveryMethod : undefined;
                challenge = await this.passwordlessDbOtpChallenge({
                    phoneNumber: bodyRecord.phoneNumber,
                    connection,
                    allowSignup,
                    ...deliveryMethod && {
                        deliveryMethod
                    }
                });
            } else {
                return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "missing_identifier",
                    error_description: "Either email or phoneNumber is required"
                }, {
                    status: 400
                });
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                authSession: challenge.authSession
            });
        } catch (e) {
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$db$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasswordlessDbChallengeError"]) {
                if (e.error === "unexpected_error") {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: "server_error",
                        error_description: "Internal server error"
                    }, {
                        status: 500
                    });
                }
                return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json(e.toJSON(), {
                    status: 400
                });
            }
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"]) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: e.code,
                    error_description: e.message
                }, {
                    status: 400
                });
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "server_error",
                error_description: "Internal server error"
            }, {
                status: 500
            });
        }
    }
    /**
     * Route: POST /auth/passwordless/otp/token
     * Exchanges an auth_session + OTP for tokens and establishes a session.
     *
     * Body: { authSession, otp }
     *
     * Response: 200 { success: true } + Set-Cookie
     * Error: 400/403/500 + { error, error_description }
     */ async handlePasswordlessDbGetToken(req) {
        try {
            const body = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$validation$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["parseJsonBody"])(req);
            const bodyRecord = body;
            const authSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$validation$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateStringFieldAndThrow"])(bodyRecord.authSession, "authSession");
            const otp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$validation$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateStringFieldAndThrow"])(bodyRecord.otp, "otp");
            const tokenResponse = await this.passwordlessDbGetToken({
                authSession,
                otp
            });
            const res = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true
            });
            await this.createSessionFromPasswordlessVerify(tokenResponse, req.cookies, res.cookies);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["addCacheControlHeadersForSession"])(res);
            return res;
        } catch (e) {
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MfaRequiredError"]) {
                return __classPrivateFieldGet(this, _AuthClient_instances, "m", _AuthClient_createMfaRequiredResponse).call(this, req, null, e);
            }
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$db$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasswordlessDbGetTokenError"]) {
                const serverErrorCodes = new Set([
                    "discovery_error",
                    "unexpected_error"
                ]);
                if (serverErrorCodes.has(e.error)) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: "server_error",
                        error_description: "Internal server error"
                    }, {
                        status: 500
                    });
                }
                return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json(e.toJSON(), {
                    status: 400
                });
            }
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"]) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: e.code,
                    error_description: e.message
                }, {
                    status: 400
                });
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "server_error",
                error_description: "Internal server error"
            }, {
                status: 500
            });
        }
    }
    async handleAccessToken(req) {
        const { error: sessionError, session } = await this.getSessionWithDomainCheck(req.cookies);
        const audience = req.nextUrl.searchParams.get("audience");
        const scope = req.nextUrl.searchParams.get("scope");
        const mergeScopesParam = req.nextUrl.searchParams.get("mergeScopes");
        if (sessionError || !session) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: {
                    message: sessionError ? sessionError.message : "The user does not have an active session.",
                    code: sessionError?.code ?? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AccessTokenErrorCode"].MISSING_SESSION
                }
            }, {
                status: 401
            });
        }
        const [error, getTokenSetResponse] = await this.getTokenSet(session, {
            scope,
            audience,
            // Only set mergeScopes when explicitly passed as "false"
            // Absence of param = default behavior (true)
            mergeScopes: mergeScopesParam === "false" ? false : undefined
        });
        if (error) {
            // Handle MFA required - return 403 with encrypted mfa_token
            if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MfaRequiredError"]) {
                return __classPrivateFieldGet(this, _AuthClient_instances, "m", _AuthClient_createMfaRequiredResponse).call(this, req, session, error);
            }
            const errorRes = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: {
                    message: error.message,
                    code: error.code
                }
            }, {
                status: 401
            });
            // IPSIE: when the ceiling fired, clean up the stored session so the next
            // request starts clean. For stateless sessions this is a no-op; for
            // stateful stores it removes the backing record.
            if (error.code === __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AccessTokenErrorCode"].SESSION_EXPIRED) {
                await this.sessionStore.delete(req.cookies, errorRes.cookies);
            }
            return errorRes;
        }
        const { tokenSet: updatedTokenSet } = getTokenSetResponse;
        const now = Math.floor(Date.now() / 1000);
        const expiresAt = typeof updatedTokenSet.expiresAt === "number" ? updatedTokenSet.expiresAt : 0;
        const expiresIn = Math.max(0, expiresAt - now);
        const res = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
            token: updatedTokenSet.accessToken,
            scope: updatedTokenSet.scope,
            expires_at: expiresAt,
            expires_in: expiresIn,
            ...updatedTokenSet.token_type && {
                token_type: updatedTokenSet.token_type
            }
        });
        await __classPrivateFieldGet(this, _AuthClient_instances, "m", _AuthClient_updateSessionAfterTokenRetrieval).call(this, req, res, session, getTokenSetResponse);
        return res;
    }
    async handleBackChannelLogout(req) {
        if (!this.sessionStore.store) {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"]("A session data store is not configured.", {
                status: 500
            });
        }
        if (!this.sessionStore.store.deleteByLogoutToken) {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"]("Back-channel logout is not supported by the session data store.", {
                status: 500
            });
        }
        const body = new URLSearchParams(await req.text());
        const logoutToken = body.get("logout_token");
        if (!logoutToken) {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"]("Missing `logout_token` in the request body.", {
                status: 400
            });
        }
        // Resolver mode: use request context as trust anchor.
        // Wrapped in try/catch because forRequest() can throw (DomainResolutionError
        // from user-provided resolver) and normalizeDomain can throw on malformed iss.
        if (this.provider?.isResolverMode) {
            try {
                // SECURITY: Extract iss from unverified token for comparison only.
                // The unverified iss does NOT determine which JWKS to use — the resolved
                // domain (from request context) determines the verification source.
                const [extractErr, issuerInfo] = extractIssuerDomainFromToken(logoutToken);
                if (extractErr) {
                    return bcloErrorResponse("Missing 'iss' claim in logout token.", 400);
                }
                // Resolve domain from request context (Host header → domain resolver)
                const resolvedClient = await this.provider.forRequest(req.headers, req.nextUrl);
                // Trust anchor: resolved domain must match token's issuer domain.
                // Both sides are pre-normalized (issuerInfo.domain by extractIssuerDomainFromToken,
                // resolvedClient.domain by AuthClientProvider.resolveDomain) — direct comparison.
                if (issuerInfo.domain !== resolvedClient.domain) {
                    return bcloErrorResponse("Logout token issuer does not match the resolved domain.", 403);
                }
                // Verify token with resolved domain's JWKS
                const [error, logoutTokenClaims] = await resolvedClient.verifyLogoutToken(logoutToken);
                if (error) {
                    return bcloErrorResponse(error.message, 400);
                }
                // Delete session with iss included for issuer-matched filtering
                await this.sessionStore.store.deleteByLogoutToken(logoutTokenClaims);
                return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"](null, {
                    status: 204
                });
            } catch (error) {
                console.error(`Unexpected error in backchannel logout: ${error instanceof Error ? error.message : String(error)}`);
                return bcloErrorResponse("Failed to process logout token.", 400);
            }
        }
        // Static mode: defense-in-depth iss pre-check.
        // Custom domains on same tenant share signing keys, so a token from domain-a
        // would pass JWKS verification using domain-b's keys. This pre-check catches that.
        // If extraction fails (missing iss, non-normalizable issuer like IP/localhost),
        // skip pre-check for backward compatibility and let verifyLogoutToken handle validation.
        //
        // No try/catch here: extractIssuerDomainFromToken returns a tuple (never throws),
        // verifyLogoutToken returns a tuple (never throws), and deleteByLogoutToken is
        // user-provided store code — if it throws, that's the caller's responsibility.
        const [, issuerInfo] = extractIssuerDomainFromToken(logoutToken);
        if (issuerInfo && issuerInfo.domain !== this.domain) {
            return bcloErrorResponse("Logout token issuer does not match the configured domain.", 403);
        }
        // Static mode: verify with configured domain
        const [error, logoutTokenClaims] = await this.verifyLogoutToken(logoutToken);
        if (error) {
            return bcloErrorResponse(error.message, 400);
        }
        await this.sessionStore.store.deleteByLogoutToken(logoutTokenClaims);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"](null, {
            status: 204
        });
    }
    async handleConnectAccount(req) {
        const { error: sessionError, session } = await this.getSessionWithDomainCheck(req.cookies);
        // pass all query params except `connection`, `returnTo`, `scopes` as authorization params
        const connection = req.nextUrl.searchParams.get("connection");
        const returnTo = req.nextUrl.searchParams.get("returnTo") ?? undefined;
        const scopes = req.nextUrl.searchParams.getAll("scopes");
        const authorizationParams = Object.fromEntries([
            ...req.nextUrl.searchParams.entries()
        ].filter(([key])=>key !== "connection" && key !== "returnTo" && key !== "scopes"));
        if (!connection) {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"]("A connection is required.", {
                status: 400
            });
        }
        if (sessionError || !session) {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"](sessionError?.message ?? "The user does not have an active session.", {
                status: 401
            });
        }
        const [getTokenSetError, getTokenSetResponse] = await this.getTokenSet(session, {
            scope: "create:me:connected_accounts",
            audience: `${this.issuer}me/`
        });
        if (getTokenSetError) {
            // Handle MFA required - return 403 with encrypted mfa_token
            if (getTokenSetError instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MfaRequiredError"]) {
                return __classPrivateFieldGet(this, _AuthClient_instances, "m", _AuthClient_createMfaRequiredResponse).call(this, req, session, getTokenSetError);
            }
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"]("Failed to retrieve a connected account access token.", {
                status: 401
            });
        }
        const { tokenSet } = getTokenSetResponse;
        const connectAccountParams = {
            connection,
            authorizationParams,
            returnTo
        };
        if (scopes.length > 0) {
            connectAccountParams.scopes = scopes;
        }
        const [connectAccountError, connectAccountResponse] = await this.connectAccount({
            tokenSet,
            ...connectAccountParams
        }, req);
        if (connectAccountError) {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"](connectAccountError.message, {
                status: connectAccountError.cause?.status ?? 500
            });
        }
        // update the session with the new token set, if necessary
        await __classPrivateFieldGet(this, _AuthClient_instances, "m", _AuthClient_updateSessionAfterTokenRetrieval).call(this, req, connectAccountResponse, session, getTokenSetResponse);
        return connectAccountResponse;
    }
    async handleMyAccount(req) {
        return __classPrivateFieldGet(this, _AuthClient_instances, "m", _AuthClient_handleProxy).call(this, req, {
            proxyPath: "/me",
            targetBaseUrl: `${this.issuer}me/v1`,
            audience: `${this.issuer}me/`,
            scope: req.headers.get("scope")
        });
    }
    async handleMyOrg(req) {
        return __classPrivateFieldGet(this, _AuthClient_instances, "m", _AuthClient_handleProxy).call(this, req, {
            proxyPath: "/my-org",
            targetBaseUrl: `${this.issuer}my-org`,
            audience: `${this.issuer}my-org/`,
            scope: req.headers.get("scope")
        });
    }
    /**
     * Retrieves OAuth token sets, handling token refresh when necessary or if forced.
     *
     * @returns A tuple containing either:
     *   - `[SdkError, null]` if an error occurred (missing refresh token, discovery failure, or refresh failure)
     *   - `[null, {tokenSet, idTokenClaims}]` if a new token was retrieved, containing the new token set ID token claims
     *   - `[null, {tokenSet, }]` if token refresh was not done and existing token was returned
     */ async getTokenSet(sessionData, options = {}) {
        // IPSIE: hard pre-check before any cached-token serve or refresh attempt.
        // Once the upstream IdP-asserted ceiling passes, refresh must not be attempted.
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$session$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isSessionCeilingReached"])(sessionData.internal?.sessionExpiresAt)) {
            return [
                new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AccessTokenError"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AccessTokenErrorCode"].SESSION_EXPIRED, "The session has expired and the user must re-authenticate."),
                null
            ];
        }
        // Scope resolution:
        // When mergeScopes !== false (default): merge global scopes for the audience with options.scope
        // When mergeScopes === false: use ONLY options.scope (no global merge)
        // This is critical for challengeWithPopup() which needs isolated scope to prevent
        // refresh token grants requesting scopes beyond what the step-up flow needs.
        const shouldMerge = options.mergeScopes !== false;
        const scope = shouldMerge ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$token$2d$set$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["mergeScopes"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$scope$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["getScopeForAudience"])(this.authorizationParameters.scope, options.audience ?? this.authorizationParameters.audience), options.scope) : options.scope || "";
        const tokenSet = __classPrivateFieldGet(this, _AuthClient_instances, "m", _AuthClient_getTokenSetFromSession).call(this, sessionData, {
            scope: scope,
            audience: options.audience ?? this.authorizationParameters.audience
        });
        const now = Date.now() / 1000;
        const expiresAt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$token$2d$set$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["normalizeExpiresAt"])(tokenSet.expiresAt);
        const isExpired = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$token$2d$set$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isBeforeOrEqual"])(tokenSet.expiresAt, now);
        const shouldRefresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$token$2d$set$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isBeforeOrEqual"])(tokenSet.expiresAt, now + this.tokenRefreshBuffer);
        // no access token was found that matches the, optional, provided audience and scope
        if (!tokenSet.refreshToken && !tokenSet.accessToken) {
            return [
                new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AccessTokenError"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AccessTokenErrorCode"].MISSING_REFRESH_TOKEN, "No access token found and a refresh token was not provided. The user needs to re-authenticate."),
                null
            ];
        }
        // the access token was found, but it has expired and we do not have a refresh token
        if (!tokenSet.refreshToken && tokenSet.accessToken && isExpired) {
            return [
                new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AccessTokenError"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AccessTokenErrorCode"].MISSING_REFRESH_TOKEN, "The access token has expired and a refresh token was not provided. The user needs to re-authenticate."),
                null
            ];
        }
        if (tokenSet.refreshToken) {
            // either the access token has expired or we are forcing a refresh
            if (options.refresh || expiresAt === undefined || shouldRefresh) {
                const [error, response] = await __classPrivateFieldGet(this, _AuthClient_instances, "m", _AuthClient_refreshTokenSet).call(this, tokenSet, {
                    audience: options.audience,
                    scope: options.scope ? scope : undefined,
                    requestedScope: scope
                });
                if (error) {
                    // MFA context is now embedded in the encrypted token itself
                    // No session mutation needed
                    return [
                        error,
                        null
                    ];
                }
                return [
                    null,
                    {
                        tokenSet: response.updatedTokenSet,
                        idTokenClaims: response.idTokenClaims
                    }
                ];
            }
        }
        return [
            null,
            {
                tokenSet: tokenSet,
                idTokenClaims: undefined
            }
        ];
    }
    async backchannelAuthentication(options) {
        const [discoveryError, authorizationServerMetadata] = await this.discoverAuthorizationServerMetadata();
        if (discoveryError) {
            return [
                discoveryError,
                null
            ];
        }
        if (!authorizationServerMetadata.backchannel_authentication_endpoint) {
            return [
                new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["BackchannelAuthenticationNotSupportedError"](),
                null
            ];
        }
        // If provided on both sides, this does not merge the scope property,
        // instead, the scope from the right side (options) fully overrides the left side.
        const authorizationParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$authorization$2d$params$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["mergeAuthorizationParamsIntoSearchParams"])(this.authorizationParameters, options.authorizationParams, INTERNAL_AUTHORIZE_PARAMS);
        if (!authorizationParams.get("scope")) {
            authorizationParams.set("scope", __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DEFAULT_SCOPES"]);
        }
        authorizationParams.set("client_id", this.clientMetadata.client_id);
        authorizationParams.set("binding_message", options.bindingMessage);
        authorizationParams.set("login_hint", JSON.stringify({
            format: "iss_sub",
            iss: authorizationServerMetadata.issuer,
            sub: options.loginHint.sub
        }));
        if (options.requestedExpiry) {
            authorizationParams.append("requested_expiry", options.requestedExpiry.toString());
        }
        if (options.authorizationDetails) {
            authorizationParams.append("authorization_details", JSON.stringify(options.authorizationDetails));
        }
        const [openIdClientConfigError, openidClientConfig] = await this.getOpenIdClientConfig();
        if (openIdClientConfigError) {
            return [
                openIdClientConfigError,
                null
            ];
        }
        try {
            const backchannelAuthenticationResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$openid$2d$client$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["initiateBackchannelAuthentication"](openidClientConfig, authorizationParams);
            const tokenEndpointResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$openid$2d$client$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["pollBackchannelAuthenticationGrant"](openidClientConfig, backchannelAuthenticationResponse);
            const accessTokenExpiresAt = Math.floor(Date.now() / 1000) + Number(tokenEndpointResponse.expires_in);
            return [
                null,
                {
                    tokenSet: {
                        accessToken: tokenEndpointResponse.access_token,
                        idToken: tokenEndpointResponse.id_token,
                        scope: tokenEndpointResponse.scope,
                        refreshToken: tokenEndpointResponse.refresh_token,
                        expiresAt: accessTokenExpiresAt
                    },
                    idTokenClaims: tokenEndpointResponse.claims(),
                    authorizationDetails: tokenEndpointResponse.authorization_details
                }
            ];
        } catch (e) {
            const oauthErr = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$oauth$2d$error$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["extractOAuthErrorDetails"])(e);
            return [
                new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["BackchannelAuthenticationError"]({
                    cause: new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["OAuth2Error"]({
                        code: oauthErr.error ?? "unknown_error",
                        message: oauthErr.error_description
                    })
                }),
                null
            ];
        }
    }
    async discoverAuthorizationServerMetadata() {
        if (this.authorizationServerMetadata) {
            return [
                null,
                this.authorizationServerMetadata
            ];
        }
        const issuer = new URL(this.issuer);
        try {
            const authorizationServerMetadata = await this.discoveryCache.get(this.issuer, async ()=>{
                return await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["discoveryRequest"](issuer, {
                    ...this.httpOptions(),
                    [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["customFetch"]]: this.fetch,
                    [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["allowInsecureRequests"]]: this.allowInsecureRequests
                }).then((response)=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["processDiscoveryResponse"](issuer, response));
            });
            if (this.useMtls && !authorizationServerMetadata.mtls_endpoint_aliases?.token_endpoint) {
                return [
                    new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mtls$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MtlsError"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mtls$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MtlsErrorCode"].MTLS_ENDPOINT_ALIASES_MISSING, "useMtls is enabled but the authorization server discovery document does not advertise " + "mtls_endpoint_aliases.token_endpoint. Ensure mTLS is enabled on your Auth0 tenant and that requests " + "are routed through your custom domain."),
                    null
                ];
            }
            this.authorizationServerMetadata = authorizationServerMetadata;
            return [
                null,
                authorizationServerMetadata
            ];
        } catch (e) {
            console.error(`An error occurred while performing the discovery request. issuer=${issuer.toString()}, error:`, e);
            return [
                new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DiscoveryError"]("Discovery failed for the OpenID Connect configuration."),
                null
            ];
        }
    }
    async defaultOnCallback(error, ctx) {
        if (error) {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"](error.message, {
                status: 500
            });
        }
        const appBaseUrl = ctx.appBaseUrl;
        if (!appBaseUrl) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["InvalidConfigurationError"]("appBaseUrl could not be resolved for the callback redirect.");
        }
        const res = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["createRouteUrl"])(ctx.returnTo || "/", appBaseUrl).toString());
        return res;
    }
    /**
     * Handle errors during the OAuth callback flow.
     *
     * For popup flows (`challengeMode: 'popup'`): returns error details
     * as a postMessage HTML page instead of redirecting. The parent window
     * receives `{ type: 'auth_complete', success: false, error: { code, message } }`
     * and the promise returned by `challengeWithPopup()` rejects with a typed error.
     *
     * For standard flows (`challengeMode: 'redirect'`): delegates to the
     * `onCallback` hook, which returns a redirect or error response.
     *
     * @param error - The SDK error that occurred during callback processing
     * @param ctx - Callback context (responseType, returnTo, challengeMode)
     * @param req - The incoming callback request
     * @param state - OAuth state parameter (for transaction cookie cleanup)
     * @param transactionState - Loaded transaction state (provides challengeMode)
     */ async handleCallbackError(error, ctx, req, state, transactionState) {
        // PostMessage branch: return error as postMessage HTML instead of redirect
        if (transactionState?.challengeMode === "popup") {
            // Call onCallback for error observability, matching standard flow behavior
            await this.onCallback(error, ctx, null);
            const response = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$html$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["createAuthCompletePostMessageResponse"])({
                success: false,
                error: {
                    code: error.code || "callback_error",
                    message: error.message
                },
                nonce: this.cspNonce
            });
            // Clean up the transaction cookie on error
            if (state) {
                await this.transactionStore.delete(response.cookies, state);
            }
            return response;
        }
        const response = await this.onCallback(error, ctx, null);
        // Clean up the transaction cookie on error to prevent accumulation
        if (state) {
            await this.transactionStore.delete(response.cookies, state);
        }
        return response;
    }
    // ====== ANONYMOUS SESSION: CORE SERVER METHODS (a2) ======
    /**
     * Core renewal logic (ERROR-DRIVEN): evaluate cookie payload against current time.
     * - Access token valid? → return session as-is
     * - Access expired + writable context? → try renewAccessToken(); on session_expired /
     *   invalid_session_token it clears the dead cookie and throws AnonymousSessionError
     * - Access expired + read-only context? → return decrypted as-is (D7 deferral)
     *
     * NO session_expires_at check; renewal discovers session expiry by trying.
     * Implements CASCADE §B + DESIGN §5.I2 + test matrix T1.
     */ async resolveAnonymousSession(reqCookies, resCookies) {
        // Step 1: Read + decrypt auth0_anon cookie from request
        const cookieValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getChunkedCookie"])(this.anonymousCookieName, reqCookies);
        if (!cookieValue) {
            return null; // No cookie → T1.1
        }
        // Step 2: Decrypt payload; return null if malformed (T1.2)
        const decrypted = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["decrypt"])(cookieValue, this.secret);
        if (!decrypted) {
            return null; // Malformed or expired by encrypt expiration
        }
        const state = decrypted.payload;
        const now = Math.floor(Date.now() / 1000);
        // Step 3: Evaluate expiry against renewal state machine
        if (state.expires_at > now) {
            // Access token still valid → return session, no renewal needed (T1.3)
            return this.readPublicSession(state);
        }
        // Access token is expired; can we write cookies?
        if (resCookies) {
            // Writable context → attempt renewal.
            // renewAccessToken clears the dead cookie on session_expired /
            // invalid_session_token and throws; all errors surface to the caller.
            return await this.renewAccessToken(state, reqCookies, resCookies);
        }
        // Can't write cookie (Server Component read-only context) → defer renewal (D7, T1.6)
        // Return the decrypted session as-is; renewal will happen on next route handler call
        return this.readPublicSession(state);
    }
    /**
     * Read-path conversion of a decrypted cookie payload into the public session.
     *
     * Reading an anonymous session never throws for a cookie the SDK cannot use
     * (§3.C2): a missing cookie and a cookie that fails to decrypt already report
     * no session, and an access token that cannot be decoded, or whose subject is
     * not an anonymous subject, is unusable in exactly the same way. It is reported
     * as no session so a Server Component render cannot be broken by a corrupt
     * cookie. The write paths (create, renew, metadata update) keep throwing,
     * because there the caller asked for an operation that either succeeds or fails.
     */ readPublicSession(payload) {
        try {
            return this.toPublicSession(payload);
        } catch  {
            return null;
        }
    }
    /**
     * Mint new access token from existing session token.
     * Called when access token expired but session token still valid.
     * Throws AnonymousSessionError when the session is permanently gone.
     */ async renewAccessToken(state, reqCookies, resCookies) {
        try {
            const res = await this.anonymousTokenRequest({
                session_token: state.session_token,
                // The audience and scope are re-sent so the re-minted access token keeps
                // the audience the session was created with.
                ...this.anonymousTokenAudienceAndScope()
            });
            // toCookiePayload owns the response-to-payload conversion for every mode, so
            // a rotated session token and any metadata the authorization server merged
            // are adopted here rather than discarded in favour of the prior values.
            const renewedPayload = this.toCookiePayload(res, state.session_token, state.metadata);
            await this.persistAnonymousCookie(renewedPayload, reqCookies, resCookies);
            try {
                return this.toPublicSession(renewedPayload);
            } catch  {
                // Renewal toPublicSession threw (e.g. malformed access_token sub).
                // Per getAnonymousSession's never-throws contract, treat as absent.
                return null;
            }
        } catch (err) {
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$types$2f$anonymous$2d$session$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isRecoverableAnonymousError"])(err)) {
                // Session is permanently gone server-side. Clear the dead cookie so
                // the next request doesn't retry with an unusable token, then surface
                // the error so the caller can decide whether to start a new session.
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["deleteChunkedCookie"])(this.anonymousCookieName, reqCookies, resCookies, false, {
                    path: this.anonymousCookieOptions.path,
                    domain: this.anonymousCookieOptions.domain,
                    secure: this.anonymousCookieOptions.secure,
                    sameSite: this.anonymousCookieOptions.sameSite,
                    httpOnly: this.anonymousCookieOptions.httpOnly
                });
            }
            throw err;
        }
    }
    /**
     * The configured audience and scope for anonymous access tokens, shaped for
     * spreading into an /anonymous/token body. Either field is omitted when it is
     * not configured, which lets the authorization server apply the tenant default.
     *
     * These come from the `anonymousSession` configuration block only. They are
     * deliberately not defaulted from `authorizationParameters`, whose audience and
     * scope belong to the interactive login flow and are not necessarily granted to
     * anonymous subjects.
     */ anonymousTokenAudienceAndScope() {
        return {
            ...this.anonymousAudience && {
                audience: this.anonymousAudience
            },
            ...this.anonymousScope && {
                scope: this.anonymousScope
            }
        };
    }
    /**
     * Create fresh anonymous session with optional creation-time metadata.
     * Called by: public createAnonymousSession() (developer-facing), silent recovery on session expiry.
     *
     * Per CASCADE-v2 M2: when called by recovery path (no options), metadata is omitted from request body.
     * When called by public create (options.metadata present), metadata is sent in create-mode body.
     * Validates metadata against 1KB cap BEFORE network call (FR-15 + M2).
     * Validates that Auth0 response includes session_token before persisting.
     */ async createAndPersist(reqCookies, resCookies, options) {
        // Validate metadata type and size BEFORE network call (CASCADE-v2 M2 + FR-15)
        if (options?.metadata !== undefined) {
            // Type validation: metadata must be a plain object
            if (options.metadata === null || typeof options.metadata !== "object" || Array.isArray(options.metadata)) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$anonymous$2d$session$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AnonymousSessionError"]("invalid_request", "Metadata must be a plain object");
            }
            // Size validation
            const size = new TextEncoder().encode(JSON.stringify(options.metadata)).byteLength;
            if (size > __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$anonymous$2d$session$2d$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["METADATA_SIZE_LIMIT_BYTES"]) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$anonymous$2d$session$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AnonymousSessionError"]("metadata_too_large", "Metadata exceeds 1KB limit", `Metadata size: ${size} bytes (max: ${__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$anonymous$2d$session$2d$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["METADATA_SIZE_LIMIT_BYTES"]})`, {
                    size,
                    limit: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$anonymous$2d$session$2d$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["METADATA_SIZE_LIMIT_BYTES"]
                });
            }
        }
        // Call /anonymous/token in create mode: send metadata when supplied
        const res = await this.anonymousTokenRequest({
            ...this.anonymousTokenAudienceAndScope(),
            ...options?.audience && {
                audience: options.audience
            },
            ...options?.scope && {
                scope: options.scope
            },
            ...options?.metadata && {
                metadata: options.metadata
            }
        });
        // Validate that session_token is always present on create response
        if (!res.session_token) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$anonymous$2d$session$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AnonymousSessionError"]("invalid_response", "Auth0 did not return session token in create response");
        }
        // Route through toCookiePayload: owns expires_in validation (both bounds),
        // server-rotation (res.session_token ?? prior), and metadata merge precedence
        // (res.metadata wins over caller-supplied options.metadata).
        // The `!` is safe: `res.session_token` is guarded non-null immediately above,
        // but TypeScript cannot carry that narrowing across the intervening call, so
        // the assertion restates the invariant rather than accessing a nullable value.
        const payload = this.toCookiePayload(res, res.session_token, options?.metadata);
        await this.persistAnonymousCookie(payload, reqCookies, resCookies);
        return this.toPublicSession(payload);
    }
    /**
     * Public reader for the current anonymous session (mirrors getSession).
     * Returns the session or null for a missing or malformed cookie. When resCookies
     * is supplied (request/response context) an expired access token triggers renewal;
     * if renewal reports `session_expired` or `invalid_session_token` it throws
     * `AnonymousSessionError` — callers can catch it and create a new session if needed.
     * Without resCookies (Server Component read path, D7) a valid decrypted session is
     * returned as-is and renewal defers to the next route call.
     * Short-circuits to null when the feature is disabled (§3.C2 / FR-1 / T8.5).
     *
     * NOTE (read-only contexts — RSC, getServerSideProps): when called without
     * resCookies, the returned session's access token may already be expired because
     * the renewed cookie cannot be written back to the response. Callers that forward
     * `accessToken` to downstream services should be prepared to handle a possibly-
     * expired token and trigger re-validation via the route handler if needed.
     */ async getAnonymousSession(reqCookies, resCookies) {
        if (!this.anonymousSessionEnabled) {
            return null;
        }
        return this.resolveAnonymousSession(reqCookies, resCookies);
    }
    /**
     * Public creator for a fresh anonymous session with optional creation-time metadata.
     *
     * Implements FR-2 + CASCADE-v2 M2: metadata is set once at session creation; cannot be changed after.
     * Validates metadata against 1KB cap BEFORE network call (FR-15 + M2).
     *
     * Options:
     *   - metadata: set-once metadata object (max 1KB serialized UTF-8); oversize → metadata_too_large
     *   - audience: per-call audience override
     *   - scope: per-call scope override
     *
     * Calls /anonymous/token in create mode, persists the cookie, returns the session.
     * Throws AnonymousSessionError on any authorization-server error.
     */ async createAnonymousSession(reqCookies, resCookies, options) {
        // Disabled feature short-circuits locally (T8.1) rather than making a
        // network call that the authorization server would reject anyway. The
        // non-nullable return contract (§3.C3) means we throw rather than return null.
        if (!this.anonymousSessionEnabled) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$anonymous$2d$session$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AnonymousSessionError"]("unauthorized_client", "Anonymous sessions are not enabled for this client.");
        }
        return this.createAndPersist(reqCookies, resCookies, options);
    }
    /**
     * Persist encrypted anonymous session cookie.
     * Cookie TTL from configured maxAge (CASCADE §C). Handles chunked cookies for payloads >4KB.
     */ async persistAnonymousCookie(payload, reqCookies, resCookies) {
        // JWT exp claim: cookie lifetime is maxAge from now (client-side cleanup).
        // Encryption expiration set to epoch + maxAge (CASCADE: no session_expires_at field).
        const expiration = this.epoch() + this.anonymousCookieMaxAge;
        const encrypted = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["encrypt"])(payload, this.secret, expiration);
        // Use setChunkedCookie to handle large encrypted payloads (D2: re-wrap in app-domain cookie)
        // Signature: setChunkedCookie(name, value, options, reqCookies, resCookies)
        // anonymousCookieOptions does NOT include maxAge; we add it here per call.
        // setChunkedCookie is synchronous (returns the written byte count); no await.
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["setChunkedCookie"])(this.anonymousCookieName, encrypted, {
            ...this.anonymousCookieOptions,
            maxAge: this.anonymousCookieMaxAge
        }, reqCookies, resCookies);
    }
    /**
     * Decrypt + validate cookie, return opaque payload (internal use only).
     * Used during login to read session_token for injection (D1 fixation: own-cookie source).
     *
     * SECURITY NOTE (SEC-1 three-layer mitigation, layer 2: own-cookie sourcing):
     * This method is the ONLY source of session_token for login injection. The token is
     * sourced from the SDK's own encrypted app-domain cookie (this.anonymousCookieName).
     * Decryption via this.secret guarantees the token came from this app, not attacker input.
     * No caller-supplied data is mixed in.
     */ async readAnonymousCookie(reqCookies) {
        const cookieValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getChunkedCookie"])(this.anonymousCookieName, reqCookies);
        if (!cookieValue) {
            return null;
        }
        const decrypted = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["decrypt"])(cookieValue, this.secret);
        return decrypted?.payload ?? null;
    }
    /**
     * Decide whether this callback may report an anonymous session as linked.
     *
     * SEC-1 layer 3 is enforcement, not notification. Login stored a digest of the
     * anonymous session token it injected; the callback recomputes the digest from
     * the anonymous cookie on this request and only reports a link when the two
     * agree. A cookie that was swapped between the authorization request and the
     * callback therefore reports no link, so application code never attributes an
     * anonymous identity to a login it does not belong to.
     *
     * A transaction with no digest is treated as unbound and keeps whatever flag it
     * carries: that covers transactions written before the digest existed and, when
     * the feature is disabled, every transaction, so behaviour is unchanged there.
     */ async verifyAnonymousSessionLink(transactionState, req) {
        const linked = transactionState.anonymousSessionLinked ?? false;
        if (!this.anonymousSessionEnabled || !transactionState.anonymousSessionRef) {
            return linked;
        }
        try {
            const anonCookie = await this.readAnonymousCookie(req.cookies);
            if (!anonCookie?.session_token) {
                return false;
            }
            const ref = await digestAnonymousSessionToken(anonCookie.session_token);
            return ref === transactionState.anonymousSessionRef && linked;
        } catch  {
            // An unreadable anonymous cookie cannot be shown to match the bound digest,
            // so the link is not reported and login is not failed over it. Swallow the
            // error silently, matching every other Phase 2 fail-open path: the error
            // object can carry decryption/JOSE internals and this method is on the
            // security-critical callback path, so it is never logged.
            return false;
        }
    }
    /**
     * Convert encrypted cookie payload to public AnonymousSession object.
     * Extracts identity (anon@{uuid}) from access token sub claim, validates format,
     * surfaces access token + metadata. Session token intentionally omitted (stays server-side).
     *
     * Throws AnonymousSessionError if access token is malformed or sub is invalid.
     */ toPublicSession(payload) {
        try {
            // Decode access token JWT using jose to extract 'sub' claim
            const claims = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$decode_jwt$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decodeJwt"](payload.access_token);
            const id = claims.sub;
            // Validate that sub is a string and matches anonymous subject format
            if (!id || typeof id !== "string" || !id.startsWith(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$anonymous$2d$session$2d$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ANONYMOUS_SUBJECT_PREFIX"])) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$anonymous$2d$session$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AnonymousSessionError"]("invalid_session_token", "Access token sub claim is not a valid anonymous session ID");
            }
            return {
                id,
                accessToken: payload.access_token,
                expiresAt: payload.expires_at,
                ...payload.metadata && {
                    metadata: payload.metadata
                }
            };
        } catch (err) {
            if (err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$anonymous$2d$session$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AnonymousSessionError"]) {
                throw err;
            }
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$anonymous$2d$session$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AnonymousSessionError"]("invalid_session_token", "Failed to decode access token");
        }
    }
    /**
     * Convert auth server token response to cookie payload.
     * Handles both create (session_token present) and renew (session_token omitted) responses.
     *
     * Validates expires_in: must be finite, positive (> 0), and within the 30-day cap.
     * Test mocks MUST supply a valid positive expires_in value.
     *
     * Merge precedence: res.session_token ?? priorSessionToken (server rotation wins);
     * res.metadata wins over caller-supplied metadata when the server returns metadata.
     *
     * NOTE: Per DESIGN §5.I4, Auth0 returns merged metadata in the response (authorization
     * server performs the merge, not the SDK). This method extracts metadata from tokenRes
     * if present. Caller must ensure metadata from Auth0 response is used, not raw input.
     */ toCookiePayload(res, priorSessionToken, metadata) {
        // Validate expires_in: must be finite, positive (> 0), and within the 30-day cap.
        // Test mocks MUST supply a valid positive expires_in value.
        const MAX_EXPIRES_IN = 2592000; // 30 days (matches platform session_expires_in max)
        if (!Number.isFinite(res.expires_in) || res.expires_in <= 0 || res.expires_in > MAX_EXPIRES_IN) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$anonymous$2d$session$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AnonymousSessionError"]("invalid_response", `expires_in out of bounds: ${res.expires_in}`);
        }
        return {
            // session_token is returned only on create; on renew/update the server omits
            // it and the prior opaque handle MUST be retained so later renewals succeed (D6/§5.I2).
            session_token: res.session_token ?? priorSessionToken,
            access_token: res.access_token,
            expires_at: this.epoch() + res.expires_in,
            // Use metadata from Auth0 response if present (merged by server), else use provided metadata
            ...res.metadata ? {
                metadata: res.metadata
            } : metadata ? {
                metadata
            } : {}
        };
    }
    /**
     * Return current Unix seconds epoch.
     */ epoch() {
        return Math.floor(Date.now() / 1000);
    }
    /**
     * Base URL (origin) to use for anonymous endpoint requests.
     *
     * When mTLS is enabled, routes through the mTLS alias origin from the discovery
     * document (mirrors the guard in withMtlsEndpoint). Falls back to
     * `https://${this.domain}` when mTLS is off, when discovery fails, or when the
     * discovery document does not advertise an mTLS token endpoint alias.
     */ async anonymousBaseUrl() {
        if (this.useMtls) {
            const [err, as] = await this.discoverAuthorizationServerMetadata();
            if (!err && as.mtls_endpoint_aliases?.token_endpoint) {
                return new URL(as.mtls_endpoint_aliases.token_endpoint).origin;
            }
        }
        return `https://${this.domain}`;
    }
    /**
     * Resolve the authorization server metadata that the client authentication
     * callable is handed.
     *
     * Only assertion-based authentication reads it: `PrivateKeyJwt` signs an `aud`
     * claim taken from `as.issuer`, so it needs the real metadata. The secret-based
     * and mTLS methods ignore the argument entirely, so they must not pay for a
     * discovery round trip. When discovery fails the configured issuer is used, which
     * is the value discovery would have validated the document against anyway.
     */ async anonymousClientAuthServer() {
        const signsClientAssertion = !this.useMtls && !!this.clientAssertionSigningKey;
        if (signsClientAssertion) {
            const [discoveryError, authorizationServerMetadata] = await this.discoverAuthorizationServerMetadata();
            if (!discoveryError) {
                return authorizationServerMetadata;
            }
        }
        return {
            issuer: this.issuer
        };
    }
    /**
     * Build the fetch options for a request to one of the anonymous endpoints,
     * applying the client's configured authentication method.
     *
     * The anonymous endpoints are not standard grant endpoints, so the oauth4webapi
     * grant helpers cannot issue them, but client authentication still has to be the
     * method the client is configured with. oauth4webapi models an authentication
     * method as a callable that writes form parameters into a `URLSearchParams` and
     * authentication headers into a `Headers`. This helper invokes that callable
     * against scratch collections, folds the parameters into the JSON body these
     * endpoints expect, and folds the headers onto the outgoing headers. Without the
     * invocation the request would carry `client_id` alone and the authorization
     * server would answer 401 `invalid_client`.
     */ async anonymousRequestInit(body) {
        const httpOpts = this.httpOptions();
        const headers = {
            "content-type": "application/json"
        };
        httpOpts.headers.forEach((value, key)=>{
            headers[key] = value;
        });
        const requestBody = {
            client_id: this.clientMetadata.client_id,
            ...body
        };
        const clientAuth = await this.getClientAuth();
        const authParams = new URLSearchParams();
        const authHeaders = new Headers();
        await clientAuth(await this.anonymousClientAuthServer(), this.clientMetadata, authParams, authHeaders);
        authParams.forEach((value, key)=>{
            requestBody[key] = value;
        });
        authHeaders.forEach((value, key)=>{
            headers[key] = value;
        });
        return {
            method: "POST",
            headers,
            body: JSON.stringify(requestBody),
            // Never follow a 3xx from the anonymous endpoints; a redirect here would
            // forward client-auth material to an unintended origin (parity with
            // auth0-auth-js mintTransferToken).
            redirect: "error",
            signal: httpOpts.signal
        };
    }
    /**
     * POST /anonymous/token with optional session_token and/or metadata.
     * Three modes:
     *   - Create: {} → new session
     *   - Renew: { session_token } → mint new access token
     *   - Update: { session_token, metadata } → update metadata
     *
     * Called by: createAndPersist(), renewAccessToken(), update route handler.
     * Throws AnonymousSessionError on server-reported error (§4.W1 error table).
     * Returns AnonymousTokenResponse on 200.
     */ async anonymousTokenRequest(body) {
        const url = new URL(`/anonymous/token`, await this.anonymousBaseUrl());
        const res = await this.fetch(url.toString(), await this.anonymousRequestInit(body));
        if (!res.ok) {
            const errorData = await res.json().catch(()=>({}));
            const code = String(errorData.error ?? `http_${res.status}`);
            const description = typeof errorData.error_description === "string" ? errorData.error_description : undefined;
            throw this.mapAnonymousError(code, description, errorData);
        }
        return res.json();
    }
    /**
     * POST /anonymous/logout — body contains client_id only, session_token NOT in body.
     * Per CASCADE-v2 M3: session_token rides as auth0_anon cookie (credentials:'include'), NEVER in body.
     * Body = {client_id} (from clientAuthParams) or {}.
     * Idempotent: returns 200 even with no session.
     * Called by: logout route handler.
     *
     * SAFETY (CASCADE-v2 M3 WARNING): Server-to-server call from Next.js backend cannot forward
     * the browser's tenant-domain auth0_anon cookie, so this call clears nothing server-side.
     * The only effective logout action is the SDK's local deleteChunkedCookie (route handler).
     * Tokens issued before logout remain valid until natural expiry; no server revocation exists.
     *
     * Ending a session that no longer exists is not an error, so a 404 and a 200 are
     * both treated as success. A rejected client authentication or a client that is
     * not allowed to end anonymous sessions is a real failure and must surface, so
     * 401 and 403 throw alongside the 5xx range.
     */ async anonymousLogoutRequest() {
        const url = new URL(`/anonymous/logout`, await this.anonymousBaseUrl());
        const body = this.clientMetadata.client_id ? {
            client_id: this.clientMetadata.client_id
        } : {};
        const res = await this.fetch(url.toString(), await this.anonymousRequestInit(body));
        const isAuthenticationFailure = res.status === 401 || res.status === 403;
        if (isAuthenticationFailure || res.status >= 500) {
            const errorData = await res.json().catch(()=>({}));
            const code = String(errorData.error ?? (isAuthenticationFailure ? "invalid_client" : "server_error"));
            const description = typeof errorData.error_description === "string" ? errorData.error_description : undefined;
            throw this.mapAnonymousError(code, description, errorData);
        }
    }
    // ── Transfer ticket mint ───────────────────────────────────────────────────
    /**
     * Mint a 30-second single-use JWE transfer ticket for anonymous session linking.
     *
     * POSTs to /anonymous/token with:
     *   { client_id, session_token, audience: "urn:auth0:anon_transfer", ...clientAuth }
     *
     * Fail-open: returns null on ANY error (network, non-2xx, missing field,
     * wrong-type field, client-auth-build failure). Never throws. Never surfaces
     * AnonymousSessionError. The caller appends the ticket to /authorize only on
     * a non-null return.
     *
     * Timeout: inherits the SDK-wide httpTimeout via anonymousRequestInit's signal,
     * so a hung /anonymous/token endpoint cannot stall the login flow indefinitely.
     *
     * PAR compatibility: when pushedAuthorizationRequests is true, anon_transfer_token
     * is submitted to the PAR endpoint as a normal authorizationParams entry and
     * reaches /authorize normally (verified Sep 21 against EA tenant).
     */ async mintTransferToken(sessionToken) {
        try {
            const url = new URL("/anonymous/token", await this.anonymousBaseUrl());
            const init = await this.anonymousRequestInit({
                session_token: sessionToken,
                audience: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$anonymous$2d$session$2d$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ANON_TRANSFER_AUDIENCE"]
            });
            const res = await this.fetch(url.toString(), init);
            if (!res.ok) {
                return null;
            }
            const data = await res.json();
            return typeof data.anon_transfer_token === "string" ? data.anon_transfer_token : null;
        } catch (err) {
            console.error("[nextjs-auth0] Anonymous transfer token mint failed (login proceeds):", err instanceof Error ? err.message : String(err));
            return null;
        }
    }
    /**
     * Map authorization server error response to AnonymousSessionError.
     * Populates description and cause fields (CASCADE §D).
     * Per DESIGN §3.C7 error table + RFC OAuth 2.0 error codes.
     */ mapAnonymousError(code, description, rawBody) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$anonymous$2d$session$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["mapAnonymousErrorCode"])(code, description, rawBody);
    }
    // ====== ANONYMOUS SESSION: ROUTE HANDLERS (a3) ======
    /**
     * GET /auth/anonymous-session
     *
     * Read current session, applying renewal state machine.
     * Returns 200 + JSON session object, or 204 No Content if no session (client hook maps to null).
     *
     * Test: T1 (read + renewal), T8.1 (disabled → 404)
     */ async handleGetAnonymousSession(req) {
        if (!this.anonymousSessionEnabled) {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"]("Not found", {
                status: 404
            });
        }
        // Temp jar collects any cookies written during the renewal state machine.
        // Hoisted outside try so the catch block can transfer the deletion cookie
        // written by renewAccessToken when a session expires.
        const pending = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"]();
        try {
            const session = await this.resolveAnonymousSession(req.cookies, pending.cookies);
            if (!session) {
                const empty = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"](null, {
                    status: 204
                });
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$anonymous$2d$session$2d$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["transferCookies"])(pending, empty);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["addCacheControlHeadersForSession"])(empty);
                return empty;
            }
            const jsonRes = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json(session);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$anonymous$2d$session$2d$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["transferCookies"])(pending, jsonRes);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["addCacheControlHeadersForSession"])(jsonRes);
            return jsonRes;
        } catch (err) {
            const code = err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$anonymous$2d$session$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AnonymousSessionError"] ? err.code : "server_error";
            const errRes = this.anonymousErrorResponse(code, (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$anonymous$2d$session$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["getStatusForAnonymousError"])(code));
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$anonymous$2d$session$2d$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["transferCookies"])(pending, errRes);
            return errRes;
        }
    }
    /**
     * POST /auth/anonymous-session/logout
     *
     * Clear anonymous session.
     * Reads session_token from cookie, calls /anonymous/logout, clears cookie.
     * Idempotent: 200 even if no session.
     *
     * Test: T4.1 (logout), T4.2 (no session), T4.3 (idempotent)
     */ async handleAnonymousLogout(req) {
        try {
            if (!this.anonymousSessionEnabled) {
                return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"]("Not found", {
                    status: 404
                });
            }
            // Call Auth0 /anonymous/logout (body = {client_id}/{}, no session_token; CASCADE-v2 M3).
            // The SDK does not read the session_token here; the server-to-server call cannot
            // forward the browser's auth0_anon cookie, so it clears nothing server-side.
            // Swallow network errors; the local cookie clear below is the only effective logout.
            try {
                await this.anonymousLogoutRequest();
            } catch (err) {
                console.warn("[nextjs-auth0] Anonymous logout failed (ignored):", err instanceof Error ? err.message : String(err));
            }
            // Clear the cookie, including any chunk fragments, so a chunked session
            // (metadata >4KB) does not leave orphaned auth0_anon__N cookies behind.
            const res = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"](JSON.stringify({
                ok: true
            }), {
                status: 200,
                headers: {
                    "content-type": "application/json"
                }
            });
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["deleteChunkedCookie"])(this.anonymousCookieName, req.cookies, res.cookies, false, {
                path: this.anonymousCookieOptions.path,
                domain: this.anonymousCookieOptions.domain,
                secure: this.anonymousCookieOptions.secure,
                sameSite: this.anonymousCookieOptions.sameSite,
                httpOnly: this.anonymousCookieOptions.httpOnly
            });
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["addCacheControlHeadersForSession"])(res);
            return res;
        } catch (err) {
            // Even on error, attempt to clear the cookie (and its chunks).
            const res = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"](JSON.stringify({
                ok: true
            }), {
                status: 200
            });
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["deleteChunkedCookie"])(this.anonymousCookieName, req.cookies, res.cookies, false, {
                path: this.anonymousCookieOptions.path,
                domain: this.anonymousCookieOptions.domain,
                secure: this.anonymousCookieOptions.secure,
                sameSite: this.anonymousCookieOptions.sameSite,
                httpOnly: this.anonymousCookieOptions.httpOnly
            });
            return res;
        }
    }
    /**
     * Build error response: JSON with error code + message, correct HTTP status.
     */ anonymousErrorResponse(code, status = 500) {
        const res = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: code,
            error_description: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$anonymous$2d$session$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["mapAnonymousErrorCode"])(code).message
        }, {
            status
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["addCacheControlHeadersForSession"])(res);
        return res;
    }
    async verifyLogoutToken(logoutToken) {
        const [discoveryError, authorizationServerMetadata] = await this.discoverAuthorizationServerMetadata();
        if (discoveryError) {
            return [
                discoveryError,
                null
            ];
        }
        // only `RS256` is supported for logout tokens
        const ID_TOKEN_SIGNING_ALG = "RS256";
        const keyInput = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwks$2f$remote$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["createRemoteJWKSet"](new URL(authorizationServerMetadata.jwks_uri), {
            [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwks$2f$remote$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jwksCache"]]: this.discoveryCache.getJwksCacheForUri(authorizationServerMetadata.jwks_uri),
            timeoutDuration: this.httpTimeout,
            [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwks$2f$remote$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["customFetch"]]: this.fetch
        });
        const { payload } = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jwtVerify"](logoutToken, keyInput, {
            issuer: authorizationServerMetadata.issuer,
            audience: this.clientMetadata.client_id,
            algorithms: [
                ID_TOKEN_SIGNING_ALG
            ],
            requiredClaims: [
                "iat"
            ]
        });
        if (!("sid" in payload) && !("sub" in payload)) {
            return [
                new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["BackchannelLogoutError"]('either "sid" or "sub" (or both) claims must be present'),
                null
            ];
        }
        if ("sid" in payload && typeof payload.sid !== "string") {
            return [
                new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["BackchannelLogoutError"]('"sid" claim must be a string'),
                null
            ];
        }
        if ("sub" in payload && typeof payload.sub !== "string") {
            return [
                new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["BackchannelLogoutError"]('"sub" claim must be a string'),
                null
            ];
        }
        if ("nonce" in payload) {
            return [
                new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["BackchannelLogoutError"]('"nonce" claim is prohibited'),
                null
            ];
        }
        if (!("events" in payload)) {
            return [
                new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["BackchannelLogoutError"]('"events" claim is missing'),
                null
            ];
        }
        if (typeof payload.events !== "object" || payload.events === null) {
            return [
                new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["BackchannelLogoutError"]('"events" claim must be an object'),
                null
            ];
        }
        if (!("http://schemas.openid.net/event/backchannel-logout" in payload.events)) {
            return [
                new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["BackchannelLogoutError"]('"http://schemas.openid.net/event/backchannel-logout" member is missing in the "events" claim'),
                null
            ];
        }
        if (typeof payload.events["http://schemas.openid.net/event/backchannel-logout"] !== "object") {
            return [
                new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["BackchannelLogoutError"]('"http://schemas.openid.net/event/backchannel-logout" member in the "events" claim must be an object'),
                null
            ];
        }
        // Extract issuer from verified token payload
        const issuer = payload.iss;
        return [
            null,
            {
                sid: payload.sid,
                sub: payload.sub,
                iss: issuer // include issuer for issuer-matched deletion
            }
        ];
    }
    async authorizationUrl(params) {
        const [discoveryError, authorizationServerMetadata] = await this.discoverAuthorizationServerMetadata();
        if (discoveryError) {
            return [
                discoveryError,
                null
            ];
        }
        if (this.pushedAuthorizationRequests && !authorizationServerMetadata.pushed_authorization_request_endpoint) {
            console.error("The Auth0 tenant does not have pushed authorization requests enabled. Learn how to enable it here: https://auth0.com/docs/get-started/applications/configure-par");
            return [
                new Error("The authorization server does not support pushed authorization requests."),
                null
            ];
        }
        const authorizationUrl = new URL(authorizationServerMetadata.authorization_endpoint);
        if (this.pushedAuthorizationRequests) {
            // push the request params to the authorization server
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["pushedAuthorizationRequest"](authorizationServerMetadata, this.clientMetadata, await this.getClientAuth(), params, {
                ...this.httpOptions(),
                [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["customFetch"]]: this.fetch,
                [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["allowInsecureRequests"]]: this.allowInsecureRequests
            });
            let parRes;
            try {
                parRes = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["processPushedAuthorizationResponse"](authorizationServerMetadata, this.clientMetadata, response);
            } catch (e) {
                const oauthErr = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$oauth$2d$error$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["extractOAuthErrorDetails"])(e);
                return [
                    new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AuthorizationError"]({
                        cause: new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["OAuth2Error"]({
                            code: oauthErr.error ?? "unknown_error",
                            message: oauthErr.error_description
                        }),
                        message: "An error occurred while pushing the authorization request."
                    }),
                    null
                ];
            }
            authorizationUrl.searchParams.set("request_uri", parRes.request_uri);
            authorizationUrl.searchParams.set("client_id", this.clientMetadata.client_id);
            return [
                null,
                authorizationUrl
            ];
        }
        // append the query parameters to the authorization URL for the normal flow
        authorizationUrl.search = params.toString();
        return [
            null,
            authorizationUrl
        ];
    }
    withMtlsEndpoint(as) {
        if (this.useMtls && as.mtls_endpoint_aliases?.token_endpoint) {
            return {
                ...as,
                token_endpoint: as.mtls_endpoint_aliases.token_endpoint
            };
        }
        return as;
    }
    /**
     * Low-level revocation call against the authorization server's
     * `/oauth/revoke` endpoint. Callers must supply the discovered metadata.
     *
     * @param as The discovered authorization server metadata.
     * @param token The token to revoke.
     * @param tokenTypeHint Optional `token_type_hint` per RFC 7009.
     */ async performTokenRevocation(as, token, tokenTypeHint) {
        const clientAuth = await this.getClientAuth();
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["revocationRequest"](as, this.clientMetadata, clientAuth, token, {
            [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["customFetch"]]: this.fetch,
            [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["allowInsecureRequests"]]: this.allowInsecureRequests,
            ...this.httpOptions(),
            ...tokenTypeHint ? {
                additionalParameters: {
                    token_type_hint: tokenTypeHint
                }
            } : {}
        });
        await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["processRevocationResponse"](response);
    }
    /**
     * Revokes a token at the Auth0 `/oauth/revoke` endpoint (RFC 7009).
     *
     * Per RFC 7009, revoking a refresh token also invalidates the other tokens
     * issued under the same authorization grant. Client authentication
     * (`client_secret`, Private Key JWT, or mTLS) is applied automatically based
     * on the configured client credentials.
     *
     * @param token The token to revoke.
     * @param tokenTypeHint Optional `token_type_hint` (`refresh_token` or `access_token`).
     * @returns A tuple of `[error, null]` on failure or `[null, undefined]` on success.
     */ async revokeToken(token, tokenTypeHint) {
        if (!token || token.trim() === "") {
            return [
                new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["TokenRevocationError"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["TokenRevocationErrorCode"].MISSING_REFRESH_TOKEN, "A token is required to perform revocation."),
                null
            ];
        }
        const [discoveryError, authorizationServerMetadata] = await this.discoverAuthorizationServerMetadata();
        if (discoveryError) {
            return [
                discoveryError,
                null
            ];
        }
        try {
            await this.performTokenRevocation(authorizationServerMetadata, token, tokenTypeHint);
        } catch (e) {
            return [
                new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["TokenRevocationError"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["TokenRevocationErrorCode"].FAILED_TO_REVOKE, "An error occurred while trying to revoke the token.", new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["OAuth2Error"]({
                    code: e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ResponseBodyError"] ? e.error : "revoke_failed",
                    message: e instanceof Error ? e.message : String(e)
                })),
                null
            ];
        }
        return [
            null,
            undefined
        ];
    }
    warnIfNotCertificateBound(accessToken) {
        try {
            const payload = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$decode_jwt$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decodeJwt"](accessToken);
            const cnf = payload["cnf"];
            if (!cnf?.["x5t#S256"]) {
                console.warn("[nextjs-auth0] useMtls is enabled but the issued access token does not contain " + "a cnf.x5t#S256 claim. The token is not certificate-bound. " + "Verify that mTLS is correctly configured on your Auth0 tenant and that " + "token requests are routed through your mTLS custom domain.");
            }
        } catch  {
        // decodeJwt only fails for opaque tokens — skip the check silently
        }
    }
    async getClientAuth() {
        if (this.useMtls) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["TlsClientAuth"]();
        }
        if (!this.clientSecret && !this.clientAssertionSigningKey) {
            throw new Error("The client secret or client assertion signing key must be provided.");
        }
        let clientPrivateKey = this.clientAssertionSigningKey;
        if (clientPrivateKey && typeof clientPrivateKey === "string") {
            clientPrivateKey = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$key$2f$import$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["importPKCS8"](clientPrivateKey, this.clientAssertionSigningAlg);
        }
        return clientPrivateKey ? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PrivateKeyJwt"](clientPrivateKey) : __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ClientSecretPost"](this.clientSecret);
    }
    /** @internal */ get issuer() {
        return this._issuer;
    }
    /**
     * Gets the session with domain validation in MCD mode.
     *
     * In resolver mode, sessions are tagged with the domain they were created for.
     * This method checks that the session domain matches the current request domain,
     * and backlills pre-MCD sessions atomically.
     *
     *
     * @param cookies - Request cookies containing session information
     * @returns A SessionCheckResult object with the following properties:
     *   - `error: null | SessionDomainMismatchError` — null if session is valid for current domain, or SessionDomainMismatchError if domain mismatch
     *   - `session: null | SessionData` — the session object if valid, null otherwise
     *   - `exists: boolean` — true if a session was found (regardless of domain match), false if no session
     *
     * @note SessionCheckResult is an internal contract used for session validation. Not part of public API.
     *
     * @internal
     */ async getSessionWithDomainCheck(cookies, { skipCeilingCheck = false } = {}) {
        // Read session from store
        const session = await this.sessionStore.get(cookies);
        // No session found
        if (!session) {
            return {
                error: null,
                session: null,
                exists: false
            };
        }
        // IPSIE: treat as no session once the upstream IdP-asserted ceiling passes.
        // Returns the same shape as "no session" so existing redirect-to-login paths
        // fire transparently. For stateful stores, delete the backing record so the
        // store stays clean; stateless sessions are self-contained in the cookie and
        // will be orphaned (ceiling check fires on every subsequent read).
        // skipCeilingCheck is used by getAccessTokenForConnection — connection tokens
        // follow the upstream IdP's own TTLs, not the IPSIE session ceiling.
        if (!skipCeilingCheck && (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$session$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isSessionCeilingReached"])(session.internal?.sessionExpiresAt)) {
            this.sessionStore.deleteByReqCookies(cookies).catch((e)=>console.warn("[auth0] Failed to delete session on ceiling expiry:", e));
            return {
                error: null,
                session: null,
                exists: false
            };
        }
        // Session has domain metadata: check for match
        if (session.internal?.mcd) {
            // Compare session domain with current domain
            if (session.internal.mcd.domain !== this.domain) {
                // Domain mismatch - session was created for a different domain
                return {
                    error: new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mcd$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SessionDomainMismatchError"](`Session was created for domain '${session.internal.mcd.domain}' but the current request is for domain '${this.domain}'. ` + `This may indicate a cross-domain session reuse attempt.`),
                    session: null,
                    exists: true
                };
            }
            // Domain matches - return session
            return {
                error: null,
                session,
                exists: true
            };
        }
        // Static mode: skip backfill entirely. There is only one domain, so
        // internal.mcd provides no value and adding it grows the session cookie
        // (~140 bytes), which can push sessions over the MAX_CHUNK_SIZE boundary
        // and trigger unnecessary chunking. This preserves DD-2 (zero-overhead
        // static mode). See: https://github.com/auth0/nextjs-auth0/issues/2595
        if (!this.provider?.isResolverMode) {
            return {
                error: null,
                session,
                exists: true
            };
        }
        // Resolver mode: pre-MCD session (no mcd field) — infer domain from ID
        // token's iss claim. This is deterministic — the same session always yields
        // the same domain, eliminating the race condition where the first resolver
        // output claims it.
        let inferredDomain;
        if (session.tokenSet.idToken) {
            try {
                const { iss } = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$decode_jwt$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decodeJwt"](session.tokenSet.idToken);
                if (typeof iss === "string") {
                    inferredDomain = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$normalize$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["normalizeDomain"])(iss).domain;
                }
            } catch  {
            // Malformed JWT — fall through to fallback
            }
        }
        // Fallback: use current AuthClient's domain (last resort if idToken absent)
        const domain = inferredDomain ?? this.domain;
        session.internal = session.internal || {};
        session.internal.mcd = {
            domain,
            issuer: `https://${domain}/`
        };
        // Backfill is in-memory only. Persistence is deferred to the next session
        // touch/save operation (e.g., middleware handler's default case) where
        // sessionStore.set() is called with actual response cookies attached to
        // the HTTP response. This avoids creating orphaned ResponseCookies that
        // would never be sent to the client in stateless (cookie-based) sessions.
        return {
            error: null,
            session,
            exists: true
        };
    }
    /**
     * Exchanges a refresh token for an access token for a connection.
     *
     * This method performs a token exchange using the provided refresh token and connection details.
     * It first checks if the refresh token is present in the `tokenSet`. If not, it returns an error.
     * Then, it constructs the necessary parameters for the token exchange request and performs
     * the request to the authorization server's token endpoint.
     *
     * @returns {Promise<[AccessTokenForConnectionError, null] | [null, ConnectionTokenSet]>} A promise that resolves to a tuple.
     *          The first element is either an `AccessTokenForConnectionError` if an error occurred, or `null` if the request was successful.
     *          The second element is either `null` if an error occurred, or a `ConnectionTokenSet` object
     *          containing the access token, expiration time, and scope if the request was successful.
     *
     * @throws {AccessTokenForConnectionError} If the refresh token is missing or if there is an error during the token exchange process.
     */ async getConnectionTokenSet(tokenSet, connectionTokenSet, options) {
        await this.ensureDpopValidated();
        // If we do not have a refresh token
        // and we do not have a connection token set in the cache or the one we have is expired,
        // there is nothing to retrieve and we return an error.
        if (!tokenSet.refreshToken && (!connectionTokenSet || connectionTokenSet.expiresAt <= Date.now() / 1000)) {
            return [
                new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AccessTokenForConnectionError"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AccessTokenForConnectionErrorCode"].MISSING_REFRESH_TOKEN, "A refresh token was not present, Connection Access Token requires a refresh token. The user needs to re-authenticate."),
                null
            ];
        }
        // If we do have a refresh token,
        // and we do not have a connection token set in the cache or the one we have is expired,
        // we need to exchange the refresh token for a connection access token.
        if (tokenSet.refreshToken && (!connectionTokenSet || connectionTokenSet.expiresAt <= Date.now() / 1000)) {
            const params = new URLSearchParams();
            params.append("connection", options.connection);
            const subjectTokenType = options.subject_token_type ?? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$types$2f$token$2d$vault$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SUBJECT_TOKEN_TYPES"].SUBJECT_TYPE_REFRESH_TOKEN;
            const subjectToken = subjectTokenType === __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$types$2f$token$2d$vault$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SUBJECT_TOKEN_TYPES"].SUBJECT_TYPE_ACCESS_TOKEN ? tokenSet.accessToken : tokenSet.refreshToken;
            params.append("subject_token_type", subjectTokenType);
            params.append("subject_token", subjectToken);
            params.append("requested_token_type", REQUESTED_TOKEN_TYPE_FEDERATED_CONNECTION_ACCESS_TOKEN);
            if (options.login_hint) {
                params.append("login_hint", options.login_hint);
            }
            const [discoveryError, authorizationServerMetadata] = await this.discoverAuthorizationServerMetadata();
            if (discoveryError) {
                return [
                    discoveryError,
                    null
                ];
            }
            // Create DPoP handle ONCE outside the closure so it persists across retries.
            // This is required by RFC 9449: the handle must learn and reuse the nonce from
            // the DPoP-Nonce header across multiple attempts.
            const dpopHandle = this.useDPoP && this.dpopKeyPair ? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DPoP"](this.clientMetadata, this.dpopKeyPair) : undefined;
            // When useMtls=true, use the mTLS alias so the edge proxy forwards the
            // Client-Certificate header. CNF is not issued for this grant type (auth-server behavior).
            const connectionTokenMetadata = this.withMtlsEndpoint(authorizationServerMetadata);
            const genericTokenEndpointRequestCall = async ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["genericTokenEndpointRequest"](connectionTokenMetadata, this.clientMetadata, await this.getClientAuth(), GRANT_TYPE_FEDERATED_CONNECTION_ACCESS_TOKEN, params, {
                    [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["customFetch"]]: this.fetch,
                    [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["allowInsecureRequests"]]: this.allowInsecureRequests,
                    ...dpopHandle && {
                        DPoP: dpopHandle
                    }
                });
            const processGenericTokenEndpointResponseCall = async ()=>{
                const httpResponse = await genericTokenEndpointRequestCall();
                return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["processGenericTokenEndpointResponse"](connectionTokenMetadata, this.clientMetadata, httpResponse);
            };
            let tokenEndpointResponse;
            try {
                tokenEndpointResponse = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$dpopRetry$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["withDPoPNonceRetry"])(processGenericTokenEndpointResponseCall, {
                    isDPoPEnabled: !!(this.useDPoP && this.dpopKeyPair),
                    ...this.dpopOptions?.retry
                });
            } catch (err) {
                const oauthErr = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$oauth$2d$error$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["extractOAuthErrorDetails"])(err);
                return [
                    new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AccessTokenForConnectionError"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AccessTokenForConnectionErrorCode"].FAILED_TO_EXCHANGE, "There was an error trying to exchange the refresh token for a connection access token.", new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["OAuth2Error"]({
                        code: oauthErr.error ?? "unknown_error",
                        message: oauthErr.error_description
                    })),
                    null
                ];
            }
            return [
                null,
                {
                    accessToken: tokenEndpointResponse.access_token,
                    expiresAt: Math.floor(Date.now() / 1000) + Number(tokenEndpointResponse.expires_in),
                    scope: tokenEndpointResponse.scope,
                    connection: options.connection,
                    ...options.login_hint ? {
                        loginHint: options.login_hint
                    } : {}
                }
            ];
        }
        return [
            null,
            connectionTokenSet
        ];
    }
    /**
     * Validates subject_token_type: 10-100 chars, valid URI (URL or URN).
     * The 10-100 length constraint matches the Auth0 CTE Profile Management API requirement
     * for subject_token_type, which is used as a routing key to select a profile.
     */ validateSubjectTokenType(type) {
        if (type.length < 10) {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeError"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeErrorCode"].INVALID_SUBJECT_TOKEN_TYPE, `Invalid subject_token_type: must be at least 10 characters. Received ${type.length} characters.`);
        }
        if (type.length > 100) {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeError"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeErrorCode"].INVALID_SUBJECT_TOKEN_TYPE, `Invalid subject_token_type: must be at most 100 characters. Received ${type.length} characters.`);
        }
        return this.validateTokenTypeUri(type, "subject_token_type");
    }
    /**
     * Validates actor_token_type: valid URI (URL or URN).
     * No length constraint — actor_token_type is not registered in a CTE profile
     * and RFC 8693 §3 imposes no length limit on token type URIs.
     */ validateActorTokenType(type) {
        return this.validateTokenTypeUri(type, "actor_token_type");
    }
    validateTokenTypeUri(type, field) {
        let isValidUrl = false;
        try {
            new URL(type);
            isValidUrl = true;
        } catch  {
        // Not a valid URL, check URN format next
        }
        // URN format: urn:<nid>:<nss> where nid is alphanumeric (can contain hyphens)
        const isValidUrn = /^urn:[a-z0-9][a-z0-9-]{0,31}:[a-z0-9()+,\-.:=@;$_!*'%/?#]+$/i.test(type);
        if (!isValidUrl && !isValidUrn) {
            const code = field === "actor_token_type" ? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeErrorCode"].INVALID_ACTOR_TOKEN_TYPE : __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeErrorCode"].INVALID_SUBJECT_TOKEN_TYPE;
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeError"](code, `Invalid ${field}: must be a valid URI (URL or URN format). Received: "${type}"`);
        }
        return null;
    }
    /**
     * Exchanges an external token for Auth0 tokens via Custom Token Exchange (RFC 8693).
     *
     * This method allows you to exchange a token from an external identity provider
     * for Auth0 tokens without a browser redirect. The external token is validated
     * by your Auth0 Action with the Custom Token Exchange trigger.
     *
     * **Note**: CTE tokens are not cached per RWA SDK spec. The caller is responsible
     * for token storage if needed.
     *
     * @param options - The custom token exchange options
     * @returns A tuple of [error, null] or [null, response]
     *
     * @example
     * ```typescript
     * const [error, response] = await authClient.customTokenExchange({
     *   subjectToken: legacyIdToken,
     *   subjectTokenType: 'urn:acme:legacy-token',
     *   audience: 'https://api.example.com',
     *   scope: 'read:data'
     * });
     * ```
     *
     * @see {@link https://auth0.com/docs/authenticate/custom-token-exchange Auth0 CTE Documentation}
     * @see {@link https://datatracker.ietf.org/doc/html/rfc8693 RFC 8693 Token Exchange}
     */ async customTokenExchange(options) {
        await this.ensureDpopValidated();
        // Note: CTE tokens are not cached per RWA SDK spec.
        // Caller is responsible for token storage if needed.
        // Validate subjectToken is non-empty
        if (!options.subjectToken || options.subjectToken.trim() === "") {
            return [
                new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeError"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeErrorCode"].MISSING_SUBJECT_TOKEN, "The subject_token is required and cannot be empty."),
                null
            ];
        }
        // Validate subjectTokenType
        const tokenTypeError = this.validateSubjectTokenType(options.subjectTokenType);
        if (tokenTypeError) {
            return [
                tokenTypeError,
                null
            ];
        }
        // Validate actor token pair (RFC 8693: actor_token requires actor_token_type)
        if (options.actorToken && !options.actorTokenType) {
            return [
                new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeError"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeErrorCode"].MISSING_ACTOR_TOKEN_TYPE, "The actor_token_type is required when actor_token is provided."),
                null
            ];
        }
        // Validate actorTokenType is a valid URI (RFC 8693 §3)
        if (options.actorToken && options.actorTokenType) {
            const actorTokenTypeError = this.validateActorTokenType(options.actorTokenType);
            if (actorTokenTypeError) {
                return [
                    actorTokenTypeError,
                    null
                ];
            }
        }
        // Discover authorization server metadata
        const [discoveryError, authorizationServerMetadata] = await this.discoverAuthorizationServerMetadata();
        if (discoveryError) {
            return [
                new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeError"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeErrorCode"].EXCHANGE_FAILED, "Failed to discover authorization server metadata.", new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["OAuth2Error"]({
                    code: "discovery_error",
                    message: discoveryError.message
                })),
                null
            ];
        }
        // Merge scopes: user-provided + SDK defaults
        const finalScope = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$token$2d$set$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["mergeScopes"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DEFAULT_SCOPES"], options.scope);
        // Build request params
        const params = new URLSearchParams();
        params.append("subject_token", options.subjectToken);
        params.append("subject_token_type", options.subjectTokenType);
        params.append("scope", finalScope);
        if (options.audience) {
            params.append("audience", options.audience);
        }
        if (options.organization) {
            params.append("organization", options.organization);
        }
        // Add actor token if provided (both must be present due to validation above)
        if (options.actorToken && options.actorTokenType) {
            params.append("actor_token", options.actorToken);
            params.append("actor_token_type", options.actorTokenType);
        }
        // Add additionalParameters if present
        if (options.additionalParameters) {
            for (const [key, value] of Object.entries(options.additionalParameters)){
                if (value !== undefined && value !== null) {
                    params.append(key, String(value));
                }
            }
        }
        // Create DPoP handle ONCE outside the closure so it persists across retries.
        // This is required by RFC 9449: the handle must learn and reuse the nonce from
        // the DPoP-Nonce header across multiple attempts.
        const dpopHandle = this.useDPoP && this.dpopKeyPair ? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DPoP"](this.clientMetadata, this.dpopKeyPair) : undefined;
        // Execute token exchange with DPoP retry support
        const tokenExchangeMetadata = this.withMtlsEndpoint(authorizationServerMetadata);
        const processTokenExchange = async ()=>{
            const httpResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["genericTokenEndpointRequest"](tokenExchangeMetadata, this.clientMetadata, await this.getClientAuth(), __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$types$2f$token$2d$vault$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["GRANT_TYPE_CUSTOM_TOKEN_EXCHANGE"], params, {
                [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["customFetch"]]: this.fetch,
                [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["allowInsecureRequests"]]: this.allowInsecureRequests,
                ...dpopHandle && {
                    DPoP: dpopHandle
                }
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["processGenericTokenEndpointResponse"](tokenExchangeMetadata, this.clientMetadata, httpResponse);
        };
        let tokenEndpointResponse;
        let act;
        try {
            tokenEndpointResponse = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$dpopRetry$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["withDPoPNonceRetry"])(processTokenExchange, {
                isDPoPEnabled: !!(this.useDPoP && this.dpopKeyPair),
                ...this.dpopOptions?.retry
            });
            // Decode act claim from ID token for delegation/impersonation flows (RFC 8693 §4.1)
            act = tokenEndpointResponse.id_token ? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$decode_jwt$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decodeJwt"](tokenEndpointResponse.id_token).act : undefined;
        } catch (err) {
            const oauthErr = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$oauth$2d$error$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["extractOAuthErrorDetails"])(err);
            return [
                new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeError"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeErrorCode"].EXCHANGE_FAILED, "There was an error trying to exchange the token.", new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["OAuth2Error"]({
                    code: oauthErr.error ?? "unknown_error",
                    message: oauthErr.error_description ?? err.message
                })),
                null
            ];
        }
        // Map response: snake_case → camelCase
        return [
            null,
            {
                accessToken: tokenEndpointResponse.access_token,
                idToken: tokenEndpointResponse.id_token,
                refreshToken: tokenEndpointResponse.refresh_token,
                tokenType: tokenEndpointResponse.token_type ?? "Bearer",
                expiresIn: Number(tokenEndpointResponse.expires_in),
                scope: tokenEndpointResponse.scope,
                act
            }
        ];
    }
    /**
     * Requests a Session Transfer Token (STT) via Custom Token Exchange.
     *
     * The STT is a one-shot, ~60s token that lets an authenticated agent establish
     * a web session **as the customer** in a target app — without the customer's password.
     * Pass the result to `buildSessionTransferRedirect` to start the redirect.
     *
     * The SDK fills in `audience`, `grant_type`, `actor_token`, and `actor_token_type`.
     * The actor is sourced from the agent session's ID token. The token must be an
     * unexpired, asymmetrically-signed (RS256/PS256) JWT — the server rejects HS256
     * or expired actor tokens. If the session ID token is expired and a refresh token
     * is present the SDK silently refreshes it first; if no refresh token is available
     * the exchange fails client-side with `ACTOR_UNAVAILABLE`. If that refresh itself
     * requires MFA step-up, the error is `[MfaRequiredError, null, null]` — same as any
     * other refresh-triggered step-up — rather than being collapsed into `ACTOR_UNAVAILABLE`.
     * On Multiple Custom Domains (MCD) tenants, a session created for a different domain than
     * the current request is never used as the actor source (`ACTOR_UNAVAILABLE`) — this holds
     * even if the caller bypasses `Auth0Client`'s own domain check on session read.
     * Precedence: explicit `options.actor` → session ID token (refreshed if stale) → throws `ACTOR_UNAVAILABLE`.
     *
     * **The STT is never cached.** Use it immediately with `buildSessionTransferRedirect`.
     *
     * @param options - STT exchange options
     * @param session - The agent's current session, used to source the actor token
     * @returns A tuple of `[error, null, null]` or `[null, SessionTransferTokenResult, updatedSession]`.
     * `updatedSession` is non-null only when the agent's ID token was refreshed to resolve the
     * actor — the caller (`Auth0Client.requestSessionTransferToken`) MUST persist it back to the
     * session store, or the agent's session cookie will hold a stale refresh token once refresh
     * token rotation consumes it.
     *
     * @example
     * ```typescript
     * const session = await this.getSession();
     * const [error, result, updatedSession] = await authClient.requestSessionTransferToken(
     *   { subjectToken, subjectTokenType: "urn:acme:subject" },
     *   session
     * );
     * ```
     */ async requestSessionTransferToken(options, session) {
        await this.ensureDpopValidated();
        // Validate subjectToken
        if (!options.subjectToken || options.subjectToken.trim() === "") {
            return [
                new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeError"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeErrorCode"].MISSING_SUBJECT_TOKEN, "The subject_token is required and cannot be empty."),
                null,
                null
            ];
        }
        // Validate subjectTokenType
        const tokenTypeError = this.validateSubjectTokenType(options.subjectTokenType);
        if (tokenTypeError) {
            return [
                tokenTypeError,
                null,
                null
            ];
        }
        // MCD defense-in-depth: refuse to source the actor from a session created for a
        // different domain than the current request. `Auth0Client.requestSessionTransferToken`
        // already enforces this via `getSession()` → `getSessionWithDomainCheck`, but this method
        // can also be called directly with a session read some other way, so the guard is
        // duplicated here rather than relied on solely at the caller. Only applies when the actor
        // is sourced from the session — an explicit `actor` bypasses the session entirely.
        if (!options.actor && session?.internal?.mcd && session.internal.mcd.domain !== this.domain) {
            return [
                new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeError"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeErrorCode"].ACTOR_UNAVAILABLE, `No usable actor token: the agent session was created for domain '${session.internal.mcd.domain}' ` + `but the current request is for domain '${this.domain}'.`),
                null,
                null
            ];
        }
        // Resolve actor — must come before any network call (client-side guard).
        // If the session ID token is expired but a refresh token is available, attempt a
        // silent refresh to get a fresh ID token before giving up with ACTOR_UNAVAILABLE.
        // `refreshedSession`, once set, is returned to the caller so it can persist the new
        // refresh token — #refreshTokenSet only returns the new token set, it does not save it,
        // and refresh token rotation invalidates the old one still sitting in the session cookie.
        //
        // Only attempt this when no explicit `actor` was passed: `resolveActorFromSession` returns
        // the same ACTOR_UNAVAILABLE code whether the cause is a blank explicit actor or a stale
        // session ID token, so we can't distinguish them from the error alone. Gating on
        // `!options.actor` ensures a bad explicit actor never triggers a wasted refresh (or a
        // confusing MfaRequiredError) for a problem refreshing the session can't fix.
        let [actorError, actor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$session$2d$transfer$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["resolveActorFromSession"])(session, options.actor);
        let refreshedSession = null;
        if (!options.actor && actorError && session?.tokenSet?.refreshToken) {
            const [refreshError, refreshed] = await __classPrivateFieldGet(this, _AuthClient_instances, "m", _AuthClient_refreshTokenSet).call(this, session.tokenSet, {
                requestedScope: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DEFAULT_SCOPES"]
            });
            // A step-up challenge on the refresh is a distinct, recoverable case from "no usable
            // actor" — surface it to the caller instead of silently falling through to
            // ACTOR_UNAVAILABLE, which would give the agent no path to complete MFA and retry.
            if (refreshError instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MfaRequiredError"]) {
                return [
                    refreshError,
                    null,
                    null
                ];
            }
            if (!refreshError && refreshed?.updatedTokenSet?.idToken) {
                refreshedSession = {
                    ...session,
                    user: refreshed.idTokenClaims ? refreshed.idTokenClaims : session.user,
                    tokenSet: refreshed.updatedTokenSet
                };
                [actorError, actor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$session$2d$transfer$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["resolveActorFromSession"])(refreshedSession, options.actor);
            }
        }
        if (actorError) {
            return [
                actorError,
                null,
                null
            ];
        }
        // Discover authorization server metadata
        const [discoveryError, authorizationServerMetadata] = await this.discoverAuthorizationServerMetadata();
        if (discoveryError) {
            return [
                new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeError"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeErrorCode"].EXCHANGE_FAILED, "Failed to discover authorization server metadata.", new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["OAuth2Error"]({
                    code: "discovery_error",
                    message: discoveryError.message
                })),
                null,
                null
            ];
        }
        // Build the STT-specific audience: urn:{domain}:session_transfer
        // Use this.domain (the effective domain for this request) so MCD tenants
        // get the correct per-domain audience.
        const audience = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$session$2d$transfer$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["buildSessionTransferAudience"])(this.domain);
        // Merge scopes. offline_access is excluded from the STT default scopes — Auth0
        // silently suppresses it for impersonation sessions, so requesting it here would
        // just be a scope the server ignores.
        const finalScope = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$token$2d$set$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["mergeScopes"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DEFAULT_STT_SCOPES"], options.scope);
        const params = new URLSearchParams();
        params.append("subject_token", options.subjectToken);
        params.append("subject_token_type", options.subjectTokenType);
        params.append("audience", audience);
        params.append("scope", finalScope);
        params.append("actor_token", actor.token);
        params.append("actor_token_type", actor.type);
        if (options.organization) {
            params.append("organization", options.organization);
        }
        if (options.reason) {
            params.append("reason", options.reason);
        }
        if (options.additionalParameters) {
            // Guard against callers overriding parameters the SDK manages — silently
            // shadowing e.g. audience or actor_token would break the STT contract, and
            // organization/reason are already appended above so re-appending them here
            // would produce a duplicate (and ambiguous) query param.
            const reservedParams = new Set([
                "subject_token",
                "subject_token_type",
                "audience",
                "scope",
                "actor_token",
                "actor_token_type",
                "grant_type",
                "organization",
                "reason"
            ]);
            for (const [key, value] of Object.entries(options.additionalParameters)){
                if (reservedParams.has(key)) {
                    continue;
                }
                if (value !== undefined && value !== null) {
                    params.append(key, String(value));
                }
            }
        }
        const dpopHandle = this.useDPoP && this.dpopKeyPair ? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DPoP"](this.clientMetadata, this.dpopKeyPair) : undefined;
        const tokenExchangeMetadata = this.withMtlsEndpoint(authorizationServerMetadata);
        // STT responses carry `token_type: "N_A"` which oauth4webapi's
        // processGenericTokenEndpointResponse rejects. We send the request via
        // genericTokenEndpointRequest and parse the body ourselves.
        const sendExchange = async ()=>{
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["genericTokenEndpointRequest"](tokenExchangeMetadata, this.clientMetadata, await this.getClientAuth(), __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$types$2f$token$2d$vault$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["GRANT_TYPE_CUSTOM_TOKEN_EXCHANGE"], params, {
                [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["customFetch"]]: this.fetch,
                [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["allowInsecureRequests"]]: this.allowInsecureRequests,
                ...dpopHandle && {
                    DPoP: dpopHandle
                }
            });
        };
        // DPoP nonce handling via the shared retry helper (Path 1: it inspects the
        // returned Response for a `use_dpop_nonce` 400 and retries once). The DPoP
        // handle learns the nonce from the `DPoP-Nonce` header automatically, so the
        // resent request carries a valid proof. When DPoP is disabled this is a
        // single pass-through call.
        let httpResponse;
        try {
            httpResponse = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$dpopRetry$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["withDPoPNonceRetry"])(sendExchange, {
                isDPoPEnabled: !!(this.useDPoP && dpopHandle),
                ...this.dpopOptions?.retry
            });
        } catch (err) {
            const oauthErr = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$oauth$2d$error$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["extractOAuthErrorDetails"])(err);
            const errorCode = oauthErr.error ?? "unknown_error";
            const sttCode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$session$2d$transfer$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["mapSttServerError"])(errorCode);
            return [
                new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeError"](sttCode ?? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeErrorCode"].EXCHANGE_FAILED, oauthErr.error_description ?? "There was an error trying to exchange the token for a Session Transfer Token.", new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["OAuth2Error"]({
                    code: errorCode,
                    message: oauthErr.error_description ?? err.message
                })),
                null,
                null
            ];
        }
        // Parse the raw JSON response ourselves — bypasses oauth4webapi's
        // token_type allowlist which blocks "N_A".
        // Fall back to text() when the body is not JSON (e.g. plain-text gateway errors)
        // so the status code and raw message are preserved in the error.
        let rawBody;
        try {
            rawBody = await httpResponse.json();
        } catch  {
            let rawText = "";
            try {
                rawText = await httpResponse.text();
            } catch  {
            // ignore — body already consumed or unreadable
            }
            return [
                new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeError"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeErrorCode"].EXCHANGE_FAILED, `Failed to parse the Session Transfer Token response body (HTTP ${httpResponse.status}).${rawText ? " " + rawText : ""}`),
                null,
                null
            ];
        }
        // Surface server-side errors (4xx/5xx with error field)
        if (!httpResponse.ok || rawBody?.error) {
            const errorCode = rawBody?.error ?? "unknown_error";
            const sttCode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$session$2d$transfer$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["mapSttServerError"])(errorCode);
            return [
                new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeError"](sttCode ?? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeErrorCode"].EXCHANGE_FAILED, rawBody?.error_description ?? "There was an error trying to exchange the token for a Session Transfer Token.", new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["OAuth2Error"]({
                    code: errorCode,
                    message: rawBody?.error_description ?? errorCode
                })),
                null,
                null
            ];
        }
        // The spec requires branching on issued_token_type to identify an STT.
        // Reject any response where it is missing or not the STT URN — a plain Bearer
        // access-token response must never be mistaken for a session transfer token.
        if (rawBody.issued_token_type !== __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$types$2f$token$2d$vault$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["TOKEN_TYPES"].SESSION_TRANSFER_TOKEN) {
            return [
                new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeError"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeErrorCode"].EXCHANGE_FAILED, `Unexpected issued_token_type: "${rawBody.issued_token_type ?? "(missing)"}". Expected "${__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$types$2f$token$2d$vault$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["TOKEN_TYPES"].SESSION_TRANSFER_TOKEN}".`),
                null,
                null
            ];
        }
        // STT never decoded, never cached — treat as opaque handle
        return [
            null,
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$session$2d$transfer$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["parseSessionTransferTokenResponse"])({
                access_token: rawBody.access_token,
                issued_token_type: rawBody.issued_token_type,
                expires_in: rawBody.expires_in,
                token_type: rawBody.token_type
            }),
            refreshedSession
        ];
    }
    /**
     * Builds the redirect URL that carries the STT to the target app's login route.
     *
     * Returns a `NextResponse` redirect to
     * `targetLoginUrl?session_transfer_token=<encoded>(&organization=…)`.
     *
     * This is a pure URL builder — no network call, nothing written to session.
     * The STT is one-shot; use this immediately after `requestSessionTransferToken`.
     *
     * @param targetLoginUrl - The target app's login URL (e.g. `https://app.example.com/auth/login`).
     *   Must be a trusted, app-controlled value. Never derive this from untrusted input.
     * @param result - The `SessionTransferTokenResult` from `requestSessionTransferToken`
     * @param opts - Optional overrides
     * @param opts.organization - Org ID/name to append; use the same value passed to `requestSessionTransferToken`
     *
     * @example
     * ```typescript
     * const redirect = authClient.buildSessionTransferRedirect(
     *   "https://app.example.com/auth/login",
     *   result,
     *   { organization: "org_abc123" }
     * );
     * return redirect;
     * ```
     */ buildSessionTransferRedirect(targetLoginUrl, result, opts) {
        const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$session$2d$transfer$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["buildSessionTransferRedirectUrl"])(targetLoginUrl, result.sessionTransferToken, opts);
        return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(url);
    }
    /**
     * Filters and processes ID token claims for a session.
     *
     * If a `beforeSessionSaved` callback is configured, it will be invoked to allow
     * custom processing of the session and ID token. Otherwise, default filtering
     * will be applied to remove standard ID token claims from the user object.
     */ async finalizeSession(session, idToken) {
        if (this.beforeSessionSaved) {
            const updatedSession = await this.beforeSessionSaved(session, idToken ?? null);
            session = {
                ...updatedSession,
                internal: session.internal
            };
        } else {
            session.user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$user$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["filterDefaultIdTokenClaims"])(session.user);
        }
        return session;
    }
    /**
     * Initiates the connect account flow for linking a third-party account to the user's profile.
     * The user will be redirected to authorize the connection.
     */ async connectAccount(options, req) {
        const appBaseUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$app$2d$base$2d$url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["resolveAppBaseUrl"])(this.appBaseUrl, req);
        const redirectUri = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["createRouteUrl"])(this.routes.callback, appBaseUrl).toString();
        let returnTo = this.signInReturnToPath;
        // Validate returnTo parameter
        if (options.returnTo) {
            const safeBaseUrl = new URL(appBaseUrl);
            const sanitizedReturnTo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$url$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["toSafeRedirect"])(options.returnTo, safeBaseUrl);
            if (sanitizedReturnTo) {
                returnTo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$transaction$2d$store$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["clampReturnTo"])(sanitizedReturnTo.pathname + sanitizedReturnTo.search + sanitizedReturnTo.hash, this.signInReturnToPath);
            }
        }
        // Generate PKCE challenges
        const codeChallengeMethod = "S256";
        const codeVerifier = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["generateRandomCodeVerifier"]();
        const codeChallenge = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["calculatePKCECodeChallenge"](codeVerifier);
        const state = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["generateRandomState"]();
        const [error, connectAccountResponse] = await this.createConnectAccountTicket({
            tokenSet: options.tokenSet,
            connection: options.connection,
            redirectUri,
            state,
            codeChallenge,
            codeChallengeMethod,
            scopes: options.scopes,
            authorizationParams: options.authorizationParams
        });
        if (error) {
            return [
                error,
                null
            ];
        }
        const transactionState = {
            codeVerifier,
            responseType: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$types$2f$connected$2d$accounts$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["RESPONSE_TYPES"].CONNECT_CODE,
            state,
            returnTo,
            authSession: connectAccountResponse.authSession
        };
        const res = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(`${connectAccountResponse.connectUri}?ticket=${encodeURIComponent(connectAccountResponse.connectParams.ticket)}`);
        await this.transactionStore.save(res.cookies, transactionState, req?.cookies);
        return [
            null,
            res
        ];
    }
    async createConnectAccountTicket(options) {
        try {
            const connectAccountUrl = new URL("/me/v1/connected-accounts/connect", this.issuer);
            const fetcher = await this.fetcherFactory({
                useDPoP: this.useDPoP,
                getAccessToken: async ()=>({
                        accessToken: options.tokenSet.accessToken,
                        expiresAt: options.tokenSet.expiresAt || 0,
                        scope: options.tokenSet.scope,
                        token_type: options.tokenSet.token_type
                    }),
                fetch: this.fetch
            });
            const httpOptions = this.httpOptions();
            const headers = new Headers(httpOptions.headers);
            headers.set("Content-Type", "application/json");
            const requestBody = {
                connection: options.connection,
                redirect_uri: options.redirectUri,
                state: options.state,
                code_challenge: options.codeChallenge,
                code_challenge_method: options.codeChallengeMethod,
                scopes: options.scopes,
                authorization_params: options.authorizationParams
            };
            const res = await fetcher.fetchWithAuth(connectAccountUrl.toString(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });
            if (!res.ok) {
                return buildConnectAccountErrorResponse(res, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$my$2d$account$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ConnectAccountErrorCodes"].FAILED_TO_INITIATE);
            }
            const { connect_uri, connect_params, auth_session, expires_in } = await res.json();
            return [
                null,
                {
                    connectUri: connect_uri,
                    connectParams: connect_params,
                    authSession: auth_session,
                    expiresIn: expires_in
                }
            ];
        } catch (e) {
            let message = "An unexpected error occurred while trying to initiate the connect account flow.";
            if (isDPoPError(e)) {
                message = e.message;
            }
            return [
                new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$my$2d$account$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ConnectAccountError"]({
                    code: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$my$2d$account$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ConnectAccountErrorCodes"].FAILED_TO_INITIATE,
                    message: message
                }),
                null
            ];
        }
    }
    async completeConnectAccount(options) {
        const completeConnectAccountUrl = new URL("/me/v1/connected-accounts/complete", this.issuer);
        try {
            const httpOptions = this.httpOptions();
            const headers = new Headers(httpOptions.headers);
            headers.set("Content-Type", "application/json");
            const fetcher = await this.fetcherFactory({
                useDPoP: this.useDPoP,
                getAccessToken: async ()=>({
                        accessToken: options.tokenSet.accessToken,
                        expiresAt: options.tokenSet.expiresAt || 0,
                        scope: options.tokenSet.scope,
                        token_type: options.tokenSet.token_type
                    }),
                fetch: this.fetch
            });
            const requestBody = {
                auth_session: options.authSession,
                connect_code: options.connectCode,
                redirect_uri: options.redirectUri,
                code_verifier: options.codeVerifier
            };
            const res = await fetcher.fetchWithAuth(completeConnectAccountUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });
            if (!res.ok) {
                return buildConnectAccountErrorResponse(res, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$my$2d$account$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ConnectAccountErrorCodes"].FAILED_TO_COMPLETE);
            }
            const { id, connection, access_type, scopes, created_at, expires_at } = await res.json();
            return [
                null,
                {
                    id,
                    connection,
                    accessType: access_type,
                    scopes,
                    createdAt: created_at,
                    expiresAt: expires_at
                }
            ];
        } catch (e) {
            return [
                new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$my$2d$account$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ConnectAccountError"]({
                    code: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$my$2d$account$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ConnectAccountErrorCodes"].FAILED_TO_COMPLETE,
                    message: "An unexpected error occurred while trying to complete the connect account flow."
                }),
                null
            ];
        }
    }
    /**
     * Lists the connected accounts for the current user via the My Account API.
     *
     * Handles pagination transparently (the endpoint returns at most 20 accounts
     * per page and an optional `next` token) so the full set is always returned.
     *
     * @see https://auth0.com/docs/api/myaccount/connected-accounts/get-connected-accounts
     */ async listConnectedAccounts(tokenSet) {
        try {
            const fetcher = await this.fetcherFactory({
                useDPoP: this.useDPoP,
                getAccessToken: async ()=>({
                        accessToken: tokenSet.accessToken,
                        expiresAt: tokenSet.expiresAt || 0,
                        scope: tokenSet.scope,
                        token_type: tokenSet.token_type
                    }),
                fetch: this.fetch
            });
            const accounts = [];
            let next;
            // `next` is server-controlled. Guard against a server that echoes the same
            // token or cycles, which would otherwise loop and grow `accounts` without
            // bound on the request thread.
            const seenNext = new Set();
            const MAX_PAGES = 100;
            let pages = 0;
            do {
                if (++pages > MAX_PAGES || next && seenNext.has(next)) {
                    // The server returned a non-terminating cursor (page cap exceeded or
                    // a repeated `next` token). Returning the partial list as success is
                    // unsafe: callers reconcile against it destructively (pruning cached
                    // tokens for omitted accounts, and disconnectAccount would leave
                    // additional matching accounts linked). Fail loudly instead.
                    return [
                        new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$my$2d$account$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ConnectedAccountsError"]({
                            code: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$my$2d$account$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ConnectedAccountsErrorCodes"].FAILED_TO_LIST,
                            message: "Connected-account pagination did not terminate safely."
                        }),
                        null
                    ];
                }
                if (next) {
                    seenNext.add(next);
                }
                const url = new URL("/me/v1/connected-accounts/accounts", this.issuer);
                if (next) {
                    url.searchParams.set("next", next);
                }
                const res = await fetcher.fetchWithAuth(url.toString(), {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                if (!res.ok) {
                    return buildConnectedAccountsErrorResponse(res, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$my$2d$account$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ConnectedAccountsErrorCodes"].FAILED_TO_LIST);
                }
                const body = await res.json();
                for (const account of body.accounts ?? []){
                    accounts.push({
                        id: account.id,
                        connection: account.connection,
                        accessType: account.access_type,
                        scopes: account.scopes,
                        createdAt: account.created_at,
                        expiresAt: account.expires_at,
                        orgId: account.org_id
                    });
                }
                next = body.next;
            }while (next)
            return [
                null,
                accounts
            ];
        } catch (e) {
            let message = "An unexpected error occurred while trying to list the connected accounts.";
            if (isDPoPError(e)) {
                message = e.message;
            }
            return [
                new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$my$2d$account$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ConnectedAccountsError"]({
                    code: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$my$2d$account$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ConnectedAccountsErrorCodes"].FAILED_TO_LIST,
                    message
                }),
                null
            ];
        }
    }
    /**
     * Deletes a single connected account by its id via the My Account API.
     *
     * Accepts a pre-built fetcher so callers (e.g. `disconnectAccount`) can reuse
     * a single fetcher across multiple deletes. With DPoP enabled, a new fetcher
     * starts without a nonce and pays a `use_dpop_nonce` rejection + retry on the
     * first request; reusing the fetcher amortises that to one round-trip total
     * instead of one per account.
     *
     * @see https://auth0.com/docs/api/myaccount/connected-accounts/delete-connected-account
     */ async deleteConnectedAccount(fetcher, id) {
        try {
            const url = new URL(`/me/v1/connected-accounts/accounts/${encodeURIComponent(id)}`, this.issuer);
            const res = await fetcher.fetchWithAuth(url.toString(), {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!res.ok) {
                return buildConnectedAccountsErrorResponse(res, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$my$2d$account$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ConnectedAccountsErrorCodes"].FAILED_TO_DELETE);
            }
            return [
                null,
                null
            ];
        } catch (e) {
            let message = "An unexpected error occurred while trying to delete the connected account.";
            if (isDPoPError(e)) {
                message = e.message;
            }
            return [
                new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$my$2d$account$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ConnectedAccountsError"]({
                    code: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$my$2d$account$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ConnectedAccountsErrorCodes"].FAILED_TO_DELETE,
                    message
                }),
                null
            ];
        }
    }
    /**
     * Disconnects all connected accounts for the given connection.
     *
     * Resolves the connection name to the connected-account id(s) via the list
     * endpoint (the delete endpoint is keyed by id), then deletes each. The
     * operation is idempotent: if the server reports no accounts for the
     * connection, it returns the empty list without error so callers can still
     * reconcile local state.
     */ async disconnectAccount(tokenSet, connection) {
        const [listError, accounts] = await this.listConnectedAccounts(tokenSet);
        if (listError) {
            return [
                listError,
                null
            ];
        }
        const matching = accounts.filter((account)=>account.connection === connection);
        if (matching.length === 0) {
            return [
                null,
                []
            ];
        }
        // Build the fetcher once and reuse it across every DELETE. With DPoP
        // enabled, per-account fetchers would each start with an empty nonce cache
        // and pay a `use_dpop_nonce` rejection + retry — turning N deletes into 2N
        // requests. `listConnectedAccounts` already does this for pagination.
        const fetcher = await this.fetcherFactory({
            useDPoP: this.useDPoP,
            getAccessToken: async ()=>({
                    accessToken: tokenSet.accessToken,
                    expiresAt: tokenSet.expiresAt || 0,
                    scope: tokenSet.scope,
                    token_type: tokenSet.token_type
                }),
            fetch: this.fetch
        });
        const removed = [];
        for (const account of matching){
            const [deleteError] = await this.deleteConnectedAccount(fetcher, account.id);
            if (deleteError) {
                return [
                    deleteError,
                    null
                ];
            }
            removed.push(account);
        }
        return [
            null,
            removed
        ];
    }
    async getOpenIdClientConfig() {
        const [discoveryError, authorizationServerMetadata] = await this.discoverAuthorizationServerMetadata();
        if (discoveryError) {
            return [
                discoveryError,
                null
            ];
        }
        const openidClientConfig = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$openid$2d$client$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Configuration"](authorizationServerMetadata, this.clientMetadata.client_id, {
            use_mtls_endpoint_aliases: this.useMtls
        }, await this.getClientAuth());
        const httpOpts = this.httpOptions();
        const telemetryHeaders = new Headers(httpOpts.headers);
        openidClientConfig[__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$openid$2d$client$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["customFetch"]] = (...args)=>{
            const headers = new Headers(args[1].headers);
            return this.fetch(args[0], {
                ...args[1],
                body: args[1].body,
                headers: new Headers([
                    ...telemetryHeaders,
                    ...headers
                ])
            });
        };
        openidClientConfig.timeout = this.httpTimeout;
        if (this.allowInsecureRequests) {
            __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$openid$2d$client$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["allowInsecureRequests"](openidClientConfig);
        }
        return [
            null,
            openidClientConfig
        ];
    }
    /**
     * Creates a new Fetcher instance with DPoP support and authentication capabilities.
     *
     * This method creates fetcher-scoped DPoP handles via `oauth.DPoP(this.clientMetadata, this.dpopKeyPair!)`.
     * Each fetcher instance maintains its own DPoP nonce state for isolation and security.
     * It is recommended to create fetchers at module level and reuse them across requests
     *
     * @example Recommended fetcher reuse pattern
     * ```typescript
     * const managementApi = await auth0.fetcherFactory({
     *   baseUrl: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
     *   session: await getSession(req, res)
     * });
     *
     * // Use the same fetcher for multiple requests
     * const users = await managementApi.get('users');
     * const roles = await managementApi.get('roles');
     * ```
     *
     * **DPoP Nonce Management:**
     * - Each fetcher learns and caches nonces from the authorization server
     * - Failed nonce validation triggers automatic retry with updated nonce
     * - Nonce state is isolated between fetcher instances for security
     *
     * @param options Configuration options for the fetcher
     * @returns Promise resolving to a configured Fetcher instance
     * @throws {DPoPError} When DPoP is enabled but no keypair is configured
     */ async fetcherFactory(options) {
        await this.ensureDpopValidated();
        if (this.useDPoP && !this.dpopKeyPair) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$dpop$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DPoPError"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$dpop$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DPoPErrorCode"].DPOP_CONFIGURATION_ERROR, "DPoP is enabled but no keypair is configured.");
        }
        // Ensure authorization server metadata is available for oauth4webapi
        const [discoveryError, _authorizationServerMetadata] = await this.discoverAuthorizationServerMetadata();
        if (discoveryError) {
            throw discoveryError;
        }
        const shouldUseDpop = this.useDPoP && (options.useDPoP ?? true);
        const fetcherConfig = {
            // Fetcher-scoped DPoP handle and nonce management
            dpopHandle: shouldUseDpop ? options.dpopHandle ?? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DPoP"](this.clientMetadata, this.dpopKeyPair) : undefined,
            httpOptions: this.httpOptions,
            allowInsecureRequests: this.allowInsecureRequests,
            retryConfig: this.dpopOptions?.retry,
            fetch: options.fetch,
            getAccessToken: options.getAccessToken,
            baseUrl: options.baseUrl
        };
        const fetcherHooks = {
            getAccessToken: options.getAccessToken,
            isDpopEnabled: ()=>shouldUseDpop
        };
        return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$fetcher$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["Fetcher"](fetcherConfig, fetcherHooks);
    }
    /**
     * List enrolled MFA authenticators, filtered by allowed challenge types.
     *
     * @param encryptedToken - Encrypted MFA token from MfaRequiredError
     * @returns Array of authenticators (snake_case ApiResponse format) filtered by mfa_requirements
     * @throws {MfaTokenInvalidError} If token cannot be decrypted
     * @throws {MfaTokenExpiredError} If token expired (>5 min)
     * @throws {MfaGetAuthenticatorsError} On Auth0 API failure
     */ async mfaGetAuthenticators(encryptedToken) {
        // Decrypt token to extract context
        const context = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decryptMfaToken"])(encryptedToken, this.sessionStore.secret);
        // Extract raw mfaToken for Auth0 API call
        const mfaToken = context.mfaToken;
        const endpoint = new URL("/mfa/authenticators", this.issuer).toString();
        const httpOptions = this.httpOptions();
        httpOptions.headers.set("Authorization", `Bearer ${mfaToken}`);
        try {
            const response = await this.fetch(endpoint, {
                method: "GET",
                ...httpOptions
            });
            if (!response.ok) {
                const errorBody = await response.json().catch(()=>({
                        error: "unknown_error",
                        error_description: "Failed to retrieve authenticators"
                    }));
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MfaGetAuthenticatorsError"](errorBody.error || "unknown_error", errorBody.error_description || "Failed to retrieve authenticators", errorBody.error ? errorBody : undefined);
            }
            const authenticators = await response.json();
            // Filter by allowed challenge types from mfa_requirements
            const allowedTypes = new Set((context.mfaRequirements?.challenge ?? []).map((c)=>c.type.toLowerCase()));
            // If no challenge types specified, return all (no filtering)
            if (allowedTypes.size === 0) {
                return authenticators;
            }
            // Filter authenticators by type field
            return authenticators.filter((auth)=>auth.type && allowedTypes.has(auth.type.toLowerCase()));
        } catch (e) {
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MfaGetAuthenticatorsError"]) throw e;
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MfaGetAuthenticatorsError"]("unexpected_error", "Unexpected error during authenticator retrieval", undefined);
        }
    }
    /**
     * Initiate an MFA challenge.
     *
     * @param encryptedToken - Encrypted MFA token from MfaRequiredError
     * @param challengeType - Challenge type (otp, oob)
     * @param authenticatorId - Optional authenticator ID
     * @returns Challenge response (snake_case ApiResponse format)
     * @throws {MfaTokenInvalidError} If token cannot be decrypted
     * @throws {MfaTokenExpiredError} If token expired
     * @throws {MfaNoAvailableFactorsError} If no challenge types available
     * @throws {MfaChallengeError} On Auth0 API failure
     */ async mfaChallenge(encryptedToken, challengeType, authenticatorId) {
        // Decrypt token to extract context
        const context = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decryptMfaToken"])(encryptedToken, this.sessionStore.secret);
        // Validate mfaRequirements has challenge types only when requirements are present.
        // When mfa_requirements is absent (e.g. webauthn grant), all challenge types are allowed.
        if (context.mfaRequirements?.challenge) {
            const allowedTypes = new Set(context.mfaRequirements.challenge.map((c)=>c.type.toLowerCase()));
            if (allowedTypes.size === 0) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MfaNoAvailableFactorsError"]("No MFA challenge types available in mfa_requirements");
            }
            if (!allowedTypes.has(challengeType.toLowerCase())) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MfaNoAvailableFactorsError"](`Challenge type "${challengeType}" is not allowed by mfa_requirements. Allowed: ${[
                    ...allowedTypes
                ].join(", ")}`);
            }
        }
        // Extract raw mfaToken for Auth0 API call
        const mfaToken = context.mfaToken;
        const endpoint = new URL("/mfa/challenge", this.issuer).toString();
        const httpOptions = this.httpOptions();
        httpOptions.headers.set("Content-Type", "application/json");
        try {
            const body = {
                client_id: this.clientMetadata.client_id,
                challenge_type: challengeType,
                mfa_token: mfaToken
            };
            if (this.clientSecret) {
                body.client_secret = this.clientSecret;
            }
            if (authenticatorId) {
                body.authenticator_id = authenticatorId;
            }
            const response = await this.fetch(endpoint, {
                method: "POST",
                body: JSON.stringify(body),
                ...httpOptions
            });
            if (!response.ok) {
                const errorBody = await response.json().catch(()=>({
                        error: "unknown_error",
                        error_description: "Failed to initiate MFA challenge"
                    }));
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MfaChallengeError"](errorBody.error || "unknown_error", errorBody.error_description || "Failed to initiate MFA challenge", errorBody.error ? errorBody : undefined);
            }
            const result = await response.json();
            return result;
        } catch (e) {
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MfaChallengeError"]) throw e;
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MfaChallengeError"]("unexpected_error", "Unexpected error during MFA challenge", undefined);
        }
    }
    /**
     * Enroll a new MFA authenticator during initial MFA setup.
     * First-time enrollment only (requires mfa_token, not access token).
     *
     * @param encryptedToken - Encrypted MFA token from MfaRequiredError
     * @param options - Enrollment options (otp | oob | email)
     * @returns Enrollment response (snake_case ApiResponse format) with authenticator details and optional recovery codes
     * @throws {MfaTokenInvalidError} If token cannot be decrypted
     * @throws {MfaTokenExpiredError} If token expired
     * @throws {MfaEnrollmentError} On Auth0 API failure
     */ async mfaAssociate(encryptedToken, options) {
        // Decrypt token to extract context
        const context = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decryptMfaToken"])(encryptedToken, this.sessionStore.secret);
        // Extract raw mfaToken for Auth0 API call
        const mfaToken = context.mfaToken;
        const endpoint = new URL(`/mfa/associate`, this.issuer).toString();
        const httpOptions = this.httpOptions();
        httpOptions.headers.set("Authorization", `Bearer ${mfaToken}`);
        httpOptions.headers.set("Content-Type", "application/json");
        // Build request body based on enrollment type
        const body = {
            authenticator_types: options.authenticatorTypes
        };
        // Add type-specific fields with type narrowing
        if ("oobChannels" in options) {
            const oobOptions = options;
            body.oob_channels = oobOptions.oobChannels;
            if (oobOptions.phoneNumber) {
                body.phone_number = oobOptions.phoneNumber;
            }
            if (oobOptions.email) {
                body.email = oobOptions.email;
            }
        }
        try {
            const response = await this.fetch(endpoint, {
                method: "POST",
                body: JSON.stringify(body),
                ...httpOptions
            });
            if (!response.ok) {
                const errorBody = await response.json().catch(()=>({
                        error: "unknown_error",
                        error_description: "Failed to enroll authenticator"
                    }));
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MfaEnrollmentError"](errorBody.error || "unknown_error", errorBody.error_description || "Failed to enroll authenticator", errorBody.error ? errorBody : undefined);
            }
            const result = await response.json();
            return result;
        } catch (e) {
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MfaEnrollmentError"]) throw e;
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MfaEnrollmentError"]("unexpected_error", "Unexpected error during MFA enrollment", undefined);
        }
    }
    /**
     * Verify MFA code and complete authentication.
     * Returns tokens without session persistence.
     *
     * @param options - Verification options (otp | oobCode+bindingCode | recoveryCode)
     * @returns Token response
     * @throws {MfaVerifyError} On API failure
     * @throws {MfaRequiredError} For chained MFA (with encrypted token)
     */ async mfaVerify(options) {
        await this.ensureDpopValidated();
        // Decrypt token to extract context
        const { mfaToken, audience, scope } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decryptMfaToken"])(options.mfaToken, this.sessionStore.secret);
        const [discoveryError, authorizationServerMetadata] = await this.discoverAuthorizationServerMetadata();
        if (discoveryError) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MfaVerifyError"]("discovery_error", "Failed to discover authorization server metadata", undefined);
        }
        const verifyParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$transform$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["buildVerifyParams"])(options, mfaToken, audience, scope);
        const verifyGrantType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$transform$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["getVerifyGrantType"])(verifyParams);
        // Create DPoP handle ONCE outside the closure so it persists across retries.
        // This is required by RFC 9449: the handle must learn and reuse the nonce from
        // the DPoP-Nonce header across multiple attempts.
        const dpopHandle = this.useDPoP && this.dpopKeyPair ? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DPoP"](this.clientMetadata, this.dpopKeyPair) : undefined;
        // Execute MFA token exchange with DPoP retry support
        const mfaVerifyMetadata = this.withMtlsEndpoint(authorizationServerMetadata);
        let tokenEndpointResponse;
        try {
            tokenEndpointResponse = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$dpopRetry$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["withDPoPNonceRetry"])(async ()=>{
                const httpResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["genericTokenEndpointRequest"](mfaVerifyMetadata, this.clientMetadata, await this.getClientAuth(), verifyGrantType, verifyParams, {
                    ...this.httpOptions(),
                    [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["customFetch"]]: this.fetch,
                    [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["allowInsecureRequests"]]: this.allowInsecureRequests,
                    ...dpopHandle && {
                        DPoP: dpopHandle
                    }
                });
                return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["processGenericTokenEndpointResponse"](mfaVerifyMetadata, this.clientMetadata, httpResponse);
            }, {
                isDPoPEnabled: !!(this.useDPoP && this.dpopKeyPair),
                ...this.dpopOptions?.retry
            });
        } catch (err) {
            const oauthErr = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$oauth$2d$error$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["extractOAuthErrorDetails"])(err);
            // Handle chained MFA (subsequent mfa_required response)
            if (oauthErr.error === "mfa_required" || err.error === "mfa_required") {
                // Extract error body from cause for oauth4webapi wrapped errors
                // ResponseBodyError wraps actual error in cause property
                const errorBody = err.cause && typeof err.cause === "object" && !(err.cause instanceof Response) ? err.cause : err;
                // Re-encrypt the new mfaToken for client use
                const encryptedToken = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encryptMfaToken"])(errorBody.mfa_token, audience, scope, errorBody.mfa_requirements, this.sessionStore.secret, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DEFAULT_MFA_CONTEXT_TTL_SECONDS"]);
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MfaRequiredError"](oauthErr.error_description || errorBody.error_description || "Additional MFA factor required", encryptedToken, errorBody.mfa_requirements, new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["OAuth2Error"]({
                    code: "mfa_required",
                    message: oauthErr.error_description || errorBody.error_description
                }));
            }
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MfaVerifyError"](oauthErr.error || "unknown_error", oauthErr.error_description || err.message || "MFA verification failed", oauthErr.error ? {
                error: oauthErr.error,
                error_description: oauthErr.error_description ?? ""
            } : undefined);
        }
        const result = {
            ...tokenEndpointResponse,
            token_type: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$token$2d$set$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["normalizeTokenType"])(tokenEndpointResponse.token_type)
        };
        return result;
    }
    /**
     * Cache access token from MFA verification in session.
     *
     * @param tokenResponse - Token response from mfaVerify
     * @param encryptedMfaToken - Encrypted MFA token containing context
     * @param reqCookies - Request cookies for session retrieval
     * @param resCookies - Response cookies for session persistence
     * @throws {MfaVerifyError} If session not found
     */ async cacheTokenFromMfaVerify(tokenResponse, encryptedMfaToken, reqCookies, resCookies) {
        const { error: sessionError, session } = await this.getSessionWithDomainCheck(reqCookies);
        if (sessionError || !session) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MfaVerifyError"](sessionError?.code ?? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AccessTokenErrorCode"].MISSING_SESSION, sessionError?.message ?? "The user does not have an active session.");
        }
        // Decrypt token to extract audience and the requested scope
        const { audience, scope: requestedScope } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decryptMfaToken"])(encryptedMfaToken, this.sessionStore.secret);
        session.accessTokens = session.accessTokens || [];
        const newAccessTokenSet = {
            accessToken: tokenResponse.access_token,
            scope: tokenResponse.scope,
            requestedScope,
            // oauth4webapi TokenEndpointResponse does NOT include audience field
            audience: audience || "",
            expiresAt: Math.floor(Date.now() / 1000) + Number(tokenResponse.expires_in),
            token_type: tokenResponse.token_type
        };
        // Replace an existing token for the same audience AND scope, or append a
        // new one. Without this, each MFA step-up appends another full token set —
        // growing the session cookie unbounded (and eventually a 431). The key is
        // audience + normalized scope (not audience alone), so a differently-scoped
        // step-up for the same audience does not evict a still-useful entry.
        //
        // The match is exact normalized-set equality on requestedScope (with a
        // fallback to granted `scope` for legacy entries). `findAccessTokenSet`
        // does a looser superset match via `compareScopes`; the two rules do NOT
        // agree. Consequences of the divergence:
        // - `findAccessTokenSet` may return a wider entry to satisfy a narrower
        //   request (superset match on read), while this dedup keeps them as
        //   separate entries (exact match on write).
        // - Per audience, the session can accumulate up to one entry per distinct
        //   normalized-scope set. Bounded per session, but looser than
        //   `findAccessTokenSet` would suggest.
        // Aligning to `compareScopes` here would be a behaviour change (wide
        // entries would evict narrower ones), which is out of scope for this fix.
        // See also `mergePopupTokenIntoSession` (session-helpers.ts) which uses a
        // third rule — keyed on audience alone — pre-existing on main.
        //
        // Key on the requested scope (always present, with a fallback to the
        // granted scope for legacy entries): the granted `scope` may be reduced or
        // omitted by the server, which would otherwise collide distinct requests.
        const normalizeScope = (scope)=>(scope ?? "").trim().split(/\s+/).filter(Boolean).sort().join(" ");
        const newScope = normalizeScope(newAccessTokenSet.requestedScope ?? newAccessTokenSet.scope);
        // Remove ALL existing entries for this audience + scope (not just the first)
        // so sessions that accumulated duplicates before this fix deployed are
        // compacted on the next step-up. Best-effort for legacy entries: those have
        // no `requestedScope` and fall back to the granted `scope`, so if the server
        // reduced scope, a legacy entry's fallback key may not match a new request's
        // requestedScope key and it will be retained alongside the new entry.
        session.accessTokens = session.accessTokens.filter((t)=>!(t.audience === newAccessTokenSet.audience && normalizeScope(t.requestedScope ?? t.scope) === newScope));
        session.accessTokens.push(newAccessTokenSet);
        // Persist updated session
        await this.sessionStore.set(reqCookies, resCookies, session);
    }
    // ---------------------------------------------------------------------------
    // Passkey core methods
    // ---------------------------------------------------------------------------
    /**
     * Request a WebAuthn credential creation challenge for new user signup.
     * Calls Auth0 POST /passkey/register.
     */ async passkeyRegister(options) {
        const url = new URL("/passkey/register", this.issuer).toString();
        const httpOptions = this.httpOptions();
        httpOptions.headers.set("Content-Type", "application/json");
        const body = {
            client_id: this.clientMetadata.client_id
        };
        if (this.clientSecret) {
            body.client_secret = this.clientSecret;
        }
        // Build user_profile from provided identity fields
        const userProfile = {};
        if (options?.name) userProfile.name = options.name;
        if (options?.email) userProfile.email = options.email;
        if (options?.username) userProfile.username = options.username;
        if (options?.phoneNumber) userProfile.phone_number = options.phoneNumber;
        if (options?.givenName) userProfile.given_name = options.givenName;
        if (options?.familyName) userProfile.family_name = options.familyName;
        if (options?.nickname) userProfile.nickname = options.nickname;
        if (options?.picture) userProfile.picture = options.picture;
        body.user_profile = userProfile;
        if (options?.userMetadata) body.user_metadata = options.userMetadata;
        if (options?.connection) body.realm = options.connection;
        if (options?.organization) body.organization = options.organization;
        try {
            const response = await this.fetch(url, {
                method: "POST",
                body: JSON.stringify(body),
                ...httpOptions
            });
            if (!response.ok) {
                const errorBody = await response.json().catch(()=>({
                        error: "unknown_error",
                        error_description: "Failed to get passkey signup challenge"
                    }));
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasskeyRegisterError"](errorBody.error || "unknown_error", errorBody.error_description || "Failed to get passkey signup challenge", errorBody.error ? errorBody : undefined);
            }
            const result = await response.json();
            return {
                authSession: result.auth_session,
                authnParamsPublicKey: result.authn_params_public_key
            };
        } catch (e) {
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasskeyRegisterError"]) throw e;
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasskeyRegisterError"]("unexpected_error", "Unexpected error during passkey signup challenge", undefined);
        }
    }
    /**
     * Request a WebAuthn credential assertion challenge for login.
     * Calls Auth0 POST /passkey/challenge.
     */ async passkeyChallenge(options) {
        const url = new URL("/passkey/challenge", this.issuer).toString();
        const httpOptions = this.httpOptions();
        httpOptions.headers.set("Content-Type", "application/json");
        const body = {
            client_id: this.clientMetadata.client_id
        };
        if (this.clientSecret) {
            body.client_secret = this.clientSecret;
        }
        if (options?.connection) body.realm = options.connection;
        if (options?.organization) body.organization = options.organization;
        try {
            const response = await this.fetch(url, {
                method: "POST",
                body: JSON.stringify(body),
                ...httpOptions
            });
            if (!response.ok) {
                const errorBody = await response.json().catch(()=>({
                        error: "unknown_error",
                        error_description: "Failed to get passkey login challenge"
                    }));
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasskeyChallengeError"](errorBody.error || "unknown_error", errorBody.error_description || "Failed to get passkey login challenge", errorBody.error ? errorBody : undefined);
            }
            const result = await response.json();
            return {
                authSession: result.auth_session,
                authnParamsPublicKey: result.authn_params_public_key
            };
        } catch (e) {
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasskeyChallengeError"]) throw e;
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasskeyChallengeError"]("unexpected_error", "Unexpected error during passkey login challenge", undefined);
        }
    }
    /**
     * Complete a passkey signup or login by exchanging the WebAuthn assertion for a session.
     * Calls Auth0 POST /oauth/token with the WebAuthn grant type.
     */ async passkeyGetToken(options, reqCookies, resCookies) {
        await this.ensureDpopValidated();
        const [discoveryError, authorizationServerMetadata] = await this.discoverAuthorizationServerMetadata();
        if (discoveryError) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasskeyGetTokenError"]("discovery_error", "Failed to discover authorization server metadata", undefined);
        }
        const scope = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$scope$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["getScopeForAudience"])(this.authorizationParameters.scope, this.authorizationParameters.audience) || __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DEFAULT_SCOPES"];
        // Auth0's passkey token endpoint requires a JSON body because authn_response
        // is a nested object — URLSearchParams would stringify it, causing a 400.
        // This means we cannot use oauth.genericTokenEndpointRequest (which only
        // sends URLSearchParams), so DPoP must be attached manually via the handle's
        // internal addProof method.
        const passkeyTokenMetadata = this.withMtlsEndpoint(authorizationServerMetadata);
        const tokenUrl = passkeyTokenMetadata.token_endpoint ?? new URL("/oauth/token", this.issuer).toString();
        const jsonBody = {
            grant_type: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$types$2f$passkey$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["GRANT_TYPE_PASSKEY"],
            client_id: this.clientMetadata.client_id,
            auth_session: options.authSession,
            authn_response: options.authResponse,
            scope
        };
        if (this.clientSecret) jsonBody.client_secret = this.clientSecret;
        if (this.authorizationParameters.audience) jsonBody.audience = this.authorizationParameters.audience;
        if (options.connection) jsonBody.realm = options.connection;
        if (options.organization) jsonBody.organization = options.organization;
        // Create DPoP handle once outside the retry closure so the handle can
        // learn and reuse the server-issued nonce across attempts (RFC 9449).
        const dpopHandle = this.useDPoP && this.dpopKeyPair ? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DPoP"](this.clientMetadata, this.dpopKeyPair) : undefined;
        let tokenEndpointResponse;
        try {
            tokenEndpointResponse = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$dpopRetry$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["withDPoPNonceRetry"])(async ()=>{
                const httpOptions = this.httpOptions();
                httpOptions.headers.set("Content-Type", "application/json");
                const url = new URL(tokenUrl);
                // oauth4webapi does not expose addProof/cacheNonce publicly, but they
                // are the only way to attach a DPoP proof to a manually-built JSON
                // request (genericTokenEndpointRequest only sends URLSearchParams).
                if (dpopHandle) {
                    await dpopHandle.addProof(url, httpOptions.headers, "POST");
                }
                const httpResponse = await this.fetch(tokenUrl, {
                    method: "POST",
                    body: JSON.stringify(jsonBody),
                    ...httpOptions
                });
                // Let the handle learn the server-issued nonce from the response so
                // it can be included in the next attempt's proof (RFC 9449 §8).
                // Must happen before processGenericTokenEndpointResponse consumes
                // the body, and before the retry check so the nonce is available on
                // the next attempt even when the response is an error.
                if (dpopHandle) {
                    dpopHandle.cacheNonce(httpResponse, url);
                }
                // Let oauth4webapi process the response — this throws a
                // ResponseBodyError for error responses (including use_dpop_nonce),
                // which withDPoPNonceRetry can detect and retry on.
                return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["processGenericTokenEndpointResponse"](authorizationServerMetadata, this.clientMetadata, httpResponse);
            }, {
                isDPoPEnabled: !!dpopHandle,
                ...this.dpopOptions?.retry
            });
        } catch (err) {
            if (err?.code === __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWT_CLAIM_COMPARISON"]) {
                const claim = err.cause?.claim;
                if (claim === "iss") {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasskeyGetTokenError"]("invalid_issuer", "ID token issuer mismatch. Check AUTH0_DOMAIN configuration.");
                }
                if (claim === "aud") {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasskeyGetTokenError"]("invalid_audience", "ID token audience mismatch. Check AUTH0_CLIENT_ID configuration.");
                }
            }
            const oauthErr = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$oauth$2d$error$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["extractOAuthErrorDetails"])(err);
            await __classPrivateFieldGet(this, _AuthClient_instances, "m", _AuthClient_throwIfMfaRequired).call(this, err, oauthErr, this.authorizationParameters.audience, scope);
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasskeyGetTokenError"](oauthErr.error || "unknown_error", oauthErr.error_description || err.message || "Passkey verification failed", oauthErr.error ? {
                error: oauthErr.error,
                error_description: oauthErr.error_description ?? ""
            } : undefined);
        }
        if (!tokenEndpointResponse.id_token) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasskeyGetTokenError"]("missing_id_token", "No id_token in passkey get-token response. Ensure 'openid' scope is requested.");
        }
        const claims = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$decode_jwt$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decodeJwt"](tokenEndpointResponse.id_token);
        const user = claims;
        let session = {
            user,
            tokenSet: {
                accessToken: tokenEndpointResponse.access_token,
                idToken: tokenEndpointResponse.id_token,
                scope: tokenEndpointResponse.scope,
                refreshToken: tokenEndpointResponse.refresh_token,
                expiresAt: Math.floor(Date.now() / 1000) + Number(tokenEndpointResponse.expires_in),
                token_type: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$token$2d$set$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["normalizeTokenType"])(tokenEndpointResponse.token_type)
            },
            internal: {
                sid: claims.sid || "",
                createdAt: Math.floor(Date.now() / 1000),
                ...this.provider?.isResolverMode && {
                    mcd: {
                        domain: this.domain,
                        issuer: this.issuer
                    }
                }
            }
        };
        session = await this.finalizeSession(session, tokenEndpointResponse.id_token);
        await this.sessionStore.set(reqCookies, resCookies, session, true);
    }
    // ---------------------------------------------------------------------------
    // Passkey route handlers
    // ---------------------------------------------------------------------------
    async handlePasskeyRegister(req) {
        try {
            const body = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$validation$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["parseJsonBody"])(req);
            const bodyRecord = body;
            const options = {};
            if (bodyRecord.email) options.email = bodyRecord.email;
            if (bodyRecord.username) options.username = bodyRecord.username;
            if (bodyRecord.phoneNumber) options.phoneNumber = bodyRecord.phoneNumber;
            if (bodyRecord.name) options.name = bodyRecord.name;
            if (bodyRecord.givenName) options.givenName = bodyRecord.givenName;
            if (bodyRecord.familyName) options.familyName = bodyRecord.familyName;
            if (bodyRecord.nickname) options.nickname = bodyRecord.nickname;
            if (bodyRecord.picture) options.picture = bodyRecord.picture;
            if (bodyRecord.userMetadata) options.userMetadata = bodyRecord.userMetadata;
            if (bodyRecord.connection) options.connection = bodyRecord.connection;
            if (bodyRecord.organization) options.organization = bodyRecord.organization;
            const challenge = await this.passkeyRegister(options);
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json(challenge);
        } catch (e) {
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasskeyRegisterError"]) {
                if (e.error === "unexpected_error") {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: "server_error",
                        error_description: "Internal server error"
                    }, {
                        status: 500
                    });
                }
                return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json(e.toJSON(), {
                    status: 400
                });
            }
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"]) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: e.code,
                    error_description: e.message
                }, {
                    status: 400
                });
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "server_error",
                error_description: "Internal server error"
            }, {
                status: 500
            });
        }
    }
    async handlePasskeyChallenge(req) {
        try {
            const body = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$validation$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["parseJsonBody"])(req);
            const bodyRecord = body;
            const options = {};
            if (typeof bodyRecord.connection === "string") options.connection = bodyRecord.connection;
            if (typeof bodyRecord.organization === "string") options.organization = bodyRecord.organization;
            const challenge = await this.passkeyChallenge(options);
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json(challenge);
        } catch (e) {
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasskeyChallengeError"]) {
                if (e.error === "unexpected_error") {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: "server_error",
                        error_description: "Internal server error"
                    }, {
                        status: 500
                    });
                }
                return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json(e.toJSON(), {
                    status: 400
                });
            }
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"]) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: e.code,
                    error_description: e.message
                }, {
                    status: 400
                });
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "server_error",
                error_description: "Internal server error"
            }, {
                status: 500
            });
        }
    }
    async handlePasskeyGetToken(req) {
        try {
            const body = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$validation$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["parseJsonBody"])(req);
            const bodyRecord = body;
            const authSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$validation$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateStringFieldAndThrow"])(bodyRecord.authSession, "authSession");
            if (!bodyRecord.authResponse || typeof bodyRecord.authResponse !== "object") {
                return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "invalid_request",
                    error_description: "authResponse is required"
                }, {
                    status: 400
                });
            }
            const options = {
                authSession,
                authResponse: bodyRecord.authResponse
            };
            if (typeof bodyRecord.connection === "string") options.connection = bodyRecord.connection;
            if (typeof bodyRecord.organization === "string") options.organization = bodyRecord.organization;
            const res = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true
            });
            await this.passkeyGetToken(options, req.cookies, res.cookies);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["addCacheControlHeadersForSession"])(res);
            return res;
        } catch (e) {
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MfaRequiredError"]) {
                return __classPrivateFieldGet(this, _AuthClient_instances, "m", _AuthClient_createMfaRequiredResponse).call(this, req, null, e);
            }
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasskeyGetTokenError"]) {
                const serverErrorCodes = new Set([
                    "discovery_error",
                    "unexpected_error"
                ]);
                if (serverErrorCodes.has(e.error)) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: "server_error",
                        error_description: "Internal server error"
                    }, {
                        status: 500
                    });
                }
                return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json(e.toJSON(), {
                    status: 403
                });
            }
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"]) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: e.code,
                    error_description: e.message
                }, {
                    status: 400
                });
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "server_error",
                error_description: "Internal server error"
            }, {
                status: 500
            });
        }
    }
    // ---------------------------------------------------------------------------
    // Passkey enrollment route handlers
    // ---------------------------------------------------------------------------
    async handlePasskeyEnrollmentChallenge(req) {
        try {
            const body = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$validation$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["parseJsonBody"])(req);
            const bodyRecord = body;
            const options = {};
            if (typeof bodyRecord.connection === "string") options.connection = bodyRecord.connection;
            if (typeof bodyRecord.userIdentityId === "string") options.userIdentityId = bodyRecord.userIdentityId;
            const challenge = await this.passkeyEnrollmentChallenge(req.cookies, options);
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json(challenge);
        } catch (e) {
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasskeyEnrollmentChallengeError"]) {
                if (e.error === "not_authenticated" || e.error === "token_error") {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json(e.toJSON(), {
                        status: 401
                    });
                }
                if (e.error === "unexpected_error") {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: "server_error",
                        error_description: "Internal server error"
                    }, {
                        status: 500
                    });
                }
                return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json(e.toJSON(), {
                    status: 400
                });
            }
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"]) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: e.code,
                    error_description: e.message
                }, {
                    status: 400
                });
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "server_error",
                error_description: "Internal server error"
            }, {
                status: 500
            });
        }
    }
    async handlePasskeyEnrollmentVerify(req) {
        try {
            const body = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$validation$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["parseJsonBody"])(req);
            const bodyRecord = body;
            const authenticationMethodId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$validation$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateStringFieldAndThrow"])(bodyRecord.authenticationMethodId, "authenticationMethodId");
            const authSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$validation$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["validateStringFieldAndThrow"])(bodyRecord.authSession, "authSession");
            if (!bodyRecord.authResponse || typeof bodyRecord.authResponse !== "object") {
                return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "invalid_request",
                    error_description: "authResponse is required"
                }, {
                    status: 400
                });
            }
            const options = {
                authenticationMethodId,
                authSession,
                authResponse: bodyRecord.authResponse
            };
            const result = await this.passkeyEnrollmentVerify(options, req.cookies);
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json(result);
        } catch (e) {
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasskeyEnrollmentVerifyError"]) {
                if (e.error === "not_authenticated" || e.error === "token_error") {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json(e.toJSON(), {
                        status: 401
                    });
                }
                if (e.error === "unexpected_error") {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: "server_error",
                        error_description: "Internal server error"
                    }, {
                        status: 500
                    });
                }
                return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json(e.toJSON(), {
                    status: 400
                });
            }
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"]) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: e.code,
                    error_description: e.message
                }, {
                    status: 400
                });
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "server_error",
                error_description: "Internal server error"
            }, {
                status: 500
            });
        }
    }
    // ---------------------------------------------------------------------------
    // Passkey enrollment core methods (MyAccount)
    // ---------------------------------------------------------------------------
    async passkeyEnrollmentChallenge(reqCookies, options) {
        const { error: sessionError, session } = await this.getSessionWithDomainCheck(reqCookies);
        if (sessionError || !session) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasskeyEnrollmentChallengeError"]("not_authenticated", sessionError?.message ?? "The user does not have an active session.");
        }
        const [tokenSetError, tokenSetResponse] = await this.getTokenSet(session, {
            audience: `${this.issuer}me/`,
            scope: "create:me:authentication_methods"
        });
        if (tokenSetError) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasskeyEnrollmentChallengeError"]("token_error", "Failed to retrieve MyAccount access token.");
        }
        const { tokenSet } = tokenSetResponse;
        const url = new URL("/me/v1/authentication-methods", this.issuer).toString();
        const httpOptions = this.httpOptions();
        httpOptions.headers.set("Content-Type", "application/json");
        httpOptions.headers.set("Authorization", `Bearer ${tokenSet.accessToken}`);
        const body = {
            type: "passkey"
        };
        if (options?.connection) body.connection = options.connection;
        if (options?.userIdentityId) body.identity = options.userIdentityId;
        try {
            const response = await this.fetch(url, {
                method: "POST",
                body: JSON.stringify(body),
                ...httpOptions
            });
            if (!response.ok) {
                const errorBody = await response.json().catch(()=>({
                        error_description: "Failed to get passkey enrollment challenge"
                    }));
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasskeyEnrollmentChallengeError"](errorBody.error || "unknown_error", errorBody.error_description || "Failed to get passkey enrollment challenge", errorBody.error ? errorBody : undefined);
            }
            const locationHeader = response.headers.get("Location") ?? "";
            const authenticationMethodId = locationHeader.split("/").pop() ?? "";
            if (!authenticationMethodId) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasskeyEnrollmentChallengeError"]("unexpected_error", "No authentication method ID in Location header.");
            }
            const result = await response.json();
            return {
                authenticationMethodId,
                authSession: result.auth_session,
                authnParamsPublicKey: result.authn_params_public_key
            };
        } catch (e) {
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasskeyEnrollmentChallengeError"]) throw e;
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasskeyEnrollmentChallengeError"]("unexpected_error", "Unexpected error during passkey enrollment challenge.");
        }
    }
    async passkeyEnrollmentVerify(options, reqCookies) {
        const { error: sessionError, session } = await this.getSessionWithDomainCheck(reqCookies);
        if (sessionError || !session) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasskeyEnrollmentVerifyError"]("not_authenticated", sessionError?.message ?? "The user does not have an active session.");
        }
        const [tokenSetError, tokenSetResponse] = await this.getTokenSet(session, {
            audience: `${this.issuer}me/`,
            scope: "create:me:authentication_methods"
        });
        if (tokenSetError) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasskeyEnrollmentVerifyError"]("token_error", "Failed to retrieve MyAccount access token.");
        }
        const { tokenSet } = tokenSetResponse;
        const url = new URL(`/me/v1/authentication-methods/${options.authenticationMethodId}/verify`, this.issuer).toString();
        const httpOptions = this.httpOptions();
        httpOptions.headers.set("Content-Type", "application/json");
        httpOptions.headers.set("Authorization", `Bearer ${tokenSet.accessToken}`);
        try {
            const response = await this.fetch(url, {
                method: "POST",
                body: JSON.stringify({
                    auth_session: options.authSession,
                    authn_response: options.authResponse
                }),
                ...httpOptions
            });
            if (!response.ok) {
                const errorBody = await response.json().catch(()=>({
                        error_description: "Failed to verify passkey enrollment"
                    }));
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasskeyEnrollmentVerifyError"](errorBody.error || "unknown_error", errorBody.error_description || "Failed to verify passkey enrollment", errorBody.error ? errorBody : undefined);
            }
            return await response.json();
        } catch (e) {
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasskeyEnrollmentVerifyError"]) throw e;
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passkey$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasskeyEnrollmentVerifyError"]("unexpected_error", "Unexpected error during passkey enrollment verification.");
        }
    }
    /**
     * Creates a new session from a passwordless verify token response.
     * Decodes the id_token to extract user claims, builds SessionData,
     * runs the beforeSessionSaved hook, and persists the session.
     *
     * @param tokenResponse - Token response from passwordlessVerify
     * @param reqCookies - Request cookies for session association
     * @param resCookies - Response cookies for session persistence
     * @throws {PasswordlessVerifyError} If id_token is absent from the response
     */ async createSessionFromPasswordlessVerify(tokenResponse, reqCookies, resCookies) {
        if (!tokenResponse.id_token) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasswordlessVerifyError"]("missing_id_token", "No id_token in passwordless verify response. Ensure 'openid' scope is requested.");
        }
        const claims = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$decode_jwt$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decodeJwt"](tokenResponse.id_token);
        const user = claims;
        let session = {
            user,
            tokenSet: {
                accessToken: tokenResponse.access_token,
                idToken: tokenResponse.id_token,
                scope: tokenResponse.scope,
                refreshToken: tokenResponse.refresh_token,
                expiresAt: Math.floor(Date.now() / 1000) + Number(tokenResponse.expires_in),
                token_type: tokenResponse.token_type
            },
            internal: {
                sid: claims.sid || "",
                createdAt: Math.floor(Date.now() / 1000),
                ...this.provider?.isResolverMode && {
                    mcd: {
                        domain: this.domain,
                        issuer: this.issuer
                    }
                }
            }
        };
        session = await this.finalizeSession(session, tokenResponse.id_token);
        await this.sessionStore.set(reqCookies, resCookies, session, true);
    }
    /**
     * Initiates a passwordless authentication flow by POSTing to `/passwordless/start`.
     * Auth0 sends an OTP code or magic link to the user's email or phone number.
     *
     * When `options.send === 'link'` (magic link), `resCookies` must be provided so
     * the transaction state can be persisted for the callback to resolve. `req` is
     * optional and used for MCD domain resolution and appBaseUrl inference.
     *
     * @param options - Connection type, user identifier, and (for email) delivery method.
     * @param resCookies - Response cookies to write the transaction cookie into (magic link only).
     * @param req - Optional NextRequest for MCD domain resolution and appBaseUrl inference.
     * @throws {PasswordlessStartError} On Auth0 API failure.
     */ async passwordlessStart(options, resCookies, req) {
        // Magic link flow: build authParams (state, redirect_uri, etc.) and save
        // a transaction cookie so /auth/callback can complete the code exchange.
        let magicLinkTransactionState;
        if (options.connection === "email" && "send" in options && options.send === "link") {
            const appBaseUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$app$2d$base$2d$url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["resolveAppBaseUrl"])(this.appBaseUrl, req);
            const redirectUri = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$pathUtils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["createRouteUrl"])(this.routes.callback, appBaseUrl).toString();
            const state = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["generateRandomState"]();
            const nonce = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["generateRandomNonce"]();
            // Preserve tenant-level authorizationParameters (org, acr_values, etc.)
            // but exclude PKCE and fields we set explicitly.
            const MAGIC_LINK_EXCLUDED_PARAMS = [
                "client_id",
                "redirect_uri",
                "response_type",
                "state",
                "nonce",
                "code_challenge",
                "code_challenge_method"
            ];
            const baseParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$authorization$2d$params$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["mergeAuthorizationParamsIntoSearchParams"])(this.authorizationParameters, undefined, MAGIC_LINK_EXCLUDED_PARAMS);
            const audience = this.authorizationParameters.audience;
            const scope = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$scope$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["getScopeForAudience"])(this.authorizationParameters.scope, audience) || "openid email profile";
            options = {
                ...options,
                authParams: {
                    ...Object.fromEntries(baseParams),
                    redirect_uri: redirectUri,
                    response_type: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$types$2f$connected$2d$accounts$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["RESPONSE_TYPES"].CODE,
                    scope,
                    state,
                    nonce,
                    ...audience && {
                        audience
                    }
                }
            };
            magicLinkTransactionState = {
                responseType: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$types$2f$connected$2d$accounts$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["RESPONSE_TYPES"].CODE,
                state,
                nonce,
                returnTo: this.signInReturnToPath,
                scope,
                audience: this.authorizationParameters.audience,
                originDomain: this.provider?.isResolverMode ? this.domain : undefined,
                originIssuer: this.provider?.isResolverMode ? this.issuer : undefined
            };
        }
        const url = new URL("/passwordless/start", this.issuer).toString();
        const httpOptions = this.httpOptions();
        httpOptions.headers.set("Content-Type", "application/json");
        // Forward locale preference for Auth0 email template localization.
        // Auth0's /passwordless/start respects x-request-language to select the
        // correct email template language when multiple are configured.
        if (options.language) {
            httpOptions.headers.set("x-request-language", options.language);
        }
        const body = {
            client_id: this.clientMetadata.client_id,
            connection: options.connection
        };
        if (this.clientSecret) {
            body.client_secret = this.clientSecret;
        }
        if (options.connection === "email") {
            body.email = options.email;
            body.send = options.send;
        } else {
            body.phone_number = options.phoneNumber;
        }
        if (options.authParams) {
            body.authParams = options.authParams;
        }
        try {
            const response = await this.fetch(url, {
                method: "POST",
                body: JSON.stringify(body),
                ...httpOptions
            });
            if (!response.ok) {
                const errorBody = await response.json().catch(()=>({
                        error: "unknown_error",
                        error_description: "Failed to start passwordless flow"
                    }));
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasswordlessStartError"](errorBody.error || "unknown_error", errorBody.error_description || "Failed to start passwordless flow", errorBody.error ? errorBody : undefined);
            }
        } catch (e) {
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasswordlessStartError"]) throw e;
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasswordlessStartError"]("unexpected_error", "Unexpected error during passwordless start", undefined);
        }
        if (magicLinkTransactionState) {
            if (!resCookies) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["InvalidConfigurationError"]("Magic link requires a response cookies object to persist the transaction state. " + "Pass the NextResponse cookies (App Router: next/headers cookies; Pages Router: res.cookies).");
            }
            await this.transactionStore.save(resCookies, magicLinkTransactionState, req?.cookies);
        }
    }
    /**
     * Verifies a passwordless OTP and exchanges it for tokens via the OAuth token endpoint.
     * Returns raw tokens — the caller (route handler) is responsible for creating the session.
     *
     * Uses `grant_type=http://auth0.com/oauth/grant-type/passwordless/otp`.
     * DPoP is applied when enabled.
     *
     * @param options - Connection type, user identifier, and verification code.
     * @returns Token response from Auth0.
     * @throws {PasswordlessVerifyError} On Auth0 API failure or discovery failure.
     */ async passwordlessVerify(options) {
        await this.ensureDpopValidated();
        const [discoveryError, authorizationServerMetadata] = await this.discoverAuthorizationServerMetadata();
        if (discoveryError) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasswordlessVerifyError"]("discovery_error", "Failed to discover authorization server metadata", undefined);
        }
        const params = new URLSearchParams();
        params.append("realm", options.connection);
        params.append("otp", options.verificationCode);
        if (options.connection === "email") {
            params.append("username", options.email);
        } else {
            params.append("username", options.phoneNumber);
        }
        // Resolve scope and audience from global authorizationParameters
        const scope = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$scope$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["getScopeForAudience"])(this.authorizationParameters.scope, this.authorizationParameters.audience) || __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DEFAULT_SCOPES"];
        params.append("scope", scope);
        if (this.authorizationParameters.audience) {
            params.append("audience", this.authorizationParameters.audience);
        }
        // Create DPoP handle ONCE outside the closure so it persists across retries.
        // This is required by RFC 9449: the handle must learn and reuse the nonce from
        // the DPoP-Nonce header across multiple attempts.
        const dpopHandle = this.useDPoP && this.dpopKeyPair ? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DPoP"](this.clientMetadata, this.dpopKeyPair) : undefined;
        const passwordlessMetadata = this.withMtlsEndpoint(authorizationServerMetadata);
        let tokenEndpointResponse;
        try {
            tokenEndpointResponse = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$dpopRetry$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["withDPoPNonceRetry"])(async ()=>{
                const httpResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["genericTokenEndpointRequest"](passwordlessMetadata, this.clientMetadata, await this.getClientAuth(), __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$types$2f$passwordless$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["GRANT_TYPE_PASSWORDLESS_OTP"], params, {
                    ...this.httpOptions(),
                    [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["customFetch"]]: this.fetch,
                    [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["allowInsecureRequests"]]: this.allowInsecureRequests,
                    ...dpopHandle && {
                        DPoP: dpopHandle
                    }
                });
                return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["processGenericTokenEndpointResponse"](passwordlessMetadata, this.clientMetadata, httpResponse);
            }, {
                isDPoPEnabled: !!(this.useDPoP && this.dpopKeyPair),
                ...this.dpopOptions?.retry
            });
        } catch (err) {
            // oauth4webapi validates the id_token (iss, aud, signature) inside
            // processGenericTokenEndpointResponse and throws with code
            // JWT_CLAIM_COMPARISON when a claim doesn't match the discovered ASM.
            // Surface those as specific PasswordlessVerifyErrors so callers can
            // distinguish misconfiguration from a bad grant.
            if (err?.code === __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWT_CLAIM_COMPARISON"]) {
                const claim = err.cause?.claim;
                if (claim === "iss") {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasswordlessVerifyError"]("invalid_issuer", `ID token issuer mismatch. Check AUTH0_DOMAIN configuration.`);
                }
                if (claim === "aud") {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasswordlessVerifyError"]("invalid_audience", `ID token audience mismatch. Check AUTH0_CLIENT_ID configuration.`);
                }
            }
            const oauthErr = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$oauth$2d$error$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["extractOAuthErrorDetails"])(err);
            await __classPrivateFieldGet(this, _AuthClient_instances, "m", _AuthClient_throwIfMfaRequired).call(this, err, oauthErr, this.authorizationParameters.audience, scope);
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasswordlessVerifyError"](oauthErr.error || "unknown_error", oauthErr.error_description || err.message || "Passwordless verification failed", oauthErr.error ? {
                error: oauthErr.error,
                error_description: oauthErr.error_description ?? ""
            } : undefined);
        }
        return {
            access_token: tokenEndpointResponse.access_token,
            refresh_token: tokenEndpointResponse.refresh_token,
            id_token: tokenEndpointResponse.id_token,
            token_type: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$token$2d$set$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["normalizeTokenType"])(tokenEndpointResponse.token_type),
            scope: tokenEndpointResponse.scope,
            expires_in: Number(tokenEndpointResponse.expires_in)
        };
    }
    /**
     * Requests an OTP challenge for a database connection via `POST /otp/challenge`.
     *
     * The challenge always returns 200 regardless of whether the user exists
     * (user-enumeration prevention). If the user is blocked or signup is disabled
     * for a non-existent user, the returned auth_session will be non-functional
     * and passwordlessDbGetToken will fail with invalid_request.
     *
     * @param options - Email or phone challenge options including connection name.
     * @returns Opaque PasswordlessDbChallenge containing auth_session.
     * @throws {PasswordlessDbChallengeError} On Auth0 API failure.
     */ async passwordlessDbOtpChallenge(options) {
        const url = new URL("/otp/challenge", this.issuer).toString();
        const httpOptions = this.httpOptions();
        httpOptions.headers.set("Content-Type", "application/json");
        const body = {
            client_id: this.clientMetadata.client_id,
            connection: options.connection,
            allow_signup: options.allowSignup ?? false
        };
        if (this.clientSecret) {
            body.client_secret = this.clientSecret;
        }
        if ("email" in options) {
            body.email = options.email;
        } else {
            body.phone_number = options.phoneNumber;
            if (options.deliveryMethod) {
                body.delivery_method = options.deliveryMethod;
            }
        }
        try {
            const response = await this.fetch(url, {
                method: "POST",
                body: JSON.stringify(body),
                ...httpOptions
            });
            if (!response.ok) {
                const errorBody = await response.json().catch(()=>({
                        error: "unknown_error",
                        error_description: "Failed to request OTP challenge"
                    }));
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$db$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasswordlessDbChallengeError"](errorBody.error || "unknown_error", errorBody.error_description || "Failed to request OTP challenge", errorBody.error ? errorBody : undefined);
            }
            const data = await response.json();
            return {
                authSession: data.auth_session
            };
        } catch (e) {
            if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$db$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasswordlessDbChallengeError"]) throw e;
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$db$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasswordlessDbChallengeError"]("unexpected_error", "Unexpected error during OTP challenge", undefined);
        }
    }
    /**
     * Exchanges an auth_session and OTP for tokens via `POST /oauth/token`.
     * Uses grant type `http://auth0.com/oauth/grant-type/passwordless/otp`.
     * DPoP is applied when enabled.
     *
     * @param options - The opaque auth_session and user-entered OTP.
     * @returns Token response from Auth0.
     * @throws {PasswordlessDbGetTokenError} On Auth0 API failure or discovery failure.
     */ async passwordlessDbGetToken(options) {
        await this.ensureDpopValidated();
        const [discoveryError, authorizationServerMetadata] = await this.discoverAuthorizationServerMetadata();
        if (discoveryError) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$db$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasswordlessDbGetTokenError"]("discovery_error", "Failed to discover authorization server metadata", undefined);
        }
        const scope = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$scope$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["getScopeForAudience"])(this.authorizationParameters.scope, this.authorizationParameters.audience) || __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DEFAULT_SCOPES"];
        const params = new URLSearchParams();
        params.append("auth_session", options.authSession);
        params.append("otp", options.otp);
        params.append("scope", scope);
        if (this.authorizationParameters.audience) {
            params.append("audience", this.authorizationParameters.audience);
        }
        const dpopHandle = this.useDPoP && this.dpopKeyPair ? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DPoP"](this.clientMetadata, this.dpopKeyPair) : undefined;
        const tokenMetadata = this.withMtlsEndpoint(authorizationServerMetadata);
        let tokenEndpointResponse;
        try {
            tokenEndpointResponse = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$dpopRetry$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["withDPoPNonceRetry"])(async ()=>{
                const httpResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["genericTokenEndpointRequest"](tokenMetadata, this.clientMetadata, await this.getClientAuth(), __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$types$2f$passwordless$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["GRANT_TYPE_PASSWORDLESS_OTP"], params, {
                    ...this.httpOptions(),
                    [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["customFetch"]]: this.fetch,
                    [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["allowInsecureRequests"]]: this.allowInsecureRequests,
                    ...dpopHandle && {
                        DPoP: dpopHandle
                    }
                });
                return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["processGenericTokenEndpointResponse"](tokenMetadata, this.clientMetadata, httpResponse);
            }, {
                isDPoPEnabled: !!(this.useDPoP && this.dpopKeyPair),
                ...this.dpopOptions?.retry
            });
        } catch (err) {
            if (err?.code === __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["JWT_CLAIM_COMPARISON"]) {
                const claim = err.cause?.claim;
                if (claim === "iss") {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$db$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasswordlessDbGetTokenError"]("invalid_issuer", "ID token issuer mismatch. Check AUTH0_DOMAIN configuration.");
                }
                if (claim === "aud") {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$db$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasswordlessDbGetTokenError"]("invalid_audience", "ID token audience mismatch. Check AUTH0_CLIENT_ID configuration.");
                }
            }
            const oauthErr = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$oauth$2d$error$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["extractOAuthErrorDetails"])(err);
            await __classPrivateFieldGet(this, _AuthClient_instances, "m", _AuthClient_throwIfMfaRequired).call(this, err, oauthErr, this.authorizationParameters.audience, scope);
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$passwordless$2d$db$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PasswordlessDbGetTokenError"](oauthErr.error || "unknown_error", oauthErr.error_description || err.message || "Passwordless DB token exchange failed", oauthErr.error ? {
                error: oauthErr.error,
                error_description: oauthErr.error_description ?? ""
            } : undefined);
        }
        return {
            access_token: tokenEndpointResponse.access_token,
            refresh_token: tokenEndpointResponse.refresh_token,
            id_token: tokenEndpointResponse.id_token,
            token_type: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$token$2d$set$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["normalizeTokenType"])(tokenEndpointResponse.token_type),
            scope: tokenEndpointResponse.scope,
            expires_in: Number(tokenEndpointResponse.expires_in)
        };
    }
}
_AuthClient_instances = new WeakSet(), _AuthClient_clearAnonymousSessionCookieOnLogin = function _AuthClient_clearAnonymousSessionCookieOnLogin(reqCookies, resCookies) {
    if (this.anonymousSessionEnabled && this.anonymousClearOnLogin) {
        try {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["deleteChunkedCookie"])(this.anonymousCookieName, reqCookies, resCookies, false, {
                path: this.anonymousCookieOptions.path,
                domain: this.anonymousCookieOptions.domain,
                secure: this.anonymousCookieOptions.secure,
                sameSite: this.anonymousCookieOptions.sameSite,
                httpOnly: this.anonymousCookieOptions.httpOnly
            });
        } catch  {
        // Fail-open: a cookie-clear error must not prevent the session response
        // from reaching the caller.
        }
    }
}, _AuthClient_getTokenSetFromSession = function _AuthClient_getTokenSetFromSession(session, options) {
    const tokenSet = session.tokenSet;
    const audience = options.audience;
    const scope = options.scope;
    // When audience and scope are provided, we need to compare them with the original ones provided in either the `SessionData.tokenSet` itself, or the Auth0Client constructor.
    // When they are identical, we should read from the top-level `SessionData.tokenSet`.
    // If not, we should look for the corresponding access token in `SessionData.accessTokens`
    const isAudienceTheGlobalAudience = !audience || audience === (tokenSet.audience || this.authorizationParameters.audience);
    const isScopeTheGlobalScope = !scope || (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$token$2d$set$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["compareScopes"])(tokenSet.requestedScope || (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$scope$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["getScopeForAudience"])(this.authorizationParameters.scope, audience), scope);
    if (isAudienceTheGlobalAudience && isScopeTheGlobalScope) {
        return tokenSet;
    }
    let accessTokenSet;
    // If there is an audience, we can search for the correct access token in the array
    // If there is no audience, we cannot find the correct access token in the array
    if (audience) {
        accessTokenSet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$token$2d$set$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["findAccessTokenSet"])(session, {
            scope,
            audience
        });
    }
    // Convert the Access Token Set to a Token Set, which mostly ensures the Id Token and RefreshToken are also available,
    // But the access token, expiresAt, audience and scope are taken from the Access Token Set.
    // When no audience was found, we will return an empty Token Set with only the Id Token and Refresh Token
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$token$2d$set$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["tokenSetFromAccessTokenSet"])(accessTokenSet, tokenSet);
}, _AuthClient_throwIfMfaRequired = // Detects mfa_required in a token endpoint error, encrypts the raw mfa_token,
// and throws MfaRequiredError. Used by credential exchange grants (passkey,
// passwordless) that can trigger MFA step-up. Throws only when mfa_token is
// present — otherwise falls through so the caller can throw its own typed error.
async function _AuthClient_throwIfMfaRequired(err, oauthErr, audience, scope) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isMfaRequiredError"])(err)) {
        const { mfa_token, error_description, mfa_requirements } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["extractMfaErrorDetails"])(err);
        if (mfa_token) {
            const encryptedToken = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encryptMfaToken"])(mfa_token, audience ?? this.authorizationParameters.audience ?? "", scope ?? this.authorizationParameters.scope ?? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DEFAULT_SCOPES"], mfa_requirements, this.sessionStore.secret, this.mfaTokenTtl);
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MfaRequiredError"](error_description ?? "Multi-factor authentication is required.", encryptedToken, mfa_requirements, new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["OAuth2Error"]({
                code: oauthErr.error ?? "unknown_error",
                message: oauthErr.error_description
            }));
        }
    }
}, _AuthClient_handlePreflight = /**
 * Handles CORS preflight requests without authentication headers.
 *
 * Special-cases the OPTIONS method to forward preflight requests directly WITHOUT
 * calling `fetcher.fetchWithAuth()`, which would incorrectly inject DPoP/auth headers
 * on the preflight request.
 *
 * The browser never sends auth headers on preflight requests, and we should not either.
 * Authorization checks must not be performed on preflight requests according to RFC 7231.
 * Additionally, DPoP proofs are bound to HTTP requests, not to preflights (RFC 9449).
 *
 * @param req The incoming CORS preflight OPTIONS request.
 * @param options Configuration options for the proxy including target base URL, audience, and scope.
 * @returns A NextResponse containing the preflight response from the target server, or a 500 error if the preflight fails.
 *
 * @see RFC 7231 Section 4.3.1 - Authorization checks must not be performed on preflight requests
 * @see RFC 9449 Section 4.1 - DPoP proofs are bound to HTTP requests, not to preflights
 */ async function _AuthClient_handlePreflight(req, options) {
    const headers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$proxy$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["buildForwardedRequestHeaders"])(req);
    const targetUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$proxy$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["transformTargetUrl"])(req, options);
    // Set Host header to upstream host
    headers.set("host", targetUrl.host);
    try {
        // Forward preflight directly WITHOUT DPoP/auth headers
        const preflightResponse = await this.fetch(targetUrl.toString(), {
            method: "OPTIONS",
            headers
        });
        // Forward CORS headers from upstream
        return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"](null, {
            status: preflightResponse.status,
            headers: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$proxy$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["buildForwardedResponseHeaders"])(preflightResponse)
        });
    } catch (error) {
        // If preflight fails, return 500
        return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"](error.cause || error.message || "Preflight request failed", {
            status: 500
        });
    }
}, _AuthClient_handleProxy = /**
 * Handles proxying requests to a target URL with authentication.
 *
 * This method retrieves the user's session, constructs the target URL,
 * and forwards the request with appropriate authentication headers.
 * It also manages token retrieval and session updates as needed.
 * @param req The incoming Next.js request to be proxied.
 * @param options Configuration options for the proxying behavior.
 * @returns A Next.js response containing the proxied request's response.
 */ async function _AuthClient_handleProxy(req, options) {
    const { error: sessionError, session } = await this.getSessionWithDomainCheck(req.cookies);
    if (sessionError || !session) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"](sessionError?.message ?? "The user does not have an active session.", {
            status: 401
        });
    }
    // handle preflight requests
    if (req.method === "OPTIONS" && req.headers.has("access-control-request-method")) {
        return __classPrivateFieldGet(this, _AuthClient_instances, "m", _AuthClient_handlePreflight).call(this, req, options);
    }
    const headers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$proxy$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["buildForwardedRequestHeaders"])(req);
    // Clone the request to preserve body for DPoP nonce retry
    // WHATWG Streams Spec: ReadableStream is single-consume (can only be read once).
    // When oauth4webapi's protectedResourceRequest encounters a DPoP nonce error,
    // it triggers a retry. Without cloning, the body stream will be exhausted on the first attempt,
    // causing the retry to fail with "stream already disturbed" or empty body.
    // To support retry, we buffer the body so it can be reused on retry.
    // This retry will not happen with bearer auth so no need to clone if DPoP is false.
    const clonedReq = this.useDPoP ? req.clone() : req;
    const targetUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$proxy$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["transformTargetUrl"])(req, options);
    // Set Host header to upstream host
    headers.set("host", targetUrl.host);
    // Buffer the body to allow retry on DPoP nonce errors
    // ReadableStreams can only be consumed once, so we need to buffer for retry
    const bodyBuffer = clonedReq.body ? await clonedReq.arrayBuffer() : undefined;
    // Keep an isolated, request-local session snapshot so retries within this
    // proxy request can observe token refreshes immediately without writing the
    // session cookie until the proxy response succeeds.
    const requestSession = structuredClone(session);
    const tokenSetResponsesByRequest = new Map();
    const applyTokenSetResponseToRequestSession = (tokenSetResponse)=>{
        const sessionChanges = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$session$2d$changes$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["getSessionChangesAfterGetAccessToken"])(requestSession, tokenSetResponse.tokenSet, {
            scope: this.authorizationParameters?.scope ?? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DEFAULT_SCOPES"],
            audience: this.authorizationParameters?.audience
        });
        if (sessionChanges) {
            Object.assign(requestSession, sessionChanges);
        }
        if (tokenSetResponse.idTokenClaims) {
            requestSession.user = tokenSetResponse.idTokenClaims;
        }
    };
    let tokenSetSideEffect;
    const getAccessToken = async (authParams)=>{
        const cacheKey = JSON.stringify([
            authParams.refresh ?? false,
            authParams.audience ?? null,
            authParams.scope ?? null
        ]);
        const cachedTokenSetResponse = tokenSetResponsesByRequest.get(cacheKey);
        if (cachedTokenSetResponse) {
            tokenSetSideEffect = cachedTokenSetResponse;
            return cachedTokenSetResponse.tokenSet;
        }
        const [error, tokenSetResponse] = await this.getTokenSet(requestSession, {
            audience: authParams.audience,
            scope: authParams.scope
        });
        if (error) {
            throw error;
        }
        applyTokenSetResponseToRequestSession(tokenSetResponse);
        tokenSetResponsesByRequest.set(cacheKey, tokenSetResponse);
        // Tracking the last used token set response for session updates later as a side effect.
        // This relies on the fact that `getAccessToken` is called before the actual fetch.
        // Not ideal, but works because of that order of execution.
        // We need to do this because the fetcher does not return the token set used, and we need it to update the session if necessary.
        // Additionally, updating the session requires the request and response objects, which are not available in the fetcher,
        // so we can not update the session directly from the fetcher.
        tokenSetSideEffect = tokenSetResponse;
        return tokenSetResponse.tokenSet;
    };
    // Cache only the DPoP handle so nonce state is shared across proxied
    // requests for the same audience on this AuthClient instance. Always create
    // a fresh request-bound fetcher so token resolution remains scoped to the
    // current session instead of being shared or mutated.
    const dpopHandle = this.useDPoP && this.dpopKeyPair ? this.proxyDpopHandles[options.audience] ??= __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DPoP"](this.clientMetadata, this.dpopKeyPair) : undefined;
    const fetcher = await this.fetcherFactory({
        useDPoP: this.useDPoP,
        fetch: this.fetch,
        getAccessToken,
        dpopHandle
    });
    try {
        const response = await fetcher.fetchWithAuth(targetUrl.toString(), {
            method: clonedReq.method,
            headers,
            body: bodyBuffer
        }, {
            scope: options.scope,
            audience: options.audience
        });
        const res = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"](response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$proxy$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["buildForwardedResponseHeaders"])(response)
        });
        // Using the last used token set response to determine if we need to update the session
        // This is not ideal, as this kind of relies on the order of execution.
        // As we know the fetcher's `getAccessToken` is called before the actual fetch,
        // we know it should always be defined when we reach this point.
        if (tokenSetSideEffect) {
            await __classPrivateFieldGet(this, _AuthClient_instances, "m", _AuthClient_updateSessionAfterTokenRetrieval).call(this, req, res, session, tokenSetSideEffect);
        }
        return res;
    } catch (e) {
        // Handle MFA required error - return 403 with MFA context.
        // The request-local session snapshot was passed to getTokenSet().
        if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MfaRequiredError"]) {
            return __classPrivateFieldGet(this, _AuthClient_instances, "m", _AuthClient_createMfaRequiredResponse).call(this, req, requestSession, e);
        }
        // Return 401 for missing refresh token (cannot refresh expired token)
        if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AccessTokenError"] && e.code === __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AccessTokenErrorCode"].MISSING_REFRESH_TOKEN) {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"](e.message, {
                status: 401
            });
        }
        // Generic error handling for other errors
        return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"](e.cause || e.message || "An error occurred while proxying the request.", {
            status: 500
        });
    }
}, _AuthClient_updateSessionAfterTokenRetrieval = /**
 * Updates the session after token retrieval if there are changes.
 *
 * This method:
 * 1. Checks if the session needs to be updated based on token changes
 * 2. Updates the user claims if new ID token claims are provided
 * 3. Finalizes the session through the beforeSessionSaved hook or default filtering
 * 4. Persists the updated session to the session store
 * 5. Adds cache control headers to the response
 *
 * @note This method mutates the `res` parameter by:
 * - Setting session cookies via `res.cookies`
 * - Adding cache control headers to the response
 */ async function _AuthClient_updateSessionAfterTokenRetrieval(req, res, session, tokenSetResponse) {
    const sessionChanges = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$session$2d$changes$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["getSessionChangesAfterGetAccessToken"])(session, tokenSetResponse.tokenSet, {
        scope: this.authorizationParameters?.scope ?? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DEFAULT_SCOPES"],
        audience: this.authorizationParameters?.audience
    });
    if (sessionChanges) {
        if (tokenSetResponse.idTokenClaims) {
            session.user = tokenSetResponse.idTokenClaims;
        }
        // call beforeSessionSaved callback if present
        // if not then filter id_token claims with default rules
        const finalSession = await this.finalizeSession({
            ...session,
            ...sessionChanges
        }, tokenSetResponse.tokenSet.idToken);
        await this.sessionStore.set(req.cookies, res.cookies, finalSession);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["addCacheControlHeadersForSession"])(res);
    }
}, _AuthClient_createMfaRequiredResponse = /**
 * Create HTTP response for MFA required error.
 * Saves session with MFA context and returns 403 response with error details.
 *
 * @param req - The incoming request (for reading cookies)
 * @param session - Session data (already mutated with MFA context by getTokenSet)
 * @param error - The MfaRequiredError from getTokenSet
 * @returns NextResponse with 403 status and MFA error JSON body
 */ async function _AuthClient_createMfaRequiredResponse(req, session, error) {
    // Use toJSON() for consistent REST API response format
    const res = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json(error.toJSON(), {
        status: 403
    });
    // Save session with MFA context if one exists (not applicable for passkey/passwordless
    // first-factor flows where no session exists yet at this point)
    if (session) {
        await this.sessionStore.set(req.cookies, res.cookies, session);
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["addCacheControlHeadersForSession"])(res);
    return res;
}, _AuthClient_refreshTokenSet = /**
 * Refreshes the token set using the provided refresh token.
 * @param tokenSet The current token set containing the refresh token.
 * @param options Options for the refresh operation, including scope and audience.
 * @returns A tuple containing either:
 *   - `[null, { updatedTokenSet: TokenSet; idTokenClaims: oauth.IDToken }]` if the token was successfully refreshed, containing the updated token set and ID token claims.
 *   - `[SdkError, null]` if an error occurred during the refresh process.
 */ async function _AuthClient_refreshTokenSet(tokenSet, options) {
    await this.ensureDpopValidated();
    const [discoveryError, authorizationServerMetadata] = await this.discoverAuthorizationServerMetadata();
    if (discoveryError) {
        return [
            discoveryError,
            null
        ];
    }
    const additionalParameters = new URLSearchParams();
    if (options.scope) {
        additionalParameters.append("scope", options.scope);
    }
    if (options.audience) {
        additionalParameters.append("audience", options.audience);
    }
    // Create DPoP handle ONCE outside the closure so it persists across retries.
    // This is required by RFC 9449: the handle must learn and reuse the nonce from
    // the DPoP-Nonce header across multiple attempts.
    const dpopHandle = this.useDPoP && this.dpopKeyPair ? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DPoP"](this.clientMetadata, this.dpopKeyPair) : undefined;
    const refreshTokenGrantRequestCall = async ()=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["refreshTokenGrantRequest"](authorizationServerMetadata, this.clientMetadata, await this.getClientAuth(), tokenSet.refreshToken, {
            ...this.httpOptions(),
            [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["customFetch"]]: this.fetch,
            [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["allowInsecureRequests"]]: this.allowInsecureRequests,
            additionalParameters,
            ...dpopHandle && {
                DPoP: dpopHandle
            }
        });
    const processRefreshTokenResponseCall = (response)=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["processRefreshTokenResponse"](authorizationServerMetadata, this.clientMetadata, response);
    let oauthRes;
    try {
        oauthRes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$dpopRetry$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["withDPoPNonceRetry"])(async ()=>{
            const refreshTokenRes = await refreshTokenGrantRequestCall();
            return await processRefreshTokenResponseCall(refreshTokenRes);
        }, {
            isDPoPEnabled: !!(this.useDPoP && this.dpopKeyPair),
            ...this.dpopOptions?.retry
        });
    } catch (e) {
        const oauthErr = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$oauth$2d$error$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["extractOAuthErrorDetails"])(e);
        // Check if this is an MFA required error
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isMfaRequiredError"])(e)) {
            const { mfa_token, error_description, mfa_requirements } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["extractMfaErrorDetails"])(e);
            if (mfa_token) {
                // Encrypt token with full context before exposing to application
                const encryptedToken = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["encryptMfaToken"])(mfa_token, options.audience || "", options.requestedScope, mfa_requirements, this.sessionStore.secret, this.mfaTokenTtl);
                // Return MFA required error with self-contained encrypted token
                return [
                    new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MfaRequiredError"](error_description ?? "Multi-factor authentication is required.", encryptedToken, mfa_requirements, new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["OAuth2Error"]({
                        code: oauthErr.error ?? "unknown_error",
                        message: oauthErr.error_description
                    })),
                    null
                ];
            } else {
                // MFA required but no mfa_token provided
                // This typically happens when:
                // 1. The refresh token was issued before MFA was enrolled
                // 2. The API doesn't support step-up (no authorization policies)
                // User needs to re-authenticate to get a new session with MFA
                console.error("MFA required but no mfa_token - user needs to re-authenticate");
                return [
                    new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MfaRequiredError"](error_description ?? "Multi-factor authentication is required. Please log in again.", "", mfa_requirements, new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["OAuth2Error"]({
                        code: oauthErr.error ?? "unknown_error",
                        message: oauthErr.error_description
                    })),
                    null
                ];
            }
        }
        return [
            new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AccessTokenError"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AccessTokenErrorCode"].FAILED_TO_REFRESH_TOKEN, "The access token has expired and there was an error while trying to refresh it.", new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["OAuth2Error"]({
                code: oauthErr.error ?? "unknown_error",
                message: oauthErr.error_description
            })),
            null
        ];
    }
    if (this.useMtls) {
        this.warnIfNotCertificateBound(oauthRes.access_token);
    }
    const idTokenClaims = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["getValidatedIdTokenClaims"](oauthRes);
    const accessTokenExpiresAt = Math.floor(Date.now() / 1000) + Number(oauthRes.expires_in);
    const updatedTokenSet = {
        ...tokenSet,
        accessToken: oauthRes.access_token,
        idToken: oauthRes.id_token,
        // We store the both requested and granted scopes on the tokenSet, so we know what scopes were requested.
        // The server may return less scopes than requested.
        // This ensures we can return the same token again when a token for the same or less scopes is requested by using `requestedScope` during look-up.
        //
        // E.g. When requesting a token with scope `a b`, and we return one for scope `a` only,
        // - If we only store the returned scopes, we cannot return this token when the user requests a token for scope `a b` again.
        // - If we only store the requested scopes, we lose track of the actual scopes granted.
        //
        // Scopes actually granted by the server
        scope: oauthRes.scope,
        // Scopes requested by the client
        requestedScope: options.requestedScope,
        expiresAt: accessTokenExpiresAt,
        // Keep the audience if it exists, otherwise use the one from the options.
        // If not provided, use `undefined`.
        audience: tokenSet.audience || options.audience || undefined,
        // Store the token type from the OAuth response (e.g., "Bearer", "DPoP")
        ...oauthRes.token_type && {
            token_type: oauthRes.token_type
        }
    };
    if (oauthRes.refresh_token) {
        // refresh token rotation is enabled, persist the new refresh token from the response
        updatedTokenSet.refreshToken = oauthRes.refresh_token;
    } else {
        // we did not get a refresh token back, keep the current long-lived refresh token around
        updatedTokenSet.refreshToken = tokenSet.refreshToken;
    }
    return [
        null,
        {
            updatedTokenSet,
            idTokenClaims
        }
    ];
};
/**
 * Maximum allowed response body size (1 MB). Responses exceeding this limit
 * are aborted to prevent memory exhaustion from malicious or oversized
 * OIDC discovery documents, JWKS responses, or token endpoint payloads.
 * @internal
 */ AuthClient.MAX_RESPONSE_BODY_SIZE = 1024 * 1024;
const encodeBase64 = (input)=>{
    const unencoded = new TextEncoder().encode(input);
    const CHUNK_SIZE = 0x8000;
    const arr = [];
    for(let i = 0; i < unencoded.length; i += CHUNK_SIZE){
        arr.push(// @ts-expect-error Argument of type 'Uint8Array' is not assignable to parameter of type 'number[]'.
        String.fromCharCode.apply(null, unencoded.subarray(i, i + CHUNK_SIZE)));
    }
    return btoa(arr.join(""));
};
/**
 * Hex-encoded SHA-256 digest of an anonymous session token.
 *
 * The digest is what the login transaction stores in place of the token, so the
 * transaction cookie carries no material that could be replayed against the
 * authorization server if it were ever decrypted. WebCrypto is used directly so
 * the helper works on the Edge runtime as well as on Node.
 */ async function digestAnonymousSessionToken(sessionToken) {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(sessionToken));
    return Array.from(new Uint8Array(digest)).map((byte)=>byte.toString(16).padStart(2, "0")).join("");
}
async function buildConnectAccountErrorResponse(res, errorCode) {
    const actionVerb = errorCode === __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$my$2d$account$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ConnectAccountErrorCodes"].FAILED_TO_INITIATE ? "initiate" : "complete";
    try {
        const errorBody = await res.json();
        return [
            new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$my$2d$account$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ConnectAccountError"]({
                code: errorCode,
                message: `The request to ${actionVerb} the connect account flow failed with status ${res.status}.`,
                cause: new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$my$2d$account$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MyAccountApiError"]({
                    type: errorBody.type,
                    title: errorBody.title,
                    detail: errorBody.detail,
                    status: res.status,
                    validationErrors: errorBody.validation_errors
                })
            }),
            null
        ];
    } catch (e) {
        return [
            new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$my$2d$account$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ConnectAccountError"]({
                code: errorCode,
                message: `The request to ${actionVerb} the connect account flow failed with status ${res.status}.`
            }),
            null
        ];
    }
}
async function buildConnectedAccountsErrorResponse(res, errorCode) {
    const actionVerb = errorCode === __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$my$2d$account$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ConnectedAccountsErrorCodes"].FAILED_TO_LIST ? "list the connected accounts" : "delete the connected account";
    try {
        const errorBody = await res.json();
        return [
            new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$my$2d$account$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ConnectedAccountsError"]({
                code: errorCode,
                message: `The request to ${actionVerb} failed with status ${res.status}.`,
                cause: new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$my$2d$account$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MyAccountApiError"]({
                    type: errorBody.type,
                    title: errorBody.title,
                    detail: errorBody.detail,
                    status: res.status,
                    validationErrors: errorBody.validation_errors
                })
            }),
            null
        ];
    } catch (e) {
        return [
            new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$my$2d$account$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ConnectedAccountsError"]({
                code: errorCode,
                message: `The request to ${actionVerb} failed with status ${res.status}.`
            }),
            null
        ];
    }
}
/**
 * Identifies a DPoP failure by its `code` rather than an `instanceof` check.
 * `instanceof` is unreliable across module/realm boundaries (duplicate copies
 * of the error class), so we match on the well-known DPoP error codes instead.
 *
 * @internal
 */ function isDPoPError(e) {
    return typeof e === "object" && e !== null && "code" in e && "message" in e && typeof e.message === "string" && Object.values(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$dpop$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DPoPErrorCode"]).includes(e.code);
}
/**
 * Creates a NextResponse for BCLO error cases.
 * Centralizes the response format (text/plain content type) for all BCLO error branches.
 *
 * @internal
 */ function bcloErrorResponse(message, status) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"](message, {
        status,
        headers: {
            "Content-Type": "text/plain"
        }
    });
}
/**
 * Extracts and normalizes the issuer domain from an unverified logout token.
 *
 * Returns `[null, { domain, issuer }]` on success, or `[Error, null]` if the token
 * cannot be decoded, has no iss claim, or the issuer domain fails normalization
 * (e.g., IP address, localhost).
 *
 * SECURITY: This function decodes the JWT without verification. The unverified
 * `iss` claim is used ONLY for comparison against an independently-resolved domain
 * (resolver mode) or the configured static domain (static mode). It does NOT
 * determine which cryptographic key is used for verification — the JWKS source is
 * determined by the resolver/configuration, not by the token itself. This prevents
 * issuer-substitution attacks where an attacker supplies a token with a crafted
 * `iss` and has it verified against their own JWKS.
 *
 * @internal
 */ function extractIssuerDomainFromToken(logoutToken) {
    try {
        const { iss } = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$decode_jwt$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decodeJwt"](logoutToken);
        if (typeof iss !== "string" || !iss) {
            return [
                new Error("Missing or invalid 'iss' claim in logout token."),
                null
            ];
        }
        return [
            null,
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$normalize$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["normalizeDomain"])(iss)
        ];
    } catch (err) {
        return [
            err instanceof Error ? err : new Error(String(err)),
            null
        ];
    }
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/client.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Auth0Client",
    ()=>Auth0Client
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/headers.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/server.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/index.js [middleware] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/oauth-errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$my$2d$account$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/my-account-errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/mfa-errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/constants.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$request$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/request.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$session$2d$changes$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/session-changes-helpers.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$session$2d$transfer$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/session-transfer-helpers.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$webfingerCache$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/webfingerCache.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$auth$2d$client$2d$provider$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/auth-client-provider.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$auth$2d$client$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/auth-client.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/cookies.js [middleware] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$edge$2d$runtime$2f$cookies$2f$dist$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@edge-runtime/cookies/dist/index.mjs [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$discovery$2d$cache$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/discovery-cache.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$enterprise$2d$connect$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/enterprise-connect.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$helpers$2f$with$2d$api$2d$auth$2d$required$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/helpers/with-api-auth-required.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$helpers$2f$with$2d$page$2d$auth$2d$required$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/helpers/with-page-auth-required.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$mfa$2f$server$2d$mfa$2d$client$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/mfa/server-mfa-client.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$next$2d$compat$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/next-compat.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$passkey$2f$server$2d$passkey$2d$client$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/passkey/server-passkey-client.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$passwordless$2f$server$2d$passwordless$2d$client$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/passwordless/server-passwordless-client.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$session$2f$stateful$2d$session$2d$store$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/session/stateful-session-store.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$session$2f$stateless$2d$session$2d$store$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/session/stateless-session-store.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$transaction$2d$store$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/transaction-store.js [middleware] (ecmascript)");
var __classPrivateFieldSet = ("TURBOPACK compile-time value", void 0) && ("TURBOPACK compile-time value", void 0).__classPrivateFieldSet || function(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet = ("TURBOPACK compile-time value", void 0) && ("TURBOPACK compile-time value", void 0).__classPrivateFieldGet || function(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Auth0Client_options;
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
class Auth0Client {
    constructor(options = {}){
        _Auth0Client_options.set(this, void 0);
        __classPrivateFieldSet(this, _Auth0Client_options, options, "f");
        // Extract and validate required options
        const { domain, clientId, clientSecret, appBaseUrl, secret, clientAssertionSigningKey } = this.validateAndExtractRequiredOptions(options);
        const clientAssertionSigningAlg = options.clientAssertionSigningAlg || process.env.AUTH0_CLIENT_ASSERTION_SIGNING_ALG;
        // Early warning if DPoP is enabled but no keypair (doesn't require crypto)
        if (options.useDPoP && !options.dpopKeyPair) {
            const privateKeyEnv = process.env.AUTH0_DPOP_PRIVATE_KEY;
            const publicKeyEnv = process.env.AUTH0_DPOP_PUBLIC_KEY;
            const hasBothKeys = Boolean(privateKeyEnv && publicKeyEnv);
            if (!hasBothKeys) {
                console.warn("WARNING: useDPoP is set to true but dpopKeyPair is not provided. " + "DPoP will not be used and protected requests will use bearer authentication instead. " + "To enable DPoP, provide a dpopKeyPair in the Auth0Client options or set " + "AUTH0_DPOP_PUBLIC_KEY and AUTH0_DPOP_PRIVATE_KEY environment variables.");
            }
        // Note: If both env vars ARE present, validation happens lazily on first DPoP operation
        // This prevents crypto module from being bundled when useDPoP=false
        }
        // Resolve MFA token TTL from options or environment variable
        const mfaTokenTtl = this.resolveMfaTokenTtl(options.mfaTokenTtl, process.env.AUTH0_MFA_TOKEN_TTL);
        const tokenRefreshBufferOption = options.tokenRefreshBuffer;
        if (tokenRefreshBufferOption != null) {
            if (typeof tokenRefreshBufferOption !== "number" || !Number.isFinite(tokenRefreshBufferOption) || tokenRefreshBufferOption < 0) {
                throw new TypeError("tokenRefreshBuffer must be a non-negative number of seconds.");
            }
        }
        const tokenRefreshBuffer = tokenRefreshBufferOption ?? 0;
        // Auto-detect base path for cookie configuration
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH;
        // Session cookie secure can be configured via options or AUTH0_COOKIE_SECURE.
        const envCookieSecure = process.env.AUTH0_COOKIE_SECURE;
        const sessionSecureExplicit = options.session?.cookie?.secure ?? (envCookieSecure !== undefined ? envCookieSecure === "true" : undefined);
        const sessionCookieOptions = {
            name: options.session?.cookie?.name ?? "__session",
            secure: sessionSecureExplicit ?? false,
            sameSite: options.session?.cookie?.sameSite ?? process.env.AUTH0_COOKIE_SAME_SITE ?? "lax",
            path: options.session?.cookie?.path ?? process.env.AUTH0_COOKIE_PATH ?? basePath ?? "/",
            transient: options.session?.cookie?.transient ?? process.env.AUTH0_COOKIE_TRANSIENT === "true",
            domain: options.session?.cookie?.domain ?? process.env.AUTH0_COOKIE_DOMAIN
        };
        // Transaction cookies only support secure via options (no env var).
        const transactionSecureExplicit = options.transactionCookie?.secure;
        const transactionCookieOptions = {
            prefix: options.transactionCookie?.prefix ?? "__txn_",
            secure: transactionSecureExplicit ?? false,
            sameSite: options.transactionCookie?.sameSite ?? "lax",
            path: options.transactionCookie?.path ?? basePath ?? "/",
            maxAge: options.transactionCookie?.maxAge ?? 3600,
            domain: options.transactionCookie?.domain ?? process.env.AUTH0_COOKIE_DOMAIN
        };
        // Anonymous session cookies only support secure via options (no env var).
        const anonSecureExplicit = options.anonymousSession?.cookie?.secure;
        // Local spread copy so we never mutate the caller's options.anonymousSession.cookie
        // in place (mirrors the session/transaction pattern of computing security on a local object).
        const anonCookieOptions = options.anonymousSession?.cookie ? {
            ...options.anonymousSession.cookie
        } : options.anonymousSession?.cookie;
        if (appBaseUrl) {
            const usesHttps = Array.isArray(appBaseUrl) ? appBaseUrl.every((url)=>new URL(url).protocol === "https:") : new URL(appBaseUrl).protocol === "https:";
            // Only enforce secure cookies when the configured base URL(s) are all https.
            if (usesHttps) {
                sessionCookieOptions.secure = true;
                transactionCookieOptions.secure = true;
                // Force anonymous session cookie secure=true when appBaseUrl is https
                if (anonCookieOptions) {
                    anonCookieOptions.secure = true;
                }
            }
        } else if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        else if (("TURBOPACK compile-time value", "development") === "development" && (sessionSecureExplicit === false || transactionSecureExplicit === false || anonSecureExplicit === false)) {
            // Warn during development when dynamic base URL resolution is combined with
            // explicitly insecure cookies, since production will reject this configuration.
            console.warn("'appBaseUrl' is not configured and cookies are explicitly marked insecure. This is allowed in development, but will throw in production. Configure appBaseUrl or set secure=true for session/transaction/anonymous-session cookies.");
        }
        this.routes = {
            login: process.env.NEXT_PUBLIC_LOGIN_ROUTE || "/auth/login",
            logout: "/auth/logout",
            callback: "/auth/callback",
            backChannelLogout: "/auth/backchannel-logout",
            profile: process.env.NEXT_PUBLIC_PROFILE_ROUTE || "/auth/profile",
            accessToken: process.env.NEXT_PUBLIC_ACCESS_TOKEN_ROUTE || "/auth/access-token",
            federatedDomain: process.env.NEXT_PUBLIC_FEDERATED_DOMAIN_ROUTE || "/auth/federated-domain",
            connectAccount: "/auth/connect",
            mfaAuthenticators: process.env.NEXT_PUBLIC_MFA_AUTHENTICATORS_ROUTE || "/auth/mfa/authenticators",
            mfaChallenge: process.env.NEXT_PUBLIC_MFA_CHALLENGE_ROUTE || "/auth/mfa/challenge",
            mfaVerify: process.env.NEXT_PUBLIC_MFA_VERIFY_ROUTE || "/auth/mfa/verify",
            mfaAssociate: process.env.NEXT_PUBLIC_MFA_ASSOCIATE_ROUTE || "/auth/mfa/associate",
            // deleteAuthenticator uses mfaAuthenticators route with DELETE method
            passwordlessStart: process.env.NEXT_PUBLIC_PASSWORDLESS_START_ROUTE || "/auth/passwordless/start",
            passwordlessVerify: process.env.NEXT_PUBLIC_PASSWORDLESS_VERIFY_ROUTE || "/auth/passwordless/verify",
            passwordlessDbOtpChallenge: process.env.NEXT_PUBLIC_PASSWORDLESS_DB_OTP_CHALLENGE_ROUTE || "/auth/passwordless/otp/challenge",
            passwordlessDbGetToken: process.env.NEXT_PUBLIC_PASSWORDLESS_DB_GET_TOKEN_ROUTE || "/auth/passwordless/otp/token",
            passkeyRegister: process.env.NEXT_PUBLIC_PASSKEY_REGISTER_ROUTE || "/auth/passkey/register",
            passkeyChallenge: process.env.NEXT_PUBLIC_PASSKEY_CHALLENGE_ROUTE || "/auth/passkey/challenge",
            passkeyGetToken: process.env.NEXT_PUBLIC_PASSKEY_GET_TOKEN_ROUTE || "/auth/passkey/get-token",
            passkeyEnrollmentChallenge: process.env.NEXT_PUBLIC_PASSKEY_ENROLLMENT_CHALLENGE_ROUTE || "/auth/passkey/enrollment-challenge",
            passkeyEnrollmentVerify: process.env.NEXT_PUBLIC_PASSKEY_ENROLLMENT_VERIFY_ROUTE || "/auth/passkey/enrollment-verify",
            anonymousSession: process.env.NEXT_PUBLIC_ANONYMOUS_SESSION_ROUTE || "/auth/anonymous-session",
            anonymousSessionLogout: process.env.NEXT_PUBLIC_ANONYMOUS_SESSION_LOGOUT_ROUTE || "/auth/anonymous-session/logout",
            ...options.routes
        };
        this.transactionStore = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$transaction$2d$store$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["TransactionStore"]({
            secret,
            cookieOptions: transactionCookieOptions,
            enableParallelTransactions: options.enableParallelTransactions ?? true
        });
        this.sessionStore = options.sessionStore ? new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$session$2f$stateful$2d$session$2d$store$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["StatefulSessionStore"]({
            ...options.session,
            secret,
            store: options.sessionStore,
            cookieOptions: sessionCookieOptions
        }) : new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$session$2f$stateless$2d$session$2d$store$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["StatelessSessionStore"]({
            ...options.session,
            secret,
            cookieOptions: sessionCookieOptions
        });
        // Create discovery cache for the provider
        const discoveryCache = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$discovery$2d$cache$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DiscoveryCache"](options.discoveryCache);
        // When AUTH0_DOMAIN is not available at module evaluation time (e.g. during a
        // Next.js standalone build that injects env vars only at runtime), `domain` will
        // be undefined. Passing undefined to AuthClientProvider causes it to throw
        // immediately in the constructor, which breaks the build.
        //
        // Work around this by converting a missing domain into a DomainResolver that
        // reads AUTH0_DOMAIN lazily on the first request. If the env var is still absent
        // at request time, the resolver will throw with a clear error message.
        //
        // If domain is already a string or a DomainResolver function, it is used as-is.
        const domainForProvider = domain || (()=>{
            const runtimeDomain = process.env.AUTH0_DOMAIN;
            if (!runtimeDomain) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["InvalidConfigurationError"]("Missing: domain: Set AUTH0_DOMAIN env var or pass domain in options.");
            }
            return runtimeDomain;
        });
        if (options.enterpriseConnect) {
            this.disableSessionMembersForEnterpriseConnect();
            const scope = options.authorizationParameters?.scope ?? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DEFAULT_SCOPES"];
            if (typeof scope === "string" && scope.split(/\s+/).includes("offline_access")) {
                console.warn("WARNING: 'offline_access' is in scope but Enterprise Connect clients are not " + "issued refresh tokens. Set authorizationParameters.scope to " + "'openid profile email' to drop it — the default scope includes offline_access.");
            }
            if (options.authorizationParameters?.organization) {
                console.warn("WARNING: enterpriseConnect is true but a static 'organization' is set in " + "authorizationParameters. In Enterprise Connect the organization is resolved " + "per login by Home Realm Discovery from the login_hint email domain. A static " + "value routes every enterprise customer to the same organization, breaking " + "multi-customer deployments. Leave 'organization' unset unless this client " + "serves exactly one organization.");
            }
        }
        // Create provider that manages AuthClient instances
        // Note: We defer the provider reference in the factory to avoid circular reference during construction.
        // The factory captures 'this' by reference, and will read this.provider when called later (not during construction).
        this.provider = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$auth$2d$client$2d$provider$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AuthClientProvider"]({
            domain: domainForProvider,
            allowInsecureRequests: options.allowInsecureRequests,
            createAuthClient: (domainForClient, issuerForClient)=>{
                return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$auth$2d$client$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AuthClient"]({
                    transactionStore: this.transactionStore,
                    sessionStore: this.sessionStore,
                    domain: domainForClient,
                    issuer: issuerForClient,
                    clientId,
                    clientSecret,
                    clientAssertionSigningKey,
                    clientAssertionSigningAlg,
                    authorizationParameters: options.authorizationParameters,
                    pushedAuthorizationRequests: options.pushedAuthorizationRequests,
                    appBaseUrl,
                    secret,
                    signInReturnToPath: options.signInReturnToPath,
                    logoutStrategy: options.logoutStrategy,
                    includeIdTokenHintInOIDCLogoutUrl: options.includeIdTokenHintInOIDCLogoutUrl,
                    beforeSessionSaved: options.beforeSessionSaved,
                    onCallback: options.onCallback,
                    enterpriseConnect: options.enterpriseConnect,
                    routes: this.routes,
                    allowInsecureRequests: options.allowInsecureRequests,
                    httpTimeout: options.httpTimeout,
                    enableTelemetry: options.enableTelemetry,
                    enableAccessTokenEndpoint: options.enableAccessTokenEndpoint,
                    noContentProfileResponseWhenUnauthenticated: options.noContentProfileResponseWhenUnauthenticated,
                    enableConnectAccountEndpoint: options.enableConnectAccountEndpoint,
                    tokenRefreshBuffer,
                    useDPoP: options.useDPoP || false,
                    dpopKeyPair: options.dpopKeyPair,
                    dpopOptions: options.dpopOptions,
                    useMtls: options.useMtls ?? process.env.AUTH0_MTLS === "true",
                    fetch: options.customFetch,
                    mfaTokenTtl,
                    cspNonce: options.cspNonce,
                    anonymousSession: options.anonymousSession ? {
                        ...options.anonymousSession,
                        ...anonCookieOptions !== undefined ? {
                            cookie: anonCookieOptions
                        } : {}
                    } : options.anonymousSession,
                    discoveryCache,
                    provider: this.provider
                });
            }
        });
        // Update provider references in any already-created AuthClients (static mode)
        // This is needed because the factory in static mode is called during AuthClientProvider construction,
        // before this.provider is fully assigned. The closure captures 'this', so by this point it will be valid.
        const staticClient = this.provider.getAuthClientForStaticMode();
        if (staticClient) {
            staticClient.provider = this.provider;
        }
        // Next.js 16's `proxy.ts` convention (and some `middleware.ts` setups) commonly
        // re-export this method directly, e.g. `export default auth0.middleware;`, rather
        // than wrapping it in a closure like `(req) => auth0.middleware(req)`. When the
        // method is invoked that way, it is detached from the `Auth0Client` instance, so
        // `this` is `undefined` inside the method body (per JS strict-mode semantics for
        // unbound method calls), causing a `TypeError: Cannot read properties of
        // undefined (reading 'provider')` on every request. Binding here makes
        // `auth0.middleware` safe to pass around as a plain function reference.
        this.middleware = this.middleware.bind(this);
    }
    /**
     * middleware mounts the SDK routes to run as a middleware function.
     */ async middleware(req) {
        const nextReq = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$next$2d$compat$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["toNextRequest"])(req);
        const authClient = await this.provider.forRequest(nextReq.headers, nextReq.nextUrl);
        return authClient.handler.bind(authClient)(nextReq);
    }
    /**
     * getSession returns the session data for the current request.
     */ async getSession(req) {
        const { authClient, normalizedReq } = await this.resolveRequestContext(req);
        // extract cookies
        let reqCookies;
        if (normalizedReq) {
            reqCookies = normalizedReq instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextRequest"] ? normalizedReq.cookies : this.createRequestCookies(normalizedReq);
        } else {
            reqCookies = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["cookies"])();
        }
        const { error, session } = await authClient.getSessionWithDomainCheck(reqCookies);
        if (error) throw error;
        return session;
    }
    async getAnonymousSession(req) {
        const { authClient, normalizedReq } = await this.resolveRequestContext(req);
        let reqCookies;
        if (normalizedReq) {
            reqCookies = normalizedReq instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextRequest"] ? normalizedReq.cookies : this.createRequestCookies(normalizedReq);
        } else {
            reqCookies = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["cookies"])();
        }
        // Read-only surface: the method signature carries no response, so renewal
        // is deferred (D7). Access-token renewal is persisted through the route
        // handler (handleGetAnonymousSession), which owns a writable response.
        return authClient.getAnonymousSession(reqCookies);
    }
    async createAnonymousSession(req, res, options) {
        // Resolve overload: zero-arg (options) vs req/res forms
        let normalizedReq;
        let opts;
        if (req && typeof req === "object" && !("url" in req)) {
            // Zero-arg form: createAnonymousSession(options)
            opts = req;
            normalizedReq = undefined;
        } else {
            // Req/res form: createAnonymousSession(req, res, options)
            normalizedReq = req;
            opts = options;
        }
        const { authClient, normalizedReq: resolvedReq } = await this.resolveRequestContext(normalizedReq);
        let reqCookies;
        let resCookies;
        if (resolvedReq) {
            if (!res) {
                throw new TypeError("createAnonymousSession(req, res): The 'res' argument is missing. Both 'req' and 'res' must be provided together for Route Handler or Pages Router usage.");
            }
            reqCookies = resolvedReq instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextRequest"] ? resolvedReq.cookies : this.createRequestCookies(resolvedReq);
            resCookies = res.cookies;
        } else {
            // Server Action (App Router): next/headers cookies() is writable here.
            const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["cookies"])();
            reqCookies = cookieStore;
            resCookies = cookieStore;
        }
        return authClient.createAnonymousSession(reqCookies, resCookies, opts);
    }
    /**
     * Fetches session using an already-resolved AuthClient, avoiding double resolver invocation.
     * @internal
     */ async getSessionFromAuthClient(authClient, req) {
        let reqCookies;
        if (req) {
            reqCookies = req instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextRequest"] ? req.cookies : this.createRequestCookies(req);
        } else {
            reqCookies = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["cookies"])();
        }
        const { error, session } = await authClient.getSessionWithDomainCheck(reqCookies);
        if (error) throw error;
        return session;
    }
    /**
     * getAccessToken returns the access token.
     *
     * Please note: If you are passing audience, ensure that the used audiences and scopes are
     * part of the Application's Refresh Token Policies in Auth0 when configuring Multi-Resource Refresh Tokens (MRRT).
     * {@link https://auth0.com/docs/secure/tokens/refresh-tokens/multi-resource-refresh-token | See Auth0 Documentation on Multi-resource Refresh Tokens}
     *
     * NOTE: Server Components cannot set cookies. Calling `getAccessToken()` in a Server Component will cause the access token to be refreshed, if it is expired, and the updated token set will not to be persisted.
     * It is recommended to call `getAccessToken(req, res)` in the middleware if you need to retrieve the access token in a Server Component to ensure the updated token set is persisted.
     */ async getAccessToken(arg1, arg2, arg3) {
        const defaultOptions = {
            refresh: false
        };
        let req = undefined;
        let res = undefined;
        let options = {};
        // Determine which overload was called based on arguments
        if (arg1 && (arg1 instanceof Request || typeof arg1.headers === "object")) {
            // Case: getAccessToken(req, res, options?)
            req = arg1;
            res = arg2; // arg2 must be Response if arg1 is Request
            // Merge provided options (arg3) with defaults
            options = {
                ...defaultOptions,
                ...arg3 ?? {}
            };
            if (!res) {
                throw new TypeError("getAccessToken(req, res): The 'res' argument is missing. Both 'req' and 'res' must be provided together for Pages Router or middleware usage.");
            }
        } else {
            // Case: getAccessToken(options?) or getAccessToken()
            // arg1 (if present) must be options, arg2 and arg3 must be undefined.
            if (arg2 !== undefined || arg3 !== undefined) {
                throw new TypeError("getAccessToken: Invalid arguments. Valid signatures are getAccessToken(), getAccessToken(options), or getAccessToken(req, res, options).");
            }
            // Merge provided options (arg1) with defaults
            options = {
                ...defaultOptions,
                ...arg1 ?? {}
            };
        }
        return this.executeGetAccessToken(req, res, options);
    }
    /**
     * Core implementation of getAccessToken that performs the actual token retrieval.
     * This is separated to enable request coalescing via the cache.
     */ async executeGetAccessToken(req, res, options) {
        const { authClient, normalizedReq } = await this.resolveRequestContext(req);
        const session = await this.getSessionFromAuthClient(authClient, normalizedReq);
        if (!session) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AccessTokenError"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AccessTokenErrorCode"].MISSING_SESSION, "The user does not have an active session.");
        }
        const [error, getTokenSetResponse] = await authClient.getTokenSet(session, options);
        if (error) {
            // For MFA required errors, save session with MFA context before throwing
            // Note: getTokenSet mutates session.mfa by reference when MFA is required
            if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MfaRequiredError"]) {
                await this.saveToSession(session, req, res);
            }
            throw error;
        }
        const { tokenSet, idTokenClaims } = getTokenSetResponse;
        // update the session with the new token set, if necessary
        const sessionChanges = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$session$2d$changes$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["getSessionChangesAfterGetAccessToken"])(session, tokenSet, {
            scope: __classPrivateFieldGet(this, _Auth0Client_options, "f").authorizationParameters?.scope ?? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DEFAULT_SCOPES"],
            audience: __classPrivateFieldGet(this, _Auth0Client_options, "f").authorizationParameters?.audience
        });
        if (sessionChanges) {
            if (idTokenClaims) {
                session.user = idTokenClaims;
            }
            // call beforeSessionSaved callback if present
            // if not then filter id_token claims with default rules
            const finalSession = await authClient.finalizeSession({
                ...session,
                ...sessionChanges
            }, tokenSet.idToken);
            await this.saveToSession(finalSession, req, res);
        }
        return {
            token: tokenSet.accessToken,
            scope: tokenSet.scope,
            expiresAt: tokenSet.expiresAt,
            token_type: tokenSet.token_type,
            audience: tokenSet.audience
        };
    }
    /**
     * Retrieves an access token for a connection.
     *
     * This method attempts to obtain an access token for a specified connection.
     * It first checks if a session exists, either from the provided request or from cookies.
     * If no session is found, it throws a `AccessTokenForConnectionError` indicating
     * that the user does not have an active session.
     *
     * @param {AccessTokenForConnectionOptions} options - Options for retrieving an access token for a connection.
     * @param {PagesRouterRequest | NextRequest} [req] - An optional request object from which to extract session information.
     * @param {PagesRouterResponse | NextResponse} [res] - An optional response object from which to extract session information.
     *
     * @throws {AccessTokenForConnectionError} If the user does not have an active session.
     * @throws {Error} If there is an error during the token exchange process.
     *
     * @returns {Promise<{ token: string; expiresAt: number; scope?: string }} An object containing the access token and its expiration time.
     */ async getAccessTokenForConnection(options, req, res) {
        const { authClient, normalizedReq } = await this.resolveRequestContext(req);
        // Connection tokens follow the upstream IdP's own token TTLs and are not
        // subject to the IPSIE primary session ceiling — skip only the ceiling check,
        // MCD domain validation still applies.
        let reqCookies;
        if (normalizedReq) {
            reqCookies = normalizedReq instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextRequest"] ? normalizedReq.cookies : this.createRequestCookies(normalizedReq);
        } else {
            reqCookies = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["cookies"])();
        }
        const { error: sessionError, session } = await authClient.getSessionWithDomainCheck(reqCookies, {
            skipCeilingCheck: true
        });
        if (sessionError) throw sessionError;
        if (!session) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AccessTokenForConnectionError"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AccessTokenForConnectionErrorCode"].MISSING_SESSION, "The user does not have an active session.");
        }
        // Find the connection token set in the session. Treat "no hint" as its own
        // key rather than a wildcard: a call without `login_hint` matches only
        // entries that also have no `loginHint`. This preserves multi-account
        // isolation — an unhinted call cannot select a hinted entry and later
        // overwrite it with an unhinted token, which would erase the hint from the
        // session. Sessions written before the multi-account feature have no
        // `loginHint` on any entry, so unhinted calls still match them (back-compat).
        const existingTokenSet = session.connectionTokenSets?.find((tokenSet)=>tokenSet.connection === options.connection && (options.login_hint ? tokenSet.loginHint === options.login_hint : !tokenSet.loginHint));
        const [error, retrievedTokenSet] = await authClient.getConnectionTokenSet(session.tokenSet, existingTokenSet, options);
        if (error !== null) {
            // The refresh-token -> connection-token exchange failed (e.g. the upstream
            // refresh token was revoked or expired). Any connection token we had
            // cached for this account is now dead, so drop it from the session and
            // persist the change. This deletes the orphaned `__FC` cookie via the
            // stateless session store, preventing it from lingering and contributing
            // to request-header bloat (see gh-2450). Then rethrow the original error.
            if (existingTokenSet && error.code === __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AccessTokenForConnectionErrorCode"].FAILED_TO_EXCHANGE && session.connectionTokenSets?.length) {
                const remaining = session.connectionTokenSets.filter((tokenSet)=>tokenSet !== existingTokenSet);
                const { connectionTokenSets: _removed, ...rest } = session;
                await this.saveToSession(remaining.length ? {
                    ...rest,
                    connectionTokenSets: remaining
                } : rest, normalizedReq, res);
            }
            throw error;
        }
        // If we didn't have a corresponding connection token set in the session
        // or if the one we have in the session does not match the one we received
        // We want to update the store incase we retrieved a token set.
        if (retrievedTokenSet && (!existingTokenSet || retrievedTokenSet.accessToken !== existingTokenSet.accessToken || retrievedTokenSet.expiresAt !== existingTokenSet.expiresAt || retrievedTokenSet.scope !== existingTokenSet.scope)) {
            let tokenSets;
            // If we already had the connection token set in the session
            // we need to update the item in the array
            // If not, we need to add it.
            if (existingTokenSet) {
                // Replace only the specific entry we matched, by identity. Matching on
                // connection (+ optional login_hint) again would, when no login_hint is
                // supplied, overwrite every entry for the connection with this single
                // token set, collapsing distinct per-account tokens into duplicates.
                tokenSets = session.connectionTokenSets?.map((tokenSet)=>tokenSet === existingTokenSet ? retrievedTokenSet : tokenSet);
            } else {
                tokenSets = [
                    ...session.connectionTokenSets || [],
                    retrievedTokenSet
                ];
            }
            await this.saveToSession({
                ...session,
                connectionTokenSets: tokenSets
            }, normalizedReq, res);
        }
        return {
            token: retrievedTokenSet.accessToken,
            scope: retrievedTokenSet.scope,
            expiresAt: retrievedTokenSet.expiresAt
        };
    }
    /**
     * Exchanges an external token for Auth0 tokens using Custom Token Exchange (RFC 8693).
     *
     * This is a server-only method that does NOT modify the session.
     * The returned tokens can be used independently or stored by the developer.
     *
     * **Note**: CTE tokens are not cached. The caller is responsible for token storage if needed.
     *
     * This method can be used in Server Actions, Route Handlers, and API routes.
     *
     * @param options - The custom token exchange options
     * @returns The token exchange response containing access token and optionally id/refresh tokens
     * @throws {CustomTokenExchangeError} If validation fails or the exchange request fails
     *
     * @example
     * ```typescript
     * const result = await auth0.customTokenExchange({
     *   subjectToken: legacyIdToken,
     *   subjectTokenType: 'urn:acme:legacy-token',
     *   audience: 'https://api.example.com',
     *   scope: 'read:data'
     * });
     *
     * console.log(result.accessToken);
     * ```
     *
     * @see {@link https://auth0.com/docs/authenticate/custom-token-exchange Auth0 CTE Documentation}
     */ async customTokenExchange(options) {
        const reqHeaders = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["headers"])();
        const authClient = await this.provider.forRequest(reqHeaders, undefined);
        const [error, response] = await authClient.customTokenExchange(options);
        if (error !== null) {
            throw error;
        }
        return response;
    }
    /**
     * Revokes the refresh token stored in the current session at the Auth0
     * `/oauth/revoke` endpoint (RFC 7009).
     *
     * Auth0 will also invalidate all access tokens issued under the same
     * authorization grant — any subsequent API calls using those tokens will
     * fail. The local session cookie is not cleared — use `handleLogout`
     * (which already revokes on logout) for a full logout.
     *
     * @param options For the Pages Router, pass the request object so the session can be read.
     *
     * @throws {TokenRevocationError} If no session or refresh token exists, or the revocation request fails.
     *
     * @see {@link https://datatracker.ietf.org/doc/html/rfc7009 RFC 7009 Token Revocation}
     */ async revokeRefreshToken(options) {
        const { authClient, normalizedReq } = await this.resolveRequestContext(options?.req);
        const session = await this.getSessionFromAuthClient(authClient, normalizedReq);
        if (!session) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["TokenRevocationError"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["TokenRevocationErrorCode"].MISSING_SESSION, "The user does not have an active session.");
        }
        if (!session.tokenSet.refreshToken?.trim()) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["TokenRevocationError"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["TokenRevocationErrorCode"].MISSING_REFRESH_TOKEN, "The session does not contain a refresh token to revoke.");
        }
        const [error] = await authClient.revokeToken(session.tokenSet.refreshToken, "refresh_token");
        if (error !== null) {
            throw error;
        }
    }
    async requestSessionTransferToken(arg1, arg2, arg3) {
        let req;
        let res;
        let options;
        // Determine which overload was called based on arguments — same pattern as getAccessToken.
        if (arg1 && (arg1 instanceof Request || typeof arg1.headers === "object")) {
            // Case: requestSessionTransferToken(req, res, options)
            req = arg1;
            res = arg2;
            options = arg3;
        } else {
            // Case: requestSessionTransferToken(options)
            options = arg1;
        }
        const { authClient, normalizedReq } = await this.resolveRequestContext(req);
        const session = await this.getSessionFromAuthClient(authClient, normalizedReq);
        const [error, result, refreshedSession] = await authClient.requestSessionTransferToken(options, session);
        if (error !== null) {
            throw error;
        }
        if (refreshedSession) {
            // Route through finalizeSession so a configured beforeSessionSaved hook runs (or
            // default ID token claim filtering is applied) — same as every other refresh-and-save
            // path (e.g. executeGetAccessToken).
            const finalSession = await authClient.finalizeSession(refreshedSession, refreshedSession.tokenSet.idToken);
            await this.saveToSession(finalSession, req, res);
        }
        return result;
    }
    /**
     * Builds a `NextResponse` redirect that carries the STT to the target app's login route.
     *
     * Returns a redirect to `targetLoginUrl?session_transfer_token=<encoded>(&organization=…)`.
     * Pure URL builder — no network call, nothing written to session.
     *
     * @param targetLoginUrl - The target app's login URL. Must be a trusted, app-controlled value.
     * @param result - The `SessionTransferTokenResult` from `requestSessionTransferToken`
     * @param opts - Optional: `organization` to append (same value passed to `requestSessionTransferToken`)
     *
     * @example
     * ```typescript
     * const result = await auth0.requestSessionTransferToken({ subjectToken, subjectTokenType });
     * return auth0.buildSessionTransferRedirect("https://app.example.com/auth/login", result);
     * ```
     */ buildSessionTransferRedirect(targetLoginUrl, result, opts) {
        // buildSessionTransferRedirect is a pure URL builder — delegate directly
        // to any AuthClient instance since it uses no per-request state.
        const staticClient = this.provider.getAuthClientForStaticMode();
        if (staticClient) {
            return staticClient.buildSessionTransferRedirect(targetLoginUrl, result, opts);
        }
        // Fallback for resolver mode with no static client. Uses the same shared
        // URL builder (with the same absolute-URL guard) as the core AuthClient,
        // so behaviour is identical on both paths.
        const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$session$2d$transfer$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["buildSessionTransferRedirectUrl"])(targetLoginUrl, result.sessionTransferToken, opts);
        return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(url);
    }
    /**
     * MFA API for server-side operations.
     *
     * Provides access to MFA methods that require encrypted mfa_token from MfaRequiredError:
     * - getAuthenticators: List enrolled MFA factors
     * - challenge: Initiate MFA challenge (OTP/OOB)
     * - verify: Complete MFA verification
     *
     * @example Handling MFA required scenario
     * ```typescript
     * try {
     *   const { token } = await auth0.getAccessToken({ audience: 'https://api.example.com' });
     * } catch (error) {
     *   if (error instanceof MfaRequiredError) {
     *     // Get available authenticators
     *     const authenticators = await auth0.mfa.getAuthenticators({
     *       mfaToken: error.mfa_token
     *     });
     *
     *     // Initiate challenge
     *     const challenge = await auth0.mfa.challenge({
     *       mfaToken: error.mfa_token,
     *       challengeType: 'otp',
     *       authenticatorId: authenticators[0].id
     *     });
     *
     *     // Verify code — tokens stored in session cookie, not in response body
     *     await auth0.mfa.verify({
     *       mfaToken: error.mfa_token,
     *       otp: '123456'
     *     });
     *     // Retrieve the access token from the session after verify
     *     const token = await auth0.getAccessToken();
     *   }
     * }
     * ```
     */ get mfa() {
        if (!this._mfa) {
            this._mfa = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$mfa$2f$server$2d$mfa$2d$client$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ServerMfaClient"](this.provider);
        }
        return this._mfa;
    }
    /**
     * Access server-side passwordless authentication operations.
     * Use `auth0.passwordless.start()` to send an OTP, and
     * `auth0.passwordless.verify()` to verify the code and log the user in.
     */ get passwordless() {
        if (!this._passwordless) {
            this._passwordless = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$passwordless$2f$server$2d$passwordless$2d$client$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ServerPasswordlessClient"](this.provider);
        }
        return this._passwordless;
    }
    /**
     * Access server-side passkey (WebAuthn) authentication and enrollment operations.
     *
     * Authentication: `auth0.passkey.register()`, `auth0.passkey.challenge()`, `auth0.passkey.getToken()`
     * Enrollment: `auth0.passkey.enrollmentChallenge()`, `auth0.passkey.enrollmentVerify()`
     */ get passkey() {
        if (!this._passkey) {
            this._passkey = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$passkey$2f$server$2d$passkey$2d$client$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ServerPasskeyClient"](this.provider);
        }
        return this._passkey;
    }
    /**
     * updateSession updates the session of the currently authenticated user. If the user does not have a session, an error is thrown.
     */ async updateSession(reqOrSession, res, sessionData) {
        // Normalize plain Request (Next 16 Node runtime) to NextRequest
        if (reqOrSession instanceof Request && !(reqOrSession instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextRequest"])) {
            reqOrSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$next$2d$compat$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["toNextRequest"])(reqOrSession);
        }
        // Normalize plain Response (Next 16 Node runtime) to NextResponse
        if (res && res instanceof Response && !(res instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"])) {
            res = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$next$2d$compat$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["toNextResponse"])(res);
        }
        if (!res) {
            // app router: Server Actions, Route Handlers
            const existingSession = await this.getSession();
            if (!existingSession) {
                throw new Error("The user is not authenticated.");
            }
            const updatedSession = reqOrSession;
            if (!updatedSession) {
                throw new Error("The session data is missing.");
            }
            await this.sessionStore.set(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["cookies"])(), await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["cookies"])(), {
                ...updatedSession,
                internal: {
                    ...existingSession.internal
                }
            });
        } else {
            const req = reqOrSession;
            if (!sessionData) {
                throw new Error("The session data is missing.");
            }
            if (req instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextRequest"] && res instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"]) {
                // middleware usage
                const existingSession = await this.getSession(req);
                if (!existingSession) {
                    throw new Error("The user is not authenticated.");
                }
                await this.sessionStore.set(req.cookies, res.cookies, {
                    ...sessionData,
                    internal: {
                        ...existingSession.internal
                    }
                });
            } else {
                // pages router usage
                const existingSession = await this.getSession(req);
                if (!existingSession) {
                    throw new Error("The user is not authenticated.");
                }
                const resHeaders = new Headers();
                const resCookies = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$edge$2d$runtime$2f$cookies$2f$dist$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__["ResponseCookies"](resHeaders);
                const updatedSession = sessionData;
                const reqCookies = this.createRequestCookies(req);
                const pagesRouterRes = res;
                await this.sessionStore.set(reqCookies, resCookies, {
                    ...updatedSession,
                    internal: {
                        ...existingSession.internal
                    }
                });
                // Handle multiple set-cookie headers properly
                // resHeaders.entries() yields each set-cookie header separately,
                // but res.setHeader() overwrites previous values. We need to collect
                // all set-cookie values and set them as an array.
                // Note: Per the Web API specification, the Headers API normalizes header names
                // to lowercase, so comparing key.toLowerCase() === "set-cookie" is safe.
                const setCookieValues = [];
                const otherHeaders = {};
                for (const [key, value] of resHeaders.entries()){
                    if (key.toLowerCase() === "set-cookie") {
                        setCookieValues.push(value);
                    } else {
                        otherHeaders[key] = value;
                    }
                }
                // Set all cookies at once as an array if any exist
                if (setCookieValues.length > 0) {
                    pagesRouterRes.setHeader("set-cookie", setCookieValues);
                }
                // Set non-cookie headers normally
                for (const [key, value] of Object.entries(otherHeaders)){
                    pagesRouterRes.setHeader(key, value);
                }
            }
        }
    }
    createRequestCookies(req) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$edge$2d$runtime$2f$cookies$2f$dist$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__["RequestCookies"]((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$next$2d$compat$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["toHeadersFromIncomingMessage"])(req));
    }
    /** @see applyEnterpriseConnectRestrictions */ disableSessionMembersForEnterpriseConnect() {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$enterprise$2d$connect$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["applyEnterpriseConnectRestrictions"])(this);
    }
    /**
     * Resolves request context from any Next.js server context into a uniform shape.
     *
     * Handles the 3-way branch:
     * - Request / NextRequest: extracts headers + nextUrl from nextReq
     * - PagesRouterRequest (IncomingMessage): converts headers, constructs URL
     * - No request (Server Components / Actions): uses next/headers, url is undefined
     *
     * @returns authClient and normalizedReq for downstream use.
     *   Cookies are NOT included — only getSession needs them, and it handles
     *   cookie extraction internally to avoid eagerly calling cookies() outside
     *   request scope (which would throw in Server Components when called from
     *   methods that don't need cookies, like getAccessToken).
     * @internal
     */ async resolveRequestContext(req) {
        if (req) {
            if (req instanceof Request) {
                const nextReq = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$next$2d$compat$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["toNextRequest"])(req);
                const authClient = await this.provider.forRequest(nextReq.headers, nextReq.nextUrl);
                return {
                    authClient,
                    normalizedReq: nextReq
                };
            }
            // Pages Router (IncomingMessage / NextApiRequest)
            const reqHeaders = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$next$2d$compat$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["toHeadersFromIncomingMessage"])(req);
            const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$next$2d$compat$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["toUrlFromPagesRouter"])(req);
            const authClient = await this.provider.forRequest(reqHeaders, url);
            return {
                authClient,
                normalizedReq: req
            };
        }
        // Server Components / Server Actions — no request object
        const reqHeaders = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["headers"])();
        const authClient = await this.provider.forRequest(reqHeaders, undefined);
        return {
            authClient
        };
    }
    /**
     * Mints a My Account API access token. Minting can silently refresh the
     * primary token, which rotates (and invalidates) the shared refresh token, so
     * that rotation must be persisted or the next refresh triggers reuse-detection
     * and logs the user out.
     *
     * Returns the access token, the session reflecting any rotation, and a
     * `sessionChanged` flag indicating whether the mint rotated the token set.
     *
     * By default the rotated session is persisted here. Callers that write the
     * session again afterwards (e.g. to prune connectionTokenSets) should pass
     * `persist: false` and perform a single write from the returned `session`,
     * so the response does not carry two conflicting `Set-Cookie` writes for the
     * same session and connection cookies. Such callers must start from the
     * returned `session` (not a fresh cookie re-read): in the Pages Router,
     * request cookies are rebuilt from the original request headers and never
     * reflect writes made during this request, so a re-read would clobber the
     * rotated refresh token. When `persist` is false and the caller ends up not
     * writing (nothing to prune), it must still persist the rotated session when
     * `sessionChanged` is true.
     * @internal
     */ async mintMyAccountToken(options, req, res, { persist = true } = {}) {
        const { authClient, normalizedReq } = await this.resolveRequestContext(req);
        const session = await this.getSessionFromAuthClient(authClient, normalizedReq);
        if (!session) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AccessTokenError"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AccessTokenErrorCode"].MISSING_SESSION, "The user does not have an active session.");
        }
        const [error, tokenSetResponse] = await authClient.getTokenSet(session, options);
        if (error) {
            throw error;
        }
        const { tokenSet, idTokenClaims } = tokenSetResponse;
        const sessionChanges = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$session$2d$changes$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["getSessionChangesAfterGetAccessToken"])(session, tokenSet, {
            scope: __classPrivateFieldGet(this, _Auth0Client_options, "f").authorizationParameters?.scope ?? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DEFAULT_SCOPES"],
            audience: __classPrivateFieldGet(this, _Auth0Client_options, "f").authorizationParameters?.audience
        });
        let persistedSession = session;
        const sessionChanged = !!sessionChanges;
        if (sessionChanges) {
            if (idTokenClaims) {
                session.user = idTokenClaims;
            }
            const finalSession = await authClient.finalizeSession({
                ...session,
                ...sessionChanges
            }, tokenSet.idToken);
            persistedSession = finalSession;
            if (persist) {
                await this.saveToSession(finalSession, req, res);
            }
        }
        return {
            token: tokenSet.accessToken,
            expiresAt: tokenSet.expiresAt,
            audience: tokenSet.audience,
            session: persistedSession,
            sessionChanged
        };
    }
    /**
     * startInteractiveLogin redirects the user to the authorization server to log in.
     *
     * Pass the request when one is available (Route Handlers, middleware, the Pages
     * Router). The request is what lets the SDK read this browser's cookies, which
     * is how an active anonymous session is linked to the login transaction. In a
     * Server Action, where there is no request object, cookies are read through
     * `next/headers` instead.
     */ async startInteractiveLogin(options = {}, req) {
        const { authClient, normalizedReq } = await this.resolveRequestContext(req);
        if (normalizedReq instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextRequest"]) {
            return authClient.startInteractiveLogin(options, normalizedReq);
        }
        // No NextRequest to hand down, so supply the request cookies separately:
        // the Pages Router request carries them in its headers, and a Server Action
        // reads them through next/headers. Forwarding cookies is required so
        // TransactionStore.save() can run __txn_* cookie eviction — without them
        // stale transaction cookies accumulate unbounded for logins started from
        // Server Actions.
        const reqCookies = normalizedReq ? this.createRequestCookies(normalizedReq) : await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["cookies"])();
        return authClient.startInteractiveLogin(options, undefined, reqCookies);
    }
    /**
     * Login entry point for {@link Auth0Client.enterpriseConnect} mode.
     *
     * Runs Home Realm Discovery on the email domain. Returns a `NextResponse`
     * redirect (with `login_hint` set) when the domain is federated, or `null`
     * when it is not — allowing the caller to fall back to its own login.
     *
     * Must be called from a Route Handler (not a Server Action) so the transaction
     * cookie is returned to the browser.
     *
     * @param options - `email` is required; `authorizationParameters`, `returnTo`,
     *   and `challengeMode` are forwarded to the underlying login.
     * @returns Redirect response for a federated domain, or `null`.
     *
     * @example
     * ```ts
     * // app/api/login/route.ts
     * export async function POST(req: NextRequest) {
     *   const email = String((await req.formData()).get("email") ?? "");
     *   const res = await auth0.startEnterpriseLogin({ email, returnTo: "/dashboard" });
     *   if (res) {
     *     const redirect = NextResponse.redirect(res.headers.get("location")!, 303);
     *     for (const c of res.cookies.getAll()) redirect.cookies.set(c);
     *     return redirect;
     *   }
     *   return NextResponse.redirect(new URL("/existing-login", req.url));
     * }
     * ```
     *
     * @see [Enterprise Connect](https://github.com/auth0/nextjs-auth0/blob/main/EXAMPLES.md#enterprise-connect-b2b-integration) for the full flow.
     */ async startEnterpriseLogin(options) {
        const emailDomain = options.email.split("@")[1]?.toLowerCase();
        if (!emailDomain) {
            return null;
        }
        const reqHeaders = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["headers"])();
        const authClient = await this.provider.forRequest(reqHeaders, undefined);
        const federated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$webfingerCache$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isFederatedDomain"])(authClient.domain, emailDomain, {
            customFetch: authClient.createWebFingerFetch()
        });
        if (!federated) {
            return null;
        }
        const { email, authorizationParameters, ...rest } = options;
        const loginOptions = {
            ...rest,
            authorizationParameters: {
                ...authorizationParameters,
                login_hint: email
            }
        };
        // Forward request cookies so stale `__txn_*` cookies can be evicted.
        return authClient.startInteractiveLogin(loginOptions, undefined, await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["cookies"])());
    }
    /**
     * Authenticates using Client-Initiated Backchannel Authentication and returns the token set and optionally the ID token claims and authorization details.
     *
     * This method will initialize the backchannel authentication process with Auth0, and poll the token endpoint until the authentication is complete.
     *
     * Using Client-Initiated Backchannel Authentication requires the feature to be enabled in the Auth0 dashboard.
     * @see https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-initiated-backchannel-authentication-flow
     */ async getTokenByBackchannelAuth(options) {
        const reqHeaders = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["headers"])();
        const authClient = await this.provider.forRequest(reqHeaders, undefined);
        const [error, response] = await authClient.backchannelAuthentication(options);
        if (error) {
            throw error;
        }
        return response;
    }
    /**
     * Initiates the Connect Account flow to connect a third-party account to the user's profile.
     * If the user does not have an active session, a `ConnectAccountError` is thrown.
     *
     * This method first attempts to obtain an access token with the `create:me:connected_accounts` scope
     * for the My Account API to create a connected account for the user.
     *
     * The user will then be redirected to authorize the connection with the third-party provider.
     *
     * Pass the `req` object when calling from middleware or when `APP_BASE_URL` is
     * configured dynamically (as an array of allowed origins), so the redirect and
     * session are resolved from the request context. In App Router Server Actions
     * and Route Handlers with a static `APP_BASE_URL`, omit it. Because this
     * returns a redirect `NextResponse` (rather than writing to a passed-in
     * response), a Pages Router `ServerResponse` is not accepted here; forward the
     * returned response's `Location` and `Set-Cookie` headers onto your response.
     *
     * Minting the My Account access token can rotate the refresh token. On success
     * that rotation is written onto the returned redirect response's cookies, so
     * forwarding its `Set-Cookie` headers (as above) persists it. On the error path
     * there is no response to attach to, so the rotation is persisted best-effort
     * via ambient cookies, which a React Server Component cannot write; prefer a
     * Route Handler, Server Action, API route, or middleware so a failed connect
     * does not drop the rotated token and log the user out on the next refresh.
     *
     * You must enable `Offline Access` from the Connection Permissions settings to be able to use the connection with Connected Accounts.
     */ async connectAccount(options, req) {
        const { authClient, normalizedReq } = await this.resolveRequestContext(req);
        const session = await this.getSessionFromAuthClient(authClient, normalizedReq);
        if (!session) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$my$2d$account$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ConnectAccountError"]({
                code: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$my$2d$account$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ConnectAccountErrorCodes"].MISSING_SESSION,
                message: "The user does not have an active session."
            });
        }
        // Use the full issuer URL from authClient (including any path component for
        // providers like Okta custom authorization servers, e.g.
        // https://myorg.okta.com/oauth2/default/) so the audience is correct.
        const getMyAccountTokenOpts = {
            audience: `${authClient.issuer}me/`,
            scope: "create:me:connected_accounts"
        };
        // Defer persistence: connectAccount returns its own redirect response, so a
        // rotated session must be written onto that response's cookies below (an
        // ambient cookies() write would not attach to the returned redirect, and in
        // middleware/Pages there is no response to write to here at all).
        const accessToken = await this.mintMyAccountToken(getMyAccountTokenOpts, normalizedReq, undefined, {
            persist: false
        });
        const [error, connectAccountResponse] = await authClient.connectAccount({
            ...options,
            tokenSet: {
                accessToken: accessToken.token,
                expiresAt: accessToken.expiresAt,
                scope: getMyAccountTokenOpts.scope,
                audience: accessToken.audience
            }
        }, normalizedReq instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextRequest"] ? normalizedReq : undefined);
        if (error) {
            // The mint may have rotated the refresh token before connectAccount
            // failed. There is no redirect response to attach cookies to on the error
            // path, so persist the rotated session best-effort (App Router ambient
            // cookies; a no-op in middleware/Pages, where there is no response to
            // write to here). This avoids dropping the rotation, which would trigger
            // reuse-detection and log the user out on the next refresh.
            if (accessToken.sessionChanged) {
                await this.saveToSession(accessToken.session, undefined, undefined);
            }
            throw error;
        }
        // If the mint rotated the refresh token, persist it onto the redirect
        // response so the rotated token is not dropped (which would trigger
        // reuse-detection and log the user out on the next refresh). Writing to the
        // response cookies works across App Router, middleware, and Pages Router
        // since the caller forwards this response's Set-Cookie headers.
        if (accessToken.sessionChanged) {
            const reqCookies = normalizedReq instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextRequest"] ? normalizedReq.cookies : await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["cookies"])();
            await this.sessionStore.set(reqCookies, connectAccountResponse.cookies, accessToken.session);
        }
        return connectAccountResponse;
    }
    /**
     * Disconnects (unlinks) all connected accounts for the given connection.
     *
     * This revokes the connection server-side via the My Account API and removes
     * the corresponding cached connection tokens from the session so they are not
     * re-assembled on subsequent reads.
     *
     * If the user does not have an active session, a `ConnectedAccountsError` is
     * thrown with code `MISSING_SESSION`. If the server-side revoke fails, a
     * `ConnectedAccountsError` with code `FAILED_TO_DELETE` is thrown.
     *
     * **Do not call this from a React Server Component.** Minting the My Account
     * access token can rotate the refresh token, and Server Components cannot
     * write cookies, so the write is silently dropped (only warned in
     * `NODE_ENV=development`). On the next request the browser still sends the old
     * refresh token, which the authorization server rejects as replay and logs the
     * user out. Call from a Route Handler, Server Action, API route, or middleware.
     *
     * Partial-failure contract: the local cached connection tokens
     * (`connectionTokenSets`) for the connection are pruned from the session
     * regardless of whether the server-side revoke succeeded, and any rotated
     * refresh token is persisted, before the error (if any) is rethrown. So on a
     * `FAILED_TO_DELETE` the server-side state may be partially disconnected while
     * the local state is fully cleaned; a subsequent `getAccessTokenForConnection`
     * would fail-exchange and prune anyway.
     *
     * In the Pages Router (or middleware), pass the `req` and `res` objects so the
     * pruned session can be persisted to the response cookies. In App Router Server
     * Actions and Route Handlers, omit them.
     *
     * Note: disconnect is connection-scoped. All accounts connected through the
     * given connection are disconnected. Per-account disconnect is not currently
     * supported because the My Account API keys connected accounts by id and does
     * not expose the login hint used to disambiguate multiple accounts on the same
     * connection.
     */ async disconnectAccount(options, req, res) {
        const { authClient, normalizedReq } = await this.resolveRequestContext(req);
        const session = await this.getSessionFromAuthClient(authClient, normalizedReq);
        if (!session) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$my$2d$account$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ConnectedAccountsError"]({
                code: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$my$2d$account$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ConnectedAccountsErrorCodes"].MISSING_SESSION,
                message: "The user does not have an active session."
            });
        }
        // Use the full issuer URL from authClient (including any path component for
        // providers like Okta custom authorization servers, e.g.
        // https://myorg.okta.com/oauth2/default/) so the audience is correct.
        const getMyAccountTokenOpts = {
            audience: `${authClient.issuer}me/`,
            scope: "read:me:connected_accounts delete:me:connected_accounts"
        };
        // Defer persistence: this method may write the session again below to prune
        // connectionTokenSets. Writing once (from the mint's rotated session) avoids
        // emitting two conflicting `Set-Cookie` writes for the same cookies.
        const accessToken = await this.mintMyAccountToken(getMyAccountTokenOpts, normalizedReq, res, {
            persist: false
        });
        const [error] = await authClient.disconnectAccount({
            accessToken: accessToken.token,
            expiresAt: accessToken.expiresAt,
            scope: getMyAccountTokenOpts.scope,
            audience: accessToken.audience
        }, options.connection);
        // Prune cached connection tokens for this connection regardless of whether
        // the loop over accounts fully succeeded. When multiple accounts share a
        // connection and only some are unlinked before an error (e.g. rate limit
        // on the second DELETE), the server-side state is partially disconnected
        // while our cached tokens for the connection are now stale. Pruning is
        // connection-scoped, so it's safe to prune all local state for the
        // connection: a subsequent getAccessTokenForConnection would fail-exchange
        // and prune anyway. Rethrow the error after pruning so the caller sees the
        // partial failure.
        //
        // Prune from the session the mint produced, not a fresh cookie re-read. In
        // the Pages Router, request cookies are rebuilt from the original request
        // headers and never reflect writes made during the mint, so a re-read would
        // clobber the rotated refresh token.
        const latestSession = accessToken.session;
        let pruned = false;
        if (latestSession.connectionTokenSets?.length) {
            const remaining = latestSession.connectionTokenSets.filter((tokenSet)=>tokenSet.connection !== options.connection);
            if (remaining.length !== latestSession.connectionTokenSets.length) {
                const { connectionTokenSets: _removed, ...rest } = latestSession;
                await this.saveToSession(remaining.length ? {
                    ...rest,
                    connectionTokenSets: remaining
                } : rest, normalizedReq, res);
                pruned = true;
            }
        }
        // If nothing was pruned, the mint may still have rotated the token set.
        // Persist it here since mintMyAccountToken was told not to (persist: false).
        // This runs before the rethrow below so a rotated refresh token is never
        // dropped on the error path (which would trigger reuse-detection and log the
        // user out on the next refresh). The prune write above already carries the
        // rotation, so at most one write happens.
        if (!pruned && accessToken.sessionChanged) {
            await this.saveToSession(latestSession, normalizedReq, res);
        }
        // Rethrow after persisting so the caller sees the partial failure.
        if (error) {
            throw error;
        }
    }
    /**
     * Lists the connected accounts for the current user from the My Account API.
     *
     * The My Account API is the source of truth, so this also reconciles the
     * session: any locally cached connection tokens (`connectionTokenSets`) whose
     * connection is no longer present server-side are pruned, so they are not
     * re-assembled into the session on subsequent reads.
     *
     * **Do not call this from a React Server Component.** Minting the My Account
     * access token can rotate the refresh token, and Server Components cannot
     * write cookies — the write is silently dropped (only warned in
     * `NODE_ENV=development`). On the next request the browser still sends the
     * old refresh token, which the authorization server rejects as replay and
     * logs the user out. Call from a Route Handler, Server Action, API route,
     * or middleware. In the Pages Router (or middleware), pass the `req` and
     * `res` objects so the reconciled session can be persisted to the response
     * cookies.
     *
     * If the user does not have an active session, a `ConnectedAccountsError` is thrown.
     *
     * Note: reconciliation is connection-scoped. If a user has multiple accounts
     * on the same connection and only some are disconnected server-side, the
     * connection still appears in the list, so the local tokens are retained. This
     * mirrors the connection-scoped behaviour of {@link disconnectAccount}.
     */ async getConnectedAccounts(req, res) {
        const { authClient, normalizedReq } = await this.resolveRequestContext(req);
        const session = await this.getSessionFromAuthClient(authClient, normalizedReq);
        if (!session) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$my$2d$account$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ConnectedAccountsError"]({
                code: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$my$2d$account$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["ConnectedAccountsErrorCodes"].MISSING_SESSION,
                message: "The user does not have an active session."
            });
        }
        // Use the full issuer URL from authClient (including any path component for
        // providers like Okta custom authorization servers) so the audience is correct.
        const getMyAccountTokenOpts = {
            audience: `${authClient.issuer}me/`,
            scope: "read:me:connected_accounts"
        };
        // Defer persistence: this method may write the session again below to prune
        // stale connectionTokenSets. Writing once (from the mint's rotated session)
        // avoids emitting two conflicting `Set-Cookie` writes for the same cookies.
        const accessToken = await this.mintMyAccountToken(getMyAccountTokenOpts, normalizedReq, res, {
            persist: false
        });
        const [error, accounts] = await authClient.listConnectedAccounts({
            accessToken: accessToken.token,
            expiresAt: accessToken.expiresAt,
            scope: getMyAccountTokenOpts.scope,
            audience: accessToken.audience
        });
        if (error) {
            // The mint may have rotated the refresh token before the list failed
            // (the first call in a session always refreshes, since the My Account
            // audience is not cached yet). Persist the rotation before rethrowing so
            // it is not dropped, which would trigger reuse-detection and log the user
            // out on the next refresh.
            if (accessToken.sessionChanged) {
                await this.saveToSession(accessToken.session, normalizedReq, res);
            }
            throw error;
        }
        // Reconcile: drop cached connection tokens whose connection is no longer
        // present server-side.
        //
        // Prune from the session the mint produced, not a fresh cookie re-read. In
        // the Pages Router, request cookies are rebuilt from the original request
        // headers and never reflect writes made during the mint, so a re-read would
        // clobber the rotated refresh token.
        const latestSession = accessToken.session;
        let reconciled = false;
        if (latestSession.connectionTokenSets?.length) {
            const serverConnections = new Set(accounts.map((account)=>account.connection));
            const remaining = latestSession.connectionTokenSets.filter((tokenSet)=>serverConnections.has(tokenSet.connection));
            if (remaining.length !== latestSession.connectionTokenSets.length) {
                const { connectionTokenSets: _removed, ...rest } = latestSession;
                await this.saveToSession(remaining.length ? {
                    ...rest,
                    connectionTokenSets: remaining
                } : rest, normalizedReq, res);
                reconciled = true;
            }
        }
        // Nothing was reconciled, but the mint may have rotated the token set.
        // Persist it here since mintMyAccountToken was told not to (persist: false).
        if (!reconciled && accessToken.sessionChanged) {
            await this.saveToSession(latestSession, normalizedReq, res);
        }
        return accounts;
    }
    // Implementation
    withPageAuthRequired(fnOrOpts, opts) {
        const config = {
            loginUrl: this.routes.login
        };
        const appRouteHandler = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$helpers$2f$with$2d$page$2d$auth$2d$required$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["appRouteHandlerFactory"])(this, config);
        const pageRouteHandler = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$helpers$2f$with$2d$page$2d$auth$2d$required$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["pageRouteHandlerFactory"])(this, config);
        if (typeof fnOrOpts === "function") {
            return appRouteHandler(fnOrOpts, opts);
        }
        return pageRouteHandler(fnOrOpts);
    }
    withApiAuthRequired(apiRoute) {
        const pageRouteHandler = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$helpers$2f$with$2d$api$2d$auth$2d$required$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["pageRouteHandlerFactory"](this);
        const appRouteHandler = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$helpers$2f$with$2d$api$2d$auth$2d$required$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["appRouteHandlerFactory"](this);
        return (req, resOrParams)=>{
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$request$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isRequest"])(req)) {
                return appRouteHandler(apiRoute)(req, resOrParams);
            }
            return pageRouteHandler(apiRoute)(req, resOrParams);
        };
    }
    async saveToSession(data, req, res) {
        if (req && res) {
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$request$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isRequest"])(req) && res instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"]) {
                // middleware usage
                const nextReq = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$next$2d$compat$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["toNextRequest"])(req);
                await this.sessionStore.set(nextReq.cookies, res.cookies, data);
            } else {
                // pages router usage
                const resHeaders = new Headers();
                const resCookies = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$edge$2d$runtime$2f$cookies$2f$dist$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__["ResponseCookies"](resHeaders);
                const pagesRouterRes = res;
                await this.sessionStore.set(this.createRequestCookies(req), resCookies, data);
                for (const cookie of resHeaders.getSetCookie()){
                    pagesRouterRes.appendHeader("set-cookie", cookie);
                }
                // Set any other headers (non-cookie)
                for (const [key, value] of resHeaders.entries()){
                    if (key.toLowerCase() !== "set-cookie") {
                        pagesRouterRes.setHeader(key, value);
                    }
                }
            }
        } else {
            // app router usage: Server Components, Server Actions, Route Handlers
            try {
                await this.sessionStore.set(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["cookies"])(), await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["cookies"])(), data);
            } catch (e) {
                if ("TURBOPACK compile-time truthy", 1) {
                    console.warn("Failed to persist the updated token set. `getAccessToken()` was likely called from a Server Component which cannot set cookies.");
                }
            }
        }
    }
    /**
     * Validates and extracts required configuration options.
     * @param options The client options
     * @returns The validated required options
     * @throws ConfigurationError if any required option is missing
     */ validateAndExtractRequiredOptions(options) {
        // Base required options that are always needed
        const requiredOptions = {
            domain: options.domain ?? process.env.AUTH0_DOMAIN,
            clientId: options.clientId ?? process.env.AUTH0_CLIENT_ID,
            secret: options.secret ?? process.env.AUTH0_SECRET
        };
        const envAppBaseUrl = process.env.APP_BASE_URL?.includes(",") ? process.env.APP_BASE_URL.split(",").map((u)=>u.trim()).filter(Boolean) : process.env.APP_BASE_URL;
        const appBaseUrl = options.appBaseUrl ?? envAppBaseUrl;
        // Check client authentication options - either clientSecret OR clientAssertionSigningKey must be provided.
        // mTLS (useMtls=true / AUTH0_MTLS=true) authenticates via a client certificate so no secret is needed.
        const clientSecret = options.clientSecret ?? process.env.AUTH0_CLIENT_SECRET;
        const clientAssertionSigningKey = options.clientAssertionSigningKey ?? process.env.AUTH0_CLIENT_ASSERTION_SIGNING_KEY;
        const isMtls = options.useMtls ?? process.env.AUTH0_MTLS === "true";
        const hasClientAuthentication = !!(clientSecret || clientAssertionSigningKey) || isMtls;
        const missing = Object.entries(requiredOptions).filter(([, value])=>!value).map(([key])=>key);
        // Add client authentication error if neither option is provided
        if (!hasClientAuthentication) {
            missing.push("clientAuthentication");
        }
        if (missing.length) {
            // Map of option keys to their exact environment variable names
            const envVarNames = {
                domain: "AUTH0_DOMAIN",
                clientId: "AUTH0_CLIENT_ID",
                secret: "AUTH0_SECRET"
            };
            // Standard intro message explaining the issue
            let errorMessage = "WARNING: Not all required options were provided when creating an instance of Auth0Client. Ensure to provide all missing options, either by passing it to the Auth0Client constructor, or by setting the corresponding environment variable.\n";
            // Add specific details for each missing option
            missing.forEach((key)=>{
                if (key === "clientAuthentication") {
                    errorMessage += `Missing: clientAuthentication: Set either AUTH0_CLIENT_SECRET env var or AUTH0_CLIENT_ASSERTION_SIGNING_KEY env var, or pass clientSecret or clientAssertionSigningKey in options\n`;
                } else if (envVarNames[key]) {
                    errorMessage += `Missing: ${key}: Set ${envVarNames[key]} env var or pass ${key} in options\n`;
                } else {
                    errorMessage += `Missing: ${key}\n`;
                }
            });
            console.error(errorMessage.trim());
        }
        // Prepare the result object with all validated options
        const result = {
            ...requiredOptions,
            appBaseUrl,
            clientSecret,
            clientAssertionSigningKey
        };
        // Type-safe assignment after validation
        return result;
    }
    /**
     * Creates a configured Fetcher instance for making authenticated API requests.
     *
     * This method creates a specialized HTTP client that handles:
     * - Automatic access token retrieval and injection
     * - DPoP (Demonstrating Proof-of-Possession) proof generation when enabled
     * - Token refresh and session management
     * - Error handling and retry logic for DPoP nonce errors
     * - Base URL resolution for relative requests
     *
     * The fetcher provides a high-level interface for making requests to protected resources
     * without manually handling authentication details.
     *
     * @template TOutput - Response type that extends the standard Response interface
     * @param req - Request object for session context (required for Pages Router, optional for App Router)
     * @param options - Configuration options for the fetcher
     * @param options.useDPoP - Enable DPoP for this fetcher instance (overrides global setting)
     * @param options.baseUrl - Base URL for resolving relative requests
     * @param options.getAccessToken - Custom access token factory function
     * @param options.fetch - Custom fetch implementation
     * @returns Promise that resolves to a configured Fetcher instance
     * @throws AccessTokenError when no active session exists
     *
     * @example
     * ```typescript
     * import { auth0 } from "@/lib/auth0";
     *
     * const fetcher = await auth0.createFetcher(undefined, {
     *   baseUrl: "https://api.example.com",
     *   useDPoP: true
     * });
     *
     * const response = await fetcher.fetchWithAuth("/users");
     * const users = await response.json();
     * ```
     *
     * @see {@link Fetcher} for details on using the returned fetcher instance
     * @see {@link FetcherMinimalConfig} for available configuration options
     */ async createFetcher(req, options) {
        const { authClient, normalizedReq } = await this.resolveRequestContext(req);
        const session = normalizedReq ? await this.getSession(normalizedReq) : await this.getSession();
        if (!session) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AccessTokenError"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AccessTokenErrorCode"].MISSING_SESSION, "The user does not have an active session.");
        }
        const getAccessToken = async (getAccessTokenOptions)=>{
            const [error, getTokenSetResponse] = await authClient.getTokenSet(session, getAccessTokenOptions || {});
            if (error) {
                throw error;
            }
            return getTokenSetResponse.tokenSet;
        };
        const fetcher = await authClient.fetcherFactory({
            ...options,
            getAccessToken
        });
        return fetcher;
    }
    /**
     * Resolve mfaContextTtl with validation and fallback to default.
     * Issues console warning for invalid values instead of throwing.
     */ resolveMfaTokenTtl(optionValue, envValue) {
        const DEFAULT_TTL = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DEFAULT_MFA_CONTEXT_TTL_SECONDS"];
        // Try option value first
        if (optionValue !== undefined) {
            if (Number.isFinite(optionValue) && optionValue > 0) {
                return optionValue;
            }
            console.warn(`[auth0-nextjs] Invalid mfaTokenTtl option value: ${optionValue}. ` + `Using default: ${DEFAULT_TTL} seconds.`);
            return DEFAULT_TTL;
        }
        // Try environment variable
        if (envValue !== undefined) {
            const parsed = parseInt(envValue, 10);
            if (Number.isFinite(parsed) && parsed > 0) {
                return parsed;
            }
            console.warn(`[auth0-nextjs] Invalid AUTH0_MFA_TOKEN_TTL environment variable: ${envValue}. ` + `Using default: ${DEFAULT_TTL} seconds.`);
            return DEFAULT_TTL;
        }
        return DEFAULT_TTL;
    }
}
_Auth0Client_options = new WeakMap();
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/cookies.js [middleware] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addCacheControlHeadersForSession",
    ()=>addCacheControlHeadersForSession,
    "decrypt",
    ()=>decrypt,
    "deleteChunkedCookie",
    ()=>deleteChunkedCookie,
    "deleteCookie",
    ()=>deleteCookie,
    "encrypt",
    ()=>encrypt,
    "getChunkedCookie",
    ()=>getChunkedCookie,
    "setChunkedCookie",
    ()=>setChunkedCookie,
    "sign",
    ()=>sign,
    "verifySigned",
    ()=>verifySigned
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$edge$2d$runtime$2f$cookies$2f$dist$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@edge-runtime/cookies/dist/index.mjs [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$panva$2f$hkdf$2f$dist$2f$node$2f$esm$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@panva/hkdf/dist/node/esm/index.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$encrypt$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/jwt/encrypt.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$decrypt$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/jwt/decrypt.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__base64url$3e$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/util/base64url.js [middleware] (ecmascript) <export * as base64url>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jws$2f$flattened$2f$verify$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/jws/flattened/verify.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jws$2f$flattened$2f$sign$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/jws/flattened/sign.js [middleware] (ecmascript)");
;
;
;
const ENC = "A256GCM";
const ALG = "dir";
const DIGEST = "sha256";
const BYTE_LENGTH = 32;
const ENCRYPTION_INFO = "JWE CEK";
async function encrypt(payload, secret, expiration, additionalHeaders) {
    const encryptionSecret = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$panva$2f$hkdf$2f$dist$2f$node$2f$esm$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["hkdf"])(DIGEST, secret, "", ENCRYPTION_INFO, BYTE_LENGTH);
    const encryptedCookie = await new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$encrypt$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["EncryptJWT"](payload).setProtectedHeader({
        enc: ENC,
        alg: ALG,
        ...additionalHeaders
    }).setExpirationTime(expiration).encrypt(encryptionSecret);
    return encryptedCookie.toString();
}
async function decrypt(cookieValue, secret, options, throwOnJWEErrors) {
    try {
        const encryptionSecret = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$panva$2f$hkdf$2f$dist$2f$node$2f$esm$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["hkdf"])(DIGEST, secret, "", ENCRYPTION_INFO, BYTE_LENGTH);
        const cookie = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$decrypt$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jwtDecrypt"](cookieValue, encryptionSecret, {
            ...options,
            ...{
                clockTolerance: 15
            }
        });
        return cookie;
    } catch (e) {
        // When throwOnJWEErrors is true, throw the original error to preserve granular error codes
        if (throwOnJWEErrors) {
            throw e;
        }
        // When the JWE can not be decrypted or has expired, return null to indicate an invalid cookie and treat it as non-existent.
        if (e.code === "ERR_JWE_DECRYPTION_FAILED" || e.code === "ERR_JWT_EXPIRED" || e.code === "ERR_JWE_INVALID") {
            return null;
        }
        throw e;
    }
}
/**
 * Derive a signing key from a given secret.
 * This method is used solely to migrate signed, legacy cookies to the new encrypted cookie format (v4+).
 */ const signingSecret = (secret)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$panva$2f$hkdf$2f$dist$2f$node$2f$esm$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["hkdf"])("sha256", secret, "", "JWS Cookie Signing", BYTE_LENGTH);
async function verifySigned(k, v, secret) {
    if (!v) {
        return undefined;
    }
    const [value, signature] = v.split(".");
    const flattenedJWS = {
        protected: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__base64url$3e$__["base64url"].encode(JSON.stringify({
            alg: "HS256",
            b64: false,
            crit: [
                "b64"
            ]
        })),
        payload: `${k}=${value}`,
        signature
    };
    const key = await signingSecret(secret);
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jws$2f$flattened$2f$verify$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["flattenedVerify"](flattenedJWS, key, {
            algorithms: [
                "HS256"
            ]
        });
        return value;
    } catch (e) {
        return undefined;
    }
}
async function sign(name, value, secret) {
    const key = await signingSecret(secret);
    const { signature } = await new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jws$2f$flattened$2f$sign$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["FlattenedSign"](new TextEncoder().encode(`${name}=${value}`)).setProtectedHeader({
        alg: "HS256",
        b64: false,
        crit: [
            "b64"
        ]
    }).sign(key);
    return `${value}.${signature}`;
}
;
;
// Chunked cookies Configuration
const MAX_CHUNK_SIZE = 3500; // Slightly under 4KB
const CHUNK_PREFIX = "__";
const CHUNK_INDEX_REGEX = new RegExp(`${CHUNK_PREFIX}(\\d+)$`);
const LEGACY_CHUNK_INDEX_REGEX = /\.(\d+)$/;
// Minimum deterministic sweep range for chunk cleanup. Cleanup uses
// `getClearUpTo`, which sweeps at least `__0..MAX_CHUNKS-1` (this constant) and
// also anything higher the current request's snapshot reveals. The deterministic
// minimum covers the concurrent-write case within this range: a tab that wrote a
// chunk absent from this request's stale snapshot is still cleaned. The snapshot
// extension covers the shrink case: a session that once grew past this range
// and later shrinks has its high-index chunks removed instead of orphaned.
// Values above `MAX_CHUNKS` written by a concurrent tab and absent from this
// snapshot are the residual case — the next write on this connection sees them
// and cleans up (self-healing after one bad response). 5 × 3500 = 17,500 bytes
// covers the typical session envelope; sessions larger than that surface the
// oversized-session warning in `stateless-session-store.ts`.
const MAX_CHUNKS = 5;
/**
 * Retrieves the index of a cookie based on its name.
 * Supports current format `{name}__{index}` and legacy format `{name}.{index}`.
 *
 * @param name - The name of the cookie.
 * @returns The index of the cookie. Returns undefined if no index is found.
 */ const getChunkedCookieIndex = (name, isLegacyCookie)=>{
    const match = isLegacyCookie ? LEGACY_CHUNK_INDEX_REGEX.exec(name) : CHUNK_INDEX_REGEX.exec(name);
    if (!match) {
        return undefined;
    }
    return parseInt(match[1], 10);
};
/**
 * Retrieves all cookies from the request that have names matching the exact
 * `{name}{CHUNK_PREFIX}{digits}` shape (or `{name}.{digits}` for the legacy
 * format). The regex is built once per shape at module load rather than per
 * call — `setChunkedCookie` runs on every authenticated request under rolling
 * sessions, so avoiding a fresh RegExp per call matters.
 *
 * @param reqCookies - The cookies from the request.
 * @param name - The base name of the cookies to retrieve.
 * @returns An array of cookies matching the chunked-cookie shape.
 */ const getAllChunkedCookies = (reqCookies, name, isLegacyCookie)=>{
    const regex = isLegacyCookie ? getLegacyChunkedCookieRegex(name) : getChunkedCookieRegex(name);
    return reqCookies.getAll().filter((cookie)=>regex.test(cookie.name));
};
// Per-name regex caches, populated on first use. Prevents rebuilding the same
// RegExp on every hot-path call. Names are bounded (session, legacy session,
// __FC cookies), so unbounded growth is not a concern.
const chunkedCookieRegexCache = new Map();
const legacyChunkedCookieRegexCache = new Map();
const getChunkedCookieRegex = (name)=>{
    const cached = chunkedCookieRegexCache.get(name);
    if (cached) return cached;
    const regex = new RegExp(`^${name}${CHUNK_PREFIX}\\d+$`);
    chunkedCookieRegexCache.set(name, regex);
    return regex;
};
const getLegacyChunkedCookieRegex = (name)=>{
    const cached = legacyChunkedCookieRegexCache.get(name);
    if (cached) return cached;
    const regex = new RegExp(`^${name}${LEGACY_CHUNK_INDEX_REGEX.source}$`);
    legacyChunkedCookieRegexCache.set(name, regex);
    return regex;
};
/**
 * Returns the exclusive upper bound for chunk-cleanup loops: `max(MAX_CHUNKS,
 * highestSeenIndex + 1)`. Guarantees the deterministic `__0..MAX_CHUNKS-1`
 * sweep (which covers concurrent-tab writes below `MAX_CHUNKS` that this
 * request's snapshot missed), while also clearing anything the current
 * snapshot reveals above that range — so a session that once grew past
 * `MAX_CHUNKS` and later shrinks does not leave orphaned high-index chunks.
 *
 * Residual case: a concurrent tab that wrote `__session__N` with `N >=
 * MAX_CHUNKS`, absent from THIS request's snapshot, is not cleared here.
 * That single request's read returns `undefined` for the session. The next
 * write on this connection sees `__N` in its snapshot and cleans it up
 * (self-healing). Bounded to at most one bad response per orphan.
 */ const getClearUpTo = (reqCookies, name)=>{
    let highestSeen = -1;
    for (const cookie of getAllChunkedCookies(reqCookies, name)){
        const idx = getChunkedCookieIndex(cookie.name);
        if (idx !== undefined && idx > highestSeen) highestSeen = idx;
    }
    return Math.max(MAX_CHUNKS, highestSeen + 1);
};
function setChunkedCookie(name, value, options, reqCookies, resCookies) {
    const { transient, ...restOptions } = options;
    const finalOptions = {
        ...restOptions
    };
    if (transient) {
        delete finalOptions.maxAge;
    }
    const encoder = new TextEncoder();
    const sizeOf = (cookieName, cookieValue)=>encoder.encode(`${cookieName}=${cookieValue}`).length;
    const valueBytes = encoder.encode(value).length;
    // Hoist the delete-options object out of the loops. `setChunkedCookie` runs
    // on every authenticated request under rolling sessions, so allocating one
    // object per iteration adds up.
    const deleteOptions = {
        path: finalOptions.path,
        domain: finalOptions.domain,
        secure: finalOptions.secure,
        sameSite: finalOptions.sameSite,
        httpOnly: finalOptions.httpOnly
    };
    // If value fits in a single cookie, set it directly
    if (valueBytes <= MAX_CHUNK_SIZE) {
        resCookies.set(name, value, finalOptions);
        // Read-after-write for middleware: only write when reqCookies is a separate
        // store from resCookies. When both alias the same cookies() store (Server
        // Actions), the resCookies write above already applied the full security
        // attributes; a second naked set() without options would overwrite and drop
        // HttpOnly, Secure, SameSite, and Max-Age from the Set-Cookie header.
        if (reqCookies !== resCookies) {
            reqCookies.set(name, value);
        }
        // When we are writing a non-chunked cookie, remove any previously stored
        // chunks for this cookie name. Sweep at least `__0..MAX_CHUNKS-1` (covers
        // concurrent-tab writes below MAX_CHUNKS not in this snapshot) and also
        // anything higher the snapshot reveals (covers sessions that once grew past
        // MAX_CHUNKS). The browser ignores deletions for cookies that do not exist.
        const clearUpTo = getClearUpTo(reqCookies, name);
        for(let i = 0; i < clearUpTo; i++){
            const chunkName = `${name}${CHUNK_PREFIX}${i}`;
            deleteCookie(resCookies, chunkName, deleteOptions);
            // Same alias guard as the set() paths: a naked reqCookies.delete() drops
            // the domain from the deletion entry, so when both stores alias the same
            // cookies() store it would overwrite the domain-correct deletion applied
            // to resCookies above and break chunk cleanup under AUTH0_COOKIE_DOMAIN.
            if (reqCookies !== resCookies) {
                reqCookies.delete(chunkName);
            }
        }
        return sizeOf(name, value);
    }
    // Split value into chunks
    let position = 0;
    let chunkIndex = 0;
    let totalBytes = 0;
    while(position < value.length){
        const chunk = value.slice(position, position + MAX_CHUNK_SIZE);
        const chunkName = `${name}${CHUNK_PREFIX}${chunkIndex}`;
        resCookies.set(chunkName, chunk, finalOptions);
        // Same guard as the non-chunked path: skip when stores alias each other.
        if (reqCookies !== resCookies) {
            reqCookies.set(chunkName, chunk);
        }
        totalBytes += sizeOf(chunkName, chunk);
        position += MAX_CHUNK_SIZE;
        chunkIndex++;
    }
    // Clear any now-unused higher-index chunks. Sweep at least up to
    // `MAX_CHUNKS-1` (covers concurrent-tab writes below MAX_CHUNKS not in this
    // snapshot) and also anything higher the snapshot reveals (covers sessions
    // that once grew past MAX_CHUNKS). The browser ignores deletions for absent
    // cookies.
    const clearUpTo = getClearUpTo(reqCookies, name);
    for(let i = chunkIndex; i < clearUpTo; i++){
        const chunkName = `${name}${CHUNK_PREFIX}${i}`;
        deleteCookie(resCookies, chunkName, deleteOptions);
        // Alias guard: skip the naked delete when both stores alias (see above).
        if (reqCookies !== resCookies) {
            reqCookies.delete(chunkName);
        }
    }
    // When we have written chunked cookies, we should remove the non-chunked cookie
    deleteCookie(resCookies, name, deleteOptions);
    // Alias guard: skip the naked delete when both stores alias (see above).
    if (reqCookies !== resCookies) {
        reqCookies.delete(name);
    }
    return totalBytes;
}
function getChunkedCookie(name, reqCookies, isLegacyCookie) {
    // Check if regular cookie exists
    const cookie = reqCookies.get(name);
    if (cookie?.value) {
        // If the base cookie exists, return its value (handles non-chunked case)
        return cookie.value;
    }
    const chunks = getAllChunkedCookies(reqCookies, name, isLegacyCookie).sort(// Extract index from cookie name and sort numerically
    (first, second)=>{
        return getChunkedCookieIndex(first.name, isLegacyCookie) - getChunkedCookieIndex(second.name, isLegacyCookie);
    });
    if (chunks.length === 0) {
        return undefined;
    }
    // Validate sequence integrity - check for missing chunks
    const highestIndex = getChunkedCookieIndex(chunks[chunks.length - 1].name, isLegacyCookie);
    if (chunks.length !== highestIndex + 1) {
        console.warn(`Incomplete chunked cookie '${name}': Found ${chunks.length} chunks, expected ${highestIndex + 1}`);
        return undefined;
    }
    // Combine all chunks
    return chunks.map((c)=>c.value).join("");
}
function deleteChunkedCookie(name, reqCookies, resCookies, isLegacyCookie, options) {
    // Delete main cookie
    deleteCookie(resCookies, name, options);
    if (isLegacyCookie) {
        // Legacy `{name}.{index}` chunks are no longer written, so their count is
        // whatever a prior SDK version left behind — scan the request to find them.
        getAllChunkedCookies(reqCookies, name, isLegacyCookie).forEach((cookie)=>{
            deleteCookie(resCookies, cookie.name, options);
        });
        return;
    }
    // Sweep at least `__0..MAX_CHUNKS-1` (covers concurrent-tab writes not in
    // this snapshot) and also anything higher the snapshot reveals (covers
    // sessions that once grew past MAX_CHUNKS). The browser ignores deletions
    // for absent cookies.
    const clearUpTo = getClearUpTo(reqCookies, name);
    for(let i = 0; i < clearUpTo; i++){
        deleteCookie(resCookies, `${name}${CHUNK_PREFIX}${i}`, options);
    }
}
function addCacheControlHeadersForSession(res) {
    res.headers.set("Cache-Control", "private, no-cache, no-store, must-revalidate, max-age=0");
    res.headers.set("Pragma", "no-cache");
    res.headers.set("Expires", "0");
}
function deleteCookie(resCookies, name, options) {
    const deleteOptions = {
        maxAge: 0 // Ensure the cookie is deleted immediately
    };
    if (options?.domain) {
        deleteOptions.domain = options.domain;
    }
    if (options?.path) {
        deleteOptions.path = options.path;
    }
    if (options?.secure !== undefined) {
        deleteOptions.secure = options.secure;
    }
    if (options?.sameSite !== undefined) {
        deleteOptions.sameSite = options.sameSite;
    }
    if (options?.httpOnly !== undefined) {
        deleteOptions.httpOnly = options.httpOnly;
    }
    resCookies.set(name, "", deleteOptions);
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/discovery-cache.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DiscoveryCache",
    ()=>DiscoveryCache
]);
/**
 * Discovery cache for OIDC metadata with in-flight request deduplication
 * @internal
 */ /**
 * Helper to get the first key from a Map (for LRU eviction).
 */ function getFirstMapKey(map) {
    return map.keys().next().value;
}
class DiscoveryCache {
    /**
     * Creates a new DiscoveryCache instance.
     *
     * @param options - Cache configuration options
     */ constructor(options){
        this.cache = new Map();
        this.inFlight = new Map();
        this.jwksCache = new Map();
        this.ttl = options?.ttl ?? 600; // 600 seconds = 10 minutes
        this.maxEntries = options?.maxEntries ?? 100;
    }
    /**
     * Gets or fetches discovery metadata for a domain.
     *
     * Implements in-flight deduplication: if multiple calls are made for the same domain
     * before the first completes, they all await the same promise.
     *
     * @param domain - The Auth0 domain to fetch metadata for
     * @param fetchMetadata - Async function that fetches the metadata if not cached
     * @returns A promise resolving to the authorization server metadata
     *
     * @internal
     */ async get(domain, fetchMetadata) {
        const now = Math.floor(Date.now() / 1000);
        // Check for unexpired cache entry
        const cached = this.cache.get(domain);
        if (cached && cached.expiresAt > now) {
            // LRU: delete and re-insert to move to end
            this.cache.delete(domain);
            this.cache.set(domain, cached);
            return cached.metadata;
        }
        // Check if a request is already in flight
        const inFlightPromise = this.inFlight.get(domain);
        if (inFlightPromise) {
            return inFlightPromise;
        }
        // Create a new fetch promise and store it synchronously BEFORE awaiting
        const fetchPromise = fetchMetadata(domain).then((metadata)=>{
            // Store in cache
            const expiresAt = now + this.ttl;
            this.cache.set(domain, {
                metadata,
                expiresAt
            });
            // Clean up in-flight entry
            this.inFlight.delete(domain);
            // Enforce max entries boundary with LRU eviction
            while(this.cache.size > this.maxEntries){
                const oldestKey = getFirstMapKey(this.cache);
                if (oldestKey !== undefined) {
                    this.cache.delete(oldestKey);
                }
            }
            return metadata;
        }).catch((err)=>{
            // Remove the in-flight entry on failure so retries can proceed
            this.inFlight.delete(domain);
            throw err;
        });
        // Store in-flight promise BEFORE awaiting
        this.inFlight.set(domain, fetchPromise);
        return fetchPromise;
    }
    /**
     * Gets or creates a JWKS cache entry for the given JWKS URI.
     *
     * The JWKS cache is separate from the discovery metadata cache and has
     * its own size limit.
     *
     * @param jwksUri - The JWKS endpoint URI
     * @returns The JWKS cache object (jose.JWKSCacheInput format)
     *
     * @internal
     */ getJwksCacheForUri(jwksUri) {
        let jwksEntry = this.jwksCache.get(jwksUri);
        if (!jwksEntry) {
            // Enforce max entries boundary BEFORE adding (LRU)
            if (this.jwksCache.size >= this.maxEntries) {
                const firstKey = getFirstMapKey(this.jwksCache);
                if (firstKey !== undefined) {
                    this.jwksCache.delete(firstKey);
                }
            }
            jwksEntry = {};
            this.jwksCache.set(jwksUri, jwksEntry);
        } else {
            // LRU: delete and re-insert to move to end
            this.jwksCache.delete(jwksUri);
            this.jwksCache.set(jwksUri, jwksEntry);
        }
        return jwksEntry;
    }
    /**
     * Clears all cached entries (discovery metadata and JWKS cache).
     *
     * @internal
     */ clear() {
        this.cache.clear();
        this.jwksCache.clear();
        this.inFlight.clear();
    }
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/enterprise-connect.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EC_ALLOWED_GETTERS",
    ()=>EC_ALLOWED_GETTERS,
    "EC_ALLOWED_METHODS",
    ()=>EC_ALLOWED_METHODS,
    "EC_MEMBER_GUIDANCE",
    ()=>EC_MEMBER_GUIDANCE,
    "EC_SYNC_METHODS",
    ()=>EC_SYNC_METHODS,
    "applyEnterpriseConnectRestrictions",
    ()=>applyEnterpriseConnectRestrictions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/index.js [middleware] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/oauth-errors.js [middleware] (ecmascript)");
;
const EC_ALLOWED_METHODS = new Set([
    "middleware",
    "startInteractiveLogin",
    "startEnterpriseLogin",
    "customTokenExchange"
]);
const EC_ALLOWED_GETTERS = new Set();
const EC_MEMBER_GUIDANCE = {
    getSession: "Auth0 does not hold a session in this mode. Read the user from the session " + "store you populated in onCallback.",
    getAccessToken: "Enterprise Connect clients are not issued refresh tokens, so there is no token " + "to return or renew. Use the tokens passed to onCallback if you need to call " + "an API on the user's behalf.",
    getAccessTokenForConnection: "This reads the token set from an Auth0 session, which does not exist in this " + "mode. Store connection tokens yourself from the onCallback session if needed.",
    revokeRefreshToken: "Enterprise Connect clients are not issued refresh tokens, so there is nothing " + "to revoke.",
    requestSessionTransferToken: "Session transfer reads and refreshes an Auth0 session, which does not exist " + "in this mode.",
    updateSession: "There is no Auth0 session cookie to update in this mode. Write to your own " + "session store instead.",
    connectAccount: "Connecting an account requires an existing Auth0 session, which is not " + "created in this mode.",
    createFetcher: "The fetcher attaches an access token read from an Auth0 session, which does " + "not exist in this mode. Pass your own token to fetch directly.",
    buildSessionTransferRedirect: "Session transfer requires an existing Auth0 session to transfer, which is not " + "created in this mode.",
    getTokenByBackchannelAuth: "CIBA requires the auth_req_id from /bc-authorize to be held between requests, " + "and Enterprise Connect stores no transaction state across them.",
    passwordless: "Passwordless establishes an Auth0 session, which conflicts with this mode. " + "Authentication must go through the enterprise IdP via /auth/login.",
    passkey: "Passkeys establish an Auth0 session, which conflicts with this mode. " + "Authentication must go through the enterprise IdP via /auth/login.",
    mfa: "MFA requires Auth0 to manage authentication state across requests, which " + "does not exist in this mode. MFA must be handled by the enterprise IdP."
};
const EC_SYNC_METHODS = new Set([
    "buildSessionTransferRedirect"
]);
function applyEnterpriseConnectRestrictions(instance) {
    const proto = Object.getPrototypeOf(instance);
    for (const [name, desc] of Object.entries(Object.getOwnPropertyDescriptors(proto))){
        if (name === "constructor") continue;
        const guidance = EC_MEMBER_GUIDANCE[name] ?? "";
        const suffix = guidance ? ` ${guidance}` : "";
        if (desc.get) {
            if (!EC_ALLOWED_GETTERS.has(name)) {
                Object.defineProperty(instance, name, {
                    configurable: true,
                    enumerable: false,
                    get: ()=>{
                        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["EnterpriseConnectError"](`${name} is not available when enterpriseConnect is true.${suffix}`);
                    }
                });
            }
        } else if (typeof desc.value === "function") {
            if (!EC_ALLOWED_METHODS.has(name)) {
                const label = `${name}()`;
                const error = ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["EnterpriseConnectError"](`${label} is not available when enterpriseConnect is true.${suffix}`);
                Object.defineProperty(instance, name, {
                    configurable: true,
                    enumerable: false,
                    writable: true,
                    // Sync methods throw; async methods reject so await/catch works.
                    value: EC_SYNC_METHODS.has(name) ? ()=>{
                        throw error();
                    } : ()=>Promise.reject(error())
                });
            }
        }
    }
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/fetcher.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Fetcher",
    ()=>Fetcher
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/oauth4webapi/build/index.js [middleware] (ecmascript)");
;
class Fetcher {
    constructor(config, hooks){
        this.hooks = hooks;
        this.config = {
            ...config,
            fetch: config.fetch || // For easier testing and constructor compatibility with SSR.
            (("TURBOPACK compile-time truthy", 1) ? fetch : "TURBOPACK unreachable")
        };
    }
    /**
     * Checks if a URL is absolute (includes protocol and domain).
     *
     * @param url - The URL string to test
     * @returns True if the URL is absolute, false otherwise
     *
     * @example
     * ```typescript
     * fetcher.isAbsoluteUrl('https://api.example.com/data') // true
     * fetcher.isAbsoluteUrl('/api/data') // false
     * fetcher.isAbsoluteUrl('//example.com/api') // true
     * ```
     */ isAbsoluteUrl(url) {
        try {
            new URL(url);
            return true;
        } catch  {
            return false;
        }
    }
    /**
     * Builds a complete URL from base URL and relative path.
     *
     * @param baseUrl - The base URL to resolve against (optional)
     * @param url - The URL or path to resolve
     * @returns The complete resolved URL
     * @throws TypeError if url is relative but baseUrl is not provided
     *
     * @example
     * ```typescript
     * fetcher.buildUrl('https://api.example.com', '/users')
     * // Returns: 'https://api.example.com/users'
     * ```
     */ buildUrl(baseUrl, url) {
        if (url) {
            if (this.isAbsoluteUrl(url)) {
                return url;
            }
            if (baseUrl) {
                return `${baseUrl.replace(/\/?\/$/, "")}/${url.replace(/^\/+/, "")}`;
            }
        }
        throw new TypeError("`url` must be absolute or `baseUrl` non-empty.");
    }
    /**
     * Retrieves an access token for the current request.
     * Uses the configured access token factory or falls back to the hooks implementation.
     *
     * @param getAccessTokenOptions - Options for token retrieval (scope, audience, etc.)
     * @returns Promise that resolves to the access token string
     *
     * @example
     * ```typescript
     * const token = await fetcher.getAccessToken({
     *   scope: 'read:data',
     *   audience: 'https://api.example.com'
     * });
     * ```
     */ getAccessToken(getAccessTokenOptions) {
        return this.config.getAccessToken ? this.config.getAccessToken(getAccessTokenOptions ?? {}) : this.hooks.getAccessToken(getAccessTokenOptions ?? {});
    }
    buildBaseRequest(info, init) {
        // Handle URL resolution before creating Request object
        let resolvedUrl;
        if (info instanceof Request) {
            // If info is already a Request object, use its URL
            resolvedUrl = info.url;
        } else if (info instanceof URL) {
            // If info is a URL object, convert to string
            resolvedUrl = info.toString();
        } else {
            // info is a string - check if we need to resolve it with baseUrl
            if (this.config.baseUrl && !this.isAbsoluteUrl(info)) {
                // Resolve relative URL with baseUrl
                resolvedUrl = this.buildUrl(this.config.baseUrl, info);
            } else {
                // Use as-is (either absolute URL or no baseUrl configured)
                resolvedUrl = info;
            }
        }
        // Create Request object with resolved URL
        return new Request(resolvedUrl, init);
    }
    getHeader(headers, name) {
        if (Array.isArray(headers)) {
            return new Headers(headers).get(name) || "";
        }
        if (typeof headers.get === "function") {
            return headers.get(name) || "";
        }
        return headers[name] || "";
    }
    async internalFetchWithAuth(info, init, callbacks, getAccessTokenOptions) {
        const request = this.buildBaseRequest(info, init);
        const accessTokenResponse = await this.getAccessToken(getAccessTokenOptions);
        let useDpop;
        let accessToken;
        if (typeof accessTokenResponse === "string") {
            useDpop = this.config.dpopHandle ? true : false;
            accessToken = accessTokenResponse;
        } else {
            useDpop = this.config.dpopHandle ? accessTokenResponse.token_type?.toLowerCase() === "dpop" : false;
            accessToken = accessTokenResponse.accessToken;
        }
        try {
            // Make (DPoP)-authenticated request using oauth4webapi
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["protectedResourceRequest"])(accessToken, request.method, new URL(request.url), request.headers, request.body, {
                ...this.config.httpOptions(),
                [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["customFetch"]]: (url, options)=>{
                    return this.config.fetch(url, options);
                },
                [__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["allowInsecureRequests"]]: this.config.allowInsecureRequests || false,
                ...useDpop && {
                    DPoP: this.config.dpopHandle
                }
            });
            return response;
        } catch (error) {
            // Use oauth4webapi's isDPoPNonceError to detect nonce errors
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isDPoPNonceError"])(error) && callbacks.onUseDpopNonceError) {
                // Retry once with the callback
                return callbacks.onUseDpopNonceError();
            }
            // Re-throw non-DPoP nonce errors or if no callback available
            throw error;
        }
    }
    isRequestInit(obj) {
        if (!obj || typeof obj !== "object") return false;
        // Check for GetAccessTokenOptions-specific properties
        // Since RequestInit and GetAccessTokenOptions have no common properties,
        // if any GetAccessTokenOptions property is present, it's GetAccessTokenOptions
        const getAccessTokenOptionsProps = [
            "refresh",
            "scope",
            "audience"
        ];
        const hasGetAccessTokenOptionsProp = getAccessTokenOptionsProps.some((prop)=>Object.prototype.hasOwnProperty.call(obj, prop));
        // If it has GetAccessTokenOptions props, it's NOT RequestInit
        // Otherwise, default to RequestInit (backwards compatibility)
        return !hasGetAccessTokenOptionsProp;
    }
    // Implementation
    fetchWithAuth(info, initOrOptions, getAccessTokenOptions) {
        // Parameter disambiguation for 2-argument case
        let init;
        let accessTokenOptions;
        if (arguments.length === 2 && initOrOptions !== undefined) {
            // Determine if second argument is RequestInit or GetAccessTokenOptions
            if (this.isRequestInit(initOrOptions)) {
                init = initOrOptions;
                accessTokenOptions = undefined;
            } else {
                init = undefined;
                accessTokenOptions = initOrOptions;
            }
        } else {
            // 3-argument case or 1-argument case
            init = initOrOptions;
            accessTokenOptions = getAccessTokenOptions;
        }
        const callbacks = {
            onUseDpopNonceError: async ()=>{
                // Use configured retry values or defaults
                const retryConfig = this.config.retryConfig ?? {
                    delay: 100,
                    jitter: true
                };
                let delay = retryConfig.delay ?? 100;
                // Apply jitter if enabled
                if (retryConfig.jitter) {
                    delay = delay * (0.5 + Math.random() * 0.5); // 50-100% of original delay
                }
                await new Promise((resolve)=>setTimeout(resolve, delay));
                try {
                    return await this.internalFetchWithAuth(info, init, {
                        ...callbacks,
                        // Retry on a `use_dpop_nonce` error, but just once.
                        onUseDpopNonceError: undefined
                    }, accessTokenOptions);
                } catch (retryError) {
                    // If the retry also fails, enhance the error with context
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isDPoPNonceError"])(retryError)) {
                        const enhancedError = new Error(`DPoP nonce error persisted after retry: ${retryError.message}`);
                        enhancedError.code = retryError.code || "dpop_nonce_retry_failed";
                        throw enhancedError;
                    }
                    // For non-DPoP errors, just re-throw
                    throw retryError;
                }
            }
        };
        return this.internalFetchWithAuth(info, init, callbacks, accessTokenOptions);
    }
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/helpers/with-api-auth-required.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "appRouteHandlerFactory",
    ()=>appRouteHandlerFactory,
    "pageRouteHandlerFactory",
    ()=>pageRouteHandlerFactory
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/server.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$next$2d$compat$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/next-compat.js [middleware] (ecmascript)");
;
;
const appRouteHandlerFactory = (client)=>(apiRoute)=>async (req, params)=>{
            const nextReq = req instanceof Request ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$next$2d$compat$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["toNextRequest"])(req) : req;
            const session = await client.getSession();
            if (!session || !session.user) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "not_authenticated",
                    description: "The user does not have an active session or is not authenticated"
                }, {
                    status: 401
                });
            }
            const apiRes = await apiRoute(nextReq, params);
            const nextApiRes = apiRes instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"] ? apiRes : new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"](apiRes.body, apiRes);
            return nextApiRes;
        };
const pageRouteHandlerFactory = (client)=>(apiRoute)=>async (req, res)=>{
            const session = await client.getSession(req);
            if (!session || !session.user) {
                // If the user is not authenticated, return
                res.status(401).json({
                    error: "not_authenticated",
                    description: "The user does not have an active session or is not authenticated"
                });
                return;
            }
            await apiRoute(req, res);
        };
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/helpers/with-page-auth-required.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "appRouteHandlerFactory",
    ()=>appRouteHandlerFactory,
    "pageRouteHandlerFactory",
    ()=>pageRouteHandlerFactory
]);
const appRouteHandlerFactory = (client, config)=>(handler, opts = {})=>async (params)=>{
            const session = await client.getSession();
            if (!session?.user) {
                const returnTo = typeof opts.returnTo === "function" ? await opts.returnTo(params) : opts.returnTo;
                const { redirect } = await __turbopack_context__.A("[project]/web/node_modules/next/navigation.js [middleware] (ecmascript, async loader)");
                redirect(`${config.loginUrl}${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`);
            }
            return handler(params);
        };
const pageRouteHandlerFactory = (client, config)=>({ getServerSideProps, returnTo } = {})=>async (ctx)=>{
            const session = await client.getSession(ctx.req);
            if (!session?.user) {
                return {
                    redirect: {
                        destination: `${config.loginUrl}?returnTo=${encodeURIComponent(returnTo || ctx.resolvedUrl)}`,
                        permanent: false
                    }
                };
            }
            let ret = {
                props: {}
            };
            if (getServerSideProps) {
                ret = await getServerSideProps(ctx);
            }
            if (ret.props instanceof Promise) {
                const props = await ret.props;
                return {
                    ...ret,
                    props: {
                        user: session.user,
                        ...props
                    }
                };
            }
            return {
                ...ret,
                props: {
                    user: session.user,
                    ...ret.props
                }
            };
        };
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/index.js [middleware] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$client$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/client.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$transaction$2d$store$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/transaction-store.js [middleware] (ecmascript)");
// DPoP utilities
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$dpopRetry$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/dpopRetry.js [middleware] (ecmascript)");
// MFA error classes for handling MFA step-up authentication
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/index.js [middleware] (ecmascript) <locals>");
// MCD (Multiple Custom Domains) public error classes
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mcd$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/mcd.js [middleware] (ecmascript)");
// Session Transfer Token (CTE Phase 2) types
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$types$2f$token$2d$vault$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/types/token-vault.js [middleware] (ecmascript)");
// Session Transfer Token error codes (extends CustomTokenExchangeErrorCode)
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/oauth-errors.js [middleware] (ecmascript)");
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
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/mfa/server-mfa-client.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ServerMfaClient",
    ()=>ServerMfaClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/headers.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/server.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$transform$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/mfa-transform-utils.js [middleware] (ecmascript)");
;
;
;
class ServerMfaClient {
    constructor(provider){
        this.provider = provider;
    }
    async getAuthClient(req) {
        const reqHeaders = req ? req.headers : await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["headers"])();
        const url = req?.nextUrl;
        return this.provider.forRequest(reqHeaders, url);
    }
    /**
     * List enrolled MFA authenticators.
     *
     * @param options - Options containing encrypted mfaToken
     * @returns Array of authenticators (camelCase SDK format) filtered by mfa_requirements
     *
     * @example App Router
     * ```typescript
     * // app/api/mfa/authenticators/route.ts
     * import { NextRequest, NextResponse } from "next/server";
     * import { auth0 } from "@/lib/auth0";
     *
     * export async function POST(req: NextRequest) {
     *   const { mfaToken } = await req.json();
     *   const authenticators = await auth0.mfa.getAuthenticators({ mfaToken });
     *   return NextResponse.json(authenticators);
     * }
     * ```
     *
     * @example Pages Router
     * ```typescript
     * // pages/api/mfa/authenticators.ts
     * import type { NextApiRequest, NextApiResponse } from "next";
     * import { auth0 } from "@/lib/auth0";
     *
     * export default async function handler(req: NextApiRequest, res: NextApiResponse) {
     *   const { mfaToken } = req.body;
     *   const authenticators = await auth0.mfa.getAuthenticators({ mfaToken });
     *   res.json(authenticators);
     * }
     * ```
     */ async getAuthenticators(options) {
        const authClient = await this.getAuthClient();
        const apiResponse = await authClient.mfaGetAuthenticators(options.mfaToken);
        return apiResponse.map(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$transform$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["camelizeAuthenticator"]);
    }
    /**
     * Initiate an MFA challenge.
     *
     * @param options - Challenge options
     * @returns Challenge response (camelCase SDK format: challengeType, oobCode, bindingMethod)
     *
     * @example
     * ```typescript
     * // app/api/mfa/challenge/route.ts
     * const { mfaToken, authenticatorId } = await req.json();
     *
     * const challenge = await auth0.mfa.challenge({
     *   mfaToken,
     *   challengeType: "oob",
     *   authenticatorId
     * });
     *
     * return NextResponse.json({
     *   oobCode: challenge.oobCode,
     *   bindingMethod: challenge.bindingMethod
     * });
     * ```
     */ async challenge(options) {
        const authClient = await this.getAuthClient();
        const apiResponse = await authClient.mfaChallenge(options.mfaToken, options.challengeType, options.authenticatorId);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$transform$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["camelizeChallengeResponse"])(apiResponse);
    }
    /**
     * Enroll a new MFA authenticator.
     *
     * @param options - Enrollment options (otp | oob | email)
     * @returns Enrollment response (camelCase SDK format) with authenticator details and optional recovery codes
     *
     * @example OTP Enrollment
     * ```typescript
     * const enrollment = await auth0.mfa.enroll({
     *   mfaToken,
     *   authenticatorTypes: ["otp"]
     * });
     *
     * // Returns: { id, secret, barcodeUri, recoveryCodes }
     * ```
     *
     * @example SMS Enrollment
     * ```typescript
     * const enrollment = await auth0.mfa.enroll({
     *   mfaToken,
     *   authenticatorTypes: ["oob"],
     *   oobChannels: ["sms"],
     *   phoneNumber: "+15551234567"
     * });
     *
     * // Returns: { id, oobChannel, name, recoveryCodes }
     * ```
     */ async enroll(options) {
        // Normalize factorType variants to standard authenticatorTypes format
        const normalizedOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$transform$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["normalizeEnrollOptions"])(options);
        const { mfaToken, ...enrollOptions } = normalizedOptions;
        const authClient = await this.getAuthClient();
        const apiResponse = await authClient.mfaAssociate(mfaToken, enrollOptions);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$mfa$2d$transform$2d$utils$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["buildEnrollmentResponse"])(apiResponse);
    }
    /**
     * Implementation with overload resolution.
     * Resolves cookies and delegates to AuthClient for business logic + session management.
     */ async verify(arg1, arg2, arg3) {
        // Determine which overload based on arg types
        if (arg1 instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextRequest"]) {
            // Pages Router/Middleware: verify(req, res, options)
            // req is passed so MCD resolver can pick the correct Auth0 domain
            if (!arg2 || !arg3) {
                throw new TypeError("verify(req, res, options): All three arguments required for Pages Router");
            }
            const authClient = await this.getAuthClient(arg1);
            const tokenResponse = await authClient.mfaVerify(arg3);
            await authClient.cacheTokenFromMfaVerify(tokenResponse, arg3.mfaToken, arg1.cookies, arg2.cookies);
            // Tokens stay in the session cookie. recovery_code is the one exception —
            // it's a one-time backup credential the user must write down immediately.
            return {
                success: true,
                ...tokenResponse.recovery_code !== undefined && {
                    recovery_code: tokenResponse.recovery_code
                }
            };
        } else {
            // App Router: verify(options)
            if (arg2 !== undefined || arg3 !== undefined) {
                throw new TypeError("verify(options): Only one argument allowed for App Router");
            }
            const authClient = await this.getAuthClient();
            const tokenResponse = await authClient.mfaVerify(arg1);
            const { cookies: cookiesLib } = await __turbopack_context__.A("[project]/web/node_modules/next/headers.js [middleware] (ecmascript, async loader)");
            const cookies = await cookiesLib();
            await authClient.cacheTokenFromMfaVerify(tokenResponse, arg1.mfaToken, cookies, cookies);
            // Tokens stay in the session cookie. recovery_code is the one exception —
            // it's a one-time backup credential the user must write down immediately.
            return {
                success: true,
                ...tokenResponse.recovery_code !== undefined && {
                    recovery_code: tokenResponse.recovery_code
                }
            };
        }
    }
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/next-compat.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "toHeadersFromIncomingMessage",
    ()=>toHeadersFromIncomingMessage,
    "toNextRequest",
    ()=>toNextRequest,
    "toNextResponse",
    ()=>toNextResponse,
    "toUrlFromPagesRouter",
    ()=>toUrlFromPagesRouter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/server.js [middleware] (ecmascript)");
;
function collectFromNextUrl(input) {
    let config;
    try {
        const nextUrl = input.nextUrl;
        // Return early if nextUrl is not accessible
        if (!nextUrl) {
            return undefined;
        }
        // Handle basePath config
        if (typeof nextUrl.basePath === "string" && nextUrl.basePath) {
            config = {
                basePath: nextUrl.basePath
            };
        }
        // Handle i18n config
        if (typeof nextUrl.locale === "string" || typeof nextUrl.defaultLocale === "string") {
            config = {
                ...config || {},
                i18n: {
                    locales: nextUrl.locale ? [
                        nextUrl.locale
                    ] : [],
                    defaultLocale: nextUrl.defaultLocale
                }
            };
        }
        // Handle trailingSlash config
        if (typeof nextUrl.trailingSlash === "boolean") {
            config = {
                ...config || {},
                trailingSlash: nextUrl.trailingSlash
            };
        }
    } catch  {
    // ignore inaccessible nextUrl
    }
    return config && Object.keys(config).length ? config : undefined;
}
function toNextRequest(input) {
    if (input instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextRequest"]) {
        return input;
    }
    const nextConfig = collectFromNextUrl(input);
    const init = {
        method: input.method,
        headers: input.headers,
        body: input.body,
        duplex: input.duplex ?? "half"
    };
    if (nextConfig) {
        init.nextConfig = nextConfig;
    }
    return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextRequest"](input.url, init);
}
function toNextResponse(res) {
    if (res instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"]) {
        return res;
    }
    const headers = new Headers(res.headers);
    const nextRes = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"](res.body, {
        status: res.status,
        statusText: res.statusText,
        headers
    });
    try {
        if ("url" in res && res.url) {
            nextRes.url = res.url;
        }
    } catch  {
    // ignore if url isn't accessible
    }
    return nextRes;
}
function toHeadersFromIncomingMessage(req) {
    const headers = new Headers();
    for(const key in req.headers){
        const value = req.headers[key];
        if (Array.isArray(value)) {
            for (const v of value){
                headers.append(key, v);
            }
        } else if (value !== undefined) {
            headers.append(key, value);
        }
    }
    return headers;
}
function toUrlFromPagesRouter(req) {
    try {
        const host = Array.isArray(req.headers.host) ? req.headers.host[0] : req.headers.host;
        if (!host) return undefined;
        const proto = Array.isArray(req.headers["x-forwarded-proto"]) ? req.headers["x-forwarded-proto"][0] : req.headers["x-forwarded-proto"];
        return new URL(req.url ?? "/", `${proto || "https"}://${host}`);
    } catch  {
        return undefined;
    }
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/passkey/server-passkey-client.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ServerPasskeyClient",
    ()=>ServerPasskeyClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/headers.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/server.js [middleware] (ecmascript)");
;
;
class ServerPasskeyClient {
    constructor(provider){
        this.provider = provider;
    }
    async getAuthClient(req) {
        const { headers } = await __turbopack_context__.A("[project]/web/node_modules/next/headers.js [middleware] (ecmascript, async loader)");
        const reqHeaders = req ? req.headers : await headers();
        const url = req?.nextUrl;
        return this.provider.forRequest(reqHeaders, url);
    }
    async register(arg1, arg2) {
        if (arg1 instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextRequest"]) {
            const authClient = await this.getAuthClient(arg1);
            return authClient.passkeyRegister(arg2);
        }
        const authClient = await this.getAuthClient();
        return authClient.passkeyRegister(arg1);
    }
    async challenge(arg1, arg2) {
        if (arg1 instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextRequest"]) {
            const authClient = await this.getAuthClient(arg1);
            return authClient.passkeyChallenge(arg2);
        }
        const authClient = await this.getAuthClient();
        return authClient.passkeyChallenge(arg1);
    }
    async getToken(arg1, arg2, arg3) {
        if (arg1 instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextRequest"]) {
            if (!arg2 || !arg3) {
                throw new TypeError("getToken(req, res, options): All three arguments required for Pages Router");
            }
            const authClient = await this.getAuthClient(arg1);
            await authClient.passkeyGetToken(arg3, arg1.cookies, arg2.cookies);
        } else {
            if (arg2 !== undefined || arg3 !== undefined) {
                throw new TypeError("getToken(options): Only one argument allowed for App Router");
            }
            const authClient = await this.getAuthClient();
            const cookiesLib = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["cookies"])();
            await authClient.passkeyGetToken(arg1, cookiesLib, cookiesLib);
        }
    }
    async enrollmentChallenge(arg1, arg2) {
        if (arg1 instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextRequest"]) {
            const authClient = await this.getAuthClient(arg1);
            return authClient.passkeyEnrollmentChallenge(arg1.cookies, arg2);
        }
        const authClient = await this.getAuthClient();
        const cookiesLib = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["cookies"])();
        return authClient.passkeyEnrollmentChallenge(cookiesLib, arg1);
    }
    async enrollmentVerify(arg1, arg2) {
        if (arg1 instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextRequest"]) {
            if (!arg2) {
                throw new TypeError("enrollmentVerify(req, options): Both arguments required for Pages Router");
            }
            const authClient = await this.getAuthClient(arg1);
            return authClient.passkeyEnrollmentVerify(arg2, arg1.cookies);
        }
        const authClient = await this.getAuthClient();
        const cookiesLib = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["cookies"])();
        return authClient.passkeyEnrollmentVerify(arg1, cookiesLib);
    }
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/passwordless/server-passwordless-client.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ServerPasswordlessClient",
    ()=>ServerPasswordlessClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/headers.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/server.js [middleware] (ecmascript)");
;
;
class ServerPasswordlessClient {
    constructor(provider){
        this.provider = provider;
    }
    async getAuthClient(req) {
        const { headers } = await __turbopack_context__.A("[project]/web/node_modules/next/headers.js [middleware] (ecmascript, async loader)");
        const reqHeaders = req ? req.headers : await headers();
        const url = req?.nextUrl;
        return this.provider.forRequest(reqHeaders, url);
    }
    async start(arg1, arg2, arg3) {
        // Pages Router: start(req, res, options)
        if (arg1 instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextRequest"]) {
            if (!(arg2 instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"]) || !arg3) {
                throw new TypeError("start(req, res, options): All three arguments required for Pages Router");
            }
            const authClient = await this.getAuthClient(arg1);
            return authClient.passwordlessStart(arg3, arg2.cookies, arg1);
        }
        // App Router: start(options)
        // Only read next/headers cookies for magic link — OTP flows don't write cookies.
        const authClient = await this.getAuthClient();
        const isMagicLink = arg1.connection === "email" && arg1.send === "link";
        // `as any`: ReadonlyRequestCookies is typed as Omit<RequestCookies, 'set'|'clear'|'delete'>
        // & Pick<ResponseCookies, 'set'|'delete'>, so it does expose .set() at runtime despite
        // the name. The cast suppresses the TS mismatch against the ResponseCookies parameter type.
        const cookiesLib = isMagicLink ? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["cookies"])() : undefined;
        return authClient.passwordlessStart(arg1, cookiesLib);
    }
    async verify(arg1, arg2, arg3) {
        if (arg1 instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextRequest"]) {
            // Pages Router / Middleware: verify(req, res, options)
            if (!arg2 || !arg3) {
                throw new TypeError("verify(req, res, options): All three arguments required for Pages Router");
            }
            const authClient = await this.getAuthClient(arg1);
            const tokenResponse = await authClient.passwordlessVerify(arg3);
            await authClient.createSessionFromPasswordlessVerify(tokenResponse, arg1.cookies, arg2.cookies);
        } else {
            // App Router: verify(options)
            if (arg2 !== undefined || arg3 !== undefined) {
                throw new TypeError("verify(options): Only one argument allowed for App Router");
            }
            const authClient = await this.getAuthClient();
            const tokenResponse = await authClient.passwordlessVerify(arg1);
            const cookiesLib = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["cookies"])();
            await authClient.createSessionFromPasswordlessVerify(tokenResponse, cookiesLib, cookiesLib);
        }
    }
    async challengeWithEmail(arg1, arg2) {
        if (arg1 instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextRequest"]) {
            if (!arg2) {
                throw new TypeError("challengeWithEmail(req, options): Both arguments required for Pages Router");
            }
            const authClient = await this.getAuthClient(arg1);
            return authClient.passwordlessDbOtpChallenge(arg2);
        }
        const authClient = await this.getAuthClient();
        return authClient.passwordlessDbOtpChallenge(arg1);
    }
    async challengeWithPhoneNumber(arg1, arg2) {
        if (arg1 instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextRequest"]) {
            if (!arg2) {
                throw new TypeError("challengeWithPhoneNumber(req, options): Both arguments required for Pages Router");
            }
            const authClient = await this.getAuthClient(arg1);
            return authClient.passwordlessDbOtpChallenge(arg2);
        }
        const authClient = await this.getAuthClient();
        return authClient.passwordlessDbOtpChallenge(arg1);
    }
    async loginWithOtp(arg1, arg2, arg3) {
        if (arg1 instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextRequest"]) {
            if (!arg2 || !arg3) {
                throw new TypeError("loginWithOtp(req, res, options): All three arguments required for Pages Router");
            }
            const authClient = await this.getAuthClient(arg1);
            const tokenResponse = await authClient.passwordlessDbGetToken(arg3);
            await authClient.createSessionFromPasswordlessVerify(tokenResponse, arg1.cookies, arg2.cookies);
            return;
        }
        const authClient = await this.getAuthClient();
        const tokenResponse = await authClient.passwordlessDbGetToken(arg1);
        const cookiesLib = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$headers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["cookies"])();
        await authClient.createSessionFromPasswordlessVerify(tokenResponse, cookiesLib, cookiesLib);
    }
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/session/abstract-session-store.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AbstractSessionStore",
    ()=>AbstractSessionStore
]);
const SESSION_COOKIE_NAME = "__session";
class AbstractSessionStore {
    constructor({ secret, rolling = true, beforeSessionRolled, absoluteDuration = 60 * 60 * 24 * 3, inactivityDuration = 60 * 60 * 24 * 1, store, cookieOptions }){
        this.secret = secret;
        this.rolling = rolling;
        this.beforeSessionRolled = beforeSessionRolled;
        this.absoluteDuration = absoluteDuration;
        this.inactivityDuration = inactivityDuration;
        this.store = store;
        this.sessionCookieName = cookieOptions?.name ?? SESSION_COOKIE_NAME;
        this.cookieConfig = {
            httpOnly: true,
            sameSite: cookieOptions?.sameSite ?? "lax",
            secure: cookieOptions?.secure ?? false,
            path: cookieOptions?.path ?? "/",
            domain: cookieOptions?.domain,
            transient: cookieOptions?.transient
        };
    }
    /**
     * Deletes the backing-store record for the session identified by the request cookies,
     * without needing a response object. Used by IPSIE ceiling enforcement where only
     * reqCookies are available (e.g. getSessionWithDomainCheck).
     *
     * For stateless cookie sessions this is a no-op — the cookie is the session, and
     * clearing it requires response cookies. Ceiling enforcement returns null on every
     * read anyway, so the orphaned cookie is harmless until its natural max-age expires.
     *
     * Subclasses that own a backing store (stateful) SHOULD override this to delete
     * the store record by session ID for hygiene.
     */ async deleteByReqCookies(// eslint-disable-next-line @typescript-eslint/no-unused-vars
    _reqCookies) {
    // Default no-op. Stateless stores override to clear the cookie;
    // stateful stores override to delete the backing record.
    // Non-abstract so existing external subclasses are not broken.
    }
    /**
     * isRolling returns true if rolling sessions are enabled.
     */ get isRolling() {
        return this.rolling;
    }
    async shouldRollSession(req) {
        if (!this.rolling) {
            return false;
        }
        if (!this.beforeSessionRolled) {
            return true;
        }
        try {
            return await this.beforeSessionRolled(req);
        } catch (e) {
            console.warn("The beforeSessionRolled hook threw an error. Defaulting to rolling the session.", e);
            return true;
        }
    }
    /**
     * epoch returns the time since unix epoch in seconds.
     */ epoch() {
        return Date.now() / 1000 | 0;
    }
    /**
     * calculateMaxAge calculates the max age of the session based on createdAt and the rolling and absolute durations.
     */ calculateMaxAge(createdAt) {
        if (!this.rolling) {
            return this.absoluteDuration;
        }
        const updatedAt = this.epoch();
        const expiresAt = Math.min(updatedAt + this.inactivityDuration, createdAt + this.absoluteDuration);
        // Fix race condition: use the same updatedAt timestamp for consistency
        const maxAge = expiresAt - updatedAt;
        return maxAge > 0 ? maxAge : 0;
    }
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/session/normalize-session.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LEGACY_COOKIE_NAME",
    ()=>LEGACY_COOKIE_NAME,
    "LegacySession",
    ()=>LegacySession,
    "normalizeStatefulSession",
    ()=>normalizeStatefulSession,
    "normalizeStatelessSession",
    ()=>normalizeStatelessSession
]);
const LEGACY_COOKIE_NAME = "appSession";
class LegacySession {
    constructor(user){
        this.user = user;
    }
}
function normalizeStatelessSession(sessionCookie) {
    // if the session cookie has an `iat` claim in the protected header, it's a legacy cookie
    // otherwise, it's the new session cookie format and no transformation is needed
    if (sessionCookie.protectedHeader.iat) {
        const legacySession = sessionCookie;
        return convertFromLegacy(legacySession.protectedHeader, legacySession.payload);
    }
    return sessionCookie.payload;
}
function normalizeStatefulSession(sessionData) {
    if (sessionData.header?.iat) {
        const legacySession = sessionData;
        return convertFromLegacy(legacySession.header, legacySession.data);
    }
    return sessionData;
}
function convertFromLegacy(header, session) {
    const userClaims = session.user;
    return {
        user: userClaims,
        tokenSet: {
            idToken: session.idToken ?? undefined,
            accessToken: session.accessToken ?? undefined,
            scope: session.accessTokenScope,
            refreshToken: session.refreshToken,
            expiresAt: session.accessTokenExpiresAt
        },
        internal: {
            sid: userClaims.sid,
            createdAt: header.iat
        }
    };
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/session/stateful-session-store.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StatefulSessionStore",
    ()=>StatefulSessionStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/cookies.js [middleware] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$session$2f$abstract$2d$session$2d$store$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/session/abstract-session-store.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$session$2f$normalize$2d$session$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/session/normalize-session.js [middleware] (ecmascript)");
;
;
;
const generateId = ()=>{
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes).map((b)=>b.toString(16).padStart(2, "0")).join("");
};
class StatefulSessionStore extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$session$2f$abstract$2d$session$2d$store$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AbstractSessionStore"] {
    constructor({ secret, store, rolling, beforeSessionRolled, absoluteDuration, inactivityDuration, cookieOptions }){
        super({
            secret,
            rolling,
            beforeSessionRolled,
            absoluteDuration,
            inactivityDuration,
            cookieOptions
        });
        this.store = store;
    }
    async get(reqCookies) {
        const cookie = reqCookies.get(this.sessionCookieName) || reqCookies.get(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$session$2f$normalize$2d$session$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["LEGACY_COOKIE_NAME"]);
        if (!cookie || !cookie.value) {
            return null;
        }
        // we attempt to extract the session ID by decrypting the cookie value (assuming it's a JWE, v4+) first
        // if that fails, we attempt to verify the cookie value as a signed cookie (legacy, v3-)
        // if both fail, we return null
        // this ensures that v3 sessions are respected and can be transparently rolled over to v4+ sessions
        let sessionId = null;
        try {
            const sessionCookie = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["decrypt"](cookie.value, this.secret, undefined, true // throwOnJWEErrors: allow catching ERR_JWE_INVALID to handle legacy sessions
            );
            if (sessionCookie === null) {
                return null;
            }
            sessionId = sessionCookie.payload.id;
        } catch (e) {
            // the session cookie could not be decrypted, try to verify if it's a legacy session
            if (e.code === "ERR_JWE_INVALID") {
                const legacySessionId = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["verifySigned"](cookie.name, cookie.value, this.secret);
                if (!legacySessionId) {
                    return null;
                }
                sessionId = legacySessionId;
            }
        }
        if (!sessionId) {
            return null;
        }
        const session = await this.store.get(sessionId);
        if (!session) {
            return null;
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$session$2f$normalize$2d$session$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["normalizeStatefulSession"])(session);
    }
    async set(reqCookies, resCookies, session, isNew = false) {
        // check if a session already exists. If so, maintain the existing session ID
        let sessionId = null;
        const cookieValue = reqCookies.get(this.sessionCookieName)?.value;
        if (cookieValue) {
            const sessionCookie = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["decrypt"](cookieValue, this.secret);
            if (sessionCookie) {
                sessionId = sessionCookie.payload.id;
            }
        }
        // if this is a new session created by a new login we need to remove the old session
        // from the store and regenerate the session ID to prevent session fixation.
        if (sessionId && isNew) {
            await this.store.delete(sessionId);
            sessionId = generateId();
        }
        // Track whether the session ID was recovered from an existing cookie or is brand-new.
        // This is needed for the race-condition guard below.
        const existingSessionId = !isNew && sessionId !== null ? sessionId : null;
        if (!sessionId) {
            sessionId = generateId();
        }
        // For rolling session updates, verify the session we are about to update still exists
        // in the store. This prevents a race condition where a concurrent logout deletes the
        // session while an in-flight request is rolling it: without this check the in-flight
        // response would re-create the deleted session and leave the user logged in.
        //
        // The guard only applies when we found an existing session ID in the request cookie
        // (existingSessionId !== null). Brand-new sessions (no cookie, or isNew login) bypass
        // the check because there is nothing in the store to verify against.
        //
        // If the store implements the optional update() method we use it as an atomic
        // check-and-write (UPDATE WHERE id = $1). Otherwise we fall back to a non-atomic
        // get() + set() pair.
        if (existingSessionId !== null) {
            if (typeof this.store.update === "function") {
                const updated = await this.store.update(existingSessionId, session);
                if (!updated) {
                    return;
                }
            } else {
                const existingSession = await this.store.get(existingSessionId);
                if (!existingSession) {
                    return;
                }
                await this.store.set(existingSessionId, session);
            }
        } else {
            await this.store.set(sessionId, session);
        }
        const maxAge = this.calculateMaxAge(session.internal.createdAt);
        // Use consistent timestamp to avoid race condition - align with calculateMaxAge logic
        const now = this.epoch();
        const expiration = now + maxAge;
        const jwe = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["encrypt"]({
            id: sessionId
        }, this.secret, expiration);
        resCookies.set(this.sessionCookieName, jwe.toString(), {
            ...this.cookieConfig,
            maxAge
        });
        // to enable read-after-write in the same request for middleware
        reqCookies.set(this.sessionCookieName, jwe.toString());
        // Any existing v3 cookie can also be deleted once we have set a v4 cookie.
        // In stateful sessions, we do not have to worry about chunking.
        if (this.sessionCookieName !== __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$session$2f$normalize$2d$session$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["LEGACY_COOKIE_NAME"] && reqCookies.has(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$session$2f$normalize$2d$session$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["LEGACY_COOKIE_NAME"])) {
            __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["deleteCookie"](resCookies, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$session$2f$normalize$2d$session$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["LEGACY_COOKIE_NAME"], {
                domain: this.cookieConfig.domain,
                path: this.cookieConfig.path,
                secure: this.cookieConfig.secure,
                sameSite: this.cookieConfig.sameSite,
                httpOnly: this.cookieConfig.httpOnly
            });
        }
    }
    async delete(reqCookies, resCookies) {
        const deleteOptions = {
            domain: this.cookieConfig.domain,
            path: this.cookieConfig.path,
            secure: this.cookieConfig.secure,
            sameSite: this.cookieConfig.sameSite,
            httpOnly: this.cookieConfig.httpOnly
        };
        const cookieValue = reqCookies.get(this.sessionCookieName)?.value;
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["deleteCookie"](resCookies, this.sessionCookieName, deleteOptions);
        // delete any existing v3 legacy cookie
        if (this.sessionCookieName !== __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$session$2f$normalize$2d$session$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["LEGACY_COOKIE_NAME"] && reqCookies.has(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$session$2f$normalize$2d$session$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["LEGACY_COOKIE_NAME"])) {
            __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["deleteCookie"](resCookies, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$session$2f$normalize$2d$session$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["LEGACY_COOKIE_NAME"], deleteOptions);
        }
        if (!cookieValue) {
            return;
        }
        const session = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["decrypt"](cookieValue, this.secret);
        if (session) {
            await this.store.delete(session.payload.id);
        }
    }
    async deleteByReqCookies(reqCookies) {
        const cookie = reqCookies.get(this.sessionCookieName) || reqCookies.get(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$session$2f$normalize$2d$session$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["LEGACY_COOKIE_NAME"]);
        if (!cookie?.value) {
            return;
        }
        let sessionId = null;
        try {
            const sessionCookie = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["decrypt"](cookie.value, this.secret, undefined, true);
            if (sessionCookie) {
                sessionId = sessionCookie.payload.id;
            }
        } catch (e) {
            if (e.code === "ERR_JWE_INVALID") {
                sessionId = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["verifySigned"](cookie.name, cookie.value, this.secret);
            }
        }
        if (sessionId) {
            await this.store.delete(sessionId);
        }
    }
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/session/stateless-session-store.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StatelessSessionStore",
    ()=>StatelessSessionStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/cookies.js [middleware] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$edge$2d$runtime$2f$cookies$2f$dist$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@edge-runtime/cookies/dist/index.mjs [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$session$2f$abstract$2d$session$2d$store$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/session/abstract-session-store.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$session$2f$normalize$2d$session$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/session/normalize-session.js [middleware] (ecmascript)");
;
;
;
// Total encoded session-cookie size (across all `__session` chunks) above which
// we warn. A large session is the main remaining cause of `431 Request Header
// Fields Too Large`, since — unlike transaction cookies — the session is not
// evicted. 4096 bytes is a conservative threshold: at this size the session
// alone is large, and combined with transaction, connection-token, and
// application cookies the total `Cookie` header can exceed typical 8 KB proxy
// limits. Firing early gives developers a clear "trim your claims or go
// stateful" signal before requests start failing.
const SESSION_COOKIE_SIZE_WARN_BYTES = 4096;
// Per-cookie size above which we warn for a single `__FC_*` connection-token
// cookie. Numerically the same as the session-total threshold above, but the
// meaning is different: 4096 bytes here is the per-cookie limit browsers are
// documented to guarantee. A single `__FC_*` cookie exceeding this may be
// rejected outright by some browsers, so the warning is per-cookie rather than
// per-request.
const FC_COOKIE_SIZE_WARN_BYTES = 4096;
// Under rolling sessions, set() runs on ~every authenticated request, so a
// legitimately large-but-working session would otherwise log the size warning
// on every request. Emit it once per process to keep the diagnostic without
// spamming logs.
let sessionSizeWarningEmitted = false;
class StatelessSessionStore extends __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$session$2f$abstract$2d$session$2d$store$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["AbstractSessionStore"] {
    constructor({ secret, rolling, beforeSessionRolled, absoluteDuration, inactivityDuration, cookieOptions }){
        super({
            secret,
            rolling,
            beforeSessionRolled,
            absoluteDuration,
            inactivityDuration,
            cookieOptions
        });
        this.connectionTokenSetsCookieName = "__FC";
    }
    async get(reqCookies) {
        const cookieValue = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getChunkedCookie"](this.sessionCookieName, reqCookies) ?? __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getChunkedCookie"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$session$2f$normalize$2d$session$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["LEGACY_COOKIE_NAME"], reqCookies, true);
        if (!cookieValue) {
            return null;
        }
        const originalSession = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["decrypt"](cookieValue, this.secret);
        if (!originalSession) {
            return null;
        }
        const normalizedStatelessSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$session$2f$normalize$2d$session$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["normalizeStatelessSession"])(originalSession);
        // As connection access tokens are stored in separate cookies,
        // we need to get all cookies and only use those that are prefixed with `this.connectionTokenSetsCookieName`
        const connectionTokenSetsCookies = this.getConnectionTokenSetsCookies(reqCookies);
        const connectionTokenSets = [];
        for (const cookie of connectionTokenSetsCookies){
            const decryptedCookie = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["decrypt"](cookie.value, this.secret);
            if (decryptedCookie) {
                connectionTokenSets.push(decryptedCookie.payload);
            }
        }
        return {
            ...normalizedStatelessSession,
            // Ensure that when there are no connection token sets, we omit the property.
            ...connectionTokenSets.length ? {
                connectionTokenSets
            } : {}
        };
    }
    /**
     * save adds the encrypted session cookie as a `Set-Cookie` header.
     */ async set(reqCookies, resCookies, session) {
        const { connectionTokenSets, ...originalSession } = session;
        const maxAge = this.calculateMaxAge(session.internal.createdAt);
        // Use consistent timestamp to avoid race condition - align with calculateMaxAge logic
        const now = this.epoch();
        const expiration = now + maxAge;
        const jwe = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["encrypt"](originalSession, this.secret, expiration);
        const cookieValue = jwe.toString();
        const options = {
            ...this.cookieConfig,
            maxAge
        };
        // Warn when the session cookie is large. This is the main remaining cause of
        // 431 errors: the session (unlike transaction cookies) is never evicted, so
        // an oversized session can overflow the request-header limit on its own.
        // setChunkedCookie returns the total bytes of the chunk(s) it wrote, so no
        // separate re-scan of resCookies is needed.
        const sessionCookieBytes = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["setChunkedCookie"](this.sessionCookieName, cookieValue, options, reqCookies, resCookies);
        if (sessionCookieBytes >= SESSION_COOKIE_SIZE_WARN_BYTES && !sessionSizeWarningEmitted) {
            sessionSizeWarningEmitted = true;
            console.warn(`The ${this.sessionCookieName} cookie size is ${sessionCookieBytes} bytes, which may ` + "exceed request header size limits and cause 431 Request Header Fields Too Large errors " + "on some servers, proxies, or CDNs. Consider removing unnecessary custom claims from the " + "access token or the user profile, or use a stateful session implementation to store the " + "session data in a data store.");
        }
        // Store connection access tokens, each in its own cookie
        const connectionTokenSetCount = connectionTokenSets?.length ?? 0;
        if (connectionTokenSetCount) {
            await Promise.all(connectionTokenSets.map((connectionTokenSet, index)=>this.storeInCookie(reqCookies, resCookies, connectionTokenSet, `${this.connectionTokenSetsCookieName}_${index}`, maxAge)));
        }
        // The connection token cookies are indexed positionally (`__FC_0..n-1`). If
        // the array has shrunk since it was last written (e.g. an account was
        // disconnected), the trailing higher-index cookies would otherwise linger as
        // orphans and be re-assembled into the session on the next read. Delete any
        // `__FC_i` present in the request whose index is beyond the current length.
        //
        // Deliberately snapshot-scan here rather than deleting a deterministic
        // `__FC_0..MAX-1` range (as `__session__*` does): `__FC` has no hard cap on
        // the number of connected accounts a user can have, and the count we're
        // shrinking to is authoritative from the server-side delete/list rather
        // than a local decision. Deleting an arbitrary "safety" range would either
        // cap accounts or emit meaningless tombstones on every write.
        for (const cookie of this.getConnectionTokenSetsCookies(reqCookies)){
            const index = this.parseConnectionTokenSetCookieIndex(cookie.name);
            // Only reconcile cookies this store wrote (`__FC_<index>`). Any other
            // `__FC`-prefixed cookie is left untouched.
            if (index !== null && index >= connectionTokenSetCount) {
                __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["deleteCookie"](resCookies, cookie.name, {
                    domain: this.cookieConfig.domain,
                    path: this.cookieConfig.path,
                    secure: this.cookieConfig.secure,
                    sameSite: this.cookieConfig.sameSite,
                    httpOnly: this.cookieConfig.httpOnly
                });
                // Mirror the deletion into reqCookies so a subsequent get()/set() in the
                // same request does not re-assemble the orphaned `__FC_i` into the
                // session (storeInCookie writes reqCookies for read-after-write too).
                reqCookies.delete(cookie.name);
            }
        }
        // Any existing v3 cookie can be deleted as soon as we have set a v4 cookie.
        // In stateless sessions, we do have to ensure we delete all chunks.
        // Only delete legacy cookies if they actually exist in the request.
        if (__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getChunkedCookie"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$session$2f$normalize$2d$session$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["LEGACY_COOKIE_NAME"], reqCookies, true)) {
            __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["deleteChunkedCookie"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$session$2f$normalize$2d$session$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["LEGACY_COOKIE_NAME"], reqCookies, resCookies, true, {
                domain: this.cookieConfig.domain,
                path: this.cookieConfig.path,
                secure: this.cookieConfig.secure,
                sameSite: this.cookieConfig.sameSite,
                httpOnly: this.cookieConfig.httpOnly
            });
        }
    }
    async delete(reqCookies, resCookies) {
        const deleteOptions = {
            domain: this.cookieConfig.domain,
            path: this.cookieConfig.path,
            secure: this.cookieConfig.secure,
            sameSite: this.cookieConfig.sameSite,
            httpOnly: this.cookieConfig.httpOnly
        };
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["deleteChunkedCookie"](this.sessionCookieName, reqCookies, resCookies, false, deleteOptions);
        // delete any existing v3 legacy cookies
        if (__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getChunkedCookie"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$session$2f$normalize$2d$session$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["LEGACY_COOKIE_NAME"], reqCookies, true)) {
            __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["deleteChunkedCookie"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$session$2f$normalize$2d$session$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["LEGACY_COOKIE_NAME"], reqCookies, resCookies, true, deleteOptions);
        }
        this.getConnectionTokenSetsCookies(reqCookies).forEach((cookie)=>__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["deleteCookie"](resCookies, cookie.name, deleteOptions));
    }
    async deleteByReqCookies() {
    // Stateless sessions are stored in the cookie itself — clearing requires
    // response cookies, which are unavailable here. The ceiling check returns
    // null on every read, so the orphaned cookie is harmless.
    }
    async storeInCookie(reqCookies, resCookies, session, cookieName, maxAge) {
        const expiration = Math.floor(Date.now() / 1000 + maxAge);
        const jwe = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["encrypt"](session, this.secret, expiration);
        const cookieValue = jwe.toString();
        resCookies.set(cookieName, jwe.toString(), {
            ...this.cookieConfig,
            maxAge
        });
        // to enable read-after-write in the same request for middleware
        reqCookies.set(cookieName, cookieValue);
        // Measure the encoded `Set-Cookie` string for the per-cookie size check.
        const cookieJarSizeTest = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$edge$2d$runtime$2f$cookies$2f$dist$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__["ResponseCookies"](new Headers());
        cookieJarSizeTest.set(cookieName, cookieValue, {
            ...this.cookieConfig,
            maxAge
        });
        // storeInCookie only ever writes connection-token (`__FC_*`) cookies — the
        // session cookie is written (and size-checked) separately in set(). Warn if
        // an individual connection-token cookie exceeds the per-cookie limit
        // browsers are documented to guarantee.
        if (new TextEncoder().encode(cookieJarSizeTest.toString()).length >= FC_COOKIE_SIZE_WARN_BYTES) {
            console.warn(`The ${cookieName} cookie size exceeds ${FC_COOKIE_SIZE_WARN_BYTES} bytes, which may cause issues in some browsers. ` + "You can use a stateful session implementation to store the session data in a data store.");
        }
    }
    getConnectionTokenSetsCookies(cookies) {
        // Match the exact `<prefix>_<digits>` shape this store writes, not a loose
        // `startsWith(prefix)`. Keeps `get()`, `delete()`, and the orphan sweep in
        // agreement on what counts as one of ours — otherwise a stray `__FCcustom`
        // cookie set by other code could be read into `connectionTokenSets`,
        // rewritten into an indexed slot, but never cleaned.
        return cookies.getAll().filter((cookie)=>this.parseConnectionTokenSetCookieIndex(cookie.name) !== null);
    }
    /**
     * Parses the positional index out of a connection token set cookie name
     * (e.g. `__FC_2` -> `2`). Returns `null` when the name does not match the
     * expected `<prefix>_<index>` shape.
     */ parseConnectionTokenSetCookieIndex(cookieName) {
        const prefix = `${this.connectionTokenSetsCookieName}_`;
        if (!cookieName.startsWith(prefix)) {
            return null;
        }
        const suffix = cookieName.slice(prefix.length);
        if (!/^\d+$/.test(suffix)) {
            return null;
        }
        return Number(suffix);
    }
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/transaction-store.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MAX_RETURN_TO_BYTES",
    ()=>MAX_RETURN_TO_BYTES,
    "MAX_TRANSACTION_FIELD_BYTES",
    ()=>MAX_TRANSACTION_FIELD_BYTES,
    "TransactionStore",
    ()=>TransactionStore,
    "clampReturnTo",
    ()=>clampReturnTo,
    "clampTransactionField",
    ()=>clampTransactionField
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/cookies.js [middleware] (ecmascript) <locals>");
;
const TRANSACTION_COOKIE_PREFIX = "__txn_";
// Maximum total byte size of all transaction (`__txn_*`) cookies
// combined. When the accumulated size meets or exceeds this limit, the oldest
// cookies are evicted (FIFO by creation timestamp) before a new one is written.
// One JWE is ~450–555 bytes, so this allows ~6 concurrent in-flight logins —
// enough for multi-tab use while staying well under the request-header limits
// enforced by browsers (~4 KB per cookie) and servers/proxies. Intentionally
// fixed and not configurable: it caps transaction-cookie accumulation regardless
// of the deployment's header limit, which the SDK cannot know.
const MAX_TRANSACTION_COOKIE_BYTES = 3500;
const MAX_TRANSACTION_FIELD_BYTES = 2048;
const MAX_RETURN_TO_BYTES = MAX_TRANSACTION_FIELD_BYTES;
// Emit once per process — same reasoning as sessionSizeWarningEmitted in
// stateless-session-store.ts: prefetch/bot traffic hits this path repeatedly,
// so a per-eviction warn would spam logs.
let txnEvictionWarningEmitted = false;
// Separate flag for the "single cookie exceeds cap on its own" case. Distinct
// from `txnEvictionWarningEmitted` so an operator sees the right diagnostic
// even if the other warn has already fired earlier in the process.
let txnOversizeWarningEmitted = false;
// One flag per field so a scope clamp does not silence a later returnTo clamp
// (each field surfaces independently to the developer).
const clampWarnEmittedByField = new Set();
function clampTransactionField(fieldName, value, fallback) {
    if (value === undefined || new TextEncoder().encode(value).length <= MAX_TRANSACTION_FIELD_BYTES) {
        return value;
    }
    if (!clampWarnEmittedByField.has(fieldName)) {
        clampWarnEmittedByField.add(fieldName);
        console.warn(`[auth0] ${fieldName} value exceeds ${MAX_TRANSACTION_FIELD_BYTES} bytes; ` + `clamping to ${fallback ?? "undefined"} to keep the transaction cookie ` + `under the header size limit. Shorten the ${fieldName} value in your ` + `application.`);
    }
    return fallback;
}
function clampReturnTo(returnTo, fallback) {
    return clampTransactionField("returnTo", returnTo, fallback);
}
class TransactionStore {
    constructor({ secret, cookieOptions, enableParallelTransactions }){
        this.secret = secret;
        this.transactionCookiePrefix = cookieOptions?.prefix ?? TRANSACTION_COOKIE_PREFIX;
        this.cookieOptions = {
            httpOnly: true,
            sameSite: cookieOptions?.sameSite ?? "lax",
            secure: cookieOptions?.secure ?? false,
            path: cookieOptions?.path ?? "/",
            domain: cookieOptions?.domain,
            maxAge: cookieOptions?.maxAge || 60 * 60 // 1 hour in seconds
        };
        this.enableParallelTransactions = enableParallelTransactions ?? true;
    }
    /**
     * Returns the name of the cookie used to store the transaction state.
     * The cookie name is derived from the state parameter to prevent collisions
     * between different transactions.
     */ getTransactionCookieName(state) {
        return this.enableParallelTransactions ? `${this.transactionCookiePrefix}${state}` : `${this.transactionCookiePrefix}`;
    }
    /**
     * Returns the configured prefix for transaction cookies.
     */ getCookiePrefix() {
        return this.transactionCookiePrefix;
    }
    /**
     * Saves the transaction state to an encrypted cookie.
     *
     * @param resCookies - The response cookies object to set the transaction cookie on
     * @param transactionState - The transaction state to save
     * @param reqCookies - Optional request cookies. When provided, enables FIFO
     *                     eviction of accumulated transaction cookies (capped at
     *                     {@link MAX_TRANSACTION_COOKIE_BYTES}) before writing the
     *                     new cookie.
     * @throws {Error} When transaction state is missing required state parameter
     */ async save(resCookies, transactionState, reqCookies) {
        if (!transactionState.state) {
            throw new Error("Transaction state is required");
        }
        const expiration = Math.floor(Date.now() / 1000 + this.cookieOptions.maxAge);
        const jwe = await __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["encrypt"](transactionState, this.secret, expiration);
        // Encode creation timestamp in the value for O(1) FIFO ordering during eviction.
        // Format: "{ts}:{jwe}" — cookie name is unchanged.
        //
        // Compatibility notes:
        // - Forward (new code reads old cookie): get() strips a "{ts}:" prefix
        //   before decrypting, so legacy bare "{jwe}" values still read correctly.
        //   See `get()` below.
        // - Backward (old code reads new cookie): a version of get() that predates
        //   this change passes the full "{ts}:{jwe}" string to decrypt(), which
        //   returns null (ERR_JWE_INVALID is swallowed). Any in-flight login
        //   started against a pod with this write-side change but completed against
        //   a pod without the read-side prefix stripping will fail once — the user
        //   sees "state parameter is invalid" and must re-initiate login. This
        //   affects rolling deploys where old and new pods coexist, and rollbacks.
        //   Transaction cookies are short-lived (default maxAge 1h), so the window
        //   is bounded to one hour after the deploy/rollback boundary.
        //
        //   To eliminate the window, ship the get() prefix-stripping in a prior
        //   backfill release; then every pod can read the new format before the
        //   first pod writes it. If that is not feasible, call out the one-time
        //   in-flight login failure in the release notes.
        const ts = Math.floor(Date.now() / 1000);
        const newCookieName = this.getTransactionCookieName(transactionState.state);
        const newCookieValue = `${ts}:${jwe}`;
        // Evict oldest transaction cookies FIFO before writing the new one, so the
        // accumulated `__txn_*` cookies stay under the fixed byte limit. Only
        // transaction cookies are measured/deleted — the session and other cookies
        // are left untouched, and the cookie about to be written is never evicted.
        if (reqCookies) {
            this.evictOldestTransactionCookies(reqCookies, resCookies, newCookieName, newCookieValue);
        }
        resCookies.set(newCookieName, newCookieValue, this.cookieOptions);
    }
    /**
     * Evicts the oldest transaction cookies (FIFO by the `{ts}:` value prefix) from
     * the response so that the accumulated `__txn_*` cookies — including the one
     * about to be written — stay under {@link MAX_TRANSACTION_COOKIE_BYTES}.
     *
     * Only cookies matching the transaction prefix are measured and deleted — the
     * session, connection-token, and application cookies are never touched. The
     * cookie about to be (re)written for the current transaction (`newCookieName`)
     * is never evicted. No-op when the projected total is under the limit.
     *
     * @param newCookieName - Name of the cookie about to be written (never evicted).
     * @param newCookieValue - Value of that cookie; its size is included in the cap
     *                         so a large new cookie can still trigger eviction.
     */ evictOldestTransactionCookies(reqCookies, resCookies, newCookieName, newCookieValue) {
        const sizeOf = (name, value)=>new TextEncoder().encode(`${name}=${value}`).length;
        const txnCookies = reqCookies.getAll().filter((c)=>c.name.startsWith(this.transactionCookiePrefix));
        // Existing transaction-cookie bytes, excluding any cookie with the same name
        // as the one we're about to write — its old bytes are replaced, not added.
        const existingBytes = txnCookies.reduce((sum, c)=>c.name === newCookieName ? sum : sum + sizeOf(c.name, c.value), 0);
        // Project the total that will be on the request header after this write.
        const projectedBytes = existingBytes + sizeOf(newCookieName, newCookieValue);
        if (projectedBytes < MAX_TRANSACTION_COOKIE_BYTES) {
            return;
        }
        const deleteOptions = {
            domain: this.cookieOptions.domain,
            path: this.cookieOptions.path,
            secure: this.cookieOptions.secure,
            sameSite: this.cookieOptions.sameSite,
            httpOnly: this.cookieOptions.httpOnly
        };
        // Sort by timestamp encoded in value prefix "{ts}:{jwe}".
        // Legacy bare "{jwe}" values (no colon) get timestamp 0 — evicted first.
        const sorted = [
            ...txnCookies
        ].sort((a, b)=>this.parseCookieTimestamp(a.value) - this.parseCookieTimestamp(b.value));
        let freed = 0;
        const target = projectedBytes - MAX_TRANSACTION_COOKIE_BYTES + 1;
        for (const c of sorted){
            // Never evict the cookie we are about to (re)write for this state.
            if (c.name === newCookieName) continue;
            __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["deleteCookie"](resCookies, c.name, deleteOptions);
            freed += sizeOf(c.name, c.value);
            if (freed >= target) break;
        }
        if (freed > 0) {
            // Something was actually evicted — the accumulation-of-abandoned-logins
            // diagnostic is the right one to surface. Guarded by `freed > 0` so we
            // do not send an operator hunting for phantom abandoned logins when the
            // real issue is a single oversized cookie (see the else branch below).
            if (!txnEvictionWarningEmitted) {
                txnEvictionWarningEmitted = true;
                console.warn(`[auth0] Evicted the oldest transaction cookie(s) — projected total size ${projectedBytes} bytes ` + `reached the ${MAX_TRANSACTION_COOKIE_BYTES} byte limit. This usually means many ` + `login flows were started but never completed (e.g. prefetches or abandoned logins); ` + `reduce transactionCookie.maxAge if in-flight logins are being evicted too aggressively.`);
            }
        } else {
            // Nothing was evicted but the cap is still exceeded — the new cookie
            // itself is bigger than the cap on its own. Usually means a very long
            // `returnTo`, `scope`, or `audience` slipped past the field clamps.
            // Different message so the operator does not go looking for accumulation.
            if (!txnOversizeWarningEmitted) {
                txnOversizeWarningEmitted = true;
                console.warn(`[auth0] Transaction cookie exceeds the ${MAX_TRANSACTION_COOKIE_BYTES} byte limit ` + `on its own (projected size ${projectedBytes} bytes). This is usually caused by a very ` + `long returnTo, scope, or audience value on /auth/login. Check the field clamps in ` + `handleLogin; the cookie was still written but may be rejected by the browser or a proxy.`);
            }
        }
    }
    /**
     * Extracts the creation timestamp from a cookie value shaped "{ts}:{jwe}".
     * Legacy bare "{jwe}" values (no colon) have no timestamp and sort first (0).
     * Uses an explicit split on the first colon rather than `parseInt`, so a
     * legacy JWE that happens to start with digits is never mistaken for a
     * timestamp — consistent with the split used in {@link get}.
     */ parseCookieTimestamp(value) {
        const colonIdx = value.indexOf(":");
        if (colonIdx === -1) {
            return 0;
        }
        const ts = Number(value.slice(0, colonIdx));
        return Number.isFinite(ts) ? ts : 0;
    }
    async get(reqCookies, state) {
        const cookieName = this.getTransactionCookieName(state);
        const cookieValue = reqCookies.get(cookieName)?.value;
        if (!cookieValue) {
            return null;
        }
        // Strip "{ts}:" prefix before decryption — backward compatible with legacy bare "{jwe}".
        const colonIdx = cookieValue.indexOf(":");
        const jwe = colonIdx !== -1 ? cookieValue.slice(colonIdx + 1) : cookieValue;
        return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["decrypt"](jwe, this.secret);
    }
    async delete(resCookies, state) {
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["deleteCookie"](resCookies, this.getTransactionCookieName(state), {
            domain: this.cookieOptions.domain,
            path: this.cookieOptions.path,
            secure: this.cookieOptions.secure,
            sameSite: this.cookieOptions.sameSite,
            httpOnly: this.cookieOptions.httpOnly
        });
    }
    /**
     * Deletes all transaction cookies based on the configured prefix.
     */ async deleteAll(reqCookies, resCookies) {
        const txnPrefix = this.getCookiePrefix();
        const deleteOptions = {
            domain: this.cookieOptions.domain,
            path: this.cookieOptions.path,
            secure: this.cookieOptions.secure,
            sameSite: this.cookieOptions.sameSite,
            httpOnly: this.cookieOptions.httpOnly
        };
        reqCookies.getAll().forEach((cookie)=>{
            if (cookie.name.startsWith(txnPrefix)) {
                __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["deleteCookie"](resCookies, cookie.name, deleteOptions);
            }
        });
    }
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/user.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Default claims for the ID token.
 */ __turbopack_context__.s([
    "DEFAULT_ID_TOKEN_CLAIMS",
    ()=>DEFAULT_ID_TOKEN_CLAIMS,
    "filterDefaultIdTokenClaims",
    ()=>filterDefaultIdTokenClaims
]);
const DEFAULT_ID_TOKEN_CLAIMS = [
    "sub",
    "name",
    "nickname",
    "given_name",
    "family_name",
    "picture",
    "email",
    "email_verified",
    "org_id",
    "act",
    "urn:auth0:my_org_current_user_permissions"
];
function filterDefaultIdTokenClaims(claims) {
    return Object.keys(claims).reduce((acc, key)=>{
        if (DEFAULT_ID_TOKEN_CLAIMS.includes(key)) {
            acc[key] = claims[key];
        }
        return acc;
    }, {});
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/types/anonymous-session.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Anonymous Session Types for @auth0/nextjs-auth0
 * Public API types and configuration contracts for anonymous sessions
 */ /**
 * Helper: check if error is recoverable (silent recovery path)
 */ __turbopack_context__.s([
    "isRecoverableAnonymousError",
    ()=>isRecoverableAnonymousError
]);
function isRecoverableAnonymousError(err) {
    // Check if error is AnonymousSessionError with code session_expired or invalid_session_token
    if (err && typeof err === "object" && "code" in err && typeof err.code === "string") {
        const code = err.code;
        return code === "session_expired" || code === "invalid_session_token";
    }
    return false;
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/types/connected-accounts.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RESPONSE_TYPES",
    ()=>RESPONSE_TYPES
]);
var RESPONSE_TYPES;
(function(RESPONSE_TYPES) {
    /**
     * Authorization Code flow.
     */ RESPONSE_TYPES["CODE"] = "code";
    /**
     * Connect Account flow.
     */ RESPONSE_TYPES["CONNECT_CODE"] = "connect_code";
})(RESPONSE_TYPES || (RESPONSE_TYPES = {}));
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/types/index.js [middleware] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$types$2f$token$2d$vault$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/types/token-vault.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$types$2f$connected$2d$accounts$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/types/connected-accounts.js [middleware] (ecmascript)");
;
;
;
;
;
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/types/mfa.js [middleware] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/types/passkey.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Passkey (WebAuthn) types for authentication and enrollment flows.
 *
 * SDK-facing types use camelCase. `PasskeyEnrollmentVerifyResponse` fields use
 * snake_case to match the Auth0 MyAccount API wire format.
 */ /**
 * Grant type for passkey (WebAuthn) token exchange.
 * Used in the /oauth/token request after a successful passkey assertion.
 */ __turbopack_context__.s([
    "GRANT_TYPE_PASSKEY",
    ()=>GRANT_TYPE_PASSKEY
]);
const GRANT_TYPE_PASSKEY = "urn:okta:params:oauth:grant-type:webauthn";
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/types/passwordless.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Grant type for passwordless OTP verification.
 * Used to exchange a one-time password for access/refresh tokens.
 *
 * @see https://auth0.com/docs/api/authentication#authenticate-user
 */ __turbopack_context__.s([
    "GRANT_TYPE_PASSWORDLESS_OTP",
    ()=>GRANT_TYPE_PASSWORDLESS_OTP
]);
const GRANT_TYPE_PASSWORDLESS_OTP = "http://auth0.com/oauth/grant-type/passwordless/otp";
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/types/token-vault.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Token type URNs for Custom Token Exchange and Session Transfer flows (RFC 8693).
 */ __turbopack_context__.s([
    "GRANT_TYPE_CUSTOM_TOKEN_EXCHANGE",
    ()=>GRANT_TYPE_CUSTOM_TOKEN_EXCHANGE,
    "SUBJECT_TOKEN_TYPES",
    ()=>SUBJECT_TOKEN_TYPES,
    "TOKEN_TYPES",
    ()=>TOKEN_TYPES
]);
var TOKEN_TYPES;
(function(TOKEN_TYPES) {
    /**
     * OAuth 2.0 ID token.
     * @see {@link https://datatracker.ietf.org/doc/html/rfc8693#section-3-3.6 RFC 8693 Section 3-3.6}
     */ TOKEN_TYPES["ID_TOKEN"] = "urn:ietf:params:oauth:token-type:id_token";
    /**
     * OAuth 2.0 access token.
     * @see {@link https://datatracker.ietf.org/doc/html/rfc8693#section-3-3.2 RFC 8693 Section 3-3.2}
     */ TOKEN_TYPES["ACCESS_TOKEN"] = "urn:ietf:params:oauth:token-type:access_token";
    /**
     * Session Transfer Token issued by Auth0 (Phase 2 CTE).
     * When `issued_token_type` equals this value, the `access_token` in the response
     * is a one-shot STT — not a usable API bearer token. Pass it to
     * `buildSessionTransferRedirect` to start the impersonation redirect.
     */ TOKEN_TYPES["SESSION_TRANSFER_TOKEN"] = "urn:auth0:params:oauth:token-type:session_transfer_token";
})(TOKEN_TYPES || (TOKEN_TYPES = {}));
var SUBJECT_TOKEN_TYPES;
(function(SUBJECT_TOKEN_TYPES) {
    /**
     * Indicates that the token is an OAuth 2.0 refresh token issued by the given authorization server.
     *
     * @see {@link https://datatracker.ietf.org/doc/html/rfc8693#section-3-3.4 RFC 8693 Section 3-3.4}
     */ SUBJECT_TOKEN_TYPES["SUBJECT_TYPE_REFRESH_TOKEN"] = "urn:ietf:params:oauth:token-type:refresh_token";
    /**
     * Indicates that the token is an OAuth 2.0 access token issued by the given authorization server.
     *
     * @see {@link https://datatracker.ietf.org/doc/html/rfc8693#section-3-3.2 RFC 8693 Section 3-3.2}
     */ SUBJECT_TOKEN_TYPES["SUBJECT_TYPE_ACCESS_TOKEN"] = "urn:ietf:params:oauth:token-type:access_token";
})(SUBJECT_TOKEN_TYPES || (SUBJECT_TOKEN_TYPES = {}));
const GRANT_TYPE_CUSTOM_TOKEN_EXCHANGE = "urn:ietf:params:oauth:grant-type:token-exchange";
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/anonymous-session-constants.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Marker prefix for all anonymous subjects (design 8.S3: single definition for consistency) */ __turbopack_context__.s([
    "ANONYMOUS_SUBJECT_PREFIX",
    ()=>ANONYMOUS_SUBJECT_PREFIX,
    "ANON_TRANSFER_AUDIENCE",
    ()=>ANON_TRANSFER_AUDIENCE,
    "ANON_TRANSFER_TOKEN_PARAM",
    ()=>ANON_TRANSFER_TOKEN_PARAM,
    "DEFAULT_ANONYMOUS_SESSION_COOKIE_NAME",
    ()=>DEFAULT_ANONYMOUS_SESSION_COOKIE_NAME,
    "METADATA_SIZE_LIMIT_BYTES",
    ()=>METADATA_SIZE_LIMIT_BYTES,
    "RESERVED_SESSION_TOKEN_PARAM",
    ()=>RESERVED_SESSION_TOKEN_PARAM,
    "transferCookies",
    ()=>transferCookies
]);
const ANONYMOUS_SUBJECT_PREFIX = "anon@";
const DEFAULT_ANONYMOUS_SESSION_COOKIE_NAME = "auth0_anon";
const METADATA_SIZE_LIMIT_BYTES = 1024;
const RESERVED_SESSION_TOKEN_PARAM = "session_token";
function transferCookies(from, to) {
    for (const cookie of from.cookies.getAll()){
        to.cookies.set(cookie);
    }
}
const ANON_TRANSFER_TOKEN_PARAM = "anon_transfer_token";
const ANON_TRANSFER_AUDIENCE = "urn:auth0:anon_transfer";
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/app-base-url.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "inferBaseUrlFromRequest",
    ()=>inferBaseUrlFromRequest,
    "resolveAppBaseUrl",
    ()=>resolveAppBaseUrl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/index.js [middleware] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/oauth-errors.js [middleware] (ecmascript)");
;
const HTTP_PROTOCOLS = new Set([
    "http:",
    "https:"
]);
function ensureHttpUrl(url, label) {
    if (!HTTP_PROTOCOLS.has(url.protocol)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["InvalidConfigurationError"](`${label} must use http or https.`);
    }
}
function normalizeBaseUrlString(value, label, requireHttp = false) {
    const trimmed = value.trim();
    let url;
    try {
        url = new URL(trimmed);
    } catch  {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["InvalidConfigurationError"](`${label} must be an absolute URL.`);
    }
    if (requireHttp) {
        ensureHttpUrl(url, label);
    }
    return trimmed;
}
function getFirstHeaderValue(value) {
    if (!value) {
        return null;
    }
    const [first] = value.split(",");
    return first?.trim() || null;
}
function inferBaseUrlFromRequest(req) {
    const forwardedProto = getFirstHeaderValue(req.headers.get("x-forwarded-proto"));
    const forwardedHost = getFirstHeaderValue(req.headers.get("x-forwarded-host"));
    const host = forwardedHost || getFirstHeaderValue(req.headers.get("host")) || req.nextUrl?.host;
    const proto = forwardedProto || req.nextUrl?.protocol?.replace(":", "") || undefined;
    if (!host || !proto) {
        return null;
    }
    try {
        return normalizeBaseUrlString(`${proto}://${host}`, "Request host", true);
    } catch  {
        return null;
    }
}
function resolveAppBaseUrl(appBaseUrl, req) {
    const staticAppBaseUrl = typeof appBaseUrl === "string" ? appBaseUrl : undefined;
    const allowedAppBaseUrls = typeof appBaseUrl === "string" ? undefined : appBaseUrl;
    if (staticAppBaseUrl) {
        return staticAppBaseUrl;
    }
    // If we do not have a request, we can not resolve the base URL.
    if (!req) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["InvalidConfigurationError"]("APP_BASE_URL is not configured as a static string, and a request context is not available.");
    }
    // Resolve the request origin, then validate it against the allow list.
    const inferred = inferBaseUrlFromRequest(req);
    if (!inferred) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["InvalidConfigurationError"]("APP_BASE_URL is not configured as a static string, and the request origin could not be determined from the request context. ");
    }
    if (!allowedAppBaseUrls) {
        return inferred;
    }
    const requestOrigin = new URL(inferred).origin;
    const isRequestOriginAllowed = allowedAppBaseUrls.some((allowedUrl)=>{
        try {
            return new URL(allowedUrl).origin === requestOrigin;
        } catch  {
            return false;
        }
    });
    if (isRequestOriginAllowed) {
        return requestOrigin;
    }
    throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["InvalidConfigurationError"](`APP_BASE_URL is not configured as a static string, and the APP_BASE_URL configuration does not contain a match for the current request origin.`);
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/authorization-params-helpers.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mergeAuthorizationParamsIntoSearchParams",
    ()=>mergeAuthorizationParamsIntoSearchParams,
    "parseNonNegativeIntegerParam",
    ()=>parseNonNegativeIntegerParam
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$scope$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/scope-helpers.js [middleware] (ecmascript)");
;
function parseNonNegativeIntegerParam(name, value) {
    if (!/^\d+$/.test(value)) {
        return null;
    }
    return Number(value);
}
function mergeAuthorizationParamsIntoSearchParams(leftParams, rightParams, excludedParams = []) {
    const authorizationParams = new URLSearchParams();
    // First we merge the two sets of authorization parameters,
    // with the rightParams taking precedence over leftParams.
    // We then iterate over the merged object and add each key/value pair to the URLSearchParams,
    // excluding any keys specified in excludedParams.
    // We also skip any keys with null or undefined values.
    // Additionally, when the scope is provided as a map of audience to scopes, we need to pick the correct
    // scope for the current audience.
    const mergedAuthorizationParams = {
        ...leftParams,
        ...rightParams
    };
    Object.entries(mergedAuthorizationParams).forEach(([key, val])=>{
        if (!excludedParams || !excludedParams.includes(key) && val != null) {
            // When the scope is provided as a map of audience to scopes, we need to pick the correct
            // scope for the current audience.
            if (key === "scope" && typeof val === "object") {
                val = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$scope$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["getScopeForAudience"])(val, mergedAuthorizationParams.audience);
            }
            // Only when the value is not null or undefined, we set it.
            // This allows to use values such as empty string or 0,
            // which are falsy but valid values for authorization parameters.
            if (val != null) {
                authorizationParams.set(key, String(val));
            }
        }
    });
    return authorizationParams;
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/constants.js [middleware] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/dpopRetry.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateDpopKeyPair",
    ()=>generateDpopKeyPair,
    "isEdgeRuntime",
    ()=>isEdgeRuntime,
    "withDPoPNonceRetry",
    ()=>withDPoPNonceRetry
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/oauth4webapi/build/index.js [middleware] (ecmascript)");
;
function isEdgeRuntime() {
    return typeof globalThis.EdgeRuntime === "string";
}
async function generateDpopKeyPair() {
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["generateKeyPair"])("ES256");
}
const applyRetryDelay = async (config)=>{
    const delay = config?.delay ?? 100;
    const jitter = config?.jitter ?? true;
    let actualDelay = delay;
    // Apply jitter if enabled (50-100% of original delay to prevent thundering herd)
    if (jitter) {
        actualDelay = delay * (0.5 + Math.random() * 0.5);
    }
    // Delay before retry to avoid rapid successive requests
    await new Promise((resolve)=>setTimeout(resolve, actualDelay));
};
async function withDPoPNonceRetry(fn, config) {
    // If DPoP is not enabled, execute without retry logic
    if (!config?.isDPoPEnabled) {
        return await fn();
    }
    /**
     * PATH 1: Response Object Inspection (Auth Code Flow)
     *
     * When fn() returns a Response object (not thrown), we check its status.
     * If 400 with use_dpop_nonce error, extract nonce from error body and retry.
     * This path is used when response processing happens OUTSIDE the wrapper.
     *
     * PATH 2: Exception Handling (Refresh/Connection Flows)
     * When fn() includes response processing that throws, we catch exceptions above.
     * Both paths support automatic nonce retry per RFC 9449 Section 8.
     *
     * @see withDPoPNonceRetry JSDoc for detailed explanation of dual-path retry logic
     */ try {
        const response = await fn();
        // Check if this is a 400 error response with use_dpop_nonce
        if (response instanceof Response && response.status === 400) {
            try {
                const errorBody = await response.clone().json();
                if (errorBody.error === "use_dpop_nonce") {
                    // This is a DPoP nonce error, retry with delay and jitter
                    await applyRetryDelay(config);
                    // Retry the request - the DPoP handle automatically learned the nonce
                    return await fn();
                }
            } catch  {
            // If JSON parsing fails, it's not a DPoP nonce error - return original response
            }
        }
        return response;
    } catch (error) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["isDPoPNonceError"])(error)) {
            // This is a DPoP nonce error, retry with delay and jitter
            await applyRetryDelay(config);
            // Retry the request - the DPoP handle automatically learned the nonce
            return await fn();
        } else {
            throw error;
        }
    }
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/fetchUtils.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Creates a fetch wrapper that enforces a maximum response body size.
 *
 * Guards against memory exhaustion from oversized OIDC discovery documents,
 * JWKS responses, token endpoint payloads, or other HTTP responses.
 *
 * Two-layer protection:
 * 1. Fast path: rejects immediately if Content-Length header exceeds the limit
 * 2. Streaming guard: wraps the response body to enforce the limit during
 *    chunked transfer-encoding where Content-Length is absent
 *
 * @param baseFetch - The underlying fetch implementation to wrap
 * @param maxBodySize - Maximum allowed response body size in bytes
 * @returns A fetch function that enforces the size limit
 *
 * @internal
 */ __turbopack_context__.s([
    "createSizeLimitedFetch",
    ()=>createSizeLimitedFetch
]);
function createSizeLimitedFetch(baseFetch, maxBodySize) {
    return async (input, init)=>{
        const response = await baseFetch(input, init);
        // Fast path: reject if Content-Length is declared and exceeds limit
        const contentLength = response.headers.get("content-length");
        if (contentLength && parseInt(contentLength, 10) > maxBodySize) {
            // Cancel the response body to release the connection
            await response.body?.cancel();
            throw new Error(`Response body too large: ${contentLength} bytes exceeds ${maxBodySize} byte limit`);
        }
        // Wrap response body to enforce size limit during streaming consumption
        // (handles chunked transfer-encoding where Content-Length is absent)
        if (response.body) {
            const reader = response.body.getReader();
            let totalBytes = 0;
            const stream = new ReadableStream({
                async pull (controller) {
                    const { done, value } = await reader.read();
                    if (done) {
                        controller.close();
                        return;
                    }
                    totalBytes += value.byteLength;
                    if (totalBytes > maxBodySize) {
                        controller.error(new Error(`Response body too large: exceeded ${maxBodySize} byte limit`));
                        reader.cancel();
                        return;
                    }
                    controller.enqueue(value);
                }
            });
            return new Response(stream, {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers
            });
        }
        return response;
    };
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/html-helpers.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createAuthCompletePostMessageResponse",
    ()=>createAuthCompletePostMessageResponse,
    "escapeHtml",
    ()=>escapeHtml,
    "sanitizeCspNonce",
    ()=>sanitizeCspNonce
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/server.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/index.js [middleware] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/oauth-errors.js [middleware] (ecmascript)");
;
;
function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/\//g, "&#x2F;").replace(/`/g, "&#96;");
}
function sanitizeCspNonce(nonce) {
    if (!/^[A-Za-z0-9+/=\-_]+$/.test(nonce)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["InvalidConfigurationError"]("cspNonce must contain only base64 characters (A-Za-z0-9+/=-_). " + `Received: "${nonce}"`);
    }
    return nonce;
}
function createAuthCompletePostMessageResponse(options) {
    // Build the message as a JS object literal for the <script> context.
    // JSON.stringify is NOT safe in <script> context: JSON.stringify("</script>")
    // produces the literal "</script>" which the HTML parser interprets as
    // closing the <script> tag — enabling XSS via IdP claims or OAuth errors.
    //
    // Replacing < with \u003c is safe: \u003c is a valid JS Unicode escape
    // (engines evaluate it as "<") but the HTML parser never sees a "<" char,
    // so </script> injection is impossible. Unlike escapeHtml() (which produces
    // HTML entities like &quot; that are NOT valid JS), \u003c is valid in both
    // JS string literals and JSON.
    const message = (options.success ? JSON.stringify({
        type: "auth_complete",
        success: true,
        user: options.user
    }) : JSON.stringify({
        type: "auth_complete",
        success: false,
        error: options.error
    })).replace(/</g, "\\u003c");
    const nonceAttr = options.nonce ? ` nonce="${sanitizeCspNonce(options.nonce)}"` : "";
    const statusText = options.success ? "Authentication completed successfully. This window will close automatically." : "Authentication failed. Please close this window and try again.";
    const html = `<!DOCTYPE html>
<html>
<head><title>Authentication Complete</title></head>
<body>
<p>${escapeHtml(statusText)}</p>
<script${nonceAttr}>
(function(){
  try {
    if (window.opener) {
      window.opener.postMessage(${message}, window.location.origin);
    }
  } catch(e) {}
  setTimeout(function(){ window.close(); }, 100);
})();
</script>
</body>
</html>`;
    return new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"](html, {
        status: 200,
        headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "no-store"
        }
    });
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/lru-map.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * A generic Least-Recently-Used (LRU) Map with bounded size and automatic eviction.
 *
 * Insertion order is tracked via Map: on access via get() or set(), the item is
 * promoted to most-recent. When size exceeds maxSize, the least-recently-used
 * (oldest) entry is evicted.
 *
 * @template K - Key type
 * @template V - Value type
 * @internal
 */ __turbopack_context__.s([
    "LruMap",
    ()=>LruMap
]);
class LruMap {
    constructor(maxSize){
        this.maxSize = maxSize;
        this.map = new Map();
        if (maxSize <= 0) {
            throw new Error("maxSize must be greater than 0");
        }
    }
    get(key) {
        if (this.map.has(key)) {
            const value = this.map.get(key);
            this.map.delete(key);
            this.map.set(key, value);
            return value;
        }
        return undefined;
    }
    set(key, value) {
        if (this.map.has(key)) {
            this.map.delete(key);
        }
        if (this.map.size >= this.maxSize) {
            const oldestKey = this.map.keys().next().value;
            if (oldestKey !== undefined) {
                this.map.delete(oldestKey);
            }
        }
        this.map.set(key, value);
    }
    has(key) {
        return this.map.has(key);
    }
    get size() {
        return this.map.size;
    }
    delete(key) {
        return this.map.delete(key);
    }
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/mfa-server-utils.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildEnrollOptions",
    ()=>buildEnrollOptions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/server.js [middleware] (ecmascript)");
;
function buildEnrollOptions(body, authenticatorType) {
    const bodyObj = body;
    if (authenticatorType === "oob") {
        // snake_case ONLY
        const oobChannels = bodyObj.oob_channels;
        if (!oobChannels || !Array.isArray(oobChannels)) {
            return [
                null,
                __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "invalid_request",
                    error_description: "Missing or invalid oob_channels for OOB enrollment"
                }, {
                    status: 400
                })
            ];
        }
        const phoneNumber = typeof bodyObj.phone_number === "string" && bodyObj.phone_number !== "" ? bodyObj.phone_number : undefined;
        const email = typeof bodyObj.email === "string" && bodyObj.email !== "" ? bodyObj.email : undefined;
        return [
            {
                authenticatorTypes: [
                    "oob"
                ],
                oobChannels: oobChannels,
                phoneNumber,
                email
            },
            null
        ];
    } else if (authenticatorType === "otp") {
        return [
            {
                authenticatorTypes: [
                    "otp"
                ]
            },
            null
        ];
    } else {
        return [
            null,
            __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "invalid_request",
                error_description: `Unsupported authenticator_type: ${authenticatorType}`
            }, {
                status: 400
            })
        ];
    }
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/mfa-transform-utils.js [middleware] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/mfa-errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$types$2f$mfa$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/types/mfa.js [middleware] (ecmascript)");
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
    throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["InvalidRequestError"]("Missing verification credential");
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
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MfaVerifyError"]("invalid_request", "At least one verification credential required (otp, oobCode+bindingCode, or recoveryCode)");
    }
    return params;
};
const getVerifyGrantType = (params)=>{
    if (params.has("otp")) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$types$2f$mfa$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["GRANT_TYPE_MFA_OTP"];
    } else if (params.has("oob_code") && params.has("binding_code")) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$types$2f$mfa$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["GRANT_TYPE_MFA_OOB"];
    } else if (params.has("recovery_code")) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$types$2f$mfa$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["GRANT_TYPE_MFA_RECOVERY_CODE"];
    } else {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MfaVerifyError"]("invalid_request", "No verification credential provided");
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
        if (!mapping) throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["InvalidRequestError"](`Unknown factorType: ${options.factorType}`);
        if ((options.factorType === "sms" || options.factorType === "voice") && !("phoneNumber" in options && options.phoneNumber)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["InvalidRequestError"](`phoneNumber is required for factorType: ${options.factorType}`);
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
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/mfa-utils.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "decryptMfaToken",
    ()=>decryptMfaToken,
    "encryptMfaToken",
    ()=>encryptMfaToken,
    "extractMfaErrorDetails",
    ()=>extractMfaErrorDetails,
    "getMfaErrorStatusCode",
    ()=>getMfaErrorStatusCode,
    "handleMfaError",
    ()=>handleMfaError,
    "isMfaRequiredError",
    ()=>isMfaRequiredError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/server.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/index.js [middleware] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/mfa-errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/oauth-errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/sdk-error.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/server/cookies.js [middleware] (ecmascript) <locals>");
;
;
;
async function encryptMfaToken(mfaToken, audience, scope, mfaRequirements, secret, ttlSeconds) {
    const context = {
        mfaToken,
        audience,
        scope,
        mfaRequirements,
        createdAt: Date.now()
    };
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["encrypt"])(context, secret, Math.floor(Date.now() / 1000) + ttlSeconds);
}
async function decryptMfaToken(encryptedToken, secret) {
    try {
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$server$2f$cookies$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["decrypt"])(encryptedToken, secret, undefined, true);
        return result.payload;
    } catch (e) {
        if (e.code === "ERR_JWT_EXPIRED") {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MfaTokenExpiredError"]();
        }
        // ERR_JWE_DECRYPTION_FAILED or any other error means tampered, malformed, or wrong secret
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MfaTokenInvalidError"]();
    }
}
function isMfaRequiredError(error) {
    if (!error || typeof error !== "object") return false;
    const err = error;
    return err.error === "mfa_required" || err.code === "mfa_required";
}
function extractMfaErrorDetails(error) {
    if (!error || typeof error !== "object") {
        return {
            mfa_token: undefined,
            error_description: undefined,
            mfa_requirements: undefined
        };
    }
    const err = error;
    // oauth4webapi's ResponseBodyError has:
    // - error, error_description: directly on the error object
    // - cause: contains the full response body with mfa_token, mfa_requirements
    const cause = err.cause;
    return {
        // mfa_token and mfa_requirements are in the cause (response body)
        mfa_token: cause?.mfa_token ?? err.mfa_token,
        // error_description is directly on the error
        error_description: err.error_description,
        // mfa_requirements is in the cause (response body)
        mfa_requirements: cause?.mfa_requirements ?? err.mfa_requirements
    };
}
function getMfaErrorStatusCode(error) {
    if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MfaTokenExpiredError"] || error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MfaTokenInvalidError"]) {
        return 401;
    }
    if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["InvalidRequestError"] || error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MfaNoAvailableFactorsError"] || error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MfaGetAuthenticatorsError"] || error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MfaChallengeError"] || error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MfaVerifyError"]) {
        return 400;
    }
    if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["MfaRequiredError"]) {
        return 403;
    }
    return 500;
}
function handleMfaError(e) {
    // Wrap non-SDK errors in OAuth2Error for consistent shape
    if (!(e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$sdk$2d$error$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["SdkError"])) {
        e = new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["OAuth2Error"]({
            code: "server_error",
            message: e instanceof Error ? e.message : "Internal server error"
        });
    }
    const error = e;
    const status = getMfaErrorStatusCode(error);
    // MfaRequiredError has toJSON() with mfa_token + mfa_requirements
    // MfaError subclasses have toJSON() with error + error_description
    // Other SdkErrors fallback to generic shape
    const body = error.toJSON?.() ?? {
        error: error.code || "server_error",
        error_description: error.message || "Internal server error"
    };
    return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json(body, {
        status
    });
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/mfa-validation-utils.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "extractBearerToken",
    ()=>extractBearerToken,
    "extractMfaToken",
    ()=>extractMfaToken,
    "extractPathParam",
    ()=>extractPathParam,
    "parseJsonBody",
    ()=>parseJsonBody,
    "validateArrayFieldAndThrow",
    ()=>validateArrayFieldAndThrow,
    "validateStringFieldAndThrow",
    ()=>validateStringFieldAndThrow,
    "validateVerificationCredentialAndThrow",
    ()=>validateVerificationCredentialAndThrow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/index.js [middleware] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/mfa-errors.js [middleware] (ecmascript)");
;
function extractBearerToken(req) {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["InvalidRequestError"]("Missing or invalid Authorization header");
    }
    return authHeader.substring(7);
}
function extractMfaToken(req) {
    return extractBearerToken(req);
}
/**
 * Type guard to check if value is a non-empty string.
 *
 * @param value - Value to check
 * @returns True if value is a non-empty string
 */ function isNonEmptyString(value) {
    return typeof value === "string" && value !== "";
}
function validateStringFieldAndThrow(value, fieldName) {
    if (!isNonEmptyString(value)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["InvalidRequestError"](`Missing or invalid ${fieldName}`);
    }
    return value;
}
function validateArrayFieldAndThrow(value, fieldName) {
    if (!value || !Array.isArray(value) || value.length === 0) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["InvalidRequestError"](`Missing or invalid ${fieldName}`);
    }
    return value;
}
function validateVerificationCredentialAndThrow(body) {
    const bodyObj = body;
    const hasOtp = "otp" in bodyObj && typeof bodyObj.otp === "string" && bodyObj.otp !== "";
    const hasOob = "oob_code" in bodyObj && typeof bodyObj.oob_code === "string" && bodyObj.oob_code !== "" && "binding_code" in bodyObj && typeof bodyObj.binding_code === "string" && bodyObj.binding_code !== "";
    const hasRecovery = "recovery_code" in bodyObj && typeof bodyObj.recovery_code === "string" && bodyObj.recovery_code !== "";
    if (!hasOtp && !hasOob && !hasRecovery) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["InvalidRequestError"]("Missing verification credential (otp, oob_code+binding_code, or recovery_code required)");
    }
    return bodyObj;
}
function extractPathParam(pathname, paramName) {
    const value = pathname.split("/").pop();
    if (!value || value === "") {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["InvalidRequestError"](`Missing ${paramName} in URL`);
    }
    return value;
}
async function parseJsonBody(req) {
    try {
        return await req.json();
    } catch (parseError) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mfa$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["InvalidRequestError"]("Invalid JSON in request body");
    }
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/normalize.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "normalizeDomain",
    ()=>normalizeDomain,
    "normalizeDomainArray",
    ()=>normalizeDomainArray,
    "normalizeIssuer",
    ()=>normalizeIssuer,
    "tryNormalizeDomain",
    ()=>tryNormalizeDomain,
    "validateDomainHostname",
    ()=>validateDomainHostname
]);
/**
 * Utilities for normalizing and validating domains and issuers in MCD mode.
 *
 * Note on validation strictness: This validator is stricter than other Auth0 SDKs
 * (spa-js, react, express-openid-connect do no hostname validation). The strictness
 * is intentional for MCD resolver mode where the domain originates from a user-supplied
 * function and SSRF prevention is critical. In static mode the same validation applies
 * for consistency, but IP addresses and .local domains are never valid Auth0 custom
 * domains regardless.
 *
 * @internal
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mcd$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/mcd.js [middleware] (ecmascript)");
;
function normalizeIssuer(issuer) {
    if (!issuer.endsWith("/")) {
        return issuer + "/";
    }
    return issuer;
}
function validateDomainHostname(domain, options) {
    const trimmed = domain.trim();
    // Reject empty domains
    if (!trimmed) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mcd$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DomainValidationError"]("Domain cannot be empty.");
    }
    // Reject domains with paths
    if (trimmed.includes("/")) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mcd$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DomainValidationError"]("Domain cannot contain paths. Provide a hostname only.");
    }
    // Reject IPv6 addresses (contain colons, checked before generic port rejection)
    if (/^\[?([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}\]?$/.test(trimmed) || trimmed === "::1" || trimmed === "::") {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mcd$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DomainValidationError"]("IPv6 addresses are not supported.");
    }
    // Reject domains with ports
    if (trimmed.includes(":")) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mcd$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DomainValidationError"]("Domain cannot contain ports. Provide a hostname only.");
    }
    // Reject localhost (unless allowInsecureRequests is set for dev scenarios)
    if (!options?.allowInsecureRequests && (trimmed === "localhost" || trimmed.startsWith("localhost.") || trimmed.endsWith(".localhost"))) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mcd$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DomainValidationError"]("localhost domains are not supported.");
    }
    // Reject .local domains unconditionally (mDNS, not valid Auth0 domains)
    if (trimmed.endsWith(".local")) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mcd$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DomainValidationError"](".local domains are not supported.");
    }
    // Reject IPv4 addresses
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(trimmed)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mcd$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DomainValidationError"]("IPv4 addresses are not supported.");
    }
// Note: IPv6 addresses are also caught by the port/colon check above as a fallback,
// but the explicit check above provides a clearer error message.
}
function normalizeDomain(value, options) {
    const trimmed = value.trim();
    let hostname;
    let scheme = "https";
    let urlPath = "/";
    let port = "";
    try {
        // Try to parse as a URL (case-insensitive scheme detection)
        const urlLower = trimmed.toLowerCase();
        if (urlLower.startsWith("http://") || urlLower.startsWith("https://")) {
            const url = new URL(trimmed);
            hostname = url.hostname;
            scheme = url.protocol.replace(":", "");
            port = url.port;
            // Reject query strings and fragments; paths are allowed for providers like
            // Okta custom authorization servers (e.g. myorg.okta.com/oauth2/default)
            if (url.search || url.hash) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mcd$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DomainValidationError"]("Domain URL cannot contain query or fragment parameters.");
            }
            // Preserve path for use in issuer construction
            urlPath = url.pathname;
        } else {
            // Treat as bare hostname
            hostname = trimmed;
        }
    } catch (err) {
        if (err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$mcd$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DomainValidationError"]) {
            throw err;
        }
        // URL parsing failed; treat as bare hostname
        hostname = trimmed;
    }
    // Validate the hostname
    validateDomainHostname(hostname, {
        allowInsecureRequests: options?.allowInsecureRequests
    });
    // Normalize hostname to lowercase (DNS is case-insensitive per RFC 4343)
    const normalizedHostname = hostname.toLowerCase();
    // Construct the issuer URL
    // When the input includes a path (e.g. Okta custom auth server
    // https://myorg.okta.com/oauth2/default), preserve it in the issuer so that
    // OIDC discovery hits the correct endpoint.
    let issuer;
    if (options?.issuerHint) {
        issuer = normalizeIssuer(options.issuerHint);
    } else {
        const protocol = options?.allowInsecureRequests ? scheme : "https";
        const portSuffix = options?.allowInsecureRequests && port ? `:${port}` : "";
        const rawIssuer = `${protocol}://${normalizedHostname}${portSuffix}${urlPath}`;
        // For root-path issuers (hostname only), add a trailing slash to match
        // Auth0's canonical issuer format (https://tenant.auth0.com/).
        // For path-based issuers (e.g. Okta /oauth2/default, IBM /oidc/endpoint/default),
        // preserve the URL verbatim — RFC 8414 does not require a trailing slash and
        // adding one causes OAUTH_JSON_ATTRIBUTE_COMPARISON_FAILED when the provider's
        // discovery document returns the issuer without a trailing slash.
        issuer = urlPath === "/" ? normalizeIssuer(rawIssuer) : rawIssuer;
    }
    return {
        domain: normalizedHostname,
        issuer
    };
}
function normalizeDomainArray(domains) {
    return domains.map((domain)=>{
        try {
            return normalizeDomain(domain).domain;
        } catch (e) {
            console.warn(`Invalid domain in domain list: ${domain}. Skipping.`);
            return null;
        }
    }).filter((d)=>d !== null);
}
function tryNormalizeDomain(domain) {
    try {
        return normalizeDomain(domain).domain;
    } catch  {
        return null;
    }
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/oauth-error-utils.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Utility to extract OAuth error details from oauth4webapi errors.
 *
 * oauth4webapi's `parseOAuthResponseErrorBody()` only parses error bodies for
 * HTTP 4xx responses (producing `ResponseBodyError` with `.error` and
 * `.error_description`). For 5xx responses (e.g., when Auth0 Actions use
 * `api.access.deny()`), it throws `OperationProcessingError` with the raw
 * `Response` as `.cause`, losing the structured error information.
 *
 * This helper recovers those details by checking:
 * 1. If the error already has `.error` (ResponseBodyError from 4xx) → use directly
 * 2. If `.cause` is a `Response` (OperationProcessingError from 5xx) → parse JSON body
 * 3. Otherwise → return empty object
 *
 * See: https://github.com/auth0/nextjs-auth0/issues/2512
 */ /**
 * Extract `error` and `error_description` from an oauth4webapi error,
 * handling both 4xx `ResponseBodyError` and 5xx `OperationProcessingError`.
 *
 * Returns `{}` (empty `OAuthErrorDetails`) when the error structure is
 * unrecognized or the 5xx response body is not JSON / lacks error fields.
 * Callers should guard with `if (oauthErr.error)` before using the result.
 */ __turbopack_context__.s([
    "extractOAuthErrorDetails",
    ()=>extractOAuthErrorDetails
]);
async function extractOAuthErrorDetails(err) {
    if (!err || typeof err !== "object") {
        return {};
    }
    const e = err;
    // Case 1: ResponseBodyError (4xx) — error/error_description are direct properties
    if (typeof e.error === "string") {
        return {
            error: e.error,
            error_description: typeof e.error_description === "string" ? e.error_description : undefined
        };
    }
    // Case 2: OperationProcessingError (5xx) — cause is the raw Response object
    if (e.cause instanceof Response) {
        try {
            const body = await e.cause.clone().json();
            if (body && typeof body === "object") {
                return {
                    error: typeof body.error === "string" ? body.error : undefined,
                    error_description: typeof body.error_description === "string" ? body.error_description : undefined
                };
            }
        } catch  {
        // Response body wasn't JSON — nothing to extract
        }
    }
    return {};
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/pathUtils.js [middleware] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/index.js [middleware] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/oauth-errors.js [middleware] (ecmascript)");
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
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["InvalidConfigurationError"]("appBaseUrl is required for this operation. Provide it in Auth0ClientOptions or ensure it can be resolved from request headers.");
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
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/proxy.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildForwardedRequestHeaders",
    ()=>buildForwardedRequestHeaders,
    "buildForwardedResponseHeaders",
    ()=>buildForwardedResponseHeaders,
    "transformTargetUrl",
    ()=>transformTargetUrl
]);
/**
 * A default allow-list of headers to forward.
 */ const DEFAULT_HEADER_ALLOW_LIST = new Set([
    // Common End-to-End Headers
    "accept",
    "accept-language",
    "content-language",
    "content-type",
    "user-agent",
    // Caching & Conditional Requests
    "cache-control",
    "if-match",
    "if-none-match",
    "if-modified-since",
    "if-unmodified-since",
    "etag",
    // Tracing & Observability
    "x-request-id",
    "x-correlation-id",
    "traceparent",
    "tracestate",
    // PROXY HEADERS (for IP & Rate Limiting)
    "x-forwarded-for",
    "x-forwarded-host",
    "x-forwarded-proto",
    "x-real-ip",
    // SDK Telemetry
    "auth0-client",
    // CORS REQUEST HEADERS
    // Without these headers, Preflight fails, browser blocks all cross-origin requests
    // See: RFC 7231 §4.3.1 (preflight semantics), RFC 6454 (origin), WHATWG Fetch Spec
    "origin",
    "access-control-request-method",
    "access-control-request-headers"
]);
/**
 * Hop-by-hop headers that MUST be removed.
 * These are relevant only for a single transport link (client <-> proxy).
 * @see https://datatracker.ietf.org/doc/html/rfc2616#section-13.5.1
 */ const HOP_BY_HOP_HEADERS = new Set([
    "connection",
    "keep-alive",
    "proxy-authenticate",
    "proxy-authorization",
    "te",
    "trailer",
    "transfer-encoding",
    "upgrade"
]);
function buildForwardedRequestHeaders(request) {
    const forwardedHeaders = new Headers();
    request.headers.forEach((value, key)=>{
        const lowerKey = key.toLowerCase();
        // Forward if:
        // 1. It's in the allow-list, AND
        // 2. It's not a hop-by-hop header
        const shouldForward = DEFAULT_HEADER_ALLOW_LIST.has(lowerKey) && !HOP_BY_HOP_HEADERS.has(lowerKey);
        if (shouldForward) {
            forwardedHeaders.set(key, value);
        }
    });
    return forwardedHeaders;
}
function buildForwardedResponseHeaders(response) {
    const forwardedHeaders = new Headers();
    response.headers.forEach((value, key)=>{
        const lowerKey = key.toLowerCase();
        // Only forward if it's not a hop-by-hop header
        if (!HOP_BY_HOP_HEADERS.has(lowerKey)) {
            forwardedHeaders.set(key, value);
        }
    });
    return forwardedHeaders;
}
function transformTargetUrl(req, options) {
    const targetBaseUrl = options.targetBaseUrl;
    // Extract the path segment that comes AFTER the proxyPath
    // If proxyPath is "/me" and pathname is "/me/v1/some-endpoint",
    // the remaining path is "/v1/some-endpoint"
    let remainingPath = req.nextUrl.pathname.startsWith(options.proxyPath) ? req.nextUrl.pathname.slice(options.proxyPath.length) : req.nextUrl.pathname;
    // Ensure proper path joining by handling the slash
    // If remainingPath is empty or doesn't start with /, handle accordingly
    if (remainingPath && !remainingPath.startsWith("/")) {
        remainingPath = "/" + remainingPath;
    }
    // Remove trailing slash from targetBaseUrl for consistent joining
    const baseUrlTrimmed = targetBaseUrl.replace(/\/$/, "");
    // Parse the targetBaseUrl to extract its path
    const baseUrl = new URL(baseUrlTrimmed);
    const basePath = baseUrl.pathname;
    // Check if remainingPath starts with a segment that's already at the end of basePath
    // to avoid duplication (e.g., basePath="/me/v1" + remainingPath="/v1/x" → "/me/v1/x")
    let finalPath = basePath;
    if (remainingPath && remainingPath !== "/") {
        // Split paths into segments for comparison
        const baseSegments = basePath.split("/").filter(Boolean);
        const remainingSegments = remainingPath.split("/").filter(Boolean);
        // Find the longest overlap by checking from longest to shortest
        // Break on first match
        let overlapLength = 0;
        const maxOverlap = Math.min(baseSegments.length, remainingSegments.length);
        for(let i = maxOverlap; i >= 1; i--){
            const baseEnd = baseSegments.slice(-i);
            const remainingStart = remainingSegments.slice(0, i);
            if (baseEnd.every((seg, idx)=>seg === remainingStart[idx])) {
                overlapLength = i;
                break; // Found longest match, stop searching
            }
        }
        // Build final path by appending non-overlapping segments
        const nonOverlappingSegments = remainingSegments.slice(overlapLength);
        if (nonOverlappingSegments.length > 0) {
            const separator = basePath === "/" || basePath.endsWith("/") ? "" : "/";
            finalPath = basePath + separator + nonOverlappingSegments.join("/");
        }
    }
    // Build the final URL with the de-duplicated path
    const targetUrl = new URL(baseUrl.origin + finalPath);
    req.nextUrl.searchParams.forEach((value, key)=>{
        targetUrl.searchParams.append(key, value);
    });
    return targetUrl;
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/request.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isNonNavigationalRequest",
    ()=>isNonNavigationalRequest,
    "isRequest",
    ()=>isRequest
]);
const isRequest = (req)=>{
    return req instanceof Request || req.headers instanceof Headers || typeof req.bodyUsed === "boolean";
};
const isNonNavigationalRequest = (req)=>{
    const secPurpose = req.headers.get("sec-purpose") ?? "";
    const routerPrefetch = req.headers.get("next-router-prefetch");
    return(// next-router-prefetch: "1" = AUTO prefetch (Next 15); "2" = runtime
    // prefetch (Next 16+). Accept any truthy non-"0"/non-"false" value to
    // cover future Next versions, but reject falsy values a proxy or client
    // might set explicitly — matching those would silently 204 real logins.
    isTruthyHeaderValue(routerPrefetch) || req.headers.get("purpose") === "prefetch" || secPurpose.includes("prefetch") && !secPurpose.includes("prerender") || req.headers.get("x-middleware-prefetch") === "1");
};
const isTruthyHeaderValue = (value)=>{
    if (!value) return false;
    const normalized = value.trim().toLowerCase();
    return normalized !== "" && normalized !== "0" && normalized !== "false";
};
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/scope-helpers.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ensureDefaultScope",
    ()=>ensureDefaultScope,
    "getScopeForAudience",
    ()=>getScopeForAudience
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/index.js [middleware] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/oauth-errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/constants.js [middleware] (ecmascript)");
;
;
function ensureDefaultScope(authorizationParameters) {
    // When no scope is defined in the constructor, we default to a string set to DEFAULT_SCOPES.
    // We do not introduce a Map here as that would be a breaking change.
    if (!authorizationParameters.scope) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DEFAULT_SCOPES"];
    }
    // When the user defined scope as a Map, but did not define a scope for the default audience,
    // we need to default it to the DEFAULT_SCOPES
    if (typeof authorizationParameters.scope === "object" && !getScopeForAudience(authorizationParameters.scope, authorizationParameters.audience)) {
        const audience = authorizationParameters.audience;
        return {
            ...authorizationParameters.scope,
            [audience]: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$constants$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["DEFAULT_SCOPES"]
        };
    }
    return authorizationParameters.scope;
}
function getScopeForAudience(scope, audience) {
    // When the scope is null or undefined, we return undefined
    if (!scope) {
        return undefined;
    }
    // When the scope is a string, we return it as-is
    if (typeof scope === "string") {
        return scope;
    }
    // When no audience is provided, we cannot look up the scope in the Map
    // We throw an error to inform the user that an audience is required
    // Which is required to use MRRT altogether.
    if (!audience) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["InvalidConfigurationError"]("When defining scope as a Map, an audience is required to look up the correct scope.");
    }
    // When the scope is a Map, we return the scope for the provided audience
    // When no audience is provided, we default to the 'default' audience.
    return scope[audience];
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/session-changes-helpers.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSessionChangesAfterGetAccessToken",
    ()=>getSessionChangesAfterGetAccessToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$scope$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/scope-helpers.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$token$2d$set$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/token-set-helpers.js [middleware] (ecmascript)");
;
;
/**
 * Checks if a tokenSet represents global audience and scope configuration.
 * @param tokenSet The token set to check
 * @param session The current session data
 * @param globalScope The global scope configuration
 * @param globalOptions The global options containing audience configuration
 * @returns True if the tokenSet uses global audience and scope, false otherwise
 */ function isGlobalAudienceAndScope(tokenSet, session, globalScope, globalOptions) {
    const isAudienceTheGlobalAudience = !tokenSet.audience || tokenSet.audience === (session.tokenSet.audience ?? globalOptions.audience);
    const isScopeTheGlobalScope = !tokenSet.requestedScope || // Compare against either the initially requested scope, or the global scope if no requested scope is set.
    // Typically, the requestedScope should always be set, but in case of legacy sessions it might not be so we need to fall-back
    // to the global scope if that is the case.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$token$2d$set$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["compareScopes"])(session.tokenSet.requestedScope ?? globalScope, tokenSet.requestedScope);
    return isAudienceTheGlobalAudience && isScopeTheGlobalScope;
}
/**
 * Handles updates to the global tokenSet when the new token uses global audience and scope.
 * @param tokenSet The new token set to potentially update with
 * @param session The current session data
 * @returns Partial session data with updated tokenSet, or undefined if no changes needed
 */ function handleGlobalTokenSetUpdate(tokenSet, session) {
    if (tokenSet.accessToken !== session.tokenSet.accessToken || tokenSet.expiresAt !== session.tokenSet.expiresAt || tokenSet.refreshToken !== session.tokenSet.refreshToken) {
        return {
            tokenSet
        };
    }
    // When we use the global audience and scope, and nothing changed, we can exit early.
    return undefined;
}
/**
 * Updates an existing access token set with merged requested scopes.
 *
 * IMPORTANT: This function merges the requestedScope fields from both the existing
 * and new token sets. The actual granted scopes (tokenSet.scope) come from the
 * authorization server and represent what was actually granted for this specific request.
 * We track both values to:
 * 1. Know what scopes were originally requested (requestedScope)
 * 2. Know what scopes were actually granted (scope)
 *
 * The merged requestedScope should never grant more permissions than what the
 * authorization server would allow - it only tracks what has been requested across
 * multiple token requests for the same audience. The actual permissions are always
 * determined by the authorization server's response (tokenSet.scope).
 *
 * @param session The current session data
 * @param tokenSet The new token set with updated scopes from the authorization server
 * @param existingAccessTokenSet The existing access token set to update
 * @param audience The audience for the access token
 * @returns Updated session data with merged requested scopes but actual granted scopes from tokenSet
 */ function updateExistingAccessTokenWithMergedRequestedScopes(session, tokenSet, existingAccessTokenSet, audience) {
    return {
        accessTokens: session.accessTokens?.map((accessToken)=>accessToken === existingAccessTokenSet ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$token$2d$set$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["accessTokenSetFromTokenSet"])({
                ...tokenSet,
                // Use the merged requested scopes (of both existing and new entry) for lookup purposes
                requestedScope: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$token$2d$set$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["mergeScopes"])(accessToken.requestedScope, tokenSet.requestedScope),
                // Use the actual granted scope from the authorization server
                scope: tokenSet.scope
            }, {
                audience
            }) : accessToken)
    };
}
/**
 * Adds a new access token set to the session's accessTokens array.
 * @param session The current session data
 * @param tokenSet The token set to add as a new access token
 * @param audience The audience for the new access token
 * @returns Updated session data with the new access token added
 */ function addNewAccessTokenSet(session, tokenSet, audience) {
    return {
        accessTokens: [
            ...session.accessTokens || [],
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$token$2d$set$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["accessTokenSetFromTokenSet"])(tokenSet, {
                audience
            })
        ]
    };
}
/**
 * Updates an existing access token set if the access token has changed.
 * @param session The current session data
 * @param tokenSet The new token set with potentially updated access token
 * @param existingAccessTokenSet The existing access token set to compare against
 * @param audience The audience for the access token
 * @returns Updated session data if access token changed, undefined otherwise
 */ function updateExistingAccessTokenSet(session, tokenSet, existingAccessTokenSet, audience) {
    if (tokenSet.accessToken !== existingAccessTokenSet.accessToken) {
        return {
            accessTokens: session.accessTokens?.map((accessToken)=>accessToken === existingAccessTokenSet ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$token$2d$set$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["accessTokenSetFromTokenSet"])(tokenSet, {
                    audience
                }) : accessToken)
        };
    }
    return undefined;
}
/**
 * Handles updates to specific access tokens for non-global audience/scope combinations.
 * @param session The current session data
 * @param tokenSet The new token set to process
 * @param audience The specific audience for the access token
 * @param scope The specific scope for the access token
 * @returns Partial session data with access token updates, or undefined if no changes needed
 */ function handleSpecificAccessTokenUpdate(session, tokenSet, audience, scope) {
    // First, try to find an entry based on the requestedScope
    let existingAccessTokenSet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$token$2d$set$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["findAccessTokenSet"])(session, {
        scope,
        audience,
        matchMode: "requestedScope"
    });
    if (!existingAccessTokenSet) {
        // If there is no specific match based on the requestedScope, we may want to see if there is a match based on the actual scope retrieved.
        // If that is the case, we need to store them together:
        // - When the cache has an entry with scope "a" and requestedScope "a b"
        // - and we request a new token with requestedScope "a c" for the same audience, resulting in scope "a"
        // - we want to update the existing entry to have a requested scope of "a b c".
        //
        // This avoids having multiple entries for the same provided scope, which would lead to unnecessary token requests.
        // This also ensure, next time around when we request a token of scope "a b" or "a c", we will find the same existing entry in the cache, with provided scope set to "a".
        existingAccessTokenSet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$token$2d$set$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["findAccessTokenSet"])(session, {
            scope: tokenSet.scope,
            audience,
            matchMode: "scope"
        });
        if (existingAccessTokenSet) {
            // We need to update the requestedScope to be a combination of both matches
            const accessTokenChanges = updateExistingAccessTokenWithMergedRequestedScopes(session, tokenSet, existingAccessTokenSet, audience);
            return buildSessionChanges(session, tokenSet, accessTokenChanges);
        } else {
            // There is no access token found that matches the provided `audience` and `scope`.
            // We need to add a new entry to the array.
            const accessTokenChanges = addNewAccessTokenSet(session, tokenSet, audience);
            return buildSessionChanges(session, tokenSet, accessTokenChanges);
        }
    } else {
        // There is an existing access token for the provided `audience` and `scope`.
        // We need to check if the access token changed, and if so, update it in the array.
        const accessTokenChanges = updateExistingAccessTokenSet(session, tokenSet, existingAccessTokenSet, audience);
        return buildSessionChanges(session, tokenSet, accessTokenChanges);
    }
}
/**
 * Builds the final session changes object with both accessTokens and tokenSet updates.
 * @param session The current session data
 * @param tokenSet The new token set containing idToken and refreshToken updates
 * @param accessTokenChanges The access token changes to merge into the final result
 * @returns Complete session changes with both access tokens and token set updates, or undefined if no changes
 */ function buildSessionChanges(session, tokenSet, accessTokenChanges) {
    if (accessTokenChanges) {
        return {
            accessTokens: accessTokenChanges.accessTokens,
            tokenSet: {
                ...session.tokenSet,
                idToken: tokenSet.idToken,
                refreshToken: tokenSet.refreshToken
            }
        };
    }
    return undefined;
}
function getSessionChangesAfterGetAccessToken(session, tokenSet, globalOptions) {
    // Since globalOptions.scope can be a map of audience to scopes, we need to get the correct scope for the current audience.
    const globalScope = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$utils$2f$scope$2d$helpers$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["getScopeForAudience"])(globalOptions.scope, tokenSet.audience ?? globalOptions.audience);
    // If we are using the global audience and scope, we need to check if the access token or refresh token changed in `SessionData.tokenSet`.
    // We do not have to change anything to the `accessTokens` array inside `SessionData` in this case, so we can just return.
    if (isGlobalAudienceAndScope(tokenSet, session, globalScope, globalOptions)) {
        return handleGlobalTokenSetUpdate(tokenSet, session);
    }
    // If we aren't using the global audience and scope,
    // we need to check if the corresponding access token changed in `SessionData.accessTokens`.
    // We will also have to update the refreshToken and idToken as needed
    const audience = tokenSet.audience ?? globalOptions.audience;
    const scope = tokenSet.requestedScope ?? globalScope ?? undefined;
    // If there is no audience, we cannot find the correct access token in the array
    if (!audience) {
        return undefined;
    }
    return handleSpecificAccessTokenUpdate(session, tokenSet, audience, scope);
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/session-helpers.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildSessionFromCallback",
    ()=>buildSessionFromCallback,
    "isSessionCeilingInPast",
    ()=>isSessionCeilingInPast,
    "isSessionCeilingReached",
    ()=>isSessionCeilingReached,
    "mergePopupTokenIntoSession",
    ()=>mergePopupTokenIntoSession
]);
const SESSION_EXPIRY_LEEWAY_SECONDS = 30;
function isSessionCeilingReached(sessionExpiresAt) {
    if (sessionExpiresAt == null) return false;
    const now = Math.floor(Date.now() / 1000);
    return now >= sessionExpiresAt - SESSION_EXPIRY_LEEWAY_SECONDS;
}
function isSessionCeilingInPast(sessionExpiresAt, iat) {
    if (sessionExpiresAt == null) return false;
    const reference = typeof iat === "number" ? iat : Math.floor(Date.now() / 1000);
    return sessionExpiresAt <= reference + SESSION_EXPIRY_LEEWAY_SECONDS;
}
function mergePopupTokenIntoSession(session, oidcRes, transactionState, idTokenClaims) {
    session.accessTokens = session.accessTokens || [];
    const newAccessTokenSet = {
        accessToken: oidcRes.access_token,
        scope: oidcRes.scope,
        requestedScope: transactionState.scope,
        audience: transactionState.audience || "",
        expiresAt: Math.floor(Date.now() / 1000) + Number(oidcRes.expires_in),
        token_type: oidcRes.token_type
    };
    // Replace existing token for same audience, or append new one.
    //
    // NOTE: This dedup keys on audience alone — differently-scoped tokens for
    // the same audience are evicted here. The MFA step-up dedup in
    // `cacheTokenFromMfaVerify` (auth-client.ts) uses a stricter audience+scope
    // key that preserves distinct-scope entries. Both rules are pre-existing on
    // main and ship side by side. Unifying them into one shared helper is a
    // separate refactor.
    const existingIdx = session.accessTokens.findIndex((t)=>t.audience === transactionState.audience);
    if (existingIdx >= 0) {
        session.accessTokens[existingIdx] = newAccessTokenSet;
    } else {
        session.accessTokens.push(newAccessTokenSet);
    }
    // Update refresh token if a new one was issued
    if (oidcRes.refresh_token) {
        session.tokenSet.refreshToken = oidcRes.refresh_token;
    }
    // Update id token and user claims if new ones were issued
    if (oidcRes.id_token) {
        session.tokenSet.idToken = oidcRes.id_token;
        if (idTokenClaims) {
            session.user = {
                ...session.user,
                ...idTokenClaims
            };
        }
    }
}
function buildSessionFromCallback(idTokenClaims, oidcRes, transactionState) {
    // Reject non-positive values (0, negatives), millisecond timestamps (13+ digits),
    // NaN, Infinity, and non-numbers — all fall open to "no ceiling."
    const rawExpiry = idTokenClaims.session_expiry;
    const sessionExpiresAt = typeof rawExpiry === "number" && rawExpiry > 0 && rawExpiry < 10_000_000_000 ? rawExpiry : undefined;
    return {
        user: idTokenClaims,
        tokenSet: {
            accessToken: oidcRes.access_token,
            idToken: oidcRes.id_token,
            scope: oidcRes.scope,
            requestedScope: transactionState.scope,
            audience: transactionState.audience,
            refreshToken: oidcRes.refresh_token,
            expiresAt: Math.floor(Date.now() / 1000) + Number(oidcRes.expires_in)
        },
        internal: {
            sid: idTokenClaims.sid,
            createdAt: Math.floor(Date.now() / 1000),
            ...sessionExpiresAt !== undefined && {
                sessionExpiresAt
            }
        }
    };
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/session-transfer-helpers.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildSessionTransferAudience",
    ()=>buildSessionTransferAudience,
    "buildSessionTransferRedirectUrl",
    ()=>buildSessionTransferRedirectUrl,
    "mapSttServerError",
    ()=>mapSttServerError,
    "parseSessionTransferTokenResponse",
    ()=>parseSessionTransferTokenResponse,
    "resolveActorFromSession",
    ()=>resolveActorFromSession
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$decode_jwt$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/jose/dist/webapi/util/decode_jwt.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/errors/oauth-errors.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$types$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/types/index.js [middleware] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$types$2f$token$2d$vault$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@auth0/nextjs-auth0/dist/types/token-vault.js [middleware] (ecmascript)");
;
;
;
function buildSessionTransferAudience(domain) {
    return `urn:${domain}:session_transfer`;
}
function resolveActorFromSession(session, explicitActor) {
    if (explicitActor) {
        if (!explicitActor.token || explicitActor.token.trim() === "") {
            return [
                new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeError"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeErrorCode"].ACTOR_UNAVAILABLE, "The explicit actor token is empty."),
                null
            ];
        }
        return [
            null,
            {
                token: explicitActor.token,
                type: explicitActor.type
            }
        ];
    }
    const idToken = session?.tokenSet?.idToken;
    if (!idToken) {
        return [
            new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeError"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeErrorCode"].ACTOR_UNAVAILABLE, "No actor could be resolved: no explicit actor was provided and the agent session has no ID token. " + "Ensure the agent is authenticated, or pass an explicit actor."),
            null
        ];
    }
    // Guard against expired ID tokens — the server validates exp on the actor_token
    // and rejects with "Invalid actor token: 'exp' claim timestamp check failed".
    try {
        const { exp } = __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$decode_jwt$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["decodeJwt"](idToken);
        if (typeof exp === "number" && exp < Math.floor(Date.now() / 1000)) {
            return [
                new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeError"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeErrorCode"].ACTOR_UNAVAILABLE, "The agent session ID token has expired. Refresh the session before requesting a Session Transfer Token, " + "or pass a fresh actor token explicitly."),
                null
            ];
        }
    } catch  {
        return [
            new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeError"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeErrorCode"].ACTOR_UNAVAILABLE, "The agent session ID token could not be decoded."),
            null
        ];
    }
    return [
        null,
        {
            token: idToken,
            type: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$types$2f$token$2d$vault$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["TOKEN_TYPES"].ID_TOKEN
        }
    ];
}
function buildSessionTransferRedirectUrl(targetLoginUrl, sessionTransferToken, opts) {
    let url;
    try {
        url = new URL(targetLoginUrl);
    } catch  {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeError"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeErrorCode"].EXCHANGE_FAILED, `Invalid targetLoginUrl: "${targetLoginUrl}" is not an absolute URL. ` + "Pass a trusted, app-controlled absolute login URL (e.g. https://app.example.com/auth/login).");
    }
    const isLocalhost = url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "[::1]";
    if (url.protocol !== "https:" && !(url.protocol === "http:" && isLocalhost)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeError"](__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeErrorCode"].EXCHANGE_FAILED, `Invalid targetLoginUrl: "${targetLoginUrl}" must use https (or http for localhost).`);
    }
    url.searchParams.set("session_transfer_token", sessionTransferToken);
    if (opts?.organization) {
        url.searchParams.set("organization", opts.organization);
    }
    return url.toString();
}
function parseSessionTransferTokenResponse(raw) {
    return {
        sessionTransferToken: raw.access_token,
        issuedTokenType: raw.issued_token_type,
        expiresIn: raw.expires_in !== undefined ? Number(raw.expires_in) : undefined,
        tokenType: raw.token_type
    };
}
function mapSttServerError(errorCode) {
    const code = errorCode.toLowerCase();
    if (code === "setactor_required") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeErrorCode"].SETACTOR_REQUIRED;
    }
    if (code === "session_transfer_disabled") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$auth0$2f$nextjs$2d$auth0$2f$dist$2f$errors$2f$oauth$2d$errors$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["CustomTokenExchangeErrorCode"].SESSION_TRANSFER_DISABLED;
    }
    return null;
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/token-set-helpers.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Normalizes oauth4webapi's lowercase token_type to canonical OAuth casing.
 * oauth4webapi returns token types in lowercase; consumers expect "Bearer" or "DPoP".
 */ __turbopack_context__.s([
    "accessTokenSetFromTokenSet",
    ()=>accessTokenSetFromTokenSet,
    "compareScopes",
    ()=>compareScopes,
    "findAccessTokenSet",
    ()=>findAccessTokenSet,
    "isBeforeOrEqual",
    ()=>isBeforeOrEqual,
    "mergeScopes",
    ()=>mergeScopes,
    "normalizeExpiresAt",
    ()=>normalizeExpiresAt,
    "normalizeTokenType",
    ()=>normalizeTokenType,
    "tokenSetFromAccessTokenSet",
    ()=>tokenSetFromAccessTokenSet
]);
function normalizeTokenType(tokenType) {
    if (!tokenType) return "Bearer";
    const lower = tokenType.toLowerCase();
    if (lower === "dpop") return "DPoP";
    if (lower === "bearer") return "Bearer";
    return tokenType.charAt(0).toUpperCase() + tokenType.slice(1);
}
function normalizeExpiresAt(value) {
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : undefined;
    }
    if (typeof value === "string") {
        if (value.trim() === "") {
            return undefined;
        }
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : undefined;
    }
    return undefined;
}
function isBeforeOrEqual(left, right) {
    const normalized = normalizeExpiresAt(left);
    return normalized !== undefined && normalized <= right;
}
function accessTokenSetFromTokenSet(tokenSet, options) {
    return {
        accessToken: tokenSet.accessToken,
        expiresAt: tokenSet.expiresAt,
        audience: options.audience,
        scope: tokenSet.scope,
        requestedScope: tokenSet.requestedScope,
        ...tokenSet.token_type && {
            token_type: tokenSet.token_type
        }
    };
}
function tokenSetFromAccessTokenSet(accessTokenSet, tokenSet) {
    return {
        ...tokenSet,
        accessToken: accessTokenSet?.accessToken,
        expiresAt: accessTokenSet?.expiresAt,
        scope: accessTokenSet?.scope,
        requestedScope: accessTokenSet?.requestedScope,
        audience: accessTokenSet?.audience,
        ...accessTokenSet?.token_type && {
            token_type: accessTokenSet.token_type
        }
    };
}
/**
 * Parses a scope string into an array of individual scopes, filtering out empty strings.
 * @param scopes Space-separated scope string
 * @returns Array of scope strings
 */ function parseScopesToArray(scopes) {
    if (!scopes) return [];
    return scopes.trim().split(" ").filter(Boolean);
}
const compareScopes = (scopes, requiredScopes, options = {})=>{
    // When the scopes and requiredScopes are exactly the same, return true
    if (scopes === requiredScopes) {
        return true;
    }
    if (!scopes || !requiredScopes) {
        return false;
    }
    const scopesSet = new Set(parseScopesToArray(scopes));
    const requiredScopesSet = new Set(parseScopesToArray(requiredScopes));
    const requiredScopesArray = Array.from(requiredScopesSet);
    const hasAllRequiredScopes = requiredScopesArray.every((scope)=>scopesSet.has(scope));
    if (options.strict) {
        return hasAllRequiredScopes && scopesSet.size === requiredScopesSet.size;
    }
    return hasAllRequiredScopes;
};
function mergeScopes(scopes1, scopes2) {
    const scopes1Array = scopes1 ? parseScopesToArray(scopes1) : [];
    const scopes2Array = scopes2 ? parseScopesToArray(scopes2) : [];
    // Use a Set to remove duplicates
    const uniqueScopes = new Set([
        ...scopes1Array,
        ...scopes2Array
    ]);
    // Convert back to array and join as a space-separated string
    return Array.from(uniqueScopes).join(" ");
}
function findAccessTokenSet(sessionData, options) {
    const matchMode = options.matchMode ?? "requestedScope";
    const accessTokenSets = sessionData?.accessTokens;
    // 1. When there are no access tokens, we can exit early.
    if (!accessTokenSets || accessTokenSets.length === 0) {
        return;
    }
    // 2. Filter the list to find all AccessTokenSet's that are valid matches.
    // A valid match's audience must match the provided `options.audience`,
    // and its scope must contain all items from `options.scope`.
    const allMatches = accessTokenSets.filter((accessTokenSet)=>{
        return accessTokenSet.audience === options.audience && compareScopes(matchMode === "scope" ? accessTokenSet.scope : accessTokenSet.requestedScope ?? accessTokenSet.scope, options.scope, {
            strict: matchMode === "scope"
        });
    });
    // If no potential matches were found, we can exit early.
    if (allMatches.length === 0) {
        return;
    }
    // 3. Sort the valid matches to find the best one.
    // The best match is the one with the smallest scope array, as it has the fewest
    // extra permissions. An exact match will naturally be sorted first.
    // This also works for null/undefined scopes, as they would have been matched
    // against a null/undefined `options.scope` and will all be equally valid.
    // Note: This sorting algorithm also takes care of duplicate scopes, as they will
    // be converted to a Set and thus have the same size as a non-duplicate scope array.
    allMatches.sort((a, b)=>{
        const aScopesUnique = new Set(parseScopesToArray(a.scope));
        const bScopesUnique = new Set(parseScopesToArray(b.scope));
        return aScopesUnique.size - bScopesUnique.size;
    });
    // The first item in the sorted list is the best possible match.
    return allMatches[0];
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/url-helpers.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isUrl",
    ()=>isUrl,
    "toSafeRedirect",
    ()=>toSafeRedirect
]);
function toSafeRedirect(dangerousRedirect, safeBaseUrl) {
    let url;
    try {
        url = new URL(dangerousRedirect, safeBaseUrl);
    } catch (e) {
        return undefined;
    }
    if (url.origin === safeBaseUrl.origin) {
        return url;
    }
    return undefined;
}
function isUrl(url) {
    try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch  {
        return false;
    }
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/dist/utils/webfingerCache.js [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "_clearWebFingerCacheForTesting",
    ()=>_clearWebFingerCacheForTesting,
    "isFederatedDomain",
    ()=>isFederatedDomain
]);
/**
 * Enterprise Connect domain discovery.
 *
 * Wraps Auth0's WebFinger endpoint (RFC 7033) to determine whether an email
 * domain is managed for enterprise SSO on a tenant, with a short-lived TTL
 * cache to stay well inside the endpoint's rate limits.
 */ const _cache = new Map();
// Prevent unbounded memory growth in multi-tenant deployments where many
// distinct domains are checked. FIFO eviction — oldest entry removed first.
const CACHE_MAX_SIZE = 1_000;
/**
 * TTL for a positive result. Matches the server's `Cache-Control` for
 * managed domains. A removed domain can appear federated for up to this
 * long, which is safe: the user is routed to Auth0 where the actual
 * authentication fails cleanly.
 */ const TTL_TRUE_MS = 60_000;
/**
 * TTL for a negative result. Kept short so newly configured domains are
 * picked up quickly during customer onboarding.
 */ const TTL_FALSE_MS = 15_000;
const OIDC_REL = "http://openid.net/specs/connect/1.0/issuer";
function setCacheEntry(key, result, ttlMs) {
    if (_cache.size >= CACHE_MAX_SIZE) {
        _cache.delete(_cache.keys().next().value);
    }
    _cache.set(key, {
        result,
        expiresAt: Date.now() + ttlMs
    });
}
async function isFederatedDomain(auth0Domain, emailDomain, options) {
    const { customFetch = fetch, timeoutMs = 5000 } = options ?? {};
    // The server lowercases the domain before lookup, so normalize here too —
    // otherwise "Acme.com" and "acme.com" would occupy separate cache entries
    // for what is a single server-side result.
    const normalizedDomain = emailDomain.toLowerCase();
    const key = `${auth0Domain}:${normalizedDomain}`;
    const cached = _cache.get(key);
    if (cached !== undefined) {
        if (Date.now() < cached.expiresAt) {
            return cached.result;
        }
        _cache.delete(key);
    }
    try {
        const res = await customFetch(`https://${auth0Domain}/.well-known/webfinger` + `?resource=urn:auth0:discovery:domain:${encodeURIComponent(normalizedDomain)}` + `&rel=${OIDC_REL}`, {
            signal: AbortSignal.timeout(timeoutMs)
        });
        if (res.ok) {
            setCacheEntry(key, true, TTL_TRUE_MS);
            return true;
        }
        if (res.status === 404) {
            res.body?.cancel();
            setCacheEntry(key, false, TTL_FALSE_MS);
            return false;
        }
        if (res.status === 429) {
            res.body?.cancel();
            // Rate limited. Not cached — caching would extend the outage past the
            // limit window. The TTLs above are the primary defense against this;
            // hitting 429 means the cache missed (cold start, or many distinct
            // domains at once). Warn so this is not a silent SSO bypass.
            console.warn("[Auth0] isFederatedDomain: rate limit hit (429). Enterprise SSO routing " + "is temporarily unavailable and users on federated domains will fall " + "through to your default login. Check x-ratelimit-reset for retry timing.");
            return false;
        }
        // 403 means the endpoint is disabled for the tenant; 5xx is a server fault.
        // Neither is cached — both can be fixed without a client deploy.
        res.body?.cancel();
    } catch  {
    // Network failure or malformed JSON. Never cached.
    }
    return false;
}
function _clearWebFingerCacheForTesting() {
    _cache.clear();
}
}),
"[project]/web/node_modules/@auth0/nextjs-auth0/package.json.[json].mjs [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
"use turbopack: no side effects";
const __TURBOPACK__default__export__ = {
    "name": "@auth0/nextjs-auth0",
    "version": "4.31.1",
    "description": "Auth0 Next.js SDK",
    "type": "module",
    "scripts": {
        "build": "tsc",
        "build:watch": "tsc -w",
        "test:unit": "vitest --run",
        "test:coverage": "vitest run --run --coverage",
        "test:e2e": "playwright test",
        "prepack": "pnpm run build",
        "install:examples": "pnpm install --filter ./examples/with-next-intl --shamefully-hoist && pnpm install --filter ./examples/with-shadcn --shamefully-hoist",
        "docs": "typedoc",
        "lint": "tsc --noEmit && tsc --noEmit --project tsconfig.test.json && eslint ./src",
        "lint:fix": "tsc --noEmit && tsc --noEmit --project tsconfig.test.json && eslint --fix ./src",
        "prepare": "lefthook install"
    },
    "repository": {
        "type": "git",
        "url": "git+https://github.com/auth0/nextjs-auth0.git"
    },
    "keywords": [
        "auth0",
        "next.js",
        "react",
        "oidc",
        "authentication",
        "vercel"
    ],
    "author": "Auth0 (https://auth0.com)",
    "license": "MIT",
    "bugs": {
        "url": "https://github.com/auth0/nextjs-auth0/issues"
    },
    "homepage": "https://github.com/auth0/nextjs-auth0#readme",
    "devDependencies": {
        "@eslint/js": "^9.39.4",
        "@evilmartians/lefthook": "^1.10.10",
        "@ianvs/prettier-plugin-sort-imports": "^4.3.1",
        "@playwright/test": "^1.48.2",
        "@stylistic/eslint-plugin-ts": "^3.1.0",
        "@testing-library/react": "^16.3.0",
        "@types/node": "^22.8.6",
        "@types/react": "*",
        "@types/react-dom": "*",
        "@vitest/coverage-v8": "^4.1.11",
        "eslint": "^9.39.4",
        "eslint-config-prettier": "10.1.8",
        "eslint-plugin-prettier": "5.5.6",
        "eslint-plugin-react": "^7.37.4",
        "globals": "^15.14.0",
        "jsdom": "^26.1.0",
        "msw": "^2.7.5",
        "next": "15.5.27",
        "prettier": "^3.9.1",
        "typedoc": "^0.28.4",
        "typescript": "~5.9.3",
        "typescript-eslint": "^8.23.0",
        "vite": "^6.4.2",
        "vitest": "^4.1.11"
    },
    "peerDependencies": {
        "next": "^14.2.35 || ~15.0.7 || ~15.1.11 || ~15.2.8 || ~15.3.8 || ~15.4.10 || ~15.5.9 || ^16.0.10",
        "react": "^18.0.0 || ~19.0.1 ||  ~19.1.2 || ^19.2.1",
        "react-dom": "^18.0.0 || ~19.0.1 || ~19.1.2 || ^19.2.1"
    },
    "exports": {
        ".": {
            "default": "./dist/client/index.js"
        },
        "./client": {
            "default": "./dist/client/index.js"
        },
        "./server": {
            "default": "./dist/server/index.js"
        },
        "./errors": {
            "default": "./dist/errors/index.js"
        },
        "./types": {
            "default": "./dist/types/index.d.ts"
        },
        "./testing": {
            "default": "./dist/testing/index.js"
        }
    },
    "dependencies": {
        "@edge-runtime/cookies": "^5.0.1",
        "@panva/hkdf": "^1.2.1",
        "jose": "^6.0.11",
        "oauth4webapi": "^3.8.2",
        "openid-client": "^6.8.0",
        "swr": "^2.2.5"
    },
    "publishConfig": {
        "access": "public"
    },
    "typesVersions": {
        "*": {
            "testing": [
                "./dist/testing/index.d.ts"
            ],
            "types": [
                "./dist/types/index.d.ts"
            ],
            "server": [
                "./dist/server/index.d.ts"
            ],
            "errors": [
                "./dist/errors/index.d.ts"
            ],
            "*": [
                "./dist/client/*",
                "./dist/client/index.d.ts"
            ]
        }
    },
    "files": [
        "dist",
        "skills",
        "guides",
        "AGENTS.md"
    ]
};
}),
];})()

//# sourceMappingURL=0aq__%40auth0_nextjs-auth0_192ld__z8txlc._.js.map