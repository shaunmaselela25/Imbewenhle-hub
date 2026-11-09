export type Role = "client" | "consultant" | "admin";

export const isStaff = (role: Role) => role === "consultant" || role === "admin";

export const homeFor = (role: Role) => (isStaff(role) ? "/staff" : "/dashboard");

const isWithin = (pathname: string, section: string) =>
  pathname === section || pathname.startsWith(`${section}/`);

// Section 11. `path` may include the query string, which is kept for the return trip.
export function routeRedirect(path: string, role: Role | null): string | null {
  const pathname = path.split("?")[0];
  const isDashboard = isWithin(pathname, "/dashboard");
  const isStaffArea = isWithin(pathname, "/staff");

  if (!role) {
    return isDashboard || isStaffArea ? `/sign-in?next=${encodeURIComponent(path)}` : null;
  }

  if (pathname === "/sign-in") return homeFor(role);
  if (isDashboard && isStaff(role)) return "/staff";
  if (isStaffArea && !isStaff(role)) return "/dashboard";
  if (isWithin(pathname, "/staff/admin") && role !== "admin") return "/staff";
  return null;
}

export function safeNext(next: string | null | undefined): string | null {
  return next && /^\/(?![/\\])/.test(next) ? next : null;
}
