import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

type BackendRole = "ADMIN" | "COACH" | "PLAYER" | "MANAGER";

const AUTH_PATH_PREFIX = "/auth";
const DASHBOARD_PATH_PREFIX = "/dashboard";
const TOURNAMENT_REGISTRATION_PATH_PREFIX = "/tournament-registration";

function isBackendRole(value: string | undefined): value is BackendRole {
  return (
    value === "ADMIN" ||
    value === "COACH" ||
    value === "PLAYER" ||
    value === "MANAGER"
  );
}

function getTokenRole(token: string | undefined): BackendRole | null {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = payload.padEnd(
      payload.length + ((4 - (payload.length % 4)) % 4),
      "=",
    );
    const decoded = JSON.parse(atob(paddedPayload)) as {
      role?: string;
      user?: { role?: string };
      data?: { role?: string };
    };

    const role = decoded.role ?? decoded.user?.role ?? decoded.data?.role;

    return isBackendRole(role) ? role : null;
  } catch {
    return null;
  }
}

function getRequestRole(request: NextRequest) {
  const cookieRole = request.cookies.get("role")?.value;

  if (isBackendRole(cookieRole)) {
    return cookieRole;
  }

  return getTokenRole(request.cookies.get("token")?.value);
}

function getDashboardPath(role: BackendRole | null) {
  switch (role) {
    case "ADMIN":
      return "/dashboard/admin";
    case "PLAYER":
      return "/dashboard/player";
    case "COACH":
    case "MANAGER":
      return "/dashboard/coach";
    default:
      return "/auth/signin";
  }
}

function isAuthPage(pathname: string) {
  return pathname.startsWith(AUTH_PATH_PREFIX);
}

function isDashboardPage(pathname: string) {
  return (
    pathname === DASHBOARD_PATH_PREFIX ||
    pathname.startsWith(`${DASHBOARD_PATH_PREFIX}/`)
  );
}

function isTournamentRegistrationPage(pathname: string) {
  return (
    pathname === TOURNAMENT_REGISTRATION_PATH_PREFIX ||
    pathname.startsWith(`${TOURNAMENT_REGISTRATION_PATH_PREFIX}/`)
  );
}

function isAllowedDashboardPath(pathname: string, role: BackendRole | null) {
  if (!isDashboardPage(pathname) || !role) return false;

  if (pathname === DASHBOARD_PATH_PREFIX) {
    return true;
  }

  if (role === "ADMIN") {
    return pathname.startsWith("/dashboard/admin");
  }

  if (role === "PLAYER") {
    return pathname.startsWith("/dashboard/player");
  }

  return pathname.startsWith("/dashboard/coach");
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = getRequestRole(request);

  if (isTournamentRegistrationPage(pathname)) {
    if (!role) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/auth/signin";
      redirectUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    if (role !== "COACH" && role !== "MANAGER") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = getDashboardPath(role);
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
  }

  if (isDashboardPage(pathname)) {
    if (!role) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/auth/signin";
      redirectUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    if (pathname === DASHBOARD_PATH_PREFIX) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = getDashboardPath(role);
      return NextResponse.redirect(redirectUrl);
    }

    if (!isAllowedDashboardPath(pathname, role)) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = getDashboardPath(role);
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
  }

  if (isAuthPage(pathname) && role) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = getDashboardPath(role);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
