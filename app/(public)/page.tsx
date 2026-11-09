import { Suspense } from "react";
import { buttonClasses } from "@/components/Button";
import { PageState } from "@/components/PageState";
import { CatalogueServices } from "@/features/catalogue/CatalogueServices";
import { formatMessage, messages, type MessageKey } from "@/lib/copy/messages";

type Stage = { title: MessageKey; body: MessageKey; detail?: MessageKey };

const stages: Stage[] = [
  { title: "landing.process.step1.title", body: "landing.process.step1.body" },
  {
    title: "landing.process.step2.title",
    body: "landing.process.step2.body",
    detail: "landing.process.step2.detail",
  },
  {
    title: "landing.process.step3.title",
    body: "landing.process.step3.body",
    detail: "landing.process.step3.detail",
  },
];

const eyebrowClasses = "text-xs font-semibold text-primary-hover";

export default function LandingPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-9 px-4 py-9">
      <section className="flex flex-col gap-4">
        <p className={eyebrowClasses}>{messages["landing.eyebrow"]}</p>
        <h1 className="text-2xl md:text-3xl">{messages["landing.valueProposition"]}</h1>
        <p className="text-base text-text-muted">{messages["landing.summary"]}</p>
        <div className="flex flex-col gap-3 md:flex-row">
          <a href="#services" className={buttonClasses("primary")}>
            {messages["landing.enquiryAction"]}
            <span aria-hidden="true">→</span>
          </a>
          <a href="#process" className={buttonClasses("secondary")}>
            {messages["landing.protocolAction"]}
          </a>
        </div>
      </section>

      <section id="services" className="flex flex-col gap-5">
        <div>
          <p className={eyebrowClasses}>{messages["landing.services.eyebrow"]}</p>
          <h2 className="text-xl">{messages["landing.services.heading"]}</h2>
        </div>
        <Suspense fallback={<PageState state="loading" />}>
          <CatalogueServices />
        </Suspense>
      </section>

      <section id="process" className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <p className={eyebrowClasses}>{messages["landing.process.eyebrow"]}</p>
          <h2 className="text-xl">{messages["landing.process.heading"]}</h2>
          <p className="text-sm text-text-muted">{messages["landing.process.intro"]}</p>
        </div>
        <ol className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {stages.map(({ title, body, detail }, index) => (
            <li key={title} className="flex gap-4 rounded-lg bg-surface p-5">
              <span
                aria-hidden="true"
                className="flex size-9 shrink-0 items-center justify-center rounded-md bg-text text-sm font-semibold text-background"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-text-muted">
                  {formatMessage("landing.process.stage", { number: index + 1 })}
                </p>
                <h3 className="text-lg">{messages[title]}</h3>
                <p className="text-sm text-text-muted">{messages[body]}</p>
                {detail && <p className="text-sm font-semibold">{messages[detail]}</p>}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
