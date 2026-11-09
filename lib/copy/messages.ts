export const messages = {
  "site.name": "Imbewenhle Digital Solutions Hub",
  "nav.services": "Services",
  "nav.signIn": "Sign in",
  "skip.link": "Skip to content",
  "page.loading": "Loading…",

  "landing.valueProposition": "Describe your technology needs and follow your enquiry through to delivery.",
  "landing.summary": "Submit a service enquiry, follow its status and view agreed project information in one place.",
  "landing.services.heading": "Services",
  "landing.process.heading": "How it works",
  "landing.process.enquire": "Submit a service enquiry",
  "landing.process.review": "A consultant reviews your enquiry and clarifies requirements",
  "landing.process.propose": "Review your proposal",
  "landing.process.deliver": "Follow milestones through delivery",
  "landing.enquiryAction": "Start an enquiry",

  "service.title.digital-it-advisory": "Digital & IT Advisory",
  "service.title.automation": "Automation",
  "service.title.systems-integration": "Systems Integration",
  "service.title.migration": "Migration",
  "service.title.systems-software-development": "Systems & Software Development",
  "service.title.technical-solutions-support": "Technical Solutions & Support",

  "form.required": "*",
  "form.counter": "{count} of {max} characters",
  "form.name.required": "Enter your name.",
  "form.name.length": "Your name must be between 2 and 100 characters.",
  "form.organisation.required": "Enter your organisation's name.",
  "form.organisation.length": "Your organisation's name must be between 2 and 150 characters.",
  "form.email.required": "Enter your email address.",
  "form.email.format": "Enter an email address in the correct format, like name@example.com.",
  "form.category.required": "Choose a service.",
  "form.problem.tooShort": "Describe the problem in at least 30 characters.",
  "form.problem.tooLong": "The problem description must be 3,000 characters or fewer.",
  "form.outcome.tooShort": "Describe the outcome you want in at least 10 characters.",
  "form.outcome.tooLong": "The desired outcome must be 1,000 characters or fewer.",
  "form.urgency.required": "Choose how urgent this is.",
  "form.errorSummary": "There is a problem. Check the fields marked below.",

  "submit.failed": "Your enquiry was not submitted. Your answers have been kept, so you can try again.",
  "submit.rateLimited": "You have sent several enquiries in the last hour. Please try again later.",
  "submit.button": "Submit enquiry",
  "submit.buttonBusy": "Submitting…",

  "privacy.explanation":
    "We use these details only to respond to your enquiry and deliver any agreed work. We keep them for up to 24 months after your enquiry is closed.",
  "privacy.link": "Read our privacy notice",

  "confirm.heading": "Enquiry received",
  "confirm.reference": "Your reference is {reference}. Keep it for your records.",
  "confirm.next1": "A consultant will review your enquiry within 2 business days.",
  "confirm.next2": "To follow its progress, sign in with {email}.",
  "confirm.return": "Back to home",

  "category.unavailable": "This service is no longer available. Choose another service.",

  "signin.intro": "Enter your email address and we'll send you a sign-in link.",
  "signin.button": "Send sign-in link",
  "signin.sent": "Check your email for a sign-in link. It expires in 1 hour.",
  "signin.expired": "This sign-in link has expired or was already used. Request a new one.",

  "dashboard.empty": "You have no enquiries yet.",
  "dashboard.emptyAction": "Start an enquiry",

  "detail.noUpdates": "No updates yet.",
  "detail.noProposal": "No proposal has been shared yet.",
  "detail.noMilestones": "No milestones yet.",
  "detail.awaitingClient": "We need more information from you. Reply below.",

  "reply.button": "Send reply",
  "reply.sent": "Reply sent.",

  "queue.empty": "There are no enquiries yet.",
  "queue.noResults": "No enquiries match these filters.",
  "queue.clearFilters": "Clear filters",

  "status.saved": "Status updated.",
  "status.invalidTransition": "That status change isn't allowed from {status}.",
  "status.needsAcceptedProposal": "Record the proposal as accepted before marking the enquiry Accepted.",

  "update.posted": "Update posted.",
  "note.saved": "Internal note saved.",
  "note.label": "Internal note (not visible to the client)",
  "proposal.saved": "Proposal saved.",
  "milestone.saved": "Milestone saved.",
  "milestone.locked": "Milestones can be added once the engagement is accepted.",
  "category.saved": "Service saved.",
  "role.saved": "Role updated.",
  "role.lastAdmin": "You can't remove the last administrator.",

  "error.notFound": "We couldn't find that enquiry.",
  "error.forbidden": "You don't have permission to do that.",
  "error.load": "Something went wrong loading this page.",
  "error.retry": "Try again",
  "error.offline": "You appear to be offline. Check your connection and try again.",

  "status.label.new": "New",
  "status.label.under_review": "Under Review",
  "status.label.awaiting_client": "Awaiting Client",
  "status.label.proposal_prepared": "Proposal Prepared",
  "status.label.accepted": "Accepted",
  "status.label.in_delivery": "In Delivery",
  "status.label.completed": "Completed",
  "status.label.closed": "Closed",

  "urgency.label.low": "Low",
  "urgency.label.medium": "Medium",
  "urgency.label.high": "High",

  "budget.label.under_50k": "Under R50 000",
  "budget.label.50k_150k": "R50 000 – R150 000",
  "budget.label.150k_500k": "R150 000 – R500 000",
  "budget.label.over_500k": "Over R500 000",
  "budget.label.not_sure": "Not sure yet",

  "decision.label.draft": "Draft",
  "decision.label.shared": "Shared with client",
  "decision.label.accepted": "Accepted",
  "decision.label.declined": "Declined",

  "milestone.label.planned": "Planned",
  "milestone.label.in_progress": "In progress",
  "milestone.label.completed": "Completed",
} as const;

export type MessageKey = keyof typeof messages;

export function formatMessage(key: MessageKey, values: Record<string, string | number>): string {
  return Object.entries(values).reduce<string>(
    (text, [name, value]) => text.replace(`{${name}}`, String(value)),
    messages[key],
  );
}
