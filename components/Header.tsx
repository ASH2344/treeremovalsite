import { AREA_NAV, SERVICE_NAV } from "@/lib/pages";
import PhoneButton from "./PhoneButton";
import { ChevronDown, CloseIcon, MenuIcon } from "./Icons";

function Dropdown({ label, items }: { label: string; items: { url: string; label: string }[] }) {
  return (
    <div className="nav-drop relative">
      <button
        type="button"
        className="flex items-center gap-1 rounded-md px-3 py-2 font-semibold text-forest-800 hover:bg-forest-50"
        aria-haspopup="true"
      >
        {label}
        <ChevronDown />
      </button>
      <div className="nav-menu absolute left-0 top-full z-50 hidden pt-2">
        <ul className="min-w-56 rounded-xl border border-forest-100 bg-white p-2 shadow-xl">
          {items.map((i) => (
            <li key={i.url}>
              <a href={i.url} className="block rounded-lg px-3 py-2 text-ink hover:bg-forest-50 hover:text-forest-700">
                {i.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Header() {
  const services = SERVICE_NAV.map((s) => ({ url: s.url, label: s.label }));
  return (
    <header className="sticky top-0 z-40 border-b border-forest-100 bg-white/95 backdrop-blur">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2">
        Skip to content
      </a>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5">
        <a href="/" className="flex items-center gap-2.5">
          <img src="/images/logo-mark.webp" alt="" width={98} height={112} className="h-11 w-auto" />
          <span className="font-display leading-none text-forest-700">
            <span className="block text-[0.7rem] font-semibold tracking-[0.3em] text-bark-500">MACON</span>
            <span className="block text-xl font-bold uppercase tracking-wide">Tree Removal Co.</span>
          </span>
        </a>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          <Dropdown label="Services" items={services} />
          <Dropdown label="Areas" items={AREA_NAV} />
          <a href="/tree-removal-cost/" className="rounded-md px-3 py-2 font-semibold text-forest-800 hover:bg-forest-50">
            Cost Guide
          </a>
          <a href="/contact/" className="rounded-md px-3 py-2 font-semibold text-forest-800 hover:bg-forest-50">
            Contact
          </a>
          <PhoneButton className="ml-2" />
        </nav>

        {/* Mobile menu: native <details>, no JavaScript */}
        <details className="mobile-nav lg:hidden">
          <summary className="flex h-11 w-11 items-center justify-center rounded-lg border border-forest-100 text-forest-800" aria-label="Open menu">
            <MenuIcon className="menu-open-icon h-6 w-6" />
            <CloseIcon className="menu-close-icon h-6 w-6" />
          </summary>
          <nav aria-label="Mobile" className="absolute inset-x-0 top-full max-h-[80vh] overflow-y-auto border-b border-forest-100 bg-white px-4 pb-6 pt-2 shadow-lg">
            <p className="mt-3 text-xs font-bold uppercase tracking-widest text-bark-500">Services</p>
            <ul className="mt-1 grid grid-cols-1">
              {services.map((s) => (
                <li key={s.url}>
                  <a href={s.url} className="block py-2.5 font-semibold text-forest-800">{s.label}</a>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs font-bold uppercase tracking-widest text-bark-500">Areas</p>
            <ul className="mt-1 grid grid-cols-2">
              {AREA_NAV.map((a) => (
                <li key={a.url}>
                  <a href={a.url} className="block py-2.5 font-semibold text-forest-800">{a.label}</a>
                </li>
              ))}
            </ul>
            <div className="mt-3 border-t border-forest-100 pt-3">
              <a href="/tree-removal-cost/" className="block py-2.5 font-semibold text-forest-800">Cost Guide</a>
              <a href="/contact/" className="block py-2.5 font-semibold text-forest-800">Contact</a>
            </div>
            <PhoneButton className="mt-3 w-full" />
          </nav>
        </details>
      </div>
    </header>
  );
}
