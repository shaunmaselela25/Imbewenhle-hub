import { buttonClasses } from "@/components/Button";
import { messages, type MessageKey } from "@/lib/copy/messages";

const placeholderServices: MessageKey[] = [
  "service.title.digital-it-advisory",
  "service.title.automation",
  "service.title.systems-integration",
  "service.title.migration",
  "service.title.systems-software-development",
  "service.title.technical-solutions-support",
];

const processSteps: MessageKey[] = [
  "landing.process.enquire",
  "landing.process.review",
  "landing.process.propose",
  "landing.process.deliver",
];

export default function LandingPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-9 px-4 py-9">
      <section className="flex flex-col gap-4">
        <h1 className="text-2xl md:text-3xl">{messages["landing.valueProposition"]}</h1>
        <p className="text-lg text-text-muted">{messages["landing.summary"]}</p>
      </section>

      <section id="services" className="flex flex-col gap-5">
        <h2 className="text-xl">{messages["landing.services.heading"]}</h2>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {placeholderServices.map((key) => (
            <li key={key} className="rounded-lg bg-surface p-5 font-semibold">
              {messages[key]}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-5">
        <h2 className="text-xl">{messages["landing.process.heading"]}</h2>
        <ol className="flex list-inside list-decimal flex-col gap-3 text-text-muted">
          {processSteps.map((key) => (
            <li key={key}>{messages[key]}</li>
          ))}
        </ol>
      </section>

      <a href="#services" className={`${buttonClasses("primary")} self-start`}>
        {messages["landing.enquiryAction"]}
      </a>
    </div>
  );
}
