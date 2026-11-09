"use client";

import { useSyncExternalStore } from "react";
import { PageState } from "./PageState";

function subscribe(onChange: () => void) {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

export function OfflineNotice() {
  const online = useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );

  return online ? null : <PageState state="offline" onRetry={() => window.location.reload()} />;
}
