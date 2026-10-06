import siteConfig from "@/site.config";
import { AREA_NAV, GUIDE_NAV, SERVICE_NAV } from "@/lib/pages";
import PhoneButton from "./PhoneButton";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-forest-900 pb-24 text-forest-100 lg:pb-0">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <img
            src="/images/macon-tree-removal-co-logo.webp"
            alt="Macon Tree Removal Co. logo"
            width={480}
            height={480}
            loading="lazy"
            decoding="async"
            className="h-28 w-28 rounded-xl bg-white p-1"
          />
          <p className="mt-4 max-w-xs text-sm leading-relaxed">{siteConfig.footerLine}</p>
          <PhoneButton className="mt-5" />
        </div>
        <div>
          <h2 className="font-display text-lg font-bold uppercase tracking-wide text-white">Services</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {SERVICE_NAV.map((s) => (
              <li key={s.url}><a className="hover:text-white hover:underline" href={s.url}>{s.label}</a></li>
            ))}
            <li><a className="hover:text-white hover:underline" href="/tree-removal-cost/">Tree Removal Cost</a></li>
          </ul>
        </div>
        <div>
          <h2 className="font-display text-lg font-bold uppercase tracking-wide text-white">Service Areas</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {AREA_NAV.map((a) => (
              <li key={a.url}><a className="hover:text-white hover:underline" href={a.url}>{a.label}, GA</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-lg font-bold uppercase tracking-wide text-white">Tree Guides</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {GUIDE_NAV.filter((g) => g.url !== "/tree-removal-cost/").map((g) => (
              <li key={g.url}><a className="hover:text-white hover:underline" href={g.url}>{g.label}</a></li>
            ))}
            <li><a className="hover:text-white hover:underline" href="/contact/">Contact / Free Quote</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-forest-200">
          © {year} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
