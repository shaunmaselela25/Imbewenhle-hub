export const enquiryStatuses = [
  "new",
  "under_review",
  "awaiting_client",
  "proposal_prepared",
  "accepted",
  "in_delivery",
  "completed",
  "closed",
] as const;

export type EnquiryStatus = (typeof enquiryStatuses)[number];
