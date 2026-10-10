import { NextResponse, type NextRequest } from "next/server";
import { auth0, authSetupProblem } from "@/lib/auth0";

/**
 * Runs before every page request. Auth0 uses it to serve the sign-in routes
 * (/auth/login, /auth/logout, /auth/callback, /auth/profile) and to keep the
 * session cookie fresh.
 */
export async function proxy(request: NextRequest) {
  if (auth0) return auth0.middleware(request);

  // Auth0 is not set up on this machine. The site still works, without sign-in.
  const { pathname } = request.nextUrl;
  if (pathname === "/auth/profile") {
    return new NextResponse(null, { status: 204 }); // same reply as "nobody is signed in"
  }
  if (pathname.startsWith("/auth/")) {
    return new NextResponse(`Sign-in is not set up yet. ${authSetupProblem} See web-next/README.md.`, { status: 503 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
