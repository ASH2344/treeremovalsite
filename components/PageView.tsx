import siteConfig from "@/site.config";
import type { PageContent, Section } from "@/lib/content";
import { AREA_NAV, SERVICE_NAV, getPageDef } from "@/lib/pages";
import { breadcrumbSchema, faqSchema, organizationSchema, serviceSchema } from "@/lib/seo";
import Breadcrumbs from "./Breadcrumbs";
import ContactForm from "./ContactForm";
import Faq from "./Faq";
import JsonLd from "./JsonLd";
import PhoneButton, { QuoteButton } from "./PhoneButton";
import Picture from "./Picture";
import { ArrowRight } from "./Icons";

const KIND_LABEL = { home: "", service: "Tree Service", area: "Service Area", guide: "Homeowner Guide", contact: "Free Quote" };

/** Card title -> service page (for linking cards + choosing card images) */
function serviceForCard(title: string) {
  const t = title.toLowerCase();
  if (t.includes("emergency")) return SERVICE_NAV.find((s) => s.url === "/emergency-tree-removal/");
  if (t.includes("trim")) return SERVICE_NAV.find((s) => s.url === "/tree-trimming/");
  if (t.includes("stump")) return SERVICE_NAV.find((s) => s.url === "/stump-grinding/");
  if (t.includes("clearing")) return SERVICE_NAV.find((s) => s.url === "/land-clearing/");
  if (t.includes("removal")) return SERVICE_NAV.find((s) => s.url === "/tree-removal/");
  return undefined;
}

function SectionHeading({ children, id }: { children: React.ReactNode; id: string }) {
  return (
    <h2 id={id} className="scroll-mt-24 font-display text-3xl font-bold leading-tight text-forest-800 sm:text-[2.1rem]">
      <span className="mb-2 block h-1 w-10 rounded bg-bark-500" aria-hidden="true" />
      {children}
    </h2>
  );
}

function Cards({ section, withImages }: { section: Section; withImages: boolean }) {
  return (
    <ul className={`mt-6 grid gap-4 sm:grid-cols-2 ${withImages ? "lg:grid-cols-3" : ""}`}>
      {section.cards!.map((c) => {
        const svc = serviceForCard(c.title);
        return (
          <li key={c.title} className="group flex flex-col overflow-hidden rounded-2xl border border-forest-100 bg-white shadow-sm transition-shadow hover:shadow-md">
            {withImages && svc && (
              <Picture name={svc.image} sizes="(min-width:1024px) 360px, (min-width:640px) 50vw, 100vw" className="aspect-[16/10] w-full object-cover" />
            )}
            <div className="flex flex-1 flex-col p-5">
              <h3 className="font-display text-xl font-bold text-forest-800">
                {svc ? (
                  <a href={svc.url} className="hover:text-bark-600">
                    {c.title}
                  </a>
                ) : (
                  c.title
                )}
              </h3>
              <p className="prose-copy mt-2 !text-base [&_a]:!no-underline [&_a]:inline-flex [&_a]:items-center" dangerouslySetInnerHTML={{ __html: c.html }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function SectionBody({ section, withImages = false }: { section: Section; withImages?: boolean }) {
  if (section.isFaq && section.faqs?.length) return <div className="mt-6"><Faq faqs={section.faqs} /></div>;
  if (section.cards) return <Cards section={section} withImages={withImages} />;
  return <div className="prose-copy mt-5" dangerouslySetInnerHTML={{ __html: section.html }} />;
}

function CtaBand({ section }: { section: Section }) {
  const hasQuote = section.html.includes("btn-quote-inline");
  return (
    <section aria-labelledby={section.id} className="relative overflow-hidden bg-forest-800 text-white">
      <svg className="absolute -right-10 -top-6 h-72 w-72 text-forest-700/60" viewBox="0 0 100 120" fill="currentColor" aria-hidden="true">
        <path d="M50 0 62 22H56l14 22H62l16 26H58v20H42V70H22l16-26h-8l14-22h-6Z" />
      </svg>
      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:py-16">
        <h2 id={section.id} className="max-w-2xl font-display text-3xl font-bold leading-tight sm:text-4xl">
          {section.heading}
        </h2>
        <div className="cta-copy mt-4 max-w-2xl text-lg text-forest-100 [&_.btn-quote-inline]:ml-1" dangerouslySetInnerHTML={{ __html: section.html }} />
        <div className="mt-7 flex flex-wrap gap-3">
          <PhoneButton className="px-6 py-3.5 text-lg" />
          {!hasQuote && <QuoteButton variant="light" className="px-6 py-3.5 text-lg" />}
        </div>
      </div>
    </section>
  );
}

function Sidebar({ currentUrl }: { currentUrl: string }) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 space-y-5">
        <div className="rounded-2xl bg-forest-800 p-6 text-white shadow-lg">
          <p className="font-display text-2xl font-bold leading-tight">Free, upfront quotes</p>
          <p className="mt-2 text-sm text-forest-100">Tell us about the tree. Send a photo if you can.</p>
          <PhoneButton className="mt-5 w-full" />
          <QuoteButton variant="light" className="mt-2.5 w-full" />
        </div>
        <nav aria-label="Services" className="rounded-2xl border border-forest-100 p-5">
          <p className="font-display text-lg font-bold uppercase tracking-wide text-forest-800">Services</p>
          <ul className="mt-2 space-y-1">
            {SERVICE_NAV.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  aria-current={s.url === currentUrl ? "page" : undefined}
                  className="flex items-center justify-between rounded-lg px-2 py-1.5 text-forest-800 hover:bg-forest-50 aria-[current=page]:bg-forest-50 aria-[current=page]:font-bold"
                >
                  {s.label}
                  <ArrowRight className="h-4 w-4 text-bark-500" />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 font-display text-lg font-bold uppercase tracking-wide text-forest-800">Areas</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {AREA_NAV.map((a) => (
              <li key={a.url}>
                <a
                  href={a.url}
                  aria-current={a.url === currentUrl ? "page" : undefined}
                  className="inline-block rounded-full border border-forest-100 px-3 py-1 text-sm text-forest-800 hover:border-forest-600 aria-[current=page]:bg-forest-700 aria-[current=page]:text-white"
                >
                  {a.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}

export default function PageView({ page, successHtml }: { page: PageContent; successHtml?: string }) {
  const def = getPageDef(page.url);
  const isHome = def.kind === "home";
  const isContact = def.kind === "contact";
  const crumbs = [
    { url: "/", label: "Home" },
    { url: page.url, label: def.label },
  ];
  const sections = [...page.sections];
  const cta = !isContact ? sections.pop() : undefined;
  const introHasQuote = page.introHtml.includes("btn-quote-inline");

  const schemas = [
    isHome ? organizationSchema() : breadcrumbSchema(crumbs),
    serviceSchema(page),
    faqSchema(page),
  ].filter(Boolean) as object[];

  return (
    <>
      <JsonLd data={schemas} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-forest-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(146,90,43,0.25),transparent_45%)]" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-10 sm:py-14 lg:grid-cols-[1.15fr_1fr] lg:py-16">
          <div>
            {!isHome && <Breadcrumbs items={crumbs} />}
            {KIND_LABEL[def.kind] && (
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.25em] text-bark-400">{KIND_LABEL[def.kind]}</p>
            )}
            <h1 className={`font-display font-bold leading-[1.05] tracking-tight ${isHome ? "text-5xl sm:text-6xl" : "mt-2 text-4xl sm:text-5xl"}`}>
              {page.h1}
            </h1>
            <div className="hero-copy mt-5 max-w-xl text-lg leading-relaxed text-forest-100" dangerouslySetInnerHTML={{ __html: page.introHtml }} />
            {!introHasQuote && !isContact && (
              <div className="mt-2 flex flex-wrap gap-3">
                <PhoneButton className="px-5 py-3" />
                <QuoteButton variant="light" className="px-5 py-3" />
              </div>
            )}
            {introHasQuote && (
              <div className="mt-2 flex flex-wrap gap-3">
                <PhoneButton className="px-5 py-3 text-lg" />
              </div>
            )}
          </div>
          <div className={`relative mx-auto w-full max-w-xl ${isContact ? "hidden lg:block" : ""}`}>
            <div className="absolute -bottom-2 -right-2 h-full w-full rounded-3xl sm:-bottom-3 sm:-right-3 border-2 border-bark-500/70" aria-hidden="true" />
            <Picture
              name={def.image}
              priority
              sizes="(min-width:1024px) 520px, 92vw"
              className="relative aspect-[4/3] w-full rounded-3xl object-cover shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Body */}
      {isHome ? (
        <div>
          {sections.map((s, i) => (
            <section key={s.id} aria-labelledby={s.id} className={i % 2 === 1 ? "bg-cream" : "bg-white"}>
              <div className={`mx-auto max-w-6xl px-4 py-14 ${s.cards || s.isFaq ? "" : "lg:grid lg:grid-cols-[1fr_1.4fr] lg:gap-12"}`}>
                <SectionHeading id={s.id}>{s.heading}</SectionHeading>
                <div className={s.isFaq ? "max-w-3xl" : ""}>
                  <SectionBody section={s} withImages />
                </div>
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-16">
          <div className="min-w-0 space-y-12">
            {isContact && page.form && (
              <section aria-labelledby="quote-form" className="rounded-3xl border border-forest-100 bg-white p-5 shadow-sm sm:p-8">
                <h2 id="quote-form" className="font-display text-3xl font-bold text-forest-800">
                  Request a Free Quote
                </h2>
                <div className="mt-6">
                  <ContactForm
                    fields={page.form.fields}
                    submitText={page.form.submitText}
                    successHtml={successHtml ?? page.form.successMessage}
                    accessKey={siteConfig.web3formsAccessKey}
                    siteName={siteConfig.name}
                  />
                </div>
              </section>
            )}
            {sections.map((s) => (
              <section key={s.id} aria-labelledby={s.id}>
                <SectionHeading id={s.id}>{s.heading}</SectionHeading>
                <SectionBody section={s} />
              </section>
            ))}
          </div>
          <Sidebar currentUrl={page.url} />
        </div>
      )}

      {cta && <CtaBand section={cta} />}
    </>
  );
}
