import { Auth0Client } from "@auth0/nextjs-auth0/server";

const REQUIRED = ["AUTH0_DOMAIN", "AUTH0_CLIENT_ID", "AUTH0_CLIENT_SECRET", "AUTH0_SECRET"] as const;

function createClient(): { client: Auth0Client | null; problem: string | null } {
  const missing = REQUIRED.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    return { client: null, problem: `Add ${missing.join(", ")} to web-next/.env.local.` };
  }
  try {
    return {
      client: new Auth0Client({
        // Signed-out visitors get an empty reply from /auth/profile instead of an error.
        noContentProfileResponseWhenUnauthenticated: true,
      }),
      problem: null,
    };
  } catch (error) {
    // For example AUTH0_DOMAIN with a port or a path in it.
    const reason = error instanceof Error ? error.message : String(error);
    return { client: null, problem: `Check the Auth0 settings in web-next/.env.local. ${reason}` };
  }
}

const created = createClient();

/**
 * The Auth0 client, or null until the settings are filled in correctly.
 * Keeping it null lets the rest of the site run for teammates who have not
 * set up Auth0 yet.
 */
export const auth0 = created.client;

/** Why sign-in is unavailable, in plain words. Null when it is ready. */
export const authSetupProblem = created.problem;
