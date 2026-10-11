/**
 * SITE CONFIG — the only file you need to edit for business details.
 *
 * Phone: change `phone` below and it updates everywhere ([PHONE] in
 * content.md, header button, sticky mobile bar, footer, schema, tel: links).
 * Write it the way you want it shown, e.g. "(478) 555-0123".
 * The tel: link is built from the digits automatically.
 */
const siteConfig = {
  name: "Macon Tree Removal Co.",
  domain: "macontreeremovalco.com",
  url: "https://macontreeremovalco.com",

  // ── Phone ─────────────────────────────────────────────────────────────
  phone: "(774) 446-3349",

  // ── Email ──────────────────────────────────────────────────────────────
  // Shown in the footer and added to schema. Leave "" to hide.
  email: "info@macontreeremovalco.com",

  // ── Contact form (Web3Forms) ──────────────────────────────────────────
  // Web3Forms sends submissions to the email address you used to create
  // the access key at https://web3forms.com. Keep this in sync for reference.
  leadEmail: "", // optional note only; leads go to the email on the Web3Forms key
  web3formsAccessKey: "54960a2a-bdb6-4ff5-a2d8-7dd9138dc8e9",
  // Photo uploads need a paid Web3Forms plan. Set true after upgrading.
  formPhotoUploads: false,

  // ── Tracking & verification (leave "" to disable) ─────────────────────
  googleAnalyticsId: "", // GA4 Measurement ID, e.g. "G-XXXXXXXXXX"
  googleSiteVerification: "", // Search Console HTML-tag content value only

  // ── Social profiles (leave "" to hide) ────────────────────────────────
  // Use the profile/page URL, not a link to a single post or reel.
  // Shown as icons in the footer and added to the Organization schema (sameAs).
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61595188109654",
    instagram: "https://www.instagram.com/macontreeremovalco/",
    tiktok: "https://www.tiktok.com/@macon.tree.remova",
  },

  footerLine:
    "Macon Tree Removal Co. connects homeowners with local tree service providers.",

  // Used in Service schema "areaServed"
  areasServed: [
    "Macon, GA",
    "Warner Robins, GA",
    "Perry, GA",
    "Milledgeville, GA",
    "Forsyth, GA",
    "Gray, GA",
    "Byron, GA",
    "Centerville, GA",
  ],
};

export default siteConfig;

/** "+14785550123" from "(478) 555-0123". Empty string if no digits yet. */
export function phoneHref(): string {
  const digits = siteConfig.phone.replace(/\D/g, "");
  if (!digits) return "tel:";
  const e164 = digits.length === 10 ? `+1${digits}` : `+${digits}`;
  return `tel:${e164}`;
}

export function phoneE164(): string {
  return phoneHref().replace("tel:", "");
}
