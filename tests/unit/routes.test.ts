import { describe, expect, it } from "vitest";
import { homeFor, routeRedirect, safeNext } from "@/lib/auth/routes";

describe("Section 11 navigation rules", () => {
  it.each([
    ["/dashboard", null, "/sign-in?next=%2Fdashboard"],
    ["/staff/enquiries/IMB-1", null, "/sign-in?next=%2Fstaff%2Fenquiries%2FIMB-1"],
    ["/", null, null],
    ["/sign-in", null, null],
    ["/enquire/automation", null, null],
    ["/sign-in", "client", "/dashboard"],
    ["/sign-in", "consultant", "/staff"],
    ["/sign-in", "admin", "/staff"],
    ["/staff", "client", "/dashboard"],
    ["/staff/admin/users", "client", "/dashboard"],
    ["/staff/admin/users", "consultant", "/staff"],
    ["/staff/admin/users", "admin", null],
    ["/staff", "consultant", null],
    ["/dashboard", "consultant", "/staff"],
    ["/dashboard", "admin", "/staff"],
    ["/dashboard", "client", null],
    ["/dashboardish", null, null],
    ["/staffroom", "client", null],
  ] as const)("T-NAV-1 %s as %s goes to %s", (pathname, role, expected) => {
    expect(routeRedirect(pathname, role)).toBe(expected);
  });

  it.each([
    ["client", "/dashboard"],
    ["consultant", "/staff"],
    ["admin", "/staff"],
  ] as const)("T-AUTH-2 %s signs in to %s", (role, path) => {
    expect(homeFor(role)).toBe(path);
  });

  it.each([
    ["/dashboard", "/dashboard"],
    ["/dashboard/enquiries/IMB-1?tab=a", "/dashboard/enquiries/IMB-1?tab=a"],
    ["//evil.test", null],
    ["/\\evil.test", null],
    ["https://evil.test", null],
    ["", null],
    [null, null],
  ])("T-AUTH-2 only same-site return paths are kept: %s", (next, expected) => {
    expect(safeNext(next)).toBe(expected);
  });
});
