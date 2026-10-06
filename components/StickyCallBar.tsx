import siteConfig, { phoneHref } from "@/site.config";
import { PhoneIcon } from "./Icons";

/** Fixed click-to-call bar on mobile only. */
export default function StickyCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-[1.4fr_1fr] gap-2 border-t border-forest-800 bg-forest-900/95 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
      <a href={phoneHref()} className="flex items-center justify-center gap-2 rounded-lg bg-bark-500 py-3 font-bold text-white">
        <PhoneIcon className="h-5 w-5" />
        <span className="truncate">Call {siteConfig.phone}</span>
      </a>
      <a href="/contact/" className="flex items-center justify-center rounded-lg bg-white py-3 font-bold text-forest-800">
        Free Quote
      </a>
    </div>
  );
}
