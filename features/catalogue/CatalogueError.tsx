"use client";

import { PageState } from "@/components/PageState";

export function CatalogueError() {
  return <PageState state="error" onRetry={() => window.location.reload()} />;
}
