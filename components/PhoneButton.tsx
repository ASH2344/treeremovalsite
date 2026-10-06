import siteConfig, { phoneHref } from "@/site.config";
import { PhoneIcon } from "./Icons";

export default function PhoneButton({ variant = "solid", className = "" }: { variant?: "solid" | "light" | "outline"; className?: string }) {
  const styles = {
    solid: "bg-bark-500 text-white hover:bg-bark-600",
    light: "bg-white text-forest-800 hover:bg-cream",
    outline: "border-2 border-white/70 text-white hover:bg-white/10",
  }[variant];
  return (
    <a
      href={phoneHref()}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-bold transition-colors ${styles} ${className}`}
    >
      <PhoneIcon className="h-5 w-5 shrink-0" />
      <span>{siteConfig.phone}</span>
    </a>
  );
}

export function QuoteButton({ className = "", variant = "solid" }: { className?: string; variant?: "solid" | "light" }) {
  const styles = variant === "solid" ? "bg-bark-500 text-white hover:bg-bark-600" : "bg-white text-forest-800 hover:bg-cream";
  return (
    <a href="/contact/" className={`inline-flex items-center justify-center rounded-lg px-5 py-2.5 font-bold transition-colors ${styles} ${className}`}>
      Get a Free Quote
    </a>
  );
}
