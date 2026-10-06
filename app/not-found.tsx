import type { Metadata } from "next";
import PhoneButton, { QuoteButton } from "@/components/PhoneButton";
import { SERVICE_NAV } from "@/lib/pages";

export const metadata: Metadata = {
  title: "Page Not Found | Macon Tree Removal Co.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="font-display text-7xl font-bold text-bark-500">404</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-forest-800">This page has been cleared</h1>
        <p className="mt-4 text-lg text-muted">The page you’re looking for doesn’t exist or has moved. Try one of these instead:</p>
        <ul className="mt-8 flex flex-wrap justify-center gap-2">
          <li><a href="/" className="inline-block rounded-full border border-forest-200 bg-white px-4 py-2 font-semibold text-forest-800 hover:border-forest-600">Home</a></li>
          {SERVICE_NAV.map((s) => (
            <li key={s.url}>
              <a href={s.url} className="inline-block rounded-full border border-forest-200 bg-white px-4 py-2 font-semibold text-forest-800 hover:border-forest-600">{s.label}</a>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <PhoneButton className="px-6 py-3" />
          <QuoteButton className="px-6 py-3" />
        </div>
      </div>
    </section>
  );
}
