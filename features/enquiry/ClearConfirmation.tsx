"use client";

import { useEffect } from "react";

// A plain request rather than a server action: an action that changes a cookie makes
// Next.js re-render this route, which would bounce the visitor off S3 straight away.
export function ClearConfirmation() {
  useEffect(() => {
    void fetch("/enquire/submitted/clear", { method: "POST", keepalive: true });
  }, []);

  return null;
}
