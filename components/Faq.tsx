import type { Faq as FaqT } from "@/lib/content";
import { Plus } from "./Icons";

export default function Faq({ faqs }: { faqs: FaqT[] }) {
  return (
    <div className="divide-y divide-forest-100 rounded-2xl border border-forest-100 bg-white">
      {faqs.map((f) => (
        <details key={f.q} className="faq-item group px-5 py-1">
          <summary className="flex items-start justify-between gap-4 py-4 text-left font-semibold text-forest-800">
            <h3 className="text-[1.05rem]">{f.q}</h3>
            <span className="faq-icon mt-0.5 shrink-0 rounded-full bg-forest-50 p-1 text-bark-500 transition-transform">
              <Plus className="h-4 w-4" />
            </span>
          </summary>
          <p className="faq-answer pb-4 leading-relaxed text-muted" dangerouslySetInnerHTML={{ __html: f.a }} />
        </details>
      ))}
    </div>
  );
}
